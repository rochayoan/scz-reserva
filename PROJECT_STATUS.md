# PROJECT_STATUS.md — SCZ-RESERVA

> Documento de control del proyecto. Lo mantiene el rol **Tech Lead + Product Designer**.
> Se actualiza al cierre de cada tarea. Fuente de verdad de "dónde estamos".
> Última actualización: 2026-06-26 (cierre F5 — Fase F completa).

---

## 1. Estado general por área

| Área | % | Notas |
|---|---|---|
| Infraestructura (Supabase, migraciones, RLS, anti-doble-reserva) | 100% | Esquema completo y verificado. |
| Base de datos | 100% | 7 tablas + RLS + GiST anti-solape. |
| Frontend (estructura, componentes, data layer) | 100% | Toda la app migrada al Design System, auditada en mobile y con contraste WCAG AA verificado. |
| Design System | 100% | Fase F cerrada: tokens, componentes, mobile y contraste/color completos. |
| Backend propio | N/A | Decisión: sin backend, Supabase cumple ese rol. |
| Reservas reales | 0% | `BookingFlow` sigue simulado con `setTimeout` (solo visual migrado). |
| Autenticación | 0% | Pendiente Fase I. |
| Panel propietario | 35% | UI ya en el DS, pero sigue leyendo datos mock sin filtrar por organización real. |
| Deploy | 20% | Proyecto Vercel vinculado, sin deploy de versión actual. |
| Demo comercial | 100% (visual) | Lista para presentación; pendiente solo Fase G (deploy) y fases funcionales (H–K). |

---

## 2. Fase actual

**Fase F — Pulido UX/UI: ✅ COMPLETA.**

Sub-áreas de la fase: Marketing · Admin · Booking · Mobile · Ajustes visuales — las 5 cerradas.

A la espera de aprobación del usuario para avanzar a **Fase G — Deploy Demo**.

---

## 3. Roadmap general (orden aprobado)

| Fase | Nombre | Estado |
|---|---|---|
| **F** | **Pulido UX/UI** | ✅ Completa |
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
- ✅ **F5 — Pase final de color, contraste y limpieza CSS**: auditoría con axe-core (WCAG AA) en light/dark detectó 76 nodos con contraste insuficiente; corregidos a 2 (chrome decorativo del mockup del Hero, dejado tenue a propósito). Botones primarios y estados seleccionados `emerald-600`→`emerald-700` (3.77:1 → 5.48:1), `SectionLabel`/textos verdes importantes a `emerald-700` en light, `text-slate-400`→`text-slate-500` en texto secundario real, 2 bugs de dirección invertida en dark mode corregidos (Footer, badge de paso en HowItWorks), números de rating a `slate` dejando solo la estrella en ámbar. Eliminado CSS sin uso: `.glass`, `.animate-float`, `@keyframes float/shimmer/pulse-glow` — commit `ae8edd5`.

---

## 5. Tareas pendientes (Fase F) — desglose

| ID | Tarea | Sub-área | Estimación | Depende de |
|---|---|---|---|---|
| F1 | ✅ ~~Migrar 5 secciones de marketing al DS~~ | Marketing | 2–3h | — |
| F2 | ✅ ~~Migrar `BookingFlow.jsx` al DS~~ | Booking | 2h | F1 |
| F3 | ✅ ~~Migrar `AdminPanel.jsx` al DS~~ | Admin | 2h | F1 |
| F4 | ✅ ~~Auditoría responsive/mobile + Header/Footer al DS~~ | Mobile | 2h | F1, F2, F3 |
| F5 | ✅ ~~Pase final de color, contraste y limpieza CSS~~ | Ajustes visuales | 1–2h | F1–F4 |

---

## 6. Próxima tarea recomendada

**Fase G — Deploy Demo** (pendiente de tu aprobación para iniciar).

**Por qué Fase G es lo siguiente:**
1. **Fase F está 100% completa**: Design System migrado en las 5 sub-áreas (Marketing, Booking, Admin, Mobile, Color/Contraste). Cero emoji, cero `font-black`, tap targets ≥44px, contraste WCAG AA verificado con axe-core (76 violaciones → 2 intencionales y decorativas).
2. El proyecto ya tiene un proyecto Vercel vinculado (`prj_p2N3mLPr3iaBjfOGK1QndmRCASAx`) pero sin deploy de la versión actual ni env vars de Supabase configuradas ahí — es trabajo de infraestructura, no de diseño.
3. Antes de avanzar, según tus reglas, debo presentar el plan de Fase G (archivos/pasos) y esperar tu aprobación explícita — no se avanza de fase sin ese visto bueno.

---

## 7. Riesgos / deuda técnica

- 2 elementos de chrome decorativo en `HeroPreview.jsx` (barra de URL falsa y placeholder de búsqueda del mockup) quedan por debajo de AA (2.63:1) a propósito — son ilustrativos, no contenido real.
- `BookingFlow.jsx` simula la reserva con `setTimeout` (no es deuda de F, es alcance de Fase H — reservas reales).
- `AdminPanel.jsx` lee datos mock, sin filtrar por organización real (Fase J).
- Deploy: env vars de Supabase aún no configuradas en Vercel (Fase G).

---

## 8. Últimos commits importantes

| Hash | Mensaje |
|---|---|
| `ae8edd5` | polish: final color/contrast pass and unused CSS cleanup |
| `d43e6b2` | polish: mobile audit fixes and header/footer design system cleanup |
| `f5552e7` | polish: migrate admin panel to design system |
| `c63adee` | polish: migrate booking flow to design system |
| `a809d07` | polish: migrate marketing sections to design system |
| `057e7ab` | polish: migrate court list and filters to design system |
| `52d50d6` | polish: redesign hero with product preview |
| `3f9bbcf` | feat: establish design system foundation |
| `29a6874` | polish: improve demo presentation |
| `bfae74a` | refactor: make courts loading async |
