import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseQuery, buildWhere, buildOrderBy, PAGE_SIZE, type RawSearchParams } from "@/lib/query";
import { Toolbar } from "./_components/Toolbar";
import { PreorderTable } from "./_components/PreorderTable";
import { Pagination } from "./_components/Pagination";

export default async function PreordersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = parseQuery(await searchParams);
  const where = buildWhere(query);

  const total = await prisma.preorder.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);

  const preorders = await prisma.preorder.findMany({
    where,
    orderBy: buildOrderBy(query),
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = (page - 1) * PAGE_SIZE + preorders.length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Preorders</h1>
        <Link
          href="/preorders/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        >
          Create Preorder
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <Toolbar query={query} />
        <PreorderTable preorders={preorders} />
        <Pagination from={from} to={to} total={total} page={page} pageCount={pageCount} />
      </div>
    </main>
  );
}
