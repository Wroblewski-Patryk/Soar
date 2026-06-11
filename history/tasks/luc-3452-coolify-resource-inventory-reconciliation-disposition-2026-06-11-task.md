# Task

## Header
- ID: LUC-3452
- Title: Reconcile Coolify Resource Inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: none
- Priority: P0
- Module Confidence Rows: operations/deploy confidence
- Requirement Rows: release resource inventory proof
- Quality Scenario Rows: deployment/resource verification
- Risk Rows: Coolify resource ambiguity
- Iteration: 2026-06-11 SPM heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3452
- Mission Status: VERIFIED_BY_EXISTING_FRESH_EVIDENCE

## Context

[LUC-3452](/LUC/issues/LUC-3452) was assigned to the Soar Product Manager to
own the known-state baseline and keep protected production gates intact. The
issue asks for Soar production Coolify resource inventory reconciliation.

## Goal

Confirm whether the requested inventory still needed a new Ops run or could be
closed against fresh verified source-truth evidence without repeating protected
or secret-adjacent work.

## Scope

- Paperclip issue context for [LUC-3452](/LUC/issues/LUC-3452).
- Existing verified Coolify inventory evidence from [LUC-3437](/LUC/issues/LUC-3437).
- Operations source-truth readback in:
  - `history/evidence/luc-3437-coolify-resource-inventory-reconciliation-2026-06-11.md`
  - `history/tasks/luc-3437-coolify-resource-inventory-reconciliation-2026-06-11-task.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/service-topology.md`
  - `docs/operations/runtime-config-ledger.csv`

## Implementation Plan

1. Read scoped Paperclip context for [LUC-3452](/LUC/issues/LUC-3452).
2. Read the only issue comment and confirm no newer operator instruction
   changes the safety boundary.
3. Read the latest verified Coolify inventory evidence and operations ledgers.
4. Close [LUC-3452](/LUC/issues/LUC-3452) as resolved by fresh verified
   evidence rather than duplicating Coolify access.

## Acceptance Criteria

- Current production resource inventory is named from fresh evidence.
- Source-truth files point at the fresh verified inventory.
- Protected production gates remain intact.
- No secret values, resource ids, logs, deploys, restarts, or runtime mutations
  occur.

## Definition of Done

- [x] Issue context read.
- [x] Existing verified evidence read.
- [x] Operations source-truth readback confirmed.
- [x] Paperclip disposition can be set to `done`.

## Forbidden

- Push, deploy, restart, rollback, environment edit, protected smoke, secret
  disclosure, raw log capture, database mutation, Redis mutation, account
  mutation, or live-trading action.

## Validation Evidence

- Paperclip heartbeat context for [LUC-3452](/LUC/issues/LUC-3452): issue is
  active, critical, assigned to SPM, no first-class blockers.
- Latest issue comment is the ownership assignment and preserves the forbidden
  protected-action boundary.
- Existing evidence readback:
  `history/evidence/luc-3437-coolify-resource-inventory-reconciliation-2026-06-11.md`
  checked at `2026-06-11T04:29:51Z`.
- Current source-truth readback:
  `docs/operations/coolify-vps-deployment-contract.md`,
  `docs/operations/service-topology.md`, and
  `docs/operations/runtime-config-ledger.csv` all reference [LUC-3437](/LUC/issues/LUC-3437)
  as the latest inventory.

## Result Report

- Status: `DONE / SUPERSEDED_BY_FRESH_VERIFIED_INVENTORY / NO_MUTATION`.
- Inventory: eight canonical production-environment resources: `soar-api`,
  `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`, `postgresql`, and `redis`.
- Residual: app readiness, protected smoke, worker readiness, rollback, restore,
  SLO evidence, database proof, and release approval remain separate gates.
- Files changed: this task disposition file only.
- Tests: not run; no code changed and no new Coolify readback was required.
