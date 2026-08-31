import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import Card from "../components/Card";
import { getIdeas, deleteIdea, Idea } from "../lib/api";

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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{value}</p>
    </div>
  );
}

export default function IdeaView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    getIdeas()
      .then((data) => {
        const found = data.ideas.find((i) => i.id === id);
        if (found) setIdea(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteIdea(id);
      navigate("/ideas");
    } catch {
      setDeleting(false);
    }
  };

  if (notFound) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>This idea couldn't be found.</p>
        <button onClick={() => navigate("/ideas")} style={{ background: "none", border: "none", color: "var(--primary)", padding: 0 }}>
          Back to Ideas
        </button>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <button onClick={() => navigate("/ideas")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Ideas
      </button>

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

      <h2 style={{ marginTop: 10, marginBottom: 16 }}>{idea.title}</h2>

      <Card>
        <Field label="Problem" value={idea.problem} />
        <Field label="Solution" value={idea.solution} />
        <Field label="Target Market" value={idea.targetMarket} />
      </Card>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          onClick={() => navigate(`/ideas/${idea.id}/edit`)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: 12,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <Pencil size={16} /> Edit
        </button>
        <button
          onClick={() => setConfirmingDelete(true)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: 12,
            borderRadius: 10,
            border: "1px solid var(--red)",
            background: "transparent",
            color: "var(--red)",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>

      {confirmingDelete && (
        <Card style={{ marginTop: 16 }}>
          <p style={{ margin: "0 0 12px", fontSize: 14 }}>Delete this idea? This can't be undone.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setConfirmingDelete(false)}
              style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: "var(--red)", color: "#fff", fontWeight: 600 }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
