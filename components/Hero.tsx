"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ReactNode, CSSProperties } from "react";

// ─── SCRAMBLE ─────────────────────────────────────────────────────────────────
const CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";
function useScramble(text: string, delay = 0) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, "_"));
  useEffect(() => {
    let iter = 0;
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        setDisplay(
          text.split("").map((ch: string, i: number) => {
            if (ch === " ") return " ";
            if (i < iter)   return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );
        iter += 0.4;
        if (iter > text.length) clearInterval(iv);
      }, 35);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, delay]);
  return display;
}

// ─── COUNT-UP ─────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600, delay = 2500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start: number | null = null;
    let raf: number;
    const t = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        setVal(Math.floor(eased * target));
        if (p < 1) raf = requestAnimationFrame(step);
        else setVal(target);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return val;
}

// ─── NOISE ────────────────────────────────────────────────────────────────────
function noise(x: number, y: number) {
  return (
    Math.sin(x * 1.7 + y * 0.9) * 0.5 +
    Math.sin(x * 0.3 + y * 2.1) * 0.3 +
    Math.sin((x + y) * 0.8)      * 0.2
  );
}

// ─── FLOW FIELD CANVAS ────────────────────────────────────────────────────────
function FlowCanvas() {
  const ref   = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, down: false });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number, W: number, H: number;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
    };
    const onDown = () => (mouse.current.down = true);
    const onUp   = () => (mouse.current.down = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    const COUNT = window.innerWidth > 768 ? 2200 : 900;

    class Particle {
      x!: number; y!: number; px!: number; py!: number;
      vx!: number; vy!: number; life!: number; maxLife!: number;
      speed!: number; size!: number; type!: string;

      constructor() { this.reset(true); }

      reset(init = false) {
        this.x       = Math.random() * W;
        this.y       = Math.random() * H;
        this.px      = this.x;
        this.py      = this.y;
        this.vx      = 0;
        this.vy      = 0;
        this.life    = init ? Math.random() : 0;
        this.maxLife = 0.4 + Math.random() * 0.6;
        this.speed   = 0.4 + Math.random() * 1.0;
        this.size    = 0.6 + Math.random() * 1.4;
        const r = Math.random();
        if      (r < 0.04) this.type = "white";
        else if (r < 0.09) this.type = "gold";
        else if (r < 0.34) this.type = "navy";
        else               this.type = "coral";
      }

      update(t: number) {
        this.px = this.x;
        this.py = this.y;

        const scale = 0.0018;
        const angle = noise(this.x * scale + t * 0.18, this.y * scale + t * 0.12) * Math.PI * 4;

        this.vx = this.vx * 0.88 + Math.cos(angle) * this.speed * 0.18;
        this.vy = this.vy * 0.88 + Math.sin(angle) * this.speed * 0.18;

        const mx = mouse.current.x, my = mouse.current.y;
        const dx = mx - this.x,     dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = mouse.current.down ? 200 : 120;

        if (dist < radius && mx > 0) {
          const force = (1 - dist / radius) * (mouse.current.down ? 4.5 : 2.2);
          const nx = dx / dist, ny = dy / dist;
          const tx = -ny,       ty = nx;
          this.vx += (tx * 0.7 + nx * 0.3) * force * 0.14;
          this.vy += (ty * 0.7 + ny * 0.3) * force * 0.14;
        }

        const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (spd > 3.5) { this.vx = (this.vx / spd) * 3.5; this.vy = (this.vy / spd) * 3.5; }

        this.x += this.vx;
        this.y += this.vy;
        this.life += 0.004;

        if (
          this.life > this.maxLife ||
          this.x < -20 || this.x > W + 20 ||
          this.y < -20 || this.y > H + 20
        ) {
          const edge = Math.floor(Math.random() * 4);
          if      (edge === 0) { this.x = Math.random() * W; this.y = -5; }
          else if (edge === 1) { this.x = W + 5;             this.y = Math.random() * H; }
          else if (edge === 2) { this.x = Math.random() * W; this.y = H + 5; }
          else                 { this.x = -5;                this.y = Math.random() * H; }
          this.px = this.x; this.py = this.y;
          this.vx = 0; this.vy = 0;
          this.life    = 0;
          this.maxLife = 0.4 + Math.random() * 0.6;
          this.speed   = 0.4 + Math.random() * 1.0;
          this.size    = 0.6 + Math.random() * 1.4;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const lifePct = this.life / this.maxLife;
        const alpha   = Math.sin(lifePct * Math.PI) * 0.85;
        if (alpha < 0.01) return;

        let color: string;
        if      (this.type === "coral") color = `rgba(242,92,67,${alpha * 0.75})`;
        else if (this.type === "navy")  color = `rgba(26,40,72,${alpha * 1.1})`;
        else if (this.type === "gold")  color = `rgba(212,163,83,${alpha * 0.55})`;
        else                            color = `rgba(255,255,255,${alpha * 0.55})`;

        const dx = this.x - this.px, dy = this.y - this.py;
        const trailLen = Math.sqrt(dx * dx + dy * dy);
        if (trailLen > 0.3) {
          ctx.beginPath();
          ctx.moveTo(this.px, this.py);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = color;
          ctx.lineWidth   = this.size * (0.4 + trailLen * 0.06);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: COUNT }, () => new Particle());
    let t = 0;

    const draw = () => {
      t += 0.008;

      ctx.fillStyle = "rgba(3,3,3,0.22)";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.018)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 72) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const mx = mouse.current.x, my = mouse.current.y;
      if (mx > 0 && mx < W && my > 0 && my < H) {
        const r   = mouse.current.down ? 220 : 140;
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, r);
        grd.addColorStop(0,   "rgba(242,92,67,0.04)");
        grd.addColorStop(0.4, "rgba(26,40,72,0.03)");
        grd.addColorStop(1,   "transparent");
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mx, my, mouse.current.down ? 16 : 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(242,92,67,${mouse.current.down ? 0.7 : 0.4})`;
        ctx.lineWidth   = mouse.current.down ? 1.5 : 1;
        ctx.stroke();
      }

      particles.forEach(p => { p.update(t); p.draw(ctx); });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0 }}
    />
  );
}

// ─── GRAIN OVERLAY ────────────────────────────────────────────────────────────
// Adds tactile texture via SVG feTurbulence filter — zero JS cost
function GrainOverlay() {
  return (
    <>
      <svg style={{ position:"absolute",width:0,height:0,overflow:"hidden" }} aria-hidden="true">
        <defs>
          <filter id="hero-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        style={{
          position:"absolute",inset:0,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat:"repeat",
          backgroundSize:"128px 128px",
          opacity:0.038,
          pointerEvents:"none",
          zIndex:4,
          mixBlendMode:"screen",
        }}
      />
    </>
  );
}

// ─── AVAILABILITY BADGE ───────────────────────────────────────────────────────
function AvailabilityBadge() {
  return (
    <div
      aria-label="Studio status: currently available"
      style={{
        display:"inline-flex",alignItems:"center",gap:10,
        marginBottom:"clamp(12px,2.4vw,20px)",
        padding:"5px 14px 5px 10px",
        border:"1px solid rgba(74,222,128,0.2)",
        borderRadius:24,
        background:"rgba(74,222,128,0.06)",
        backdropFilter:"blur(10px)",
        position:"relative",zIndex:5,
        opacity:0,animation:"fadeUp 0.6s ease forwards 0.1s",
      }}
    >
      {/* Pulsing green dot */}
      <span style={{ position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:8,height:8,flexShrink:0 }}>
        <span style={{
          position:"absolute",width:8,height:8,borderRadius:"50%",background:"#4ade80",
          animation:"ping 2s cubic-bezier(0,0,0.2,1) infinite",
        }} />
        <span style={{ position:"relative",width:8,height:8,borderRadius:"50%",background:"#4ade80",display:"block" }} />
      </span>
      <span style={{
        fontFamily:"var(--font-mono)",
        fontSize:"clamp(8px,1.1vw,10px)",
        letterSpacing:"0.28em",
        color:"rgba(74,222,128,0.8)",
        textTransform:"uppercase",
        whiteSpace:"nowrap",
      }}>
        Available · Accepting 2 Clients
      </span>
    </div>
  );
}

// ─── CORNER BRACKETS ──────────────────────────────────────────────────────────
function CornerBrackets() {
  return (
    <div aria-hidden="true" style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:5 }}>
      {/* Top-left — coral */}
      <svg style={{ position:"absolute",top:88,left:"calc(6vw - 4px)",opacity:0,animation:"fadeIn 1s ease forwards 0.5s" }} width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 22V0H22" stroke="rgba(242,92,67,0.25)" strokeWidth="1.5"/>
      </svg>
      {/* Bottom-right — coral */}
      <svg style={{ position:"absolute",bottom:52,right:"calc(6vw - 4px)",opacity:0,animation:"fadeIn 1s ease forwards 0.5s" }} width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 0V22H0" stroke="rgba(242,92,67,0.25)" strokeWidth="1.5"/>
      </svg>
      {/* Top-right — navy (subtler) */}
      <svg style={{ position:"absolute",top:88,right:"calc(6vw - 4px)",opacity:0,animation:"fadeIn 1s ease forwards 0.8s" }} width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M22 22V0H0" stroke="rgba(26,40,72,0.45)" strokeWidth="1.5"/>
      </svg>
      {/* Bottom-left — navy */}
      <svg style={{ position:"absolute",bottom:52,left:"calc(6vw - 4px)",opacity:0,animation:"fadeIn 1s ease forwards 0.8s" }} width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M0 0V22H22" stroke="rgba(26,40,72,0.45)" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rx = 0, ry = 0, raf: number;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      if (dot.current)
        dot.current.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
      rx += (e.clientX - rx) * 0.12;
      ry += (e.clientY - ry) * 0.12;

      const el = e.target as Element;
      const now = !!(el?.closest("button,a,[role=button],[tabindex]"));
      if (now !== hovering) {
        hovering = now;
        if (ring.current) {
          ring.current.style.width        = hovering ? "52px" : "36px";
          ring.current.style.height       = hovering ? "52px" : "36px";
          ring.current.style.marginTop    = hovering ? "-26px" : "-18px";
          ring.current.style.marginLeft   = hovering ? "-26px" : "-18px";
          ring.current.style.borderColor  = hovering ? "rgba(242,92,67,0.75)" : "rgba(242,92,67,0.4)";
          ring.current.style.borderWidth  = hovering ? "1.5px" : "1px";
        }
        if (dot.current)
          dot.current.style.opacity = hovering ? "0" : "1";
      }
    };

    window.addEventListener("mousemove", onMove);
    const lerp = () => {
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(lerp);
    };
    lerp();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="c-c" aria-hidden="true">
      <div ref={dot} style={{
        position:"fixed",top:0,left:0,width:8,height:8,
        background:"#F25C43",borderRadius:"50%",
        pointerEvents:"none",zIndex:9999,mixBlendMode:"difference",
        transition:"opacity 0.25s ease",
      }} />
      <div ref={ring} style={{
        position:"fixed",top:0,left:0,
        marginTop:-18,marginLeft:-18,
        width:36,height:36,
        border:"1px solid rgba(242,92,67,0.4)",borderRadius:"50%",
        pointerEvents:"none",zIndex:9998,
        transition:"width 0.35s cubic-bezier(0.23,1,0.32,1),height 0.35s cubic-bezier(0.23,1,0.32,1),margin 0.35s cubic-bezier(0.23,1,0.32,1),border-color 0.3s ease,border-width 0.2s ease",
      }} />
    </div>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
const TICKERS = [
  "NEXT.JS ARCHITECTURE","SUB-SECOND LATENCY","WEBGL INTERFACES","THREE.JS RENDERING",
  "ASYNC EXECUTION","FRAMER MOTION","HEADLESS COMMERCE","SAAS FRONTENDS",
  "AGENCY WHITE-LABEL","CORE WEB VITALS: 100",
];
function Ticker() {
  const items = [...TICKERS, ...TICKERS];
  return (
    <div style={{
      position:"absolute",bottom:0,left:0,right:0,
      borderTop:"1px solid rgba(255,255,255,0.06)",
      background:"rgba(3,3,3,0.94)",backdropFilter:"blur(12px)",
      height:44,overflow:"hidden",zIndex:10,
      display:"flex",alignItems:"center",
    }}>
      {/* LIVE badge */}
      <div style={{
        flexShrink:0,display:"flex",alignItems:"center",gap:8,
        padding:"0 14px 0 16px",height:"100%",
        borderRight:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(3,3,3,0.98)",zIndex:2,position:"relative",
      }}>
        <span style={{ position:"relative",display:"inline-flex",alignItems:"center",width:6,height:6 }}>
          <span style={{ position:"absolute",width:6,height:6,borderRadius:"50%",background:"#F25C43",animation:"ping 2s ease-out infinite" }} />
          <span style={{ position:"relative",width:6,height:6,borderRadius:"50%",background:"#F25C43",display:"block" }} />
        </span>
        <span style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.28em",color:"rgba(242,92,67,0.75)",textTransform:"uppercase" }}>
          LIVE
        </span>
      </div>
      {/* Fade masks */}
      <div aria-hidden="true" style={{ position:"absolute",left:74,top:0,bottom:0,width:36,background:"linear-gradient(to right,#030303,transparent)",zIndex:1,pointerEvents:"none" }} />
      <div aria-hidden="true" style={{ position:"absolute",right:0,top:0,bottom:0,width:80,background:"linear-gradient(to left,#030303,transparent)",zIndex:1,pointerEvents:"none" }} />
      {/* Scrolling items */}
      <div style={{ display:"flex",animation:"tickerScroll 42s linear infinite",whiteSpace:"nowrap",paddingLeft:16 }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.25em",paddingRight:48,
            color: i % 2 === 0
              ? "rgba(255,255,255,0.25)"
              : Math.floor(i / 2) % 2 === 0
                ? "#F25C43"
                : "rgba(26,40,72,0.85)",
          }}>
            {i % 2 === 0 ? item : "◆"}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MAGNETIC BUTTON ──────────────────────────────────────────────────────────
// Applies a subtle physical pull toward the cursor — makes the CTA feel alive
function MagneticButton({
  children,
  className,
  onClick,
  style: exStyle,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);

  return (
    <button
      ref={ref}
      className={className}
      style={{
        ...exStyle,
        transition:"transform 0.45s cubic-bezier(0.23,1,0.32,1),box-shadow 0.4s ease",
      }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
}

// ─── STAT ITEM ────────────────────────────────────────────────────────────────
function StatItem({
  n,
  a,
  l,
  index,
}: {
  n: number | string; // pass number to animate, string to show as-is (e.g. "<1")
  a: string;
  l: string;
  index: number;
}) {
  const target  = typeof n === "number" ? n : 0;
  const counted = useCountUp(target, 1600, 2600 + index * 180);
  const display = typeof n === "string" ? n : counted;

  return (
    <div className="si">
      <div className="sn">
        {display}<span className="sa">{a}</span>
      </div>
      <div className="sl">{l}</div>
      {index < 2 && <div className="ss" />}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const line1 = useScramble("ENGINEERING",      300);
  const line2 = useScramble("DIGITAL",          900);
  const line3 = useScramble("INFRASTRUCTURE.", 1400);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 92, behavior:"smooth" });
  };

  return (
    <>
      <style>{`
        @media (pointer:fine)  { .hero-s,.hero-s * { cursor:none !important; } }
        @media (pointer:coarse){ .c-c { display:none; } }

        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes scanPx   { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes hintPulse{ 0%,100%{opacity:0} 30%,70%{opacity:1} }
        @keyframes ping     { 0%{transform:scale(1);opacity:0.9} 100%{transform:scale(2.8);opacity:0} }

        /* Periodic glitch burst on INFRASTRUCTURE. */
        @keyframes glitch {
          0%,90%  { transform:none;                   opacity:1;   filter:none }
          91%     { transform:translateX(-4px) skewX(-3deg); opacity:0.85; filter:brightness(1.5) hue-rotate(20deg) }
          92%     { transform:translateX(4px)  skewX(3deg);  clip-path:inset(3px 0 10px 0) }
          93%     { transform:translateX(-2px);               clip-path:inset(10px 0 2px 0) }
          94%     { transform:translateX(3px);                filter:brightness(0.7) }
          95%     { transform:none;                   opacity:1;   filter:none; clip-path:none }
          100%    { transform:none }
        }

        /* Travelling shimmer on DIGITAL */
        @keyframes shimmer {
          0%   { background-position:200% center }
          100% { background-position:-200% center }
        }

        .hero-s {
          position:relative; min-height:100svh; background:#030303; overflow:hidden;
          display:flex; flex-direction:column; justify-content:center;
          padding:0 6vw; padding-top:80px; padding-bottom:44px;
        }

        .hero-logo {
          height:clamp(36px,4.2vw,52px); width:auto; display:block;
          margin-bottom:clamp(16px,2.4vw,24px);
          position:relative; z-index:5;
          opacity:0; animation:fadeUp 0.7s ease forwards 0.05s;
          object-fit:contain; object-position:left center;
        }

        /* Slimmer scanline — single pixel moving top→bottom */
        .scan-px {
          position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(to right,transparent 0%,transparent 15%,rgba(242,92,67,0.4) 50%,transparent 85%,transparent 100%);
          animation:scanPx 9s linear infinite; pointer-events:none; z-index:4;
        }

        /* Vignette — darkens edges, focuses center */
        .vignette {
          position:absolute; inset:0; pointer-events:none; z-index:2;
          background:radial-gradient(ellipse 85% 75% at 38% 50%,transparent 35%,rgba(0,0,0,0.6) 100%);
        }

        .hl {
          font-family:var(--font-display);
          font-size:clamp(3.8rem,11vw,12.5rem);
          line-height:0.88; letter-spacing:0.01em; color:#fff;
          margin-bottom:44px; position:relative; z-index:5; text-transform:uppercase;
        }
        .hl-label {
          font-family:var(--font-mono);
          font-size:clamp(0.7rem,2.4vw,1.35rem);
          letter-spacing:0.3em; display:block; margin-bottom:0.1em; color:#F25C43;
        }
        /* DIGITAL — travelling light shimmer */
        .hl-digital {
          display:block;
          background:linear-gradient(
            90deg,
            #fff 0%,
            rgba(255,255,255,0.75) 35%,
            #F25C43 50%,
            rgba(255,255,255,0.75) 65%,
            #fff 100%
          );
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmer 7s linear infinite 2.5s;
        }
        /* INFRASTRUCTURE. — glitch burst + white-stroke ghost */
        .hl-stroke {
          display:block;
          -webkit-text-stroke:2px rgba(255,255,255,0.55);
          color:transparent;
          filter:drop-shadow(0 0 28px rgba(242,92,67,0.18));
          animation:glitch 11s ease-in-out infinite 4.5s;
        }

        .sub-row {
          display:flex; align-items:flex-start; gap:28px;
          max-width:580px; margin-bottom:52px;
          opacity:0; animation:fadeUp 0.8s ease forwards 1.8s;
          position:relative; z-index:5;
        }
        .sub-line {
          width:1px; height:80px; flex-shrink:0; margin-top:5px;
          background:linear-gradient(to bottom,#F25C43,rgba(26,40,72,0.25));
        }
        .sub-text {
          font-family:var(--font-sans);
          font-size:clamp(0.9375rem,1.5vw,1.0625rem);
          font-weight:300; line-height:1.82;
          color:rgba(255,255,255,0.62); letter-spacing:0.02em;
        }

        .actions {
          display:flex; align-items:center; flex-wrap:wrap; gap:20px;
          opacity:0; animation:fadeUp 0.8s ease forwards 2.1s;
          position:relative; z-index:5;
        }
        .btn-ph {
          position:relative; height:52px; padding:0 32px;
          background:#F25C43; color:#030303; border:none;
          font-family:var(--font-mono); font-size:11px; letter-spacing:0.25em;
          text-transform:uppercase; overflow:hidden; cursor:none;
          display:flex; align-items:center; gap:12px;
          box-shadow:0 0 28px rgba(242,92,67,0.2);
          clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%);
        }
        .btn-ph:hover { box-shadow:0 0 56px rgba(242,92,67,0.55); }
        .btn-ph::after {
          content:''; position:absolute; inset:0;
          background:rgba(255,255,255,0.15);
          transform:translateX(-101%);
          transition:transform 0.4s cubic-bezier(0.76,0,0.24,1);
        }
        .btn-ph:hover::after { transform:translateX(0); }

        .btn-gh {
          height:52px; padding:0 28px; background:transparent;
          border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.55);
          font-family:var(--font-mono); font-size:11px; letter-spacing:0.2em;
          text-transform:uppercase; cursor:none;
          transition:border-color 0.3s,background 0.3s,color 0.3s;
          clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%);
        }
        .btn-gh:hover { border-color:rgba(26,40,72,0.8); background:rgba(26,40,72,0.22); color:#fff; }

        .side-stats {
          position:absolute; right:6vw; top:50%; transform:translateY(-50%);
          display:flex; flex-direction:column; gap:28px; z-index:10;
          opacity:0; animation:fadeUp 0.8s ease forwards 2.4s;
        }
        .si { text-align:right; }
        .sn { font-family:var(--font-display); font-size:44px; color:#fff; line-height:1; }
        .sa { color:#F25C43; }
        .sl { font-family:var(--font-mono); font-size:11px; letter-spacing:0.22em; color:rgba(255,255,255,0.35); text-transform:uppercase; margin-top:4px; }
        .ss { width:28px; height:2px; background:linear-gradient(to left,#1A2848,transparent); margin-left:auto; margin-top:12px; }

        .mouse-hint {
          position:absolute; bottom:56px; left:50%; transform:translateX(-50%);
          font-family:var(--font-mono); font-size:9px; letter-spacing:0.22em;
          color:rgba(255,255,255,0.2); text-transform:uppercase; z-index:5;
          display:flex; align-items:center; gap:8px; white-space:nowrap;
          animation:hintPulse 5s ease 3s forwards;
        }

        .sprint-lbl {
          position:absolute; left:calc(6vw - 22px); bottom:60px;
          font-family:var(--font-mono); font-size:9px; letter-spacing:0.3em;
          color:rgba(255,255,255,0.12); text-transform:uppercase;
          writing-mode:vertical-rl; transform:rotate(180deg); z-index:5;
        }

        @media (max-width:1024px) {
          .side-stats  { display:none }
          .sprint-lbl  { display:none }
          .hl          { font-size:clamp(2.8rem,10vw,8rem) }
        }
        @media (max-width:640px) {
          .side-stats {
            display:flex !important; position:static; transform:none;
            flex-direction:row; gap:0; margin-top:clamp(20px,6vw,32px);
            border-top:1px solid rgba(255,255,255,0.06);
            padding-top:clamp(16px,5vw,24px);
            opacity:0; animation:fadeUp 0.8s ease forwards 2.4s;
          }
          .si             { text-align:left; flex:1; padding-right:12px; }
          .si + .si       { border-left:1px solid rgba(255,255,255,0.06); padding-left:12px; padding-right:0; }
          .sn             { font-size:clamp(26px,9vw,38px); }
          .sl             { font-size:9px; letter-spacing:0.16em; }
          .ss             { display:none; }
        }
        @media (max-width:640px) {
          .hero-s   { padding-left:5vw; padding-right:5vw; padding-top:clamp(68px,17vw,88px); padding-bottom:calc(44px + 64px); min-height:100svh; }
          .hero-logo{ height:clamp(28px,8.5vw,40px); margin-bottom:clamp(14px,4vw,22px); }
          .hl       { font-size:clamp(2.4rem,13.5vw,5rem); margin-bottom:clamp(18px,5vw,28px); }
          .hl-label { font-size:clamp(0.6rem,3.2vw,0.85rem); letter-spacing:0.2em; margin-bottom:0.2em; }
          .sub-row  { gap:14px; margin-bottom:clamp(22px,6vw,32px); max-width:100%; }
          .sub-text { font-size:clamp(0.82rem,3.6vw,0.94rem); line-height:1.72; }
          .sub-line { height:52px; }
          .actions  { gap:10px; }
          .btn-ph   { height:48px; padding:0 20px; font-size:10px; }
          .btn-gh   { height:48px; padding:0 16px; font-size:10px; }
          .mouse-hint { display:none }
          .scan-px    { display:none }
        }
        @media (max-width:380px) {
          .hl           { font-size:clamp(2rem,12.5vw,3.6rem); }
          .hero-logo    { height:clamp(24px,7vw,32px); }
          .btn-ph,.btn-gh { width:100%; justify-content:center; }
          .actions      { flex-direction:column; align-items:stretch; gap:8px; }
        }
      `}</style>

      <Cursor />

      <section className="hero-s">
        {/* ── Background layers (z: 0→4) ── */}
        <FlowCanvas />
        <div className="vignette" aria-hidden="true" />
        <GrainOverlay />
        <div className="scan-px" aria-hidden="true" />

        {/* Ambient corner gradients */}
        <div aria-hidden="true" style={{ position:"absolute",top:0,right:0,width:"40%",height:"70%",background:"radial-gradient(ellipse at 100% 0%,rgba(26,40,72,0.24) 0%,transparent 65%)",pointerEvents:"none",zIndex:1 }} />
        <div aria-hidden="true" style={{ position:"absolute",bottom:0,left:0,right:0,height:"28%",background:"linear-gradient(to top,rgba(0,0,0,0.45),transparent)",pointerEvents:"none",zIndex:1 }} />

        <CornerBrackets />

        {/* ── Content (z: 5) ── */}
        <img
          className="hero-logo"
          src="/logo-trans.png"
          alt="Ahamed Web Studio"
          onError={e => { e.currentTarget.style.display = "none"; }}
        />

        {/* <AvailabilityBadge /> */}

        <h1 className="hl">
          <span className="hl-label">{line1}</span>
          <span className="hl-digital">{line2}</span>
          <span className="hl-stroke">{line3}</span>
        </h1>

        <div className="sub-row">
          <div className="sub-line" aria-hidden="true" />
          <p className="sub-text">
            The silent execution engine for global design agencies. We take the sites your clients are embarrassed by and rebuild them as world-class Next.js frontends — without the wait.
          </p>
        </div>

        <div className="actions">
          <MagneticButton className="btn-ph" onClick={() => scrollTo("#contact")}>
            Initialize Discovery
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </MagneticButton>

          <button className="btn-gh" onClick={() => scrollTo("#portfolio")}>
            Explore The Vault
          </button>

          <span style={{ fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.2em",color:"rgba(255,255,255,0.26)",display:"flex",alignItems:"center",gap:12 }}>
            <span aria-hidden="true" style={{ width:26,height:1,display:"inline-block",background:"linear-gradient(to right,#1A2848,rgba(242,92,67,0.35))" }} />
            100% ASYNC EXECUTION
          </span>
        </div>

        {/* Stats — animated count-up */}
        <div className="side-stats">
          <StatItem n={20}   a="+" l="Projects Deployed" index={0} />
          <StatItem n="<1"   a="s" l="Load Time"         index={1} />
          <StatItem n={100}  a=""  l="PageSpeed"         index={2} />
        </div>

        <div className="mouse-hint" aria-hidden="true">
          <div style={{ width:6,height:6,borderRadius:"50%",background:"#F25C43",opacity:0.5 }} />
          Move cursor to interact
        </div>

        <div className="sprint-lbl" aria-hidden="true">PROVISIONING · APR_2026_SPRINTS</div>

        <Ticker />
      </section>
    </>
  );
}