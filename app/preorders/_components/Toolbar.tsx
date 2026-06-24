"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Query } from "@/lib/validation";
import { SortPopover } from "./SortPopover";

const tabs = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

export function Toolbar({ query }: { query: Query }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) params.set(key, value);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
      <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-1">
        {tabs.map((tab) => {
          const isActive = query.status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setParams({ status: tab.value })}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <SortPopover query={query} onChange={setParams} />
    </div>
  );
}
