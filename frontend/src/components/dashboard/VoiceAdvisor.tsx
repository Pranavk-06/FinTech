'use client';

import { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';

export default function VoiceAdvisor({ userClass = 'Unknown' }: { userClass?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const speakAdvice = () => {
        if ('speechSynthesis' in window) {
            if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance();
            utterance.text = getAdviceText(userClass);
            utterance.rate = 1;
            utterance.pitch = 1;

            utterance.onend = () => setIsPlaying(false);

            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
        } else {
            alert("Sorry, your browser doesn't support text-to-speech.");
        }
    };

    const getAdviceText = (role: string) => {
        if (role === 'YOLO') return "Hey there! I see you're enjoying life, but your future self is worried. You're burning through cash too fast. Please, start a small S I P today. Even 500 rupees matters.";
        if (role === 'Survivor') return "I know things are tight right now. Focus on building an emergency fund first. Just 3 months of expenses. You can do this.";
        if (role === 'Saver') return "Great job saving! But keeping money in the bank is losing to inflation. It's time to take calculated risks. Look into Index Funds.";
        if (role === 'Investor') return "You're doing fantastic! Your portfolio is growing. Consider diversifying into international equity or gold to hedge against market crashes.";
        return "Welcome to your financial digital twin. I'm here to guide you towards wealth.";
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 rounded-xl border border-indigo-500/30 flex flex-col items-center text-center">
            <div className="mb-4 relative">
                <div className={`w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                    <Volume2 size={32} className="text-white" />
                </div>
                {isPlaying && (
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-400 animate-ping opacity-75"></div>
                )}
            </div>

            <h3 className="text-xl font-bold text-indigo-300 mb-2">Future Voice</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
                Listen to a message from your future self based on your current trajectory.
            </p>

            <button
                onClick={speakAdvice}
                className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${isPlaying
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30'
                    }`}
            >
                {isPlaying ? 'Stop Listening' : 'Hear Advice'}
            </button>
        </div>
    );
}
