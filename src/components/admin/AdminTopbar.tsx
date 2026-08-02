"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminTopbar({
  username,
  userName,
}: {
  username: string;
  userName: string;
}) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">
            L
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-tight">
              {userName || "Sua conta"}
            </p>
            <p className="text-xs text-neutral-500 leading-tight">/{username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${username}`}
            target="_blank"
            className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:border-emerald-500 hover:text-emerald-400 transition"
          >
            Ver página →
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-400 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
