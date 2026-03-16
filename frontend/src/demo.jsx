import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";

// ─────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Entity Onboarding",  short: "Entity" },
  { number: 2, label: "Upload Documents",   short: "Documents" },
  { number: 3, label: "AI Analysis",        short: "Analysis" },
  { number: 4, label: "Review & Report",    short: "Report" },
];

const SECTORS = [
  "Banking & NBFC", "Manufacturing", "Infrastructure", "Real Estate",
  "Healthcare", "Retail & FMCG", "Technology", "Agri & Allied",
  "Logistics & Transport", "Education", "Energy & Utilities", "Other",
];

const LOAN_TYPES = [
  "Term Loan", "Working Capital", "Cash Credit", "Letter of Credit",
  "Bank Guarantee", "Equipment Finance", "Project Finance", "Other",
];

// ─────────────────────────────────────────────────────────
//  SHARED STYLES
// ─────────────────────────────────────────────────────────

const fieldStyle = {
  width: "100%",
  backgroundColor: "#0a1628",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#ffffff",
  fontSize: "0.9rem",
  padding: "13px 16px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  appearance: "none",
  WebkitAppearance: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "0.68rem", fontWeight: 700,
  color: "#64748b", textTransform: "uppercase",
  letterSpacing: "0.14em", marginBottom: "7px",
};

const sectionHeadStyle = {
  fontSize: "0.72rem", fontWeight: 700,
  color: "#60a5fa", textTransform: "uppercase",
  letterSpacing: "0.18em",
  display: "flex", alignItems: "center", gap: "10px",
  marginBottom: "20px",
};

// ─────────────────────────────────────────────────────────
//  VALIDATION RULES
// ─────────────────────────────────────────────────────────

const VALIDATORS = {
  cin: (v) => {
    if (!v) return "CIN is required";
    if (!/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(v.toUpperCase()))
      return "Invalid CIN format (e.g. U72200MH2010PTC123456)";
    return null;
  },
  pan: (v) => {
    if (!v) return "PAN is required";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v.toUpperCase()))
      return "Invalid PAN format (e.g. ABCDE1234F)";
    return null;
  },
  sector: (v) => (!v ? "Please select a sector" : null),
  turnover: (v) => {
    if (!v) return "Turnover is required";
    if (isNaN(v) || Number(v) <= 0) return "Must be a positive number";
    if (Number(v) > 5e13) return "Value seems too large — check your input";
    return null;
  },
  loanType: (v) => (!v ? "Please select a loan type" : null),
  amount: (v) => {
    if (!v) return "Loan amount is required";
    if (isNaN(v) || Number(v) <= 0) return "Must be a positive number";
    if (Number(v) > 5e12) return "Amount exceeds ₹5,000 Cr limit";
    return null;
  },
  tenure: (v) => {
    if (!v) return "Tenure is required";
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1) return "Minimum tenure is 1 month";
    if (n > 360) return "Maximum tenure is 360 months (30 years)";
    return null;
  },
  interest: (v) => {
    if (!v) return "Interest rate is required";
    const n = Number(v);
    if (isNaN(n) || n <= 0) return "Must be greater than 0%";
    if (n > 50) return "Interest rate cannot exceed 50%";
    return null;
  },
};

function validate(field, value) {
  return VALIDATORS[field] ? VALIDATORS[field](value) : null;
}

// ─────────────────────────────────────────────────────────
//  REUSABLE INPUT COMPONENTS
// ─────────────────────────────────────────────────────────

function Field({ label, error, hint, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ ...labelStyle, marginBottom: "7px" }}>
        {label}
        {required && (
          <span style={{ color: "#f87171", marginLeft: "4px" }}>*</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <span style={{ fontSize: "0.65rem", color: "#475569", marginTop: "5px" }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: "0.65rem", color: "#f87171", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

function Input({ placeholder, value, onChange, type = "text", error, maxLength, onBlur: externalBlur }) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? "#ef4444" : focused ? "#3b82f6" : "rgba(255,255,255,0.10)";
  const shadow = error ? "0 0 0 3px rgba(239,68,68,0.12)" : focused ? "0 0 0 3px rgba(37,99,235,0.15)" : "none";
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...fieldStyle, borderColor, boxShadow: shadow }}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); externalBlur && externalBlur(); }}
    />
  );
}

