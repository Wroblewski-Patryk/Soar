# Runtime Aggregate SLO Blocker - 2026-05-25

## Context

Production candidate `24e9d3b8d51b4b4c4f1b25cad920096f2223b0ec` gained fresh
read-only evidence for restore, rollback, LIVEIMPORT-03, UI clickthrough, auth
browser proof, and security/exchange proof. The later 30-minute RC/SLO
observation failed availability and API 5xx targets. Production API logs showed
heap out-of-memory restarts and repeated 500s on
`GET /dashboard/bots/:id/runtime-monitoring/aggregate`.

## Goal

Reduce runtime aggregate fanout pressure so the endpoint can survive production
session history without restarting the API process, then redeploy and rerun the
production SLO/RC gate.

## Scope

- Backend runtime monitoring aggregate read service.
- Focused aggregate concurrency regression coverage.
- Architecture graph registry/note linkage for the new test file.
- Mission, project state, risk, requirement, system-health, and task-board
  updates that keep the production `NO-GO` reason explicit.

## Implementation Plan

1. Limit aggregate per-session fanout with a small configurable concurrency
   cap.
2. Convert a failed or timed-out per-session aggregate read into an incomplete
   row that is skipped by the existing complete-row filter.
3. Add a focused unit test proving the concurrency helper preserves result
   order and enforces the cap.
4. Update the Obsidian-first architecture graph records for the new test file.
5. Validate locally, commit once, push once, wait for Coolify deploy, and rerun
   production public smoke plus SLO/RC proof.

## Acceptance Criteria

- Focused aggregate concurrency test passes.
- Runtime monitoring aggregate e2e pack passes.
- API typecheck passes.
- Repository lint passes.
- Architecture graph generation passes.
- Repository guardrails pass with zero architecture graph drift.
- Production activation remains blocked until post-deploy SLO/RC proof passes.

## Definition Of Done

This task is not fully done until the fix is deployed to production and the
fresh SLO/RC gate passes. Local implementation is done when the scoped commit
is created after all local validation gates pass.

## Result Report

- Local code mitigation implemented in
  `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`.
- Focused test added in
  `apps/api/src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts`.
- Graph records updated under `Soar - docs/architecture`.
- Local validation passed:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts`
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false --testTimeout=20000`
  - `corepack pnpm --filter api run typecheck`
  - `corepack pnpm run lint`
  - `corepack pnpm run architecture:graph:generate`
  - `corepack pnpm run quality:guardrails`
- Production result remains pending deploy and SLO/RC rerun.

## Forbidden

- Do not mark V1 activation/signoff ready while the production SLO gate is
  failing.
- Do not perform LIVE exchange-side order, cancel, close, or position mutation
  as part of this task.
- Do not stage unrelated dirty worktree changes.
