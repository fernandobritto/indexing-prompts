export interface EnglishIssue {
  offset: number;
  length: number;
  message: string;
  ruleId: string;
  replacements: string[];
  type: "spelling" | "grammar";
}

export interface CheckResult {
  issues: EnglishIssue[];
  /** The exact text that was checked — used to detect staleness. */
  checkedText: string;
}
