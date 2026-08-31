import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Ribbon, Printer } from "lucide-react";
import { getCertificates, Certificate } from "../lib/api";

export default function CertificateView() {
  const navigate = useNavigate();
  const { key } = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getCertificates()
      .then((data) => {
        const found = data.certificates.find((c) => c.key === key && c.issued);
        if (found) setCertificate(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [key]);

  if (notFound) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>This certificate hasn't been earned yet.</p>
        <button onClick={() => navigate("/profile/certificates")} style={{ background: "none", border: "none", color: "var(--primary)", padding: 0 }}>
          Back to Certificates
        </button>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="screen">
        <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 16 }}>
        <button onClick={() => navigate("/profile/certificates")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)" }}>
          <ChevronLeft size={18} /> Back
        </button>
        <button
          onClick={() => window.print()}
          style={{ background: "var(--primary-gradient)", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13 }}
        >
          <Printer size={16} /> Save as PDF
        </button>
      </div>

      <div
        style={{
          border: "3px solid var(--gold)",
          borderRadius: 16,
          padding: "36px 24px",
          textAlign: "center",
          background: "linear-gradient(180deg, #FFFDF7 0%, #FFF9EC 100%)",
        }}
      >
        <Ribbon size={40} color="var(--gold)" style={{ margin: "0 auto 12px" }} />
        <p style={{ letterSpacing: 2, fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>NEXT BRIDGE</p>
        <h2 style={{ margin: "8px 0 4px", fontSize: 20 }}>{certificate.title}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, margin: "0 0 24px" }}>This certifies that</p>
        <p style={{ fontSize: 24, fontWeight: 800, margin: "0 0 24px", color: "var(--primary)" }}>
          {certificate.recipientName}
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7, margin: "0 0 24px" }}>
          {certificate.description}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-secondary)" }}>Readiness Score</p>
            <p style={{ margin: "2px 0 0", fontWeight: 700 }}>{certificate.readinessScoreAtIssue}/100</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-secondary)" }}>Issued</p>
            <p style={{ margin: "2px 0 0", fontWeight: 700 }}>
              {certificate.issuedAt && new Date(certificate.issuedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
