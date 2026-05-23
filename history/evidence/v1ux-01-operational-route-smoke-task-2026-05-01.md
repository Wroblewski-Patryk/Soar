# Task

## Header
- ID: V1UX-01
- Title: Lock operational dashboard route smoke for profile, logs, exchanges, and wallet preview
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1COVER-03
- Priority: P1

## Context
The current V1 ledger shows several operational web routes as implemented but
still lightly proven from a route-parity perspective. The architecture route
map already freezes `/dashboard/profile`, `/dashboard/logs`,
`/dashboard/exchanges`, and `/dashboard/wallets/:id/preview` as canonical
surfaces. This task closes a local parity gap by locking those routes with
focused web smoke tests instead of changing runtime behavior.

## Goal
Add route-level smoke coverage proving the canonical operational screens and
redirect entrypoints still render the expected surface or redirect target.

## Scope
- `apps/web/src/app/dashboard/profile/page.test.tsx`
- `apps/web/src/app/dashboard/logs/page.test.tsx`
- `apps/web/src/app/dashboard/exchanges/page.test.tsx`
- `apps/web/src/app/dashboard/wallets/[id]/preview/page.test.tsx`
- `apps/web/src/i18n/routeLocaleSmoke.test.ts`
- `docs/modules/web-profile.md`
- `docs/modules/web-logs.md`
- `docs/modules/web-exchanges.md`
- `docs/modules/web-wallets.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Add focused route tests for `profile`, `logs`, and `exchanges`.
2. Tighten the existing wallet preview route test with breadcrumb/heading proof.
3. Extend route-locale smoke coverage for `logs` and wallet preview route keys.
4. Sync module docs and canonical planning/context notes.
5. Run focused web tests plus `web` typecheck and repository guardrails.

## Acceptance Criteria
- [x] `profile` route proves default/basic and `#api` hash-synced content.
- [x] `logs` route proves the canonical page shell renders the audit view.
- [x] `exchanges` route proves canonical redirect to `/dashboard/profile#api`.
- [x] Wallet preview route test proves canonical page shell remains intact.
- [x] Route locale smoke includes `logs` and wallet preview route keys.
- [x] Canonical planning/context docs record the completed slice.

## Success Signal
- User or operator problem: canonical operational routes can drift without a
  small, explicit route-level regression lock.
- Expected product or reliability outcome: the shipped app stays aligned with
  the documented dashboard route map for important V1 operational screens.
- How success will be observed: focused web tests, `web` typecheck, and
  guardrails pass.
- Post-launch learning needed: no

## Deliverable For This Stage
Focused automated verification coverage plus synchronized canonical docs/context
for the operational route smoke slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Focused route smoke tests are added and passing.
- [x] Existing route behavior is unchanged.
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
  - `pnpm --filter web run test -- --run src/app/dashboard/profile/page.test.tsx src/app/dashboard/logs/page.test.tsx src/app/dashboard/exchanges/page.test.tsx src/app/dashboard/wallets/[id]/preview/page.test.tsx src/i18n/routeLocaleSmoke.test.ts`
  - PASS: included in the refreshed focused route-smoke pack:
    `pnpm --filter web exec vitest run ...` (`18/18` files, `19/19` tests)
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks: not applicable
- Screenshots/logs: not applicable
- High-risk checks: route redirect and hash-synced tab behavior

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: not applicable
- Design source reference: canonical route map + existing module surfaces
- Canonical visual target: existing dashboard route shells
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: `PageTitle`, hash-synced `Tabs`, route wrappers
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
- Accessibility checks: route shells keep heading/breadcrumb structure
- Parity evidence: page tests and route locale smoke

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: none
- Rollback note: revert page tests/docs only
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
- Task summary: added route-level smoke locks for canonical profile, logs,
  exchanges redirect, and wallet preview dashboard surfaces.
- Files changed: route tests, route locale smoke, module docs, planning/context
  docs.
- How tested: focused web route tests, `web` typecheck, repository guardrails.
- What is incomplete: this does not replace protected production/browser V1
  evidence.
- Next steps: continue with `V1UX-A` by adding route/browser proof for the same
  surfaces once stage/prod evidence work is unblocked.
