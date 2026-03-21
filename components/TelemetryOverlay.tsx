"use client";

import { useEffect, useState } from "react";

export const TelemetryOverlay = () => {
  const [scrollPos, setScrollPos] = useState(0);
  const [time, setTime] = useState("");
  const [geo, setGeo] = useState<{ lat: string | null; lon: string | null; city: string | null; status: string }>({
    lat: null,
    lon: null,
    city: null,
    status: "ACQUIRING",
  });

  // Scroll tracking — no framer-motion dependency
  useEffect(() => {
    const onScroll = () => setScrollPos(Math.round(window.scrollY));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // High-speed timestamp
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().split("T")[1].substring(0, 12) + "Z");
    };
    update();
    const iv = setInterval(update, 50);
    return () => clearInterval(iv);
  }, []);

  // Live geolocation — browser Geolocation API + reverse geocode
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeo(prev => ({ ...prev, status: "GEO_UNAVAILABLE" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Reverse geocode with open nominatim (no API key needed)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "UNKNOWN";
          const country = data.address?.country_code?.toUpperCase() || "";
          setGeo({
            lat: lat.toFixed(4),
            lon: lon.toFixed(4),
            city: `${city}, ${country}`,
            status: "LOCKED",
          });
        } catch {
          // If reverse geocode fails, still show raw coords
          setGeo({
            lat: lat.toFixed(4),
            lon: lon.toFixed(4),
            city: null,
            status: "LOCKED",
          });
        }
      },
      (err) => {
        const msg =
          err.code === 1
            ? "ACCESS_DENIED"
            : err.code === 2
            ? "POSITION_UNAVAILABLE"
            : "GEO_TIMEOUT";
        setGeo(prev => ({ ...prev, status: msg }));
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const latStr = geo.lat
    ? `${Math.abs(parseFloat(geo.lat))}° ${parseFloat(geo.lat) >= 0 ? "N" : "S"}`
    : "---";
  const lonStr = geo.lon
    ? `${Math.abs(parseFloat(geo.lon))}° ${parseFloat(geo.lon) >= 0 ? "E" : "W"}`
    : "---";

  return (
    <div style={{
      position: "fixed", inset: 0,
      pointerEvents: "none",
      zIndex: 100,
      padding: "16px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      mixBlendMode: "difference",
      color: "#fff",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11, letterSpacing: "0.3em",
          color: "#F25C43", fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ width: 6, height: 6, background: "#F25C43", borderRadius: "50%", display: "inline-block", animation: "pulse 2s ease infinite" }} />
          AWS // SYS_ACTIVE
        </div>

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11, letterSpacing: "0.2em",
          textAlign: "right", opacity: 0.5, lineHeight: 1.8,
        }}>
          <div>
            LAT: {latStr} // LON: {lonStr}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
            {geo.status === "ACQUIRING" && (
              <span style={{ animation: "blink 1s step-end infinite" }}>█</span>
            )}
            LOC: {geo.city || geo.status}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        fontFamily: "'Space Mono', monospace",
        fontSize: 11, letterSpacing: "0.2em",
        opacity: 0.5,
      }}>
        <div>T_TICK: {time}</div>
        <div>[SCROLL_Y: {scrollPos}PX]</div>
      </div>

      {/* Corner accents */}
      {[
        { top: 16, left: 16, borderWidth: "1px 0 0 1px" },
        { top: 16, right: 16, borderWidth: "1px 1px 0 0" },
        { bottom: 16, left: 16, borderWidth: "0 0 1px 1px" },
        { bottom: 16, right: 16, borderWidth: "0 1px 1px 0" },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 16, height: 16,
          borderStyle: "solid",
          borderColor: "rgba(242,92,67,0.5)",
          ...s,
        }} />
      ))}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
};