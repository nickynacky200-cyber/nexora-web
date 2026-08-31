import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import { getCaseStudies, CaseStudySummary } from "../lib/api";

export default function CaseStudies() {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<CaseStudySummary[] | null>(null);

  useEffect(() => {
    getCaseStudies()
      .then((data) => setCaseStudies(data.caseStudies))
      .catch(() => setCaseStudies([]));
  }, []);

  return (
    <div className="screen">
      <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Test
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>Case Studies</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
        Real business situations, no single right answer — your thinking is saved so you can revisit it.
      </p>

      {caseStudies === null && (
        <Card style={{ marginTop: 16 }}>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0 }}>Loading…</p>
        </Card>
      )}

      {caseStudies?.map((cs) => (
        <Card key={cs.id} style={{ marginTop: 12, cursor: "pointer" }} onClick={() => navigate(`/test/case-studies/${cs.id}`)}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "var(--gold)22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold)",
                flexShrink: 0,
              }}
            >
              <Briefcase size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{cs.title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>{cs.summary}</p>
              {cs.answered && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <CheckCircle2 size={12} color="var(--green)" />
                  <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>Answered</span>
                </div>
              )}
            </div>
            <ChevronRight size={18} color="var(--text-secondary)" />
          </div>
        </Card>
      ))}
    </div>
  );
}
