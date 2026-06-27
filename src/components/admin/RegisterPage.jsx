import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { createOrganizationForUser } from "../../lib/adminSupabase";
import { useAuth } from "../../lib/AuthContext";
import { User, Mail, Lock, Building2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // 1. Register in Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (authErr) {
        setError(authErr.message === "User already registered"
          ? "Este email ya está registrado. Inicia sesión."
          : authErr.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("No se pudo crear el usuario");
        setLoading(false);
        return;
      }

      // 2. Create organization + profile + membership
      const { data: org, error: orgErr } = await createOrganizationForUser(
        authData.user.id,
        fullName,
        orgName || `Complejo de ${fullName}`
      );

      if (orgErr) {
        setError("Error al crear la organización: " + orgErr.message);
        setLoading(false);
        return;
      }

      setStep(2);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    }

    setLoading(false);
  };

  if (step === 2) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Mail className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">¡Casi listo!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Te enviamos un email de confirmación a <b>{email}</b>
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
            Luego puedes iniciar sesión.
          </p>
          <Link
            to="/admin/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Ir a iniciar sesión
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white shadow-sm">
            S
          </div>
          <h1 className="text-xl font-bold">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">
            Registra tu complejo deportivo
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <User className="h-3.5 w-3.5 text-slate-400" />
                Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Ej: Carlos Rojas"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="dueño@complejo.com"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="•••••••• (mín. 6 caracteres)"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                Nombre de tu complejo
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                placeholder="Ej: Pentagol Complejo Deportivo"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-700 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/admin/login" className="font-semibold text-emerald-700 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
