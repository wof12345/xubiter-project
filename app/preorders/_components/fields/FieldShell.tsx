export function FieldShell({
  label,
  helperText,
  error,
  required,
  htmlFor,
  children,
}: {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-neutral-100 py-6 last:border-0 md:grid-cols-[260px_1fr] md:gap-8">
      <div>
        <label htmlFor={htmlFor} className="text-sm font-semibold text-neutral-900">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        {helperText && <p className="mt-1 text-sm text-neutral-500">{helperText}</p>}
      </div>
      <div>
        {children}
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
