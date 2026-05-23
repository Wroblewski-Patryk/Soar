# Task

## Header
- ID: V1TAKE-04
- Title: lock deterministic runtime visibility for owned exchange-synced LIVE positions
- Status: DONE
- Owner: Backend Builder
- Depends on: V1TAKE-03
- Priority: P1

## Context
`V1TAKE-03` aligned takeover-management truth around
`wallet.manageExternalPositions`, but runtime session position reads still
derive external ownership through `runtimeExternalPositionOwner.service.ts`.
That resolver currently uses active LIVE bot symbol scope only, which risks
marking a symbol as ambiguous even when one competing bot is linked to a wallet
that explicitly disables external-position management.

## Goal
Add focused DB-backed runtime coverage for the path "exchange-synced LIVE
position is canonically owned by one wallet-managed bot and must appear in that
bot runtime session".

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep runtime ownership fail-closed for ambiguous or manual-only rows

## Definition of Done
- [x] A focused runtime e2e reproduces wallet-scoped ownership competition for
      the same symbol.
- [x] The new regression proves only the wallet-managed bot sees the imported
      LIVE position.
- [x] The regression is red against the current implementation before the fix.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- runtime shortcuts that bypass canonical ownership resolution

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts`
  - red result before the fix: `expected +0 to be 1`
- Manual checks:
  - inspect `runtimeSessionPositionsRead.service.ts`
  - inspect `runtimeExternalPositionOwner.service.ts`
- Screenshots/logs:
  - The focused runtime path returned `total=0` for the managed bot before the
    resolver fix because runtime ownership still counted a second LIVE bot whose
    wallet explicitly disabled external-position management.
- High-risk checks:
  - wallet-disabled competing bots must not force ambiguity for a symbol that is
    otherwise deterministically owned

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
  - none yet; this task is coverage-first

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: success | error
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: runtime payload truth is a prerequisite for bot/dashboard
  visibility parity

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
The expected failure mode is a false `AMBIGUOUS` classification caused by
`runtimeExternalPositionOwner.service.ts` counting LIVE bots that share symbol
scope but whose wallets disable takeover management.
