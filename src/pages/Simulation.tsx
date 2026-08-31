import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Coins, TrendingUp, TrendingDown } from "lucide-react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import PrimaryButton from "../components/PrimaryButton";
import ScoreRing from "../components/ScoreRing";
import {
  getCurrentSimulation,
  startSimulation,
  decideSimulation,
  SimEvent,
  SimSession,
  SimDecideResponse,
} from "../lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  financialLiteracy: "Financial Literacy",
  budgeting: "Budgeting",
  businessKnowledge: "Business Knowledge",
  riskManagement: "Risk Management",
  problemSolving: "Problem Solving",
};

function formatNaira(n: number) {
  return "₦" + n.toLocaleString();
}

export default function Simulation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SimSession | null>(null);
  const [event, setEvent] = useState<SimEvent | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [consequence, setConsequence] = useState<string | null>(null);
  const [cashDelta, setCashDelta] = useState<number | null>(null);
  const [report, setReport] = useState<SimDecideResponse["report"] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentSimulation()
      .then((data) => {
        setSession(data.session);
        if (data.event) setEvent(data.event);
      })
      .catch(() => setError("Couldn't load your simulation."))
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      const data = await startSimulation();
      setSession(data.session);
      setEvent(data.event);
    } catch {
      setError("Couldn't start the simulation.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDecision = async () => {
    if (!selectedChoice) return;
    setSubmitting(true);
    try {
      const res = await decideSimulation(selectedChoice);
      setConsequence(res.consequence);
      setCashDelta(res.cashAfter - res.cashBefore);
      if (res.complete && res.report) {
        setReport(res.report);
      } else if (res.session && res.nextEvent) {
        setSession(res.session);
        // Hold on the consequence message; "Continue" advances to nextEvent
        setEvent(res.nextEvent);
      }
      setSelectedChoice(null);
    } catch {
      setError("Couldn't submit your decision.");
    } finally {
      setSubmitting(false);
    }
  };

  const dismissConsequence = () => {
    setConsequence(null);
    setCashDelta(null);
  };

  if (loading) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen">
        <p style={{ color: "var(--red)" }}>{error}</p>
        <PrimaryButton label="Back to Test" onClick={() => navigate("/test")} style={{ background: "var(--primary-gradient)", color: "#fff" }} />
      </div>
    );
  }

  // Final report screen
  if (report) {
    const profit = report.finalCash - report.startingCapital;
    return (
      <div className="screen">
        <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16 }}>
          <ChevronLeft size={18} /> Back to Test
        </button>

        <Card style={{ background: "var(--dark-gradient)", border: "none", textAlign: "center", padding: 28, boxShadow: "var(--shadow-glow)" }}>
          <p style={{ color: "var(--text-muted-on-dark)", margin: "0 0 12px", fontSize: 13 }}>Entrepreneurial Readiness</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ScoreRing score={report.overallScore} size={110} strokeWidth={10} />
          </div>
          <p style={{ color: `var(--${report.scoreBand.color})`, fontWeight: 800, fontSize: 16, margin: "14px 0 2px" }}>
            {report.scoreBand.label}
          </p>
          <p style={{ color: "var(--text-muted-on-dark)", fontSize: 12, margin: 0 }}>{report.scoreBand.description}</p>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Final Cash</span>
            <span style={{ fontWeight: 700 }}>{formatNaira(report.finalCash)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Profit / Loss</span>
            <span style={{ fontWeight: 700, color: profit >= 0 ? "var(--green)" : "var(--red)" }}>
              {profit >= 0 ? "+" : ""}{formatNaira(profit)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Equity Retained</span>
            <span style={{ fontWeight: 700 }}>{report.finalEquity}%</span>
          </div>
        </Card>

        <h3 style={{ marginTop: 24, marginBottom: 10 }}>Performance Breakdown</h3>
        <Card>
          {Object.entries(report.categoryScores).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{CATEGORY_LABELS[key] || key}</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{value}/100</span>
              </div>
              <ProgressBar progress={value} color="var(--primary)" />
            </div>
          ))}
        </Card>

        <PrimaryButton
          label="Back to Test"
          onClick={() => navigate("/test")}
          style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 20 }}
        />
      </div>
    );
  }

  // Intro screen — no session yet
  if (!session || !event) {
    return (
      <div className="screen">
        <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16 }}>
          <ChevronLeft size={18} /> Back to Test
        </button>
        <Card style={{ background: "var(--dark-gradient)", border: "none", textAlign: "center", padding: 32, boxShadow: "var(--shadow-glow)" }}>
          <Coins size={36} color="var(--gold)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: "0 0 6px" }}>Business Simulation</p>
          <p style={{ color: "var(--text-muted-on-dark)", fontSize: 13, margin: 0 }}>
            You'll start with ₦500,000 in capital and face 6 real business decisions. Every choice has consequences.
          </p>
        </Card>
        <PrimaryButton
          label="Start Simulation"
          onClick={handleStart}
          style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 20 }}
        />
      </div>
    );
  }

  // Consequence interstitial — shown after submitting, before next round
  if (consequence) {
    return (
      <div className="screen">
        <Card style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {cashDelta !== null && cashDelta >= 0 ? (
              <TrendingUp size={22} color="var(--green)" />
            ) : (
              <TrendingDown size={22} color="var(--red)" />
            )}
            <p style={{ margin: 0, fontWeight: 700 }}>
              {cashDelta !== null && (cashDelta >= 0 ? "+" : "") + formatNaira(cashDelta)}
            </p>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6 }}>{consequence}</p>
        </Card>
        <PrimaryButton
          label="Continue"
          onClick={dismissConsequence}
          style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 20 }}
        />
      </div>
    );
  }

  // Active round — decision screen
  return (
    <div className="screen">
      <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 12 }}>
        <ChevronLeft size={18} /> Exit
      </button>

      <Card style={{ background: "var(--dark-gradient)", border: "none", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 12, margin: 0 }}>Current Cash</p>
            <p style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "2px 0 0" }}>{formatNaira(session.currentCash)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 12, margin: 0 }}>Equity</p>
            <p style={{ color: "var(--gold)", fontSize: 20, fontWeight: 800, margin: "2px 0 0" }}>{session.equity}%</p>
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar progress={((event.roundIndex + 1) / event.totalRounds) * 100} color="var(--primary)" />
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
          Round {event.roundIndex + 1} of {event.totalRounds}
        </p>
      </div>

      <h3 style={{ marginBottom: 4 }}>{event.title}</h3>
      <p style={{ color: "var(--text-secondary)", marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>{event.description}</p>

      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>What will you do?</p>
      {event.choices.map((choice) => {
        const selected = selectedChoice === choice.id;
        return (
          <button
            key={choice.id}
            onClick={() => setSelectedChoice(choice.id)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: 16,
              borderRadius: "var(--radius-md)",
              border: selected ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: selected ? "var(--surface-muted)" : "var(--surface)",
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-primary)",
            }}
          >
            {choice.label}
          </button>
        );
      })}

      <PrimaryButton
        label={submitting ? "Submitting…" : "Submit Decision"}
        onClick={handleSubmitDecision}
        style={{
          background: selectedChoice ? "var(--primary-gradient)" : "var(--border)",
          color: selectedChoice ? "#fff" : "var(--text-secondary)",
          marginTop: 8,
          boxShadow: selectedChoice ? "var(--shadow-glow)" : "none",
        }}
      />
    </div>
  );
}
