import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import {
  LayoutDashboard,
  CalendarCheck,
  Swords,
  CalendarDays,
  Settings,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/reservas", icon: CalendarCheck, label: "Reservas" },
  { to: "/admin/canchas", icon: Swords, label: "Canchas" },
  { to: "/admin/horarios", icon: CalendarDays, label: "Horarios" },
  { to: "/admin/configuracion", icon: Settings, label: "Configuración" },
];

export default function AdminLayout() {
  const { user, logout, isSuperAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-emerald-100/60 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-base font-bold text-white shadow-sm shadow-emerald-300/20">
          S
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-800">scz-reserva</p>
          <p className="text-[11px] leading-tight font-medium text-emerald-600">
            Panel del dueño
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-sm shadow-emerald-300/20"
                  : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
              }`
            }
          >
            <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}

        {/* Super admin link */}
        {isSuperAdmin && (
          <>
            <div className="my-2 border-t border-slate-100" />
            <NavLink
              to="/admin/super"
              onClick={() => mobile && setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm shadow-amber-300/20"
                    : "text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                }`
              }
            >
              <ShieldCheck className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.75} />
              Super Admin
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-4">
        {user && (
          <div className="mb-3 flex items-center gap-2 rounded-xl px-4 py-2 text-xs text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        <Link
          to="/"
          onClick={() => mobile && setMobileOpen(false)}
          className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" strokeWidth={1.75} />
          Volver al sitio
        </Link>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-30 hidden h-full w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur-sm md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-sm font-bold text-white">
              S
            </div>
            <p className="text-sm font-bold text-slate-800">scz-reserva</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent mobile />
      </aside>

      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-[10px] font-bold text-white shadow-sm">
          S
        </div>
        <p className="text-sm font-bold text-slate-800">scz-reserva</p>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 pt-16 pb-8 md:ml-64 md:px-8 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
