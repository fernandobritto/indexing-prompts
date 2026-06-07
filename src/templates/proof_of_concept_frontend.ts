import type { TemplateDefinition } from "@/src/types/template";
import { BEHAVIORAL_RULES } from "@/src/lib/templateConstants";

export const proofOfConceptFrontend: TemplateDefinition = {
  id: "poc-frontend",
  name: "POC: Frontend Proof of Concept",
  shortDescription:
    "Generate a prompt to build a focused, time-boxed frontend POC that validates a UI hypothesis with minimal scope and maximum clarity.",
  filenameBase: "poc_frontend",
  body: `{{PERSONA}}

${BEHAVIORAL_RULES}

## POC Name

**{{POC_NAME}}**

## Objective

{{OBJECTIVE}}

## Hypothesis Being Validated

{{HYPOTHESIS}}

## Scope (What Is In)

{{SCOPE_IN}}

## Out of Scope (What Is NOT In)

{{SCOPE_OUT}}

## Tech Stack & Constraints

{{TECH_STACK}}

## UI / UX Requirements

{{UI_UX_REQUIREMENTS}}

## Success Criteria

{{SUCCESS_CRITERIA}}

## Time Box

{{TIME_BOX}}

## Evaluation Method

{{EVALUATION_METHOD}}

## Additional Notes

{{ADDITIONAL_NOTES}}
`,
  fields: [
    {
      key: "PERSONA",
      label: "Engineer Persona",
      helpText:
        "Describe the frontend engineer's background and relevant experience for this POC.",
      required: false,
      inputType: "textarea",
      placeholder:
        "The engineer is a senior frontend developer with expertise in React and Next.js. They have previously built data-heavy dashboards and are familiar with the design system in use.",
      enableEnglishCheck: true,
    },
    {
      key: "POC_NAME",
      label: "POC Name",
      helpText:
        "A short, descriptive name that clearly identifies what is being validated.",
      required: true,
      inputType: "text",
      placeholder: "e.g., Real-Time Dashboard with WebSocket Updates",
    },
    {
      key: "OBJECTIVE",
      label: "Objective",
      helpText:
        "State the single, clear goal of this POC. What question does it answer? What risk does it de-risk?",
      required: true,
      inputType: "textarea",
      placeholder:
        "Validate whether the existing React component architecture can support real-time data updates via WebSocket without a full state management refactor.",
      enableEnglishCheck: true,
    },
    {
      key: "HYPOTHESIS",
      label: "Hypothesis Being Validated",
      helpText:
        "Write as: We believe [assumption]. We will know this is true when [measurable outcome].",
      required: true,
      inputType: "textarea",
      placeholder:
        "We believe that integrating a WebSocket connection at the component level will deliver sub-200ms UI updates without degrading render performance. We will know this is true when the dashboard reflects live data changes within 200ms under a simulated load of 50 concurrent events per second.",
      enableEnglishCheck: true,
    },
    {
      key: "SCOPE_IN",
      label: "Scope — What Is In",
      helpText:
        "List only what must be built. Be ruthlessly minimal. A POC is not a production feature.",
      required: true,
      inputType: "textarea",
      placeholder:
        "- A single dashboard page with three live-updating metric cards.\n- A mock WebSocket server to simulate real-time events.\n- Basic error state when the connection drops.",
      enableEnglishCheck: true,
    },
    {
      key: "SCOPE_OUT",
      label: "Out of Scope — What Is NOT In",
      helpText:
        "Explicitly list what will NOT be built. This prevents scope creep and keeps the POC focused.",
      required: true,
      inputType: "textarea",
      placeholder:
        "- Authentication and authorization.\n- Persistent data storage.\n- Mobile responsiveness.\n- Production-grade error handling.\n- Unit or integration tests.",
      enableEnglishCheck: true,
    },
    {
      key: "TECH_STACK",
      label: "Tech Stack & Constraints",
      helpText:
        "List the frameworks, libraries, and constraints that apply. Do not introduce new dependencies without justification.",
      required: true,
      inputType: "textarea",
      placeholder:
        "- Next.js 14 (App Router)\n- React 18\n- Tailwind CSS (existing design system)\n- Native WebSocket API (no additional library)\n- No new npm packages without explicit approval.",
      enableEnglishCheck: true,
    },
    {
      key: "UI_UX_REQUIREMENTS",
      label: "UI / UX Requirements",
      helpText:
        "Describe the minimum visual and interaction requirements. Link to Figma or describe layout if no design exists.",
      required: false,
      inputType: "textarea",
      placeholder:
        "- Three metric cards displayed in a responsive grid.\n- Each card shows a label, current value, and a sparkline of the last 10 values.\n- A connection status indicator (green/red dot) in the top-right corner.\n- No design system deviation; use existing Card and Badge components.",
      enableEnglishCheck: true,
    },
    {
      key: "SUCCESS_CRITERIA",
      label: "Success Criteria",
      helpText:
        "Define specific, measurable, and binary criteria. The POC either passes or fails each criterion.",
      required: true,
      inputType: "textarea",
      placeholder:
        "- UI reflects WebSocket events within 200ms (measured via browser DevTools).\n- No visible render jank (frame drops below 60fps) during a burst of 50 events/second.\n- Connection drop is detected and displayed within 3 seconds.\n- Implementation requires no changes to existing global state management.",
      enableEnglishCheck: true,
    },
    {
      key: "TIME_BOX",
      label: "Time Box",
      helpText:
        "Define the maximum time allocated. A POC that exceeds its time box has failed its purpose.",
      required: true,
      inputType: "text",
      placeholder: "e.g., 2 business days (16 hours)",
    },
    {
      key: "EVALUATION_METHOD",
      label: "Evaluation Method",
      helpText:
        "Describe how the POC will be evaluated and by whom. Who reviews it? What is the decision gate?",
      required: true,
      inputType: "textarea",
      placeholder:
        "A 30-minute live demo with the tech lead and product manager. The team will decide: (1) proceed to production implementation, (2) pivot the approach, or (3) discard the hypothesis.",
      enableEnglishCheck: true,
    },
    {
      key: "ADDITIONAL_NOTES",
      label: "Additional Notes",
      helpText:
        "Any other relevant context, risks, dependencies, or reference links.",
      required: false,
      inputType: "textarea",
      placeholder:
        "Reference implementation: https://github.com/example/ws-demo. Known risk: the mock WebSocket server may not accurately simulate production event volume.",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "POC",
    version: "1.0.0",
    lastUpdated: "2026-06-07",
  },
};
