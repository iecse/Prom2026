'use client';

import { useEffect, useState, type InputHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import NeonShell from '@/app/components/NeonShell';
import branches from '@/data/branches.json';

interface ProfileResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    paymentStatus?: string;
    transactionId?: string;
    regNo?: string;
    branch?: string;
    freePass?: boolean;
    memberId?: string;
  };

}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileResponse['user'] | null>(null);
  const [form, setForm] = useState<Partial<ProfileResponse['user']>>({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          cache: 'no-store',
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
          setForm({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: data.user.phone,
            regNo: data.user.regNo,
            branch: data.user.branch,
          });
        }
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const updateField = (key: keyof ProfileResponse['user']) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfile = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    setError(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          regNo: form.regNo,
          branch: form.branch,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Could not update profile');
        return;
      }

      setProfile(data.user);
      setForm({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phone: data.user.phone,
        regNo: data.user.regNo,
        branch: data.user.branch,
      });
      setEditing(false);
    } catch {
      setError('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <NeonShell headline="Profile" subhead="Loading your details...">
        <p className="text-sm text-gray-300">Loading profile…</p>
      </NeonShell>
    );
  }

  if (!profile && error) {
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
    <NeonShell headline={`${profile.firstName} ${profile.lastName}`} subhead="Signed in">
      {error ? (
        <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            className="text-xs font-semibold text-red-100 underline underline-offset-4"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}
      <div className="bg-white/5 border border-cyan-400/20 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Signed in</p>
          <p className="text-sm text-gray-300">{profile.email}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={saveProfile}
                className="rounded-md bg-cyan-400 px-3 py-2 text-sm font-semibold text-black hover:bg-cyan-300 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  if (profile) {
                    setForm({
                      firstName: profile.firstName,
                      lastName: profile.lastName,
                      phone: profile.phone,
                      regNo: profile.regNo,
                      branch: profile.branch,
                    });
                  }
                  setError(null);
                  setEditing(false);
                }}
                className="rounded-md border border-cyan-400/40 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-white/5 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setEditing(true);
              }}
              className="rounded-md border border-cyan-400/40 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-white/5 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <EditableInfo
          label="First name"
          value={form.firstName || ''}
          readValue={profile.firstName}
          editing={editing}
          onChange={updateField('firstName')}
        />
        <EditableInfo
          label="Last name"
          value={form.lastName || ''}
          readValue={profile.lastName}
          editing={editing}
          onChange={updateField('lastName')}
        />
        <EditableInfo
          label="Phone"
          value={form.phone || ''}
          readValue={profile.phone || ''}
          editing={editing}
          onChange={updateField('phone')}
          inputProps={{ maxLength: 10, pattern: '\\d{10}', inputMode: 'numeric' }}
        />
        <EditableInfo
          label="Reg No"
          value={form.regNo || ''}
          readValue={profile.regNo || '—'}
          editing={editing}
          onChange={updateField('regNo')}
          inputProps={{ maxLength: 9, pattern: '\\d{9}', inputMode: 'numeric' }}
        />
        <EditableInfo
          label="Branch"
          value={form.branch || ''}
          readValue={profile.branch || '—'}
          editing={editing}
          onChange={updateField('branch')}
          options={branches}
        />
        <InfoCard label="Member ID" value={profile.memberId || '—'} />
        <InfoCard label="Free pass" value={profile.freePass ? 'Yes' : 'No'} />
        <InfoCard label="Payment Status" value={formatPaymentStatus(profile.paymentStatus)} hidden={profile.freePass} />
        {!profile.freePass ? <InfoCard label="Transaction ID" value={profile.transactionId || '—'} /> : null}
      </section>
    </NeonShell>
  );
}

function InfoCard({ label, value, hidden }: { label: string; value: string; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <div className="rounded-lg border border-cyan-400/20 bg-white/5 px-4 py-3 shadow-[0_0_12px_rgba(0,245,255,0.1)]">
      <p className="text-xs uppercase tracking-widest text-cyan-200">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function EditableInfo({
  label,
  value,
  readValue,
  editing,
  onChange,
  options,
  inputProps,
}: {
  label: string;
  value: string;
  readValue: string;
  editing: boolean;
  onChange: (v: string) => void;
  options?: string[];
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="rounded-lg border border-cyan-400/20 bg-white/5 px-4 py-3 shadow-[0_0_12px_rgba(0,245,255,0.1)]">
      <p className="text-xs uppercase tracking-widest text-cyan-200">{label}</p>
      {editing ? (
        options && options.length ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
          >
            <option value="" disabled>
              Select {label.toLowerCase()}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            {...inputProps}
          />
        )
      ) : (
        <p className="text-lg font-semibold text-white">{readValue || '—'}</p>
      )}
    </div>
  );
}

function formatPaymentStatus(status?: string) {
  if (!status || status === 'not_paid' || status === 'failed' || status === 'rejected') return 'Payment not done';
  if (status === 'pending') return 'Payment pending';
  if (status === 'paid' || status === 'completed') return 'Payment done';
  return status;
}
