import React from "react";

export default function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "var(--surface-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>
      <p style={{ fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", fontSize: 16 }}>{title}</p>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{subtitle}</p>
    </div>
  );
}
