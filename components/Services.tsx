"use client";

import { useEffect, useRef, useState } from "react";

// ─── VISUAL 01: HEADLESS COMMERCE ─────────────────────────────────────────────
function CommerceVisual({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number, W: number, H: number, t = 0, frameCount = 0;

    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const nodes = [
      { x:0.15, y:0.35, label:"NEXT.JS\nFRONTEND", color:"#F25C43",           w:100, h:60 },
      { x:0.5,  y:0.25, label:"EDGE CDN",           color:"rgba(26,40,72,0.9)",w:80,  h:36 },
      { x:0.5,  y:0.55, label:"SANITY CMS",          color:"rgba(26,40,72,0.9)",w:80,  h:36 },
      { x:0.5,  y:0.75, label:"REST API",             color:"rgba(26,40,72,0.9)",w:80,  h:36 },
      { x:0.85, y:0.5,  label:"SHOPIFY\nBACKEND",    color:"rgba(26,40,72,0.85)",w:100,h:60 },
    ];

    class Packet {
      from: typeof nodes[0]; to: typeof nodes[0]; p: number; speed: number; color: string; size: number;
      constructor(fromIdx: number, toIdx: number, color: string) {
        this.from  = nodes[fromIdx]; this.to = nodes[toIdx];
        this.p     = 0;
        this.speed = 0.008 + Math.random() * 0.006;
        this.color = color;
        this.size  = 3 + Math.random() * 2;
      }
      update() { this.p = Math.min(1, this.p + this.speed); }
      draw(ctx: CanvasRenderingContext2D) {
        const x = (this.from.x + (this.to.x - this.from.x) * this.p) * W;
        const y = (this.from.y + (this.to.y - this.from.y) * this.p) * H;
        ctx.beginPath(); ctx.arc(x, y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 10;
        ctx.fill(); ctx.shadowBlur = 0;
      }
      done() { return this.p >= 1; }
    }

    let packets: Packet[] = [];
    const routes: [number, number, string][] = [
      [0,1,"rgba(242,92,67,0.9)"],[0,2,"rgba(242,92,67,0.7)"],[0,3,"rgba(242,92,67,0.5)"],
      [4,1,"rgba(26,40,72,0.8)"],[4,2,"rgba(26,40,72,0.8)"],
      [1,0,"rgba(255,255,255,0.4)"],[2,0,"rgba(255,255,255,0.3)"],
    ];

    const draw = () => {
      ctx.clearRect(0,0,W,H); t+=0.01; frameCount++;
      if (frameCount%18===0) { const r=routes[Math.floor(Math.random()*routes.length)]; packets.push(new Packet(r[0],r[1],r[2])); }
      packets = packets.filter(p=>!p.done());
      ctx.strokeStyle="rgba(255,255,255,0.02)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      [[0,1],[0,2],[0,3],[4,1],[4,2],[4,3]].forEach(([a,b])=>{
        ctx.beginPath(); ctx.moveTo(nodes[a].x*W,nodes[a].y*H); ctx.lineTo(nodes[b].x*W,nodes[b].y*H);
        ctx.strokeStyle="rgba(255,255,255,0.04)"; ctx.lineWidth=1; ctx.stroke();
      });
      nodes.forEach(n=>{
        const x=n.x*W-n.w/2, y=n.y*H-n.h/2, isMain=n.w===100;
        ctx.strokeStyle=isMain?"rgba(242,92,67,0.5)":"rgba(26,40,72,0.7)"; ctx.lineWidth=1; ctx.strokeRect(x,y,n.w,n.h);
        ctx.fillStyle=isMain?"rgba(242,92,67,0.06)":"rgba(26,40,72,0.18)"; ctx.fillRect(x,y,n.w,n.h);
        ctx.fillStyle=isMain?"#F25C43":"rgba(255,255,255,0.45)";
        ctx.font=`${9*(W/800+0.3)}px monospace`; ctx.textAlign="center";
        n.label.split("\n").forEach((l,i,arr)=>ctx.fillText(l,n.x*W,n.y*H+(i-(arr.length-1)/2)*13+4));
      });
      ctx.fillStyle="rgba(242,92,67,0.7)"; ctx.font="bold 11px monospace"; ctx.textAlign="center";
      ctx.fillText("0.8s TTI",W*0.5,H*0.1);
      ctx.fillStyle="rgba(255,255,255,0.2)"; ctx.font="9px monospace";
      ctx.fillText("DECOUPLED ARCHITECTURE",W*0.5,H*0.9);
      packets.forEach(p=>{p.update();p.draw(ctx);});
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, [active]);

  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%" }} />;
}

