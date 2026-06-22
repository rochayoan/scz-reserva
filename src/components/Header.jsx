import { useState } from "react";
import { Button } from "./ui";

export default function Header({ dark, setDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Inicio", href: "#inicio" },
    { label: "Canchas", href: "#canchas" },
    { label: "Cómo funciona", href: "#funciona" },
    { label: "Complejos", href: "#duenos" },
    { label: "Panel", href: "#panel" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-transform group-hover:scale-105">
            <span className="text-lg">⚽</span>
          </div>
          <div>
            <p className="text-xl font-black tracking-tight leading-tight">SCZ-RESERVA</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Reservas deportivas</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="flex h-10 w-[4.25rem] items-center rounded-full bg-slate-100 p-1 transition-colors dark:bg-slate-800 cursor-pointer"
            aria-label="Cambiar modo claro u oscuro"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 dark:bg-slate-600 ${
                dark ? "translate-x-[1.5rem]" : "translate-x-0"
              }`}
            >
              {dark ? "🌙" : "☀️"}
            </span>
          </button>

          {/* Login Button */}
          <Button variant="ghost" className="hidden md:inline-flex rounded-2xl text-sm">
            Iniciar sesión
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            aria-label="Abrir menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 dark:border-slate-800 dark:bg-slate-950 md:hidden animate-fade-in-up">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
            <Button variant="ghost" className="mt-2 w-full rounded-2xl text-sm">
              Iniciar sesión
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
