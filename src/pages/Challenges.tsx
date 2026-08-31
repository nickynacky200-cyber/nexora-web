import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Card from "../components/Card";
import { getChallenges, completeChallenge, Challenge } from "../lib/api";

export default function Challenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getChallenges()
      .then((data) => setChallenges(data.challenges))
      .catch(() => setChallenges([]));
  }, []);

  const toggleOpen = (challenge: Challenge) => {
    if (openId === challenge.id) {
      setOpenId(null);
      return;
    }
    setOpenId(challenge.id);
    setDrafts((prev) => ({ ...prev, [challenge.id]: prev[challenge.id] ?? challenge.reflection ?? "" }));
    setError(null);
  };

  const handleSubmit = async (challengeId: string) => {
    const reflection = (drafts[challengeId] || "").trim();
    if (!reflection) {
      setError("Write a short reflection on what you did before marking this complete.");
      return;
    }
    setError(null);
    setSaving(challengeId);
    try {
      const res = await completeChallenge(challengeId, reflection);
      setChallenges((prev) =>
        prev
          ? prev.map((c) =>
              c.id === challengeId ? { ...c, completed: true, reflection: res.challenge.reflection, completedAt: res.challenge.completedAt } : c
            )
          : prev
      );
      setOpenId(null);
    } catch {
      setError("Couldn't save this — try again.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="screen">
      <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Test
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>Real-World Challenges</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Go do these in real life, then log what you learned. Not graded — just logged.
      </p>

      {challenges === null && (
        <Card style={{ marginTop: 16 }}>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0 }}>Loading…</p>
        </Card>
      )}

      {challenges?.map((ch) => {
        const isOpen = openId === ch.id;
        return (
          <Card key={ch.id} style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => toggleOpen(ch)}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "var(--green)22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--green)",
                  flexShrink: 0,
                }}
              >
                <Trophy size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{ch.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>{ch.description}</p>
                {ch.completed && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <CheckCircle2 size={12} color="var(--green)" />
                    <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>Completed</span>
                  </div>
                )}
              </div>
              {isOpen ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
            </div>

            {isOpen && (
              <div style={{ marginTop: 14 }}>
                <textarea
                  value={drafts[ch.id] || ""}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [ch.id]: e.target.value }))}
                  placeholder="What did you do, and what did you learn?"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    resize: "vertical",
                    background: "var(--surface)",
                    color: "var(--text-primary)",
                  }}
                />
                {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 8 }}>{error}</p>}
                <button
                  onClick={() => handleSubmit(ch.id)}
                  disabled={saving === ch.id}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: "var(--primary-gradient)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {saving === ch.id ? "Saving…" : ch.completed ? "Update Reflection" : "Mark Complete"}
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
