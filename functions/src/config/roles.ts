import { env } from "./env";

export type UserRole = "viewer" | "editor";

export function getRole(email?: string | null): UserRole {
  if (!email) return "viewer";
  return env.editorEmails.includes(email) ? "editor" : "viewer";
}

export function isEditor(email?: string | null): boolean {
  return getRole(email) === "editor";
}
