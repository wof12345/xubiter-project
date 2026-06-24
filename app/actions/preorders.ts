"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { preorderSchema } from "@/lib/validation";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; errors: Record<string, string> };

function toFieldErrors(error: unknown): Record<string, string> {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues: { path: (string | number)[]; message: string }[] }).issues;
    const errors: Record<string, string> = {};
    for (const issue of issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return errors;
  }
  return { form: "Something went wrong. Please try again." };
}

function parse(formData: FormData) {
  return preorderSchema.parse({
    name: formData.get("name"),
    products: formData.get("products"),
    preorderWhen: formData.get("preorderWhen"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
}

export async function createPreorder(formData: FormData): Promise<ActionResult> {
  let data;
  try {
    data = parse(formData);
  } catch (error) {
    return { ok: false, errors: toFieldErrors(error) };
  }

  const created = await prisma.preorder.create({ data });
  revalidatePath("/preorders");
  return { ok: true, id: created.id };
}

export async function updatePreorder(id: string, formData: FormData): Promise<ActionResult> {
  let data;
  try {
    data = parse(formData);
  } catch (error) {
    return { ok: false, errors: toFieldErrors(error) };
  }

  const existing = await prisma.preorder.findUnique({ where: { id } });
  if (!existing) return { ok: false, errors: { form: "Preorder not found." } };

  await prisma.preorder.update({ where: { id }, data });
  revalidatePath("/preorders");
  return { ok: true, id };
}

export async function toggleStatus(id: string, active: boolean): Promise<void> {
  await prisma.preorder.update({ where: { id }, data: { active } });
  revalidatePath("/preorders");
}

export async function deletePreorder(id: string): Promise<void> {
  await prisma.preorder.delete({ where: { id } });
  revalidatePath("/preorders");
}
