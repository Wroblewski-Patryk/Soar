# Task

## Header
- ID: V1TAKE-05
- Title: align runtime position adoption with canonical owned external-position truth
- Status: DONE
- Owner: Backend Builder
- Depends on: V1TAKE-04
- Priority: P1

## Context
`V1TAKE-04` proved a real runtime drift: two LIVE bots can share symbol scope,
but if only one wallet allows external-position management the runtime owner
resolver still counts both bots and collapses deterministic ownership into a
false ambiguity. This blocks imported `EXCHANGE_SYNC` positions from surfacing
in the correct bot runtime session.

## Goal
Reuse wallet-owned takeover truth inside runtime ownership resolution so
exchange-synced LIVE positions appear for the canonically managed bot and stay
hidden for manual-only or ambiguous contenders.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep runtime visibility fail-closed for ambiguous ownership

## Definition of Done
- [x] Runtime ownership resolution ignores LIVE bots whose wallets disable
      external-position management.
- [x] Focused runtime e2e passes for the wallet-managed-vs-manual-only
      competition case.
- [x] Supporting unit coverage documents wallet-managed filtering at the
      resolver boundary.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- bypassing canonical symbol ownership with ad-hoc runtime filters

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - inspect `runtimeExternalPositionOwner.service.ts`
  - inspect `runtimeSessionPositionsRead.service.ts`
- Screenshots/logs:
  - `runtimeExternalPositionOwner.service.ts` now filters LIVE candidates by
    `wallet.manageExternalPositions === true`, which keeps manual-only wallets
    out of the ownership candidate set without changing the ambiguous path for
    multiple managed contenders.
- High-risk checks:
  - wallet-disabled LIVE bots must not force ambiguity
  - ambiguous ownership between multiple wallet-managed bots must remain
    ambiguous

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
  - queue/context docs if this slice closes successfully

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: success | error
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: runtime payload truth is the backend contract behind bot UI
  position visibility

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The fix should stay localized to ownership resolution and not create a second
"maybe owned" inference path inside runtime session reads.
