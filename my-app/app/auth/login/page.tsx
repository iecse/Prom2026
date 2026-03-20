'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ChangeEvent } from 'react';
import NeonShell from '@/app/components/NeonShell';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || 'Invalid credentials');
                setLoading(false);
                return;
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            router.push('/auth/profile');
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <NeonShell headline="Sign in" subhead="Use your credentials to access Prometheus">
            <div className="mx-auto flex max-w-xl flex-col gap-6">
                <form className="grid grid-cols-1 gap-4 bg-white/5 border border-cyan-400/20 rounded-lg p-6 backdrop-blur" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">Email</span>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="flex flex-col gap-1 text-white">
                        <span className="text-sm font-medium text-cyan-200">Password</span>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                            placeholder="••••••••"
                        />
                    </label>

                    {error && (
                        <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-400 to-magenta-500 px-4 py-2 text-black font-semibold shadow-[0_0_20px_rgba(0,245,255,0.5)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="text-sm text-gray-300">
                    New here?{' '}
                    <Link href="/auth/register" className="font-semibold text-cyan-300 hover:text-white">
                        Create an account
                    </Link>
                </p>
            </div>
        </NeonShell>
    );
}