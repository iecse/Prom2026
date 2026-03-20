'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CTA_STATS = [
  { num: 500, label: 'PARTICIPANTS', color: 'cyan' },
  { num: 72, label: 'HOURS OF INNOVATION', suffix: 'H', color: 'magenta' },
  { num: 30000, label: 'IN PRIZES', prefix: '₹', color: 'cyan' },
  { num: 4, label: 'TECH Domains', suffix: '', color: 'magenta' },
];
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  const animateCounters = useCallback(() => {
    CTA_STATS.forEach((stat, index) => {
      const el = countersRef.current[index];
      if (!el) return;

      const numElement = el.querySelector('.stat-num') as HTMLElement | null;
      if (!numElement) return;

      const targets = { value: 0 };

      gsap.to(targets, {
        value: stat.num,
        duration: 2,
        ease: 'power2.out',
        delay: index * 0.15,
        onUpdate: function () {
          const prefix = stat.prefix || '';
          const suffix = stat.suffix || '';
          numElement.textContent = `${prefix}${Math.round(targets.value).toLocaleString()}${suffix}`;
        },
      });
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate grid lines on scroll
    gsap.fromTo(
      '.grid-line',
      { opacity: 0 },
      {
        opacity: 0.5,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    );

    // Animate title text
    gsap.fromTo(
      '.cta-title',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 0.5,
        },
      }
    );

    // Counter animation trigger
    ScrollTrigger.create({
      trigger: section,
      onEnter: () => {
        if (!hasAnimated) {
          animateCounters();
          setHasAnimated(true);
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animateCounters, hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 bg-black overflow-hidden"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="grid-line absolute inset-0 opacity-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-magenta-500/5 rounded-full blur-2xl opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4">
            <span className="text-sm font-mono text-magenta-500 tracking-widest uppercase">
              JOIN THE REVOLUTION
            </span>
          </div>
          <h2 className="cta-title text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500">IGNITE</span>
            <br />
            Your Potential?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Prometheus is where bold ideas are forged into reality. Two days. Unlimited ambition.
            One chance to prove what you&apos;re made of.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="/auth/register"
            className="px-10 py-4 rounded-md bg-blue-600 border border-blue-500 text-white font-bold text-lg uppercase tracking-widest shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:bg-blue-500 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-center">⚡ Register for Prometheus</span>
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-cyan-400/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {CTA_STATS.map((stat, index) => (
            <motion.div
              key={index}
              ref={(el) => {
                if (el) countersRef.current[index] = el;
              }}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div
                className={`stat-num text-3xl md:text-4xl font-black mb-2 drop-shadow-lg ${
                  stat.color === 'cyan'
                    ? 'text-cyan-400 group-hover:text-cyan-300'
                    : 'text-magenta-500 group-hover:text-magenta-400'
                } transition-colors`}
              >
                {stat.prefix}
                {stat.num}
                {stat.suffix}
              </div>
              <div className="text-xs md:text-sm font-mono text-gray-400 tracking-widest uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
