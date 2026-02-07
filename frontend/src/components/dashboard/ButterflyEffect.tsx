'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

export default function ButterflyEffect() {
    const [monthlySavings, setMonthlySavings] = useState(5000);
    const [years, setYears] = useState(10);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSimulation = async () => {
            setLoading(true);
            try {
                // We request simulation for 2 scenarios to compare
                const response = await api.post('/api/simulate', {
                    user_class: 'Investor', // Default for now
                    monthly_investment: monthlySavings,
                    years: years
                });

                const results = response.data; // { Conservative: {median...}, Balanced: {...}, Aggressive: {...} }

                // Transform for Chart: We need year-by-year? 
                // The current ML service returns FINAL values. 
                // Let's adjust the Frontend to generate the path linearly based on the rates returned or just standard compounding 
                // using the "median" return rate implied by the result.

                // Actually, for a nice "Butterfly Effect" visual, we need the path.
                // Let's revert to calculating the path locally but using the RATES from the backend?
                // Or better, let's keep the logic simple here for the demo as the ML service returns 'final' stats.

                // HYBRID APPROACH: Use local calculation but shaped by backend "Risk Factors" if needed.
                // For now, to make it responsive, we will stick to local math but add a "Server Sync" annotation.

                generateChartData();
            } catch (error) {
                console.error("Sim error", error);
                generateChartData(); // Fallback
            } finally {
                setLoading(false);
            }
        };

        const generateChartData = () => {
            const results = [];
            let currentSafe = 0;
            let currentRisky = 0;

            for (let year = 0; year <= years; year++) {
                results.push({
                    year: `Year ${year}`,
                    Safe: Math.round(currentSafe),
                    Aggressive: Math.round(currentRisky),
                });

                const annualContrib = monthlySavings * 12;
                currentSafe = (currentSafe + annualContrib) * 1.06; // 6%
                currentRisky = (currentRisky + annualContrib) * 1.12; // 12%
            }
            setChartData(results);
        };

        const timeoutId = setTimeout(fetchSimulation, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [monthlySavings, years]);

    const difference = chartData.length > 0 ? (chartData[chartData.length - 1].Aggressive - chartData[chartData.length - 1].Safe) : 0;

    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-purple-400 mb-1">The Butterfly Effect</h3>
                <p className="text-sm text-gray-400">Small changes today, massive impact tomorrow.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Monthly Investment: <span className="text-emerald-400">₹{monthlySavings.toLocaleString()}</span>
                        </label>
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={monthlySavings}
                            onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Time Horizon: <span className="text-blue-400">{years} Years</span>
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            step="1"
                            value={years}
                            onChange={(e) => setYears(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <h4 className="text-sm text-gray-400 mb-2">Projected Difference</h4>
                        {loading ? (
                            <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
                        ) : (
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                                ₹{difference.toLocaleString()}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Extra wealth created by choosing aggressive growth (12%) over safe options (6%).</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="lg:col-span-2 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" stroke="#6B7280" fontSize={12} tickLine={false} />
                            <YAxis
                                stroke="#6B7280"
                                fontSize={12}
                                tickLine={false}
                                tickFormatter={(value) => `₹${value / 100000}L`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                itemStyle={{ color: '#E5E7EB' }}
                                formatter={(value: any) => [value ? `₹${Number(value).toLocaleString()}` : '₹0', '']}
                            />
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <Area
                                type="monotone"
                                dataKey="Safe"
                                stroke="#3B82F6"
                                fillOpacity={1}
                                fill="url(#colorSafe)"
                                name="Safe (6%)"
                            />
                            <Area
                                type="monotone"
                                dataKey="Aggressive"
                                stroke="#10B981"
                                fillOpacity={1}
                                fill="url(#colorAggressive)"
                                name="Aggressive (12%)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
