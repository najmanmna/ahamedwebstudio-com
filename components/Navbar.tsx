"use client";

import { useEffect, useState } from "react";

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "INFRASTRUCTURE", code: "01", href: "#services" },
  { label: "THE VAULT",      code: "02", href: "#portfolio" },
  { label: "OPERATOR",       code: "03", href: "#about" },
  { label: "LOGS",           code: "04", href: "#testimonials" },
];

const TELEMETRY_OFFSET = 58;
const NAV_COLLAPSED    = 56;
const NAV_EXPANDED     = 252;

// ─── MOBILE MENU ──────────────────────────────────────────────────────────────
function MobileMenu({ open, onClose, onNav }: {
  open: boolean;
  onClose: () => void;
  onNav: (href: string) => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 199,
          background: "rgba(3,3,3,0.75)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      />
      <div style={{
        position: "fixed",
        top: 0, right: 0, bottom: 0,
        width: "min(340px, 85vw)",
        zIndex: 210,
        background: "#0A0A0A",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.5s cubic-bezier(0.76,0,0.24,1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11, letterSpacing: "0.3em", color: "#F25C43",
          }}>
            SYSTEM_DIRECTORY
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, background: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Links */}
        <div style={{ flex: 1, padding: "8px 0" }}>
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.code}
              onClick={() => onNav(item.href)}
              style={{
                width: "100%", background: "none", border: "none",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 20,
                padding: "20px 28px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                textAlign: "left",
                opacity: 0,
                animation: open
                  ? `mobileSlideIn 0.4s ease ${i * 0.07 + 0.15}s forwards`
                  : "none",
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11, color: "#F25C43",
                letterSpacing: "0.2em", minWidth: 20,
              }}>
                {item.code}
              </span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 24, color: "#fff", letterSpacing: "0.05em",
              }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a
            href="#contact"
            onClick={() => onNav("#contact")}
            style={{
              display: "block", width: "100%", padding: "14px 0",
              background: "#F25C43", textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: 12,
              letterSpacing: "0.25em", color: "#000",
              textDecoration: "none", fontWeight: 700,
            }}
          >
            INITIALIZE_INTEGRATION →
          </a>
        </div>
      </div>
    </>
  );
}

