import { useState, useEffect } from "react";
import "./index.css";

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-sm border-b border-gray-200" : "bg-transparent"
    }`}>
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
//  CONTACT + FEEDBACK SECTION
// ─────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    rating: 0,
    category: "",
    feedback: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "General Impression",
    "Document Parsing",
    "Report Quality",
    "UI / UX Experience",
    "Speed & Performance",
    "Feature Request",
  ];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.rating || !form.feedback) return;
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#ffffff",
    fontSize: "0.9rem",
    padding: "12px 16px",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "Inter, sans-serif",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "8px",
  };

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      backgroundColor: "#030d22",
      overflow: "hidden",
      padding: "140px 32px 100px",
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
          background: "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-60px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,78,216,0.10) 0%, transparent 65%)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ textAlign: "center", marginBottom: "72px", animation: "fadeUp 0.6s 0.1s both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(59,130,246,0.35)",
            borderRadius: "9999px", padding: "6px 16px 6px 10px",
            marginBottom: "28px",
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
              We'd Love to Hear From You
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.6rem, 6vw, 4.5rem)", fontWeight: 800,
            color: "#ffffff", lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: "24px",
          }}>
            Get in <span style={{ color: "#60a5fa" }}>Touch</span>
          </h1>

          <p style={{
            fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.8,
            maxWidth: "620px", margin: "0 auto",
          }}>
            Impressed by the MVP? Whether you want to discuss our extraction architecture,
            explore scaling opportunities, or share feedback — we'd love to hear from you.
          </p>
        </div>

        {/* Two column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}>

          {/* ── LEFT: Contact info + direct reach ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Info card */}
            <div style={{
              backgroundColor: "#0c1f4a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "3px solid #2563eb",
              padding: "40px 36px",
              animation: "fadeUp 0.6s 0.2s both",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ height: "1px", width: "24px", backgroundColor: "#3b82f6" }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                  Direct Contact
                </span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                Let's build something together.
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.75, marginBottom: "32px" }}>
                We're two builders who genuinely care about the problem. Reach out directly and we'll get back to you within 24 hours.
              </p>

              {/* Contact details */}
              {[
                {
                  icon: (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  label: "Email",
                  value: "info@intellicredit.com",
                },
                {
                  icon: (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: "Location",
                  value: "Secunderabad, Telangana",
                },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 0",
                  borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                  <div style={{
                    width: "38px", height: "38px", flexShrink: 0,
                    backgroundColor: "rgba(37,99,235,0.15)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#60a5fa",
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#e2e8f0", fontWeight: 500 }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Why reach out card */}
            <div style={{
              backgroundColor: "#0c1f4a",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "32px 36px",
              animation: "fadeUp 0.6s 0.35s both",
            }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "20px" }}>
                Good reasons to reach out
              </p>
              {[
                "Discuss our document extraction architecture",
                "Explore scaling or productionising the platform",
                "Partnership or investment conversations",
                "Share feedback on the MVP demo",
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  marginBottom: i < 3 ? "14px" : "0",
                }}>
                  <div style={{
                    width: "20px", height: "20px", flexShrink: 0,
                    backgroundColor: "rgba(37,99,235,0.2)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: "1px",
                  }}>
                    <svg width="10" height="10" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* ── RIGHT: Feedback form ── */}
          <div style={{
            backgroundColor: "#0c1f4a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "3px solid #60a5fa",
            padding: "40px 36px",
            animation: "fadeUp 0.6s 0.3s both",
          }}>

            {submitted ? (
              /* Success state */
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{
                  width: "64px", height: "64px", margin: "0 auto 24px",
                  backgroundColor: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="28" height="28" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
                  Feedback Received!
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: "28px" }}>
                  Thank you for taking the time. We read every single response and use it to improve the platform.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", rating: 0, category: "", feedback: "" }); }}
                  style={{
                    backgroundColor: "rgba(37,99,235,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    color: "#93c5fd", fontSize: "0.85rem", fontWeight: 600,
                    padding: "10px 24px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(37,99,235,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(37,99,235,0.15)"; }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                  <div style={{ height: "1px", width: "24px", backgroundColor: "#60a5fa" }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                    Share Your Feedback
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Name + Email row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>Name *</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label style={labelStyle}>Company / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Vivriti Capital, Credit Analyst"
                      value={form.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    />
                  </div>

                  {/* Star rating */}
                  <div>
                    <label style={labelStyle}>Overall Rating *</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleChange("rating", star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            padding: "4px", transition: "transform 0.15s ease",
                            transform: hoveredStar >= star ? "scale(1.2)" : "scale(1)",
                          }}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24"
                            fill={(hoveredStar >= star || form.rating >= star) ? "#f59e0b" : "none"}
                            stroke={(hoveredStar >= star || form.rating >= star) ? "#f59e0b" : "#334155"}
                            strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </button>
                      ))}
                      {form.rating > 0 && (
                        <span style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 600, marginLeft: "4px" }}>
                          {["", "Poor", "Fair", "Good", "Great", "Excellent"][form.rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label style={labelStyle}>Feedback Category</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleChange("category", cat)}
                          style={{
                            padding: "6px 14px", cursor: "pointer",
                            fontSize: "0.75rem", fontWeight: 600,
                            border: `1px solid ${form.category === cat ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
                            backgroundColor: form.category === cat ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)",
                            color: form.category === cat ? "#93c5fd" : "#64748b",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (form.category !== cat) {
                              e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)";
                              e.currentTarget.style.color = "#94a3b8";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (form.category !== cat) {
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                              e.currentTarget.style.color = "#64748b";
                            }
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback textarea */}
                  <div>
                    <label style={labelStyle}>Your Feedback *</label>
                    <textarea
                      placeholder="Tell us what you liked, what could be improved, or what features you'd love to see..."
                      value={form.feedback}
                      onChange={(e) => handleChange("feedback", e.target.value)}
                      rows={5}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: "120px",
                        lineHeight: 1.7,
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.rating || !form.feedback}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                      backgroundColor: (!form.name || !form.email || !form.rating || !form.feedback)
                        ? "#1e3a8a" : "#2563eb",
                      color: (!form.name || !form.email || !form.rating || !form.feedback)
                        ? "#475569" : "#ffffff",
                      fontWeight: 700, fontSize: "0.95rem",
                      padding: "15px 24px", border: "none",
                      cursor: (!form.name || !form.email || !form.rating || !form.feedback)
                        ? "not-allowed" : "pointer",
                      boxShadow: (!form.name || !form.email || !form.rating || !form.feedback)
                        ? "none" : "0 4px 20px rgba(37,99,235,0.35)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (form.name && form.email && form.rating && form.feedback) {
                        e.currentTarget.style.backgroundColor = "#1d4ed8";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = (!form.name || !form.email || !form.rating || !form.feedback) ? "#1e3a8a" : "#2563eb";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Submit Feedback
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>

                  <p style={{ fontSize: "0.75rem", color: "#334155", textAlign: "center" }}>
                    * Required fields. Your feedback goes directly to the builders.
                  </p>

                </div>
              </>
            )}
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
  };
  const headingStyle = {
    color: "#ffffff", fontWeight: 700,
    fontSize: "0.875rem", marginBottom: "16px",
  };

  return (
    <footer style={{ backgroundColor: "#04091a", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px" }}>

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
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "300px", marginBottom: "0" }}>
              AI-powered B2B credit underwriting. Turn unstructured financial data into
              committee-ready reports in minutes, not days.
            </p>
          </div>

          <div>
            <p style={headingStyle}>Product</p>
            {["Features", "How It Works", "Pricing", "Try Demo"].map((l) => (
              <a key={l} href="#" style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
              >{l}</a>
            ))}
          </div>

          <div>
            <p style={headingStyle}>Company</p>
            {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((l) => (
              <a key={l} href="#" style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
              >{l}</a>
            ))}
          </div>

        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <p style={{ color: "#64748b", fontSize: "0.75rem" }}>© 2026 IntelliCredit. All rights reserved.</p>
          <p style={{ color: "#475569", fontSize: "0.75rem", fontFamily: "monospace" }}>B2B Credit Intelligence Platform</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────
export default function Contact() {
  return (
    <>
      <Navbar />
      <ContactPage />
      <Footer />
    </>
  );
}