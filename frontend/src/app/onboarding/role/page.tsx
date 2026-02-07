'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    role: z.enum(['Student', 'Professional']),
    pincode: z.string().length(6, { message: 'Must be 6 digits' })
});

export default function RoleStep() {
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        const saved = localStorage.getItem('onboardingData');
        if (saved) {
            const data = JSON.parse(saved);
            setValue('role', data.role || 'Student');
            setValue('pincode', data.pincode || '');
        }
    }, [setValue]);

    const onSubmit = (data: any) => {
        const current = JSON.parse(localStorage.getItem('onboardingData') || '{}');
        localStorage.setItem('onboardingData', JSON.stringify({ ...current, ...data }));
        router.push('/onboarding/finances');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
                <div className="text-center mb-8">
                    <span className="text-emerald-400 text-xs font-bold tracking-wider">STEP 1 OF 5</span>
                    <h1 className="text-2xl font-bold mt-2">Who are you?</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Role</label>
                        <select {...register('role')} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                            <option value="Student">Student</option>
                            <option value="Professional">Working Professional</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Pincode</label>
                        <input {...register('pincode')} maxLength={6} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" placeholder="Where do you live?" />
                        {errors.pincode && <p className="text-red-400 text-sm mt-1">{(errors.pincode as any).message}</p>}
                    </div>

                    <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors">
                        Next: Finances
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
