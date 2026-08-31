import React from "react";

export default function PrimaryButton({
  label,
  onClick,
  variant = "solid",
  style,
}: {
  label: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
  style?: React.CSSProperties;
}) {
  const isSolid = variant === "solid";
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: "var(--radius-md)",
        border: isSolid ? "none" : "1.5px solid var(--surface)",
        background: isSolid ? "var(--primary-gradient)" : "transparent",
        color: "var(--text-on-dark)",
        fontWeight: 700,
        fontSize: 15,
        boxShadow: isSolid ? "var(--shadow-glow)" : "none",
        transition: "transform 0.15s ease",
        ...style,
      }}
    >
      {label}
    </button>
  );
}
