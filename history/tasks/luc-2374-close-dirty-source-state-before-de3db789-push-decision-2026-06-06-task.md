# LUC-2374 Close Dirty Source State Before de3db789 Push Decision

## Header
- ID: LUC-2374
- Title: Close dirty source state before `de3db789` push decision
- Task Type: source-control
- Current Stage: verification
- Status: DONE
- Owner: 09 CTO
- Priority: P0
- Module Confidence Rows: Bot Runtime, Architecture evidence graph, Release operations
- Requirement Rows: V1 release gate source hygiene
- Quality Scenario Rows: maintainability, release readiness
- Risk Rows: runtime aggregate regression risk, dirty source push risk
- Operation Mode: BUILDER
- Mission ID: LUC-2374-SOURCE-CLOSURE-DE3DB789-2026-06-06
- Mission Status: VERIFIED_LOCAL

## Context

[LUC-2365](/LUC/issues/LUC-2365) left candidate `de3db789` no-go for push or
promotion while the repository still had a dirty source state from the runtime
aggregate extraction, release guardrail repair, protected proof refresh, and
source-of-truth updates. This issue owns source-state closure before any later
push decision can be reconsidered.

## Goal

Classify and close the dirty working tree into a coherent local commit without
pushing, deploying, restarting, rolling back, mutating production, exposing
secrets, or running protected smoke.

## Constraints

- Preserve existing runtime aggregate behavior and release-gate evidence.
- Reuse existing architecture graph and guardrail systems.
- Do not make a push/promotion decision in this issue.
- Do not mutate production, accounts, exchange state, database state, or
  protected runtime context.

## Definition of Done

- Dirty source state is classified.
- Compile and guardrail blockers are repaired or explicitly failed closed.
- Local commit exists with coherent source/evidence closure.
- Push/deploy impact and residual release blockers are recorded.

## Forbidden

- No push, deploy, restart, rollback, env/database/account mutation, secret
  capture, exchange mutation, protected-smoke, or live-trading action.
- No unrelated refactor beyond compile/guardrail closure of the dirty set.

## Result Report

Dirty tree classification before closure:
- Backend API runtime aggregate extraction and compile closure:
  `runtimeMonitoringAggregateRead.service.ts`, new aggregate runtime/projector/
  fallback helpers, positions open-order read model, and portfolio date parser
  typing.
- Repository guardrails and architecture graph closure:
  public `/privacy` and `/terms` graph nodes, updated graph registry/generated
  graph status, staged-decomposition allowlist documentation, and guardrail
  script allowlist.
- Release and protected-proof source of truth:
  [LUC-2361](/LUC/issues/LUC-2361), [LUC-2364](/LUC/issues/LUC-2364),
  [LUC-2365](/LUC/issues/LUC-2365), [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2372](/LUC/issues/LUC-2372), and [LUC-2373](/LUC/issues/LUC-2373)
  task/evidence/artifact updates plus project state ledgers.

Repairs made during this closure:
- Fixed the aggregate read service to call the exported
  `readRuntimeAggregateFiniteNumber` helper after projector extraction.
- Imported the exported aggregate session-window resolver instead of leaving a
  duplicate local declaration.
- Loosened the Bot Portfolio date parser input to `unknown` so the aggregate
  payload union remains type-safe.

Closure disposition:
- Local commit: recorded after this artifact is included.
- Push: not performed.
- Production mutation: none.
- Release decision: still no-go until push/promotion is explicitly authorized
  after protected proof and RC gates are satisfied.

## Validation Evidence

- `pnpm --filter api exec tsc --noEmit --pretty false`: PASS.
- `pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with LF/CRLF warnings only.

## Deployment / Ops Evidence

- Deploy impact: none in this issue.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the local source-closure commit if the release train
  rejects this closure set; no production rollback is implicated because no
  production mutation occurred.

## Residual Risk

- `de3db789` remains not production-current.
- Protected runtime worker/SLO proof remains blocked on approved protected
  inputs and production deploy freshness.
- Temporary staged-decomposition allowlist remains maintainability debt until
  [LUC-2368](/LUC/issues/LUC-2368) removes it with focused proof.
