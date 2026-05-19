# Audit Decision Repair Playbooks - 2026-05-19

## Context

This document turns the audit decisions from
`docs/operations/audit-decision-packet-2026-05-19.md` into implementation-ready
playbooks. It did not itself accept a decision, change runtime behavior, or
authorize production/LIVE/exchange mutation. `DEC-AUD-001` and `DEC-AUD-002`
were later accepted on 2026-05-19 and applied to source-of-truth wording.

Accepted decisions:

- `DEC-AUD-001`: exchange-scope architecture wording for `AUD-01`.
- `DEC-AUD-002`: assistant runtime truth for `AUD-20`.

## Use Rules

- Start future similar repairs only after the user explicitly chooses one
  option.
- Record the accepted option in `.agents/state/decision-register.md` before
  changing architecture or runtime behavior.
- Keep production proof separate from local implementation truth.
- Do not run LIVE order submit/cancel/close, exchange-side mutation, or
  existing production data mutation without separate explicit approval.

## DEC-AUD-001 Playbook - Exchange Scope

### Option 1 - Current Binance + Gate.io Implementation Truth

Use when the accepted decision is that Gate.io is canonical implementation
scope now.

Likely files:

- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- `docs/architecture/reference/exchange-access-ownership-matrix.md`
- `docs/modules/api-exchange.md`
- `docs/analysis/audit-baseline-2026-05-19.md`
- `docs/analysis/reusable-audit-registry.md`
- `.agents/state/decision-register.md`
- `.agents/state/risk-register.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/next-steps.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

Implementation steps:

1. Record the accepted decision.
2. Replace high-level `Binance-only` / `one exchange family` wording with
   implementation-support wording for Binance and Gate.io.
3. Explicitly state that production readiness is evidence-scoped and does not
   imply unrestricted LIVE or exchange-side mutation.
4. Reconcile overview/domain wording with exact `(exchange, marketType)`
   runtime context docs and the exchange access ownership matrix.
5. Update audit status from decision-required to current or staged-current.

Required validation:

- `corepack pnpm run docs:parity:check`
- `corepack pnpm --dir apps/api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAdapterRegistry.service.test.ts --reporter=default`
- `corepack pnpm --dir apps/api run typecheck`
- `corepack pnpm run quality:guardrails`
- `git diff --check`

Stop conditions:

- Any doc would imply fresh production proof that has not been run.
- Any change would authorize LIVE mutation without separate approval.

### Option 2 - Approved Staged Gate.io Adapter Scope

Use when the accepted decision is that Gate.io is approved code/adapter scope,
but production-readiness claims remain narrow and evidence-bound.

Likely files: same as option 1.

Implementation steps:

1. Record the accepted decision.
2. Keep production baseline wording conservative, but clarify that Gate.io is
   an approved staged adapter in code and reference contracts.
3. Explicitly separate:
   - code-supported exchange contexts,
   - locally verified adapter/capability truth,
   - production proof/resource scope,
   - forbidden LIVE/exchange mutation without approval.
4. Update `AUD-01` from failed wording drift to staged architecture truth.

Required validation: same as option 1.

Stop conditions:

- The wording still lets agents treat Gate.io as either unsupported or fully
  production-proven without reading evidence.
- The wording hides the staged nature of Gate.io.

### Option 3 - Narrow Back To Binance-Only

Use only if the accepted decision is to remove or defer Gate.io as canonical
implementation scope.

Likely files:

- all option 1 architecture/docs files
- `libs/shared/index.js`
- `apps/api/src/modules/exchange/**`
- `apps/web/src/features/exchanges/**`
- affected tests and module docs

Implementation steps:

1. Record the accepted decision.
2. Produce a code-removal or feature-flag plan before changing runtime code.
3. Remove or clearly disable Gate.io capability claims across shared options,
   API contracts, Web capability presentation, docs, and tests.
4. Preserve fail-closed behavior for stale Gate.io records if existing data can
   reference Gate.io.

Required validation:

- Option 1 validation commands.
- Focused Web exchange capability tests.
- Any migration/data compatibility tests required by the chosen disable path.

Stop conditions:

- Existing data compatibility cannot be preserved.
- Scope would require production data mutation.

## DEC-AUD-002 Playbook - Assistant Runtime Truth

### Option 1 - Implement Hot-Path Assistant Orchestration

Use when the accepted decision is to make assistant orchestration active in the
BACKTEST/PAPER/LIVE decision flow.

Likely files:

- `apps/api/src/modules/engine/**`
- `apps/api/src/modules/bots/botAssistant.service.ts`
- assistant trace/audit persistence surfaces
- `docs/architecture/11_assistant-runtime.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/modules/api-engine.md`
- `AI_TESTING_PROTOCOL.md`
- `.agents/state/decision-register.md`
- `.agents/state/risk-register.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/module-confidence-ledger.md`

Implementation steps:

1. Record the accepted decision and define the smallest safe runtime slice.
2. Design fail-closed integration points before coding.
3. Persist trace/audit metadata for assistant participation and degradation.
4. Keep deterministic strategy-only fallback when assistant is disabled,
   unavailable, timed out, or policy-blocked.
5. Prove BACKTEST/PAPER behavior before any LIVE claim.
6. Run AI red-team scenarios before deployable AI behavior is claimed.

Required validation:

- Existing assistant orchestrator tests.
- Engine focused service/unit pack.
- DB-backed runtime/pre-trade/orchestration smoke.
- New assistant hot-path tests for disabled, timeout, policy-blocked,
  malformed output, and trace persistence cases.
- `AI_TESTING_PROTOCOL.md` reproducible multi-turn scenarios.
- `corepack pnpm --dir apps/api run typecheck`
- `corepack pnpm run quality:guardrails`
- `git diff --check`

Stop conditions:

- Assistant output can directly authorize side effects.
- Fail-closed behavior is not proven.
- Trace/audit evidence is missing.
- LIVE mutation proof would be needed without explicit approval.

### Option 2 - Narrow To Foundation / Dry-Run Truth

Use when the accepted decision is to make architecture describe the current
implementation honestly: bot-scoped assistant config, subagent slots,
deterministic orchestrator tests, and dry-run foundation only.

Likely files:

- `docs/architecture/11_assistant-runtime.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/modules/api-engine.md`
- `docs/modules/api-bots.md`
- `docs/analysis/audit-baseline-2026-05-19.md`
- `docs/analysis/reusable-audit-registry.md`
- `.agents/state/decision-register.md`
- `.agents/state/risk-register.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/next-steps.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

Implementation steps:

1. Record the accepted decision.
2. Change assistant docs from current hot-path runtime language to
   foundation/dry-run language.
3. Keep future-state hot-path orchestration described only as planned or gated
   work.
4. Update `AUD-20` from failed hot-path claim to foundation-current.
5. Keep `AI_TESTING_PROTOCOL.md` as required before any future deployable AI
   behavior claim.

Required validation:

- `corepack pnpm run docs:parity:check`
- assistant orchestrator focused tests
- bot assistant config/dry-run e2e if behavior docs mention it as proven
- focused Web assistant route tests
- `corepack pnpm run quality:guardrails`
- `git diff --check`

Stop conditions:

- Wording still implies assistant is active in BACKTEST/PAPER/LIVE hot paths.
- Wording weakens future AI red-team requirements.

### Option 3 - Keep Current Claim As Explicit Future-State

Use only if the accepted decision is to preserve the hot-path architecture as
a future target while making current implementation status unmistakable.

Likely files: same documentation/state files as option 2.

Implementation steps:

1. Record the accepted decision.
2. Add explicit `future-state` labels to hot-path assistant sections.
3. Add current-state callouts beside future-state diagrams/contracts.
4. Keep `AUD-20` partial until implementation or narrowing occurs.

Required validation: same as option 2.

Stop conditions:

- Future-state language remains easy to misread as current implementation.
- Audit status becomes less clear than it is today.

## Shared Closure Checklist

For any accepted option:

- Update the decision register first.
- Update the relevant audit artifact and JSON if status changes.
- Update baseline, reusable registry, risk register, requirements matrix,
  module confidence, project state, task board, and next steps.
- Run relevant validation from the option.
- Confirm no local infra, Docker service, browser validation process, or DB/Redis
  port was left running if validation started them.
