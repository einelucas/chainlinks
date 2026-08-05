"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Não foi possível continuar com o Google. Tente novamente.",
  OAuthSignin: "Não foi possível iniciar o login com Google. Tente novamente.",
  OAuthCallback: "Falha ao concluir o login com Google. Tente novamente.",
  Configuration: "Login com Google indisponível no momento.",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // Lê o ?error= que o NextAuth anexa ao redirecionar de volta pra cá
    // após uma falha no OAuth do Google — só existe no client (window),
    // por isso não dá pra derivar isso durante a renderização inicial.
    const params = new URLSearchParams(window.location.search);
    const code = params.get("error");
    if (code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com o parâmetro de URL, disponível só após o mount
      setError(OAUTH_ERROR_MESSAGES[code] ?? "Não foi possível fazer login. Tente novamente.");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha incorretos");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleGoogleLogin() {
    if (isGoogleLoading) return;
    setError(null);
    setIsGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl: "/admin" });
    } catch (err) {
      console.error("Erro ao entrar com Google:", err);
      setError("Não foi possível continuar com o Google. Tente novamente.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/" className="brand" aria-label="ChainLinks — início">
            <Image src="/logo-mark.png" alt="" width={44} height={44} className="brand-mark" />
            <span>ChainLinks</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Entre para editar sua página
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Senha</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-medium py-2.5 text-sm transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-800" />
            <span className="text-xs text-neutral-500">ou</span>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            aria-label="Continuar com Google"
            className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700 text-white font-medium py-2.5 text-sm transition"
          >
            <GoogleIcon />
            {isGoogleLoading ? "Redirecionando..." : "Continuar com Google"}
          </button>
        </div>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Não tem conta?{" "}
          <Link href="/register" className="text-emerald-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
