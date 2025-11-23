import { NextResponse } from "next/server";
import { triggerMusic, getMusicState } from "../musicState";

export async function POST() {
    try {
        const state = triggerMusic();

        return NextResponse.json({
            success: true,
            eventId: state.eventId,
            timestamp: state.lastTriggerTime,
        });
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
