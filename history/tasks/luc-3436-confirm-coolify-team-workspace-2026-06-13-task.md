# Task

## Header
- ID: LUC-3436
- Title: Confirm expected Coolify team/workspace
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Deployment and Reliability Engineer
- Depends on: none
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001 / Coolify team-workspace selector truth
- Requirement Rows: production deploy confidence
- Quality Scenario Rows: release safety, environment truth
- Risk Rows: wrong Coolify team/workspace selector
- Iteration: 2026-06-13 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: Soar production deploy confidence
- Mission Status: VERIFIED

## Context

Wrong Coolify team context can make Paperclip inspect or mutate the wrong project. `LUC-3436` asked for the expected Coolify team/workspace selector to be bound or recorded before relying on production resource checks.

## Goal

Confirm and record the expected Coolify team/workspace selector for Soar without exposing secret values or mutating Coolify.

## Constraints

- Use existing Ops/Coolify documentation and Paperclip issue workflow.
- Do not introduce new systems.
- Do not mutate Coolify, production, env, database, account, or live-trading state.
- Do not print or store secret values, token values, direct URLs, raw project ids, raw resource ids, cookies, credentials, logs, or raw Coolify objects.

## Definition of Done

- [x] Coolify current team/workspace is read by API without printing secrets.
- [x] Explicit team selector bindings are checked by presence and equality only.
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
  - `GET /api/issues/LUC-3436/heartbeat-context` passed.
  - Names-only Coolify binding check passed; values were not printed.
  - `GET /api/v1/teams/current` passed and returned team id `0`, name `LuckySparrow`.
  - `GET /api/v1/teams` passed with `1` visible team row.
  - `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` are present by name and match the current selector.
  - `GET /api/v1/projects/{configured-project-id}` passed and resolved to `Soar`.
  - `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` passed with environment `production`, six applications, one PostgreSQL, one Redis, and zero generic services.
- High-risk checks: no deploy, restart, rollback, env edit, database action, Redis action, team setting change, account mutation, protected smoke, raw log capture, screenshot, live-trading mutation, or secret value readback.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable because no production mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Result Report

- Task summary: confirmed expected Coolify selector as team id `0`, name `LuckySparrow`, with both explicit selector bindings matching current team.
- Files changed: `history/evidence/luc-3436-coolify-team-workspace-confirmation-2026-06-13.md`, this task packet, and source-of-truth ledger updates.
- How tested: read-only Paperclip context and Coolify API GET probes.
- What is incomplete: no application readiness or protected release smoke was attempted; those remain separate gates.
- Next steps: downstream Coolify reconciliation tasks may trust the explicit selector binding and continue with project/environment/resource comparison.
- Decisions made: the project/environment hierarchy remains authoritative for release status; global resource lists are supporting metadata only.
