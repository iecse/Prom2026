'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { events } from './components/events';
import NeonShell from '@/app/components/NeonShell';

interface RegisterResponse {
  message?: string;
  registeredEvents?: Array<{ eventName: string }>;
}

type EventState = {
  registering: boolean;
  registered: boolean;
  error: string | null;
};

type EventId = (typeof events)[number]['id'];

const normalize = (value?: string | null) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const resolveEventId = (name?: string | null): EventId | null => {
  const norm = normalize(name);
  if (!norm) return null;

  for (const ev of events) {
    const idNorm = normalize(ev.id);
    const titleNorm = normalize(ev.title);
    if (norm === idNorm || norm === titleNorm) return ev.id;
  }

  if (norm.includes('orderofchaos')) return 'ooc';
  if (norm.includes('techquiz')) return 'techQuiz';
  if (norm.includes('creator') && norm.includes('workshop')) return 'creatorWS';
  if (norm.includes('dev') && norm.includes('workshop')) return 'devWS';
  if (norm.includes('modeler') && norm.includes('workshop')) return 'modelerWS';
  if (norm.includes('enigma')) return 'enigma';
  if (norm.includes('nearprotocol')) return 'nearProtocol';
  return null;
};

export default function EventsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Record<string, EventState>>({});
  const [statusLoading, setStatusLoading] = useState(true);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    const token = getToken();

    const loadRegistered = async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) return;

        const registeredEvents = (data?.user?.registeredEvents as Array<{ eventName?: string }> | undefined) || [];
        const initial: Record<string, EventState> = {};

        events.forEach((ev) => {
          initial[ev.id] = { registering: false, registered: ev.registered || false, error: null };
        });

        registeredEvents.forEach((entry) => {
          const targetId = resolveEventId(entry.eventName);
          if (targetId && initial[targetId]) {
            initial[targetId] = { ...initial[targetId], registered: true };
          }
        });

        setStatus(initial);
      } catch {
        // Ignore preload errors; UI will still allow manual registration
      } finally {
        setStatusLoading(false);
      }
    };

    // If not logged in, still set default status so UI renders once
    if (!token) {
      const initial: Record<string, EventState> = {};
      events.forEach((ev) => {
        initial[ev.id] = { registering: false, registered: ev.registered || false, error: null };
      });
      setStatus(initial);
      setStatusLoading(false);
      return;
    }

    loadRegistered();
  }, []);

  const handleRegister = async (eventId: string) => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setStatus((prev) => ({
      ...prev,
      [eventId]: { ...(prev[eventId] || { registering: false, registered: false, error: null }), registering: true, error: null },
    }));

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventName: eventId }),
      });

      const data = (await res.json()) as RegisterResponse;
      if (!res.ok) {
        const message = data?.message || 'Registration failed';
        setStatus((prev) => ({
          ...prev,
          [eventId]: { ...(prev[eventId] || { registering: false, registered: false, error: null }), registering: false, error: message },
        }));
        return;
      }

      setStatus((prev) => {
        const next = { ...prev };

        // Mark current event
        next[eventId] = {
          ...(next[eventId] || { registering: false, registered: false, error: null }),
          registering: false,
          registered: true,
          error: null,
        };

        // Also mark any events returned from server (in case of legacy names)
        (data.registeredEvents || []).forEach((entry) => {
          const targetId = resolveEventId(entry.eventName);
          if (targetId) {
            next[targetId] = {
              ...(next[targetId] || { registering: false, registered: false, error: null }),
              registering: false,
              registered: true,
              error: null,
            };
          }
        });

        return next;
      });
    } catch {
      setStatus((prev) => ({
        ...prev,
        [eventId]: { ...(prev[eventId] || { registering: false, registered: false, error: null }), registering: false, error: 'Something went wrong' },
      }));
    }
  };

  if (statusLoading) {
    return (
      <NeonShell headline="Events" subhead="Register for Prometheus events. Payment-required events need completed payment status.">
        <div className="text-sm text-gray-300">Loading your registrations...</div>
      </NeonShell>
    );
  }

  return (
    <NeonShell headline="Events" subhead="Register for Prometheus events. Payment-required events need completed payment status.">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Events</p>
            <h1 className="text-3xl font-semibold text-white">Choose your track</h1>
          </div>
          <Link
            href="/auth/profile"
            className="inline-flex items-center justify-center rounded-md border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-white/5 transition-colors"
          >
            View profile
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const state = status[event.id];
            return (
              <article key={event.id} className="flex h-full flex-col rounded-lg border border-cyan-400/20 bg-white/5 p-5 shadow-[0_0_18px_rgba(0,245,255,0.12)]">
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{event.date}</p>
                  <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                  <p className="text-sm text-gray-300">{event.time}</p>
                </div>

                <p className="mt-3 text-sm text-gray-200 flex-1">{event.about}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <Badge tone={event.requiresPass ? 'purple' : 'green'}>
                    {event.requiresPass ? 'Pass required' : 'Free'}
                  </Badge>
                  <Badge tone={state?.registered ? 'green' : 'red'}>
                    {state?.registered ? 'Registered' : 'Not registered'}
                  </Badge>
                </div>

                {state?.error ? (
                  <div className="mt-3 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {state.error}
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={state?.registered || state?.registering}
                    onClick={() => handleRegister(event.id)}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white border border-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.35)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state?.registered ? 'Registered' : state?.registering ? 'Registering...' : 'Register'}
                  </button>
                  <Link href={`/events/${event.id}`} className="text-sm font-semibold text-cyan-300 hover:text-white">
                    Details
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </NeonShell>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'purple' | 'green' | 'red' }) {
  const styles = {
    purple: 'bg-purple-500/20 text-purple-100 border border-purple-300/40',
    green: 'bg-green-500/20 text-green-100 border border-green-300/40',
    red: 'bg-red-500/20 text-red-100 border border-red-300/40',
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${styles}`}>{children}</span>;
}
