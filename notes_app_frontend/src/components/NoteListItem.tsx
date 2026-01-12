"use client";

import React from "react";
import type { Note } from "@/lib/types";

type NoteListItemProps = {
  note: Note;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatPreview(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "No content";
  return trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed;
}

export default function NoteListItem({
  note,
  isActive,
  onSelect,
  onDelete,
}: NoteListItemProps) {
  return (
    <div
      className={[
        "group flex items-stretch gap-2 rounded-xl border px-3 py-3 transition",
        isActive
          ? "border-emerald-300 bg-emerald-50"
          : "border-emerald-100 bg-white hover:bg-emerald-50/50",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onSelect(note.id)}
        className="focus-ring flex-1 text-left min-w-0"
        aria-selected={isActive}
      >
        <div className="flex items-center justify-between gap-2">
          <p
            className={[
              "font-medium truncate",
              isActive ? "text-emerald-950" : "text-emerald-900",
            ].join(" ")}
          >
            {note.title?.trim() ? note.title : "Untitled note"}
          </p>
          <span className="text-[11px] text-emerald-800/60 whitespace-nowrap">
            {new Date(note.updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="mt-1 text-xs text-emerald-900/70 truncate">
          {formatPreview(note.content)}
        </p>
      </button>

      <button
        type="button"
        onClick={() => onDelete(note.id)}
        className="focus-ring inline-flex w-9 items-center justify-center rounded-lg border border-transparent text-red-600 hover:border-red-200 hover:bg-red-50"
        aria-label={`Delete note: ${note.title?.trim() ? note.title : "Untitled note"}`}
        title="Delete"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
