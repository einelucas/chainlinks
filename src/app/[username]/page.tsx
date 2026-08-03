import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PublicLinkPage from "@/components/PublicLinkPage";
import type { PageTheme } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getPage(username: string) {
  const page = await prisma.page.findUnique({
    where: { username },
    include: {
      links: { orderBy: { order: "asc" } },
      socialIcons: { orderBy: { order: "asc" } },
    },
  });
  if (!page || !page.isPublished) return null;
  return page;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const page = await getPage(username);
  if (!page) return { title: "Página não encontrada" };

  return {
    title: `${page.displayName} | Links`,
    description: page.bio,
    openGraph: {
      title: page.displayName,
      description: page.bio,
      images: page.profileImage ? [page.profileImage] : undefined,
      type: "website",
    },
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const page = await getPage(username);
  if (!page) notFound();

  const theme: PageTheme = {
    username: page.username,
    displayName: page.displayName,
    bio: page.bio,
    profileImage: page.profileImage,
    bgType: page.bgType,
    bgColor: page.bgColor,
    bgGradientFrom: page.bgGradientFrom,
    bgGradientTo: page.bgGradientTo,
    bgGradientAngle: page.bgGradientAngle,
    bgImage: page.bgImage,
    overlayOpacity: page.overlayOpacity,
    fontFamily: page.fontFamily,
    fontSize: page.fontSize,
    textColor: page.textColor,
    bioColor: page.bioColor,
    buttonBgColor: page.buttonBgColor,
    buttonBorderColor: page.buttonBorderColor,
    buttonTextColor: page.buttonTextColor,
    buttonRadius: page.buttonRadius,
    buttonSize: page.buttonSize as PageTheme["buttonSize"],
    buttonShadowColor: page.buttonShadowColor,
    hoverBgColor: page.hoverBgColor,
    hoverGlowColor: page.hoverGlowColor,
    hoverScale: page.hoverScale,
    accentColor: page.accentColor,
    showShareButton: page.showShareButton,
    showQrButton: page.showQrButton,
  };

  return (
    <PublicLinkPage
      theme={theme}
      links={page.links}
      socials={page.socialIcons}
      pageUrl={`https://seu-dominio.com/${page.username}`}
    />
  );
}
