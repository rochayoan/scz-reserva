# PROJECT_STATUS.md — SCZ-RESERVA

> Documento de control del proyecto. Lo mantiene el rol **Tech Lead + Product Designer**.
> Se actualiza al cierre de cada tarea. Fuente de verdad de "dónde estamos".
> Última actualización: 2026-06-26 (cierre F1).

---

## 1. Estado general por área

| Área | % | Notas |
|---|---|---|
| Infraestructura (Supabase, migraciones, RLS, anti-doble-reserva) | 100% | Esquema completo y verificado. |
| Base de datos | 100% | 7 tablas + RLS + GiST anti-solape. |
| Frontend (estructura, componentes, data layer) | 94% | Hero + Canchas + Marketing ya en Design System. |
| Design System | 82% | Fundación + Hero + Canchas + Marketing migrados; faltan Booking y Admin. |
| Backend propio | N/A | Decisión: sin backend, Supabase cumple ese rol. |
| Reservas reales | 0% | `BookingFlow` simulado con `setTimeout`. |
| Autenticación | 0% | Pendiente Fase I. |
| Panel propietario | 30% | UI mock, sin datos reales por organización. |
| Deploy | 20% | Proyecto Vercel vinculado, sin deploy de versión actual. |
| Demo comercial | 93% | Falta unificar visual de Booking y Admin. |

---

## 2. Fase actual

**Fase F — Pulido UX/UI** (en curso).

Sub-áreas de la fase: Marketing · Admin · Booking · Mobile · Ajustes visuales.

---

## 3. Roadmap general (orden aprobado)

| Fase | Nombre | Estado |
|---|---|---|
| **F** | **Pulido UX/UI** | 🟡 En curso |
| G | Deploy Demo | ⬜ Pendiente |
| H | Reservas reales | ⬜ Pendiente |
| I | Autenticación | ⬜ Pendiente |
| J | Panel propietario | ⬜ Pendiente |
| K | SaaS Multi-tenant | ⬜ Pendiente |

> Regla: no se avanza de fase sin aprobación explícita del usuario.

---

## 4. Tareas completadas (Fase F)

- ✅ Fundación del Design System — tokens (`index.css`), componentes base (`ui.jsx`), `DESIGN_SYSTEM.md` — commit `3f9bbcf`.
- ✅ Hero rediseñado con product preview desacoplado — commit `52d50d6`.
- ✅ CourtList (filtros + cards) migrado al DS + `SegmentedControl` extraído — commit `057e7ab`.
- ✅ **F1 — 5 secciones de marketing migradas al DS** (ProblemSection, SolutionSection, HowItWorks, BenefitsSection, CTASection): emoji → iconos lucide, `font-black` → `font-bold`, fix de bug de animación escalonada, `CTASection` con `rounded-3xl` y botones sin override de radio — commit pendiente de hash (ver punto 8 tras commit).

---

## 5. Tareas pendientes (Fase F) — desglose

| ID | Tarea | Sub-área | Estimación | Depende de |
|---|---|---|---|---|
| F1 | ✅ ~~Migrar 5 secciones de marketing al DS~~ | Marketing | 2–3h | — |
| **F2** | Migrar `BookingFlow.jsx` al DS (solo visual; sigue simulado) | Booking | 2h | F1 |
| **F3** | Migrar `AdminPanel.jsx` al DS (emoji→lucide, KPIs, tabla) | Admin | 2h | F1 |
| **F4** | Pasada responsive/mobile sobre todas las secciones ya migradas | Mobile | 2h | F1, F2, F3 |
| **F5** | Ajustes visuales / pase de color (lo lidera el usuario) | Ajustes visuales | 1–2h | F1–F4 |

---

## 6. Próxima tarea recomendada

**F2 — Migrar `BookingFlow.jsx` al Design System.**

**Por qué F2 sigue:**
1. Con Marketing ya migrado, `BookingFlow` (debajo de CourtList) es ahora el siguiente quiebre visual visible en el scroll.
2. Es solo visual — no se toca la simulación de reserva (`setTimeout`), eso es alcance de Fase H.
3. Conviene resolverlo antes de F4 (mobile), para auditar responsive una sola vez con todo el flujo de reserva ya en el DS.

**Por qué F5 (color) sigue al final:** si cambias colores antes de migrar lo que falta (Booking, Admin), hay que retocar archivo por archivo. Migrando primero, el cambio se centraliza en `index.css`/`ui.jsx`.

---

## 7. Riesgos / deuda técnica

- `BookingFlow.jsx` y `AdminPanel.jsx` aún con emoji/estilo viejo — pendientes F2/F3. Mientras tanto hay inconsistencia visual transitoria entre secciones migradas y no migradas.
- `BookingFlow.jsx` simula la reserva con `setTimeout` (no es deuda de F, es alcance de Fase H — reservas reales).
- `AdminPanel.jsx` lee datos mock, sin filtrar por organización real (Fase J).
- Deploy: env vars de Supabase aún no configuradas en Vercel (Fase G).

---

## 8. Últimos commits importantes

| Hash | Mensaje |
|---|---|
| `057e7ab` | polish: migrate court list and filters to design system |
| `52d50d6` | polish: redesign hero with product preview |
| `3f9bbcf` | feat: establish design system foundation |
| `29a6874` | polish: improve demo presentation |
| `bfae74a` | refactor: make courts loading async |
