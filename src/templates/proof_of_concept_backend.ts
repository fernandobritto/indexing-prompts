import type { TemplateDefinition } from "@/src/types/template";
import { BEHAVIORAL_RULES } from "@/src/lib/templateConstants";

export const proofOfConceptBackend: TemplateDefinition = {
  id: "poc-backend",
  name: "POC: Backend Proof of Concept",
  shortDescription:
    "Generate a prompt to build a focused, time-boxed backend POC that validates a technical hypothesis — architecture, integration, or performance — with minimal scope.",
  filenameBase: "poc_backend",
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

## Architecture Overview

{{ARCHITECTURE_OVERVIEW}}

## API Contract (if applicable)

{{API_CONTRACT}}

## Data Model (if applicable)

{{DATA_MODEL}}

## Success Criteria

{{SUCCESS_CRITERIA}}

## Performance Baseline (if applicable)

{{PERFORMANCE_BASELINE}}

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
        "Describe the backend engineer's background and relevant experience for this POC.",
      required: false,
      inputType: "textarea",
      placeholder:
        "The engineer is a senior backend developer with deep expertise in distributed systems and event-driven architecture. They have previously designed high-throughput pipelines using Kafka and are familiar with the existing microservices infrastructure.",
      enableEnglishCheck: true,
    },
    {
      key: "POC_NAME",
      label: "POC Name",
      helpText:
        "A short, descriptive name that clearly identifies what is being validated.",
      required: true,
      inputType: "text",
      placeholder:
        "e.g., Kafka-Based Order Event Pipeline — Throughput Validation",
    },
    {
      key: "OBJECTIVE",
      label: "Objective",
      helpText:
        "State the single, clear goal of this POC. What technical risk or architectural question does it answer?",
      required: true,
      inputType: "textarea",
      placeholder:
        "Validate whether a Kafka-based event pipeline can process 10,000 order events per second with end-to-end latency under 500ms, using the existing infrastructure without additional broker nodes.",
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
        "We believe that a single Kafka topic with 12 partitions and a consumer group of 6 NestJS workers can sustain 10,000 events/second with p95 latency below 500ms. We will know this is true when a 5-minute load test at that throughput produces no consumer lag above 1,000 messages and no processing errors.",
      enableEnglishCheck: true,
    },
    {
      key: "SCOPE_IN",
      label: "Scope — What Is In",
      helpText:
        "List only what must be built. Be ruthlessly minimal. A POC is not a production service.",
      required: true,
      inputType: "textarea",
      placeholder:
        "- A NestJS producer service that publishes synthetic order events to a Kafka topic.\n- A NestJS consumer service with 6 worker instances processing events.\n- A basic metrics endpoint exposing throughput and error rate.\n- A k6 load test script to drive the producer at target throughput.",
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
        "- Persistent storage of processed events.\n- Dead-letter queue handling.\n- Authentication and authorization.\n- Production-grade observability (Datadog, Grafana).\n- Schema Registry or Avro serialization.\n- Deployment to production or staging environments.",
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
        "- NestJS 10 (existing framework)\n- KafkaJS (existing library)\n- Docker Compose for local Kafka broker\n- k6 for load testing\n- Node.js 20 LTS\n- No new infrastructure beyond a local Kafka broker.",
      enableEnglishCheck: true,
    },
    {
      key: "ARCHITECTURE_OVERVIEW",
      label: "Architecture Overview",
      helpText:
        "Describe the components, their interactions, and data flow. Keep it minimal and focused on what the POC validates.",
      required: true,
      inputType: "textarea",
      placeholder:
        "Producer Service → Kafka Topic (12 partitions) → Consumer Group (6 workers) → In-memory counter → Metrics endpoint.\n\nThe producer publishes a synthetic JSON event every 0.1ms to simulate 10,000 events/second. Each consumer worker deserializes the event and increments a shared atomic counter. The metrics endpoint exposes the current throughput and error count.",
      enableEnglishCheck: true,
    },
    {
      key: "API_CONTRACT",
      label: "API Contract (if applicable)",
      helpText:
        "Define the minimal API surface exposed by this POC. Use HTTP method + path + brief description.",
      required: false,
      inputType: "textarea",
      placeholder:
        "GET /metrics — Returns current throughput (events/sec), total processed, total errors, and p95 latency.\n\nPOST /produce — Triggers the producer to start publishing events (accepts { durationSeconds: number, ratePerSecond: number }).",
      enableEnglishCheck: true,
    },
    {
      key: "DATA_MODEL",
      label: "Data Model (if applicable)",
      helpText:
        "Describe the minimal data structures used in this POC. Only include what is necessary to validate the hypothesis.",
      required: false,
      inputType: "textarea",
      placeholder:
        "Order Event (Kafka message value):\n{\n  eventId: string (UUID),\n  orderId: string,\n  eventType: 'ORDER_CREATED',\n  timestamp: ISO8601 string,\n  payload: { userId: string, totalAmount: number }\n}",
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
        "- Sustained throughput of 10,000 events/second for 5 continuous minutes.\n- p95 end-to-end latency (produce → consume) below 500ms.\n- Consumer lag does not exceed 1,000 messages at any point during the test.\n- Zero processing errors during the 5-minute test window.\n- No memory leak detected (heap stable after 5 minutes).",
      enableEnglishCheck: true,
    },
    {
      key: "PERFORMANCE_BASELINE",
      label: "Performance Baseline (if applicable)",
      helpText:
        "Describe the current baseline or benchmark this POC is being compared against.",
      required: false,
      inputType: "textarea",
      placeholder:
        "Current REST-based order processing handles 800 requests/second with p95 latency of 1,200ms. This POC must demonstrate at least a 10x throughput improvement to justify the migration cost.",
      enableEnglishCheck: true,
    },
    {
      key: "TIME_BOX",
      label: "Time Box",
      helpText:
        "Define the maximum time allocated. A POC that exceeds its time box has failed its purpose.",
      required: true,
      inputType: "text",
      placeholder: "e.g., 3 business days (24 hours)",
    },
    {
      key: "EVALUATION_METHOD",
      label: "Evaluation Method",
      helpText:
        "Describe how the POC will be evaluated and by whom. What is the decision gate?",
      required: true,
      inputType: "textarea",
      placeholder:
        "A technical review session with the architecture team and engineering manager. The team will review the k6 load test report and metrics endpoint output. Decision gate: (1) proceed to production design, (2) adjust partition/consumer configuration and re-test, or (3) discard the Kafka approach.",
      enableEnglishCheck: true,
    },
    {
      key: "ADDITIONAL_NOTES",
      label: "Additional Notes",
      helpText:
        "Any other relevant context, risks, known unknowns, or reference links.",
      required: false,
      inputType: "textarea",
      placeholder:
        "Known risk: local Docker Compose Kafka may not accurately reflect production broker performance. If the POC passes locally, a secondary validation on the staging Kafka cluster is recommended before committing to the architecture.\n\nReference: https://kafka.apache.org/documentation/",
      enableEnglishCheck: true,
    },
  ],
  metadata: {
    category: "POC",
    version: "1.0.0",
    lastUpdated: "2026-06-07",
  },
};
