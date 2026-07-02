# LUC-6004 Trading Operation App-Completion Safe Browser/State Proof

Date: 2026-06-28
Owner: 09 QVE (QA & Verification Engineer)
Reality status: partially verified

## Scope

Safe, no-live-money Trading operation app-completion proof slice for
[LUC-6004](/LUC/issues/LUC-6004).

Forbidden actions stayed closed: no deploy, push, restart, protected smoke,
secret/account readback, production mutation, exchange mutation, order,
position, subscription/payment mutation, or live-trading action.

## Row Drill-Down

Generated a flow-specific drill-down from `docs/graphs/architecture-awareness.json`
using the same classification algorithm as
`C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs`.

- Artifact:
  `history/artifacts/luc-6004-trading-operation-app-completion-drilldown-2026-06-28.json`
- Trading operation rows:
  `219`
- Risk split:
  `140` needs browser/screenshot review, `44` missing doc link, `28` missing
  test link, `7` implemented needs proof
- Kind split:
  `140` screen_or_route scanner rows, `79` feature_or_capability rows

## Verified Rows

Direct row-level closure is limited to rows whose app-completion path exactly
matched the focused proof packet:

| Risk | Kind | Row | Path | Proof |
| --- | --- | --- | --- | --- |
| implemented_needs_proof | feature_or_capability | `runtimeOpenPositionDerivations.ts` | `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.ts` | focused Web test pass |
| implemented_needs_proof | feature_or_capability | `runtimeSurfaceTruth.ts` | `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts` | focused Web test pass |
| implemented_needs_proof | feature_or_capability | `trailingStopDisplay.ts` | `apps/web/src/features/bots/utils/trailingStopDisplay.ts` | focused Web test pass |

Behavior-level safe-state proof also passed for the route/controller surfaces:

- `/dashboard/bots/runtime`
- `/dashboard/bots/[id]/runtime`
- manual order controller fail-closed/readiness states
- close runtime position action state
- aggregate runtime error state

These are recorded as behavior evidence, not full row-level closure, because
the current app-completion index does not preserve every tested component row
as a direct path match.

## Verification

PASS:

```text
pnpm --filter web exec vitest run src/app/dashboard/bots/runtime/page.test.tsx src/app/dashboard/bots/[id]/runtime/page.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/bots/utils/trailingStopDisplay.test.ts

Test Files  8 passed (8)
Tests       28 passed (28)
Duration    33.00s
```

PARTIAL/FAILED:

```text
pnpm --filter web exec vitest run src/app/dashboard/page.tsx src/app/dashboard/bots/runtime/page.test.tsx src/app/dashboard/bots/[id]/runtime/page.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/bots/utils/trailingStopDisplay.test.ts

Test Files  3 failed | 8 passed (11)
Tests       13 failed | 48 passed (61)
Failure     HomeLiveWidgets manual-order/open-orders/full component cases timed out at default 5000 ms per test.
```

PARTIAL/FAILED retry:

```text
pnpm --filter web exec vitest run --no-file-parallelism --testTimeout=30000 src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx

Result: command timed out at 184213 ms before returning a Vitest result.
```

## Deferred Rows

Deferred to follow-up:

- `137` remaining `needs_browser_review` rows from the drill-down.
- `44` `missing_doc_link` rows.
- `28` `missing_test_link` rows.
- `4` remaining `implemented_needs_proof` rows:
  `runtimeSignalLabelKeys.ts`, `strategyThresholdItems.ts`,
  `marketStream.ts`, and `runProdPositionsProof.mjs`.

The exact row list is in the JSON artifact above.

## Follow-Up Required

Created [LUC-6010](/LUC/issues/LUC-6010) for Test Automation to split or
repair the heavy `HomeLiveWidgets` manual-order/open-orders/full component
packet. Current evidence is a test execution timeout, not a proven product UI
defect. No frontend mutation was made in this QA lane.

## Cleanup

No dev server, Docker service, or browser was started for this proof. Process
readback found no `chrome`, `chromium`, or `chrome-headless-shell` validation
processes to clean up. Existing Node processes were Paperclip/Codex/control
plane processes and were not task-owned.
