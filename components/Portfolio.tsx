"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Project = {
  id: string; cat: string; client: string; type: string;
  year: string; location: string; url: string;
  metric: string; metricLabel: string;
  palette: string[]; tags: string[]; story: string; result: string;
  quote: { text: string; author: string };
  locked?: boolean; noLink?: boolean; screenshotOnly?: boolean;
};

const RETAIL: Project[] = [
  {
    id: "01", cat: "RETAIL",
    client: "Elvyn Store", type: "Next.js Storefront",
    year: "2025", location: "Colombo, LK",
    url: "https://elvynstore.com",
    metric: "100", metricLabel: "PageSpeed",
    palette: ["#2D6A9F", "#1A3D5C", "#C8DEFF"],
    tags: ["E-Commerce", "Mobile-First", "Headless"],
    story: "Sajid needed a real store — not an Instagram page. We rebuilt from scratch: Next.js storefront, product catalogue, cart, mobile-first checkout.",
    result: "100/100 PageSpeed. 5-star Google review. Delivered in 7 days.",
    quote: { text: "Fully committed to delivering high-performance assets on time without compromising quality.", author: "Sajid Ifham" },
  },
  {
    id: "02", cat: "BRAND",
    client: "HEDONE Skincare", type: "Editorial Brand Site",
    year: "2026", location: "Sri Lanka",
    url: "https://hedone-skincare.vercel.app",
    metric: "😮", metricLabel: "First Reaction",
    palette: ["#C4915A", "#8B5E3C", "#FFE8D0"],
    tags: ["Brand", "Editorial", "Skincare"],
    story: "Uthpala had been designing her own packaging because no one had the taste to match her brand. We built the website that finally matched it.",
    result: "Client's jaw dropped on first preview. Delivered in 5 days.",
    quote: { text: "For the first time someone nailed it and that's you. Literally my jaw dropped.", author: "Uthpala Pathirana" },
  },
  {
    id: "03", cat: "MULTI-STORE",
    client: "Ambrins — 3 Stores", type: "E-Commerce Suite",
    year: "2026", location: "Colombo, LK",
    url: "https://ambrinsfabrics.lk",
    metric: "3×", metricLabel: "Stores Launched",
    palette: ["#9B6B9B", "#5C3D5C", "#F0E0FF"],
    tags: ["Multi-Store", "Fashion", "Rapid Launch"],
    story: "One client, three product lines, three distinct brand identities — all launched in a single month. Each store had its own look, inventory, and customer experience.",
    result: "Three live stores. One month. Zero compromises.",
    quote: { text: "The transition to our new digital engine was seamless.", author: "Ambrins Client" },
  },
  {
    id: "04", cat: "LIFESTYLE",
    client: "The Balanced Pantry", type: "Lifestyle Store",
    year: "2026", location: "Colombo, LK",
    url: "https://thebalancedpantry.lk",
    metric: "<1s", metricLabel: "Load Time",
    palette: ["#4A7C4E", "#2D4E30", "#D8F0DA"],
    tags: ["Lifestyle", "Health", "Editorial"],
    story: "Health and lifestyle brand needed an online presence as clean and considered as their products. Editorial shopping experience built for discerning customers.",
    result: "Sub-second load. Clean editorial experience. On time.",
    quote: { text: "Exactly what we envisioned — clean, fast, and premium.", author: "Balanced Pantry Team" },
  },
];

