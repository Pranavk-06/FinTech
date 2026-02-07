'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Papa from 'papaparse';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

const schema = z.object({
    monthlyIncome: z.coerce.number().min(0),
    monthlySpending: z.coerce.number().min(0),
    expectedSavings: z.coerce.number().min(0)
});

export default function FinancesStep() {
    const router = useRouter();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [fileName, setFileName] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('onboardingData');
        if (saved) {
            const data = JSON.parse(saved);
            setValue('monthlyIncome', data.monthlyIncome || 0);
            setValue('monthlySpending', data.monthlySpending || 0);
            setValue('expectedSavings', data.expectedSavings || 0);
        }
    }, [setValue]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                let totalIncome = 0;
                let totalSpending = 0;

                results.data.forEach((row: any) => {
                    // Scenario 1: 'Amount' column (Positive = Income, Negative = Spending)
                    if (row['Amount']) {
                        const val = parseFloat(row['Amount']);
                        if (!isNaN(val)) {
                            if (val > 0) totalIncome += val;
                            else totalSpending += Math.abs(val);
                        }
                    }
                    // Scenario 2: 'Credit' and 'Debit' columns
                    else if (row['Credit'] || row['Debit']) {
                        const credit = parseFloat(row['Credit']) || 0;
                        const debit = parseFloat(row['Debit']) || 0;
                        totalIncome += credit;
                        totalSpending += debit;
                    }
                });

                // Update form values if we found data
                if (totalIncome > 0 || totalSpending > 0) {
                    setValue('monthlyIncome', Math.round(totalIncome));
                    setValue('monthlySpending', Math.round(totalSpending));
                    // Auto-calculate expected savings (Income - Spending)
                    const savings = Math.max(0, totalIncome - totalSpending);
                    setValue('expectedSavings', Math.round(savings));
                }
            },
            error: (err) => {
                console.error("CSV Parse Error:", err);
            }
        });
    };

    const onSubmit = (data: any) => {
        const current = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({ ...current, ...data }));
        router.push('/onboarding/goals');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
                <div className="text-center mb-8">
                    <span className="text-emerald-400 text-xs font-bold tracking-wider">STEP 2 OF 5</span>
                    <h1 className="text-2xl font-bold mt-2">Money Matters</h1>
                    <p className="text-gray-400 text-sm mt-2">Enter manually or upload a bank statement.</p>
                </div>

                <div className="mb-6">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {fileName ? (
                                <>
                                    <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                                    <p className="text-sm text-gray-300">{fileName}</p>
                                    <p className="text-xs text-emerald-400">Data Auto-filled!</p>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload CSV</span></p>
                                    <p className="text-xs text-gray-500">Supports 'Amount' or 'Credit/Debit' cols</p>
                                </>
                            )}
                        </div>
                        <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                    </label>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Monthly Income (₹)</label>
                        <input type="number" {...register('monthlyIncome')} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Monthly Spending (₹)</label>
                        <input type="number" {...register('monthlySpending')} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Target Savings (₹)</label>
                        <input type="number" {...register('expectedSavings')} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={() => router.back()} className="w-1/3 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                            Back
                        </button>
                        <button type="submit" className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors">
                            Next: Goals
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
