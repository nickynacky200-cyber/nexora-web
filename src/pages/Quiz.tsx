import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import PrimaryButton from "../components/PrimaryButton";
import { getQuiz, submitQuiz, QuizDetail, QuizResult } from "../lib/api";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getQuiz(id).catch(() => setError("Couldn't load this quiz.")).then((data) => data && setQuiz(data));
  }, [id]);

  if (error) {
    return (
      <div className="screen">
        <p style={{ color: "var(--red)" }}>{error}</p>
        <PrimaryButton label="Back to Test" onClick={() => navigate("/test")} style={{ background: "var(--primary-gradient)", color: "#fff" }} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  // Results screen
  if (result) {
    return (
      <div className="screen">
        <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16 }}>
          <ChevronLeft size={18} /> Back to Test
        </button>

        <Card style={{ background: "var(--dark-gradient)", border: "none", textAlign: "center", padding: 28, boxShadow: "var(--shadow-glow)" }}>
          <p style={{ color: "var(--text-muted-on-dark)", margin: 0, fontSize: 13 }}>Your Score</p>
          <p style={{ color: "#fff", fontSize: 44, fontWeight: 800, margin: "4px 0" }}>{result.score}<span style={{ fontSize: 20 }}>/100</span></p>
          <p style={{ color: "var(--gold)", fontWeight: 700, margin: 0 }}>
            {result.correctCount} of {result.totalQuestions} correct
          </p>
        </Card>

        <h3 style={{ marginTop: 24, marginBottom: 10 }}>Review</h3>
        {quiz.questions.map((q, i) => {
          const b = result.breakdown.find((x) => x.questionId === q.id);
          const chosenOptionId = answers[q.id];
          const chosenText = q.options.find((o) => o.id === chosenOptionId)?.text;
          const correctText = q.options.find((o) => o.id === b?.correctOptionId)?.text;
          return (
            <Card key={q.id} style={{ marginTop: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {b?.correct ? <CheckCircle2 size={20} color="var(--green)" /> : <XCircle size={20} color="var(--red)" />}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{i + 1}. {q.text}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: b?.correct ? "var(--green)" : "var(--red)" }}>
                    Your answer: {chosenText || "—"}
                  </p>
                  {!b?.correct && (
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>
                      Correct answer: {correctText}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        <PrimaryButton
          label="Back to Test"
          onClick={() => navigate("/test")}
          style={{ background: "var(--primary-gradient)", color: "#fff", marginTop: 20 }}
        />
      </div>
    );
  }

  // Quiz-taking screen
  const question = quiz.questions[currentIndex];
  const selectedOptionId = answers[question.id];
  const isLast = currentIndex === quiz.questions.length - 1;

  const selectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = async () => {
    if (!selectedOptionId) return;
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await submitQuiz(id, answers);
      setResult(res);
    } catch {
      setError("Couldn't submit your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen">
      <button onClick={() => navigate("/test")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 12 }}>
        <ChevronLeft size={18} /> Exit
      </button>

      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", margin: 0 }}>{quiz.title}</p>
      <div style={{ marginTop: 8, marginBottom: 20 }}>
        <ProgressBar progress={((currentIndex + 1) / quiz.questions.length) * 100} color="var(--primary)" />
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
          Question {currentIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      <h3 style={{ marginBottom: 16 }}>{question.text}</h3>

      {question.options.map((opt) => {
        const selected = selectedOptionId === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => selectOption(opt.id)}
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
            {opt.text}
          </button>
        );
      })}

      <PrimaryButton
        label={submitting ? "Submitting…" : isLast ? "Submit Quiz" : "Next"}
        onClick={handleNext}
        style={{
          background: selectedOptionId ? "var(--primary-gradient)" : "var(--border)",
          color: selectedOptionId ? "#fff" : "var(--text-secondary)",
          marginTop: 12,
          boxShadow: selectedOptionId ? "var(--shadow-glow)" : "none",
        }}
      />
    </div>
  );
}
