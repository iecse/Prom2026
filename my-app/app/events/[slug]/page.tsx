import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events } from "@/app/events/components/events";
import Link from "next/link";
import { RegistrationSection } from "../components/RegistrationSection";
import NeonShell from "@/app/components/NeonShell";

type Params = { slug: string };
type Props = {
	params: Promise<Params>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const event = events.find((e) => resolveSlug(e) === decodeURIComponent(slug));
	return {
		title: event ? event.title : "Event",
		description: event ? event.about : "Event details",
	};
}

export async function generateStaticParams() {
	return events
		.map((e) => resolveSlug(e))
		.filter(Boolean)
		.map((slug) => ({ slug }));
}

export default async function EventPage({ params }: Props) {
	const { slug } = await params;
	const decoded = decodeURIComponent(slug);
	const event = events.find((e) => resolveSlug(e) === decoded);
	if (!event) return notFound();

	return (
		<NeonShell headline={event.title} subhead={event.about}>
			<div className="mx-auto flex max-w-4xl flex-col gap-6">
				<div className="flex flex-wrap gap-3 text-sm font-semibold">
					<Badge tone="purple">{event.date}</Badge>
					{event.time ? <Badge tone="green">{event.time}</Badge> : null}
					<Badge tone={event.requiresPass ? "purple" : "green"}>
						{event.requiresPass ? "Pass required" : "Free"}
					</Badge>
				</div>

				<p className="text-base text-gray-200 leading-relaxed">{event.description}</p>

				<div className="rounded-lg border border-cyan-400/20 bg-white/5 p-4 shadow-[0_0_12px_rgba(0,245,255,0.15)]">
					<RegistrationSection
						eventId={event.id || decoded}
						requiresPass={event.requiresPass}
						defaultRegistered={event.registered}
					/>
				</div>

				<Link href="/events" className="text-sm font-semibold text-cyan-300 hover:text-white">
					← Back to events
				</Link>
			</div>
		</NeonShell>
	);
}

function resolveSlug(event: { id?: string; href?: string }) {
	if (event.id) return event.id;
	const href = event.href ? event.href.replace(/\/$/, "") : "";
	return href.split("/").filter(Boolean).pop() || "";
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "purple" | "green" | "red" }) {
	const styles = {
		purple: "bg-purple-500/20 text-purple-100 border border-purple-300/40",
		green: "bg-green-500/20 text-green-100 border border-green-300/40",
		red: "bg-red-500/20 text-red-100 border border-red-300/40",
	}[tone];
	return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${styles}`}>{children}</span>;
}