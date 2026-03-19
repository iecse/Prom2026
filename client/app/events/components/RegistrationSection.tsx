"use client";

import { useState } from "react";

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
  const [registered, setRegistered] = useState(defaultRegistered);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        <Badge tone={requiresPass ? "purple" : "green"}>
          {requiresPass ? "Pass required" : "Free"}
        </Badge>
        <Badge tone={registered ? "purple" : "red"}>
          {registered ? "Registered" : "Not registered"}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setRegistered(true)}
          disabled={registered}
          className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:cursor-not-allowed disabled:bg-purple-400"
        >
          {registered ? "Registered" : "Register"}
        </button>
      </div>
    </div>
  );
}
