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
    <div className="min-h-screen bg-[#FEF9D1] flex items-center justify-center px-4">
      <div className="bg-[#1E1210] rounded-2xl p-10 w-full max-w-md shadow-xl">
        {/* Title */}
        <h1 className="font-hero text-[#FDCB84] text-4xl text-center mb-1">
          El Cartel
        </h1>
        <p className="font-body text-[#FEF9D1]/70 text-center text-sm mb-2">
          {step === 1 ? "Create your account" : "Choose your username"}
        </p>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 w-10 rounded-full transition-colors ${
                step >= s ? "bg-[#FDCB84]" : "bg-[#FEF9D1]/20"
              }`}
            />
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-[#FDCB84] font-hero text-xl"
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
                className="border border-[#FDCB84] rounded-xl px-4 py-2 bg-[#FEF9D1] text-[#1E1210] font-body placeholder:text-[#1E1210]/40 focus:outline-none focus:ring-2 focus:ring-[#FDCB84]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-[#FDCB84] font-hero text-xl"
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
                className="border border-[#FDCB84] rounded-xl px-4 py-2 bg-[#FEF9D1] text-[#1E1210] font-body placeholder:text-[#1E1210]/40 focus:outline-none focus:ring-2 focus:ring-[#FDCB84]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-[#FDCB84] font-hero text-xl"
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
                className="border border-[#FDCB84] rounded-xl px-4 py-2 bg-[#FEF9D1] text-[#1E1210] font-body placeholder:text-[#1E1210]/40 focus:outline-none focus:ring-2 focus:ring-[#FDCB84]"
              />
            </div>

            {error && (
              <p className="text-red-400 font-body text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 bg-[#FDCB84] text-[#1E1210] font-hero text-xl py-2 rounded-xl hover:bg-[#FEF9D1] transition-colors cursor-pointer"
            >
              Continue
            </button>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="flex flex-col gap-5">
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
                autoComplete="username"
                placeholder="Pick a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border border-[#FDCB84] rounded-xl px-4 py-2 bg-[#FEF9D1] text-[#1E1210] font-body placeholder:text-[#1E1210]/40 focus:outline-none focus:ring-2 focus:ring-[#FDCB84]"
              />
            </div>

            {error && (
              <p className="text-red-400 font-body text-sm text-center">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="flex-1 border border-[#FDCB84] text-[#FDCB84] font-hero text-xl py-2 rounded-xl hover:bg-[#FDCB84]/10 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FDCB84] text-[#1E1210] font-hero text-xl py-2 rounded-xl hover:bg-[#FEF9D1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Registering…" : "Register"}
              </button>
            </div>
          </form>
        )}

        <p className="text-[#FEF9D1]/60 font-body text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#FDCB84] hover:underline font-body"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
