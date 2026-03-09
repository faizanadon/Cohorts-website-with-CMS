import { useState, useEffect, useRef } from "react";

// ============================================================
// SITECONFIG — fallback/seed data (overridden by Supabase at runtime)
// ============================================================
import {
  brand as _brand,
  pricing as _pricing,
  modules as _modules,
  retreatTypes as _retreatTypes,
  locations as _locations,
  solutions as _solutions,
  stats as _stats,
  testimonials as _testimonials,
  guides as _guides,
  blogPosts as _blogPosts,
  nav as _nav,
  seoMatrix as _seoMatrix,
} from "./siteConfig.js";
import { loadSupabaseData } from "./lib/loadSupabaseData.js";

// Module-level lets — all components read from these at render time.
// loadSupabaseData() in App() overwrites them then forces a re-render.
let brand = _brand, pricing = _pricing, modules = _modules,
    retreatTypes = _retreatTypes, locations = _locations, solutions = _solutions,
    stats = _stats, testimonials = _testimonials, guides = _guides,
    blogPosts = _blogPosts, nav = _nav, seoMatrix = _seoMatrix;

/* ============================================================
   GLOBAL STYLES
   ============================================================ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
    ::selection{background:rgba(79,70,229,0.2)}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(79,70,229,0.3);border-radius:3px}

    @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-12px)}}
    @keyframes floatR{0%,100%{transform:translateY(0px) rotate(3deg)}50%{transform:translateY(-8px) rotate(3deg)}}
    @keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
    @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(79,70,229,0.3)}50%{box-shadow:0 0 40px rgba(79,70,229,0.6)}}

    .fade-up{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both}
    .fade-in{animation:fadeIn 0.5s ease both}
    .float{animation:float 4s ease-in-out infinite}
    .float-r{animation:floatR 5s ease-in-out infinite}
    .delay-1{animation-delay:0.1s}.delay-2{animation-delay:0.2s}.delay-3{animation-delay:0.3s}
    .delay-4{animation-delay:0.4s}.delay-5{animation-delay:0.5s}.delay-6{animation-delay:0.6s}
    .hover-lift{transition:transform 0.2s,box-shadow 0.2s}
    .hover-lift:hover{transform:translateY(-3px)}
    .ticker-inner{display:inline-flex;animation:ticker 32s linear infinite}
    .ticker-inner:hover{animation-play-state:paused}
    .nav-dropdown{display:none;position:absolute;top:100%;left:0;min-width:220px;z-index:200;padding-top:8px}
    .nav-item:hover .nav-dropdown{display:block}
    @media(max-width:900px){
      .desktop-only{display:none!important}
      .hero-grid{grid-template-columns:1fr!important}
      .two-col{grid-template-columns:1fr!important}
      .three-col{grid-template-columns:1fr 1fr!important}
      .four-col{grid-template-columns:1fr 1fr!important}
      .stats-row{grid-template-columns:1fr 1fr!important}
    }
    @media(max-width:600px){
      .three-col{grid-template-columns:1fr!important}
      .four-col{grid-template-columns:1fr 1fr!important}
    }
  `}</style>
);

/* ============================================================
   DESIGN SYSTEM — shared primitives
   ============================================================ */
const ACCENT = "#4f46e5";

const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="9" fill={ACCENT} />
    <circle cx="14" cy="16" r="6.5" fill="white" fillOpacity="0.35" />
    <circle cx="22" cy="16" r="6.5" fill="white" fillOpacity="0.35" />
    <circle cx="18" cy="21" r="6.5" fill="white" fillOpacity="0.35" />
    <circle cx="18" cy="18" r="2.5" fill="white" fillOpacity="0.85" />
  </svg>
);

const Tag = ({ children, dark }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    background: dark ? "rgba(79,70,229,0.18)" : "rgba(79,70,229,0.08)",
    border: `1px solid ${dark ? "rgba(79,70,229,0.4)" : "rgba(79,70,229,0.2)"}`,
    color: ACCENT, fontSize: 12, fontFamily: "'Outfit',sans-serif",
    fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
    padding: "5px 12px", borderRadius: 100,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, display: "inline-block" }} />
    {children}
  </span>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 11,
    letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, marginBottom: 12,
  }}>{children}</div>
);

const H1 = ({ children, style, className }) => (
  <h1 className={className} style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "clamp(44px,6vw,80px)", letterSpacing: "-0.04em", lineHeight: 1.05, ...style }}>{children}</h1>
);
const H2 = ({ children, style }) => (
  <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, ...style }}>{children}</h2>
);
const H3 = ({ children, style }) => (
  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "clamp(20px,2.5vw,28px)", letterSpacing: "-0.02em", lineHeight: 1.2, ...style }}>{children}</h3>
);
const Body = ({ children, size = 15, style, className }) => (
  <p className={className} style={{ fontFamily: "'Outfit',sans-serif", fontSize: size, lineHeight: 1.7, ...style }}>{children}</p>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", style }) => {
  const base = {
    fontFamily: "'Outfit',sans-serif", fontWeight: 700, cursor: "pointer",
    border: "none", borderRadius: 10, transition: "all 0.18s", display: "inline-flex",
    alignItems: "center", justifyContent: "center", letterSpacing: "0.01em",
  };
  const variants = {
    primary: { background: ACCENT, color: "#fff", boxShadow: "0 4px 16px rgba(79,70,229,0.3)" },
    ghost: { background: "transparent", color: "inherit", border: "1.5px solid currentColor" },
    outline: { background: "transparent", color: ACCENT, border: `1.5px solid ${ACCENT}` },
  };
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 13 },
    md: { padding: "11px 22px", fontSize: 14 },
    lg: { padding: "14px 30px", fontSize: 15 },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...sizes[size], ...style }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
    >{children}</button>
  );
};

/* ============================================================
   FLOATING PARTICLES
   ============================================================ */
const FloatingParticles = ({ dark, count = 20 }) => {
  const particles = useRef(Array.from({ length: count }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 4,
    opacity: 0.1 + Math.random() * 0.2,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: ACCENT, opacity: p.opacity,
          animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
};

const FlyingCard = ({ style, dark, children, delay = "0s" }) => (
  <div className="float" style={{
    position: "absolute",
    background: dark ? "rgba(26,26,46,0.9)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${dark ? "rgba(79,70,229,0.3)" : "rgba(79,70,229,0.15)"}`,
    borderRadius: 12, padding: "10px 14px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    zIndex: 3, animationDelay: delay, ...style,
  }}>{children}</div>
);

const MetricChip = ({ label, value, trend, dark, color = ACCENT }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 14, height: 14, borderRadius: 4, background: color }} />
    </div>
    <div>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 15, color: dark ? "#fff" : "#0a0a0a", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)", marginTop: 2 }}>{label}</div>
    </div>
    {trend && <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: 100 }}>{trend}</div>}
  </div>
);

/* ============================================================
   DASHBOARD SVG — reusable
   ============================================================ */
const DashboardMain = ({ dark }) => {
  const bg = dark ? "#111118" : "#f8f8ff";
  const card = dark ? "#1a1a2e" : "#ffffff";
  const border = dark ? "#2a2a40" : "#e8e8f0";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "#6b7280" : "#9ca3af";
  return (
    <svg viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", borderRadius: 16 }}>
      <rect width="900" height="560" rx="16" fill={bg} />
      <rect width="200" height="560" fill={card} />
      <rect x="16" y="20" width="32" height="32" rx="8" fill={ACCENT} />
      <circle cx="24" cy="32" r="6" fill="white" opacity="0.3"/>
      <circle cx="32" cy="26" r="6" fill="white" opacity="0.3"/>
      <circle cx="32" cy="38" r="6" fill="white" opacity="0.3"/>
      <circle cx="24" cy="32" r="2.5" fill="white" opacity="0.9"/>
      <rect x="56" y="26" width="60" height="8" rx="4" fill={text} opacity="0.8"/>
      <rect x="56" y="38" width="40" height="5" rx="2.5" fill={muted} opacity="0.6"/>
      {[["⌘","Command",true],["👥","Participants",false],["💳","Payments",false],["⚡","Automations",false],["🏗️","Staff",false],["📊","Analytics",false]].map(([icon,label,active],i)=>(
        <g key={i}>
          <rect x="12" y={90+i*46} width="176" height="36" rx="8" fill={active?ACCENT:"transparent"} opacity={active?1:0}/>
          <text x="28" y={113+i*46} fontSize="14" fill={active?"white":muted}>{icon}</text>
          <rect x="46" y={104+i*46} width={active?80:70} height="7" rx="3.5" fill={active?"white":muted} opacity={active?0.9:0.5}/>
        </g>
      ))}
      <rect x="210" y="0" width="690" height="560" fill={bg}/>
      <rect x="210" y="0" width="690" height="60" fill={card}/>
      <rect x="210" y="60" width="690" height="1" fill={border}/>
      <rect x="226" y="20" width="120" height="9" rx="4.5" fill={text} opacity="0.8"/>
      <rect x="740" y="15" width="100" height="32" rx="8" fill={ACCENT}/>
      <rect x="760" y="25" width="60" height="7" rx="3.5" fill="white" opacity="0.9"/>
      {[["$48,200","Revenue","↑ 34%"],[" 127","Participants","↑ 12%"],["94%","Satisfaction","↑ 8%"],["3","Active Retreats","On track"]].map(([val,label,badge],i)=>(
        <g key={i}>
          <rect x={226+i*160} y="80" width="148" height="90" rx="12" fill={card} stroke={border} strokeWidth="1"/>
          <rect x={238+i*160} y="100" width={60+i*5} height="8" rx="4" fill={muted} opacity="0.5"/>
          <rect x={238+i*160} y="118" width={50+i*8} height="14" rx="4" fill={text} opacity="0.85"/>
          <rect x={238+i*160} y="146" width="40" height="12" rx="6" fill={i===0?"rgba(16,185,129,0.15)":"rgba(79,70,229,0.1)"}/>
          <rect x={246+i*160} y="150" width="24" height="4" rx="2" fill={i===0?"#10b981":ACCENT} opacity="0.8"/>
        </g>
      ))}
      <rect x="226" y="188" width="430" height="200" rx="12" fill={card} stroke={border} strokeWidth="1"/>
      <rect x="242" y="204" width="100" height="8" rx="4" fill={text} opacity="0.7"/>
      {[80,110,90,130,120,150,140,170,160,190,175,210].map((h,i)=>(
        <rect key={i} x={248+i*31} y={358-h} width="18" height={h} rx="4" fill={i===11?ACCENT:"rgba(79,70,229,0.2)"}/>
      ))}
      <polyline points="257,298 288,278 319,290 350,268 381,272 412,248 443,254 474,228 505,234 536,208 567,216 598,186" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="672" y="188" width="214" height="200" rx="12" fill={card} stroke={border} strokeWidth="1"/>
      <rect x="688" y="204" width="80" height="8" rx="4" fill={text} opacity="0.7"/>
      {[["Yoga Bali Retreat","28/30","93%"],["Wellness Costa Rica","19/25","76%"],["Leadership UK","12/20","60%"]].map(([name,seats,pct],i)=>(
        <g key={i}>
          <rect x="688" y={226+i*50} width="182" height="38" rx="8" fill={bg}/>
          <rect x="700" y={234+i*50} width="80" height="6" rx="3" fill={text} opacity="0.7"/>
          <rect x="700" y={244+i*50} width="50" height="5" rx="2.5" fill={muted} opacity="0.5"/>
          <rect x="700" y={254+i*50} width="162" height="4" rx="2" fill={border}/>
          <rect x="700" y={254+i*50} width={162*parseInt(pct)/100} height="4" rx="2" fill={ACCENT}/>
        </g>
      ))}
      <rect x="226" y="402" width="660" height="140" rx="12" fill={card} stroke={border} strokeWidth="1"/>
      <rect x="242" y="418" width="80" height="8" rx="4" fill={text} opacity="0.7"/>
      <rect x="242" y="435" width="628" height="1" fill={border}/>
      {[["Sarah M.","Yoga Bali","Paid","$2,400"],["James T.","Leadership UK","Pending","$3,200"],["Priya K.","Wellness CR","Paid","$1,800"],["Alex R.","Corporate US","Processing","$4,100"]].map(([name,retreat,status,amt],i)=>(
        <g key={i}>
          <circle cx="258" cy={458+i*22} r="8" fill={ACCENT} opacity="0.2"/>
          <rect x="272" y={452+i*22} width="50" height="6" rx="3" fill={text} opacity="0.6"/>
          <rect x="360" y={452+i*22} width="70" height="6" rx="3" fill={muted} opacity="0.5"/>
          <rect x="510" y={449+i*22} width="44" height="14" rx="6" fill={status==="Paid"?"rgba(16,185,129,0.15)":status==="Pending"?"rgba(245,158,11,0.15)":"rgba(79,70,229,0.15)"}/>
          <rect x="518" y={453+i*22} width="28" height="5" rx="2.5" fill={status==="Paid"?"#10b981":status==="Pending"?"#f59e0b":ACCENT} opacity="0.8"/>
          <rect x="620" y={452+i*22} width="40" height="6" rx="3" fill={text} opacity="0.75"/>
        </g>
      ))}
    </svg>
  );
};

/* ============================================================
   TICKER BAR
   ============================================================ */
const TickerBar = ({ dark }) => {
  const items = modules.map(m => m.name).concat(solutions.map(s => s.name));
  const doubled = [...items, ...items];
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  return (
    <div style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: "12px 0", overflow: "hidden" }}>
      <div className="ticker-inner" style={{ gap: 0 }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 32, flexShrink: 0 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, opacity: 0.6 }} />
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 13, color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   NAVIGATION
   ============================================================ */
