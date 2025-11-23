"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";

export default function BoomBoomPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastTrigger, setLastTrigger] = useState<string>("");
    const [triggerCount, setTriggerCount] = useState(0);
    const [error, setError] = useState<string>("");

    const handlePlayMusic = async () => {
        setIsPlaying(true);
        setError("");

        try {
            // Trigger the music on all browserbrowser pages
            const response = await fetch("/api/trigger-music", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // eslint-disable-next-line no-console
            console.log("Music triggered successfully:", data);

            setLastTrigger(new Date().toLocaleTimeString());
            setTriggerCount((prev) => prev + 1);

            setTimeout(() => setIsPlaying(false), 1000);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error triggering music:", error);
            setError(`Failed to trigger: ${error instanceof Error ? error.message : String(error)}`);
            setIsPlaying(false);
        }
    };

    return (
        <Container>
            <Section id="boomboom">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-center">Boom Boom 🎵</h1>
                    <button
                        onClick={handlePlayMusic}
                        disabled={isPlaying}
                        className={`
                            px-8 py-4 text-xl font-bold rounded-lg
                            transition-all duration-200 transform
                            ${
                                isPlaying
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
                            }
                            text-white shadow-lg hover:shadow-xl
                        `}
                    >
                        {isPlaying ? "🎵 Playing..." : "▶️ Play Pipipi"}
                    </button>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        Click the button to play music on all browsers viewing the /listen page!
                    </p>

                    {/* Success feedback */}
                    {triggerCount > 0 && (
                        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center">
                            <p className="text-green-700 dark:text-green-300 font-semibold">
                                ✓ Triggered {triggerCount} time{triggerCount !== 1 ? "s" : ""}
                            </p>
                            <p className="text-green-600 dark:text-green-400 text-sm">Last: {lastTrigger}</p>
                        </div>
                    )}

                    {/* Error feedback */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 text-center max-w-md">
                            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </Section>
        </Container>
    );
}
