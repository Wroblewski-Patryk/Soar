# Task

## Header
- ID: LUC-5345
- Title: Source Control Closure - Runtime/Evidence Dirty Packet
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: none
- Priority: P0
- Module Confidence Rows: API orders/positions, API wallets, rate limit middleware, production evidence/state
- Requirement Rows: source-control closure, local validation, evidence integrity
- Quality Scenario Rows: regression safety, secret hygiene, deploy safety
- Risk Rows: dirty worktree, divergent branch, production-gated operations
- Iteration: 2026-06-21 source-control closure
- Operation Mode: BUILDER
- Mission ID: LUC-5345-SOURCE-CONTROL-CLOSURE-RUNTIME-EVIDENCE-DIRTY-PACKET-2026-06-21
- Mission Status: VERIFIED

## Context
Paperclip selected a local repair/source-control lane for [LUC-5345](/LUC/issues/LUC-5345).
The wake comment allowed local repository inspection, focused validation, and a local
commit when evidence supported closure. Push, deploy, restart, protected smoke/live
account mutation, and secret disclosure remained forbidden.

## Goal
Classify and close the 2026-06-20/2026-06-21 runtime/evidence dirty packet with
evidence-backed validation, a commit/no-commit decision, and explicit residual risk.

## Scope
- Runtime/API repair files:
  - `apps/api/src/middleware/rateLimit.ts`
  - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `apps/api/src/modules/wallets/wallets.service.ts`
- EOL/index-only dirty paths observed but not content-diffed:
  - `apps/api/src/modules/bots/bots.controller.ts`
  - `apps/api/src/modules/orders/orders.controller.ts`
- State, docs, evidence, generated status, and task artifacts from LUC-4767,
  LUC-4811, LUC-4929, LUC-5146, LUC-5298, LUC-5300, LUC-5304, LUC-5307,
  LUC-5308, LUC-5309, LUC-5310, LUC-5311, LUC-5316, LUC-5351, LUC-5356,
  LUC-5360, LUC-5362, LUC-5367, LUC-5378, LUC-5381, and LUC-5387.

## Classification

| Class | Paths | Closure decision |
| --- | --- | --- |
| API runtime/test repair | rate limit, orders, wallets | Commit locally after focused API proof |
| Ops/evidence/docs | operations contract, evidence, artifacts, tasks, state ledgers | Commit locally as release evidence packet |
| Generated status | `docs/status/app-completion-index.*` | Commit locally as generated completion/proof backlog state |
| EOL/index-only noise | bots controller, orders controller | Stage only if Git includes normalization during coherent commit; no content diff found |

## Implementation Plan
1. Capture dirty state and branch divergence.
2. Inspect runtime diffs and classify affected capability chains.
3. Run focused validation for wallets, orders, rate limit, whitespace, and secret hygiene.
4. Repair only validation-blocking issues discovered during closure.
5. Record source-control packet and commit locally if checks pass.

## Acceptance Criteria
- Dirty packet is classified by affected capability and file class.
- Runtime repair checks pass or blockers are recorded.
- Secret-pattern scan over dirty paths has no hits.
- Commit/no-commit and push/deploy decisions are explicit.
- The issue can be closed without leaving an unowned dirty set.

## Validation Evidence
- `git status --short --branch`: `main...origin/main [ahead 10, behind 1]` before closure.
- `git diff --check`: PASS; only CRLF conversion warnings from Git.
- Targeted secret-pattern scan over tracked dirty paths and untracked files:
  PASS, no matches for private-key/JWT/Bearer/GitHub/OpenAI/AWS-style patterns.
- `pnpm --filter api test -- src/middleware/rateLimit.test.ts --run`:
  PASS, `1` file, `7` tests.
- `pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts -t "caps LIVE preview reference balance|persists an initial LIVE wallet balance snapshot|includes wallet-owned imported LIVE open positions|includes wallet-owned imported LIVE open PnL only" --run`:
  PASS, `1` file, `4` tests, `20` skipped.
- `pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts --run`:
  PASS, `2` files, `36` tests.
- First orders focused rerun exposed a real cleanup-order regression:
  `Position_userId_fkey` at `prisma.user.deleteMany()`.
- Repair made during this closure:
  `orders-positions.e2e.test.ts` now clears `walletCashflowEvent` before
  deleting trades/orders/positions/users.
- `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "selected bot context|LIVE risk guards|selected from LIVE dashboard flow|Gate.io PAPER position" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`:
  PASS after repair, `1` file, `4` tests, `20` skipped.
- `pnpm --filter api exec vitest run src/modules/orders/orders.manualContext.contractSize.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/orders/orders.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts -t "Gate.io|PAPER MARKET fill creates a new position|position|manual-order context" --pool=forks --poolOptions.forks.singleFork=true --testTimeout=45000`:
  PASS, `4` files passed, `1` skipped; `40` tests passed, `72` skipped.

## Architecture Evidence
- Architecture source reviewed: project AGENTS contract, Paperclip source-control closure contract, Soar state/task ledgers.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; this was source-control closure plus test-harness cleanup.

## Deployment / Ops Evidence
- Deploy impact: none from this heartbeat.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: local commit can be reverted; no production state changed.
- Observability or alerting impact: none.
- Push status: held; branch is behind `origin/main` and protected delivery actions were forbidden by wake scope.

## Security / Privacy Evidence
- Data classification: local source, test fixtures, generated evidence, redacted production evidence.
- Trust boundaries: no production mutation, no live trading, no secret value readback.
- Secret handling: targeted dirty-path scan produced no secret-pattern matches.
- Fail-closed behavior: push/deploy/protected smoke were not attempted.
- Residual risk: branch remains behind remote and ahead locally; release owner must reconcile before any push/deploy.

## Result Report
- Task summary: classified the mixed runtime/evidence dirty packet, repaired one orders e2e cleanup regression discovered by validation, and prepared the packet for local source-control closure.
- Files changed: runtime/API repair files, docs/state/evidence/task artifacts listed in scope, plus this LUC-5345 task packet and brief state/board entries.
- How tested: focused API wallet, orders, rate-limit tests; `git diff --check`; targeted secret-pattern scan.
- What is incomplete: no push or deployment; branch reconciliation remains a separate release operation because `main` is ahead and behind `origin/main`.
- Next steps: release/source-control owner can reconcile remote divergence and decide a protected push/deploy batch only after the required gates exist.
- Decisions made: local commit is supported after validation; push/deploy are not authorized by this lane.
