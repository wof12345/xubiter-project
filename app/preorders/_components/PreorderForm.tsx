"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPreorder, updatePreorder } from "@/app/actions/preorders";
import { preorderWhenValues } from "@/lib/validation";
import { useToast } from "@/app/_components/Toast";
import { TextField } from "./fields/TextField";
import { NumberStepperField } from "./fields/NumberStepperField";
import { SelectField } from "./fields/SelectField";
import { DateTimeField } from "./fields/DateTimeField";
import { StatusField } from "./fields/StatusField";

export type PreorderFormValues = {
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

const preorderWhenOptions = preorderWhenValues.map((value) => ({ label: value, value }));

export function PreorderForm({
  mode,
  id,
  initial,
}: {
  mode: "create" | "edit";
  id?: string;
  initial: PreorderFormValues;
}) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<PreorderFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof PreorderFormValues>(key: K, value: PreorderFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("products", String(values.products));
    formData.set("preorderWhen", values.preorderWhen);
    formData.set("startsAt", values.startsAt);
    formData.set("endsAt", values.endsAt);
    formData.set("active", String(values.active));

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createPreorder(formData)
          : await updatePreorder(id!, formData);

      if (!result.ok) {
        setErrors(result.errors);
        toast(result.errors.form ?? "Please fix the errors below", "error");
        return;
      }

      toast(mode === "create" ? "Preorder created" : "Changes saved");
      router.push("/preorders");
    });
  }

  const saveLabel = mode === "create" ? "Create preorder" : "Save changes";

  return (
    <form onSubmit={handleSubmit}>
      <FormHeader saveLabel={saveLabel} isPending={isPending} />

      <div className="mx-auto max-w-4xl px-6 pb-10">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-8 py-6">
            <h2 className="text-base font-bold text-neutral-900">Preorder details</h2>
            <p className="mt-1 text-sm text-neutral-500">These values appear in the preorders list.</p>
          </div>

          <div className="px-8">
            <TextField
              id="name"
              label="Name"
              required
              value={values.name}
              onChange={(value) => set("name", value)}
              helperText="A label to recognize this preorder by."
              error={errors.name}
            />
            <NumberStepperField
              id="products"
              label="Products"
              value={values.products}
              onChange={(value) => set("products", Number.isNaN(value) ? 0 : value)}
              helperText="Number of products covered by this preorder."
              suffix="product(s)"
              error={errors.products}
            />
            <SelectField
              id="preorderWhen"
              label="Preorder when"
              value={values.preorderWhen}
              onChange={(value) => set("preorderWhen", value)}
              options={preorderWhenOptions}
              helperText="When customers are allowed to preorder."
              error={errors.preorderWhen}
            />
            <DateTimeField
              id="startsAt"
              label="Starts at"
              required
              value={values.startsAt}
              onChange={(value) => set("startsAt", value)}
              helperText="When the preorder window opens."
              error={errors.startsAt}
            />
            <DateTimeField
              id="endsAt"
              label="Ends at"
              value={values.endsAt}
              onChange={(value) => set("endsAt", value)}
              helperText="Leave empty for no end date."
              error={errors.endsAt}
            />
            <StatusField
              label="Status"
              value={values.active}
              onChange={(value) => set("active", value)}
              helperText="Active preorders are visible to customers."
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-8 py-5">
            <Link
              href="/preorders"
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Cancel
            </Link>
            <SaveButton label={saveLabel} isPending={isPending} />
          </div>
        </div>
      </div>
    </form>
  );
}

function FormHeader({ saveLabel, isPending }: { saveLabel: string; isPending: boolean }) {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
      <Link
        href="/preorders"
        className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/preorders"
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50"
        >
          Cancel
        </Link>
        <SaveButton label={saveLabel} isPending={isPending} />
      </div>
    </div>
  );
}

function SaveButton({ label, isPending }: { label: string; isPending: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-70"
    >
      {isPending && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
        </svg>
      )}
      {label}
    </button>
  );
}
