import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName =
    typeof user.user_metadata?.name === "string" ? user.user_metadata.name : "";

  // O layout não deve impedir a renderização inteira caso o banco esteja
  // temporariamente indisponível. A página e a API exibem o erro controlado.
  let username: string | null = null;

  try {
    const page = await prisma.page.findUnique({
      where: { userId: user.id },
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
        userName={userName}
        initialTheme={isLight ? "light" : "dark"}
      />
      <div className="admin-content-root">{children}</div>
    </div>
  );
}
