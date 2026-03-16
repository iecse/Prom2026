"use client";

import { useRef } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import BuyButton from "./buyButton";

type TimelineEvent = {
  title: string;
  date: string;
  time?: string;
  about: string;
  description: string;
  href?: string;
  requiresPass?: boolean;
  registered?: boolean;
};

type ScrollTimelineProps = {
  events: TimelineEvent[];
};

export function ScrollTimeline({ events }: ScrollTimelineProps) {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-16">
      <div className="relative space-y-16 pb-28 pt-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-24 flex justify-center">
          <div className="relative w-px">
            <span className="absolute inset-0 bg-muted" aria-hidden />
            <span className="absolute inset-0 bg-purple-500" aria-hidden />
          </div>
        </div>

        {events.map((event, idx) => (
          <TimelineItem key={event.title} event={event} index={idx} />
        ))}

        <div className="flex justify-center pt-2">
          <div className="flex flex-col items-center gap-0.5">
            <div className="h-1 w-px bg-transparent" aria-hidden />
            <div className="mt-2">
              <BuyButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className={`relative flex flex-col gap-6 md:gap-0 md:flex-row ${
        isLeft ? "md:justify-start" : "md:justify-end"
      }`}
    >
      <div className="absolute left-1/2 top-2 h-0 w-0 -translate-x-1/2" aria-hidden>
        <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/40" />
        <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-purple-600 shadow" />
      </div>

      <Link
        href={event.href ?? "#"}
        className={`group block w-[70%] max-w-[12rem] md:w-[calc(50%-1.5rem)] md:max-w-none ${
          isLeft
            ? "self-start text-left md:mr-8 md:text-right"
            : "self-end text-right md:ml-8 md:text-left"
        }`}
      >
        <Card className="border-border/60 bg-card/90 shadow-md backdrop-blur transition duration-200 group-hover:scale-[1.02] group-hover:border-purple-500 group-hover:bg-purple-500/10">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-semibold text-foreground">
              {event.title}
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              <span className="block">{event.date}</span>
              {event.time ? <span className="block">{event.time}</span> : null}
            </CardDescription>
            <CardDescription className="text-base text-foreground/80">
              {event.about}
            </CardDescription>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span
                className={`rounded-full px-2 py-1 ${
                  event.requiresPass
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                {event.requiresPass ? "Pass required" : "Free"}
              </span>
              <span
                className={`rounded-full px-2 py-1 ${
                  event.registered
                    ? "bg-purple-200 text-purple-800 border border-purple-300"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {event.registered ? "Registered" : "Not registered"}
              </span>
            </div>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
