"use client";

import { useState } from "react";
import IconLibraryPicker from "./IconLibraryPicker";
import ImageUploadField from "./ImageUploadField";

type Props = {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  compact?: boolean;
};

export default function IconField({ value, onChange, compact }: Props) {
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
        <IconLibraryPicker value={value} onChange={onChange} />
      ) : (
        <ImageUploadField
          label="Ícone do link"
          helper="Opcional · PNG, JPG, WEBP ou SVG"
          value={value}
          maxSizeMb={1}
          onChange={onChange}
          compact={compact}
        />
      )}
    </div>
  );
}
