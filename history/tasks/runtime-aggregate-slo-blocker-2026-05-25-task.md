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
- Backend runtime dependency readiness Redis probe behavior.
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
6. If post-deploy SLO no longer shows aggregate 5xx/OOM but still fails on
   `/ready` availability or latency, remove avoidable readiness probe pressure
   before retrying SLO.

## Acceptance Criteria

- Focused aggregate concurrency test passes.
- Runtime monitoring aggregate e2e pack passes.
- API typecheck passes.
- Repository lint passes.
- Architecture graph generation passes.
- Repository guardrails pass with zero architecture graph drift.
- Production activation remains blocked until post-deploy SLO/RC proof passes.
- `/ready` must not create a new Redis TCP client for every probe when Redis is
  already reachable.

## Definition Of Done

This task is not fully done until the fix is deployed to production and the
fresh SLO/RC gate passes. The code fix is deployed, but the fresh SLO/RC gate
did not pass because the VPS became unreachable late in the observation.

## Result Report

- Local code mitigation implemented in
  `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`.
- Focused test added in
  `apps/api/src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts`.
- Graph records updated under `docs/architecture`.
- Local validation passed:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts`
  - `corepack pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false --testTimeout=20000`
  - `corepack pnpm --filter api run typecheck`
  - `corepack pnpm run lint`
  - `corepack pnpm run architecture:graph:generate`
  - `corepack pnpm run quality:guardrails`
- Commit `287e77a1ef6aa79396cb485dafcf8d17a0fce033` reached public
  build-info and public no-worker smoke passed.
- Post-deploy SLO recorded `0` API 5xx delta and `2.59ms` average duration,
  but overall status was `FAIL` because availability dropped to `fetch failed`
  late in the window.
- Follow-up network checks showed `141.227.149.67` unreachable on SSH `22` and
  HTTPS `443` for API/Web/Coolify. Current blocker is VPS reachability, not a
  proven remaining aggregate 5xx defect.
- After VPS reachability returned, public no-worker and authenticated worker
  smoke passed on `287e77a1`. A fresh 30-minute SLO still failed with
  `/ready` availability `96.30%` and API average duration `572.85ms`, while
  API 5xx delta stayed `0` and worker health/ready stayed `100%`.
- A persistent Redis readiness client experiment was deployed in `4c16305c`,
  then treated as suspect after API `/health` began timing out shortly after
  deploy. The Redis readiness change was reverted immediately while keeping the
  fail-closed SLO/RC tooling hardening. Local rollback validation passed
  focused health/readiness tests, API typecheck, and guardrails.
- Rollback commit `c08f852cc5a280e43cc9e0bcbb0c5fe770d6636e` reached
  `origin/main`, but production build-info continued to report
  `4c16305c97566b7680f4feb041601af2af0a0d31` after an extended wait.
- Empty retrigger commit `ac9a5ea9e7da2e7dd6a5343153bb1b906f094918` was pushed
  to `origin/main`; production still did not converge to the latest SHA within
  the 15-minute build-info polling window.
- Latest operational checks showed API `/health` responding, API `/ready`
  intermittently returning `not_ready`, web build-info still pinned to
  `4c16305c`, and Coolify `/login` returning HTTP 500. Current release status
  is therefore `NO-GO` due to production deploy convergence and readiness
  instability.
- VPS root cause investigation found `/dev/sda1` at `100%` usage. Coolify
  logs reported `No space left on device`, `coolify-db` recovery failures, and
  Redis write/snapshot errors. Remote `docker builder prune -af` recovered
  roughly 7 GB and restored Coolify, `coolify-db`, and API `/ready` to healthy.
- Orphaned `coolify-helper` build containers were removed after their metadata
  showed only `tail -f /dev/null`; no application data volumes were removed.
- Latest failed deploy logs for `58216dbf20bcb2a606802e7478a14dde564670b7`
  reported `SSH keys storage directory is not writable`; `/data/coolify/ssh`
  ownership/mode were repaired according to Coolify's own error guidance and
  the `coolify` container was restarted.
- A controlled single-app redeploy of `soar-api` was queued as
  `wudq5ujsrukro97x6arwqa0d`. During that deploy the VPS became unreachable on
  SSH `22` and HTTPS `443`; public API and web checks also failed to connect.
  This proves the deployment blocker is now VPS resource exhaustion or host
  instability under build load, not merely GitHub webhook drift.

## Forbidden

- Do not mark V1 activation/signoff ready while the production SLO gate is
  failing.
- Do not perform LIVE exchange-side order, cancel, close, or position mutation
  as part of this task.
- Do not stage unrelated dirty worktree changes.
