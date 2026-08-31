import React, { useEffect, useState } from "react";
import { Users, GraduationCap, Trophy, Building2, HandCoins, ExternalLink } from "lucide-react";
import Card from "../components/Card";
import { getConnectResources, ConnectResource } from "../lib/api";

const SECTIONS = [
  { id: "mentors", title: "Mentors", subtitle: "Get guidance from experienced entrepreneurs.", Icon: Users, color: "var(--blue)" },
  { id: "programs", title: "Programs & Incubators", subtitle: "Join top entrepreneurship programs.", Icon: GraduationCap, color: "var(--gold)" },
  { id: "competitions", title: "Competitions", subtitle: "Participate in innovation challenges.", Icon: Trophy, color: "var(--green)" },
  { id: "organizations", title: "Organizations", subtitle: "Connect with organizations that support young innovators.", Icon: Building2, color: "var(--orange)" },
  { id: "investors", title: "Investors", subtitle: "Pitch your ideas and get funded.", Icon: HandCoins, color: "var(--primary)" },
];

export default function Connect() {
  const [resources, setResources] = useState<ConnectResource[] | null>(null);

  useEffect(() => {
    getConnectResources()
      .then((data) => setResources(data.resources))
      .catch(() => setResources([]));
  }, []);

  return (
    <div className="screen">
      <h2 style={{ marginTop: 24, marginBottom: 4 }}>Connect</h2>
      <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>Opportunities await you</p>

      {SECTIONS.map((section) => {
        const items = resources?.filter((r) => r.category === section.id) ?? null;
        return (
          <div key={section.id} style={{ marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: section.color + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: section.color,
                }}
              >
                <section.Icon size={18} />
              </div>
              <div style={{ marginLeft: 10 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{section.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>{section.subtitle}</p>
              </div>
            </div>

            {items === null && (
              <Card>
                <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0, fontSize: 13 }}>Loading…</p>
              </Card>
            )}

            {items?.length === 0 && (
              <Card>
                <p style={{ textAlign: "center", color: "var(--text-secondary)", margin: 0, fontSize: 13 }}>
                  Nothing here yet.
                </p>
              </Card>
            )}

            {items?.map((item) => (
              <Card key={item.id} style={{ marginTop: 8 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                <p style={{ margin: "4px 0", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {item.description}
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 12, fontWeight: 600 }}>{item.contactInfo}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12, color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
                  >
                    Visit link <ExternalLink size={12} />
                  </a>
                )}
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  );
}