const Nav = ({ dark, setDark, page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const navBg = dark
    ? scrolled ? "rgba(8,8,12,0.94)" : "rgba(8,8,12,0)"
    : scrolled ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0)";

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, background: navBg, backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none", borderBottom: scrolled ? `1px solid ${border}` : "none", transition: "all 0.3s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <Logo size={32} />
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 17, color: dark ? "#fff" : "#0a0a0a", letterSpacing: "-0.02em" }}>{brand.name}</span>
        </button>
        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {nav.primary.map(({ label, page: pg, sub }) => (
            <div key={label} className="nav-item" style={{ position: "relative" }}>
              <button onClick={() => setPage(pg)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: 13.5,
                color: page === pg ? ACCENT : (dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)"),
                padding: "6px 10px", borderRadius: 6, transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 4,
              }}
                onMouseEnter={e => { e.currentTarget.style.color = dark ? "#fff" : "#0a0a0a"; e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = page === pg ? ACCENT : (dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)"); e.currentTarget.style.background = "transparent"; }}
              >
                {label}
                {sub && sub.length > 0 && <span style={{ fontSize: 9, opacity: 0.5 }}>▼</span>}
              </button>
              {sub && sub.length > 0 && (
                <div className="nav-dropdown" style={{ background: dark ? "rgba(18,18,28,0.98)" : "rgba(255,255,255,0.98)", border: `1px solid ${border}`, borderRadius: 10, padding: 8, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", backdropFilter: "blur(20px)" }}>
                  {sub.slice(0, 6).map((s, si) => {
                    // Wire to individual pages for platform and solutions
                    let targetPage = s.page;
                    if (label === "Platform") targetPage = `platform-${modules[si]?.id || s.page}`;
                    if (label === "Solutions") targetPage = `solution-${solutions[si]?.id || s.page}`;
                    if (label === "Locations") targetPage = `location-${locations[si]?.id || s.page}`;
                    return (
                      <button key={s.label} onClick={() => setPage(targetPage)} style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "7px 12px", borderRadius: 7,
                        fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
                        color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)",
                        background: "none", border: "none", cursor: "pointer", transition: "all 0.12s", whiteSpace: "nowrap",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,70,229,0.1)"; e.currentTarget.style.color = ACCENT; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)"; }}
                      >{s.label}</button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setDark(!dark)} style={{ display: "flex", alignItems: "center", gap: 6, background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", border: `1px solid ${border}`, borderRadius: 100, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.5)", transition: "all 0.2s" }}>
            <span>{dark ? "☀" : "🌙"}</span>
            <span className="desktop-only">{dark ? "Light" : "Dark"}</span>
          </button>
          <button className="desktop-only" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13, color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"; }}
          >Log in</button>
          <Btn onClick={() => setPage("contact")} size="sm" style={{ padding: "8px 18px", fontSize: 13 }}>{brand.ctaLabelShort}</Btn>
        </div>
      </div>
    </nav>
  );
};

/* ============================================================
   HOME PAGE
   ============================================================ */
const HomePage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  return (
    <div style={{ background: bg, color: text }}>
      {/* HERO */}
      <section style={{ paddingTop: 64, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={30} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${dark ? "rgba(79,70,229,0.04)" : "rgba(79,70,229,0.035)"} 1px, transparent 1px), linear-gradient(90deg, ${dark ? "rgba(79,70,229,0.04)" : "rgba(79,70,229,0.035)"} 1px, transparent 1px)`, backgroundSize: "56px 56px", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "20%", right: "15%", width: 500, height: 500, background: "radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 60px", position: "relative", zIndex: 1 }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="fade-up" style={{ marginBottom: 24 }}><Tag dark={dark}>{brand.categoryName} — New Category</Tag></div>
              <H1 style={{ color: text, marginBottom: 24 }}>
                <span className="fade-up delay-1">{brand.heroHeadline[0]}</span><br />
                <span className="fade-up delay-2"><span style={{ color: ACCENT }}>Without</span> the</span><br />
                <span className="fade-up delay-3">Chaos</span>
              </H1>
              <Body className="fade-up delay-4" size={17} style={{ maxWidth: 480, marginBottom: 36, color: muted }}>{brand.heroSub}</Body>
              <div className="fade-up delay-5" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
                <Btn variant="ghost" size="lg" style={{ color: text, borderColor: border }} onClick={() => setPage("platform")}>See the Platform</Btn>
              </div>
              <div className="fade-up delay-6" style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
                <div style={{ display: "flex" }}>
                  {[ACCENT,"#7c3aed","#0ea5e9","#10b981"].map((c,i)=>(
                    <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid " + bg, marginLeft: i > 0 ? -8 : 0 }} />
                  ))}
                </div>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted }}>
                  Trusted by <strong style={{ color: text }}>200+ retreat businesses</strong> globally
                </span>
              </div>
            </div>
            <div className="fade-in delay-3" style={{ position: "relative" }}>
              <div className="float" style={{ borderRadius: 16, overflow: "hidden", boxShadow: dark ? "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,70,229,0.2)" : "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(79,70,229,0.1)" }}>
                <DashboardMain dark={dark} />
              </div>
              <FlyingCard dark={dark} delay="0s" style={{ top: -20, left: -30, minWidth: 170 }}>
                <MetricChip label="Revenue This Month" value="$48,200" trend="↑ 34%" dark={dark} />
              </FlyingCard>
              <FlyingCard dark={dark} delay="1.5s" style={{ bottom: 40, left: -40, minWidth: 160 }}>
                <MetricChip label="Active Participants" value="127" trend="↑ 12%" dark={dark} color="#10b981" />
              </FlyingCard>
              <FlyingCard dark={dark} delay="0.8s" style={{ top: 60, right: -35, minWidth: 155 }}>
                <MetricChip label="Automations Running" value="24 live" dark={dark} color="#7c3aed" />
              </FlyingCard>
              <FlyingCard dark={dark} delay="2s" style={{ bottom: -10, right: -20, minWidth: 155 }}>
                <MetricChip label="Satisfaction Score" value="94%" dark={dark} color="#0ea5e9" />
              </FlyingCard>
            </div>
          </div>
        </div>
        {/* STATS BAR — driven from siteConfig.stats */}
        <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${border}`, position: "relative", zIndex: 1 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "32px 24px", borderRight: i < 3 ? `1px solid ${border}` : "none", textAlign: "center" }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "clamp(32px,4vw,48px)", color: ACCENT, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <TickerBar dark={dark} />

      {/* WHAT IS COHORTS */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <SectionLabel>What is {brand.name}</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>A new category.<br /><span style={{ color: ACCENT }}>A Retreat OS.</span></H2>
              <Body size={16} style={{ color: muted, marginBottom: 16 }}>
                {brand.name} isn't a booking tool. It's not a CRM. It's not a marketing platform. It's the operating system underneath your retreat business — the single layer that connects every moving part.
              </Body>
              <Body size={16} style={{ color: muted, marginBottom: 32 }}>
                When operations run on {brand.name}, retreat leaders stop managing tools and start delivering transformations. That's the difference.
              </Body>
              {["Replaces 12+ disconnected tools","Installs in one implementation","Runs automatically in the background","Scales with your retreat calendar"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: ACCENT, fontWeight: 800 }}>✓</span>
                  </div>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, fontWeight: 500, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 32 }}>
                <Btn onClick={() => setPage("platform")}>Explore the Platform →</Btn>
              </div>
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 32 }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: muted, marginBottom: 24 }}>COHORTS RETREAT OS — STACK VIEW</div>
              {[
                { layer: "Experience Layer", items: ["Participant Portal","Communication","Onboarding","Surveys"], color: ACCENT },
                { layer: "Revenue Layer", items: ["Payments","Upsells","Deposits","Refunds"], color: "#10b981" },
                { layer: "Operations Layer", items: ["Staff","Vendors","Scheduling","Tasks"], color: "#7c3aed" },
                { layer: "Intelligence Layer", items: ["Analytics","Automations","Reporting","AI Insights"], color: "#0ea5e9" },
              ].map((l, i) => (
                <div key={i} style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)", border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12, color: l.color }}>{l.layer}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {l.items.map(item => (
                      <span key={item} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11.5, fontWeight: 500, padding: "3px 10px", borderRadius: 6, background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)", color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.25)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, color: ACCENT }}>COHORTS RETREAT OS</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, opacity: 0.3 + i * 0.25 }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT REPLACES WHAT — Phase 5 */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <SectionLabel>Category Definition</SectionLabel>
          <H2 style={{ color: text, marginBottom: 12 }}>We didn't build a feature.<br /><span style={{ color: ACCENT }}>We defined a category.</span></H2>
          <Body size={15} style={{ color: muted, maxWidth: 520, margin: "0 auto 48px" }}>
            A {brand.productName} isn't a CRM, a booking tool, or a marketing platform. It's the operating layer that sits underneath your entire retreat business.
          </Body>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 960, margin: "0 auto" }}>
            {[
              { label: "Not this →", items: ["Eventbrite","WeTravel","Kajabi","Notion","Airtable","Zapier"], cross: true, highlight: false },
              { label: `${brand.name} ${brand.productName}`, items: ["Participant Management","Revenue Automation","Staff Coordination","Marketing System","Analytics Engine","Retreat Dashboard"], cross: false, highlight: true },
              { label: "Not this either →", items: ["Generic CRM","Email Marketing Tool","Project Manager","Booking Software","Online Course Platform","Form Builder"], cross: true, highlight: false },
            ].map((col, i) => (
              <div key={i} style={{ padding: 28, background: col.highlight ? "rgba(79,70,229,0.08)" : card, border: `1px solid ${col.highlight ? "rgba(79,70,229,0.3)" : border}`, borderRadius: 16, textAlign: "left" }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, color: col.highlight ? ACCENT : muted, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>{col.label}</div>
                {col.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: col.cross ? "#ef4444" : "#10b981", fontWeight: 800, flexShrink: 0 }}>{col.cross ? "✗" : "✓"}</span>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: col.highlight ? text : muted }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW THE OS WORKS — step flow */}
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? "rgba(79,70,229,0.02)" : "rgba(79,70,229,0.015)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>How it Works</SectionLabel>
            <H2 style={{ color: text }}>From chaos to OS in<br /><span style={{ color: ACCENT }}>four steps</span></H2>
          </div>
          <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 32, left: "12.5%", right: "12.5%", height: 1, background: `linear-gradient(90deg, ${ACCENT}, rgba(79,70,229,0.3))`, zIndex: 0 }} />
            {[
              { step: "01", label: "Book a Simulation", desc: "We walk through your specific retreat business and map out exactly how the OS installs.", icon: "📅" },
              { step: "02", label: "OS Implementation", desc: "Your Retreat OS is configured, connected, and tested. We build it. You review it.", icon: "⚙️" },
              { step: "03", label: "Live Handover", desc: "Full team training, SOP delivery, and a go-live call. Your system is running.", icon: "🚀" },
              { step: "04", label: "Scale on Autopilot", desc: "Every future retreat runs faster, better, and more profitably. The OS compounds.", icon: "📈" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "0 20px", position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: i === 0 ? ACCENT : card, border: `2px solid ${i === 0 ? ACCENT : border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 20px" }}>{s.icon}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>Step {s.step}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, color: text, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, lineHeight: 1.6, color: muted }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM MODULES — from siteConfig.modules */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
            <div>
              <SectionLabel>Platform</SectionLabel>
              <H2 style={{ color: text }}>Everything your retreat<br />business runs on</H2>
            </div>
            <Btn onClick={() => setPage("platform")}>See Full Platform →</Btn>
          </div>
          <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {modules.map((m, i) => (
              <div key={i} onClick={() => setPage(`platform-${m.id}`)} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.35)"; e.currentTarget.style.background = dark ? "rgba(79,70,229,0.06)" : "rgba(79,70,229,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = card; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>{m.icon}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13.5, color: text, marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, lineHeight: 1.6, color: muted }}>{m.desc}</div>
                <div style={{ marginTop: 10, fontFamily: "'Outfit',sans-serif", fontSize: 12, color: ACCENT, fontWeight: 600 }}>Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE PROBLEMS */}
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? "rgba(239,68,68,0.03)" : "rgba(239,68,68,0.02)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
            <div>
              <SectionLabel>The Problem</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>Why retreat businesses<br /><span style={{ color: "#ef4444" }}>actually fail</span></H2>
              <Body size={15} style={{ color: muted, marginBottom: 32 }}>
                It's never the product. It's never the audience. It's always the same thing — operations chaos that silently destroys the experience and the business.
              </Body>
              <Btn onClick={() => setPage("contact")}>Install the OS Instead →</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "📊", issue: "Spreadsheet overload", detail: "20+ tabs to track one retreat. Nothing connected. Everything at risk of human error." },
                { icon: "💬", issue: "WhatsApp chaos", detail: "Hundreds of participant messages with zero tracking, zero automation, zero history." },
                { icon: "💸", issue: "Revenue leakage", detail: "Manual invoicing, missed payment plans, no upsell system — money left on the table every retreat." },
                { icon: "🔄", issue: "Tool sprawl", detail: "Zapier, Notion, Stripe, Gmail, Typeform — all disconnected, all requiring management." },
                { icon: "🔥", issue: "Burnout cycles", detail: "Running the same manual processes every retreat. No leverage. No system. Just more hustle." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", background: card, border: `1px solid ${border}`, borderRadius: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13.5, color: text, marginBottom: 4 }}>{item.issue}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, lineHeight: 1.6, color: muted }}>{item.detail}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0, marginTop: 6 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RETREAT TYPES TICKER */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Retreat Types</SectionLabel>
            <H2 style={{ color: text }}>Built for every<br /><span style={{ color: ACCENT }}>retreat category</span></H2>
          </div>
          <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
            {retreatTypes.map((t, i) => (
              <div key={i} onClick={() => setPage("retreat-types")} style={{ padding: "16px 12px", background: card, border: `1px solid ${border}`, borderRadius: 12, cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.background = `${t.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = card; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12.5, color: text }}>{t.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Btn variant="outline" onClick={() => setPage("retreat-types")}>View All Retreat Types →</Btn>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — from siteConfig.testimonials */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Social Proof</SectionLabel>
            <H2 style={{ color: text }}>Retreat operators who<br /><span style={{ color: ACCENT }}>installed the OS</span></H2>
          </div>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {testimonials.map((t) => (
              <div key={t.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, right: 20, fontSize: 80, color: t.color, opacity: 0.07, fontFamily: "'Montserrat',sans-serif", fontWeight: 900, lineHeight: 1 }}>"</div>
                <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, background: `${t.color}15`, marginBottom: 18 }}>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, color: t.color }}>{t.metric}</span>
                </div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, lineHeight: 1.7, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)", fontStyle: "italic", marginBottom: 24 }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, color: "#fff" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13.5, color: text }}>{t.name}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: muted, marginTop: 1 }}>{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW — uses correct 3-tier from siteConfig */}
      <PricingSection dark={dark} setPage={setPage} preview />

      {/* FINAL CTA */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 70%)", zIndex: 0 }} />
        <FloatingParticles dark={dark} count={15} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <SectionLabel>Ready to install the OS?</SectionLabel>
          <H2 style={{ color: text, marginBottom: 20, fontSize: "clamp(32px,5vw,60px)" }}>Stop managing tools.<br /><span style={{ color: ACCENT }}>Start running retreats.</span></H2>
          <Body size={16} style={{ color: muted, maxWidth: 480, margin: "0 auto 40px" }}>
            Book a {brand.productName} Simulation — a live walkthrough of what {brand.name} looks like installed in your specific business.
          </Body>
          <Btn size="lg" onClick={() => setPage("contact")} style={{ fontSize: 16, padding: "16px 40px" }}>{brand.ctaLabel} →</Btn>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: muted, marginTop: 16 }}>
            {pricing.founderSeatsRemaining} founder seats available · {pricing.guarantee}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================
   PLATFORM PAGE
   ============================================================ */
const PlatformPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={20} />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="fade-up" style={{ marginBottom: 20 }}><Tag dark={dark}>The {brand.productName} Platform</Tag></div>
          <H1 className="fade-up delay-1" style={{ color: text, marginBottom: 24, fontSize: "clamp(40px,6vw,76px)" }}>
            The Operating System<br /><span style={{ color: ACCENT }}>Built for Retreats</span>
          </H1>
          <Body className="fade-up delay-2" size={17} style={{ color: muted, maxWidth: 560, margin: "0 auto 20px" }}>
            One platform. Eight modules. Every system your retreat business needs to run, scale, and automate — connected.
          </Body>
          {/* Category definition — was missing from Platform page */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 860, margin: "40px auto 0", textAlign: "left" }}>
            {[
              { q: "Not a booking tool", a: "Booking tools manage seats. Cohorts manages your entire business.", icon: "✗", c: "#ef4444" },
              { q: "Not a CRM", a: "CRMs track contacts. Cohorts automates the entire participant journey.", icon: "✗", c: "#ef4444" },
              { q: "A Retreat OS", a: "An operating layer that connects every system you run — automatically.", icon: "✓", c: "#10b981" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "18px 20px", background: i === 2 ? "rgba(79,70,229,0.08)" : card, border: `1px solid ${i === 2 ? "rgba(79,70,229,0.3)" : border}`, borderRadius: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: item.c, fontWeight: 800 }}>{item.icon}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: text }}>{item.q}</span>
                </div>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, lineHeight: 1.6 }}>{item.a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${border}`, boxShadow: dark ? "0 40px 100px rgba(0,0,0,0.5)" : "0 40px 100px rgba(0,0,0,0.08)" }}>
            <div style={{ padding: "14px 20px", background: card, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8 }}>
              {["#ef4444","#f59e0b","#10b981"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, marginLeft: 8 }}>{brand.name} — Retreat Command Center</span>
            </div>
            <DashboardMain dark={dark} />
          </div>
        </div>
      </section>

      {/* Modules deep dive — from siteConfig.modules */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>Platform Modules</SectionLabel>
            <H2 style={{ color: text }}>Eight modules. One system.</H2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {modules.map((m, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "60px 1fr 2fr auto",
                gap: 24, padding: "28px 24px", border: `1px solid ${border}`,
                borderRadius: i === 0 ? "14px 14px 0 0" : i === modules.length - 1 ? "0 0 14px 14px" : 0,
                background: card, alignItems: "center", transition: "all 0.2s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(79,70,229,0.06)" : "rgba(79,70,229,0.03)"; e.currentTarget.style.borderColor = "rgba(79,70,229,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = card; e.currentTarget.style.borderColor = border; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.icon}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, color: text }}>{m.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: muted, lineHeight: 1.6 }}>{m.desc}</div>
                <div onClick={() => setPage(`platform-${m.id}`)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: ACCENT, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }}>Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why retreat businesses fail */}
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? "rgba(239,68,68,0.03)" : "rgba(239,68,68,0.02)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
            <div>
              <SectionLabel>The Problem</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>Why retreat businesses<br /><span style={{ color: "#ef4444" }}>actually fail</span></H2>
              <Body size={15} style={{ color: muted, marginBottom: 32 }}>It's never the product. It's never the audience. It's always the same thing — operations chaos that silently destroys the experience and the business.</Body>
              <Btn onClick={() => setPage("contact")}>Install the OS Instead →</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "📊", issue: "Spreadsheet overload", detail: "20+ tabs to track one retreat. Nothing connected. Everything at risk of human error." },
                { icon: "💬", issue: "WhatsApp chaos", detail: "Hundreds of participant messages with zero tracking, zero automation, zero history." },
                { icon: "💸", issue: "Revenue leakage", detail: "Manual invoicing, missed payment plans, no upsell system — money left on the table every retreat." },
                { icon: "🔄", issue: "Tool sprawl", detail: "Zapier, Notion, Stripe, Gmail, Typeform — all disconnected, all requiring management." },
                { icon: "🔥", issue: "Burnout cycles", detail: "Running the same manual processes every retreat. No leverage. No system. Just more hustle." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", background: card, border: `1px solid ${border}`, borderRadius: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13.5, color: text, marginBottom: 4 }}>{item.issue}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, lineHeight: 1.6, color: muted }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <Btn size="lg" onClick={() => setPage("contact")} style={{ fontSize: 15, padding: "14px 36px" }}>{brand.ctaLabel} →</Btn>
      </section>
    </div>
  );
};

/* ============================================================
   SOLUTIONS PAGE — from siteConfig.solutions
   ============================================================ */
const SolutionsPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 60, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 20 }}><Tag dark={dark}>Six Systems, One Platform</Tag></div>
          <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginBottom: 20 }}>Every solution your<br /><span style={{ color: ACCENT }}>retreat needs</span></H1>
          <Body size={17} style={{ color: muted, maxWidth: 520, margin: "0 auto" }}>
            Each solution is a complete system — not just a feature. Together, they form the Retreat OS.
          </Body>
        </div>
      </section>
      <section>
        {solutions.map((sol, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${border}` }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
              <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                {i % 2 === 0 ? (
                  <>
                    <div>
                      <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 100, background: `${sol.color}15`, marginBottom: 20, border: `1px solid ${sol.color}30` }}>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12, color: sol.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>System 0{i + 1}</span>
                      </div>
                      <H2 style={{ color: text, fontSize: "clamp(24px,3.5vw,42px)", marginBottom: 16 }}>{sol.name}</H2>
                      <Body size={15} style={{ color: muted, marginBottom: 28 }}>{sol.desc}</Body>
                      <Btn onClick={() => setPage(`solution-${sol.id}`)} style={{ background: sol.color }}>Learn More →</Btn>
                    </div>
                    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", gap: 10 }}>
                      {["Automated setup in 48 hours","Pre-built templates included","Connects to all other modules","Performance analytics built-in","Dedicated onboarding support"].map((f, fi) => (
                        <div key={fi} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", borderRadius: 10, border: `1px solid ${border}` }}>
                          <div style={{ width: 22, height: 22, borderRadius: 7, background: `${sol.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: sol.color, fontWeight: 800 }}>✓</span>
                          </div>
                          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)", fontWeight: 500 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", gap: 10 }}>
                      {["Automated setup in 48 hours","Pre-built templates included","Connects to all other modules","Performance analytics built-in","Dedicated onboarding support"].map((f, fi) => (
                        <div key={fi} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", borderRadius: 10, border: `1px solid ${border}` }}>
                          <div style={{ width: 22, height: 22, borderRadius: 7, background: `${sol.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: sol.color, fontWeight: 800 }}>✓</span>
                          </div>
                          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)", fontWeight: 500 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 100, background: `${sol.color}15`, marginBottom: 20, border: `1px solid ${sol.color}30` }}>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12, color: sol.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>System 0{i + 1}</span>
                      </div>
                      <H2 style={{ color: text, fontSize: "clamp(24px,3.5vw,42px)", marginBottom: 16 }}>{sol.name}</H2>
                      <Body size={15} style={{ color: muted, marginBottom: 28 }}>{sol.desc}</Body>
                      <Btn onClick={() => setPage(`solution-${sol.id}`)} style={{ background: sol.color }}>Learn More →</Btn>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

/* ============================================================
   PRICING PAGE — corrected 3-tier from siteConfig.pricing.plans
   ============================================================ */
const PricingSection = ({ dark, setPage, preview = false }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  return (
    <section style={{ background: bg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      {!preview && <div style={{ paddingTop: 128 }} />}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: preview ? "100px 24px" : "0 24px 100px" }}>
        {!preview && (
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag dark={dark}>Founder Pricing</Tag>
            <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginTop: 20, marginBottom: 16 }}>
              Simple pricing.<br /><span style={{ color: ACCENT }}>Transformative results.</span>
            </H1>
            <Body size={16} style={{ color: muted, maxWidth: 480, margin: "0 auto" }}>
              {pricing.note} {pricing.founderSeatsRemaining} seats remaining.
            </Body>
          </div>
        )}
        {preview && (
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Pricing</SectionLabel>
            <H2 style={{ color: text, marginBottom: 12 }}>Founder pricing. Limited seats.</H2>
            <Body size={15} style={{ color: muted }}>{pricing.founderSeatsRemaining} founder seats remaining · {pricing.guarantee}</Body>
          </div>
        )}

        {/* 3-TIER PRICING — from siteConfig.pricing.plans */}
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: preview ? 1000 : "100%", margin: "0 auto" }}>
          {pricing.plans.map((plan, i) => (
            <div key={plan.id} style={{
              padding: 32, borderRadius: 20,
              background: plan.highlight ? ACCENT : card,
              border: `1px solid ${plan.highlight ? ACCENT : border}`,
              position: "relative",
              boxShadow: plan.highlight ? "0 24px 60px rgba(79,70,229,0.3)" : "none",
            }}>
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -13, left: 24,
                  background: dark ? "#fff" : "#0a0a0a",
                  color: dark ? "#0a0a0a" : "#fff",
                  fontFamily: "'Montserrat',sans-serif", fontWeight: 800,
                  fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: 100,
                }}>{plan.badge}</div>
              )}
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.7)" : muted, marginBottom: 6 }}>{plan.name}</div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 46, color: plan.highlight ? "#fff" : text, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 4 }}>
                ${plan.price.toLocaleString()}
              </div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: plan.highlight ? "rgba(255,255,255,0.55)" : muted, marginBottom: 12 }}>{plan.interval}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.7)" : muted, marginBottom: 20, lineHeight: 1.6 }}>{plan.description}</div>
              <div style={{ height: 1, background: plan.highlight ? "rgba(255,255,255,0.15)" : border, marginBottom: 20 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                {plan.features.map((f, fi) => (
                  <div key={fi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 17, height: 17, borderRadius: 5, background: plan.highlight ? "rgba(255,255,255,0.2)" : "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: plan.highlight ? "#fff" : ACCENT, fontWeight: 800 }}>✓</span>
                    </div>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.85)" : (dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)"), lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage("contact")} style={{ width: "100%", background: plan.highlight ? "#fff" : ACCENT, color: plan.highlight ? ACCENT : "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 13.5, fontFamily: "'Outfit',sans-serif", fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >{plan.cta} →</button>
            </div>
          ))}
        </div>

        {!preview && (
          <>
            {/* ROI Stats — from siteConfig.pricing.roiStats */}
            <div style={{ marginTop: 48, background: card, border: `1px solid ${border}`, borderRadius: 20, padding: "32px 40px" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <H3 style={{ color: text }}>The ROI is simple</H3>
                <Body size={14} style={{ color: muted, marginTop: 6 }}>One retreat run on {brand.name} pays for the platform multiple times over.</Body>
              </div>
              <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {pricing.roiStats.map((r, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "20px 16px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", borderRadius: 12, border: `1px solid ${border}` }}>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 36, color: ACCENT, letterSpacing: "-0.04em", marginBottom: 8 }}>{r.value}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted }}>{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation add-on */}
            <div style={{ marginTop: 16, padding: "24px 32px", background: "rgba(79,70,229,0.06)", border: `1px solid rgba(79,70,229,0.2)`, borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, color: text, marginBottom: 4 }}>{pricing.implementation.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: muted }}>{pricing.implementation.description}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 28, color: ACCENT, letterSpacing: "-0.03em" }}>+${pricing.implementation.price.toLocaleString()}</div>
                <Btn variant="outline" onClick={() => setPage("contact")}>Add to Plan →</Btn>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ marginTop: 60 }}>
              <H3 style={{ color: text, marginBottom: 28, textAlign: "center" }}>Frequently asked questions</H3>
              {[
                ["What is the Retreat OS Simulation?", `A live walkthrough where we show you exactly what ${brand.name} looks like installed in your specific retreat business — your workflows, your participant journey, your automation. Not a generic demo.`],
                ["Is this a monthly subscription?", `No. Each plan is a one-time investment. You own the platform. No recurring SaaS fees on top.`],
                ["How long does implementation take?", "Most retreat businesses are fully live within 2–4 weeks. The Enterprise plan includes done-for-you setup with dedicated 8-week implementation."],
                [`What if it doesn't work for my retreat?`, `We offer a ${pricing.guarantee}. If you follow the implementation and don't see measurable improvement in your operations, we'll work with you until you do.`],
                ["Can I use it for multiple retreats?", `Yes. ${brand.name} is built to run multiple retreats simultaneously. That's the entire point — it scales with your calendar.`],
              ].map(([q, a], i) => (
                <div key={i} style={{ padding: "22px 24px", border: `1px solid ${border}`, borderRadius: i === 0 ? "12px 12px 0 0" : i === 4 ? "0 0 12px 12px" : 0, background: card }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14.5, color: text, marginBottom: 8 }}>{q}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, lineHeight: 1.7, color: muted }}>{a}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

