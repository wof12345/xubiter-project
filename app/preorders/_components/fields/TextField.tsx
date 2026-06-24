import { FieldShell } from "./FieldShell";

export function TextField({
  id,
  label,
  value,
  onChange,
  helperText,
  error,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <FieldShell label={label} helperText={helperText} error={error} required={required} htmlFor={id}>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
      />
    </FieldShell>
  );
}
