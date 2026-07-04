# LUC-3841 Protected Dashboard Performance Recheck

## Header
- ID: LUC-3841
- Title: Recheck protected dashboard performance after aggregate/fan-out fixes
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: LUC-3839, LUC-3840, source-control/release promotion
- Priority: P0
- Module Confidence Rows: `web-dashboard-home`, `api-bots` runtime aggregate, `SOAR-API-BOT-RUNTIME-AGGREGATE`
- Requirement Rows: protected dashboard sellability/readiness proof
- Quality Scenario Rows: authenticated dashboard performance
- Risk Rows: production smoke and stale-deploy proof risk
- Iteration: 2026-06-15 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-3841-PROTECTED-DASHBOARD-PERFORMANCE-RECHECK-2026-06-15
- Mission Status: BLOCKED

## Context

[LUC-3841](/LUC/issues/LUC-3841) woke because the Backend aggregate bound
([LUC-3839](/LUC/issues/LUC-3839)) and Frontend fan-out reduction
([LUC-3840](/LUC/issues/LUC-3840)) blockers were marked resolved locally.
The original protected production diagnosis measured the authenticated
dashboard with normal audit email/password login and found subsecond login and
dashboard document timings, but browser network did not settle within
`70000 ms` and aggregate calls tailed up to `26312 ms`.

## Goal

Rerun protected dashboard timing only when production can be proved to contain
the aggregate/fan-out fixes. If production is stale, fail closed with a concrete
unblock owner/action instead of collecting misleading timing evidence.

## Constraints

- No deploy, push, restart, rollback, env edit, database/Redis mutation, raw
  log capture, screenshot, exchange action, order, position,
  payment/subscription, or live-trading action.
- Do not write credentials, cookies, tokens, passwords, private response
  bodies, or screenshots to artifacts.
- Use read-only production checks before any protected browser timing proof.

## Definition of Done

- Production provenance is checked against local source state.
- Protected timing recheck is either run against a deployed repair SHA or
  blocked with a precise reason.
- Evidence is recorded without secret or private data disclosure.
- Paperclip issue disposition names the unblock owner/action.

## Forbidden

- Claiming post-fix protected performance from a production build that cannot
  contain the repair diff.
- Mutating production or credentials.
- Dumping protected response bodies, cookies, tokens, or screenshots.

## Validation Evidence

Generated artifact:

- `history/artifacts/luc-3841-protected-dashboard-performance-recheck-provenance-2026-06-15.json`

Read-only provenance and health precheck:

| Surface | Result |
| --- | --- |
| Local `git rev-parse HEAD` | `9f61eb9781c323f052f95cae7cf0c1c3c71901c7` |
| Web `/api/build-info` | `200`, `173 ms`, `gitSha=9f61eb9781c323f052f95cae7cf0c1c3c71901c7`, `metadataSource=env-runtime` |
| API `/health` | `200`, `163 ms` |
| API `/ready` | `200`, `93 ms` |
| `chrome-headless-shell` cleanup check | no matching process found |

Current worktree state includes uncommitted repair changes for
[LUC-3839](/LUC/issues/LUC-3839), [LUC-3840](/LUC/issues/LUC-3840), and
[LUC-4174](/LUC/issues/LUC-4174), including:

- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRuntime.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts`
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx`
- `apps/web/package.json`
- `apps/web/vitest.config.mts`
- `package.json`
- `pnpm-lock.yaml`
- `docs/operations/runtime-config-ledger.csv`

Because production build-info matches the committed local `HEAD`, production
cannot contain the uncommitted repair diff. A protected dashboard timing probe
was not run in this heartbeat because it would remeasure the pre-fix deployed
build and would not prove the aggregate/fan-out fixes.

## Result Report

Status: `blocked_stale_production_sha / no_protected_probe / no_mutation`.

Unblock owner: Ops Release Lead / source-control closure owner.

Required action: commit, push, and deploy the validated
[LUC-3839](/LUC/issues/LUC-3839) and [LUC-3840](/LUC/issues/LUC-3840) repair
bundle, then wake [LUC-3841](/LUC/issues/LUC-3841) for the protected dashboard
timing proof against the deployed repair SHA.

No deploy, push, restart, rollback, env edit, protected browser timing probe,
production auth, database/Redis mutation, raw log capture, screenshot,
exchange action, order, position, payment/subscription, or live-trading action
occurred.

## Review Checklist

- [x] Current stage declared and respected.
- [x] Existing provenance/build-info mechanism reused.
- [x] No workaround path introduced.
- [x] No logic duplication introduced.
- [x] Secret handling preserved.
- [x] Definition of Done evidence attached.
- [x] Blocker owner and required action named.
