export type FieldInputType = "text" | "textarea" | "select";

export interface TemplateField {
  key: string;
  label: string;
  helpText: string;
  required: boolean;
  inputType: FieldInputType;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  enableEnglishCheck?: boolean; // defaults true for textarea
}

export interface TemplateMetadata {
  category: string;
  version: string;
  lastUpdated: string; // ISO date string
}

export interface TemplateDefinition {
  id: string;
  name: string;
  shortDescription: string;
  filenameBase: string;
  body: string;
  fields: TemplateField[];
  metadata: TemplateMetadata;
}
