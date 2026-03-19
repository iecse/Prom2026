'use client';

import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NeonShell from '@/app/components/NeonShell';

type OrderPayload = {
  orderId: string;
  amount: number;
  upiLink: string;
  qrDataUrl: string;
  status: 'pending' | 'paid' | 'rejected';
};

export default function PaymentPage() {
  const router = useRouter();
  const [utr, setUtr] = useState('');
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const canSubmit = Boolean(order && utr.trim().length >= 6);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const loadOrder = async () => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setInitializing(true);
    setError(null);
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Could not create payment order');
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError('Could not reach payment service');
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!order) {
      setError('No active order. Please refresh.');
      return;
    }

    if (!canSubmit) {
      setError('Enter your UTR to continue.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payment/submit-utr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.orderId, utr }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Could not submit payment');
        setLoading(false);
        return;
      }

      setMessage('UTR submitted. Await manual verification.');
      setLoading(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <NeonShell headline="Complete your payment" subhead="Scan the QR, pay, then enter your UTR for manual verification.">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        {initializing && <div className="text-sm text-gray-300">Preparing your payment order…</div>}

        {order && (
          <div className="text-sm text-gray-300 space-y-1">
            <div className="flex flex-wrap gap-3 text-cyan-200">
              <span className="rounded border border-cyan-400/30 bg-white/5 px-3 py-1">Order: {order.orderId}</span>
              <span className="rounded border border-cyan-400/30 bg-white/5 px-3 py-1">Amount: ₹{order.amount.toFixed(2)}</span>
            </div>
            <p>
              UPI link: <a href={order.upiLink} className="text-cyan-300 underline" target="_blank" rel="noreferrer">{order.upiLink}</a>
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-cyan-400/20 bg-white/5 p-4 shadow-[0_0_12px_rgba(0,245,255,0.15)] flex flex-col items-center justify-center">
            <div className="mb-3 text-sm text-gray-300">Scan to pay</div>
            <div className="relative flex items-center justify-center rounded-lg border border-cyan-400/30 bg-black/60 p-4">
              {order?.qrDataUrl ? (
                // Simple QR rendering from server-generated data URL
                // eslint-disable-next-line @next/next/no-img-element
                <img src={order.qrDataUrl} alt="UPI QR" className="h-52 w-52" />
              ) : (
                <div className="text-sm text-gray-400">QR loading…</div>
              )}
            </div>
            <p className="mt-3 text-xs text-gray-400 text-center">
              Use your UPI app to pay. Keep the transaction/UTR ID for verification.
            </p>
            <button
              type="button"
              onClick={loadOrder}
              disabled={initializing}
              className="mt-3 inline-flex items-center justify-center rounded-md border border-cyan-400/40 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-white/5 transition-colors disabled:opacity-60"
            >
              Refresh order
            </button>
          </div>

          <form onSubmit={submitPayment} className="rounded-lg border border-cyan-400/20 bg-white/5 p-5 shadow-[0_0_12px_rgba(0,245,255,0.15)] flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-white">
              <span className="text-sm font-medium text-cyan-200">Transaction / UTR ID</span>
              <input
                type="text"
                required
                value={utr}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUtr(e.target.value)}
                className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                placeholder="Enter your UTR"
              />
            </label>

            {error && (
              <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-md border border-green-400/40 bg-green-500/10 px-3 py-2 text-sm text-green-200">
                {message}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading || !canSubmit}
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-400 to-magenta-500 px-4 py-2 text-black font-semibold shadow-[0_0_14px_rgba(0,245,255,0.4)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'I have paid'}
              </button>
              <button
                type="button"
                onClick={() => setUtr('')}
                className="inline-flex items-center justify-center rounded-md border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-white/5 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </NeonShell>
  );
}
