import { NextRequest, NextResponse } from "next/server";
import { buildAdminCookie, clearAdminCookie } from "@/lib/insaneAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
    const expected = process.env.INSANE_PASSWORD;
    if (!expected) return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });

    let body: { password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }

    if (typeof body.password !== "string" || body.password !== expected) {
        return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", buildAdminCookie());
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", clearAdminCookie());
    return res;
}
