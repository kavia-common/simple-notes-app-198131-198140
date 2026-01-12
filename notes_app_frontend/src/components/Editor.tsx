"use client";

import React from "react";
import type { Note } from "@/lib/types";

type EditorProps = {
  note: Note | null;
  onChangeTitle: (value: string) => void;
  onChangeContent: (value: string) => void;
};

export default function Editor({ note, onChangeTitle, onChangeContent }: EditorProps) {
  if (!note) {
    return (
      <section className="h-full flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-emerald-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-emerald-900">
            No note selected
          </h2>
          <p className="mt-2 text-sm text-emerald-900/70">
            Select a note from the sidebar, or create a new one to start writing.
          </p>
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
            <p className="text-xs text-emerald-900/70">
              Tip: Your notes are saved locally in this browser.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full flex flex-col">
      <div className="border-b border-emerald-100 bg-white/60 backdrop-blur px-6 py-4">
        <label htmlFor="note-title" className="sr-only">
          Note title
        </label>
        <input
          id="note-title"
          value={note.title}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="Untitled note"
          className="focus-ring w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-lg font-semibold text-default placeholder:text-emerald-900/40"
        />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <label htmlFor="note-content" className="block text-xs font-medium text-emerald-900 mb-2">
          Body (Markdown-friendly)
        </label>
        <textarea
          id="note-content"
          value={note.content}
          onChange={(e) => onChangeContent(e.target.value)}
          placeholder={"Write your note here...\n\n- Supports Markdown-style plain text\n- Everything is saved locally"}
          className="focus-ring w-full h-[calc(100vh-220px)] min-h-72 resize-none rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm leading-6 text-default placeholder:text-emerald-900/35"
        />
      </div>
    </section>
  );
}
