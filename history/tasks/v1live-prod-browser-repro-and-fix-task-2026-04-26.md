# Task

## Header
- ID: V1LIVE-PROD-2026-04-26-A
- Title: Reproduce and close remaining production manual-order and exchange-position takeover failures from the real dashboard account
- Task Type: fix
- Current Stage: implementation
- Status: IN_PROGRESS
- Owner: Backend Builder
- Depends on: V1FIX-2026-04-26-B, V1FIX-2026-04-26-C
- Priority: P0

## Context
Real-account production browser verification still reports two unresolved failures under the approved live/paper execution architecture: manual orders can still fail from the dashboard, and exchange-backed positions can still fail to appear as manageable runtime positions for the selected bot. The repository already contains recent production hotfixes for orphan repair and wallet-scoped open-position ownership, so this task must verify the current deployed behavior end to end before any further implementation.

## Goal
Identify the exact current production failure path from the real dashboard account, confirm whether the deployed behavior matches the approved architecture, and implement only the smallest required fix slice to restore correct behavior.

## Deliverable For This Stage
Close the real-account production manual-order symbol-context regression end to end, then verify the fix on production with direct browser evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless runtime verification or deployment is required to close the user-reported bug

## Definition of Done
- [x] Real-account browser reproduction evidence exists for the current production failure.
- [x] The failing backend/runtime path is identified precisely enough to implement one smallest fix.
- [x] Architecture alignment or mismatch is stated explicitly before further implementation.
- [ ] The web fix is deployed and verified against the real production dashboard account.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm --filter web run build`
- Manual checks:
  - Production browser reproduction on the real account confirmed the remaining bug is web-only manual-order symbol-context drift, not backend lifecycle or exchange takeover.
  - Manual `PAPER` dashboard open succeeds through `/dashboard/orders/open` when the submitted price is truthful.
  - Imported LIVE exchange positions are visible/manageable once the API target is healthy.
- Screenshots/logs:
  - Coolify deployment recovery evidence captured for deployment `frdfxfsw35hnmey66hdyo3o1`
  - Browser network repro showed stale `price=0.01432` submitted for `DOGEUSDT`
- High-risk checks: manual order and exchange takeover on production

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`, `docs/architecture/reference/assistant-runtime-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no architecture mismatch; the defect was stale UI state overriding the canonical current symbol context
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard runtime/manual-order UI on production
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: yes
- New shared pattern introduced: no
- Design-memory entry reused:
- Design-memory update required: no
- Required states: loading | empty | error | success
- Responsive checks: desktop
- Input-mode checks: pointer | keyboard
- Accessibility checks: not in scope for analysis
- Parity evidence: pending

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none expected
- Health-check impact: possible API/runtime validation after fix
- Smoke steps updated: pending
- Rollback note: pending

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [ ] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Production browser verification proved a split diagnosis:
- exchange takeover/import now works on the real account once the API target is healthy
- manual dashboard order backend lifecycle also works when it receives truthful request price
- the remaining blocker is a web-side stale manual-order context race: after bot/symbol change, a previous-symbol `manualOrderContext.priceReference.markPrice` could still win over the current symbol and freeze the wrong price into submit state
