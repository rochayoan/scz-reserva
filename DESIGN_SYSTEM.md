# Design System — SCZ-RESERVA

**Referencia filosófica:** Playtomic. No copiamos su diseño; adoptamos su filosofía visual:
deportivo pero premium, mucho espacio en blanco, pocas sombras, bordes limpios,
tipografía muy legible, color contenido, interacciones elegantes. Objetivo: que se
sienta **software profesional**, no una landing armada con componentes sueltos.

Estos tokens son la **única fuente de verdad**. Ningún componente inventa valores propios.

---

## 1. Color

**Principio: los neutros dominan; el acento se gana su lugar.** En Playtomic el color
aparece poco y por eso pesa. Aquí el esmeralda solo se usa en acción primaria, estado
activo y dato clave. Todo lo demás vive en neutros.

| Rol | Token | Por qué |
|---|---|---|
| Ink (títulos) | `slate-900` | Casi-negro, no `#000` puro: más suave y premium, menos "alto contraste de plantilla". |
| Texto cuerpo | `slate-600` | Legible sin competir con los títulos. |
| Texto mudo | `slate-400` | Metadata, placeholders. |
| Borde | `slate-200` | Hairline de 1px: en este sistema los **bordes definen la estructura**, no las sombras. |
| Divisor | `slate-100` | Separadores internos aún más sutiles. |
| Superficie | `white` / sutil `slate-50` | Card vs fondo se distinguen por borde + tono, no por sombra. |
| Acento primario | `emerald-600` (hover `emerald-700`) | Único color "de marca" con presencia; reservado a acciones/estados. |
| Acento tint | `emerald-50` | Fondos de íconos-feature y chips activos, en dosis bajas. |
| Rating / warning | `amber-500` | Semántico, no decorativo. |
| Destructivo | `red-500` | Solo errores/eliminar. |

Dark mode: `white→slate-950` (fondo), `slate-900→slate-100` (ink), bordes `slate-800`,
tints `emerald-950/30`.

**Regla dura:** se elimina el gradiente esmeralda→slate de borde a borde y toda sombra
teñida de color. El gradiente queda permitido en **un máximo de dos lugares** (Hero y CTA final).

---

## 2. Tipografía

**Principio: jerarquía por tamaño y espacio, no por peso.** El abuso de `font-black`
aplana la jerarquía y delata el origen "auto-generado". Inter, muy legible, line-height
generoso.

| Estilo | Tamaño | Peso | Uso |
|---|---|---|---|
| Display | `text-4xl md:text-5xl` tracking-tight | `font-bold` | Solo H1 del Hero. (Reducido: Playtomic es seguro, no gigante.) |
| Section title | `text-2xl md:text-3xl` | `font-bold` | Título de sección. |
| Card title | `text-base md:text-lg` | `font-semibold` | Nombre de cancha, título de card. |
| Eyebrow | `text-xs` uppercase tracking-wider | `font-semibold` emerald-600 | El `SectionLabel`. |
| Body | `text-base` leading-relaxed | `font-normal` slate-600 | Párrafos. |
| Small | `text-sm` | `font-normal` | Metadata secundaria. |
| Caption | `text-xs` | `font-medium` slate-400 | Etiquetas, ayudas. |
| Dato / precio | `text-2xl md:text-3xl` tabular-nums | `font-semibold` | KPIs, precios. |

**Pesos permitidos:** `normal · medium · semibold · bold`. Se **eliminan** `extrabold`
y `black` de toda la app.

---

## 3. Espaciado

**Principio: el espacio en blanco es la firma del sistema.** Base **4px**.
Escala: `4 · 8 · 12 · 16 · 24 · 32 · 40 · 56 · 80 · 120`.

- **Ritmo vertical de sección:** `py-20 md:py-28` (más generoso que hoy — calma premium).
- **Padding de card:** `p-6` (estándar), `p-8` (espacioso).
- **Contenedor:** `max-w-7xl mx-auto px-5 md:px-8`.
- **Gap de grids:** `gap-6`.

Por qué: márgenes amplios y consistentes producen sensación de producto cuidado;
el apiñamiento es lo que hace ver "landing genérica".

---

## 4. Radios

**Principio: moderado y consistente = se ve diseñado por ingeniería, no inflado.**
Se eliminan `rounded-3xl` y `rounded-[2rem]`.

