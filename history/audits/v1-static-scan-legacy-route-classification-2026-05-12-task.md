# Task

## Header
- ID: V1-STATIC-SCAN-LEGACY-ROUTE-CLASSIFICATION-2026-05-12
- Title: ops(scan): classify approved legacy web routes
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12`
- Priority: P1
- Module Confidence Rows: not applicable
- Requirement Rows: `REQ-FUNC-019`
- Quality Scenario Rows: not applicable
- Risk Rows: not applicable
- Iteration: 34
- Operation Mode: BUILDER
- Mission ID: `V1-STATIC-SCAN-LEGACY-ROUTE-CLASSIFICATION-2026-05-12`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the current V1 continuation.
- [x] `.agents/core/mission-control.md` was reviewed in the current V1 continuation.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: make the static scan respect approved legacy web redirect ownership.
- Release objective advanced: remove false-positive P1 local gaps that conflict with the canonical route map.
- Included slices: scanner classification update, V1 generator refresh, validation.
- Explicit exclusions: no route additions, no UI behavior changes, no production evidence claims.
- Checkpoint cadence: after scanner change and after generator refresh.
- Stop conditions: scanner change would suppress non-approved routes or source markers.
- Handoff expectation: route/feature findings for approved `/dashboard/orders` and `/dashboard/positions` ownership are removed, while V1 remains `NO-GO`.

## Context
The static scan still reports missing `/dashboard/orders` and `/dashboard/positions` pages plus empty Orders web feature as P1 gaps. The canonical route map states those first-level routes must remain legacy redirects, and the updated module docs document Dashboard Home/Bot Runtime ownership.

## Goal
Update the static scan to stop treating approved legacy redirect routes and runtime-owned feature shells as implementation gaps.

## Scope
- `scripts/runV1StaticIssueScan.mjs`
- generated V1 index/scan/ledger/scorecard artifacts
- source-of-truth state docs if counts change

## Implementation Plan
1. Add a narrow approved legacy redirect classification for `/dashboard/orders` and `/dashboard/positions`.
2. Add a narrow runtime-owned feature classification for Orders/Positions web feature shells.
3. Refresh V1 project index, static scan, master ledger, and scorecard.
4. Run guardrails and diff checks.

## Acceptance Criteria
- Static scan no longer reports the approved legacy route/page gaps.
- Static scan still reports real P0/P1 blockers.
- V1 remains honestly `NO-GO`.

## Definition of Done
- [x] Scanner updated.
- [x] V1 generators pass and route false positives are removed.
- [x] Guardrails pass.

## Deliverable For This Stage
Updated static scan classification and refreshed V1 status artifacts.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Forbidden
- adding the legacy pages as active IA destinations
- suppressing Operations `BLOCKED_AUTH`
- claiming production clickthrough or V1 release readiness
- secret values

## Validation Evidence
- Tests: `node --check scripts/runV1StaticIssueScan.mjs` -> PASS; V1 generator chain -> PASS; `pnpm run quality:guardrails` -> PASS; `git diff --check` -> PASS.
- Manual checks: refreshed static scan reports `34` findings (`P0:1`, `P1:2`, `P2:31`); concrete non-proof gaps are reduced to `1`; Operations remains the only P0.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`, `apps/web/src/middleware.ts`, `docs/modules/web-orders.md`, `docs/modules/web-positions.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: static scan classifies approved legacy redirects as missing pages.
- Gaps: scanner lacks route-map-aware exceptions for the approved V1 IA.
- Inconsistencies: route map says keep redirects; scan recommends adding pages or reclassifying ownership.
- Architecture constraints: first-level Orders/Positions web routes remain redirects.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: route map, middleware, module docs, scanner.
- Assumptions recorded: narrow allowlist is safe because it matches explicit canonical route-map entries.
- Blocking unknowns: none.
- Why it was safe to continue: no runtime behavior changes.

### 2. Select One Priority Mission Objective
- Selected task: classify approved legacy routes correctly in static scan.
- Priority rationale: remaining P1 findings include false-positive route/feature gaps.
- Why other candidates were deferred: queue classification and protected evidence are separate tasks.

### 3. Plan Implementation
- Files or surfaces to modify: scanner and generated artifacts.
- Logic: skip only approved legacy routes and runtime-owned feature shells.
- Edge cases: do not suppress route gaps outside the explicit allowlist.

### 4. Execute Implementation
- Implementation notes: added narrow scan classification for approved legacy dashboard redirects and runtime-owned Orders/Positions web feature shells.

### 5. Verify and Test
- Validation performed: script syntax check, V1 generators, guardrails, diff check.
- Result: PASS; approved route false positives were removed while Operations remained a P0 blocker.

### 6. Self-Review
- Simpler option considered: add pages; rejected because the route map forbids making these active IA destinations.
- Technical debt introduced: no
- Scalability assessment: narrow and explicit; future route exceptions must update this script and route map together.
- Refinements made: kept the allowlist explicit to avoid suppressing unrelated route gaps.

### 7. Update Documentation and Knowledge
- Docs updated: generated V1 operations artifacts and task report.
- Context updated: project state, current focus, next steps, task board, MVP next commits.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: updated static scan classification for approved legacy Orders/Positions web routing.
- Files changed: static scan script, generated V1 artifacts, source-of-truth docs.
- How tested: script syntax check, V1 generators, guardrails, diff check.
- What is incomplete: V1 remains `NO-GO`; remaining concrete gap is queue marker classification, and release readiness remains blocked by protected Operations evidence.
- Next steps: classify remaining queue markers or execute the operator unblock packet with approved inputs.
- Decisions made: no product decision; scanner now follows the existing route-map decision.
