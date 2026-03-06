"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  email: string;
  username: string;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadError, setLoadError] = useState("");

  // Account info form state
  const [username, setUsername] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [infoError, setInfoError] = useState("");
  const [infoLoading, setInfoLoading] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setLoadError(data.error ?? "Failed to load profile");
          return;
        }
        setProfile(data);
        setUsername(data.username);
      })
      .catch(() => setLoadError("Failed to load profile"));
  }, [router]);

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInfoMsg("");
    setInfoError("");
    setInfoLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInfoError(data.error ?? "Update failed");
      } else {
        setProfile((prev) =>
          prev ? { ...prev, username: username.trim() } : prev,
        );
        setInfoMsg("Username updated successfully!");
      }
    } catch {
      setInfoError("An unexpected error occurred.");
    } finally {
      setInfoLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    setPwError("");

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error ?? "Update failed");
      } else {
        setPwMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPwError("An unexpected error occurred.");
    } finally {
      setPwLoading(false);
    }
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#FEF9D1] flex items-center justify-center">
        <p className="font-body text-[#1E1210] text-lg">{loadError}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FEF9D1] flex items-center justify-center">
        <p className="font-body text-[#1E1210] text-lg">Loading…</p>
      </div>
    );
  }

  const inputClass =
    "border border-[#FDCB84] rounded-xl px-4 py-2 bg-[#FEF9D1] text-[#1E1210] font-body placeholder:text-[#1E1210]/40 focus:outline-none focus:ring-2 focus:ring-[#FDCB84] w-full";
  const disabledClass =
    "border border-[#1E1210]/30 rounded-xl px-4 py-2 bg-[#1E1210]/10 text-[#1E1210]/50 font-body w-full cursor-not-allowed";

  return (
    <div className="min-h-screen bg-[#FEF9D1] flex flex-col items-center py-16 px-4">
      <h1 className="font-hero text-[#1E1210] text-5xl mb-10">My Profile</h1>

      <div className="w-full max-w-lg flex flex-col gap-8">
        {/* ── Account Info ─────────────────────────────────────── */}
        <div className="bg-[#1E1210] rounded-2xl p-8 shadow-xl">
          <h2 className="font-hero text-[#FDCB84] text-3xl mb-6">
            Account Info
          </h2>
          <form onSubmit={handleInfoSubmit} className="flex flex-col gap-5">
            {/* Email — read only */}
            <div className="flex flex-col gap-1">
              <label className="text-[#FDCB84] font-hero text-xl">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={disabledClass}
              />
              <p className="font-body text-[#FEF9D1]/40 text-xs mt-1">
                Email cannot be changed.
              </p>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                className="text-[#FDCB84] font-hero text-xl"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={32}
                placeholder="Enter new username"
                className={inputClass}
              />
            </div>

            {infoError && (
              <p className="text-red-400 font-body text-sm text-center">
                {infoError}
              </p>
            )}
            {infoMsg && (
              <p className="text-green-400 font-body text-sm text-center">
                {infoMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={infoLoading || username.trim() === profile.username}
              className="mt-1 bg-[#FDCB84] text-[#1E1210] font-hero text-xl py-2 rounded-xl hover:bg-[#FEF9D1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {infoLoading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* ── Change Password ───────────────────────────────────── */}
        <div className="bg-[#1E1210] rounded-2xl p-8 shadow-xl">
          <h2 className="font-hero text-[#FDCB84] text-3xl mb-6">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="currentPassword"
                className="text-[#FDCB84] font-hero text-xl"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="newPassword"
                className="text-[#FDCB84] font-hero text-xl"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-[#FDCB84] font-hero text-xl"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repeat new password"
                className={inputClass}
              />
            </div>

            {pwError && (
              <p className="text-red-400 font-body text-sm text-center">
                {pwError}
              </p>
            )}
            {pwMsg && (
              <p className="text-green-400 font-body text-sm text-center">
                {pwMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={pwLoading}
              className="mt-1 bg-[#FDCB84] text-[#1E1210] font-hero text-xl py-2 rounded-xl hover:bg-[#FEF9D1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
