import { Prisma } from "@prisma/client";
import { querySchema, type Query } from "./validation";

export const PAGE_SIZE = 8;

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseQuery(searchParams: RawSearchParams): Query {
  return querySchema.parse({
    status: first(searchParams.status),
    sortBy: first(searchParams.sortBy),
    order: first(searchParams.order),
    page: first(searchParams.page),
  });
}

export function buildWhere(query: Query): Prisma.PreorderWhereInput {
  if (query.status === "active") return { active: true };
  if (query.status === "inactive") return { active: false };
  return {};
}

export function buildOrderBy(query: Query): Prisma.PreorderOrderByWithRelationInput {
  return { [query.sortBy]: query.order };
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
