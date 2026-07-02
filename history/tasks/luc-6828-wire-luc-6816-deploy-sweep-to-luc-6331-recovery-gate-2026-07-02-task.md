# Task

## Header
- ID: LUC-6828
- Title: Wire LUC-6816 Deploy Sweep To LUC-6331 Recovery Gate
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: DRE / Ops Release
- Depends on: [LUC-6331](/LUC/issues/LUC-6331)
- Priority: P0
- Module Confidence Rows: production Web, protected worker readiness, release gate dependency wiring
- Requirement Rows: release smoke, production readiness, rollback guard
- Quality Scenario Rows: reliability, availability, release traceability
- Risk Rows: production Web unavailable, worker readiness unavailable, duplicate or missing recovery gate dependency
- Iteration: 2026-07-02 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-6828-WIRE-LUC-6816-TO-LUC-6331-RECOVERY-GATE-2026-07-02
- Mission Status: DONE

## Context
The scoped wake assigned [LUC-6828](/LUC/issues/LUC-6828) to DRE with the explicit purpose of wiring the completed [LUC-6816](/LUC/issues/LUC-6816) deploy sweep to the [LUC-6331](/LUC/issues/LUC-6331) recovery gate. The inline wake payload had no pending comments and did not require broader thread refetch.

[LUC-6816](/LUC/issues/LUC-6816) already captured current production deploy health evidence: API health and readiness pass, production Web and protected worker readiness return `503`, `soar-web` and `workers-backtest` are unhealthy in Coolify projection, runtime freshness passes, and rollback guard requires action. Local evidence is in `history/evidence/luc-6816-coolify-production-deploy-health-sweep-2026-07-02.md`.

## Goal
Make the recovery dependency explicit in Paperclip and preserve the local integration record.

## Scope
- Read live Paperclip issue state for [LUC-6828](/LUC/issues/LUC-6828), [LUC-6816](/LUC/issues/LUC-6816), and [LUC-6331](/LUC/issues/LUC-6331).
- Set [LUC-6816](/LUC/issues/LUC-6816) as first-class blocked by [LUC-6331](/LUC/issues/LUC-6331).
- Close [LUC-6828](/LUC/issues/LUC-6828) with evidence and no duplicate child.

## Constraints
- No product code, commit, push, deploy, restart, rollback execution, env edit, secret/account value readback, DB/Redis mutation, exchange/payment mutation, order, position, subscription mutation, or live-trading action.
- Preserve the existing [LUC-6331](/LUC/issues/LUC-6331) recovery owner path instead of creating duplicate restoration issues.
- Use Paperclip issue links in all issue-facing comments.

## Definition of Done
- [x] Live issue state checked.
- [x] [LUC-6816](/LUC/issues/LUC-6816) dependency edge to [LUC-6331](/LUC/issues/LUC-6331) applied in Paperclip.
- [x] Local source-of-truth packet written.
- [x] [LUC-6828](/LUC/issues/LUC-6828) receives final disposition.

## Forbidden
- New recovery lane when [LUC-6331](/LUC/issues/LUC-6331) is already authoritative.
- Any production mutation.
- Secret readback or raw log capture.

## Validation Evidence
- `GET /api/issues/LUC-6828` -> `200`, status `in_progress`, assigned to DRE, no first-class blockers.
- `GET /api/issues/LUC-6331` -> `200`, status `blocked`, priority `critical`, existing production restoration issue.
- `GET /api/issues/LUC-6816` -> `200`, status `blocked`, no first-class blockers before this wiring heartbeat.
- `PATCH /api/issues/LUC-6816` -> [LUC-6816](/LUC/issues/LUC-6816) status `blocked`, `blockedBy` now includes [LUC-6331](/LUC/issues/LUC-6331).
- `PATCH /api/issues/LUC-6828` -> [LUC-6828](/LUC/issues/LUC-6828) status `done`.
- Source control: repo was already dirty and divergent (`main...origin/main` `[ahead 22, behind 3]`); no commit or push attempted.

## Result Report
- Task summary: [LUC-6816](/LUC/issues/LUC-6816) is wired to [LUC-6331](/LUC/issues/LUC-6331) as the first-class recovery gate; [LUC-6828](/LUC/issues/LUC-6828) is closed as the coordination task.
- Files changed:
  - `history/tasks/luc-6828-wire-luc-6816-deploy-sweep-to-luc-6331-recovery-gate-2026-07-02-task.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: Paperclip issue readbacks and existing [LUC-6816](/LUC/issues/LUC-6816) evidence review.
- What is incomplete: actual production restoration remains with [LUC-6331](/LUC/issues/LUC-6331).
- Next steps: Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun deploy smoke, rollback guard, and production acceptance.
- Deployment impact: none.
