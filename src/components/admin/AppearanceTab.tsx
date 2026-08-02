"use client";

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
  textColor: string;
  bioColor: string;
  accentColor: string;
  buttonBgColor: string;
  buttonBorderColor: string;
  buttonTextColor: string;
  buttonRadius: number;
  buttonShadowColor: string;
  hoverBgColor: string;
  hoverGlowColor: string;
  hoverScale: number;
  showShareButton: boolean;
  showQrButton: boolean;
  onUpdate: (data: Record<string, unknown>) => void;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      {children}
    </div>
  );
}

export default function AppearanceTab(props: Props) {
  const { onUpdate } = props;

  return (
    <div className="space-y-5">
      <Section title="Plano de fundo">
        <div className="flex gap-2">
          {[
            { value: "color", label: "Cor sólida" },
            { value: "gradient", label: "Gradiente" },
            { value: "image", label: "Imagem" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ bgType: opt.value })}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                props.bgType === opt.value
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {props.bgType === "color" && (
          <ColorField
            label="Cor de fundo"
            value={props.bgColor}
            onChange={(v) => onUpdate({ bgColor: v })}
          />
        )}

        {props.bgType === "gradient" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <ColorField
                label="Cor inicial"
                value={props.bgGradientFrom}
                onChange={(v) => onUpdate({ bgGradientFrom: v })}
              />
              <ColorField
                label="Cor final"
                value={props.bgGradientTo}
                onChange={(v) => onUpdate({ bgGradientTo: v })}
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-300 mb-1.5">
                Ângulo: {props.bgGradientAngle}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={props.bgGradientAngle}
                onChange={(e) => onUpdate({ bgGradientAngle: Number(e.target.value) })}
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
          <label className="block text-sm text-neutral-300 mb-1.5">
            Escurecer fundo: {Math.round(props.overlayOpacity * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(props.overlayOpacity * 100)}
            onChange={(e) =>
              onUpdate({ overlayOpacity: Number(e.target.value) / 100 })
            }
            className="w-full accent-emerald-500"
          />
        </div>
      </Section>

      <Section title="Tipografia e cores gerais">
        <div>
          <label className="block text-sm text-neutral-300 mb-1.5">
            Fonte
          </label>
          <select
            value={props.fontFamily}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Cor do texto (nome)"
            value={props.textColor}
            onChange={(v) => onUpdate({ textColor: v })}
          />
          <ColorField
            label="Cor da bio"
            value={props.bioColor}
            onChange={(v) => onUpdate({ bioColor: v })}
          />
        </div>
        <ColorField
          label="Cor de destaque (accent)"
          value={props.accentColor}
          onChange={(v) => onUpdate({ accentColor: v })}
        />
      </Section>

      <Section title="Botões de link">
        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Fundo do botão"
            value={props.buttonBgColor}
            onChange={(v) => onUpdate({ buttonBgColor: v })}
          />
          <ColorField
            label="Borda do botão"
            value={props.buttonBorderColor}
            onChange={(v) => onUpdate({ buttonBorderColor: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Texto do botão"
            value={props.buttonTextColor}
            onChange={(v) => onUpdate({ buttonTextColor: v })}
          />
          <ColorField
            label="Brilho/sombra do botão"
            value={props.buttonShadowColor}
            onChange={(v) => onUpdate({ buttonShadowColor: v })}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300 mb-1.5">
            Arredondamento das bordas: {props.buttonRadius}px
          </label>
          <input
            type="range"
            min={0}
            max={999}
            value={props.buttonRadius}
            onChange={(e) => onUpdate({ buttonRadius: Number(e.target.value) })}
            className="w-full accent-emerald-500"
          />
        </div>
      </Section>

      <Section title="Efeito hover (ao passar o mouse)">
        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Fundo no hover"
            value={props.hoverBgColor}
            onChange={(v) => onUpdate({ hoverBgColor: v })}
          />
          <ColorField
            label="Brilho no hover"
            value={props.hoverGlowColor}
            onChange={(v) => onUpdate({ hoverGlowColor: v })}
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-300 mb-1.5">
            Zoom no hover: {props.hoverScale.toFixed(2)}x
          </label>
          <input
            type="range"
            min={100}
            max={115}
            value={Math.round(props.hoverScale * 100)}
            onChange={(e) => onUpdate({ hoverScale: Number(e.target.value) / 100 })}
            className="w-full accent-emerald-500"
          />
        </div>
      </Section>

      <Section title="Botões flutuantes">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={props.showShareButton}
            onChange={(e) => onUpdate({ showShareButton: e.target.checked })}
            className="w-4 h-4 accent-emerald-500"
          />
          <span className="text-sm text-neutral-300">Botão de compartilhar</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={props.showQrButton}
            onChange={(e) => onUpdate({ showQrButton: e.target.checked })}
            className="w-4 h-4 accent-emerald-500"
          />
          <span className="text-sm text-neutral-300">Botão de QR Code</span>
        </label>
      </Section>
    </div>
  );
}
