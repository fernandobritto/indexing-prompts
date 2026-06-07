"use client";

import { useState, useCallback } from "react";
import type { TemplateDefinition } from "@/src/types/template";
import { validateValues } from "@/src/lib/renderTemplate";

export type FormValues = Record<string, string>;
export type TouchedFields = Record<string, boolean>;

export interface UseTemplateFormReturn {
  values: FormValues;
  touched: TouchedFields;
  errors: Record<string, string>;
  missingLabels: string[];
  isValid: boolean;
  setValue: (key: string, value: string) => void;
  setTouched: (key: string) => void;
  touchAll: () => void;
}

export function useTemplateForm(
  template: TemplateDefinition,
): UseTemplateFormReturn {
  const [values, setValues] = useState<FormValues>(() => {
    const initial: FormValues = {};
    for (const field of template.fields) {
      initial[field.key] = field.defaultValue ?? "";
    }
    return initial;
  });

  const [touched, setTouchedState] = useState<TouchedFields>({});

  const validation = validateValues(template.fields, values);

  const setValue = useCallback((key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setTouched = useCallback((key: string) => {
    setTouchedState((prev) => ({ ...prev, [key]: true }));
  }, []);

  const touchAll = useCallback(() => {
    const all: TouchedFields = {};
    for (const field of template.fields) {
      all[field.key] = true;
    }
    setTouchedState(all);
  }, [template.fields]);

  // Only surface errors for touched fields in the UI
  const visibleErrors: Record<string, string> = {};
  for (const [key, msg] of Object.entries(validation.errorsByField)) {
    if (touched[key]) {
      visibleErrors[key] = msg;
    }
  }

  return {
    values,
    touched,
    errors: visibleErrors,
    missingLabels: validation.missingLabels,
    isValid: validation.isValid,
    setValue,
    setTouched,
    touchAll,
  };
}
