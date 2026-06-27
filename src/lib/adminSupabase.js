import { supabase } from "./supabaseClient";

// ---------- DASHBOARD ----------

export async function getDashboardKPIs(orgId) {
  if (!orgId) return null;

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

  return {
    todayRevenue,
    activeReservations: (allReservations ?? []).length,
    totalCourts: totalCourts ?? 0,
    todayCount: (todayReservations ?? []).length,
  };
}

// ---------- RESERVATIONS ----------

export async function getAdminReservations(orgId) {
  if (!orgId) return [];
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

// ---------- CREATE RESERVATION ----------

export async function createReservation({
  organization_id,
  venue_id,
  court_id,
  guest_name,
  guest_phone,
  starts_at,
  ends_at,
  price_total,
}) {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      organization_id,
      venue_id,
      court_id,
      guest_name: guest_name || "Invitado",
      guest_phone,
      starts_at,
      ends_at,
      price_total: Math.round(price_total * 100) / 100,
      status: "pending",
      payment_status: "unpaid",
      payment_method: "none",
    })
    .select()
    .single();

  return { data, error };
}

// ---------- COURTS & VENUES ----------

export async function getVenuesWithCourts(orgId) {
  if (!orgId) return [];

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

// ---------- OPERATING HOURS ----------

export async function saveOperatingHours(entries) {
  // entries: [{ court_id, day_of_week, open_time, close_time }]
  if (entries.length === 0) return { error: null };

  const courtId = entries[0].court_id;
  const days = [...new Set(entries.map((e) => e.day_of_week))];

  // Delete existing hours for this court on these days
  const { error: delErr } = await supabase
    .from("court_operating_hours")
    .delete()
    .eq("court_id", courtId)
    .in("day_of_week", days);

  if (delErr) return { error: delErr };

  // Insert new entries
  const { data, error } = await supabase
    .from("court_operating_hours")
    .insert(
      entries.map((e) => ({
        court_id: e.court_id,
        day_of_week: e.day_of_week,
        open_time: e.open_time,
        close_time: e.close_time,
      }))
    )
    .select();

  return { data, error };
}

export async function deleteOperatingHour(id) {
  const { error } = await supabase
    .from("court_operating_hours")
    .delete()
    .eq("id", id);
  return { error };
}

// ---------- SCHEDULE ----------

export async function getScheduleData(orgId) {
  if (!orgId) return { courts: [], operatingHours: [], reservations: [] };

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

export async function getOrganization(orgId) {
  if (!orgId) return { data: null, error: new Error("No org ID") };
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

// ---------- ONBOARDING: create org for new user ----------

export async function createOrganizationForUser(userId, fullName, orgName) {
  const now = new Date().toISOString();
  const slug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // 1. Create organization
  const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({
      name: orgName,
      slug: slug + "-" + Date.now().toString(36),
      subscription_plan: "trial",
      subscription_status: "trialing",
      trial_ends_at: trialEndsAt,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (orgErr) return { error: orgErr };

  // 2. Create profile
  const { error: profErr } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name: fullName,
      created_at: now,
      updated_at: now,
    });

  if (profErr) return { error: profErr };

  // 3. Create membership
  const { error: memErr } = await supabase
    .from("memberships")
    .insert({
      organization_id: org.id,
      user_id: userId,
      role: "owner",
      created_at: now,
    });

  if (memErr) return { error: memErr };

  return { data: org, error: null };
}
