import { useState, useEffect, useRef } from "react";
import "./index.css";

// ─────────────────────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─────────────────────────────────────────────────────────
//  SHARED COMPONENTS
// ─────────────────────────────────────────────────────────

function Counter({ to, suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * to));
      if (p < 1) requestAnimationFrame(step);
      else setVal(to);
    };
    requestAnimationFrame(step);
  }, [visible, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────
//  NAVBAR
// ─────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm border-b border-gray-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-700 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" fill="white" />
                <rect x="9" y="2" width="5" height="5" fill="white" opacity="0.5" />
                <rect x="2" y="9" width="5" height="5" fill="white" opacity="0.5" />
                <rect x="9" y="9" width="5" height="5" fill="white" />
              </svg>
            </div>
            <span className={`font-bold text-base tracking-tight transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}>
              IntelliCredit
            </span>
          </div>

     {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 nav-links">
  {[
    { label: "Home",     href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact",  href: "/contact" },
  ].map((link) => (
              <a
                key={link.label}
      href={link.href}
      className={`text-sm font-medium transition-colors hover:text-blue-600 ${
        scrolled ? "text-gray-600" : "text-white/80 hover:text-white"
      }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA button */}
          <a href="/demo">
  <button className="bg-blue-700 ...">Try Demo</button>
</a>

        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      backgroundColor: "#030d22", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>

      {/* ── Background decorations ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }} />
        {/* Top-right glow */}
        <div style={{
          position: "absolute", top: "-120px", right: "-120px",
          width: "720px", height: "720px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 65%)",
        }} />
        {/* Bottom-left glow */}
        <div style={{
          position: "absolute", bottom: "-100px", left: "-80px",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,78,216,0.14) 0%, transparent 65%)",
        }} />
        {/* Center vertical line */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)", width: "1px", height: "100%",
          background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.15) 40%, transparent)",
        }} />
      </div>

      {/* ── Hero content ── */}
      <div style={{
        position: "relative", zIndex: 1, maxWidth: "900px",
        margin: "0 auto", padding: "160px 32px 80px",
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center",
      }}>

        {/* Badge */}
        <div className="hero-badge" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: "rgba(37,99,235,0.15)",
          border: "1px solid rgba(59,130,246,0.35)",
          borderRadius: "9999px", padding: "6px 16px 6px 10px",
          marginBottom: "36px",
        }}>
          <span style={{
            width: "6px", height: "6px", backgroundColor: "#60a5fa",
            borderRadius: "50%", display: "inline-block",
            animation: "pulse 2s infinite",
          }} />
          <span style={{
            color: "#93c5fd", fontSize: "0.72rem",
            fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
          }}>
            AI-Powered Credit Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-headline" style={{
          fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800,
          color: "#ffffff", lineHeight: 1.05, letterSpacing: "-0.03em",
          marginBottom: "28px",
        }}>
          The Future of B2B<br />
          Credit{" "}
          <span style={{ color: "#60a5fa" }}>Underwriting.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{
          fontSize: "1.15rem", color: "#94a3b8", lineHeight: 1.75,
          maxWidth: "600px", marginBottom: "44px",
        }}>
          Transform raw, unstructured financial data into comprehensive,
          AI-backed investment reports in{" "}
          <span style={{ color: "#e2e8f0", fontWeight: 600 }}>minutes</span>, not days.
        </p>

        {/* Buttons */}
        <div className="hero-buttons" style={{
          display: "flex", gap: "14px",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <a href="/demo">

          <button
            className="btn-primary"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              backgroundColor: "#2563eb", color: "#ffffff",
              fontWeight: 700, fontSize: "0.95rem",
              padding: "14px 32px", border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1d4ed8";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            >
            Start Underwriting Demo
            <svg width="16" height="16" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
                </a>

          
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "rgba(0,0,0,0.25)",
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { val: 94,  suffix: "%",   label: "Accuracy Rate" },
              { val: 12,  suffix: "×",   label: "Faster Than Manual" },
             
              { val: 3,   suffix: " min", label: "Avg. Report Time" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "40px 100px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", lineHeight: 1, marginBottom: "6px" }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{
                  fontSize: "0.65rem", fontWeight: 600, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.16em",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  FEATURES
// ─────────────────────────────────────────────────────────

function FeatureRow({ num, icon, title, body, tag, reverse }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="feature-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: hovered ? "rgba(37,99,235,0.06)" : "transparent",
      }}
    >
      {/* Left: number + icon + title */}
      <div style={{
        padding: "52px 56px",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: "32px",
        order: reverse ? 1 : 0,
      }}>
        {/* Vertical step number */}
        <div style={{
          fontSize: "0.65rem", fontWeight: 800, fontFamily: "monospace",
          color: hovered ? "#93c5fd" : "#334155",
          letterSpacing: "0.14em",
          writingMode: "vertical-rl", textOrientation: "mixed",
          transform: "rotate(180deg)", flexShrink: 0,
          transition: "color 0.25s ease",
        }}>
          {num}
        </div>

        {/* Icon box */}
        <div style={{
          width: "64px", height: "64px", flexShrink: 0,
          backgroundColor: hovered ? "#1e3a8a" : "#0f1f45",
          border: `1px solid ${hovered ? "#3b82f6" : "#1e3065"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", transition: "all 0.25s ease",
        }}>
          {icon}
        </div>

        {/* Tag + title */}
        <div>
          <span style={{
            display: "inline-block",
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: hovered ? "#60a5fa" : "#3b82f6",
            backgroundColor: hovered ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
            padding: "3px 10px", marginBottom: "10px",
            transition: "all 0.25s ease",
          }}>
            {tag}
          </span>
          <h3 style={{
            fontSize: "1.1rem", fontWeight: 700,
            color: hovered ? "#ffffff" : "#e2e8f0",
            lineHeight: 1.3, margin: 0,
            transition: "color 0.25s ease",
          }}>
            {title}
          </h3>
        </div>
      </div>

      {/* Right: body text */}
      <div style={{
        padding: "52px 56px",
        display: "flex", alignItems: "center",
        order: reverse ? 0 : 1,
      }}>
        <p style={{
          fontSize: "0.95rem", lineHeight: 1.8,
          color: hovered ? "#cbd5e1" : "#94a3b8",
          margin: 0, transition: "color 0.25s ease",
        }}>
          {body}
        </p>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      num: "01", icon: "📄", tag: "Document AI",
      title: "Intelligent Document Ingestion",
      body: "Upload ALMs, Shareholding Patterns, and Annual Reports in any format. Our pipeline parses scanned PDFs, inconsistent layouts, and multi-language filings — extracting validated, structured data at scale.",
    },
    {
      num: "02", icon: "🤖", tag: "LLM-Powered",
      title: "Pre-Cognitive Analysis Engine",
      body: "Live secondary research, competitive benchmarking, and SWOT generation powered by advanced LLMs. Get a pre-populated analyst brief with cited sources in minutes, not hours.",
    },
    {
      num: "03", icon: "🧑‍💻", tag: "Analyst Tools",
      title: "Human-in-the-Loop Workflow",
      body: "Dynamic schema mapping with confidence scoring surfaces only the decisions that warrant analyst attention. Override, annotate, and calibrate — without losing any institutional memory.",
    },
    {
      num: "04", icon: "📊", tag: "Export-Ready",
      title: "Instant Committee Reports",
      body: "Download a fully justified, explainable credit decision — formatted, referenced, and ready for the investment committee. No more all-nighters before a credit memo deadline.",
    },
  ];

  return (
    <section style={{
      backgroundColor: "#071028",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="features-grid-header" style={{
          padding: "80px 0 56px",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "48px", alignItems: "end",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ height: "1px", width: "32px", backgroundColor: "#3b82f6" }} />
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, color: "#60a5fa",
                textTransform: "uppercase", letterSpacing: "0.18em",
              }}>
                Platform Capabilities
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(1.9rem, 3vw, 2.8rem)", fontWeight: 800,
              color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.12, margin: 0,
            }}>
              Every layer of underwriting,{" "}
              <span style={{ color: "#60a5fa" }}>reimagined.</span>
            </h2>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1.8, margin: 0 }}>
            From document ingestion to committee-ready output, our platform eliminates
            the friction that costs analysts days of manual work — without sacrificing
            the rigour your decisions demand.
          </p>
        </div>

        {/* Feature rows */}
        {features.map((f, i) => (
          <FeatureRow key={i} {...f} reverse={i % 2 !== 0} />
        ))}

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  PROCESS
// ─────────────────────────────────────────────────────────

function ProcessStep({ num, icon, title, body, isLast }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="process-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        backgroundColor: hovered ? "#f0f5ff" : "#ffffff",
        border: `1px solid ${hovered ? "#bfdbfe" : "#e5e7eb"}`,
        padding: "40px 36px",
        boxShadow: hovered
          ? "0 8px 32px rgba(37,99,235,0.10)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Left blue accent */}
      <div className="step-accent" style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: "3px", backgroundColor: "#2563eb",
        transform: hovered ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: "top", transition: "transform 0.28s ease",
      }} />

      {/* Step badge */}
      <div className="step-badge" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "36px", height: "36px",
        backgroundColor: hovered ? "#2563eb" : "#eff6ff",
        color: hovered ? "#ffffff" : "#2563eb",
        fontSize: "0.8rem", fontWeight: 800, fontFamily: "monospace",
        marginBottom: "24px",
        border: `1px solid ${hovered ? "#2563eb" : "#bfdbfe"}`,
        transition: "all 0.28s ease",
      }}>
        {num}
      </div>

      {/* Icon */}
      <div style={{ fontSize: "1.8rem", marginBottom: "16px", lineHeight: 1 }}>{icon}</div>

      {/* Title */}
      <h3 className="step-title" style={{
        fontSize: "1rem", fontWeight: 700,
        color: hovered ? "#1e3a8a" : "#111827",
        marginBottom: "12px", lineHeight: 1.3,
        transition: "color 0.28s ease",
      }}>
        {title}
      </h3>

      {/* Body */}
      <p className="step-body" style={{
        fontSize: "0.875rem", lineHeight: 1.75,
        color: hovered ? "#1e40af" : "#4b5563",
        margin: 0, transition: "color 0.28s ease",
      }}>
        {body}
      </p>

      {/* Connector arrow */}
      {!isLast && (
        <div style={{
          position: "absolute", top: "52px", right: "-14px",
          width: "26px", height: "26px",
          backgroundColor: hovered ? "#2563eb" : "#f3f4f6",
          border: `1px solid ${hovered ? "#2563eb" : "#e5e7eb"}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2, transition: "all 0.28s ease",
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke={hovered ? "#ffffff" : "#9ca3af"}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5h6M5.5 2l3 3-3 3" />
          </svg>
        </div>
      )}
    </div>
  );
}

