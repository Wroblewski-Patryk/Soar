# Task

## Header
- ID: LUC-3573
- Title: Reconcile Coolify Resource Inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: production deploy confidence
- Quality Scenario Rows: release/deploy resource verification
- Risk Rows: Coolify resource ambiguity
- Iteration: 2026-06-11 SPM heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3573
- Mission Status: VERIFIED

## Context

[LUC-3573](/LUC/issues/LUC-3573) asked for the current Soar production
Coolify resource inventory so post-push verification can target each resource
instead of treating one legacy app id as the whole deployment.

## Goal

Use read-only Coolify access to reconcile the Soar production project,
environment, deployable applications, PostgreSQL, and Redis, then update the
redacted resource ledger.

## Constraints

- Use only Coolify `GET` endpoints.
- Do not print or store token values, raw resource ids, cookies, credentials,
  internal URLs, database values, or log bodies.
- Do not deploy, restart, rebuild, roll back, edit environment variables,
  mutate database or Redis state, change team/account settings, or run
  protected smoke.

## Definition Of Done

- [x] Coolify team/workspace, project, environment, and production resource
  list are identified without exposing secrets.
- [x] Resource-by-resource status/deploy metadata is recorded.
- [x] Operations source truth is updated.
- [x] Issue can be marked `done` with explicit residual risk.

## Forbidden

- Deploy, restart, rebuild, rollback, env mutation, database mutation, Redis
  mutation, secret mutation, account mutation, protected smoke, raw log dump,
  screenshot capture, or live-trading action.

## Result Report

- Task summary: Soar production Coolify inventory reconciled through read-only
  API access at `2026-06-11T19:36:01Z`.
- Current inventory: selector `LuckySparrow`, project `Soar`, production
  environment id `6`, six application resources, one PostgreSQL resource, one
  Redis resource, zero generic services, `17` visible global resource rows,
  and `0` active deployment rows.
- Canonical resources: `soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`,
  `postgresql`, and `redis`.
- How tested: authenticated read-only Coolify API `GET` calls; no code test was
  required because no application code changed.
- Files changed: this task packet, the evidence file, operations docs, and
  project state ledgers.
- What is incomplete: app readiness, protected smoke, worker freshness,
  rollback, restore, SLO, and release approval remain separate gates.
- Safety: no production mutation, secret value readback, raw resource id
  storage, log capture, screenshot, database/Redis mutation, or live-trading
  action occurred.

## Evidence

- `history/evidence/luc-3573-coolify-resource-inventory-reconciliation-2026-06-11.md`
