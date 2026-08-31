import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { upload } from "@vercel/blob/client";
import { ChevronLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { API_URL } from "../lib/api";

const CATEGORIES = [
  { id: "entrepreneurship", label: "Entrepreneurship Studies" },
  { id: "innovation", label: "Innovation Studies" },
  { id: "personal-dev", label: "Personal Development" },
  { id: "financial-literacy", label: "Financial Literacy" },
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

export default function AdminBookUpload() {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Choose a PDF file first.");
      return;
    }
    if (!adminKey || !title.trim()) {
      setError("Admin key and title are required.");
      return;
    }

    setUploading(true);
    setProgressLabel("Uploading…");

    try {
      await upload(file.name, file, {
        access: "public",
        handleUploadUrl: `${API_URL}/api/books/upload-url`,
        clientPayload: JSON.stringify({ adminKey, title, author, description, category }),
      });
      setSuccess(true);
      setTitle("");
      setAuthor("");
      setDescription("");
      setFile(null);
    } catch (err: any) {
      // The upload library's error message is generic ("Failed to
      // retrieve the client token") no matter the real cause. Replay the
      // same first-step request manually so we can show the server's
      // actual status code and error body instead.
      let detail = err?.message || "Upload failed.";
      try {
        const probe = await fetch(`${API_URL}/api/books/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "blob.generate-client-token",
            payload: {
              pathname: file.name,
              callbackUrl: `${API_URL}/api/books/upload-url`,
              clientPayload: JSON.stringify({ adminKey, title, author, description, category }),
              multipart: false,
            },
          }),
        });
        const text = await probe.text();
        detail = `${detail} — server responded ${probe.status}: ${text.slice(0, 300)}`;
      } catch (probeErr: any) {
        detail = `${detail} — diagnostic request also failed: ${probeErr?.message || probeErr}`;
      }
      setError(detail);
    } finally {
      setUploading(false);
      setProgressLabel("");
    }
  };

  return (
    <div className="screen">
      <button onClick={() => navigate("/learn")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Learn
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>Upload a Book</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0, marginBottom: 20 }}>
        Admin only. The file goes straight to storage — this works for real ebook PDFs of any reasonable size.
      </p>

      {success && (
        <Card style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={20} color="var(--green)" />
          <span style={{ fontWeight: 600 }}>Book uploaded and now live in Learn.</span>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Admin key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 14,
            borderRadius: 10,
            border: "1px dashed var(--border)",
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          <UploadCloud size={20} color="var(--primary)" />
          <span style={{ fontSize: 14, color: file ? "var(--text-primary)" : "var(--text-secondary)" }}>
            {file ? file.name : "Choose PDF file"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />
        </label>

        {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: -6, marginBottom: 12, wordBreak: "break-word" }}>{error}</p>}

        <PrimaryButton
          label={uploading ? progressLabel || "Uploading…" : "Upload Book"}
          onClick={() => {}}
          style={{ background: "var(--primary-gradient)", color: "#fff" }}
        />
      </form>
    </div>
  );
}
