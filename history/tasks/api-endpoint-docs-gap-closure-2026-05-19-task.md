# Task

## Header
- ID: API-ENDPOINT-DOCS-GAP-CLOSURE-2026-05-19
- Title: Close endpoint-level API docs parity gaps
- Task Type: documentation
- Current Stage: verification
- Status: DONE
- Owner: Documentation
- Depends on: API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19
- Priority: P1
- Module Confidence Rows: no runtime status changes
- Requirement Rows: REQ-AUDIT-031
- Quality Scenario Rows: not changed
- Risk Rows: RISK-036
- Iteration: 2026-05-19 endpoint docs gap closure
- Operation Mode: BUILDER
- Mission ID: API-ENDPOINT-DOCS-GAP-CLOSURE-2026-05-19
- Mission Status: VERIFIED

## Process Self-Audit
- [x] The task selected a repairable audit finding from the active repair queue.
- [x] No product behavior or runtime API behavior was changed.
- [x] `AUD-01` was not repaired without the required architecture decision.
- [x] Endpoint docs parity was rerun after documentation updates.
- [x] Source-of-truth state was synchronized after the result changed.

## Mission Block
- Mission objective: close `AUD-03`/`AUD-23` endpoint documentation parity gaps.
- Release objective advanced: endpoint docs parity is now measurable and green.
- Included slices: root/ops endpoint doc ownership, missing route mentions in
  bots/orders/positions/wallets docs, endpoint parity rerun, audit-state sync.
- Explicit exclusions: DTO/response semantic contract audit, API behavior
  changes, production proof, LIVE/exchange mutation.
- Checkpoint cadence: update docs, run endpoint parity, sync state, run
  validation.
- Stop conditions: endpoint parity remains partial or docs parity fails.
- Handoff expectation: future route changes rerun endpoint parity.

## Context
The endpoint-level API docs parity audit found `32` undocumented route mentions
across `root`, `bots`, `orders`, `positions`, and `wallets`.

## Goal
Bring endpoint-level API docs parity from `PARTIAL` to `PASS` without changing
runtime behavior.

## Constraints
- Keep repository artifacts in English.
- Do not alter API route behavior.
- Do not treat route mention parity as full DTO/response semantic proof.
- Reuse the existing endpoint parity command.

## Definition of Done
- [x] Root/ops endpoints have a canonical module doc target.
- [x] Missing module route mentions are added.
- [x] `pnpm run docs:parity:endpoints:api -- --date 2026-05-19` passes.
- [x] Source-of-truth state reflects `AUD-03`/`AUD-23` improvement.

## Forbidden
- Runtime API behavior changes.
- Production journey validation.
- LIVE order/cancel/close or exchange-side mutation.
- Existing production data mutation.

## Validation Evidence
- Added `docs/modules/api-root.md`.
- Updated `docs/modules/api-bots.md`, `docs/modules/api-orders.md`,
  `docs/modules/api-positions.md`, and `docs/modules/api-wallets.md`.
- Updated `scripts/auditApiEndpointDocsParity.mjs` so `root` maps to
  `docs/modules/api-root.md`.
- `corepack pnpm run docs:parity:endpoints:api -- --date 2026-05-19` PASS:
  `109` endpoints, `109` documented, `0` gaps.

## Result Report
- Result: `AUD-03` and `AUD-23` endpoint docs parity gap closed locally.
- Deployment impact: none.
- Residual risk: semantic DTO/response parity is still outside route mention
  matching and should be audited separately if required.
