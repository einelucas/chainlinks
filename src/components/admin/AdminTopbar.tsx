"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ExternalIcon, LogoutIcon } from "./AdminIcons";
import ThemeToggle from "./ThemeToggle";

export default function AdminTopbar({
  username,
  userName,
  initialTheme,
}: {
  username?: string | null;
  userName: string;
  initialTheme: "light" | "dark";
}) {
  const initial = (userName || username || "C").trim().charAt(0).toUpperCase();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <div className="admin-brand-group">
          <Link href="/admin" className="admin-brand" aria-label="ChainLinks — painel">
            <Image src="/logo-mark.png" alt="" width={36} height={36} className="admin-brand-mark" />
            <span className="admin-brand-name">ChainLinks</span>
          </Link>

          <span className="admin-topbar-divider" aria-hidden="true" />

          <div className="admin-account">
            <span className="admin-account-avatar">{initial}</span>
            <span className="admin-account-copy">
              <strong>{userName || "Sua conta"}</strong>
              <small>{username ? `chainlinks.me/${username}` : "Painel administrativo"}</small>
            </span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          {username ? (
            <Link
              href={`/${username}`}
              target="_blank"
              rel="noreferrer"
              className="admin-action-button admin-action-secondary"
            >
              <ExternalIcon />
              <span>Ver página</span>
            </Link>
          ) : null}

          <ThemeToggle initialTheme={initialTheme} />

          <button
            type="button"
            onClick={handleSignOut}
            className="admin-icon-button admin-logout-button"
            aria-label="Sair da conta"
            title="Sair da conta"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
