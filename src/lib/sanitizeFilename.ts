export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function buildExportFilename(templateId: string): string {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const safe = sanitizeFilename(templateId);
  return `prompt_${safe}_${date}.md`;
}
