"use client";

import { useState } from "react";
import type { SocialIconData } from "@/lib/types";
import { SOCIAL_PLATFORMS } from "@/lib/types";
import { PLATFORM_ICON_MAP } from "@/components/icons";
import { PlusIcon, SocialIcon, TrashIcon } from "./AdminIcons";
import ImageUploadField from "./ImageUploadField";

const PLATFORM_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "X (Twitter)",
  tiktok: "TikTok",
  youtube: "YouTube",
  email: "Email",
  phone: "Telefone",
  pin: "Localização",
  custom: "Outro / customizado",
};

type Props = {
  socials: SocialIconData[];
  onAdd: (platform: string, url: string) => void;
  onUpdate: (id: string, data: Partial<SocialIconData>) => void;
  onDelete: (id: string) => void;
};

export default function SocialTab({ socials, onAdd, onUpdate, onDelete }: Props) {
  const [platform, setPlatform] = useState("whatsapp");
  const [url, setUrl] = useState("");

  function handleAdd() {
    if (!url.trim()) return;
    onAdd(platform, url.trim());
    setUrl("");
  }

  const sorted = [...socials].sort((a, b) => a.order - b.order);

  return (
    <div className="editor-stack">
      <section className="editor-card editor-add-card">
        <div className="editor-card-heading">
          <span className="editor-card-icon"><SocialIcon /></span>
          <div>
            <h2>Adicionar rede social</h2>
            <p>Escolha o canal e informe o endereço que será aberto.</p>
          </div>
        </div>

        <div className="editor-field-grid editor-social-add-grid">
          <label className="editor-field">
            <span>Canal</span>
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              {SOCIAL_PLATFORMS.map((item) => (
                <option key={item} value={item}>
                  {PLATFORM_LABELS[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="editor-field">
            <span>{platform === "email" ? "Endereço de email" : platform === "phone" ? "Número de telefone" : "URL do perfil"}</span>
            <input
              type="text"
              placeholder={
                platform === "email"
                  ? "seuemail@exemplo.com"
                  : platform === "phone"
                    ? "+55 67 99999-0000"
                    : "https://..."
              }
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </label>
        </div>

        <div className="editor-card-actions">
          <button
            type="button"
            onClick={handleAdd}
            className="admin-primary-button"
            disabled={!url.trim()}
          >
            <PlusIcon />
            Adicionar canal
          </button>
        </div>
      </section>

      <section className="editor-list-section">
        <div className="editor-list-heading">
          <div>
            <h2>Canais conectados</h2>
            <p>Esses ícones aparecem na área de contato da sua página.</p>
          </div>
          <span>{sorted.length} {sorted.length === 1 ? "canal" : "canais"}</span>
        </div>

        {sorted.length === 0 ? (
          <div className="editor-empty-state">
            <span><SocialIcon /></span>
            <strong>Nenhum canal conectado</strong>
            <p>Adicione uma rede social ou forma de contato acima.</p>
          </div>
        ) : (
          <div className="editor-items-list">
            {sorted.map((social) => {
              const PlatformIcon = PLATFORM_ICON_MAP[social.platform] ?? PLATFORM_ICON_MAP.custom;

              return (
                <article key={social.id} className="editor-social-card">
                  <div className="editor-social-summary">
                    <span className="editor-item-icon editor-platform-icon">
                      {social.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={social.icon} alt="" />
                      ) : (
                        <PlatformIcon />
                      )}
                    </span>

                    <div className="editor-social-copy">
                      <strong>{PLATFORM_LABELS[social.platform] ?? social.platform}</strong>
                      <span>Canal conectado</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDelete(social.id)}
                      className="editor-row-action editor-delete-button"
                      aria-label={`Excluir ${PLATFORM_LABELS[social.platform] ?? social.platform}`}
                      title="Excluir canal"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="editor-social-details">
                    <label className="editor-field">
                      <span>Destino</span>
                      <input
                        type="text"
                        value={social.url}
                        onChange={(event) => onUpdate(social.id, { url: event.target.value })}
                      />
                    </label>

                    <ImageUploadField
                      label="Ícone personalizado"
                      helper="Opcional · substitui o ícone da rede"
                      value={social.icon}
                      maxSizeMb={2}
                      onChange={(dataUrl) => onUpdate(social.id, { icon: dataUrl })}
                      compact
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
