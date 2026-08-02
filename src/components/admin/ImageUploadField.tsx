"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  aspect?: "square" | "wide";
  maxSizeMb?: number;
};

// MVP: guardamos a imagem como data URI (base64) direto no banco.
// Simples e funciona em qualquer host, mas para produção em escala
// considere trocar por um serviço de storage (Vercel Blob, Cloudinary, S3)
// e salvar apenas a URL — veja README.md.
export default function ImageUploadField({
  label,
  value,
  onChange,
  aspect = "square",
  maxSizeMb = 2,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Envie um arquivo de imagem");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Imagem muito grande (máx. ${maxSizeMb}MB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="block text-sm text-neutral-300 mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className={`relative overflow-hidden bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 ${
            aspect === "square" ? "w-16 h-16 rounded-full" : "w-24 h-14 rounded-lg"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-neutral-600 text-xs">Nenhuma</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:border-emerald-500 hover:text-emerald-400 transition"
            >
              Enviar imagem
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-500 hover:border-red-500 hover:text-red-400 transition"
              >
                Remover
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
