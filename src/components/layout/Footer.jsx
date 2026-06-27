import { Goal, Heart } from "lucide-react";
import { Button } from "../ui";

export default function Footer() {
  const links = {
    Plataforma: ["Buscar canchas", "Cómo funciona", "Precios", "FAQ"],
    "Para complejos": ["Registrar complejo", "Panel admin", "Planes", "Soporte"],
    Legal: ["Términos de uso", "Privacidad", "Cookies"],
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-600/25">
                <Goal className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">SCZ-RESERVA</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reservas deportivas</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Marketplace de reservas deportivas para Santa Cruz de la Sierra. Fútbol, pádel y tenis en un solo lugar.
            </p>
            <div className="mt-5 flex gap-2">
              <Button className="rounded-xl text-sm px-4 py-2">
                Participar en el piloto
              </Button>
              <Button variant="outline" className="rounded-xl text-sm px-4 py-2 dark:border-slate-700">
                Contacto
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="mb-4 text-sm font-bold text-slate-900 dark:text-white">{title}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 md:flex-row">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 SCZ-RESERVA — Plataforma de reservas deportivas.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            Hecho con <Heart className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" strokeWidth={0} /> en Santa Cruz de la Sierra
          </p>
        </div>
      </div>
    </footer>
  );
}
