import { FieldShell } from "./FieldShell";

export function NumberStepperField({
  id,
  label,
  value,
  onChange,
  helperText,
  error,
  suffix,
  min = 1,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  error?: string;
  suffix?: string;
  min?: number;
}) {
  return (
    <FieldShell label={label} helperText={helperText} error={error} htmlFor={id}>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="number"
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.valueAsNumber)}
          className="w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
        />
        {suffix && <span className="text-sm text-neutral-500">{suffix}</span>}
      </div>
    </FieldShell>
  );
}
