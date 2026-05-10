import { NextRequest, NextResponse } from "next/server";
import { isAdminCookieValid } from "@/lib/insaneAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
    const admin = isAdminCookieValid(request.headers.get("cookie"));
    return NextResponse.json({ admin });
}
