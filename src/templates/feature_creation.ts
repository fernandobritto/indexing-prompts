import type { TemplateDefinition } from "@/src/types/template";
import { BEHAVIORAL_RULES } from "@/src/lib/templateConstants";

export const featureCreation: TemplateDefinition = {
  id: "feature-creation",
  name: "Engineer: Create a New Feature",
  shortDescription:
    "Generate a prompt to implement a new product feature from user story to acceptance criteria.",
  filenameBase: "feature_creation",
  body: `{{PERSONA}}
${BEHAVIORAL_RULES}
## Feature Name

**{{FEATURE_NAME}}**

## Context

{{CONTEXT}}

## User Story

{{USER_STORY}}

## Acceptance Criteria

{{ACCEPTANCE_CRITERIA}}

## Technical Constraints

{{TECHNICAL_CONSTRAINTS}}

## Definition of Done

{{DEFINITION_OF_DONE}}

## Additional Notes

{{ADDITIONAL_NOTES}}
`,
  fields: [
    {
      key: "PERSONA",
      label: "Engineer Persona",
      helpText:
        "Describe the background, expertise, and context of the engineer who will implement this feature.",
      required: false,
      inputType: "textarea",
      placeholder:
        "The engineer is a senior backend developer with 5 years of experience in Node.js and Express. They are familiar with RESTful API design and have worked on the Orders service before.",
      enableEnglishCheck: true,
    },
    {
      key: "FEATURE_NAME",
      label: "Feature Name",
      helpText: "A short, descriptive name for the feature.",
      required: true,
      inputType: "text",
      placeholder: "e.g., User Email Verification",
    },
    {
      key: "CONTEXT",
      label: "Context",
      helpText:
        "Describe the product area, team, and any background needed to understand this feature.",
      required: true,
      inputType: "textarea",
      placeholder:
        "This feature is part of the onboarding flow for new users...",
      enableEnglishCheck: true,
    },
    {
      key: "USER_STORY",
      label: "User Story",
      helpText: "Write as: As a [role], I want [goal], so that [benefit].",
      required: true,
      inputType: "textarea",
      placeholder:
        "As a new user, I want to verify my email address after registration, so that my account is secured and spam registrations are prevented.",
      enableEnglishCheck: true,
    },
    {
      key: "ACCEPTANCE_CRITERIA",
      label: "Acceptance Criteria",
      helpText:
        "List the specific, testable conditions that must be true for this feature to be considered complete.",
      required: true,
      inputType: "textarea",
      placeholder:
        "- A verification email is sent within 30 seconds of registration.\n- The link expires after 24 hours.\n- Clicking an expired link shows a clear error with a resend option.",
      enableEnglishCheck: true,
    },
    {
      key: "TECHNICAL_CONSTRAINTS",
      label: "Technical Constraints",
      helpText:
        "List any technical constraints, dependencies, frameworks, or architectural decisions that apply.",
      required: false,
      inputType: "textarea",
      placeholder:
        "Must use the existing EmailService. Do not introduce new dependencies without discussion.",
      enableEnglishCheck: true,
    },
    {
      key: "DEFINITION_OF_DONE",
      label: "Definition of Done",
      helpText:
        "Describe what a completed implementation looks like (tests, docs, code review, etc.).",
      required: false,
      inputType: "textarea",
      placeholder:
        "Unit tests covering success and failure paths. PR reviewed and approved. Feature flag configured for gradual rollout.",
      enableEnglishCheck: true,
    },
    {
      key: "ADDITIONAL_NOTES",
      label: "Additional Notes",
      helpText: "Any other relevant details, links, or edge cases.",
      required: false,
      inputType: "textarea",
      placeholder: "Related ticket: JIRA-1234. Design mockup in Figma...",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "Engineering",
    version: "1.0.0",
    lastUpdated: "2026-06-07",
  },
};
