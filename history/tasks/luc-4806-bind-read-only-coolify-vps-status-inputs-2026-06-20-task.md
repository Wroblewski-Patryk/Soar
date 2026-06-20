# LUC-4806 Bind Read-Only Coolify/VPS Status Inputs

## Header
- ID: LUC-4806
- Title: [Security/Ops][Soar] Bind read-only Coolify/VPS status inputs for production health readback
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Security
- Depends on: [LUC-4767](/LUC/issues/LUC-4767)
- Priority: P0
- Iteration: 2026-06-20
- Operation Mode: BUILDER
- Mission ID: LUC-4806-COOLIFY-VPS-READONLY-BINDINGS-2026-06-20
- Mission Status: BLOCKED

## Context

[LUC-4767](/LUC/issues/LUC-4767) is blocked because the DRE heartbeat runner
does not expose read-only Coolify/VPS status binding names. This Security/Ops
task checked whether the current Security runner can provide or verify an
approved binding path without reading or writing secret values.

## Goal

Provide an approved redaction-safe read-only binding path for DRE, or block
with the exact missing binding families and named unblock owner/action.

## Scope

- Runtime input names only.
- Paperclip secret-store metadata access only, no secret values.
- Consumer issue: [LUC-4767](/LUC/issues/LUC-4767).
- Repository state/task evidence only.

## Implementation Plan

1. Consume scoped wake payload and avoid duplicate checkout because the harness
   already claimed the issue.
2. Review Security role and release/credential contracts.
3. Run names-only environment scan for Coolify/VPS/readback families.
4. Attempt metadata-only Paperclip secret listing to determine whether the
   binding is present in the store.
5. If the current agent cannot bind, create a first-class child blocker for the
   owner that can inject approved bindings.

## Acceptance Criteria

- No secret values are printed or stored.
- Present/missing binding families are documented by name family only.
- [LUC-4767](/LUC/issues/LUC-4767) has a concrete unblock path.

## Definition of Done

- [x] Names-only environment scan completed.
- [x] Secret metadata access result documented without secret values.
- [x] Exact missing binding families documented.
- [x] Follow-up blocker owner/action identified.

## Validation Evidence

- Tests: not applicable; no code path changed.
- Manual checks:
  - `Get-ChildItem Env:` filtered to binding-name families only.
  - `GET /api/companies/{companyId}/secrets` returned `Board access required`.
  - Paperclip agents API identified DRE as the consumer and root operating
    assistant as the available owner with company-wide routing capability.
- High-risk checks:
  - No secret values, tokens, cookies, raw logs, screenshots, account data, or
    raw Coolify objects were read back or stored.
- Reality status: blocked.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none performed by this agent.
- Health-check impact: [LUC-4767](/LUC/issues/LUC-4767) remains blocked until
  approved read-only Coolify/VPS status bindings are injected into the DRE
  runtime.
- Rollback note: not applicable; no mutation occurred.

## Security / Privacy Evidence

- Data classification: secret metadata and runtime binding-name inventory.
- Trust boundaries: Paperclip secret-store board access gate blocked direct
  inspection/injection by this Security runner.
- Permission or ownership checks: current agent lacks board-level secret
  metadata access; DRE owns health readback after binding injection.
- Abuse cases: avoided secret value readback, raw log capture, runtime
  mutation, deploy/restart/rollback, and database/Redis mutation.
- Secret handling: names-only; no values stored.
- Fail-closed behavior: [LUC-4806](/LUC/issues/LUC-4806) must remain blocked
  on the child secret-binding issue until injection is complete.
- Residual risk: Coolify/VPS deployment status, active deploy queue,
  restart/resource pressure, PostgreSQL/Redis/container health, redacted
  pressure/log signals, and worker backlog/health projection remain unverified.

## Result Report

- Task summary: verified this runner cannot satisfy the binding directly and
  prepared a first-class blocker path for approved runtime injection.
- Files changed:
  - `.codex/context/TASK_BOARD.md`
  - `history/tasks/luc-4806-bind-read-only-coolify-vps-status-inputs-2026-06-20-task.md`
- How tested: names-only runtime scan and metadata-only secret API attempt.
- What is incomplete: approved read-only Coolify/VPS binding injection.
- Next steps: Paperclip root/secret-store owner completes child blocker
  [LUC-4811](/LUC/issues/LUC-4811) by injecting the approved read-only binding
  families into the DRE runtime, then DRE resumes
  [LUC-4767](/LUC/issues/LUC-4767).
