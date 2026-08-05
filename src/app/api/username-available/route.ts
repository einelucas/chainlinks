import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usernameSchema } from "@/lib/validation";

/** Checagem pública de disponibilidade de username (feedback no formulário de cadastro). */
export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get("u") ?? "";

  const parsed = usernameSchema.safeParse(username);
  if (!parsed.success) {
    return NextResponse.json({
      available: false,
      error: parsed.error.issues[0]?.message ?? "Usuário inválido",
    });
  }

  const existing = await prisma.page.findUnique({
    where: { username },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
