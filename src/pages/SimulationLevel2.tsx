import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Rocket, TrendingUp, TrendingDown } from "lucide-react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import PrimaryButton from "../components/PrimaryButton";
import ScoreRing from "../components/ScoreRing";
import {
  getLevel2Status,
  getCurrentLevel2,
  startLevel2,
  decideLevel2,
  SimL2Event,
  SimL2Session,
  SimL2DecideResponse,
} from "../lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  financialLiteracy: "Financial Literacy",
  budgeting: "Budgeting",
  businessKnowledge: "Business Knowledge",
  riskManagement: "Risk Management",
  problemSolving: "Problem Solving",
};

function formatNaira(n: number) {
  return "₦" + Math.round(n).toLocaleString();
}

type Choice = { id: string; label: string };

export default function SimulationLevel2() {
  const navigate = useNavigate();
  const [checkingLock, setCheckingLock] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SimL2Session | null>(null);
  const [event, setEvent] = useState<SimL2Event | null>(null);
  const [followUpChoices, setFollowUpChoices] = useState<Choice[] | null>(null);

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [consequence, setConsequence] = useState<string | null>(null);
  const [cashDelta, setCashDelta] = useState<number | null>(null);
  const [report, setReport] = useState<SimL2DecideResponse["report"] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLevel2Status()
      .then((data) => setUnlocked(data.unlocked))
      .catch(() => setUnlocked(false))
      .finally(() => setCheckingLock(false));
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    getCurrentLevel2()
      .then((data) => {
        setSession(data.session);
        if (data.event) setEvent(data.event);
      })
      .catch(() => setError("Couldn't load Level 2."))
      .finally(() => setLoading(false));
  }, [unlocked]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const data = await startLevel2();
      setSession(data.session);
      setEvent(data.event);
    } catch {
      setError("Couldn't start Level 2.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDecision = async () => {
    if (!selectedChoice) return;
    setSubmitting(true);
    try {
      const res = await decideLevel2(selectedChoice);
      setConsequence(res.consequence);
      if (session) setCashDelta(res.session ? res.session.cash - session.cash : 0);

      if (res.awaitingFollowUp && res.followUpChoices) {
        setFollowUpChoices(res.followUpChoices);
        if (res.session) setSession(res.session);
      } else if (res.complete && res.report) {
        setReport(res.report);
      } else if (res.session && res.nextEvent) {
        setSession(res.session);
        setEvent(res.nextEvent);
        setFollowUpChoices(null);
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

  if (checkingLock || (unlocked && loading)) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="screen">
        <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16 }}>
          <ChevronLeft size={18} /> Back to Test
        </button>
        <Card style={{ textAlign: "center", padding: 32 }}>
          <Lock size={32} color="var(--text-secondary)" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>Level 2 is locked</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: 0 }}>
            Complete the Level 1 Business Simulation first to unlock Level 2.
          </p>
        </Card>
        <PrimaryButton
          label="Go to Level 1"
          onClick={() => navigate("/test/simulation")}
          style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 20 }}
        />
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

  // Founder report screen
  if (report) {
    return (
      <div className="screen">
        <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16 }}>
          <ChevronLeft size={18} /> Back to Test
        </button>

        <Card style={{ background: "var(--dark-gradient)", border: "none", textAlign: "center", padding: 28, boxShadow: "var(--shadow-glow)" }}>
          <p style={{ color: "var(--text-muted-on-dark)", margin: "0 0 12px", fontSize: 13 }}>Founder Report</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ScoreRing score={report.overallScore} size={110} strokeWidth={10} />
          </div>
          <p style={{ color: `var(--${report.scoreBand.color})`, fontWeight: 800, fontSize: 16, margin: "14px 0 2px" }}>
            {report.scoreBand.label}
          </p>
          <p style={{ color: "var(--text-muted-on-dark)", fontSize: 12, margin: 0 }}>{report.scoreBand.description}</p>
        </Card>

        {report.acquired ? (
          <Card style={{ marginTop: 16 }}>
            <p style={{ margin: "0 0 10px", fontWeight: 700 }}>FreshBox was acquired</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Acquisition Price</span>
              <span style={{ fontWeight: 700 }}>{formatNaira(report.finalValuation)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Your Payout ({report.finalEquity}% equity)</span>
              <span style={{ fontWeight: 700, color: "var(--green)" }}>{formatNaira(report.acquisitionPayout || 0)}</span>
            </div>
          </Card>
        ) : (
          <Card style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Final Valuation</span>
              <span style={{ fontWeight: 700 }}>{formatNaira(report.finalValuation)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Cash</span>
              <span style={{ fontWeight: 700 }}>{formatNaira(report.finalCash)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Monthly Revenue</span>
              <span style={{ fontWeight: 700 }}>{formatNaira(report.monthlyRevenue)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Customers</span>
              <span style={{ fontWeight: 700 }}>{report.customers.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Founder Equity</span>
              <span style={{ fontWeight: 700 }}>{report.finalEquity}%</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>Estimated Ownership Value</p>
              <p style={{ margin: "4px 0 0", fontWeight: 800, fontSize: 18, color: "var(--primary)" }}>
                {report.finalEquity}% × {formatNaira(report.finalValuation)} = {formatNaira(report.ownershipValue)}
              </p>
            </div>
          </Card>
        )}

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
          <Rocket size={36} color="var(--gold)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: "0 0 6px" }}>Business Simulation — Level 2</p>
          <p style={{ color: "var(--text-muted-on-dark)", fontSize: 13, margin: 0 }}>
            Run FreshBox through funding rounds, competition, and an acquisition offer. Cash, equity, valuation, and customers all move together this time.
          </p>
        </Card>
        <PrimaryButton
          label="Start Level 2"
          onClick={handleStart}
          style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 20 }}
        />
      </div>
    );
  }

  // Consequence interstitial
  if (consequence && !followUpChoices) {
    return (
      <div className="screen">
        <Card style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {cashDelta !== null && cashDelta >= 0 ? (
              <TrendingUp size={22} color="var(--green)" />
            ) : (
              <TrendingDown size={22} color="var(--red)" />
            )}
            {cashDelta !== null && (
              <p style={{ margin: 0, fontWeight: 700 }}>
                {cashDelta >= 0 ? "+" : ""}
                {formatNaira(cashDelta)}
              </p>
            )}
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

  // Negotiation follow-up step
  if (followUpChoices) {
    return (
      <div className="screen">
        <Card style={{ marginBottom: 16 }}>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6 }}>{consequence}</p>
        </Card>
        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>What now?</p>
        {followUpChoices.map((choice) => {
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
          label={submitting ? "Submitting…" : "Confirm"}
          onClick={() => {
            setConsequence(null);
            handleSubmitDecision();
          }}
          style={{
            background: selectedChoice ? "var(--primary-gradient)" : "var(--border)",
            color: selectedChoice ? "#fff" : "var(--text-secondary)",
            marginTop: 8,
          }}
        />
      </div>
    );
  }

  // Active round
  return (
    <div className="screen">
      <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 12 }}>
        <ChevronLeft size={18} /> Exit
      </button>

      <Card style={{ background: "var(--dark-gradient)", border: "none", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 11, margin: 0 }}>Cash</p>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: "2px 0 0" }}>{formatNaira(session.cash)}</p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 11, margin: 0 }}>Equity</p>
            <p style={{ color: "var(--gold)", fontSize: 16, fontWeight: 800, margin: "2px 0 0" }}>{session.equity}%</p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 11, margin: 0 }}>Valuation</p>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: "2px 0 0" }}>{formatNaira(session.valuation)}</p>
          </div>
          <div>
            <p style={{ color: "var(--text-muted-on-dark)", fontSize: 11, margin: 0 }}>Customers</p>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: "2px 0 0" }}>{session.customers.toLocaleString()}</p>
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
        }}
      />
    </div>
  );
}
