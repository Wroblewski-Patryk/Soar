# Task

## Header

- ID: LUC-2505
- Title: Rotate supported smoke auth binding accepted by workers/ready
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Security
- Depends on: [LUC-1438](/LUC/issues/LUC-1438)
- Priority: P1
- Module Confidence Rows: operations/security protected smoke auth
- Requirement Rows: protected worker readiness smoke
- Quality Scenario Rows: fail-closed protected ops endpoints
- Risk Rows: production credential/session freshness
- Iteration: 2026-06-06 security heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2505-SMOKE-AUTH-BINDING-WORKERS-READY-2026-06-06
- Mission Status: BLOCKED

## Context

[LUC-2505](/LUC/issues/LUC-2505) exists because [LUC-1438](/LUC/issues/LUC-1438)
proved public production smoke checks pass, but protected `GET /workers/ready`
still returns `401` with the previously available audit token mapping.

## Goal

Verify whether the current supported smoke auth bindings are accepted by Soar
API auth for read-only `GET /workers/ready`, and provide a secret-free blocker
or closure disposition.

## Scope

- `scripts/deploySmokeCheck.mjs`
- `scripts/resolveOpsAuthToken.mjs`
- `apps/api/src/router/index.ts`
- Production API/Web smoke endpoints
- History evidence and task packet only

## Implementation Plan

1. Read issue context and prior evidence.
2. Check names-only presence for supported smoke and audit auth bindings.
3. Review smoke auth resolution and worker readiness protection contract.
4. Run the smallest read-only production smoke proof using supported bindings.
5. Record secret-free evidence and issue disposition.

## Acceptance Criteria

- `SMOKE_AUTH_TOKEN` or `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD` is accepted
  by Soar API auth for `GET /workers/ready`; or
- the issue is marked blocked with exact failed binding classes, proof, and
  named unblock owner/action.

## Definition of Done

- Evidence states endpoint results without secret values.
- No protected values are written to repo files or issue comments.
- Paperclip issue receives a final durable disposition.

## Forbidden

- No live trading, exchange setting, subscription, API key, payment,
  deployment, database, or user-account mutation beyond approved credential
  validation.
- No secret values, cookies, tokens, passwords, account-private data, payment
  data, or exchange credentials in comments, docs, artifacts, screenshots, or
  logs.

## Validation Evidence

- Tests: not applicable; no code changed.
- Manual checks: production smoke/read-only endpoint checks listed in
  `history/evidence/luc-2505-smoke-auth-binding-workers-ready-2026-06-06.md`.
- Screenshots/logs: command summaries only, no screenshots.
- High-risk checks: secret values were not printed or stored.
- Module confidence ledger updated: no, no module implementation state changed.
- Requirements matrix updated: no, current requirement remains blocked.
- Quality scenarios updated: no, fail-closed behavior remains intact.
- Risk register updated: no, existing credential freshness risk remains.
- Reality status: blocked.

## Architecture Evidence

- Architecture source reviewed: `apps/api/src/router/index.ts`,
  `scripts/deploySmokeCheck.mjs`, `scripts/resolveOpsAuthToken.mjs`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none made by this run.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence

- `docs/security/secure-development-lifecycle.md` reviewed: yes, existing
  project security contract applied.
- Data classification: production credential/session metadata, secret-bearing
  values excluded from artifacts.
- Trust boundaries: protected ops endpoints require auth, admin role, and ops
  network access.
- Permission or ownership checks: `GET /workers/ready` uses `requireAuth`,
  `requireRole('ADMIN')`, and `requireOpsNetwork`.
- Abuse cases: invalid/stale token and invalid login both fail closed.
- Secret handling: names-only binding report; no values printed.
- Security tests or scans: read-only production smoke attempts.
- Fail-closed behavior: verified, `/workers/ready` returns `401` for current
  available bindings.
- Residual risk: QA/Ops cannot prove protected worker readiness until a valid
  production-smoke admin binding is rotated/provisioned.

## Result Report

- Task summary: verified current supported and admin-audit smoke binding
  candidates; all failed protected worker readiness acceptance.
- Files changed:
  - `history/evidence/luc-2505-smoke-auth-binding-workers-ready-2026-06-06.md`
  - `history/tasks/luc-2505-smoke-auth-binding-workers-ready-2026-06-06-task.md`
- How tested: production smoke command and process-local binding variants.
- What is incomplete: valid production-smoke admin principal/session is still
  missing or not accepted.
- Next steps: board-capable Security/Ops secret-store owner rotates/provisions
  a valid accepted binding and wakes [LUC-1438](/LUC/issues/LUC-1438).
- Decisions made: block [LUC-2505](/LUC/issues/LUC-2505); do not unblock QA
  from names-only binding presence because endpoint acceptance failed.
