# Base de datos — SCZ-RESERVA

Esquema PostgreSQL versionado para el SaaS de reservas. Diseñado para Supabase
(Postgres gestionado + Auth + RLS). **Todavía no está conectado a la app**: estos
archivos solo definen y versionan la base de datos.

## Estructura

```
supabase/
├── migrations/                         # Esquema, en orden de ejecución
│   ├── 20260623000001_extensions.sql       # pgcrypto, btree_gist
│   ├── 20260623000002_enums.sql            # tipos enum del dominio
│   ├── 20260623000003_core_tenancy.sql     # organizations, profiles, memberships
│   ├── 20260623000004_venues_courts.sql    # venues, courts, court_operating_hours
│   ├── 20260623000005_reservations.sql     # reservations + anti-doble-reserva
│   ├── 20260623000006_functions_triggers.sql # updated_at, alta de perfil, RLS helper, validación de horario
│   └── 20260623000007_rls_policies.sql     # Row Level Security
├── seed.sql                            # datos demo (derivados de src/data.js)
└── tests/
    └── double_booking_test.sql         # prueba del anti-doble-reserva
```

## Orden de ejecución

El prefijo timestamp del nombre garantiza que el orden alfabético coincide con
el orden de dependencias:

1. `extensions` → habilita `btree_gist` (necesario para el exclusion constraint).
2. `enums` → tipos usados por las tablas.
3. `core_tenancy` → `organizations`, `profiles`, `memberships`.
4. `venues_courts` → complejos, canchas y horarios (FKs compuestas de tenant).
5. `reservations` → reservas + exclusion constraint anti-doble-reserva.
6. `functions_triggers` → triggers de `updated_at`, alta de perfil, `auth_org_ids()`, validación de horario.
7. `rls_policies` → activa RLS y define las políticas por tenant.

`seed.sql` se aplica **al final** y solo en desarrollo.

### Cómo aplicar (cuando se conecte Supabase, en una fase posterior)

- **Supabase CLI:** `supabase db reset` aplica todas las migraciones en orden y
  luego ejecuta `seed.sql`.
- **SQL editor del dashboard:** pegar y ejecutar cada archivo de `migrations/` en
  orden, y opcionalmente `seed.sql`.

> Nota: la migración `core_tenancy` referencia `auth.users` y `functions_triggers`
> crea un trigger sobre `auth.users`; por eso el esquema asume un proyecto
> Supabase (no un Postgres vacío sin el esquema `auth`).

## Anti-doble-reserva

La garantía vive en la base, no en la app:

```sql
exclude using gist (court_id with =, during with &&)
  where (status in ('pending', 'confirmed'))
```

`during` es una columna generada `tstzrange(starts_at, ends_at, '[)')`. Dos
reservas activas sobre la misma cancha con ventanas solapadas son rechazadas
atómicamente, incluso con dos clientes reservando a la vez. Ver
`tests/double_booking_test.sql` para la verificación paso a paso.
```
