import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import PrimaryButton from "../components/PrimaryButton";
import { getIdeas, createIdea, updateIdea } from "../lib/api";

const STAGES = [
  { id: "idea", label: "Idea Stage" },
  { id: "validating", label: "Validating" },
  { id: "building", label: "In Development" },
  { id: "launched", label: "Launched" },
];

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

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 6,
  display: "block",
};

export default function IdeaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [stage, setStage] = useState("idea");
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) return;
    getIdeas()
      .then((data) => {
        const found = data.ideas.find((i) => i.id === id);
        if (found) {
          setTitle(found.title);
          setProblem(found.problem);
          setSolution(found.solution);
          setTargetMarket(found.targetMarket);
          setStage(found.stage);
        } else {
          setError("Idea not found.");
        }
      })
      .catch(() => setError("Couldn't load this idea."))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !problem.trim() || !solution.trim() || !targetMarket.trim()) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      const data = { title, problem, solution, targetMarket, stage };
      if (isEditing && id) {
        await updateIdea(id, data);
        navigate(`/ideas/${id}`);
      } else {
        const res = await createIdea(data);
        navigate(`/ideas/${res.idea.id}`);
      }
    } catch (err: any) {
      setError(err?.message || "Couldn't save this idea.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <button
        onClick={() => navigate(isEditing ? `/ideas/${id}` : "/ideas")}
        style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}
      >
        <ChevronLeft size={18} /> {isEditing ? "Back to Idea" : "Back to Ideas"}
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 20 }}>{isEditing ? "Edit Idea" : "New Idea"}</h2>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Title</label>
        <input type="text" placeholder="What's it called?" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Problem</label>
        <textarea
          placeholder="What problem does this solve?"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />

        <label style={labelStyle}>Solution</label>
        <textarea
          placeholder="How does your idea solve it?"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />

        <label style={labelStyle}>Target Market</label>
        <textarea
          placeholder="Who is this for?"
          value={targetMarket}
          onChange={(e) => setTargetMarket(e.target.value)}
          rows={2}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />

        <label style={labelStyle}>Stage</label>
        <select value={stage} onChange={(e) => setStage(e.target.value)} style={inputStyle}>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: -6, marginBottom: 12 }}>{error}</p>}

        <PrimaryButton
          label={submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Idea"}
          onClick={() => {}}
          style={{ background: "var(--primary-gradient)", color: "#fff" }}
        />
      </form>
    </div>
  );
}
