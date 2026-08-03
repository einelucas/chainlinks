"use client";

import { useState } from "react";
import type { ButtonSize } from "@/lib/types";
import { FONT_OPTIONS } from "@/lib/types";
import {
  BackgroundIcon,
  ButtonIcon,
  DeviceIcon,
  SparkleIcon,
  TypeIcon,
} from "./AdminIcons";
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

type AppearanceSection = "background" | "typography" | "buttons" | "effects";

const SECTIONS = [
  { id: "background", label: "Fundo", icon: BackgroundIcon },
  { id: "typography", label: "Tipografia", icon: TypeIcon },
  { id: "buttons", label: "Botões", icon: ButtonIcon },
  { id: "effects", label: "Efeitos", icon: SparkleIcon },
] as const;

const BUTTON_SIZES: Array<{ value: ButtonSize; label: string; detail: string }> = [
  { value: "small", label: "Pequeno", detail: "Mais compacto" },
  { value: "medium", label: "Médio", detail: "Equilíbrio ideal" },
  { value: "large", label: "Grande", detail: "Mais destaque" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="editor-card appearance-card">
      <div className="editor-card-heading">
        <span className="editor-card-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="appearance-card-body">{children}</div>
    </section>
  );
}

function RangeControl({
  label,
  valueLabel,
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="editor-range-field">
      <div className="editor-range-heading">
        <span>{label}</span>
        <strong>{valueLabel}</strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
      />
      {(minLabel || maxLabel) && (
        <div className="editor-range-labels">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function AppearanceTab(props: Props) {
  const [section, setSection] = useState<AppearanceSection>("background");
  const { onUpdate } = props;
  const fontSize = clamp(Number.isFinite(props.fontSize) ? props.fontSize : 16, 12, 24);
  const buttonRadius = clamp(
    Number.isFinite(props.buttonRadius) ? props.buttonRadius : 50,
    0,
    50
  );

  return (
    <div className="appearance-editor">
      <nav className="appearance-subnav" aria-label="Categorias de aparência">
        {SECTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setSection(item.id)}
              className={section === item.id ? "is-active" : ""}
              aria-current={section === item.id ? "page" : undefined}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="appearance-section" key={section}>
        {section === "background" && (
          <SectionCard
            icon={<BackgroundIcon />}
            title="Plano de fundo"
            description="Defina a atmosfera principal da sua página."
          >
            <div className="appearance-choice-grid appearance-background-choices">
              {[
                { value: "color", label: "Cor sólida", preview: props.bgColor },
                {
                  value: "gradient",
                  label: "Gradiente",
                  preview: `linear-gradient(${props.bgGradientAngle}deg, ${props.bgGradientFrom}, ${props.bgGradientTo})`,
                },
                { value: "image", label: "Imagem", preview: props.bgImage ? `url(${props.bgImage})` : "linear-gradient(135deg,#252525,#101010)" },
              ].map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => onUpdate({ bgType: option.value })}
                  className={`appearance-choice ${props.bgType === option.value ? "is-active" : ""}`}
                >
                  <i style={{ background: option.preview }} />
                  <span>{option.label}</span>
                  <small>{props.bgType === option.value ? "Selecionado" : "Usar estilo"}</small>
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
              <div className="editor-stack-small">
                <div className="editor-field-grid editor-field-grid-2">
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
                <RangeControl
                  label="Direção do gradiente"
                  valueLabel={`${props.bgGradientAngle}°`}
                  min={0}
                  max={360}
                  value={props.bgGradientAngle}
                  onChange={(value) => onUpdate({ bgGradientAngle: value })}
                  minLabel="0°"
                  maxLabel="360°"
                />
              </div>
            )}

            {props.bgType === "image" && (
              <ImageUploadField
                label="Imagem de fundo"
                helper="Use uma imagem vertical de alta qualidade"
                aspect="wide"
                maxSizeMb={4}
                value={props.bgImage}
                onChange={(dataUrl) => onUpdate({ bgImage: dataUrl })}
              />
            )}

            <RangeControl
              label="Escurecer fundo"
              valueLabel={`${Math.round(props.overlayOpacity * 100)}%`}
              min={0}
              max={100}
              value={Math.round(props.overlayOpacity * 100)}
              onChange={(value) => onUpdate({ overlayOpacity: value / 100 })}
              minLabel="Original"
              maxLabel="Escuro"
            />
          </SectionCard>
        )}

        {section === "typography" && (
          <SectionCard
            icon={<TypeIcon />}
            title="Tipografia e cores"
            description="Crie hierarquia e garanta uma leitura confortável."
          >
            <label className="editor-field">
              <span>Família da fonte</span>
              <select
                value={props.fontFamily}
                onChange={(event) => onUpdate({ fontFamily: event.target.value })}
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </label>

            <RangeControl
              label="Tamanho geral da fonte"
              valueLabel={`${fontSize}px`}
              min={12}
              max={24}
              value={fontSize}
              onChange={(value) => onUpdate({ fontSize: value })}
              minLabel="Discreto"
              maxLabel="Expressivo"
            />

            <div className="editor-field-grid editor-field-grid-2">
              <ColorField
                label="Nome do perfil"
                value={props.textColor}
                onChange={(value) => onUpdate({ textColor: value })}
              />
              <ColorField
                label="Texto da bio"
                value={props.bioColor}
                onChange={(value) => onUpdate({ bioColor: value })}
              />
            </div>

            <ColorField
              label="Cor de destaque"
              value={props.accentColor}
              onChange={(value) => onUpdate({ accentColor: value })}
            />
          </SectionCard>
        )}

        {section === "buttons" && (
          <SectionCard
            icon={<ButtonIcon />}
            title="Botões de link"
            description="Ajuste proporções, cores, contraste e acabamento."
          >
            <div className="appearance-field-group">
              <span className="appearance-field-label">Tamanho dos botões</span>
              <div className="appearance-choice-grid appearance-size-choices">
                {BUTTON_SIZES.map((size) => (
                  <button
                    type="button"
                    key={size.value}
                    onClick={() => onUpdate({ buttonSize: size.value })}
                    className={`appearance-size-choice ${props.buttonSize === size.value ? "is-active" : ""}`}
                  >
                    <i className={`button-size-demo is-${size.value}`} />
                    <strong>{size.label}</strong>
                    <small>{size.detail}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-field-grid editor-field-grid-2">
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
              <ColorField
                label="Texto do botão"
                value={props.buttonTextColor}
                onChange={(value) => onUpdate({ buttonTextColor: value })}
              />
              <ColorField
                label="Brilho / sombra"
                value={props.buttonShadowColor}
                onChange={(value) => onUpdate({ buttonShadowColor: value })}
              />
            </div>

            <RangeControl
              label="Arredondamento das bordas"
              valueLabel={`${buttonRadius}px`}
              min={0}
              max={50}
              value={buttonRadius}
              onChange={(value) => onUpdate({ buttonRadius: value })}
              minLabel="Quadrado"
              maxLabel="Redondo"
            />
          </SectionCard>
        )}

        {section === "effects" && (
          <div className="editor-stack">
            <SectionCard
              icon={<SparkleIcon />}
              title="Interação dos botões"
              description="Configure a resposta visual ao passar o mouse."
            >
              <div className="editor-field-grid editor-field-grid-2">
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

              <RangeControl
                label="Zoom no hover"
                valueLabel={`${props.hoverScale.toFixed(2)}×`}
                min={100}
                max={115}
                value={Math.round(props.hoverScale * 100)}
                onChange={(value) => onUpdate({ hoverScale: value / 100 })}
                minLabel="Sem zoom"
                maxLabel="Destaque"
              />
            </SectionCard>

            <SectionCard
              icon={<DeviceIcon />}
              title="Ações flutuantes"
              description="Escolha quais atalhos ficam visíveis na página."
            >
              <label className="appearance-toggle-row">
                <span>
                  <strong>Compartilhar página</strong>
                  <small>Exibe um atalho de compartilhamento no topo.</small>
                </span>
                <span className="editor-switch editor-switch-large">
                  <input
                    type="checkbox"
                    checked={props.showShareButton}
                    onChange={(event) => onUpdate({ showShareButton: event.target.checked })}
                  />
                  <span aria-hidden="true" />
                </span>
              </label>

              <label className="appearance-toggle-row">
                <span>
                  <strong>QR Code</strong>
                  <small>Permite abrir a página rapidamente em outro dispositivo.</small>
                </span>
                <span className="editor-switch editor-switch-large">
                  <input
                    type="checkbox"
                    checked={props.showQrButton}
                    onChange={(event) => onUpdate({ showQrButton: event.target.checked })}
                  />
                  <span aria-hidden="true" />
                </span>
              </label>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
