"use client";

import { useEffect, useRef, useState } from "react";

// ─── ANIMATED SIGNAL MAP ──────────────────────────────────────────────────────
type Pulse = {
  id: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
};

function SignalMap() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [tick, setTick] = useState(0);

  const nodes = [
    { x: 18, y: 38, label: "LK", active: true },
    { x: 50, y: 20, label: "UK", active: false },
    { x: 65, y: 28, label: "AE", active: false },
    { x: 13, y: 28, label: "ES", active: false },
    { x: 56, y: 15, label: "PK", active: false },
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      setTick((t) => t + 1);
      const target = nodes[1 + Math.floor(Math.random() * (nodes.length - 1))];
      setPulses((prev) => [
        ...prev.slice(-4),
        { id: Date.now(), from: nodes[0], to: target, progress: 0 },
      ]);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setPulses((prev) =>
        prev.map((p) => ({ ...p, progress: p.progress + 3 })).filter((p) => p.progress < 100)
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [tick]);

  return (
    <svg width="100%" height="80" viewBox="0 0 100 55" preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 7} x2="100" y2={i * 7} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 8} y1="0" x2={i * 8} y2="55" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
      ))}
      {pulses.map((p) => {
        const x = p.from.x + (p.to.x - p.from.x) * (p.progress / 100);
        const y = p.from.y + (p.to.y - p.from.y) * (p.progress / 100);
        return (
          <g key={p.id}>
            <line
              x1={p.from.x} y1={p.from.y} x2={p.to.x} y2={p.to.y}
              stroke="rgba(242,92,67,0.12)" strokeWidth="0.4" strokeDasharray="2 2"
            />
            <circle cx={x} cy={y} r="1.4" fill="#F25C43" opacity="0.9" />
          </g>
        );
      })}
      {nodes.map((n) => (
        <g key={n.label}>
          {n.active && (
            <circle cx={n.x} cy={n.y} r="4" fill="none" stroke="rgba(242,92,67,0.2)" strokeWidth="0.5">
              <animate attributeName="r" values="3;7;3" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
          )}
          <circle
            cx={n.x} cy={n.y}
            r={n.active ? 2.2 : 1.4}
            fill={n.active ? "#F25C43" : "rgba(255,255,255,0.15)"}
          />
          <text
            x={n.x + 3} y={n.y - 2}
            fontSize="3.5" fill={n.active ? "#F25C43" : "rgba(255,255,255,0.35)"}
            fontFamily="monospace" fontWeight={n.active ? "700" : "400"}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── TERMINAL FIELD ───────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  sublabel?: string;
  error?: string | null;
  type?: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: () => void;
}

function Field({ label, sublabel, error, type = "text", placeholder, rows, value, onChange, onBlur }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const isTA = type === "textarea";
  const El = isTA ? "textarea" : "input";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em",
            color: focused ? "#F25C43" : "rgba(255,255,255,0.5)", textTransform: "uppercase",
            transition: "color 0.25s", display: "block",
          }}>{label}</span>
          {sublabel && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginTop: 1, display: "block" }}>
              {sublabel}
            </span>
          )}
        </div>
        {error && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#F25C43", letterSpacing: "0.12em", background: "rgba(242,92,67,0.1)", padding: "2px 7px", border: "1px solid rgba(242,92,67,0.25)" }}>
            ⚠ {error}
          </span>
        )}
      </div>
      <El
        type={type !== "textarea" ? type : undefined}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur?.(); }}
        style={{
          width: "100%",
          background: focused ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
          border: `1px solid ${error ? "rgba(242,92,67,0.45)" : focused ? "rgba(242,92,67,0.35)" : "rgba(255,255,255,0.08)"}`,
          borderBottom: `1px solid ${error ? "rgba(242,92,67,0.6)" : focused ? "#F25C43" : "rgba(255,255,255,0.12)"}`,
          color: "rgba(255,255,255,0.88)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          letterSpacing: "0.04em",
          padding: isTA ? "14px 16px" : "0 16px",
          height: isTA ? "auto" : 48,
          resize: "none",
          outline: "none",
          transition: "all 0.25s",
          display: "block",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ─── URL SCANNER ──────────────────────────────────────────────────────────────
function UrlScanner({ onUrlScanned }: { onUrlScanned?: (url: string | null) => void }) {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState<{ url: string; src: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalise = (raw: string) => {
    let u = raw.trim();
    if (u && !u.startsWith("http")) u = "https://" + u;
    return u;
  };

  const scan = async () => {
    const clean = normalise(url);
    if (!clean) return;
    try { new URL(clean); } catch { setFailed(true); return; }
    setFailed(false); setScanning(true); setScanned(null); setImgLoaded(false);
    await new Promise((r) => setTimeout(r, 600));
    const src = `https://api.microlink.io?url=${encodeURIComponent(clean)}&screenshot=true&meta=false&embed=screenshot.url`;
    setScanned({ url: clean, src });
    setScanning(false);
    onUrlScanned?.(clean);
  };

  const reset = () => {
    setUrl(""); setScanned(null); setScanning(false); setFailed(false); setImgLoaded(false);
    onUrlScanned?.(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* URL row */}
      <div style={{ display: "flex", gap: 0, position: "relative" }}>
        <div style={{
          height: 48, width: 42, flexShrink: 0,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRight: "none", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {scanning ? (
            <div style={{ width: 12, height: 12, border: "1.5px solid rgba(242,92,67,0.3)", borderTopColor: "#F25C43", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          ) : scanned ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F25C43" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          )}
        </div>
        <input
          ref={inputRef} type="text" value={url}
          onChange={(e) => { setUrl(e.target.value); setFailed(false); if (scanned) reset(); }}
          onKeyDown={(e) => { if (e.key === "Enter") scan(); }}
          placeholder="paste client URL — e.g. theirclient.com"
          disabled={scanning}
          style={{
            flex: 1, height: 48,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${failed ? "rgba(242,92,67,0.5)" : scanned ? "rgba(242,92,67,0.25)" : "rgba(255,255,255,0.08)"}`,
            borderLeft: "none", borderRight: "none",
            color: "rgba(255,255,255,0.88)", fontFamily: "var(--font-mono)",
            fontSize: 12, letterSpacing: "0.04em", padding: "0 14px",
            outline: "none", transition: "border-color 0.25s",
          }}
        />
        <button
          onClick={scanned ? reset : scan}
          disabled={scanning || (!url && !scanned)}
          style={{
            height: 48, padding: "0 20px",
            background: scanned ? "transparent" : "#F25C43",
            border: `1px solid ${scanned ? "rgba(255,255,255,0.1)" : "transparent"}`,
            color: scanned ? "rgba(255,255,255,0.5)" : "#000",
            fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.24em",
            cursor: scanning || (!url && !scanned) ? "default" : "pointer",
            transition: "all 0.25s", opacity: !url && !scanned ? 0.35 : 1,
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          {scanned ? "CLEAR" : "SCAN"}
        </button>
      </div>

      {failed && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#F25C43", letterSpacing: "0.12em" }}>
          ⚠ INVALID_URL — include full address
        </div>
      )}

      {/* Preview */}
      {(scanning || scanned) && (
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderTop: "2px solid rgba(242,92,67,0.5)", overflow: "hidden", animation: "fadeInUp 0.35s ease forwards" }}>
          {/* Browser chrome */}
          <div style={{
            height: 28, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", padding: "0 10px", gap: 8,
          }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["#F25C43", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.07)"].map((c, i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, maxWidth: 260, height: 16, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2,
              display: "flex", alignItems: "center", paddingInline: 7, gap: 4,
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {scanned ? scanned.url.replace("https://", "") : "scanning..."}
              </span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F25C43", animation: scanning ? "blink 0.5s ease infinite" : "none" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
                {scanning ? "SCANNING" : "CAPTURED"}
              </span>
            </div>
          </div>

          {/* Screenshot area */}
          <div style={{ position: "relative", height: 180, background: "#080808", overflow: "hidden" }}>
            {scanning && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, border: "1.5px solid rgba(26,40,72,0.5)", borderTopColor: "#F25C43", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", animation: "blink 1.5s ease infinite" }}>
                  SCANNING SITE...
                </div>
              </div>
            )}
            {scanned && (
              <>
                {!imgLoaded && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 22, height: 22, border: "1.5px solid rgba(26,40,72,0.5)", borderTopColor: "#F25C43", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  </div>
                )}
                <img
                  src={scanned.src} alt="Site preview" loading="lazy" decoding="async"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => { setImgLoaded(true); setFailed(true); }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", filter: "brightness(0.75) saturate(0.8)", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
                />
                {imgLoaded && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.3) 50%, transparent 100%)",
                    display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "14px 16px",
                  }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "#F25C43", letterSpacing: "0.06em", marginBottom: 2 }}>
                      We'll engineer its replacement.
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)" }}>
                      SITE_CAPTURED · PASTE URL IN FORM →
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STATUS PILL ──────────────────────────────────────────────────────────────
function StatusPill() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "8px 14px",
      background: "rgba(242,92,67,0.06)",
      border: "1px solid rgba(242,92,67,0.18)",
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F25C43", boxShadow: "0 0 8px #F25C43", animation: "blink 1.8s ease infinite" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)" }}>
        ACCEPTING PROJECTS — <span style={{ color: "rgba(255,255,255,0.85)" }}>MAY 2026</span>
      </span>
    </div>
  );
}

// ─── CONTACT INFO ─────────────────────────────────────────────────────────────
function ContactLinks() {
  const items = [
    { label: "EMAIL", value: "hello@ahamedwebstudio.com", href: "mailto:hello@ahamedwebstudio.com", icon: "✉" },
    { label: "WHATSAPP", value: "+94 71 741 1188", href: "https://wa.me/94717411188", icon: "↗" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            textDecoration: "none",
            transition: "all 0.2s",
            borderLeft: "2px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderLeftColor = "#F25C43";
            e.currentTarget.style.background = "rgba(242,92,67,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderLeftColor = "transparent";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>
            {item.label}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em" }}>
            {item.value}
          </span>
          <span style={{ color: "#F25C43", fontSize: 11 }}>{item.icon}</span>
        </a>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  type FormState = { name: string; email: string; company: string; message: string; budget: string };
  type FormErrors = { name?: string | null; email?: string | null; message?: string | null };

  const [entered, setEntered] = useState(false);
  const [scannedUrl, setScanned] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "", message: "", budget: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (scannedUrl) {
      setForm((prev) => ({ ...prev, message: prev.message || `Rebuild: ${scannedUrl}\n\n` }));
    }
  }, [scannedUrl]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name || form.name.length < 2) e.name = "REQUIRED";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "INVALID";
    if (!form.message || form.message.length < 10) e.message = "MIN 10 CHARS";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", company: "", message: "", budget: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

  const BUDGET_OPTIONS = [
    { label: "$1.5k–$3k", sub: "Next.js Front-end" },
    { label: "$3k–$5k", sub: "Headless CMS" },
    { label: "$5k+", sub: "Agency Retainer" },
  ];

  return (
    <>
      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideL   { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideR   { from{opacity:0;transform:translateX(24px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes scanDown { 0%{top:-1px} 100%{top:calc(100% + 1px)} }
        @keyframes glow     { 0%,100%{opacity:0.12} 50%{opacity:0.28} }

        input::placeholder,
        textarea::placeholder { color:rgba(255,255,255,0.2) !important; font-family:var(--font-mono); font-size:11px; }

        .budget-btn:hover:not(.sel) {
          border-color:rgba(242,92,67,0.3) !important;
          background:rgba(242,92,67,0.04) !important;
        }
        .submit-btn:hover:not(:disabled) {
          background:#fff !important;
          box-shadow:0 0 40px rgba(255,255,255,0.15) !important;
        }
        .contact-link:hover { background:rgba(242,92,67,0.04) !important; border-left-color:#F25C43 !important; }

        @media (max-width:960px) { .cg { grid-template-columns:1fr !important; } }
        @media (max-width:640px) { .ng { grid-template-columns:1fr !important; } .bg { grid-template-columns:1fr 1fr !important; } }
      `}</style>

      <section
        id="contact"
        ref={ref}
        style={{
          background: "#030303",
          padding: "96px 6vw 120px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Background texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        {/* Glow accents */}
        <div style={{ position: "absolute", top: "10%", left: "-8%", width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,40,72,0.25) 0%, transparent 70%)", pointerEvents: "none", animation: "glow 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-5%", right: "10%", width: 480, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,92,67,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div
          className="cg"
          style={{
            display: "grid", gridTemplateColumns: "5fr 7fr",
            gap: 48, maxWidth: 1320, margin: "0 auto",
            position: "relative", zIndex: 1,
          }}
        >
          {/* ── LEFT ── */}
          <div
            style={{
              display: "flex", flexDirection: "column", gap: 24,
              opacity: entered ? 1 : 0,
              animation: entered ? "slideL 0.7s ease forwards" : "none",
            }}
          >
            {/* Headline */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#F25C43", animation: "blink 2s ease infinite" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
                  INTAKE_FORM // COLOMBO_LK
                </span>
              </div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.6rem, 4.8vw, 4.8rem)",
                color: "#fff",
                lineHeight: 0.92,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                marginBottom: 20,
              }}>
                READY TO<br />INITIATE<br />
                <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.55)", color: "transparent" }}>
                  ENGINEERING?
                </span>
              </h2>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: 15,
                fontWeight: 300, color: "rgba(255,255,255,0.5)",
                lineHeight: 1.85,
                borderLeft: "2px solid rgba(242,92,67,0.3)",
                paddingLeft: 16, margin: 0,
              }}>
                Have a WordPress site your client is embarrassed by?
                Paste the URL below. Let's engineer its replacement.
              </p>
            </div>

            {/* URL Scanner */}
            <UrlScanner onUrlScanned={setScanned} />

            {/* Signal Map */}
            <div style={{
              padding: "14px 16px 10px",
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderTop: "1px solid rgba(26,40,72,0.5)",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>
                TRANSMISSION_ROUTING // COLOMBO → GLOBAL
              </div>
              <SignalMap />
            </div>

            {/* Log */}
            <div style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "2px solid rgba(26,40,72,0.5)",
              padding: "14px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              lineHeight: 2.2,
            }}>
              {[
                { text: "SYS  INTAKE_FORM_INITIALIZED", dim: true },
                { text: "OK   RESPONSE_SLA: 24H", dim: false },
                { text: "OK   PIPELINE: ASYNC_EXECUTION", dim: false },
                { text: "OK   ENCRYPTION: ENABLED", dim: false },
              ].map((e, i) => (
                <div key={i} style={{ color: e.dim ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.65)", letterSpacing: "0.08em", display: "flex", gap: 12 }}>
                  <span style={{ color: e.dim ? "rgba(255,255,255,0.15)" : "rgba(100,150,220,0.7)", flexShrink: 0 }}>›</span>
                  {e.text}
                </div>
              ))}
            </div>

            {/* Contact links */}
            <ContactLinks />

            {/* Status */}
            <StatusPill />
          </div>

          {/* ── RIGHT: Form ── */}
          <div
            style={{
              opacity: entered ? 1 : 0,
              animation: entered ? "slideR 0.7s ease 0.1s forwards" : "none",
            }}
          >
            <div style={{
              background: "#080808",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: "2px solid rgba(242,92,67,0.5)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Scan line */}
              <div style={{
                position: "absolute", left: 0, right: 0, height: 1,
                background: "linear-gradient(to right, transparent, rgba(242,92,67,0.15), transparent)",
                pointerEvents: "none", zIndex: 5,
                animation: "scanDown 7s linear infinite", top: 0,
              }} />

              {/* Chrome bar */}
              <div style={{
                padding: "10px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.025)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#F25C43", "rgba(26,40,72,0.8)", "rgba(255,255,255,0.06)"].map((c, i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em" }}>
                  INTAKE_TERMINAL.form
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#F25C43", animation: "blink 2s ease infinite" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em" }}>SECURE</span>
                </div>
              </div>

              <div style={{ padding: "32px 30px 28px" }}>
                {/* Form heading */}
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)", fontSize: 22,
                    color: "#fff", letterSpacing: "0.05em",
                    textTransform: "uppercase", marginBottom: 6,
                  }}>
                    TRANSMIT DIRECTIVES
                  </h3>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.18em", margin: 0 }}>
                    INPUT PROJECT PARAMETERS → RECEIVE ROADMAP WITHIN 24H
                  </p>
                  {scannedUrl && (
                    <div style={{
                      marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "5px 12px", border: "1px solid rgba(242,92,67,0.2)",
                      background: "rgba(242,92,67,0.06)", animation: "fadeInUp 0.35s ease forwards",
                    }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#F25C43" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)" }}>
                        SCANNED:
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "#F25C43", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {scannedUrl.replace("https://", "")}
                      </span>
                    </div>
                  )}
                </div>

                {status === "success" ? (
                  <div style={{
                    padding: "40px 20px",
                    border: "1px solid rgba(26,40,72,0.4)",
                    borderTop: "2px solid #F25C43",
                    background: "rgba(26,40,72,0.06)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 14, textAlign: "center",
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(242,92,67,0.1)", border: "1px solid rgba(242,92,67,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F25C43" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#F25C43", letterSpacing: "0.04em" }}>
                      TRANSMISSION RECEIVED
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em" }}>
                      RESPONSE_SLA: 24H · PIPELINE_INITIALIZED
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Name + Company */}
                    <div className="ng" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <Field
                        label="Entity_Name" placeholder="John Doe"
                        error={errors.name} value={form.name} onChange={set("name")}
                      />
                      <Field
                        label="Company // Agency" placeholder="Studio Name"
                        value={form.company} onChange={set("company")}
                      />
                    </div>

                    {/* Email */}
                    <Field
                      label="Director_Email" type="email" placeholder="you@company.com"
                      error={errors.email} value={form.email} onChange={set("email")}
                    />

                    {/* Message */}
                    <Field
                      label="Project_Parameters"
                      sublabel="legacy URL · preferred stack · deadline"
                      type="textarea" rows={5}
                      placeholder={"Rebuild theirclient.com → Next.js & Sanity CMS\nUK agency client · Staging by 15 May"}
                      error={errors.message} value={form.message} onChange={set("message")}
                    />

                    {/* Budget */}
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)", marginBottom: 10, textTransform: "uppercase" }}>
                        Estimated_Budget
                      </div>
                      <div className="bg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                        {BUDGET_OPTIONS.map((opt) => {
                          const sel = form.budget === opt.label;
                          return (
                            <button
                              key={opt.label} type="button"
                              className={`budget-btn${sel ? " sel" : ""}`}
                              onClick={() => setForm((prev) => ({ ...prev, budget: opt.label }))}
                              style={{
                                all: "unset", cursor: "pointer",
                                display: "flex", flexDirection: "column", gap: 5,
                                padding: "12px 12px 10px",
                                border: `1px solid ${sel ? "rgba(242,92,67,0.45)" : "rgba(255,255,255,0.07)"}`,
                                borderTop: `2px solid ${sel ? "#F25C43" : "rgba(255,255,255,0.05)"}`,
                                background: sel ? "rgba(242,92,67,0.06)" : "rgba(255,255,255,0.02)",
                                transition: "all 0.2s",
                                position: "relative",
                              }}
                            >
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", color: sel ? "#F25C43" : "rgba(255,255,255,0.7)", fontWeight: sel ? 700 : 400, transition: "color 0.2s" }}>
                                {opt.label}
                              </span>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: sel ? "rgba(242,92,67,0.6)" : "rgba(255,255,255,0.25)" }}>
                                {opt.sub}
                              </span>
                              {sel && <div style={{ position: "absolute", top: 6, right: 8, width: 5, height: 5, borderRadius: "50%", background: "#F25C43" }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: "linear-gradient(to right, rgba(26,40,72,0.6), rgba(242,92,67,0.15), transparent)" }} />

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="submit-btn"
                      style={{
                        width: "100%", height: 52,
                        background: "#F25C43", border: "none",
                        color: "#000", fontFamily: "var(--font-mono)",
                        fontSize: 10, letterSpacing: "0.28em",
                        fontWeight: 700, textTransform: "uppercase",
                        cursor: status === "submitting" ? "wait" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                        transition: "all 0.25s",
                        boxShadow: "0 0 32px rgba(242,92,67,0.18)",
                      }}
                    >
                      {status === "submitting" ? (
                        <>
                          <div style={{ width: 13, height: 13, border: "2px solid rgba(0,0,0,0.25)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          TRANSMIT PARAMETERS
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#F25C43", letterSpacing: "0.18em", textAlign: "center", padding: "8px", background: "rgba(242,92,67,0.06)", border: "1px solid rgba(242,92,67,0.2)" }}>
                        ⚠ TRANSMISSION FAILED — USE DIRECT TELEMETRY
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}