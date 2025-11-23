import { NextRequest, NextResponse } from "next/server";
import { getMusicState } from "../musicState";

// Mark this route as dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const lastEventId = parseInt(request.nextUrl.searchParams.get("lastEventId") || "0");

        const state = getMusicState();

        // Check if there's a new event
        const shouldPlay = state.eventId > lastEventId;

        // eslint-disable-next-line no-console
        console.log(
            `[check-music] Client lastEventId: ${lastEventId}, Server eventId: ${state.eventId}, shouldPlay: ${shouldPlay}`,
        );

        const response = NextResponse.json({
            shouldPlay,
            eventId: state.eventId,
            timestamp: state.lastTriggerTime,
        });

        // Prevent caching
        response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");

        return response;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error checking music:", error);
        return NextResponse.json({ shouldPlay: false, eventId: 0, error: "Failed to check music" }, { status: 500 });
    }
}
