import { NextResponse } from "next/server";
import { triggerMusic, getMusicState } from "../musicState";

// Mark this route as dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
    try {
        const state = triggerMusic();

        // eslint-disable-next-line no-console
        console.log(`[trigger-music] New event triggered. eventId: ${state.eventId}, timestamp: ${state.lastTriggerTime}`);

        const response = NextResponse.json({
            success: true,
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
        console.error("Error triggering music:", error);
        return NextResponse.json({ success: false, error: "Failed to trigger music" }, { status: 500 });
    }
}

export async function GET() {
    const state = getMusicState();
    return NextResponse.json({
        eventId: state.eventId,
        timestamp: state.lastTriggerTime,
    });
}
