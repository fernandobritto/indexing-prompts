import type { TemplateField } from "@/src/types/template";

export function extractPlaceholders(body: string): Set<string> {
  const regex = /\{\{([A-Z_]+)\}\}/g;
  const keys = new Set<string>();
  let match;
  while ((match = regex.exec(body)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

export interface ValidationResult {
  isValid: boolean;
  errorsByField: Record<string, string>;
  missingLabels: string[];
}

export function validateValues(
  fields: TemplateField[],
  values: Record<string, string>,
): ValidationResult {
  const errorsByField: Record<string, string> = {};
  const missingLabels: string[] = [];

  for (const field of fields) {
    if (field.required && !values[field.key]?.trim()) {
      errorsByField[field.key] = `${field.label} is required.`;
      missingLabels.push(field.label);
    }
  }

  return {
    isValid: Object.keys(errorsByField).length === 0,
    errorsByField,
    missingLabels,
  };
}

export function removeEmptySections(rendered: string): string {
  let result = rendered;

  result = result.replace(/```[a-z]*\s*\n\s*\n```/g, "");
  result = result.replace(/`\s*`/g, "");
  result = result.replace(/\*\*\s*\*\*/g, "");

  const lines = result.split("\n");
  const processedLines: string[] = [];
  let currentSection: string[] = [];
  let currentHeader: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeader = /^##\s+/.test(line);

    if (isHeader) {
      // Process the previous section before starting a new one
      if (currentHeader !== null) {
        const sectionContent = currentSection.join("\n");
        const hasContent = /\S/.test(sectionContent); // Has non-whitespace content

        if (hasContent) {
          processedLines.push(currentHeader);
          processedLines.push(...currentSection);
        }
      } else {
        processedLines.push(...currentSection);
      }

      currentHeader = line;
      currentSection = [];
    } else {
      currentSection.push(line);
    }
  }

  if (currentHeader !== null) {
    const sectionContent = currentSection.join("\n");
    const hasContent = /\S/.test(sectionContent);

    if (hasContent) {
      processedLines.push(currentHeader);
      processedLines.push(...currentSection);
    }
  } else {
    processedLines.push(...currentSection);
  }

  result = processedLines.join("\n");
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.trimEnd() + "\n";

  return result;
}

export function renderTemplate(
  body: string,
  values: Record<string, string>,
): string {
  const rendered = body.replace(/\{\{([A-Z_]+)\}\}/g, (_match, key: string) => {
    return values[key] ?? "";
  });

  return removeEmptySections(rendered);
}