function Process() {
  const steps = [
    { num: "01", icon: "📤", title: "Upload Documents",  body: "Drop ALMs, annual reports, and filings in any format. We handle every layout, language, and scan quality." },
    { num: "02", icon: "⚡", title: "AI Enrichment",     body: "LLMs run live research, ratio analysis, and SWOT generation automatically — no manual data entry needed." },
    { num: "03", icon: "🔍", title: "Analyst Review",    body: "Confidence scores surface only the decisions that need your attention. Approve, adjust, and annotate in minutes." },
    { num: "04", icon: "📋", title: "Export Report",     body: "Download a committee-ready PDF with full justification, financial ratios, and cited sources. Done." },
  ];

  return (
    <section style={{
      backgroundColor: "#f8faff", padding: "100px 0",
      borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb",
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "56px", gap: "32px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ height: "1px", width: "32px", backgroundColor: "#2563eb" }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.18em" }}>
                How It Works
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800,
              color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0,
            }}>
              From raw files to{" "}
              <span style={{ color: "#1d4ed8" }}>credit decision</span>
              {" "}in four steps.
            </h2>
          </div>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.75, maxWidth: "360px", margin: 0 }}>
            A streamlined workflow designed to eliminate manual effort at every stage of the underwriting process.
          </p>
        </div>

        {/* Step cards */}
        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {steps.map((s, i) => (
            <ProcessStep key={i} {...s} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* Progress timeline */}
        <div style={{ marginTop: "48px", display: "flex", alignItems: "center" }}>
          {steps.map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: "10px", height: "10px", borderRadius: "50%",
                backgroundColor: "#2563eb", flexShrink: 0,
                boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
              }} />
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: "1px", backgroundColor: "#bfdbfe" }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginTop: "10px" }}>
          {steps.map((s, i) => (
            <span key={i} style={{
              fontSize: "0.7rem", color: "#6b7280",
              fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.08em",
            }}>
              STEP {s.num}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  METRICS
// ─────────────────────────────────────────────────────────

function MetricCard({ icon, stat, label, desc, tag }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="metric-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#0f2a5c" : "#0c1f4a",
        padding: "40px 36px",
        borderTop: `3px solid ${hovered ? "#60a5fa" : "#2563eb"}`,
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Icon + tag */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{
          width: "52px", height: "52px",
          backgroundColor: hovered ? "#1d4ed8" : "#1e3a8a",
          border: `1px solid ${hovered ? "#3b82f6" : "#1e40af"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem", transition: "all 0.25s ease",
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#60a5fa",
          backgroundColor: "rgba(37,99,235,0.15)",
          border: "1px solid rgba(59,130,246,0.3)",
          padding: "4px 10px",
        }}>
          {tag}
        </span>
      </div>

      {/* Stat number */}
      <div style={{ fontSize: "3.2rem", fontWeight: 800, color: "#ffffff", lineHeight: 1, marginBottom: "8px", letterSpacing: "-0.02em" }}>
        {stat}
      </div>

      {/* Label */}
      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "16px" }}>
        {label}
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "16px" }} />

      {/* Description */}
      <p style={{ fontSize: "0.875rem", color: "#cbd5e1", lineHeight: 1.7 }}>
        {desc}
      </p>
    </div>
  );
}

function Metrics() {
  const items = [
    {
      icon: "⚡", stat: "12×", label: "Faster Underwriting", tag: "Speed",
      desc: "What used to take 4 days now completes in under 3 hours — consistently across all document types and formats.",
    },
    {
      icon: "🎯", stat: "94.1%", label: "Model Accuracy", tag: "Precision",
      desc: "Validated across 1,200+ real-world B2B credit assessments spanning NBFCs, HFCs, and corporate lenders.",
    },
    {
      icon: "🏦", stat: "₹800Cr+", label: "Credit Assessed", tag: "Scale",
      desc: "Total credit reviewed through the platform to date, with zero committee escalations due to data quality issues.",
    },
  ];

  return (
    <section style={{
      backgroundColor: "#071028", padding: "96px 0",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          marginBottom: "56px", gap: "32px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ height: "1px", width: "32px", backgroundColor: "#3b82f6" }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.18em" }}>
                By The Numbers
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0 }}>
              Results that speak<br />
              <span style={{ color: "#60a5fa" }}>for themselves.</span>
            </h2>
          </div>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.75, maxWidth: "380px", margin: 0 }}>
            Measured across real deployments with India's leading NBFCs, HFCs, and corporate lending desks.
          </p>
        </div>

        {/* Cards */}
        <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", backgroundColor: "rgba(255,255,255,0.06)" }}>
          {items.map((m, i) => <MetricCard key={i} {...m} />)}
        </div>

        {/* Trust strip */}
        <div style={{
          marginTop: "56px", paddingTop: "40px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center",
          gap: "32px", flexWrap: "wrap", justifyContent: "center",
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.16em" }}>
            Trusted by teams at
          </span>
          {["Leading NBFC", "HFC Group", "Credit Desk Co.", "FinServ Ltd"].map((name) => (
            <div key={name} style={{
              padding: "8px 20px",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(255,255,255,0.04)",
              fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8",
              letterSpacing: "0.02em",
            }}>
              {name}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  CTA
// ─────────────────────────────────────────────────────────

function CTA() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "100px 0", borderTop: "4px solid #2563eb" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="cta-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

          {/* Left: headline + sub */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ height: "1px", width: "32px", backgroundColor: "#2563eb" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.18em" }}>
                Get Started Today
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "20px" }}>
              Your analysts deserve<br />
              <span style={{ color: "#2563eb" }}>better tools.</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.8, maxWidth: "440px" }}>
              Join leading credit teams who have cut underwriting time by 90% without
              compromising on depth, accuracy, or auditability.
            </p>
          </div>

          {/* Right: action card */}
          <div style={{ backgroundColor: "#f8faff", border: "1px solid #dbeafe", padding: "48px 44px" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "28px" }}>
              Two ways to get started
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
              {/* Primary button */}
              <a href="/demo">

              <button
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: "#2563eb", color: "#ffffff",
                  fontWeight: 700, fontSize: "0.95rem",
                  padding: "16px 24px", border: "none",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1d4ed8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2563eb"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                <span>Start Underwriting Demo</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
                </a>

              
            </div>

            {/* Trust strip */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" }}>
              <svg width="16" height="16" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                No setup fee · Free pilot for qualified teams · SOC 2 compliant
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────

function Footer() {
  const linkStyle = {
    color: "#cbd5e1", fontSize: "0.875rem",
    textDecoration: "none", display: "block", marginBottom: "12px",
    transition: "color 0.2s ease",
  };
  const headingStyle = { color: "#ffffff", fontWeight: 700, fontSize: "0.875rem", marginBottom: "16px" };

  return (
    <footer style={{ backgroundColor: "#04091a", borderTop: "1px solid rgba(255,255,255,0.12)" }}>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto" style={{ padding: "64px 32px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "34px", height: "34px", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" fill="white" />
                  <rect x="9" y="2" width="5" height="5" fill="white" opacity="0.6" />
                  <rect x="2" y="9" width="5" height="5" fill="white" opacity="0.6" />
                  <rect x="9" y="9" width="5" height="5" fill="white" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>IntelliCredit</span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "300px", marginBottom: "24px" }}>
              AI-powered B2B credit underwriting. Turn unstructured financial data into
              committee-ready reports in minutes, not days.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {["LI", "TW", "GH"].map((s) => (
                <div key={s} style={{
                  width: "34px", height: "34px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#94a3b8", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#60a5fa"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#94a3b8"; }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <p style={headingStyle}>Product</p>
            {["Features", "How It Works", "Pricing", "Try Demo"].map((l) => (
              <a key={l} href="#" className="footer-link" style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Company links */}
          <div>
            <p style={headingStyle}>Company</p>
            {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((l) => (
              <a key={l} href="#" className="footer-link" style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
              >
                {l}
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 32px" }}>
        <div className="max-w-7xl mx-auto" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ color: "#64748b", fontSize: "0.75rem" }}>© 2026 INtelliCredit. All rights reserved.</p>
          <p style={{ color: "#475569", fontSize: "0.75rem", fontFamily: "monospace" }}>B2B Credit Intelligence Platform</p>
        </div>
      </div>

    </footer>
  );
}

// ─────────────────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Process />
      <Metrics />
      <CTA />
      <Footer />
    </>
  );
}