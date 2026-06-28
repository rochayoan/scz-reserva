import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Sparkles,
  Banknote,
  ArrowRight,
} from "lucide-react";

const PLAN_FEATURES = [
  "Panel de administración completo",
  "Gestión de canchas y horarios",
  "Calendario de reservas en tiempo real",
  "Estadísticas e ingresos",
  "Soporte personalizado",
];

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true";
  const { user, orgName, subscriptionStatus, trialEndsAt, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.floor((new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const isTrialing = subscriptionStatus === "trialing" && trialDaysLeft > 0;
  const isActive = subscriptionStatus === "active";

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
          <h1 className="text-xl font-bold">¡Suscripción activa!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Tu panel está completamente desbloqueado.
          </p>
          <button
            onClick={() => navigate("/admin")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Ir al panel <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

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
          {isTrialing && (
            <Link
              to="/admin"
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Volver al panel
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        {/* Trial banner */}
        {isTrialing && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <Clock className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
            <p className="font-semibold text-emerald-800">
              Estás en prueba gratis — te{" "}
              {trialDaysLeft === 1
                ? "queda 1 día"
                : `quedan ${trialDaysLeft} días`}
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              Activa tu suscripción para seguir administrando tu complejo
            </p>
          </div>
        )}

        {!isTrialing && !isActive && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
            <p className="font-semibold text-amber-800">
              Tu prueba gratis terminó. Activa tu suscripción para seguir usando el panel.
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
            Administra tu complejo deportivo por solo
          </p>
          <p className="mt-2 text-4xl font-black tracking-tight text-emerald-700">
            Bs 99<span className="text-lg font-normal text-slate-400">/mes</span>
          </p>
        </div>

        <div className="mx-auto max-w-lg space-y-6">
          {/* Bank details card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Banknote className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Transferencia bancaria</h2>
                <p className="text-xs text-slate-400">
                  Realiza el pago y te activamos en minutos
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Banco</span>
                <span className="text-sm font-bold text-slate-800">Banco Económico</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Titular</span>
                <span className="text-sm font-bold text-slate-800">Yoan Marc Rocha Ferrufino</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">N° de Cuenta</span>
                <span className="text-sm font-bold text-slate-800">1011068463</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">CI / NIT</span>
                <span className="text-sm font-bold text-slate-800">13500829</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Monto mensual</span>
                  <span className="text-lg font-black text-emerald-700">Bs 99</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3">
              <Clock className="h-4 w-4 shrink-0 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">
                Tu suscripción se activa en menos de 24 horas después del pago. Te enviaremos un mensaje de confirmación.
              </span>
            </div>
          </div>

          {/* Steps card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h3 className="mb-4 font-bold text-slate-800">Pasos para activar</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  1
                </div>
                <p className="text-sm text-slate-600">
                  Transfiere <strong className="text-slate-800">Bs 99</strong> a la cuenta de arriba
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  2
                </div>
                <p className="text-sm text-slate-600">
                  Envíanos el comprobante por WhatsApp al <strong className="text-slate-800">591 72654203</strong>
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  3
                </div>
                <p className="text-sm text-slate-600">
                  Te activamos la suscripción y accedes al panel completo
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/59172654203?text=${encodeURIComponent(`Hola, acabo de transferir Bs 99 para activar mi suscripción de SCZ Reserva. Mi complejo: ${orgName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-800 hover:shadow-md"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enviar comprobante por WhatsApp
            </a>
          </div>

          {/* Features mini */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h3 className="mb-4 font-bold text-slate-800">Incluye</h3>
            <ul className="space-y-3">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-sm text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
