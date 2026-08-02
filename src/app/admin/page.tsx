"use client";

import { useEffect, useMemo, useState } from "react";
import type { LinkItemData, PageTheme, SocialIconData } from "@/lib/types";
import { useDebouncedCallback } from "@/lib/use-debounced-callback";
import ProfileTab from "@/components/admin/ProfileTab";
import LinksTab from "@/components/admin/LinksTab";
import SocialTab from "@/components/admin/SocialTab";
import AppearanceTab from "@/components/admin/AppearanceTab";
import LivePreview from "@/components/admin/LivePreview";

type AdminPage = PageTheme & {
  isPublished: boolean;
  links: LinkItemData[];
  socialIcons: SocialIconData[];
};

const TABS = [
  { id: "links", label: "Links" },
  { id: "social", label: "Redes sociais" },
  { id: "appearance", label: "Aparência" },
  { id: "profile", label: "Perfil" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard() {
  const [page, setPage] = useState<AdminPage | null>(null);
  const [tab, setTab] = useState<TabId>("links");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/page")
      .then((res) => res.json())
      .then((data) => setPage(data))
      .catch(() => setSaveState("error"));
  }, []);

  const savePageDebounced = useDebouncedCallback(async (data: Record<string, unknown>) => {
    setSaveState("saving");
    try {
      const res = await fetch("/api/page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (data.username) setUsernameError(json.error);
        setSaveState("error");
        return;
      }
      setUsernameError(null);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, 700);

  function updatePage(data: Record<string, unknown>) {
    setPage((prev) => (prev ? { ...prev, ...data } : prev));
    savePageDebounced(data);
  }

  // ---- Links ----
  async function addLink(label: string, url: string) {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, url }),
    });
    const link = await res.json();
    if (res.ok) {
      setPage((prev) => (prev ? { ...prev, links: [...prev.links, link] } : prev));
    }
  }

  const patchLinkDebounced = useDebouncedCallback(
    async (id: string, data: Partial<LinkItemData>) => {
      await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    500
  );

  function updateLink(id: string, data: Partial<LinkItemData>) {
    setPage((prev) =>
      prev
        ? {
            ...prev,
            links: prev.links.map((l) => (l.id === id ? { ...l, ...data } : l)),
          }
        : prev
    );
    patchLinkDebounced(id, data);
  }

  async function deleteLink(id: string) {
    setPage((prev) =>
      prev ? { ...prev, links: prev.links.filter((l) => l.id !== id) } : prev
    );
    await fetch(`/api/links/${id}`, { method: "DELETE" });
  }

  async function reorderLinks(orderedIds: string[]) {
    setPage((prev) => {
      if (!prev) return prev;
      const byId = new Map(prev.links.map((l) => [l.id, l]));
      const reordered = orderedIds
        .map((id, index) => {
          const l = byId.get(id);
          return l ? { ...l, order: index } : null;
        })
        .filter(Boolean) as LinkItemData[];
      return { ...prev, links: reordered };
    });
    await fetch("/api/links/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });
  }

  // ---- Redes sociais ----
  async function addSocial(platform: string, url: string) {
    const res = await fetch("/api/social-icons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, url }),
    });
    const icon = await res.json();
    if (res.ok) {
      setPage((prev) =>
        prev ? { ...prev, socialIcons: [...prev.socialIcons, icon] } : prev
      );
    }
  }

  const patchSocialDebounced = useDebouncedCallback(
    async (id: string, data: Partial<SocialIconData>) => {
      await fetch(`/api/social-icons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    500
  );

  function updateSocial(id: string, data: Partial<SocialIconData>) {
    setPage((prev) =>
      prev
        ? {
            ...prev,
            socialIcons: prev.socialIcons.map((s) =>
              s.id === id ? { ...s, ...data } : s
            ),
          }
        : prev
    );
    patchSocialDebounced(id, data);
  }

  async function deleteSocial(id: string) {
    setPage((prev) =>
      prev
        ? { ...prev, socialIcons: prev.socialIcons.filter((s) => s.id !== id) }
        : prev
    );
    await fetch(`/api/social-icons/${id}`, { method: "DELETE" });
  }

  const previewTheme: PageTheme | null = useMemo(() => {
    if (!page) return null;
    const { links: _l, socialIcons: _s, isPublished: _p, ...theme } = page;
    void _l;
    void _s;
    void _p;
    return theme;
  }, [page]);

  if (!page || !previewTheme) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-neutral-500 text-sm">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[1fr_320px] gap-8">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`text-sm px-3.5 py-1.5 rounded-lg transition ${
                  tab === t.id
                    ? "bg-emerald-500 text-black font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <SaveIndicator state={saveState} />
        </div>

        {tab === "links" && (
          <LinksTab
            links={page.links}
            onAdd={addLink}
            onUpdate={updateLink}
            onDelete={deleteLink}
            onReorder={reorderLinks}
          />
        )}

        {tab === "social" && (
          <SocialTab
            socials={page.socialIcons}
            onAdd={addSocial}
            onUpdate={updateSocial}
            onDelete={deleteSocial}
          />
        )}

        {tab === "appearance" && (
          <AppearanceTab
            bgType={page.bgType}
            bgColor={page.bgColor}
            bgGradientFrom={page.bgGradientFrom}
            bgGradientTo={page.bgGradientTo}
            bgGradientAngle={page.bgGradientAngle}
            bgImage={page.bgImage}
            overlayOpacity={page.overlayOpacity}
            fontFamily={page.fontFamily}
            textColor={page.textColor}
            bioColor={page.bioColor}
            accentColor={page.accentColor}
            buttonBgColor={page.buttonBgColor}
            buttonBorderColor={page.buttonBorderColor}
            buttonTextColor={page.buttonTextColor}
            buttonRadius={page.buttonRadius}
            buttonShadowColor={page.buttonShadowColor}
            hoverBgColor={page.hoverBgColor}
            hoverGlowColor={page.hoverGlowColor}
            hoverScale={page.hoverScale}
            showShareButton={page.showShareButton}
            showQrButton={page.showQrButton}
            onUpdate={updatePage}
          />
        )}

        {tab === "profile" && (
          <ProfileTab
            username={page.username}
            displayName={page.displayName}
            bio={page.bio}
            profileImage={page.profileImage}
            isPublished={page.isPublished}
            onUpdate={updatePage}
            usernameError={usernameError}
          />
        )}
      </div>

      <div className="hidden lg:block">
        <LivePreview theme={previewTheme} links={page.links} socials={page.socialIcons} />
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
  if (state === "idle") return null;
  const map = {
    saving: { text: "Salvando...", color: "text-neutral-500" },
    saved: { text: "Salvo ✓", color: "text-emerald-400" },
    error: { text: "Erro ao salvar", color: "text-red-400" },
  } as const;
  const { text, color } = map[state];
  return <span className={`text-xs ${color}`}>{text}</span>;
}
