# Task

## Header
- ID: LUC-1556
- Title: Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: VERIFIED
- Owner: CTO/Ops read-only release gate
- Depends on: none
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
`LUC-1556` asks the operator lane to confirm the expected Coolify team/workspace selector before trusting Soar production resource reconciliation.

## Goal
Verify the active Coolify selector through read-only API calls and record redacted evidence without changing Coolify, secrets, or production resources.

## Scope
- Paperclip heartbeat context for `LUC-1556`.
- Names-only Coolify runtime binding presence.
- Coolify read-only team, project, environment, and resource API readback.
- Evidence and project state updates only.

## Implementation Plan
1. Consume scoped Paperclip wake context without duplicate checkout.
2. Check Coolify binding presence by variable name only.
3. Use read-only Coolify API calls to confirm current selector, project, environment, and redacted inventory visibility.
4. Record task/evidence/state updates.
5. Close `LUC-1556` as done with proof summary.

## Acceptance Criteria
- Expected team/workspace selector is named by id and name.
- Soar project and production environment are visible under that selector.
- No secret values are written.
- No production mutation is performed.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay read-only against Coolify
- do not print or store secret values

## Definition of Done
- [x] Paperclip issue context read.
- [x] Coolify current team/workspace selector verified.
- [x] Soar project and production environment visibility verified under that selector.
- [x] Redacted evidence recorded.
- [x] No production mutation performed.

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
  - `GET /api/issues/LUC-1556/heartbeat-context` -> pass.
  - names-only env binding check -> pass without printing values.
  - `GET /api/v1/teams` -> pass, two teams visible.
  - `GET /api/v1/teams/current` -> pass at `2026-06-02T17:11:40Z`, current selector id `0`, name `LuckySparrow`.
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/environments` -> pass, `production` present.
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` -> pass at `2026-06-02T17:11:40Z`, production inventory has `6` applications, `1` PostgreSQL, and `1` Redis.
  - `GET /api/v1/resources` -> pass, `17` visible resource rows.
- Screenshots/logs: none; avoided to prevent accidental secret/account exposure.
- High-risk checks: mutation boundary verified; no production-impacting action performed.
- Reality status: verified

## Result Report
- Task summary: Confirmed expected Coolify team/workspace selector id `0`, name `LuckySparrow`, and verified Soar production project/environment visibility under that selector.
- Files changed: this task packet, evidence packet, project state, task board, active mission, system health.
- How tested: read-only Paperclip context and Coolify API readback.
- What is incomplete: explicit `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` binding remains absent but is not an active selector-evidence blocker while the selector is documented and project reads succeed.
- Next steps: run resource reconciliation when assigned.
- Decisions made: record selector as non-secret configuration truth; no production mutation authorized or performed.
