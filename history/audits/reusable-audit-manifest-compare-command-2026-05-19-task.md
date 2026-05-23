# Task

## Header
- ID: REUSABLE-AUDIT-MANIFEST-COMPARE-COMMAND-2026-05-19
- Title: Add reusable audit manifest comparison command
- Task Type: planning
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: `REUSABLE-AUDIT-MANIFEST-CHECK-COMMAND-2026-05-19`
- Priority: P2
- Module Confidence Rows: not applicable
- Requirement Rows: audit/source-of-truth continuity
- Quality Scenario Rows: documentation traceability
- Risk Rows: `RISK-036`
- Iteration: 2026-05-19 audit continuation
- Operation Mode: ARCHITECT
- Mission ID: FULL-REUSABLE-AUDIT-2026-05-19
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the current audit-continuation context.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed earlier in this mission.
- [x] `.agents/core/mission-control.md` was reviewed earlier in this mission.
- [x] Missing or template-like state tables were not applicable.
- [x] Affected module confidence rows were identified as not applicable.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves future audit comparability and release confidence.

## Mission Block
- Mission objective: make the full reusable audit set durable and comparable
  across future reruns.
- Release objective advanced: audit evidence can show improvement or
  regression without relying on chat memory.
- Included slices: comparison script, package command, manifest validation note,
  and canonical queue sync.
- Explicit exclusions: architecture decisions, runtime behavior, production
  evidence, LIVE/exchange mutation, and production data mutation.
- Checkpoint cadence: one bounded verification slice.
- Stop conditions: command failure, manifest schema mismatch, or detected
  regression in the current self-comparison.
- Handoff expectation: future agents can compare two manifest JSON files with
  one command.

## Context

The full reusable audit run now has a stable manifest and a validation command.
Future reruns also need a deterministic comparison path so a later audit can
report improvement or regression versus this baseline.

## Goal

Add a reusable command that compares two audit artifact manifests and fails
when the target manifest regresses against the baseline.

## Scope

- `scripts/compareReusableAuditManifests.mjs`
- `package.json`
- `history/audits/reusable-audit-artifact-manifest-2026-05-19.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Add a Node script that accepts `--base`, `--target`, and optional `--json`.
2. Compare audit status changes, summary deltas, open-decision deltas, and
   safety-boundary changes.
3. Return non-zero status when regressions are detected.
4. Add a package command and document the self-comparison validation.
5. Run focused command validation and repository guardrails.

## Acceptance Criteria

- `corepack pnpm run audit:manifest:compare -- --base <manifest> --target <manifest>`
  exists and passes on the current manifest self-comparison.
- JSON output mode exists for automation.
- Regression categories are explicit in the result object.
- No architecture decision or runtime behavior is changed.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` was considered for scope-appropriate evidence.
- [x] Comparison command exists with focused regression tests.
- [x] Current manifest self-comparison passes.
- [x] Manifest validation docs mention the comparison command.
- [x] Guardrails and diff checks pass.

## Forbidden

- accepting `DEC-AUD-001` or `DEC-AUD-002`
- changing exchange, assistant, API, Web, worker, or database runtime behavior
- production or LIVE/exchange mutation
- existing production data mutation

## Validation Evidence

- `corepack pnpm run audit:manifest:compare -- --base history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --target history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json`: PASS.
- `corepack pnpm run audit:manifest:compare -- --base history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --target history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --json`: PASS.
- `corepack pnpm run audit:manifest:compare:test`: PASS.
- `corepack pnpm run audit:manifest:check`: PASS.
- `corepack pnpm run docs:parity:check`: PASS.
- `corepack pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with line-ending warnings only.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: audit rollup, manifest, and decision packet.
- Fits approved architecture: yes.
- Mismatch discovered: no new mismatch.
- Decision required from user: no new decision; existing `DEC-AUD-001` and
  `DEC-AUD-002` remain open.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: remove the package script and comparison script if the audit
  tooling approach is superseded.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manifest validation existed, but comparison between audit reruns was
  still manual.
- Gaps: no one-command way to classify audit status regressions.
- Inconsistencies: none introduced.
- Architecture constraints: no decision or runtime behavior changes.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: manifest JSON, rollup JSON, task board, decision register.
- Rows created or corrected: task board entry only.
- Assumptions recorded: status comparison uses conservative rank order:
  current, unknown, deferred, partial, failed.
- Blocking unknowns: none for comparison tooling.
- Why it was safe to continue: tooling is read-only and compares local JSON
  artifacts.

### 2. Select One Priority Mission Objective
- Selected task: reusable manifest comparison command.
- Priority rationale: it directly supports future month-over-month audit
  improvement tracking.
- Why other candidates were deferred: architecture/runtime repairs need
  explicit user decisions.

### 3. Plan Implementation
- Files or surfaces to modify: script, package command, manifest docs, task
  board.
- Logic: compare audit statuses, summary counts, open decisions, and safety
  boundaries.
- Edge cases: missing audits, added decisions, safety-boundary flips from
  false to true, JSON automation output.

### 4. Execute Implementation
- Implementation notes: reused Node built-ins and the manifest JSON contract.

### 5. Verify and Test
- Validation performed: self-comparison, JSON output, focused comparison
  regression tests, manifest check, docs parity, guardrails, diff check,
  environment cleanup.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: document manual comparison only.
- Technical debt introduced: no.
- Scalability assessment: command can compare any two manifests with the same
  schema.
- Refinements made: added machine-readable regression/improvement buckets.

### 7. Update Documentation and Knowledge
- Docs updated: manifest validation notes and task board.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to audit-continuation context.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated where repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report

- Task summary: added reusable audit manifest comparison tooling and focused
  regression tests.
- Files changed: `scripts/compareReusableAuditManifests.mjs`,
  `scripts/compareReusableAuditManifests.test.mjs`, `package.json`, manifest
  docs, and task board.
- How tested: focused comparison command, JSON mode, comparison regression
  tests, manifest check, docs parity, guardrails, and diff check.
- What is incomplete: no architecture/runtime decision was accepted.
- Next steps: choose `DEC-AUD-001` and `DEC-AUD-002`, or rerun the comparison
  command against a future manifest.
- Decisions made: no product or architecture decision made.