/* ============================================================
   LOCATIONS PAGE — Phase 2A (new)
   ============================================================ */
const LocationsPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  const regionColors = { Americas: "#10b981", Europe: ACCENT, Asia: "#f59e0b", Oceania: "#0ea5e9" };
  const locationDetails = {
    usa: { desc: "The largest retreat market globally. High-ticket wellness, corporate off-sites, and leadership programs dominate the space.", retreats: "12,000+ annually", growth: "+34% YoY" },
    uk: { desc: "Fast-growing wellness culture with strong corporate retreat demand. London and rural countryside retreats lead the market.", retreats: "4,200+ annually", growth: "+28% YoY" },
    australia: { desc: "Premium wellness and yoga retreat market. Operators in Byron Bay, Queensland, and WA run high-value multi-day formats.", retreats: "3,800+ annually", growth: "+31% YoY" },
    canada: { desc: "Outdoor adventure and spiritual retreat market with strong corporate wellness demand from Vancouver and Toronto.", retreats: "3,100+ annually", growth: "+25% YoY" },
    europe: { desc: "Diverse retreat market across 40+ countries. Portugal, Spain, and Italy host the highest concentration of wellness retreats.", retreats: "18,000+ annually", growth: "+42% YoY" },
    bali: { desc: "The world's #1 retreat destination. Yoga, spiritual, and wellness retreats run year-round with international participants.", retreats: "8,400+ annually", growth: "+55% YoY" },
    "costa-rica": { desc: "Fastest-growing retreat destination in the Americas. Yoga, wellness, and plant medicine retreats in jungle and beach settings.", retreats: "2,900+ annually", growth: "+67% YoY" },
    mexico: { desc: "Growing hub for wellness, spiritual, and digital nomad retreats. Tulum, Oaxaca, and Sayulita lead the market.", retreats: "4,100+ annually", growth: "+48% YoY" },
    thailand: { desc: "Asia's premier retreat destination. Yoga, meditation, detox, and wellness retreats across Koh Samui, Chiang Mai, and Phuket.", retreats: "6,200+ annually", growth: "+39% YoY" },
    portugal: { desc: "Europe's fastest-growing retreat destination. Alentejo, Algarve, and Sintra attract high-value retreat operators from across Europe.", retreats: "3,600+ annually", growth: "+72% YoY" },
  };

  const byRegion = locations.reduce((acc, loc) => {
    if (!acc[loc.region]) acc[loc.region] = [];
    acc[loc.region].push(loc);
    return acc;
  }, {});

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ marginBottom: 20 }}><Tag dark={dark}>Global Retreat Markets</Tag></div>
          <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginBottom: 20 }}>
            {brand.name} operates in<br /><span style={{ color: ACCENT }}>every retreat market</span>
          </H1>
          <Body size={17} style={{ color: muted, maxWidth: 540, margin: "0 auto" }}>
            Whether you run retreats in Bali, Costa Rica, or London — the {brand.productName} is the same system, configured for your location.
          </Body>
        </div>
      </section>

      {Object.entries(byRegion).map(([region, locs]) => (
        <section key={region} style={{ borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: regionColors[region] }} />
              <SectionLabel>{region}</SectionLabel>
            </div>
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {locs.map((loc) => {
                const d = locationDetails[loc.id];
                return (
                  <div key={loc.id} onClick={() => setPage(`location-${loc.id}`)} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 24, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = regionColors[region]; e.currentTarget.style.background = `${regionColors[region]}08`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = card; }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: text }}>{loc.label}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: `${regionColors[region]}15`, color: regionColors[region] }}>{d?.growth}</span>
                      </div>
                    </div>
                    <Body size={13} style={{ color: muted, marginBottom: 16, lineHeight: 1.65 }}>{d?.desc}</Body>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: muted }}>{d?.retreats} retreats</span>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: ACCENT, fontWeight: 600 }}>View {loc.label} →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <SectionLabel>SEO Matrix</SectionLabel>
        <H2 style={{ color: text, marginBottom: 12 }}>10 types × 10 locations = 100 pages</H2>
        <Body size={15} style={{ color: muted, maxWidth: 480, margin: "0 auto 40px" }}>Each retreat type has a dedicated page for every location — fully optimised for search.</Body>
        <div style={{ overflowX: "auto", maxWidth: 1000, margin: "0 auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 14px", border: `1px solid ${border}`, background: card, textAlign: "left", color: muted, fontSize: 11, fontWeight: 700 }}>Type \ Location</th>
                {locations.map(l => <th key={l.id} style={{ padding: "8px 10px", border: `1px solid ${border}`, background: card, textAlign: "center", color: muted, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{l.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {retreatTypes.map((t, ti) => (
                <tr key={t.id}>
                  <td style={{ padding: "8px 14px", border: `1px solid ${border}`, fontWeight: 700, color: text, fontSize: 12, whiteSpace: "nowrap" }}>{t.emoji} {t.label}</td>
                  {locations.map((l, li) => (
                    <td key={l.id} onClick={() => setPage(`seo-${t.id}-${l.id}`)} style={{ padding: "6px 10px", border: `1px solid ${border}`, textAlign: "center", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${t.color}18`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: t.color, opacity: 0.2 + (li % 3) * 0.15, margin: "0 auto" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 32 }}>
          <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
        </div>
      </section>
    </div>
  );
};

/* ============================================================
   CASE STUDIES PAGE — Phase 2B (new)
   ============================================================ */
const CaseStudiesPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  const cases = [
    {
      client: "Sara R.", type: "Yoga Retreat", location: "Bali", color: "#7c3aed",
      problem: "Managing 40 participants across WhatsApp, email, and 3 spreadsheets with zero automation.",
      result: "+60% revenue on next retreat",
      metrics: [{ label: "Revenue increase", value: "+60%" }, { label: "Hours saved / retreat", value: "14hrs" }, { label: "Participant satisfaction", value: "97%" }],
      quote: testimonials[0].quote,
    },
    {
      client: "James M.", type: "Wellness Retreat", location: "Costa Rica", color: "#10b981",
      problem: "15+ hours of manual admin per retreat. No automation, no participant portal, no upsell system.",
      result: "15hrs saved per retreat",
      metrics: [{ label: "Admin time saved", value: "15hrs" }, { label: "Revenue per retreat", value: "+$8,400" }, { label: "Repeat bookings", value: "+34%" }],
      quote: testimonials[1].quote,
    },
    {
      client: "Aiko K.", type: "Corporate Retreat", location: "London", color: "#0ea5e9",
      problem: "Capped at 4 retreats per year. Every retreat required rebuilding systems from scratch.",
      result: "4 → 11 retreats per year",
      metrics: [{ label: "Retreats per year", value: "4 → 11" }, { label: "Revenue growth", value: "175%" }, { label: "Team size change", value: "+0 hires" }],
      quote: testimonials[2].quote,
    },
    {
      client: "Maya T.", type: "Luxury Retreat", location: "Portugal", color: "#d4af37",
      problem: "Premium offering undermined by chaotic operations. Participants experienced the friction.",
      result: "$340K revenue, year 1",
      metrics: [{ label: "Revenue year 1", value: "$340K" }, { label: "Avg ticket price", value: "+$1,200" }, { label: "Refund requests", value: "-90%" }],
      quote: "Our participants kept saying how seamless and professional everything felt. That's the OS doing its job.",
    },
  ];

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={12} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ marginBottom: 20 }}><Tag dark={dark}>Proof It Works</Tag></div>
          <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginBottom: 20 }}>
            Retreat operators who<br /><span style={{ color: ACCENT }}>installed the OS</span>
          </H1>
          <Body size={17} style={{ color: muted, maxWidth: 500, margin: "0 auto" }}>Real results from real retreat businesses that replaced chaos with systems.</Body>
        </div>
      </section>

      {cases.map((c, i) => (
        <section key={i} style={{ borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: 80, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: `${c.color}15`, color: c.color }}>{c.type}</span>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: card, color: muted, border: `1px solid ${border}` }}>{c.location}</span>
                </div>
                <H2 style={{ color: text, marginBottom: 8 }}>{c.client}</H2>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, color: c.color, marginBottom: 24 }}>Result: {c.result}</div>
                <div style={{ padding: 20, background: dark ? "rgba(239,68,68,0.05)" : "rgba(239,68,68,0.03)", border: `1px solid rgba(239,68,68,0.15)`, borderRadius: 12, marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>The Problem Before</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, lineHeight: 1.65, color: muted }}>{c.problem}</div>
                </div>
                <div style={{ padding: "16px 20px", background: `${c.color}08`, border: `1px solid ${c.color}25`, borderRadius: 12 }}>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, lineHeight: 1.7, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)", fontStyle: "italic" }}>"{c.quote}"</p>
                </div>
              </div>
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 32 }}>
                  {c.metrics.map((m, mi) => (
                    <div key={mi} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", background: card, border: `1px solid ${border}`, borderRadius: 12 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: muted }}>{m.label}</div>
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 28, color: c.color, letterSpacing: "-0.03em" }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <Btn onClick={() => setPage("contact")} style={{ width: "100%", padding: "14px", fontSize: 14, textAlign: "center", justifyContent: "center", background: c.color }}>Get These Results →</Btn>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <SectionLabel>Your Turn</SectionLabel>
        <H2 style={{ color: text, marginBottom: 16 }}>What could your numbers look like?</H2>
        <Body size={15} style={{ color: muted, maxWidth: 440, margin: "0 auto 32px" }}>Book a simulation and we'll map out exactly what the {brand.productName} delivers in your specific retreat business.</Body>
        <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
      </section>
    </div>
  );
};

/* ============================================================
   RETREAT TYPES PAGE — from siteConfig.retreatTypes
   ============================================================ */
const RetreatTypesPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 60, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ marginBottom: 20 }}><Tag dark={dark}>Built for Every Retreat Category</Tag></div>
          <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginBottom: 20 }}>
            The OS adapts to<br /><span style={{ color: ACCENT }}>your retreat type</span>
          </H1>
          <Body size={16} style={{ color: muted, maxWidth: 520, margin: "0 auto" }}>
            {retreatTypes.length} retreat categories. {locations.length} locations. 100+ hyper-targeted configurations. All running on one Retreat OS.
          </Body>
        </div>
      </section>
      <section>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            {retreatTypes.map((t, i) => (
              <div key={i} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "28px 28px", cursor: "default", transition: "all 0.2s", display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.background = `${t.color}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = card; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 16, color: text, marginBottom: 6 }}>{t.label} Retreat Software</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, lineHeight: 1.65, color: muted, marginBottom: 14 }}>{t.desc}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {locations.map(l => (
                      <span key={l.id} onClick={e => { e.stopPropagation(); setPage(`seo-${t.id}-${l.id}`); }} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: `${t.color}12`, color: t.color, cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = t.color; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${t.color}12`; e.currentTarget.style.color = t.color; }}
                      >{l.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ borderTop: `1px solid ${border}`, padding: "80px 24px", textAlign: "center" }}>
        <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
      </section>
    </div>
  );
};

/* ============================================================
   RESOURCES PAGE — from siteConfig guides + blogPosts
   ============================================================ */
const ResourcesPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.cat)))];
  const filtered = activeFilter === "All" ? blogPosts : blogPosts.filter(p => p.cat === activeFilter);

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={12} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ marginBottom: 20 }}><Tag dark={dark}>Resources & Guides</Tag></div>
          <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginBottom: 20 }}>
            Everything you need to know<br /><span style={{ color: ACCENT }}>about retreat operations</span>
          </H1>
        </div>
      </section>

      {/* Guides — from siteConfig.guides */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>Free Guides</SectionLabel>
          <H2 style={{ color: text, marginBottom: 40 }}>Authority guides for retreat leaders</H2>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {guides.map((g, i) => (
              <div key={i} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = g.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${g.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{g.icon}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, color: text, marginBottom: 8 }}>{g.title}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, lineHeight: 1.65, color: muted, marginBottom: 18 }}>{g.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11.5, color: muted }}>{g.pages}</span>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, fontWeight: 600, color: g.color }}>Download →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog — from siteConfig.blogPosts with category filter */}
      <section>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>Blog</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <H2 style={{ color: text, marginBottom: 0 }}>Latest from the {brand.name} blog</H2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                  fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600,
                  padding: "6px 14px", borderRadius: 100, cursor: "pointer", transition: "all 0.15s",
                  background: activeFilter === cat ? ACCENT : card,
                  color: activeFilter === cat ? "#fff" : muted,
                  border: `1px solid ${activeFilter === cat ? ACCENT : border}`,
                }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 24px", background: card, border: `1px solid ${border}`,
                borderRadius: i === 0 ? "12px 12px 0 0" : i === filtered.length - 1 ? "0 0 12px 12px" : 0,
                cursor: "pointer", transition: "all 0.15s", gap: 16,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(79,70,229,0.06)" : "rgba(79,70,229,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = card; }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(79,70,229,0.1)", color: ACCENT, whiteSpace: "nowrap" }}>{p.cat}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: text }}>{p.title}</span>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: muted }}>{p.read} read</span>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, color: ACCENT }}>Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================
   ABOUT PAGE
   ============================================================ */
const AboutPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 20 }}><Tag dark={dark}>The {brand.name} Story</Tag></div>
            <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginBottom: 24 }}>
              Built by people who ran retreats<br /><span style={{ color: ACCENT }}>the hard way</span>
            </H1>
            <Body size={17} style={{ color: muted, maxWidth: 580 }}>
              {brand.name} was built because we couldn't find what we needed. We were running retreats on spreadsheets, WhatsApp, and five different tools — and it was breaking us.
            </Body>
          </div>
        </div>
      </section>
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
            <div>
              <SectionLabel>Why {brand.name} Exists</SectionLabel>
              <H2 style={{ color: text, marginBottom: 24 }}>We built what didn't exist</H2>
              {["We were retreat operators before we were software builders. We ran yoga retreats in Bali, leadership programs in Costa Rica, and wellness experiences across Europe.","Every retreat was built from scratch. Every participant managed manually. Every payment chased individually. Every vendor briefed in a WhatsApp thread that nobody could find again.","We tried every tool. Notion. Airtable. Zapier. Typeform. WeTravel. None of them were built for retreat operators. They were tools duct-taped together — not a system.","So we built the system. And Cohorts was born. The Retreat Operating System."].map((para, i) => (
                <Body key={i} size={15} style={{ color: muted, marginBottom: 20 }}>{para}</Body>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { num: "200+", label: "Retreat businesses using Cohorts globally" },
                { num: "$12M+", label: "Revenue processed through the platform" },
                { num: "50,000+", label: "Participants managed" },
                { num: "10", label: "Retreat types supported" },
                { num: "15+", label: "Countries with active users" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 20, alignItems: "center", padding: "20px 24px", background: card, border: `1px solid ${border}`, borderRadius: 12 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 32, color: ACCENT, letterSpacing: "-0.04em", minWidth: 80 }}>{s.num}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? "rgba(79,70,229,0.04)" : "rgba(79,70,229,0.02)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
          <SectionLabel>Retreat OS Category</SectionLabel>
          <H2 style={{ color: text, marginBottom: 20 }}>We didn't build a feature.<br />We defined a category.</H2>
          <Body size={16} style={{ color: muted, maxWidth: 600, margin: "0 auto 48px" }}>
            A {brand.productName} isn't a CRM, a booking tool, a marketing platform, or a project manager. It's the operating layer that sits underneath your entire retreat business and runs it automatically.
          </Body>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { label: "Not this →", items: ["Eventbrite","WeTravel","Kajabi","Notion","Airtable","Zapier"], cross: true },
              { label: `${brand.name} ${brand.productName} →`, items: ["Participant Management","Revenue Automation","Staff Coordination","Marketing System","Analytics Engine","Retreat Dashboard"], cross: false, highlight: true },
              { label: "Not this either →", items: ["Generic CRM","Email Marketing Tool","Project Manager","Booking Software","Online Course Platform","Form Builder"], cross: true },
            ].map((col, i) => (
              <div key={i} style={{ padding: 24, background: col.highlight ? "rgba(79,70,229,0.08)" : card, border: `1px solid ${col.highlight ? "rgba(79,70,229,0.3)" : border}`, borderRadius: 14 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 13, color: col.highlight ? ACCENT : muted, marginBottom: 16 }}>{col.label}</div>
                {col.items.map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: col.cross ? "#ef4444" : "#10b981" }}>{col.cross ? "✗" : "✓"}</span>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: col.highlight ? text : muted }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
      </section>
    </div>
  );
};

/* ============================================================
   CONTACT PAGE
   ============================================================ */
const ContactPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "", monthly: "", goal: "" });

  const inputStyle = { width: "100%", padding: "12px 14px", background: card, border: `1px solid ${border}`, borderRadius: 10, fontFamily: "'Outfit',sans-serif", fontSize: 14, color: text, outline: "none", transition: "border-color 0.15s" };
  const labelStyle = { fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12, color: muted, marginBottom: 6, display: "block" };

  return (
    <div style={{ background: bg, color: text }}>
      <section style={{ paddingTop: 128, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ marginBottom: 20 }}><Tag dark={dark}>Book a Simulation</Tag></div>
              <H1 style={{ color: text, fontSize: "clamp(36px,5vw,62px)", marginBottom: 20 }}>
                See {brand.productName}<br /><span style={{ color: ACCENT }}>in your business</span>
              </H1>
              <Body size={16} style={{ color: muted, marginBottom: 40 }}>
                A Retreat OS Simulation is a live walkthrough of what {brand.name} looks like installed in your specific business. Not a generic demo — your workflows, your participants, your automation.
              </Body>
              {[
                { icon: "⏱️", label: "45-minute live session", desc: "We map your retreat against the OS in real time." },
                { icon: "🎯", label: "Tailored to your retreat type", desc: "We configure the demo to your specific category and location." },
                { icon: "📊", label: "Custom ROI estimate", desc: "You leave with a projection of what the OS delivers for your business." },
                { icon: "🚀", label: "No obligation", desc: "Book, show up, and decide if it's right for you. No pressure." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: text, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: muted }}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.2)", borderRadius: 12 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: ACCENT, marginBottom: 6 }}>{pricing.note}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted }}>{pricing.founderSeatsRemaining} seats remaining at founder pricing.</div>
              </div>
            </div>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 36 }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
                  <H3 style={{ color: text, marginBottom: 12 }}>You're booked in.</H3>
                  <Body size={14} style={{ color: muted }}>Check your inbox for confirmation. We'll see you at the simulation.</Body>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 18, color: text, marginBottom: 6 }}>{brand.ctaLabel}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: muted, marginBottom: 28 }}>Fill in your details and we'll confirm your spot.</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { key: "name", label: "Your name", placeholder: "Jane Smith", type: "text" },
                      { key: "email", label: "Email address", placeholder: "jane@retreatco.com", type: "email" },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label}</label>
                        <input type={f.type} style={inputStyle} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = border} />
                      </div>
                    ))}
                    <div>
                      <label style={labelStyle}>Retreat Type</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = border}>
                        <option value="">Select your retreat type</option>
                        {retreatTypes.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Retreats per year</label>
                      <select style={{ ...inputStyle, appearance: "none" }} value={form.monthly} onChange={e => setForm({ ...form, monthly: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = border}>
                        <option value="">Select frequency</option>
                        {["1–2 per year","3–5 per year","6–10 per year","10+ per year","Just starting"].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Biggest operational challenge?</label>
                      <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} placeholder="Participant management, payment chasing, marketing automation..." value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = border} />
                    </div>
                    <Btn style={{ width: "100%", padding: "14px", fontSize: 15, textAlign: "center", justifyContent: "center" }} onClick={() => setSubmitted(true)}>
                      Book My Retreat OS Simulation →
                    </Btn>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11.5, color: muted, textAlign: "center" }}>No spam. No hard sell. Just a real conversation about your retreats.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================
   FOOTER — uses brand + nav from siteConfig
   ============================================================ */
const Footer = ({ dark, setPage }) => {
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.38)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const bg = dark ? "#08080c" : "#ffffff";

  return (
    <footer style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", marginBottom: 14 }}>
              <Logo size={30} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 16, color: text }}>{brand.name}</span>
            </button>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, lineHeight: 1.7, maxWidth: 240, marginBottom: 20 }}>
              {brand.tagline}. Built for retreat businesses that want to scale without the chaos.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[{label: "𝕏", href: `https://twitter.com/${brand.twitterHandle}`}, {label: "in", href: "#"}, {label: "ig", href: "#"}].map(s => (
                <a key={s.label} href={s.href} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", textDecoration: "none", color: muted, fontSize: 13 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = "rgba(79,70,229,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = "transparent"; }}
                >{s.label}</a>
              ))}
            </div>
          </div>

          {[
            { title: "Platform", links: modules.slice(0, 6).map(m => ({ label: m.name, page: `platform-${m.id}` })) },
            { title: "Solutions", links: solutions.map(s => ({ label: s.name.replace("Retreat ", ""), page: `solution-${s.id}` })) },
            { title: "Company", links: [
              { label: "About", page: "about" },
              { label: "Pricing", page: "pricing" },
              { label: "Blog", page: "resources" },
              { label: "Resources", page: "resources" },
              { label: "Locations", page: "locations" },
              { label: "Case Studies", page: "case-studies" },
              { label: brand.ctaLabelShort, page: "contact" },
            ]},
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: muted, marginBottom: 14 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map(({ label, page: pg }) => (
                  <button key={label} onClick={() => setPage(pg)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, transition: "color 0.12s", padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                    onMouseLeave={e => e.currentTarget.style.color = muted}
                  >{label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: muted }}>© {brand.year} {brand.name}. {brand.tagline}. All rights reserved.</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: muted }}>{brand.domain}</span>
        </div>
      </div>
    </footer>
  );
};

/* ============================================================
   PHASE 3A — INDIVIDUAL PLATFORM FEATURE PAGES
   Template-driven: each module gets its own full page
   ============================================================ */

// Per-module extended content
const moduleContent = {
  "command-center": {
    problem: "Running a retreat without a command center means toggling between 6 tools to get a single overview. Nothing is connected. Nothing is live. You're always behind.",
    how: "Most retreat operators build a 'dashboard' in Notion or Airtable — a static document that's out of date the moment it's created. It doesn't talk to payments, participants, or staff.",
    fix: "The Retreat Command Center is a live operations layer. Every data point — capacity, revenue, task status, participant count, upcoming actions — updates in real time across all your retreats simultaneously.",
    useCases: ["Multi-retreat operators needing one view across all programs","Operators with remote teams who need shared visibility","Scaling businesses adding a second or third retreat format"],
    features: ["Live capacity tracking across all retreats","Revenue dashboard with daily/monthly/YTD breakdowns","Task assignment and status tracking","Staff activity overview","Upcoming milestones and deadline alerts","Mobile-accessible command view"],
  },
  "participants": {
    problem: "Participant management by email and WhatsApp creates a fragmented experience. Information gets lost. Follow-ups get missed. Premium participants feel like they're dealing with an amateur.",
    how: "Most operators collect a form, add participants to a spreadsheet, then manually send every email, reminder, and piece of pre-retreat information. It takes 3–5 hours per retreat just to onboard.",
    fix: "The Participant Experience module creates branded participant portals automatically. Every booking triggers an onboarding sequence — welcome email, info pack, pre-retreat questionnaire, arrival details — all sent automatically at the right time.",
    useCases: ["High-ticket retreat operators needing premium participant UX","Operators running 20+ participants who can't manage individually","Businesses building repeat-booking relationships"],
    features: ["Branded participant portal per retreat","Automated onboarding sequences","Pre-retreat questionnaire and intake flows","Real-time communication hub","Arrival information delivery","Post-retreat follow-up and review requests"],
  },
  "payments": {
    problem: "Manual payment collection is the single biggest revenue leak in retreat businesses. Missed payment plans, no upsell system, chasing invoices by WhatsApp — it adds up to thousands lost per retreat.",
    how: "Most operators use Stripe directly and manually send invoices. Payment plans require manual reminders. Upsells are mentioned on a call and rarely followed up. Refunds are handled case by case.",
    fix: "The Payments & Revenue module automates the entire financial journey. Deposits collect at booking. Payment plan reminders send automatically. Upsell sequences trigger at the right moment. Refunds follow a defined flow.",
    useCases: ["Operators with high-ticket retreats and complex payment structures","Businesses losing revenue to missed upsell moments","Retreat brands running multi-currency international bookings"],
    features: ["Automated deposit collection at booking","Payment plan scheduling and reminders","Upsell sequence automation","Multi-currency support","Refund management workflow","Revenue reporting and forecasting"],
  },
  "automations": {
    problem: "Every retreat requires the same 40+ manual touchpoints — welcome emails, reminder sequences, pre-retreat packs, check-in messages, post-retreat reviews. Without automation, you do all of them by hand.",
    how: "Operators build sequences in Mailchimp or ActiveCampaign, disconnected from their participant data. Triggers break. Sequences go stale. The right message rarely reaches the right person at the right time.",
    fix: "The Automations & Marketing OS comes pre-loaded with sequences for every stage of the retreat lifecycle. Booking confirmation, 30-day countdown, 7-day pre-retreat, arrival day, post-retreat, and re-engagement — all connected to live participant data.",
    useCases: ["Operators who want to run retreats without being in their inbox","Businesses that need consistent communication without hiring a VA","Scaling operators adding new retreat formats without rebuilding sequences"],
    features: ["Pre-built lifecycle automation sequences","Trigger-based messaging connected to participant status","Email + SMS automation","Waitlist and re-engagement flows","Post-retreat review and referral sequences","Custom automation builder"],
  },
  "staff": {
    problem: "Briefing staff and vendors by WhatsApp, PDF, and email means information gets missed, duplicated, or outdated. When something changes, you have to update everyone manually.",
    how: "Most retreat operators brief their team in a WhatsApp group and hope everyone reads it. Role assignments live in a spreadsheet nobody updates. SOPs exist as documents nobody can find.",
    fix: "The Staff & Vendor Management module gives every team member a role-specific view of their responsibilities. SOPs are attached to roles. Briefing documents update automatically. Vendors get their own portal with everything they need.",
    useCases: ["Retreat operators with 5+ team members per retreat","Businesses working with recurring vendors across multiple locations","Operators building standard operating procedures for scale"],
    features: ["Role-based team portals","SOP library attached to roles","Vendor briefing and portal access","Task assignment and tracking","Team communication hub","Contractor payment scheduling"],
  },
  "analytics": {
    problem: "Without analytics, retreat operators make decisions based on gut feel. They don't know which retreats are most profitable, which participants are most likely to rebook, or which marketing channels are actually working.",
    how: "Most retreat businesses look at revenue in their Stripe dashboard and nothing else. There's no participant LTV tracking, no marketing attribution, no profitability by retreat type.",
    fix: "The Analytics & Reporting module tracks every metric that matters — revenue per retreat, participant acquisition cost, LTV, satisfaction scores, refund rates, and repeat booking rates. Every data point is available in a single dashboard.",
    useCases: ["Operators making decisions about which retreat formats to scale","Businesses evaluating marketing channel ROI","Retreat brands building investor or partner reporting"],
    features: ["Revenue and profitability by retreat","Participant lifetime value tracking","Marketing attribution dashboard","Satisfaction score tracking","Refund and cancellation analytics","Exportable reports"],
  },
  "integrations": {
    problem: "Retreat operators use 8–12 tools on average. None of them talk to each other. Data has to be moved manually between systems, creating errors and consuming hours every week.",
    how: "The standard approach is a Zapier stack connecting Typeform to Notion to Stripe to Mailchimp. It breaks constantly, requires maintenance, and still doesn't give you a unified view.",
    fix: "The Integrations module connects Cohorts to your existing stack — Stripe, Zapier, email platforms, booking systems, calendar tools, and CRMs. Everything flows into one system automatically.",
    useCases: ["Operators already using Stripe, Zoom, or Notion who don't want to rebuild","Businesses with existing email lists in Mailchimp or ActiveCampaign","Teams using Slack or Notion for internal communication"],
    features: ["Native Stripe integration","Zapier connection for 5,000+ apps","Email platform sync (Mailchimp, ActiveCampaign, Kit)","Calendar and scheduling integrations","CRM data sync","API access for custom builds"],
  },
  "scaling": {
    problem: "Every retreat feels like starting from scratch. The same setup work, the same manual processes, the same emails rewritten from memory. There's no system that compounds.",
    how: "Operators copy their last retreat's folder, update the dates, and hope they didn't miss anything. Every new retreat format requires rebuilding everything from zero.",
    fix: "The Retreat Scaling System gives you a templated OS for every retreat you run. SOPs, communication sequences, staff briefings, vendor lists, and payment structures — all cloned from a master template and customized in minutes.",
    useCases: ["Operators launching a second or third retreat format","Businesses targeting 8–12 retreats per year from a current 3–4","Retreat brands with multiple team members who need repeatable systems"],
    features: ["Retreat template library","One-click retreat cloning","SOP duplication with role assignment","Marketing sequence templates","Vendor and staff roster templates","Pre-launch checklist automation"],
  },
};

const PlatformFeaturePage = ({ moduleId, dark, setPage }) => {
  const mod = modules.find(m => m.id === moduleId) || modules[0];
  const content = moduleContent[moduleId] || moduleContent["command-center"];
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  // Related modules for internal linking (Phase 6)
  const related = modules.filter(m => m.id !== moduleId).slice(0, 3);

  return (
    <div style={{ background: bg, color: text }}>
      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
            <button onClick={() => setPage("platform")} style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 0 }}>Platform</button>
            <span style={{ color: muted }}>→</span>
            <span style={{ color: text, fontWeight: 600 }}>{mod.name}</span>
          </div>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ marginBottom: 20 }}><Tag dark={dark}>Platform Module</Tag></div>
              <div style={{ fontSize: 56, marginBottom: 16 }}>{mod.icon}</div>
              <H1 style={{ color: text, fontSize: "clamp(36px,5vw,64px)", marginBottom: 20 }}>{mod.name}</H1>
              <Body size={17} style={{ color: muted, maxWidth: 480, marginBottom: 36 }}>{mod.desc}</Body>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
                <Btn variant="ghost" size="lg" style={{ color: text, borderColor: border }} onClick={() => setPage("platform")}>← Back to Platform</Btn>
              </div>
            </div>
            {/* Feature list */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 32 }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: muted, marginBottom: 20 }}>What's included</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {content.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)", borderRadius: 10, border: `1px solid ${border}` }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: ACCENT, fontWeight: 800 }}>✓</span>
                    </div>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → How → Fix (3-section narrative) */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "The Problem", heading: "What breaks without it", body: content.problem, icon: "💥", color: "#ef4444" },
              { label: "How It Normally Works", heading: "The manual workaround", body: content.how, icon: "🔧", color: "#f59e0b" },
              { label: "How Cohorts Fixes It", heading: `What ${mod.name} does instead`, body: content.fix, icon: "✓", color: "#10b981" },
            ].map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 60, padding: "48px 0", borderBottom: i < 2 ? `1px solid ${border}` : "none", alignItems: "start" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: `${s.color}12`, border: `1px solid ${s.color}25`, marginBottom: 12 }}>
                    <span style={{ fontSize: 14 }}>{s.icon}</span>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, color: s.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                  </div>
                  <H3 style={{ color: text, fontSize: 20 }}>{s.heading}</H3>
                </div>
                <Body size={16} style={{ color: muted, lineHeight: 1.8 }}>{s.body}</Body>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>Use Cases</SectionLabel>
          <H2 style={{ color: text, marginBottom: 40 }}>Who this module is built for</H2>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {content.useCases.map((uc, i) => (
              <div key={i} style={{ padding: "24px", background: card, border: `1px solid ${border}`, borderRadius: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: 14, fontWeight: 800, color: ACCENT }}>0{i+1}</div>
                <Body size={14} style={{ color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)", lineHeight: 1.65 }}>{uc}</Body>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related modules — Phase 6 internal linking */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>Connected Modules</SectionLabel>
          <H2 style={{ color: text, marginBottom: 12 }}>Everything connects in the OS</H2>
          <Body size={15} style={{ color: muted, marginBottom: 40 }}>This module works alongside every other part of the {brand.productName}.</Body>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {related.map((m, i) => (
              <div key={i} onClick={() => setPage(`platform-${m.id}`)} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(79,70,229,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13.5, color: text, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: muted, lineHeight: 1.55 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SectionLabel>Ready to install?</SectionLabel>
          <H2 style={{ color: text, marginBottom: 16 }}>See {mod.name} in your business</H2>
          <Body size={15} style={{ color: muted, maxWidth: 440, margin: "0 auto 32px" }}>Book a simulation and we'll show you exactly what this module looks like running in your specific retreat operation.</Body>
          <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <button onClick={() => setPage("platform")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, textDecoration: "underline" }}>← Back to Platform</button>
            <button onClick={() => setPage("pricing")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, textDecoration: "underline" }}>View Pricing →</button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================
   PHASE 3B — INDIVIDUAL SOLUTION PAGES
   ============================================================ */

const solutionContent = {
  "operations": {
    headline: "End the spreadsheet chaos",
    subhead: "Install a single operations command layer across your entire retreat business.",
    problem: "The average retreat operator uses 8–12 disconnected tools. Airtable for participants. Notion for SOPs. Stripe for payments. Gmail for communication. None of them talk to each other. Every retreat requires manually syncing data between all of them.",
    industryReality: "The retreat industry runs on improvisation. Most operators have never seen what a systemized retreat business looks like. They assume the chaos is normal. It's not — it's costing them 12+ hours per retreat and limiting them to 4–6 retreats per year.",
    solution: "The Retreat Operations System installs a unified command layer across your entire business. One system handles every operational function — participants, payments, staff, vendors, communications, and analytics. No more toggling. No more manual syncing. Just operations that run.",
    results: [
      { value: "12hrs", label: "Saved per retreat on admin" },
      { value: "340%", label: "Average revenue increase year 1" },
      { value: "4×", label: "Faster retreat setup time" },
    ],
    steps: ["Map your current retreat workflow","Identify every manual process and tool","Build the OS architecture for your business","Configure automations and integrations","Handover and team training","Live in 2–4 weeks"],
  },
  "marketing": {
    headline: "Fill your seats without burning out",
    subhead: "Automated email flows, waitlists, and re-engagement that run without you.",
    problem: "Most retreat operators fill seats through Instagram posts, word of mouth, and manual follow-ups. It works — until it doesn't. The moment you stop posting, bookings stop. There's no system. No automation. No compounding.",
    industryReality: "Retreat marketing is treated as a sprint before each launch rather than a system that runs year-round. Operators spend 40+ hours on marketing per retreat, most of it manual, most of it starting from zero each time.",
    solution: "The Retreat Marketing System installs automated sequences for every stage of the marketing lifecycle — lead capture, nurture sequences, launch campaigns, waitlist management, and re-engagement flows. It runs between retreats, building your audience while you focus elsewhere.",
    results: [
      { value: "3×", label: "More leads per retreat" },
      { value: "68%", label: "Open rate on automated sequences" },
      { value: "22%", label: "Conversion from waitlist" },
    ],
    steps: ["Audit current marketing channels","Build lead capture and nurture sequences","Configure launch campaign templates","Set up waitlist and re-engagement flows","Connect to participant management","Launch and monitor"],
  },
  "sales": {
    headline: "Convert enquiries into bookings",
    subhead: "Structured sales flows, upsells, and follow-up sequences that close.",
    problem: "Most retreat operators lose bookings because they don't have a sales system. Enquiries come in via email or DM and get replied to manually. Follow-ups happen when remembered. Upsells are mentioned on a call and never followed through.",
    industryReality: "The gap between enquiry and booking is where most retreat revenue is lost. Without a structured sales flow, the conversion rate from enquiry to booking averages 12–18%. With a system, it can reach 35–45%.",
    solution: "The Retreat Sales System installs a complete sales pipeline — from first enquiry to deposit collected. Automated follow-up sequences run after every enquiry. Upsell triggers fire at the right moment. Every prospect gets a structured journey from interest to booking.",
    results: [
      { value: "3×", label: "Enquiry-to-booking conversion" },
      { value: "$2,400", label: "Average upsell revenue per retreat" },
      { value: "48hrs", label: "Average time from enquiry to deposit" },
    ],
    steps: ["Map enquiry sources and current conversion rates","Build sales pipeline stages","Configure automated follow-up sequences","Set up upsell triggers and offers","Connect to payment collection","Train team on sales OS"],
  },
  "automation": {
    headline: "Replace 47 manual tasks with automation",
    subhead: "From booking confirmation to post-retreat review requests — automated.",
    problem: "Every retreat generates the same 40–60 repetitive tasks. Welcome emails. Reminder sequences. Pre-retreat info packs. Day-of messages. Post-retreat follow-ups. Review requests. Upsell sequences. Without automation, a human does every single one of them.",
    industryReality: "The average retreat operator spends 15–20 hours on manual communication per retreat. That's time not spent on product quality, marketing, or scaling. Most operators don't automate because they don't know where to start.",
    solution: "The Retreat Automation System comes pre-loaded with sequences for every touchpoint in the participant lifecycle. Booking confirmation, 30-day countdown, 7-day pre-retreat, arrival day, post-retreat, and re-engagement — all triggered automatically based on participant data.",
    results: [
      { value: "15hrs", label: "Saved on manual communication / retreat" },
      { value: "47", label: "Tasks automated on average" },
      { value: "94%", label: "Participant satisfaction with automated comms" },
    ],
    steps: ["Audit every manual communication touchpoint","Map automation triggers to participant lifecycle","Configure pre-built sequence templates","Customise messaging to your brand voice","Test all trigger conditions","Go live and monitor"],
  },
  "scaling": {
    headline: "Go from 4 retreats a year to 12",
    subhead: "SOPs, delegation frameworks, and repeatability built into the system.",
    problem: "Retreat businesses hit a ceiling because every retreat is built from scratch. The operator is the bottleneck. Nothing is documented. Nothing is repeatable. Adding a second retreat format doubles the workload.",
    industryReality: "The average retreat operator runs 4–6 retreats per year. The bottleneck is never demand — it's operations. Without a scaling system, growth means hiring more people and working more hours. With one, it means running more retreats on the same resources.",
    solution: "The Retreat Scaling System turns your best retreat into a replicable template. SOPs are documented and attached to roles. Communication sequences are templated. Vendor lists are maintained. Staff briefings clone automatically. Every new retreat starts 80% done.",
    results: [
      { value: "4→11", label: "Retreats per year (avg operator)" },
      { value: "+0", label: "Additional hires required to scale" },
      { value: "3hrs", label: "Time to launch a new retreat" },
    ],
    steps: ["Document current retreat workflow","Build SOP library and role assignments","Create master retreat template","Set up cloning and customisation workflow","Delegate to team with built-in oversight","Launch second retreat format"],
  },
  "crisis": {
    headline: "When things go wrong — handled",
    subhead: "Cancellation flows, refund management, emergency comms — all built in.",
    problem: "Retreat crises — cancellations, venue changes, participant emergencies, last-minute dropouts — are handled reactively with no system. Every situation is a fire drill. The operator loses hours, reputation, and sometimes revenue.",
    industryReality: "Every retreat business experiences at least one crisis per year. Most operators handle it by improvising. There's no cancellation policy built into a system, no refund workflow, no emergency communication protocol. The result is stress, legal risk, and participant damage.",
    solution: "Retreat Crisis Control installs a response layer for every foreseeable crisis. Cancellation flows activate in one click — notifying participants, processing refunds according to your policy, and updating all systems simultaneously. Emergency communication templates go out in minutes, not hours.",
    results: [
      { value: "< 1hr", label: "Full cancellation processed" },
      { value: "90%", label: "Reduction in crisis-related participant complaints" },
      { value: "100%", label: "Policy compliance on refund processing" },
    ],
    steps: ["Define cancellation and refund policies","Build crisis response workflows","Configure emergency communication templates","Set up refund automation within policy rules","Create staff crisis escalation protocol","Test all crisis scenarios"],
  },
};

const SolutionDetailPage = ({ solutionId, dark, setPage }) => {
  const sol = solutions.find(s => s.id === solutionId) || solutions[0];
  const content = solutionContent[solutionId] || solutionContent["operations"];
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  // Related solutions for internal linking
  const related = solutions.filter(s => s.id !== solutionId).slice(0, 3);

  return (
    <div style={{ background: bg, color: text }}>
      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 600, height: 500, background: `radial-gradient(ellipse at top right, ${sol.color}12 0%, transparent 65%)`, zIndex: 0 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
            <button onClick={() => setPage("solutions")} style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 0 }}>Solutions</button>
            <span style={{ color: muted }}>→</span>
            <span style={{ color: text, fontWeight: 600 }}>{sol.name}</span>
          </div>
          <div style={{ maxWidth: 780 }}>
            <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 100, background: `${sol.color}15`, marginBottom: 20, border: `1px solid ${sol.color}30` }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12, color: sol.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{sol.icon} {sol.name}</span>
            </div>
            <H1 style={{ color: text, fontSize: "clamp(36px,5vw,68px)", marginBottom: 16 }}>{content.headline}</H1>
            <Body size={18} style={{ color: muted, marginBottom: 36 }}>{content.subhead}</Body>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn size="lg" onClick={() => setPage("contact")} style={{ background: sol.color }}>{brand.ctaLabel} →</Btn>
              <Btn variant="ghost" size="lg" style={{ color: text, borderColor: border }} onClick={() => setPage("solutions")}>← All Solutions</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Industry reality → Solution */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          {[
            { label: "The Problem", body: content.problem, color: "#ef4444", icon: "💥" },
            { label: "Industry Reality", body: content.industryReality, color: "#f59e0b", icon: "📊" },
            { label: "The Solution", body: content.solution, color: sol.color, icon: sol.icon },
          ].map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 60, padding: "48px 0", borderBottom: i < 2 ? `1px solid ${border}` : "none", alignItems: "start" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: `${s.color}12`, border: `1px solid ${s.color}25`, marginBottom: 12 }}>
                  <span>{s.icon}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, color: s.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                </div>
              </div>
              <Body size={16} style={{ color: muted, lineHeight: 1.8 }}>{s.body}</Body>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? `${sol.color}05` : `${sol.color}03` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <SectionLabel>Results</SectionLabel>
          <H2 style={{ color: text, marginBottom: 48 }}>What operators see after installing</H2>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {content.results.map((r, i) => (
              <div key={i} style={{ padding: "32px 24px", background: card, border: `1px solid ${border}`, borderRadius: 16 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 48, color: sol.color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 10 }}>{r.value}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: muted }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation steps */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>How It's Installed</SectionLabel>
          <H2 style={{ color: text, marginBottom: 48 }}>From zero to running in weeks</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {content.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "center", padding: "20px 24px", background: card, border: `1px solid ${border}`, borderRadius: i === 0 ? "12px 12px 0 0" : i === content.steps.length - 1 ? "0 0 12px 12px" : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: sol.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 12, color: "#fff", flexShrink: 0 }}>0{i + 1}</div>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)", fontWeight: 500 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related solutions — Phase 6 internal linking */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>Related Systems</SectionLabel>
          <H2 style={{ color: text, marginBottom: 40 }}>Every system connects</H2>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {related.map((s, i) => (
              <div key={i} onClick={() => setPage(`solution-${s.id}`)} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 24, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = card; }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: text, marginBottom: 6 }}>{s.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 300, background: `radial-gradient(ellipse, ${sol.color}15 0%, transparent 70%)`, zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <H2 style={{ color: text, marginBottom: 16 }}>Ready to install the {sol.name}?</H2>
          <Body size={15} style={{ color: muted, maxWidth: 440, margin: "0 auto 32px" }}>Book a simulation and we'll show you exactly what this system looks like running in your retreat business.</Body>
          <Btn size="lg" onClick={() => setPage("contact")} style={{ background: sol.color, fontSize: 15, padding: "14px 36px" }}>{brand.ctaLabel} →</Btn>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24 }}>
            <button onClick={() => setPage("solutions")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, textDecoration: "underline" }}>← All Solutions</button>
            <button onClick={() => setPage("pricing")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, textDecoration: "underline" }}>View Pricing →</button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================
   PHASE 3C — INDIVIDUAL LOCATION PAGES
   ============================================================ */

const locationContent = {
  usa: { market: "The US is the world's largest retreat market. Over 12,000 retreats run annually across wellness, corporate, leadership, and spiritual categories. The average high-ticket retreat generates $4,800 per participant.", challenge: "US retreat operators face the most competitive market globally. Participant expectations are high, refund requests are common, and legal compliance around deposits and cancellations is non-negotiable. Operations need to be airtight.", popular: ["Wellness","Leadership","Corporate","Yoga","Coaching"] },
  uk: { market: "The UK retreat market is growing rapidly, driven by corporate wellness demand and a strong yoga and mindfulness culture. London-based operators run high-ticket programmes while rural operators in the Cotswolds and Scotland attract international participants.", challenge: "UK retreat operators struggle with venue costs and seasonal demand. Systems that automate off-season marketing and re-engagement are critical to maintaining year-round revenue.", popular: ["Yoga","Wellness","Corporate","Leadership","Meditation"] },
  australia: { market: "Australia has one of the world's most developed wellness retreat cultures, concentrated in Byron Bay, Queensland, and WA. Premium pricing is the norm, with participants willing to pay $3,500–$8,000 per retreat.", challenge: "Australian retreat operators often run internationally as well as domestically — managing multi-currency payments, international participant communications, and time zone coordination without a system is a major friction point.", popular: ["Yoga","Wellness","Fitness","Spiritual","Coaching"] },
  canada: { market: "Canada's retreat market is concentrated around Vancouver, Toronto, and Whistler. Corporate wellness programs and outdoor adventure retreats are the fastest-growing categories.", challenge: "Canadian operators often serve both domestic and US-based participants, requiring multi-currency payment systems, bilingual communication options, and compliance with varying provincial regulations.", popular: ["Corporate","Wellness","Leadership","Yoga","Fitness"] },
  europe: { market: "Europe hosts the world's most diverse retreat market — over 18,000 retreats per year across 40+ countries. Portugal, Spain, Italy, and France lead. The market is growing at 42% annually.", challenge: "European operators face GDPR compliance requirements, multi-currency payment complexity, and the challenge of attracting international participants while maintaining local market presence.", popular: ["Yoga","Wellness","Spiritual","Meditation","Luxury"] },
  bali: { market: "Bali is the world's #1 retreat destination. Over 8,400 retreats run annually, attracting participants from 80+ countries. The average Bali retreat operator generates $280K–$600K annually with the right systems.", challenge: "Bali retreat operators deal with the highest volume of international participants of any market. Multi-currency payments, visa coordination, complex logistics, and high participant expectations make operations complexity the primary growth barrier.", popular: ["Yoga","Wellness","Spiritual","Meditation","Digital Nomad"] },
  "costa-rica": { market: "Costa Rica is the fastest-growing retreat destination in the Americas, growing at 67% annually. Jungle and beach settings attract premium wellness and spiritual retreat participants, primarily from North America.", challenge: "Costa Rica operators manage primarily international participants with high expectations. Without automated communication, participant management, and payment systems, the volume of pre-retreat coordination overwhelms small teams.", popular: ["Wellness","Spiritual","Yoga","Fitness","Digital Nomad"] },
  mexico: { market: "Mexico's retreat market is growing at 48% annually, led by Tulum, Oaxaca, and Sayulita. The market attracts premium North American participants and a growing European audience for spiritual and wellness formats.", challenge: "Mexican retreat operators face infrastructure variability — reliable automated communication is critical when local logistics are unpredictable. Operators who build systems weather disruptions that would otherwise derail a retreat.", popular: ["Spiritual","Wellness","Yoga","Digital Nomad","Coaching"] },
  thailand: { market: "Thailand is Asia's premier retreat destination with over 6,200 retreats annually. Koh Samui, Chiang Mai, and Phuket are the leading markets. Detox, yoga, and meditation retreats dominate.", challenge: "Thai retreat operators manage high participant volumes with small teams. Automation is the difference between running 4 retreats per year and 10. Without it, operations bottleneck on the same manual processes every time.", popular: ["Yoga","Wellness","Meditation","Fitness","Spiritual"] },
  portugal: { market: "Portugal is Europe's fastest-growing retreat destination, growing at 72% annually. The Alentejo, Algarve, and Sintra attract high-value retreat operators from across Europe and North America.", challenge: "Portugal-based operators often serve international audiences with premium expectations. Professional participant communication, automated payments, and polished onboarding are the difference between a good and great retreat experience.", popular: ["Yoga","Wellness","Luxury","Meditation","Coaching"] },
};

const LocationDetailPage = ({ locationId, dark, setPage }) => {
  const loc = locations.find(l => l.id === locationId) || locations[0];
  const content = locationContent[locationId] || locationContent["bali"];
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  // Related retreat types for cross-linking
  const relatedTypes = retreatTypes.filter(t => content.popular.includes(t.label)).slice(0, 4);

  return (
    <div style={{ background: bg, color: text }}>
      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={15} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 700, height: 500, background: "radial-gradient(ellipse at top right, rgba(79,70,229,0.1) 0%, transparent 65%)", zIndex: 0 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
            <button onClick={() => setPage("locations")} style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 0 }}>Locations</button>
            <span style={{ color: muted }}>→</span>
            <span style={{ color: text, fontWeight: 600 }}>{loc.label}</span>
          </div>
          <div style={{ maxWidth: 820 }}>
            <div style={{ marginBottom: 20 }}><Tag dark={dark}>Retreat Software {loc.label}</Tag></div>
            <H1 style={{ color: text, fontSize: "clamp(36px,5vw,68px)", marginBottom: 16 }}>
              Retreat Management Software<br /><span style={{ color: ACCENT }}>for {loc.label}</span>
            </H1>
            <Body size={18} style={{ color: muted, marginBottom: 36 }}>
              Run your {loc.label} retreat business without chaos. {brand.name} is the {brand.productName} built for {loc.label}-based retreat operators.
            </Body>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
              <Btn variant="ghost" size="lg" style={{ color: text, borderColor: border }} onClick={() => setPage("locations")}>← All Locations</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* Market overview + challenge */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
            <div>
              <SectionLabel>The {loc.label} Retreat Market</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>One of the world's fastest-growing retreat destinations</H2>
              <Body size={15} style={{ color: muted, lineHeight: 1.8 }}>{content.market}</Body>
            </div>
            <div>
              <SectionLabel>The Operational Challenge</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>Why {loc.label} operators hit walls</H2>
              <Body size={15} style={{ color: muted, lineHeight: 1.8 }}>{content.challenge}</Body>
            </div>
          </div>
        </div>
      </section>

      {/* Popular retreat types in this location — cross-linking */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>Popular in {loc.label}</SectionLabel>
          <H2 style={{ color: text, marginBottom: 40 }}>Retreat types that thrive here</H2>
          <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {relatedTypes.map((t, i) => (
              <div key={i} onClick={() => setPage("retreat-types")} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.background = `${t.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = card; }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{t.emoji}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14, color: text }}>{t.label}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: `${t.color}12`, color: t.color, display: "inline-block", marginTop: 8 }}>{loc.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OS solution */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <SectionLabel>The Solution</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>The {brand.productName} for {loc.label} retreat businesses</H2>
              <Body size={15} style={{ color: muted, marginBottom: 32, lineHeight: 1.8 }}>
                {brand.name} gives {loc.label}-based retreat operators the same operating system used by the most professional retreat businesses in the world. Participants experience a seamless, premium journey. Operators get their time back.
              </Body>
              <Btn onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {modules.slice(0, 5).map((m, i) => (
                <div key={i} onClick={() => setPage(`platform-${m.id}`)} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", background: card, border: `1px solid ${border}`, borderRadius: 12, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,70,229,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13.5, color: text }}>{m.name}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: muted }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "40px 24px", borderRight: i < 3 ? `1px solid ${border}` : "none", textAlign: "center" }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "clamp(28px,3vw,42px)", color: ACCENT, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <SectionLabel>{loc.label}</SectionLabel>
        <H2 style={{ color: text, marginBottom: 16 }}>Start running {loc.label} retreats<br />without the chaos</H2>
        <Body size={15} style={{ color: muted, maxWidth: 440, margin: "0 auto 32px" }}>Book a simulation tailored to your {loc.label} retreat business and see exactly what the OS delivers.</Body>
        <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 24 }}>
          <button onClick={() => setPage("locations")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, textDecoration: "underline" }}>← All Locations</button>
          <button onClick={() => setPage("pricing")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted, textDecoration: "underline" }}>View Pricing →</button>
        </div>
      </section>
    </div>
  );
};

/* ============================================================
   PHASE 4 — SEO MATRIX TEMPLATE PAGE
   Handles all 100 retreat-type × location combos
   ============================================================ */
const SEOMatrixPage = ({ typeId, locationId, dark, setPage }) => {
  const type = retreatTypes.find(t => t.id === typeId) || retreatTypes[0];
  const loc = locations.find(l => l.id === locationId) || locations[0];
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  // Related combos for internal linking
  const sameType = seoMatrix.filter(p => p.type.id === typeId && p.location.id !== locationId).slice(0, 4);
  const sameLoc = seoMatrix.filter(p => p.location.id === locationId && p.type.id !== typeId).slice(0, 4);

  return (
    <div style={{ background: bg, color: text }}>
      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 80, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={12} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 600, height: 500, background: `radial-gradient(ellipse at top right, ${type.color}10 0%, transparent 65%)`, zIndex: 0 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontFamily: "'Outfit',sans-serif", fontSize: 13, flexWrap: "wrap" }}>
            <button onClick={() => setPage("retreat-types")} style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 0 }}>Retreat Types</button>
            <span style={{ color: muted }}>→</span>
            <button onClick={() => setPage(`location-${loc.id}`)} style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 0 }}>{loc.label}</button>
            <span style={{ color: muted }}>→</span>
            <span style={{ color: text, fontWeight: 600 }}>{type.label} · {loc.label}</span>
          </div>
          <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 100, background: `${type.color}15`, marginBottom: 20, border: `1px solid ${type.color}30` }}>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12, color: type.color }}>{type.emoji} {type.label} Retreat Software · {loc.label}</span>
          </div>
          <H1 style={{ color: text, fontSize: "clamp(36px,5vw,68px)", marginBottom: 16 }}>
            {type.label} Retreat Software<br /><span style={{ color: ACCENT }}>{loc.label}</span>
          </H1>
          <Body size={18} style={{ color: muted, maxWidth: 620, marginBottom: 36 }}>
            Run your {type.label.toLowerCase()} retreat in {loc.label} without chaos. {brand.name} is the {brand.productName} built for {loc.label}-based {type.label.toLowerCase()} retreat operators.
          </Body>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
            <Btn variant="ghost" size="lg" style={{ color: text, borderColor: border }} onClick={() => setPage(`type-${type.id}`)}>See {type.label} Software →</Btn>
          </div>
        </div>
      </section>

      {/* Type description + location context */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
            <div>
              <SectionLabel>{type.label} Retreats</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>What makes {type.label.toLowerCase()} retreats unique</H2>
              <Body size={15} style={{ color: muted, lineHeight: 1.8 }}>{type.desc}</Body>
              <div style={{ marginTop: 28 }}>
                {["Participant-specific onboarding flows","Custom communication sequences for " + type.label.toLowerCase() + " formats","Relevant upsell triggers for " + type.label.toLowerCase() + " participants","Vendor coordination for " + type.label.toLowerCase() + " suppliers"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `${type.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: type.color, fontWeight: 800 }}>✓</span>
                    </div>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>{loc.label} Context</SectionLabel>
              <H2 style={{ color: text, marginBottom: 20 }}>Running in {loc.label}</H2>
              <Body size={15} style={{ color: muted, lineHeight: 1.8 }}>
                {locationContent[loc.id]?.market || `${loc.label} is a growing retreat destination with strong demand for ${type.label.toLowerCase()} formats. Operators in ${loc.label} use ${brand.name} to manage international participants, automated communications, and payment collection without the manual overhead.`}
              </Body>
              <div style={{ marginTop: 28, padding: "20px 24px", background: card, border: `1px solid ${border}`, borderRadius: 12 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: text, marginBottom: 8 }}>Popular in {loc.label}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(locationContent[loc.id]?.popular || ["Yoga","Wellness","Meditation"]).map(t => (
                    <span key={t} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: `${type.color}12`, color: type.color }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform modules */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <SectionLabel>The Platform</SectionLabel>
          <H2 style={{ color: text, marginBottom: 40 }}>Everything a {type.label.toLowerCase()} retreat in {loc.label} needs</H2>
          <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {modules.map((m, i) => (
              <div key={i} onClick={() => setPage(`platform-${m.id}`)} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 18, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = type.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
              >
                <div style={{ fontSize: 22, marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: text, marginBottom: 5 }}>{m.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, lineHeight: 1.55, color: muted }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Same type, other locations — internal linking */}
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
          <SectionLabel>{type.label} Retreat Software — Other Locations</SectionLabel>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            {sameType.map((p, i) => (
              <button key={i} onClick={() => setPage(`seo-${p.type.id}-${p.location.id}`)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8, background: card, border: `1px solid ${border}`, color: text, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = type.color; e.currentTarget.style.color = type.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = text; }}
              >{type.emoji} {type.label} — {p.location.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Same location, other types */}
      <section style={{ borderBottom: `1px solid ${border}`, background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
          <SectionLabel>Other Retreat Types in {loc.label}</SectionLabel>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            {sameLoc.map((p, i) => (
              <button key={i} onClick={() => setPage(`seo-${p.type.id}-${p.location.id}`)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8, background: card, border: `1px solid ${border}`, color: text, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = text; }}
              >{p.type.emoji} {p.type.label} — {loc.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <H2 style={{ color: text, marginBottom: 16 }}>Run your {type.label.toLowerCase()} retreat in {loc.label}<br /><span style={{ color: ACCENT }}>without the chaos</span></H2>
        <Body size={15} style={{ color: muted, maxWidth: 440, margin: "0 auto 32px" }}>Book a simulation built around your {type.label.toLowerCase()} retreat in {loc.label} and see exactly what the OS delivers.</Body>
        <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
        <div style={{ marginTop: 20, fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: muted }}>{pricing.founderSeatsRemaining} founder seats · {pricing.guarantee}</div>
      </section>
    </div>
  );
};

/* ============================================================
   PHASE 5 — HOMEPAGE: "What replaces what" section added inline
   (Inserted directly into HomePage above — handled via updated
   HomePage component below as a patch)
   ============================================================ */

/* ============================================================
   BLOG PAGE — full standalone blog with category filter
   ============================================================ */
const BlogPage = ({ dark, setPage }) => {
  const [cat, setCat] = useState("All");
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";

  const cats = ["All", ...Array.from(new Set(blogPosts.map(p => p.cat)))];
  const filtered = cat === "All" ? blogPosts : blogPosts.filter(p => p.cat === cat);

  // Pick a featured post (first, or first in category)
  const featured = filtered[0];
  const rest = filtered.slice(1);

  const catColors = { "Operations": "#4f46e5", "Revenue": "#10b981", "Marketing": "#f59e0b", "Scaling": "#8b5cf6", "Systems": "#0ea5e9", "Case Study": "#ef4444" };

  return (
    <div style={{ background: bg, color: text }}>
      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 60, borderBottom: `1px solid ${border}`, position: "relative", overflow: "hidden" }}>
        <FloatingParticles dark={dark} count={10} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ marginBottom: 20 }}><Tag dark={dark}>Blog</Tag></div>
          <H1 style={{ color: text, fontSize: "clamp(40px,6vw,72px)", marginBottom: 16 }}>
            The Retreat OS <span style={{ color: ACCENT }}>Blog</span>
          </H1>
          <Body size={16} style={{ color: muted, maxWidth: 480, margin: "0 auto" }}>
            Systems, operations, and growth strategies for serious retreat operators.
          </Body>
        </div>
      </section>

      {/* Category filter */}
      <section style={{ borderBottom: `1px solid ${border}`, position: "sticky", top: 64, zIndex: 90, background: dark ? "rgba(8,8,12,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", gap: 8, overflowX: "auto", paddingTop: 12, paddingBottom: 12 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600,
              padding: "6px 16px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
              background: cat === c ? ACCENT : card,
              color: cat === c ? "#fff" : muted,
              border: `1px solid ${cat === c ? ACCENT : border}`,
              transition: "all 0.15s",
            }}>{c}</button>
          ))}
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section style={{ borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div style={{ background: `linear-gradient(135deg, ${catColors[featured.cat] || ACCENT}20, ${catColors[featured.cat] || ACCENT}05)`, borderRadius: 20, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${border}` }}>
                <span style={{ fontSize: 64 }}>{guides.find(g => g.id === featured.guideId)?.icon || "📖"}</span>
              </div>
              <div>
                <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, background: `${catColors[featured.cat] || ACCENT}15`, marginBottom: 16, border: `1px solid ${catColors[featured.cat] || ACCENT}25` }}>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, color: catColors[featured.cat] || ACCENT, textTransform: "uppercase", letterSpacing: "0.06em" }}>Featured · {featured.cat}</span>
                </div>
                <H2 style={{ color: text, fontSize: "clamp(24px,3vw,38px)", marginBottom: 16 }}>{featured.title}</H2>
                <Body size={15} style={{ color: muted, marginBottom: 24 }}>A deep dive into how the world's most efficient retreat operators think about {featured.cat.toLowerCase()} — and what you can steal for your business.</Body>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: muted }}>{featured.read} read</span>
                  <Btn onClick={() => setPage("resources")}>Read Article →</Btn>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rest of posts grid */}
      <section>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
          {rest.length > 0 && (
            <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {rest.map((post, i) => (
                <div key={i} className="hover-lift" style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = catColors[post.cat] || ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
                  onClick={() => setPage("resources")}
                >
                  <div style={{ height: 120, background: `linear-gradient(135deg, ${catColors[post.cat] || ACCENT}15, ${catColors[post.cat] || ACCENT}05)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 36 }}>{guides[i % guides.length]?.icon || "📝"}</span>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 100, background: `${catColors[post.cat] || ACCENT}12`, marginBottom: 10 }}>
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 10, color: catColors[post.cat] || ACCENT, textTransform: "uppercase", letterSpacing: "0.06em" }}>{post.cat}</span>
                    </div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 14.5, color: text, lineHeight: 1.4, marginBottom: 12 }}>{post.title}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: muted }}>{post.read} read</span>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: ACCENT, fontWeight: 600 }}>Read →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px", color: muted, fontFamily: "'Outfit',sans-serif" }}>No posts in this category yet.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${border}`, padding: "80px 24px", textAlign: "center" }}>
        <H2 style={{ color: text, marginBottom: 16 }}>Ready to build your Retreat OS?</H2>
        <Body size={15} style={{ color: muted, maxWidth: 400, margin: "0 auto 28px" }}>Stop reading about systems. Book a simulation and see one built for your retreat business.</Body>
        <Btn size="lg" onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
      </section>
    </div>
  );
};

