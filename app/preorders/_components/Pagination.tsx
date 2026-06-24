"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Pagination({
  from,
  to,
  total,
  page,
  pageCount,
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  pageCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  const atStart = page <= 1;
  const atEnd = page >= pageCount;

  return (
    <div className="flex items-center justify-center gap-4 border-t border-neutral-200 px-4 py-3">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={atStart}
        aria-label="Previous page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <span className="text-sm font-medium text-neutral-700">
        Showing {from} to {to} from {total}
      </span>

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={atEnd}
        aria-label="Next page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
