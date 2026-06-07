import type { TemplateDefinition } from "@/src/types/template";
import { BEHAVIORAL_RULES } from "@/src/lib/templateConstants";

export const criticalBugInvestigation: TemplateDefinition = {
  id: "critical-bug-investigation",
  name: "Engineer: Investigate a Critical Bug",
  shortDescription:
    "Generate a prompt to systematically investigate, reproduce, and resolve a critical bug with full diagnostic context.",
  filenameBase: "critical_bug_investigation",
  body: `# Critical Bug Investigation Request
${BEHAVIORAL_RULES}
## Bug Summary

**{{BUG_SUMMARY}}**

## Environment

{{ENVIRONMENT}}

## Priority / Severity

**{{PRIORITY}}**

## Affected Systems

{{AFFECTED_SYSTEMS}}

## Steps to Reproduce

{{REPRODUCTION_STEPS}}

## Expected Behavior

{{EXPECTED_BEHAVIOR}}

## Actual Behavior

{{ACTUAL_BEHAVIOR}}

## Error Logs / Stack Traces

\`\`\`
{{ERROR_LOGS}}
\`\`\`

## Additional Context

{{ADDITIONAL_CONTEXT}}
`,
  fields: [
    {
      key: "BUG_SUMMARY",
      label: "Bug Summary",
      helpText: "A concise one-line description of the bug.",
      required: true,
      inputType: "text",
      placeholder: "e.g., Payment service returns 500 on checkout for EU users",
    },
    {
      key: "ENVIRONMENT",
      label: "Environment",
      helpText:
        "Specify the environment where the bug occurs (e.g., production, staging, OS, browser, version).",
      required: true,
      inputType: "text",
      placeholder:
        "Production — Node.js 20.x, PostgreSQL 15, deployed on AWS ECS",
    },
    {
      key: "PRIORITY",
      label: "Priority / Severity",
      helpText: "How critical is this bug?",
      required: true,
      inputType: "select",
      options: [
        "P0 — Critical (system down / data loss)",
        "P1 — High (major feature broken)",
        "P2 — Medium (degraded experience)",
        "P3 — Low (minor issue)",
      ],
      defaultValue: "P1 — High (major feature broken)",
    },
    {
      key: "AFFECTED_SYSTEMS",
      label: "Affected Systems",
      helpText:
        "List the services, modules, or components that are affected or suspected.",
      required: true,
      inputType: "text",
      placeholder: "Payment Service, Order Service, EU region load balancer",
    },
    {
      key: "REPRODUCTION_STEPS",
      label: "Steps to Reproduce",
      helpText:
        "Provide a numbered list of exact steps to reproduce the issue.",
      required: true,
      inputType: "textarea",
      placeholder:
        "1. Navigate to /checkout.\n2. Select a product and add to cart.\n3. Enter a billing address with a country set to Germany.\n4. Click 'Confirm Payment'.\n5. Observe a 500 Internal Server Error.",
      enableEnglishCheck: true,
    },
    {
      key: "EXPECTED_BEHAVIOR",
      label: "Expected Behavior",
      helpText: "Describe what should happen under normal conditions.",
      required: true,
      inputType: "textarea",
      placeholder:
        "The payment should process successfully and redirect the user to the order confirmation page.",
      enableEnglishCheck: true,
    },
    {
      key: "ACTUAL_BEHAVIOR",
      label: "Actual Behavior",
      helpText: "Describe exactly what happens instead.",
      required: true,
      inputType: "textarea",
      placeholder:
        "The server responds with a 500 Internal Server Error. The user sees a generic error page, and no order is created.",
      enableEnglishCheck: true,
    },
    {
      key: "ERROR_LOGS",
      label: "Error Logs / Stack Traces",
      helpText: "Paste relevant error messages, stack traces, or log excerpts.",
      required: false,
      inputType: "textarea",
      placeholder: "TypeError: Cannot read properties of undefined...",
      enableEnglishCheck: false,
    },
    {
      key: "ADDITIONAL_CONTEXT",
      label: "Additional Context",
      helpText:
        "Any other relevant context: recent deployments, configuration changes, related tickets.",
      required: false,
      inputType: "textarea",
      placeholder:
        "This started after the VAT calculation service was updated on 2026-06-01...",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "Engineering",
    version: "1.0.0",
    lastUpdated: "2026-06-07",
  },
};
