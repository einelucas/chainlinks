"use client";

import type { ButtonSize } from "@/lib/types";
import { FONT_OPTIONS } from "@/lib/types";
import ColorField from "./ColorField";
import ImageUploadField from "./ImageUploadField";

type Props = {
  bgType: string;
  bgColor: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  bgGradientAngle: number;
  bgImage?: string | null;
  overlayOpacity: number;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  bioColor: string;
  accentColor: string;
  buttonBgColor: string;
  buttonBorderColor: string;
  buttonTextColor: string;
  buttonRadius: number;
  buttonSize: ButtonSize;
  buttonShadowColor: string;
  hoverBgColor: string;
  hoverGlowColor: string;
  hoverScale: number;
  showShareButton: boolean;
  showQrButton: boolean;
  onUpdate: (data: Record<string, unknown>) => void;
};

const BUTTON_SIZES: Array<{ value: ButtonSize; label: string; detail: string }> = [
  { value: "small", label: "Pequeno", detail: "Mais compacto" },
  { value: "medium", label: "Médio", detail: "Tamanho padrão" },
  { value: "large", label: "Grande", detail: "Mais destaque" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      {children}
    </div>
  );
}

export default function AppearanceTab(props: Props) {
  const { onUpdate } = props;
  const fontSize = clamp(Number.isFinite(props.fontSize) ? props.fontSize : 16, 12, 24);
  const buttonRadius = clamp(
    Number.isFinite(props.buttonRadius) ? props.buttonRadius : 50,
    0,
    50
  );

  return (
    <div className="space-y-5">
      <Section title="Plano de fundo">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "color", label: "Cor sólida" },
            { value: "gradient", label: "Gradiente" },
            { value: "image", label: "Imagem" },
          ].map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => onUpdate({ bgType: option.value })}
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                props.bgType === option.value
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {props.bgType === "color" && (
          <ColorField
            label="Cor de fundo"
            value={props.bgColor}
            onChange={(value) => onUpdate({ bgColor: value })}
          />
        )}

        {props.bgType === "gradient" && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <ColorField
                label="Cor inicial"
                value={props.bgGradientFrom}
                onChange={(value) => onUpdate({ bgGradientFrom: value })}
              />
              <ColorField
                label="Cor final"
                value={props.bgGradientTo}
                onChange={(value) => onUpdate({ bgGradientTo: value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-neutral-300">
                Ângulo: {props.bgGradientAngle}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={props.bgGradientAngle}
                onChange={(event) =>
                  onUpdate({ bgGradientAngle: Number(event.target.value) })
                }
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        )}

        {props.bgType === "image" && (
          <ImageUploadField
            label="Imagem de fundo"
            aspect="wide"
            maxSizeMb={4}
            value={props.bgImage}
            onChange={(dataUrl) => onUpdate({ bgImage: dataUrl })}
          />
        )}

        <div>
          <label className="mb-1.5 block text-sm text-neutral-300">
            Escurecer fundo: {Math.round(props.overlayOpacity * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(props.overlayOpacity * 100)}
            onChange={(event) =>
              onUpdate({ overlayOpacity: Number(event.target.value) / 100 })
            }
            className="w-full accent-emerald-500"
          />
        </div>
      </Section>

      <Section title="Tipografia e cores gerais">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">Fonte</label>
            <select
              value={props.fontFamily}
              onChange={(event) => onUpdate({ fontFamily: event.target.value })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">
              Tamanho da fonte: {fontSize}px
            </label>
            <input
              type="number"
              min={12}
              max={24}
              value={fontSize}
              onChange={(event) =>
                onUpdate({ fontSize: clamp(Number(event.target.value), 12, 24) })
              }
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <input
          type="range"
          min={12}
          max={24}
          step={1}
          value={fontSize}
          onChange={(event) => onUpdate({ fontSize: Number(event.target.value) })}
          className="w-full accent-emerald-500"
          aria-label="Tamanho geral da fonte"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="Cor do texto (nome)"
            value={props.textColor}
            onChange={(value) => onUpdate({ textColor: value })}
          />
          <ColorField
            label="Cor da bio"
            value={props.bioColor}
            onChange={(value) => onUpdate({ bioColor: value })}
          />
        </div>

        <ColorField
          label="Cor de destaque (accent)"
          value={props.accentColor}
          onChange={(value) => onUpdate({ accentColor: value })}
        />
      </Section>

      <Section title="Botões de link">
        <div>
          <p className="mb-2 text-sm text-neutral-300">Tamanho dos botões</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {BUTTON_SIZES.map((size) => (
              <button
                type="button"
                key={size.value}
                onClick={() => onUpdate({ buttonSize: size.value })}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  props.buttonSize === size.value
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-neutral-700 text-neutral-300 hover:border-neutral-600"
                }`}
              >
                <span className="block text-sm font-medium">{size.label}</span>
                <span className="block text-[11px] text-neutral-500">
                  {size.detail}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="Fundo do botão"
            value={props.buttonBgColor}
            onChange={(value) => onUpdate({ buttonBgColor: value })}
          />
          <ColorField
            label="Borda do botão"
            value={props.buttonBorderColor}
            onChange={(value) => onUpdate({ buttonBorderColor: value })}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="Texto do botão"
            value={props.buttonTextColor}
            onChange={(value) => onUpdate({ buttonTextColor: value })}
          />
          <ColorField
            label="Brilho/sombra do botão"
            value={props.buttonShadowColor}
            onChange={(value) => onUpdate({ buttonShadowColor: value })}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label className="text-sm text-neutral-300">
              Arredondamento das bordas
            </label>
            <span className="font-mono text-xs text-neutral-500">
              {buttonRadius}px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={buttonRadius}
            onChange={(event) =>
              onUpdate({ buttonRadius: Number(event.target.value) })
            }
            className="w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-[11px] text-neutral-600">
            <span>Quadrado</span>
            <span>Totalmente redondo</span>
          </div>
        </div>
      </Section>

      <Section title="Efeito hover (ao passar o mouse)">
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="Fundo no hover"
            value={props.hoverBgColor}
            onChange={(value) => onUpdate({ hoverBgColor: value })}
          />
          <ColorField
            label="Brilho no hover"
            value={props.hoverGlowColor}
            onChange={(value) => onUpdate({ hoverGlowColor: value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-neutral-300">
            Zoom no hover: {props.hoverScale.toFixed(2)}x
          </label>
          <input
            type="range"
            min={100}
            max={115}
            value={Math.round(props.hoverScale * 100)}
            onChange={(event) =>
              onUpdate({ hoverScale: Number(event.target.value) / 100 })
            }
            className="w-full accent-emerald-500"
          />
        </div>
      </Section>

      <Section title="Botões flutuantes">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={props.showShareButton}
            onChange={(event) =>
              onUpdate({ showShareButton: event.target.checked })
            }
            className="h-4 w-4 accent-emerald-500"
          />
          <span className="text-sm text-neutral-300">Botão de compartilhar</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={props.showQrButton}
            onChange={(event) => onUpdate({ showQrButton: event.target.checked })}
            className="h-4 w-4 accent-emerald-500"
          />
          <span className="text-sm text-neutral-300">Botão de QR Code</span>
        </label>
      </Section>
    </div>
  );
}
