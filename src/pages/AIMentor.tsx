import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, Send } from "lucide-react";
import { getMentorHistory, sendMentorMessage, MentorMessage } from "../lib/api";

export default function AIMentor() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMentorHistory()
      .then((data) => setMessages(data.messages))
      .catch(() => setError("Couldn't load your conversation."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text, createdAt: new Date().toISOString() }]);
    setSending(true);

    try {
      const res = await sendMentorMessage(text);
      setMessages((prev) => [...prev, res.message]);
    } catch (err: any) {
      setError(err?.message || "Something went wrong — try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 12 }}>
      <button
        onClick={() => navigate("/home")}
        style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 12, marginTop: 8 }}
      >
        <ChevronLeft size={18} /> Back to Home
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "var(--primary-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>AI Mentor</p>
          <p style={{ margin: 0, fontSize: 11, color: "var(--text-secondary)" }}>Ask anything about your idea or business</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
        {loading && <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Loading…</p>}

        {!loading && messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 40, color: "var(--text-secondary)" }}>
            <Sparkles size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
            <p style={{ fontSize: 14, margin: 0 }}>Ask about your idea, a decision you're stuck on, or anything from the guide.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={m.id || i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              background: m.role === "user" ? "var(--primary-gradient)" : "var(--surface)",
              color: m.role === "user" ? "#fff" : "var(--text-primary)",
              border: m.role === "user" ? "none" : "1px solid var(--border)",
              borderRadius: 14,
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {m.content}
          </div>
        ))}

        {sending && (
          <div style={{ alignSelf: "flex-start", color: "var(--text-secondary)", fontSize: 13, padding: "4px 14px" }}>
            Thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <p style={{ color: "var(--red)", fontSize: 13, margin: "0 0 8px" }}>{error}</p>}

      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your mentor…"
          rows={1}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            border: "1px solid var(--border)",
            fontSize: 14,
            fontFamily: "inherit",
            resize: "none",
            background: "var(--surface)",
            color: "var(--text-primary)",
            maxHeight: 100,
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "none",
            background: input.trim() ? "var(--primary-gradient)" : "var(--border)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
