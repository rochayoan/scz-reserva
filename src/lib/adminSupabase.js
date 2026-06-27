import { supabase } from "./supabaseClient";

const DEMO_ORG_ID = "00000000-0000-0000-0000-000000000001";

// ---------- DASHBOARD ----------

export async function getDashboardKPIs(orgId = DEMO_ORG_ID) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    { count: totalCourts },
    { data: todayReservations, error: rErr },
    { data: allReservations, error: aErr },
  ] = await Promise.all([
    supabase
      .from("courts")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("is_active", true),
    supabase
      .from("reservations")
      .select("*")
      .eq("organization_id", orgId)
      .gte("starts_at", todayStart.toISOString())
      .lte("starts_at", todayEnd.toISOString()),
    supabase
      .from("reservations")
      .select("*")
      .eq("organization_id", orgId)
      .in("status", ["confirmed", "pending"]),
  ]);

  if (rErr || aErr) return null;

  const todayRevenue = (todayReservations ?? [])
    .filter((r) => r.payment_status === "paid")
    .reduce((sum, r) => sum + Number(r.price_total), 0);

  const activeNow = (allReservations ?? []).length;

  return {
    todayRevenue,
    activeReservations: activeNow,
    totalCourts: totalCourts ?? 0,
    todayCount: (todayReservations ?? []).length,
  };
}

// ---------- RESERVATIONS ----------

export async function getAdminReservations(orgId = DEMO_ORG_ID) {
  const { data, error } = await supabase
    .from("reservations")
    .select("*, venues!inner(name), courts!inner(name, sport)")
    .eq("organization_id", orgId)
    .order("starts_at", { ascending: false })
    .limit(100);

  if (error) return [];
  return data.map((r) => ({
    ...r,
    venue_name: r.venues?.name ?? "—",
    court_name: r.courts?.name ?? "—",
    court_sport: r.courts?.sport ?? "—",
  }));
}

export async function updateReservationStatus(id, status) {
  const { error } = await supabase
    .from("reservations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error };
}

// ---------- COURTS & VENUES ----------

export async function getVenuesWithCourts(orgId = DEMO_ORG_ID) {
  const { data: venues, error: vErr } = await supabase
    .from("venues")
    .select("*")
    .eq("organization_id", orgId)
    .order("name");

  if (vErr) return [];

  const { data: courts, error: cErr } = await supabase
    .from("courts")
    .select("*, court_operating_hours(*)")
    .eq("organization_id", orgId)
    .order("name");

  if (cErr) return venues.map((v) => ({ ...v, courts: [] }));

  return venues.map((v) => ({
    ...v,
    courts: (courts ?? []).filter((c) => c.venue_id === v.id),
  }));
}

export async function saveCourt(court) {
  const now = new Date().toISOString();
  if (court.id) {
    const { error } = await supabase
      .from("courts")
      .update({ ...court, updated_at: now })
      .eq("id", court.id);
    return { error };
  } else {
    const { data, error } = await supabase
      .from("courts")
      .insert({ ...court, created_at: now, updated_at: now })
      .select()
      .single();
    return { data, error };
  }
}

export async function saveVenue(venue) {
  const now = new Date().toISOString();
  if (venue.id) {
    const { error } = await supabase
      .from("venues")
      .update({ ...venue, updated_at: now })
      .eq("id", venue.id);
    return { error };
  } else {
    const { data, error } = await supabase
      .from("venues")
      .insert({ ...venue, created_at: now, updated_at: now })
      .select()
      .single();
    return { data, error };
  }
}

export async function toggleActiveCourt(id, isActive) {
  const { error } = await supabase
    .from("courts")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error };
}

export async function toggleActiveVenue(id, isActive) {
  const { error } = await supabase
    .from("venues")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error };
}

// ---------- SCHEDULE ----------

export async function getScheduleData(orgId = DEMO_ORG_ID) {
  // Get all courts + their operating hours + reservations for the week
  const { data: courts } = await supabase
    .from("courts")
    .select("id, name, sport, venue_id")
    .eq("organization_id", orgId)
    .eq("is_active", true);

  if (!courts) return { courts: [], operatingHours: [], reservations: [] };

  const courtIds = courts.map((c) => c.id);

  const [hoursRes, reservsRes] = await Promise.all([
    supabase
      .from("court_operating_hours")
      .select("*")
      .in("court_id", courtIds),
    supabase
      .from("reservations")
      .select("*")
      .in("court_id", courtIds)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at"),
  ]);

  return {
    courts,
    operatingHours: hoursRes.data ?? [],
    reservations: reservsRes.data ?? [],
  };
}

// ---------- SETTINGS ----------

export async function getOrganization(orgId = DEMO_ORG_ID) {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();
  return { data, error };
}

export async function updateOrganization(orgId, updates) {
  const { error } = await supabase
    .from("organizations")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", orgId);
  return { error };
}
