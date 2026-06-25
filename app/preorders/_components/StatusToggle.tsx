"use client";

import { useState, useTransition } from "react";
import { toggleStatus } from "@/app/actions/preorders";
import { useToast } from "@/app/_components/Toast";

export function StatusToggle({
  id,
  active,
  name,
}: {
  id: string;
  active: boolean;
  name: string;
}) {
  const [optimistic, setOptimistic] = useState(active);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  function handleToggle() {
    const next = !optimistic;
    setOptimistic(next);
    startTransition(async () => {
      try {
        await toggleStatus(id, next);
        toast(`${name} ${next ? "activated" : "deactivated"}`);
      } catch {
        setOptimistic(!next);
        toast("Could not update status", "error");
      }
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={`Toggle status for ${name}`}
      disabled={isPending}
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-lg transition disabled:opacity-60 ${
        optimistic ? "bg-neutral-900" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-md bg-white shadow transition ${
          optimistic ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
