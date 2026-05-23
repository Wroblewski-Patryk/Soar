# V1MANUAL-01 Web Legacy Route Evidence Sync Task

## Header

- ID: `V1MANUAL-01`
- Title: `qa(web): align V1 manual route evidence with runtime IA`
- Task Type: `fix`
- Current Stage: `post-release`
- Status: `DONE`
- Owner: `QA/Test`
- Depends on: `V1GATE-02`
- Priority: `P0`
- Iteration: `2026-05-07-06`
- Operation Mode: `ARCHITECT`

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context

The canonical dashboard route map says first-level `/dashboard/orders` and
`/dashboard/positions` are legacy web redirects to the runtime bot view, while
the backend API still exposes `/dashboard/orders*` and `/dashboard/positions*`
as protected API contracts. The V1 function ledger still asked for production
web smoke against standalone `/dashboard/positions`, which could send the final
manual evidence pass toward a retired IA destination.

## Goal

Align the V1 manual evidence rows with the approved route contract and add a
focused local regression proving legacy web routes redirect to the canonical
runtime view.

## Scope

- `apps/web/src/middleware.ts`
- `apps/web/src/middleware.test.ts`
- `history/artifacts/v1-function-coverage-matrix-2026-05-01.csv`
- `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan

1. Confirm the canonical route-map contract for legacy web paths.
2. Add a focused middleware test for authenticated legacy redirects and
   unauthenticated fail-closed behavior.
3. Update V1 readiness rows to distinguish API smoke from web legacy redirect
   smoke.
4. Run targeted validation and repository guardrails.
5. Sync project state and planning queue.

## Acceptance Criteria

- [x] `/dashboard/orders` redirects to `/dashboard/bots/runtime?legacy=orders`
  for authenticated web requests.
- [x] `/dashboard/positions` redirects to
  `/dashboard/bots/runtime?legacy=positions` for authenticated web requests.
- [x] Unauthenticated legacy dashboard requests still redirect to
  `/auth/login` before legacy routing.
- [x] V1 manual rows no longer require standalone web `/dashboard/positions`
  as an active screen.
- [x] API `/dashboard/orders*` and `/dashboard/positions*` remain documented as
  protected backend contracts, not removed or renamed.

## Definition of Done

- [x] Focused test passes.
- [x] Guardrails pass.
- [x] Documentation and context are updated.
- [x] No architecture workaround, duplicate route, or temporary bypass is
  introduced.

## Forbidden

- Do not add a new web route for `/dashboard/orders` or `/dashboard/positions`.
- Do not change backend API contracts.
- Do not weaken auth or middleware behavior.
- Do not run production live-money mutations.

## Validation Evidence

- Tests:
  - `pnpm --filter web run test -- src/middleware.test.ts --run` -> PASS
    (`3/3`).
- Manual checks:
  - Read `docs/architecture/reference/dashboard-route-map.md`.
  - Read `apps/web/src/middleware.ts`.
- Screenshots/logs:
  - Not applicable; this is a route contract and docs-evidence sync.
- High-risk checks:
  - Unauthenticated legacy requests still fail closed to `/auth/login`.

## Architecture Evidence

- Architecture source reviewed:
  - `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, in V1 evidence wording only.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none; canonical route map was already
  correct.

## Deployment / Ops Evidence

- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: V1 manual readiness rows now require API read smoke plus
  web legacy redirect proof.
- Rollback note: revert the middleware test and evidence wording if the route
  map is intentionally changed later.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: V1 evidence text treated `/dashboard/positions` as if it were an
  active web screen.
- Gaps: No focused local middleware test covered legacy dashboard redirects.
- Inconsistencies: Route map and middleware were aligned, but V1 manual rows
  were stale.
- Architecture constraints: First-level web `/dashboard/orders` and
  `/dashboard/positions` must remain legacy redirects; backend API contracts
  remain valid.

### 2. Select One Priority Task

- Selected task: `V1MANUAL-01`.
- Priority rationale: The final V1 manual matrix should verify the right
  operator and API surfaces before any production proof is collected.
- Why other candidates were deferred: Authenticated production readbacks and
  live-money/manual samples still require operator credentials or explicit
  live-risk execution plans.

### 3. Plan Implementation

- Files or surfaces to modify: one web middleware test and V1 evidence docs.
- Logic: test the existing redirect contract; update evidence wording without
  changing route behavior.
- Edge cases: unauthenticated legacy requests must hit login before legacy
  redirect logic.

### 4. Execute Implementation

- Implementation notes: Added `apps/web/src/middleware.test.ts` and updated the
  V1 coverage/readiness rows for orders and positions.

### 5. Verify and Test

- Validation performed:
  - `pnpm --filter web run test -- src/middleware.test.ts --run`
- Result: PASS (`3/3`).

### 6. Self-Review

- Simpler option considered: docs-only correction. Rejected because a local
  middleware regression makes the evidence contract executable.
- Technical debt introduced: no.
- Scalability assessment: The test is narrow and follows the existing
  middleware boundary.
- Refinements made: Kept API and web route language separate to avoid hiding
  valid backend contracts.

### 7. Update Documentation and Knowledge

- Docs updated:
  - `history/artifacts/v1-function-coverage-matrix-2026-05-01.csv`
  - `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
  - `history/evidence/v1manual-web-legacy-route-evidence-sync-task-2026-05-07.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- Learning journal updated: not applicable.

## Result Report

`V1MANUAL-01` is closed locally. The final V1 manual matrix now asks for
authenticated API read-only proof on `/dashboard/orders*` and
`/dashboard/positions*`, plus web legacy redirect proof for retired first-level
web routes. The local middleware regression confirms both legacy redirects and
the unauthenticated fail-closed login path.
