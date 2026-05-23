# Task

## Header
- ID: V1COH-01+02
- Title: test+fix(api-orders): fail closed manual LIVE open on unresolved scope and inherited-context drift
- Status: DONE
- Owner: Backend Builder
- Depends on: `V1COH-A`
- Priority: P0

## Context
Residual V1 execution audit confirmed that manual `LIVE` order submission was
still too permissive compared with the approved singular bot contract. Read
paths already degraded safely when manual strategy scope could not be proven,
but the write path still trusted duplicated bot snapshot fields too much and
did not fail closed when the selected bot had no canonical symbol-matching
strategy context.

## Goal
Make manual `LIVE` order submission reuse the canonical inherited execution
context and reject writes when symbol scope or wallet+venue ownership cannot be
proven from the approved bot context.

## Constraints
- use existing runtime/manual-order systems only
- no workaround path or second authorization flow
- no weakening of current fail-closed contracts for `PAPER` or runtime
- keep read-path degraded defaults for manual context, but not for `LIVE`
  writes

## Definition of Done
- [x] `LIVE` manual open is rejected when the selected bot has no canonical
      symbol-matching strategy scope for the requested symbol.
- [x] `LIVE` manual open is rejected when wallet and market-universe venue
      truth drift, even if duplicated bot snapshot fields still look valid.
- [x] Focused service and route-level regressions prove accepted `LIVE`
      scenarios still pass when full canonical bot scope exists.

## Forbidden
- new systems without approval
- duplicated venue/scope authorization logic
- temporary bypasses or compatibility-only allowlists
- architecture changes without explicit approval

## Validation Evidence
- Tests: focused `orders.service` and `orders-positions.e2e` packs
- Manual checks: none
- Screenshots/logs: test output only
- High-risk checks: out-of-scope symbol, wallet/universe drift, valid scoped
  live open, runtime close route using the same canonical scope

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none expected

## UX/UI Evidence (required for UX tasks)
- Design source type: operator_report
- Design source reference: reported doubt around manual `LIVE` open correctness
- Required states: success | blocked
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: API write contract now matches the inherited bot context
  already used by runtime automation

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Completion Notes
- Reused `resolveInheritedRuntimeExecutionContext()` as the write-side venue
  authority for manual `LIVE` open.
- Reused the manual strategy resolver on the write path and made unresolved
  scope explicit through new order-domain errors instead of accepting degraded
  defaults.
- Aligned stale LIVE test fixtures to the canonical bot contract
  (`wallet + market universe + symbol group + strategy`) rather than loosening
  production safeguards.

## Validation Evidence
- `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`
