'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeUnits>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      // Prometheus starts March 31, 2026, 5:00 PM
      const eventDate = new Date('2026-03-31T17:00:00').getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTime({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    // Random glitch effect every 5 seconds
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchInterval);
    };
  }, []);

  // Animate number change with GSAP
  useEffect(() => {
    gsap.to('.countdown-value', {
      duration: 0.8,
      ease: 'elastic.out',
      stagger: 0.1,
    });
  }, [time]);

  return (
    <div className="relative mt-8 flex justify-center items-center gap-6">
      {/* Glow background */}
      <div className="absolute inset-0 flex justify-center items-center gap-6">
        <div className="w-24 h-24 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="w-32 h-32 bg-magenta-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Countdown display */}
      <div className="relative z-10 flex gap-4 md:gap-8 font-mono">
        {/* Days */}
        <div className={`flex flex-col items-center ${glitchActive ? 'glitch-effect' : ''}`}>
          <div className="text-3xl md:text-5xl font-bold text-cyan-400 countdown-value drop-shadow-lg">
            {String(time.days).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-cyan-300 mt-2 uppercase tracking-widest">Days</div>
        </div>

        {/* Divider */}
        <div className="text-3xl md:text-5xl font-bold text-cyan-400/50 self-center">:</div>

        {/* Hours */}
        <div className={`flex flex-col items-center ${glitchActive ? 'glitch-effect' : ''}`}>
          <div className="text-3xl md:text-5xl font-bold text-cyan-400 countdown-value drop-shadow-lg">
            {String(time.hours).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-cyan-300 mt-2 uppercase tracking-widest">Hours</div>
        </div>

        {/* Divider */}
        <div className="text-3xl md:text-5xl font-bold text-cyan-400/50 self-center">:</div>

        {/* Minutes */}
        <div className={`flex flex-col items-center ${glitchActive ? 'glitch-effect' : ''}`}>
          <div className="text-3xl md:text-5xl font-bold text-magenta-500 countdown-value drop-shadow-lg">
            {String(time.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-magenta-400 mt-2 uppercase tracking-widest">Mins</div>
        </div>

        {/* Divider */}
        <div className="text-3xl md:text-5xl font-bold text-cyan-400/50 self-center">:</div>

        {/* Seconds */}
        <div className={`flex flex-col items-center ${glitchActive ? 'glitch-effect' : ''}`}>
          <div className="text-3xl md:text-5xl font-bold text-magenta-500 countdown-value drop-shadow-lg">
            {String(time.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs md:text-sm text-magenta-400 mt-2 uppercase tracking-widest">Secs</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch-effect {
          0%, 100% {
            transform: translate(0);
            opacity: 1;
          }
          20% {
            transform: translate(-2px, 2px);
            opacity: 0.8;
          }
          40% {
            transform: translate(2px, -2px);
            opacity: 0.9;
          }
          60% {
            transform: translate(-1px, 1px);
            opacity: 0.8;
          }
          80% {
            transform: translate(1px, -1px);
            opacity: 0.9;
          }
        }

        .glitch-effect {
          animation: glitch-effect 0.2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 245, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.3);
          }
        }
      `}</style>
    </div>
  );
}
