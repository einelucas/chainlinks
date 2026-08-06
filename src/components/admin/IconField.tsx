"use client";

import { useState } from "react";
import type { IconColorMode } from "@/lib/icon-library";
import IconLibraryPicker from "./IconLibraryPicker";
import ImageUploadField from "./ImageUploadField";

type Props = {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  compact?: boolean;
  colorModes?: IconColorMode[];
  uploadLabel?: string;
  uploadHelper?: string;
};

export default function IconField({
  value,
  onChange,
  compact,
  colorModes,
  uploadLabel = "Ícone do link",
  uploadHelper = "Opcional · PNG, JPG, WEBP ou SVG",
}: Props) {
  const [mode, setMode] = useState<"library" | "upload">("library");

  return (
    <div>
      <div className="icon-field-tabs">
        <button
          type="button"
          className={`icon-field-tab ${mode === "library" ? "is-active" : ""}`}
          onClick={() => setMode("library")}
        >
          Biblioteca
        </button>
        <button
          type="button"
          className={`icon-field-tab ${mode === "upload" ? "is-active" : ""}`}
          onClick={() => setMode("upload")}
        >
          Upload
        </button>
      </div>

      {mode === "library" ? (
        <IconLibraryPicker value={value} onChange={onChange} colorModes={colorModes} />
      ) : (
        <ImageUploadField
          label={uploadLabel}
          helper={uploadHelper}
          value={value}
          maxSizeMb={1}
          onChange={onChange}
          compact={compact}
        />
      )}
    </div>
  );
}
