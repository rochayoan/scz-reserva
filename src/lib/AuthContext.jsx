import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [trialEndsAt, setTrialEndsAt] = useState(null);

  // Fetch the organization for a user from memberships
  const fetchOrg = useCallback(async (userId) => {
    if (!userId) {
      setOrgId(null);
      setOrgName(null);
      setSubscriptionStatus(null);
      setTrialEndsAt(null);
      return;
    }
    const { data: membership } = await supabase
      .from("memberships")
      .select("organization_id, organizations(name, subscription_status, trial_ends_at)")
      .eq("user_id", userId)
      .maybeSingle();

    if (membership) {
      setOrgId(membership.organization_id);
      setOrgName(membership.organizations?.name ?? "Mi Complejo");
      setSubscriptionStatus(membership.organizations?.subscription_status ?? null);
      setTrialEndsAt(membership.organizations?.trial_ends_at ?? null);
    } else {
      setOrgId(null);
      setOrgName(null);
      setSubscriptionStatus(null);
      setTrialEndsAt(null);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchOrg(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } =
      supabase?.auth?.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) fetchOrg(session.user.id);
        else {
          setOrgId(null);
          setOrgName(null);
        }
        setLoading(false);
      }) ?? {};

    return () => subscription?.unsubscribe();
  }, [fetchOrg]);

  const login = async (email, password) => {
    if (!supabase) return { error: new Error("Supabase no está configurado") };
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase?.auth?.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        orgId,
        orgName,
        subscriptionStatus,
        trialEndsAt,
        isSuperAdmin: session?.user?.email === "rochayoan40@gmail.com",
        login,
        logout,
        fetchOrg,
      }}
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
