'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Rent', amount: 15000, type: 'Needs' },
    { name: 'Food', amount: 8000, type: 'Needs' },
    { name: 'Travel', amount: 3000, type: 'Needs' },
    { name: 'Shopping', amount: 5000, type: 'Wants' },
    { name: 'Swiggy/Zomato', amount: 4500, type: 'Wants' },
    { name: 'SIP', amount: 5000, type: 'Savings' },
];

export default function SpendingAnalysis() {
    return (
        <div className="w-full h-full min-h-[300px] flex flex-col justify-center">
            <h3 className="text-gray-300 text-sm mb-2 text-center">Monthly Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        itemStyle={{ color: '#E5E7EB' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.type === 'Needs' ? '#10B981' : entry.type === 'Wants' ? '#EF4444' : '#3B82F6'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Needs</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Wants</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Savings</div>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300 text-center"
            >
                ⚠️ "Your Swiggy bill is chasing your SIPs."
            </motion.div>
        </div>
    );
}
