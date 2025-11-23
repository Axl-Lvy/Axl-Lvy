// Shared state for music events
// In a production app, use a database, Redis, or a proper state management solution
// For serverless, we use a timestamp-based approach

interface MusicState {
    eventId: number;
    lastTriggerTime: number;
}

// Global state that persists within the same serverless instance
// NOTE: In serverless, each instance has its own copy
const musicState: MusicState = {
    eventId: 0,
    lastTriggerTime: 0,
};

// Track initialization per instance
let isInitialized = false;

// Initialize with current timestamp if not initialized
function ensureInitialized() {
    if (!isInitialized) {
        // eslint-disable-next-line no-console
        console.log("[musicState] Initializing new serverless instance");
        isInitialized = true;
    }
}

export function getMusicState(): MusicState {
    ensureInitialized();
    return { ...musicState };
}

export function triggerMusic(): MusicState {
    ensureInitialized();
    musicState.eventId++;
    musicState.lastTriggerTime = Date.now();
    // eslint-disable-next-line no-console
    console.log(`[musicState] Trigger: eventId=${musicState.eventId}, time=${musicState.lastTriggerTime}`);
    return { ...musicState };
}
