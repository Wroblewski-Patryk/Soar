# Task

## Header
- ID: V1TAKE-03
- Title: unify external-position management contract and takeover status ownership around wallet truth
- Status: DONE
- Owner: Backend Builder
- Depends on: V1TAKE-02
- Priority: P1

## Context
The user chose one explicit source of truth for takeover management:
`wallet.manageExternalPositions`. `V1TAKE-02` proved current takeover-status
handling still trusts stale `BOT_MANAGED` rows and can ignore that wallet-level
policy. Reconciliation also still accepts API-key-level
`manageExternalPositions` in its ownership resolution input.

## Goal
Make wallet management policy the only management truth for takeover-related API
behavior, while keeping `apiKey.syncExternalPositions` as the import toggle.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep exchange scope fail-closed (`BINANCE + FUTURES`)

## Definition of Done
- [x] Reconciliation no longer depends on API-key-level `manageExternalPositions`.
- [x] Takeover-status classification no longer trusts stale `BOT_MANAGED`
      ownership when wallet policy disables management.
- [x] Focused DB-backed takeover tests pass under the wallet-only contract.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- opportunistic UI removal of API-key fields in this backend slice

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - inspect `positions.service.ts` and
    `livePositionReconciliation.service.ts` for wallet-only management truth
- Screenshots/logs:
  - `positions.takeover-status.e2e.test.ts` now keeps API-key-level
    `manageExternalPositions=false` as compatibility-only when wallet policy is
    enabled, while failing closed to `MANUAL_ONLY` when wallet policy is
    disabled.
- High-risk checks:
  - stale `BOT_MANAGED` rows must fail closed when wallet policy disables
    takeover
  - API-key-level `manageExternalPositions=false` must not override a managed
    wallet

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
  - `docs/modules/api-positions.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - user decision in chat on 2026-04-25: management belongs to wallet, not API key
- Follow-up architecture doc updates:
  - synced in this task before implementation

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: success | error
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: later UI cleanup can remove API-key manage controls, but
  backend truth must be corrected first

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This slice intentionally keeps API-key-level `manageExternalPositions` as
compatibility metadata for now. Removing it from profile API/UI is a later
cleanup step, not a blocker for correcting the canonical ownership contract.
