"use client";

import { useEffect, useRef, useState } from "react";

// ─── DATA — updated with real reviews ─────────────────────────────────────────
// LOG_01: Uthpala — design taste (universal, strongest signal)
// LOG_02: Sajid   — performance + reliability (universal)
// LOG_03: velauthapillai — UK Fiverr client, "eye for detail, brilliant designer"
// LOG_04: pinoenmerida   — Chile Fiverr, detailed execution review
const LOGS = [
  {
    id: "LOG_01",
    name: "velauthapillai",
    entity: "Design Client",
    location: "UK", region: "United Kingdom",
    verified: "FIVERR_5★", rating: 5,
    content: "Incredible eye for detail and a brilliant designer. The work consistently exceeded what I expected. Would highly recommend — and already have.",
    highlight: "Incredible eye for detail and a brilliant designer",
    metric: "5★ FIVERR", project: "Frontend Design", tag: "UK CLIENT",
  },
  {
    id: "LOG_02",
    name: "pinoenmerida",
    entity: "E-Commerce Client",
    location: "CL", region: "Latin America",
    verified: "FIVERR_5★", rating: 5,
    content: "Ahamed exceeded my expectations with his speed and professionalism. Always quick to respond, always willing to adjust. His technical competence and attention to detail really stood out. Working with him was a pleasure — I wouldn't hesitate to hire him again.",
    highlight: "technical competence and attention to detail really stood out",
    metric: "SPEED + CRAFT", project: "Frontend Sprint", tag: "EXECUTION",
  },
  {
    id: "LOG_03",
    name: "Uthpala Pathirana",
    entity: "HEDONE Skincare",
    location: "LK", region: "South Asia",
    verified: "DIRECT_CLIENT", rating: 5,
    content: "For my products I ended up doing even the packaging designs since I couldn't find anyone with good taste. For the first time someone nailed it and that's you. Literally my jaw dropped.",
    highlight: "couldn't find anyone with good taste",
    metric: "DESIGN EXCELLENCE", project: "Brand Website", tag: "TASTE",
  },
  {
    id: "LOG_04",
    name: "Sajid Ifham",
    entity: "Elvyn Store",
    location: "LK", region: "South Asia",
    verified: "GOOGLE_REVIEW", rating: 5,
    content: "Ahamed handled the full-stack e-commerce architecture exactly to our expectations. He is fully committed to delivering high-performance assets on time without compromising quality.",
    highlight: "delivering high-performance assets on time without compromising quality",
    metric: "100 CWV", project: "E-Commerce Platform", tag: "PERFORMANCE",
  },
];

