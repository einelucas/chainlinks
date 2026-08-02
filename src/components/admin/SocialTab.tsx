"use client";

import { useState } from "react";
import type { SocialIconData } from "@/lib/types";
import { SOCIAL_PLATFORMS } from "@/lib/types";
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
    <div className="space-y-5">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium text-white">Adicionar rede social</p>
        <div className="grid sm:grid-cols-[160px_1fr] gap-2">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
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
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="text-sm px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium transition"
        >
          + Adicionar
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center py-6">
          Nenhuma rede social adicionada ainda.
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((s) => (
            <div
              key={s.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-md bg-neutral-800 text-neutral-300 shrink-0">
                  {PLATFORM_LABELS[s.platform] ?? s.platform}
                </span>
                <input
                  type="text"
                  defaultValue={s.url}
                  onChange={(e) => onUpdate(s.id, { url: e.target.value })}
                  className="flex-1 min-w-0 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => onDelete(s.id)}
                  className="text-neutral-600 hover:text-red-400 text-sm px-1"
                >
                  ✕
                </button>
              </div>
              <ImageUploadField
                label="Ícone customizado (opcional)"
                value={s.icon}
                onChange={(dataUrl) => onUpdate(s.id, { icon: dataUrl })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