// ─── VISUAL 02: PRECISION FRONTEND CRAFT ─────────────────────────────────────
// What premium design looks like — live type scale, palette, and component anatomy
function CraftVisual({ active }: { active: boolean }) {
  const [step, setStep]   = useState(0); // 0=palette, 1=type, 2=component
  const [typed, setTyped] = useState("");
  const [barOn, setBarOn] = useState(false);
  const DEMO_TEXT = "Premium interfaces built to the pixel.";

  // Cycle through demo steps
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setStep(s => (s+1)%3), 3500);
    return () => clearInterval(iv);
  }, [active]);

  // Typewriter for type demo
  useEffect(() => {
    if (step !== 1) { setTyped(""); return; }
    let i = 0;
    const iv = setInterval(() => {
      setTyped(DEMO_TEXT.slice(0, i));
      i++;
      if (i > DEMO_TEXT.length) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [step]);

  // Bar animation for component demo
  useEffect(() => {
    if (step !== 2) { setBarOn(false); return; }
    const t = setTimeout(() => setBarOn(true), 100);
    return () => clearTimeout(t);
  }, [step]);

  const PALETTE = [
    { hex:"#F25C43", name:"CORAL",  role:"Primary / CTA" },
    { hex:"#1A2848", name:"NAVY",   role:"Depth / Trust" },
    { hex:"#FAF9F6", name:"CREAM",  role:"Background" },
    { hex:"#C8A96E", name:"GOLD",   role:"Premium Accent" },
    { hex:"#030303", name:"ONYX",   role:"Dark Mode Base" },
  ];

  const TYPE_SCALE = [
    { size:48, weight:400, font:"var(--font-display)", sample:"Display", tag:"BEBAS NEUE" },
    { size:24, weight:300, font:"var(--font-sans)",    sample:"Heading",  tag:"DM SANS 300" },
    { size:14, weight:300, font:"var(--font-sans)",    sample:"Body copy — readable, weighted right.", tag:"DM SANS 300" },
    { size:10, weight:400, font:"var(--font-mono)",    sample:"MONO LABEL // SYSTEM",  tag:"DM MONO" },
  ];

  const COMPONENTS = [
    { label:"Chamfered CTA", fill:"#F25C43", text:"#000", score:100 },
    { label:"Ghost Button",  fill:"transparent", text:"rgba(255,255,255,0.65)", score:94, border:true },
    { label:"Tag Badge",     fill:"rgba(242,92,67,0.07)", text:"#F25C43", score:88, tag:true },
    { label:"Progress Bar",  fill:null, score:100, bar:true },
  ];

  return (
    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", padding:"28px 32px", gap:0 }}>

      {/* Step tabs */}
      <div style={{ display:"flex", gap:2, marginBottom:20 }}>
        {["PALETTE","TYPOGRAPHY","COMPONENTS"].map((label,i) => (
          <button key={label} onClick={() => setStep(i)} style={{
            all:"unset", cursor:"pointer",
            padding:"5px 14px",
            fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:"0.18em",
            color: step===i?"#F25C43":"rgba(255,255,255,0.3)",
            borderBottom: `1px solid ${step===i?"#F25C43":"rgba(255,255,255,0.08)"}`,
            transition:"color 0.3s, border-color 0.3s",
          }}>{label}</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:"#F25C43",animation:"blink 2s ease infinite" }} />
          <span style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.14em",color:"rgba(255,255,255,0.3)" }}>LIVE</span>
        </div>
      </div>

      {/* ── PALETTE STEP ── */}
      {step === 0 && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>
            BRAND_PALETTE // LOGO-DERIVED
          </div>
          <div style={{ display:"flex", gap:6, flex:1 }}>
            {PALETTE.map(p => (
              <div key={p.hex} style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ flex:1, background:p.hex, border:`1px solid rgba(255,255,255,0.08)`, minHeight:80, position:"relative", overflow:"hidden" }}>
                  {/* Shimmer */}
                  <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 60%)" }} />
                </div>
                <div style={{ fontFamily:"var(--font-mono)",fontSize:8,color:"#fff",letterSpacing:"0.08em" }}>{p.name}</div>
                <div style={{ fontFamily:"var(--font-mono)",fontSize:7,color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em",lineHeight:1.6 }}>
                  {p.hex}<br/>{p.role}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.16em",color:"rgba(255,255,255,0.25)",marginTop:8 }}>
            EVERY PROJECT SHIPS WITH A CUSTOM TOKEN SYSTEM
          </div>
        </div>
      )}

      {/* ── TYPOGRAPHY STEP ── */}
      {step === 1 && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>
            TYPE_SYSTEM // HIERARCHY
          </div>
          {TYPE_SCALE.map((ts, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"baseline", justifyContent:"space-between",
              paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.04)",
              opacity: step===1 ? 1 : 0,
              transform: step===1 ? "translateY(0)" : "translateY(6px)",
              transition: `opacity 0.4s ease ${i*0.08}s, transform 0.4s ease ${i*0.08}s`,
            }}>
              <span style={{ fontFamily:ts.font, fontSize:ts.size, fontWeight:ts.weight, color:"#fff", lineHeight:1, flex:1 }}>
                {i===1 && typed.length > 0 ? typed : ts.sample}
                {i===1 && typed.length < DEMO_TEXT.length && <span style={{ animation:"blink 0.8s step-end infinite", color:"#F25C43" }}>|</span>}
              </span>
              <span style={{ fontFamily:"var(--font-mono)",fontSize:8,color:"rgba(255,255,255,0.28)",letterSpacing:"0.12em",flexShrink:0,marginLeft:12 }}>{ts.tag}</span>
            </div>
          ))}
          <div style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.16em",color:"rgba(255,255,255,0.25)",marginTop:"auto" }}>
            TYPOGRAPHIC CHOICES THAT COMMUNICATE BRAND INTENT
          </div>
        </div>
      )}

      {/* ── COMPONENTS STEP ── */}
      {step === 2 && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",marginBottom:4 }}>
            COMPONENT_ANATOMY // DESIGN_SYSTEM
          </div>
          {COMPONENTS.map((c, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
              opacity: barOn ? 1 : 0,
              transform: barOn ? "translateX(0)" : "translateX(-8px)",
              transition: `opacity 0.4s ease ${i*0.1}s, transform 0.4s ease ${i*0.1}s`,
            }}>
              {/* Component preview */}
              <div style={{
                padding: c.bar ? "0" : "7px 18px",
                background: c.fill || "transparent",
                border: c.border ? "1px solid rgba(255,255,255,0.15)" : c.tag ? "1px solid rgba(242,92,67,0.3)" : "none",
                fontFamily:"var(--font-mono)", fontSize:10, color:c.text,
                letterSpacing:"0.14em", textTransform:"uppercase",
                clipPath: !c.bar && !c.tag ? "polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)" : "none",
                minWidth:160, display:"flex", alignItems:"center", justifyContent:"center",
                height: c.bar ? 12 : "auto",
                overflow: c.bar ? "hidden" : "visible",
                flexShrink:0,
              }}>
                {c.bar ? (
                  <div style={{ position:"relative",width:"100%",height:"100%",background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ position:"absolute",top:0,left:0,bottom:0,width: barOn?"100%":"0%",background:"linear-gradient(to right,#1A2848,#F25C43)",transition:"width 1.4s cubic-bezier(0.76,0,0.24,1) 0.4s" }} />
                  </div>
                ) : c.label}
              </div>

              {/* Label + score */}
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"var(--font-mono)",fontSize:8,color:"rgba(255,255,255,0.35)",letterSpacing:"0.12em",marginBottom:3 }}>{c.label}</div>
                <div style={{ height:1,background:"rgba(255,255,255,0.05)",overflow:"hidden" }}>
                  <div style={{ height:"100%",width: barOn?`${c.score}%`:"0%",background:`rgba(242,92,67,${0.3+i*0.1})`,transition:`width 1s ease ${i*0.12+0.1}s` }} />
                </div>
              </div>
              <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:"#F25C43",letterSpacing:"0.1em",flexShrink:0 }}>{c.score}/100</div>
            </div>
          ))}
          <div style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.16em",color:"rgba(255,255,255,0.25)",marginTop:"auto" }}>
            EVERY COMPONENT TESTED. EVERY TOKEN INTENTIONAL.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISUAL 03: ASYNC EXECUTION ───────────────────────────────────────────────
