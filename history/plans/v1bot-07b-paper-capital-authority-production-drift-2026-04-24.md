# Task

## Header
- ID: V1BOT-07B
- Title: Recover PAPER runtime capital authority after production wallet-vs-dashboard drift
- Status: IN_PROGRESS
- Owner: Backend Builder
- Depends on: V1BOT-07
- Priority: P0

## Context
Production investigation on `2026-04-24` showed a critical mismatch for the
selected PAPER bot runtime surface:
- wallet module shows `paperInitialBalance = 100 USDT`,
- strategy config is `walletRisk = 2`, `leverage = 25`,
- runtime dashboard aggregate showed `referenceBalance ~= 96,695 USDT`,
- open PAPER positions were therefore sized at `~48k USDT` notional each.

The current runtime/dashboard capital path still allows `PAPER` capital to be
derived from wallet-scoped lifecycle rows, which can mix the selected bot with
historical or legacy bot activity under the same wallet and break the approved
single-context bot contract.

## Goal
Make PAPER runtime capital fail-closed and selected-bot scoped, while keeping
LIVE capital wallet-authoritative from authenticated exchange balance.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve existing dashboard layouts; data truth only

## Definition of Done
- [ ] PAPER runtime capital snapshot ignores lifecycle rows from other bots that
      share or historically shared the same wallet.
- [ ] Selected-bot dashboard monitoring uses inherited runtime execution context
      instead of deprecated bot-owned mode/venue snapshots.
- [ ] Regression coverage proves that PAPER selected-bot capital stays truthful
      after reset checkpoints and historical legacy rows on the same wallet.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: to attach in execution closure
- Manual checks:
  - authenticated production comparison of wallet module vs selected-bot runtime aggregate
- Screenshots/logs:
  - local production audit artifacts in `.tmp-prod-wallet-audit.json` and `.tmp-prod-bot-runtime.json`
- High-risk checks:
  - PAPER notional sizing must contract back to wallet baseline semantics
  - LIVE exchange balance authority must remain unchanged

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  - user-approved single-context bot architecture on `2026-04-24`
- Follow-up architecture doc updates:
  - `04_runtime-contexts.md`
  - `reference/wallet-source-of-truth-contract.md`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard selected-bot runtime surfaces
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: not layout-affecting
- Parity evidence: preserve layout; fix runtime data truth only

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This slice is production-risking because a false PAPER capital authority can
inflate sizing and mislead operator trust ahead of LIVE usage. The fix must
stay narrow: no UI redesign, no new ledger system, and no silent fallback to
legacy bot-owned context fields.