/* ============================================================
   404 / NOT FOUND PAGE
   ============================================================ */
const NotFoundPage = ({ dark, setPage }) => {
  const bg = dark ? "#08080c" : "#ffffff";
  const text = dark ? "#ffffff" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.45)";
  return (
    <div style={{ background: bg, minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: 120, color: "rgba(79,70,229,0.12)", lineHeight: 1 }}>404</div>
      <H2 style={{ color: text, marginBottom: 16, marginTop: -20 }}>Page not found</H2>
      <Body size={15} style={{ color: muted, maxWidth: 360, marginBottom: 32 }}>This page doesn't exist — but your Retreat OS does. Let's get you back on track.</Body>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Btn onClick={() => setPage("home")}>← Go Home</Btn>
        <Btn variant="ghost" style={{ color: text, borderColor: muted }} onClick={() => setPage("contact")}>{brand.ctaLabel} →</Btn>
      </div>
    </div>
  );
};


const RelatedLinks = ({ dark, setPage, links }) => {
  const muted = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.38)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const card = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";
  return (
    <div style={{ borderTop: `1px solid ${border}`, padding: "32px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", maxWidth: 1280, margin: "0 auto" }}>
      <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: muted, marginRight: 4 }}>Also explore:</span>
      {links.map(({ label, page: pg }, i) => (
        <button key={i} onClick={() => setPage(pg)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 8, background: card, border: `1px solid ${border}`, color: muted, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted; }}
        >{label}</button>
      ))}
    </div>
  );
};

