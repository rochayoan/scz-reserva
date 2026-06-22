export function Button({ children, className = "", variant = "solid", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer select-none";
  const variants = {
    solid: "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20",
    white: "bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-xl hover:shadow-white/20",
    outline:
      "border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
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
    "rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden";
  const hoverClass = hover
    ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-600/5"
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
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }) {
  return <p className="font-bold text-emerald-600 text-sm tracking-wide uppercase">{children}</p>;
}

export function SectionTitle({ children, className = "" }) {
  return <h2 className={`text-3xl font-black md:text-4xl tracking-tight ${className}`}>{children}</h2>;
}
