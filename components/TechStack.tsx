"use client";

import { useEffect, useRef, useState } from "react";

// ─── STACK DATA ───────────────────────────────────────────────────────────────
const STACK = [
  {
    id: "nextjs",
    name: "Next.js",
    tag: "RUNTIME",
    version: "v14.2",
    role: "Frontend Framework",
    desc: "App Router architecture with RSC, streaming, and edge-optimised delivery. Every project ships with ISR and route-level code splitting.",
    metric: "0.8s TTI",
    svg: (
      <svg viewBox="0 0 180 180" fill="none" width="28" height="28">
        <mask id="nxt"><path d="M0 0h180v180H0z" fill="#fff"/></mask>
        <g mask="url(#nxt)">
          <path fillRule="evenodd" clipRule="evenodd" d="M180 0H0v180h180V0zM82.684 136.195L52.894 72.39H41.474v63.805H27v-89.58h25.053l31.158 66.864V46.615h14.473v89.58H82.684zM119.588 88.07l20.18-41.455h17.304l-28.736 57.704-.421.758 12.39 25.052h.02l5.77 11.666h-16.148l-9.978-20.179-19.117-38.652h-.842V141.79h-14.474V46.615h14.474v41.455h-.422z" fill="currentColor"/>
        </g>
      </svg>
    ),
  },
  {
    id: "react",
    name: "React",
    tag: "UI_LAYER",
    version: "v18.3",
    role: "Component Engine",
    desc: "Concurrent Mode, Suspense boundaries, and server components. UI trees that scale without accumulating technical debt.",
    metric: "Concurrent Mode",
    svg: (
      <svg viewBox="-10.5 -9.45 21 18.9" fill="none" width="28" height="28">
        <circle cx="0" cy="0" r="2" fill="currentColor"/>
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="10" ry="4.5"/>
          <ellipse rx="10" ry="4.5" transform="rotate(60)"/>
          <ellipse rx="10" ry="4.5" transform="rotate(120)"/>
        </g>
      </svg>
    ),
  },
  {
    id: "typescript",
    name: "TypeScript",
    tag: "TYPE_SYSTEM",
    version: "v5.4",
    role: "Type Safety",
    desc: "Strict mode across every project. Type errors caught at compile time mean zero runtime surprises delivered to your clients.",
    metric: "Zero Runtime Errors",
    svg: (
      <svg viewBox="0 0 128 128" fill="currentColor" width="28" height="28">
        <path d="M1.5 63.915C1.5 29.496 29.418 1.5 63.996 1.5S126.5 29.496 126.5 63.915 98.58 126.5 64.004 126.5 1.5 98.504 1.5 63.915zm23.67 43.123h18.23V64.84h-7.796v-13.91h33.868v13.91h-7.832v42.198h18.307v12.42H25.17v-12.42zm73.973-10.748c0-8.236-3.56-12.422-17.65-17.746-8.237-3.09-9.39-5.435-9.39-8.487 0-3.905 2.947-6.14 8.236-6.14 5.917 0 9.872 2.716 10.95 7.852l15.53-3.647c-2.603-10.79-11.434-16.47-26.047-16.47-16.37 0-25.08 7.94-25.08 20.016 0 8.87 4.043 13.538 17.5 18.677 8.35 3.09 9.54 5.88 9.54 9.043 0 4.167-3.424 6.623-9.54 6.623-7.518 0-11.536-3.424-12.578-9.86l-16.148 2.68c2.455 12.875 12.02 19.38 29.025 19.38 16.22 0 25.7-8.125 25.7-21.92z"/>
      </svg>
    ),
  },
  {
    id: "threejs",
    name: "Three.js",
    tag: "3D_ENGINE",
    version: "r165",
    role: "WebGL Renderer",
    desc: "Custom shaders, particle systems, and interactive 3D interfaces. The visual layer that makes agency clients look like they spent 10x more.",
    metric: "60fps @ 4K",
    svg: (
      <svg viewBox="0 0 100 100" fill="currentColor" width="28" height="28">
        <polygon points="50,5 95,80 5,80" fill="none" stroke="currentColor" strokeWidth="6"/>
        <polygon points="50,30 72,68 28,68" fill="currentColor" opacity="0.6"/>
        <circle cx="50" cy="5" r="4" fill="currentColor"/>
        <circle cx="95" cy="80" r="4" fill="currentColor"/>
        <circle cx="5" cy="80" r="4" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: "sanity",
    name: "Sanity CMS",
    tag: "CONTENT_LAYER",
    version: "v3",
    role: "Headless CMS",
    desc: "Structured content with real-time CDN delivery. Clients manage their own content without ever touching the codebase.",
    metric: "Real-time CDN",
    svg: (
      <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28">
        <path d="M27.8 18.3c0 4.9-3.8 7.7-9.4 7.7-4.1 0-8.3-1.7-11.2-4.4l3.3-3.9c2.2 2 4.6 3.3 8 3.3 2.3 0 3.7-.9 3.7-2.4v-.1c0-1.4-.9-2.1-5.1-3.2C11.6 14 7.9 12.6 7.9 7.5v-.1C7.9 3 11.6.4 16.9.4c3.8 0 7.2 1.3 9.8 3.5l-3 4.1c-2.2-1.6-4.5-2.6-6.9-2.6-2.1 0-3.3 1-3.3 2.2v.1c0 1.6 1 2.2 5.4 3.3 4.6 1.2 8 2.9 8 7.3z"/>
      </svg>
    ),
  },
  {
    id: "tailwind",
    name: "Tailwind",
    tag: "STYLING",
    version: "v4",
    role: "Utility CSS",
    desc: "CSS-first config with @theme tokens in v4. Zero runtime, sub-10kb CSS output. Design tokens that stay consistent across every component.",
    metric: "Zero Runtime CSS",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624-1.177-1.194-2.538-2.576-5.512-2.576z"/>
      </svg>
    ),
  },
  {
    id: "framer",
    name: "Framer Motion",
    tag: "ANIMATION",
    version: "v11",
    role: "Motion Engine",
    desc: "Layout animations, shared element transitions, and gesture-driven interactions. The difference between a site that works and one that feels alive.",
    metric: "GPU Accelerated",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
      </svg>
    ),
  },
  {
    id: "webgl",
    name: "WebGL",
    tag: "GPU_LAYER",
    version: "2.0",
    role: "GPU Pipeline",
    desc: "Direct GPU access for canvas-based visuals, custom shaders, and hardware-accelerated rendering at frame rates no CSS can match.",
    metric: "Hardware Rendered",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <polygon points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5" fill="currentColor" opacity="0.4"/>
        <circle cx="12" cy="2" r="1.5" fill="currentColor"/>
        <circle cx="22" cy="7" r="1.5" fill="currentColor"/>
        <circle cx="22" cy="17" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="22" r="1.5" fill="currentColor"/>
        <circle cx="2" cy="17" r="1.5" fill="currentColor"/>
        <circle cx="2" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
];

