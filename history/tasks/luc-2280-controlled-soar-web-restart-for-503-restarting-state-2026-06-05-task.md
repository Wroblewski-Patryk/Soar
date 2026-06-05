# LUC-2280 - Controlled soar-web restart for 503 restarting state (2026-06-05)

## Context
- Issue: [LUC-2280](/LUC/issues/LUC-2280)
- Title: `[Soar][Release Permit][Ops] Controlled soar-web restart for 503 restarting state`
- Lane owner: Ops Release Lead
- Stage: `verification`
- Wake: `issue_assigned`, checkout already claimed by harness.

During the recovery heartbeat, public Web was unavailable while API remained
healthy. The issue description contained a release mutation permit for exactly
one controlled restart of the `soar-web` application resource in `Soar /
production`.

## Goal
Perform at most one permitted `soar-web` restart when the final precheck still
shows Web `503` or Coolify unhealthy/restarting state, then record public smoke
and Coolify status evidence.

## Constraints
- Use Paperclip/Coolify env bindings only.
- Do not print or persist token values, cookies, raw Coolify resource ids,
  generated database suffixes, or unredacted logs.
- Do not deploy, rollback, edit env, mutate database/team/account state, run
  protected smoke, or perform live-trading actions under this permit.
- Stop after one restart attempt if Web readiness does not recover.
- Do not include or ship the pre-existing dirty history task note from another
  recovery path.

## Definition of Done
- [x] Permit fields checked against the issue description.
- [x] Pre-state recorded with timestamped public smoke and read-only Coolify
      status.
- [x] At most one `soar-web` restart attempted.
- [x] Post-action public smoke and Coolify `soar-web` status recorded.
- [x] If restart failed, no additional mutation occurred and a separate
      rollback/deploy permit was created or requested.

## Forbidden
- Additional restart attempts after this checkpoint.
- Deploy or rollback without a separate permit.
- Raw Coolify object, raw resource id, or secret value disclosure.
- Protected smoke with unapproved application credentials.

## Implementation Plan
1. Verify source state and dirty tree do not imply deploy from uncommitted work.
2. Record public API/Web smoke and read-only Coolify `soar-web` pre-state.
3. Execute one permitted `soar-web` restart request.
4. Poll public Web and read-only Coolify status through the smoke window.
5. Record final evidence and block the parent issue on a new rollback/deploy
   permit if readiness does not recover.

## Validation Evidence
- Source state:
  - `git rev-parse HEAD` -> `6e31d814046b640ad529d1cd57f968ba6f67b05e`
  - `git rev-parse origin/main` -> `6e31d814046b640ad529d1cd57f968ba6f67b05e`
  - dirty tree contained one pre-existing history task note:
    `history/tasks/luc-1160-soar-production-stability-diagnose-coolify-restart-loop-and-runtime-crash-cause-2026-05-31-task.md`
- Precheck at `2026-06-05T20:40:02Z`:
  - `GET https://api.soar.luckysparrow.ch/health` -> `200`
  - `GET https://api.soar.luckysparrow.ch/ready` -> `200`
  - `GET https://soar.luckysparrow.ch/` -> `503`
  - `GET https://soar.luckysparrow.ch/api/build-info` -> `503`
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
    -> FAIL only Web checks.
  - Coolify projection for `soar-web`: `status=running:unknown`,
    `branch=main`, `gitCommitSha=HEAD`, `restartCount=54`,
    `lastRestartType=crash`, `lastRestartAt=2026-06-05T20:36:37Z`.
- Restart at `2026-06-05T20:40:31Z`:
  - `POST /api/v1/applications/{soar-web}/restart` -> `Deployment already
    queued for this commit.`
- Poll window:
  - 9 polls over roughly 90 seconds; `soar-web` remained
    `restarting:unknown`.
  - Web `/` and `/api/build-info` remained `503` throughout the successful HTTP
    reads.
- Final check at `2026-06-05T20:42:55Z`:
  - API `/health` -> `200`
  - API `/ready` -> `200`
  - Web `/` -> `503`
  - Web `/api/build-info` -> `503`
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
    -> FAIL only Web checks.
  - Coolify projection for `soar-web`: `status=restarting:unknown`,
    `branch=main`, `gitCommitSha=HEAD`, `restartCount=54`,
    `lastRestartType=crash`, `lastRestartAt=2026-06-05T20:36:37Z`.
  - Coolify projection for `soar-api`: public API remained healthy; Coolify
    app status remained inventory-level `running:unknown`.
  - Redacted log endpoint attempts for `soar-web` failed with HTTP `400` for
    app logs and `404` for deployments.

## Result Report
The controlled restart did not restore Web readiness. The permit is exhausted:
no second restart, deploy, rollback, env edit, database action, protected
smoke, account action, or live-trading action was performed.

Paperclip later reconciled [LUC-2280](/LUC/issues/LUC-2280) to `done` with
failed-recovery disposition. The valid follow-up path is
[LUC-2282](/LUC/issues/LUC-2282). Duplicate [LUC-2284](/LUC/issues/LUC-2284)
was created before the refreshed board state showed [LUC-2282](/LUC/issues/LUC-2282)
and could not be cancelled from this run because it is locked to another
execution run; treat it as cleanup-only. Obsolete recovery issue
[LUC-2288](/LUC/issues/LUC-2288) was cancelled.

Evidence:
- `history/evidence/luc-2280-controlled-soar-web-restart-2026-06-05.md`
