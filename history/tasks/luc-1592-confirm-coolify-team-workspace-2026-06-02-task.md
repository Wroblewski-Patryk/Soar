# LUC-1592 Confirm Coolify Team Workspace Task

## Context

Paperclip issue `LUC-1592` requested confirmation of the expected Coolify
team/workspace selector for Soar production. The operational risk is that a
wrong Coolify selector could make Ops inspect or mutate the wrong project.

The scoped wake payload had no pending comments, `fallbackFetchNeeded=false`,
and the harness had already claimed checkout for this run. The absence of a
latest comment did not change the safe read-only proof path.

## Goal

Confirm the expected Coolify team/workspace selector with read-only evidence and
record the result without exposing secrets or mutating Coolify.

## Scope

- Paperclip issue heartbeat context for `LUC-1592`
- Coolify read-only team, project, environment, and resource inventory calls
- Soar operations source-of-truth updates

## Constraints

- Do not print or store secret values, tokens, cookies, database URLs, exchange
  credentials, full resource ids, or internal connection URLs.
- Do not deploy, restart, roll back, edit environment variables, mutate
  database state, change team settings, mutate accounts, or touch live-trading
  state.
- Treat Coolify as `project -> environment -> resources`, not as one app id.

## Definition Of Done

- Expected Coolify team/workspace selector is named with id and name.
- Soar project and production environment resolve under the selector.
- Redacted production inventory count and resource categories are recorded.
- Safety boundary confirms no production mutation and no secret exposure.
- Paperclip issue is closed with evidence.

## Forbidden

- Production-impacting Coolify operations.
- Secret exposure in repo files, issue comments, screenshots, or command output.
- Treating `COOLIFY_SOAR_APP_ID` or any single resource id as the deployment.

## Stage

Stage: `verification`

Expected output: read-only selector proof, source-truth updates, and Paperclip
closure.

## Implementation Plan

1. Read scoped Paperclip wake context and heartbeat context.
2. Confirm that the no-comment wake payload does not change the read-only proof
   path.
3. Verify Coolify binding names without printing secret values.
4. Run read-only Coolify API calls for current team, configured project,
   environments, production projection, and global resources count.
5. Record redacted evidence and update operations source truth.
6. Close the Paperclip issue with final disposition and residual risk.

## Acceptance Criteria

- Expected Coolify team/workspace selector is named with id and name.
- Soar project and production environment resolve under the selector.
- Redacted production inventory count and resource categories are recorded.
- Safety boundary confirms no production mutation and no secret exposure.
- Paperclip issue is closed with evidence.

## Result Report

Verified at `2026-06-02T20:51:42Z`: current Coolify team/workspace selector is
id `0`, name `LuckySparrow`; the configured project resolves to `Soar`, the
`production` environment is present with id `6`, and the redacted inventory
contains eight resources by established topology: six applications plus
PostgreSQL and Redis.

`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
that is not an active blocker for project/environment/resource reconciliation
because the exact selector is recorded as non-secret config truth and the
project-scoped readbacks succeed.

No deploy, restart, rollback, env edit, database action, team setting change,
account action, secret readback, or live-trading action was performed.
