# LUC-2287 Clear Stuck Coolify Soar Web Deploy Queue

## Header
- ID: LUC-2287
- Title: Clear stuck Coolify `soar-web` deploy queue and verify `6e31d814`
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-2282 redeploy permit
- Priority: P0
- Mission ID: LUC-2287-CLEAR-STUCK-COOLIFY-SOAR-WEB-DEPLOY-QUEUE-2026-06-05
- Mission Status: VERIFIED

## Context
`soar-web` production was returning `503` while public API health/readiness
remained `200`. Earlier evidence showed stale Coolify deployment rows ahead of
the target `6e31d814046b640ad529d1cd57f968ba6f67b05e` deployment.

## Goal
Clear only the stuck `soar-web` deployment queue/runtime state, trigger at most
one fresh `soar-web` deploy from pushed `main` at `6e31d814046b640ad529d1cd57f968ba6f67b05e`,
and verify Web build-info plus API health.

## Scope
- Production `Soar / production / soar-web` Coolify application only.
- Public smoke endpoints:
  - `https://soar.luckysparrow.ch/`
  - `https://soar.luckysparrow.ch/api/build-info`
  - `https://api.soar.luckysparrow.ch/health`
  - `https://api.soar.luckysparrow.ch/ready`
- Local reusable Ops env-contract test.

## Implementation Plan
1. Confirm source SHA is pushed to `origin/main`.
2. Read current `soar-web` Coolify application/deployment state.
3. Use Coolify's app-scoped deployment cancel endpoint only for stale
   `soar-web` deployment rows.
4. Trigger at most one fresh `soar-web` deploy.
5. Poll Web build-info for expected SHA and recheck API health/readiness.
6. Fail closed if Web remains `503` or `soar-web` returns to crash/restarting.

## Acceptance Criteria
- Stale `soar-web` queue rows are no longer blocking the target deployment.
- No API, worker, Postgres, Redis, env, team/account, secret, rollback,
  exchange, live-trading, or protected-smoke mutation occurs.
- Build-info returns `200` with the expected SHA, or the issue is blocked with
  the exact next owner/action.

## Definition of Done
- [x] Source ref verified on `origin/main`.
- [x] Stale queue entries cleared using app-scoped Coolify cancel calls.
- [x] At most one fresh `soar-web` deploy triggered.
- [x] Public API health/readiness rechecked.
- [x] Web build-info verification attempted and result recorded.
- [x] Residual blocker and next owner/action recorded.

## Validation Evidence
- Tests: `pnpm run ops:coolify-stack:env-check:test` passed, `8/8`.
- Manual checks:
  - API `/health`: `200`
  - API `/ready`: `200`
  - Web `/`: `503`
  - Web `/api/build-info`: `503`
- High-risk checks: production mutation limited to `soar-web` deployment queue
  cancellation and one fresh deploy trigger.
- Reality status: blocked

## Deployment / Ops Evidence
- Deploy impact: high, production `soar-web` only.
- Env or secret changes: none.
- Health-check impact: API remained healthy; Web remained unavailable.
- Smoke steps updated: no permanent script change.
- Rollback note: rollback still unauthorized because a previous stable
  deployment/image was not named by this task.
- Observability or alerting impact: none changed.
- Staged rollout or feature flag: not applicable.

## Resume Verification

`LUC-2287` resumed after the blocker chain resolved. The original
`6e31d814046b640ad529d1cd57f968ba6f67b05e` image remained a failed runtime
candidate because production `soar-web` crashed on a missing runtime start
wrapper. Follow-up `LUC-2304` fixed that packaging defect and pushed
`a70d7881b69e605c537af5f81cbeb74dc81e9329` to `origin/main`.

Read-only verification after the resolved blocker showed production recovered
on `a70d7881b69e605c537af5f81cbeb74dc81e9329`:

| Probe | Result |
| --- | --- |
| `https://soar.luckysparrow.ch/api/build-info` | `200`, `gitSha=a70d7881b69e605c537af5f81cbeb74dc81e9329` |
| `https://soar.luckysparrow.ch/` | `200` |
| `https://api.soar.luckysparrow.ch/ready` | `200` |
| Coolify `soar-web` metadata | `running:unknown`, no restart signal |
| Coolify `soar-web` active deployment rows | `0` after final stale duplicate `a70d7881...` queue cleanup |

Resume validation commands:

```text
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha a70d7881b69e605c537af5f81cbeb74dc81e9329 --timeout-seconds 60 --interval-seconds 10 --request-timeout-ms 15000
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Both passed. Final queue cleanup cancelled four stale duplicate `a70d7881...`
Coolify deployment rows that stayed `in_progress`/`queued` after public Web was
already healthy. No additional deploy, restart, rollback, environment edit,
database action, account action, secret readback, exchange mutation, or
live-trading action was performed during the resume verification.

## Result Report
- Task summary: cancelled stale `soar-web` deployment queue rows, triggered
  one fresh deploy from pushed `main` for the original target, documented that
  `6e31d814` failed due a Web runtime-image packaging defect, and later
  verified production Web recovered after the pushed `a70d7881` wrapper fix.
- Files changed:
  - `history/tasks/luc-2287-clear-stuck-coolify-soar-web-deploy-queue-2026-06-05-task.md`
  - `history/evidence/luc-2287-soar-web-deploy-queue-cleared-runtime-still-crashing-2026-06-05.md`
- How tested:
  - `node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814046b640ad529d1cd57f968ba6f67b05e --timeout-seconds 240 --interval-seconds 15 --request-timeout-ms 15000`
  - `pnpm run ops:coolify-stack:env-check:test`
  - public API/Web endpoint probes
- What is incomplete: none for this queue-recovery issue. The requested
  `6e31d814` verification failed and was superseded by verified recovery on
  `a70d7881`.
- Next steps: none for `LUC-2287`; broader release gates may continue in their
  own issues.
- Decisions made: no rollback, force start, env edit, stack-wide action, or
  second deploy was performed after the authorized attempt failed closed. The
  final mutation was limited to cancelling stale duplicate `soar-web`
  deployment rows after the repaired Web image was already serving traffic.
