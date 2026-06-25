"use client";

import { useEffect, useRef } from "react";
import { useSelection } from "./SelectionProvider";

export function SelectAllCheckbox() {
  const { allSelected, someSelected, toggleAll } = useSelection();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = someSelected;
  }, [someSelected]);

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label="Select all"
      checked={allSelected}
      onChange={toggleAll}
      className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-neutral-900"
    />
  );
}

export function RowCheckbox({ id }: { id: string }) {
  const { isSelected, toggle } = useSelection();
  return (
    <input
      type="checkbox"
      aria-label="Select row"
      checked={isSelected(id)}
      onChange={() => toggle(id)}
      className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-neutral-900 mt-1"
    />
  );
}
