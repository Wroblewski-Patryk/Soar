# Task

## Header
- ID: V1SURF-B
- Title: Residual operator-surface truth closure after V1LIFE
- Status: IN_PROGRESS
- Owner: Frontend Builder
- Depends on: V1MON-A, V1LIFE-A
- Priority: P1

## Context
Fresh post-`V1LIFE-A` audit on `2026-04-24` shows the main runtime and
operator-truth waves are closed, but a few residual surface drifts remain:

- `dashboard-home` still contains a browser-side aggregate reconstruction path
  in `useHomeLiveWidgetsController.ts` (`buildAggregateFallback(...)`) that
  composes symbol stats, positions, and trades when the backend aggregate
  endpoint fails,
- bot monitoring quick-context and control banners still present capability and
  venue labels from duplicated bot snapshot fields (`bot.exchange`,
  `bot.marketType`) instead of inherited venue truth,
- dashboard runtime sidebar and manual-order controller still fall back to
  `selected.bot.marketType` for venue semantics and quantity/leverage estimates,
  which can drift from singular inherited symbol-group market-universe truth.

This is no longer a backend/runtime-engine problem. It is a final
operator-surface consistency wave so the web stops maintaining secondary truth
paths or stale snapshot-based venue assumptions.

## Goal
Close the remaining operator-surface drifts so dashboard-home and bot
monitoring consume one canonical aggregate truth path, prefer inherited venue
context everywhere, and fail closed rather than reconstructing runtime truth in
the browser.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] `V1SURF-05` dashboard-home no longer reconstructs aggregate runtime truth
      client-side when aggregate API fails.
- [ ] `V1SURF-06` dashboard runtime sidebar and manual-order estimates derive
      venue semantics from inherited bot context or explicit manual-order
      context, not duplicated bot snapshot fields.
- [ ] `V1SURF-07` bot monitoring quick-context/control surfaces derive venue
      and capability labels from inherited context, not duplicated bot snapshot
      fields.
- [ ] `V1SURF-08` focused closure pack passes and canonical queue/context docs
      are synced.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
  - `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - aggregate endpoint failure on selected-bot dashboard produces degraded/error
    state instead of reconstructed runtime aggregate
  - manual-order quantity/leverage estimates stay coherent for both SPOT and
    FUTURES when direct bot snapshot fields are stale or absent
- Screenshots/logs:
  - selected-bot dashboard degraded aggregate state
  - bot monitoring quick-context card using inherited venue labels
- High-risk checks:
  - selected-bot dashboard must stay strict and fail closed
  - no new browser-side runtime aggregate composition path may remain after the
    change

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/04_runtime-contexts.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - none if implementation remains inside the approved fail-closed operator
    truth contract

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard-home runtime sidebar and bot
  monitoring runtime workspace
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - degraded aggregate state remains screen-reader visible
  - quick-context and capability labels remain readable in compact cards
- Parity evidence:
  - dashboard-home and bot monitoring must both read venue/runtime truth from
    inherited bot context under the same fail-closed aggregate rules

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
The audit that triggered this wave found a concrete architectural regression:
`V1MON-A` already removed browser-side aggregate reconstruction from bot
monitoring, but dashboard-home still contains the same anti-pattern in a
different controller.

`V1SURF-05` is now closed. `useHomeLiveWidgetsController.ts` no longer contains
`buildAggregateFallback(...)`, and selected-bot dashboard runtime state now
keeps only session truth plus explicit degraded aggregate state when
`getBotRuntimeMonitoringAggregate()` fails. Focused regression coverage was
added in `HomeLiveWidgets.aggregate-error.test.tsx` to prove that session-level
symbol stats/positions/trades fallbacks are not invoked on aggregate failure.

This wave should prefer shared helpers already present in
`features/bots/utils/runtimeSurfaceTruth.ts` and must not add a second venue
resolver or a second aggregate compatibility layer.
