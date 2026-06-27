import { useState } from "react";
import { Link } from "react-router-dom";
import { Goal, Moon, Sun, Menu, X, LogIn } from "lucide-react";
import { Button } from "../ui";

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
            <Goal className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight leading-tight">SCZ-RESERVA</p>
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
          {/* Soy dueño */}
          <Link
            to="/admin/login"
            className="hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            <LogIn className="h-4 w-4" strokeWidth={1.75} />
            Soy dueño
          </Link>
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
              {dark ? (
                <Moon className="h-4 w-4 text-slate-200" strokeWidth={1.75} />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" strokeWidth={1.75} />
              )}
            </span>
          </button>

          {/* Reservar ahora */}
          <Button>
            Reservar ahora
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={2} />
            )}
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
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <LogIn className="h-4 w-4" strokeWidth={1.75} />
              Soy dueño
            </Link>
            <Button className="mt-2 w-full text-sm">
              Reservar ahora
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
