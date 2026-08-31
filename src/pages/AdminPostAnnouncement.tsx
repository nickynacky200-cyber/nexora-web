import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { postAnnouncement } from "../lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid var(--border)",
  fontSize: 15,
  marginBottom: 12,
  background: "var(--surface)",
  color: "var(--text-primary)",
};

export default function AdminPostAnnouncement() {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!adminKey || !title.trim() || !body.trim()) {
      setError("Admin key, title, and message are all required.");
      return;
    }
    setSubmitting(true);
    try {
      await postAnnouncement(adminKey, title.trim(), body.trim());
      setSuccess(true);
      setTitle("");
      setBody("");
    } catch (err: any) {
      setError(err?.message || "Couldn't post this announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen">
      <button onClick={() => navigate("/home")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Home
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>Post an Announcement</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0, marginBottom: 20 }}>
        Admin only. Shows up in every user's notification bell.
      </p>

      {success && (
        <Card style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={20} color="var(--green)" />
          <span style={{ fontWeight: 600 }}>Posted — it'll appear in everyone's notifications.</span>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Admin key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Title (e.g. New Feature: Level 2 Simulation!)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />

        {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: -6, marginBottom: 12 }}>{error}</p>}

        <PrimaryButton
          label={submitting ? "Posting…" : "Post Announcement"}
          onClick={() => {}}
          style={{ background: "var(--primary-gradient)", color: "#fff" }}
        />
      </form>
    </div>
  );
}
