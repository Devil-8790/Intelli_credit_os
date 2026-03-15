import { useState, useEffect } from "react";
import "./index.css";


// ─────────────────────────────────────────────────────────
//  NAVBAR (same as main site)
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
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Home",     href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Contact",  href: "/contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  scrolled
                    ? "text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                    : "text-sm font-medium text-white transition-colors hover:text-blue-600"
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a href="/demo">
  <button className="bg-blue-700 ...">Try Demo</button>
</a>

        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────
//  MISSION SECTION
// ─────────────────────────────────────────────────────────
function Mission() {
  return (
    <section style={{
      position: "relative",
      backgroundColor: "#030d22",
      overflow: "hidden",
      padding: "160px 32px 120px",
    }}>
      {/* Background decorations */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }} />
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-60px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 65%)",
        }} />
        {/* Center line */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)", width: "1px", height: "100%",
          background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.12) 40%, transparent)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>

        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          backgroundColor: "rgba(37,99,235,0.15)",
          border: "1px solid rgba(59,130,246,0.35)",
          borderRadius: "9999px", padding: "6px 16px 6px 10px",
          marginBottom: "36px",
          animation: "fadeUp 0.6s 0.1s both",
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
            Who We Are
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(2.6rem, 6vw, 4.8rem)", fontWeight: 800,
          color: "#ffffff", lineHeight: 1.05, letterSpacing: "-0.03em",
          marginBottom: "32px",
          animation: "fadeUp 0.6s 0.25s both",
        }}>
          Our <span style={{ color: "#60a5fa" }}>Mission</span>
        </h1>

        {/* Mission text */}
        <p style={{
          fontSize: "1.15rem", color: "#94a3b8", lineHeight: 1.85,
          marginBottom: "28px",
          animation: "fadeUp 0.6s 0.4s both",
        }}>
          We built this platform to tackle one of the most significant bottlenecks
          in B2B FinTech: the manual extraction of non-standard financial data.
        </p>
        <p style={{
          fontSize: "1.15rem", lineHeight: 1.85,
          color: "#e2e8f0",
          animation: "fadeUp 0.6s 0.5s both",
        }}>
          Our goal is to <span style={{ color: "#60a5fa", fontWeight: 600 }}>empower Credit Analysts</span>,
          not replace them — by automating the busywork and
          highlighting the risk that actually matters.
        </p>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: "16px", marginTop: "56px",
          animation: "fadeUp 0.6s 0.6s both",
        }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(59,130,246,0.4))" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(59,130,246,0.4))" }} />
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  TEAM CARD
// ─────────────────────────────────────────────────────────
function TeamCard({ name, role, description, linkedin, github, initials, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#0f2a5c" : "#0c1f4a",
        border: `1px solid ${hovered ? "#3b82f6" : "rgba(255,255,255,0.08)"}`,
        borderTop: `3px solid ${hovered ? "#60a5fa" : "#2563eb"}`,
        padding: "48px 40px",
        transition: "all 0.3s ease",
        boxShadow: hovered ? "0 16px 48px rgba(37,99,235,0.2)" : "none",
        animation: `fadeUp 0.6s ${delay}s both`,
      }}
    >
      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
        <div style={{
          width: "96px", height: "96px",
          backgroundColor: hovered ? "#1d4ed8" : "#1e3a8a",
          border: `2px solid ${hovered ? "#60a5fa" : "#2563eb"}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", fontWeight: 800, color: "#ffffff",
          transition: "all 0.3s ease",
          boxShadow: hovered ? "0 0 32px rgba(37,99,235,0.4)" : "none",
        }}>
          {initials}
        </div>
      </div>

      {/* Name + role */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h3 style={{
          fontSize: "1.2rem", fontWeight: 700,
          color: "#ffffff", marginBottom: "6px", letterSpacing: "-0.01em",
        }}>
          {name}
        </h3>
        <span style={{
          display: "inline-block",
          fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#60a5fa",
          backgroundColor: "rgba(37,99,235,0.15)",
          border: "1px solid rgba(59,130,246,0.3)",
          padding: "4px 12px",
        }}>
          {role}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", marginBottom: "24px" }} />

      {/* Description */}
      <p style={{
        fontSize: "0.9rem", lineHeight: 1.75,
        color: hovered ? "#cbd5e1" : "#94a3b8",
        textAlign: "center", marginBottom: "32px",
        transition: "color 0.3s ease",
      }}>
        {description}
      </p>

      {/* Links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 16px",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#cbd5e1", fontSize: "0.82rem", fontWeight: 500,
              textDecoration: "none", transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(37,99,235,0.15)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
              e.currentTarget.style.color = "#93c5fd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#cbd5e1";
            }}
          >
            {/* LinkedIn icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            LinkedIn Profile
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 16px",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#cbd5e1", fontSize: "0.82rem", fontWeight: 500,
              textDecoration: "none", transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(37,99,235,0.15)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
              e.currentTarget.style.color = "#93c5fd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#cbd5e1";
            }}
          >
            {/* GitHub icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
            </svg>
            GitHub Profile
          </a>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  TEAM SECTION
// ─────────────────────────────────────────────────────────
function Team() {
  const members = [
    {
      name: "Karan Sahni",
      role: "AI & Backend Lead",
      initials: "KS",
      description:
        "Architected the FastAPI backend and the dynamic PDF extraction engine using advanced LLMs to parse non-standard financial documents at scale.",
      linkedin: "https://www.linkedin.com/in/karan-sahani-77307b282/",
      github: "https://github.com/Devil-8790",
      delay: 0.1,
    },
    {
      name: "Srinath Gudala",
      role: "Frontend & UX Lead",
      initials: "SG",
      description:
        "Designed the intuitive human-in-the-loop dashboard and the state-management architecture that keeps analysts in full control of every decision.",
      linkedin: "https://linkedin.com/in/srinath-gudala",
      github: "https://github.com/bobby-2106",
      delay: 0.25,
    },
    {
      name: "suraj C",
      role: "backend Lead",
      initials: "SC",
      description:
       "Architected the FastAPI backend and dynamic PDF extraction engine using advanced LLMs.                                                       ",
      linkedin: "https://www.linkedin.com/in/suraj-kumar-65a550335/",
      github: "https://github.com/find143",
      delay: 0.25,
    },
    {
      name: "Abin Srikanth",
      role: "Infra Lead",
      initials: "AS",
      description:
       "Built the document parsing pipeline that handles scanned, non-standard financial filings across formats.",
      linkedin: "https://www.linkedin.com/in/abin-srikanth-17732a37b/",
      github: "https://github.com/abin207",
      delay: 0.25,
    }
  ];

  return (
    <section style={{
      backgroundColor: "#071028",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "100px 32px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "10px", marginBottom: "16px",
          }}>
            <div style={{ height: "1px", width: "32px", backgroundColor: "#3b82f6" }} />
            <span style={{
              fontSize: "0.68rem", fontWeight: 700, color: "#60a5fa",
              textTransform: "uppercase", letterSpacing: "0.18em",
            }}>
              The Team
            </span>
            <div style={{ height: "1px", width: "32px", backgroundColor: "#3b82f6" }} />
          </div>
          <h2 style={{
            fontSize: "clamp(1.9rem, 3.5vw, 3rem)", fontWeight: 800,
            color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0,
          }}>
            Meet the <span style={{ color: "#60a5fa" }}>Builders</span>
          </h2>
        </div>

        {/* Team cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          maxWidth: "860px",
          margin: "0 auto",
        }}>
          {members.map((m, i) => (
            <TeamCard key={i} {...m} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
//  FOOTER (same as main site)
// ─────────────────────────────────────────────────────────
function Footer() {
  const linkStyle = {
    color: "#cbd5e1", fontSize: "0.875rem",
    textDecoration: "none", display: "block", marginBottom: "12px",
  };
  const headingStyle = {
    color: "#ffffff", fontWeight: 700,
    fontSize: "0.875rem", marginBottom: "16px",
  };

  return (
    <footer style={{ backgroundColor: "#04091a", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "34px", height: "34px", backgroundColor: "#2563eb",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" fill="white" />
                  <rect x="9" y="2" width="5" height="5" fill="white" opacity="0.6" />
                  <rect x="2" y="9" width="5" height="5" fill="white" opacity="0.6" />
                  <rect x="9" y="9" width="5" height="5" fill="white" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>
                IntelliCredit
              </span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "300px", marginBottom: "24px" }}>
              AI-powered B2B credit underwriting. Turn unstructured financial data into
              committee-ready reports in minutes, not days.
            </p>
          </div>

          {/* Product */}
          <div>
            <p style={headingStyle}>Product</p>
            {["Features", "How It Works", "Pricing", "Try Demo"].map((l) => (
              <a key={l} href="#" style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={headingStyle}>Company</p>
            {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((l) => (
              <a key={l} href="#" style={linkStyle}
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
        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "8px",
        }}>
          <p style={{ color: "#64748b", fontSize: "0.75rem" }}>
            © 2026 IntelliCredit. All rights reserved.
          </p>
          <p style={{ color: "#475569", fontSize: "0.75rem", fontFamily: "monospace" }}>
            B2B Credit Intelligence Platform
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────
export default function About() {
  return (
    <>
      <Navbar />
      <Mission />
      <Team />
      <Footer />
    </>
  );
}