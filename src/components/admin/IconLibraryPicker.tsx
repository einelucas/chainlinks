"use client";

import { useMemo, useState } from "react";
import {
  ALL_ICONS,
  ICON_CATEGORIES,
  buildIconDataUrl,
  type IconColorMode,
  type IconLibraryEntry,
} from "@/lib/icon-library";

type Props = {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
};

const COLOR_MODES: { value: IconColorMode; label: string }[] = [
  { value: "color", label: "Colorido" },
  { value: "black", label: "Preto" },
  { value: "white", label: "Branco" },
];

export default function IconLibraryPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<IconColorMode>("color");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return ALL_ICONS.filter((icon) => icon.title.toLowerCase().includes(q));
  }, [query]);

  function handlePick(icon: IconLibraryEntry) {
    onChange(buildIconDataUrl(icon, mode));
  }

  return (
    <div className="icon-library">
      <div className="icon-library-controls">
        <input
          type="text"
          className="icon-library-search"
          placeholder="Buscar ícone (ex: whatsapp)"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="icon-library-modes">
          {COLOR_MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`icon-library-mode ${mode === m.value ? "is-active" : ""}`}
              onClick={() => setMode(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {value && (
        <div className="icon-library-current">
          <span className="icon-library-current-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" />
          </span>
          <span className="icon-library-current-label">Ícone selecionado</span>
          <button
            type="button"
            className="icon-library-clear"
            onClick={() => onChange(null)}
          >
            Remover
          </button>
        </div>
      )}

      <div className="icon-library-scroll">
        {filtered ? (
          filtered.length > 0 ? (
            <IconGrid icons={filtered} mode={mode} onPick={handlePick} />
          ) : (
            <p className="icon-library-empty">
              Nenhum ícone encontrado. Tente outro termo, ou use a aba &quot;Upload&quot;.
            </p>
          )
        ) : (
          ICON_CATEGORIES.map((category) => (
            <div key={category.label} className="icon-library-category">
              <h4>{category.label}</h4>
              <IconGrid icons={category.icons} mode={mode} onPick={handlePick} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function IconGrid({
  icons,
  mode,
  onPick,
}: {
  icons: IconLibraryEntry[];
  mode: IconColorMode;
  onPick: (icon: IconLibraryEntry) => void;
}) {
  return (
    <div className="icon-library-grid">
      {icons.map((icon) => (
        <button
          key={icon.slug}
          type="button"
          className="icon-library-item"
          onClick={() => onPick(icon)}
          title={icon.title}
        >
          <IconPreview icon={icon} mode={mode} />
          <span>{icon.title}</span>
        </button>
      ))}
    </div>
  );
}

function IconPreview({ icon, mode }: { icon: IconLibraryEntry; mode: IconColorMode }) {
  const fill = mode === "color" ? icon.hex : mode === "black" ? "#000000" : "#ffffff";
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
      <path fill={fill} d={icon.path} />
    </svg>
  );
}
