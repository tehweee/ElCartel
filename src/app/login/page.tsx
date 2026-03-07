"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.push("/profile");
      router.refresh();
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
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="identifier"
              className="font-hero text-[#FDCB84] text-lg tracking-widest uppercase"
            >
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              autoComplete="username email"
              placeholder="Enter email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="brutal-input w-full"
            />
          </div>

          {error && (
            <p className="font-hero text-red-400 text-sm tracking-widest text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="brutal-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed mt-1"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="font-hero text-white/30 text-sm tracking-[0.25em] uppercase text-center">
          No account?{" "}
          <Link href="/signup" className="text-[#FDCB84] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
