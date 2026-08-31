import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Plus, ChevronRight } from "lucide-react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import EmptyState from "../components/EmptyState";
import { getIdeas, Idea } from "../lib/api";

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea Stage",
  validating: "Validating",
  building: "In Development",
  launched: "Launched",
};

const STAGE_COLORS: Record<string, string> = {
  idea: "var(--gold)",
  validating: "var(--blue)",
  building: "var(--orange)",
  launched: "var(--green)",
};

export default function Ideas() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[] | null>(null);

  useEffect(() => {
    getIdeas()
      .then((data) => setIdeas(data.ideas))
      .catch(() => setIdeas([]));
  }, []);

  return (
    <div className="screen">
      <h2 style={{ marginTop: 24, marginBottom: 4 }}>Ideas</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Your ideas can change the world</p>

      <PrimaryButton
        label="New Idea"
        onClick={() => navigate("/ideas/new")}
        style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      />

      {ideas === null && (
        <Card style={{ marginTop: 20 }}>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0 }}>Loading…</p>
        </Card>
      )}

      {ideas?.length === 0 && (
        <Card style={{ marginTop: 20 }}>
          <EmptyState
            icon={<Lightbulb size={26} />}
            title="No ideas submitted yet"
            subtitle="Tap New Idea to submit your first concept — problem, solution, target market, and more."
          />
        </Card>
      )}

      {ideas?.map((idea) => (
        <Card key={idea.id} style={{ marginTop: 12, cursor: "pointer" }} onClick={() => navigate(`/ideas/${idea.id}`)}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: STAGE_COLORS[idea.stage] + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: STAGE_COLORS[idea.stage],
                flexShrink: 0,
              }}
            >
              <Lightbulb size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{idea.title}</p>
              <p style={{ margin: "3px 0 6px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {idea.problem.length > 90 ? idea.problem.slice(0, 90) + "…" : idea.problem}
              </p>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: STAGE_COLORS[idea.stage],
                  background: STAGE_COLORS[idea.stage] + "18",
                  padding: "3px 8px",
                  borderRadius: 999,
                }}
              >
                {STAGE_LABELS[idea.stage]}
              </span>
            </div>
            <ChevronRight size={18} color="var(--text-secondary)" />
          </div>
        </Card>
      ))}
    </div>
  );
}
