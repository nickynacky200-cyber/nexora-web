import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Briefcase, TrendingUp, Trophy, ChevronRight, Lock, Calculator } from "lucide-react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { getQuizzes, QuizSummary, getLevel2Status } from "../lib/api";

export default function Test() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizSummary[] | null>(null);
  const [level2Unlocked, setLevel2Unlocked] = useState(false);

  useEffect(() => {
    getQuizzes().then(setQuizzes).catch(() => setQuizzes([]));
    getLevel2Status().then((d) => setLevel2Unlocked(d.unlocked)).catch(() => setLevel2Unlocked(false));
  }, []);

  return (
    <div className="screen">
      <h2 style={{ marginTop: 24, marginBottom: 4 }}>Test</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Prove what you've learned</p>

      <h3 style={{ marginTop: 20, marginBottom: 10, fontSize: 15 }}>Business Simulation</h3>
      <Card style={{ cursor: "pointer" }} onClick={() => navigate("/test/simulation")}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--orange)22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--orange)",
            }}
          >
            <TrendingUp size={20} />
          </div>
          <div style={{ marginLeft: 12, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Level 1</p>
            <p style={{ margin: "2px 0", fontSize: 13, color: "var(--text-secondary)" }}>
              Start with ₦500,000 and make real business decisions.
            </p>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </div>
      </Card>
      <Card style={{ marginTop: 10, cursor: "pointer" }} onClick={() => navigate("/test/simulation-2")}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--orange)22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--orange)",
            }}
          >
            {level2Unlocked ? <TrendingUp size={20} /> : <Lock size={18} />}
          </div>
          <div style={{ marginLeft: 12, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Level 2</p>
            <p style={{ margin: "2px 0", fontSize: 13, color: "var(--text-secondary)" }}>
              {level2Unlocked ? "Funding rounds, competition, and an acquisition offer." : "Complete Level 1 to unlock."}
            </p>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </div>
      </Card>

      <h3 style={{ marginTop: 24, marginBottom: 10, fontSize: 15 }}>Case Studies</h3>
      <Card style={{ cursor: "pointer" }} onClick={() => navigate("/test/case-studies")}>
        <div style={{ display: "flex", alignItems: "center" }}>
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
            }}
          >
            <Briefcase size={20} />
          </div>
          <div style={{ marginLeft: 12, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Case Studies</p>
            <p style={{ margin: "2px 0", fontSize: 13, color: "var(--text-secondary)" }}>
              Real scenarios to think through — no single right answer.
            </p>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </div>
      </Card>

      <h3 style={{ marginTop: 24, marginBottom: 10, fontSize: 15 }}>Knowledge Quizzes</h3>
      {quizzes === null && (
        <Card>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0 }}>Loading quizzes…</p>
        </Card>
      )}
      {quizzes?.length === 0 && (
        <Card>
          <EmptyState
            icon={<HelpCircle size={24} />}
            title="No quizzes available yet"
            subtitle="Check back soon — quiz content is being added."
          />
        </Card>
      )}
      {quizzes?.map((quiz) => (
        <Card key={quiz.id} style={{ marginTop: 10, cursor: "pointer" }} onClick={() => navigate(`/test/quiz/${quiz.id}`)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "var(--blue)22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--blue)",
              }}
            >
              <HelpCircle size={20} />
            </div>
            <div style={{ marginLeft: 12, flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{quiz.title}</p>
              <p style={{ margin: "2px 0", fontSize: 13, color: "var(--text-secondary)" }}>{quiz.description}</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--text-secondary)" }}>{quiz.questionCount} questions</p>
            </div>
            <ChevronRight size={18} color="var(--text-secondary)" />
          </div>
        </Card>
      ))}

      <h3 style={{ marginTop: 24, marginBottom: 10, fontSize: 15 }}>Business Calculators</h3>
      <Card style={{ cursor: "pointer" }} onClick={() => navigate("/test/calculators")}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--blue)22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--blue)",
            }}
          >
            <Calculator size={20} />
          </div>
          <div style={{ marginLeft: 12, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Business Calculators</p>
            <p style={{ margin: "2px 0", fontSize: 13, color: "var(--text-secondary)" }}>
              Budget and break-even tools you can actually use.
            </p>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </div>
      </Card>

      <h3 style={{ marginTop: 24, marginBottom: 10, fontSize: 15 }}>Real-World Challenges</h3>
      <Card style={{ cursor: "pointer" }} onClick={() => navigate("/test/challenges")}>
        <div style={{ display: "flex", alignItems: "center" }}>
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
            }}
          >
            <Trophy size={20} />
          </div>
          <div style={{ marginLeft: 12, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Real-World Challenges</p>
            <p style={{ margin: "2px 0", fontSize: 13, color: "var(--text-secondary)" }}>
              Go do these in real life, then log what you learned.
            </p>
          </div>
          <ChevronRight size={18} color="var(--text-secondary)" />
        </div>
      </Card>
    </div>
  );
}
