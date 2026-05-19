# Task

## Header
- ID: REUSABLE-AUDIT-RERUN-PLAYBOOK-2026-05-19
- Title: Publish reusable audit rerun playbook
- Task Type: planning
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: `REUSABLE-AUDIT-MANIFEST-VERIFY-COMMAND-2026-05-19`
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
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed earlier in this mission.
- [x] Missing or template-like state tables were not applicable.
- [x] Affected module confidence rows were identified as not applicable.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves repeatable audit evidence quality.

## Mission Block
- Mission objective: make future full audit reruns comparable with the
  2026-05-19 baseline.
- Release objective advanced: future agents have an explicit rerun order,
  safety boundaries, regression rules, and closure checks.
- Included slices: operations playbook, manifest/handoff/index links, task
  board sync, and validation.
- Explicit exclusions: architecture decisions, runtime behavior, production
  proof, LIVE/exchange mutation, and production data mutation.
- Checkpoint cadence: one bounded documentation/verification slice.
- Stop conditions: docs parity or guardrail failure.
- Handoff expectation: future reruns start from the playbook and verify the
  new manifest against the 2026-05-19 baseline.

## Context

The reusable audit system now has a registry, rollup, handoff, manifest,
manifest checker, comparison command, and one-command verification. A future
rerun still needs a concise operational playbook that says how to rerun and
compare results without relying on chat memory.

## Goal

Publish a reusable audit rerun playbook anchored to the 2026-05-19 baseline.

## Scope

- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.md`
- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.json`
- `docs/operations/reusable-audit-artifact-manifest-2026-05-19.md`
- `docs/operations/full-reusable-audit-handoff-2026-05-19.md`
- `.agents/core/project-memory-index.md`
- `.codex/context/TASK_BOARD.md`
- this task record

## Implementation Plan

1. Add an operations playbook with preconditions, rerun order, manifest
   commands, result shape, regression rules, stop conditions, and closure
   checks.
2. Add a machine-readable JSON pair for future automation.
3. Link the playbook pair from the manifest and handoff.
4. Link the playbook pair from the project memory index and task board.
5. Run manifest verification, docs parity, guardrails, and diff checks.

## Acceptance Criteria

- Future agents can find the rerun playbook from the manifest, handoff, memory
  index, and task board.
- The playbook names the baseline manifest and compare command.
- The playbook preserves production/LIVE/exchange safety boundaries.
- No architecture decision or runtime behavior is changed.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` was considered for scope-appropriate evidence.
- [x] Rerun playbook Markdown and JSON pair exists.
- [x] Source-of-truth links are updated.
- [x] Validation commands pass.
- [x] No runtime or production behavior changed.

## Forbidden

- accepting `DEC-AUD-001` or `DEC-AUD-002`
- changing runtime behavior
- production or LIVE/exchange mutation
- existing production data mutation

## Validation Evidence

- `corepack pnpm run audit:manifest:verify`: PASS.
- JSON parse for rerun playbook, manifest, and handoff JSON: PASS.
- `corepack pnpm run audit:rerun-playbook:check`: PASS.
- `corepack pnpm run audit:rerun-playbook:check:test`: PASS.
- `corepack pnpm run docs:parity:check`: PASS.
- `corepack pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with line-ending warnings only.
- Cleanup checks: no `chrome-headless-shell`, no `5432`/`6379` listeners, and
  no running Docker Compose services.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: reusable audit registry, handoff, manifest,
  project memory index, and decision packet references.
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
- Rollback note: remove or supersede the playbook if a later audit automation
  replaces it.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: future reruns had artifacts and commands but no single rerun
  playbook.
- Gaps: comparison rules and closure checks were spread across registry,
  manifest, and handoff docs.
- Inconsistencies: none introduced.
- Architecture constraints: no architecture decision or runtime change.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: registry, handoff, manifest, project memory index, task
  board.
- Rows created or corrected: task board entry and memory-index link.
- Assumptions recorded: playbook is an operational guide, not a new process
  framework.
- Blocking unknowns: none for documentation.
- Why it was safe to continue: all content composes existing audit artifacts.

### 2. Select One Priority Mission Objective
- Selected task: publish rerun playbook.
- Priority rationale: it makes the audit system reusable beyond the current
  thread.
- Why other candidates were deferred: architecture/runtime repairs need
  explicit user decisions.

### 3. Plan Implementation
- Files or surfaces to modify: operations playbook, manifest, handoff, project
  memory index, task board.
- Logic: document existing commands and regression rules.
- Edge cases: production/LIVE/exchange safety boundaries are explicit.

### 4. Execute Implementation
- Implementation notes: no code/runtime changes.

### 5. Verify and Test
- Validation performed: manifest verify including rerun playbook checks, JSON
  parse, direct rerun playbook check, rerun playbook regression tests, docs
  parity, guardrails, diff check, environment cleanup.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave instructions only in final chat.
- Technical debt introduced: no.
- Scalability assessment: future date-specific reruns can copy the playbook
  and update baseline/target paths.
- Refinements made: stop conditions explicitly preserve decision boundaries.

### 7. Update Documentation and Knowledge
- Docs updated: operations playbook, manifest, handoff, project memory index,
  task board.
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

- Task summary: published a reusable audit rerun playbook Markdown/JSON pair
  anchored to the 2026-05-19 baseline.
- Files changed: playbook, manifest, handoff, project memory index, task
  board, and this task record.
- How tested: manifest verify, JSON parse, rerun playbook check, rerun
  playbook regression tests, docs parity, guardrails, diff check, cleanup
  checks.
- What is incomplete: no architecture/runtime decision was accepted.
- Next steps: choose `DEC-AUD-001` and `DEC-AUD-002`, or use this playbook for
  the next full audit rerun.
- Decisions made: no product or architecture decision made.
