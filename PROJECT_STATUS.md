# PROJECT_STATUS.md — SCZ-RESERVA

> Documento de control del proyecto. Lo mantiene el rol **Tech Lead + Product Designer**.
> Se actualiza al cierre de cada tarea. Fuente de verdad de "dónde estamos".
> Última actualización: 2026-06-26 (cierre F4).

---

## 1. Estado general por área

| Área | % | Notas |
|---|---|---|
| Infraestructura (Supabase, migraciones, RLS, anti-doble-reserva) | 100% | Esquema completo y verificado. |
| Base de datos | 100% | 7 tablas + RLS + GiST anti-solape. |
| Frontend (estructura, componentes, data layer) | 98% | Hero + Canchas + Marketing + Booking + Admin + Header/Footer ya en Design System. |
| Design System | 98% | Toda la app (incluyendo layout) migrada y auditada en mobile; solo falta el pase de color (F5). |
| Backend propio | N/A | Decisión: sin backend, Supabase cumple ese rol. |
| Reservas reales | 0% | `BookingFlow` sigue simulado con `setTimeout` (solo visual migrado). |
| Autenticación | 0% | Pendiente Fase I. |
| Panel propietario | 35% | UI ya en el DS, pero sigue leyendo datos mock sin filtrar por organización real. |
| Deploy | 20% | Proyecto Vercel vinculado, sin deploy de versión actual. |
| Demo comercial | 98% | Solo falta el ajuste de color que lidera el usuario (F5). |

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
- ✅ **F1 — 5 secciones de marketing migradas al DS** (ProblemSection, SolutionSection, HowItWorks, BenefitsSection, CTASection): emoji → iconos lucide, `font-black` → `font-bold`, fix de bug de animación escalonada, `CTASection` con `rounded-3xl` y botones sin override de radio — commit `a809d07`.
- ✅ **F2 — `BookingFlow.jsx` migrado al DS**: emoji/SVG manual → lucide (`MapPin`, `Star`, `Check`, `QrCode`, `CheckCircle2`), `font-black` → `font-bold`/`semibold`, horarios y botón confirmar al radio/borde del DS, se quitó `animate-pulse-glow`. Lógica de `bookingStep`/`bookingDone`/`handleConfirm`/timers intacta — commit `c63adee`.
- ✅ **F3 — `AdminPanel.jsx` migrado al DS**: emoji → lucide (`Wallet`, `CalendarCheck`, `Gauge`, `Inbox`, `ArrowRight`), KPI cards y tabla sin overrides de sombra/borde (usan `Card` del DS), cabecera de tabla estilo "SaaS" (`uppercase tracking-wider`), badges de pago/estado con punto de color, barra de progreso ahora lee un valor explícito en vez de comparar por texto del label. `getAdminReservations()` y sus datos intactos — commit `f5552e7`.
- ✅ **F4 — Auditoría mobile + Header/Footer al DS**: fade de scroll horizontal en la tabla del Panel, tap targets de `SegmentedControl` y horarios de `BookingFlow` subidos a 44px mínimo, stats del Hero a `grid-cols-3` para que no queden desbalanceados en mobile, Header/Footer con emoji → lucide (`Goal`, `Moon`, `Sun`, `Menu`, `X`, `Heart`) y `font-black` → `font-bold`. Lógica de dark mode y menú mobile intacta — commit `d43e6b2`.

---

## 5. Tareas pendientes (Fase F) — desglose

| ID | Tarea | Sub-área | Estimación | Depende de |
|---|---|---|---|---|
| F1 | ✅ ~~Migrar 5 secciones de marketing al DS~~ | Marketing | 2–3h | — |
| F2 | ✅ ~~Migrar `BookingFlow.jsx` al DS~~ | Booking | 2h | F1 |
| F3 | ✅ ~~Migrar `AdminPanel.jsx` al DS~~ | Admin | 2h | F1 |
| F4 | ✅ ~~Auditoría responsive/mobile + Header/Footer al DS~~ | Mobile | 2h | F1, F2, F3 |
| **F5** | Ajustes visuales / pase de color (lo lidera el usuario) | Ajustes visuales | 1–2h | F1–F4 |

---

## 6. Próxima tarea recomendada

**F5 — Ajustes visuales / pase de color (liderado por el usuario).**

**Por qué F5 es lo único que queda en Fase F:**
1. **Toda la app está migrada y auditada en mobile** — Hero, Canchas, Marketing, Booking, Admin, Header y Footer. Cero emoji, cero `font-black`, tap targets a 44px, sin scroll horizontal sin avisar.
2. Con todo apoyado en tokens del DS (`index.css`/`ui.jsx`), tu cambio de color es una edición centralizada que se propaga a toda la app — exactamente la razón por la que se dejó al final.
3. Tras F5, Fase F queda cerrada por completo y el proyecto puede avanzar a **Fase G — Deploy Demo** (requiere tu aprobación explícita para avanzar de fase).

---

## 7. Riesgos / deuda técnica

- `animate-pulse-glow` (keyframe en `index.css`) quedó sin uso tras quitarlo del botón de confirmar en `BookingFlow`. No se limpia todavía (fuera de alcance F2, indicado explícitamente por el usuario); revisar en F5.
- `BookingFlow.jsx` simula la reserva con `setTimeout` (no es deuda de F, es alcance de Fase H — reservas reales).
- `AdminPanel.jsx` lee datos mock, sin filtrar por organización real (Fase J).
- Deploy: env vars de Supabase aún no configuradas en Vercel (Fase G).

---

## 8. Últimos commits importantes

| Hash | Mensaje |
|---|---|
| `d43e6b2` | polish: mobile audit fixes and header/footer design system cleanup |
| `f5552e7` | polish: migrate admin panel to design system |
| `c63adee` | polish: migrate booking flow to design system |
| `a809d07` | polish: migrate marketing sections to design system |
| `057e7ab` | polish: migrate court list and filters to design system |
| `52d50d6` | polish: redesign hero with product preview |
| `3f9bbcf` | feat: establish design system foundation |
| `29a6874` | polish: improve demo presentation |
| `bfae74a` | refactor: make courts loading async |
