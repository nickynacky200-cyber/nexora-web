import React from "react";

export default function ScoreRing({
  score,
  size = 88,
  strokeWidth = 8,
  ringColor = "var(--gold)",
  trackColor = "rgba(255,255,255,0.15)",
  valueColor = "var(--text-on-dark)",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  ringColor?: string;
  trackColor?: string;
  valueColor?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 700, color: valueColor }}>{Math.round(clamped)}</span>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted-on-dark)" }}>/100</span>
      </div>
    </div>
  );
}
