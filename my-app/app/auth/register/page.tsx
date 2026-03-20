'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NeonShell from '@/app/components/NeonShell';

type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirm: string;
};

export default function Register() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = (key: keyof FormState) =>
        (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setForm((prev) => ({ ...prev, [key]: e.target.value }));
        };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || 'Registration failed');
                setSubmitting(false);
                return;
            }

            // Optional: persist token for later use
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            router.push('/auth/login');
        } catch {
            setError('Something went wrong. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <NeonShell headline="Create an account" subhead="Join Prometheus and access all events.">
            <div className="mx-auto flex max-w-3xl flex-col gap-8">
                <form className="grid grid-cols-1 gap-4 md:grid-cols-2 bg-white/5 border border-cyan-400/20 rounded-lg p-6 backdrop-blur" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">First name</span>
                        <input
                            type="text"
                            required
                            value={form.firstName}
                            onChange={updateField('firstName')}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="Ada"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">Last name</span>
                        <input
                            type="text"
                            required
                            value={form.lastName}
                            onChange={updateField('lastName')}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="Lovelace"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">Email</span>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={updateField('email')}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">Phone number</span>
                        <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={updateField('phone')}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="9876543210"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">Password</span>
                        <input
                            type="password"
                            required
                            value={form.password}
                            onChange={updateField('password')}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="••••••••"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">Confirm password</span>
                        <input
                            type="password"
                            required
                            value={form.passwordConfirm}
                            onChange={updateField('passwordConfirm')}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="••••••••"
                        />
                    </label>

                    {error && (
                        <div className="md:col-span-2 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-400 to-magenta-500 px-5 py-2 text-black font-semibold shadow-[0_0_20px_rgba(0,245,255,0.5)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Submitting...' : 'Register'}
                        </button>
                        <p className="text-sm text-gray-300">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="font-semibold text-cyan-300 hover:text-white">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </NeonShell>
    );
}