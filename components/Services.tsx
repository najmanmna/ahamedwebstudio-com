"use client";

import { useEffect, useRef, useState } from "react";

// ─── VISUAL 01: HEADLESS COMMERCE ─────────────────────────────────────────────
// Animated data-flow canvas — packets streaming between frontend and backend nodes
function CommerceVisual({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number, W: number, H: number, t = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Nodes
    const nodes = [
      { x: 0.15, y: 0.35, label: "NEXT.JS\nFRONTEND", color: "#F25C43", w: 100, h: 60 },
      { x: 0.5,  y: 0.25, label: "EDGE CDN",          color: "rgba(26,40,72,0.9)", w: 80, h: 36 },
      { x: 0.5,  y: 0.55, label: "SANITY CMS",         color: "rgba(26,40,72,0.9)", w: 80, h: 36 },
      { x: 0.5,  y: 0.75, label: "REST API",            color: "rgba(26,40,72,0.9)", w: 80, h: 36 },
      { x: 0.85, y: 0.5,  label: "SHOPIFY\nBACKEND",   color: "rgba(26,40,72,0.85)", w: 100, h: 60 },
    ];
    type NodeType = typeof nodes[number];

    // Packets
    class Packet {
      from: NodeType; to: NodeType; p: number; speed: number; color: string; size: number;
      constructor(from: number, to: number, color: string) {
        this.from  = nodes[from];
        this.to    = nodes[to];
        this.p     = 0;
        this.speed = 0.008 + Math.random() * 0.006;
        this.color = color;
        this.size  = 3 + Math.random() * 2;
      }
      update() { this.p = Math.min(1, this.p + this.speed); }
      draw(ctx: CanvasRenderingContext2D) {
        const x = (this.from.x + (this.to.x - this.from.x) * this.p) * W;
        const y = (this.from.y + (this.to.y - this.from.y) * this.p) * H;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      done() { return this.p >= 1; }
    }

    let packets: Packet[] = [];
    let frameCount = 0;

    const routes: [number, number, string][] = [
      [0, 1, "rgba(242,92,67,0.9)"],
      [0, 2, "rgba(242,92,67,0.7)"],
      [0, 3, "rgba(242,92,67,0.5)"],
      [4, 1, "rgba(26,40,72,0.8)"],
      [4, 2, "rgba(26,40,72,0.8)"],
      [1, 0, "rgba(255,255,255,0.4)"],
      [2, 0, "rgba(255,255,255,0.3)"],
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.01;
      frameCount++;

      // Spawn packets
      if (frameCount % 18 === 0) {
        const route = routes[Math.floor(Math.random() * routes.length)];
        packets.push(new Packet(route[0], route[1], route[2]));
      }
      packets = packets.filter(p => !p.done());

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Connection lines
      const connections = [[0,1],[0,2],[0,3],[4,1],[4,2],[4,3]];
      connections.forEach(([a, b]) => {
        const ax = nodes[a].x * W, ay = nodes[a].y * H;
        const bx = nodes[b].x * W, by = nodes[b].y * H;
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1; ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(n => {
        const x = n.x * W - n.w / 2, y = n.y * H - n.h / 2;
        const isMain = n.w === 100;

        ctx.strokeStyle = isMain ? "rgba(242,92,67,0.5)" : "rgba(26,40,72,0.7)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, n.w, n.h);

        ctx.fillStyle = isMain ? "rgba(242,92,67,0.06)" : "rgba(26,40,72,0.18)";
        ctx.fillRect(x, y, n.w, n.h);

        // Label
        ctx.fillStyle = isMain ? "#F25C43" : "rgba(255,255,255,0.45)";
        ctx.font = `${9 * (W/800 + 0.3)}px monospace`;
        ctx.textAlign = "center";
        const lines = n.label.split("\n");
        lines.forEach((l, i) => {
          ctx.fillText(l, n.x * W, n.y * H + (i - (lines.length - 1) / 2) * 13 + 4);
        });
      });

      // Speed label
      ctx.fillStyle = "rgba(242,92,67,0.7)";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("0.8s TTI", W * 0.5, H * 0.1);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "9px monospace";
      ctx.fillText("DECOUPLED ARCHITECTURE", W * 0.5, H * 0.9);

      // Packets
      packets.forEach(p => { p.update(); p.draw(ctx); });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [active]);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
  );
}

// ─── VISUAL 02: ENTERPRISE SAAS ───────────────────────────────────────────────
// Live animated SaaS dashboard — real-time chart with breathing KPIs
function SaaSVisual({ active }: { active: boolean }) {
  const [bars,     setBars]     = useState(() => Array.from({length: 12}, () => 20 + Math.random() * 75));
  const [kpis,     setKpis]     = useState([{ v: "99.98", label: "UPTIME %" }, { v: "14.2K", label: "SESSIONS" }, { v: "3.4", label: "CONV %" }]);
  const [selected, setSelected] = useState(7);
  const [stream,   setStream]   = useState<{id: number; text: string}[]>([]);

  useEffect(() => {
    if (!active) return;

    const iv1 = setInterval(() => {
      setBars(b => {
        const next = [...b.slice(1), 20 + Math.random() * 75];
        setSelected(next.indexOf(Math.max(...next)));
        return next;
      });
    }, 900);

    const iv2 = setInterval(() => {
      setStream(s => [
        { id: Date.now(), text: `[${new Date().toLocaleTimeString()}] API_CALL_${Math.floor(Math.random()*999)} → 200 OK  ${(Math.random()*10+1).toFixed(0)}ms` },
        ...s.slice(0, 4),
      ]);
    }, 1100);

    return () => { clearInterval(iv1); clearInterval(iv2); };
  }, [active]);

  return (
    <div style={{ position: "absolute", inset: 0, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16, background: "rgba(26,40,72,0.04)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", marginBottom: 4 }}>ENTERPRISE_DASHBOARD</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#fff", letterSpacing: "0.04em" }}>LIVE OVERVIEW</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {["PITCH", "B2B", "SAAS"].map(t => (
            <div key={t} style={{ padding: "3px 8px", border: "1px solid rgba(242,92,67,0.3)", fontFamily: "var(--font-mono)", fontSize: 8, color: "#F25C43", letterSpacing: "0.1em" }}>{t}</div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F25C43", boxShadow: "0 0 8px #F25C43", animation: "blink 1.5s ease infinite" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#F25C43", letterSpacing: "0.1em" }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 2 }}>
        {[["UPTIME", "99.98%", true], ["SESSIONS", "14.2K", false], ["CONVERSION", "3.4%", false]].map(([k,v,hi]) => (
          <div key={k as string} style={{
            flex: 1, padding: "12px 14px",
            border: `1px solid ${hi ? "rgba(242,92,67,0.22)" : "rgba(255,255,255,0.05)"}`,
            background: hi ? "rgba(242,92,67,0.05)" : "rgba(255,255,255,0.02)",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 6, letterSpacing: "0.14em" }}>{k}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: hi ? "#F25C43" : "rgba(255,255,255,0.8)", lineHeight: 1 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.16em" }}>THROUGHPUT // 12-HOUR ROLLING</div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3, minHeight: 0 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, position: "relative",
              background: i === selected
                ? "#F25C43"
                : `rgba(${i % 2 === 0 ? "26,40,72" : "242,92,67"},${0.15 + i * 0.025})`,
              transition: "height 0.7s cubic-bezier(0.76,0,0.24,1), background 0.4s",
              boxShadow: i === selected ? "0 0 16px rgba(242,92,67,0.5), 0 -4px 20px rgba(242,92,67,0.2)" : "none",
              minHeight: 4,
            }} />
          ))}
        </div>
      </div>

      {/* API log stream */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, lineHeight: 1.8, letterSpacing: "0.06em", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 10 }}>
        {stream.slice(0, 3).map((s, i) => (
          <div key={s.id} style={{ color: i === 0 ? "rgba(242,92,67,0.8)" : "rgba(255,255,255,0.2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.text}</div>
        ))}
      </div>
    </div>
  );
}

// ─── VISUAL 03: ASYNC EXECUTION ───────────────────────────────────────────────
// Two large clocks — London asleep, Colombo building
function AsyncVisual({ active }: { active: boolean }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const getClockData = (offsetHours: number) => {
    const h = (time.getUTCHours() + offsetHours + 24) % 24;
    const m = time.getMinutes();
    const s = time.getSeconds();
    return {
      h, m, s,
      hDeg: (h % 12) * 30 + m * 0.5,
      mDeg: m * 6 + s * 0.1,
      sDeg: s * 6,
      isDark: h >= 22 || h < 7,
      display: `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`,
    };
  };

  const london  = getClockData(0);
  const colombo = getClockData(5);

  type ClockData = ReturnType<typeof getClockData>;
  const Clock = ({ data, city, tz, asleep }: { data: ClockData; city: string; tz: string; asleep: boolean }) => {
    const size = 130;
    const r = size / 2 - 8;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{
          width: size, height: size, borderRadius: "50%", position: "relative",
          border: `1px solid ${asleep ? "rgba(26,40,72,0.5)" : "rgba(242,92,67,0.6)"}`,
          background: asleep ? "rgba(26,40,72,0.07)" : "rgba(242,92,67,0.05)",
          boxShadow: asleep ? "none" : "0 0 60px rgba(242,92,67,0.15), inset 0 0 40px rgba(242,92,67,0.04)",
          flexShrink: 0,
        }}>
          {/* Hour marks */}
          {Array.from({length: 12}).map((_, i) => {
            const a = (i * 30 - 90) * Math.PI / 180;
            const isMaj = i % 3 === 0;
            const d = r - (isMaj ? 5 : 9);
            return (
              <div key={i} style={{
                position: "absolute", borderRadius: isMaj ? "0" : "50%",
                width: isMaj ? 1 : 2, height: isMaj ? 8 : 2,
                background: asleep ? `rgba(26,40,72,${isMaj ? 0.9 : 0.6})` : `rgba(242,92,67,${isMaj ? 0.8 : 0.4})`,
                top: "50%", left: "50%",
                transform: `translate(-50%, -${d + (isMaj ? 4 : 1)}px) rotate(${i * 30}deg)`,
                transformOrigin: `50% ${d + (isMaj ? 4 : 1)}px`,
              }} />
            );
          })}
          {/* Hour hand */}
          <div style={{
            position: "absolute", bottom: "50%", left: "50%",
            width: 2, height: r * 0.55,
            background: asleep ? "rgba(26,40,72,0.85)" : "#F25C43",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${data.hDeg}deg)`,
            borderRadius: "2px 2px 0 0",
            boxShadow: asleep ? "none" : "0 0 6px #F25C43",
          }} />
          {/* Minute hand */}
          <div style={{
            position: "absolute", bottom: "50%", left: "50%",
            width: 1.5, height: r * 0.75,
            background: asleep ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.7)",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${data.mDeg}deg)`,
            borderRadius: "2px 2px 0 0",
          }} />
          {/* Second hand */}
          <div style={{
            position: "absolute", bottom: "50%", left: "50%",
            width: 1, height: r * 0.82,
            background: asleep ? "transparent" : "rgba(242,92,67,0.6)",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${data.sDeg}deg)`,
            borderRadius: 1,
            transition: "transform 0.1s linear",
          }} />
          {/* Center */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: asleep ? "rgba(26,40,72,0.9)" : "#F25C43",
            boxShadow: asleep ? "none" : "0 0 10px #F25C43",
            zIndex: 2,
          }} />
        </div>

        {/* Labels */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: asleep ? "rgba(255,255,255,0.5)" : "#F25C43", marginBottom: 5 }}>{city}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: asleep ? "rgba(255,255,255,0.5)" : "#fff", lineHeight: 1, marginBottom: 5 }}>{data.display}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", color: asleep ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.6)", marginBottom: 5 }}>{tz}</div>
          <div style={{
            display: "inline-block", padding: "3px 10px",
            border: `1px solid ${asleep ? "rgba(26,40,72,0.4)" : "rgba(242,92,67,0.3)"}`,
            background: asleep ? "rgba(26,40,72,0.1)" : "rgba(242,92,67,0.06)",
            fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
            color: asleep ? "rgba(255,255,255,0.45)" : "#F25C43",
          }}>
            {asleep ? "💤  ASLEEP" : "⚡  BUILDING"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, padding: "32px 40px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)" }}>
        ASYNC_ENGINE // TIMEZONE_ADVANTAGE
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <Clock data={london}  city="LONDON, UK"  tz="UTC+0"     asleep={true}  />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 1, height: 24, background: "linear-gradient(to bottom, transparent, rgba(242,92,67,0.4))" }} />
          <div style={{
            padding: "8px 14px", textAlign: "center",
            border: "1px solid rgba(242,92,67,0.25)",
            background: "rgba(242,92,67,0.05)",
            fontFamily: "var(--font-mono)", fontSize: 8,
            letterSpacing: "0.14em", color: "#F25C43", lineHeight: 2,
          }}>
            BRIEF<br/>→<br/>STAGING
          </div>
          <div style={{ width: 1, height: 24, background: "linear-gradient(to bottom, rgba(242,92,67,0.4), transparent)" }} />
        </div>

        <Clock data={colombo} city="COLOMBO, LK" tz="UTC+5:30"  asleep={false} />
      </div>

      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 300,
        color: "rgba(255,255,255,0.65)", textAlign: "center", lineHeight: 1.8,
      }}>
        Brief at end of your day.<br />
        Live staging before your morning coffee.
      </div>
    </div>
  );
}

// ─── VISUAL 04: PERFORMANCE ───────────────────────────────────────────────────
// Full-height CWV breakdown with animated progress bars
function PerformanceVisual({ active }: { active: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setOn(true), 150);
    return () => { clearTimeout(t); setOn(false); };
  }, [active]);

  const cwv = [
    { key: "LCP",  full: "Largest Contentful Paint", value: "0.8s",  score: 98,  good: "< 2.5s" },
    { key: "FID",  full: "First Input Delay",         value: "0ms",   score: 100, good: "< 100ms" },
    { key: "CLS",  full: "Cumulative Layout Shift",   value: "0.00",  score: 100, good: "< 0.1" },
    { key: "TTI",  full: "Time to Interactive",        value: "0.6s",  score: 96,  good: "< 3.8s" },
    { key: "FCP",  full: "First Contentful Paint",    value: "0.5s",  score: 100, good: "< 1.8s" },
    { key: "TBT",  full: "Total Blocking Time",       value: "0ms",   score: 100, good: "< 200ms" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24, justifyContent: "center" }}>

      {/* Hero score */}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%", flexShrink: 0,
          border: "2px solid #F25C43",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(242,92,67,0.06)",
          boxShadow: "0 0 60px rgba(242,92,67,0.2), inset 0 0 40px rgba(242,92,67,0.04)",
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 44, color: "#F25C43", lineHeight: 1 }}>100</span>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.22em", marginBottom: 8 }}>PAGESPEED INSIGHTS</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#fff", letterSpacing: "0.04em", lineHeight: 1, marginBottom: 6 }}>PERFECT SCORE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.16em" }}>GUARANTEED ON EVERY PROJECT</div>
        </div>
      </div>

      {/* CWV bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {cwv.map((m, i) => (
          <div key={m.key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#F25C43", letterSpacing: "0.1em", minWidth: 32 }}>{m.key}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>{m.full}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#fff" }}>{m.value}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>GOOD {m.good}</span>
              </div>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: on ? `${m.score}%` : "0%",
                background: `linear-gradient(to right, #1A2848, #F25C43)`,
                transition: `width 1.6s cubic-bezier(0.76,0,0.24,1) ${i * 0.1}s`,
                boxShadow: "2px 0 12px rgba(242,92,67,0.5)",
                borderRadius: 2,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CAPABILITIES ─────────────────────────────────────────────────────────────
const CAPS = [
  {
    id: "01", tag: "COMMERCE",
    title: "Headless Commerce\nEngines",
    short: "WooCommerce → Next.js",
    body: "We take slow WordPress stores and rebuild them as decoupled Next.js storefronts. Same products, same backend, unrecognisable performance.",
    detail: "Every store ships with 90+ PageSpeed. Clients stop losing customers to load times they didn't know they had.",
    metric: "0.8s LCP",
    Visual: CommerceVisual,
  },
  {
    id: "02", tag: "PLATFORMS",
    title: "High-Stakes\nWeb Platforms",
    short: "SaaS / Pitch Decks / B2B",
    body: "Investor pitch decks, API platform landings, B2B advisory sites — frontends where the stakes are high and the first impression has to be flawless.",
    detail: "Three UK-based platform builds in the vault. Each one had to earn trust before a word was read. Design as credibility signal.",
    metric: "B2B // SAAS // PITCH",
    Visual: SaaSVisual,
  },
  {
    id: "03", tag: "ASYNC",
    title: "Agency\nExecution",
    short: "White-label. Overnight.",
    body: "100% white-label. Send the site your client is embarrassed by. We rebuild it overnight. Your client thinks you did it. Everyone wins.",
    detail: "UK end of day. Colombo midnight. Your staging link is live before your team's morning standup.",
    metric: "OVERNIGHT",
    Visual: AsyncVisual,
  },
  {
    id: "04", tag: "PERFORMANCE",
    title: "Core Web\nVitals Architecture",
    short: "100/100 PageSpeed. Guaranteed.",
    body: "Raw code engineered for perfect Core Web Vitals. Zero templates, zero legacy overhead. The score that wins pitches before the client reads the proposal.",
    detail: "Every project ships with a PageSpeed guarantee. We don't hand over until the numbers prove it.",
    metric: "100/100 CWV",
    Visual: PerformanceVisual,
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Services() {
  const ref      = useRef<HTMLElement>(null);
  const autoRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const barRef   = useRef<HTMLDivElement>(null);

  const [active,  setActive]  = useState(0);
  const [entered, setEntered] = useState(false);
  const [trans,   setTrans]   = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    autoRef.current = setInterval(() => {
      setTrans(true);
      setTimeout(() => { setActive(p => (p + 1) % CAPS.length); setTrans(false); }, 260);
    }, 5500);
    return () => clearInterval(autoRef.current ?? undefined);
  }, [entered, active]);

  const goTo = (i: number) => {
    clearInterval(autoRef.current ?? undefined);
    setTrans(true);
    setTimeout(() => { setActive(i); setTrans(false); }, 220);
  };

  const cap = CAPS[active];

  return (
    <>
      <style>{`
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes navyBreath { 0%,100%{opacity:0.18} 50%{opacity:0.42} }
        @keyframes barFill    { from{width:0%} to{width:100%} }

        .cap-row {
          display: flex; align-items: flex-start; gap: 14;
          padding: 20px 22px; cursor: pointer;
          border-left: 2px solid transparent;
          position: relative; overflow: hidden;
          transition: border-left-color 0.3s, background 0.3s;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .cap-row.active {
          border-left-color: #F25C43;
          background: rgba(242,92,67,0.04);
        }
        .cap-row:not(.active):hover {
          background: rgba(255,255,255,0.015);
          border-left-color: rgba(26,40,72,0.6);
        }
        .cap-num {
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 0.14em; line-height: 1;
          margin-top: 2px; flex-shrink: 0;
          transition: color 0.3s;
        }
        .cap-row.active   .cap-num { color: #F25C43; }
        .cap-row:not(.active) .cap-num { color: rgba(255,255,255,0.4); }
        .cap-name {
          font-family: var(--font-display); font-size: 20px;
          letter-spacing: 0.04em; line-height: 1.05;
          white-space: pre-line; transition: color 0.3s;
        }
        .cap-row.active   .cap-name { color: #fff; }
        .cap-row:not(.active) .cap-name { color: rgba(255,255,255,0.55); }

        @media (max-width: 960px) {
          .svc-layout { grid-template-columns: 1fr !important; }
          .svc-visual-wrap { min-height: 380px !important; }
        }
      `}</style>

      <section
        id="services"
        ref={ref}
        style={{
          background: "#030303",
          padding: "100px 6vw",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Grid */}
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,0.01) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.01) 1px,transparent 1px)",backgroundSize:"64px 64px" }} />
        {/* Navy ambient */}
        <div style={{ position:"absolute",bottom:"-5%",right:"5%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,40,72,0.25) 0%,transparent 70%)",pointerEvents:"none",animation:"navyBreath 9s ease-in-out infinite" }} />

        {/* ── Header ── */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"flex-end",
          marginBottom:60, flexWrap:"wrap", gap:20,
          opacity: entered?1:0, transform: entered?"none":"translateY(20px)",
          transition:"opacity 0.7s ease, transform 0.7s ease",
        }}>
          <div>
            <div style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.3em",color:"#F25C43",marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ width:5,height:5,background:"#F25C43",borderRadius:"50%",display:"inline-block" }} />
              VERIFIED_CAPABILITIES // SYSTEM_INFRASTRUCTURE
            </div>
            <h2 style={{ fontFamily:"var(--font-display)",fontSize:"clamp(3rem,7vw,6rem)",color:"#fff",lineHeight:0.95,textTransform:"uppercase" }}>
              System<br/>
              <span style={{ WebkitTextStroke:"1px rgba(255,255,255,0.18)",color:"transparent" }}>Infrastructure.</span>
            </h2>
          </div>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",color:"rgba(255,255,255,0.28)",textAlign:"right",lineHeight:2,maxWidth:180 }}>
            Engineered<br/>for scale.<br/>Sub-second<br/>latency.<br/>Always.
          </div>
        </div>

        {/* ── MASTER-DETAIL ── */}
        <div
          className="svc-layout"
          style={{
            display:"grid", gridTemplateColumns:"300px 1fr", gap:2,
            opacity: entered?1:0, transition:"opacity 0.7s ease 0.2s",
          }}
        >
          {/* ── LEFT: Chapter list ── */}
          <div style={{ background:"#0A0A0A", border:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column" }}>
            {/* Index header */}
            <div style={{ padding:"13px 22px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(26,40,72,0.1)", fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:"0.22em", color:"rgba(255,255,255,0.25)" }}>
              CAPABILITY_INDEX // {CAPS.length} MODULES
            </div>

            {CAPS.map((c, i) => (
              <div
                key={c.id}
                className={`cap-row${active === i ? " active" : ""}`}
                onClick={() => goTo(i)}
              >
                <span className="cap-num">{c.id}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.18em",color:active===i?"#F25C43":"rgba(255,255,255,0.2)",marginBottom:4,transition:"color 0.3s" }}>{c.tag}</div>
                  <div className="cap-name">{c.title}</div>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.1em",color:"rgba(255,255,255,0.22)",marginTop:4 }}>{c.short}</div>
                </div>
                {active === i && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F25C43" strokeWidth="2" style={{ flexShrink:0,marginTop:4 }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </div>
            ))}

            {/* Progress + dots */}
            <div style={{ marginTop:"auto", padding:"16px 22px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:12, overflow:"hidden" }}>
                <div key={active} style={{ height:"100%", background:"linear-gradient(to right,#1A2848,#F25C43)", animation:"barFill 5.5s linear forwards" }} />
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {CAPS.map((_,i) => (
                  <button key={i} onClick={() => goTo(i)} style={{
                    all:"unset", cursor:"pointer",
                    width: active===i ? 22 : 6, height:2,
                    background: active===i ? "#F25C43" : "rgba(26,40,72,0.6)",
                    transition:"width 0.4s cubic-bezier(0.76,0,0.24,1), background 0.3s",
                    boxShadow: active===i ? "0 0 6px rgba(242,92,67,0.4)" : "none",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Immersive panel ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>

            {/* Visual panel — the whole point */}
            <div
              className="svc-visual-wrap"
              style={{
                flex:1, minHeight:520,
                background:"#0A0A0A",
                border:"1px solid rgba(255,255,255,0.06)",
                borderTop:"1px solid rgba(26,40,72,0.5)",
                position:"relative", overflow:"hidden",
                opacity: trans?0:1,
                transform: trans?"scale(0.985)":"scale(1)",
                transition:"opacity 0.24s ease, transform 0.24s ease",
              }}
            >
              {/* Top band */}
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(to right,#1A2848,#F25C43,transparent)",zIndex:2 }} />

              {/* Category badge */}
              <div style={{
                position:"absolute",top:16,right:16,zIndex:10,
                display:"flex",alignItems:"center",gap:6,
                padding:"4px 10px",
                border:"1px solid rgba(242,92,67,0.22)",
                background:"rgba(3,3,3,0.7)",backdropFilter:"blur(8px)",
                fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.18em",color:"#F25C43",
              }}>
                <span style={{ width:4,height:4,borderRadius:"50%",background:"#F25C43",animation:"blink 2s ease infinite",display:"inline-block" }} />
                {cap.tag}
              </div>

              {/* The visual — fills everything */}
              <cap.Visual active={!trans} />
            </div>

            {/* Copy strip */}
            <div style={{
              background:"#0A0A0A",
              border:"1px solid rgba(255,255,255,0.06)",
              padding:"22px 28px",
              display:"grid", gridTemplateColumns:"1fr auto",
              gap:24, alignItems:"start",
              opacity: trans?0:1,
              transform: trans?"translateY(5px)":"translateY(0)",
              transition:"opacity 0.24s ease, transform 0.24s ease",
            }}>
              <div>
                <p style={{ fontFamily:"var(--font-sans)",fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.72)",lineHeight:1.8,marginBottom:10 }}>
                  {cap.body}
                </p>
                <p style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.12em",color:"rgba(255,255,255,0.5)",lineHeight:1.7 }}>
                  → {cap.detail}
                </p>
              </div>
              <div style={{
                display:"flex",alignItems:"center",gap:7,padding:"8px 16px",flexShrink:0,
                border:"1px solid rgba(242,92,67,0.2)",background:"rgba(242,92,67,0.04)",
                fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"#F25C43",whiteSpace:"nowrap",
              }}>
                <span style={{ width:4,height:4,borderRadius:"50%",background:"#F25C43",display:"inline-block" }} />
                {cap.metric}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}