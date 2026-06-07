"use client";

import type { TemplateField } from "@/src/types/template";
import EnglishReviewPanel from "./EnglishReviewPanel";

interface Props {
  field: TemplateField;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export default function FieldRenderer({
  field,
  value,
  error,
  onChange,
  onBlur,
}: Props) {
  const id = `field-${field.key}`;
  const errorId = `error-${field.key}`;
  const showEnglishCheck =
    field.inputType === "textarea" && field.enableEnglishCheck !== false;

  const baseInputClass =
    "w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 " +
    (error
      ? "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-950/20"
      : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800") +
    " text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500";

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {field.label}
        {field.required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {field.helpText && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {field.helpText}
        </p>
      )}

      {field.inputType === "textarea" ? (
        <textarea
          id={id}
          name={field.key}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          rows={5}
          className={`${baseInputClass} resize-y`}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      ) : field.inputType === "select" ? (
        <select
          id={id}
          name={field.key}
          value={value}
          required={field.required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={baseInputClass}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        >
          {!field.required && <option value="">— Select —</option>}
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type="text"
          name={field.key}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={baseInputClass}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {showEnglishCheck && (
        <EnglishReviewPanel
          text={value}
          onChange={onChange}
          fieldLabel={field.label}
        />
      )}
    </div>
  );
}
