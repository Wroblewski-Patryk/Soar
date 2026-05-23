# Task

## Header
- ID: XADAPT-06
- Title: Publish staged next-exchange rollout packet after Binance boundary closure
- Status: DONE
- Owner: Planning Agent
- Depends on: XADAPT-05
- Priority: P1

## Context
`XADAPT-01..05` completed the Binance-first adapter hardening wave. The
remaining scope in `XADAPT-A` is planning-only: choose the next exchange
explicitly and freeze a staged rollout order so future implementation does not
rediscover scope, blockers, or non-goals.

## Goal
Publish one reusable readiness packet that:

- chooses the next exchange explicitly
- defines staged rollout order by capability family
- captures blockers, non-goals, and validation rules before implementation

## Constraints
- use existing systems and approved mechanisms
- do not implement second-exchange support in this slice
- do not broaden reconciliation or cancel support implicitly
- keep Binance-first V1 truth explicit

## Definition of Done
- [x] One explicit next-exchange target is documented.
- [x] Staged rollout order is frozen for the next exchange.
- [x] Blockers, non-goals, and validation expectations are documented.
- [x] Queue/context docs move from `XADAPT-06` to the next active wave.

## Forbidden
- new systems without approval
- second-exchange implementation in this task
- implying exchange-cancel support
- mixing readiness planning with runtime broadening

## Validation Evidence
- Tests: `pnpm run quality:guardrails`
- Manual checks:
  - verify `mvp-next-commits.md`, `TASK_BOARD.md`, and `PROJECT_STATE.md` no longer point to an open `XADAPT` execution slice
  - verify the packet chooses one target exchange and one staged rollout order
- Screenshots/logs: n/a
- High-risk checks:
  - the packet must keep reconciliation broadening explicitly out of scope
  - the packet must preserve `LIVE_ORDER_CANCEL` as unsupported

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `history/audits/xadapt-02-binance-assumption-audit-2026-04-25.md`
  - `history/plans/exchange-adapter-execution-hardening-plan-2026-04-25.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: n/a
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: n/a

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.
