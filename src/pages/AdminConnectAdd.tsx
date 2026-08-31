import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import PrimaryButton from "../components/PrimaryButton";
import { addConnectResource } from "../lib/api";

const CATEGORIES = [
  { id: "mentors", label: "Mentor" },
  { id: "programs", label: "Program / Incubator" },
  { id: "competitions", label: "Competition" },
  { id: "organizations", label: "Organization" },
  { id: "investors", label: "Investor" },
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

export default function AdminConnectAdd() {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminKey || !name.trim() || !description.trim() || !contactInfo.trim()) {
      setError("Admin key, name, description, and contact info are required.");
      return;
    }

    setSubmitting(true);
    try {
      await addConnectResource({ adminKey, category, name, description, contactInfo, link });
      setSuccess(true);
      setName("");
      setDescription("");
      setContactInfo("");
      setLink("");
    } catch (err: any) {
      setError(err?.message || "Couldn't add this resource.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen">
      <button onClick={() => navigate("/connect")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Connect
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>Add a Connect Resource</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0, marginBottom: 20 }}>
        Admin only. Adds a mentor, program, competition, organization, or investor listing.
      </p>

      {success && (
        <Card style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={20} color="var(--green)" />
          <span style={{ fontWeight: 600 }}>Added — now live in Connect.</span>
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
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
        />
        <input
          type="text"
          placeholder="Contact info (email, phone, etc.)"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Website or application link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={inputStyle}
        />

        {error && <p style={{ color: "var(--red)", fontSize: 13, marginTop: -6, marginBottom: 12 }}>{error}</p>}

        <PrimaryButton
          label={submitting ? "Adding…" : "Add to Connect"}
          onClick={() => {}}
          style={{ background: "var(--primary-gradient)", color: "#fff" }}
        />
      </form>
    </div>
  );
}
