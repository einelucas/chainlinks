import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/** Retorna a Page do usuário logado, ou null se não estiver autenticado. */
export async function getCurrentUserPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const page = await prisma.page.findUnique({
    where: { userId: user.id },
  });
  return page;
}

export async function requireCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
