import { backendApiRequest } from "./backend_api_request";
import { featureCreation } from "./feature_creation";
import { criticalBugInvestigation } from "./critical_bug_investigation";
import { refactorOptimize } from "./refactor_optimize";
import { proofOfConceptFrontend } from "./proof_of_concept_frontend";
import { proofOfConceptBackend } from "./proof_of_concept_backend";
import type { TemplateDefinition } from "@/src/types/template";

export const templates: TemplateDefinition[] = [
  backendApiRequest,
  featureCreation,
  criticalBugInvestigation,
  refactorOptimize,
  proofOfConceptFrontend,
  proofOfConceptBackend,
];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find((t) => t.id === id);
}
