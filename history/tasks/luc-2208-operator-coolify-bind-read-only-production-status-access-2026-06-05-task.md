# LUC-2208 Operator Coolify Bind Read-Only Production Status Access

Date: 2026-06-05
Stage: verification
Owner: Ops Release Lead
Issue: [LUC-2208](/LUC/issues/LUC-2208)

## Context

Paperclip wake payload assigned [LUC-2208](/LUC/issues/LUC-2208) as a critical
Ops issue to bind or verify Coolify read-only production status access. The
wake had no pending comments, `fallbackFetchNeeded=false`, and checkout was
already claimed by the harness.

## Goal

Verify that the current runner can perform read-only Coolify production status
access for Soar through the canonical `project -> production environment ->
resources` hierarchy, then record no-secret evidence and close the issue.

## Scope

- Runtime env binding presence for Coolify access names only.
- Read-only Coolify API status projection for Soar project, production
  environment, and production resources.
- Evidence files under `history/evidence/` and `history/tasks/`.

## Constraints

- Do not deploy, restart, rollback, edit environment variables, mutate
  databases, change team/account settings, run protected smoke, or perform
  live-trading actions.
- Do not print or store Coolify token values, secret values, raw resource ids,
  generated database suffixes, cookies, screenshots, or protected response
  bodies.
- Treat `COOLIFY_SOAR_APP_ID` as legacy and do not use it as release
  authority.

## Implementation Plan

1. Read the scoped wake and Ops role boundary.
2. Run a names-only binding scan and authenticated read-only Coolify project,
   environment, and resource-status projection.
3. Run the focused Coolify stack environment checker tests.
4. Write redacted task and evidence artifacts.
5. Close the Paperclip issue with evidence and residual risk.

## Acceptance Criteria

- Required Coolify binding names are present without value disclosure.
- Read-only Coolify API resolves project `Soar` and environment `production`.
- Production environment inventory reports the canonical eight resources.
- Focused env-check test passes.
- Issue can be closed without follow-up blockers.

## Definition Of Done

- Evidence file written under `history/evidence/`.
- Task contract written under `history/tasks/`.
- Relevant verification command passes.
- No production mutation occurred.

## Validation Evidence

- Tests: `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8` node test
  subtests passed).
- Manual checks: authenticated read-only Coolify API calls for current team,
  teams list, configured project, environments, production environment, and
  global resources list.
- High-risk checks: no deploy, restart, rollback, env edit, database action,
  team setting change, protected smoke, screenshot, or live-trading action.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed: Ops role contract and issue description.
- Fits approved architecture: yes; uses `project -> production environment ->
  resources`.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: not needed; this confirms binding state.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none; existing bindings verified by name only.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback path invoked; production mutation not authorized.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence

- Data classification: production deployment metadata, redacted.
- Trust boundaries: Paperclip Ops runtime to Coolify API.
- Permission or ownership checks: read-only API status projection only.
- Abuse cases: accidental secret disclosure and accidental production mutation.
- Secret handling: binding names only; token and resource identifiers not
  stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: any mutation still requires a separate release permit.
- Residual risk: application status remains `running:unknown`, so runtime
  readiness still requires separate protected smoke.

## Result Report

Status: verified.

Fresh read-only Coolify readback at `2026-06-05T13:05:00Z` confirmed required
binding names are present without value disclosure, selector `LuckySparrow`,
configured project `Soar`, production environment `production`, six
applications, PostgreSQL, Redis, zero generic services, `17` visible global
resource rows, and eight canonical production-environment resources.
Application inventory status remains `running:unknown`; PostgreSQL and Redis
report `running:healthy` from production environment readback.

Validation passed:

- Authenticated read-only Coolify project/environment/resource projection.
- `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).

No push, deploy, restart, rollback, environment edit, database action, team
setting change, account action, protected smoke, secret value readback, raw
resource id storage, generated DB suffix storage, screenshot, or live-trading
action was performed.

Evidence:

- `history/evidence/luc-2208-coolify-read-only-production-status-access-2026-06-05.md`
