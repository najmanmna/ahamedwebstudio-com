"use client";

import { useEffect, useRef, useState } from "react";

// ─── SIGNAL MAP ───────────────────────────────────────────────────────────────
type Pulse = { id: number; from: { x: number; y: number; label: string; active: boolean }; to: { x: number; y: number; label: string; active: boolean }; progress: number };
function SignalMap() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [tick, setTick]     = useState(0);

  const nodes = [
    { x:18, y:35, label:"LK", active:true  },
    { x:48, y:22, label:"UK", active:false },
    { x:62, y:28, label:"AE", active:false },
    { x:15, y:30, label:"ES", active:false },
    { x:55, y:18, label:"PK", active:false },
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t+1);
      const target = nodes[1 + Math.floor(Math.random() * (nodes.length-1))];
      setPulses(prev => [...prev.slice(-4), { id:Date.now(), from:nodes[0], to:target, progress:0 }]);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setPulses(prev => prev.map(p=>({...p,progress:p.progress+3})).filter(p=>p.progress<100));
    });
    return () => cancelAnimationFrame(raf);
  }, [tick]);

  return (
    <div style={{ position:"relative", width:"100%", height:140 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
        {Array.from({length:10}).map((_,i)=><line key={`h${i}`} x1="0" y1={i*6} x2="100" y2={i*6} stroke="rgba(255,255,255,0.02)" strokeWidth="0.3"/>)}
        {Array.from({length:17}).map((_,i)=><line key={`v${i}`} x1={i*6.25} y1="0" x2={i*6.25} y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3"/>)}
        {pulses.map(p=>{
          const x=p.from.x+(p.to.x-p.from.x)*(p.progress/100);
          const y=p.from.y+(p.to.y-p.from.y)*(p.progress/100);
          return <g key={p.id}><line x1={p.from.x} y1={p.from.y} x2={p.to.x} y2={p.to.y} stroke="rgba(242,92,67,0.1)" strokeWidth="0.4" strokeDasharray="2 2"/><circle cx={x} cy={y} r="1.2" fill="#F25C43" style={{filter:"drop-shadow(0 0 2px #F25C43)"}}/></g>;
        })}
        {nodes.map(n=>(
          <g key={n.label}>
            {n.active && <circle cx={n.x} cy={n.y} r="4" fill="none" stroke="rgba(242,92,67,0.15)" strokeWidth="0.5"><animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite"/></circle>}
            <circle cx={n.x} cy={n.y} r={n.active?2:1.2} fill={n.active?"#F25C43":"rgba(26,40,72,0.8)"} style={{filter:n.active?"drop-shadow(0 0 3px #F25C43)":"none"}}/>
            <text x={n.x+2.5} y={n.y-1.5} fontSize="3" fill={n.active?"#F25C43":"rgba(255,255,255,0.4)"} fontFamily="monospace">{n.label}</text>
          </g>
        ))}
      </svg>
      <div style={{position:"absolute",bottom:0,left:0,fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.18em",color:"rgba(255,255,255,0.4)"}}>
        TRANSMISSION_ROUTING // COLOMBO_LK → GLOBAL
      </div>
    </div>
  );
}

// ─── TRANSMISSION LOG ─────────────────────────────────────────────────────────
function TransmissionLog() {
  const ENTRIES = [
    { text:"SYS // INTAKE_FORM_INITIALIZED", ok:false },
    { text:"OK  // RESPONSE_SLA: 24H",        ok:true  },
    { text:"OK  // PIPELINE: ASYNC_EXEC",      ok:true  },
    { text:"SYS // NEXT_SPRINT: APR_2026",     ok:false },
    { text:"OK  // ENCRYPTION: ENABLED",       ok:true  },
  ];
  const [visible, setVisible] = useState<number[]>([]);
  useEffect(() => {
    const timers = ENTRIES.map((_,i) => setTimeout(()=>setVisible(p=>[...p,i]), 400+i*350));
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div style={{background:"#030303",border:"1px solid rgba(26,40,72,0.4)",borderLeft:"2px solid #1A2848",padding:"14px 18px",fontFamily:"var(--font-mono)",fontSize:9,lineHeight:2}}>
      <div style={{color:"rgba(255,255,255,0.35)",letterSpacing:"0.18em",marginBottom:8,paddingBottom:8,borderBottom:"1px solid rgba(26,40,72,0.3)",fontSize:8}}>SYSTEM_LOG // INTAKE_v2026</div>
      {ENTRIES.map((e,i)=>(
        <div key={i} style={{color:e.ok?"#F25C43":"rgba(255,255,255,0.55)",opacity:visible.includes(i)?1:0,transform:visible.includes(i)?"translateX(0)":"translateX(-8px)",transition:"opacity 0.3s ease,transform 0.3s ease",letterSpacing:"0.07em"}}>
          <span style={{color:e.ok?"rgba(100,140,220,0.85)":"rgba(255,255,255,0.25)",marginRight:8}}>›</span>{e.text}
        </div>
      ))}
    </div>
  );
}

// ─── TERMINAL INPUT ───────────────────────────────────────────────────────────
interface TerminalInputProps { label: string; error?: string | null; type?: string; placeholder?: string; rows?: number; value: string; onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>; onBlur?: () => void; [key: string]: unknown }
function TerminalInput({ label, error, type="text", placeholder, rows, value, onChange, onBlur, ...props }: TerminalInputProps) {
  const [focused, setFocused] = useState(false);
  const isTA = type === "textarea";
  const El   = isTA ? "textarea" : "input";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",color:focused?"#F25C43":"rgba(255,255,255,0.7)",textTransform:"uppercase",transition:"color 0.3s",fontWeight:400}}>{label}</span>
        {error && <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"#F25C43",letterSpacing:"0.1em"}}>⚠ {error}</span>}
      </div>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",top:0,bottom:0,left:0,width:2,background:focused?"#F25C43":"rgba(26,40,72,0.6)",transition:"background 0.3s",boxShadow:focused?"0 0 8px rgba(242,92,67,0.4)":"none"}}/>
        <El
          {...props}
          type={type!=="textarea"?type:undefined}
          rows={rows} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={()=>setFocused(true)}
          onBlur={()=>{setFocused(false);onBlur?.();}}
          style={{
            width:"100%",
            background:focused?"rgba(242,92,67,0.03)":"rgba(255,255,255,0.04)",
            border:`1px solid ${error?"rgba(242,92,67,0.5)":focused?"rgba(242,92,67,0.4)":"rgba(255,255,255,0.1)"}`,
            borderLeft:"none",
            color:"rgba(255,255,255,0.9)",
            fontFamily:"var(--font-mono)",
            fontSize:12,letterSpacing:"0.04em",
            padding:isTA?"14px 16px":"0 16px",
            height:isTA?"auto":52,
            resize:"none",outline:"none",
            transition:"all 0.3s",display:"block",
          }}
        />
      </div>
    </div>
  );
}

// ─── URL SCANNER ──────────────────────────────────────────────────────────────
function UrlScanner({ onUrlScanned }: { onUrlScanned?: (url: string | null) => void }) {
  const [url,       setUrl]       = useState("");
  const [scanning,  setScanning]  = useState(false);
  const [scanned,   setScanned]   = useState<{ url: string; src: string } | null>(null);
  const [failed,    setFailed]    = useState(false);
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
    await new Promise(r => setTimeout(r, 600));
    const src = `https://api.microlink.io?url=${encodeURIComponent(clean)}&screenshot=true&meta=false&embed=screenshot.url`;
    setScanned({ url:clean, src });
    setScanning(false);
    onUrlScanned?.(clean);
  };

  const reset = () => {
    setUrl(""); setScanned(null); setScanning(false); setFailed(false); setImgLoaded(false);
    onUrlScanned?.(null);
    setTimeout(()=>inputRef.current?.focus(), 50);
  };

  return (
    <div style={{width:"100%",display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.3em",color:"#F25C43",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#F25C43",animation:"blink 2s ease infinite",display:"inline-block"}}/>
          INITIALIZE_INTEGRATION // INTAKE_TERMINAL
        </div>
        <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(2.2rem,4.5vw,4.2rem)",color:"#fff",lineHeight:0.95,textTransform:"uppercase",marginBottom:20}}>
          READY TO<br/>INITIATE<br/>
          {/* ENGINEERING? — high-visibility outline */}
          <span style={{WebkitTextStroke:"2px rgba(255,255,255,0.7)",color:"transparent",filter:"drop-shadow(0 0 18px rgba(255,255,255,0.1))"}}>ENGINEERING?</span>
        </h2>
        <p style={{fontFamily:"var(--font-sans)",fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.65)",lineHeight:1.8,borderLeft:"2px solid rgba(26,40,72,0.6)",paddingLeft:18,marginBottom:0}}>
          Have a WordPress site your client is embarrassed by?<br/>
          Paste the URL. See what it becomes.
        </p>
      </div>

      {/* URL input */}
      <div>
        <div style={{display:"flex",gap:0}}>
          <div style={{height:52,width:44,flexShrink:0,background:"rgba(26,40,72,0.2)",border:"1px solid rgba(26,40,72,0.4)",borderRight:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {scanning ? (
              <div style={{width:14,height:14,border:"1.5px solid rgba(242,92,67,0.3)",borderTopColor:"#F25C43",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
            ) : scanned ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F25C43" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            )}
          </div>
          <input
            ref={inputRef} type="text" value={url}
            onChange={e=>{setUrl(e.target.value);setFailed(false);if(scanned)reset();}}
            onKeyDown={e=>{if(e.key==="Enter")scan();}}
            placeholder="theirclient.com"
            disabled={scanning}
            style={{flex:1,height:52,background:"rgba(255,255,255,0.05)",border:`1px solid ${failed?"rgba(242,92,67,0.5)":scanned?"rgba(242,92,67,0.3)":"rgba(255,255,255,0.1)"}`,borderLeft:"none",borderRight:"none",color:"rgba(255,255,255,0.9)",fontFamily:"var(--font-mono)",fontSize:13,letterSpacing:"0.06em",padding:"0 16px",outline:"none",transition:"border-color 0.3s"}}
          />
          <button
            onClick={scanned?reset:scan}
            disabled={scanning||(!url&&!scanned)}
            style={{height:52,padding:"0 22px",background:scanned?"rgba(26,40,72,0.3)":"#F25C43",border:`1px solid ${scanned?"rgba(26,40,72,0.5)":"transparent"}`,color:scanned?"rgba(255,255,255,0.7)":"#000",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.2em",cursor:scanning||(!url&&!scanned)?"default":"pointer",transition:"all 0.3s",opacity:(!url&&!scanned)?0.4:1,whiteSpace:"nowrap",clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)"}}
          >{scanned?"CLEAR":"SCAN"}</button>
        </div>
        {failed && <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"#F25C43",letterSpacing:"0.14em",marginTop:6}}>⚠ INVALID URL — try including the full address</div>}
        {!scanned&&!scanning&&!failed && <div style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.16em",color:"rgba(255,255,255,0.3)",marginTop:6}}>PRESS ENTER OR SCAN ↑  ·  SCREENSHOT LOADS IN ~5s</div>}
      </div>

      {/* Browser mockup */}
      {(scanning||scanned) && (
        <div style={{border:"1px solid rgba(26,40,72,0.4)",borderTop:"2px solid rgba(26,40,72,0.6)",overflow:"hidden",animation:"fadeInUp 0.4s ease forwards"}}>
          <div style={{height:32,background:"#111",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",padding:"0 12px",gap:8}}>
            <div style={{display:"flex",gap:5}}>
              {["#F25C43","rgba(26,40,72,0.8)","rgba(255,255,255,0.08)"].map((c,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:c}}/>)}
            </div>
            <div style={{flex:1,maxWidth:280,height:18,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:3,display:"flex",alignItems:"center",paddingInline:8,gap:5}}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span style={{fontFamily:"var(--font-mono)",fontSize:8,color:"rgba(255,255,255,0.4)",letterSpacing:"0.04em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {scanned?scanned.url.replace("https://",""):"scanning..."}
              </span>
            </div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,padding:"2px 8px",border:"1px solid rgba(242,92,67,0.25)",background:"rgba(242,92,67,0.06)"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#F25C43",animation:scanning?"blink 0.5s ease infinite":"none",boxShadow:scanning?"none":"0 0 6px #F25C43"}}/>
              <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.12em",color:"#F25C43"}}>{scanning?"SCANNING":"CAPTURED"}</span>
            </div>
          </div>
          <div style={{position:"relative",height:200,overflow:"hidden",background:"#0A0A0A"}}>
            {scanning && (
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
                <div style={{width:32,height:32,border:"1.5px solid rgba(26,40,72,0.5)",borderTopColor:"#F25C43",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",animation:"blink 1.5s ease infinite"}}>SCANNING SITE...</div>
              </div>
            )}
            {scanned && (
              <>
                {!imgLoaded && <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:24,height:24,border:"1.5px solid rgba(26,40,72,0.5)",borderTopColor:"#F25C43",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/></div>}
                <img src={scanned.src} alt="Site preview" loading="lazy" decoding="async"
                  onLoad={()=>setImgLoaded(true)}
                  onError={()=>{setImgLoaded(true);setFailed(true);}}
                  style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",filter:"brightness(0.8)",opacity:imgLoaded?1:0,transition:"opacity 0.5s ease"}}
                />
                {imgLoaded && (
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 35%,rgba(3,3,3,0.88) 100%)",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"16px 18px"}}>
                    <div style={{fontFamily:"var(--font-display)",fontSize:18,color:"#F25C43",letterSpacing:"0.04em",lineHeight:1,marginBottom:4}}>We'll rebuild this.</div>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.16em",color:"rgba(255,255,255,0.5)"}}>SITE SCANNED · SEND US THIS URL IN THE FORM →</div>
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

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Contact() {
  const ref = useRef(null);
  type FormState = { name: string; email: string; company: string; message: string; budget: string };
  type FormErrors = { name?: string | null; email?: string | null; message?: string | null };
  const [entered,    setEntered]    = useState(false);
  const [scannedUrl, setScanned]    = useState<string | null>(null);
  const [form,       setForm]       = useState<FormState>({ name:"", email:"", company:"", message:"", budget:"" });
  const [errors,     setErrors]     = useState<FormErrors>({});
  const [status,     setStatus]     = useState("idle");

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setEntered(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (scannedUrl) {
      setForm(prev => ({ ...prev, message: prev.message ? prev.message : `Rebuild: ${scannedUrl}\n\n` }));
    }
  }, [scannedUrl]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name    || form.name.length < 2)            e.name    = "REQUIRED";
    if (!form.email   || !/\S+@\S+\.\S+/.test(form.email)) e.email  = "INVALID_EMAIL";
    if (!form.message || form.message.length < 10)        e.message = "MIN_10_CHARS";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("submitting");
    await new Promise(r => setTimeout(r, 1800));
    setStatus("success");
    setForm({ name:"", email:"", company:"", message:"", budget:"" });
    setTimeout(() => setStatus("idle"), 6000);
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const BUDGET_OPTIONS = [
    { label:"< $500",      sub:"Small fixes"   },
    { label:"$500–$1500",  sub:"Landing page"  },
    { label:"$1500–$5000", sub:"Full build"    },
    { label:"$5000+",      sub:"Retainer"      },
  ];

  return (
    <>
      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideL   { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideR   { from{opacity:0;transform:translateX(28px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes navyPulse{ 0%,100%{opacity:0.2} 50%{opacity:0.45} }
        @keyframes scanDown { 0%{top:-2px} 100%{top:calc(100% + 2px)} }

        .submit-btn:hover:not(:disabled) { background:#fff !important; color:#000 !important; }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.3) !important; font-family:var(--font-mono); letter-spacing:0.04em; font-size:11px; }

        /* Budget card hover */
        .budget-card:hover { border-color:rgba(242,92,67,0.4) !important; background:rgba(242,92,67,0.05) !important; }
        .budget-card:hover .budget-label { color:rgba(255,255,255,0.9) !important; }

        @media (max-width:960px)  { .contact-grid  { grid-template-columns:1fr !important; } }
        @media (max-width:640px)  {
          .name-grid    { grid-template-columns:1fr !important; }
          .budget-grid  { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      <section
        id="contact"
        ref={ref}
        style={{
          background:"#030303",
          padding:"100px 6vw",
          borderTop:"1px solid rgba(255,255,255,0.04)",
          position:"relative", overflow:"hidden",
          boxSizing:"border-box", maxWidth:"100vw",
        }}
      >
        {/* Dot grid */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,0.009) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.009) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{position:"absolute",bottom:0,right:"18%",width:500,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(242,92,67,0.04) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"5%",left:"-5%",width:440,height:440,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,40,72,0.3) 0%,transparent 70%)",pointerEvents:"none",animation:"navyPulse 9s ease-in-out infinite"}}/>

        <div
          className="contact-grid"
          style={{display:"grid",gridTemplateColumns:"5fr 7fr",gap:2,maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}
        >

          {/* ── LEFT ── */}
          <div style={{display:"flex",flexDirection:"column",gap:18,opacity:entered?1:0,animation:entered?"slideL 0.8s ease forwards":"none"}}>
            <UrlScanner onUrlScanned={setScanned}/>

            <div style={{border:"1px solid rgba(26,40,72,0.3)",padding:"16px 16px 10px",background:"rgba(26,40,72,0.04)"}}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.2em",color:"rgba(255,255,255,0.35)",marginBottom:8}}>LIVE_SIGNAL_MAP</div>
              <SignalMap/>
            </div>

            <TransmissionLog/>

            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {[
                { label:"GENERAL_INQUIRIES", value:"hello@ahamedwebstudio.com", href:"mailto:hello@ahamedwebstudio.com" },
                { label:"DIRECT_TELEMETRY",  value:"+94 71 741 1188",           href:"https://wa.me/94717411188" },
              ].map(item=>(
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",flexDirection:"column",gap:4,padding:"12px 15px",border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)",textDecoration:"none",transition:"border-left-color 0.3s,background 0.3s",borderLeft:"2px solid transparent"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderLeftColor="#F25C43";e.currentTarget.style.background="rgba(242,92,67,0.03)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderLeftColor="transparent";e.currentTarget.style.background="rgba(255,255,255,0.02)";}}
                >
                  <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.22em",color:"#F25C43"}}>{item.label}</span>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"0.1em"}}>{item.value}</span>
                </a>
              ))}
            </div>

            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"9px 15px",border:"1px solid rgba(26,40,72,0.5)",background:"rgba(26,40,72,0.1)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:"0.16em",color:"rgba(255,255,255,0.55)"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"#F25C43",boxShadow:"0 0 8px #F25C43",animation:"blink 1.5s ease infinite",display:"inline-block"}}/>
              PROVISIONING <span style={{color:"#fff",marginLeft:4}}>APRIL 2026</span> SPRINTS
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div style={{opacity:entered?1:0,animation:entered?"slideR 0.8s ease 0.12s forwards":"none"}}>
            <div style={{background:"#0A0A0A",border:"1px solid rgba(255,255,255,0.08)",borderTop:"1px solid rgba(26,40,72,0.5)",position:"relative",overflow:"hidden"}}>
              {/* Scan line */}
              <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(to right,transparent,rgba(242,92,67,0.18),transparent)",pointerEvents:"none",zIndex:5,animation:"scanDown 6s linear infinite",top:0}}/>

              {/* Chrome */}
              <div style={{padding:"13px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(26,40,72,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:6}}>
                  {["#F25C43","rgba(26,40,72,0.9)","rgba(255,255,255,0.07)"].map((c,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:c}}/>)}
                </div>
                <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:"0.2em"}}>INTAKE_TERMINAL.form</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#F25C43",animation:"blink 2s ease infinite"}}/>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:8,color:"rgba(255,255,255,0.4)",letterSpacing:"0.14em"}}>SECURE_CHANNEL</span>
                </div>
              </div>

              <div style={{padding:"32px 32px 28px"}}>
                <div style={{marginBottom:32}}>
                  <h3 style={{fontFamily:"var(--font-display)",fontSize:26,color:"#fff",letterSpacing:"0.04em",marginBottom:6,textTransform:"uppercase"}}>TRANSMIT DIRECTIVES</h3>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:"0.18em"}}>
                    INPUT PROJECT PARAMETERS → GENERATE ROADMAP
                  </div>
                  {scannedUrl && (
                    <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:8,padding:"5px 12px",border:"1px solid rgba(242,92,67,0.25)",background:"rgba(242,92,67,0.06)",animation:"fadeInUp 0.4s ease forwards"}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F25C43" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.14em",color:"rgba(255,255,255,0.6)"}}>SITE SCANNED:</span>
                      <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.1em",color:"#F25C43",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{scannedUrl.replace("https://","")}</span>
                    </div>
                  )}
                </div>

                {status === "success" ? (
                  <div style={{padding:"40px 20px",border:"1px solid rgba(26,40,72,0.5)",borderTop:"2px solid #F25C43",background:"rgba(26,40,72,0.08)",display:"flex",flexDirection:"column",alignItems:"center",gap:16,textAlign:"center"}}>
                    <div style={{fontFamily:"var(--font-display)",fontSize:28,color:"#F25C43",letterSpacing:"0.04em"}}>TRANSMISSION SUCCESSFUL</div>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:"0.18em"}}>RESPONSE_SLA: 24H // PIPELINE_INITIALIZED</div>
                    <div style={{width:"100%",height:1,background:"linear-gradient(to right,#1A2848,rgba(242,92,67,0.4),transparent)",marginTop:8}}/>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"0.14em"}}>hello@ahamedwebstudio.com</div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:20}}>

                    <div className="name-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      <TerminalInput label="Entity_Name"       placeholder="JOHN DOE"    error={errors.name}  value={form.name}    onChange={set("name")}    />
                      <TerminalInput label="Company // Agency" placeholder="STUDIO NAME"              value={form.company} onChange={set("company")} />
                    </div>

                    <TerminalInput label="System_Email" type="email" placeholder="JOHN@COMPANY.COM" error={errors.email} value={form.email} onChange={set("email")}/>

                    <TerminalInput
                      label="Project_Parameters" type="textarea" rows={5}
                      placeholder={"DEFINE OBJECTIVES, STACK, AND DELIVERY WINDOW...\n\nE.G: REBUILD THEIRCLIENT.COM → NEXT.JS, UK AGENCY, LAUNCH IN 2WKS"}
                      error={errors.message} value={form.message} onChange={set("message")}
                    />

                    {/* ── Budget — card grid, not pill buttons ── */}
                    <div>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.22em",color:"rgba(255,255,255,0.7)",marginBottom:12,textTransform:"uppercase"}}>
                        Estimated_Budget
                      </div>
                      <div className="budget-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                        {BUDGET_OPTIONS.map(opt=>{
                          const sel = form.budget === opt.label;
                          return (
                            <button
                              key={opt.label} type="button"
                              className="budget-card"
                              onClick={()=>setForm(prev=>({...prev,budget:opt.label}))}
                              style={{
                                all:"unset",cursor:"pointer",
                                display:"flex",flexDirection:"column",gap:4,
                                padding:"12px 12px 10px",
                                border:`1px solid ${sel?"rgba(242,92,67,0.5)":"rgba(255,255,255,0.08)"}`,
                                background:sel?"rgba(242,92,67,0.08)":"rgba(255,255,255,0.02)",
                                borderTop:`2px solid ${sel?"#F25C43":"transparent"}`,
                                transition:"all 0.2s",
                                position:"relative",
                              }}
                            >
                              <span className="budget-label" style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.08em",color:sel?"#F25C43":"rgba(255,255,255,0.75)",transition:"color 0.2s",fontWeight:sel?700:400}}>{opt.label}</span>
                              <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.12em",color:sel?"rgba(242,92,67,0.7)":"rgba(255,255,255,0.3)"}}>{opt.sub}</span>
                              {sel && <div style={{position:"absolute",top:6,right:8,width:5,height:5,borderRadius:"50%",background:"#F25C43",boxShadow:"0 0 6px #F25C43"}}/>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit" disabled={status==="submitting"} className="submit-btn"
                      style={{
                        width:"100%",height:54,background:"#F25C43",border:"none",
                        color:"#000",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.25em",
                        fontWeight:700,textTransform:"uppercase",
                        cursor:status==="submitting"?"wait":"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",gap:12,
                        transition:"all 0.3s",
                        boxShadow:"0 0 24px rgba(242,92,67,0.2)",
                        clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)",
                      }}
                    >
                      {status==="submitting" ? (
                        <><div style={{width:14,height:14,border:"2px solid rgba(0,0,0,0.3)",borderTopColor:"#000",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>PROCESSING TRANSMISSION...</>
                      ) : (
                        <>TRANSMIT PARAMETERS<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                      )}
                    </button>

                    {status==="error" && (
                      <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"#F25C43",letterSpacing:"0.18em",textAlign:"center"}}>
                        ⚠ TRANSMISSION FAILED // USE DIRECT TELEMETRY
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