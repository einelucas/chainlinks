import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { orderedIds } = (await req.json()) as { orderedIds: string[] };
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const page = await prisma.page.findUnique({
    where: { userId: session.user.id },
    include: { socialIcons: true },
  });
  if (!page) {
    return NextResponse.json({ error: "Página não encontrada" }, { status: 404 });
  }

  const ownedIds = new Set(page.socialIcons.map((s) => s.id));
  const safeIds = orderedIds.filter((id) => ownedIds.has(id));

  await prisma.$transaction(
    safeIds.map((id, index) =>
      prisma.socialIcon.update({ where: { id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
