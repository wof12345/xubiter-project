const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatDateTime(value: Date | null | undefined): string {
  if (!value) return "—";
  return dateFormatter.format(value);
}

export function toDateTimeLocalValue(value: Date | null | undefined): string {
  if (!value) return "";
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}
