// Shared state for music events
// In a production app, use a database, Redis, or a proper state management solution

interface MusicState {
    eventId: number;
    lastTriggerTime: number;
}

const musicState: MusicState = {
    eventId: 0,
    lastTriggerTime: 0,
};

export function getMusicState(): MusicState {
    return { ...musicState };
}

export function triggerMusic(): MusicState {
    musicState.eventId++;
    musicState.lastTriggerTime = Date.now();
    return { ...musicState };
}
