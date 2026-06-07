import type { TemplateDefinition } from "@/src/types/template";
import { BEHAVIORAL_RULES } from "@/src/lib/templateConstants";

export const refactorOptimize: TemplateDefinition = {
  id: "refactor-optimize",
  name: "Engineer: Refactor and Optimize Code",
  shortDescription:
    "Generate a prompt to refactor existing code for improved readability, maintainability, or performance.",
  filenameBase: "refactor_optimize",
  body: `{{PERSONA}}
${BEHAVIORAL_RULES}
## Context

{{CONTEXT}}

## Code to Refactor

\`\`\`
{{CODE_TO_REFACTOR}}
\`\`\`

## Current Issues

{{CURRENT_ISSUES}}

## Optimization Goals

{{OPTIMIZATION_GOALS}}

## Constraints

{{CONSTRAINTS}}

## Success Criteria

{{SUCCESS_CRITERIA}}

## Additional Notes

{{ADDITIONAL_NOTES}}
`,
  fields: [
    {
      key: "PERSONA",
      label: "Engineer Persona",
      helpText:
        "Describe the background, expertise, and context of the engineer who will perform the refactoring.",
      required: false,
      inputType: "textarea",
      placeholder:
        "The engineer is a senior backend developer with 5 years of experience in Node.js and Express. They are familiar with RESTful API design and have worked on the Orders service before.",
      enableEnglishCheck: true,
    },
    {
      key: "CONTEXT",
      label: "Context",
      helpText:
        "Describe the module, service, or component being refactored. Include language, framework, and purpose.",
      required: true,
      inputType: "textarea",
      placeholder:
        "This is the data transformation layer in the reporting service, written in TypeScript. It runs on every API request...",
      enableEnglishCheck: true,
    },
    {
      key: "CODE_TO_REFACTOR",
      label: "Code to Refactor",
      helpText:
        "Paste the code that needs refactoring. Keep to the relevant section.",
      required: true,
      inputType: "textarea",
      placeholder: "// Paste the code here",
      enableEnglishCheck: false,
    },
    {
      key: "CURRENT_ISSUES",
      label: "Current Issues",
      helpText:
        "Describe the specific problems: poor readability, duplication, performance bottlenecks, etc.",
      required: true,
      inputType: "textarea",
      placeholder:
        "- The nested loops are O(n²) and slow down significantly on large datasets.\n- There is significant code duplication across three similar transform functions.\n- Variable names are single-letter and non-descriptive.",
      enableEnglishCheck: true,
    },
    {
      key: "OPTIMIZATION_GOALS",
      label: "Optimization Goals",
      helpText:
        "What should the refactored code achieve? Be specific (e.g., reduce complexity, improve testability).",
      required: true,
      inputType: "textarea",
      placeholder:
        "- Reduce time complexity to O(n log n) or better.\n- Eliminate duplicated logic into a shared utility.\n- Improve naming and add inline comments for clarity.",
      enableEnglishCheck: true,
    },
    {
      key: "CONSTRAINTS",
      label: "Constraints",
      helpText:
        "List what must NOT change: public API contracts, behavior, dependencies, etc.",
      required: false,
      inputType: "textarea",
      placeholder:
        "The function signature must remain unchanged. Do not introduce new runtime dependencies.",
      enableEnglishCheck: true,
    },
    {
      key: "SUCCESS_CRITERIA",
      label: "Success Criteria",
      helpText:
        "How will you know the refactor is done correctly? (tests passing, benchmarks, code review, etc.)",
      required: false,
      inputType: "textarea",
      placeholder:
        "All existing unit tests pass. Benchmark shows at least 50% reduction in execution time on a 10,000-item dataset.",
      enableEnglishCheck: true,
    },
    {
      key: "ADDITIONAL_NOTES",
      label: "Additional Notes",
      helpText: "Any other context, related PRs, or architectural guidance.",
      required: false,
      inputType: "textarea",
      placeholder:
        "See ADR-045 for the preferred functional style in this repo.",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "Engineering",
    version: "1.0.0",
    lastUpdated: "2026-06-07",
  },
};
