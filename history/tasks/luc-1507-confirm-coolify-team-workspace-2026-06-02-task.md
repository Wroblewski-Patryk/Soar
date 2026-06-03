# Task

## Header
- ID: LUC-1507
- Title: Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P1
- Module Confidence Rows: deployment/Coolify production target
- Requirement Rows: production deploy confidence
- Quality Scenario Rows: release safety, environment truth
- Risk Rows: wrong Coolify team/workspace selector
- Iteration: 2026-06-02 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: VERIFIED

## Context

Wrong Coolify team context can make Paperclip inspect or mutate the wrong project. LUC-1507 asked for the expected Coolify team/workspace selector to be bound or recorded before relying on production resource checks.

## Goal

Confirm and record the expected Coolify team/workspace selector for Soar without exposing secret values or mutating Coolify.

## Constraints
- Use existing Ops/Coolify documentation and Paperclip issue workflow.
- Do not introduce new systems.
- Do not mutate Coolify, production, env, database, account, or live trading state.
- Do not print or store secret values.

## Definition of Done
- [x] Coolify current team/workspace is read by API without printing secrets.
- [x] Configured Soar project resolves under the confirmed selector.
- [x] Redacted evidence and source-of-truth files are updated.
- [x] Issue disposition is set to `done`.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Secret value capture.
- Coolify mutation.

## Validation Evidence
- Tests: not applicable; no code changed.
- Manual checks:
  - `GET /api/issues/LUC-1507/heartbeat-context` passed.
  - Names-only Coolify env check passed; secret values were not printed.
  - `GET /api/v1/teams` passed.
  - `GET /api/v1/teams/current` passed and returned id `0`, name `LuckySparrow`.
  - `GET /api/v1/projects/{configured-project-id}` passed and resolved to `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` passed with six applications, one PostgreSQL, and one Redis.
- High-risk checks: no deploy, restart, rollback, env edit, database action, team setting change, account mutation, live trading mutation, or secret value readback.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none; `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent, but expected selector is recorded.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable because no production mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.
