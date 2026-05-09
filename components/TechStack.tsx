"use client";

import { useEffect, useRef, useState } from "react";

// ─── CORRECT LOGOS ────────────────────────────────────────────────────────────
// Next.js — wordmark N shape, official
const NextLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
    <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1"/>
    <path d="M14 32V16h3.5l9 13.5V16H30v16h-3.5L17.5 18.5V32H14z" fill="currentColor"/>
  </svg>
);

// TypeScript — proper blue square with TS
const TSLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
    <rect x="2" y="2" width="24" height="24" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1"/>
    <path d="M8 14h7M11.5 11v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M17.5 17.5c.3.5.9.8 1.5.8.9 0 1.5-.5 1.5-1.3 0-.7-.4-1.1-1.4-1.4-.8-.3-1.6-.7-1.6-1.7 0-.9.7-1.6 1.8-1.6.7 0 1.3.3 1.6.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// React — atom
const ReactLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
    <circle cx="14" cy="14" r="2.2" fill="currentColor"/>
    <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="currentColor" strokeWidth="1.2"/>
    <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 14 14)"/>
    <ellipse cx="14" cy="14" rx="11" ry="4.5" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 14 14)"/>
  </svg>
);

// Sanity — S mark
const SanityLogo = () => (
  <svg viewBox="0 0 28 28" fill="currentColor" width="28" height="28">
    <path d="M19.5 10.8c0-2.8-2.2-4.8-5.5-4.8-2.2 0-4.3.9-5.8 2.4l1.8 2c1.1-1 2.4-1.6 3.8-1.6 1.5 0 2.4.7 2.4 1.8 0 1-.7 1.6-3 2.3-2.6.8-4.3 1.9-4.3 4.4 0 2.7 2.1 4.7 5.3 4.7 2.3 0 4.5-1 6-2.5l-1.8-2c-1.2 1-2.5 1.7-4 1.7-1.5 0-2.4-.7-2.4-1.8 0-1 .7-1.6 3-2.3 2.7-.8 4.5-1.8 4.5-4.3z"/>
  </svg>
);

// Tailwind
const TailwindLogo = () => (
  <svg viewBox="0 0 28 28" fill="currentColor" width="28" height="28">
    <path d="M14 7.2c-3.7 0-6.1 1.9-7 5.6 1.4-1.9 3-2.6 4.9-2.1 1.1.27 1.8 1.04 2.67 1.9C15.86 13.95 17.5 15.6 21 15.6c3.7 0 6.1-1.9 7-5.6-1.4 1.9-3 2.6-4.9 2.1-1.1-.27-1.8-1.04-2.67-1.9C19.14 8.85 17.5 7.2 14 7.2zM7 14.8c-3.7 0-6.1 1.9-7 5.6 1.4-1.9 3-2.6 4.9-2.1 1.1.27 1.8 1.04 2.67 1.9C8.86 21.55 10.5 23.2 14 23.2c3.7 0 6.1-1.9 7-5.6-1.4 1.9-3 2.6-4.9 2.1-1.1-.27-1.8-1.04-2.67-1.9C12.14 16.45 10.5 14.8 7 14.8z"/>
  </svg>
);

// Three.js — geometric triangle
const ThreeLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
    <polygon points="14,3 25,22 3,22" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    <polygon points="14,10 19.5,19 8.5,19" fill="currentColor" opacity="0.55"/>
    <circle cx="14" cy="3"  r="1.5" fill="currentColor"/>
    <circle cx="25" cy="22" r="1.5" fill="currentColor"/>
    <circle cx="3"  cy="22" r="1.5" fill="currentColor"/>
  </svg>
);

// Framer Motion — F mark
const FramerLogo = () => (
  <svg viewBox="0 0 28 28" fill="currentColor" width="28" height="28">
    <path d="M5 4h18v9H14L5 4zm0 9h9l9 9H14v-4.5L5 13zm0 9h9v5.5L5 22z"/>
  </svg>
);

// Shopify — bag + S (matches Shopify brand icon silhouette)
const ShopifyLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
    {/* Bag body */}
    <path d="M7 12h14l-1.4 12H8.4L7 12z" fill="currentColor" fillOpacity="0.13" stroke="currentColor" strokeWidth="1.2"/>
    {/* Handle */}
    <path d="M11 12c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    {/* S glyph */}
    <path d="M12.2 16.4c0-.9.8-1.6 1.8-1.6h.5c.9 0 1.5-.6 1.5-1.3 0-.5-.4-.9-1-.9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" fill="none"/>
    <path d="M15.8 17.6c0 .9-.8 1.6-1.8 1.6h-.5c-.9 0-1.5.6-1.5 1.3 0 .5.4.9 1 .9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" fill="none"/>
  </svg>
);

