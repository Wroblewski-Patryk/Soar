# Task

## Header
- ID: V1UX-REPORTS-01
- Title: Lock canonical reports route shell smoke
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UX-01
- Priority: P1

## Context
The current local V1 route-parity work already locked the canonical
`/dashboard/profile`, `/dashboard/logs`, `/dashboard/exchanges`, and wallet
preview surfaces. The canonical route map also freezes `/dashboard/reports` as
the analytics route, but the app route still lacked a dedicated shell-level
smoke test proving the page title, breadcrumb shell, and feature mount stay
aligned with that contract.

## Goal
Add focused route-level smoke coverage for the canonical reports page without
changing runtime behavior.

## Scope
- `apps/web/src/app/dashboard/reports/page.test.tsx`
- `docs/modules/web-reports.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Add a focused page-shell test for `/dashboard/reports`.
2. Reuse the existing route-shell verification pattern from the recent
   operational route smoke slice.
3. Sync reports module docs to include the route-shell regression evidence.
4. Sync canonical planning/context docs for the completed tiny slice.
5. Run focused web validation available in this environment.

## Acceptance Criteria
- [x] `/dashboard/reports` has a dedicated route-shell smoke test.
- [x] The test proves heading, breadcrumb shell, and reports feature mount.
- [x] Reports module docs mention the route-shell coverage.
- [x] Canonical planning/context docs record the completed slice.

## Success Signal
- User or operator problem: the canonical reports route can drift without a
  small route-level regression lock.
- Expected product or reliability outcome: the documented analytics route stays
  aligned with the shipped page shell.
- How success will be observed: the focused route test exists and `web`
  typecheck passes; route-test execution is attempted and recorded honestly.
- Post-launch learning needed: no

## Deliverable For This Stage
Focused automated verification coverage plus synchronized docs/context for the
reports route shell.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Route-shell smoke test is added.
- [x] Existing reports behavior is unchanged.
- [x] Canonical docs/context are updated.

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
    route-smoke pack including `src/app/dashboard/reports/page.test.tsx`
    (`18/18` files, `19/19` tests)
  - PASS: `node node_modules/typescript/bin/tsc -p apps/web/tsconfig.json --noEmit`
  - PASS: `pnpm --filter web run build`
  - PASS: `pnpm run quality:guardrails`
- Manual checks: not applicable
- Screenshots/logs: not applicable
- High-risk checks: not applicable

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: not applicable
- Design source reference: canonical route map + existing reports surface
- Canonical visual target: existing dashboard route shell
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: `PageTitle` route shell
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
- Parity evidence: page-shell test

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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: added a dedicated shell smoke test for the canonical reports
  route and synced the supporting docs/context.
- Files changed: reports page test, reports module doc, planning/context docs.
- How tested: focused route-smoke pack PASS, `web` typecheck PASS, `web` build
  PASS, repository guardrails PASS.
- What is incomplete: this does not replace production browser evidence for the
  reports surface.
- Next steps: continue the local route-smoke track with the next unverified
  canonical operational surface that is still safe to prove locally.
