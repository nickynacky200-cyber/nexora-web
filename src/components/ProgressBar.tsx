import React from "react";

export default function ProgressBar({
  progress,
  color = "var(--primary)",
  trackColor = "var(--surface-muted)",
  height = 6,
}: {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: "var(--radius-pill)",
        background: trackColor,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: color,
          borderRadius: "var(--radius-pill)",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}