/* ============================================================
   APP ROOT — Phases 3, 4, 5, 6 fully wired
   ============================================================ */
export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("home");
  const [, forceUpdate] = useState(0); // triggers re-render after Supabase loads

  // Load live data from Supabase — overrides siteConfig defaults
  useEffect(() => {
    loadSupabaseData().then(data => {
      if (!data) return; // no Supabase config — stay on siteConfig fallback
      if (data.brand)        brand        = data.brand;
      if (data.pricing)      pricing      = data.pricing;
      if (data.modules?.length)      modules      = data.modules;
      if (data.solutions?.length)    solutions    = data.solutions;
      if (data.retreatTypes?.length) retreatTypes = data.retreatTypes;
      if (data.locations?.length)    locations    = data.locations;
      if (data.seoMatrix?.length)    seoMatrix    = data.seoMatrix;
      if (data.blogPosts?.length)    blogPosts    = data.blogPosts;
      if (data.guides?.length)       guides       = data.guides;
      if (data.testimonials?.length) testimonials = data.testimonials;
      if (data.stats?.length)        stats        = data.stats;
      forceUpdate(n => n + 1);
    });
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const renderPage = () => {
    // Phase 3A: platform-{moduleId}
    if (page.startsWith("platform-")) {
      const moduleId = page.replace("platform-", "");
      return <PlatformFeaturePage moduleId={moduleId} dark={dark} setPage={setPage} />;
    }
    // Phase 3B: solution-{solutionId}
    if (page.startsWith("solution-")) {
      const solutionId = page.replace("solution-", "");
      return <SolutionDetailPage solutionId={solutionId} dark={dark} setPage={setPage} />;
    }
    // Phase 3C: location-{locationId}
    if (page.startsWith("location-")) {
      const locationId = page.replace("location-", "");
      return <LocationDetailPage locationId={locationId} dark={dark} setPage={setPage} />;
    }
    // Phase 4: seo-{typeId}-{locationId}
    if (page.startsWith("seo-")) {
      const parts = page.replace("seo-", "").split("-");
      const typeId = parts[0];
      const locationId = parts.slice(1).join("-");
      return <SEOMatrixPage typeId={typeId} locationId={locationId} dark={dark} setPage={setPage} />;
    }
    // type-{id} → Retreat Types page
    if (page.startsWith("type-")) {
      return <RetreatTypesPage dark={dark} setPage={setPage} />;
    }

    switch (page) {
      case "home":          return <HomePage dark={dark} setPage={setPage} />;
      case "platform":      return <PlatformPage dark={dark} setPage={setPage} />;
      case "solutions":     return <SolutionsPage dark={dark} setPage={setPage} />;
      case "pricing":       return <PricingSection dark={dark} setPage={setPage} />;
      case "about":         return <AboutPage dark={dark} setPage={setPage} />;
      case "contact":       return <ContactPage dark={dark} setPage={setPage} />;
      case "retreat-types": return <RetreatTypesPage dark={dark} setPage={setPage} />;
      case "resources":     return <ResourcesPage dark={dark} setPage={setPage} />;
      case "blog":          return <BlogPage dark={dark} setPage={setPage} />;
      case "locations":     return <LocationsPage dark={dark} setPage={setPage} />;
      case "case-studies":  return <CaseStudiesPage dark={dark} setPage={setPage} />;
      default:              return <NotFoundPage dark={dark} setPage={setPage} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: dark ? "#08080c" : "#ffffff", transition: "background 0.3s" }}>
        <Nav dark={dark} setDark={setDark} page={page} setPage={setPage} />
        <main>{renderPage()}</main>
        {/* Phase 6 — global internal linking bar on every page */}
        <RelatedLinks dark={dark} setPage={setPage} links={[
          { label: "Platform", page: "platform" },
          { label: "Pricing", page: "pricing" },
          { label: "Blog", page: "blog" },
          { label: "Retreat Types", page: "retreat-types" },
          { label: "Locations", page: "locations" },
          { label: "Case Studies", page: "case-studies" },
          { label: "Book Simulation", page: "contact" },
        ]} />
        <Footer dark={dark} setPage={setPage} />
      </div>
    </>
  );
}
