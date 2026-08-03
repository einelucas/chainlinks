"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin/error-boundary]", error);
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="max-w-xl rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
        <h1 className="text-lg font-semibold text-red-300">
          O painel encontrou um erro
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-300">
          Não foi possível renderizar esta área. Confira o terminal do Next.js e
          as variáveis DATABASE_URL, AUTH_SECRET e NEXTAUTH_URL.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
          >
            Tentar novamente
          </button>
          <Link
            href="/login"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
