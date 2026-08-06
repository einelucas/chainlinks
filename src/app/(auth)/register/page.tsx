"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

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
