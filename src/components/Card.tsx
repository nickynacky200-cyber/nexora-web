import React from "react";

export default function Card({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        padding: 16,
        boxShadow: "var(--shadow-soft)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
