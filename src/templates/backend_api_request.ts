import type { TemplateDefinition } from "@/src/types/template";
import { BEHAVIORAL_RULES } from "@/src/lib/templateConstants";

export const backendApiRequest: TemplateDefinition = {
  id: "backend-api-request",
  name: "Backend: Create a New API Request",
  shortDescription:
    "Generate a prompt to implement a new backend API endpoint with full context, payload, and error-handling details.",
  filenameBase: "backend_api_request",
  body: `{{PERSONA}}

${BEHAVIORAL_RULES}
## Context

{{CONTEXT}}

## API Specification

| Field              | Value                |
|--------------------|----------------------|
| **Endpoint**       | \`{{ENDPOINT}}\`     |
| **HTTP Method**    | \`{{HTTP_METHOD}}\`  |

## Request Description

{{REQUEST_DESCRIPTION}}

## Request Payload

\`\`\`json
{{REQUEST_PAYLOAD}}
\`\`\`

## Expected Response

{{EXPECTED_RESPONSE}}

## Authentication & Authorization

{{AUTH_REQUIREMENTS}}

## Error Handling

{{ERROR_HANDLING}}

## Additional Notes

{{ADDITIONAL_NOTES}}
`,
  fields: [
    {
      key: "PERSONA",
      label: "Engineer Persona",
      helpText:
        "Describe the background, expertise, and context of the engineer who will implement this API.",
      required: false,
      inputType: "textarea",
      placeholder:
        "The engineer is a senior backend developer with 5 years of experience in Node.js and Express. They are familiar with RESTful API design and have worked on the Orders service before.",
      enableEnglishCheck: true,
    },
    {
      key: "CONTEXT",
      label: "Context",
      helpText:
        "Describe the service, module, or system where this API lives. Include relevant background.",
      required: true,
      inputType: "textarea",
      placeholder: "e.g., This endpoint is part of the Orders service...",
      enableEnglishCheck: true,
    },
    {
      key: "ENDPOINT",
      label: "Endpoint Path",
      helpText: "The full URL path, e.g., /api/v1/orders.",
      required: true,
      inputType: "text",
      placeholder: "/api/v1/orders",
    },
    {
      key: "HTTP_METHOD",
      label: "HTTP Method",
      helpText: "The HTTP verb for this endpoint.",
      required: true,
      inputType: "select",
      options: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      defaultValue: "POST",
    },
    {
      key: "REQUEST_DESCRIPTION",
      label: "Request Description",
      helpText: "Describe what this API request does and its purpose.",
      required: true,
      inputType: "textarea",
      placeholder: "This endpoint creates a new order record...",
      enableEnglishCheck: true,
    },
    {
      key: "REQUEST_PAYLOAD",
      label: "Request Payload (JSON)",
      helpText: "Example JSON body or schema. Leave blank for GET requests.",
      required: false,
      inputType: "textarea",
      placeholder: '{\n  "userId": "string",\n  "items": []\n}',
    },
    {
      key: "EXPECTED_RESPONSE",
      label: "Expected Response",
      helpText: "Describe the expected success response (status code + body).",
      required: true,
      inputType: "textarea",
      placeholder: "201 Created with the created order object...",
      enableEnglishCheck: true,
    },
    {
      key: "AUTH_REQUIREMENTS",
      label: "Authentication & Authorization Requirements",
      helpText: "Describe auth needs: JWT, API key, roles, scopes, etc.",
      required: false,
      inputType: "textarea",
      placeholder:
        "Requires a valid JWT bearer token with the 'orders:write' scope...",
      enableEnglishCheck: true,
    },
    {
      key: "ERROR_HANDLING",
      label: "Error Handling Requirements",
      helpText: "List expected error cases and how they should be handled.",
      required: false,
      inputType: "textarea",
      placeholder:
        "400 for invalid payload, 401 for missing token, 409 for duplicate order...",
      enableEnglishCheck: true,
    },
    {
      key: "ADDITIONAL_NOTES",
      label: "Additional Notes",
      helpText: "Any other constraints, dependencies, or requirements.",
      required: false,
      inputType: "textarea",
      placeholder: "Use the existing OrderRepository abstraction...",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "Backend",
    version: "1.0.0",
    lastUpdated: "2026-06-07",
  },
};
