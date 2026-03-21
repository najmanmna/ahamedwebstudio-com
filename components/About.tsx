"use client";

import { useEffect, useRef, useState } from "react";

// ─── TERMINAL BIO ─────────────────────────────────────────────────────────────
function TerminalBio({ active }: { active: boolean }) {
  const LINES = [
    { text: "$ INITIALIZE OPERATOR_PROFILE...", delay: 0,    color: "rgba(255,255,255,0.5)"  },
    { text: "$ ID: AWS_01 // AHAMED NAJMAN",    delay: 300,  color: "#F25C43"                },
    { text: "$ ROLE: LEAD_FRONT_END_ARCHITECT", delay: 600,  color: "rgba(255,255,255,0.75)" },
    { text: "$ BASE: COLOMBO, LK // UTC+5:30",  delay: 900,  color: "rgba(255,255,255,0.65)" },
    { text: "$ NETWORK: UK // UAE // GLOBAL",   delay: 1200, color: "rgba(255,255,255,0.65)" },
    { text: "$ STACK: NEXT.JS // THREE.JS // WEBGL", delay: 1500, color: "rgba(255,255,255,0.65)" },
    { text: "$ PIPELINE: 100% ASYNC_EXECUTION", delay: 1800, color: "rgba(255,255,255,0.65)" },
    { text: "$ PROJECTS_DEPLOYED: 15+",         delay: 2100, color: "rgba(255,255,255,0.65)" },
    { text: "$ STATUS: PROVISIONING_APR_2026 █", delay: 2400, color: "#F25C43"               },
  ];

  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    if (!active) return;
    setVisible([]);
    const timers = LINES.map((line, i) =>
      setTimeout(() => setVisible(prev => [...prev, i]), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div style={{
      background: "#030303",
      border: "1px solid rgba(255,255,255,0.07)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Terminal chrome */}
      <div style={{
        height: 28,
        background: "rgba(26,40,72,0.35)",  // navy tint on terminal header
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 6, paddingLeft: 12,
      }}>
        {["#F25C43", "rgba(26,40,72,0.8)", "rgba(255,255,255,0.08)"].map((c, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
        ))}
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10, letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.4)", marginLeft: 8,
        }}>
          OPERATOR_PROFILE.sh
        </span>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {LINES.map((line, i) => (
          <div key={i} style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10, lineHeight: 1.9,
            color: line.color,
            letterSpacing: "0.06em",
            opacity: visible.includes(i) ? 1 : 0,
            transform: visible.includes(i) ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            display: "flex", alignItems: "center",
          }}>
            {visible.includes(i) && (
              <span style={{ color: "#F25C43", marginRight: 8, opacity: 0.45 }}>›</span>
            )}
            {line.text}
            {i === LINES.length - 1 && visible.includes(i) && (
              <span style={{ animation: "blink 1s step-end infinite", marginLeft: 2 }}>_</span>
            )}
          </div>
        ))}
      </div>

      {/* Navy left accent border */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: 2,
        background: "linear-gradient(to bottom, #1A2848, transparent)",
      }} />
    </div>
  );
}

