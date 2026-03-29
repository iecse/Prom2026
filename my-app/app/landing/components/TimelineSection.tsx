'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { events as eventData } from '@/app/events/components/events';

type Event = (typeof eventData)[number] & { num: string };

// Flip card component
function FlipCard({ event, isLeft }: { event: Event; isLeft: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className={`flip-card ${isMobile ? 'flip-card-mobile' : ''}`}
      onClick={(e) => {
        if (isMobile) {
          const inner = (e.currentTarget as HTMLDivElement).querySelector('.flip-inner');
          if (inner) {
            inner.classList.toggle('flipped');
          }
        }
      }}
    >
      <div className="flip-inner">
        {/* Front face */}
        <div className="flip-front bg-gradient-to-br from-cyan-400/10 to-magenta-600/5 border border-cyan-400/30 backdrop-blur-lg">
          <div className="flex flex-col justify-center items-center text-center h-full gap-2">
            <div
              className={`text-xs font-mono ${isLeft ? 'text-magenta-400' : 'text-cyan-400'} tracking-widest uppercase`}
            >
              {event.num}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight px-4">
              {event.title}
            </h3>
            <div className="text-xs md:text-sm text-gray-400 font-mono mt-2">{event.time}</div>
          </div>
        </div>

        {/* Back face */}
        <div className="flip-back bg-gradient-to-br from-magenta-500/10 to-cyan-400/5 border border-magenta-400/30 backdrop-blur-lg flex flex-col justify-between">
          <div className="overflow-y-auto flex-1">
            <p className="text-sm text-gray-200 leading-relaxed mb-4">{event.about || event.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`text-xs font-mono px-2 py-1 rounded border ${
                  isLeft ? 'border-magenta-500/50 text-magenta-300' : 'border-cyan-400/50 text-cyan-300'
                }`}
              >
                {event.requiresPass ? 'Pass required' : 'Free'}
              </span>
              {event.prizePool > 0 ? (
                <span
                  className={`text-xs font-mono px-2 py-1 rounded border ${
                    isLeft ? 'border-magenta-500/50 text-magenta-300' : 'border-cyan-400/50 text-cyan-300'
                  }`}
                >
                  Prize pool ₹{event.prizePool.toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .flip-card {
          width: 100%;
          min-height: 240px;
          perspective: 1200px;
          cursor: pointer;
        }

        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
        }

        .flip-card:hover .flip-inner {
          transform: rotateY(180deg);
        }

        .flip-card-mobile .flip-inner.flipped {
          transform: rotateY(180deg);
        }

        .flip-front,
        .flip-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .flip-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

// Hook for detecting scroll and managing timeline visibility
function useTimelineScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [spineProgress, setSpineProgress] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const prevScrollY = useRef(0);

  const checkEvents = useCallback(() => {
    if (!sectionRef.current) return;

    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    // Detect scroll direction
    const goingUp = scrollY < prevScrollY.current;
    prevScrollY.current = scrollY;

    // Timeline spine progress
    const section = sectionRef.current;
    const sectionTop = section.offsetTop;
    const sectionH = section.offsetHeight;
    const progress = Math.max(0, Math.min(1, (scrollY + windowH * 0.4 - sectionTop) / sectionH));
    setSpineProgress(progress);

    // Which events are visible
    const newVisible = new Set<number>();
    const eventEls = section.querySelectorAll('.event-row');

    eventEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < windowH * 0.75;
      if (inView) newVisible.add(i);
    });

    setVisibleEvents((prev) => {
      const prevSet = new Set(prev);

      // Going up: keep all that were visible
      if (goingUp) {
        const merged = new Set([...prevSet, ...newVisible]);
        return Array.from(merged).sort((a, b) => a - b);
      }

      // Going down: only add newly revealed (don't remove)
      const merged = new Set([...prevSet, ...newVisible]);
      return Array.from(merged).sort((a, b) => a - b);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;

      // Reset when user scrolls to very top
      if (scrollY < 80) {
        setVisibleEvents([]);
        setSpineProgress(0);
      } else {
        checkEvents();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [checkEvents]);

  return { sectionRef, spineProgress, visibleEvents };
}

export default function TimelineSection() {
  const { sectionRef, spineProgress, visibleEvents } = useTimelineScroll();
  const EVENTS: Event[] = eventData.map((event) => ({
    ...event,
    num: event.date,
  }));

  return (
    <section
      ref={sectionRef}
      className="relative bg-gray-950 py-24 px-4 overflow-visible"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-xs font-mono text-magenta-400 tracking-[0.3em] uppercase letter-spacing-wide">Event Schedule</span>
            <div className="w-16 h-1 bg-gradient-to-r from-magenta-400 via-cyan-400 to-magenta-400 rounded-full mt-1 mb-2" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-3 drop-shadow-lg">THE SEQUENCE</h2>
          <p className="text-cyan-300 text-lg md:text-xl font-mono tracking-wide mb-2">Experience <span className="font-bold text-magenta-400">8</span> incredible events across <span className="font-bold text-magenta-400">5 days</span></p>
          <p className="text-gray-400 text-base md:text-lg font-light">Workshops, competitions, and more—join us for the full Prometheus experience!</p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 hidden md:block pointer-events-none">
            {/* Track background */}
            <div className="absolute inset-0 bg-cyan-400/10" />
            {/* Filled progress */}
            <div
              className="absolute inset-x-0 top-0 bg-gradient-to-b from-cyan-400 via-cyan-400 to-magenta-500"
              style={{
                height: '100%',
                transform: `scaleY(${spineProgress})`,
                transformOrigin: 'top',
                transition: 'transform 0.05s linear',
                boxShadow: '0 0 12px rgba(0, 245, 255, 0.6)',
              }}
            />
          </div>

          {/* Events */}
          <div className="space-y-12">
            {EVENTS.map((event, index) => {
              const isLeft = index % 2 === 0;
              const isVisible = visibleEvents.includes(index);

              return (
                <div
                  key={event.id}
                  className={`event-row flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} relative transition-all duration-600`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? 'translateX(0) translateY(0)'
                      : `translateX(${isLeft ? '-40px' : '40px'}) translateY(10px)`,
                    transitionDelay: isVisible ? `${index * 0.05}s` : '0s',
                  }}
                >
                  {/* Dot */}
                  <div className="absolute left-1/2 top-16 w-4 h-4 bg-gray-950 border-2 border-cyan-400 rounded-full transform -translate-x-1/2 hidden md:block timeline-dot z-20" />

                  {/* Card container */}
                  <div className={`w-full md:w-1/2 px-4 md:px-8`}>
                    <div
                      className={`flex ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}
                    >
                      <FlipCard event={event} isLeft={isLeft} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
