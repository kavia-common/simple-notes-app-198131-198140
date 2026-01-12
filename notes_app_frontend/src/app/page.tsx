"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import type { Note } from "@/lib/types";
import { createDebouncedSaver, safeReadFromStorage } from "@/lib/storage";

const STORAGE_KEY = "forest_notes_v1";

function createId(): string {
  // Small, dependency-free id generator (good enough for local notes).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createNewNote(): Note {
  const now = Date.now();
  return {
    id: createId(),
    title: "",
    content: "",
    updatedAt: now,
  };
}

function sortByUpdatedAtDesc(a: Note, b: Note): number {
  return b.updatedAt - a.updatedAt;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Simple mobile detection + sidebar UI state
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const debouncedSaveRef = useRef<(value: Note[]) => void>(() => undefined);

  // Load notes on first client mount
  useEffect(() => {
    const loaded = safeReadFromStorage<Note[]>(STORAGE_KEY, []);
    const normalized = Array.isArray(loaded) ? loaded : [];
    const sorted = [...normalized].sort(sortByUpdatedAtDesc);
    setNotes(sorted);

    // If there are notes, select most recent by default.
    if (sorted.length > 0) {
      setSelectedNoteId(sorted[0].id);
    }

    debouncedSaveRef.current = createDebouncedSaver<Note[]>(STORAGE_KEY, 350);
  }, []);

  // Persist notes after changes (debounced)
  useEffect(() => {
    // Skip initial server render
    if (typeof window === "undefined") return;
    debouncedSaveRef.current(notes);
  }, [notes]);

  // Mobile breakpoint listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(max-width: 768px)");

    const update = () => {
      const mobile = mql.matches;
      setIsMobile(mobile);
      // On switching to desktop, ensure sidebar is visible (open state irrelevant).
      if (!mobile) setSidebarOpen(false);
    };

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;
    return notes.find((n) => n.id === selectedNoteId) ?? null;
  }, [notes, selectedNoteId]);

  const handleCreateNote = () => {
    const note = createNewNote();
    setNotes((prev) => [note, ...prev].sort(sortByUpdatedAtDesc));
    setSelectedNoteId(note.id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const updateNote = (id: string, patch: Partial<Pick<Note, "title" | "content">>) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx < 0) return prev;

      const now = Date.now();
      const updated: Note = {
        ...prev[idx],
        ...patch,
        updatedAt: now,
      };

      const next = [...prev];
      next[idx] = updated;
      next.sort(sortByUpdatedAtDesc);
      return next;
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id).sort(sortByUpdatedAtDesc);

      // If deleting current selection, select next most recent or clear selection.
      if (selectedNoteId === id) {
        setSelectedNoteId(next.length > 0 ? next[0].id : null);
      }

      return next;
    });
  };

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <main className="app-shell">
      <div className="min-h-screen flex">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={toggleSidebar}
            className="fixed inset-0 z-30 bg-black/30"
          />
        ) : null}

        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <section className="flex-1 min-w-0">
          {/* Top bar for mobile main pane */}
          <div className="md:hidden sticky top-0 z-20 border-b border-emerald-100 bg-white/70 backdrop-blur">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleSidebar}
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
                aria-label="Open sidebar"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ☰
                </span>
              </button>

              <div className="min-w-0 text-center">
                <p className="text-sm font-semibold text-emerald-900 truncate">
                  {selectedNote?.title?.trim()
                    ? selectedNote.title
                    : selectedNote
                      ? "Untitled note"
                      : "Forest Notes"}
                </p>
                <p className="text-[11px] text-emerald-900/60">
                  {selectedNote
                    ? `Edited ${new Date(selectedNote.updatedAt).toLocaleString()}`
                    : notes.length === 0
                      ? "No notes yet"
                      : "Select a note"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateNote}
                className="focus-ring inline-flex items-center justify-center rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                New
              </button>
            </div>
          </div>

          {/* Empty state when no notes exist */}
          {notes.length === 0 ? (
            <section className="h-[calc(100vh-56px)] md:h-screen flex items-center justify-center p-6">
              <div className="max-w-lg w-full rounded-2xl border border-emerald-100 bg-white p-6">
                <h2 className="text-xl font-semibold text-emerald-900">
                  Welcome to Forest Notes
                </h2>
                <p className="mt-2 text-sm text-emerald-900/70">
                  Create your first note to get started. Notes are saved locally in
                  your browser.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleCreateNote}
                    className="focus-ring rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    + New note
                  </button>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-2.5">
                    <p className="text-xs text-emerald-900/70">
                      Tip: Use the search box to filter by title.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <Editor
              note={selectedNote}
              onChangeTitle={(value) => {
                if (!selectedNoteId) return;
                updateNote(selectedNoteId, { title: value });
              }}
              onChangeContent={(value) => {
                if (!selectedNoteId) return;
                updateNote(selectedNoteId, { content: value });
              }}
            />
          )}
        </section>
      </div>
    </main>
  );
}
