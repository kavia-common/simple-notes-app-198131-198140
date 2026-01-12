"use client";

import React, { useMemo } from "react";
import type { Note } from "@/lib/types";
import Header from "@/components/Header";
import NoteListItem from "@/components/NoteListItem";

type SidebarProps = {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;

  isMobile: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function Sidebar({
  notes,
  selectedNoteId,
  searchQuery,
  onSearchQueryChange,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  isMobile,
  sidebarOpen,
  onToggleSidebar,
}: SidebarProps) {
  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => (n.title || "").toLowerCase().includes(q));
  }, [notes, searchQuery]);

  return (
    <aside
      className={[
        "surface h-full border-r border-emerald-100",
        "flex flex-col",
        isMobile
          ? [
              "fixed inset-y-0 left-0 z-40 w-[85vw] max-w-sm shadow-xl transition-transform",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")
          : "w-80",
      ].join(" ")}
      aria-label="Notes sidebar"
    >
      <Header
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
      />

      <div className="p-4 space-y-3">
        <div>
          <label
            htmlFor="note-search"
            className="block text-xs font-medium text-emerald-900 mb-1"
          >
            Search
          </label>
          <input
            id="note-search"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Filter by title…"
            className="focus-ring w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-default placeholder:text-emerald-900/40"
          />
        </div>

        <button
          type="button"
          onClick={onCreateNote}
          className="focus-ring w-full rounded-xl bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 active:bg-emerald-900"
        >
          + New note
        </button>
      </div>

      <div className="px-4 pb-4 flex-1 overflow-auto">
        {filteredNotes.length === 0 ? (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <p className="text-sm text-emerald-900 font-medium">
              No matching notes
            </p>
            <p className="mt-1 text-xs text-emerald-900/60">
              Try a different search, or create a new note.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isActive={note.id === selectedNoteId}
                onSelect={(id) => {
                  onSelectNote(id);
                  if (isMobile) onToggleSidebar();
                }}
                onDelete={onDeleteNote}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
