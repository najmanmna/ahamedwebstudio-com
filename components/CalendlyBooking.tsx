"use client";

import { useEffect, useRef, useState } from "react";

const CALENDLY_URL =
  "https://calendly.com/hello-ahamedwebstudio/30min?hide_gdpr_banner=1&background_color=0a0a0a&text_color=f5f5f3&primary_color=F25C43";

export default function CalendlyBooking() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const widgetRef   = useRef<HTMLDivElement>(null);
  const [entered,   setEntered]  = useState(false);
  const [loaded,    setLoaded]   = useState(false);

  // ── Intersection — trigger entry animation ────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Load Calendly script lazily once section enters viewport ──────────────
  useEffect(() => {
    if (!entered) return;

    const existing = document.querySelector('script[src*="calendly.com/assets"]');
    if (existing) { setLoaded(true); return; }

    const script  = document.createElement("script");
    script.src    = "https://assets.calendly.com/assets/external/widget.js";
    script.async  = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [entered]);

  // ── Init inline widget once script + div both ready ───────────────────────
  useEffect(() => {
    if (!loaded || !widgetRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const C = (window as any).Calendly;
    if (C?.initInlineWidget) {
      C.initInlineWidget({
        url:     CALENDLY_URL,
        parentElement: widgetRef.current,
      });
    }
  }, [loaded]);

  return (
    <>
      <style>{`
        @keyframes scanDownBook  { 0%{top:-2px} 100%{top:calc(100% + 2px)} }
        @keyframes fadeInUpBook  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blinkBook     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spinBook      { to{transform:rotate(360deg)} }
        @keyframes navyPulseBook { 0%,100%{opacity:0.2} 50%{opacity:0.4} }

        /* Strip Calendly's default white shell so our dark bg bleeds through */
        .calendly-inline-widget,
        .calendly-inline-widget iframe {
          background: transparent !important;
        }
      `}</style>

      <section
        id="booking"
        ref={sectionRef}
        style={{
          background:    "#030303",
          padding:       "100px 6vw",
          borderTop:     "1px solid rgba(255,255,255,0.04)",
          position:      "relative",
          overflow:      "hidden",
          boxSizing:     "border-box",
          maxWidth:      "100vw",
        }}
      >
        {/* ── Background atmosphere ── */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,0.009) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.009) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
        <div style={{position:"absolute",top:"8%",right:"-6%",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(242,92,67,0.045) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"5%",left:"-6%",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,40,72,0.28) 0%,transparent 70%)",pointerEvents:"none",animation:"navyPulseBook 9s ease-in-out infinite"}}/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1 }}>

          {/* ── Section header ── */}
          <div style={{
            opacity:   entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(20px)",
            transition:"opacity 0.8s ease, transform 0.8s ease",
            marginBottom: 40,
          }}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#F25C43",animation:"blinkBook 2s ease infinite",display:"inline-block"}}/>
              <span style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.3em",color:"#F25C43"}}>
                BOOK_SESSION // DIRECT_SCHEDULING
              </span>
            </div>

            <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(2.5rem,5vw,5rem)",color:"#fff",lineHeight:0.95,textTransform:"uppercase",marginBottom:18}}>
              SCHEDULE A<br/>
              <span style={{WebkitTextStroke:"2px rgba(255,255,255,0.7)",color:"transparent",filter:"drop-shadow(0 0 18px rgba(255,255,255,0.08))"}}>
                STRATEGY CALL
              </span>
            </h2>

            <p style={{fontFamily:"var(--font-sans)",fontSize:15,fontWeight:300,color:"rgba(255,255,255,0.55)",lineHeight:1.85,borderLeft:"2px solid rgba(26,40,72,0.6)",paddingLeft:18,maxWidth:520}}>
              Pick an available slot below — no back-and-forth emails.<br/>
              30 minutes to map your project, stack, and timeline.
            </p>
          </div>

          {/* ── Mac-window wrapper ── */}
          <div style={{
            opacity:   entered ? 1 : 0,
            animation: entered ? "fadeInUpBook 0.9s ease 0.18s forwards" : "none",
            background:"#0A0A0A",
            border:    "1px solid rgba(255,255,255,0.08)",
            borderTop: "1px solid rgba(26,40,72,0.5)",
            position:  "relative",
            overflow:  "hidden",
          }}>

            {/* Scan line */}
            <div style={{
              position:"absolute",left:0,right:0,height:1,
              background:"linear-gradient(to right,transparent,rgba(242,92,67,0.14),transparent)",
              pointerEvents:"none",zIndex:5,
              animation:"scanDownBook 8s linear infinite",
              top:0,
            }}/>

            {/* ── Title bar (Mac chrome) ── */}
            <div style={{
              padding:        "13px 20px",
              borderBottom:   "1px solid rgba(255,255,255,0.07)",
              background:     "rgba(26,40,72,0.1)",
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
            }}>
              {/* Traffic lights */}
              <div style={{display:"flex",gap:6}}>
                {(["#F25C43","rgba(26,40,72,0.9)","rgba(255,255,255,0.07)"] as const).map((c,i) => (
                  <div key={i} style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                ))}
              </div>

              <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:"0.2em"}}>
                BOOKING_TERMINAL.calendly
              </span>

              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#F25C43",animation:"blinkBook 2s ease infinite"}}/>
                <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"rgba(255,255,255,0.4)",letterSpacing:"0.14em"}}>
                  LIVE_CALENDAR
                </span>
              </div>
            </div>

            {/* ── Address bar strip ── */}
            <div style={{
              padding:      "8px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background:   "rgba(0,0,0,0.2)",
              display:      "flex",
              alignItems:   "center",
              gap:          10,
            }}>
              <div style={{
                flex:1,
                maxWidth:480,
                height:22,
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:3,
                display:"flex",
                alignItems:"center",
                paddingInline:10,
                gap:6,
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:"0.04em"}}>
                  calendly.com/hello-ahamedwebstudio/30min
                </span>
              </div>
              <div style={{
                display:"flex",alignItems:"center",gap:5,
                padding:"2px 10px",
                border:"1px solid rgba(242,92,67,0.25)",
                background:"rgba(242,92,67,0.06)",
              }}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#F25C43",boxShadow:"0 0 6px #F25C43"}}/>
                <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:"0.12em",color:"#F25C43"}}>SECURE</span>
              </div>
            </div>

            {/* ── Calendly widget area ── */}
            <div style={{position:"relative",background:"#0A0A0A",minHeight:660}}>
              {/* Loading state */}
              {!loaded && (
                <div style={{
                  position:"absolute",inset:0,
                  display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",gap:16,
                }}>
                  <div style={{width:32,height:32,border:"1.5px solid rgba(26,40,72,0.5)",borderTopColor:"#F25C43",borderRadius:"50%",animation:"spinBook 0.8s linear infinite"}}/>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.22em",color:"rgba(255,255,255,0.4)",animation:"blinkBook 1.5s ease infinite"}}>
                    LOADING CALENDAR...
                  </div>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"rgba(255,255,255,0.2)"}}>
                    FETCHING_AVAILABILITY // COLOMBO_LK
                  </div>
                </div>
              )}

              {/* The inline widget div — Calendly mounts into this */}
              <div
                ref={widgetRef}
                className="calendly-inline-widget"
                data-url={CALENDLY_URL}
                style={{
                  minWidth:  320,
                  height:    660,
                  opacity:   loaded ? 1 : 0,
                  transition:"opacity 0.5s ease",
                }}
              />
            </div>

            {/* ── Footer status bar ── */}
            <div style={{
              padding:        "10px 20px",
              borderTop:      "1px solid rgba(255,255,255,0.05)",
              background:     "rgba(26,40,72,0.06)",
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
            }}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"rgba(255,255,255,0.3)"}}>
                TIMEZONE // AUTO_DETECT
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:"#F25C43",boxShadow:"0 0 6px #F25C43"}}/>
                <span style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"rgba(255,255,255,0.3)"}}>
                  REAL_TIME_SLOTS // CALENDLY_API
                </span>
              </div>
            </div>
          </div>

          {/* ── Below window — contextual blurb ── */}
          <div style={{
            marginTop:     20,
            display:       "flex",
            justifyContent:"space-between",
            alignItems:    "center",
            flexWrap:      "wrap",
            gap:           12,
            opacity:       entered ? 1 : 0,
            transition:    "opacity 0.8s ease 0.4s",
          }}>
            <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
              {[
                { icon:"⏱", label:"30 MIN DISCOVERY" },
                { icon:"🌐", label:"UK · AE · LK FRIENDLY" },
                { icon:"📋", label:"NO COMMITMENT REQUIRED" },
              ].map(item => (
                <div key={item.label} style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:12}}>{item.icon}</span>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"rgba(255,255,255,0.35)"}}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="mailto:hello@ahamedwebstudio.com"
              style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.16em",color:"rgba(255,255,255,0.3)",textDecoration:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",paddingBottom:1,transition:"color 0.2s,border-color 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#F25C43";e.currentTarget.style.borderColor="#F25C43";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.3)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";}}
            >
              PREFER EMAIL? → hello@ahamedwebstudio.com
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
