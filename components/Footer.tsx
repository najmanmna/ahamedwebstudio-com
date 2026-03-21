"use client";

import { useEffect, useState } from "react";

const NAV = [
  { label: "Infrastructure", code: "01", href: "#services" },
  { label: "The Vault",      code: "02", href: "#portfolio" },
  { label: "Operator",       code: "03", href: "#about" },
  { label: "Logs",           code: "04", href: "#testimonials" },
  { label: "Terminal",       code: "05", href: "#contact" },
];

const STACK = ["NEXT.JS 14", "REACT 18", "THREE.JS", "TAILWIND V4", "SANITY CMS", "FRAMER MOTION", "WEBGL", "TYPESCRIPT"];

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setTime(new Date());
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  if (!time) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (tz: string) => {
    const d = new Date(time.toLocaleString("en-US", { timeZone: tz }));
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[
        { city: "COLOMBO", tz: "Asia/Colombo",   offset: "UTC+5:30", active: true },
        { city: "LONDON",  tz: "Europe/London",  offset: "UTC+0",    active: false },
      ].map(c => (
        <div key={c.city} style={{
          flex: 1, padding: "11px 14px",
          background: c.active ? "rgba(242,92,67,0.06)" : "rgba(26,40,72,0.2)",
          border: `1px solid ${c.active ? "rgba(242,92,67,0.2)" : "rgba(26,40,72,0.5)"}`,
          borderTop: `2px solid ${c.active ? "#F25C43" : "#1A2848"}`,
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", color: c.active ? "#F25C43" : "rgba(255,255,255,0.3)", marginBottom: 4 }}>
            {c.city} // {c.offset}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: c.active ? "#fff" : "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
            {fmt(c.tz)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── STACK TICKER ─────────────────────────────────────────────────────────────
function StackTicker() {
  const items = [...STACK, ...STACK];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "9px 0", position: "relative" }}>
      {/* Fade edges */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 60, background: "linear-gradient(to right, #030303, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 60, background: "linear-gradient(to left, #030303, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ display: "flex", gap: 36, animation: "tickerScroll 22s linear infinite", width: "max-content" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 3, height: 3, background: i % 2 === 0 ? "#F25C43" : "#1A2848", borderRadius: "50%" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SYSTEM STATUS ────────────────────────────────────────────────────────────
function SystemStatus() {
  const checks = [
    { label: "UPTIME",      value: "99.98%",  accent: "coral" },
    { label: "LCP_AVG",     value: "0.8s",    accent: "coral" },
    { label: "CWV_SCORE",   value: "100/100", accent: "coral" },
    { label: "NEXT_SPRINT", value: "APR_2026",accent: "navy"  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {checks.map((c, i) => (
        <div key={c.label} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "9px 12px",
          background: i === 3 ? "rgba(26,40,72,0.2)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${i === 3 ? "rgba(26,40,72,0.4)" : "rgba(255,255,255,0.05)"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.accent === "coral" ? "#F25C43" : "#1A2848", border: c.accent === "navy" ? "1px solid rgba(255,255,255,0.3)" : "none" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.4)" }}>{c.label}</span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: c.accent === "coral" ? "#F25C43" : "rgba(255,255,255,0.6)" }}>{c.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes blink         { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes navyBreath    { 0%,100%{opacity:0.15} 50%{opacity:0.4} }

        .footer-nav-link {
          display: flex; align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          text-decoration: none;
          color: rgba(255,255,255,0.65);
          transition: color 0.25s, padding-left 0.25s;
          position: relative;
        }
        .footer-nav-link::before {
          content: '';
          position: absolute; left: -1px; top: 0; bottom: 0;
          width: 2px;
          background: #F25C43;
          transform: scaleY(0);
          transition: transform 0.3s cubic-bezier(0.76,0,0.24,1);
        }
        .footer-nav-link:hover { color: #fff !important; padding-left: 10px; }
        .footer-nav-link:hover::before { transform: scaleY(1); }

        .social-btn {
          width: 34px; height: 34px;
          border: 1px solid rgba(26,40,72,0.5);
          background: rgba(26,40,72,0.12);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono);
          font-size: 10px; font-weight: 700;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.25s;
        }
        .social-btn:hover {
          border-color: rgba(242,92,67,0.5) !important;
          background: rgba(242,92,67,0.07) !important;
          color: #F25C43 !important;
        }
        .back-top {
          display: flex; align-items: center; gap: 10;
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,0.07);
          background: transparent;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.2em;
          transition: all 0.3s;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
        }
        .back-top:hover {
          border-color: rgba(242,92,67,0.4) !important;
          background: rgba(242,92,67,0.05) !important;
          color: #F25C43 !important;
        }
        .back-top .arrow { transition: transform 0.3s; }
        .back-top:hover .arrow { transform: translateY(-3px); }

        @media (max-width: 900px) {
          .footer-cols { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-cols { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 860px) {
          footer { padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px)) !important; }
        }
      `}</style>

      <footer style={{ background: "#030303", borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative", overflow: "hidden" }}>

        {/* Scroll progress — 1px top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, zIndex: 10 }}>
          <div style={{
            height: "100%", width: `${scrollPct}%`,
            background: "linear-gradient(to right, #1A2848, #F25C43)",
            boxShadow: "0 0 8px rgba(242,92,67,0.5)",
            transition: "width 0.1s linear",
          }} />
        </div>

        {/* Navy ambient — left */}
        <div style={{
          position: "absolute", bottom: 0, left: "-5%",
          width: 500, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,40,72,0.3) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "navyBreath 10s ease-in-out infinite",
        }} />
        {/* Coral ambient — right */}
        <div style={{
          position: "absolute", top: "10%", right: "5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,92,67,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.008) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.008) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />

        {/* Stack ticker */}
        <StackTicker />

        {/* Main grid */}
        <div style={{ padding: "64px 6vw 0", maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            className="footer-cols"
            style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1.2fr", gap: "clamp(2rem,5vw,56px)", marginBottom: 56 }}
          >

            {/* ── COL 1 — Brand ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img
                  src="/logo-trans.png"
                  alt="Ahamed Web Studio"
                  style={{ height: 30, width: "auto", opacity: 0.85 }}
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.22em", color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>AHAMED</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", lineHeight: 1.2 }}>WEB STUDIO</div>
                </div>
              </div>

              {/* Tagline */}
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13, fontWeight: 300,
                lineHeight: 1.85, letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.62)",
                maxWidth: 320,
                borderLeft: "2px solid rgba(26,40,72,0.6)",
                paddingLeft: 16,
              }}>
                Silent front-end execution for UK and UAE agencies. Legacy sites rebuilt as precision Next.js architectures — overnight.
              </p>

              {/* Clock */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                  ASYNC_ENGINE // LIVE_CLOCK
                </div>
                <LiveClock />
              </div>

              {/* Socials */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
                  EXTERNAL_NODES
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {[
                    { label: "GH", href: "https://github.com/najmanmna", title: "GitHub" },
                    { label: "LI", href: "https://linkedin.com/company/ahamed-web-studio", title: "LinkedIn" },
                    { label: "FV", href: "https://www.fiverr.com", title: "Fiverr" },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title} className="social-btn">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* .lk cross-link */}
              <a
                href="https://ahamedwebstudio.lk"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "7px 12px",
                  border: "1px solid rgba(26,40,72,0.4)",
                  background: "rgba(26,40,72,0.1)",
                  fontFamily: "var(--font-mono)", fontSize: 9,
                  letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)",
                  textDecoration: "none", width: "fit-content",
                  transition: "border-color 0.25s, color 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(242,92,67,0.4)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(26,40,72,0.4)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                ahamedwebstudio.lk
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </a>
            </div>

            {/* ── COL 2 — Nav ── */}
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em", color: "#F25C43", marginBottom: 18 }}>
                SYSTEM_DIRECTORY
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {NAV.map(n => (
                  <a
                    key={n.code}
                    href={n.href}
                    onClick={e => navClick(e, n.href)}
                    className="footer-nav-link"
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginRight: 10, minWidth: 20 }}>
                      {n.code}
                    </span>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.04em", flex: 1 }}>
                      {n.label.toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* ── COL 3 — Status + Contact ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em", color: "#F25C43", marginBottom: 12 }}>
                  SYSTEM_STATUS
                </div>
                <SystemStatus />
              </div>

              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.3em", color: "#F25C43", marginBottom: 12 }}>
                  GLOBAL_TELEMETRY
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    { label: "BASE", value: "Colombo, LK" },
                    { label: "CHANNEL", value: "hello@ahamedwebstudio.com", href: "mailto:hello@ahamedwebstudio.com" },
                    { label: "TELEMETRY", value: "+94 71 741 1188", href: "https://wa.me/94717411188" },
                  ].map(item => (
                    <div key={item.label} style={{
                      padding: "9px 12px",
                      border: "1px solid rgba(255,255,255,0.04)",
                      background: "rgba(255,255,255,0.01)",
                      borderLeft: "2px solid rgba(26,40,72,0.4)",
                    }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{
                          fontFamily: "var(--font-mono)", fontSize: 10,
                          color: "rgba(255,255,255,0.45)", letterSpacing: "0.07em",
                          textDecoration: "none", display: "block", transition: "color 0.25s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.color = "#F25C43"}
                          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                        >{item.value}</a>
                      ) : (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.07em" }}>{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            padding: "18px 0 32px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.55)" }}>
                © {year} AHAMED WEB STUDIO // ALL_SYSTEMS_OPERATIONAL
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.35)" }}>
                BUILT WITHOUT TEMPLATES // 100% ASYNC // SUB-SECOND LATENCY
              </div>
            </div>

            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="back-top">
              RETURN_TO_ORIGIN
              <svg className="arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}