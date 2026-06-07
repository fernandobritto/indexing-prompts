import type { TemplateDefinition } from "@/src/types/template";
import { BEHAVIORAL_RULES } from "@/src/lib/templateConstants";

export const debuggingErrorResolution: TemplateDefinition = {
  id: "debugging-error-resolution",
  name: "Engineer: Debug and Resolve Errors",
  shortDescription:
    "Generate a prompt to diagnose and fix runtime errors, exceptions, or unexpected application behavior.",
  filenameBase: "debugging_error_resolution",
  body: `# Debugging and Error Resolution Request
${BEHAVIORAL_RULES}
## Error Description

**{{ERROR_DESCRIPTION}}**

## Error Message / Exception

\`\`\`
{{ERROR_MESSAGE}}
\`\`\`

## Environment

{{ENVIRONMENT}}

## Code Context

\`\`\`
{{CODE_CONTEXT}}
\`\`\`

## Steps to Reproduce

{{REPRODUCTION_STEPS}}

## Attempted Fixes

{{ATTEMPTED_FIXES}}

## Additional Context

{{ADDITIONAL_CONTEXT}}
`,
  fields: [
    {
      key: "ERROR_DESCRIPTION",
      label: "Error Description",
      helpText: "A concise summary of the error or unexpected behavior.",
      required: true,
      inputType: "text",
      placeholder:
        "e.g., TypeError thrown when submitting form with empty optional fields",
    },
    {
      key: "ERROR_MESSAGE",
      label: "Error Message / Exception",
      helpText:
        "Paste the full error message, exception type, and stack trace if available.",
      required: true,
      inputType: "textarea",
      placeholder:
        "TypeError: Cannot read properties of undefined (reading 'id')\n    at processForm (form.ts:42)\n    ...",
      enableEnglishCheck: false,
    },
    {
      key: "ENVIRONMENT",
      label: "Environment",
      helpText:
        "Specify the runtime environment: language version, framework, OS, browser, etc.",
      required: true,
      inputType: "text",
      placeholder: "Node.js 20.x, Next.js 16, macOS 14 / Chrome 125",
    },
    {
      key: "CODE_CONTEXT",
      label: "Code Context",
      helpText:
        "Paste the relevant code that triggers the error. Limit to the necessary section.",
      required: true,
      inputType: "textarea",
      placeholder:
        "function processForm(data: FormData) {\n  const id = data.user.id; // crashes here\n  ...\n}",
      enableEnglishCheck: false,
    },
    {
      key: "REPRODUCTION_STEPS",
      label: "Steps to Reproduce",
      helpText: "Numbered steps to reliably trigger the error.",
      required: true,
      inputType: "textarea",
      placeholder:
        "1. Open the user profile page.\n2. Click 'Edit Profile'.\n3. Clear the 'Username' field.\n4. Click 'Save'.\n5. Observe the TypeError in the console.",
      enableEnglishCheck: true,
    },
    {
      key: "ATTEMPTED_FIXES",
      label: "Attempted Fixes",
      helpText:
        "Describe what you have already tried to fix this, and what happened.",
      required: false,
      inputType: "textarea",
      placeholder:
        "- Added a null check before accessing `data.user` — the error persisted.\n- Checked that the API response always includes `user` — it does not for unauthenticated requests.",
      enableEnglishCheck: true,
    },
    {
      key: "ADDITIONAL_CONTEXT",
      label: "Additional Context",
      helpText:
        "Any other relevant information: recent changes, related issues, or hypotheses.",
      required: false,
      inputType: "textarea",
      placeholder:
        "This error started appearing after merging PR #312 which refactored the auth middleware.",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "Engineering",
    version: "1.0.0",
    lastUpdated: "2026-06-07",
  },
};
