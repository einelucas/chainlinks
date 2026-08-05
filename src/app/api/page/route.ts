import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { usernameSchema } from "@/lib/validation";
import { PROFILE_IMAGE_SIZE_MAX, PROFILE_IMAGE_SIZE_MIN } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function databaseError(error: unknown, action: string) {
  console.error(`[api/page] ${action}:`, error);

  const detail =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? ` ${error.message}`
      : "";

  return NextResponse.json(
    {
      error:
        `Não foi possível acessar os dados da página.${detail}` +
        " Verifique DATABASE_URL e execute as migrations do Prisma.",
    },
    { status: 500 }
  );
}

export async function GET() {
  try {
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
      return NextResponse.json(
        { error: "Página não encontrada para esta conta." },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    return databaseError(error, "erro no GET");
  }
}

// Campos que o usuário pode editar via painel.
const EDITABLE_FIELDS = [
  "username",
  "displayName",
  "bio",
  "profileImage",
  "profileImageSize",
  "favicon",
  "bgType",
  "bgColor",
  "bgGradientFrom",
  "bgGradientTo",
  "bgGradientAngle",
  "bgImage",
  "overlayOpacity",
  "fontFamily",
  "fontSize",
  "textColor",
  "bioColor",
  "buttonBgColor",
  "buttonBorderColor",
  "buttonTextColor",
  "buttonRadius",
  "buttonSize",
  "buttonShadowColor",
  "hoverBgColor",
  "hoverGlowColor",
  "hoverScale",
  "accentColor",
  "showShareButton",
  "showQrButton",
  "isPublished",
] as const;

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "O corpo da requisição deve ser um objeto JSON válido." },
        { status: 400 }
      );
    }

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
        select: { userId: true },
      });

      if (existing && existing.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Este nome de usuário já está em uso" },
          { status: 409 }
        );
      }
    }

    if (
      "fontSize" in body &&
      (!Number.isInteger(body.fontSize) || Number(body.fontSize) < 12 || Number(body.fontSize) > 24)
    ) {
      return NextResponse.json(
        { error: "O tamanho da fonte deve estar entre 12 e 24px." },
        { status: 400 }
      );
    }

    if (
      "buttonRadius" in body &&
      (!Number.isInteger(body.buttonRadius) ||
        Number(body.buttonRadius) < 0 ||
        Number(body.buttonRadius) > 50)
    ) {
      return NextResponse.json(
        { error: "O arredondamento deve estar entre 0 e 50px." },
        { status: 400 }
      );
    }

    if (
      "profileImageSize" in body &&
      (!Number.isInteger(body.profileImageSize) ||
        Number(body.profileImageSize) < PROFILE_IMAGE_SIZE_MIN ||
        Number(body.profileImageSize) > PROFILE_IMAGE_SIZE_MAX)
    ) {
      return NextResponse.json(
        {
          error: `O tamanho da foto deve estar entre ${PROFILE_IMAGE_SIZE_MIN} e ${PROFILE_IMAGE_SIZE_MAX}px.`,
        },
        { status: 400 }
      );
    }

    if (
      "buttonSize" in body &&
      body.buttonSize !== "small" &&
      body.buttonSize !== "medium" &&
      body.buttonSize !== "large"
    ) {
      return NextResponse.json(
        { error: "Tamanho de botão inválido." },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};

    for (const field of EDITABLE_FIELDS) {
      if (field in body) data[field] = body[field];
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo editável foi informado." },
        { status: 400 }
      );
    }

    const updated = await prisma.page.update({
      where: { userId: session.user.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Página não encontrada para esta conta." },
        { status: 404 }
      );
    }

    return databaseError(error, "erro no PATCH");
  }
}