function AsyncVisual({ active }: { active: boolean }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(iv); }, []);

  const getClockData = (offsetHours: number) => {
    const h=(time.getUTCHours()+offsetHours+24)%24, m=time.getMinutes(), s=time.getSeconds();
    return { h,m,s, hDeg:(h%12)*30+m*0.5, mDeg:m*6+s*0.1, sDeg:s*6,
      display:`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}` };
  };
  const london=getClockData(0), colombo=getClockData(5);

  type ClockData = { h: number; m: number; s: number; hDeg: number; mDeg: number; sDeg: number; display: string };
  const Clock = ({ data, city, tz, asleep }: { data: ClockData; city: string; tz: string; asleep: boolean }) => {
    const size=110, r=size/2-8;
    return (
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:18 }}>
        <div style={{ width:size,height:size,borderRadius:"50%",position:"relative",border:`1px solid ${asleep?"rgba(26,40,72,0.5)":"rgba(242,92,67,0.6)"}`,background:asleep?"rgba(26,40,72,0.07)":"rgba(242,92,67,0.05)",boxShadow:asleep?"none":"0 0 60px rgba(242,92,67,0.15)",flexShrink:0 }}>
          {Array.from({length:12}).map((_,i)=>{
            const a=(i*30-90)*Math.PI/180,isMaj=i%3===0,d=r-(isMaj?5:9);
            return <div key={i} style={{ position:"absolute",borderRadius:isMaj?"0":"50%",width:isMaj?1:2,height:isMaj?8:2,background:asleep?`rgba(26,40,72,${isMaj?0.9:0.6})`:`rgba(242,92,67,${isMaj?0.8:0.4})`,top:"50%",left:"50%",transform:`translate(-50%,-${d+(isMaj?4:1)}px) rotate(${i*30}deg)`,transformOrigin:`50% ${d+(isMaj?4:1)}px` }} />;
          })}
          <div style={{ position:"absolute",bottom:"50%",left:"50%",width:2,height:r*0.55,background:asleep?"rgba(26,40,72,0.85)":"#F25C43",transformOrigin:"bottom center",transform:`translateX(-50%) rotate(${data.hDeg}deg)`,borderRadius:"2px 2px 0 0",boxShadow:asleep?"none":"0 0 6px #F25C43" }} />
          <div style={{ position:"absolute",bottom:"50%",left:"50%",width:1.5,height:r*0.75,background:asleep?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.7)",transformOrigin:"bottom center",transform:`translateX(-50%) rotate(${data.mDeg}deg)`,borderRadius:"2px 2px 0 0" }} />
          <div style={{ position:"absolute",bottom:"50%",left:"50%",width:1,height:r*0.82,background:asleep?"transparent":"rgba(242,92,67,0.6)",transformOrigin:"bottom center",transform:`translateX(-50%) rotate(${data.sDeg}deg)`,borderRadius:1,transition:"transform 0.1s linear" }} />
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:8,height:8,borderRadius:"50%",background:asleep?"rgba(26,40,72,0.9)":"#F25C43",boxShadow:asleep?"none":"0 0 10px #F25C43",zIndex:2 }} />
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",color:asleep?"rgba(255,255,255,0.5)":"#F25C43",marginBottom:5 }}>{city}</div>
          <div style={{ fontFamily:"var(--font-display)",fontSize:"clamp(20px,4vw,28px)",color:asleep?"rgba(255,255,255,0.5)":"#fff",lineHeight:1,marginBottom:5 }}>{data.display}</div>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.16em",color:asleep?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.6)",marginBottom:5 }}>{tz}</div>
          <div style={{ display:"inline-block",padding:"3px 10px",border:`1px solid ${asleep?"rgba(26,40,72,0.4)":"rgba(242,92,67,0.3)"}`,background:asleep?"rgba(26,40,72,0.1)":"rgba(242,92,67,0.06)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.14em",color:asleep?"rgba(255,255,255,0.45)":"#F25C43" }}>
            {asleep ? "💤  ASLEEP" : "⚡  BUILDING"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"clamp(16px,4vw,40px)",padding:"clamp(16px,4vw,32px) clamp(12px,4vw,40px)",overflow:"hidden" }}>
      <div style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.25em",color:"rgba(255,255,255,0.5)" }}>ASYNC_ENGINE // TIMEZONE_ADVANTAGE</div>
      <div style={{ display:"flex",alignItems:"center",gap:"clamp(14px,3vw,40px)",flexWrap:"wrap",justifyContent:"center" }}>
        <Clock data={london}  city="LONDON, UK"  tz="UTC+0"    asleep={true}  />
        <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
          <div style={{ width:1,height:24,background:"linear-gradient(to bottom,transparent,rgba(242,92,67,0.4))" }} />
          <div style={{ padding:"8px 14px",textAlign:"center",border:"1px solid rgba(242,92,67,0.25)",background:"rgba(242,92,67,0.05)",fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.14em",color:"#F25C43",lineHeight:2 }}>BRIEF<br/>→<br/>STAGING</div>
          <div style={{ width:1,height:24,background:"linear-gradient(to bottom,rgba(242,92,67,0.4),transparent)" }} />
        </div>
        <Clock data={colombo} city="COLOMBO, LK" tz="UTC+5:30" asleep={false} />
      </div>
      <div style={{ fontFamily:"var(--font-sans)",fontSize:"clamp(11px,2.5vw,13px)",fontWeight:300,color:"rgba(255,255,255,0.65)",textAlign:"center",lineHeight:1.8 }}>
        Brief at end of your day.<br/>Live staging before your morning coffee.
      </div>
    </div>
  );
}

