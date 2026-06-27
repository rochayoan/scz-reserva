import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } =
      supabase?.auth?.onAuthStateChange((_event, session) => {
        setSession(session);
        setLoading(false);
      }) ?? {};

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!supabase) return { error: new Error("Supabase no está configurado") };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const register = async (email, password) => {
    if (!supabase) return { error: new Error("Supabase no está configurado") };
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  const logout = async () => {
    await supabase?.auth?.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