const CORPORATE: Project[] = [
  {
    id: "05", cat: "SAAS",
    client: "UK Healthcare Client", type: "SaaS Pitch Deck",
    year: "2026", location: "United Kingdom",
    url: "https://arixa.vercel.app",
    metric: "NDA", metricLabel: "Restricted",
    palette: ["#1A6B8A", "#0D3D52", "#C0E8FF"],
    tags: ["SaaS", "Healthcare", "Pitch"],
    story: "Healthcare SaaS platform needed a pitch deck that matched the ambition of the product. High-end scroll-driven frontend built for investor audiences.",
    result: "World-class SaaS frontend. Delivered to spec.",
    quote: { text: "Executed exactly to brief. Zero revisions needed.", author: "UK Agency Client" },
    locked: true,
  },
  {
    id: "06", cat: "B2B",
    client: "UK Advisory Client", type: "Strategic Architecture",
    year: "2026", location: "United Kingdom",
    url: "https://arkmurus.vercel.app",
    metric: "B2B", metricLabel: "Advisory",
    palette: ["#8A6B1A", "#524010", "#FFE8B0"],
    tags: ["Advisory", "Stealth Wealth", "Precision"],
    story: "B2B advisory firm required a stealth wealth aesthetic — premium without ostentation. Precision layout, measured typography, architectural restraint.",
    result: "Stealth premium. Every pixel intentional.",
    quote: { text: "The aesthetic judgment here is extraordinary.", author: "UK Agency Client" },
    locked: true,
  },
  {
    id: "07", cat: "SAAS",
    client: "UK SaaS Client", type: "API Platform Landing",
    year: "2026", location: "United Kingdom",
    url: "https://10qbit.vercel.app",
    metric: "API", metricLabel: "Platform",
    palette: ["#2D2D8A", "#1A1A52", "#C0C0FF"],
    tags: ["SaaS", "API", "Scroll-Driven"],
    story: "API-based SaaS needed a frontend that communicated technical depth without losing accessibility. Scroll-driven architecture with editorial data density.",
    result: "Technical credibility through design. Delivered clean.",
    quote: { text: "This is the level we were looking for.", author: "UK Agency Client" },
    locked: true,
  },
  {
    id: "08", cat: "HOSPITALITY",
    client: "UK Hospitality Client", type: "Premium Hospitality",
    year: "2026", location: "United Kingdom",
    url: "https://theharleylounge.vercel.app",
    metric: "↑↑", metricLabel: "Transformation",
    palette: ["#6B1A1A", "#3D0D0D", "#FFD0D0"],
    tags: ["Hospitality", "Luxury", "WordPress→Next.js"],
    story: "WordPress site that embarrassed a premium London brand. Rebuilt as a cinematic Next.js experience — same content, completely different world.",
    result: "WordPress → cinematic Next.js. Unrecognisable.",
    quote: { text: "I didn't think it was possible to make it look this good.", author: "UK Agency Client" },
    locked: true, noLink: true, screenshotOnly: true,
  },
];

