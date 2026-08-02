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
import ImageUploadField from "./ImageUploadField";

type Props = {
  links: LinkItemData[];
  onAdd: (label: string, url: string) => void;
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const sorted = [...links].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex((l) => l.id === active.id);
    const newIndex = sorted.findIndex((l) => l.id === over.id);
    const moved = arrayMove(sorted, oldIndex, newIndex);
    onReorder(moved.map((l) => l.id));
  }

  function handleAdd() {
    if (!newLabel.trim() || !newUrl.trim()) return;
    onAdd(newLabel.trim(), newUrl.trim());
    setNewLabel("");
    setNewUrl("");
  }

  return (
    <div className="space-y-5">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium text-white">Adicionar novo link</p>
        <div className="grid sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Título (ex: Meu Instagram)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="https://..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="text-sm px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium transition"
        >
          + Adicionar link
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center py-6">
          Nenhum link ainda. Adicione o primeiro acima.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sorted.map((l) => l.id)}
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
      className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 p-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 px-1"
          aria-label="Arrastar para reordenar"
        >
          ⠿
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
          <p className="text-sm text-white truncate">{link.label}</p>
          <p className="text-xs text-neutral-500 truncate">{link.url}</p>
        </div>

        <input
          type="checkbox"
          checked={link.isActive}
          onChange={(e) => onUpdate(link.id, { isActive: e.target.checked })}
          className="w-4 h-4 accent-emerald-500"
          title="Ativo"
        />

        <button
          onClick={() => onDelete(link.id)}
          className="text-neutral-600 hover:text-red-400 text-sm px-1"
          aria-label="Excluir"
        >
          ✕
        </button>
      </div>

      {expanded && (
        <div className="border-t border-neutral-800 p-3 space-y-3">
          <div className="grid sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Título</label>
              <input
                type="text"
                defaultValue={link.label}
                onChange={(e) => onUpdate(link.id, { label: e.target.value })}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Link</label>
              <input
                type="text"
                defaultValue={link.url}
                onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <ImageUploadField
            label="Ícone customizado (opcional)"
            value={link.icon}
            onChange={(dataUrl) => onUpdate(link.id, { icon: dataUrl })}
          />
        </div>
      )}
    </div>
  );
}
