"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LinkItemData } from "@/lib/types";
import { ChainIcon } from "@/components/icons";
import ImageUploadField from "./ImageUploadField";

type Props = {
  links: LinkItemData[];
  onAdd: (label: string, url: string, icon?: string | null) => void;
  onUpdate: (id: string, data: Partial<LinkItemData>) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
};

export default function LinksTab({
  links,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: Props) {
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const sorted = [...links].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex((link) => link.id === active.id);
    const newIndex = sorted.findIndex((link) => link.id === over.id);
    const moved = arrayMove(sorted, oldIndex, newIndex);

    onReorder(moved.map((link) => link.id));
  }

  function handleAdd() {
    if (!newLabel.trim() || !newUrl.trim()) return;

    onAdd(newLabel.trim(), newUrl.trim(), newIcon);
    setNewLabel("");
    setNewUrl("");
    setNewIcon(null);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div>
          <p className="text-sm font-medium text-white">Adicionar novo link</p>
          <p className="mt-1 text-xs text-neutral-500">
            O ícone é opcional e aparece ao lado do título do botão.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Título (ex: Meu Instagram)"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="url"
            placeholder="https://..."
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <ImageUploadField
          label="Ícone do link (opcional)"
          value={newIcon}
          maxSizeMb={1}
          onChange={setNewIcon}
        />

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          + Adicionar link
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-500">
          Nenhum link ainda. Adicione o primeiro acima.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sorted.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sorted.map((link) => (
                <SortableLinkRow
                  key={link.id}
                  link={link}
                  expanded={expandedId === link.id}
                  onToggleExpand={() =>
                    setExpandedId(expandedId === link.id ? null : link.id)
                  }
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableLinkRow({
  link,
  expanded,
  onToggleExpand,
  onUpdate,
  onDelete,
}: {
  link: LinkItemData;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (id: string, data: Partial<LinkItemData>) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
    >
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab px-1 text-neutral-600 hover:text-neutral-400 active:cursor-grabbing"
          aria-label="Arrastar para reordenar"
        >
          ⠿
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-expanded={expanded}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-400">
            {link.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={link.icon} alt="" className="h-full w-full object-cover" />
            ) : (
              <ChainIcon width={18} height={18} />
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-white">{link.label}</span>
            <span className="block truncate text-xs text-neutral-500">{link.url}</span>
          </span>
        </button>

        <input
          type="checkbox"
          checked={link.isActive}
          onChange={(event) =>
            onUpdate(link.id, { isActive: event.target.checked })
          }
          className="h-4 w-4 accent-emerald-500"
          title="Ativo"
          aria-label={`Ativar ou desativar ${link.label}`}
        />

        <button
          type="button"
          onClick={() => onDelete(link.id)}
          className="px-1 text-sm text-neutral-600 hover:text-red-400"
          aria-label="Excluir"
        >
          ✕
        </button>
      </div>

      {expanded && (
        <div className="space-y-3 border-t border-neutral-800 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Título</label>
              <input
                type="text"
                value={link.label}
                onChange={(event) =>
                  onUpdate(link.id, { label: event.target.value })
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">Link</label>
              <input
                type="url"
                value={link.url}
                onChange={(event) =>
                  onUpdate(link.id, { url: event.target.value })
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <ImageUploadField
            label="Ícone do link (opcional)"
            value={link.icon}
            maxSizeMb={1}
            onChange={(dataUrl) => onUpdate(link.id, { icon: dataUrl })}
          />
        </div>
      )}
    </div>
  );
}
