# LUC-6075 Trading Operation Proof Burn-Down

Date: 2026-06-28
Owner: 09 QVE (QA & Verification Engineer)
Reality status: verified local proof slice

## Scope

Safe no-live Trading operation follow-up for [LUC-6075](/LUC/issues/LUC-6075),
continuing the V1 app-completion browser-review burn-down after
[LUC-6004](/LUC/issues/LUC-6004) and [LUC-6010](/LUC/issues/LUC-6010).

Forbidden actions stayed closed: no deploy, push, restart, protected smoke,
secret/account readback, production mutation, exchange mutation, order,
position, subscription/payment mutation, or live-trading action.

## Wake Handling

The wake payload was issue-scoped (`issue_assigned`) for
[LUC-6075](/LUC/issues/LUC-6075), with `fallbackFetchNeeded=false`, no pending
comments, and the checkout already claimed by the harness. No thread refetch
was required before acting.

## Verified Rows

This heartbeat closed the four `implemented_needs_proof` Trading operation rows
that [LUC-6004](/LUC/issues/LUC-6004) explicitly deferred:

| Row | Path | Proof |
| --- | --- | --- |
| `runtimeSignalLabelKeys.ts` | `apps/web/src/features/bots/utils/runtimeSignalLabelKeys.ts` | focused Web unit test |
| `strategyThresholdItems.ts` | `apps/web/src/features/strategies/utils/strategyThresholdItems.ts` | shared Web utility unit test |
| `marketStream.ts` | `apps/web/src/lib/marketStream.ts` | focused Web unit test |
| `runProdPositionsProof.mjs` | `scripts/runProdPositionsProof.mjs` | Node script contract test |

## Verification

PASS:

```text
pnpm --filter web exec vitest run src/features/bots/utils/runtimeSignalLabelKeys.test.ts src/lib/sharedWebUtilities.test.ts src/lib/marketStream.test.ts --reporter=verbose

Test Files  3 passed (3)
Tests       15 passed (15)
Duration    2.67s
```

PASS:

```text
pnpm exec node --test scripts/runProdPositionsProof.test.mjs

tests 5
pass 5
fail 0
duration_ms 137.9311
```

## Result

The four previously deferred `implemented_needs_proof` Trading operation rows
are now locally verified. The remaining Trading operation backlog is row-linkage
work, not a newly proven product defect:

- `137` remaining `needs_browser_review` rows from the LUC-6004 drill-down.
- `44` `missing_doc_link` rows.
- `28` `missing_test_link` rows.

## Cleanup

No dev server, Docker service, Playwright browser, Chromium, or headless browser
was started for this proof. Vitest and Node test processes exited normally.
