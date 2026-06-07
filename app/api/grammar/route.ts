import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LANGUAGETOOL_BASE_URL =
  process.env.LANGUAGETOOL_BASE_URL ?? "https://api.languagetool.org";

interface LTReplacement {
  value: string;
}

interface LTRule {
  id: string;
}

interface LTMatch {
  message: string;
  offset: number;
  length: number;
  rule: LTRule;
  replacements: LTReplacement[];
}

interface LTResponse {
  matches: LTMatch[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { text?: unknown };

    if (typeof body.text !== "string" || body.text.length > 20_000) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const params = new URLSearchParams({
      text: body.text,
      language: "en-US",
    });

    const ltResponse = await fetch(`${LANGUAGETOOL_BASE_URL}/v2/check`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!ltResponse.ok) {
      throw new Error(`LanguageTool responded with ${ltResponse.status}`);
    }

    const data = (await ltResponse.json()) as LTResponse;

    const issues = data.matches.map((m) => ({
      offset: m.offset,
      length: m.length,
      message: m.message,
      ruleId: m.rule.id,
      replacements: m.replacements.map((r) => r.value).slice(0, 5),
      type: "grammar" as const,
    }));

    return NextResponse.json({ issues, checkedText: body.text });
  } catch (err) {
    // Never log user text in production
    if (process.env.NODE_ENV !== "production") {
      console.error("[grammar route]", err);
    }
    return NextResponse.json(
      { error: "Grammar check unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
