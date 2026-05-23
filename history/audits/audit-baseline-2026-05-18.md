# Audit Baseline - 2026-05-18

Purpose: current reusable audit baseline for Soar. This file records what is
known today, what was actually run today, and what remains partial or blocked.
Future reruns should update this baseline or create a new dated baseline using
the same `AUD-*` IDs from `docs/analysis/reusable-audit-registry.md`.

## Today Actually Run

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm run ops:project:index` | PASS | `history/plans/project-index-2026-05-18.md`, `history/artifacts/project-index-2026-05-18.json`; V1 statuses `PASS:21`, tests indexed `335`. |
| `pnpm run ops:project:scan -- --index history/artifacts/project-index-2026-05-18.json` | PASS | `history/audits/v1-static-issue-scan-2026-05-18.md`, `history/artifacts/v1-static-issue-scan-2026-05-18.json`; findings `0`. |
| `pnpm run quality:guardrails` | PASS | Repository guardrails, lockfile policy, file budgets, production monolith budget, and CQLT web copy guardrails passed. |
| `pnpm run docs:parity:check` | PASS | API modules `22/22`, Web features `16/16`, Routes `38/38`; no missing/stale docs or source-path mismatches. |
| `pnpm run typecheck` | PASS | API `tsc --noEmit` and Web `tsc --noEmit` passed. |
| `pnpm run lint` | PASS | Web lint completed with no ESLint warnings or errors. |
| `pnpm run build` | PASS | Mobile scaffold build notice, API `tsc`, and Web production build passed; Web generated `30` static pages. |
| `pnpm --filter web run test -- --run` | PASS | Full Web Vitest passed: `149` files / `514` tests. |
| `pnpm i18n:audit:route-reachable:web` | PASS | Route-reachable i18n audit wrote `history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json`; findings `0`, localCopy `0`, fallbackPl `0`, hardcoded `0`. |
| Focused API packs by layer | PASS | Auth/profile/security/isolation `16` files / `87` tests; exchange/market-data/market-stream/workers `27` files / `122` tests; bots/engine passed; orders/positions `21` files / `189` tests; wallets/markets/strategies/icons `9` files / `85` tests; backtests/reports/logs/admin/subscriptions/upload/users/pagination `19` files / `136` tests. |
| `pnpm --filter api run test -- --run` | PASS | Full API Vitest completed with exit code `0` after local Postgres/Redis were available. Output was long/truncated in the terminal capture, so the exact final count is not quoted from memory. |
| `pnpm run test:go-live:smoke` | PASS | Local smoke wrapper applied migrations, ran API go-live pack `4` files / `45` tests, ran Web go-live pack `3` files / `18` tests, then stopped local compose infra. |
| Browser route-state proof via Codex Browser plugin | PASS/PARTIAL | Local `frontend/dev` on port `3002`; desktop and mobile DOM snapshots for `/`, `/auth/login`, and unauthenticated `/dashboard` redirect. All had `<main>`, skip link, title `Soar`, and `0` console warnings/errors. `/dashboard` correctly redirected to `/auth/login` without a session. Screenshot capture was blocked by available Browser API limitations; authenticated dashboard route-state remains a separate proof lane. |
| `git diff --check` | PASS | Line-ending warnings only; no whitespace errors. |

## Current Baseline By Audit

| ID | Current Status | Current Evidence | Open Gap / Next Action |
| --- | --- | --- | --- |
| AUD-00 | current | 2026-05-18 project index and static scan passed; `PASS:21`, tests `335`, findings `0`. | Keep generated-state commands sequential. |
| AUD-01 | partial | 2026-05-17 architecture-code discrepancy audit. | Repair/decide assistant runtime truth, exchange capability granularity, and stale exchange-scope architecture wording. |
| AUD-02 | partial | Requirement/risk/task state exists and was updated with architecture drift rows on 2026-05-17. | Sweep accepted/partial rows after the reusable audit registry is adopted. |
| AUD-03 | current local / partial endpoint docs | Docs parity passed; focused API layer packs passed; full API Vitest passed after local infra was available. | Endpoint-level generated API docs parity remains a gap. |
| AUD-04 | partial | Route inventory matches canonical route map; local browser proof passed for `/`, `/auth/login`, and unauthenticated `/dashboard` redirect on desktop/mobile with `0` console warnings/errors. | Run authenticated dashboard/admin route-state proof for all current routes. |
| AUD-05 | partial/current for V1 | 2026-05-14 production UX/A11y/Mobile proof exists; current local Browser proof passed representative public/auth/redirect states; Web UX/component suite is covered by full Web Vitest. | Screenshot capture was blocked by the available Browser API; external accessibility review remains separate. |
| AUD-06 | current local and V1 production-safe | Focused auth/profile/security/isolation API pack passed; module ledger records production-safe protected proof. | External independent security review remains governance follow-up. |
| AUD-07 | current local / partial model audit | Prisma reset/migrations applied during API validation; DB-backed API packs passed sequentially. | Full model-by-model invariant audit remains useful for schema design review. |
| AUD-08 | current local / current V1 release gate | Exchange/market-stream/workers focused pack passed; go-live smoke passed; 2026-05-14 protected worker/ops evidence exists. | Rerun protected worker/process proof after runtime or deployment changes. |
| AUD-09 | current local / partial architecture | Exchange/market-data/market-stream focused pack passed; production-safe exchange proof exists historically. | `AUD-EXCH-002`: capability granularity repair remains open. |
| AUD-10 | current local and V1 | Bots/engine focused pack passed; full API passed; bot production fixture proof and delete cleanup proof exist. | Assistant runtime hot-path integration is not covered by bot config proof. |
| AUD-11 | current local / partial production | Bots/engine focused pack passed and full API passed. | Production runtime proof remains scoped to historical V1 evidence and explicit safe boundaries. |
| AUD-12 | current local and V1 PAPER scope | Orders/positions focused pack passed; local and production-safe PAPER order/manual order proofs exist. | LIVE mutation remains blocked without explicit approval. |
| AUD-13 | current local and V1 PAPER scope | Orders/positions focused pack passed; local and production-safe PAPER position proof exists. | LIVE position mutation remains blocked without explicit approval. |
| AUD-14 | current local and V1 | Wallets/markets/strategies/icons focused pack passed; wallet CRUD/reset/proof evidence exists. | Broader LIVE cashflow/equity ledger remains target extension. |
| AUD-15 | current local and V1 | Markets/strategies/icons focused pack passed; local and production-safe fixture proofs exist. | Strategy preview/best-parameter work remains future product scope. |
| AUD-16 | current local and V1 | Backtests/reports focused pack and go-live API pack passed; fixture proof and immutable snapshot history proof exist. | Non-Binance historical order-book parity remains future adapter scope. |
| AUD-17 | current local and V1 | Logs focused pack passed; local proof and production action-produced audit readback exist. | Keep proof fresh after deploys. |
| AUD-18 | current local and V1 | Admin/subscriptions focused pack passed; production protected admin render proof exists. | Non-destructive production entitlement mutation remains future admin-ops scope. |
| AUD-19 | current local / current for 2026-05-14 deploy target | Build passed; go-live smoke passed; protected release gate was ready for the recorded candidate. | Rerun production smoke/release gate for any new deployment target. |
| AUD-20 | partial/architecture mismatch | Assistant config/dry-run/orchestrator foundation exists; `AUD-AI-003` is open. | Decide implementation vs architecture-narrowing; run AI red-team protocol before active-runtime claim. |
| AUD-21 | deferred | Traceability marks mobile scaffold-only. | Create mobile module docs before mobile becomes active. |
| AUD-22 | current local | Guardrails and route-reachable i18n audit passed with `0` findings. | Rerun after route/copy changes. |
| AUD-23 | current local / partial endpoint docs | Docs parity passed; baseline and source-of-truth state updated. | Endpoint-level generated API matrix and historical planning cleanup remain gaps. |

## Improvement Signals For Future Reruns

Track these numbers across dated baselines:

- `AUD-00`: static findings count and test count.
- `AUD-01`: open P1 architecture/code discrepancies.
- `AUD-03`: endpoint-doc parity gaps.
- `AUD-04`: Web routes with verified loading/empty/error/success coverage.
- `AUD-05`: screens with clean desktop/tablet/mobile/a11y evidence.
- `AUD-06`: security findings and stale proof age.
- `AUD-09`: exchange operations covered by exact `ExchangeContext`.
- `AUD-20`: AI red-team scenarios passed and runtime integration status.
- `AUD-23`: stale source-of-truth rows and docs parity failures.

## Priority Repair/Audit Queue

1. `AUD-20` / `AUD-AI-003`: decide assistant runtime truth and update code or
   architecture accordingly.
2. `AUD-09` / `AUD-EXCH-002`: repair exchange capability granularity.
3. `AUD-01` / `AUD-ARCH-001`: update stale exchange-scope overview/domain docs.
4. `AUD-04` and `AUD-05`: extend the current representative Browser proof to
   authenticated dashboard/admin route-state and screenshot/a11y evidence.
5. `AUD-03` and `AUD-23`: add endpoint-level API docs parity automation.

## Explicit Exclusions From This Baseline

- No production journey was run today.
- No authenticated all-route browser route-state proof was run today.
- Browser screenshot capture was attempted but blocked by the available Browser
  API shape in this environment; DOM snapshot and console proof were captured.
- No LIVE order/cancel/close or exchange-side mutation was run.
- No code behavior was changed.
