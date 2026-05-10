import { createClient, SupabaseClient } from "@supabase/supabase-js";

const TABLE = "insane_lineup";
const ROW_ID = 1;

export type StageKey = "MIRAGE" | "CLOUD" | "ALTF4" | "TECHNOBUS";
export type DayKey = "jeu" | "ven" | "sam";
export type SetEntry = { s: string; e: string; a: string };
export type Lineup = Record<DayKey, Record<StageKey, SetEntry[]>>;

let cached: SupabaseClient | null = null;

function getClient(): SupabaseClient {
    if (cached) return cached;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error("Supabase env vars missing");
    cached = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    return cached;
}

export async function readLineup(): Promise<Lineup | null> {
    const supabase = getClient();
    const { data, error } = await supabase.from(TABLE).select("data").eq("id", ROW_ID).maybeSingle();
    if (error) throw error;
    return (data?.data as Lineup | undefined) ?? null;
}

export async function writeLineup(lineup: Lineup): Promise<void> {
    const supabase = getClient();
    const { error } = await supabase
        .from(TABLE)
        .upsert({ id: ROW_ID, data: lineup, updated_at: new Date().toISOString() });
    if (error) throw error;
}
