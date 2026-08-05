import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { orderedIds } = (await req.json()) as { orderedIds: string[] };
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const page = await prisma.page.findUnique({
    where: { userId: user.id },
    include: { links: true },
  });
  if (!page) {
    return NextResponse.json({ error: "Página não encontrada" }, { status: 404 });
  }

  const ownedIds = new Set(page.links.map((l) => l.id));
  const safeIds = orderedIds.filter((id) => ownedIds.has(id));

  await prisma.$transaction(
    safeIds.map((id, index) =>
      prisma.linkItem.update({ where: { id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