// WebGL — hexagon
const WebGLLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
    <polygon points="14,3 23,8 23,18 14,23 5,18 5,8" stroke="currentColor" strokeWidth="1.3"/>
    <polygon points="14,8 19,11 19,17 14,20 9,17 9,11" fill="currentColor" opacity="0.35"/>
    <circle cx="14" cy="3"  r="1.3" fill="currentColor"/>
    <circle cx="23" cy="8"  r="1.3" fill="currentColor"/>
    <circle cx="23" cy="18" r="1.3" fill="currentColor"/>
    <circle cx="14" cy="23" r="1.3" fill="currentColor"/>
    <circle cx="5"  cy="18" r="1.3" fill="currentColor"/>
    <circle cx="5"  cy="8"  r="1.3" fill="currentColor"/>
  </svg>
);

// ─── STACK DATA ───────────────────────────────────────────────────────────────
const STACK = [
  {
    id: "nextjs",
    name: "Next.js",
    tag: "RUNTIME_FRAMEWORK",
    version: "v14.2",
    role: "Frontend Framework",
    desc: "App Router with RSC, streaming, and edge-optimised delivery. Every project ships with ISR and route-level code splitting.",
    metric: "0.8s TTI",
    Logo: NextLogo,
  },
  {
    id: "react",
    name: "React",
    tag: "UI_LAYER",
    version: "v18.3",
    role: "Component Engine",
    desc: "Concurrent Mode, Suspense boundaries, and server components. UI trees that scale without accumulating technical debt.",
    metric: "Concurrent Mode",
    Logo: ReactLogo,
  },
  {
    id: "typescript",
    name: "TypeScript",
    tag: "TYPE_SYSTEM",
    version: "v5.4",
    role: "Type Safety",
    desc: "Strict mode across every project. Type errors caught at compile time — zero runtime surprises delivered to your clients.",
    metric: "Zero Runtime Errors",
    Logo: TSLogo,
  },
  {
    id: "tailwind",
    name: "Tailwind",
    tag: "STYLING_ENGINE",
    version: "v4",
    role: "Utility CSS",
    desc: "CSS-first config with @theme tokens in v4. Zero runtime, sub-10kb output. Design tokens consistent across every component.",
    metric: "Zero Runtime CSS",
    Logo: TailwindLogo,
  },
  {
    id: "sanity",
    name: "Sanity CMS",
    tag: "CONTENT_LAYER",
    version: "v3",
    role: "Headless CMS",
    desc: "Structured content with real-time CDN delivery. Clients manage their own content without ever touching the codebase.",
    metric: "Real-time CDN",
    Logo: SanityLogo,
  },
  {
    id: "shopify",
    name: "Shopify",
    tag: "COMMERCE_LOGIC",
    version: "Hydrogen",
    role: "Commerce Platform",
    desc: "Headless Shopify via Hydrogen and Storefront API. Product catalogues, carts, and checkout rebuilt as fast Next.js experiences.",
    metric: "Headless API",
    Logo: ShopifyLogo,
  },
  {
    id: "threejs",
    name: "Three.js",
    tag: "3D_ENGINE",
    version: "r165",
    role: "WebGL Renderer",
    desc: "Custom shaders, particle systems, and interactive 3D interfaces. The visual layer that makes agency clients look like they spent 10x more.",
    metric: "60fps @ 4K",
    Logo: ThreeLogo,
  },
  {
    id: "framer",
    name: "Framer Motion",
    tag: "ANIMATION_STATE",
    version: "v11",
    role: "Motion Engine",
    desc: "Layout animations, shared element transitions, and gesture-driven interactions. The difference between a site that works and one that feels alive.",
    metric: "GPU Accelerated",
    Logo: FramerLogo,
  },
];

