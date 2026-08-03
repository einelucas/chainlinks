"use client";

import { useState } from "react";
import { EyeIcon, ProfileIcon } from "./AdminIcons";
import ImageUploadField from "./ImageUploadField";

type Props = {
  username: string;
  displayName: string;
  bio: string;
  profileImage?: string | null;
  isPublished: boolean;
  onUpdate: (data: Record<string, unknown>) => void;
  usernameError?: string | null;
};

export default function ProfileTab({
  username,
  displayName,
  bio,
  profileImage,
  isPublished,
  onUpdate,
  usernameError,
}: Props) {
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
            <span>linkpage.com/</span>
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
