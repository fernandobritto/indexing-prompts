import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nspell from "nspell";
import type { EnglishIssue } from "@/src/lib/englishCheck/types";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const dictionaryEnUs = require("dictionary-en-us") as (
  cb: (err: Error | null, dict: { aff: Buffer; dic: Buffer }) => void
) => void;

/** Module-level singleton — avoids reloading the dictionary on every request. */
let cachedChecker: ReturnType<typeof nspell> | null = null;

function loadChecker(): Promise<ReturnType<typeof nspell>> {
  if (cachedChecker) return Promise.resolve(cachedChecker);

  return new Promise((resolve, reject) => {
    dictionaryEnUs((err, dict) => {
      if (err) return reject(err);
      cachedChecker = nspell(dict);
      resolve(cachedChecker);
    });
  });
}

const WORD_REGEX = /\b([a-zA-Z]{2,}(?:'[a-zA-Z]+)?)\b/g;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { text?: unknown };

    if (typeof body.text !== "string" || body.text.length > 50_000) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const spell = await loadChecker();
    const issues: EnglishIssue[] = [];

    // Reset lastIndex before using the global regex
    WORD_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = WORD_REGEX.exec(body.text)) !== null) {
      const word = match[1];

      // Skip likely proper nouns: starts with uppercase but lowercase form is correct
      if (/^[A-Z]/.test(word) && spell.correct(word.toLowerCase())) continue;

      if (!spell.correct(word)) {
        issues.push({
          offset: match.index,
          length: word.length,
          message: `"${word}" may be misspelled`,
          ruleId: "SPELL",
          replacements: spell.suggest(word).slice(0, 5),
          type: "spelling",
        });
      }
    }

    return NextResponse.json({ issues, checkedText: body.text });
  } catch (err) {
    console.error("[spellcheck route]", err);
    return NextResponse.json({ error: "Spell check failed" }, { status: 500 });
  }
}