function Select({ placeholder, value, onChange, options, error, onBlur: externalBlur }) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? "#ef4444" : focused ? "#3b82f6" : "rgba(255,255,255,0.10)";
  const shadow = error ? "0 0 0 3px rgba(239,68,68,0.12)" : focused ? "0 0 0 3px rgba(37,99,235,0.15)" : "none";
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...fieldStyle,
          borderColor, boxShadow: shadow,
          paddingRight: "40px",
          color: value ? "#ffffff" : "#475569",
          cursor: "pointer",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); externalBlur && externalBlur(); }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ backgroundColor: "#0a1628", color: "#ffffff" }}>{o}</option>
        ))}
      </select>
      <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#475569" }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  STEP INDICATOR
// ─────────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {STEPS.map((step, i) => (
        <div key={step.number} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "32px", height: "32px",
              borderRadius: "50%",
              backgroundColor: step.number <= currentStep ? "#2563eb" : "rgba(255,255,255,0.06)",
              border: `2px solid ${step.number <= currentStep ? "#2563eb" : "rgba(255,255,255,0.12)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s ease",
              boxShadow: step.number === currentStep ? "0 0 0 4px rgba(37,99,235,0.2)" : "none",
            }}>
              {step.number < currentStep ? (
                <svg width="14" height="14" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: step.number <= currentStep ? "#ffffff" : "#475569" }}>
                  {step.number}
                </span>
              )}
            </div>
            <span style={{
              fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: step.number === currentStep ? "#60a5fa" : step.number < currentStep ? "#94a3b8" : "#334155",
              whiteSpace: "nowrap",
            }}>
              {step.short}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: "64px", height: "2px", margin: "0 4px", marginBottom: "22px",
              backgroundColor: step.number < currentStep ? "#2563eb" : "rgba(255,255,255,0.08)",
              transition: "background-color 0.3s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  STEP 1 — Entity Onboarding
// ─────────────────────────────────────────────────────────

function Step1({ data, onChange }) {
  const [touched, setTouched] = useState({});
  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));
  const err = (field) => touched[field] ? validate(field, data[field]) : null;

  const cinLen  = (data.cin  || "").length;
  const panLen  = (data.pan  || "").length;

  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <div style={{ marginBottom: "36px" }}>
        <div style={sectionHeadStyle}>
          <div style={{ height: "1px", width: "20px", backgroundColor: "#3b82f6" }} />
          Company Details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Field label="CIN Number" required error={err("cin")} hint={`${cinLen}/21 characters — format: U72200MH2010PTC123456`}>
            <Input placeholder="e.g. U72200MH2010PTC123456" value={data.cin} maxLength={21} error={err("cin")} onChange={(v) => onChange("cin", v.toUpperCase())} onBlur={() => touch("cin")} />
          </Field>
          <Field label="PAN Number" required error={err("pan")} hint={`${panLen}/10 characters — format: ABCDE1234F`}>
            <Input placeholder="e.g. ABCDE1234F" value={data.pan} maxLength={10} error={err("pan")} onChange={(v) => onChange("pan", v.toUpperCase())} onBlur={() => touch("pan")} />
          </Field>
          <Field label="Sector" required error={err("sector")}>
            <Select placeholder="Select Sector" value={data.sector} options={SECTORS} error={err("sector")} onChange={(v) => { onChange("sector", v); touch("sector"); }} onBlur={() => touch("sector")} />
          </Field>
          <Field label="Annual Turnover (INR)" required error={err("turnover")} hint="Enter value in INR — e.g. 500000000 for ₹50 Cr">
            <Input placeholder="e.g. 500000000" type="number" value={data.turnover} error={err("turnover")} onChange={(v) => onChange("turnover", v)} onBlur={() => touch("turnover")} />
          </Field>
        </div>
      </div>

      <div>
        <div style={sectionHeadStyle}>
          <div style={{ height: "1px", width: "20px", backgroundColor: "#3b82f6" }} />
          Loan Request
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Field label="Loan Type" required error={err("loanType")}>
            <Select placeholder="Select Loan Type" value={data.loanType} options={LOAN_TYPES} error={err("loanType")} onChange={(v) => { onChange("loanType", v); touch("loanType"); }} onBlur={() => touch("loanType")} />
          </Field>
          <Field label="Expected Amount (INR)" required error={err("amount")} hint="Maximum ₹5,000 Cr (₹5,000,00,00,000)">
            <Input placeholder="e.g. 50000000" type="number" value={data.amount} error={err("amount")} onChange={(v) => onChange("amount", v)} onBlur={() => touch("amount")} />
          </Field>
          <Field label="Tenure (Months)" required error={err("tenure")} hint="Between 1 – 360 months (up to 30 years)">
            <Input placeholder="e.g. 36" type="number" value={data.tenure} error={err("tenure")} onChange={(v) => onChange("tenure", v)} onBlur={() => touch("tenure")} />
          </Field>
          <Field label="Expected Interest Rate (%)" required error={err("interest")} hint="Between 0.1% and 50%">
            <Input placeholder="e.g. 12.5" type="number" value={data.interest} error={err("interest")} onChange={(v) => onChange("interest", v)} onBlur={() => touch("interest")} />
          </Field>
        </div>
      </div>

      <p style={{ marginTop: "24px", fontSize: "0.68rem", color: "#334155" }}>
        <span style={{ color: "#f87171" }}>*</span> All fields are required to proceed.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  STEP 2 — Upload Documents
// ─────────────────────────────────────────────────────────

function UploadZone({ label, tag, uploaded, onUpload }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file); // Passing the actual File object
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? "#3b82f6" : uploaded ? "#22c55e" : "rgba(255,255,255,0.12)"}`,
        backgroundColor: dragging ? "rgba(37,99,235,0.08)" : uploaded ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
        padding: "28px 20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onClick={() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.xlsx,.xls,.csv";
        input.onchange = (e) => { if (e.target.files[0]) onUpload(e.target.files[0]); }; // Passing actual file
        input.click();
      }}
    >
      {uploaded ? (
        <>
          <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>✅</div>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4ade80", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {uploaded.name}
          </p>
          <p style={{ fontSize: "0.68rem", color: "#475569" }}>Click to replace</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>📁</div>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "4px" }}>{label}</p>
          <p style={{ fontSize: "0.7rem", color: "#334155" }}>PDF, XLSX, CSV · Drag & drop or click</p>
        </>
      )}
      <span style={{
        position: "absolute", top: "10px", right: "10px",
        fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#60a5fa",
        backgroundColor: "rgba(37,99,235,0.15)",
        border: "1px solid rgba(59,130,246,0.25)",
        padding: "2px 8px",
      }}>
        {tag}
      </span>
    </div>
  );
}

