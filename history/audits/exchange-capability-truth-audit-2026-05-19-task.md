# Exchange Capability Truth Audit Task - 2026-05-19

## Context

The reusable audit registry marks `AUD-09` as the Exchange Integration audit.
Prior architecture-code discrepancy work recorded `AUD-EXCH-002`: exact
operation support is not fully keyed by market type.

## Goal

Audit current exchange capability truth against canonical architecture and
record reusable evidence for future repair planning.

## Scope

- Inspect exchange integration architecture and ownership matrix.
- Inspect compatibility-stage shared capability matrix.
- Inspect operation support services and adapter registry.
- Inspect Web exchange capability gates.
- Run focused API and Web exchange capability tests.
- Scan for exchange SDK/transport ownership leaks.

## Out Of Scope

- No exchange capability refactor.
- No production journey.
- No LIVE order, cancel, close, or exchange-side mutation.
- No existing production data mutation.

## Implementation Plan

1. Read exchange architecture, ownership matrix, and module docs.
2. Inspect capability services, adapter registry, and Web gates.
3. Search for direct SDK/transport usage outside exchange-owned boundaries.
4. Run focused backend exchange tests.
5. Run focused Web exchange tests.
6. Write the operation artifact and update reusable audit state.

## Acceptance Criteria

- The audit clearly separates compatibility-stage exchange flags from exact
  operation support.
- The audit states whether `marketType` is part of operation support truth.
- Test results are recorded with command names.
- LIVE/exchange mutation exclusions are explicit.

## Definition Of Done

- `history/audits/exchange-capability-truth-audit-2026-05-19.md` created.
- `history/artifacts/exchange-capability-truth-audit-2026-05-19.json` created.
- `history/audits/audit-baseline-2026-05-19.md` updated.
- Project state, task board, system health, next steps, requirements, and risk
  register updated.
- Relevant validation commands run and results recorded.

## Result Report

Status: `DONE / AUDIT VERIFIED AFTER EXACT MATRIX FOLLOW-UP`

Evidence:

- API exchange capability/registry/boundary tests passed: `4` files, `21`
  tests.
- Web exchange capability tests passed: `2` files, `3` tests.
- SDK/transport scan found no direct exchange SDK/REST ownership outside
  exchange-owned boundaries; two CCXT-named type imports remain as
  maintainability debt.
- No production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed.

Follow-up repair:

`AUD09-EXACT-CAPABILITY-MATRIX-2026-05-19` closed `AUD-EXCH-002` by moving API
operation capability support to a single canonical `(exchange, marketType,
operation)` matrix. Focused exact contract tests, exchange boundary/registry
tests, and API typecheck passed. Follow-up
`AUD09-NEUTRAL-EXCHANGE-TYPE-ALIASES-2026-05-19` closed `AUD-EXCH-007` by
moving non-exchange orders/wallet consumers to neutral exchange-owned type
aliases; focused orders/wallet classifier tests passed.
