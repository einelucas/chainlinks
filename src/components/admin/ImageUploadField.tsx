"use client";

import { useRef, useState } from "react";
import { ImageIcon, TrashIcon, UploadIcon } from "./AdminIcons";

type Props = {
  label: string;
  helper?: string;
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  aspect?: "square" | "wide";
  maxSizeMb?: number;
  compact?: boolean;
};

// MVP: guardamos a imagem como data URI (base64) direto no banco.
// A interface continua isolando este ponto para uma futura integração com storage.
export default function ImageUploadField({
  label,
  helper,
  value,
  onChange,
  aspect = "square",
  maxSizeMb = 2,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Envie um arquivo de imagem válido.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Imagem muito grande. O limite é ${maxSizeMb}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className={`image-upload-field ${compact ? "is-compact" : ""}`}>
      <div className="image-upload-heading">
        <span>{label}</span>
        {helper && <small>{helper}</small>}
      </div>

      <div
        className={`image-upload-area ${aspect === "wide" ? "is-wide" : ""} ${
          dragging ? "is-dragging" : ""
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <button
          type="button"
          className="image-upload-preview"
          onClick={() => inputRef.current?.click()}
          aria-label={value ? `Trocar ${label.toLowerCase()}` : `Enviar ${label.toLowerCase()}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" />
          ) : (
            <ImageIcon />
          )}
        </button>

        <div className="image-upload-copy">
          <strong>{value ? "Imagem adicionada" : "Adicione uma imagem"}</strong>
          <span>
            {compact
              ? `Até ${maxSizeMb}MB`
              : `Arraste o arquivo aqui ou escolha no dispositivo · até ${maxSizeMb}MB`}
          </span>
          <div className="image-upload-actions">
            <button type="button" onClick={() => inputRef.current?.click()}>
              <UploadIcon />
              {value ? "Trocar imagem" : "Escolher imagem"}
            </button>
            {value && (
              <button
                type="button"
                className="is-remove"
                onClick={() => {
                  setError(null);
                  onChange(null);
                }}
              >
                <TrashIcon />
                Remover
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <p className="editor-error-text">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
