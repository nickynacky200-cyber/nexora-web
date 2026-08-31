import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Ribbon, Trophy, Bookmark, Settings, ChevronRight, FolderOpen } from "lucide-react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import { useCurrentUser } from "../lib/useCurrentUser";

const MENU_ITEMS = [
  { label: "My Readiness Report", Icon: BarChart3, path: null },
  { label: "My Portfolio", Icon: FolderOpen, path: "/profile/portfolio" },
  { label: "My Certificates", Icon: Ribbon, path: "/profile/certificates" },
  { label: "Achievements", Icon: Trophy, path: "/profile/achievements" },
  { label: "Saved Resources", Icon: Bookmark, path: null },
  { label: "Account Settings", Icon: Settings, path: "/profile/settings" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const { user, loading } = useCurrentUser();
  const navigate = useNavigate();
  if (loading) return null;

  const xp = user?.profile?.xp ?? 0;
  const level = user?.profile?.level ?? "Level 1 Innovator";

  return (
    <div className="screen">
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            background: "var(--primary-gradient)",
            margin: "0 auto 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 28,
            fontWeight: 700,
            boxShadow: "var(--shadow-glow)",
          }}
        >
          {user ? initials(user.name) : "?"}
        </div>
        <h3 style={{ margin: 0 }}>{user?.name}</h3>
        <p style={{ margin: "2px 0 14px", color: "var(--primary)", fontSize: 13, fontWeight: 600 }}>{level}</p>
        <ProgressBar progress={Math.min(100, (xp / 5000) * 100)} color="var(--primary)" />
        <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-secondary)" }}>{xp} / 5000 XP</p>
      </div>

      {MENU_ITEMS.map(({ label, Icon, path }) => (
        <Card
          key={label}
          style={{ marginTop: 10, cursor: path ? "pointer" : "default", opacity: path ? 1 : 0.55 }}
          onClick={() => path && navigate(path)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon size={18} color="var(--primary)" />
            <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{label}</span>
            {path ? (
              <ChevronRight size={16} color="var(--text-secondary)" />
            ) : (
              <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Coming soon</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
