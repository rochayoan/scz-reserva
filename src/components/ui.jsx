// Componentes base — ver DESIGN_SYSTEM.md. Ningun componente de pantalla debe
// definir color/radio/sombra/tipografia por su cuenta: todo pasa por aqui.

export function Button({ children, className = "", variant = "solid", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl h-11 px-5 text-sm font-semibold transition-all duration-150 ease-out active:scale-[0.99] cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40";
  const variants = {
    solid: "bg-emerald-700 text-white hover:bg-emerald-800",
    white: "bg-white text-emerald-700 hover:bg-emerald-50",
    outline:
      "border border-slate-200 bg-transparent hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
    ghost: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
  };

  return (
    <button className={`${base} ${variants[variant] || variants.solid} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", hover = false, ...props }) {
  const base =
    "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden";
  const hoverClass = hover
    ? "transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:hover:border-slate-700"
    : "";

  return (
    <div className={`${base} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function Badge({ children, className = "", variant = "default" }) {
  const variants = {
    default: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    sport: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    popular: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    status: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }) {
  return (
    <p className="font-semibold text-emerald-700 text-xs tracking-wider uppercase dark:text-emerald-400">
      {children}
    </p>
  );
}

export function SectionTitle({ children, className = "" }) {
  return <h2 className={`text-2xl font-bold md:text-3xl ${className}`}>{children}</h2>;
}

// SegmentedControl: selector horizontal de opciones mutuamente excluyentes
// (Playtomic-style). Controlado: el padre maneja `value` y `onChange`.
// Usado en el Hero (deportes) y en los filtros de CourtList.
export function SegmentedControl({ options, value, onChange, className = "" }) {
  return (
    <div
      className={`inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition-all duration-150 ease-out cursor-pointer ${
            value === opt
              ? "bg-emerald-700 text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// Icon: wrapper minimo sobre lucide-react para que todo icono de la app pase
// por un unico tamano estandar (16/20/24, ver DESIGN_SYSTEM.md seccion 6).
// Todavia sin uso en pantallas — se adopta al migrar Hero/Filtros/Cards/Panel.
const ICON_SIZES = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export function Icon({ icon: LucideIcon, size = "md", className = "", ...props }) {
  return (
    <LucideIcon
      className={`${ICON_SIZES[size] || ICON_SIZES.md} ${className}`}
      strokeWidth={1.75}
      {...props}
    />
  );
}
