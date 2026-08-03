"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ExternalIcon, LogoutIcon } from "./AdminIcons";

export default function AdminTopbar({
  username,
  userName,
}: {
  username?: string | null;
  userName: string;
}) {
  const initial = (userName || username || "L").trim().charAt(0).toUpperCase();

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-inner">
        <div className="admin-brand-group">
          <Link href="/admin" className="admin-brand" aria-label="LinkPage — painel">
            <span className="admin-brand-mark">L</span>
            <span className="admin-brand-name">LinkPage</span>
          </Link>

          <span className="admin-topbar-divider" aria-hidden="true" />

          <div className="admin-account">
            <span className="admin-account-avatar">{initial}</span>
            <span className="admin-account-copy">
              <strong>{userName || "Sua conta"}</strong>
              <small>{username ? `linkpage.com/${username}` : "Painel administrativo"}</small>
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

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
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
