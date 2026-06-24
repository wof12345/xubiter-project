"use client";

import { useEffect, useRef, useState } from "react";
import type { Query } from "@/lib/validation";

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Created At", value: "createdAt" },
  { label: "Starts At", value: "startsAt" },
  { label: "Ends At", value: "endsAt" },
] as const;

const orderOptions = [
  { label: "Ascending", value: "asc", arrow: "↑" },
  { label: "Descending", value: "desc", arrow: "↓" },
] as const;

export function SortPopover({
  query,
  onChange,
}: {
  query: Query;
  onChange: (updates: Record<string, string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Sort"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3v18M7 3l-3 3M7 3l3 3M17 21V3M17 21l-3-3M17 21l3-3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-medium text-neutral-500">Sort by</p>
          <div className="flex flex-col">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50"
              >
                <input
                  type="radio"
                  name="sortBy"
                  checked={query.sortBy === option.value}
                  onChange={() => onChange({ sortBy: option.value })}
                  className="accent-neutral-900"
                />
                {option.label}
              </label>
            ))}
          </div>

          <div className="my-2 border-t border-neutral-100" />

          <div className="flex flex-col gap-1">
            {orderOptions.map((option) => {
              const isActive = query.order === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ order: option.value })}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium transition ${
                    isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span>{option.arrow}</span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
