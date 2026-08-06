"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

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

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const availability = await fetch(
        `/api/username-available?u=${encodeURIComponent(form.username)}`
      ).then((res) => res.json());

      if (!availability.available) {
        setError(availability.error ?? "Este nome de usuário já está em uso");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, username: form.username },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });

      if (signUpError) {
        setError(
          signUpError.message === "User already registered"
            ? "Este email já está cadastrado"
            : "Erro ao criar conta. Tente novamente."
        );
        setLoading(false);
        return;
      }

      if (!data.session) {
        // Projeto Supabase exige confirmação por e-mail antes de criar sessão
        setInfo("Enviamos um link de confirmação para o seu email. Confirme para continuar.");
        setLoading(false);
        return;
      }

      // Navegação completa (não router.push): garante que o servidor recebe
      // o cookie de sessão recém-criado já na primeira request pro /admin,
      // sem depender de cache/timing do client-side router.
      window.location.href = "/admin";
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    if (isGoogleLoading) return;
    setError(null);
    setIsGoogleLoading(true);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err) {
      console.error("Erro ao criar conta com Google:", err);
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
          <h1 className="text-2xl font-bold text-white">Crie sua página</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Seu link personalizável, do seu jeito.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4"
        >
          {error && (
            <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {info && (
            <div className="text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded-lg px-3 py-2">
              {info}
            </div>
          )}

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Nome</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              Nome de usuário
            </label>
            <div className="flex items-center rounded-lg bg-neutral-800 border border-neutral-700 focus-within:ring-2 focus-within:ring-emerald-500">
              <span className="pl-3 text-neutral-400 text-sm">/</span>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value.toLowerCase().replace(/\s/g, ""),
                  })
                }
                className="w-full bg-transparent px-1 py-2 text-white text-sm focus:outline-none"
                placeholder="seu-usuario"
              />
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Sua página ficará em: /{form.username || "seu-usuario"}
            </p>
          </div>

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
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-medium py-2.5 text-sm transition"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-800" />
            <span className="text-xs text-neutral-500">ou</span>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
            aria-label="Cadastrar com Google"
            className="w-full flex items-center justify-center gap-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700 text-white font-medium py-2.5 text-sm transition"
          >
            <GoogleIcon />
            {isGoogleLoading ? "Redirecionando..." : "Cadastrar com Google"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
