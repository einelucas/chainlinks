"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { LinkItemData, PageTheme, SocialIconData } from "@/lib/types";
import { PROFILE_IMAGE_SIZE_DEFAULT } from "@/lib/types";
import { useDebouncedCallback } from "@/lib/use-debounced-callback";
import ProfileTab from "@/components/admin/ProfileTab";
import LinksTab from "@/components/admin/LinksTab";
import SocialTab from "@/components/admin/SocialTab";
import AppearanceTab from "@/components/admin/AppearanceTab";
import LivePreview from "@/components/admin/LivePreview";
import {
  CheckIcon,
  CloseAdminIcon,
  DeviceIcon,
  LinksIcon,
  PaletteIcon,
  ProfileIcon,
  SocialIcon,
  SpinnerIcon,
} from "@/components/admin/AdminIcons";

type AdminPage = PageTheme & {
  isPublished: boolean;
  links: LinkItemData[];
  socialIcons: SocialIconData[];
};

const TABS = [
  {
    id: "links",
    label: "Links",
    eyebrow: "Conteúdo",
    title: "Seus links",
    description: "Crie, edite e organize os principais destinos da sua página.",
    icon: LinksIcon,
  },
  {
    id: "social",
    label: "Redes sociais",
    eyebrow: "Conteúdo",
    title: "Redes sociais",
    description: "Mantenha seus canais e formas de contato sempre acessíveis.",
    icon: SocialIcon,
  },
  {
    id: "appearance",
    label: "Aparência",
    eyebrow: "Personalização",
    title: "Identidade visual",
    description: "Ajuste cada detalhe e acompanhe o resultado em tempo real.",
    icon: PaletteIcon,
  },
  {
    id: "profile",
    label: "Perfil",
    eyebrow: "Configurações",
    title: "Perfil e publicação",
    description: "Defina sua identidade, endereço público e visibilidade.",
    icon: ProfileIcon,
  },
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
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!mobilePreviewOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobilePreviewOpen(false);
    }

    document.body.classList.add("admin-preview-is-open");
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("admin-preview-is-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobilePreviewOpen]);

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

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];

  if (loadError) {
    return (
      <div className="admin-state-page">
        <div className="admin-state-card admin-state-error">
          <span className="admin-state-icon">!</span>
          <h1>Não foi possível abrir o painel</h1>
          <p>{loadError}</p>
          <small>
            Verifique DATABASE_URL, rode as migrations do Prisma e confirme que a
            sessão ainda está válida.
          </small>
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="admin-primary-button"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!page || !previewTheme) {
    return (
      <div className="admin-state-page">
        <div className="admin-loading-card">
          <span className="admin-loading-mark">
            <Image src="/logo-mark.png" alt="" width={26} height={26} />
          </span>
          <div>
            <strong>Preparando seu editor</strong>
            <span>Carregando página e preferências...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-heading">
          <span className="admin-sidebar-kicker">Workspace</span>
          <strong>Editor visual</strong>
          <span className="admin-live-label"><i /> Preview ao vivo</span>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Seções do editor">
          <span className="admin-nav-group-label">Conteúdo</span>
          {TABS.filter((item) => item.eyebrow === "Conteúdo").map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`admin-nav-button ${tab === item.id ? "is-active" : ""}`}
                aria-current={tab === item.id ? "page" : undefined}
              >
                <Icon />
                <span>{item.label}</span>
                {item.id === "links" && <small>{page.links.length}</small>}
              </button>
            );
          })}

          <span className="admin-nav-group-label admin-nav-group-spaced">
            Personalização
          </span>
          {TABS.filter((item) => item.eyebrow !== "Conteúdo").map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`admin-nav-button ${tab === item.id ? "is-active" : ""}`}
                aria-current={tab === item.id ? "page" : undefined}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <span className={`admin-publish-dot ${page.isPublished ? "is-online" : ""}`} />
          <div>
            <strong>{page.isPublished ? "Página publicada" : "Página privada"}</strong>
            <small>{page.isPublished ? "Visível para todos" : "Somente você pode ver"}</small>
          </div>
        </div>
      </aside>

      <div className="admin-workspace">
        <div className="admin-mobile-nav" role="tablist" aria-label="Seções do editor">
          {TABS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                key={item.id}
                onClick={() => setTab(item.id)}
                className={tab === item.id ? "is-active" : ""}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <main className="admin-editor-column">
          <header className="admin-section-heading">
            <div>
              <span className="admin-section-kicker">{activeTab.eyebrow}</span>
              <h1>{activeTab.title}</h1>
              <p>{activeTab.description}</p>
            </div>
            <SaveIndicator state={saveState} />
          </header>

          <div className="admin-tab-content" key={tab}>
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
                profileImageSize={page.profileImageSize ?? PROFILE_IMAGE_SIZE_DEFAULT}
                isPublished={page.isPublished}
                onUpdate={updatePage}
                usernameError={usernameError}
              />
            )}
          </div>
        </main>

        <aside className="admin-preview-column">
          <LivePreview
            theme={previewTheme}
            links={page.links}
            socials={page.socialIcons}
          />
        </aside>
      </div>

      <button
        type="button"
        className="admin-mobile-preview-button"
        onClick={() => setMobilePreviewOpen(true)}
      >
        <DeviceIcon />
        <span>Ver preview</span>
      </button>

      {mobilePreviewOpen && (
        <div className="admin-preview-modal" role="dialog" aria-modal="true" aria-label="Preview da página">
          <button
            type="button"
            className="admin-preview-backdrop"
            onClick={() => setMobilePreviewOpen(false)}
            aria-label="Fechar preview"
          />
          <section className="admin-preview-sheet">
            <header>
              <div>
                <span>Preview ao vivo</span>
                <small>As alterações aparecem instantaneamente</small>
              </div>
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(false)}
                aria-label="Fechar preview"
              >
                <CloseAdminIcon />
              </button>
            </header>
            <div className="admin-preview-sheet-scroll">
              <LivePreview
                theme={previewTheme}
                links={page.links}
                socials={page.socialIcons}
                embedded
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function SaveIndicator({
  state,
}: {
  state: "idle" | "saving" | "saved" | "error";
}) {
  const map = {
    idle: { text: "Tudo salvo", className: "is-saved", icon: CheckIcon },
    saving: { text: "Salvando...", className: "is-saving", icon: SpinnerIcon },
    saved: { text: "Alterações salvas", className: "is-saved", icon: CheckIcon },
    error: { text: "Erro ao salvar", className: "is-error", icon: CloseAdminIcon },
  } as const;

  const { text, className, icon: Icon } = map[state];
  return (
    <span className={`admin-save-indicator ${className}`} role="status">
      <Icon />
      {text}
    </span>
  );
}
