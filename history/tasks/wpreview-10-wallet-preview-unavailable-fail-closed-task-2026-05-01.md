# Task

## Header
- ID: WPREVIEW-10
- Title: Make wallet preview fail closed when ledger completeness is unavailable
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: WLEDGER-07..09
- Priority: P1

## Context
The active `NOW` queue is currently blocked on protected production evidence and
stage/Coolify access. The wallet preview remains a high-value V1 operator view
already aligned to the approved ledger architecture, so the next smallest safe
local slice is to tighten one truthfulness gap in that canonical screen.

The accepted wallet ledger contract explicitly says `UNAVAILABLE` completeness
must render an empty or error state rather than a chart or summary with fake
data. The current web component still rendered summary/timeline/events sections
after showing the unavailable empty state, which weakened fail-closed operator
truth.

## Goal
Ensure the wallet preview surface never renders ledger analytics sections when
the backend marks the performance view as `UNAVAILABLE`.

## Scope
- `apps/web/src/features/wallets/components/WalletPreviewPanel.tsx`
- `apps/web/src/features/wallets/components/WalletPreviewPanel.test.tsx`
- `docs/modules/web-wallets.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem:
  wallet preview can imply trustworthy analytics even when ledger truth is
  unavailable.
- Expected product or reliability outcome:
  the preview screen fails closed and matches the approved ledger contract.
- How success will be observed:
  `UNAVAILABLE` renders only state messaging plus safe navigation/refresh
  controls, and a focused regression proves summary/chart/event sections stay
  hidden.
- Post-launch learning needed: no

## Deliverable For This Stage
Ship the fail-closed UI fix, focused regression coverage, and queue/context/doc
sync for the wallet preview slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Re-check the approved completeness contract in the wallet ledger
   architecture doc.
2. Update `WalletPreviewPanel` so `UNAVAILABLE` returns a fail-closed empty
   state instead of continuing into summary/timeline/event rendering.
3. Add focused web regression coverage for the unavailable state.
4. Sync the wallets module doc plus queue/context notes with the new local
   slice and record the next smallest follow-up tasks.

## Acceptance Criteria
- Wallet preview shows only safe header actions and an empty state when
  completeness is `UNAVAILABLE`.
- Summary cards, equity timeline, and cashflow events are not rendered in that
  state.
- Existing `COMPLETE` and `PARTIAL` behavior stays intact.
- Focused web tests pass for the new state.

## Definition of Done
- [x] `UNAVAILABLE` wallet preview path fails closed in the web UI.
- [x] Focused regression coverage proves summary/chart/events stay hidden.
- [x] Wallet module docs and queue/context notes reflect the new slice.

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
  - `pnpm --filter web exec vitest run src/features/wallets/components/WalletPreviewPanel.test.tsx`
- Manual checks:
  - code inspection confirms `UNAVAILABLE` returns before summary/timeline/event
    sections.
- Screenshots/logs:
  - not captured in this local slice
- High-risk checks:
  - preserved existing header actions (`back`, `edit`, `refresh`) so operators
    can recover without seeing fake analytics

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference:
  existing wallet preview screen plus `docs/ux/dashboard-design-system.md`
- Canonical visual target:
  wallet preview should keep shared dashboard shell and state patterns
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: yes
- Existing shared pattern reused:
  `EmptyState`, `TableToneBadge`, dashboard button/layout patterns
- New shared pattern introduced: no
- Design-memory entry reused:
  metrics rail and confirmation/state patterns
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy:
  none; this slice only tightens state truth
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches:
  none in the unavailable-state contract after this slice
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Input-mode checks: touch | pointer | keyboard
- Accessibility checks:
  state remains navigable through links and button controls
- Parity evidence:
  `UNAVAILABLE` now matches the ledger contract instead of rendering fake
  analytics sections

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note:
  revert the wallet preview component and regression if the unavailable-state
  contract changes
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
Follow-up local tasks derived from the same V1 view:
1. `WPREVIEW-11`: expose completeness-reason copy for `PARTIAL` wallet preview
   states so operators know why the ledger is degraded.
2. `WPREVIEW-12`: add route-level preview page regression coverage and local UX
   parity evidence for wallet preview states.
3. `WPREVIEW-13`: audit other ledger-backed screens for the same
   `UNAVAILABLE -> fail closed` contract.

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
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: no
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: yes
- Error state verified: yes
- Refresh/restart behavior verified: yes
- Regression check performed:
  focused component regression for unavailable completeness

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected:
  operators reading wallet performance truth
- Existing workaround or pain:
  the screen could mix an empty-state warning with analytics sections
- Smallest useful slice:
  fail closed only for `UNAVAILABLE`
- Success metric or signal:
  no analytics sections render in the unavailable state
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check:
  production browser proof can be attached when the final UI matrix reruns

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey:
  inspect wallet performance truth safely
- SLI:
  truthful state presentation for missing ledger data
- SLO:
  not applicable
- Error budget posture: not applicable
- Health/readiness check:
  focused component test
- Logs, dashboard, or alert route:
  not applicable
- Smoke command or manual smoke:
  focused vitest component run
- Rollback or disable path:
  revert this wallet preview slice

## AI Testing Evidence (required for AI features)
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios:
- Multi-step context scenarios:
- Adversarial or role-break scenarios:
- Prompt injection checks:
- Data leakage and unauthorized access checks:
- Result:

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification:
  wallet analytics metadata
- Trust boundaries:
  web consumes authenticated wallet analytics endpoints only
- Permission or ownership checks:
  unchanged; handled by existing backend routes
- Abuse cases:
  avoid misleading operators with fake or stale unavailable analytics
- Secret handling:
  none
- Security tests or scans:
  not applicable
- Fail-closed behavior:
  `UNAVAILABLE` hides analytics sections and keeps only safe controls
- Residual risk:
  production browser parity evidence still remains part of the wider V1 manual
  matrix

## Result Report
- Task summary:
  wallet preview now fails closed when ledger completeness is unavailable.
- Files changed:
  wallet preview component/test, wallet module deep-dive, queue/context docs
- How tested:
  focused web component test
- What is incomplete:
  broader production UI evidence remains outside this local slice
- Next steps:
  execute `WPREVIEW-11` or the next manual-evidence task once external access is
  available
- Decisions made:
  kept header controls visible during unavailable state, but removed all
  analytics sections
