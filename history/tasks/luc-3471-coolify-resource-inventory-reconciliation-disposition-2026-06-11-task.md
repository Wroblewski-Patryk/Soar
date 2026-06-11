# Task

## Header
- ID: LUC-3471
- Title: Reconcile Coolify Resource Inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: LUC-3437, LUC-3461 evidence
- Priority: P0
- Module Confidence Rows: operations/deploy confidence
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: QA-021, QA-039
- Risk Rows: production deploy confidence, Coolify resource ambiguity
- Iteration: 2026-06-11 SPM heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3471
- Mission Status: VERIFIED_BY_EXISTING_FRESH_EVIDENCE

## Context

[LUC-3471](/LUC/issues/LUC-3471) asked for reconciliation of the Soar
production Coolify resource inventory so deploy verification does not treat one
legacy app id as the whole deployment.

Fresh same-day evidence already exists:

- [LUC-3437](/LUC/issues/LUC-3437) reconciled the inventory through read-only
  Coolify API access at `2026-06-11T04:29:51Z`.
- [LUC-3461](/LUC/issues/LUC-3461) rechecked production health and reconfirmed
  the same eight canonical resources at `2026-06-11T12:52:30Z`.

## Goal

Close [LUC-3471](/LUC/issues/LUC-3471) without duplicating Coolify reads or
creating another Ops lane when the current source of truth is already fresh,
redacted, and resource-by-resource.

## Scope

- Paperclip heartbeat context for [LUC-3471](/LUC/issues/LUC-3471).
- Existing repo evidence:
  - `history/evidence/luc-3437-coolify-resource-inventory-reconciliation-2026-06-11.md`
  - `history/evidence/luc-3461-coolify-production-health-sweep-2026-06-11.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/service-topology.md`
  - `docs/operations/runtime-config-ledger.csv`
  - `.agents/state/system-health.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`

## Implementation Plan

1. Read scoped Paperclip issue context.
2. Verify whether a newer resource ledger exists in repository source truth.
3. Confirm the latest source truth already names production resources,
   statuses, counts, residual risks, and no-secret/no-mutation boundaries.
4. Record this SPM disposition and close the issue as complete by reference to
   the fresh evidence.

## Acceptance Criteria

- The current canonical Coolify production inventory is named.
- The closure cites fresh evidence and source-of-truth docs.
- No secret values, raw resource ids, internal URLs, cookies, or log bodies are
  stored.
- No deploy, restart, rebuild, rollback, env edit, database action, Redis
  action, protected smoke, account action, or live-trading mutation occurs.

## Definition of Done

- [x] Fresh inventory evidence located.
- [x] Canonical eight-resource topology confirmed.
- [x] Residual release gates remain explicit.
- [x] Paperclip issue can be closed with `done` disposition.

## Forbidden

- Re-run Coolify or production checks unnecessarily.
- Print or store token values, raw ids, internal URLs, cookies, credentials,
  database values, or log bodies.
- Deploy, restart, rebuild, rollback, edit environment variables, mutate
  database/Redis state, run protected smoke, or mutate live-trading/account
  state.

## Validation Evidence

- Paperclip heartbeat context: [LUC-3471](/LUC/issues/LUC-3471) was
  `in_progress`, critical, with no first-class blockers.
- Readback of `history/evidence/luc-3437-coolify-resource-inventory-reconciliation-2026-06-11.md`
  confirms read-only Coolify API checks passed and resolved selector
  `LuckySparrow`, project `Soar`, configured production environment, `17`
  visible global resource rows, and `0` active deployment rows.
- Canonical production-environment resources remain:
  `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`, `postgresql`, and `redis`.
- Counts remain `6` applications, `1` PostgreSQL, `1` Redis, `0` generic
  services, `8` canonical production-environment resources.
- `docs/operations/coolify-vps-deployment-contract.md`,
  `docs/operations/service-topology.md`, `docs/operations/runtime-config-ledger.csv`,
  and `.agents/state/system-health.md` already contain the same current
  inventory reference.
- Tests: not run; this was a coordination/source-truth reconciliation using
  existing same-day runtime evidence, not code or runtime behavior change.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: no rollback required because no production state changed.
- Residual gates: public/protected smoke, protected `/workers/ready`, worker
  runtime freshness, release-grade image provenance, rollback proof, restore
  drill, SLO evidence, and release approval remain separate gates.

## Result Report

- Task summary: [LUC-3471](/LUC/issues/LUC-3471) is reconciled by the fresh
  [LUC-3437](/LUC/issues/LUC-3437) inventory and [LUC-3461](/LUC/issues/LUC-3461)
  health sweep, with source truth already updated.
- Files changed: this task disposition plus project state/task board entries.
- What is incomplete: no new Coolify read was performed because same-day
  evidence was already sufficient; full release readiness remains on separate
  protected gates.
- Decisions made: no duplicate Ops child issue was created.
