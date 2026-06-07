"use client";

import { useState, useCallback } from "react";
import type { EnglishIssue } from "@/src/lib/englishCheck/types";
import { checkSpelling } from "@/src/lib/englishCheck/spellcheck";
import { checkGrammar } from "@/src/lib/englishCheck/grammarClient";

interface Props {
  text: string;
  onChange: (newText: string) => void;
  fieldLabel: string;
}

export default function EnglishReviewPanel({ text, onChange, fieldLabel }: Props) {
  const [issues, setIssues] = useState<EnglishIssue[]>([]);
  const [checkedText, setCheckedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isStale = checkedText !== null && checkedText !== text;

  const runCheck = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [spellResult, grammarResult] = await Promise.allSettled([
        checkSpelling(text),
        checkGrammar(text),
      ]);

      const combined: EnglishIssue[] = [];

      if (spellResult.status === "fulfilled") {
        combined.push(...spellResult.value.issues);
      } else {
        setError("Spell check unavailable.");
      }

      if (grammarResult.status === "fulfilled") {
        combined.push(...grammarResult.value.issues);
      } else {
        setError((prev) =>
          prev ? `${prev} Grammar check unavailable.` : "Grammar check unavailable."
        );
      }

      // Sort by offset so issues appear in document order
      combined.sort((a, b) => a.offset - b.offset);

      setIssues(combined);
      setCheckedText(text);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  const applyFix = useCallback(
    (issue: EnglishIssue, replacement: string) => {
      if (text !== checkedText) return;
      const fixed =
        text.slice(0, issue.offset) +
        replacement +
        text.slice(issue.offset + issue.length);
      onChange(fixed);
      // Clear issues — offsets are now invalid; user must re-check
      setIssues([]);
      setCheckedText(null);
    },
    [text, checkedText, onChange]
  );

  const applyAllSpellingFixes = useCallback(() => {
    if (text !== checkedText) return;
    const spellIssues = issues.filter(
      (i) => i.type === "spelling" && i.replacements.length > 0
    );
    if (spellIssues.length === 0) return;

    // Apply fixes from end to start to preserve offsets
    const sorted = [...spellIssues].sort((a, b) => b.offset - a.offset);
    let fixed = text;
    for (const issue of sorted) {
      fixed =
        fixed.slice(0, issue.offset) +
        issue.replacements[0] +
        fixed.slice(issue.offset + issue.length);
    }
    onChange(fixed);
    setIssues([]);
    setCheckedText(null);
  }, [text, checkedText, issues, onChange]);

  const spellingIssueCount = issues.filter((i) => i.type === "spelling").length;

  return (
    <div className="mt-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={runCheck}
          disabled={isLoading || !text.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          {isLoading ? (
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
          ) : (
            "🔍"
          )}
          {isLoading ? "Checking…" : "Check English"}
        </button>

        {issues.length > 0 && !isStale && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {isOpen ? "Hide" : "Show"} {issues.length} issue
            {issues.length !== 1 ? "s" : ""}
          </button>
        )}
      </div>

      {isStale && (
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          ⚠️ Text has changed since the last check. Run &quot;Check English&quot; again for
          up-to-date results.
        </p>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {isOpen && issues.length > 0 && !isStale && (
        <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              English issues in &quot;{fieldLabel}&quot;
            </span>
            {spellingIssueCount > 0 && (
              <button
                type="button"
                onClick={applyAllSpellingFixes}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Apply all spelling fixes ({spellingIssueCount})
              </button>
            )}
          </div>

          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {issues.map((issue, i) => (
              <li key={i} className="px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`mr-1.5 inline-block rounded px-1 py-0.5 text-[10px] font-bold uppercase ${
                        issue.type === "spelling"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      }`}
                    >
                      {issue.type}
                    </span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300">
                      {issue.message}
                    </span>
                  </div>
                </div>
                {issue.replacements.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {issue.replacements.map((r, j) => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => applyFix(issue, r)}
                        className="rounded border border-zinc-300 bg-white px-2 py-0.5 text-xs text-zinc-800 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && issues.length === 0 && checkedText !== null && !isStale && (
        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
          ✅ No issues found in &quot;{fieldLabel}&quot;.
        </p>
      )}
    </div>
  );
}
