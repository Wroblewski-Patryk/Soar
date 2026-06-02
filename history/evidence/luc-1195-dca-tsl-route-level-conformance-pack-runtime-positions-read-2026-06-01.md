# LUC-1195 - DCA/TSL Route-Level Conformance Pack (Runtime Positions Read)

Date: 2026-06-01
Owner lane: Engineering Delivery Lead (integration/decomposition only)
Status: blocked (implementation/proof lane pending)

## Wake Acknowledgement

- Latest wake had no new comment delta (`0/0`, `fallbackFetchNeeded=false`), so next action stayed on source-scoped recovery for the blocked parent.
- This heartbeat consolidates the route-level conformance pack definition and unblock ownership path; it does not claim test execution closure.

## Consolidated Route-Level Pack

| Route | Contract target | Required route-level assertions | Existing evidence | Coverage status |
| --- | --- | --- | --- | --- |
| `GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions` | Runtime positions payload keeps DCA lifecycle truth and DCA-gated `TTP`/`TSL` visibility | 1) DCA count remains visible for imported/replaced rows; 2) duplicate OPEN rows do not inflate DCA count; 3) dynamic `TSL` hidden while loss-side DCA pending; 4) dynamic `TTP` hidden while profit-side DCA pending | `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`, `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`, `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts`, `apps/api/src/modules/bots/bots.e2e.test.ts` (`maps dynamic TTP/TSL lifecycle...`) | partially verified (distributed, not one focused route-level pack) |
| `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close` | Close authority remains DCA-first and fill-based when pending same-position DCA exists | 1) close denied/guarded while affordable pending DCA remains; 2) close authority uses fill-based semantics when pending DCA order exists; 3) route keeps ownership/risk-ack checks intact | `apps/api/src/modules/bots/bots.e2e.test.ts` (`closes open runtime position...`, `keeps runtime close authority fill-based when a pending DCA order is still open...`) | partially verified (assertions present, not sealed as dedicated conformance pack) |

## Minimal Implementation/Verification Lanes

1. Backend API Engineer (single owner)
- Add one focused route-level conformance suite (or narrow block in existing `bots.e2e.test.ts`) that jointly asserts both routes and all required DCA/TSL gate checks.
- Keep fixture scope minimal; no unrelated runtime behavior changes.

2. QA/Test Automation (single owner)
- Execute only the focused conformance scope and publish deterministic evidence:
  - command used,
  - pass/fail,
  - assertion names mapped to both routes.

## Blocker And Unblock Path

- Parent blocker reason: route-level conformance is still distributed across service + broad e2e tests and not sealed as one explicit conformance pack artifact.
- Unblock owner/action:
  1. Backend API Engineer implements focused pack.
  2. QA/Test Automation runs focused pack and publishes evidence.
- After both actions, parent can move from `blocked` to `in_review` for Delivery integration.
