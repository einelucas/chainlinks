import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { RESERVED_USERNAMES, usernameSchema } from "@/lib/validation";

function sanitizeUsername(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 25);
}

async function generateUniqueUsername(preferred: string | undefined, email: string) {
  const base = (preferred && sanitizeUsername(preferred)) || sanitizeUsername(email.split("@")[0]) || "usuario";

  let candidate = base;
  let suffix = 1;

  while (
    candidate.length < 3 ||
    RESERVED_USERNAMES.includes(candidate) ||
    !usernameSchema.safeParse(candidate).success ||
    (await prisma.page.findUnique({ where: { username: candidate } }))
  ) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}

/**
 * Garante que exista uma Page (perfil da aplicação) pro usuário autenticado
 * no Supabase. Não sobrescreve nada em usuários que já têm Page — só cria
 * na primeira vez. Se `user.user_metadata.username` veio de um cadastro
 * explícito (formulário de registro), usa esse valor como preferência;
 * senão deriva do nome/e-mail (ex: login direto via Google).
 */
export async function ensurePageForUser(user: User) {
  const existing = await prisma.page.findUnique({ where: { userId: user.id } });
  if (existing) return existing;

  if (!user.email) {
    throw new Error("Usuário do Supabase sem e-mail — não é possível criar a página.");
  }

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const preferredUsername =
    typeof metadata?.username === "string" ? metadata.username : undefined;
  const name =
    typeof metadata?.name === "string"
      ? metadata.name
      : typeof metadata?.full_name === "string"
        ? metadata.full_name
        : undefined;
  const avatarUrl =
    typeof metadata?.avatar_url === "string" ? metadata.avatar_url : undefined;

  const username = await generateUniqueUsername(preferredUsername, user.email);

  return prisma.page.create({
    data: {
      userId: user.id,
      username,
      displayName: name ?? username,
      profileImage: avatarUrl ?? null,
    },
  });
}