// ─── VISUAL 04: PERFORMANCE ───────────────────────────────────────────────────
function PerformanceVisual({ active }: { active: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setOn(true), 150);
    return () => { clearTimeout(t); setOn(false); };
  }, [active]);

  const cwv = [
    { key:"LCP",full:"Largest Contentful Paint",value:"0.8s",score:98, good:"< 2.5s" },
    { key:"FID",full:"First Input Delay",        value:"0ms", score:100,good:"< 100ms"},
    { key:"CLS",full:"Cumulative Layout Shift",  value:"0.00",score:100,good:"< 0.1"  },
    { key:"TTI",full:"Time to Interactive",       value:"0.6s",score:96, good:"< 3.8s" },
    { key:"FCP",full:"First Contentful Paint",   value:"0.5s",score:100,good:"< 1.8s" },
    { key:"TBT",full:"Total Blocking Time",      value:"0ms", score:100,good:"< 200ms"},
  ];

  return (
    <div style={{ position:"absolute",inset:0,padding:"32px 40px",display:"flex",flexDirection:"column",gap:24,justifyContent:"center" }}>
      <div style={{ display:"flex",alignItems:"center",gap:28 }}>
        <div style={{ width:96,height:96,borderRadius:"50%",flexShrink:0,border:"2px solid #F25C43",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(242,92,67,0.06)",boxShadow:"0 0 60px rgba(242,92,67,0.2), inset 0 0 40px rgba(242,92,67,0.04)" }}>
          <span style={{ fontFamily:"var(--font-display)",fontSize:44,color:"#F25C43",lineHeight:1 }}>100</span>
        </div>
        <div>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:"0.22em",marginBottom:8 }}>PAGESPEED INSIGHTS</div>
          <div style={{ fontFamily:"var(--font-display)",fontSize:32,color:"#fff",letterSpacing:"0.04em",lineHeight:1,marginBottom:6 }}>PERFECT SCORE</div>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:"0.16em" }}>GUARANTEED ON EVERY PROJECT</div>
        </div>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
        {cwv.map((m,i) => (
          <div key={m.key}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:7 }}>
              <div style={{ display:"flex",alignItems:"baseline",gap:10 }}>
                <span style={{ fontFamily:"var(--font-mono)",fontSize:11,color:"#F25C43",letterSpacing:"0.1em",minWidth:32 }}>{m.key}</span>
                <span style={{ fontFamily:"var(--font-sans)",fontSize:11,fontWeight:300,color:"rgba(255,255,255,0.5)" }}>{m.full}</span>
              </div>
              <div style={{ display:"flex",alignItems:"baseline",gap:8 }}>
                <span style={{ fontFamily:"var(--font-display)",fontSize:22,color:"#fff" }}>{m.value}</span>
                <span style={{ fontFamily:"var(--font-mono)",fontSize:8,color:"rgba(255,255,255,0.45)",letterSpacing:"0.1em" }}>GOOD {m.good}</span>
              </div>
            </div>
            <div style={{ height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden" }}>
              <div style={{ height:"100%",width:on?`${m.score}%`:"0%",background:"linear-gradient(to right,#1A2848,#F25C43)",transition:`width 1.6s cubic-bezier(0.76,0,0.24,1) ${i*0.1}s`,boxShadow:"2px 0 12px rgba(242,92,67,0.5)",borderRadius:2 }} />
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
    id:"01", tag:"COMMERCE",
    title:"Headless Commerce\nEngines",
    short:"WooCommerce → Next.js",
    body:"We take slow WordPress stores and rebuild them as decoupled Next.js storefronts. Same products, same backend, unrecognisable performance.",
    detail:"Every store ships with 90+ PageSpeed. Clients stop losing customers to load times they didn't know they had.",
    metric:"0.8s LCP",
    Visual: CommerceVisual,
  },
  {
    id:"02", tag:"CRAFT",
    title:"Precision\nFrontend Craft",
    short:"Design Systems / Editorial / Brand",
    body:"Pixel-precise interfaces built from real design systems — custom palettes, typographic hierarchies, and components that behave exactly as intended. Not templates.",
    detail:"Taste is a technical skill. Every colour token, every spacing decision, every animation has a reason. Clients feel it even if they can't name it.",
    metric:"PIXEL PERFECT",
    Visual: CraftVisual,
  },
  {
    id:"03", tag:"ASYNC",
    title:"Agency\nExecution",
    short:"White-label. No delays.",
    body:"100% white-label. Send the site your client is embarrassed by. We rebuild it to the standard they deserve. Your client thinks you did it. Everyone wins.",
    detail:"UK end of day. Colombo midnight. Your staging link is live before your team's morning standup.",
    metric:"DIRECT-TO-DEV",
    Visual: AsyncVisual,
  },
  {
    id:"04", tag:"PERFORMANCE",
    title:"Core Web\nVitals Architecture",
    short:"100/100 PageSpeed. Guaranteed.",
    body:"Raw code engineered for perfect Core Web Vitals. Zero templates, zero legacy overhead. The score that wins pitches before the client reads the proposal.",
    detail:"Every project ships with a PageSpeed guarantee. We don't hand over until the numbers prove it.",
    metric:"100/100 CWV",
    Visual: PerformanceVisual,
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Services() {
  const ref     = useRef(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      setTimeout(() => { setActive(p => (p+1)%CAPS.length); setTrans(false); }, 260);
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
          display:flex; align-items:flex-start; gap:14px;
          padding:20px 22px; cursor:pointer;
          border-left:2px solid transparent;
          position:relative; overflow:hidden;
          transition:border-left-color 0.3s, background 0.3s;
          border-bottom:1px solid rgba(255,255,255,0.04);
        }
        .cap-row.active       { border-left-color:#F25C43; background:rgba(242,92,67,0.04); }
        .cap-row:not(.active):hover { background:rgba(255,255,255,0.015); border-left-color:rgba(26,40,72,0.6); }
        .cap-num { font-family:var(--font-mono); font-size:12px; letter-spacing:0.14em; line-height:1; margin-top:2px; flex-shrink:0; transition:color 0.3s; }
        .cap-row.active       .cap-num { color:#F25C43; }
        .cap-row:not(.active) .cap-num { color:rgba(255,255,255,0.4); }
        .cap-name { font-family:var(--font-display); font-size:20px; letter-spacing:0.04em; line-height:1.05; white-space:pre-line; transition:color 0.3s; }
        .cap-row.active       .cap-name { color:#fff; }
        .cap-row:not(.active) .cap-name { color:rgba(255,255,255,0.55); }

        /* ── Mobile: horizontal tab strip ── */
        @media (max-width:960px) {
          .svc-layout { grid-template-columns:1fr !important; }
          .svc-sidebar { flex-direction:row !important; overflow-x:auto !important; overflow-y:hidden !important; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
          .svc-sidebar::-webkit-scrollbar { display:none; }
          .svc-sidebar-header { display:none !important; }
          .svc-sidebar-footer { display:none !important; }
          .cap-row { flex-direction:column; align-items:flex-start; padding:14px 18px; min-width:160px; border-left:none !important; border-bottom:none !important; border-top:2px solid transparent; flex-shrink:0; }
          .cap-row.active       { border-top-color:#F25C43 !important; background:rgba(242,92,67,0.05); }
          .cap-row:not(.active):hover { border-top-color:rgba(26,40,72,0.6) !important; }
          .cap-row svg { display:none; }
          .cap-num { font-size:10px; }
          .cap-name { font-size:15px; white-space:nowrap; }
          .svc-visual-wrap { min-height:380px !important; }
        }
        @media (max-width:640px) {
          .svc-visual-wrap { min-height:340px !important; }
          .cap-name { font-size:13px; }
          .cap-row  { min-width:130px; padding:12px 14px; }
          .svc-copy-strip { grid-template-columns:1fr !important; }
          .svc-copy-strip .metric-badge { align-self:flex-start; }
        }
      `}</style>

      <section
        id="services"
        ref={ref}
        style={{ background:"#030303", padding:"100px 6vw", borderTop:"1px solid rgba(255,255,255,0.04)", position:"relative", overflow:"hidden" }}
      >
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,0.01) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.01) 1px,transparent 1px)",backgroundSize:"64px 64px" }} />
        <div style={{ position:"absolute",bottom:"-5%",right:"5%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,40,72,0.25) 0%,transparent 70%)",pointerEvents:"none",animation:"navyBreath 9s ease-in-out infinite" }} />

        {/* Header */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:60,flexWrap:"wrap",gap:20,opacity:entered?1:0,transform:entered?"none":"translateY(20px)",transition:"opacity 0.7s ease,transform 0.7s ease" }}>
          <div>
            <div style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.3em",color:"#F25C43",marginBottom:16,display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ width:5,height:5,background:"#F25C43",borderRadius:"50%",display:"inline-block" }} />
              VERIFIED_CAPABILITIES // SYSTEM_INFRASTRUCTURE
            </div>
            <h2 style={{ fontFamily:"var(--font-display)",fontSize:"clamp(3rem,7vw,6rem)",color:"#fff",lineHeight:0.95,textTransform:"uppercase" }}>
              System<br/>
              <span style={{ WebkitTextStroke:"2px rgba(255,255,255,0.7)",color:"transparent",filter:"drop-shadow(0 0 18px rgba(255,255,255,0.12))" }}>Infrastructure.</span>
            </h2>
          </div>
          <div style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",color:"rgba(255,255,255,0.28)",textAlign:"right",lineHeight:2,maxWidth:180 }}>
            Engineered<br/>for scale.<br/>Sub-second<br/>latency.<br/>Always.
          </div>
        </div>

        {/* Master-detail */}
        <div className="svc-layout" style={{ display:"grid",gridTemplateColumns:"300px 1fr",gap:2,opacity:entered?1:0,transition:"opacity 0.7s ease 0.2s" }}>

          {/* LEFT — chapter list / mobile: horizontal strip */}
          <div className="svc-sidebar" style={{ background:"#0A0A0A",border:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column" }}>
            <div className="svc-sidebar-header" style={{ padding:"13px 22px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(26,40,72,0.1)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.22em",color:"rgba(255,255,255,0.25)" }}>
              CAPABILITY_INDEX // {CAPS.length} MODULES
            </div>

            {CAPS.map((c,i) => (
              <div key={c.id} className={`cap-row${active===i?" active":""}`} onClick={()=>goTo(i)}>
                <span className="cap-num">{c.id}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.18em",color:active===i?"#F25C43":"rgba(255,255,255,0.2)",marginBottom:4,transition:"color 0.3s" }}>{c.tag}</div>
                  <div className="cap-name">{c.title}</div>
                  <div style={{ fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.1em",color:"rgba(255,255,255,0.22)",marginTop:4 }}>{c.short}</div>
                </div>
                {active===i && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F25C43" strokeWidth="2" style={{ flexShrink:0,marginTop:4 }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </div>
            ))}

            <div className="svc-sidebar-footer" style={{ marginTop:"auto",padding:"16px 22px",borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ height:1,background:"rgba(255,255,255,0.06)",marginBottom:12,overflow:"hidden" }}>
                <div key={active} style={{ height:"100%",background:"linear-gradient(to right,#1A2848,#F25C43)",animation:"barFill 5.5s linear forwards" }} />
              </div>
              <div style={{ display:"flex",gap:6 }}>
                {CAPS.map((_,i) => (
                  <button key={i} onClick={()=>goTo(i)} style={{ all:"unset",cursor:"pointer",width:active===i?22:6,height:2,background:active===i?"#F25C43":"rgba(26,40,72,0.6)",transition:"width 0.4s cubic-bezier(0.76,0,0.24,1),background 0.3s",boxShadow:active===i?"0 0 6px rgba(242,92,67,0.4)":"none" }} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — visual + copy */}
          <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
            <div className="svc-visual-wrap" style={{ flex:1,minHeight:520,background:"#0A0A0A",border:"1px solid rgba(255,255,255,0.06)",borderTop:"1px solid rgba(26,40,72,0.5)",position:"relative",overflow:"hidden",opacity:trans?0:1,transform:trans?"scale(0.985)":"scale(1)",transition:"opacity 0.24s ease,transform 0.24s ease" }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(to right,#1A2848,#F25C43,transparent)",zIndex:2 }} />
              <div style={{ position:"absolute",top:16,right:16,zIndex:10,display:"flex",alignItems:"center",gap:6,padding:"4px 10px",border:"1px solid rgba(242,92,67,0.22)",background:"rgba(3,3,3,0.7)",backdropFilter:"blur(8px)",fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.18em",color:"#F25C43" }}>
                <span style={{ width:4,height:4,borderRadius:"50%",background:"#F25C43",animation:"blink 2s ease infinite",display:"inline-block" }} />
                {cap.tag}
              </div>
              <cap.Visual active={!trans} />
            </div>

            <div className="svc-copy-strip" style={{ background:"#0A0A0A",border:"1px solid rgba(255,255,255,0.06)",padding:"22px 28px",display:"grid",gridTemplateColumns:"1fr auto",gap:24,alignItems:"start",opacity:trans?0:1,transform:trans?"translateY(5px)":"translateY(0)",transition:"opacity 0.24s ease,transform 0.24s ease" }}>
              <div>
                <p style={{ fontFamily:"var(--font-sans)",fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.72)",lineHeight:1.8,marginBottom:10 }}>{cap.body}</p>
                <p style={{ fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.12em",color:"rgba(255,255,255,0.5)",lineHeight:1.7 }}>→ {cap.detail}</p>
              </div>
              <div className="metric-badge" style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 16px",flexShrink:0,border:"1px solid rgba(242,92,67,0.2)",background:"rgba(242,92,67,0.04)",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"#F25C43",whiteSpace:"nowrap" }}>
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