# Prompt Template Builder

A maintainable, configuration-driven web application for building and exporting structured engineering prompts as Markdown files. Built with **Next.js 16 (App Router) + TypeScript**, featuring dark mode and US English spell and grammar checking.

---

## Features

| Feature | Details |
|---|---|
| **Template Selection** | Screen 1 lists all templates as clickable cards. |
| **Dynamic Form** | Screen 2 renders a form driven entirely by the template's field configuration. |
| **Preview Modal** | Assembles the full prompt with placeholders replaced; dismissible without losing form state. |
| **Export .md** | Exports the final prompt as a safe-named Markdown file. |
| **Dark Mode** | System-preference-aware toggle with localStorage persistence; no flash on load. |
| **US English Spell Check** | Uses `nspell` + `dictionary-en-us` via a server API route; hard-set to en-US. |
| **US English Grammar Check** | Uses LanguageTool via a server API route; hard-set to en-US. |
| **Apply Suggestions** | Per-issue "Apply" buttons and bulk "Apply all spelling fixes" action. |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Spell Checking:** [`nspell`](https://github.com/wooorm/nspell) + [`dictionary-en-us`](https://github.com/wooorm/dictionaries)
- **Grammar Checking:** [LanguageTool](https://languagetool.org/) (public API or self-hosted)

---

## Getting Started

### Prerequisites

- **Node.js** LTS (v20 or later recommended)
- **npm** v10+

### Install

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build and Start

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

| Variable | Default | Description |
|---|---|---|
| `LANGUAGETOOL_BASE_URL` | `https://api.languagetool.org` | Base URL for the LanguageTool server. Change this to point to a self-hosted instance. |

> **Note:** The grammar check endpoint is isolated in `app/api/grammar/route.ts`. Swapping from the public API to a self-hosted server requires only changing `LANGUAGETOOL_BASE_URL`.

---

## How Templates Work

Templates live in `src/templates/`. Each template is a TypeScript file that exports a `TemplateDefinition` object.

### Template Definition Structure

```typescript
{
  id: string;               // URL-safe, used in routing and filenames
  name: string;             // Display name
  shortDescription: string; // Shown on the template selection screen
  filenameBase: string;     // Base name for the exported .md file
  body: string;             // Prompt text with {{PLACEHOLDER}} tokens
  fields: TemplateField[];  // Drives the dynamic form
  metadata: {
    category: string;
    version: string;
    lastUpdated: string;    // ISO date string
  };
}
```

### TemplateField Structure

```typescript
{
  key: string;              // Must match a {{PLACEHOLDER}} in body
  label: string;            // Form label
  helpText: string;         // Shown below the label
  required: boolean;
  inputType: "text" | "textarea" | "select";
  placeholder?: string;
  defaultValue?: string;
  options?: string[];       // Required for inputType: "select"
  enableEnglishCheck?: boolean; // Defaults to true for textarea fields
}
```

### Placeholder Rules

- Placeholders use the format `{{KEY}}` where `KEY` is `UPPER_SNAKE_CASE`.
- Every `field.key` must have a matching `{{FIELD_KEY}}` in the template `body`.
- `renderTemplate()` replaces all occurrences of `{{KEY}}` with the form value.
- Missing required fields block export; they render as empty strings in preview.

---

## How to Add a New Template

Adding a new template requires **two steps only** — no UI code changes needed.

### Step 1: Create the template file

```typescript
// src/templates/my_new_template.ts
import type { TemplateDefinition } from "@/src/types/template";

export const myNewTemplate: TemplateDefinition = {
  id: "my-new-template",          // URL-safe, unique
  name: "My Category: Template Name",
  shortDescription: "A short description shown on the home screen.",
  filenameBase: "my_new_template",
  body: `# My Template\n\n## Context\n{{CONTEXT}}\n\n## Details\n{{DETAILS}}\n`,
  fields: [
    {
      key: "CONTEXT",
      label: "Context",
      helpText: "Describe the background for this prompt.",
      required: true,
      inputType: "textarea",
      enableEnglishCheck: true,
    },
    {
      key: "DETAILS",
      label: "Details",
      helpText: "Add the specific details.",
      required: true,
      inputType: "textarea",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "My Category",
    version: "1.0.0",
    lastUpdated: "2026-01-01",
  },
};
```

### Step 2: Export from the registry

In `src/templates/index.ts`, add your import and include it in the `templates` array:

```typescript
import { myNewTemplate } from "./my_new_template";

export const templates: TemplateDefinition[] = [
  // ...existing templates...
  myNewTemplate,
];
```

That's it. The home screen and routing update automatically.

---

## Code Organization

```
app/
  layout.tsx                      # Root layout: global header, theme init script
  page.tsx                        # Screen 1: Template selection grid
  build/[templateId]/
    page.tsx                      # Screen 2: resolves template, renders DynamicForm
  api/
    grammar/route.ts              # POST /api/grammar — LanguageTool proxy (en-US)
    spellcheck/route.ts           # POST /api/spellcheck — nspell (en-US)

src/
  types/
    template.ts                   # TemplateDefinition, TemplateField interfaces
  templates/
    index.ts                      # Template registry: array + getTemplateById()
    backend_api_request.ts
    feature_creation.ts
    critical_bug_investigation.ts
    refactor_optimize.ts
    debugging_error_resolution.ts
  lib/
    renderTemplate.ts             # extractPlaceholders, validateValues, renderTemplate
    sanitizeFilename.ts           # buildExportFilename, sanitizeFilename
    englishCheck/
      types.ts                    # EnglishIssue, CheckResult interfaces
      spellcheck.ts               # Client: calls /api/spellcheck
      grammarClient.ts            # Client: calls /api/grammar
  components/
    DynamicForm.tsx               # Template-driven form; orchestrates form + modal
    FieldRenderer.tsx             # Renders a single field (text/textarea/select)
    EnglishReviewPanel.tsx        # Check English button + issues list + apply actions
    PreviewModal.tsx              # Accessible <dialog> preview with export
    TemplateCardButton.tsx        # Template card on Screen 1
    ThemeToggle.tsx               # Dark/light mode toggle button
  hooks/
    useTemplateForm.ts            # Form values, touched state, validation
    useTheme.ts                   # Theme state with localStorage persistence
```

---

## Quality Practices

- **Type safety:** Strict TypeScript throughout; no `any` in core logic.
- **Linting:** `npm run lint` (ESLint via `eslint-config-next`).
- **Type checking:** `npx tsc --noEmit`.
- **Determinism:** Template rendering is pure and idempotent (`renderTemplate`).
- **Security:** Filenames are sanitized; user input is never executed; user text is never logged in production grammar routes.

---

## Known Limitations / Next Steps

- **Form state is in-memory.** Navigating away loses the form. Future: persist to `sessionStorage`.
- **Grammar check requires internet** (public LanguageTool). Set `LANGUAGETOOL_BASE_URL` for self-hosted offline use.
- **Spell checker warm-up:** The first spell check request on a cold server loads the dictionary (~1 s). Subsequent requests use the cached module-level checker.
- **No unit tests yet.** The core logic (`renderTemplate`, `validateValues`, `sanitizeFilename`) is pure and straightforward to test.
