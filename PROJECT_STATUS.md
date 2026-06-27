# PROJECT_STATUS.md — SCZ-RESERVA

> Documento de control del proyecto. Lo mantiene el rol **Tech Lead + Product Designer**.
> Se actualiza al cierre de cada tarea. Fuente de verdad de "dónde estamos".
> Última actualización: 2026-06-26 (cierre F2).

---

## 1. Estado general por área

| Área | % | Notas |
|---|---|---|
| Infraestructura (Supabase, migraciones, RLS, anti-doble-reserva) | 100% | Esquema completo y verificado. |
| Base de datos | 100% | 7 tablas + RLS + GiST anti-solape. |
| Frontend (estructura, componentes, data layer) | 95% | Hero + Canchas + Marketing + Booking ya en Design System. |
| Design System | 88% | Fundación + Hero + Canchas + Marketing + Booking migrados; falta Admin. |
| Backend propio | N/A | Decisión: sin backend, Supabase cumple ese rol. |
| Reservas reales | 0% | `BookingFlow` sigue simulado con `setTimeout` (solo visual migrado). |
| Autenticación | 0% | Pendiente Fase I. |
| Panel propietario | 30% | UI mock, sin datos reales por organización. |
| Deploy | 20% | Proyecto Vercel vinculado, sin deploy de versión actual. |
| Demo comercial | 95% | Falta unificar visual de Admin. |

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

---

## 5. Tareas pendientes (Fase F) — desglose

| ID | Tarea | Sub-área | Estimación | Depende de |
|---|---|---|---|---|
| F1 | ✅ ~~Migrar 5 secciones de marketing al DS~~ | Marketing | 2–3h | — |
| F2 | ✅ ~~Migrar `BookingFlow.jsx` al DS~~ | Booking | 2h | F1 |
| **F3** | Migrar `AdminPanel.jsx` al DS (emoji→lucide, KPIs, tabla) | Admin | 2h | F1 |
| **F4** | Pasada responsive/mobile sobre todas las secciones ya migradas | Mobile | 2h | F1, F2, F3 |
| **F5** | Ajustes visuales / pase de color (lo lidera el usuario) | Ajustes visuales | 1–2h | F1–F4 |

---

## 6. Próxima tarea recomendada

**F3 — Migrar `AdminPanel.jsx` al Design System.**

**Por qué F3 sigue:**
1. Con Marketing y Booking ya migrados, `AdminPanel` es la **última sección visible con estilo viejo** (emoji, KPIs, tabla) — cierra la consistencia visual completa de la demo.
2. Es el componente más complejo de los tres restantes (KPIs + tabla de reservas), conviene resolverlo antes de F4 para auditar responsive una sola vez con todo ya en el DS.
3. Tras F3 no quedará ninguna sección con emoji/`font-black`, dejando F4 (mobile) y F5 (color) como cierre puro de pulido, sin mezclarlos con migración de markup.

**Por qué F5 (color) sigue al final:** si cambias colores antes de terminar de migrar (Admin), hay que retocar archivo por archivo. Migrando primero, el cambio se centraliza en `index.css`/`ui.jsx`.

---

## 7. Riesgos / deuda técnica

- `AdminPanel.jsx` aún con emoji/estilo viejo — pendiente F3. Es la última inconsistencia visual transitoria que queda en la demo.
- `animate-pulse-glow` (keyframe en `index.css`) quedó sin uso tras quitarlo del botón de confirmar en `BookingFlow`. No se limpia todavía (fuera de alcance F2, indicado explícitamente por el usuario); revisar en F5.
- `BookingFlow.jsx` simula la reserva con `setTimeout` (no es deuda de F, es alcance de Fase H — reservas reales).
- `AdminPanel.jsx` lee datos mock, sin filtrar por organización real (Fase J).
- Deploy: env vars de Supabase aún no configuradas en Vercel (Fase G).

---

## 8. Últimos commits importantes

| Hash | Mensaje |
|---|---|
| `c63adee` | polish: migrate booking flow to design system |
| `a809d07` | polish: migrate marketing sections to design system |
| `057e7ab` | polish: migrate court list and filters to design system |
| `52d50d6` | polish: redesign hero with product preview |
| `3f9bbcf` | feat: establish design system foundation |
| `29a6874` | polish: improve demo presentation |
| `bfae74a` | refactor: make courts loading async |
