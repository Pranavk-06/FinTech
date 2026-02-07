'use client';

import { motion } from 'framer-motion';

const futures = [
    { name: 'YOLO', description: 'Live for today, worry tomorrow.', color: 'bg-red-500', icon: '💸' },
    { name: 'Survivor', description: 'Getting by, paycheck to paycheck.', color: 'bg-orange-500', icon: '😰' },
    { name: 'Saver', description: 'Safe, secure, but slow growth.', color: 'bg-blue-500', icon: '🛡️' },
    { name: 'Investor', description: 'Wealth compounding while you sleep.', color: 'bg-emerald-500', icon: '🚀' },
];

export default function FutureAvatars({ userClass = 'Unknown' }: { userClass?: string }) {
    // Normalize userClass for matching
    const normalizedClass = userClass === 'Smart Saver' ? 'Investor' : userClass;

    return (
        <div className="grid grid-cols-2 gap-4 mt-2">
            {futures.map((future, index) => {
                const isMatch = normalizedClass === future.name;
                // Conditional styling based on match
                const activeStyle = `bg-${future.color.replace('bg-', '')}/20 border-${future.color.replace('bg-', '')} ring-1 ring-${future.color.replace('bg-', '')}`;
                const inactiveStyle = 'bg-gray-800 border-gray-700 hover:border-gray-600 opacity-60 hover:opacity-100';

                // Manual color mapping because Tailwind template literals can be tricky with JIT
                let borderColor = 'border-gray-700';
                let bgColor = 'bg-gray-800';

                if (isMatch) {
                    if (future.name === 'YOLO') { borderColor = 'border-red-500'; bgColor = 'bg-red-500/20'; }
                    if (future.name === 'Survivor') { borderColor = 'border-orange-500'; bgColor = 'bg-orange-500/20'; }
                    if (future.name === 'Saver') { borderColor = 'border-blue-500'; bgColor = 'bg-blue-500/20'; }
                    if (future.name === 'Investor') { borderColor = 'border-emerald-500'; bgColor = 'bg-emerald-500/20'; }
                }

                return (
                    <motion.div
                        key={future.name}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer group ${isMatch ? `${borderColor} ${bgColor} ring-1` : inactiveStyle}`}
                    >
                        <div className={`w-8 h-8 ${future.color} rounded-full flex items-center justify-center text-lg mb-2 shadow-lg ${isMatch ? 'scale-110 shadow-emerald-500/20' : ''}`}>
                            {future.icon}
                        </div>
                        <h4 className={`font-bold text-sm ${isMatch ? 'text-white' : 'text-gray-400'}`}>{future.name}</h4>
                        <p className="text-xs text-gray-500 leading-tight mt-1">{future.description}</p>
                    </motion.div>
                );
            })}
        </div>
    );
}
