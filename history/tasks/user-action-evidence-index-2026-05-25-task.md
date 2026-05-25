# Task

## Header
- ID: USER-ACTION-EVIDENCE-INDEX-2026-05-25
- Title: Add user-action evidence index and triage command
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Coordinator
- Depends on: `FUNCTION-JOURNEY-EVIDENCE-INDEX-2026-05-25`
- Priority: P1
- Module Confidence Rows: Architecture Evidence Graph / documentation-process override
- Requirement Rows: `REQ-DOC-030`
- Quality Scenario Rows: QA traceability / maintainability
- Risk Rows: proof-boundary overclaiming
- Iteration: 2026-05-25
- Operation Mode: BUILDER
- Mission ID: `SOAR-FULL-READINESS-COORDINATION-2026-05-23`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the selected builder checkpoint.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active state summary and current source-of-truth updates.
- [x] `.agents/core/mission-control.md` was represented through the active mission packet.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: make UI route/control changes traceable through API, backend, data, tests, docs, and proof boundaries before repair claims.
- Release objective advanced: reduce repeated rediscovery of broken or unproven user journeys.
- Included slices: user-action index generator, triage command, generated CSV/JSON/Markdown/artifact outputs, source-of-truth sync.
- Explicit exclusions: no runtime behavior changes, no browser automation runner, no production proof, no LIVE mutation.
- Checkpoint cadence: complete one local tooling slice and record residual proof gaps.
- Stop conditions: do not mark protected or money-facing paths as production verified from local indexes.
- Handoff expectation: future UI repairs start with `architecture:journey:triage`.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, active mission, project state | Integration, source-of-truth updates | Mission checkpoint | Parent validation gate | DONE |
| Architecture | Coordinator | Architecture graph system | Generated index contract | Docs update | Graph/index generation | DONE |
| Implementation | Coordinator | Existing script patterns | `scripts/generateUserActionIndex.mjs`, `scripts/triageJourneyEvidence.mjs`, `package.json` | Tooling | syntax + command proof | DONE |
| QA/Test | Coordinator | Generated indexes | CSV/JSON/status outputs | Local proof | strict index, triage sample, JSON parse | DONE |
| Documentation/Memory | Coordinator | State files and task history | context/state/task docs | Source-of-truth sync | review + guardrails | DONE |

## Context
The architecture graph and function journey index could identify web pages,
function chains, and API surfaces, but a UI repair still needed a more direct
route/control-to-proof map.

## Goal
Create a generated user-action evidence index and triage command so future UI
changes can be followed through the whole coded path before claiming they work.

## Success Signal
- User or operator problem: repeated "this does not work" reports require too much rediscovery.
- Expected product or reliability outcome: agents can start from a route, control, API, chain, or file fragment and find linked proof boundaries.
- How success will be observed: generated rows and triage output show action, API routes, backend functions, data models, tests, docs, evidence, and gaps.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Verified local tooling plus generated artifacts and source-of-truth updates.

## Constraints
- Reuse existing architecture graph CSV records.
- Do not change runtime application behavior.
- Do not downgrade protected proof boundaries.
- Keep repository artifacts in English.

## Definition of Done
- [x] User-action index generated from graph page/UI records.
- [x] Triage command can route an action/query to API/backend/test/proof context.
- [x] Strict generation has zero critical action gaps.
- [x] Source-of-truth state records the new workflow and residual high proof gaps.

## Validation Evidence
- Tests:
  - `node --check scripts\generateUserActionIndex.mjs`
  - `node --check scripts\triageJourneyEvidence.mjs`
  - `pnpm run architecture:journey:index`
  - `pnpm run architecture:journey:index:strict`
  - `pnpm run architecture:journey:triage -- --query SOAR-UI-MANUAL-ORDER-SUBMIT`
- Manual checks: generated CSV/status review for manual order and strategy create routes.
- Screenshots/logs: not applicable.
- High-risk checks: high proof gaps remain high; no production or LIVE claim was made.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Risk register updated: not applicable for a local tooling-only slice.
- Reality status: verified locally.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-evidence-graph-system.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: user-action index and triage command documented.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: function/API/page indexes existed, but user-action-level repair routing was missing.
- Gaps: no generated control/route action map and no triage command.
- Inconsistencies: `known-issues.md` still had superseded graph-backfill language.
- Architecture constraints: graph CSV remains source of truth.

### 2. Select One Priority Mission Objective
- Selected task: add user-action evidence index and triage command.
- Priority rationale: this directly supports safe future UI changes.
- Why other candidates were deferred: browser runner and production proof need auth/VPS context.

### 3. Plan Implementation
- Files or surfaces to modify: scripts, package scripts, generated index/status/artifact outputs, architecture docs, state files.
- Logic: infer route visit actions from page nodes, explicit actions from UI element records, then connect APIs, chains, backend functions, data, tests, docs, evidence, and gaps.
- Edge cases: redirects, public routes, local-only proof, protected/money-facing paths.

### 4. Execute Implementation
- Implementation notes: generated `39` action rows and added a query-driven triage command.

### 5. Verify and Test
- Validation performed: syntax checks, normal and strict generation, triage sample.
- Result: pass; `0` critical action gaps, `37` high proof gaps.

### 6. Self-Review
- Simpler option considered: prose-only checklist.
- Technical debt introduced: no runtime debt; future improvement is browser runner automation.
- Scalability assessment: generated CSV/JSON can be consumed by future runner or agents.
- Refinements made: route inference and explicit UI-to-page mapping were corrected during verification.

### 7. Update Documentation and Knowledge
- Docs updated: architecture evidence graph system, state files, task history.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report

- Task summary: added user-action evidence indexing and journey triage tooling.
- Files changed: scripts, package scripts, generated architecture/status/artifact outputs, source-of-truth state files.
- How tested: syntax checks, generation, strict generation, triage sample.
- What is incomplete: high proof gaps remain until authenticated browser/protected production proof exists.
- Next steps: add browser proof runner and evidence freshness gate when auth/VPS context is available.
- Decisions made: high protected/money-facing proof gaps are preserved rather than relabeled as verified.
