import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, CheckCircle2, Lightbulb, Users, User } from "lucide-react";

const TABS = [
  { path: "/home", label: "Home", Icon: Home },
  { path: "/learn", label: "Learn", Icon: BookOpen },
  { path: "/test", label: "Test", Icon: CheckCircle2 },
  { path: "/ideas", label: "Ideas", Icon: Lightbulb },
  { path: "/connect", label: "Connect", Icon: Users },
  { path: "/profile", label: "Profile", Icon: User },
];

export default function BottomNav() {
  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        padding: "10px 0 calc(10px + env(safe-area-inset-bottom)) 0",
        boxShadow: "0 -4px 16px rgba(23,13,52,0.05)",
      }}
    >
      {TABS.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path}
          style={({ isActive }) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            fontSize: 10,
            fontWeight: 600,
            color: isActive ? "var(--primary)" : "var(--text-secondary)",
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