// ─── ARCHITECT FRAME ──────────────────────────────────────────────────────────
function ArchitectFrame() {
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    let raf: number, dir = 1;
    const tick = () => {
      setScanY(prev => {
        const next = prev + dir * 0.4;
        if (next > 100) dir = -1;
        if (next < 0)   dir = 1;
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4/5" }}>
      {/* Corner brackets */}
      {[
        { top: -8,    left: -8,  borderWidth: "1px 0 0 1px" },
        { top: -8,    right: -8, borderWidth: "1px 1px 0 0" },
        { bottom: -8, left: -8,  borderWidth: "0 0 1px 1px" },
        { bottom: -8, right: -8, borderWidth: "0 1px 1px 0" },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: 24, height: 24,
          borderStyle: "solid",
          borderColor: "rgba(242,92,67,0.45)",
          ...s,
        }} />
      ))}

      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}>
        <img
          src="/architect.jpeg"
          alt="Ahamed Najman"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            filter: "grayscale(55%) contrast(1.1)",
          }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />

        {/* Dot grid fallback */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        {/* Scan line */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: `${scanY}%`, height: 1,
          background: "linear-gradient(to right, transparent, rgba(242,92,67,0.55), transparent)",
          boxShadow: "0 0 8px rgba(242,92,67,0.3)",
          pointerEvents: "none",
        }} />

        {/* CRT overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(transparent 50%, rgba(0,0,0,0.28) 50%)",
          backgroundSize: "100% 4px",
          pointerEvents: "none", mixBlendMode: "overlay",
        }} />

        {/* Reticle */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="12" stroke="rgba(242,92,67,0.18)" strokeWidth="1"/>
            <line x1="20" y1="0"  x2="20" y2="8"  stroke="rgba(242,92,67,0.25)" strokeWidth="1"/>
            <line x1="20" y1="32" x2="20" y2="40" stroke="rgba(242,92,67,0.25)" strokeWidth="1"/>
            <line x1="0"  y1="20" x2="8"  y2="20" stroke="rgba(242,92,67,0.25)" strokeWidth="1"/>
            <line x1="32" y1="20" x2="40" y2="20" stroke="rgba(242,92,67,0.25)" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* ID card */}
      <div style={{
        position: "absolute", bottom: 12, left: 12, right: 12,
        background: "rgba(3,3,3,0.9)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "2px solid #1A2848",   // navy left accent
        padding: "12px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#F25C43", letterSpacing: "0.25em", marginBottom: 4 }}>
            ID: AWS_01
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#fff", letterSpacing: "0.1em", fontWeight: 700 }}>
            AHAMED NAJMAN
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", lineHeight: 1.8 }}>
            LEAD ARCHITECT
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em" }}>
            COLOMBO, LK
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STAT BAR ─────────────────────────────────────────────────────────────────
function StatBar({ label, value, max, unit, active, delay }: {
  label: string; value: number; max: number; unit: string; active: boolean; delay: number;
}) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setFill(value), delay);
    return () => clearTimeout(t);
  }, [active, value, delay]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#F25C43", letterSpacing: "0.1em" }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: `${(fill / max) * 100}%`,
          background: "linear-gradient(to right, #1A2848, #F25C43)",  // navy → coral
          transition: "width 1.2s cubic-bezier(0.76,0,0.24,1)",
          boxShadow: "0 0 6px rgba(242,92,67,0.4)",
        }} />
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function About() {
  const ref = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes navyPulse { 0%,100%{opacity:0.25} 50%{opacity:0.5} }
        .about-left {
          opacity: 0; transform: translateX(-24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .about-left.visible { opacity: 1; transform: translateX(0); }
        .about-right {
          opacity: 0; transform: translateX(24px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s;
        }
        .about-right.visible { opacity: 1; transform: translateX(0); }
        .manifesto-p {
          font-family: var(--font-sans);
          font-size: 15px; font-weight: 300;
          color: rgba(255,255,255,0.65);
          line-height: 1.85; letter-spacing: 0.02em;
        }
        .manifesto-p + .manifesto-p { margin-top: 18px; }
        .accent-word { color: #F25C43; font-weight: 400; }
        .white-word  { color: rgba(255,255,255,0.9); font-weight: 400; }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        id="about"
        ref={ref}
        style={{
          background: "#030303",
          padding: "100px 6vw",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Coral glow — right */}
        <div style={{
          position: "absolute", top: "50%", right: "8%",
          transform: "translateY(-50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,92,67,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Navy glow — left */}
        <div style={{
          position: "absolute", top: "20%", left: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,40,72,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "navyPulse 7s ease-in-out infinite",
        }} />

        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: "clamp(3rem, 6vw, 80px)",
            alignItems: "start",
            maxWidth: 1280, margin: "0 auto",
          }}
        >
          {/* ── LEFT ── */}
          <div className={`about-left${entered ? " visible" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ArchitectFrame />
            <TerminalBio active={entered} />
          </div>

          {/* ── RIGHT ── */}
          <div className={`about-right${entered ? " visible" : ""}`}>

            {/* Label */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 12px",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
              fontFamily: "var(--font-mono)",
              fontSize: 10, letterSpacing: "0.3em",
              color: "#F25C43", textTransform: "uppercase",
              marginBottom: 28,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#F25C43", display: "inline-block", animation: "blink 2s ease infinite" }} />
              THE_OPERATOR // EXECUTION_MANIFESTO
            </div>

            {/* Headline */}
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 5vw, 5rem)",
              color: "#fff", lineHeight: 0.95,
              letterSpacing: "0.02em", marginBottom: 36,
              textTransform: "uppercase",
            }}>
              We rebuild what<br />
              you're ashamed of.<br />
              <span style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.18)",
                color: "transparent",
              }}>
                Into what wins.
              </span>
            </h2>

            {/* Manifesto */}
            <div style={{
              borderLeft: "2px solid rgba(26,40,72,0.6)",   // navy left border
              paddingLeft: 24, marginBottom: 40,
            }}>
              <p className="manifesto-p">
                Most agencies send a slow, embarrassing WordPress site and ask for a quote. We don't ask for a spec. We look at what you have, understand the business behind it, and build the version that matches its actual ambition.
              </p>
              <p className="manifesto-p">
                I operate as the <span className="white-word">silent front-end execution engine</span> for ambitious brands and global design agencies. Legacy CMS platforms become sub-second <span className="accent-word">Next.js frontends</span>. Clunky templates become precision-crafted interfaces. The transformation is complete — and invisible to your clients.
              </p>
              <p className="manifesto-p">
                Our <span className="white-word">100% asynchronous pipeline</span> turns your time zone into our advantage. Brief us at the end of your day. The rebuilt staging environment is <span className="accent-word">ready before your morning coffee</span>.
              </p>
            </div>

            {/* Metrics */}
            <div style={{
              background: "rgba(26,40,72,0.1)",   // navy tint on metrics panel
              border: "1px solid rgba(26,40,72,0.4)",
              padding: "24px",
              marginBottom: 40,
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10, letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.55)", marginBottom: 4,
              }}>
                SYSTEM_METRICS // LIVE_BENCHMARKS
              </div>
              <StatBar label="PageSpeed Score"    value={100}  max={100} unit="/100" active={entered} delay={400}  />
              <StatBar label="LCP Target"         value={0.8}  max={3}   unit="s"    active={entered} delay={600}  />
              <StatBar label="Projects Deployed"  value={15}   max={20}  unit="+"    active={entered} delay={800}  />
              <StatBar label="Client Satisfaction" value={100} max={100} unit="%"    active={entered} delay={1000} />
            </div>

            {/* Network tags */}
            <div style={{ display: "flex", gap: 2 }}>
              {[
                { label: "CORE_STACK", value: "NEXT.JS // THREE.JS // WEBGL" },
                { label: "NETWORK",   value: "UK // UAE // GLOBAL" },
              ].map((item, i) => (
                <div key={i} style={{
                  flex: 1, padding: "14px 16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderTop: `1px solid ${i === 0 ? "rgba(242,92,67,0.3)" : "rgba(26,40,72,0.5)"}`,
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#F25C43", letterSpacing: "0.2em", marginBottom: 6 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}