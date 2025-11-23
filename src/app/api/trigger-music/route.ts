import { NextRequest, NextResponse } from 'next/server';
import { triggerMusic, getMusicState } from '../musicState';

export async function POST(request: NextRequest) {
    try {
        const state = triggerMusic();

        return NextResponse.json({
            success: true,
            eventId: state.eventId,
            timestamp: state.lastTriggerTime,
        });
    } catch (error) {
        console.error('Error triggering music:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to trigger music' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const state = getMusicState();
    return NextResponse.json({
        eventId: state.eventId,
        timestamp: state.lastTriggerTime,
    });
}


