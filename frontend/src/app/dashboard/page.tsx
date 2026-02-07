'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SpendingAnalysis from '@/components/dashboard/SpendingAnalysis';
import FutureAvatars from '@/components/dashboard/FutureAvatars';
import AIAdvisor from '@/components/dashboard/AIAdvisor';
import ButterflyEffect from '@/components/dashboard/ButterflyEffect';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';

import GoalMap from '@/components/dashboard/GoalMap';
import RegretSimulator from '@/components/dashboard/RegretSimulator';
import VoiceAdvisor from '@/components/dashboard/VoiceAdvisor';

function UserClassWrapper() {
    const [userClass, setUserClass] = useState('Unknown');

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                if (parsed.userClass) setUserClass(parsed.userClass);
                else if (parsed.isInvestor === 'yes') setUserClass('Investor');
                else setUserClass('Survivor');
            } catch (e) { }
        } else {
            // Redirect to Login if no profile
            window.location.href = '/login';
        }
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* 1. Goals & 2. Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <GoalMap />
                </motion.div>
                <motion.div variants={itemVariants} className="h-full">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-full">
                        <h3 className="text-xl font-semibold text-blue-400 mb-4">4 Futures</h3>
                        <FutureAvatars userClass={userClass} />
                    </div>
                </motion.div>
            </div>

            {/* 3. Butterfly Effect */}
            <motion.div variants={itemVariants}>
                <ButterflyEffect />
            </motion.div>

            {/* 4. AI Advisor & 5. Regret Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants} className="h-full">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-full">
                        <h3 className="text-xl font-semibold text-purple-400 mb-4">AI Market Advisor</h3>
                        <AIAdvisor />
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RegretSimulator />
                </motion.div>
            </div>

            {/* 6. Voice Advisor */}
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto w-full">
                <VoiceAdvisor userClass={userClass} />
            </motion.div>

        </motion.div>
    );
}

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <AuthenticatedNavbar />

            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                <UserClassWrapper />
            </div>
        </div>
    );
}
