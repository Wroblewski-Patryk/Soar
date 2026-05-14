# Post-V1 Operator Feedback Intake - 2026-05-14

## Header

- ID: POSTV1-OPERATOR-FEEDBACK-INTAKE-2026-05-14
- Title: Index post-V1 operator feedback into verified fixes and follow-up missions
- Task Type: intake/planning
- Current Stage: planning
- Status: DONE
- Owner: Planner + Backend Builder + Frontend Builder + QA/Test
- Depends on: user-reported post-V1 app behavior notes from 2026-05-14
- Priority: P1
- Module Confidence Rows: SOAR-BOTS-001, SOAR-WALLETS-001, SOAR-STRATEGIES-001, SOAR-DASHBOARD-001, SOAR-REPORTS-001, SOAR-LOGS-001
- Requirement Rows: REQ-FUNC-025 plus follow-up requirement rows to be created by each mission
- Quality Scenario Rows: QA-022 plus follow-up UX/data scenarios to be created by each mission
- Risk Rows: RISK-025 plus follow-up risks to be created by each mission
- Iteration: 24
- Operation Mode: BUILDER
- Mission ID: POSTV1-OPERATOR-FEEDBACK-INTAKE-2026-05-14
- Mission Status: INDEXED

## Context

The user reported a post-V1 feedback batch covering bot deletion cleanup, PAPER
wallet reset guards, inactive PAPER strategy editing, crypto icon consistency,
Dashboard selected-bot truth/layout/loading, table affordances, Analytics
readability, strategy/market-group version history, strategy preview charts,
and positions-service maintainability. The P1 data-safety slice was executed in
`V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14`; the broader items are
indexed below as follow-up missions.

## Goal

Preserve the operator feedback as durable project work, distinguish what is
verified now from what still needs implementation, and avoid burying broad
architecture/UX changes inside a data-safety hotfix.

## Constraints

- Do not claim broad strategy history, Analytics, Dashboard layout, or
  positions-service decomposition as implemented without their own evidence.
- Do not delete strategies when deleting bots.
- Do not mutate production data or run LIVE exchange-side actions for this
  intake.
- Keep repository source-of-truth artifacts in English.

## Definition of Done

- [x] P1 bot/wallet cleanup is implemented and verified in the dedicated fix
  task.
- [x] Remaining larger tasks are indexed as bounded follow-up missions.
- [x] Requirement, quality, risk, task, project, and module-confidence state
  reference the verified fix.

## Forbidden

- Delete strategy records when deleting a bot.
- Delete market universes or symbol groups when deleting a bot.
- Add workaround reset bypasses.
- Claim broad strategy history or Analytics implementation without schema/design
  work and validation.

## Follow-Up Mission Queue

1. `POSTV1-DASHBOARD-TRUTH-AND-LAYOUT-2026-05-14` - fix Dashboard selected-bot
   market-group/runtime truth, convert bot details into the top bar, adjust
   4/5 + 1/5 columns, remove mobile order inversion, polish wallet KPI rows,
   clone button color, table name/symbol navigation, loading bar/skeletons, and
   initial shell theme flash.
2. `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14` - design and implement
   strategy and market-universe version snapshots for backtests and bots; block
   strategy/market deletion while linked immutable history exists; add
   per-symbol backtest history and best-parameter comparison.
3. `POSTV1-STRATEGY-BUILDER-PREVIEW-2026-05-14` - add four tabbed preview
   scenarios using the same chart component and indicator pipeline as backtest
   details.
4. `POSTV1-ANALYTICS-REPORTS-LOGS-UX-2026-05-14` - plan and implement a
   readable Analytics surface for reports and logs with Dashboard-grade visual
   hierarchy, filters, empty/error/loading states, and evidence.
5. `POSTV1-POSITIONS-SERVICE-DECOMPOSITION-2026-05-14` - decompose
   `positions.service.ts` behind existing public contracts without behavior
   drift, using focused tests before and after extraction.
6. `POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14` - closed by
   `docs/planning/post-v1-crypto-icon-consistency-2026-05-14-task.md`; API icon
   lookup now uses one curated catalog and proves common assets resolve to
   curated icons under CoinGecko outage.
7. `POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14` - reproduce the
   inactive PAPER strategy edit failure through Web/API and fix parity if the
   current API proof does not cover the failing UI path.

## Validation Evidence

- P1 fix evidence:
  `docs/planning/v1-post-v1-wallet-bot-cleanup-hardening-2026-05-14-task.md`.
- Tests: API typecheck PASS, bot delete cleanup e2e `1/1` PASS, Bots e2e
  `26/26` PASS, Wallets e2e `24/24` PASS.
- Manual checks: source inspection found no strategy deletion in the bot cleanup
  path.
- High-risk checks: direct strategy preservation covered by
  `bots.delete-cleanup.e2e.test.ts`.
- Module confidence ledger updated: yes for `SOAR-BOTS-001` and
  `SOAR-WALLETS-001`.
- Requirements matrix updated: `REQ-FUNC-025`.
- Quality scenarios updated: `QA-022`.
- Risk register updated: `RISK-025`.
- Reality status: indexed; first P1 fix verified locally.

## Result Report

Task summary: post-V1 feedback is indexed, with the bot/wallet data-safety slice
fixed, verified locally, and deployed as
`1586f59261cef94d7c513d71bbfcfb697d11ca59`.

Deployment evidence: build-info wait passed on attempt 22, and public deploy
smoke passed for API `/health`, API `/ready`, and Web `/`.

What is incomplete: Dashboard/UI polish, strategy-history architecture,
Analytics implementation, Strategy Builder previews, inactive PAPER strategy
edit UI reproduction, and positions-service decomposition remain follow-up
missions. Crypto icon consistency is closed by
`POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14`.

Next step: run `POSTV1-DASHBOARD-TRUTH-AND-LAYOUT-2026-05-14` or
`POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14`, depending on whether
the next priority is visible UI correctness or strategy-edit unblock.
