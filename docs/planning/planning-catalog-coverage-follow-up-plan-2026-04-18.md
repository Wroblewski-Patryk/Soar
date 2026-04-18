# Planning Catalog Coverage Follow-up Plan (2026-04-18)

Status: queued-after-active-waves  
Execution mode: tiny-commit only (one task per commit)  
Primary audience: planner + execution agent

## Objective
- Reconcile `docs/planning` so every meaningful plan is either:
  - implemented and explicitly closed,
  - queued in canonical execution files,
  - or marked as external-blocked/superseded with rationale.
- Queue remaining non-implemented work after active waves (`BRS`, then `UXR-G`).

## Catalog Audit Summary

## Implemented but status-drifted (needs docs sync, not feature reimplementation)
- `cpu-db-optimization-commit-plan-2026-04-06.md` (all `CPDB-01..24` marked completed in progress log).
- `security-audit-hardening-plan-2026-04-04.md` (all `SEC-01..14` marked completed in progress log).
- `vps-coolify-deployment-hardening-plan-2026-04-03.md` (all `DPL-21..32` marked completed in progress log; follow-up rehearsal still noted).
- `wallet-module-implementation-plan-2026-04-07.md` (all `WLT-01..25` marked completed in progress log).
- `i18n-contract-remediation-plan-2026-04-17.md` (`L10NQ` wave already closed in canonical queue).

## Not fully covered in active canonical queue (must be queued)
- `architecture-maintainability-audit-2026-04-18.md` (new findings not yet queued as execution wave).
- `position-lifecycle-parity-remediation-plan-2026-03-29.md` (`POS-36..42` still not executed/queued in current active queue).
- `live-exchange-takeover-parity-plan-2026-04-11.md` (implementation complete, but production rollout verification remains open).
- `v1-live-stability-closure-plan-2026-04-06.md` / `v1-live-release-plan.md` (external production evidence/sign-off closure remains open).

## Default Ordering Contract
1. Finish active `BRS-C`.
2. Execute queued `UXR-G`.
3. Run planning catalog reconciliation (`PLNC-*`).
4. Start architecture maintainability wave (`ARC-*`).
5. Execute lifecycle parity closure (`POS-*`).
6. Run production verification closure (`OPV-*`).

## Execution Groups
- `PLNC-A` (`PLNC-01..PLNC-04`): planning catalog reconciliation and status closure.
- `ARC-A` (`ARC-01..ARC-05`): runtime critical-path decomposition foundations.
- `ARC-B` (`ARC-06..ARC-10`): bots runtime CQRS/read-model decomposition.
- `ARC-C` (`ARC-11..ARC-13`): shared runtime/backtest indicator kernel alignment.
- `ARC-D` (`ARC-14..ARC-18`): web container slimming and shared UI decomposition.
- `ARC-E` (`ARC-19..ARC-20`): guardrail tightening and architecture closure evidence.
- `POS-A` (`POS-36..POS-38`): lifecycle-contract parity foundations.
- `POS-B` (`POS-39..POS-42`): runtime DCA/order parity + fixtures + operator QA.
- `OPV-A` (`OPV-01..OPV-04`): production follow-up verification and gate closure.

## Tiny-Commit Queue

### PLNC-01
`docs(audit-map): classify planning docs as implemented/queued/external-blocked/superseded`
- Build deterministic catalog index under `docs/planning`.
- Include explicit reason for each non-implemented active plan.

### PLNC-02
`docs(status-sync): update stale status lines in completed planning files`
- Update stale statuses in completed plans (`CPDB`, `SEC`, `DPL`, `WLT`, `L10NQ` related docs).
- Keep historical progress logs unchanged.

### PLNC-03
`docs(queue-link): add canonical queue linkage in active non-closed plans`
- Ensure non-closed plans explicitly reference canonical queue IDs/groups.
- Avoid orphan plans with no execution ownership.

### PLNC-04
`docs(sync): publish planning-catalog closure note in PROJECT_STATE/TASK_BOARD`
- Record what is implemented, what is queued, and what is external-blocked.

### ARC-01
`docs(contract): freeze ARC decomposition boundaries and no-drift guardrails`

### ARC-02
`refactor(api-runtime): extract typed runtime/live-ordering config from runtime services`

### ARC-03
`refactor(api-runtime): extract supervisor/watchdog from runtimeSignalLoop`

### ARC-04
`refactor(api-runtime): extract final-candle decision execution application service`

### ARC-05
`test(api-runtime): split and lock runtime regression by extracted seams`

### ARC-06
`refactor(api-bots-read): split session/symbol-stats read models from botsRuntimeRead.service`

### ARC-07
`refactor(api-bots-read): split trades/positions read models and repositories`

### ARC-08
`refactor(api-bots-command): move close-position command path out of read service`

### ARC-09
`feat(api-monitoring): add aggregate monitoring read endpoint for web consumers`

### ARC-10
`test(api+web-monitoring): lock aggregate read-model contract and fallback behavior`

### ARC-11
`feat(api-domain-kernel): extract shared indicator projection/evaluation kernel for runtime+backtests`

### ARC-12
`refactor(api-backtests): reduce backtests.service to facade over dedicated services`

### ARC-13
`test(api-parity): regression lock for shared kernel parity (runtime vs backtest)`

### ARC-14
`refactor(web-dashboard-home): split HomeLiveWidgets into view-model hooks + route contract config`

### ARC-15
`refactor(web-bots-monitoring): move client-side aggregation to API aggregate consumer`

### ARC-16
`refactor(web-datatable): split DataTable internals into state hooks/primitives`

### ARC-17
`fix(web-i18n): remove remaining BacktestRunDetails inline locale-branch labels`

### ARC-18
`test(web-ux-regression): lock decomposed container behavior and loading/stream states`

### ARC-19
`chore(guardrails): tighten production hotspot budgets after refactor waves`

### ARC-20
`docs(architecture-closure): publish maintainability delta and residual-risk snapshot`

### POS-36
`fix(contract): remove strategy-exit close bypass from backtest/replay and runtime close flow`

### POS-37
`fix(runtime): align automation mode/context with bot/position and manual-management guard`

### POS-38
`feat(runtime-capital): add shared paper/live capital context with affordability parity`

### POS-39
`refactor(runtime-dca): execute DCA through execution adapter parity path`

### POS-40
`refactor(backtest): unify lifecycle adapter and retire duplicate close semantics`

### POS-41
`test(parity): add golden parity fixtures across backtest/paper/live`

### POS-42
`qa(manual): publish Binance side-by-side operator verification script and triage`

### OPV-01
`qa(vps-rehearsal): execute Dockerfile-first stage/prod rehearsal and capture evidence`

### OPV-02
`qa(prod-live-takeover): verify takeover endpoint and private ops probes on production target`

### OPV-03
`ops(gates-refresh): refresh RC external-gate status/sign-off artifacts with new production evidence`

### OPV-04
`docs(closure): sync LBT/V1 stability plan statuses and residual external blockers`

## Definition of Done
- No active plan remains orphaned from canonical queue ownership.
- Stale statuses in completed plans are synchronized.
- Non-implemented work is queued in explicit grouped batches after active waves.
- External-blocked items are clearly labeled with owner and evidence requirement.
