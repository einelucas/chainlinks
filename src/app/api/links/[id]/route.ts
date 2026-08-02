import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(linkId: string, userId: string) {
  const link = await prisma.linkItem.findUnique({
    where: { id: linkId },
    include: { page: true },
  });
  if (!link || link.page.userId !== userId) return null;
  return link;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await assertOwnership(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Link não encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const field of ["label", "url", "icon", "isActive", "order"] as const) {
    if (field in body) data[field] = body[field];
  }

  const updated = await prisma.linkItem.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await assertOwnership(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Link não encontrado" }, { status: 404 });
  }

  await prisma.linkItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
