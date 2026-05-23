# Runtime Execution Dedupe Observability - 2026-05-23

## Context

The active architecture parity mission found one remaining drift in
`docs/architecture/reference/runtime-execution-idempotency-contract.md`: runtime
execution dedupe outcomes were persisted and tested, but the required
observability counters for hit, miss, inflight, and retry outcomes were not
exposed in the API metrics snapshot.

## Goal

Add evidence-backed runtime execution dedupe observability without changing the
dedupe safety contract or introducing exchange/order side effects.

## Constraints

- Keep runtime dedupe fail-closed behavior unchanged.
- Do not perform production LIVE order, position, exchange, or bot activation
  mutation.
- Keep metrics in the existing in-memory metrics store and `/metrics` payload.
- Use command-type and retry error-class buckets consistent with the
  architecture contract.

## Definition of Done

- Runtime dedupe `hit`, `miss`, `inflight`, and `retry` outcomes are counted.
- Metrics include per-command buckets and retry error-class buckets.
- Focused runtime dedupe tests prove each observed outcome.
- `/metrics` tests prove the payload exposes the new counters.
- API typecheck passes.

## Forbidden

- No workaround metrics outside the existing observability store.
- No duplicated dedupe decision logic.
- No LIVE exchange mutation or production data mutation.

## Stage

`implementation` -> `verification`

## Result Report

2026-05-23: Added runtime execution dedupe metrics to
`apps/api/src/observability/metrics.ts` and recorded outcomes from
`RuntimeExecutionDedupeService.acquire`. Snapshot cloning now deep-copies
per-command dedupe buckets so before/after metric assertions cannot share
mutable bucket references.

Validation:

- `pnpm --filter api exec vitest run src/modules/engine/runtimeExecutionDedupe.service.test.ts --run` -> PASS, `13/13`.
- `pnpm --filter api run typecheck` -> PASS.
- Initial `/metrics` test run failed because local Postgres on
  `localhost:5432` was unavailable, causing auth registration to return `500`.
- `pnpm run go-live:infra:up` started repo Postgres/Redis, then
  `pnpm --filter api exec vitest run src/router/metrics.test.ts --run` ->
  PASS, `5/5`.
