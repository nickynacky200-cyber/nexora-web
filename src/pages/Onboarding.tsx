import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import { register, updateProfile } from "../lib/api";

const AGE_RANGES = ["13-15", "16-18", "19-21", "22-25"];
const INTERESTS = ["Entrepreneurship", "Innovation", "Finance", "Tech", "Social Impact"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  fontSize: 15,
};

const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: "8px 16px",
  borderRadius: "var(--radius-pill)",
  border: "1px solid var(--border)",
  background: active ? "var(--primary)" : "var(--surface)",
  color: active ? "#fff" : "var(--text-secondary)",
  fontSize: 13,
  fontWeight: 500,
});

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item: string) =>
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));

  const finish = async () => {
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      await updateProfile({ ageRange: ageRange || undefined, interests, goal });
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <h1 style={{ marginTop: 24 }}>Let's get to know you</h1>
      <p style={{ color: "var(--text-secondary)" }}>This helps Next Bridge personalize your dashboard.</p>

      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>What should we call you?</p>
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>

      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Email</p>
        <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>

      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Password</p>
        <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
      </div>

      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Age range</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {AGE_RANGES.map((r) => (
            <button key={r} style={chipStyle(ageRange === r)} onClick={() => setAgeRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>What are you interested in?</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {INTERESTS.map((item) => (
            <button key={item} style={chipStyle(interests.includes(item))} onClick={() => toggleInterest(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, marginBottom: 24 }}>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>What's your main goal on Next Bridge?</p>
        <input style={inputStyle} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Launch my first small business" />
      </div>

      {error && <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <PrimaryButton
        label={loading ? "Creating account…" : "Continue"}
        onClick={finish}
        style={{ background: "var(--primary)", color: "#fff" }}
      />
    </div>
  );
}
