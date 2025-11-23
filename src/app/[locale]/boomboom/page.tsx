"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";

export default function BoomBoomPage() {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayMusic = async () => {
        setIsPlaying(true);

        try {
            // Trigger the music on all browserbrowser pages
            await fetch("/api/trigger-music", {
                method: "POST",
            });

            setTimeout(() => setIsPlaying(false), 1000);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error triggering music:", error);
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
                        Click the button to play music on all browsers viewing the /browserbrowser page!
                    </p>
                </div>
            </Section>
        </Container>
    );
}
