"use client";

import { createContext, useContext, useMemo, useState } from "react";

type SelectionContextValue = {
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  toggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({
  ids,
  children,
}: {
  ids: string[];
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const value = useMemo<SelectionContextValue>(() => {
    const selectedVisible = ids.filter((id) => selected.has(id));
    return {
      isSelected: (id) => selected.has(id),
      toggle: (id) =>
        setSelected((current) => {
          const next = new Set(current);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      toggleAll: () =>
        setSelected((current) => {
          const everySelected = ids.length > 0 && ids.every((id) => current.has(id));
          return everySelected ? new Set() : new Set(ids);
        }),
      allSelected: ids.length > 0 && selectedVisible.length === ids.length,
      someSelected: selectedVisible.length > 0 && selectedVisible.length < ids.length,
    };
  }, [ids, selected]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("useSelection must be used within SelectionProvider");
  return context;
}