// ─── SELECTOR CARD ────────────────────────────────────────────────────────────
type Log = typeof LOGS[0];
function SelectorCard({ log, isActive, onClick, index, entered }: { log: Log; isActive: boolean; onClick: () => void; index: number; entered: boolean }) {
  return (
    <button
      onClick={onClick}
      data-active={isActive ? "true" : "false"}
      style={{
        all: "unset", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px",
        background: isActive ? "rgba(242,92,67,0.05)" : "transparent",
        border: `1px solid ${isActive ? "rgba(242,92,67,0.22)" : "rgba(255,255,255,0.04)"}`,
        borderLeft: `2px solid ${isActive ? "#F25C43" : "transparent"}`,
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateX(0)" : "translateX(12px)",
        transitionDelay: `${0.3 + index * 0.06}s`,
        width: "100%", boxSizing: "border-box",
      }}
    >
      <div style={{
        width: 30, height: 30, flexShrink: 0,
        background: isActive ? "rgba(242,92,67,0.1)" : "rgba(26,40,72,0.2)",
        border: `1px solid ${isActive ? "rgba(242,92,67,0.3)" : "rgba(26,40,72,0.35)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
        color: isActive ? "#F25C43" : "rgba(255,255,255,0.2)",
        transition: "all 0.3s",
      }}>
        {log.name.substring(0, 2).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 14,
          color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
          letterSpacing: "0.04em", marginBottom: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          transition: "color 0.3s",
        }}>{log.name.toUpperCase()}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)" }}>
          {log.entity} · {log.region}
        </div>
      </div>
      <div style={{
        padding: "2px 6px",
        border: `1px solid ${isActive ? "rgba(242,92,67,0.2)" : "rgba(26,40,72,0.35)"}`,
        fontFamily: "var(--font-mono)", fontSize: 7,
        letterSpacing: "0.16em",
        color: isActive ? "#F25C43" : "rgba(255,255,255,0.15)",
        transition: "all 0.3s", flexShrink: 0,
        whiteSpace: "nowrap",
      }}>{log.tag}</div>
    </button>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Testimonials() {
  const ref         = useRef<HTMLElement>(null);
  const progressRef = useRef<number | null>(null);
  const [active, setActive]     = useState(0);
  const [entered, setEntered]   = useState(false);
  const [typeText, setTypeText] = useState("");
  const [progress, setProgress] = useState(0);
  const [fading, setFading]     = useState(false);
  const DURATION = 8000;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const text = LOGS[active].content;
    setFading(true);
    setTypeText("");
    const fadeT = setTimeout(() => {
      setFading(false);
      let i = 0;
      const iv = setInterval(() => {
        setTypeText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(iv);
      }, 20);
      return () => clearInterval(iv);
    }, 200);
    return () => clearTimeout(fadeT);
  }, [active]);

  useEffect(() => {
    setProgress(0);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(((now - start) / DURATION) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        setActive(prev => (prev + 1) % LOGS.length);
      } else {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => { if (progressRef.current !== null) cancelAnimationFrame(progressRef.current); };
  }, [active]);

  const log = LOGS[active];

  const renderQuote = (text: string, highlight: string) => {
    const fullIdx = text.indexOf(highlight);
    if (fullIdx === -1) return text;
    return (
      <>
        {text.slice(0, fullIdx)}
        <span style={{ color: "#fff", fontWeight: 400 }}>{highlight}</span>
        {text.slice(fullIdx + highlight.length)}
      </>
    );
  };

  return (
    <>
      <style>{`
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes navyBreath { 0%,100%{opacity:0.18} 50%{opacity:0.4} }

        /* Mobile: stack layout, selector becomes horizontal strip */
        @media (max-width: 900px) {
          .val-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .val-quote-panel { padding: 20px 18px !important; gap: 16px !important; }
          .val-author-name { font-size: 16px !important; }
          .val-quote-text  { font-size: clamp(1.05rem, 4.5vw, 1.4rem) !important; }
          /* Fixed height quote zone — prevents layout shift as text types in */
          .val-quote-zone  { height: 180px !important; min-height: 180px !important; max-height: 180px !important; overflow: hidden !important; }
          .val-chips       { gap: 6px !important; }
          .val-selector    { flex-direction: row !important; overflow-x: auto !important; overflow-y: hidden !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .val-selector::-webkit-scrollbar { display: none; }
          .val-selector-header { display: none !important; }
          .val-selector-pending { display: none !important; }
          .val-selector > button { flex-direction: column !important; min-width: 100px !important; flex-shrink: 0 !important; padding: 10px 10px !important; border-left: none !important; border-top: 2px solid transparent !important; gap: 5px !important; align-items: flex-start !important; }
          .val-selector > button > div:last-child { display: none !important; } /* hide tag badge */
          .val-selector > button[data-active="true"] { border-top-color: #F25C43 !important; background: rgba(242,92,67,0.06) !important; }
          .val-dots { padding: 8px 12px !important; }
        }
      `}</style>

      <section
        id="testimonials"
        ref={ref}
        style={{
          background: "#030303",
          padding: "100px 6vw",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          position: "relative", overflow: "hidden",
          boxSizing: "border-box", maxWidth: "100vw",
        }}
      >
        <div style={{
          position: "absolute", top: "-5%", right: "5%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,40,72,0.25) 0%, transparent 70%)",
          pointerEvents: "none", animation: "navyBreath 9s ease-in-out infinite",
        }} />

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 64, flexWrap: "wrap", gap: 24,
          opacity: entered ? 1 : 0, transform: entered ? "none" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.3em", color: "#F25C43", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, background: "#F25C43", borderRadius: "50%", display: "inline-block", animation: "blink 2s ease infinite" }} />
              SYSTEM_VALIDATION // VERIFIED_IMPACT_LOGS
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,7vw,6rem)", color: "#fff", lineHeight: 0.9, textTransform: "uppercase" }}>
              VALIDATION<br />
              {/* LOGS. — increased stroke + glow for visibility on dark bg */}
              <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)", color: "transparent", filter: "drop-shadow(0 0 18px rgba(255,255,255,0.1))" }}>LOGS.</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>
              {String(active + 1).padStart(2, "0")} / {String(LOGS.length).padStart(2, "0")}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "5px 12px",
              border: "1px solid rgba(26,40,72,0.4)",
              background: "rgba(26,40,72,0.1)",
              fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.3)",
            }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#F25C43", animation: "blink 2s ease infinite", display: "inline-block" }} />
              ALL REVIEWS VERIFIED
            </div>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div
          className="val-layout"
          style={{
            display: "grid", gridTemplateColumns: "1fr 260px", gap: 2,
            minWidth: 0,
          }}
        >

          {/* LEFT — Featured quote */}
          <div style={{
            background: "#0A0A0A",
            border: "1px solid rgba(255,255,255,0.05)",
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.1s",
            minWidth: 0, minHeight: 320,
          }}>
            {/* Top band */}
            <div style={{ height: 2, background: "linear-gradient(to right, #1A2848, #F25C43, transparent)", flexShrink: 0 }} />

            <div
              className="val-quote-panel"
              style={{ flex: 1, padding: "40px 44px", display: "flex", flexDirection: "column", gap: 32 }}
            >
              {/* Author row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", flexWrap: "wrap", gap: 12,
                opacity: fading ? 0 : 1, transform: fading ? "translateY(4px)" : "translateY(0)",
                transition: "opacity 0.2s, transform 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, flexShrink: 0,
                    background: "rgba(26,40,72,0.25)",
                    border: "1px solid rgba(26,40,72,0.5)",
                    borderTop: "2px solid #F25C43",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: 24, color: "#F25C43",
                  }}>
                    {log.name[0]}
                  </div>
                  <div>
                    <div className="val-author-name" style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>
                      {log.name.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", marginTop: 5 }}>
                      {log.entity} · {log.region} · {log.verified}
                    </div>
                  </div>
                </div>
                {/* Stars */}
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, background: i < log.rating ? (i < 3 ? "#F25C43" : "#1A2848") : "rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "linear-gradient(to right, rgba(242,92,67,0.3), rgba(26,40,72,0.4), transparent)", flexShrink: 0 }} />

              {/* Big quote — fixed height, no shift */}
              <div style={{ position: "relative", flex: "0 0 auto" }}>
                {/* Decorative quote mark */}
                <div style={{
                  position: "absolute", top: -20, left: -12,
                  fontFamily: "var(--font-display)", fontSize: 120, lineHeight: 1,
                  color: "rgba(26,40,72,0.2)", userSelect: "none", pointerEvents: "none",
                  zIndex: 0,
                }}>"</div>

                {/* Fixed-height zone — NEVER grows. Text appears inside. No shift. */}
                <div className="val-quote-zone" style={{
                  position: "relative", zIndex: 1,
                  height: 160, minHeight: 160,
                  overflow: "hidden",
                }}>
                  <p
                    className="val-quote-text"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(1.1rem, 2.2vw, 1.9rem)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.62)",
                      lineHeight: 1.65, letterSpacing: "0.01em",
                      opacity: fading ? 0 : 1,
                      transition: "opacity 0.2s ease",
                      margin: 0,
                    }}
                  >
                    {typeText ? renderQuote(typeText, log.highlight) : " "}
                    {typeText.length < log.content.length && (
                      <span style={{ animation: "blink 1s step-end infinite", color: "#F25C43" }}>|</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Bottom chips */}
              <div className="val-chips" style={{
                display: "flex", gap: 8, flexWrap: "wrap",
                opacity: fading ? 0 : 1, transition: "opacity 0.3s ease 0.1s",
                flexShrink: 0,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "7px 14px",
                  border: "1px solid rgba(242,92,67,0.2)", background: "rgba(242,92,67,0.04)",
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", color: "#F25C43",
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#F25C43", display: "inline-block" }} />
                  {log.metric}
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "7px 14px",
                  border: "1px solid rgba(26,40,72,0.4)", background: "rgba(26,40,72,0.1)",
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)",
                }}>
                  {log.project.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, background: "rgba(255,255,255,0.03)", flexShrink: 0 }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(to right, #1A2848, #F25C43)",
                boxShadow: "0 0 6px rgba(242,92,67,0.3)",
                transition: "width 0.1s linear",
              }} />
            </div>
          </div>

          {/* RIGHT — Selector */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 2,
            opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.2s",
            minWidth: 0,
          }}>
            {/* Index header */}
            <div
              className="val-selector-header"
              style={{
                padding: "11px 16px",
                background: "rgba(26,40,72,0.12)",
                border: "1px solid rgba(26,40,72,0.3)",
                fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.2)", flexShrink: 0,
              }}
            >
              SIGNAL_INDEX // {LOGS.length} ENTRIES
            </div>

            {/* Selector cards */}
            <div className="val-selector" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {LOGS.map((l, i) => (
                <SelectorCard
                  key={l.id} log={l} index={i}
                  isActive={active === i}
                  onClick={() => setActive(i)}
                  entered={entered}
                />
              ))}
            </div>

            {/* Awaiting next log */}
            <div
              className="val-selector-pending"
              style={{
                padding: "14px 16px",
                border: "1px dashed rgba(26,40,72,0.35)",
                background: "rgba(26,40,72,0.04)",
                opacity: 0.4, marginTop: 2, flexShrink: 0,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>
                UK_AGENCY // PENDING
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.15)" }}>
                LOG_05 // INCOMING...
              </div>
            </div>

            {/* Nav dots */}
            <div
              className="val-dots"
              style={{
                display: "flex", gap: 5, padding: "11px 16px",
                background: "rgba(255,255,255,0.01)",
                border: "1px solid rgba(255,255,255,0.03)",
                alignItems: "center", marginTop: "auto", flexShrink: 0,
              }}
            >
              {LOGS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  width: active === i ? 22 : 6, height: 2,
                  background: active === i ? "#F25C43" : "rgba(26,40,72,0.6)",
                  border: "none", cursor: "pointer",
                  transition: "width 0.4s cubic-bezier(0.76,0,0.24,1), background 0.3s",
                  boxShadow: active === i ? "0 0 6px rgba(242,92,67,0.4)" : "none",
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}