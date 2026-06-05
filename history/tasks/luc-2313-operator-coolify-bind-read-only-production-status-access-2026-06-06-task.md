# LUC-2313 Operator Coolify Bind Read-Only Production Status Access

Date: 2026-06-06
Stage: verification
Owner: Ops Release Lead
Issue: [LUC-2313](/LUC/issues/LUC-2313)
Process: release/deploy gate

## Context

Paperclip wake payload assigned [LUC-2313](/LUC/issues/LUC-2313) as a
critical Ops lane to bind and verify Coolify read-only production status access.
There were no pending comments in the wake payload; checkout was already
claimed by the harness and was not repeated.

## Goal

Verify and record that the current runner has read-only Coolify production
status access for Soar through the canonical `project -> production environment
-> resources` hierarchy.

## Scope

- Names-only Coolify binding presence.
- Authenticated read-only Coolify status projection for Soar project,
  production environment, and canonical production resources.
- Focused Coolify stack environment checker validation.
- [LUC-2313](/LUC/issues/LUC-2313) task and evidence artifacts.
- Source-control closure classification for this issue.

## Constraints

- Do not push, deploy, restart, rollback, edit environment variables, mutate
  databases, change team/account settings, run protected smoke, or perform
  live-trading actions.
- Do not store or print secret values, Coolify token values, cookies,
  screenshots, raw resource ids, generated database suffixes, internal host
  paths, or unnecessary deployment identifiers.
- Treat `COOLIFY_SOAR_APP_ID` or any single resource id as non-authoritative
  for release status.
- Do not stage or commit unrelated dirty backend/runtime/state changes.

## Definition of Done

- [LUC-2313](/LUC/issues/LUC-2313) evidence exists under `history/evidence/`.
- Focused validation passes.
- Affected capability/files, regression risk, and follow-up gaps are recorded.
- Commit/no-commit decision is explicit.
- Paperclip issue is moved to a durable final disposition.

## Forbidden

- Production mutation.
- Secret disclosure.
- Protected account or live-trading checks.
- Broad source-control cleanup across unrelated dirty files.

## Implementation Plan

1. Consume the scoped wake for [LUC-2313](/LUC/issues/LUC-2313).
2. Inspect local source-control state and identify affected files.
3. Run read-only Coolify status projection with redacted output boundaries.
4. Run focused Coolify env-check regression tests.
5. Write [LUC-2313](/LUC/issues/LUC-2313) task/evidence artifacts.
6. Update Paperclip with final disposition.

## Acceptance Criteria

- Required Coolify binding names are present without value disclosure.
- Read-only Coolify API resolves project `Soar` and environment label
  `production`.
- Production environment inventory reports the canonical eight resources:
  `soar-api`, `soar-web`, four worker applications, PostgreSQL, and Redis.
- `pnpm run ops:coolify-stack:env-check:test` passes.
- No unrelated dirty paths are staged.

## Validation Evidence

- Names-only binding scan: PASS. Required Coolify binding names are present;
  values were not printed.
- Read-only Coolify projection at `2026-06-05T22:14:35Z`: PASS. Confirmed
  project `Soar`, environment label `production`, six applications,
  PostgreSQL, Redis, zero generic services, and one visible global resource row
  in this least-privilege runner. Application rows report `running:unknown`;
  PostgreSQL and Redis report `running:healthy`.
- `pnpm run ops:coolify-stack:env-check:test`: PASS (`8/8` node test subtests).
- Source-control inspection: unrelated dirty backend/runtime/state and prior
  evidence/task files were present before this task and were not modified by
  this closure.

## Architecture Evidence

- Affected capability: Coolify production status access and release/deploy gate
  resource reconciliation.
- Affected chain: Ops release gate -> Coolify project/environment resource
  inventory -> production deploy/status proof.
- Approved model remains `project -> production environment -> resources`.
- No architecture mismatch was found.

## Deployment / Ops Evidence

- Deploy impact: none.
- Push status: not pushed.
- Production mutation: none.
- Rollback path: not invoked; any mutation still requires a separate release
  permit.

## Security / Privacy Evidence

- Data classification: redacted production deployment metadata.
- Secret handling: binding names only; no token values or raw identifiers
  stored in the artifact.
- Abuse cases considered: accidental mutation and accidental secret disclosure.
- Fail-closed boundary: read-only status access does not authorize deploy,
  restart, rollback, protected smoke, or account mutation.

## Result Report

Status: verified for read-only access and local source-control closure.

Fresh read-only Coolify projection confirmed the existing access can resolve the
Soar production status scope without exposing secret values. The closure also
confirmed that [LUC-2313](/LUC/issues/LUC-2313) does not need code changes; the
durable repo output is the task/evidence packet plus the Paperclip issue
disposition.

Residual risk: Coolify application inventory reports `running:unknown`, so it
does not prove Web/API/worker runtime readiness. Protected worker readiness,
SLO evidence, deploy recovery, and smoke checks remain separate release gates.
