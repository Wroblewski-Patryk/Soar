# Task

## Header
- ID: V1CAP-A
- Title: Restore truthful wallet capital authority for PAPER reset checkpoints and LIVE post-deposit balance changes
- Status: DONE
- Owner: Planning Agent
- Depends on: WAPR-10, SAFEV1-A2, V1SIG-A
- Priority: P0

## Context
The current wallet/runtime architecture already distinguishes:
- `PAPER` capital from exchange truth,
- `LIVE` capital from authenticated exchange balance truth plus wallet
  allocation,
- `paperResetAt` as a non-destructive reset checkpoint,
- `liveAllocationMode` and `liveAllocationValue` as the wallet-scoped capital
  budget boundary.

However, two high-risk operator scenarios now require an explicit V1 closure:

1. `PAPER` reset after historical losses:
   - the reset should create a clean baseline for future paper runtime capital
     without deleting history,
   - bot/runtime/operator read models must not continue to imply pre-reset
     capital truth as active capital.

2. `LIVE` capital loss followed by a user deposit on the exchange:
   - when the wallet is configured to use `100%` of account capital, the bot
     should see the new exchange balance automatically and be able to continue
     trading if all other guardrails pass,
   - when the wallet uses `PERCENT`, the budget should scale with the refreshed
     exchange account balance,
   - when the wallet uses `FIXED`, the bot should remain capped to that fixed
     wallet budget even if the exchange account receives more funds,
   - operator UI must clearly communicate which capital truth is in effect and
     when runtime is using refreshed exchange balance versus static wallet
     checkpoint semantics.

Current implementation direction in `runtimeCapitalContext.service.ts` is close
to the intended architecture:
- `LIVE` reference balance is re-read from the exchange and then mapped through
  allocation mode/value,
- `PAPER` reference balance is derived from wallet checkpoint plus realized PnL
  since `paperResetAt`.

But production investigation suggests the overall wallet/runtime/operator
behavior is not yet trustworthy enough:
- `PAPER` runtime may present suspicious reference-balance values after reset
  or historical lifecycle drift,
- operator surfaces do not yet make the capital-authority rules sufficiently
  explicit,
- V1 does not yet have a dedicated recovery packet proving safe behavior when a
  `LIVE` wallet is depleted and later re-funded on the exchange.

## Goal
Define and implement one explicit V1 wallet capital-authority contract so
runtime, operator UI, and wallet behavior stay safe and understandable in the
following cases:
- `PAPER` reset,
- `PAPER` post-reset runtime trading,
- `LIVE` account depletion,
- `LIVE` post-deposit recovery on the exchange,
- wallet allocation changes (`PERCENT` / `FIXED` / effective full balance).

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Wallet capital authority is documented explicitly for `PAPER` and `LIVE`
      runtime, including post-reset and post-deposit behavior.
- [x] `LIVE` runtime balance refresh after exchange deposit is validated under
      all supported allocation modes without silent fallback or stale local
      balance truth.
- [x] `PAPER` reset baseline is validated end-to-end so runtime, positions, and
      monitoring summaries do not mix pre-reset and post-reset active capital
      semantics.
- [x] Operator wallet/runtime surfaces expose enough truth to explain why a bot
      can or cannot continue trading after loss, reset, or deposit.
- [x] Queue/context/docs and focused validation evidence are synchronized.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - focused runtime capital context tests for `PAPER` reset and `LIVE`
    refreshed exchange balance behavior
  - focused wallet API tests for allocation and reset contract
  - integration/regression checks where runtime uses wallet-scoped capital
    truth
- Manual checks:
  - confirm post-deposit `LIVE` wallet behavior through preview and runtime
    read models
  - confirm post-reset `PAPER` wallet baseline behavior in monitoring summaries
- Screenshots/logs:
  - wallet preview/runtime-monitoring evidence before and after reset/deposit
- High-risk checks:
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/reference/live-paper-runtime-safety-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:
  - freeze explicit wallet capital-authority rules in architecture/module docs
    if implementation changes operator-visible behavior

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing wallets and runtime monitoring operator
  surfaces in repository
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: explicit labels for capital source, allocation mode,
  and reset baseline semantics
- Parity evidence: wallet preview, runtime monitoring, and execution behavior
  must agree on the same capital-authority truth

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
- Proposed V1 rules:
  - `PAPER`
    - active capital authority = wallet `paperInitialBalance` checkpoint plus
      realized PnL since `paperResetAt`, minus currently reserved margin,
    - pre-reset history remains readable but must not count as active runtime
      capital after reset.
  - `LIVE`
    - active capital authority = latest authenticated exchange balance mapped
      through wallet allocation mode/value,
    - exchange deposit must be reflected automatically after cache expiry or an
      explicit refresh path,
    - `PERCENT` scales with new exchange balance,
    - `FIXED` stays capped at configured fixed amount even if exchange balance
      increases,
    - unresolved exchange truth must remain fail closed and operator-visible.
- Planned execution slices:
  - [x] `V1CAP-01 docs(contract): freeze wallet capital-authority rules for
    PAPER-reset and LIVE post-deposit recovery`
  - [x] `V1CAP-02 test(api-runtime): add red/green regression coverage for reset
    checkpoint and refreshed exchange balance semantics`
  - [x] `V1CAP-03 fix(api-runtime): align runtime capital snapshot behavior and any
    wallet/runtime read-model drift`
  - [x] `V1CAP-04 fix(operator-ui): expose capital source/allocation/reset truth in
    wallet/runtime monitoring surfaces`
  - [x] `V1CAP-05 qa(closure): run focused wallet/runtime closure pack and sync
    docs/context`
- Closure evidence:
  - shared API capital-allocation helper now backs both wallet preview and
    runtime capital snapshots, eliminating duplicated percent/fixed balance
    mapping.
  - runtime monitoring summary now exposes explicit capital-source/allocation
    metadata plus `paperResetAt`, allowing operator UI to distinguish paper
    reset checkpoints from authenticated live balance truth.
  - wallet list/form and runtime wallet sidebar now explain active capital
    authority for `PAPER`, `LIVE percent`, `LIVE fixed`, and full-balance live
    modes.
  - Validation PASS:
    - `pnpm -C apps/api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
    - `pnpm -C apps/web exec vitest run src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run quality:guardrails`
