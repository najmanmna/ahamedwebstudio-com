"use client";

import { useEffect, useRef, useState } from "react";

const LOGS = [
  {
    id: "LOG_01",
    name: "Uthpala Pathirana",
    entity: "HEDONE Skincare",
    location: "LK", region: "South Asia",
    verified: "DIRECT_CLIENT", rating: 5,
    content: "For my products I ended up doing even the packaging designs since I couldn't find anyone with good taste. For the first time someone nailed it and that's you. Literally my jaw dropped.",
    highlight: "couldn't find anyone with good taste",
    metric: "DESIGN EXCELLENCE", project: "Brand Website", tag: "TASTE",
  },
  {
    id: "LOG_02",
    name: "Sajid Ifham",
    entity: "Elvyn Store",
    location: "LK", region: "South Asia",
    verified: "GOOGLE_REVIEW", rating: 5,
    content: "Ahamed handled the full-stack e-commerce architecture exactly to our expectations. He is fully committed to delivering high-performance assets on time without compromising quality.",
    highlight: "delivering high-performance assets on time without compromising quality",
    metric: "100 CWV", project: "E-Commerce Platform", tag: "PERFORMANCE",
  },
  {
    id: "LOG_03",
    name: "Lucas Garcia",
    entity: "E-Commerce Partner",
    location: "ES", region: "Europe",
    verified: "FIVERR_5★", rating: 5,
    content: "Ahamed's technical competence and attention to detail stand out. He exceeded expectations with speed and professionalism. An elite execution partner.",
    highlight: "An elite execution partner",
    metric: "SPEED + QUALITY", project: "Frontend Sprint", tag: "EXECUTION",
  },
  {
    id: "LOG_04",
    name: "PHH Executive Team",
    entity: "PHHWA",
    location: "PK", region: "South Asia",
    verified: "LINKEDIN", rating: 5,
    content: "The transition to our new digital engine was a seamless process. The technical execution of the project was top-tier and highly efficient.",
    highlight: "seamless process",
    metric: "SEAMLESS DELIVERY", project: "NGO Web Platform", tag: "DELIVERY",
  },
];

function SelectorCard({ log, isActive, onClick, index, entered }: {
  log: typeof LOGS[number]; isActive: boolean; onClick: () => void; index: number; entered: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        all: "unset", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px",
        background: isActive ? "rgba(242,92,67,0.05)" : "transparent",
        border: `1px solid ${isActive ? "rgba(242,92,67,0.22)" : "rgba(255,255,255,0.04)"}`,
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateX(0)" : "translateX(12px)",
        transitionDelay: `${0.3 + index * 0.06}s`,
        width: "100%", boxSizing: "border-box",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 2,
        background: isActive ? "#F25C43" : "transparent",
        transition: "background 0.3s",
      }} />
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
      }}>{log.tag}</div>
    </button>
  );
}

