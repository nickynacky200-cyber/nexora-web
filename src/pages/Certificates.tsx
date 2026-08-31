import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Ribbon, Lock, ChevronRight } from "lucide-react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { getCertificates, Certificate } from "../lib/api";

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);

  useEffect(() => {
    getCertificates()
      .then((data) => setCertificates(data.certificates))
      .catch(() => setCertificates([]));
  }, []);

  return (
    <div className="screen">
      <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Profile
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>My Certificates</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Earned by completing real milestones</p>

      {certificates === null && (
        <Card>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0 }}>Loading…</p>
        </Card>
      )}

      {certificates?.length === 0 && (
        <Card>
          <EmptyState icon={<Ribbon size={24} />} title="No certificate types yet" subtitle="More certificates are on the way." />
        </Card>
      )}

      {certificates?.map((c) => (
        <Card
          key={c.key}
          style={{ marginTop: 10, cursor: c.issued ? "pointer" : "default", opacity: c.issued ? 1 : 0.6 }}
          onClick={() => c.issued && navigate(`/profile/certificates/${c.key}`)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: c.issued ? "var(--gold)22" : "var(--surface-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.issued ? "var(--gold)" : "var(--text-secondary)",
                flexShrink: 0,
              }}
            >
              {c.issued ? <Ribbon size={22} /> : <Lock size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{c.title}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>{c.description}</p>
              {c.issued && c.issuedAt && (
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--green)" }}>
                  Issued {new Date(c.issuedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            {c.issued && <ChevronRight size={18} color="var(--text-secondary)" />}
          </div>
        </Card>
      ))}
    </div>
  );
}
