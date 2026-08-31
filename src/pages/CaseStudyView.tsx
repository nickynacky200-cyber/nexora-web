import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { getCaseStudyDetail, submitCaseStudy, CaseStudyDetail } from "../lib/api";

export default function CaseStudyView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState<CaseStudyDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCaseStudyDetail(id)
      .then((data) => {
        setCaseStudy(data.caseStudy);
        if (data.response) {
          setAnswers(data.response.answers);
          setSaved(true);
        }
      })
      .catch(() => setError("Couldn't load this case study."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!id || !caseStudy) return;
    const allAnswered = caseStudy.questions.every((q) => (answers[q.id] || "").trim().length > 0);
    if (!allAnswered) {
      setError("Answer all questions before saving.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await submitCaseStudy(id, answers);
      setSaved(true);
    } catch {
      setError("Couldn't save your answers.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>{error || "This case study couldn't be found."}</p>
        <button onClick={() => navigate("/test/case-studies")} style={{ background: "none", border: "none", color: "var(--primary)", padding: 0 }}>
          Back to Case Studies
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <button onClick={() => navigate("/test/case-studies")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Case Studies
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{caseStudy.title}</h2>

      <Card>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{caseStudy.scenario}</p>
      </Card>

      {caseStudy.questions.map((q, i) => (
        <div key={q.id} style={{ marginTop: 18 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
            {i + 1}. {q.prompt}
          </p>
          <textarea
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(q.id, e.target.value)}
            placeholder="Share your thinking…"
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
        </div>
      ))}

      {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 12 }}>{error}</p>}

      {saved && !error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
          <CheckCircle2 size={16} color="var(--green)" />
          <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Saved</span>
        </div>
      )}

      <PrimaryButton
        label={saving ? "Saving…" : saved ? "Update Answers" : "Save Answers"}
        onClick={handleSubmit}
        style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 18 }}
      />
    </div>
  );
}
