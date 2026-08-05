import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // O layout não deve impedir a renderização inteira caso o banco esteja
  // temporariamente indisponível. A página e a API exibem o erro controlado.
  let username: string | null = null;

  try {
    const page = await prisma.page.findUnique({
      where: { userId: session.user.id },
      select: { username: true },
    });

    username = page?.username ?? null;
  } catch (error) {
    console.error("[admin/layout] Não foi possível carregar o username:", error);
  }

  const cookieStore = await cookies();
  const isLight = cookieStore.get("chainlinks-admin-theme")?.value === "light";
  const theme = isLight ? "light" : undefined;

  return (
    <div className="admin-root" data-theme={theme} suppressHydrationWarning>
      <AdminTopbar
        username={username}
        userName={session.user.name ?? ""}
        initialTheme={isLight ? "light" : "dark"}
      />
      <div className="admin-content-root">{children}</div>
    </div>
  );
}
