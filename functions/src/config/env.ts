function splitCsv(v?: string): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const env = {
  allowedOrigins: process.env.ALLOWED_ORIGINS ?? "*",
  editorEmails: splitCsv(process.env.EDITOR_EMAILS),
};
