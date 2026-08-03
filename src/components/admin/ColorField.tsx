"use client";

import { useEffect, useRef, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const HEX_WITHOUT_HASH = /^(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_COLOR = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;

function normalizeTypedColor(input: string): string | null {
  const trimmed = input.trim();
  const withHash = HEX_WITHOUT_HASH.test(trimmed) ? `#${trimmed}` : trimmed;

  if (HEX_COLOR.test(withHash)) return withHash.toLowerCase();
  if (RGB_COLOR.test(withHash)) return withHash;

  return null;
}

function expandHex(value: string): string {
  const normalized = value.replace("#", "");

  if (normalized.length === 3 || normalized.length === 4) {
    return normalized
      .split("")
      .map((character) => character + character)
      .join("");
  }

  return normalized;
}

function toPickerValue(value: string): string {
  const normalized = normalizeTypedColor(value);

  if (normalized?.startsWith("#")) {
    const expanded = expandHex(normalized);
    return `#${expanded.length === 6 ? `${expanded}ff` : expanded}`;
  }

  const match = value.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i
  );

  if (!match) return "#000000ff";

  const [, red, green, blue, alpha] = match;
  const toHex = (channel: string) =>
    Math.max(0, Math.min(255, Number(channel)))
      .toString(16)
      .padStart(2, "0");
  const alphaHex = Math.round(
    Math.max(0, Math.min(1, alpha ? Number(alpha) : 1)) * 255
  )
    .toString(16)
    .padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}${alphaHex}`;
}

function fromPickerValue(hex: string): string {
  const expanded = expandHex(hex);
  const red = parseInt(expanded.slice(0, 2), 16);
  const green = parseInt(expanded.slice(2, 4), 16);
  const blue = parseInt(expanded.slice(4, 6), 16);
  const alpha = expanded.length >= 8 ? parseInt(expanded.slice(6, 8), 16) / 255 : 1;

  if (alpha < 1) {
    return `rgba(${red},${green},${blue},${alpha.toFixed(2)})`;
  }

  return `#${expanded.slice(0, 6)}`;
}

export default function ColorField({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [invalid, setInvalid] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function commitTypedColor(input: string) {
    const normalized = normalizeTypedColor(input);

    if (!normalized) {
      setInvalid(true);
      return false;
    }

    setInvalid(false);
    setDraft(normalized);
    onChange(normalized);
    return true;
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm text-neutral-300 mb-1.5">{label}</label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-10 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 transition hover:border-emerald-500"
          aria-label={`Abrir seletor de ${label.toLowerCase()}`}
          aria-expanded={open}
        >
          <span
            className="h-6 w-6 rounded-md border border-white/20 shadow-inner"
            style={{ background: value }}
          />
        </button>

        <input
          type="text"
          value={draft}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDraft(nextValue);

            const normalized = normalizeTypedColor(nextValue);
            if (normalized) {
              setInvalid(false);
              onChange(normalized);
            }
          }}
          onBlur={() => {
            if (!commitTypedColor(draft)) setDraft(value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitTypedColor(draft);
              event.currentTarget.blur();
            }

            if (event.key === "Escape") {
              setDraft(value);
              setInvalid(false);
              event.currentTarget.blur();
            }
          }}
          placeholder="#00ff6a"
          spellCheck={false}
          className={`h-10 min-w-0 flex-1 rounded-lg border bg-neutral-800 px-3 font-mono text-sm text-white outline-none transition focus:ring-2 focus:ring-emerald-500 ${
            invalid ? "border-red-500" : "border-neutral-700"
          }`}
          aria-invalid={invalid}
        />
      </div>

      {invalid && (
        <p className="mt-1 text-xs text-red-400">
          Use uma cor hexadecimal, por exemplo #00ff6a.
        </p>
      )}

      {open && (
        <div className="absolute z-40 mt-2 rounded-xl border border-neutral-700 bg-neutral-900 p-3 shadow-2xl">
          <HexAlphaColorPicker
            color={toPickerValue(value)}
            onChange={(hex) => {
              const nextValue = fromPickerValue(hex);
              setDraft(nextValue);
              setInvalid(false);
              onChange(nextValue);
            }}
          />
        </div>
      )}
    </div>
  );
}
