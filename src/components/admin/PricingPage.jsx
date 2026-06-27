import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { createCheckoutSession } from "../../lib/stripeClient";
import { CheckCircle, Zap, Clock, CreditCard, Sparkles } from "lucide-react";

const PLAN_FEATURES = [
  "Panel de administración completo",
  "Gestión de canchas y horarios",
  "Calendario de reservas en tiempo real",
  "Múltiples sedes y canchas",
  "Estadísticas e ingresos",
  "Soporte prioritario",
];

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { user, orgId, orgName, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Si el usuario viene de un pago exitoso, verificar estado
  useEffect(() => {
    if (success && user && orgId) {
      setCheckingStatus(true);
      // Refresh auth to get updated subscription status
      const check = async () => {
        // Esperar un momento para que el webhook procese
        await new Promise((r) => setTimeout(r, 2000));
        window.location.reload();
      };
      check();
    }
  }, [success, user, orgId]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-xl font-bold">Inicia sesión para ver los planes</h1>
        <Link
          to="/admin/login"
          className="mt-4 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Ir al login
        </Link>
      </div>
    );
  }

  const handleSubscribe = async () => {
    setLoading(true);
    setError("");
    try {
      const url = await createCheckoutSession(orgId);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-sm font-bold text-white">
              S
            </div>
            <span className="text-sm font-bold">{orgName || "SCZ Reserva"}</span>
          </Link>
          <Link
            to="/admin"
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
          >
            Volver al panel
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        {/* Success / Canceled messages */}
        {success && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
            <p className="font-semibold text-emerald-800">
              {checkingStatus
                ? "Verificando tu pago..."
                : "¡Pago exitoso! Tu suscripción está activa."}
            </p>
          </div>
        )}
        {canceled && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
            <p className="font-semibold text-amber-800">
              El pago fue cancelado. Puedes intentarlo cuando quieras.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 shadow-sm">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Activa tu suscripción
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Desbloquea todas las herramientas para administrar tu complejo deportivo
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            {/* Popular badge */}
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white">
              RECOMENDADO
            </div>

            <div className="p-8 pt-10">
              <h2 className="text-lg font-bold text-slate-800">Plan Mensual</h2>
              <p className="mt-1 text-sm text-slate-400">
                Acceso completo a todas las funciones
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-slate-900">
                  $29
                </span>
                <span className="text-sm text-slate-400">/mes</span>
              </div>

              <ul className="mt-8 space-y-3">
                {PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  Prueba gratis de 14 días incluida. Cancela cuando quieras.
                </span>
              </div>

              {error && (
                <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
              )}

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-800 hover:shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Redirigiendo a Stripe...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Suscribirme ahora — $29/mes
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-300" />
                <span className="text-xs text-slate-400">
                  Pago seguro con Stripe. Visa, Mastercard, Mercado Pago.
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Al suscribirte aceptas nuestros{" "}
              <span className="underline">términos y condiciones</span>.{" "}
              Cancela en cualquier momento desde el panel de configuración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
