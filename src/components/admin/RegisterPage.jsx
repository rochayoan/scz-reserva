import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { createOrganizationForUser } from "../../lib/adminSupabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login, fetchOrg } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authErr) {
        setError(authErr.message);
        setLoading(false);
        return;
      }

      if (!authData?.user) {
        setError("No se pudo crear el usuario");
        setLoading(false);
        return;
      }

      const { data: org, error: orgErr } = await createOrganizationForUser(
        authData.user.id,
        fullName,
        orgName
      );

      if (orgErr) {
        setError("Error al crear organización: " + orgErr.message);
        setLoading(false);
        return;
      }

      await login(email, password);
      await fetchOrg(authData.user.id);

      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError("Error inesperado. Intenta de nuevo.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white shadow-sm">✓</div>
          <h1 className="text-xl font-bold">¡Registro exitoso!</h1>
          <p className="mt-2 text-sm text-slate-500">Te redirigimos a tu panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-bold text-white shadow-sm">S</div>
          <h1 className="text-xl font-bold">Crear cuenta de dueño</h1>
          <p className="mt-1 text-sm text-slate-500">Administra tu complejo deportivo</p>
        </div>

        <form onSubmit={handleRegister} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nombre del complejo</label>
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)} required
                placeholder="Ej: Pentagol Complejo Deportivo"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tu nombre completo</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required
                placeholder="Ej: Yoan Ferrufino"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="dueno@complejo.com"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>

          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

          <button type="submit" disabled={loading}
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-emerald-700 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50">
            {loading ? "Creando cuenta..." : "Crear cuenta y entrar al panel"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/admin/login" className="font-semibold text-emerald-700 hover:underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
