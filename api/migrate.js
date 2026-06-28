// Temporary migration endpoint - can be deleted after running
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase.rpc("exec_sql", {
    sql: `
      alter table reservations
        add column if not exists payment_reference text;

      create index if not exists reservations_payment_ref_idx
        on reservations (payment_reference)
        where payment_reference is not null;
    `
  });

  if (error) {
    // Try direct SQL via raw query
    const { error: sqlError } = await supabase
      .from("_exec_sql")
      .select("*")
      .limit(1);

    return res.status(500).json({
      error: error.message,
      hint: "The exec_sql function may not exist. Run manually in Supabase SQL Editor: ALTER TABLE reservations ADD COLUMN IF NOT EXISTS payment_reference text;"
    });
  }

  return res.status(200).json({ success: true });
}
