export function mergeMultiSelectValues(existing: unknown, incoming: unknown): string[] {
  const values = (value: unknown) => Array.isArray(value) ? value.map(String) : typeof value === 'string' ? value.split(',') : []
  return Array.from(new Set([...values(existing), ...values(incoming)].map((value) => value.trim()).filter(Boolean)))
}
