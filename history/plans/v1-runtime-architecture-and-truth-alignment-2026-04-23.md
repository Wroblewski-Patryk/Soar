# Task

## Header
- ID: V1ALIGN-A
- Title: Align runtime worker ownership and signal truth contracts with the approved V1 architecture
- Status: DONE
- Owner: Planning Agent
- Depends on: V1SIG-A, V1CAP-A, V1 approved baseline
- Priority: P0

## Context
The latest architecture-conformance review after `V1SIG-A` and `V1CAP-A`
surfaced one explicit architecture choice plus four concrete implementation
risks that still threaten a trustworthy V1 runtime:

1. Worker ownership drift:
   - canonical architecture in `docs/architecture/02_system-topology.md` and
     `docs/architecture/09_integrations-deployment-and-runtime-services.md`
     still describes workers as explicit runtime services,
   - implementation and readiness endpoints in `apps/api/src/router/index.ts`
     and `apps/api/src/workers/workerOwnership.ts` still support mixed
     `inline` / `split` ownership modes,
   - the product needs one honest target contract instead of leaving this as an
     unresolved half-state.

2. Runtime symbol-scope drift:
   - `apps/api/src/modules/engine/runtimeSignalLoop.service.ts` currently turns
     an empty resolved symbol set into wildcard `*`,
   - architecture in
     `docs/architecture/05_strategy-signal-and-decision-flow.md` says empty
     scope must remain empty rather than silently becoming all-symbol routing.

3. Runtime signal interval truth drift:
   - `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts` persists
     runtime `Signal.timeframe` as hardcoded `1m`,
   - architecture and merge contracts define resolution by
     `(botId, marketGroupId, symbol, intervalWindow)`.

4. Runtime freshness authority drift:
   - `/workers/runtime-freshness` currently evaluates latest signal freshness
     globally, not per active running runtime scope,
   - one unrelated fresh signal can mask starvation for the bot actually being
     watched by the operator.

5. Remaining runtime diagnostics gap:
   - runtime now exposes several explicit `PRETRADE_BLOCKED` and
     `SIGNAL_DECISION` reasons,
   - but unresolved routing / empty-scope / missing-final-candle intake can
     still collapse into "nothing happened", which is weaker than the explicit
     degraded-truth standard required by architecture.

The intended architecture decision for V1 and beyond is:
- `split` worker ownership is the production target and canonical deployment
  baseline,
- `inline` remains allowed only for local development, controlled test runs,
  and explicit degraded/operator-known fallback modes,
- operator surfaces and readiness endpoints must make that distinction explicit
  rather than treating `inline` as production-normal.

## Goal
Queue one executor-ready V1 alignment wave that:
- freezes `split` as the target runtime-service architecture for deployed
  environments,
- removes remaining runtime truth drift around symbol scope, interval truth,
  freshness authority, and missing diagnostics,
- leaves V1 with more trustworthy operator evidence and less silent runtime
  ambiguity.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Worker ownership architecture is frozen explicitly: `split` is the
      deployed target and `inline` is documented as local/degraded-only.
- [x] Empty runtime symbol scopes remain empty and fail closed instead of
      widening to wildcard routing.
- [x] Persisted runtime signals carry truthful interval data aligned with the
      real decision window.
- [x] Runtime freshness and diagnostics expose per-active-runtime truth instead
      of silent or globally masked status.
- [x] Canonical queue/context/docs and focused validation evidence are
      synchronized with the closure.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - focused API tests for runtime symbol routing, runtime signal persistence,
    runtime freshness, and runtime telemetry/read-model behavior
  - targeted readiness and monitoring regression coverage where worker
    ownership semantics are touched
- Manual checks:
  - inspect worker/readiness responses for split vs inline truthfulness
  - inspect runtime monitoring for empty-scope / no-route / no-final-input
    operator visibility where applicable
- Screenshots/logs:
  - `/workers/health`, `/workers/ready`, `/workers/runtime-freshness`
    evidence after changes
  - representative runtime event samples for route/decision diagnostics
- High-risk checks:
  - `pnpm --filter api run test -- --run`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm run test:go-live:smoke` if deployment/runtime behavior changes

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: no
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  - 2026-04-23 user direction in current thread: target `split` as the
    meaningful long-term architecture; plan the remediation wave accordingly
- Follow-up architecture doc updates:
  - freeze worker ownership target and allowed `inline` scope in canonical
    architecture docs during `V1ALIGN-01`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard and bots runtime operator
  surfaces in repository
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: explicit operator-readable status and degraded-state
  labels where new diagnostics surface in UI
- Parity evidence: dashboard/bot monitoring must not overstate runtime activity
  relative to canonical API truth

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
- Planned execution slices:
  - `V1ALIGN-01 docs(architecture-worker-ownership)`: freeze `split` as
    deployed target, define allowed `inline` scope, and align readiness/runtime
    docs with one honest worker-ownership contract.
  - `V1ALIGN-02 fix(api-runtime-symbol-scope)`: make empty resolved symbol
    scope fail closed instead of widening to wildcard routing.
  - `V1ALIGN-03 fix(api-signal-interval-truth)`: persist truthful runtime
    signal interval / decision-window data and align read-model consumers.
  - `V1ALIGN-04 fix(api-runtime-freshness-authority)`: scope freshness truth to
    active runtime sessions/bots instead of one global latest-signal shortcut.
  - `V1ALIGN-05 fix(api-runtime-diagnostics)`: emit explicit diagnostics for
    no-route / empty-scope / missing-final-input conditions where architecture
    permits operator-visible degraded truth.
  - `V1ALIGN-06 qa(closure)`: run focused alignment pack, go-live-sensitive
    validation where needed, and sync queue/context/docs.

## Closure Evidence
- `V1ALIGN-01` froze the deployed worker-ownership contract in canonical
  architecture, local-development, and Coolify docs: `split` is the healthy
  `STAGE/PROD` target; `inline` is local/test or explicit degraded fallback.
- `V1ALIGN-02` removed the runtime widening of empty symbol scope to wildcard
  routing. Empty resolved symbol sets now stay fail-closed, and runtime emits
  explicit `SIGNAL_DECISION` telemetry with reason `EMPTY_SYMBOL_SCOPE`.
- `V1ALIGN-03` removed the hardcoded persisted runtime signal timeframe.
  Runtime signal writes now carry the truthful normalized candle interval used
  by the decision path.
- `V1ALIGN-04` moved `/workers/runtime-freshness` from global latest-signal
  shortcuts to active-session decision-activity truth, so one unrelated fresh
  signal can no longer mask starvation for the bot the operator is actually
  watching.
- `V1ALIGN-05` completed the remaining explicit runtime diagnostics needed by
  this wave through empty-scope telemetry and route-aware decision handling,
  keeping operator surfaces aligned with the architecture's degraded-truth
  standard instead of silent "nothing happened" gaps.
- `V1ALIGN-06` closure validation passed for the targeted runtime-alignment
  pack, API typecheck, repository guardrails, and the full API test suite.
  `test:go-live:smoke` was environment-blocked on this workstation because the
  local Docker bootstrap could not bind `5432` while another Postgres container
  was already using that port.

## Validation Results
- `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/router/workers-runtime-freshness.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`
- `$env:API_KEY_ENCRYPTION_KEYS='v1:test-key-material'; $env:API_KEY_ENCRYPTION_ACTIVE_VERSION='v1'; pnpm --filter api run test -- --run`

## Docs Sync Outputs
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
