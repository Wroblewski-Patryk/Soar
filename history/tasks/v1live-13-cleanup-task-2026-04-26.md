# Task

## Header
- ID: V1LIVE-13
- Title: Remove stale live fallback paths, stale imported-position fixtures, and residual runtime-sidebar legacy semantics
- Task Type: cleanup
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1LIVE-12
- Priority: P1

## Context
After the adapter-family, ownership, and event-driven lifecycle slices were
closed, the remaining drift inside `V1LIVE-A` was no longer a missing runtime
mechanism. It was stale compatibility debt: legacy LIVE fixtures that no
longer matched the exact `apiKeyId + symbol` ownership contract and a residual
runtime-sidebar strategy fallback path on the web surface.

## Goal
Remove the stale fallback and fixture debt so the repository truth matches the
approved live architecture without hidden compatibility semantics.

## Deliverable For This Stage
Verified cleanup patch plus synchronized queue/context truth for the closed
`V1LIVE-13` slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Legacy runtime-sidebar strategy fallback reads are removed from the canonical dashboard manual-order surface.
- [x] Stale `orders-positions.e2e` LIVE imported-position fixtures are aligned to the exact ownership contract.
- [x] Focused cleanup validations pass without widening scope beyond the approved `V1LIVE-A` closure.

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
- Tests: `pnpm --filter api test -- --run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps EXCHANGE_SYNC BOT_MANAGED runtime positions visible for LIVE bot even when PAPER bot shares symbol|closes EXCHANGE_SYNC BOT_MANAGED runtime position selected from LIVE dashboard flow"`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- Manual checks: none
- Screenshots/logs: not required
- High-risk checks: verified imported LIVE visibility and close fixtures now require canonical `bot.apiKeyId + wallet.apiKeyId + externalId` ownership truth

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/reference/assistant-runtime-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: `docs/ux/dashboard-design-system.md`
- Canonical visual target: runtime sidebar manual-order context
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: no
- Existing shared pattern reused: yes
- New shared pattern introduced: no
- Design-memory entry reused: n/a
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy: n/a
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none in touched scope
- Required states: success
- Responsive checks: n/a
- Input-mode checks: n/a
- Accessibility checks: none needed for this cleanup-only slice
- Parity evidence: `RuntimeSidebarSection.test.tsx`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the focused fixture/sidebar cleanup if future closure evidence proves a missed compatibility dependency

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
The stale `orders-positions.e2e` fixtures were missing canonical LIVE
ownership proof because they stopped at wallet-bound `apiKeyId` and never set
`bot.apiKeyId`. Under the current exact ownership contract, that made them
invalid legacy setups rather than product regressions.
