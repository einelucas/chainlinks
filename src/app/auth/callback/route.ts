import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ensurePageForUser } from "@/lib/ensure-page";

/** Aceita só caminhos internos (ex: "/admin"), nunca URLs externas. */
function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  // O Supabase às vezes redireciona de volta pra cá já com erro, sem "code"
  // (ex: URL de redirect não está na allowlist do projeto).
  const oauthError = requestUrl.searchParams.get("error");
  const oauthErrorDescription = requestUrl.searchParams.get("error_description");
  if (oauthError) {
    console.error(
      `[auth/callback] Supabase retornou erro antes da troca de código: ${oauthError} — ${oauthErrorDescription}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession falhou:", error.message);
    }

    if (!error && data.user) {
      try {
        await ensurePageForUser(data.user);
      } catch (err) {
        console.error("[auth/callback] Falha ao provisionar a página:", err);
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  } else if (!oauthError) {
    console.error("[auth/callback] Requisição sem 'code' e sem 'error' — URL:", requestUrl.toString());
  }

  return NextResponse.redirect(
    new URL("/login?error=oauth_callback_error", requestUrl.origin)
  );
}
