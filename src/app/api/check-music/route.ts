import { NextRequest, NextResponse } from "next/server";
import { getMusicState } from "../musicState";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const lastEventId = parseInt(request.nextUrl.searchParams.get("lastEventId") || "0");

        const state = getMusicState();

        // Check if there's a new event
        const shouldPlay = state.eventId > lastEventId;

        return NextResponse.json({
            shouldPlay,
            eventId: state.eventId,
            timestamp: state.lastTriggerTime,
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error checking music:", error);
        return NextResponse.json({ shouldPlay: false, eventId: 0, error: "Failed to check music" }, { status: 500 });
    }
}
