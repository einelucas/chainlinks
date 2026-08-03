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

type ApiError = {
  error?: string;
};

const TABS = [
  { id: "links", label: "Links" },
  { id: "social", label: "Redes sociais" },
  { id: "appearance", label: "Aparência" },
  { id: "profile", label: "Perfil" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiError(value: unknown, fallback: string): string {
  if (isRecord(value) && typeof value.error === "string" && value.error.trim()) {
    return value.error;
  }

  return fallback;
}

function isAdminPage(value: unknown): value is AdminPage {
  if (!isRecord(value)) return false;

  return (
    typeof value.username === "string" &&
    typeof value.displayName === "string" &&
    typeof value.bio === "string" &&
    typeof value.isPublished === "boolean" &&
    Array.isArray(value.links) &&
    Array.isArray(value.socialIcons)
  );
}

export default function AdminDashboard() {
  const [page, setPage] = useState<AdminPage | null>(null);
  const [tab, setTab] = useState<TabId>("links");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPage() {
      setLoadError(null);

      try {
        const response = await fetch("/api/page", {
          cache: "no-store",
          signal: controller.signal,
        });

        const data: unknown = await response.json().catch(() => null);

        if (response.status === 401) {
          window.location.assign("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            getApiError(data, `Não foi possível carregar o painel (${response.status}).`)
          );
        }

        if (!isAdminPage(data)) {
          throw new Error("A API retornou dados incompletos para o painel.");
        }

        setPage(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        console.error("[admin] Erro ao carregar /api/page:", error);
        setPage(null);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o painel."
        );
      }
    }

    void loadPage();

    return () => controller.abort();
  }, [reloadKey]);

  const savePageDebounced = useDebouncedCallback(
    async (data: Record<string, unknown>) => {
      setSaveState("saving");

      try {
        const response = await fetch("/api/page", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          if (data.username) {
            setUsernameError(getApiError(json, "Não foi possível alterar o usuário."));
          }
          setSaveState("error");
          return;
        }

        setUsernameError(null);
        setSaveState("saved");
      } catch (error) {
        console.error("[admin] Erro ao salvar página:", error);
        setSaveState("error");
      }
    },
    700
  );

  function updatePage(data: Record<string, unknown>) {
    setPage((previous) => (previous ? { ...previous, ...data } : previous));
    savePageDebounced(data);
  }

  // ---- Links ----
  async function addLink(label: string, url: string, icon?: string | null) {
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, url, icon: icon ?? null }),
      });
      const link: unknown = await response.json().catch(() => null);

      if (!response.ok || !isRecord(link)) {
        setSaveState("error");
        return;
      }

      setPage((previous) =>
        previous
          ? { ...previous, links: [...previous.links, link as LinkItemData] }
          : previous
      );
    } catch (error) {
      console.error("[admin] Erro ao adicionar link:", error);
      setSaveState("error");
    }
  }

  const patchLinkDebounced = useDebouncedCallback(
    async (id: string, data: Partial<LinkItemData>) => {
      const response = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) setSaveState("error");
    },
    500
  );

  function updateLink(id: string, data: Partial<LinkItemData>) {
    setPage((previous) =>
      previous
        ? {
            ...previous,
            links: previous.links.map((link) =>
              link.id === id ? { ...link, ...data } : link
            ),
          }
        : previous
    );
    patchLinkDebounced(id, data);
  }

  async function deleteLink(id: string) {
    setPage((previous) =>
      previous
        ? { ...previous, links: previous.links.filter((link) => link.id !== id) }
        : previous
    );

    const response = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (!response.ok) setSaveState("error");
  }

  async function reorderLinks(orderedIds: string[]) {
    setPage((previous) => {
      if (!previous) return previous;

      const byId = new Map(previous.links.map((link) => [link.id, link]));
      const reordered = orderedIds
        .map((id, index) => {
          const link = byId.get(id);
          return link ? { ...link, order: index } : null;
        })
        .filter(Boolean) as LinkItemData[];

      return { ...previous, links: reordered };
    });

    const response = await fetch("/api/links/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });

    if (!response.ok) setSaveState("error");
  }

  // ---- Redes sociais ----
  async function addSocial(platform: string, url: string) {
    try {
      const response = await fetch("/api/social-icons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url }),
      });
      const icon: unknown = await response.json().catch(() => null);

      if (!response.ok || !isRecord(icon)) {
        setSaveState("error");
        return;
      }

      setPage((previous) =>
        previous
          ? {
              ...previous,
              socialIcons: [...previous.socialIcons, icon as SocialIconData],
            }
          : previous
      );
    } catch (error) {
      console.error("[admin] Erro ao adicionar rede social:", error);
      setSaveState("error");
    }
  }

  const patchSocialDebounced = useDebouncedCallback(
    async (id: string, data: Partial<SocialIconData>) => {
      const response = await fetch(`/api/social-icons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) setSaveState("error");
    },
    500
  );

  function updateSocial(id: string, data: Partial<SocialIconData>) {
    setPage((previous) =>
      previous
        ? {
            ...previous,
            socialIcons: previous.socialIcons.map((social) =>
              social.id === id ? { ...social, ...data } : social
            ),
          }
        : previous
    );
    patchSocialDebounced(id, data);
  }

  async function deleteSocial(id: string) {
    setPage((previous) =>
      previous
        ? {
            ...previous,
            socialIcons: previous.socialIcons.filter((social) => social.id !== id),
          }
        : previous
    );

    const response = await fetch(`/api/social-icons/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) setSaveState("error");
  }

  const previewTheme: PageTheme | null = useMemo(() => {
    if (!page) return null;

    const { links: _links, socialIcons: _socials, isPublished: _published, ...theme } =
      page;
    void _links;
    void _socials;
    void _published;

    return theme;
  }, [page]);

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="max-w-xl rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
          <h1 className="text-lg font-semibold text-red-300">
            Não foi possível abrir o painel
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-300">{loadError}</p>
          <p className="mt-3 text-xs leading-5 text-neutral-500">
            Verifique DATABASE_URL, rode as migrations do Prisma e confirme que a
            sessão ainda está válida.
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="mt-5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!page || !previewTheme) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-neutral-500 text-sm">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]">
      <div className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900 p-1">
            {TABS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`text-sm px-3.5 py-1.5 rounded-lg transition ${
                  tab === item.id
                    ? "bg-emerald-500 text-black font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.label}
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
            fontSize={page.fontSize ?? 16}
            textColor={page.textColor}
            bioColor={page.bioColor}
            accentColor={page.accentColor}
            buttonBgColor={page.buttonBgColor}
            buttonBorderColor={page.buttonBorderColor}
            buttonTextColor={page.buttonTextColor}
            buttonRadius={page.buttonRadius}
            buttonSize={page.buttonSize ?? "medium"}
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

      <div className="min-w-0">
        <LivePreview
          theme={previewTheme}
          links={page.links}
          socials={page.socialIcons}
        />
      </div>
    </div>
  );
}

function SaveIndicator({
  state,
}: {
  state: "idle" | "saving" | "saved" | "error";
}) {
  if (state === "idle") return null;

  const map = {
    saving: { text: "Salvando...", color: "text-neutral-500" },
    saved: { text: "Salvo ✓", color: "text-emerald-400" },
    error: { text: "Erro ao salvar", color: "text-red-400" },
  } as const;

  const { text, color } = map[state];
  return <span className={`text-xs ${color}`}>{text}</span>;
}
