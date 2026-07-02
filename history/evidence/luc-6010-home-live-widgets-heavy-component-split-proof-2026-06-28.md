# LUC-6010 HomeLiveWidgets Heavy Component Split Proof

Date: 2026-06-28
Owner: 09 TAE (Test Automation Engineer)
Reality status: verified local split proof

## Scope

Follow-up for [LUC-6004](/LUC/issues/LUC-6004), which found that the broad
Trading operation `HomeLiveWidgets` component packet timed out even though the
safe state proof passed.

Forbidden actions stayed closed: no deploy, push, restart, protected smoke,
secret/account readback, production mutation, exchange mutation, order,
position, subscription/payment mutation, or live-trading action.

## Finding

The residual was a heavy Web test packet/default-timeout problem, not a proven
product defect.

The default run of `HomeLiveWidgets.manual-order.test.tsx` reproduced the
timeout shape:

```text
pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx --reporter=verbose

Test Files  1 failed (1)
Tests       3 failed | 8 passed (11)
Failures    default 5000 ms timeout in 3 rendered manual-order tests
Duration    67.87s
```

The same file passed when isolated with an explicit per-test timeout:

```text
pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx --reporter=verbose --testTimeout=15000

Test Files  1 passed (1)
Tests       11 passed (11)
Duration    57.57s
Longest     7535 ms
```

## Split Proof Packets

### Manual Order Controller / Scope / Venue

```text
pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx --reporter=verbose

Test Files  3 passed (3)
Tests       7 passed (7)
Duration    21.10s
```

### Manual Order Rendered Component

```text
pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx --reporter=verbose --testTimeout=15000

Test Files  1 passed (1)
Tests       11 passed (11)
Duration    57.57s
```

### Open Orders Actions / Source / Table Presenters

```text
pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --reporter=verbose --testTimeout=15000

Test Files  3 passed (3)
Tests       27 passed (27)
Duration    27.95s
```

### Full HomeLiveWidgets Component

```text
pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --reporter=verbose --testTimeout=15000

Test Files  1 passed (1)
Tests       20 passed (20)
Duration    64.34s
Longest     11298 ms
```

## Coverage

This packet covers the previous timeout contributors:

- manual-order controller fail-closed/readiness behavior
- manual-order market scope and inherited venue semantics
- rendered manual-order open/blocked/submitted/imported/position-opened states
- open-orders source labels for `USER`, `BOT`, and `EXCHANGE_SYNC`
- cancel confirmation for active LIVE open orders
- read-only terminal and exchange-backed open-order rows
- table presenter fail-closed status, provenance, actionability, and runtime truth
- full `HomeLiveWidgets` selector, runtime summary, orders tab, position close
  action, polling cadence, stale warning, filters, sorting, and pagination

## Residual Risk

- No product code defect was proven.
- Default 5000 ms Vitest timeout remains too low for some rendered
  `HomeLiveWidgets` cases in this workspace. Use split packets with
  `--testTimeout=15000` for this heavy component family, or refactor fixtures
  later if the board wants faster default-timeout execution.
- The broader app-completion row backlog from [LUC-6004](/LUC/issues/LUC-6004)
  remains a separate row-linkage/doc/test-link burn-down problem.

## Cleanup

No dev server, Docker service, Playwright browser, Chromium, or headless browser
was started for this proof. Vitest ran in-process and exited after each command.
