import type { CheckResult } from "./types";

export async function checkGrammar(text: string): Promise<CheckResult> {
  const res = await fetch("/api/grammar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Grammar check request failed (${res.status})`);
  }

  return res.json() as Promise<CheckResult>;
}