| Token | Valor | Uso |
|---|---|---|
| `rounded-lg` | 8px | Chips, time-slots. |
| `rounded-xl` | 12px | Botones, inputs, selects. |
| `rounded-2xl` | 16px | Cards, contenedores. |
| `rounded-full` | — | Pills, badges, avatares. |

---

## 5. Sombras

**Principio: casi ninguna.** Es el movimiento más "Playtomic" del sistema: la estructura
la dan los **bordes de 1px y el espacio**, no las sombras. Se eliminan `shadow-2xl` y
todas las `shadow-emerald-*`.

| Nivel | Token | Uso |
|---|---|---|
| Reposo | *(sin sombra)* | Cards y contenedores: solo borde. |
| e1 | `shadow-xs` | Elementos que flotan sobre contenido: header sticky, dropdown. |
| e2 | `shadow-sm` | Hover sutil de card interactiva (opcional). |
| e3 | `shadow-md` | Solo overlays reales: modal, bottom-sheet. |

Por qué: las sombras pesadas y de color son el sello de las plantillas; su ausencia
lee como interfaz profesional y plana.

---

## 6. Iconografía

**Principio: un set SVG coherente reemplaza TODO emoji funcional** (🔎⚽💳📊⭐📍▾🏟️).
Librería: **lucide-react** (geométrica, stroke uniforme, mismo lenguaje que software pro).

| Tamaño | Uso |
|---|---|
| 16 (`h-4 w-4`) | Íconos inline en texto (pin de zona, estrella). |
| 20 (`h-5 w-5`) | Íconos de UI (búsqueda, chevron, acciones). |
| 24 (`h-6 w-6`) | Íconos destacados. |
| Contenedor feature | `h-12 w-12 rounded-2xl bg-emerald-50` con ícono 24 | Único tamaño de contenedor (hoy hay h-8/9/11/12/14). |

Stroke `1.75`, color `currentColor` (heredan del texto → coherencia automática con dark mode).

---

## 7. Botones

| Aspecto | Definición | Por qué |
|---|---|---|
| Variantes | `primary` (emerald sólido) · `secondary` (blanco + borde slate-200) · `ghost` (transparente→slate-50) · `link` | Una sola primaria por vista; el resto, jerarquía descendente. |
| Tamaños | `sm` h-9 px-4 · `md` h-10 px-5 · `lg` h-12 px-6 | Alturas fijas → alinean con inputs. |
| Forma | `rounded-xl`, `font-semibold` | Sin `font-black`. |
| Interacción | `transition` 150ms ease-out, hover = cambio de fondo, `active:scale-[0.99]`, `focus-visible` ring | Táctil y accesible, sin glow. |

Se **retira `animate-pulse-glow`** como estilo por defecto.

---

## 8. Inputs

- Altura `h-10`/`h-11`, `rounded-xl`, `border-slate-200`, `bg-white`, `text-sm`, placeholder `slate-400`.
- Focus: `border-emerald-500` + `ring-2 ring-emerald-500/15`.
- Selects con **chevron lucide** (no ▾), misma altura/radio que botones e inputs.

Por qué: misma altura y radio en botón + input + select hace que se lean como **un solo kit**.

---

## 9. Cards

- `bg-white border border-slate-200 rounded-2xl p-6`, **sin sombra en reposo**.
- Hover (si es interactiva): `border-slate-300` + `shadow-sm`, 150ms.
- Dark: `bg-slate-900 border-slate-800`.

Por qué: borde sobre sombra = la planitud limpia de Playtomic + protagonismo del blanco.
Una sola definición de card en toda la app (el Panel Admin abandona su `border-0 shadow-md`).

---

## 10. Animaciones

| Aspecto | Definición |
|---|---|
| Duraciones | 150ms (micro/hover) · 200ms (controles) · 300ms (layout/dark mode). |
| Easing | `ease-out`. |
| Entrada | `fade-in-up` sutil, una vez por sección. |
| Hover | Cambios de color/borde/opacidad; translate mínimo. |
| Retiradas | `pulse-glow` y `float` como decoración recurrente (a lo sumo `float` en un único elemento del Hero). |

Por qué: movimiento escaso y suave = elegante; las animaciones llamativas leen como gimmick.

---

## Aplicación

1. Codificar tokens en `src/index.css` (`@theme`) + este documento como referencia viva.
2. Robustecer `src/components/ui.jsx` (Button con `size`, Input, Select, Icon; Card/SectionTitle ajustados).
3. Migrar pantalla por pantalla (Hero → filtros → cards → panel → mobile), cada una respetando estos tokens.
