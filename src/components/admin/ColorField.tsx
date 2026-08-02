"use client";

import { useEffect, useRef, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

// Aceita tanto hex (#00ff6a) quanto rgba(...) — o picker sempre trabalha
// internamente em hex+alpha e converte na saída.
function toPickerValue(value: string): string {
  if (value.startsWith("#")) return value;
  const match = value.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/
  );
  if (!match) return "#000000";
  const [, r, g, b, a] = match;
  const toHex = (n: string) => Number(n).toString(16).padStart(2, "0");
  const alphaHex = a
    ? Math.round(parseFloat(a) * 255)
        .toString(16)
        .padStart(2, "0")
    : "ff";
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}

export default function ColorField({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm text-neutral-300 mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-left"
      >
        <span
          className="w-5 h-5 rounded-full border border-neutral-600 shrink-0"
          style={{ background: value }}
        />
        <span className="text-xs text-neutral-300 font-mono truncate">{value}</span>
      </button>

      {open && (
        <div className="absolute z-40 mt-2">
          <HexAlphaColorPicker
            color={toPickerValue(value)}
            onChange={(hex) => {
              // Converte hex+alpha para rgba para ficar consistente no CSS
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              const a = hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
              onChange(a < 1 ? `rgba(${r},${g},${b},${a.toFixed(2)})` : hex.slice(0, 7));
            }}
          />
        </div>
      )}
    </div>
  );
}
