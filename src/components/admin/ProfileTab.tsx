"use client";

import { useState } from "react";
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
    <div className="space-y-6">
      <ImageUploadField
        label="Foto de perfil"
        value={profileImage}
        onChange={(dataUrl) => onUpdate({ profileImage: dataUrl })}
      />

      <div>
        <label className="block text-sm text-neutral-300 mb-1.5">Nome exibido</label>
        <input
          type="text"
          defaultValue={displayName}
          onChange={(e) => onUpdate({ displayName: e.target.value })}
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1.5">Bio / descrição</label>
        <textarea
          defaultValue={bio}
          rows={3}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1.5">
          Endereço da sua página
        </label>
        <div className="flex items-center rounded-lg bg-neutral-800 border border-neutral-700 focus-within:ring-2 focus-within:ring-emerald-500">
          <span className="pl-3 text-neutral-500 text-sm">seusite.com/</span>
          <input
            type="text"
            value={localUsername}
            onChange={(e) => {
              const v = e.target.value.toLowerCase().replace(/\s/g, "");
              setLocalUsername(v);
              onUpdate({ username: v });
            }}
            className="w-full bg-transparent px-1 py-2 text-white text-sm focus:outline-none"
          />
        </div>
        {usernameError && (
          <p className="text-xs text-red-400 mt-1">{usernameError}</p>
        )}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => onUpdate({ isPublished: e.target.checked })}
          className="w-4 h-4 accent-emerald-500"
        />
        <span className="text-sm text-neutral-300">
          Página publicada (visível para o público)
        </span>
      </label>
    </div>
  );
}
