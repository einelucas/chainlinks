import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { usernameSchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const page = await prisma.page.findUnique({
    where: { userId: session.user.id },
    include: {
      links: { orderBy: { order: "asc" } },
      socialIcons: { orderBy: { order: "asc" } },
    },
  });

  if (!page) {
    return NextResponse.json({ error: "Página não encontrada" }, { status: 404 });
  }

  return NextResponse.json(page);
}

// Campos que o usuário pode editar via painel
const EDITABLE_FIELDS = [
  "username",
  "displayName",
  "bio",
  "profileImage",
  "favicon",
  "bgType",
  "bgColor",
  "bgGradientFrom",
  "bgGradientTo",
  "bgGradientAngle",
  "bgImage",
  "overlayOpacity",
  "fontFamily",
  "textColor",
  "bioColor",
  "buttonBgColor",
  "buttonBorderColor",
  "buttonTextColor",
  "buttonRadius",
  "buttonShadowColor",
  "hoverBgColor",
  "hoverGlowColor",
  "hoverScale",
  "accentColor",
  "showShareButton",
  "showQrButton",
  "isPublished",
] as const;

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();

  if (typeof body.username === "string") {
    const parsed = usernameSchema.safeParse(body.username);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Usuário inválido" },
        { status: 400 }
      );
    }
    const existing = await prisma.page.findUnique({
      where: { username: body.username },
    });
    if (existing && existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Este nome de usuário já está em uso" },
        { status: 409 }
      );
    }
  }

  const data: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) data[field] = body[field];
  }

  try {
    const updated = await prisma.page.update({
      where: { userId: session.user.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
