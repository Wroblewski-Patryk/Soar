# Signals + Open Runtime Parity Plan (2026-04-19)

Status: closed (2026-04-19)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: implementation agent

## Source Analysis Summary
- Dashboard home and bot runtime preview currently use different data-source shapes:
  - home: single selected primary session path,
  - runtime preview: aggregate multi-session path.
- Sidebar/select context has strategy source-of-truth drift risk between:
  - `listBots.strategyId` projection,
  - runtime topology (`runtime-graph` canonical group strategy links).
- Signals condition-lines can fall back to configured strategy context when latest signal strategy is absent.
- Manual order command path (`POST /dashboard/orders/open`) is not the same lifecycle path as runtime orchestrator open flow.

## Scope
- Signals on `/dashboard` and `/dashboard/bots/runtime/preview`.
- Position opening flows:
  - runtime orchestrator path,
  - dashboard manual order path.
- Source-of-truth and parity contracts across API + web read models.

## Scope Lock
1. No unrelated visual redesign outside signals/sidebar/runtime parity needs.
2. No broad module refactor not required by contract safety or failing regressions.
3. Keep fail-closed behavior in runtime decisions.

## Dependencies (already queued waves)
1. `DAGG` must complete first for dashboard aggregate selected-bot parity.
2. `SBSC` must complete first for sidebar strategy source-of-truth parity.
3. This wave (`SOPR`) extends those with signal-context hardening and manual-order lifecycle contract closure.

## Target Contract
1. For selected bot, signals markets + condition-lines must be bot-scoped and strategy-consistent.
2. `/dashboard` and `/dashboard/bots/:id/preview` must align on selected-bot positions/history/signals according to aggregate contract.
3. Runtime no-open outcomes must emit explicit operational diagnostics (blocked/ignored reasons) without ambiguity.
4. Manual order semantics must be explicitly locked and implemented:
  - either order-only command with explicit UX/telemetry contract,
  - or full position lifecycle via runtime orchestrator-equivalent command path.

## Execution Groups
1. `SOPR-A (commits SOPR-01..SOPR-04): source-of-truth closure + signal-context hardening`
2. `SOPR-B (commits SOPR-05..SOPR-08): dashboard/preview parity closure for signals/positions/history`
3. `SOPR-C (commits SOPR-09..SOPR-12): manual-order lifecycle decision + implementation + closure`

## Closure Snapshot (2026-04-19)
1. `SOPR-A`: closed with deterministic source tags and selected-bot scope locks in API+web regressions.
2. `SOPR-B`: closed with home-vs-preview parity regressions and published SOPR parity matrix evidence.
3. `SOPR-C`: closed with explicit manual-order `order-only` semantics, audit-safe metadata, contract tests, and full closure validation pack pass.

---

## Tiny-Commit Queue

### SOPR-01
`docs(contract): lock consolidated SOT and parity contract for signals/open flows after DAGG+SBSC`
- Scope:
  - Publish one merged contract referencing `DAGG` and `SBSC` as prerequisite foundations.
  - Freeze signal context precedence and diagnostics expectations.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/api-orders.md`
- Done when:
  - One unambiguous contract exists for selected-bot signal/open semantics.

### SOPR-02
`test(api-red): add regressions for neutral/no-recent-signal condition-line fallback contamination`
- Scope:
  - Reproduce case where condition-lines are sourced from fallback strategy not aligned with selected bot expectation.
  - Assert explicit source-tag expectations.
- Likely files:
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- Done when:
  - Regression fails on fallback contamination and passes only with hardened source contract.

### SOPR-03
`fix(api-signal-context): harden symbol->strategy fallback and expose explicit source tags`
- Scope:
  - Tighten fallback rules in symbol stats read-model path.
  - Expose source annotation (for example: `latest_signal`, `configured_fallback`) for operational clarity.
- Likely files:
  - `apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts`
  - `apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- Done when:
  - Condition-lines source is deterministic and traceable per symbol row.

### SOPR-04
`test(web-red): lock selected-bot signal cards against cross-bot strategy leakage`
- Scope:
  - Add web-level regression for two bots with different strategy contexts.
  - Assert immediate selected-bot signal card context refresh with no leakage.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - UI regression guards selected-bot signal context fidelity.

