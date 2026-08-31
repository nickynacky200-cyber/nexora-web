import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, CheckCircle2, Lightbulb, GraduationCap, ChevronRight } from "lucide-react";
import Card from "../components/Card";
import ScoreRing from "../components/ScoreRing";
import EmptyState from "../components/EmptyState";
import NotificationBell from "../components/NotificationBell";
import { useCurrentUser } from "../lib/useCurrentUser";
import { getContinueBooks, ContinueBook } from "../lib/api";

const QUICK_ACTIONS = [
  { label: "Learn", Icon: BookOpen, path: "/learn" },
  { label: "AI Mentor", Icon: Sparkles, path: "/ai-mentor" },
  { label: "Test", Icon: CheckCircle2, path: "/test" },
  { label: "Ideas", Icon: Lightbulb, path: "/ideas" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();
  const [continueBooks, setContinueBooks] = useState<ContinueBook[] | null>(null);

  useEffect(() => {
    getContinueBooks()
      .then((data) => setContinueBooks(data.books))
      .catch(() => setContinueBooks([]));
  }, []);

  if (loading) return null; // avoid a flash of empty content before auth check resolves

  const firstName = user?.name.split(" ")[0] ?? "there";
  const readinessScore = user?.profile?.readinessScore ?? 0;

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Hi, {firstName} 👋</h2>
          <p style={{ color: "var(--text-secondary)", margin: "2px 0 0" }}>Welcome back to Next Bridge!</p>
        </div>
        <NotificationBell />
      </div>

      <Card
        style={{
          background: "var(--dark-gradient)",
          border: "none",
          marginTop: 24,
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontWeight: 700, margin: 0 }}>Next Bridge Readiness Score</p>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 13, margin: "4px 0 8px" }}>
              {readinessScore > 0
                ? "Keep going — every lesson and challenge moves this number."
                : "Complete lessons and challenges to build your score."}
            </p>
            <a onClick={() => navigate("/readiness-report")} style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              View Full Report ›
            </a>
          </div>
          <ScoreRing score={readinessScore} />
        </div>
      </Card>

      <h3 style={{ marginTop: 28, marginBottom: 12 }}>Continue Your Journey</h3>

      {continueBooks === null && (
        <Card>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0, fontSize: 13 }}>Loading…</p>
        </Card>
      )}

      {continueBooks?.length === 0 && (
        <Card>
          <EmptyState
            icon={<GraduationCap size={26} />}
            title="No courses started yet"
            subtitle="Head to Learn to pick your first course and start building your Readiness Score."
          />
        </Card>
      )}

      {continueBooks?.map((b) => {
        const pct = b.totalPages ? Math.round((b.lastPage / b.totalPages) * 100) : null;
        return (
          <Card key={b.bookId} style={{ marginTop: 10, cursor: "pointer" }} onClick={() => navigate(`/learn/books/${b.bookId}`)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "var(--surface-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{b.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                  {pct !== null ? `${pct}% complete — page ${b.lastPage} of ${b.totalPages}` : `Page ${b.lastPage}`}
                </p>
              </div>
              <ChevronRight size={18} color="var(--text-secondary)" />
            </div>
          </Card>
        );
      })}

      <h3 style={{ marginTop: 28, marginBottom: 12 }}>Quick Actions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {QUICK_ACTIONS.map(({ label, Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: 16,
              textAlign: "left",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "var(--surface-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                color: "var(--primary)",
              }}
            >
              <Icon size={19} />
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