// ─── TERMINAL READOUT ─────────────────────────────────────────────────────────
function TerminalReadout({ tech }: { tech: typeof STACK[0] }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    setLines([]);
    const LINES = [
      `> LOADING ${tech.id.toUpperCase()}_MODULE...`,
      `> VERSION: ${tech.version}`,
      `> ROLE: ${tech.role.toUpperCase()}`,
      `> PERF: ${tech.metric.toUpperCase()}`,
      `> STATUS: [ACTIVE]`,
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < LINES.length && LINES[i] !== undefined) {
        const line = LINES[i];
        setLines(prev => [...prev, line]);
      }
      i++;
      if (i >= LINES.length) clearInterval(iv);
    }, 90);
    return () => clearInterval(iv);
  }, [tech.id]);

  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.9 }}>
      {lines.filter(Boolean).map((l, i) => (
        <div key={i} style={{
          color: l.includes("ACTIVE")
            ? "#F25C43"
            : l.includes("VERSION")
              ? "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
        }}>
          {l}
          {i === lines.length - 1 && (
            <span style={{ animation: "blink 1s step-end infinite" }}>█</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function TechStack() {
  const ref      = useRef(null);
  const [active, setActive]   = useState(STACK[0]);
  const [entered, setEntered] = useState(false);
  const [fill, setFill]       = useState(0);
  const [panelOpen, setPanelOpen] = useState(false); // mobile panel toggle

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setFill(0);
    const t = setTimeout(() => setFill(100), 50);
    return () => clearTimeout(t);
  }, [active.id]);

  const handleSelect = (tech: typeof STACK[0]) => {
    setActive(tech);
    setPanelOpen(true); // on mobile, open panel on select
  };

  const activeIndex = STACK.findIndex(s => s.id === active.id);

  return (
    <>
      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanH    { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes navyGlow { 0%,100%{opacity:0.28} 50%{opacity:0.55} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        .ts-item {
          background: #030303;
          padding: 22px 20px;
          display: flex; flex-direction: column; gap: 10px;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: background 0.3s;
          -webkit-tap-highlight-color: transparent;
          min-height: 90px;
        }
        .ts-item::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: #F25C43;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.76,0,0.24,1);
        }
        .ts-item::after {
          content: '';
          position: absolute; top: 0; left: 0; bottom: 0; width: 2px;
          background: #1A2848;
          transform: scaleY(0); transform-origin: bottom;
          transition: transform 0.35s cubic-bezier(0.76,0,0.24,1);
        }
        .ts-item:hover::before, .ts-item.active::before { transform: scaleX(1); }
        .ts-item.active::after  { transform: scaleY(1); }
        .ts-item:hover          { background: rgba(255,255,255,0.018); }
        .ts-item.active         { background: rgba(242,92,67,0.04); }

        .ts-tag {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.22em; color: rgba(255,255,255,0.35);
          text-transform: uppercase; transition: color 0.3s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ts-item.active .ts-tag { color: #F25C43; }

        .ts-icon {
          color: rgba(255,255,255,0.65); transition: color 0.3s, transform 0.3s;
          display: flex; align-items: center;
        }
        .ts-item:hover .ts-icon, .ts-item.active .ts-icon {
          color: rgba(255,255,255,0.9); transform: scale(1.06);
        }

        .ts-name {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.1em; color: rgba(255,255,255,0.65);
          text-transform: uppercase; transition: color 0.3s;
        }
        .ts-item:hover .ts-name, .ts-item.active .ts-name { color: #fff; }

        /* Mobile panel overlay */
        .ts-mobile-panel {
          display: none;
        }

        @media (max-width: 900px) {
          .ts-grid     { grid-template-columns: repeat(4, 1fr) !important; }
          .ts-readout  { display: none !important; }
          .ts-mobile-panel { display: block !important; }
        }
        @media (max-width: 640px) {
          .ts-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .ts-item     { padding: 16px 14px; min-height: 80px; }
          .ts-tag      { font-size: 10px; letter-spacing: 0.16em; }
          .ts-name     { font-size: 11px; }
        }
        @media (max-width: 380px) {
          .ts-grid     { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <section
        ref={ref}
        id="techstack"
        style={{
          background: "#030303",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "80px 6vw",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Navy ambient */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: 400, height: 300,
          background: "radial-gradient(ellipse at 0% 100%, rgba(26,40,72,0.3) 0%, transparent 65%)",
          pointerEvents: "none", animation: "navyGlow 7s ease-in-out infinite",
        }} />

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", marginBottom: 48,
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.32em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            <span style={{ color: "#F25C43" }}>◆</span> CORE_INFRASTRUCTURE // SYSTEM_MODULES
          </div>
          <div style={{ flex: 1, minWidth: 40, height: 1, background: "linear-gradient(to right, rgba(242,92,67,0.35), rgba(26,40,72,0.2), transparent)" }} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>
            {STACK.length} MODULES_LOADED
          </div>
        </div>

        {/* ── Module grid ── */}
        <div
          className="ts-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {STACK.map((tech, i) => (
            <div
              key={tech.id}
              className={`ts-item${active.id === tech.id ? " active" : ""}`}
              onClick={() => handleSelect(tech)}
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s, background 0.3s`,
              }}
            >
              <div className="ts-tag">{tech.tag}</div>
              <div className="ts-icon"><tech.Logo /></div>
              <div className="ts-name">{tech.name}</div>
            </div>
          ))}
        </div>

        {/* ── Desktop readout panel ── */}
        <div
          className="ts-readout"
          style={{
            marginTop: 2,
            background: "rgba(255,255,255,0.018)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          {/* Left — name + desc */}
          <div style={{ padding: "32px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ color: "#F25C43", marginBottom: 16, opacity: 0.7 }}>
              <active.Logo />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 52, color: "#fff", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 6 }}>
              {active.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "#F25C43", textTransform: "uppercase", marginBottom: 20 }}>
              {active.tag} // {active.version}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, letterSpacing: "0.02em" }}>
              {active.desc}
            </div>
            {/* Progress bar */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginTop: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fill}%`, background: "linear-gradient(to right, #1A2848, #F25C43)", transition: "width 0.7s cubic-bezier(0.76,0,0.24,1)" }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, width: 60, background: "linear-gradient(to right, transparent, rgba(242,92,67,0.35), transparent)", animation: "scanH 2s ease infinite" }} />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.2em", marginTop: 14 }}>
              MODULE {String(activeIndex + 1).padStart(2, "0")} / {String(STACK.length).padStart(2, "0")}
            </div>
          </div>

          {/* Right — terminal */}
          <div style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "rgba(26,40,72,0.06)" }}>
            <TerminalReadout tech={active} />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 14px", border: "1px solid rgba(242,92,67,0.2)",
              background: "rgba(242,92,67,0.05)", fontFamily: "var(--font-mono)",
              fontSize: 11, letterSpacing: "0.2em", color: "#F25C43",
              alignSelf: "flex-start", marginTop: 24,
            }}>
              <span style={{ width: 5, height: 5, background: "#F25C43", borderRadius: "50%", display: "inline-block" }} />
              PERF: {active.metric}
            </div>
          </div>
        </div>

        {/* ── Mobile readout — bottom sheet style ── */}
        <div className="ts-mobile-panel">
          {panelOpen && (
            <div style={{
              marginTop: 2,
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: "2px solid rgba(26,40,72,0.6)",
              background: "#0A0A0A",
              animation: "slideUp 0.3s ease forwards",
              position: "relative",
            }}>
              {/* Close button */}
              <button
                onClick={() => setPanelOpen(false)}
                style={{
                  position: "absolute", top: 14, right: 16,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)",
                  padding: "4px 8px",
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                CLOSE ✕
              </button>

              {/* Panel chrome */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(26,40,72,0.1)", display: "flex", gap: 6 }}>
                {["#F25C43","rgba(26,40,72,0.8)","rgba(255,255,255,0.07)"].map((c,i) => (
                  <div key={i} style={{ width:8,height:8,borderRadius:"50%",background:c }} />
                ))}
                <span style={{ fontFamily:"var(--font-mono)",fontSize:11,color:"rgba(255,255,255,0.25)",letterSpacing:"0.16em",marginLeft:8 }}>
                  MODULE_READOUT.log
                </span>
              </div>

              <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Name + version */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "#fff", letterSpacing: "0.03em", lineHeight: 1, marginBottom: 4 }}>
                      {active.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#F25C43", letterSpacing: "0.18em" }}>
                      {active.tag} // {active.version}
                    </div>
                  </div>
                  <div style={{ color: "#F25C43", opacity: 0.6, flexShrink: 0, marginTop: 4 }}>
                    <active.Logo />
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "linear-gradient(to right, #1A2848, rgba(242,92,67,0.3), transparent)" }} />

                {/* Description */}
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: 0 }}>
                  {active.desc}
                </p>

                {/* Metric + module counter */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "6px 14px", border: "1px solid rgba(242,92,67,0.2)",
                    background: "rgba(242,92,67,0.05)", fontFamily: "var(--font-mono)",
                    fontSize: 11, letterSpacing: "0.16em", color: "#F25C43",
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#F25C43", display: "inline-block" }} />
                    {active.metric}
                  </div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "6px 14px", border: "1px solid rgba(26,40,72,0.4)",
                    background: "rgba(26,40,72,0.1)", fontFamily: "var(--font-mono)",
                    fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)",
                  }}>
                    MODULE {String(activeIndex + 1).padStart(2,"0")} / {String(STACK.length).padStart(2,"0")}
                  </div>
                </div>

                {/* Terminal readout — compact on mobile */}
                <div style={{ background: "#030303", border: "1px solid rgba(26,40,72,0.3)", borderLeft: "2px solid #1A2848", padding: "14px 16px" }}>
                  <TerminalReadout tech={active} />
                </div>

                {/* Progress bar */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ height: "100%", width: `${fill}%`, background: "linear-gradient(to right, #1A2848, #F25C43)", transition: "width 0.7s cubic-bezier(0.76,0,0.24,1)" }} />
                </div>
              </div>
            </div>
          )}

          {/* Tap hint — only when no panel open */}
          {!panelOpen && (
            <div style={{
              marginTop: 8, textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)",
              padding: "10px 0",
            }}>
              TAP A MODULE TO INSPECT
            </div>
          )}
        </div>
      </section>
    </>
  );
}