# Task

## Header
- ID: V1BOTSURF-A
- Title: Bot operator surface truth hardening after singular bot migration
- Status: READY
- Owner: Frontend Builder
- Depends on: V1BOT-09, V1DASH-01, V1DASH-02, V1DASH-03
- Priority: P1

## Context
The broader operator-surface audit after the singular bot migration and paper
capital-authority fix proved that dashboard-home is not the only web surface
still capable of drifting away from canonical runtime truth. Bot-focused
surfaces (`BotsManagement`, `BotsListTable`, and monitoring tabs) still partly
seed paper capital and status semantics from legacy bot snapshot fields such as
`bot.paperStartBalance`, even though the approved architecture now treats
wallet/runtime capital summary as the first authority for active execution
truth. The same audit also showed that open-order pending states and
running-but-non-actionable runtime states remain too quiet in bot monitoring,
which can mislead operators into reading "healthy emptiness" where the backend
is actually reporting tracked symbols, pending orders, or no-trade outcomes.

## Goal
Make bot-focused dashboard surfaces truth-first and operator-usable: capital
summaries must align with authoritative runtime capital fields, config-only bot
baselines must be labeled honestly, and pending/degraded runtime states must be
rendered explicitly instead of being buried in tables or implied by silence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [ ] Bot monitoring capital widgets derive active-paper/runtime values from canonical runtime capital summary rather than `bot.paperStartBalance`.
- [ ] Bot list and bot-detail surfaces distinguish configuration baseline from active runtime capital truth wherever both can appear.
- [ ] Bot monitoring exposes explicit pending/degraded operator states for open orders, waiting-for-fill, and running-but-no-actionable-outcome cases.
- [ ] Focused regression coverage exists for the touched bot surfaces and canonical queue/context docs are synchronized.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`
- Manual checks: compare bot list/monitoring against production aggregate payload semantics after implementation
- Screenshots/logs: n/a
- High-risk checks: confirm `PAPER` and `LIVE` bot surfaces both preserve fail-closed pending/degraded states

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`, `docs/architecture/03_domain-model.md`, `docs/architecture/04_runtime-contexts.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: operator-surface docs only if state labels or rendering contract change materially

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing bot monitoring/list layout plus dashboard design system
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: explicit labels/badges for pending and degraded states; no color-only meaning
- Parity evidence: bot surfaces must reflect the same runtime capital/pending-state truth as dashboard-home after `V1DASH-01..03`

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
Suggested execution split:
- `V1BOT-12` web(bot-monitoring-capital): align bot monitoring capital widgets to authoritative runtime capital summary.
- `V1BOT-13` web(bot-list-truth): make bot list/detail labels explicit about config baseline vs runtime capital truth.
- `V1BOT-14` web(bot-monitoring-states): surface pending and degraded runtime states explicitly in bot monitoring.
- `V1BOT-15` qa(closure): run focused bot-surface truth pack and sync canonical docs/context.
