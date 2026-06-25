import Link from "next/link";
import type { Preorder } from "@prisma/client";
import { formatDateTime } from "@/lib/format";
import { RowCheckbox } from "./SelectionCheckbox";
import { StatusToggle } from "./StatusToggle";
import { DeleteButton } from "./DeleteButton";

export function PreorderRow({ preorder }: { preorder: Preorder }) {
  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60">
      <td className="px-4 pr-2 py-3">
        <RowCheckbox id={preorder.id} />
      </td>
      <td className="px-4 pl-2 py-3 font-semibold text-neutral-900">{preorder.name}</td>
      <td className="px-4 py-3 text-neutral-700">{preorder.products}</td>
      <td className="px-4 py-3 text-neutral-700">{preorder.preorderWhen}</td>
      <td className="px-4 py-3 text-neutral-700">{formatDateTime(preorder.startsAt)}</td>
      <td className="px-4 py-3 text-neutral-700">{formatDateTime(preorder.endsAt)}</td>
      <td className="px-4 py-3">
        <StatusToggle id={preorder.id} active={preorder.active} name={preorder.name} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/preorders/${preorder.id}/edit`}
            aria-label={`Edit ${preorder.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </Link>
          <DeleteButton id={preorder.id} name={preorder.name} />
        </div>
      </td>
    </tr>
  );
}
