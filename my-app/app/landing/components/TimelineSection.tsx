'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Event {
  id: number;
  num: string;
  title: string;
  time: string;
  description: string;
  tags: string[];
}

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
            <div className="text-xs text-cyan-400/60 font-mono mt-3 uppercase tracking-wide">
              {!isMobile ? 'Hover to reveal →' : 'Tap to reveal →'}
            </div>
          </div>
        </div>

        {/* Back face */}
        <div className="flip-back bg-gradient-to-br from-magenta-500/10 to-cyan-400/5 border border-magenta-400/30 backdrop-blur-lg flex flex-col justify-between">
          <div className="overflow-y-auto flex-1">
            <p className="text-sm text-gray-200 leading-relaxed mb-4">{event.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`text-xs font-mono px-2 py-1 rounded border ${
                    isLeft
                      ? 'border-magenta-500/50 text-magenta-300'
                      : 'border-cyan-400/50 text-cyan-300'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white text-sm font-bold rounded hover:from-cyan-400 hover:to-magenta-400 transition-all duration-300 transform hover:scale-105 w-full"
          >
            READ MORE
          </button>
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

const EVENTS: Event[] = [
  {
    id: 1,
    num: '01 // WORKSHOP',
    title: 'Design Workshop',
    time: '09:00 — DAY 1',
    description:
      'Kickstart the future with a high-energy launch ceremony featuring keynote addresses from industry pioneers and tech visionaries.',
    tags: ['KEYNOTE', 'NETWORKING', 'LIVE DEMO'],
  },
  {
    id: 2,
    num: '02 // WORKSHOP',
    title: 'Machine Learning Workshop',
    time: '11:00 — DAY 1',
    description:
      'Dive deep into neural architectures and model training with hands-on sessions led by ML engineers from top research labs.',
    tags: ['HANDS-ON', 'NEURAL NETS', 'PYTORCH'],
  },
  {
    id: 3,
    num: '03 // CHALLENGE',
    title: 'Enigma',
    time: '14:00 — DAY 1',
    description:
      'ML contest',
    tags: ['COMPETITION', 'REACT', '3 HOURS'],
  },
  {
    id: 4,
    num: '04 // CHALLENGE',
    title: 'Order of Chaos 2',
    time: '10:00 — DAY 2',
    description:
      'OOC',
    tags: ['COMPETITIVE', 'ALGORITHMS', 'LEADERBOARD'],
  },
  {
    id: 5,
    num: '05 // TALK',
    title: 'Tech Quiz',
    time: '14:30 — DAY 2',
    description:
      'Tech Quiz',
    tags: ['PANEL', 'AGI', 'Q&A'],
  },
  {
    id: 6,
    num: '06 // FINALE',
    title: 'Near Protocol Talk',
    time: '18:00 — DAY 2',
    description:
      'Celebrate the best and brightest at the grand awards ceremony with prizes worth ₹2,00,000+.',
    tags: ['AWARDS', 'PRIZES', 'NETWORKING'],
  },
];

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
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-magenta-500" />
            <span className="text-sm font-mono text-magenta-500 tracking-widest uppercase">
              EVENT SCHEDULE
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2">THE SEQUENCE</h2>
          <p className="text-gray-400 text-lg">Experience 6 incredible events across 2 days</p>
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