// ─── MAIN NAVBAR ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]    = useState(false);
  const [scrollPct, setScrollPct]  = useState(0);
  const [activeSection, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen]    = useState(false);
  const [hoveredItem, setHovered]  = useState<string | null>(null);
  const [expanded, setExpanded]    = useState(false);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.href.slice(1));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive("#" + e.target.id);
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const navTo = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 32;
      window.scrollTo({ top, behavior: "smooth" });
    }, menuOpen ? 350 : 0);
  };

  const navWidth = expanded ? NAV_EXPANDED : NAV_COLLAPSED;
  const showBg   = scrolled || expanded;

  return (
    <>
      <style>{`
        @keyframes mobileSlideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .nav-item-btn {
          width: 100%; height: 46px;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center;
          padding: 0 16px; gap: 10px;
          overflow: hidden; white-space: nowrap;
          position: relative;
          transition: background 0.2s;
        }
        .nav-item-btn:hover { background: rgba(255,255,255,0.03); }

        .cta-strip:hover { background: #fff !important; }

        /* ── Mobile ── */
        .desktop-only { display: flex !important; }
        .mobile-only  { display: none  !important; }
        @media (max-width: 860px) {
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
        }
        /* Sections: add bottom padding on mobile so content isn't hidden by bottom bar */
        @media (max-width: 860px) {
          #contact, footer { padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px)) !important; }
        }
      `}</style>

      {/* ── Horizontal scroll progress — 1px at very top ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: 1, zIndex: 210,
        background: "rgba(255,255,255,0.04)",
        pointerEvents: "none",
      }}>
        <div style={{
          height: "100%",
          width: `${scrollPct}%`,
          background: "#F25C43",
          boxShadow: "0 0 8px rgba(242,92,67,0.7)",
          transition: "width 0.1s linear",
        }} />
      </div>

      {/* ── Right-side vertical strip (desktop only) ── */}
      <nav
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="desktop-only"
        style={{
          position: "fixed",
          top: TELEMETRY_OFFSET,
          right: 0,
          bottom: 0,
          width: navWidth,
          zIndex: 200,
          background: showBg ? "rgba(3,3,3,0.94)" : "transparent",
          backdropFilter: showBg ? "blur(14px)" : "none",
          WebkitBackdropFilter: showBg ? "blur(14px)" : "none",
          borderLeft: showBg
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
          transition: [
            "width 0.45s cubic-bezier(0.76,0,0.24,1)",
            "background 0.4s ease",
            "border-color 0.4s ease",
            "backdrop-filter 0.4s ease",
          ].join(", "),
          flexDirection: "column",
          overflow: "hidden",
        }}
      >

        {/* ── Desktop nav items ── */}
        <div
          className="desktop-only"
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {NAV_ITEMS.map((item, i) => {
            const isActive  = activeSection === item.href;
            const isHovered = hoveredItem === item.code;
            return (
              <button
                key={item.code}
                onClick={() => navTo(item.href)}
                onMouseEnter={() => setHovered(item.code)}
                onMouseLeave={() => setHovered(null)}
                className="nav-item-btn"
              >
                {/* Left-edge active indicator */}
                <div style={{
                  position: "absolute", left: 0, top: 10, bottom: 10,
                  width: 1,
                  background: isActive ? "#F25C43" : "transparent",
                  boxShadow: isActive ? "0 0 6px rgba(242,92,67,0.7)" : "none",
                  transition: "background 0.25s, box-shadow 0.25s",
                }} />

                {/* Dot */}
                <span style={{
                  width: 4, height: 4, borderRadius: "50%", flexShrink: 0,
                  background: isActive
                    ? "#F25C43"
                    : isHovered
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(255,255,255,0.18)",
                  boxShadow: isActive ? "0 0 6px #F25C43" : "none",
                  transition: "background 0.25s, box-shadow 0.25s",
                }} />

                {/* Code */}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.15em", flexShrink: 0,
                  color: isActive ? "#F25C43" : isHovered ? "#fff" : "rgba(255,255,255,0.5)",
                  transition: "color 0.25s",
                }}>
                  {item.code}
                </span>

                {/* Label — slides in on expand */}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.18em",
                  color: isActive ? "#F25C43" : isHovered ? "#fff" : "rgba(255,255,255,0.65)",
                  opacity: expanded ? 1 : 0,
                  transform: expanded ? "translateX(0)" : "translateX(-6px)",
                  transition: [
                    `opacity 0.3s ease ${i * 0.04 + 0.06}s`,
                    `transform 0.3s ease ${i * 0.04 + 0.06}s`,
                    "color 0.25s",
                  ].join(", "),
                  whiteSpace: "nowrap",
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Bottom: status + CTA + hamburger ── */}
        <div style={{
          flexShrink: 0, padding: "12px 0",
          display: "flex", flexDirection: "column", gap: 8,
          overflow: "hidden",
        }}>

          {/* Status pill */}
          <div
            className="desktop-only"
            style={{
              flexDirection: "row",
              alignItems: "center", gap: 7,
              padding: "0 16px", height: 28,
              overflow: "hidden", whiteSpace: "nowrap",
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: "#F25C43", boxShadow: "0 0 6px #F25C43",
              animation: "blink 2s ease infinite", display: "inline-block",
            }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)",
              opacity: expanded ? 1 : 0,
              transition: "opacity 0.25s ease 0.12s",
              whiteSpace: "nowrap",
            }}>
              APR_2026 OPEN
            </span>
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); navTo("#contact"); }}
            className="desktop-only cta-strip"
            style={{
              flexDirection: "row",
              alignItems: "center", justifyContent: "center", gap: 8,
              margin: "0 12px",
              padding: "8px 10px",
              background: "#F25C43",
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.2em", color: "#000", fontWeight: 700,
              textDecoration: "none", whiteSpace: "nowrap",
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
              transition: "background 0.25s",
            }}
          >
            <span style={{ flexShrink: 0 }}>→</span>
            <span style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? "translateX(0)" : "translateX(-6px)",
              transition: "opacity 0.25s ease 0.08s, transform 0.25s ease 0.08s",
            }}>
              INITIALIZE
            </span>
          </a>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="mobile-only"
            style={{
              width: 40, height: 40, margin: "0 auto",
              background: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 5, padding: 0,
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: menuOpen ? (i === 1 ? 0 : 14) : 18,
                height: 1.5, background: "#fff", borderRadius: 1,
                transition: "width 0.25s ease, transform 0.25s ease",
                transform: menuOpen
                  ? i === 0 ? "translateY(6.5px) rotate(45deg)"
                  : i === 2 ? "translateY(-6.5px) rotate(-45deg)"
                  : "none"
                  : "none",
              }} />
            ))}
          </button>
        </div>

        {/* Scanline texture on scroll */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(242,92,67,0.012) 3px, rgba(242,92,67,0.012) 4px)",
          opacity: showBg ? 1 : 0,
          transition: "opacity 0.5s",
        }} />
      </nav>

      {/* ── Mobile bottom bar ── */}
      <div
        className="mobile-only"
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          height: 56,
          zIndex: 200,
          background: "rgba(3,3,3,0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Logo dot */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 44, height: 44, textDecoration: "none",
          }}
        >
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: scrolled ? "#F25C43" : "rgba(255,255,255,0.4)",
            boxShadow: scrolled ? "0 0 8px #F25C43" : "none",
            transition: "all 0.3s",
          }} />
        </a>

        {/* Nav dots for each section */}
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.href;
          return (
            <button
              key={item.code}
              onClick={() => navTo(item.href)}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 4, width: 44, height: 44,
                background: "none", border: "none", cursor: "pointer",
                padding: 0,
              }}
              aria-label={item.label}
            >
              <div style={{
                width: isActive ? 18 : 6, height: 2,
                background: isActive ? "#F25C43" : "rgba(255,255,255,0.25)",
                borderRadius: 1,
                transition: "width 0.3s cubic-bezier(0.76,0,0.24,1), background 0.3s",
                boxShadow: isActive ? "0 0 6px rgba(242,92,67,0.5)" : "none",
              }} />
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 7, letterSpacing: "0.16em",
                color: isActive ? "#F25C43" : "rgba(255,255,255,0.35)",
                lineHeight: 1,
                transition: "color 0.3s",
              }}>
                {item.code}
              </span>
            </button>
          );
        })}

        {/* Hamburger for full menu */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 4, width: 44, height: 44,
            background: "none", border: "none", cursor: "pointer",
            padding: 0,
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: menuOpen ? (i === 1 ? 0 : 12) : 16,
              height: 1.5,
              background: menuOpen ? "#F25C43" : "rgba(255,255,255,0.6)",
              borderRadius: 1,
              transition: "width 0.25s ease, transform 0.25s ease, background 0.25s",
              transform: menuOpen
                ? i === 0 ? "translateY(5.5px) rotate(45deg)"
                : i === 2 ? "translateY(-5.5px) rotate(-45deg)"
                : "none"
                : "none",
            }} />
          ))}
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNav={navTo} />
    </>
  );
}
