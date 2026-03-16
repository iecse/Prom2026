import Image from "next/image";
import { ScrollTimeline } from "./components/scroll-timeline";
import { events } from "../events/components/events";

export default function Home() {
    return (
        <div className="space-y-12">
            <div className="flex justify-center p-4">
                <Image
                    src="/PromLogo.jpeg"
                    alt="Prometheus logo"
                    width={900}
                    height={700}
                    priority
                />
            </div>

            <div className="px-4 text-center">
                <span className="text-4xl font-semibold underline">Event Timeline</span>
            </div>

            <ScrollTimeline events={events} />
        </div>
    );
}