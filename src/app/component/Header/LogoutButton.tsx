"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-white font-hero cursor-pointer hover:text-[#FDCB84] transition-colors bg-transparent border-none p-0"
    >
      Logout
    </button>
  );
}
