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
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="relative z-10 border-4 border-[#FDCB84] px-10 py-6 shadow-[6px_6px_0_#FDCB84] bg-black">
          <p className="font-hero text-[#FDCB84] text-2xl tracking-widest">
            {loadError}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
        <div className="relative z-10 border-4 border-[#FDCB84] px-10 py-6 shadow-[6px_6px_0_#FDCB84] bg-black">
          <p className="font-hero text-[#FDCB84] text-2xl tracking-widest">
            Loading Arsenal...
          </p>
        </div>
      </div>
    );
  }

  const inputClass = "brutal-input w-full";
  const disabledClass = "brutal-input-disabled w-full";

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />

      <div className="relative z-10 max-w-lg mx-auto px-6 py-24 flex flex-col gap-10">
        {/* Page header */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#FDCB84] opacity-30" />
          <div className="border-4 border-[#FDCB84] px-8 py-3 shadow-[6px_6px_0_#FDCB84] bg-black">
            <h1 className="font-hero text-[#FDCB84] text-4xl tracking-[0.4em] uppercase">
              My Profile
            </h1>
          </div>
          <div className="h-px flex-1 bg-[#FDCB84] opacity-30" />
        </div>

        {/* ── Account Info ── */}
        <div className="border-4 border-[#FDCB84] bg-black shadow-[6px_6px_0_#FDCB84] p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-[#FDCB84] opacity-40" />
            <h2 className="font-hero text-[#FDCB84] text-2xl tracking-[0.3em] uppercase">
              Account Info
            </h2>
            <div className="h-px flex-1 bg-[#FDCB84] opacity-40" />
          </div>

          <form onSubmit={handleInfoSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className={disabledClass}
              />
              <p className="font-hero text-white/25 text-xs tracking-[0.3em] uppercase">
                Email cannot be changed.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
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
              <p className="font-hero text-red-400 text-sm tracking-widest text-center">
                {infoError}
              </p>
            )}
            {infoMsg && (
              <p className="font-hero text-green-400 text-sm tracking-widest text-center">
                {infoMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={infoLoading || username.trim() === profile.username}
              className="brutal-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {infoLoading ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* ── Change Password ── */}
        <div className="border-4 border-[#FDCB84] bg-black shadow-[6px_6px_0_#FDCB84] p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-[#FDCB84] opacity-40" />
            <h2 className="font-hero text-[#FDCB84] text-2xl tracking-[0.3em] uppercase">
              Change Password
            </h2>
            <div className="h-px flex-1 bg-[#FDCB84] opacity-40" />
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="currentPassword"
                className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
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

            <div className="flex flex-col gap-2">
              <label
                htmlFor="newPassword"
                className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
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

            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
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
              <p className="font-hero text-red-400 text-sm tracking-widest text-center">
                {pwError}
              </p>
            )}
            {pwMsg && (
              <p className="font-hero text-green-400 text-sm tracking-widest text-center">
                {pwMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={pwLoading}
              className="brutal-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed mt-1"
            >
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
