import { FieldShell } from "./FieldShell";

export function StatusField({
  label,
  value,
  onChange,
  helperText,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helperText?: string;
}) {
  return (
    <FieldShell label={label} helperText={helperText}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={value}
          aria-label="Toggle status"
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            value ? "bg-neutral-900" : "bg-neutral-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
              value ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className="text-sm text-neutral-600">{value ? "Active" : "Inactive"}</span>
      </div>
    </FieldShell>
  );
}
