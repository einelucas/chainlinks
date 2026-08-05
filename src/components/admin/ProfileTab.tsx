"use client";

import { useState } from "react";
import {
  PROFILE_IMAGE_SIZE_MAX,
  PROFILE_IMAGE_SIZE_MIN,
  PROFILE_IMAGE_SIZE_PRESETS,
} from "@/lib/types";
import { EyeIcon, ProfileIcon } from "./AdminIcons";
import ImageUploadField from "./ImageUploadField";
import RangeControl from "./RangeControl";

type Props = {
  username: string;
  displayName: string;
  bio: string;
  profileImage?: string | null;
  profileImageSize: number;
  isPublished: boolean;
  onUpdate: (data: Record<string, unknown>) => void;
  usernameError?: string | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ProfileTab({
  username,
  displayName,
  bio,
  profileImage,
  profileImageSize,
  isPublished,
  onUpdate,
  usernameError,
}: Props) {
  const imageSize = clamp(
    Number.isFinite(profileImageSize) ? profileImageSize : 104,
    PROFILE_IMAGE_SIZE_MIN,
    PROFILE_IMAGE_SIZE_MAX
  );
  const [localUsername, setLocalUsername] = useState(username);

  return (
    <div className="editor-stack">
      <section className="editor-card profile-identity-card">
        <div className="editor-card-heading">
          <span className="editor-card-icon"><ProfileIcon /></span>
          <div>
            <h2>Identidade do perfil</h2>
            <p>Essas informações aparecem no topo da sua página pública.</p>
          </div>
        </div>

        <ImageUploadField
          label="Foto de perfil"
          helper="Recomendado: imagem quadrada de pelo menos 400 × 400 px"
          value={profileImage}
          onChange={(dataUrl) => onUpdate({ profileImage: dataUrl })}
        />

        <div className="appearance-field-group">
          <span className="appearance-field-label">Tamanho da foto</span>
          <div className="appearance-choice-grid appearance-size-choices appearance-image-size-choices">
            {PROFILE_IMAGE_SIZE_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.value}
                onClick={() => onUpdate({ profileImageSize: preset.value })}
                className={`appearance-size-choice ${imageSize === preset.value ? "is-active" : ""}`}
              >
                <i className={`profile-size-demo is-${preset.value}`} />
                <strong>{preset.label}</strong>
                <small>{preset.value}px</small>
              </button>
            ))}
          </div>

          <RangeControl
            label="Ajuste livre"
            valueLabel={`${imageSize}px`}
            min={PROFILE_IMAGE_SIZE_MIN}
            max={PROFILE_IMAGE_SIZE_MAX}
            step={2}
            value={imageSize}
            onChange={(value) => onUpdate({ profileImageSize: value })}
            minLabel={`${PROFILE_IMAGE_SIZE_MIN}px`}
            maxLabel={`${PROFILE_IMAGE_SIZE_MAX}px`}
          />
        </div>

        <div className="editor-field-grid">
          <label className="editor-field">
            <span>Nome exibido</span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => onUpdate({ displayName: event.target.value })}
              placeholder="Seu nome ou marca"
            />
          </label>

          <label className="editor-field">
            <span>Bio / descrição</span>
            <textarea
              value={bio}
              rows={4}
              maxLength={180}
              onChange={(event) => onUpdate({ bio: event.target.value })}
              placeholder="Conte um pouco sobre você..."
            />
            <small className="editor-character-count">{bio.length}/180</small>
          </label>
        </div>
      </section>

      <section className="editor-card">
        <div className="editor-card-heading">
          <span className="editor-card-icon"><EyeIcon /></span>
          <div>
            <h2>Endereço e visibilidade</h2>
            <p>Escolha uma URL fácil de lembrar e controle a publicação.</p>
          </div>
        </div>

        <label className="editor-field">
          <span>Endereço da sua página</span>
          <div className={`editor-url-field ${usernameError ? "has-error" : ""}`}>
            <span>chainlinks.me/</span>
            <input
              type="text"
              value={localUsername}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onChange={(event) => {
                const value = event.target.value
                  .toLowerCase()
                  .replace(/\s/g, "")
                  .replace(/[^a-z0-9_-]/g, "");
                setLocalUsername(value);
                onUpdate({ username: value });
              }}
            />
          </div>
          {usernameError && <small className="editor-error-text">{usernameError}</small>}
          {!usernameError && <small className="editor-field-helper">Use letras minúsculas, números, hífen ou underline.</small>}
        </label>

        <label className={`profile-publish-control ${isPublished ? "is-published" : ""}`}>
          <span className="profile-publish-icon"><EyeIcon /></span>
          <span className="profile-publish-copy">
            <strong>{isPublished ? "Página publicada" : "Página privada"}</strong>
            <small>
              {isPublished
                ? "Seu endereço está visível e pode ser compartilhado."
                : "Somente você consegue acessar a página enquanto edita."}
            </small>
          </span>
          <span className="editor-switch editor-switch-large">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(event) => onUpdate({ isPublished: event.target.checked })}
            />
            <span aria-hidden="true" />
          </span>
        </label>
      </section>
    </div>
  );
}
