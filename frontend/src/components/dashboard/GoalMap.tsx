'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const goals = [
    { name: 'Emergency Fund', status: 'green', message: '3 months covered' },
    { name: 'Retirement (10Cr)', status: 'red', message: 'Projected: 2Cr' },
    { name: 'Home Purchase', status: 'yellow', message: 'On track but tight' },
    { name: 'Travel', status: 'green', message: 'Fully funded' },
];

export default function GoalMap() {
    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="mb-4 flex items-center gap-2">
                <Target className="text-emerald-400" size={20} />
                <h3 className="text-xl font-semibold text-gray-200">Goal Achievability Map</h3>
            </div>

            <div className="space-y-4">
                {goals.map((goal, i) => (
                    <motion.div
                        key={goal.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${goal.status === 'green' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                    goal.status === 'yellow' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                                        'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                }`} />
                            <span className="font-medium text-gray-300">{goal.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{goal.message}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
