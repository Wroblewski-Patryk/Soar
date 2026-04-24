# Task

## Header
- ID: V1MON-A
- Title: Bot monitoring runtime-truth hardening
- Status: IN_PROGRESS
- Owner: Frontend Builder
- Depends on: V1BOT-A, V1IND-A
- Priority: P1

## Context
Post-`V1BOT-A` and post-`V1IND-A` audits showed that dashboard-home is now much
closer to canonical runtime truth, but bot monitoring surfaces still have
residual drift:
- web monitoring keeps a client-side aggregate fallback that reconstructs
  runtime state when the backend aggregate endpoint fails,
- bot list and bot management still render some duplicated bot snapshot fields
  as if they were canonical inherited context,
- bot monitoring semantics still lag behind dashboard-home for distinguishing
  market snapshots from evaluated runtime decisions.

The user explicitly approved the strict architecture direction: backend
aggregate truth only, with degraded/error states instead of client-side
reconstruction.

## Goal
Harden bot monitoring and related bot surfaces so they consume one canonical
runtime truth path, fail closed when aggregate truth is unavailable, and stop
presenting duplicated bot snapshot fields as the primary source of inherited
context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] `V1MON-01` web monitoring no longer reconstructs aggregate runtime truth
      client-side when the backend aggregate endpoint fails.
- [x] `V1MON-02` bot list and bot management prefer inherited context over
      duplicated bot snapshot fields where the architecture requires it.
- [ ] `V1MON-03` bot monitoring signal semantics match dashboard-home for
      market snapshot vs runtime decision truth.
- [ ] `V1MON-04` focused closure pack passes and source-of-truth is synced.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/bots/services/botsMonitoringAggregate.service.test.ts`
  - `pnpm --filter web exec vitest run src/features/bots/components/BotsListTable.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks: n/a
- Screenshots/logs: n/a
- High-risk checks:
  - monitoring aggregate must degrade explicitly instead of silently composing a
    second truth path in the browser

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: user approved option `1` in chat on 2026-04-24
- Follow-up architecture doc updates: none required if scope stays implementation-only

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing bots monitoring runtime workspace
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: existing error/degraded state path remains intact
- Parity evidence: bot monitoring should fail closed instead of diverging from
  canonical backend truth

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached for completed slice(s).
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This packet intentionally breaks the follow-up into small slices. `V1MON-01`
must land first because the current browser fallback is itself an architectural
violation and can mask the real backend state seen by operators.

`V1MON-02` is now also closed: bot list and bot management prefer inherited
venue context from `symbolGroup.marketUniverse` (with compatibility-only
fallback to wallet/bot snapshot fields) and derive strategy position-limit
display from linked strategy configuration instead of treating the bot snapshot
as the primary truth.
