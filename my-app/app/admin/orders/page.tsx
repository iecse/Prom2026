'use client';

import { useEffect, useState } from 'react';
import NeonShell from '@/app/components/NeonShell';

type OrderItem = {
  orderId: string;
  amount: number;
  utr?: string;
  status: 'pending' | 'paid' | 'rejected';
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    username: string;
    phone?: string;
  };
};

export default function AdminOrdersPage() {
  const [adminKey, setAdminKey] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!adminKey) {
      setError('Enter admin secret to load orders');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/payment/orders?status=pending', {
        headers: { 'x-admin-secret': adminKey },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Could not fetch orders');
      } else {
        setOrders(data.orders || []);
      }
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId: string, status: 'paid' | 'rejected') => {
    if (!adminKey) return;
    setLoading(true);
    try {
      const res = await fetch('/api/payment/verify-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminKey,
        },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Could not update order');
      } else {
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      }
    } catch {
      setError('Could not update order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No auto-load to avoid leaking secret; user triggers manually
  }, []);

  return (
    <NeonShell headline="Admin: Payments" subhead="Review UPI orders and verify manually.">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin secret"
            className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          />
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-cyan-400 px-4 py-2 text-black font-semibold hover:bg-cyan-300 transition disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Load pending orders'}
          </button>
          {error && <span className="text-sm text-red-200">{error}</span>}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {orders.length === 0 && !loading && (
            <div className="text-sm text-gray-300">No pending orders.</div>
          )}

          {orders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-lg border border-cyan-400/20 bg-white/5 p-4 shadow-[0_0_12px_rgba(0,245,255,0.12)] flex flex-col gap-2"
            >
              <div className="text-xs uppercase tracking-[0.25em] text-cyan-300">Pending</div>
              <div className="text-sm text-white font-semibold">Order: {order.orderId}</div>
              <div className="text-sm text-gray-200">Amount: ₹{order.amount.toFixed(2)}</div>
              <div className="text-sm text-gray-200">UTR: {order.utr || '—'}</div>
              <div className="text-xs text-gray-400">Created: {new Date(order.createdAt).toLocaleString()}</div>
              {order.user && (
                <div className="text-xs text-gray-300">
                  {order.user.firstName} {order.user.lastName} — {order.user.username}
                  {order.user.phone ? ` — ${order.user.phone}` : ''}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateOrder(order.orderId, 'paid')}
                  className="flex-1 rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-300 transition"
                  disabled={loading}
                >
                  Mark paid
                </button>
                <button
                  onClick={() => updateOrder(order.orderId, 'rejected')}
                  className="flex-1 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 transition"
                  disabled={loading}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NeonShell>
  );
}
