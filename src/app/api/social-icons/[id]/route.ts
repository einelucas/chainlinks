import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(iconId: string, userId: string) {
  const icon = await prisma.socialIcon.findUnique({
    where: { id: iconId },
    include: { page: true },
  });
  if (!icon || icon.page.userId !== userId) return null;
  return icon;
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
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const field of ["platform", "url", "icon", "order"] as const) {
    if (field in body) data[field] = body[field];
  }

  const updated = await prisma.socialIcon.update({ where: { id }, data });
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
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  await prisma.socialIcon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
