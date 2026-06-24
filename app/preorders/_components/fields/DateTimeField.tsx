import { FieldShell } from "./FieldShell";

export function DateTimeField({
  id,
  label,
  value,
  onChange,
  helperText,
  error,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <FieldShell label={label} helperText={helperText} error={error} required={required} htmlFor={id}>
      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
      />
    </FieldShell>
  );
}
