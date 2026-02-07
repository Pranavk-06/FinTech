'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RegretSimulator() {
    const [amount, setAmount] = useState(1000000); // 10 Lakhs
    const [years, setYears] = useState(10);

    const inflationRate = 0.07; // 7%

    const data = Array.from({ length: years + 1 }, (_, i) => {
        const rawValue = amount;
        const realValue = amount / Math.pow(1 + inflationRate, i);
        return {
            year: `Year ${i}`,
            Raw: rawValue,
            Real: Math.round(realValue)
        };
    });

    const loss = amount - data[data.length - 1].Real;
    const lossPercentage = Math.round((loss / amount) * 100);

    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-red-400">Regret Simulator</h3>
                <p className="text-xs text-gray-500">The Silent Killer: Inflation (7%)</p>
            </div>

            <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">If you keep <span className="text-white font-bold">₹{(amount / 100000).toFixed(1)} Lakhs</span> in cash for <span className="text-white font-bold">{years} years</span>:</div>
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-xs text-red-300 block">Purchasing Power Lost</span>
                            <span className="text-2xl font-bold text-red-500">₹{loss.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-red-500">{lossPercentage}%</span>
                            <span className="text-xs text-red-300 block">Value Eroded</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year" stroke="#6B7280" fontSize={10} tickLine={false} interval={2} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                            formatter={(value: any) => [value ? `₹${Number(value).toLocaleString()}` : '₹0', 'Purchasing Power']}
                        />
                        <Area type="monotone" dataKey="Real" stroke="#EF4444" fillOpacity={1} fill="url(#colorReal)" />
                        <Area type="monotone" dataKey="Raw" stroke="#4B5563" fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex gap-4">
                <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Cash Amount</label>
                    <input
                        type="range"
                        min="100000" max="10000000" step="100000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Duration (Years)</label>
                    <input
                        type="range"
                        min="5" max="30" step="1"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>
            </div>
        </div>
    );
}
