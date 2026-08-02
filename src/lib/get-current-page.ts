import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Retorna a Page do usuário logado, ou null se não estiver autenticado. */
export async function getCurrentUserPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const page = await prisma.page.findUnique({
    where: { userId: session.user.id },
  });
  return page;
}

export async function requireCurrentUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user.id;
}
