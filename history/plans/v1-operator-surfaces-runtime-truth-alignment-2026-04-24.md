# Task

## Header
- ID: V1SURF-A
- Title: Operator surface runtime-truth alignment after dashboard and bot audits
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1BOT-09, V1DASH-01, V1DASH-02, V1DASH-03, V1BOT-12, V1BOT-13, V1BOT-14
- Priority: P1

## Context
Two consecutive operator-surface audits confirmed that the remaining V1 UI
truth gaps are broader than any single widget. The selected-bot dashboard and
bot-focused monitoring surfaces still repeat the same class of drift:
- `PAPER` capital/equity widgets can still derive baseline math from legacy bot
  snapshot fields instead of the canonical runtime capital summary.
- Pending states such as "open order submitted", "waiting for fill", and
  "running with tracked symbols but no actionable outcome yet" are present in
  backend payloads but are not promoted strongly enough in web operator
  surfaces.
- Bot monitoring still collapses several runtime states into a thin
  `lastSignalDirection` view, so `CONFIGURED_ONLY`, `EVALUATED_NO_TRADE`, and
  related truth states are not visible with the same clarity already approved
  for the selected-bot markets surface.

This means the next V1 operator UX fixes should not only patch individual
screens, but also align the shared presentation rules used by dashboard-home
and bot monitoring so the same backend truth produces the same operator story.

## Goal
Define and queue the remaining operator-surface truth alignment work so the web
dashboard consistently reflects canonical runtime state across selected-bot
dashboard widgets and bot monitoring/list surfaces, without regressing the
existing visual structure.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Shared runtime capital presentation rules are queued to remove repeated baseline drift across dashboard-home and bot monitoring.
- [x] Shared operator-state taxonomy is queued so pending/degraded runtime outcomes are explicit in both selected-bot dashboard and bot monitoring.
- [x] Bot monitoring truth rows are queued to expose factual runtime state beyond raw signal direction alone.
- [x] Canonical queue/context docs are synchronized with the new follow-up wave and its execution order.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks: audit pass over dashboard-home, bot monitoring, bot list, wallet list, and reports
- Screenshots/logs: n/a
- High-risk checks: ensure planned fixes preserve fail-closed handling for money-impacting runtime states

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`, `docs/architecture/04_runtime-contexts.md`, `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: operator-surface docs only if shared state naming/visibility contract changes materially

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current dashboard-home and bot monitoring/list layouts plus dashboard design system
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: pending/degraded truth must not rely on color alone; explicit labels/badges required
- Parity evidence: the same runtime state must read consistently across selected-bot dashboard and bot monitoring surfaces

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
Recommended execution slices after the already queued dashboard/bot fixes:
- `V1SURF-01` web(shared-capital-truth): align repeated capital/equity presentation math to canonical runtime capital summary semantics.
- `V1SURF-02` web(shared-operator-state): define explicit pending/degraded runtime state badges/copy across dashboard-home and bot monitoring.
- `V1SURF-03` web(bot-monitoring-state-truth): surface `runtimeMarketState` / context truth in bot monitoring instead of only `lastSignalDirection`.
- `V1SURF-04` qa(closure): run focused cross-surface truth pack and sync canonical docs/context.
