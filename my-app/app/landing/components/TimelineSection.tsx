'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface Event {
  id: number;
  num: string;
  title: string;
  time: string;
  description: string;
  tags: string[];
}

const EVENTS: Event[] = [
  {
    id: 1,
    num: '01 // CEREMONY',
    title: 'Opening Ceremony',
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
    num: '03 // SPRINT',
    title: 'Web Dev Sprint',
    time: '14:00 — DAY 1',
    description:
      'A pulse-pounding 3-hour sprint where teams compete to build fully-functional web applications from scratch.',
    tags: ['COMPETITION', 'REACT', '3 HOURS'],
  },
  {
    id: 4,
    num: '04 // CHALLENGE',
    title: 'Algorithm Coding Challenge',
    time: '10:00 — DAY 2',
    description:
      'Test your algorithmic thinking against the sharpest minds with multi-tiered problem sets.',
    tags: ['COMPETITIVE', 'ALGORITHMS', 'LEADERBOARD'],
  },
  {
    id: 5,
    num: '05 // TALK',
    title: 'Tech Talk: Future of AI',
    time: '14:30 — DAY 2',
    description:
      'An electrifying panel discussion featuring founders, researchers, and engineers discussing where technology is headed.',
    tags: ['PANEL', 'AGI', 'Q&A'],
  },
  {
    id: 6,
    num: '06 // FINALE',
    title: 'Closing Ceremony',
    time: '18:00 — DAY 2',
    description:
      'Celebrate the best and brightest at the grand awards ceremony with prizes worth ₹2,00,000+.',
    tags: ['AWARDS', 'PRIZES', 'NETWORKING'],
  },
];

// Hook for detecting scroll and managing timeline visibility
function useTimelineScroll(eventCount: number) {
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
  const { sectionRef, spineProgress, visibleEvents } = useTimelineScroll(EVENTS.length);
  const eventRowsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardClick = (index: number) => {
    const card = eventRowsRef.current[index];
    if (!card) return;

    const details = card.querySelector('.card-details');
    if (!details) return;

    const isOpen = card.classList.contains('open');

    if (isOpen) {
      card.classList.remove('open');
      gsap.to(details, {
        maxHeight: 0,
        opacity: 0,
        marginTop: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      card.classList.add('open');
      gsap.to(details, {
        maxHeight: 200,
        opacity: 1,
        marginTop: 16,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

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
                  ref={(el) => {
                    eventRowsRef.current[index] = el;
                  }}
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
                  <div className="absolute left-1/2 top-6 w-4 h-4 bg-gray-950 border-2 border-cyan-400 rounded-full transform -translate-x-1/2 hidden md:block timeline-dot z-20" />

                  {/* Card container */}
                  <div className={`w-full md:w-1/2 px-4 md:px-8 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div
                      className="bg-gradient-to-br from-cyan-400/10 to-magenta-600/5 border border-cyan-400/30 backdrop-blur-lg rounded-lg p-6 cursor-pointer group hover:border-cyan-400/60 transition-all duration-300"
                      whileHover={{
                        y: -8,
                        boxShadow: '0 20px 40px rgba(0, 245, 255, 0.2)',
                      }}
                      onClick={() => handleCardClick(index)}
                    >
                      {/* Header */}
                      <div
                        className={`flex ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} items-start justify-between gap-4 mb-3`}
                      >
                        <div>
                          <div
                            className={`text-xs font-mono ${isLeft ? 'text-magenta-400' : 'text-cyan-400'} tracking-widest mb-1 uppercase`}
                          >
                            {event.num}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white">{event.title}</h3>
                          <div className="text-xs md:text-sm text-gray-400 font-mono mt-2">{event.time}</div>
                        </div>
                        <div className={`text-sm text-cyan-400 transition-transform ${isLeft ? 'md:rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>

                      {/* Details (collapsible) */}
                      <div className="card-details max-h-0 overflow-hidden opacity-0">
                        <p className="text-sm text-gray-300 leading-relaxed border-t border-cyan-400/20 pt-4 mb-3">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag, i) => (
                            <span
                              key={i}
                              className={`text-xs font-mono px-2 py-1 rounded border ${
                                isLeft
                                  ? 'border-magenta-500/50 text-magenta-400'
                                  : 'border-cyan-400/50 text-cyan-400'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
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
