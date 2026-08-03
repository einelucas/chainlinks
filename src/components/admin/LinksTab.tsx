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
import {
  ChevronIcon,
  GripIcon,
  LinksIcon,
  PlusIcon,
  TrashIcon,
} from "./AdminIcons";
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

  const canAdd = Boolean(newLabel.trim() && newUrl.trim());

  return (
    <div className="editor-stack">
      <section className="editor-card editor-add-card">
        <div className="editor-card-heading">
          <span className="editor-card-icon"><LinksIcon /></span>
          <div>
            <h2>Adicionar novo link</h2>
            <p>Inclua um título, o destino e, se quiser, um ícone personalizado.</p>
          </div>
        </div>

        <div className="editor-field-grid editor-field-grid-2">
          <label className="editor-field">
            <span>Título do link</span>
            <input
              type="text"
              placeholder="Ex: Meu Instagram"
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}
            />
          </label>
          <label className="editor-field">
            <span>URL de destino</span>
            <input
              type="url"
              placeholder="https://..."
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
            />
          </label>
        </div>

        <ImageUploadField
          label="Ícone do link"
          helper="Opcional · PNG, JPG, WEBP ou SVG"
          value={newIcon}
          maxSizeMb={1}
          onChange={setNewIcon}
          compact
        />

        <div className="editor-card-actions">
          <button
            type="button"
            onClick={handleAdd}
            className="admin-primary-button"
            disabled={!canAdd}
          >
            <PlusIcon />
            Adicionar link
          </button>
        </div>
      </section>

      <section className="editor-list-section">
        <div className="editor-list-heading">
          <div>
            <h2>Links publicados</h2>
            <p>Arraste para reorganizar a ordem exibida na sua página.</p>
          </div>
          <span>{sorted.length} {sorted.length === 1 ? "link" : "links"}</span>
        </div>

        {sorted.length === 0 ? (
          <div className="editor-empty-state">
            <span><LinksIcon /></span>
            <strong>Sua lista ainda está vazia</strong>
            <p>Adicione o primeiro destino para começar a montar sua página.</p>
          </div>
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
              <div className="editor-items-list">
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
      </section>
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
    opacity: isDragging ? 0.55 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`editor-item-card ${expanded ? "is-expanded" : ""} ${
        isDragging ? "is-dragging" : ""
      }`}
    >
      <div className="editor-item-summary">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="editor-drag-handle"
          aria-label={`Arrastar ${link.label} para reordenar`}
        >
          <GripIcon />
        </button>

        <span className="editor-item-icon">
          {link.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={link.icon} alt="" />
          ) : (
            <ChainIcon width={19} height={19} />
          )}
        </span>

        <button
          type="button"
          onClick={onToggleExpand}
          className="editor-item-copy"
          aria-expanded={expanded}
        >
          <strong>{link.label}</strong>
          <span>{link.url}</span>
        </button>

        <label className="editor-switch" title={link.isActive ? "Link ativo" : "Link inativo"}>
          <input
            type="checkbox"
            checked={link.isActive}
            onChange={(event) => onUpdate(link.id, { isActive: event.target.checked })}
          />
          <span aria-hidden="true" />
          <small>{link.isActive ? "Ativo" : "Inativo"}</small>
        </label>

        <button
          type="button"
          onClick={onToggleExpand}
          className={`editor-row-action editor-expand-button ${expanded ? "is-open" : ""}`}
          aria-label={expanded ? "Recolher edição" : "Editar link"}
        >
          <ChevronIcon />
        </button>

        <button
          type="button"
          onClick={() => onDelete(link.id)}
          className="editor-row-action editor-delete-button"
          aria-label={`Excluir ${link.label}`}
          title="Excluir link"
        >
          <TrashIcon />
        </button>
      </div>

      {expanded && (
        <div className="editor-item-details">
          <div className="editor-field-grid editor-field-grid-2">
            <label className="editor-field">
              <span>Título</span>
              <input
                type="text"
                value={link.label}
                onChange={(event) => onUpdate(link.id, { label: event.target.value })}
              />
            </label>
            <label className="editor-field">
              <span>URL de destino</span>
              <input
                type="url"
                value={link.url}
                onChange={(event) => onUpdate(link.id, { url: event.target.value })}
              />
            </label>
          </div>

          <ImageUploadField
            label="Ícone do link"
            helper="Opcional · substitui o ícone padrão"
            value={link.icon}
            maxSizeMb={1}
            onChange={(dataUrl) => onUpdate(link.id, { icon: dataUrl })}
            compact
          />

          <div className="editor-mobile-delete">
            <button
              type="button"
              onClick={() => onDelete(link.id)}
              className="editor-danger-button"
            >
              <TrashIcon />
              Excluir link
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