// ─── TERMINAL READOUT ─────────────────────────────────────────────────────────
function TerminalReadout({ tech }: { tech: typeof STACK[number] }) {
  const [lines, setLines] = useState<string[]>([]);

  const LINES = [
    `> LOADING ${tech.id.toUpperCase()}_MODULE...`,
    `> VERSION: ${tech.version}`,
    `> ROLE: ${tech.role.toUpperCase()}`,
    `> PERF: ${tech.metric.toUpperCase()}`,
    `> STATUS: [ACTIVE]`,
  ];

  useEffect(() => {
    setLines([]);
    let i = 0;
    const iv = setInterval(() => {
      const line = LINES[i];
      if (line !== undefined) setLines(prev => [...prev, line]);
      i++;
      if (i >= LINES.length) clearInterval(iv);
    }, 90);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tech.id]);

  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      lineHeight: 1.9,
    }}>
      {lines.filter(Boolean).map((l, i) => (
        <div key={i} style={{
          color: l.includes("ACTIVE")
            ? "#F25C43"
            : l.includes("VERSION")
              ? "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0.55)",
          letterSpacing: "0.1em",
        }}>
          {l}
          {i === lines.length - 1 && lines.length < LINES.length && (
            <span style={{ animation: "blink 1s step-end infinite" }}>█</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TechStack() {
  const ref = useRef(null);
  const [active, setActive] = useState(STACK[0]);
  const [entered, setEntered] = useState(false);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Progress bar animation on module change
  useEffect(() => {
    setFill(0);
    const t = setTimeout(() => setFill(100), 50);
    return () => clearTimeout(t);
  }, [active.id]);

  const activeIndex = STACK.findIndex(s => s.id === active.id);

  return (
    <>
      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanH    { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes navyGlow { 0%,100%{opacity:0.3} 50%{opacity:0.6} }

        .ts-item {
          background: #030303;
          padding: 26px 22px;
          display: flex; flex-direction: column; gap: 12px;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: background 0.3s;
        }
        .ts-item::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: #F25C43;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.76,0,0.24,1);
        }
        /* Navy left edge on active */
        .ts-item::after {
          content: '';
          position: absolute; top: 0; left: 0; bottom: 0;
          width: 2px;
          background: #1A2848;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.35s cubic-bezier(0.76,0,0.24,1);
        }
        .ts-item:hover::before,
        .ts-item.active::before  { transform: scaleX(1); }
        .ts-item.active::after   { transform: scaleY(1); }
        .ts-item:hover            { background: rgba(255,255,255,0.018); }
        .ts-item.active           { background: rgba(242,92,67,0.035); }

        .ts-item-tag {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.25em;
          color: rgba(255,255,255,0.6); text-transform: uppercase;
          transition: color 0.3s;
        }
        .ts-item.active .ts-item-tag { color: #F25C43; }

        .ts-item-icon {
          color: rgba(255,255,255,0.7);
          transition: color 0.3s, transform 0.3s;
        }
        .ts-item:hover .ts-item-icon,
        .ts-item.active .ts-item-icon {
          color: rgba(255,255,255,0.9);
          transform: scale(1.08);
        }

        .ts-item-name {
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.7); text-transform: uppercase;
          transition: color 0.3s;
        }
        .ts-item:hover .ts-item-name,
        .ts-item.active .ts-item-name { color: rgba(255,255,255,0.9); }
      `}</style>

      <section
        ref={ref}
        id="techstack"
        style={{
          background: "#030303",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "80px 6vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Navy ambient — bottom left */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: 400, height: 300,
          background: "radial-gradient(ellipse at 0% 100%, rgba(26,40,72,0.3) 0%, transparent 65%)",
          pointerEvents: "none",
          animation: "navyGlow 7s ease-in-out infinite",
        }} />

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          marginBottom: 56,
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10, letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
          }}>
            <span style={{ color: "#F25C43" }}>◆</span> CORE_INFRASTRUCTURE // SYSTEM_MODULES
          </div>
          <div style={{
            flex: 1, height: 1,
            background: "linear-gradient(to right, rgba(242,92,67,0.35), rgba(26,40,72,0.2), transparent)",
          }} />
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10, letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.3)",
          }}>
            {STACK.length} MODULES_LOADED
          </div>
        </div>

        {/* ── Tech grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }} className="ts-grid">
          {STACK.map((tech, i) => (
            <div
              key={tech.id}
              className={`ts-item${active.id === tech.id ? " active" : ""}`}
              onClick={() => setActive(tech)}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 0.055}s, transform 0.5s ease ${i * 0.055}s, background 0.3s`,
              }}
            >
              <div className="ts-item-tag">{tech.tag}</div>
              <div className="ts-item-icon">{tech.svg}</div>
              <div className="ts-item-name">{tech.name}</div>
            </div>
          ))}
        </div>

        {/* ── Readout panel ── */}
        <div style={{
          marginTop: 2,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          opacity: entered ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }} className="ts-readout">

          {/* Left — name + desc + progress */}
          <div style={{
            padding: "32px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}>
            {/* Active icon */}
            <div style={{
              color: "#F25C43", marginBottom: 16,
              opacity: 0.7,
            }}>
              {active.svg}
            </div>

            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 52, color: "#fff",
              letterSpacing: "0.02em", lineHeight: 1,
              marginBottom: 6,
            }}>{active.name}</div>

            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11, letterSpacing: "0.2em",
              color: "#F25C43", textTransform: "uppercase",
              marginBottom: 20,
            }}>
              {active.tag} // {active.version}
            </div>

            <div style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13, fontWeight: 300,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.75, letterSpacing: "0.02em",
            }}>{active.desc}</div>

            {/* Progress bar */}
            <div style={{
              height: 1,
              background: "rgba(255,255,255,0.07)",
              marginTop: 28, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${fill}%`,
                background: "linear-gradient(to right, #1A2848, #F25C43)",
                transition: "width 0.7s cubic-bezier(0.76,0,0.24,1)",
              }} />
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                width: 60,
                background: "linear-gradient(to right, transparent, rgba(242,92,67,0.35), transparent)",
                animation: "scanH 2s ease infinite",
              }} />
            </div>

            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10, color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em", marginTop: 14,
            }}>
              MODULE {String(activeIndex + 1).padStart(2, "0")} / {String(STACK.length).padStart(2, "0")}
            </div>
          </div>

          {/* Right — terminal + metric badge */}
          <div style={{
            padding: "32px",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            background: "rgba(26,40,72,0.06)", // very subtle navy tint on terminal side
          }}>
            <TerminalReadout tech={active} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 14px",
              border: "1px solid rgba(242,92,67,0.2)",
              background: "rgba(242,92,67,0.05)",
              fontFamily: "var(--font-mono)",
              fontSize: 10, letterSpacing: "0.2em",
              color: "#F25C43", textTransform: "uppercase",
              alignSelf: "flex-start", marginTop: 24,
            }}>
              <span style={{ width: 5, height: 5, background: "#F25C43", borderRadius: "50%", display: "inline-block" }} />
              PERF: {active.metric}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .ts-grid     { grid-template-columns: repeat(2, 1fr) !important; }
            .ts-readout  { grid-template-columns: 1fr !important; }
            .ts-readout > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
          }
        `}</style>
      </section>
    </>
  );
}