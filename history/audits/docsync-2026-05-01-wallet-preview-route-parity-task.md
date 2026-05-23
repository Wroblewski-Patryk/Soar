# Task

## Header
- ID: DOCSYNC-2026-05-01-WALLET-PREVIEW
- Title: Sync canonical wallet preview route with the shipped web route
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: `WLEDGER-07..09`, `WPREVIEW-10`
- Priority: P1

## Context
The web app already ships a canonical wallet preview page at
`/dashboard/wallets/:id/preview`, and the wallets module deep-dive documents
that route. The route inventory in
`docs/architecture/reference/dashboard-route-map.md` was not updated with that
view, which leaves the canonical route source of truth behind the working app.

## Goal
Restore parity between the shipped wallet preview route and the canonical route
map, and lock the route with a lightweight page-level test.

## Success Signal
- User or operator problem: route-level source-of-truth docs can miss the
  wallet preview view even though the app exposes it.
- Expected product or reliability outcome: route inventory and test coverage
  accurately reflect the current wallet preview surface.
- How success will be observed: the route map lists
  `/dashboard/wallets/:id/preview` and the page test proves the route renders
  the preview panel for the selected wallet id.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified docs parity plus a focused route test for the existing wallet preview
page.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `docs/architecture/reference/dashboard-route-map.md`
- `apps/web/src/app/dashboard/wallets/[id]/preview/page.test.tsx`
- canonical queue note for this drift sync

## Implementation Plan
1. Confirm that the wallet preview route is already implemented and referenced
   by the wallets module docs.
2. Add the missing route entry to the canonical dashboard route inventory.
3. Add a focused page test that proves the canonical preview route renders the
   wallet preview panel for the selected id.
4. Sync the operational queue with a closed docs-parity task note.
5. Run focused web test coverage for the new route.

## Acceptance Criteria
- The canonical route inventory includes `/dashboard/wallets/:id/preview`.
- The wallet preview page has a focused route-level regression test.
- Planning/queue docs record the parity sync as a completed tiny task.

## Definition of Done
- [x] Canonical route map reflects the shipped wallet preview route.
- [x] Focused route-level test exists for the wallet preview page.
- [x] A planning artifact records the parity sync and validation evidence.

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
- Tests: `pnpm --filter web exec vitest run src/app/dashboard/wallets/[id]/preview/page.test.tsx`
- Manual checks: confirmed shipped route file at
  `apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx`
- Screenshots/logs: not applicable
- High-risk checks: not applicable

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: route inventory parity only

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: shipped wallet preview route implementation
- Canonical visual target: existing wallet preview page
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: `PageTitle` + `WalletPreviewPanel`
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy: existing page unchanged
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none in this scope
- Required states: success
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: page title text is rendered in the focused test
- Parity evidence: route inventory now matches the existing page contract

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: none
- Rollback note: revert docs/test only
- Observability or alerting impact: none
- Staged rollout or feature flag: none

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

## Notes
This task intentionally avoids touching the dirty wallet preview implementation
files already present in the worktree. The scope is limited to route-contract
parity and lightweight coverage.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations, mock-only
paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: operators relying on canonical route docs
- Existing workaround or pain: route parity had to be inferred from code/module
  docs instead of the route map
- Smallest useful slice: docs parity plus one route test
- Success metric or signal: route map and route test stay aligned
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: wallet preview navigation from list
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused Vitest route test
- Rollback or disable path: revert docs/test only

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: no
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: no
- Error state verified: no
- Refresh/restart behavior verified: no
- Regression check performed: yes

## AI Testing Evidence (required for AI features)

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: none
- Trust boundaries: none changed
- Permission or ownership checks: none changed
- Abuse cases: none introduced
- Secret handling: none
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: route inventory can drift again if future route additions skip
  the canonical map update step

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: synced the canonical dashboard route inventory with the shipped
  wallet preview route and added a focused page test for that route.
- Files changed:
  - `docs/architecture/reference/dashboard-route-map.md`
  - `apps/web/src/app/dashboard/wallets/[id]/preview/page.test.tsx`
- How tested: focused web Vitest route test
- What is incomplete: production browser evidence for wallet preview remains a
  separate `V1UX-A` task
- Next steps: browser-check `wallet preview` on the current production SHA once
  the external evidence wave resumes
- Decisions made: keep the task strictly on docs parity + lightweight route
  coverage, with no edits in the dirty wallet preview implementation files