export default function Testimonials() {
  const ref         = useRef(null);
  const progressRef = useRef<number | null>(null);
  const [active, setActive]       = useState(0);
  const [entered, setEntered]     = useState(false);
  const [typeText, setTypeText]   = useState("");
  const [progress, setProgress]   = useState(0);
  const [fading, setFading]       = useState(false);
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
    return () => { if (progressRef.current) cancelAnimationFrame(progressRef.current); };
  }, [active]);

  const log = LOGS[active];

  const renderQuote = (text: string, highlight: string) => {
    const idx = text.indexOf(highlight.substring(0, 20));
    if (idx === -1) return text;
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
        @media (max-width: 900px) {
          .val-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section id="testimonials" ref={ref} style={{
        background: "#030303",
        padding: "100px 6vw",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        position: "relative", overflow: "hidden",
      }}>

        <div style={{
          position: "absolute", top: "-5%", right: "5%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,40,72,0.25) 0%, transparent 70%)",
          pointerEvents: "none", animation: "navyBreath 9s ease-in-out infinite",
        }} />

        {/* Header */}
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
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.18)", color: "transparent" }}>LOGS.</span>
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

        {/* Main layout */}
        <div className="val-layout" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 2 }}>

          {/* LEFT — Big quote */}
          <div style={{
            background: "#0A0A0A",
            border: "1px solid rgba(255,255,255,0.05)",
            position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column",
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.1s",
          }}>
            {/* Navy → coral top band */}
            <div style={{ height: 2, background: "linear-gradient(to right, #1A2848, #F25C43, transparent)" }} />

            <div style={{ flex: 1, padding: "40px 44px", display: "flex", flexDirection: "column", gap: 32 }}>

              {/* Author row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", flexWrap: "wrap", gap: 16,
                opacity: fading ? 0 : 1, transform: fading ? "translateY(4px)" : "translateY(0)",
                transition: "opacity 0.2s, transform 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 52, height: 52,
                    background: "rgba(26,40,72,0.25)",
                    border: "1px solid rgba(26,40,72,0.5)",
                    borderTop: "2px solid #F25C43",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: 24, color: "#F25C43",
                  }}>
                    {log.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>
                      {log.name.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", marginTop: 5 }}>
                      {log.entity} · {log.region} · {log.verified}
                    </div>
                  </div>
                </div>
                {/* Stars */}
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, background: i < log.rating ? (i < 3 ? "#F25C43" : "#1A2848") : "rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "linear-gradient(to right, rgba(242,92,67,0.3), rgba(26,40,72,0.4), transparent)" }} />

              {/* Quote — the hero */}
              <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{
                  position: "absolute", top: -30, left: -12,
                  fontFamily: "var(--font-display)", fontSize: 140, lineHeight: 1,
                  color: "rgba(26,40,72,0.2)", userSelect: "none", pointerEvents: "none",
                }}>"</div>

                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.62)",
                  lineHeight: 1.65, letterSpacing: "0.01em",
                  position: "relative", zIndex: 1,
                  opacity: fading ? 0 : 1,
                  transition: "opacity 0.2s ease",
                  minHeight: 80,
                }}>
                  {typeText ? renderQuote(typeText, log.highlight) : null}
                  {typeText.length < log.content.length && (
                    <span style={{ animation: "blink 1s step-end infinite", color: "#F25C43" }}>|</span>
                  )}
                </p>
              </div>

              {/* Bottom chips */}
              <div style={{
                display: "flex", gap: 8, flexWrap: "wrap",
                opacity: fading ? 0 : 1, transition: "opacity 0.3s ease 0.1s",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 14px",
                  border: "1px solid rgba(242,92,67,0.2)",
                  background: "rgba(242,92,67,0.04)",
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", color: "#F25C43",
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#F25C43", display: "inline-block" }} />
                  {log.metric}
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "7px 14px",
                  border: "1px solid rgba(26,40,72,0.4)",
                  background: "rgba(26,40,72,0.1)",
                  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)",
                }}>
                  {log.project.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, background: "rgba(255,255,255,0.03)" }}>
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
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}>
            {/* Index header */}
            <div style={{
              padding: "11px 16px",
              background: "rgba(26,40,72,0.12)",
              border: "1px solid rgba(26,40,72,0.3)",
              fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.2)",
            }}>
              SIGNAL_INDEX // {LOGS.length} ENTRIES
            </div>

            {LOGS.map((l, i) => (
              <SelectorCard key={l.id} log={l} index={i} isActive={active === i} onClick={() => setActive(i)} entered={entered} />
            ))}

            {/* Awaiting UK agency log */}
            <div style={{
              padding: "14px 16px",
              border: "1px dashed rgba(26,40,72,0.35)",
              background: "rgba(26,40,72,0.04)",
              opacity: 0.4, marginTop: 2,
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.16em", color: "rgba(255,255,255,0.2)", marginBottom: 3 }}>
                UK_AGENCY // PENDING
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.15)" }}>
                LOG_05 // INCOMING...
              </div>
            </div>

            {/* Nav dots */}
            <div style={{
              display: "flex", gap: 5, padding: "11px 16px",
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(255,255,255,0.03)",
              alignItems: "center", marginTop: "auto",
            }}>
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