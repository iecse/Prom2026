import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events } from "@/app/events/components/events";
import Link from "next/link";
import { RegistrationSection } from "../components/RegistrationSection";

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
		<main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
			<div>
				<h1 className="text-3xl font-bold text-purple-600">{event.title}</h1>
				<p className="text-sm text-muted-foreground">{event.date}</p>
				{event.time ? <p className="text-sm text-muted-foreground">{event.time}</p> : null}
			</div>
			<p className="text-lg text-foreground/90">{event.about}</p>
			<p className="text-base text-foreground/80 leading-relaxed">{event.description}</p>

			<RegistrationSection
				eventId={event.id || decoded}
				requiresPass={event.requiresPass}
				defaultRegistered={event.registered}
			/>

			<Link href="/home" className="text-purple-600 hover:text-purple-700 underline text-sm">
				Back to timeline
			</Link>
		</main>
	);
}

function resolveSlug(event: { id?: string; href?: string }) {
	if (event.id) return event.id;
	const href = event.href ? event.href.replace(/\/$/, "") : "";
	return href.split("/").filter(Boolean).pop() || "";
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "purple" | "green" | "red" }) {
	const styles = {
		purple: "bg-purple-100 text-purple-700 border border-purple-200",
		green: "bg-green-100 text-green-700 border border-green-200",
		red: "bg-red-100 text-red-700 border border-red-200",
	}[tone];
	return <span className={`inline-flex items-center rounded-full px-3 py-1 ${styles}`}>{children}</span>;
}