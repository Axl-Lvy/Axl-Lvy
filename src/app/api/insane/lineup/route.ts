import { NextRequest, NextResponse } from "next/server";
import { isAdminCookieValid } from "@/lib/insaneAuth";
import { readLineup, writeLineup, Lineup, SetEntry } from "@/lib/insaneStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STAGES = ["MIRAGE", "CLOUD", "ALTF4", "TECHNOBUS"] as const;
const DAYS = ["jeu", "ven", "sam"] as const;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidSet(x: unknown): x is SetEntry {
    if (!x || typeof x !== "object") return false;
    const o = x as Record<string, unknown>;
    return (
        typeof o.s === "string" &&
        typeof o.e === "string" &&
        typeof o.a === "string" &&
        TIME_RE.test(o.s) &&
        TIME_RE.test(o.e) &&
        o.a.length > 0 &&
        o.a.length <= 200
    );
}

function isValidLineup(x: unknown): x is Lineup {
    if (!x || typeof x !== "object") return false;
    const o = x as Record<string, unknown>;
    for (const day of DAYS) {
        const stages = o[day];
        if (!stages || typeof stages !== "object") return false;
        for (const stage of STAGES) {
            const arr = (stages as Record<string, unknown>)[stage];
            if (!Array.isArray(arr)) return false;
            if (arr.length > 200) return false;
            for (const set of arr) if (!isValidSet(set)) return false;
        }
    }
    return true;
}

export async function GET() {
    try {
        const data = await readLineup();
        const res = NextResponse.json({ lineup: data });
        res.headers.set("Cache-Control", "no-store");
        return res;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[insane/lineup GET]", e);
        return NextResponse.json({ lineup: null, error: "Read failed" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!isAdminCookieValid(request.headers.get("cookie"))) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let body: { lineup?: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }

    if (!isValidLineup(body.lineup)) {
        return NextResponse.json({ ok: false, error: "Invalid lineup shape" }, { status: 400 });
    }

    try {
        await writeLineup(body.lineup);
        return NextResponse.json({ ok: true });
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[insane/lineup POST]", e);
        return NextResponse.json({ ok: false, error: "Write failed" }, { status: 500 });
    }
}
