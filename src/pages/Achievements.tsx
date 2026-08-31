import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Award, Star, GraduationCap, Briefcase, TrendingUp, Zap, Flame, Lock } from "lucide-react";
import Card from "../components/Card";
import { getAchievements, Achievement } from "../lib/api";

const ICONS: Record<string, React.ElementType> = {
  award: Award,
  star: Star,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  zap: Zap,
  flame: Flame,
};

export default function Achievements() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);

  useEffect(() => {
    getAchievements()
      .then((data) => setAchievements(data.achievements))
      .catch(() => setAchievements([]));
  }, []);

  const unlockedCount = achievements?.filter((a) => a.unlocked).length ?? 0;

  return (
    <div className="screen">
      <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Profile
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 4 }}>Achievements</h2>
      {achievements && (
        <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
          {unlockedCount} of {achievements.length} unlocked
        </p>
      )}

      {achievements === null && (
        <Card>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0 }}>Loading…</p>
        </Card>
      )}

      {achievements?.map((a) => {
        const Icon = ICONS[a.icon] || Award;
        return (
          <Card
            key={a.key}
            style={{
              marginTop: 10,
              opacity: a.unlocked ? 1 : 0.55,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: a.unlocked ? "var(--gold)22" : "var(--surface-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: a.unlocked ? "var(--gold)" : "var(--text-secondary)",
                  flexShrink: 0,
                }}
              >
                {a.unlocked ? <Icon size={22} /> : <Lock size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{a.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-secondary)" }}>{a.description}</p>
                {a.unlocked && a.unlockedAt && (
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--green)" }}>
                    Unlocked {new Date(a.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
