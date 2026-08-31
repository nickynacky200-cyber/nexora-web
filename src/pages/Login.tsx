import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import { login } from "../lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  fontSize: 15,
  marginBottom: 16,
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <h1 style={{ marginTop: 24 }}>Welcome back</h1>
      <p style={{ color: "var(--text-secondary)" }}>Log in to continue your journey</p>

      <div style={{ marginTop: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Email</label>
        <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
        <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>

      {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: -8, marginBottom: 12 }}>{error}</p>}

      <PrimaryButton
        label={loading ? "Logging in…" : "Log In"}
        onClick={handleLogin}
        style={{ background: "var(--primary)", color: "#fff" }}
      />
    </div>
  );
}
