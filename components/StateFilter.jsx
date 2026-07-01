"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";

const STATES = [
  { label: "Tamil Nadu",      flag: "🏛️",  color: "#f97316" },
  { label: "Andhra Pradesh",  flag: "🌊",  color: "#3b82f6" },
  { label: "Kerala",          flag: "🌴",  color: "#22c55e" },
  { label: "Karnataka",       flag: "🦁",  color: "#a855f7" },
  { label: "Rajasthan",       flag: "🏰",  color: "#f59e0b" },
];

export default function StateFilter({ selectedState, onStateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeState = STATES.find((s) => s.label === selectedState);

  return (
    <div
      style={{
        background: "rgba(10,10,10,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        position: "sticky",
        top: "80px",       /* sits just below the 80px header */
        zIndex: 40,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <MapPin size={15} style={{ color: "#f97316" }} />
        <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Filter by State
        </span>
      </div>

      {/* Desktop: pill buttons */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}>
        {/* All States pill */}
        <button
          onClick={() => onStateChange(null)}
          style={{
            padding: "6px 16px",
            borderRadius: "9999px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            border: "1px solid",
            transition: "all 0.2s",
            borderColor: !selectedState ? "#f97316" : "rgba(255,255,255,0.12)",
            background: !selectedState ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
            color: !selectedState ? "#f97316" : "rgba(255,255,255,0.6)",
          }}
        >
          🇮🇳 All States
        </button>

        {STATES.map((s) => {
          const isActive = selectedState === s.label;
          return (
            <button
              key={s.label}
              onClick={() => onStateChange(isActive ? null : s.label)}
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                transition: "all 0.2s",
                borderColor: isActive ? s.color : "rgba(255,255,255,0.12)",
                background: isActive ? `${s.color}22` : "rgba(255,255,255,0.04)",
                color: isActive ? s.color : "rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>{s.flag}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active filter badge — show when a state is selected */}
      {selectedState && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "9999px",
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.3)",
            flexShrink: 0,
          }}
        >
          <MapPin size={12} style={{ color: "#f97316" }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#f97316" }}>
            {activeState?.flag} {selectedState}
          </span>
          <button
            onClick={() => onStateChange(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f97316",
              display: "flex",
              alignItems: "center",
              padding: 0,
              marginLeft: "2px",
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
