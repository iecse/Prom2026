'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import CountdownTimer from './CountdownTimer';
import AnimatedParticles from './AnimatedParticles';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8 },
  },
  whileHover: {
    scale: 1.05,
    boxShadow: '0 0 30px rgba(0, 245, 255, 1), 0 0 60px rgba(0, 245, 255, 0.4)',
  },
  whileTap: { scale: 0.95 },
};

export default function HeroSection() {
  useEffect(() => {
    // Glitch title animation on load
    gsap.to('.glitch-title::before', {
      duration: 4,
      delay: 0.5,
      repeat: -1,
      ease: 'steps(6)',
    });

    gsap.to('.glitch-title::after', {
      duration: 4,
      delay: 0.5,
      repeat: -1,
      ease: 'steps(6)',
    });

    // Scroll indicator bounce
    gsap.to('.scroll-indicator', {
      y: 15,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Background glow pulse
    gsap.to('.hero-glow', {
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Canvas particles background */}
      <div className="absolute inset-0 z-0">
        <AnimatedParticles />
      </div>

      {/* Overlay gradients */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <div
          className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl opacity-30"
          style={{
            mixBlendMode: 'screen',
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-magenta-600/5 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Scanlines */}
      <div className="absolute inset-0 z-2 pointer-events-none bg-repeat opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)',
          }}
        />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-cyan-400 z-3" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-cyan-400 z-3" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-cyan-400 z-3" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cyan-400 z-3" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-3 sm:px-4 md:px-6 w-full"
        style={{ maxWidth: 'clamp(280px, 90vw, 1200px)' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Subtitle */}
        <motion.div
          className="text-xs sm:text-sm md:text-base lg:text-lg font-mono text-cyan-400 tracking-widest mb-3 sm:mb-4 md:mb-6 uppercase"
          variants={itemVariants}
        >
          IECSE Presents
        </motion.div>

        {/* Glitch Title */}
        <motion.div className="relative mb-4 sm:mb-5 md:mb-6 lg:mb-8" variants={itemVariants}>
          <h1
            className="glitch-title text-5xl sm:text-7xl md:text-5xl lg:text-7xl xl:text-8xl font-black tracking-wider text-white drop-shadow-lg leading-tight"
            style={{
              textShadow: '0 0 20px rgba(0, 245, 255, 0.8), 0 0 40px rgba(0, 245, 255, 0.4)',
              wordSpacing: 'normal',
              letterSpacing: '-0.02em',
            }}
          >
            PROMETHEUS
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="hidden md:block text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-light tracking-wide leading-relaxed"
          variants={itemVariants}
        >
          Where <span className="text-magenta-500 font-semibold">innovation</span> meets the edge of
          possibility.
          <br className="hidden sm:block" />
          Push limits. Break barriers. Build the future.
        </motion.p>

        {/* Countdown Timer */}
        <motion.div variants={itemVariants}>
          <CountdownTimer />
        </motion.div>

        {/* CTA Button */}
        <Link href="/auth/register" className="inline-block">
          <motion.button
            className="mt-12 px-8 md:px-12 py-3 md:py-4 bg-cyan-400 text-black font-bold text-lg uppercase tracking-widest rounded-sm hover:bg-white transition-colors relative overflow-hidden group"
            variants={buttonVariants}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <span className="relative z-10">⚡ Register Now</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-500 opacity-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0 }}
            />
          </motion.button>
        </Link>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-xs font-mono text-cyan-400 tracking-widest">SCROLL</span>
        <div className="w-1 h-12 border-l border-cyan-400/50" />
      </motion.div>

      <style jsx>{`
        .glitch-title {
          position: relative;
          display: inline-block;
        }

        .glitch-title::before,
        .glitch-title::after {
          content: 'PROMETHEUS';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
        }

        .glitch-title::before {
          color: #ff00ff;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          animation: glitch-slice1 4s infinite;
          text-shadow: 2px 0 #ff00ff;
        }

        .glitch-title::after {
          color: #00f5ff;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          animation: glitch-slice2 4s infinite;
          text-shadow: -2px 0 #00f5ff;
        }

        @keyframes glitch-slice1 {
          0%,
          85%,
          100% {
            transform: none;
            opacity: 0;
          }
          86% {
            transform: translate(-4px, -2px);
            opacity: 0.8;
          }
          88% {
            transform: translate(4px, 2px);
            opacity: 0.8;
          }
          90% {
            transform: none;
            opacity: 0;
          }
        }

        @keyframes glitch-slice2 {
          0%,
          85%,
          100% {
            transform: none;
            opacity: 0;
          }
          87% {
            transform: translate(4px, 2px);
            opacity: 0.8;
          }
          89% {
            transform: translate(-4px, -2px);
            opacity: 0.8;
          }
          90% {
            transform: none;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
