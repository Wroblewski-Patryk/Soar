# Task

## Header
- ID: V1UX-ROUTES-02
- Title: Lock canonical CRUD and details route shells for markets, strategies, and backtests
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UX-REPORTS-01
- Priority: P1

## Context
The local V1 route-smoke slice already covered profile, logs, exchanges,
wallet preview, and reports. The canonical route map also freezes the main
App Router entrypoints for `markets`, `strategies`, and `backtests`, but those
surfaces still relied mostly on component tests instead of route-shell locks.
This task closes that gap without changing runtime behavior.

## Goal
Add focused route-level smoke coverage for the canonical CRUD/detail dashboard
routes of `markets`, `strategies`, and `backtests`.

## Scope
- `apps/web/src/app/dashboard/markets/list/page.test.tsx`
- `apps/web/src/app/dashboard/markets/create/page.test.tsx`
- `apps/web/src/app/dashboard/markets/[id]/edit/page.test.tsx`
- `apps/web/src/app/dashboard/strategies/list/page.test.tsx`
- `apps/web/src/app/dashboard/strategies/create/page.test.tsx`
- `apps/web/src/app/dashboard/strategies/[id]/page.test.tsx`
- `apps/web/src/app/dashboard/strategies/[id]/edit/page.test.tsx`
- `apps/web/src/app/dashboard/backtests/list/page.test.tsx`
- `apps/web/src/app/dashboard/backtests/create/page.test.tsx`
- `apps/web/src/app/dashboard/backtests/[id]/page.test.tsx`
- `docs/modules/web-markets.md`
- `docs/modules/web-strategies.md`
- `docs/modules/web-backtest.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Implementation Plan
1. Add route-shell smoke tests for canonical `markets` list/create/edit routes.
2. Add route-shell smoke tests for canonical `strategies` list/create/edit
   routes plus the legacy detail redirect.
3. Add route-shell smoke tests for canonical `backtests` list/create/detail
   routes.
4. Sync module docs and canonical planning/context notes.
5. Run the strongest local validation available in this sandbox and record the
   exact limitations honestly.

## Acceptance Criteria
- [x] `markets` canonical list/create/edit routes have dedicated shell smoke.
- [x] `strategies` canonical list/create/edit routes plus `/:id -> /edit`
  redirect have dedicated shell smoke.
- [x] `backtests` canonical list/create/detail routes have dedicated shell
  smoke.
- [x] Module docs mention the new route-shell evidence.
- [x] Canonical planning docs record the completed slice.

## Success Signal
- User or operator problem: canonical CRUD/detail routes can drift even while
  component tests stay green.
- Expected product or reliability outcome: the shipped App Router shells stay
  aligned with the documented dashboard route map.
- How success will be observed: route-shell tests exist and `web` typecheck
  passes in the current environment.
- Post-launch learning needed: no

## Deliverable For This Stage
Focused automated verification coverage plus synchronized docs/context for the
remaining canonical CRUD/detail route shells.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Route-shell smoke tests are added for the declared routes.
- [x] Existing route behavior is unchanged.
- [x] Canonical planning docs are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - PASS: `pnpm --filter web exec vitest run ...` refreshed focused
    route-smoke pack including markets, strategies, and backtests route shells
    (`18/18` files, `19/19` tests)
  - PASS: `node node_modules/typescript/bin/tsc -p apps/web/tsconfig.json --noEmit`
  - PASS: `pnpm --filter web run build`
  - PASS: `pnpm run quality:guardrails`
- Manual checks: not applicable
- Screenshots/logs: not applicable
- High-risk checks: canonical redirect targets and route-shell heading/breadcrumb structure

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: not applicable
- Design source reference: canonical route map + existing dashboard route shells
- Canonical visual target: existing dashboard route shells
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: `PageTitle`, form page wrappers, route redirects
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none in scope
- Required states: success
- Responsive checks: not applicable
- Input-mode checks: keyboard
- Accessibility checks: heading and breadcrumb navigation remain present
- Parity evidence: route-shell page tests

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: none
- Rollback note: revert test/docs only
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs were updated; context sync was attempted and blocked by file permissions in this sandbox.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: added route-shell smoke locks for the remaining canonical
  CRUD/detail dashboard routes in `markets`, `strategies`, and `backtests`.
- Files changed: route tests, module docs, planning docs, task packet.
- How tested: focused route-smoke pack PASS, `web` typecheck PASS, `web` build
  PASS, repository guardrails PASS.
- What is incomplete: this does not replace protected production/browser V1
  evidence for these surfaces.
- Next steps: continue `V1UX-A` with local route-shell coverage for any other
  canonical App Router entrypoint still missing explicit smoke, then resume
  production UI evidence when external blockers are cleared.
