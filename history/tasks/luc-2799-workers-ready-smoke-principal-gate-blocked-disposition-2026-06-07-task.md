# LUC-2799 Workers Ready Smoke Principal Gate Blocked Disposition

## Header
- ID: LUC-2799
- Title: [Ops][Soar][LUC-241] Restore blocked disposition for workers/ready smoke principal gate
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-1438](/LUC/issues/LUC-1438), [LUC-2619](/LUC/issues/LUC-2619)
- Priority: P1
- Mission ID: LUC-2799-WORKERS-READY-SMOKE-PRINCIPAL-GATE-BLOCKED-DISPOSITION-2026-06-07
- Mission Status: VERIFIED

## Architecture Links

- Primary feature/module: Protected workers-ready release gate disposition.
- Architecture nodes: `docs/architecture/nodes/SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS.md`, `docs/architecture/nodes/SOAR-SERVICE-MARKET-STREAM.md`, `docs/architecture/nodes/SOAR-API-MARKET-STREAM-EVENTS.md`.
- Function chains: `docs/operations/post-deploy-smoke-checklist.md`, `docs/operations/deployment-rollback-playbook.md`.
- Affected files: `apps/api/src/router/index.ts`, `apps/api/src/workers`, `history/tasks/luc-2799-workers-ready-smoke-principal-gate-blocked-disposition-2026-06-07-task.md`.
- Tests/proof: Paperclip issue readback for [LUC-241](/LUC/issues/LUC-241), [LUC-1438](/LUC/issues/LUC-1438), and [LUC-2619](/LUC/issues/LUC-2619) blocker state; no protected smoke run.
- Docs updated: `history/tasks/luc-2799-workers-ready-smoke-principal-gate-blocked-disposition-2026-06-07-task.md`.

## Context
[LUC-2799](/LUC/issues/LUC-2799) was a no-stall Ops handoff from [LUC-2795](/LUC/issues/LUC-2795). [LUC-241](/LUC/issues/LUC-241) was incorrectly visible as `todo` while its first-class blocker [LUC-1438](/LUC/issues/LUC-1438) remained `blocked`, with terminal blocker [LUC-2619](/LUC/issues/LUC-2619).

## Goal
Restore [LUC-241](/LUC/issues/LUC-241) to a fail-closed `blocked` disposition without running protected smoke, deploy, restart, secret readback, or runtime mutation.

## Constraints
- Preserve first-class blocker [LUC-1438](/LUC/issues/LUC-1438).
- Do not run `/workers/ready`, protected smoke, deploy, restart, or secret readback.
- Name the unblock owner/action in Paperclip comments.

## Definition of Done
- [x] [LUC-241](/LUC/issues/LUC-241) is no longer presented as runnable `todo`.
- [x] [LUC-241](/LUC/issues/LUC-241) preserves [LUC-1438](/LUC/issues/LUC-1438) as a first-class blocker.
- [x] Paperclip comment names the unblock path through [LUC-2619](/LUC/issues/LUC-2619) and [LUC-1438](/LUC/issues/LUC-1438).

## Forbidden
- No `/workers/ready` smoke.
- No protected smoke.
- No deploy, restart, rollback, secret readback, account mutation, database mutation, exchange mutation, or live-trading mutation.

## Validation Evidence
- Paperclip readback before correction: [LUC-241](/LUC/issues/LUC-241) status `todo`, `blockedBy=[LUC-1438:blocked]`.
- Checkout of [LUC-241](/LUC/issues/LUC-241) was rejected because Paperclip detected unresolved blocker [LUC-1438](/LUC/issues/LUC-1438); this confirmed the status/blocker mismatch.
- Paperclip PATCH restored status `blocked` and preserved `blockedByIssueIds=["c550a898-15cd-44c3-b354-e192568052cd"]`.
- Paperclip readback after correction: [LUC-241](/LUC/issues/LUC-241) status `blocked`, `blockedBy=[LUC-1438:blocked]`, terminal blocker `[LUC-2619:blocked]`, updated `2026-06-07T12:04:58.903Z`.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable; Paperclip status correction only.
- Observability or alerting impact: none.

## Result Report
- Task summary: restored blocked Paperclip disposition for the protected workers readiness smoke principal gate.
- Files changed: this evidence artifact plus source-of-truth state entries.
- How tested: API readback of [LUC-241](/LUC/issues/LUC-241) status/blocker state before and after correction.
- What is incomplete: protected `/workers/ready` proof remains blocked until Security/QA closes [LUC-2619](/LUC/issues/LUC-2619) and [LUC-1438](/LUC/issues/LUC-1438) with accepted smoke auth binding evidence.
- Next steps: Security/QA binding owners continue [LUC-2619](/LUC/issues/LUC-2619) and [LUC-1438](/LUC/issues/LUC-1438); Ops resumes only after those blockers close.
