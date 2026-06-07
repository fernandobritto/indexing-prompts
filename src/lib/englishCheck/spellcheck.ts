import type { CheckResult } from "./types";

export async function checkSpelling(text: string): Promise<CheckResult> {
  const res = await fetch("/api/spellcheck", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Spell check request failed (${res.status})`);
  }

  return res.json() as Promise<CheckResult>;
}
