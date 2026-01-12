"use client";

import React from "react";

type HeaderProps = {
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  sidebarOpen?: boolean;
};

export default function Header({
  onToggleSidebar,
  isMobile,
  sidebarOpen,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 py-4 border-b border-emerald-100">
      <div className="flex items-center gap-2 min-w-0">
        {isMobile ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ☰
            </span>
          </button>
        ) : null}

        <div className="min-w-0">
          <h1 className="text-base font-semibold text-emerald-900 truncate">
            Forest Notes
          </h1>
          <p className="text-xs text-emerald-800/70 truncate">
            Local-first, fast notes
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-900 border border-emerald-100">
          Offline
        </span>
      </div>
    </header>
  );
}
