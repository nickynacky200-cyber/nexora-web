import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import { useCurrentUser } from "../lib/useCurrentUser";
import { updateName, changePassword, logout } from "../lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid var(--border)",
  fontSize: 15,
  marginBottom: 12,
  background: "var(--surface)",
  color: "var(--text-primary)",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "var(--primary-gradient)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 14,
};

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const [name, setName] = useState(user?.name || "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const handleSaveName = async () => {
    if (!name.trim()) {
      setNameError("Name can't be empty.");
      return;
    }
    setNameError(null);
    setNameSaving(true);
    try {
      await updateName(name.trim());
      setNameSaved(true);
    } catch {
      setNameError("Couldn't save your name.");
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPwError("Both fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    setPwError(null);
    setPwSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwSaved(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwError(err?.message || "Couldn't change your password.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="screen">
      <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: 4, color: "var(--text-secondary)", marginBottom: 16, marginTop: 8 }}>
        <ChevronLeft size={18} /> Back to Profile
      </button>

      <h2 style={{ marginTop: 0, marginBottom: 20 }}>Account Settings</h2>

      <h3 style={{ fontSize: 14, marginBottom: 10 }}>Display Name</h3>
      <Card>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameSaved(false);
          }}
          style={inputStyle}
        />
        {nameError && <p style={{ color: "var(--red)", fontSize: 13, marginTop: -6, marginBottom: 10 }}>{nameError}</p>}
        {nameSaved && !nameError && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <CheckCircle2 size={14} color="var(--green)" />
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>Saved</span>
          </div>
        )}
        <button onClick={handleSaveName} disabled={nameSaving} style={buttonStyle}>
          {nameSaving ? "Saving…" : "Save Name"}
        </button>
      </Card>

      <h3 style={{ fontSize: 14, marginTop: 24, marginBottom: 10 }}>Change Password</h3>
      <Card>
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            setPwSaved(false);
          }}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="New password (min 6 characters)"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPwSaved(false);
          }}
          style={inputStyle}
        />
        {pwError && <p style={{ color: "var(--red)", fontSize: 13, marginTop: -6, marginBottom: 10 }}>{pwError}</p>}
        {pwSaved && !pwError && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <CheckCircle2 size={14} color="var(--green)" />
            <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>Password updated</span>
          </div>
        )}
        <button onClick={handleChangePassword} disabled={pwSaving} style={buttonStyle}>
          {pwSaving ? "Updating…" : "Change Password"}
        </button>
      </Card>

      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          marginTop: 24,
          padding: 14,
          borderRadius: 10,
          border: "1px solid var(--red)",
          background: "transparent",
          color: "var(--red)",
          fontWeight: 700,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <LogOut size={16} /> Log Out
      </button>
    </div>
  );
}
