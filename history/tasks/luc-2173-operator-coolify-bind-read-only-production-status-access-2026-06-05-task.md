# LUC-2173 Operator Coolify Bind Read-Only Production Status Access

Date: 2026-06-05
Stage: verification
Owner: Ops Release Lead
Issue: [LUC-2173](/LUC/issues/LUC-2173)

## Context

Paperclip wake payload assigned [LUC-2173](/LUC/issues/LUC-2173) as a critical
Ops issue to bind or verify Coolify read-only production status access. The
wake had no pending comments, `fallbackFetchNeeded=false`, and checkout was
already claimed by the harness.

## Goal

Verify that the current runner can perform read-only Coolify production status
access for Soar through the canonical `project -> production environment ->
resources` hierarchy, then record no-secret evidence and close the issue.

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
4. Update operational source truth and issue evidence.

## Acceptance Criteria

- Required Coolify binding names are present without value disclosure.
- Read-only Coolify API resolves project `Soar` and environment `production`.
- Production environment inventory reports the canonical eight resources.
- Focused env-check test passes.
- Issue can be closed without follow-up blockers.

## Definition Of Done

- Evidence file written under `history/evidence/`.
- Task contract written under `history/tasks/`.
- Relevant operations source truth updated.
- No production mutation occurred.

## Result Report

Status: verified.

Fresh read-only Coolify readback at `2026-06-05T10:52:27Z` confirmed required
binding names are present without value disclosure, configured project `Soar`,
production environment `production`, six applications, PostgreSQL, Redis, zero
generic services, `17` visible global resource rows, and eight
production-environment resources. Application inventory status remains
`running:unknown`; PostgreSQL and Redis report `running:healthy` from
production environment readback.

Validation passed:

- Authenticated read-only Coolify project/environment/resource projection.
- `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).

No push, deploy, restart, rollback, environment edit, database action, team
setting change, account action, protected smoke, secret value readback, raw
resource id storage, generated DB suffix storage, screenshot, or live-trading
action was performed.

Evidence:

- `history/evidence/luc-2173-coolify-read-only-production-status-access-2026-06-05.md`
