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

  const page = await prisma.page.findUnique({
    where: { userId: user.id },
    include: { socialIcons: true },
  });
  if (!page) {
    return NextResponse.json({ error: "Página não encontrada" }, { status: 404 });
  }

  const body = await req.json();
  const platform = (body.platform ?? "custom").trim();
  const url = (body.url ?? "").trim();

  if (!url) {
    return NextResponse.json({ error: "Preencha o link" }, { status: 400 });
  }

  const maxOrder = page.socialIcons.reduce((max, s) => Math.max(max, s.order), -1);

  const icon = await prisma.socialIcon.create({
    data: {
      pageId: page.id,
      platform,
      url,
      icon: body.icon ?? null,
      order: maxOrder + 1,
    },
  });

  return NextResponse.json(icon, { status: 201 });
}
