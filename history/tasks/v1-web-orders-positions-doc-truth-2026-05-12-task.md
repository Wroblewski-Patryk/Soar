# Task

## Header
- ID: V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12
- Title: docs(web): align orders and positions module truth
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Product Docs Agent
- Depends on: `V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12`
- Priority: P1
- Module Confidence Rows: `SOAR-ORDERS-001`, `SOAR-POSITIONS-001`, `SOAR-DASHBOARD-HOME-001`, `SOAR-BOT-RUNTIME-001`
- Requirement Rows: `REQ-FUNC-010`, `REQ-FUNC-011`, `REQ-FUNC-019`
- Quality Scenario Rows: not applicable
- Risk Rows: not applicable
- Iteration: 32
- Operation Mode: BUILDER
- Mission ID: `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12`
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
- Mission objective: remove stale module-doc wording that makes approved Orders/Positions web ownership look unfinished.
- Release objective advanced: reduce concrete P1 documentation drift in the V1 ledger.
- Included slices: docs truth update, generator refresh, validation.
- Explicit exclusions: no new routes, no IA change, no UI implementation.
- Checkpoint cadence: after docs update and after generator refresh.
- Stop conditions: architecture route map contradicts the intended doc truth.
- Handoff expectation: static scan no longer reports web Orders/Positions documented-placeholder gaps.

## Context
The V1 static scan reports P1 documented-placeholder gaps for `docs/modules/web-orders.md` and `docs/modules/web-positions.md`. The canonical route map says `/dashboard/orders` and `/dashboard/positions` must remain legacy redirects to Bot Runtime. Runtime Orders and Positions UX is owned by Dashboard Home and Bot Runtime, with Positions retaining a narrow service helper for manual update commands.

## Goal
Update the web Orders and Positions module docs to reflect current approved ownership instead of stale unfinished-module wording.

## Scope
- `docs/modules/web-orders.md`
- `docs/modules/web-positions.md`
- generated V1 index/scan/ledger/scorecard artifacts
- source-of-truth state docs if counts change

## Implementation Plan
1. Rewrite the two module docs around canonical ownership and legacy redirect behavior.
2. Refresh V1 project index, static scan, master ledger, and scorecard.
3. Run guardrails and diff checks.
4. Sync source-of-truth docs with updated finding counts.

## Acceptance Criteria
- Docs align with `docs/architecture/reference/dashboard-route-map.md`.
- Static scan no longer flags `DOC_PLACEHOLDER_DOCS_MODULES_WEB_ORDERS_MD`.
- Static scan no longer flags `DOC_PLACEHOLDER_DOCS_MODULES_WEB_POSITIONS_MD`.
- V1 remains honestly `NO-GO`.

## Definition of Done
- [x] Module docs updated.
- [x] V1 generators pass and the two P1 doc gaps are removed.
- [x] Guardrails pass.

## Deliverable For This Stage
Updated web Orders/Positions module docs and refreshed V1 status artifacts.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Forbidden
- adding `/dashboard/orders` or `/dashboard/positions` pages in this task
- changing middleware route behavior
- claiming production clickthrough or V1 release readiness
- secret values

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/middleware.test.ts --reporter verbose` -> PASS (`3/3`); V1 generator chain -> PASS; `pnpm run quality:guardrails` -> PASS; `git diff --check` -> PASS.
- Manual checks: refreshed static scan no longer reports `DOC_PLACEHOLDER_DOCS_MODULES_WEB_ORDERS_MD` or `DOC_PLACEHOLDER_DOCS_MODULES_WEB_POSITIONS_MD`; findings are now `39` (`P0:1`, `P1:6`, `P2:32`).
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`, `apps/web/src/middleware.ts`, `apps/web/src/middleware.test.ts`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: module docs describe the approved web ownership model as unfinished.
- Gaps: static scan classifies both docs as P1 documented-placeholder gaps.
- Inconsistencies: route map and middleware are clear, docs are stale.
- Architecture constraints: first-level Orders/Positions web routes remain redirects.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: route map, middleware, middleware tests, current web module docs.
- Assumptions recorded: docs-only update is enough because architecture already approves redirect ownership.
- Blocking unknowns: none.
- Why it was safe to continue: no route or runtime behavior changes are involved.

### 2. Select One Priority Mission Objective
- Selected task: align web Orders/Positions docs with canonical route ownership.
- Priority rationale: two concrete P1 doc drift findings are locally executable.
- Why other candidates were deferred: production evidence requires auth; route implementation would contradict current route map.

### 3. Plan Implementation
- Files or surfaces to modify: two module docs and generated status artifacts.
- Logic: document consolidated ownership and redirect-only compatibility.
- Edge cases: avoid wording that scanner correctly treats as unfinished state.

### 4. Execute Implementation
- Implementation notes: rewrote `web-orders` and `web-positions` docs to describe Dashboard Home/Bot Runtime ownership and legacy redirect compatibility.

### 5. Verify and Test
- Validation performed: middleware redirect tests, V1 generators, guardrails, diff check.
- Result: PASS; the two P1 documented-placeholder gaps are removed from the 2026-05-12 static scan.

### 6. Self-Review
- Simpler option considered: add dedicated route pages; rejected because the route map explicitly says these are legacy redirects.
- Technical debt introduced: no
- Scalability assessment: no runtime impact.
- Refinements made: kept route behavior unchanged and aligned wording to the canonical route map.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-orders.md`, `docs/modules/web-positions.md`, generated V1 operations artifacts, and this task report.
- Context updated: project state, task board, current focus, next steps, MVP next commits.
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
- Task summary: aligned web Orders/Positions module docs with canonical runtime ownership and legacy redirect behavior.
- Files changed: two module docs, generated V1 artifacts, and source-of-truth docs.
- How tested: focused middleware test `3/3`, V1 generators, guardrails, diff check.
- What is incomplete: V1 remains `NO-GO`; production-safe clickthrough and protected Operations evidence remain open.
- Next steps: classify or resolve the remaining concrete gaps, or execute the operator unblock packet with approved inputs.
- Decisions made: no new product decision; docs now follow the existing route-map decision.
