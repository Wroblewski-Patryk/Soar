# Task

## Header
- ID: LUC-1522
- Title: Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
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
`LUC-1522` asks Ops to confirm the expected Coolify team/workspace selector so
future Soar production resource checks do not accidentally run in the wrong
Coolify workspace.

## Goal
Freshly verify the selector through read-only Coolify API access and record
redacted evidence without changing Coolify settings.

## Scope
- Paperclip issue context for `LUC-1522`.
- Coolify read-only API endpoints for teams, current team, configured project,
  and configured production environment.
- Evidence and operations source-of-truth documentation only.

## Implementation Plan
1. Read scoped Paperclip issue context.
2. Check Coolify binding presence by variable name only.
3. Use read-only Coolify API calls to confirm current selector and project visibility.
4. Record redacted proof in task/evidence and operations docs.
5. Close the issue as done with the proof summary.

## Acceptance Criteria
- Expected team/workspace selector is named by id and name.
- Soar project and production environment are visible under that selector.
- No secret values or resource ids are written.
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
- [x] Issue disposition updated to `done`.

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
  - `GET /api/issues/LUC-1522/heartbeat-context` -> pass.
  - names-only env binding check -> pass without printing values.
  - `GET /api/v1/teams` -> pass, two teams visible.
  - `GET /api/v1/teams/current` -> pass at `2026-06-02T15:04:09Z`, id `0`, name `LuckySparrow`.
  - `GET /api/v1/projects/{configured-project-id}` -> pass, project `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` -> pass, six applications plus PostgreSQL and Redis.
- Screenshots/logs: none; avoided to prevent accidental secret/account exposure.
- High-risk checks: mutation boundary verified; no production-impacting action performed.
- Module confidence ledger updated: not applicable; no product module behavior changed.
- Requirements matrix updated: not applicable; issue evidence is the source for this confirmation checkpoint.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable; existing deployment selector risk was refreshed, not changed.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: Ops deployment contract.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none; `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent, and the non-secret selector is recorded as id `0`, name `LuckySparrow`.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback needed because no mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: n/a.

## Result Report
- Task summary: Confirmed expected Coolify team/workspace selector id `0`, name `LuckySparrow`, and verified Soar production visibility under that selector.
- Files changed: this task packet, this evidence packet, operations deployment contract, runtime config ledger, active mission state.
- How tested: read-only Paperclip context and Coolify API readback.
- What is incomplete: explicit `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` binding remains absent but is not an active blocker while the selector is documented and project reads succeed.
- Next steps: run resource reconciliation when assigned.
- Decisions made: record selector as non-secret configuration truth; no production mutation authorized or performed.
