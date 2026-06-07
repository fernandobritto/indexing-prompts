"use client";

import { useEffect, useRef } from "react";
import { renderTemplate } from "@/src/lib/renderTemplate";
import { buildExportFilename } from "@/src/lib/sanitizeFilename";
import type { TemplateDefinition } from "@/src/types/template";
import type { FormValues } from "@/src/hooks/useTemplateForm";

interface Props {
  template: TemplateDefinition;
  values: FormValues;
  isValid: boolean;
  missingLabels: string[];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

export default function PreviewModal({
  template,
  values,
  isValid,
  missingLabels,
  triggerRef,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    closeButtonRef.current?.focus();

    const handleCancel = (e: Event) => {
      e.preventDefault();
      handleClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    dialogRef.current?.close();
    onClose();
    // Restore focus to the button that opened the modal
    setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) handleClose();
  }

  const rendered = renderTemplate(template.body, values);

  function handleExport() {
    if (!isValid) return;
    const blob = new Blob([rendered], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = buildExportFilename(template.id);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="m-auto max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-black/50 dark:bg-zinc-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Preview: {template.name}
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          aria-label="Close preview"
          className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          ✕
        </button>
      </div>

      {/* Validation status */}
      {!isValid && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 dark:border-amber-700/40 dark:bg-amber-900/20">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            ⚠️ Some required fields are missing:
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-amber-700 dark:text-amber-400">
            {missingLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
            Close this preview, fill in the missing fields, then export.
          </p>
        </div>
      )}

      {/* Prompt content */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
        <pre className="whitespace-pre-wrap break-words px-6 py-4 font-mono text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {rendered}
        </pre>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ← Continue Editing
        </button>
        <button
          type="button"
          onClick={handleExport}
          disabled={!isValid}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export .md
        </button>
      </div>
    </dialog>
  );
}
