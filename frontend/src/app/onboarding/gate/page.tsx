'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function GateStep() {
    const router = useRouter();
    const [isInvestor, setIsInvestor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('onboardingData');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.isInvestor) setIsInvestor(data.isInvestor);
        }
    }, []);

    const handleSelection = (val: 'yes' | 'no') => {
        setIsInvestor(val);
    };

    const handleNext = async () => {
        if (!isInvestor) return;

        const current = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        const newData = { ...current, isInvestor };
        localStorage.setItem('onboardingData', JSON.stringify(newData));

        if (isInvestor === 'yes') {
            router.push('/onboarding/portfolio');
        } else {
            await submitData(newData);
        }
    };

    const submitData = async (data: any) => {
        setLoading(true);
        try {
            // Get profile from login
            const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');

            // Calculate Cost of Living
            let costOfLiving = 25000;
            try {
                const colResponse = await api.post('/predict-col', { pincode: data.pincode });
                costOfLiving = colResponse.data?.estimated_cost || 25000;
            } catch (e) {
                console.error("COL Error defaulting", e);
            }

            const finalData = {
                ...existingProfile,
                ...data, // includes isInvestor: 'no'
                costOfLiving,
                investments: { gold: 0, fd: 0, stocks: 0, crypto: 0 },
                customExpenses: []
            };

            localStorage.setItem('userProfile', JSON.stringify(finalData));
            await api.post('/api/user/save', finalData);

            router.push('/twin-building');

        } catch (error) {
            console.error("Submission error", error);
            // push anyway for demo resilience
            router.push('/twin-building');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
                <div className="text-center mb-8">
                    <span className="text-emerald-400 text-xs font-bold tracking-wider">STEP 4 OF 5</span>
                    <h1 className="text-2xl font-bold mt-2">Are you investing?</h1>
                </div>

                <div className="space-y-4">
                    <div
                        onClick={() => handleSelection('yes')}
                        className={`cursor-pointer p-6 rounded-xl border-2 transition-all text-center ${isInvestor === 'yes' ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                    >
                        <span className="text-lg font-bold block mb-1">Yes, I am</span>
                        <span className="text-xs text-gray-400">I have Stocks, FD, or Gold</span>
                    </div>

                    <div
                        onClick={() => handleSelection('no')}
                        className={`cursor-pointer p-6 rounded-xl border-2 transition-all text-center ${isInvestor === 'no' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                    >
                        <span className="text-lg font-bold block mb-1">Not yet</span>
                        <span className="text-xs text-gray-400">I want to start</span>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button onClick={() => router.back()} className="w-1/3 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!isInvestor || loading}
                            className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isInvestor === 'yes' ? 'Next: Portfolio' : 'Finish Setup')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
