import React from 'react';

type Props = {
  headline?: string;
  subhead?: string;
  children: React.ReactNode;
};

export default function NeonShell({ headline, subhead, children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        <div
          className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-cyan-400/10 rounded-full blur-3xl opacity-30"
          style={{ mixBlendMode: 'screen' }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-magenta-600/10 rounded-full blur-3xl opacity-30" />
        <div
          className="absolute inset-0 bg-repeat opacity-5"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)
            `
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          }}
        />
      </div>

      {/* Corner accents */}
      <div className="pointer-events-none absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-400 z-10" />
      <div className="pointer-events-none absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-400 z-10" />
      <div className="pointer-events-none absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-400 z-10" />
      <div className="pointer-events-none absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-400 z-10" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        {headline ? (
          <header className="mb-10 flex flex-col gap-2 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Prometheus</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">
              {headline}
            </h1>
            {subhead ? <p className="text-sm text-gray-300 max-w-2xl mx-auto">{subhead}</p> : null}
          </header>
        ) : null}
        {children}
      </div>
    </div>
  );
}
