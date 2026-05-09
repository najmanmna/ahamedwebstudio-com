"use client";

import { useEffect, useRef, useState } from "react";

// ─── SCRAMBLE ─────────────────────────────────────────────────────────────────
const CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";
function useScramble(text: string, delay = 0) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, "_"));
  useEffect(() => {
    let iter = 0, iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        setDisplay(text.split("").map((ch: string, i: number) => {
          if (ch === " ") return " ";
          if (i < iter) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(""));
        iter += 0.4;
        if (iter > text.length) clearInterval(iv);
      }, 35);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, delay]);
  return display;
}

// ─── SIMPLEX-LIKE NOISE (no deps) ─────────────────────────────────────────────
// Smooth hash-based 2D noise — fast enough for 2000 particles at 60fps
function noise(x: number, y: number) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf), v = fade(yf);
  // Simple smooth noise using trig — predictable but visually excellent
  return (
    Math.sin(x * 1.7 + y * 0.9) * 0.5 +
    Math.sin(x * 0.3 + y * 2.1) * 0.3 +
    Math.sin((x + y) * 0.8) * 0.2
  );
}
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }

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
    const onDown = () => mouse.current.down = true;
    const onUp   = () => mouse.current.down = false;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    // ── Particle system ──────────────────────────────────────────────────────
    const COUNT = window.innerWidth > 768 ? 2200 : 900;

    class Particle {
      x!: number; y!: number; px!: number; py!: number;
      vx!: number; vy!: number; life!: number; maxLife!: number;
      speed!: number; size!: number; type!: string;
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.px = this.x;
        this.py = this.y;
        this.vx = 0;
        this.vy = 0;
        this.life   = init ? Math.random() : 0;
        this.maxLife = 0.4 + Math.random() * 0.6;
        this.speed   = 0.4 + Math.random() * 1.0;
        this.size    = 0.6 + Math.random() * 1.4;
        // Color: ~30% navy, ~70% coral, a few pure white
        const r = Math.random();
        if      (r < 0.06) this.type = "white";
        else if (r < 0.32) this.type = "navy";
        else               this.type = "coral";
      }
      update(t: number) {
        this.px = this.x;
        this.py = this.y;

        // Flow field angle from noise
        const scale = 0.0018;
        const angle = noise(this.x * scale + t * 0.18, this.y * scale + t * 0.12) * Math.PI * 4;

        this.vx = this.vx * 0.88 + Math.cos(angle) * this.speed * 0.18;
        this.vy = this.vy * 0.88 + Math.sin(angle) * this.speed * 0.18;

        // ── Mouse vortex — the magic ──────────────────────────────────────────
        const mx = mouse.current.x, my = mouse.current.y;
        const dx = mx - this.x, dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = mouse.current.down ? 200 : 120;

        if (dist < radius && mx > 0) {
          const force = (1 - dist / radius) * (mouse.current.down ? 4.5 : 2.2);
          // Vortex: perpendicular to direction = orbital swirl
          const nx = dx / dist, ny = dy / dist;
          const tx = -ny, ty = nx; // tangent (perpendicular)
          this.vx += (tx * 0.7 + nx * 0.3) * force * 0.14;
          this.vy += (ty * 0.7 + ny * 0.3) * force * 0.14;
        }

        // Velocity limit
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 3.5) { this.vx = (this.vx / speed) * 3.5; this.vy = (this.vy / speed) * 3.5; }

        this.x += this.vx;
        this.y += this.vy;
        this.life += 0.004;

        if (this.life > this.maxLife || this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) {
          // Respawn at random edge
          const edge = Math.floor(Math.random() * 4);
          if      (edge === 0) { this.x = Math.random() * W; this.y = -5; }
          else if (edge === 1) { this.x = W + 5;              this.y = Math.random() * H; }
          else if (edge === 2) { this.x = Math.random() * W; this.y = H + 5; }
          else                 { this.x = -5;                 this.y = Math.random() * H; }
          this.px = this.x; this.py = this.y;
          this.vx = 0; this.vy = 0;
          this.life = 0;
          this.maxLife = 0.4 + Math.random() * 0.6;
          this.speed   = 0.4 + Math.random() * 1.0;
          this.size    = 0.6 + Math.random() * 1.4;
        }
      }
      draw(ctx: CanvasRenderingContext2D) {
        const lifePct = this.life / this.maxLife;
        const alpha   = Math.sin(lifePct * Math.PI) * 0.85;
        if (alpha < 0.01) return;

        let color;
        if      (this.type === "coral") color = `rgba(242,92,67,${alpha * 0.75})`;
        else if (this.type === "navy")  color = `rgba(26,40,72,${alpha * 1.1})`;
        else                            color = `rgba(255,255,255,${alpha * 0.55})`;

        // Line trail
        const dx = this.x - this.px, dy = this.y - this.py;
        const trailLen = Math.sqrt(dx*dx + dy*dy);
        if (trailLen > 0.3) {
          ctx.beginPath();
          ctx.moveTo(this.px, this.py);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = color;
          ctx.lineWidth   = this.size * (0.4 + trailLen * 0.06);
          ctx.stroke();
        }

        // Dot at head
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: COUNT }, () => new Particle());

    // ── Background fade layer ─────────────────────────────────────────────────
    // We use a semi-transparent rect each frame instead of clearRect
    // to get motion trails without full persistence
    let t = 0;

    const draw = () => {
      t += 0.008;

      // Fade background — trail length controlled by alpha
      ctx.fillStyle = "rgba(3,3,3,0.22)";
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.018)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 72) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 72) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Mouse vortex glow ring
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

        // Crisp ring
        ctx.beginPath();
        ctx.arc(mx, my, mouse.current.down ? 16 : 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(242,92,67,${mouse.current.down ? 0.7 : 0.4})`;
        ctx.lineWidth = mouse.current.down ? 1.5 : 1;
        ctx.stroke();
      }

      // Update + draw particles
      particles.forEach(p => { p.update(t); p.draw(ctx); });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rx = 0, ry = 0, raf: number;
    const onMove = (e: MouseEvent) => {
      if (dot.current) dot.current.style.transform = `translate(${e.clientX-4}px,${e.clientY-4}px)`;
      rx += (e.clientX - rx) * 0.12; ry += (e.clientY - ry) * 0.12;
    };
    window.addEventListener("mousemove", onMove);
    const lerp = () => { if (ring.current) ring.current.style.transform = `translate(${rx-18}px,${ry-18}px)`; raf = requestAnimationFrame(lerp); };
    lerp();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="c-c">
      <div ref={dot}  style={{ position:"fixed",top:0,left:0,width:8,height:8,background:"#F25C43",borderRadius:"50%",pointerEvents:"none",zIndex:9999,mixBlendMode:"difference" }} />
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:36,height:36,border:"1px solid rgba(242,92,67,0.4)",borderRadius:"50%",pointerEvents:"none",zIndex:9998 }} />
    </div>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
const TICKERS = ["NEXT.JS ARCHITECTURE","SUB-SECOND LATENCY","WEBGL INTERFACES","THREE.JS RENDERING","ASYNC EXECUTION","FRAMER MOTION","HEADLESS COMMERCE","SAAS FRONTENDS","AGENCY WHITE-LABEL","CORE WEB VITALS: 100"];
function Ticker() {
  const items = [...TICKERS,...TICKERS];
  return (
    <div style={{ position:"absolute",bottom:0,left:0,right:0,borderTop:"1px solid rgba(255,255,255,0.06)",background:"rgba(3,3,3,0.92)",backdropFilter:"blur(8px)",height:44,overflow:"hidden",zIndex:10,display:"flex",alignItems:"center" }}>
      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:80,background:"linear-gradient(to right,#030303,transparent)",zIndex:1,pointerEvents:"none" }} />
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:80,background:"linear-gradient(to left,#030303,transparent)",zIndex:1,pointerEvents:"none" }} />
      <div style={{ display:"flex",animation:"tickerScroll 42s linear infinite",whiteSpace:"nowrap" }}>
            {items.map((item,i) => (
          <span key={i} style={{ fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.25em",paddingRight:48,
            color: i%2===0 ? "rgba(255,255,255,0.25)" : (Math.floor(i/2)%2===0 ? "#F25C43" : "rgba(26,40,72,0.85)") }}>
            {i%2===0 ? item : "◆"}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const line1 = useScramble("ENGINEERING", 300);
  const line2 = useScramble("DIGITAL",     900);
  const line3 = useScramble("INFRASTRUCTURE.", 1400);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 92, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @media (pointer:fine) { .hero-s,.hero-s * { cursor:none !important; } }
        @media (pointer:coarse) { .c-c { display:none; } }

        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanPx  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes hintPulse { 0%,100%{opacity:0} 30%,70%{opacity:1} }

        .hero-s {
          position:relative; min-height:100svh; background:#030303; overflow:hidden;
          display:flex; flex-direction:column; justify-content:center;
          padding:0 6vw; padding-top:80px; padding-bottom:44px;
        }

        .hero-logo {
          height:clamp(36px,4.2vw,52px);
          width:auto; display:block;
          margin-bottom:clamp(24px,3vw,36px);
          position:relative; z-index:5;
          opacity:0; animation:fadeUp 0.7s ease forwards 0.05s;
          object-fit:contain; object-position:left center;
        }

        /* Subtle horizontal scanline sweep */
        .scan-px {
          position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(to right,transparent,rgba(242,92,67,0.3),transparent);
          animation:scanPx 6s linear infinite; pointer-events:none; z-index:2;
        }

        .hl {
          font-family:var(--font-display); font-size:clamp(3.8rem,11vw,12.5rem);
          line-height:0.88; letter-spacing:0.01em; color:#fff;
          margin-bottom:44px; position:relative; z-index:5; text-transform:uppercase;
        }
        .hl-label {
          font-family:var(--font-mono); font-size:clamp(0.7rem,2.4vw,1.35rem);
          letter-spacing:0.3em; display:block; margin-bottom:0.1em; color:#F25C43;
        }
        .hl-stroke { display:block; -webkit-text-stroke:2px rgba(255,255,255,0.55); color:transparent; filter: drop-shadow(0 0 28px rgba(242,92,67,0.18)); }

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
          font-family:var(--font-sans); font-size:clamp(0.9375rem,1.5vw,1.0625rem);
          font-weight:300; line-height:1.82; color:rgba(255,255,255,0.62); letter-spacing:0.02em;
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
          transition:box-shadow 0.4s;
          box-shadow:0 0 28px rgba(242,92,67,0.2);
          clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%);
        }
        .btn-ph:hover { box-shadow:0 0 56px rgba(242,92,67,0.5); }
        .btn-ph::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0.15); transform:translateX(-101%); transition:transform 0.4s cubic-bezier(0.76,0,0.24,1); }
        .btn-ph:hover::after { transform:translateX(0); }
        .btn-gh {
          height:52px; padding:0 28px; background:transparent;
          border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.55);
          font-family:var(--font-mono); font-size:11px; letter-spacing:0.2em;
          text-transform:uppercase; cursor:none; transition:all 0.3s;
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

        /* Mouse interaction hint — fades in then out */
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
          .side-stats{display:none}
          .sprint-lbl{display:none}
          .hl{font-size:clamp(2.8rem,10vw,8rem)}
        }
        @media (max-width:640px) {
          .side-stats{
            display:flex !important;
            position:static; transform:none;
            flex-direction:row; gap:0;
            margin-top:clamp(20px,6vw,32px);
            border-top:1px solid rgba(255,255,255,0.06);
            padding-top:clamp(16px,5vw,24px);
            opacity:0; animation:fadeUp 0.8s ease forwards 2.4s;
          }
          .si{ text-align:left; flex:1; padding-right:12px; }
          .si+.si{ border-left:1px solid rgba(255,255,255,0.06); padding-left:12px; padding-right:0; }
          .sn{ font-size:clamp(26px,9vw,38px); }
          .sl{ font-size:9px; letter-spacing:0.16em; }
          .ss{ display:none; }
        }
        @media (max-width:640px) {
          .hero-s{
            padding-left:5vw; padding-right:5vw;
            padding-top:clamp(68px,17vw,88px);
            padding-bottom:calc(44px + 64px);
            min-height:100svh;
          }
          .hero-logo{ height:clamp(28px,8.5vw,40px); margin-bottom:clamp(14px,4vw,22px); }
          .hl{ font-size:clamp(2.4rem,13.5vw,5rem); margin-bottom:clamp(18px,5vw,28px); }
          .hl-label{ font-size:clamp(0.6rem,3.2vw,0.85rem); letter-spacing:0.2em; margin-bottom:0.2em; }
          .sub-row{ gap:14px; margin-bottom:clamp(22px,6vw,32px); max-width:100%; }
          .sub-text{ font-size:clamp(0.82rem,3.6vw,0.94rem); line-height:1.72; }
          .sub-line{ height:52px; }
          .actions{ gap:10px; }
          .btn-ph{ height:48px; padding:0 20px; font-size:10px; }
          .btn-gh{ height:48px; padding:0 16px; font-size:10px; }
          .mouse-hint{display:none}
          .scan-px{display:none}
        }
        @media (max-width:380px) {
          .hl{ font-size:clamp(2rem,12.5vw,3.6rem); }
          .hero-logo{ height:clamp(24px,7vw,32px); }
          .btn-ph,.btn-gh{ width:100%; justify-content:center; }
          .actions{ flex-direction:column; align-items:stretch; gap:8px; }
        }
      `}</style>

      <Cursor />

      <section className="hero-s">
        {/* Flow field — the showpiece */}
        <FlowCanvas />

        <div className="scan-px" />

        {/* Navy corner gradient */}
        <div style={{ position:"absolute",top:0,right:0,width:"40%",height:"70%",background:"radial-gradient(ellipse at 100% 0%,rgba(26,40,72,0.22) 0%,transparent 65%)",pointerEvents:"none",zIndex:1 }} />

        {/* Logo */}
        <img
          className="hero-logo"
          src="/logo-trans.png"
          alt="Ahamed Web Studio"
          onError={e => { e.currentTarget.style.display = "none"; }}
        />

        {/* Headline */}
        <h1 className="hl">
          <span className="hl-label">{line1}</span>
          <span style={{ display:"block" }}>{line2}</span>
          <span className="hl-stroke">{line3}</span>
        </h1>

        {/* Sub copy */}
        <div className="sub-row">
          <div className="sub-line" />
          <p className="sub-text">
            The silent execution engine for global design agencies. We take the sites your clients are embarrassed by and rebuild them as world-class Next.js frontends — without the wait.
          </p>
        </div>

        {/* CTAs */}
        <div className="actions">
          <button className="btn-ph" onClick={() => scrollTo("#contact")}>
            Initialize Discovery
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button className="btn-gh" onClick={() => scrollTo("#portfolio")}>
            Explore The Vault
          </button>
          <span style={{ fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.2em",color:"rgba(255,255,255,0.26)",display:"flex",alignItems:"center",gap:12 }}>
            <span style={{ width:26,height:1,display:"inline-block",background:"linear-gradient(to right,#1A2848,rgba(242,92,67,0.35))" }} />
            100% ASYNC EXECUTION
          </span>
        </div>

        {/* Side stats */}
        <div className="side-stats">
          {[{n:"20",a:"+",l:"Projects Deployed"},{n:"<1",a:"s",l:"Load Time"},{n:"100",a:"",l:"PageSpeed"}].map((s,i) => (
            <div key={i} className="si">
              <div className="sn">{s.n}<span className="sa">{s.a}</span></div>
              <div className="sl">{s.l}</div>
              {i < 2 && <div className="ss" />}
            </div>
          ))}
        </div>

        {/* Mouse hint */}
        <div className="mouse-hint">
          <div style={{ width:6,height:6,borderRadius:"50%",background:"#F25C43",opacity:0.5 }} />
          Move cursor to interact
        </div>

        <div className="sprint-lbl">PROVISIONING · APR_2026_SPRINTS</div>

        <Ticker />
      </section>
    </>
  );
}