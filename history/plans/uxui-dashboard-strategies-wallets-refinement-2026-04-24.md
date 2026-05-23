# Task

## Header
- ID: UXUI-2026-04-24-A
- Title: Refine strategies, dashboard runtime, and wallets form surface density
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1SURF-B, V1LIFE-A, UXR-I
- Priority: P2

## Context
The current dashboard and form surfaces were functionally correct, but several
operator-facing layouts still felt too box-heavy or over-explained:
- strategy tabs used nested container framing (`container in container`)
- dashboard history mixed closed-position and trade-log tables in one tab
- runtime market cards exposed operator-internal labels the user no longer
  wants surfaced (`Status`, `Source`, `Strategy`, `Decision`)
- warning text on dashboard runtime surfaces was visually too low-contrast
- wallet create/edit form could use denser row grouping and a more intentional
  mode switcher treatment.

Design source for this slice is the approved user snapshot/notes delivered in
chat on 2026-04-24.

## Goal
Tighten the touched UX/UI surfaces without changing the underlying runtime or
wallet contracts:
- reduce unnecessary nested visual framing
- keep dashboard history focused on trade-log truth
- simplify runtime market cards while preserving correct code/data semantics
- improve warning readability
- make wallet form rows and mode switcher visually cleaner.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Strategy tabs use one cleaner content container instead of nested framed
      containers.
- [x] Dashboard `Historia` keeps only the trade-log table.
- [x] Runtime market cards no longer render the removed helper labels while
      preserving symbol and condition truth.
- [x] Dashboard warning text uses readable warning-tone foreground color.
- [x] Wallet create/edit form groups fields into cleaner rows and uses a
      button-style mode switcher.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/strategies/components/StrategyForm.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx`
- Manual checks:
  - verified strategy form keeps tab flow while using one cleaner content frame
  - verified dashboard history tab now shows only trade history
  - verified runtime warnings use readable warning foreground
  - verified wallets form rows align to requested 2-column / 3-column layout
- Screenshots/logs:
  - none
- High-risk checks:
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:
  - none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: user notes from 2026-04-24 thread covering
  strategies tabs, dashboard runtime/history, and wallet form layout
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - wallet mode switcher keeps labeled radio-like semantics
  - dashboard tabs and warnings remain text-readable and keyboard-reachable
- Parity evidence:
  - focused dashboard parity tests remain green after the presentation-only
    simplification

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- This slice intentionally changes presentation density, not runtime logic.
