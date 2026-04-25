# Task

## Header
- ID: V1TAKE-02
- Title: Lock takeover authority drift between API key, wallet, and bot visibility
- Status: DONE
- Owner: QA/Test
- Depends on: V1TAKE-01
- Priority: P1

## Context
`V1TAKE-01` confirmed one concrete ownership drift: reconciliation and legacy
ops docs still treat API-key management flags as takeover authority, while
takeover-status/runtime visibility can still trust stale `BOT_MANAGED`
ownership rows as long as `botId` is present. The next safe step is a red test
that proves this mismatch under DB-backed API coverage before any fix work
starts.

User direction on 2026-04-25 narrows the target contract:
- `wallet.manageExternalPositions` is the only management source of truth,
- API-key-level `manageExternalPositions` becomes compatibility-only and must
  not override wallet truth.

## Goal
Add focused failing coverage that proves stale `BOT_MANAGED` takeover rows must
fail closed when management is disabled either on:

- the linked LIVE wallet.

And that API-key-level `manageExternalPositions` must not block takeover once
the wallet allows management.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep the slice test-only

## Definition of Done
- [x] Focused DB-backed coverage exists for stale takeover rows with API-key policy drift.
- [x] Focused DB-backed coverage exists for stale takeover rows with wallet policy drift.
- [x] The new test fails against current implementation and exposes one concrete mismatch.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- implementation fixes in this red-test slice

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`
- Manual checks:
  - inspected `positions.service.ts` takeover classification path
  - compared with reconciliation ownership handling in
    `livePositionReconciliation.service.ts`
- Screenshots/logs:
  - focused suite fails on the new red test:
    `fails closed when stale BOT_MANAGED takeover rows no longer satisfy api-key or wallet management policy`
- High-risk checks:
  - the failure proves current code still returns `OWNED_AND_MANAGED` for a row
    that should fail closed once management policy is disabled

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/modules/api-positions.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - none in this red-test slice; implementation fix belongs to `V1TAKE-03`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: error
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: the red test targets backend ownership truth that later
  drives runtime/dashboard visibility

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
Current red evidence:
- wallet-disabled stale takeover row still resolves as
  `OWNED_AND_MANAGED` / `BOT_MANAGED` / stale `botId`
- API-key-level `manageExternalPositions=false` remains a compatibility-only
  case and should not block takeover once the wallet allows management

This is the handoff for `V1TAKE-03`.
