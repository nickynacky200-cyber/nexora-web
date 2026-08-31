import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundImage: "url(/welcome-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <div style={{ marginTop: "auto", padding: "0 24px", paddingBottom: "max(28px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={() => navigate("/onboarding")}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            border: "none",
            background: "var(--primary-gradient)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            boxShadow: "var(--shadow-glow)",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            border: "1.5px solid rgba(255,255,255,0.35)",
            background: "transparent",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            marginTop: 12,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: 18, marginBottom: 0, fontSize: 14, color: "rgba(255,255,255,0.65)" }}>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/onboarding")}
            style={{ background: "none", border: "none", padding: 0, color: "var(--primary-light)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
