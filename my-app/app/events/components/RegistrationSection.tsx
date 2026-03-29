"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/HlLgZxm8nGrBsGhhYZ7hhT";

function Badge({ children, tone }: { children: React.ReactNode; tone: "purple" | "green" | "red" }) {
  const styles = {
    purple: "bg-purple-100 text-purple-700 border border-purple-200",
    green: "bg-green-100 text-green-700 border border-green-200",
    red: "bg-red-100 text-red-700 border border-red-200",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-3 py-1 ${styles}`}>{children}</span>;
}

export function RegistrationSection({
  eventId,
  requiresPass = false,
  defaultRegistered = false,
}: {
  eventId: string;
  requiresPass?: boolean;
  defaultRegistered?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<{ registered: boolean; loading: boolean; error: string | null }>(
    { registered: defaultRegistered, loading: false, error: null }
  );

  const handleRegister = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventName: eventId }),
      });

      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setState((prev) => ({ registered: prev.registered, loading: false, error: data?.message || "Registration failed" }));
        return;
      }

      setState({ registered: true, loading: false, error: null });
    } catch {
      setState((prev) => ({ registered: prev.registered, loading: false, error: "Something went wrong" }));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <Badge tone={requiresPass ? "purple" : "green"}>
          {requiresPass ? "Pass required" : "Free"}
        </Badge>
        <Badge tone={state.registered ? "purple" : "red"}>
          {state.registered ? "Registered" : "Not registered"}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {state.registered ? (
          <a
            href={WHATSAPP_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white border border-green-600 shadow-[0_0_12px_rgba(34,197,94,0.3)] transition hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            Join WhatsApp
          </a>
        ) : (
          <button
            type="button"
            onClick={handleRegister}
            disabled={state.loading}
            className="inline-flex items-center justify-center rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-black border border-cyan-300 shadow-[0_0_12px_rgba(0,245,255,0.3)] transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.loading ? "Registering..." : "Register"}
          </button>
        )}
      </div>

      {state.error ? (
        <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </div>
      ) : null}
    </div>
  );
}