### SOPR-05
`test(parity-red): add selected-bot parity regression for /dashboard vs /dashboard/bots/:id/preview`
- Scope:
  - For the same selected bot, assert parity across:
    - positions,
    - history (including closed positions),
    - signals context.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.test.tsx` (or equivalent)
- Done when:
  - Red test captures any hidden divergence between home and preview.

### SOPR-06
`fix(web-parity): align dashboard-home signal/positions/history derivation to aggregate selected-bot contract`
- Scope:
  - Apply any required controller/view-model alignment after `DAGG`.
  - Ensure signals and tables consume one selected-bot aggregate source with consistent filtering.
- Likely files:
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - Home and preview stay parity-aligned under selected-bot aggregate contract.

### SOPR-07
`test(api-runtime): lock no-open diagnostics visibility for blocked/ignored outcomes`
- Scope:
  - Add/extend regression for explicit blocked diagnostics in runtime no-open cases.
  - Confirm diagnostics presence in operationally consumed payload/log path.
- Likely files:
  - `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-history-parity.e2e.test.ts`
- Done when:
  - No-open outcomes are explicitly diagnosable in tests.

### SOPR-08
`docs(parity-evidence): publish parity matrix evidence for signals/positions/history between home and preview`
- Scope:
  - Add closure artifact describing verified parity matrix and known edge cases.
- Likely files:
  - `docs/operations/sopr-parity-matrix-2026-04-19.md`
  - `docs/operations/_artifacts-sopr-parity-matrix-2026-04-19.json` (if produced)
- Done when:
  - Evidence pack exists and links to passing regression suites.

### SOPR-09
`docs(decision-gate): close manual-order semantics decision (order-only vs orchestrator lifecycle)`
- Scope:
  - Lock product decision with explicit API/UI/telemetry implications.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/web-dashboard-home.md`
- Done when:
  - Manual-order semantic contract is explicit and implementation-ready.

### SOPR-10
`test(red-manual-order): add contract tests for chosen manual-order semantic path`
- Scope:
  - If `order-only`: assert explicit non-position-opening semantics + UI/telemetry messaging contract.
  - If `lifecycle`: assert position/trade lifecycle parity path.
- Likely files:
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - Tests fail without semantic implementation and pass with chosen contract.

### SOPR-11
`feat/fix(manual-order-path): implement selected manual-order semantic path with audit-safe diagnostics`
- Scope:
  - Implement the locked manual-order contract:
    - order-only with explicit operator clarity OR
    - orchestrator-lifecycle parity command path.
  - Preserve fail-closed guardrails and audit metadata.
- Likely files:
  - `apps/api/src/modules/orders/orders.controller.ts`
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts` (only if lifecycle path chosen)
  - `apps/web/src/features/bots/services/bots.service.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - Manual order behavior matches locked product contract end-to-end.

### SOPR-12
`qa(closure): run full focused validation pack and sync canonical queue/context`
- Required commands:
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter web run test -- --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm i18n:audit:route-reachable:web` (if copy/routes touched)
- Done when:
  - Wave closure validation is green and queue/context are synchronized.

---

## Stage DoD

### Stage A DoD (`SOPR-A`)
- Signal context source-of-truth is explicit and tested.
- Fallback contamination risk is covered by failing-then-green regressions.

### Stage B DoD (`SOPR-B`)
- `/dashboard` and runtime preview are parity-aligned for selected bot across signals/positions/history.
- No-open runtime outcomes are explicitly diagnosable.

### Stage C DoD (`SOPR-C`)
- Manual-order semantics are decision-locked and implemented.
- Contract tests and closure validation pass.

## Risks and Rollback

### Stage A Risk / Rollback
- Risk:
  - Hardening fallback rules may reduce displayed context where signal data is sparse.
- Rollback:
  - Revert `SOPR-03` only while keeping source-tag tests to refine contract.

### Stage B Risk / Rollback
- Risk:
  - Enforcing strict parity may expose previously hidden aggregate/session assumptions.
- Rollback:
  - Revert `SOPR-06` and keep parity-red tests from `SOPR-05`.

### Stage C Risk / Rollback
- Risk:
  - Manual-order semantic shift may affect operator expectations and automation.
- Rollback:
  - Revert `SOPR-11`; keep decision doc + contract tests to avoid ambiguous behavior.

## Acceptance Criteria
1. For selected bot, signals show only bot-consistent markets and strategy condition context.
2. Switching selected bot refreshes strategy context and signals without cross-bot leakage.
3. `/dashboard` and `/dashboard/bots/:id/preview` are parity-aligned for selected-bot signals/positions/history.
4. Runtime no-open path provides explicit blocked/ignored diagnostics operationally.
5. Manual-order behavior is contract-locked and test-covered.