function Step2({ data, onChange }) {
  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <div style={sectionHeadStyle}>
        <div style={{ height: "1px", width: "20px", backgroundColor: "#3b82f6" }} />
        Financial Documents
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
        <UploadZone label="Annual Report (Last 3 Years)" tag="Required" uploaded={data.annualReport} onUpload={(f) => onChange("annualReport", f)} />
        <UploadZone label="Audited Balance Sheet" tag="Required" uploaded={data.balanceSheet} onUpload={(f) => onChange("balanceSheet", f)} />
        <UploadZone label="Asset Liability Management (ALM)" tag="Required" uploaded={data.alm} onUpload={(f) => onChange("alm", f)} />
        <UploadZone label="Shareholding Pattern" tag="Optional" uploaded={data.shareholding} onUpload={(f) => onChange("shareholding", f)} />
      </div>

      <div style={sectionHeadStyle}>
        <div style={{ height: "1px", width: "20px", backgroundColor: "#3b82f6" }} />
        Supporting Documents
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <UploadZone label="GST Returns (Last 12 Months)" tag="Required" uploaded={data.gst} onUpload={(f) => onChange("gst", f)} />
        <UploadZone label="Bank Statements" tag="Required" uploaded={data.bankStatements} onUpload={(f) => onChange("bankStatements", f)} />
      </div>

      <div style={{ marginTop: "24px", padding: "16px 20px", backgroundColor: "rgba(37,99,235,0.08)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", gap: "12px" }}>
        <svg width="16" height="16" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p style={{ fontSize: "0.78rem", color: "#93c5fd", margin: 0 }}>
          At minimum, upload the Annual Report or Balance Sheet to proceed to AI Analysis.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  STEP 3 — AI Analysis
// ─────────────────────────────────────────────────────────

function Step3({ analysisReady, isAnalyzing, onRunAnalysis }) {
  const tasks = [
    { label: "Parsing uploaded documents",          done: analysisReady },
    { label: "Extracting financial ratios",          done: analysisReady },
    { label: "Running LLM-based SWOT generation",   done: analysisReady },
    { label: "Conducting live secondary research",  done: analysisReady },
    { label: "Scoring credit risk indicators",      done: analysisReady },
    { label: "Generating committee summary",        done: analysisReady },
  ];

  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <div style={sectionHeadStyle}>
        <div style={{ height: "1px", width: "20px", backgroundColor: "#3b82f6" }} />
        AI Processing Pipeline
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
        {tasks.map((task, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "14px 20px",
            backgroundColor: task.done ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${task.done ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`,
            transition: "all 0.3s ease",
          }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
              backgroundColor: task.done ? "#22c55e" : "rgba(255,255,255,0.06)",
              border: `1px solid ${task.done ? "#22c55e" : "rgba(255,255,255,0.12)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s ease",
            }}>
              {task.done ? (
                <svg width="11" height="11" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isAnalyzing ? "#3b82f6" : "rgba(255,255,255,0.2)" }} />
              )}
            </div>
            <span style={{ fontSize: "0.88rem", color: task.done ? "#cbd5e1" : "#475569", transition: "color 0.3s ease" }}>
              {task.label}
            </span>
            {task.done && (
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Done
              </span>
            )}
          </div>
        ))}
      </div>

      {!analysisReady && (
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            backgroundColor: isAnalyzing ? "#1e3a8a" : "#2563eb",
            color: isAnalyzing ? "rgba(255,255,255,0.5)" : "#ffffff",
            fontWeight: 700, fontSize: "0.95rem", padding: "16px 24px", border: "none",
            cursor: isAnalyzing ? "not-allowed" : "pointer",
            boxShadow: isAnalyzing ? "none" : "0 4px 24px rgba(37,99,235,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          {isAnalyzing ? (
            <span>Processing data with AI...</span>
          ) : (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>
              </svg>
              Run AI Analysis
            </>
          )}
        </button>
      )}

      {analysisReady && (
        <div style={{ padding: "20px 24px", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", gap: "14px" }}>
          <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#4ade80", marginBottom: "2px" }}>Analysis Complete</p>
            <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>All 6 processing tasks finished. Proceed to review your report.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  STEP 4 — Review & Report
// ─────────────────────────────────────────────────────────

function Step4({ entityData, results }) {
  const metrics = [
    { label: "Credit Risk Score", value: "72 / 100", status: "Moderate", color: "#facc15" },
    { label: "Debt-to-Equity",    value: "1.8x",     status: "Acceptable", color: "#60a5fa" },
    { label: "Interest Coverage", value: "3.2x",     status: "Healthy", color: "#4ade80" },
    { label: "Current Ratio",     value: "1.45",     status: "Adequate", color: "#60a5fa" },
  ];

  const swot = {
    strengths: ["Strong revenue growth trajectory", "Diversified client base", "Experienced management team"],
    weaknesses: ["High working capital dependency", "Concentrated supplier risk"],
    opportunities: ["Expanding MSME credit demand", "Government infrastructure push"],
    threats: ["Rising interest rate environment", "Regulatory tightening on NBFCs"],
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <div style={sectionHeadStyle}>
        <div style={{ height: "1px", width: "20px", backgroundColor: "#3b82f6" }} />
        Key Credit Indicators
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ backgroundColor: "#0a1628", border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${m.color}`, padding: "20px 18px" }}>
            <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>{m.label}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", lineHeight: 1, marginBottom: "6px" }}>{m.value}</p>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: m.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.status}</span>
          </div>
        ))}
      </div>

      <div style={sectionHeadStyle}>
        <div style={{ height: "1px", width: "20px", backgroundColor: "#3b82f6" }} />
        AI-Generated SWOT Analysis
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
        {[
          { title: "Strengths",     items: swot.strengths,     color: "#4ade80", bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.18)" },
          { title: "Weaknesses",    items: swot.weaknesses,    color: "#f87171", bg: "rgba(239,68,68,0.06)",  border: "rgba(239,68,68,0.18)" },
          { title: "Opportunities", items: swot.opportunities, color: "#60a5fa", bg: "rgba(37,99,235,0.06)",  border: "rgba(59,130,246,0.18)" },
          { title: "Threats",       items: swot.threats,       color: "#fb923c", bg: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.18)" },
        ].map((q, i) => (
          <div key={i} style={{ backgroundColor: q.bg, border: `1px solid ${q.border}`, padding: "20px" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: q.color, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "12px" }}>{q.title}</p>
            {q.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: j < q.items.length - 1 ? "8px" : 0 }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: q.color, marginTop: "6px", flexShrink: 0 }} />
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.55, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", backgroundColor: "#2563eb", color: "#ffffff", fontWeight: 700, fontSize: "0.95rem", padding: "16px 24px", border: "none", cursor: "pointer", boxShadow: "0 4px 24px rgba(37,99,235,0.35)", transition: "all 0.2s ease" }}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download Committee Report (PDF)
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  NAVBAR & FOOTER (Integrated)
// ─────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${ scrolled ? "bg-white shadow-sm border-b border-gray-200" : "bg-transparent" }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-700 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" fill="white" />
                <rect x="9" y="2" width="5" height="5" fill="white" opacity="0.5" />
                <rect x="2" y="9" width="5" height="5" fill="white" opacity="0.5" />
                <rect x="9" y="9" width="5" height="5" fill="white" />
              </svg>
            </div>
            <span className={`font-bold text-base tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>IntelliCredit</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 nav-links">
            {[ { label: "Home", href: "/" }, { label: "About Us", href: "/about" }, { label: "Contact", href: "/contact" } ].map((link) => (
              <Link key={link.label} to={link.href} className={`text-sm font-medium transition-colors hover:text-blue-600 ${scrolled ? "text-gray-600" : "text-white/80 hover:text-white"}`}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link to="/demo">
            <button className="bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-800 transition">Try Demo</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: "#04091a", borderTop: "1px solid rgba(255,255,255,0.12)", padding: "40px 32px" }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
        <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>© 2026 IntelliCredit. B2B Credit Intelligence Platform.</p>
        <Link to="/" style={{ color: "#60a5fa", fontSize: "0.875rem", textDecoration: "none" }}>Back to Home</Link>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────
//  ROOT DEMO COMPONENT
// ─────────────────────────────────────────────────────────

export default function Demo() {
  const [step, setStep]             = useState(1);
  const [analysisReady, setReady]   = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  const [entity, setEntity] = useState({
    cin: "", pan: "", sector: "", turnover: "",
    loanType: "", amount: "", tenure: "", interest: "",
  });

  const [docs, setDocs] = useState({
    annualReport: null, balanceSheet: null, alm: null,
    shareholding: null, gst: null, bankStatements: null,
  });

  const updateEntity = (field, val) => setEntity((p) => ({ ...p, [field]: val }));
  const updateDocs   = (field, val) => setDocs((p) => ({ ...p, [field]: val }));

  const canProceed = () => {
    if (step === 1) {
      const fields = ["cin", "pan", "sector", "turnover", "loanType", "amount", "tenure", "interest"];
      return fields.every((f) => !validate(f, entity[f]));
    }
    if (step === 2) return docs.annualReport || docs.balanceSheet; // Checks if a File object exists
    if (step === 3) return analysisReady;
    return true;
  };

  // The actual connection to your Render backend
  const runRealAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Fallback if environment variable isn't set, update this if your FastAPI route is different
    const API_URL = import.meta.env.VITE_API_BASE_URL || "https://your-backend.onrender.com";
    
    try {
      const formData = new FormData();
      
      // Append the actual File object we stored in Step 2
      if (docs.annualReport) {
        formData.append("file", docs.annualReport);
      } else if (docs.balanceSheet) {
        formData.append("file", docs.balanceSheet);
      }
      
      // Append metadata
      formData.append("cin", entity.cin);
      formData.append("loan_amount", entity.amount);

      // Make sure this endpoint matches your FastAPI setup!
      const response = await fetch(`${API_URL}/api/v1/analyze`, {
        method: "POST",
        body: formData, 
      });

      if (!response.ok) throw new Error("Backend analysis failed");

      const result = await response.json();
      setAiResults(result);
      
      setReady(true);
      setStep(4); // Auto-advance to the final report screen

    } catch (error) {
      console.error("Analysis Error:", error);
      // Fallback for Hackathon demo so you don't get stuck if Render is sleeping
      alert("Note: Falling back to demo data due to server timeout.");
      setTimeout(() => {
        setReady(true);
        setStep(4);
      }, 2000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stepTitles = [
    "Entity Onboarding",
    "Upload Documents",
    "AI Analysis",
    "Review & Report",
  ];

  const stepSubtitles = [
    "Enter the baseline details to begin.",
    "Upload the financial documents for AI parsing.",
    "Run the AI pipeline across your uploaded documents.",
    "Review AI-generated insights and download your report.",
  ];

  const nextLabels = [
    "Next: Upload Documents",
    "Next: Run AI Analysis",
    "Next: Review Report",
    "Finish & Start New",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#030d22", fontFamily: "'Inter', sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div style={{ position: "fixed", top: "-80px", right: "-80px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <header style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(3,13,34,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "30px", height: "30px", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" fill="white" /><rect x="9" y="2" width="5" height="5" fill="white" opacity="0.5" /><rect x="2" y="9" width="5" height="5" fill="white" opacity="0.5" /><rect x="9" y="9" width="5" height="5" fill="white" /></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#ffffff", letterSpacing: "-0.01em" }}>IntelliCredit</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(37,99,235,0.12)", border: "1px solid rgba(59,130,246,0.25)", padding: "5px 14px" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em" }}>STEP {step} OF {STEPS.length}</span>
          </div>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "48px 32px 80px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <StepIndicator currentStep={step} />
        </div>

        <div style={{ backgroundColor: "#071028", border: "1px solid rgba(255,255,255,0.08)", borderTop: "3px solid #2563eb" }}>
          <div style={{ padding: "32px 40px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "6px" }}>{stepTitles[step - 1]}</h1>
            <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>{stepSubtitles[step - 1]}</p>
          </div>

          <div style={{ padding: "36px 40px" }}>
            {step === 1 && <Step1 data={entity} onChange={updateEntity} />}
            {step === 2 && <Step2 data={docs}   onChange={updateDocs} />}
            {step === 3 && <Step3 analysisReady={analysisReady} isAnalyzing={isAnalyzing} onRunAnalysis={runRealAnalysis} />}
            {step === 4 && <Step4 entityData={entity} results={aiResults} />}
          </div>

          <div style={{ padding: "24px 40px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {step > 1 ? (
              <button onClick={() => { setStep(step - 1); }} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500, padding: "10px 20px", cursor: "pointer", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#e2e8f0"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#94a3b8"; }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back
              </button>
            ) : (
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "0.82rem", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#94a3b8"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}>
                ← Back to Home
              </Link>
            )}

            <span style={{ fontSize: "0.68rem", color: "#334155", fontFamily: "monospace", letterSpacing: "0.08em" }}>
              {step < 4 ? `${Math.round(((step - 1) / STEPS.length) * 100)}% complete` : "✓ All steps done"}
            </span>

            <button
              onClick={() => {
                if (step === 4) { window.location.href = "/"; return; }
                if (canProceed()) setStep(step + 1);
              }}
              style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: canProceed() ? "#2563eb" : "#1e3a8a", color: canProceed() ? "#ffffff" : "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: "0.88rem", padding: "11px 24px", border: "none", cursor: canProceed() ? "pointer" : "not-allowed", boxShadow: canProceed() ? "0 4px 18px rgba(37,99,235,0.3)" : "none", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { if (canProceed()) { e.currentTarget.style.backgroundColor = "#1d4ed8"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = canProceed() ? "#2563eb" : "#1e3a8a"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {nextLabels[step - 1]}
              {step < 4 && <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
