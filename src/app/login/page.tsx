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
    <div className="min-h-screen bg-[#FEF9D1] flex items-center justify-center px-4">
      <div className="bg-[#1E1210] rounded-2xl p-10 w-full max-w-md shadow-xl">
        {/* Logo / Title */}
        <h1 className="font-hero text-[#FDCB84] text-4xl text-center mb-1">
          El Cartel
        </h1>
        <p className="font-body text-[#FEF9D1]/70 text-center text-sm mb-8">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Identifier */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="identifier"
              className="text-[#FDCB84] font-hero text-xl"
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
              className="border border-[#FDCB84] rounded-xl px-4 py-2 bg-[#FEF9D1] text-[#1E1210] font-body placeholder:text-[#1E1210]/40 focus:outline-none focus:ring-2 focus:ring-[#FDCB84]"
            />
          </div>

          {/* Password */}
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
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-[#FDCB84] rounded-xl px-4 py-2 bg-[#FEF9D1] text-[#1E1210] font-body placeholder:text-[#1E1210]/40 focus:outline-none focus:ring-2 focus:ring-[#FDCB84]"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 font-body text-sm text-center">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#FDCB84] text-[#1E1210] font-hero text-xl py-2 rounded-xl hover:bg-[#FEF9D1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-[#FEF9D1]/60 font-body text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#FDCB84] hover:underline font-body"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
