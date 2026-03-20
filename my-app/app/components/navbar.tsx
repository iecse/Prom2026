'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthed, setIsAuthed] = useState(false);
    const [freePass, setFreePass] = useState(false);

    const readToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const syncAuth = () => setIsAuthed(Boolean(readToken()));

    useEffect(() => {
        syncAuth();
        window.addEventListener('storage', syncAuth);
        window.addEventListener('visibilitychange', syncAuth);
        return () => {
            window.removeEventListener('storage', syncAuth);
            window.removeEventListener('visibilitychange', syncAuth);
        };
    }, []);

    useEffect(() => {
        syncAuth();
        const token = readToken();
        if (!token) {
            setFreePass(false);
            return;
        }

        const fetchFreePass = async () => {
            try {
                const res = await fetch('/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data?.user) {
                    setFreePass(Boolean(data.user.freePass));
                }
            } catch {
                // ignore
            }
        };

        fetchFreePass();
    }, [pathname]);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        setIsAuthed(false);
        router.push('/');
    };

    const navLinks = isAuthed
        ? [
                { href: '/events', label: 'Events' },
                ...(!freePass ? [{ href: '/payment', label: 'Payment' }] : []),
                { href: '/auth/profile', label: 'Profile' },
            ]
        : [];

    return (
        <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur border-b border-cyan-400/20">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link href="/" className="flex items-center gap-3">
                    <Image src="/IECSE.svg" alt="IECSE logo" width={120} height={80} priority />
                </Link>

                <div className="flex items-center gap-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                                pathname.startsWith(link.href)
                                    ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,245,255,0.35)]'
                                    : 'text-cyan-100 hover:bg-white/5'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {isAuthed ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-md border border-cyan-400/40 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-white/5 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_12px_rgba(0,245,255,0.35)] hover:bg-cyan-300 transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}