'use client';
}
    );
        </Container>
            </Section>
                </div>
                    </p>
                        Click the button to play music on all browsers viewing the /browserbrowser page!
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    </button>
                        {isPlaying ? '🎵 Playing...' : '▶️ Play Pipipi'}
                    >
                        `}
                            text-white shadow-lg hover:shadow-xl
                            }
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                                ? 'bg-gray-400 cursor-not-allowed' 
                            ${isPlaying 
                            transition-all duration-200 transform
                            px-8 py-4 text-xl font-bold rounded-lg
                        className={`
                        disabled={isPlaying}
                        onClick={handlePlayMusic}
                    <button
                    </h1>
                        Boom Boom 🎵
                    <h1 className="text-4xl md:text-6xl font-bold text-center">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <Section>
        <Container>
    return (

    };
        }
            setIsPlaying(false);
            console.error('Error triggering music:', error);
        } catch (error) {
            setTimeout(() => setIsPlaying(false), 1000);

            });
                method: 'POST',
            await fetch('/api/trigger-music', {
            // Trigger the music on all browserbrowser pages
        try {

        setIsPlaying(true);
    const handlePlayMusic = async () => {

    const [isPlaying, setIsPlaying] = useState(false);
export default function BoomBoomPage() {

import Section from '@/components/Section';
import Container from '@/components/Container';
import React, { useState } from 'react';


