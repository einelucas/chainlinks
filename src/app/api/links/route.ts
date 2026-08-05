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
    include: { links: true },
  });
  if (!page) {
    return NextResponse.json({ error: "Página não encontrada" }, { status: 404 });
  }

  const body = await req.json();
  const label = (body.label ?? "").trim();
  const url = (body.url ?? "").trim();

  if (!label || !url) {
    return NextResponse.json(
      { error: "Preencha o título e o link" },
      { status: 400 }
    );
  }

  const maxOrder = page.links.reduce((max, l) => Math.max(max, l.order), -1);

  const link = await prisma.linkItem.create({
    data: {
      pageId: page.id,
      label,
      url,
      icon: body.icon ?? null,
      order: maxOrder + 1,
    },
  });

  return NextResponse.json(link, { status: 201 });
}
