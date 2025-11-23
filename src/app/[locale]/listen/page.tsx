"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "@/components/Container";
import Section from "@/components/Section";

export default function ListenPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [playCount, setPlayCount] = useState(0);
    const [lastPlayed, setLastPlayed] = useState<string>("Never");
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [lastCheckTime, setLastCheckTime] = useState<string>("");
    const [isQuietHours, setIsQuietHours] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastEventIdRef = useRef<number>(0);
    const lastTimestampRef = useRef<number>(0);

    // Initialize audio element
    useEffect(() => {
        const initAudio = async () => {
            try {
                // First, check if the file is accessible
                const checkResponse = await fetch("/sounds/pipipi.mp3");
                if (!checkResponse.ok) {
                    setErrorMessage(`Audio file not accessible: ${checkResponse.status} ${checkResponse.statusText}`);
                    return;
                }

                // Get the blob to ensure we can read the file
                const blob = await checkResponse.blob();
                // eslint-disable-next-line no-console
                console.log("Audio file loaded as blob:", blob.type, blob.size, "bytes");

                // Create audio element using the blob URL
                const blobUrl = URL.createObjectURL(blob);
                audioRef.current = new Audio();
                audioRef.current.volume = 0.7;
                audioRef.current.preload = "auto";

                // Set up event listeners before setting src
                audioRef.current.addEventListener("canplaythrough", () => {
                    // eslint-disable-next-line no-console
                    console.log("Audio is ready to play");
                    setIsAudioReady(true);
                    setErrorMessage("");
                });

                audioRef.current.addEventListener("error", (e) => {
                    const error = audioRef.current?.error;
                    let errorMsg = "Failed to load audio file";
                    if (error) {
                        switch (error.code) {
                            case error.MEDIA_ERR_ABORTED:
                                errorMsg = "Audio loading aborted";
                                break;
                            case error.MEDIA_ERR_NETWORK:
                                errorMsg = "Network error while loading audio";
                                break;
                            case error.MEDIA_ERR_DECODE:
                                errorMsg = "Audio decode error - file may be corrupt or in unsupported format";
                                break;
                            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                errorMsg = "Audio format not supported or file not found";
                                break;
                        }
                        errorMsg += ` (code: ${error.code}, message: ${error.message})`;
                    }
                    // eslint-disable-next-line no-console
                    console.error("Audio loading error:", e, error);
                    setErrorMessage(errorMsg);
                });

                audioRef.current.addEventListener("loadedmetadata", () => {
                    // eslint-disable-next-line no-console
                    console.log("Audio metadata loaded, duration:", audioRef.current?.duration);
                });

                // Set src and load
                audioRef.current.src = blobUrl;
                audioRef.current.load();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error initializing audio:", error);
                setErrorMessage(`Init error: ${error instanceof Error ? error.message : String(error)}`);
            }
        };

        initAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                const src = audioRef.current.src;
                if (src.startsWith("blob:")) {
                    URL.revokeObjectURL(src);
                }
                audioRef.current.src = "";
                audioRef.current = null;
            }
        };
    }, []);

    // Check quiet hours status periodically
    useEffect(() => {
        const checkQuietHours = () => {
            const hour = new Date().getHours();
            setIsQuietHours(hour >= 20 || hour < 10);
        };

        // Check immediately
        checkQuietHours();

        // Check every minute
        const intervalId = setInterval(checkQuietHours, 60000);

        return () => clearInterval(intervalId);
    }, []);

    // Play the MP3 file
    const playPipipi = useCallback(async () => {
        // Check time - don't play between 20:00 (8 PM) and 10:00 (10 AM)
        const now = new Date();
        const hour = now.getHours();
        const isQuietHours = hour >= 20 || hour < 10;

        if (isQuietHours) {
            // eslint-disable-next-line no-console
            console.log(`Quiet hours (${hour}:00) - sound not played`);
            setErrorMessage(`🌙 Quiet hours (${hour}:00) - Sound muted`);
            setLastPlayed(`${new Date().toLocaleTimeString()} (muted)`);
            // Clear the error message after a few seconds
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        if (audioRef.current) {
            try {
                // Reset to beginning if already playing
                audioRef.current.currentTime = 0;

                // Play the audio
                const playPromise = audioRef.current.play();

                if (playPromise !== undefined) {
                    await playPromise;
                    // eslint-disable-next-line no-console
                    console.log("Audio played successfully");
                    setPlayCount((prev: number) => prev + 1);
                    setLastPlayed(new Date().toLocaleTimeString());
                    setErrorMessage("");
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error playing audio:", error);
                const err = error as Error;
                let errorMsg = `Play error: ${err.message}`;

                // Check for autoplay restrictions
                if (err.name === "NotAllowedError") {
                    errorMsg = "⚠️ Click 'Test Sound' button first to enable autoplay";
                } else if (err.name === "NotSupportedError") {
                    errorMsg = "Audio format not supported by browser";
                }

                setErrorMessage(errorMsg);
            }
        } else {
            setErrorMessage("Audio not initialized");
        }
    }, []);

    // Poll for music trigger
    useEffect(() => {
        const checkForTrigger = async () => {
            try {
                const response = await fetch(`/api/check-music?lastEventId=${lastEventIdRef.current}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // eslint-disable-next-line no-console
                console.log("Check music response:", data);

                setLastCheckTime(new Date().toLocaleTimeString());

                // Check both event ID and timestamp for reliability in serverless
                const isNewEvent = data.eventId > lastEventIdRef.current;
                const isNewTimestamp = data.timestamp > lastTimestampRef.current && data.timestamp > 0;

                if ((isNewEvent || isNewTimestamp) && data.timestamp > 0) {
                    // eslint-disable-next-line no-console
                    console.log(`New event detected! ID: ${data.eventId}, Timestamp: ${data.timestamp}`);
                    lastEventIdRef.current = data.eventId;
                    lastTimestampRef.current = data.timestamp;
                    await playPipipi();
                } else if (data.timestamp > 0 && lastTimestampRef.current === 0) {
                    // Initialize timestamp ref on first valid response
                    lastTimestampRef.current = data.timestamp;
                    lastEventIdRef.current = data.eventId;
                }

                setIsConnected(true);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error checking music:", error);
                setIsConnected(false);
            }
        };

        // Check every 1000ms (1 second)
        intervalRef.current = setInterval(checkForTrigger, 1000);

        // Initial check
        checkForTrigger();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [playPipipi]);

    return (
        <Container>
            <Section id="listen">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-center">Are you sure ? 🎧</h1>

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

                        {/* Audio Status */}
                        <div className="mt-4 text-sm space-y-1">
                            <p className={`${isAudioReady ? "text-green-600" : "text-yellow-600"}`}>
                                Audio: {isAudioReady ? "✓ Ready" : "⏳ Loading..."}
                            </p>
                            <p className={`${isConnected ? "text-green-600" : "text-red-600"}`}>
                                Connection: {isConnected ? "✓ Connected" : "✗ Disconnected"}
                            </p>
                            {isQuietHours && (
                                <p className="text-yellow-600 dark:text-yellow-400">
                                    🌙 Quiet Hours: Sound muted (20:00-10:00)
                                </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">Event ID: {lastEventIdRef.current}</p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs">Last check: {lastCheckTime || "Never"}</p>
                        </div>
                        {errorMessage && (
                            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 rounded text-red-700 dark:text-red-300 text-sm">
                                {errorMessage}
                            </div>
                        )}
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

                    <div className="flex flex-col gap-2 items-center">
                        <button
                            onClick={playPipipi}
                            disabled={!isAudioReady}
                            className={`px-6 py-3 rounded-lg transition-colors ${
                                isAudioReady
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                        >
                            🔊 Test Sound
                        </button>
                        <a
                            href="/sounds/pipipi.mp3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Open audio file directly
                        </a>
                    </div>
                </div>
            </Section>
        </Container>
    );
}
