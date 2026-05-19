# Architecture Exchange Scope Wording Audit Task - 2026-05-19

## Context

The reusable audit registry marks `AUD-01` as Architecture-Code Conformance.
Prior architecture-code discrepancy work recorded `AUD-ARCH-001`: high-level
architecture exchange wording still implies Binance-only or one exchange family
while newer contracts and code support Binance and Gate.io.

## Goal

Audit the exchange-scope wording discrepancy and record a decision-ready
artifact without silently rewriting architecture.

## Scope

- Inspect architecture source-of-truth policy.
- Inspect overview/domain exchange wording.
- Inspect newer runtime/exchange contracts.
- Inspect shared exchange option truth.
- Record options for resolving the mismatch.

## Out Of Scope

- No architecture repair.
- No code behavior change.
- No production journey.
- No LIVE order, cancel, close, or exchange-side mutation.
- No existing production data mutation.

## Implementation Plan

1. Read architecture source-of-truth and reading-order docs.
2. Inspect `01_overview-and-principles.md` and `03_domain-model.md`.
3. Compare against `04_runtime-contexts.md`, `09_integrations...`, and the
   exchange ownership matrix.
4. Compare against shared exchange options and the latest `AUD-09` evidence.
5. Write the operation artifact and update reusable audit state.

## Acceptance Criteria

- The audit quotes the affected source files by path and describes the drift.
- The audit distinguishes code-supported exchange scope from production proof
  scope.
- The audit presents 2-3 valid options and does not silently choose one.
- LIVE/exchange mutation exclusions are explicit.

## Definition Of Done

- `docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.md`
  created.
- `docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.json`
  created.
- `docs/analysis/audit-baseline-2026-05-19.md` updated.
- Project state, task board, system health, next steps, requirements, and risk
  register updated.
- Repository guardrails/docs parity/diff checks run.

## Result Report

Status: `DONE / AUDIT FAILED AGAINST ARCHITECTURE DOC CONSISTENCY`

Evidence:

- `01_overview-and-principles.md` still says `Binance-only exchange scope`.
- `03_domain-model.md` still says `one exchange family in production scope`.
- `04_runtime-contexts.md`, `09_integrations...`, and the exchange access
  matrix describe exact `ExchangeContext` and Gate.io support.
- `libs/shared/index.js` includes `GATEIO` in exchange options and broad
  capability support.
- No production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed.

Final finding:

`AUD-ARCH-001` remains open until the user chooses whether to update
overview/domain to current implementation truth, mark Gate.io as transitional
approved adapter scope, or narrow newer contracts back to Binance-only.
