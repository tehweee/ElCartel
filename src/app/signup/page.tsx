"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 field
  const [username, setUsername] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Step 1: validate locally then advance ──────────────────────────────────
  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStep(2);
  }

  // ── Step 2: submit everything to the API ──────────────────────────────────
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          username: username.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        // If the conflict was on email, send user back to step 1
        if (data.error?.toLowerCase().includes("email")) setStep(1);
        return;
      }

      router.push("/login");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 brutal-grid-overlay pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#FDCB84]" />
      <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-[#FDCB84]" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-[#FDCB84]" />

      <div className="relative z-10 w-full max-w-md border-4 border-[#FDCB84] bg-black shadow-[10px_10px_0_#FDCB84] p-10 flex flex-col gap-8">
        {/* Title */}
        <div className="text-center flex flex-col items-center gap-2">
          <h1 className="font-hero text-[#FDCB84] text-5xl tracking-[0.3em] uppercase">
            El Cartel
          </h1>
          <div className="h-px w-24 bg-[#FDCB84] opacity-40" />
          <p className="font-hero text-white/40 text-sm tracking-[0.4em] uppercase">
            {step === 1 ? "Create your account" : "Choose your callsign"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-3">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-12 transition-colors ${
                step >= s ? "bg-[#FDCB84]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="brutal-input w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="brutal-input w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="brutal-input w-full"
              />
            </div>

            {error && (
              <p className="font-hero text-red-400 text-sm tracking-widest text-center">
                {error}
              </p>
            )}

            <button type="submit" className="brutal-cta-btn w-full mt-1">
              Continue
            </button>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="flex flex-col gap-5">
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
                autoComplete="username"
                placeholder="Pick a unique callsign"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="brutal-input w-full"
              />
            </div>

            {error && (
              <p className="font-hero text-red-400 text-sm tracking-widest text-center">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="flex-1 border-4 border-[#FDCB84] text-[#FDCB84] font-hero text-lg tracking-widest uppercase py-2 hover:bg-[#FDCB84]/10 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 brutal-cta-btn disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Registering…" : "Register"}
              </button>
            </div>
          </form>
        )}

        <p className="font-hero text-white/30 text-sm tracking-[0.25em] uppercase text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FDCB84] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
