# Task

## Header
- ID: LUC-1560
- Title: Verify Soar expected Coolify team/workspace binding
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-1556
- Priority: P1
- Module Confidence Rows: deployment / Coolify production target
- Requirement Rows: production deploy confidence / Coolify selector correctness
- Quality Scenario Rows: deployment safety, configuration correctness
- Risk Rows: wrong Coolify team/workspace could inspect or mutate the wrong project
- Iteration: 2026-06-02
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Parent `LUC-1556` was blocked on the expected Coolify team/workspace selector
for Soar production. Wrong selector context can make Ops inspect or mutate the
wrong Coolify project.

## Goal
Confirm the expected Coolify team/workspace binding through read-only API access,
without exposing secrets or changing Coolify state.

## Scope
- Paperclip issue context for `LUC-1560`.
- Coolify read-only API endpoints for teams, current team, configured project,
  configured production environment, and resources.
- Evidence and operations source-of-truth documentation only.

## Acceptance Criteria
- Redacted expected team/workspace identity or missing-binding status is recorded.
- Safe next proof is named: rerun the Coolify reconciler and compare discovered
  project/resources against expected topology.
- Parent `LUC-1556` can be unblocked or remains blocked with concrete owner/action.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay read-only against Coolify
- do not print or store secret values

## Definition of Done
- [x] Paperclip issue context read.
- [x] Coolify binding names checked without values printed.
- [x] Coolify current team/workspace selector verified.
- [x] Soar project and production environment visibility verified under that selector.
- [x] Redacted evidence recorded.
- [x] Paperclip source issue closed as done.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- deploy/restart/rollback/env/database/team/account/live-trading mutation

## Validation Evidence
- Tests: not applicable; read-only infrastructure verification.
- Manual checks:
  - `GET /api/issues/LUC-1560/heartbeat-context` -> pass.
  - names-only Coolify env binding check -> pass without printing secret values.
  - `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` presence -> absent in this runner.
  - `GET /api/v1/teams` -> pass, two teams visible.
  - `GET /api/v1/teams/current` -> pass at `2026-06-02T17:13:03Z`, current selector id `0`, name `LuckySparrow`.
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/environments` -> pass, `production` present.
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` -> pass at `2026-06-02T17:13:03Z`, production inventory has `6` applications, `1` PostgreSQL, and `1` Redis.
  - `GET /api/v1/resources` -> pass, `17` visible resource rows.
- Screenshots/logs: none; avoided to prevent accidental secret/account exposure.
- High-risk checks: mutation boundary verified; no production-impacting action performed.
- Reality status: verified

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID`
  remain absent; selector id `0` is recorded as non-secret config truth for
  future pinning if Security/Ops wants it.
- Health-check impact: none.
- Smoke steps updated: no; next safe proof is rerunning the Coolify resource
  reconciler against the expected topology.
- Rollback note: not applicable; no mutation performed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: none.

## Result Report
- Task summary: Confirmed expected Coolify team/workspace selector id `0`, name
  `LuckySparrow`, and verified Soar production project/environment visibility
  under that selector.
- Files changed: this task packet, evidence packet, active mission, project
  state, task board, Coolify deployment contract, runtime config ledger.
- How tested: read-only Paperclip context and Coolify API readback.
- What is incomplete: explicit `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` env
  binding remains absent, but this is not an active blocker while current-team
  and project-scoped reads resolve the expected selector and Soar topology.
- Next steps: rerun the Coolify resource reconciler and compare discovered
  project/resources against expected topology.
- Decisions made: keep selector id `0`, name `LuckySparrow`, as non-secret
  configuration truth; no production mutation authorized or performed.
