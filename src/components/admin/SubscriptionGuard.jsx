import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { Clock, AlertTriangle } from "lucide-react";

/**
 * Protege las rutas del admin verificando que la suscripción esté activa o en prueba.
 * Si no, redirige a /admin/precios.
 */
export default function SubscriptionGuard({ children }) {
  const { user, subscriptionStatus, trialEndsAt, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (!user) {
    navigate("/admin/login", { replace: true });
    return null;
  }

  // Calcular días restantes de prueba
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.floor((new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isActive = subscriptionStatus === "active";
  const isTrialing = subscriptionStatus === "trialing" && trialDaysLeft > 0;

  // Si no tiene suscripción activa ni trial, redirigir a precios
  if (!isActive && !isTrialing) {
    navigate("/admin/precios", { replace: true });
    return null;
  }

  // Si está en trial, mostrar banner
  if (isTrialing) {
    return (
      <>
        <div className="border-b border-emerald-200 bg-emerald-50">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-800">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Prueba gratis — te{" "}
              {trialDaysLeft === 1
                ? "queda 1 día"
                : `quedan ${trialDaysLeft} días`}
              .{" "}
              <button
                onClick={() => navigate("/admin/precios")}
                className="font-bold underline underline-offset-2 hover:text-emerald-900"
              >
                Suscríbete ahora
              </button>
            </span>
          </div>
        </div>
        {children}
      </>
    );
  }

  // Si está activa pero por vencer pronto (menos de 7 días)
  if (isActive && trialDaysLeft > 0 && trialDaysLeft <= 7) {
    // Solo mostrar si además está en período de gracia
    // Normalmente las suscripciones activas no tienen trialDaysLeft
    return children;
  }

  return children;
}
