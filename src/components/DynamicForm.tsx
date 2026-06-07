"use client";

import { useState, useRef } from "react";
import type { TemplateDefinition } from "@/src/types/template";
import { useTemplateForm } from "@/src/hooks/useTemplateForm";
import { buildExportFilename } from "@/src/lib/sanitizeFilename";
import { renderTemplate } from "@/src/lib/renderTemplate";
import FieldRenderer from "./FieldRenderer";
import PreviewModal from "./PreviewModal";

interface Props {
  template: TemplateDefinition;
}

export default function DynamicForm({ template }: Props) {
  const { values, errors, missingLabels, isValid, setValue, setTouched, touchAll } =
    useTemplateForm(template);

  const [showModal, setShowModal] = useState(false);
  const previewButtonRef = useRef<HTMLButtonElement>(null);

  function handlePreview() {
    touchAll();
    setShowModal(true);
  }

  function handleExport() {
    touchAll();
    if (!isValid) return;

    const content = renderTemplate(template.body, values);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = buildExportFilename(template.id);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-6"
      >
        {template.fields.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={values[field.key] ?? ""}
            error={errors[field.key]}
            onChange={(v) => setValue(field.key, v)}
            onBlur={() => setTouched(field.key)}
          />
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700">
          <button
            ref={previewButtonRef}
            type="button"
            onClick={handlePreview}
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Preview Prompt
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={!isValid}
            title={
              !isValid
                ? `Fill in required fields: ${missingLabels.join(", ")}`
                : "Export as Markdown"
            }
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export .md
          </button>

          {!isValid && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Required fields missing:{" "}
              <span className="text-red-500">{missingLabels.join(", ")}</span>
            </p>
          )}
        </div>
      </form>

      {showModal && (
        <PreviewModal
          template={template}
          values={values}
          isValid={isValid}
          missingLabels={missingLabels}
          triggerRef={previewButtonRef}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
