# LUC-1580 Confirm Coolify Team Workspace Task

## Context

Paperclip issue `LUC-1580` requested confirmation of the expected Coolify
team/workspace selector for Soar production. The risk is that a wrong Coolify
team context could make Ops inspect or mutate the wrong project.

## Goal

Confirm the expected Coolify team/workspace selector with read-only evidence and
record the result without exposing secrets or mutating Coolify.

## Scope

- Paperclip issue heartbeat context for `LUC-1580`
- Coolify read-only team, project, environment, and resource inventory calls
- Soar operations source-of-truth updates

## Constraints

- Do not print or store secret values, tokens, cookies, database URLs, exchange
  credentials, full resource ids, or internal connection URLs.
- Do not deploy, restart, roll back, edit environment variables, mutate database
  state, change team settings, mutate accounts, or touch live-trading state.
- Treat Coolify as `project -> environment -> resources`, not as one app id.

## Definition Of Done

- Expected Coolify team/workspace selector is named with id and name.
- Soar project and production environment resolve under the selector.
- Redacted production inventory count and resource names/types are recorded.
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
2. Verify Coolify binding names without printing secret values.
3. Run read-only Coolify API calls for current team, configured project,
   environments, and production resource projection.
4. Record redacted evidence and update operations source truth.
5. Close the Paperclip issue with final disposition and residual risk.

## Acceptance Criteria

- Expected Coolify team/workspace selector is named with id and name.
- Soar project and production environment resolve under the selector.
- Redacted production inventory count and resource names/types are recorded.
- Safety boundary confirms no production mutation and no secret exposure.
- Paperclip issue is closed with evidence.

## Result Report

Verified at `2026-06-02T19:03:41Z`: current Coolify team/workspace selector is
id `0`, name `LuckySparrow`; the configured project resolves to `Soar`, the
`production` environment is present, and the redacted inventory contains eight
resources: six applications plus PostgreSQL and Redis.

`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
that is not an active blocker for project/environment/resource reconciliation
because the exact selector is recorded as non-secret config truth and the
project-scoped readbacks succeed.

No deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action was performed.
