"use client";

import React, { useEffect, useRef, useState } from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";

export default function BrowserBrowserPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [playCount, setPlayCount] = useState(0);
    const [lastPlayed, setLastPlayed] = useState<string>("Never");
    const audioContextRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize audio context
    useEffect(() => {
        // Create audio context on user interaction (required by browsers)
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
        };

        document.addEventListener("click", initAudio, { once: true });

        return () => {
            document.removeEventListener("click", initAudio);
        };
    }, []);

    // Play "pipipi" sound using Web Audio API
    const playPipipi = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        const notes = [523.25, 587.33, 659.25]; // C5, D5, E5 frequencies
        const duration = 0.15; // Duration of each note in seconds

        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = freq;
            oscillator.type = "sine";

            const startTime = ctx.currentTime + index * duration;
            const endTime = startTime + duration;

            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

            oscillator.start(startTime);
            oscillator.stop(endTime);
        });

        setPlayCount((prev: number) => prev + 1);
        setLastPlayed(new Date().toLocaleTimeString());
    };

    // Poll for music trigger
    useEffect(() => {
        let lastEventId = 0;

        const checkForTrigger = async () => {
            try {
                const response = await fetch(`/api/check-music?lastEventId=${lastEventId}`);
                const data = await response.json();

                if (data.shouldPlay && data.eventId > lastEventId) {
                    lastEventId = data.eventId;
                    playPipipi();
                }

                setIsConnected(true);
            } catch (error) {
                console.error("Error checking for music trigger:", error);
                setIsConnected(false);
            }
        };

        // Check every 500ms
        intervalRef.current = setInterval(checkForTrigger, 500);

        // Initial check
        checkForTrigger();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <Container>
            <Section id="browserbrowser">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-center">Browser Browser 🎧</h1>

                    <div className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                        ></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isConnected ? "Connected" : "Disconnected"}
                        </span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                        <p className="text-6xl mb-4">🎵</p>
                        <p className="text-2xl font-bold mb-2">Waiting for music...</p>
                        <p className="text-gray-600 dark:text-gray-400">
                            This page will play music when someone clicks the button on /boomboom
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{playCount}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Times Played</p>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 text-center">
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-300">{lastPlayed}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Last Played</p>
                        </div>
                    </div>

                    <button
                        onClick={playPipipi}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                        🔊 Test Sound
                    </button>
                </div>
            </Section>
        </Container>
    );
}
