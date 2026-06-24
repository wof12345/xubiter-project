import { z } from "zod";

export const preorderWhenValues = ["out-of-stock", "regardless-of-stock"] as const;

export const preorderSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    products: z.coerce.number().int().min(1, "Must cover at least 1 product"),
    preorderWhen: z.enum(preorderWhenValues),
    startsAt: z.coerce.date({ message: "Start date is required" }),
    endsAt: z.preprocess(
      (value) => (value === "" || value === null || value === undefined ? null : value),
      z.coerce.date().nullable(),
    ),
    active: z.boolean(),
  })
  .refine(
    (data) => !data.endsAt || data.endsAt > data.startsAt,
    { message: "End date must be after the start date", path: ["endsAt"] },
  );

export type PreorderInput = z.infer<typeof preorderSchema>;

export const statusValues = ["all", "active", "inactive"] as const;
export const sortByValues = ["name", "createdAt", "startsAt", "endsAt"] as const;
export const orderValues = ["asc", "desc"] as const;

export const querySchema = z.object({
  status: z.enum(statusValues).catch("all"),
  sortBy: z.enum(sortByValues).catch("createdAt"),
  order: z.enum(orderValues).catch("desc"),
  page: z.coerce.number().int().min(1).catch(1),
});

export type Query = z.infer<typeof querySchema>;
