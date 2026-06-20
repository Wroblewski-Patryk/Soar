# LUC-4811 Inject Read-Only Coolify/VPS Status Bindings

## Header
- ID: LUC-4811
- Title: [Secret Binding][Soar] Inject read-only Coolify/VPS status bindings into DRE runtime
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: AI Assistant / secret-store routing
- Depends on: [LUC-4806](/LUC/issues/LUC-4806), [LUC-4767](/LUC/issues/LUC-4767)
- Priority: P0
- Iteration: 2026-06-20
- Operation Mode: BUILDER
- Mission ID: LUC-4811-COOLIFY-VPS-DRE-BINDING-INJECTION-2026-06-20
- Mission Status: BLOCKED

## Context

[LUC-4811](/LUC/issues/LUC-4811) is the child blocker created from
[LUC-4806](/LUC/issues/LUC-4806), which itself blocks DRE read-only
Coolify/VPS health evidence collection in [LUC-4767](/LUC/issues/LUC-4767).
The requested action is to inject approved read-only status bindings into the
DRE heartbeat/runtime environment. This heartbeat stayed names-only and
redaction-safe.

## Goal

Inject approved read-only Coolify/VPS status bindings into DRE runtime, or
block with exact evidence proving why this agent cannot perform the binding and
who must unblock it.

## Scope

- Paperclip issue/runtime configuration review.
- Names-only runtime environment scan.
- Metadata-only secret-store access attempt.
- Agent adapter config scan for existing read-only `COOLIFY*` / `VPS*`
  secret refs.
- Repository state and issue disposition only.

## Implementation Plan

1. Consume scoped wake payload and avoid duplicate checkout because the harness
   already claimed this issue.
2. Read Paperclip role/skill instructions and Soar mission state needed for
   the blocker chain.
3. Inspect heartbeat context for [LUC-4811](/LUC/issues/LUC-4811) and parent
   blockers.
4. Scan this runtime for Coolify/VPS binding names without printing values.
5. Attempt Paperclip secret metadata access without reading values.
6. Inspect accessible agent adapter configurations for existing
   `COOLIFY*`/`VPS*` env secret refs that could be safely copied by reference.
7. Update issue and repo state with final disposition.

## Acceptance Criteria

- No secret values, cookies, tokens, raw logs, screenshots, resource ids, or
  account data are printed or stored.
- Binding-name evidence is recorded.
- If injection cannot be performed, the issue is blocked with exact owner and
  unblock action.

## Definition of Done

- [x] Names-only DRE/root runtime scan completed.
- [x] Secret metadata path tested without value readback.
- [x] Accessible agent adapter configs checked for existing Coolify/VPS secret
      refs.
- [x] Final disposition recorded for [LUC-4811](/LUC/issues/LUC-4811).

## Validation Evidence

- Tests: not applicable; no product code changed.
- Manual checks:
  - `Get-ChildItem Env:` filtered to `COOLIFY|VPS|DRE|SOAR|PROD|PAPERCLIP`
    names only.
  - `GET /api/issues/{issueId}/heartbeat-context` confirmed
    [LUC-4811](/LUC/issues/LUC-4811) blocks
    [LUC-4806](/LUC/issues/LUC-4806), which blocks
    [LUC-4767](/LUC/issues/LUC-4767).
  - `GET /api/companies/{companyId}/secrets` returned `Board access required`.
  - `GET /api/agents/me` showed this agent's `adapterConfig.env` has
    `LIVEIMPORT_READBACK_*` refs only, not `COOLIFY*` or `VPS*`.
  - `GET /api/companies/{companyId}/agents` filtered for Coolify/VPS/SSH/DB
    status families found no accessible agent adapter config containing those
    binding names.
- High-risk checks:
  - No deploy, push, restart, rollback, production env edit, database/Redis
    mutation, account mutation, exchange/trading action, payment/subscription
    action, raw log capture, screenshot, or secret readback occurred.
- Reality status: blocked.

## Architecture Evidence

- Architecture source reviewed:
  - `docs/operations/runtime-config-ledger.csv`
  - `history/tasks/luc-4806-bind-read-only-coolify-vps-status-inputs-2026-06-20-task.md`
  - `history/evidence/luc-4767-coolify-vps-health-readback-blocked-2026-06-20.md`
- Fits approved architecture: yes.
- Mismatch discovered: no product architecture mismatch; access boundary is a
  secret-store permission boundary.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none performed.
- Health-check impact: [LUC-4767](/LUC/issues/LUC-4767) remains blocked until
  approved bindings are injected by a principal with board/secret-store access.
- Smoke steps updated: no.
- Rollback note: not applicable; no mutation occurred.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence

- Data classification: secret binding metadata and runtime environment names.
- Trust boundaries: Paperclip secret-store denies this agent metadata access
  with `Board access required`; runtime lacks matching binding names.
- Permission or ownership checks: this agent has task assignment permission
  only, not board secret-store access. Accessible agent configs do not expose
  transferable Coolify/VPS secret refs.
- Abuse cases: avoided invented bindings, raw secret value handling, broad env
  dumps, raw Coolify object capture, raw log capture, and production mutation.
- Secret handling: names-only; no values stored.
- Fail-closed behavior: issue is blocked rather than faking injection.
- Residual risk: DRE cannot run Coolify/VPS production health projection until
  bindings exist in its runtime.

## Result Report

- Task summary: injection could not be completed from this heartbeat because
  the current agent lacks board/secret-store access and no accessible agent
  config contains Coolify/VPS secret refs to bind by reference.
- Files changed:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `history/tasks/luc-4811-inject-read-only-coolify-vps-status-bindings-2026-06-20-task.md`
- How tested: names-only env scan, heartbeat context readback, metadata-only
  secret API attempt, and accessible agent config scan.
- What is incomplete: approved secret-store owner must bind the read-only
  Coolify/VPS status families into the DRE runtime.
- Next steps: Board/secret-store owner with access to Paperclip secrets must
  add approved read-only `COOLIFY*`/VPS status secret refs to the DRE
  adapter/runtime environment, then wake [LUC-4767](/LUC/issues/LUC-4767) for
  read-only health evidence collection.