// ─── BROWSER MOCKUP ───────────────────────────────────────────────────────────
function BrowserMockup({ project, revealed, isLocked }: { project: Project; revealed: boolean; isLocked: boolean }) {
  const { url, palette, screenshotOnly, noLink } = project;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const screenshotSrc = url && !failed
    ? `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
    : null;

  const blurred = isLocked && !revealed;

  useEffect(() => { setLoaded(false); setFailed(false); }, [url]);

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 36, flexShrink: 0,
        background: "#111", borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", padding: "0 14px", gap: 10,
        borderRadius: "8px 8px 0 0",
      }}>
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 5 }}>
          {["#F25C43", "rgba(26,40,72,0.8)", "rgba(255,255,255,0.1)"].map((c,i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        {/* Address bar */}
        <div style={{
          flex: 1, height: 20, maxWidth: 320,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 4,
          display: "flex", alignItems: "center", paddingInline: 8, gap: 5,
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: blurred ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
            {blurred ? "████████████████" : (url?.replace("https://","") || "private")}
          </span>
        </div>
      </div>

      {/* Screen */}
      <div style={{
        flex: 1, position: "relative", overflow: "hidden",
        background: `linear-gradient(145deg, ${palette[1]}55, ${palette[0]}22)`,
        borderRadius: "0 0 8px 8px",
      }}>
        {/* Screenshot */}
        {screenshotSrc && (
          <>
            {!loaded && (
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(90deg, ${palette[1]}33 25%, ${palette[0]}22 50%, ${palette[1]}33 75%)`,
                backgroundSize: "200% 100%", animation: "shimmer 1.8s ease infinite",
              }} />
            )}
            <img
              src={screenshotSrc}
              alt={project.client}
              loading="lazy" decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "top center",
                filter: blurred ? "blur(16px) brightness(0.25)" : "brightness(0.88)",
                transform: blurred ? "scale(1.1)" : "scale(1)",
                transition: "filter 0.6s ease, transform 0.6s ease, opacity 0.5s",
                opacity: loaded ? 1 : 0,
              }}
            />
          </>
        )}

        {/* Fallback */}
        {(!screenshotSrc || failed) && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 12, opacity: blurred ? 0.15 : 0.45,
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 72, color: palette[0], lineHeight: 1, opacity: 0.4 }}>
              {project.client[0]}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", color: palette[0] }}>
              {project.type.toUpperCase()}
            </div>
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 50%, rgba(3,3,3,0.6) 100%)",
          pointerEvents: "none",
        }} />

        {/* Palette stripe */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, ${palette[0]}, rgba(26,40,72,0.5), transparent)`,
          opacity: !isLocked || revealed ? 1 : 0,
          transition: "opacity 0.5s",
        }} />
      </div>
    </div>
  );
}

// ─── PROJECT SELECTOR TAB ─────────────────────────────────────────────────────
function ProjectTab({ project, isActive, onClick, revealed }: { project: Project; isActive: boolean; onClick: () => void; revealed: boolean }) {
  const isLocked = !!project.locked && !revealed;
  return (
    <button
      onClick={onClick}
      style={{
        all: "unset", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px",
        background: isActive ? `rgba(${(project.palette[0].slice(1).match(/../g) ?? []).map(h=>parseInt(h,16)).join(",")},0.08)` : "transparent",
        border: `1px solid ${isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`,
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        width: "100%", boxSizing: "border-box",
      }}
    >
      {/* Active left line */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 2,
        background: isActive ? "#F25C43" : "transparent",
        transition: "background 0.3s",
      }} />

      {/* ID */}
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 9,
        color: isActive ? "#F25C43" : "rgba(255,255,255,0.2)",
        letterSpacing: "0.14em", flexShrink: 0, minWidth: 20,
        transition: "color 0.3s",
      }}>{project.id}</span>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 13,
          color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
          letterSpacing: "0.04em",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "color 0.3s",
          filter: isLocked ? "blur(4px)" : "none",
        }}>
          {isLocked ? "████████████" : project.client.toUpperCase()}
        </div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 8,
          color: isActive ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)",
          letterSpacing: "0.1em", marginTop: 1,
        }}>{project.cat}</div>
      </div>

      {/* Lock icon */}
      {isLocked && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(242,92,67,0.4)" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="1"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      )}

      {/* Metric */}
      {!isLocked && (
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: isActive ? "#F25C43" : "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em", flexShrink: 0,
          transition: "color 0.3s",
        }}>{project.metric}</span>
      )}
    </button>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef     = useRef<number | null>(null);
  const startRef   = useRef<number | null>(null);
  const autoRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const [section, setSection]         = useState("retail"); // retail | corporate
  const [activeIdx, setActiveIdx]     = useState(0);
  const [revealed, setRevealed]       = useState(false);
  const [progress, setProgress]       = useState(0);
  const [isHolding, setIsHolding]     = useState(false);
  const [entered, setEntered]         = useState(false);
  const [transitioning, setTrans]     = useState(false);

  const projects = section === "retail" ? RETAIL : CORPORATE;
  const project  = projects[activeIdx];
  const isLocked = !!project.locked && !revealed;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto-advance retail only
  useEffect(() => {
    if (section !== "retail") return;
    autoRef.current = setInterval(() => {
      setTrans(true);
      setTimeout(() => {
        setActiveIdx(p => (p + 1) % RETAIL.length);
        setTrans(false);
      }, 300);
    }, 6000);
    return () => clearInterval(autoRef.current ?? undefined);
  }, [section, activeIdx]);

  const goTo = (idx: number) => {
    clearInterval(autoRef.current ?? undefined);
    setTrans(true);
    setTimeout(() => { setActiveIdx(idx); setTrans(false); }, 250);
  };

  const switchSection = (s: string) => {
    setSection(s); setActiveIdx(0); setTrans(true);
    setTimeout(() => setTrans(false), 300);
  };

  const startHold = useCallback(() => {
    if (revealed) return;
    setIsHolding(true);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(((now - startRef.current!) / 1600) * 100, 100);
      setProgress(p);
      if (p >= 100) { setRevealed(true); setIsHolding(false); setProgress(0); }
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [revealed]);

  const stopHold = useCallback(() => {
    if (revealed) return;
    setIsHolding(false); setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [revealed]);

  return (
    <>
      <style>{`
        @keyframes shimmer    { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes fadeInUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes navyBreath { 0%,100%{opacity:0.2} 50%{opacity:0.5} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 960px) {
          .vault-main { grid-template-columns: 1fr !important; }
          .vault-browser { min-height: 300px !important; max-height: 360px !important; }
          .vault-sidebar { max-height: none !important; }
        }
      `}</style>

      <section
        id="portfolio"
        ref={sectionRef}
        style={{
          background: "#030303",
          padding: "100px 6vw",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Navy ambient */}
        <div style={{
          position: "absolute", top: "5%", left: "-5%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,40,72,0.22) 0%, transparent 70%)",
          pointerEvents: "none", animation: "navyBreath 10s ease-in-out infinite",
        }} />

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: 48,
          flexWrap: "wrap", gap: 20,
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.3em", color: "#F25C43", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, background: "#F25C43", borderRadius: "50%", display: "inline-block" }} />
              DATA_NODES // DEPLOYMENT_LOG
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,8vw,7rem)", color: "#fff", lineHeight: 0.9, textTransform: "uppercase" }}>
              THE<br />
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>VAULT.</span>
            </h2>
          </div>

          {/* Section tabs */}
          <div style={{ display: "flex", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0, width: "50%",
              background: section === "retail" ? "rgba(255,255,255,0.04)" : "rgba(26,40,72,0.28)",
              left: section === "retail" ? 0 : "50%",
              borderLeft: section === "corporate" ? "1px solid rgba(26,40,72,0.5)" : "none",
              transition: "left 0.4s cubic-bezier(0.76,0,0.24,1), background 0.4s",
            }} />
            {[
              { key: "retail", label: "Retail" },
              { key: "corporate", label: "Corporate" },
            ].map(t => (
              <button key={t.key} onClick={() => switchSection(t.key)} style={{
                padding: "0 24px", height: 44,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em",
                textTransform: "uppercase", border: "none", background: "transparent",
                cursor: "pointer",
                color: section === t.key ? (t.key === "corporate" ? "#F25C43" : "#fff") : "rgba(255,255,255,0.35)",
                display: "flex", alignItems: "center", gap: 8,
                position: "relative", zIndex: 2, whiteSpace: "nowrap",
                transition: "color 0.3s",
              }}>
                {t.key === "corporate" && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {revealed ? <><rect x="3" y="11" width="18" height="11" rx="1"/><path d="M7 11V7a5 5 0 0110 0"/></> : <><rect x="3" y="11" width="18" height="11" rx="1"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}
                  </svg>
                )}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN SHOWCASE ── */}
        <div
          className="vault-main"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 2,
            opacity: entered ? 1 : 0,
            transition: "opacity 0.7s ease 0.15s",
          }}
        >

          {/* ── LEFT: Browser showcase ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 2,
            minHeight: 560,
          }}>
            {/* Browser frame */}
            <div
              className="vault-browser"
              style={{
                flex: 1,
                background: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "scale(0.98) translateY(6px)" : "scale(1) translateY(0)",
                transition: "opacity 0.28s ease, transform 0.28s ease",
                // Biometric hold events on locked projects
                ...(isLocked ? { cursor: "crosshair" } : {}),
              }}
              onMouseDown={isLocked ? startHold : undefined}
              onMouseUp={isLocked ? stopHold : undefined}
              onMouseLeave={isLocked ? stopHold : undefined}
              onTouchStart={isLocked ? startHold : undefined}
              onTouchEnd={isLocked ? stopHold : undefined}
            >
              <BrowserMockup project={project} revealed={revealed} isLocked={isLocked} />

              {/* LOCKED: Biometric overlay on the entire browser panel */}
              {isLocked && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 16, zIndex: 20,
                }}>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(6,6,16,0.5)", backdropFilter: "blur(3px)" }} />

                  {/* Decrypt ring */}
                  <div style={{ position: "relative", width: 88, height: 88, zIndex: 1 }}>
                    <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(26,40,72,0.6)" strokeWidth="1.5" />
                      <circle cx="44" cy="44" r="36" fill="none" stroke="#F25C43" strokeWidth="1.5"
                        strokeDasharray={`${(progress/100) * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
                        style={{ transition: "stroke-dasharray 0.05s linear", filter: "drop-shadow(0 0 5px #F25C43)" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {progress >= 100 ? (
                        <span style={{ fontSize: 24 }}>🔓</span>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isHolding ? "#F25C43" : "rgba(255,255,255,0.5)"} strokeWidth="1.5">
                          <rect x="3" y="11" width="18" height="11" rx="1"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: "center", zIndex: 1 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.25em", color: isHolding ? "#F25C43" : "rgba(255,255,255,0.6)", marginBottom: 6 }}>
                      {isHolding ? `DECRYPTING ${Math.round(progress)}%` : "NDA RESTRICTED"}
                    </div>
                    {!isHolding && (
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)", animation: "pulse 2.5s ease infinite" }}>
                        HOLD TO DECRYPT
                      </div>
                    )}
                  </div>

                  {/* Progress bar at bottom */}
                  {isHolding && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.04)", zIndex: 1 }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: "#F25C43", boxShadow: "0 0 8px #F25C43", transition: "width 0.05s linear" }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Project detail strip below browser */}
            <div style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 20px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 16, flexWrap: "wrap",
              opacity: transitioning ? 0 : 1,
              transition: "opacity 0.28s ease",
            }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {project.tags.map(t => (
                  <span key={t} style={{
                    padding: "3px 9px",
                    border: `1px solid ${project.palette[0]}33`,
                    background: `${project.palette[0]}0D`,
                    fontFamily: "var(--font-mono)", fontSize: 8,
                    letterSpacing: "0.14em", color: project.palette[0],
                    textTransform: "uppercase",
                  }}>{t}</span>
                ))}
              </div>
              {/* Live link */}
              {project.url && !isLocked && !project.noLink && (
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px",
                    background: project.palette[0],
                    fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
                    color: "#fff", textDecoration: "none",
                    transition: "opacity 0.2s",
                    clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  View Live
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
              )}
              {isLocked && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)" }}>
                  {revealed ? "DECRYPTED" : "NDA // HOLD BROWSER TO DECRYPT"}
                </span>
              )}
              {project.noLink && !isLocked && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)" }}>
                  RESTRICTED
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT: Detail + selector ── */}
          <div className="vault-sidebar" style={{
            display: "flex", flexDirection: "column", gap: 2,
            maxHeight: 620, overflow: "hidden",
          }}>

            {/* Detail panel */}
            <div style={{
              flex: 1, background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: "2px solid rgba(26,40,72,0.5)",
              overflow: "hidden", display: "flex", flexDirection: "column",
            }}>
              {/* Panel chrome */}
              <div style={{
                height: 32, flexShrink: 0,
                background: "rgba(26,40,72,0.12)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", gap: 6, paddingInline: 14,
              }}>
                {["#F25C43","rgba(26,40,72,0.8)","rgba(255,255,255,0.07)"].map((c,i) => <div key={i} style={{ width:7,height:7,borderRadius:"50%",background:c }} />)}
                <span style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.18em",color:"rgba(255,255,255,0.25)",marginLeft:6 }}>
                  PROJECT_READOUT.log
                </span>
                {/* Pulsing dot */}
                <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:5 }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:"#F25C43",animation:"blink 2s ease infinite" }} />
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.14em",color:"rgba(255,255,255,0.2)" }}>LIVE</span>
                </div>
              </div>

              <div style={{
                flex: 1, padding: "22px 24px",
                display: "flex", flexDirection: "column", gap: 18,
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateX(8px)" : "translateX(0)",
                transition: "opacity 0.28s, transform 0.28s",
                overflow: "auto",
              }}>
                {/* Header */}
                <div>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",marginBottom:8 }}>
                    {project.id} · {project.year} · {project.location}
                  </div>
                  <h3 style={{
                    fontFamily:"var(--font-display)", fontSize:28,
                    color: isLocked ? "rgba(255,255,255,0.2)" : "#fff",
                    letterSpacing:"0.04em", lineHeight:1, marginBottom:4,
                    filter: isLocked ? "blur(8px)" : "none",
                    transition:"filter 0.4s", userSelect: isLocked ? "none" : "auto",
                  }}>
                    {isLocked ? "███████████████" : project.client.toUpperCase()}
                  </h3>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.14em",color:"rgba(255,255,255,0.35)" }}>
                    {project.type}
                  </div>
                </div>

                {/* Metric badge */}
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:10,
                  padding:"9px 14px",
                  background: `rgba(${project.palette[0].slice(1).match(/../g)?.map(h=>parseInt(h,16)).join(",")},0.08)`,
                  border:`1px solid ${project.palette[0]}33`,
                  width:"fit-content",
                }}>
                  <span style={{ fontFamily:"var(--font-display)",fontSize:28,color:project.palette[0],lineHeight:1 }}>{project.metric}</span>
                  <span style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.16em",color:"rgba(255,255,255,0.35)",textTransform:"uppercase" }}>{project.metricLabel}</span>
                </div>

                {/* Story */}
                <div style={{
                  borderLeft:"2px solid rgba(26,40,72,0.5)",
                  paddingLeft:14,
                  opacity: isLocked ? 0.2 : 1,
                  filter: isLocked ? "blur(4px)" : "none",
                  transition:"opacity 0.4s, filter 0.4s",
                }}>
                  <p style={{ fontFamily:"var(--font-sans)",fontSize:13,fontWeight:300,color:"rgba(255,255,255,0.72)",lineHeight:1.75,marginBottom:10 }}>
                    {project.story}
                  </p>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.14em",color:"#F25C43" }}>
                    → {project.result}
                  </div>
                </div>

                {/* Quote */}
                {!isLocked && (
                  <div style={{ paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ fontFamily:"var(--font-sans)",fontSize:12,fontWeight:300,color:"rgba(255,255,255,0.65)",lineHeight:1.7,fontStyle:"italic",marginBottom:6 }}>
                      "{project.quote.text}"
                    </p>
                    <span style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.12em",color:"rgba(255,255,255,0.3)" }}>
                      — {project.quote.author}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Project selector */}
            <div style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}>
              <div style={{ padding:"9px 14px", borderBottom:"1px solid rgba(255,255,255,0.04)", fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.22em",color:"rgba(255,255,255,0.2)" }}>
                {section === "retail" ? `RETAIL_INDEX // ${RETAIL.length} PROJECTS` : `CORPORATE_VAULT // ${CORPORATE.length} PROJECTS`}
              </div>
              {projects.map((p, i) => (
                <ProjectTab
                  key={p.id} project={p}
                  isActive={activeIdx === i}
                  onClick={() => goTo(i)}
                  revealed={revealed}
                />
              ))}

              {/* Corporate vault status */}
              {section === "corporate" && (
                <div style={{
                  padding:"9px 14px",
                  borderTop:"1px solid rgba(255,255,255,0.04)",
                  fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:"0.16em",
                  color: revealed ? "#F25C43" : "rgba(255,255,255,0.18)",
                  textAlign:"center", transition:"color 0.5s",
                }}>
                  {revealed ? "◆ VAULT DECRYPTED" : "◆ HOLD BROWSER PANEL TO DECRYPT"}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}