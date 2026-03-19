'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NeonShell from '@/app/components/NeonShell';

interface ProfileResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    paymentStatus?: string;
    transactionId?: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileResponse['user'] | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          router.replace('/auth/login');
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data?.message || 'Could not load profile');
        } else {
          setProfile(data.user);
        }
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <NeonShell headline="Profile" subhead="Loading your details...">
        <p className="text-sm text-gray-300">Loading profile…</p>
      </NeonShell>
    );
  }

  if (error) {
    return (
      <NeonShell headline="Profile" subhead="Something went wrong">
        <div className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
        <button
          onClick={() => router.refresh()}
          className="mt-3 inline-flex w-fit items-center justify-center rounded-md bg-gradient-to-r from-cyan-400 to-magenta-500 px-4 py-2 text-black font-semibold shadow-[0_0_20px_rgba(0,245,255,0.5)] transition hover:brightness-110"
        >
          Retry
        </button>
      </NeonShell>
    );
  }

  if (!profile) return null;

  return (
    <NeonShell headline={`${profile.firstName} ${profile.lastName}`} subhead="Signed in to Prometheus">
      <div className="flex items-center justify-between gap-3 bg-white/5 border border-cyan-400/20 rounded-lg px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Signed in</p>
          <p className="text-sm text-gray-300">{profile.email}</p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center justify-center rounded-md bg-cyan-400 px-3 py-2 text-black text-sm font-semibold hover:bg-cyan-300 transition"
        >
          Log out
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoCard label="Phone" value={profile.phone || '—'} />
        <InfoCard label="Payment Status" value={profile.paymentStatus || 'pending'} />
        <InfoCard label="Transaction ID" value={profile.transactionId || '—'} />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/events"
          className="inline-flex items-center justify-center rounded-md bg-cyan-400 px-4 py-2 text-black font-semibold hover:bg-cyan-300 transition"
        >
          View events
        </Link>
        <Link
          href="/payment"
          className="inline-flex items-center justify-center rounded-md border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-white/5 transition-colors"
        >
          Go to payment
        </Link>
      </div>
    </NeonShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cyan-400/20 bg-white/5 px-4 py-3 shadow-[0_0_12px_rgba(0,245,255,0.1)]">
      <p className="text-xs uppercase tracking-widest text-cyan-200">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
