# LUC-3373 Regression Evidence Sweep - 2026-06-11

## Context

- Issue: [LUC-3373](/LUC/issues/LUC-3373)
- Role: QA & Verification Engineer
- Stage: verification
- Process class: regression evidence loop

## Goal

Refresh the safe local regression evidence baseline for the Soar V1 takeover
without touching deploy, secrets, protected production accounts, live trading,
exchange credentials, payments, subscriptions, database mutation, or restart
paths.

## Constraints

- Scoped wake had no pending comments and `fallbackFetchNeeded=false`.
- Checkout was already claimed by the harness; checkout was not repeated.
- `pnpm softwarehouse:control-tick` is unavailable in this checkout:
  `Command "softwarehouse:control-tick" not found`.
- Worktree was already dirty with prior Soar state, generated graph, test, and
  evidence artifacts. This sweep preserved existing changes and only added this
  evidence packet plus regenerated architecture-awareness exports.

## Verification Evidence

| Check | Result |
| --- | --- |
| `node --test scripts/goLiveSmoke.test.mjs scripts/runQaRepeatableSmokeE2e.test.mjs scripts/runRcRefreshSummaryStrict.test.mjs scripts/runRestoreDrillEvidence.test.mjs scripts/runRollbackProofEvidence.test.mjs scripts/startLocalProdLike.test.mjs scripts/startWorkersProd.test.mjs` | PASS, `51/51` |
| `node --test scripts/runLocalProtectedRouteActionProof.test.mjs scripts/runProdAuthSessionBrowserProof.test.mjs scripts/runPublicReadOnlyBrowserProof.test.mjs` | PASS, `14/14` |
| `pnpm run architecture:graph:generate` | PASS on rerun, `653` nodes / `842` relations / `27` chains |
| `pnpm run quality:guardrails` | PASS |
| `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar` | PASS, `9383` entities / `29671` relations / `9757` files |
| `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` | PASS, no leftover validation process listed |

## Findings

- The first `architecture:graph:generate` attempt failed during a parallel run
  with Windows file write error `UNKNOWN` opening
  `docs/graphs/architecture-graph.json`. A single-command rerun passed, so this
  is recorded as transient write contention, not a confirmed product
  regression.
- The refreshed architecture-awareness report was generated at
  `2026-06-11T02:22:02.917Z`.
- Actionable implementation entities without inferred tests improved from
  `115` to `96`.
- Recent stale top-list rows for `runRcRefreshSummaryStrict`,
  `runRestoreDrillEvidence`, `runRollbackProofEvidence`,
  `start-local-prod-like`, and `start-workers-prod` no longer appear in the
  refreshed top actionable missing-test list.
- Remaining visible top families include browser/protected proof helpers and a
  local-safe `scripts/runV1StaticIssueScan.mjs` helper cluster.

## Definition Of Done

- Safe regression checks run and recorded.
- Architecture-awareness exports refreshed.
- Remaining regression gap converted into owned follow-up work instead of
  leaving this routine issue open.

## Result Report

Status: verified local sweep complete.

Files changed by this heartbeat:

- `docs/graphs/architecture-awareness.json`
- `docs/graphs/architecture-awareness.csv`
- `docs/graphs/architecture-proof-register.csv`
- `docs/graphs/architecture-graph.json`
- `docs/graphs/architecture-graph.md`
- `docs/graphs/architecture-health.json`
- `docs/status/architecture-awareness-report.md`
- `docs/status/architecture-dependency-report.md`
- `docs/status/architecture-ownership-report.md`
- `docs/status/task-synchronization-report.md`
- `history/tasks/luc-3373-regression-evidence-sweep-2026-06-11-task.md`

Commit: not committed; the checkout already contains a broad dirty generated
state/evidence batch from related Soar lanes.

Push: not needed.

Deploy impact: none.

Residual risk: full V1 production readiness remains gated by protected
operator/account/deploy evidence outside this no-secret QA sweep.
