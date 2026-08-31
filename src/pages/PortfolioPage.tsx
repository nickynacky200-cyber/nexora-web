import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Briefcase,
  Lightbulb,
  Ribbon,
  Trophy,
  HelpCircle,
  TrendingUp,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import Card from "../components/Card";
import ScoreRing from "../components/ScoreRing";
import EmptyState from "../components/EmptyState";
import { getPortfolio, Portfolio } from "../lib/api";

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea Stage",
  validating: "Validating",
  building: "In Development",
  launched: "Launched",
};

const CATEGORY_LABELS: Record<string, string> = {
  financialLiteracy: "Financial Literacy",
  budgeting: "Budgeting",
  businessKnowledge: "Business Knowledge",
  riskManagement: "Risk Management",
  problemSolving: "Problem Solving",
};

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: 15 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolio()
      .then(setPortfolio)
      .catch(() => setError("Couldn't load your portfolio."));
  }, []);

  if (error) {
    return (
      <div className="screen">
        <p style={{ color: "var(--red)" }}>{error}</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  const isEmpty =
    portfolio.ideas.length === 0 &&
    portfolio.caseStudies.length === 0 &&
    portfolio.challenges.length === 0 &&
    portfolio.achievements.length === 0 &&
    portfolio.certificates.length === 0 &&
    portfolio.quizzes.attemptCount === 0 &&
    !portfolio.simulation &&
    portfolio.books.length === 0;

  return (
    <div className="screen">
      <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Profile
      </button>

      <Card style={{ background: "var(--dark-gradient)", border: "none", boxShadow: "var(--shadow-glow)" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, margin: 0 }}>{portfolio.profile.name}</p>
            <p style={{ color: "var(--gold)", fontSize: 13, fontWeight: 600, margin: "4px 0 0" }}>{portfolio.profile.level}</p>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 12, margin: "4px 0 0" }}>{portfolio.profile.xp} XP</p>
          </div>
          <ScoreRing score={portfolio.profile.readinessScore} />
        </div>
      </Card>

      {isEmpty && (
        <Card style={{ marginTop: 20 }}>
          <EmptyState
            icon={<FolderOpen size={26} />}
            title="Your portfolio is empty so far"
            subtitle="Complete quizzes, the simulation, case studies, or challenges — your real progress will show up here."
          />
        </Card>
      )}

      {portfolio.simulation && (
        <Section icon={<TrendingUp size={18} color="var(--orange)" />} title="Business Simulation">
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ScoreRing score={portfolio.simulation.overallScore} size={64} strokeWidth={7} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
                  Final cash: ₦{portfolio.simulation.finalCash.toLocaleString()}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
                  Started with ₦{portfolio.simulation.startingCapital.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(portfolio.simulation.categoryScores).map(([key, val]) => (
                <span key={key} style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", background: "var(--surface-muted)", padding: "3px 8px", borderRadius: 999 }}>
                  {CATEGORY_LABELS[key]}: {val}
                </span>
              ))}
            </div>
          </Card>
        </Section>
      )}

      {portfolio.ideas.length > 0 && (
        <Section icon={<Lightbulb size={18} color="var(--gold)" />} title={`Ideas (${portfolio.ideas.length})`}>
          {portfolio.ideas.map((idea) => (
            <Card key={idea.id} style={{ marginTop: 8, cursor: "pointer" }} onClick={() => navigate(`/ideas/${idea.id}`)}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{idea.title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>{STAGE_LABELS[idea.stage]}</p>
            </Card>
          ))}
        </Section>
      )}

      {portfolio.certificates.length > 0 && (
        <Section icon={<Ribbon size={18} color="var(--gold)" />} title={`Certificates (${portfolio.certificates.length})`}>
          {portfolio.certificates.map((c) => (
            <Card key={c.key} style={{ marginTop: 8, cursor: "pointer" }} onClick={() => navigate(`/profile/certificates/${c.key}`)}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{c.title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                Issued {new Date(c.issuedAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </Section>
      )}

      {portfolio.achievements.length > 0 && (
        <Section icon={<Trophy size={18} color="var(--gold)" />} title={`Achievements (${portfolio.achievements.length})`}>
          <Card>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
              {portfolio.achievements.length} unlocked — view the full list in Achievements.
            </p>
          </Card>
        </Section>
      )}

      {portfolio.quizzes.attemptCount > 0 && (
        <Section icon={<HelpCircle size={18} color="var(--blue)" />} title="Quizzes">
          <Card>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
              {portfolio.quizzes.attemptCount} taken · average score {portfolio.quizzes.averageScore}%
            </p>
          </Card>
        </Section>
      )}

      {portfolio.caseStudies.length > 0 && (
        <Section icon={<Briefcase size={18} color="var(--gold)" />} title={`Case Studies (${portfolio.caseStudies.length})`}>
          {portfolio.caseStudies.map((cs) => (
            <Card key={cs.id} style={{ marginTop: 8, cursor: "pointer" }} onClick={() => navigate(`/test/case-studies/${cs.id}`)}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{cs.title}</p>
            </Card>
          ))}
        </Section>
      )}

      {portfolio.challenges.length > 0 && (
        <Section icon={<Trophy size={18} color="var(--green)" />} title={`Real-World Challenges (${portfolio.challenges.length})`}>
          {portfolio.challenges.map((ch) => (
            <Card key={ch.id} style={{ marginTop: 8 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{ch.title}</p>
            </Card>
          ))}
        </Section>
      )}

      {portfolio.books.length > 0 && (
        <Section icon={<BookOpen size={18} color="var(--primary)" />} title={`Books (${portfolio.books.length})`}>
          {portfolio.books.map((b) => (
            <Card key={b.title} style={{ marginTop: 8 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{b.title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                {b.complete ? "Finished" : b.totalPages ? `Page ${b.lastPage} of ${b.totalPages}` : `Page ${b.lastPage}`}
              </p>
            </Card>
          ))}
        </Section>
      )}
    </div>
  );
}
