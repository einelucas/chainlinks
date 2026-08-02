import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const page = await prisma.page.findUnique({
    where: { userId: session.user.id },
  });

  if (!page) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-neutral-950 flex flex-col">
      <AdminTopbar username={page.username} userName={session.user?.name ?? ""} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
