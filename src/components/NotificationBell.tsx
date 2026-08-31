import React, { useEffect, useState } from "react";
import { Bell, RefreshCw, X } from "lucide-react";
import { getNotifications, markNotificationsRead, Announcement } from "../lib/api";
import { startUpdateCheck } from "../lib/updateCheck";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    getNotifications()
      .then((data) => {
        setAnnouncements(data.announcements);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => {});

    const stop = startUpdateCheck(() => setUpdateAvailable(true));
    return stop;
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (unreadCount > 0) {
      setUnreadCount(0);
      markNotificationsRead().catch(() => {});
    }
  };

  const hasBadge = unreadCount > 0 || updateAvailable;

  return (
    <>
      <button
        onClick={handleOpen}
        style={{ background: "none", border: "none", padding: 0, position: "relative", cursor: "pointer" }}
        aria-label="Notifications"
      >
        <Bell size={22} color="var(--text-primary)" />
        {hasBadge && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 9,
              height: 9,
              borderRadius: 5,
              background: "var(--red)",
              border: "1.5px solid var(--background)",
            }}
          />
        )}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: 60,
              width: "min(92%, 420px)",
              maxHeight: "70vh",
              overflowY: "auto",
              background: "var(--surface)",
              borderRadius: 16,
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>Notifications</p>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", padding: 0 }}>
                <X size={18} color="var(--text-secondary)" />
              </button>
            </div>

            {updateAvailable && (
              <div
                style={{
                  background: "var(--primary-gradient)",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <RefreshCw size={18} color="#fff" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 13 }}>Update available</p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.85)", fontSize: 11 }}>
                    A newer version of Next Bridge is ready.
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    background: "#fff",
                    color: "var(--primary)",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 10px",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  Refresh
                </button>
              </div>
            )}

            {announcements.length === 0 && !updateAvailable && (
              <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 13, padding: "20px 0" }}>
                Nothing new right now.
              </p>
            )}

            {announcements.map((a) => (
              <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{a.title}</p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{a.body}</p>
                <p style={{ margin: "4px 0 0", fontSize: 10, color: "var(--text-secondary)" }}>{timeAgo(a.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
