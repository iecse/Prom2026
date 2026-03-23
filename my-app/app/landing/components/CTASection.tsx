'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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
          <div className="flex justify-center mb-6">
            <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-cyan-300 font-mono text-xs md:text-sm tracking-widest uppercase">
              Prize Pool: Rs. 20,000+
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
            className="px-11 py-4 rounded-md bg-gradient-to-r from-cyan-400 to-cyan-500 border border-cyan-300 text-black font-extrabold text-xl uppercase tracking-wider shadow-[0_0_18px_rgba(0,245,255,0.25)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,245,255,0.35)] hover:-translate-y-0.5 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-center">Register for Prometheus</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
