import { useEffect, useRef, useState, useCallback } from "react";

const TIMELINE_EVENTS = [
  {
    year: "2019",
    title: "The Spark",
    short: "An idea ignites",
    detail:
      "In a small garage studio, a group of dreamers sketched the first blueprints on napkins. They had no funding, no office, only a relentless conviction that the world needed something radically different.",
    color: "#FF6B35",
    icon: "✦",
  },
  {
    year: "2020",
    title: "First Prototype",
    short: "Code meets vision",
    detail:
      "Months of sleepless nights yielded a working prototype. Clunky but alive — it was proof that the impossible was merely improbable. The team celebrated with lukewarm coffee and enormous pride.",
    color: "#FFD23F",
    icon: "◈",
  },
  {
    year: "2021",
    title: "Seed Funding",
    short: "$2M raised",
    detail:
      "Investors believed in the vision before it believed in itself. The seed round unlocked a real office, a growing team, and the terrifying freedom to move fast. Everything changed overnight.",
    color: "#06FFA5",
    icon: "⬡",
  },
  {
    year: "2022",
    title: "Product Launch",
    short: "The world notices",
    detail:
      "Launch day arrived with a storm of press, a crashed server, and 50,000 signups in 24 hours. What began as a napkin sketch was now a product used by real humans with real problems to solve.",
    color: "#3BCEAC",
    icon: "◉",
  },
  {
    year: "2023",
    title: "Global Expansion",
    short: "12 countries, one mission",
    detail:
      "From São Paulo to Seoul, the platform crossed borders with surprising ease. Cultural nuances demanded adaptation, but the core truth resonated universally: great tools empower great people.",
    color: "#EE4266",
    icon: "✸",
  },
  {
    year: "2024",
    title: "Series B",
    short: "$40M. New chapter.",
    detail:
      "The Series B wasn't just capital — it was validation. Tier-1 investors, a board of legends, and a mandate to grow without losing the soul of what made this company worth building in the first place.",
    color: "#A78BFA",
    icon: "⬟",
  },
  {
    year: "2025",
    title: "One Million Users",
    short: "Community becomes everything",
    detail:
      "The millionth user joined on a quiet Tuesday. No fanfare, just a number on a dashboard that represented a million stories, a million problems solved, a million moments of delight delivered.",
    color: "#F97316",
    icon: "✺",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #060608;
    --surface: #0e0e14;
    --border: rgba(255,255,255,0.06);
    --text: #e8e4da;
    --muted: rgba(232,228,218,0.4);
    --line: rgba(255,255,255,0.12);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Cormorant Garamond', serif;
    overflow-x: hidden;
  }

  .noise-overlay {
    position: fixed; inset: 0; z-index: 1000; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* ─── HERO ─── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 2rem;
  }

  .hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 40%, #1a0a2e 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 20% 80%, #0d1a0d 0%, transparent 60%),
                var(--bg);
  }

  .hero-grid {
    position: absolute; inset: 0; opacity: 0.08;
    background-image:
      linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  }

  .hero-content { position: relative; z-index: 2; text-align: center; }

  .hero-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.35em;
    color: var(--muted); text-transform: uppercase;
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 1rem; justify-content: center;
  }

  .hero-eyebrow::before, .hero-eyebrow::after {
    content: ''; flex: 1; max-width: 60px;
    height: 1px; background: var(--line);
  }

  .hero-title {
    font-size: clamp(4rem, 12vw, 10rem);
    font-weight: 300; line-height: 0.9;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.5) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-title em {
    font-style: italic; font-weight: 300;
    background: linear-gradient(135deg, #c084fc 0%, #818cf8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    margin-top: 2rem; font-size: 1.25rem; font-weight: 300;
    color: var(--muted); max-width: 480px; margin-inline: auto;
    line-height: 1.7;
  }

  .scroll-cue {
    position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
    z-index: 2; display: flex; flex-direction: column;
    align-items: center; gap: 0.5rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.55rem; letter-spacing: 0.3em;
    color: var(--muted); text-transform: uppercase;
    animation: bob 2s ease-in-out infinite;
  }

  .scroll-line {
    width: 1px; height: 50px;
    background: linear-gradient(to bottom, var(--muted), transparent);
  }

  @keyframes bob {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(8px); }
  }

  /* ─── TIMELINE SECTION ─── */
  .timeline-section {
    position: relative;
    padding: 8rem 2rem 6rem;
    max-width: 900px; margin: 0 auto;
  }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.4em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 3rem;
    display: flex; align-items: center; gap: 1rem;
  }

  .section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--line);
  }

  /* The spine */
  .timeline-spine-wrap {
    position: absolute;
    left: 50%; transform: translateX(-50%);
    top: 0; bottom: 0; width: 2px;
    pointer-events: none;
  }

  .spine-track {
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.05);
  }

  .spine-fill {
    position: absolute; top: 0; left: 0; right: 0;
    background: linear-gradient(to bottom, #a78bfa, #3bceac, #f97316);
    transform-origin: top;
    transition: transform 0.05s linear;
    box-shadow: 0 0 12px rgba(167, 139, 250, 0.6);
  }

  /* Events */
  .timeline-events { position: relative; z-index: 2; }

  .event-row {
    display: flex; align-items: flex-start;
    margin-bottom: 5rem; position: relative;
    opacity: 0; transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .event-row.left { flex-direction: row; }
  .event-row.right { flex-direction: row-reverse; }

  .event-row.left { transform: translateX(-40px); }
  .event-row.right { transform: translateX(40px); }
  .event-row.visible { opacity: 1; transform: translateX(0) !important; }

  .event-spacer { flex: 1; }

  .event-node {
    width: 44px; height: 44px; flex-shrink: 0;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; position: relative; z-index: 3;
    border: 1px solid rgba(255,255,255,0.15);
    background: var(--surface);
    margin-top: 1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .event-content { flex: 1; max-width: calc(50% - 44px); padding: 0 2rem; }

  .event-row.left .event-content { text-align: right; padding-right: 2.5rem; padding-left: 0; }
  .event-row.right .event-content { text-align: left; padding-left: 2.5rem; padding-right: 0; }

  /* Flip Card */
  .flip-card {
    width: 100%; min-height: 160px;
    perspective: 1000px; cursor: pointer;
  }

  .flip-inner {
    position: relative; width: 100%; min-height: 160px;
    transform-style: preserve-3d;
    transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .flip-card:hover .flip-inner { transform: rotateY(180deg); }

  .flip-front, .flip-back {
    position: absolute; inset: 0;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    border-radius: 12px; padding: 1.5rem;
    border: 1px solid var(--border);
    background: var(--surface);
    display: flex; flex-direction: column; justify-content: center;
  }

  .flip-back {
    transform: rotateY(180deg);
    background: #0e0e20;
    border-color: rgba(167, 139, 250, 0.2);
  }

  .event-year {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
  }

  .event-title {
    font-size: 1.8rem; font-weight: 300; line-height: 1.1;
    margin-bottom: 0.4rem;
  }

  .event-short {
    font-size: 1rem; color: var(--muted); font-style: italic;
  }

  .event-detail {
    font-size: 0.95rem; line-height: 1.7;
    color: rgba(232,228,218,0.8); font-weight: 300;
  }

  .flip-hint {
    font-family: 'Space Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.2em;
    color: var(--muted); text-transform: uppercase;
    margin-top: 1rem;
  }

  /* ─── REGISTER SECTION ─── */
  .register-section {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 4rem 2rem;
  }

  .register-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 60% at 50% 50%, #0d1a2e 0%, var(--bg) 70%);
  }

  .register-card {
    position: relative; z-index: 2;
    max-width: 480px; width: 100%; text-align: center;
    border: 1px solid var(--border); border-radius: 20px;
    padding: 3rem; background: rgba(14,14,20,0.8);
    backdrop-filter: blur(20px);
  }

  .register-card h2 {
    font-size: 3rem; font-weight: 300; margin-bottom: 1rem;
  }

  .register-card p {
    color: var(--muted); font-size: 1.1rem; margin-bottom: 2rem;
    line-height: 1.7; font-style: italic;
  }

  .register-form { display: flex; flex-direction: column; gap: 1rem; }

  .register-form input {
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    border-radius: 8px; padding: 0.85rem 1.2rem;
    color: var(--text); font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; outline: none;
    transition: border-color 0.2s;
  }

  .register-form input:focus { border-color: rgba(167,139,250,0.5); }
  .register-form input::placeholder { color: var(--muted); }

  .register-btn {
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border: none; border-radius: 8px;
    padding: 0.9rem; color: white;
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.2em;
    text-transform: uppercase; cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    margin-top: 0.5rem;
  }

  .register-btn:hover { opacity: 0.85; transform: translateY(-1px); }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 640px) {
    .timeline-spine-wrap { left: 28px; }
    .event-row { flex-direction: row !important; }
    .event-spacer { display: none; }
    .event-content { max-width: calc(100% - 60px); text-align: left !important; padding: 0 0 0 1.5rem !important; }
    .event-node { margin-right: 0; }
  }
`;

function useTimelineScroll(eventCount) {
  const sectionRef = useRef(null);
  const [spineProgress, setSpineProgress] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [hasSeenHero, setHasSeenHero] = useState(true);
  const prevScrollY = useRef(0);

  const checkEvents = useCallback(() => {
    if (!sectionRef.current) return;

    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    // Detect scroll direction
    const goingUp = scrollY < prevScrollY.current;
    prevScrollY.current = scrollY;

    // Hero: visible when near top
    const heroVisible = scrollY < windowH * 0.6;
    if (heroVisible && !hasSeenHero) setHasSeenHero(true);

    // Timeline spine progress
    const section = sectionRef.current;
    const sectionTop = section.offsetTop;
    const sectionH = section.offsetHeight;
    const progress = Math.max(0, Math.min(1, (scrollY + windowH * 0.6 - sectionTop) / sectionH));
    setSpineProgress(progress);

    // Which events are visible (forward: reveal one by one; backward: keep them all if not at hero top)
    const newVisible = new Set();
    const eventEls = section.querySelectorAll(".event-row");

    eventEls.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < windowH * 0.78;
      if (inView) newVisible.add(i);
    });

    setVisibleEvents((prev) => {
      const prevSet = new Set(prev);

      // If we're fully at top (hero visible) and scrolling down — reset
      if (heroVisible && !goingUp && prevSet.size === eventCount) {
        return [];
      }

      // Going up but not back to hero: keep all that were visible
      if (goingUp) {
        const merged = new Set([...prevSet, ...newVisible]);
        return [...merged].sort((a, b) => a - b);
      }

      // Going down: only add newly revealed
      const merged = new Set([...prevSet, ...newVisible]);
      return [...merged].sort((a, b) => a - b);
    });
  }, [eventCount, hasSeenHero]);

  // Reset when user scrolls all the way back to top
  useEffect(() => {
    let resetPending = false;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;

      if (scrollY < 80) {
        // Fully at top: clear events so they animate fresh on next scroll down
        setVisibleEvents([]);
        setSpineProgress(0);
        resetPending = true;
      } else {
        resetPending = false;
        checkEvents();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [checkEvents]);

  return { sectionRef, spineProgress, visibleEvents };
}

export default function App() {
  const { sectionRef, spineProgress, visibleEvents } = useTimelineScroll(TIMELINE_EVENTS.length);

  return (
    <>
      <style>{styles}</style>
      <div className="noise-overlay" />

      

      {/* ── TIMELINE ── */}
      <div
        ref={sectionRef}
        className="timeline-section"
        style={{ position: "relative" }}
      >
        <div className="section-label">Timeline of Events</div>

        {/* Spine */}
        <div className="timeline-spine-wrap" style={{ top: "8rem", height: "calc(100% - 8rem)" }}>
          <div className="spine-track" />
          <div
            className="spine-fill"
            style={{ transform: `scaleY(${spineProgress})`, height: "100%" }}
          />
        </div>

        {/* Events */}
        <div className="timeline-events">
          {TIMELINE_EVENTS.map((ev, i) => {
            const isLeft = i % 2 === 0;
            const isVisible = visibleEvents.includes(i);

            return (
              <div
                key={i}
                className={`event-row ${isLeft ? "left" : "right"} ${isVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${isVisible ? 0.05 : 0}s` }}
              >
                {isLeft && <div className="event-spacer" />}

                {/* Node */}
                <div
                  className="event-node"
                  style={{
                    color: ev.color,
                    boxShadow: isVisible ? `0 0 20px ${ev.color}44, 0 0 40px ${ev.color}22` : "none",
                    transition: "box-shadow 0.4s ease 0.3s",
                  }}
                >
                  {ev.icon}
                </div>

                {/* Card */}
                <div className="event-content">
                  <div className="flip-card">
                    <div className="flip-inner">
                      <div className="flip-front">
                        <div className="event-year" style={{ color: ev.color }}>
                          {ev.year}
                        </div>
                        <div className="event-title">{ev.title}</div>
                        <div className="event-short">{ev.short}</div>
                        <div className="flip-hint">Hover to reveal →</div>
                      </div>
                      <div className="flip-back">
                        <div className="event-year" style={{ color: ev.color }}>
                          {ev.year} · {ev.title}
                        </div>
                        <p className="event-detail">{ev.detail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {!isLeft && <div className="event-spacer" />}
              </div>
            );
          })}
        </div>
      </div>

    </>
  );
}