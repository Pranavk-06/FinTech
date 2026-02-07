'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Shield, DollarSign, Wallet } from 'lucide-react';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function LearnInvesting() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ income: number, spending: number } | null>(null);

    useEffect(() => {
        const profile = localStorage.getItem('userProfile');
        if (profile) {
            const { monthlyIncome, monthlySpending } = JSON.parse(profile);
            setUserData({
                income: Number(monthlyIncome) || 0,
                spending: Number(monthlySpending) || 0
            });
        }
    }, []);

    const chartData = userData ? [
        { name: 'Your Spending', amount: userData.spending, color: '#ef4444' }, // Red
        { name: 'Ideal Max (80%)', amount: userData.income * 0.8, color: '#3b82f6' }, // Blue
        { name: 'Investable Gap', amount: Math.max(0, userData.income - userData.spending), color: '#10b981' } // Green
    ] : [];

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <AuthenticatedNavbar />

            <div className="max-w-4xl mx-auto p-6 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Why Invest?</h1>
                    <p className="text-xl text-gray-400">Your savings are silently shrinking. Here's the math.</p>
                </motion.div>

                {/* Reality Check Graph */}
                {userData && userData.income > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-12 bg-gray-900 border border-gray-800 rounded-2xl p-6"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Wallet className="text-purple-400" />
                            Actual vs. Ideal
                        </h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']}
                                    />
                                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-gray-400 mt-4 text-center">
                            {userData.spending > userData.income * 0.8
                                ? "⚠️ You are spending more than the recommended 80% of your income."
                                : "✅ You are within safe spending limits. Invest the surplus!"}
                        </p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: 'Savings Account', rate: '3%', result: '₹1.34 Lakhs', icon: <Shield className="text-blue-400" />, color: 'blue' },
                        { title: 'Gold / FD', rate: '7%', result: '₹1.96 Lakhs', icon: <DollarSign className="text-yellow-400" />, color: 'yellow' },
                        { title: 'Nifty 50 (Index)', rate: '12%', result: '₹3.10 Lakhs', icon: <TrendingUp className="text-emerald-400" />, color: 'emerald' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-gray-900 border border-gray-800 p-6 rounded-xl relative overflow-hidden group hover:border-${item.color}-500/50 transition-colors`}
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${item.color}-500`}>
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <div className="text-3xl font-bold mb-1">{item.rate}</div>
                            <p className="text-xs text-gray-500 mb-4">Avg. Annual Return</p>

                            <div className="pt-4 border-t border-gray-800">
                                <p className="text-sm text-gray-400">₹1 Lakh becomes in 10y:</p>
                                <div className={`text-xl font-bold text-${item.color}-400`}>{item.result}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-500/20 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to beat Inflation?</h2>
                    <p className="text-gray-400 mb-6">Start your journey as an investor today. Even ₹500/month makes a difference.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-all transform hover:scale-105"
                    >
                        Start Simulation <ArrowRight size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
}
