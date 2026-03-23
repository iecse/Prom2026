'use client';

import HeroSection from './components/HeroSection';
import TimelineSection from './components/TimelineSection';
import CTASection from './components/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <HeroSection />
      <TimelineSection />
      <CTASection />
      
      {/* Footer */}
      <footer className="bg-black border-t border-cyan-400/20 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-cyan-300 font-mono text-xs tracking-[0.2em] uppercase mb-3">
            Prize Pool: Rs. 20,000+
          </p>
          <h3 className="text-2xl font-bold text-cyan-400 tracking-widest mb-2">PROMETHEUS</h3>
          <p className="text-cyan-200 font-mono text-xs tracking-[0.18em] uppercase mb-3">
            Sponsored by NEAR Protocol
          </p>
          <p className="text-gray-400 font-mono text-sm tracking-widest">
            IECSE &nbsp;|&nbsp; INNOVATE WITHOUT LIMITS &nbsp;|&nbsp; 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
