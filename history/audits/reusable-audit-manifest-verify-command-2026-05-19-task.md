# Task

## Header
- ID: REUSABLE-AUDIT-MANIFEST-VERIFY-COMMAND-2026-05-19
- Title: Add one-command reusable audit manifest verification
- Task Type: planning
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: `REUSABLE-AUDIT-MANIFEST-CHECK-COMMAND-2026-05-19`, `REUSABLE-AUDIT-MANIFEST-COMPARE-COMMAND-2026-05-19`
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
- [x] The task improves future audit repeatability.

## Mission Block
- Mission objective: make the full reusable audit manifest easy to validate in
  future reruns.
- Release objective advanced: future audit reruns have a single command that
  runs checker tests, comparison tests, manifest validation, and baseline
  self-comparison.
- Included slices: package script, manifest validation note, task record, and
  canonical queue sync.
- Explicit exclusions: architecture decisions, runtime behavior, production
  evidence, LIVE/exchange mutation, and production data mutation.
- Checkpoint cadence: one bounded verification slice.
- Stop conditions: verify command failure or repository guardrail failure.
- Handoff expectation: future agents can run one manifest verification command.

## Context

The reusable audit manifest now has separate validation and comparison commands
with focused regression tests. Future reruns should not depend on remembering
the exact sequence of those commands.

## Goal

Add one repository command that executes the full reusable audit manifest
verification bundle.

## Scope

- `package.json`
- `history/audits/reusable-audit-artifact-manifest-2026-05-19.md`
- `.codex/context/TASK_BOARD.md`
- `history/audits/reusable-audit-manifest-verify-command-2026-05-19-task.md`

## Implementation Plan

1. Add `audit:manifest:verify` to `package.json`.
2. Run checker regression tests, comparison regression tests, manifest check,
   and current manifest self-comparison inside that command.
3. Document the command in the manifest validation section and task board.
4. Run focused verification and repository guardrails.

## Acceptance Criteria

- `corepack pnpm run audit:manifest:verify` exists.
- The command passes on the current manifest.
- The manifest docs list the command as the primary validation entrypoint.
- No architecture decision or runtime behavior is changed.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` was considered for scope-appropriate evidence.
- [x] One-command verification exists.
- [x] One-command verification passes.
- [x] Documentation and task board are synchronized.
- [x] Guardrails and diff checks pass.

## Forbidden

- accepting `DEC-AUD-001` or `DEC-AUD-002`
- changing exchange, assistant, API, Web, worker, or database runtime behavior
- production or LIVE/exchange mutation
- existing production data mutation

## Validation Evidence

- `corepack pnpm run audit:manifest:verify`: PASS.
- `corepack pnpm run docs:parity:check`: PASS.
- `corepack pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with line-ending warnings only.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: audit rollup, manifest, checker task, and
  compare task.
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
- Rollback note: remove the package script if superseded by a later audit
  orchestration command.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: manifest validation required multiple commands.
- Gaps: no single command for future audit rerun validation.
- Inconsistencies: none introduced.
- Architecture constraints: no decision or runtime behavior changes.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: manifest docs, task board, package scripts.
- Rows created or corrected: task board entry only.
- Assumptions recorded: one wrapper command is acceptable because it only
  composes already verified commands.
- Blocking unknowns: none.
- Why it was safe to continue: script is read-only and local.

### 2. Select One Priority Mission Objective
- Selected task: one-command manifest verification.
- Priority rationale: it reduces future audit rerun error risk.
- Why other candidates were deferred: architecture/runtime repairs need
  explicit user decisions.

### 3. Plan Implementation
- Files or surfaces to modify: package script, manifest docs, task board, task
  record.
- Logic: compose existing commands in a fail-fast chain.
- Edge cases: command failure should stop subsequent validation.

### 4. Execute Implementation
- Implementation notes: no new runtime logic; used existing package command
  pattern.

### 5. Verify and Test
- Validation performed: one-command verify, docs parity, guardrails, diff
  check, environment cleanup.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave separate commands documented only.
- Technical debt introduced: no.
- Scalability assessment: future manifests can replace the self-comparison
  target path in this command or add a date-specific command.
- Refinements made: manifest docs now list the wrapper first.

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

- Task summary: added `audit:manifest:verify` as the one-command reusable
  audit manifest verification bundle.
- Files changed: `package.json`, manifest docs, task board, and this task
  record.
- How tested: `audit:manifest:verify`, docs parity, guardrails, and diff check.
- What is incomplete: no architecture/runtime decision was accepted.
- Next steps: choose `DEC-AUD-001` and `DEC-AUD-002`, or use
  `audit:manifest:verify` before comparing future manifest reruns.
- Decisions made: no product or architecture decision made.
