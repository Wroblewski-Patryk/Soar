# LUC-2280 Controlled soar-web Restart

## Header
- ID: LUC-2280
- Title: Controlled soar-web restart for 503 restarting state
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: LUC-1160
- Priority: P0
- Mission ID: LUC-2280-CONTROLLED-SOAR-WEB-RESTART-2026-06-05
- Mission Status: BLOCKED

## Context
LUC-1160 recovery evidence showed production API healthy while production Web
returned `503 no available server`. Read-only Coolify status showed the
`soar-web` production application in `restarting:unknown` with crash restarts.
LUC-2280 was a release mutation permit for exactly one controlled `soar-web`
restart, with no deploy, rollback, environment edit, database action, team
setting change, protected smoke, account action, or live-trading action.

## Goal
Attempt the single authorized `soar-web` restart only if the pre-state still
matched the permit, then record public Web/API smoke and Coolify status.

## Constraints
- Use Paperclip/Coolify environment bindings only.
- Do not print token values, cookies, raw resource ids, generated database
  suffixes, or unredacted logs.
- Do not chain a second restart or any deploy/rollback if the first restart
  does not restore readiness.
- Keep protected worker smoke out of scope.

## Definition of Done
- [x] Pre-state recorded with timestamped public smoke and read-only Coolify
      `soar-web` status.
- [x] At most one `soar-web` restart action called.
- [x] Post-action public smoke and Coolify status recorded.
- [x] Follow-up release mutation path created because restart did not restore
      Web readiness.

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
    after restart attempt -> FAIL only on Web `/` and Web `/api/build-info`;
    API `/health` and `/ready` passed.
- Manual checks:
  - Precheck `2026-06-05T20:40:35Z`: API `/health` `200`, API `/ready`
    `200`, Web `/` `503`, Web `/api/build-info` `503`.
  - Coolify pre-state `2026-06-05T20:41:00Z`: `soar-web`
    `restarting:unknown`, branch `main`, `gitCommitSha=HEAD`, restart count
    `54`, last restart type `crash`, last restart at
    `2026-06-05T20:36:37Z`.
  - Single restart action `2026-06-05T20:41:11Z`: Coolify response
    `Deployment already queued for this commit`.
  - Postcheck `2026-06-05T20:42:10Z`: API `/health` `200`, API `/ready`
    `200`, Web `/` `503`, Web `/api/build-info` `503`.
  - Coolify post-state `2026-06-05T20:42:39Z`: `soar-web` still
    `restarting:unknown`; restart count `54`; last restart type `crash`.
  - Deployment queue readback `2026-06-05T20:43:50Z`: latest `soar-web`
    rows include queued `HEAD` and queued
    `6e31d814046b640ad529d1cd57f968ba6f67b05e`; prior finished row is
    `b894e5dd30614dfd2035e91e3d848c842d3ff380`.
  - App log endpoint readback failed with HTTP `400`; no unredacted logs were
    printed.
- High-risk checks:
  - Exactly one Coolify mutation call was made.
  - No deploy, rollback, env edit, database action, team setting change,
    protected smoke, account action, secret disclosure, or live-trading action
    occurred.
- Reality status: blocked.

## Deployment / Ops Evidence
- Deploy impact: high, production Web recovery action.
- Env or secret changes: none.
- Health-check impact: API stayed healthy; Web stayed `503`.
- Smoke steps updated: not changed.
- Rollback note: the permit stop condition was reached. Do not perform another
  mutation from LUC-2280. Follow-up permit LUC-2286 owns the next recovery
  action decision.
- Observability or alerting impact: current evidence is public smoke, Coolify
  application status, and deployment queue readback; log readback requires a
  separate valid log path if deeper crash diagnosis is needed.

## Result Report
- Task summary: pre-state matched the release permit, one `soar-web` restart
  endpoint call was made, and Web did not recover.
- Files changed:
  - `history/tasks/luc-2280-controlled-soar-web-restart-503-restarting-state-2026-06-05-task.md`
  - `history/evidence/luc-2280-controlled-soar-web-restart-503-restarting-state-2026-06-05.md`
  - `.agents/state/system-health.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: public HTTP checks, required deploy smoke without workers, and
  read-only Coolify application/deployment queue status.
- What is incomplete: production Web remains unavailable with `503`.
- Next steps: LUC-2286 must approve/name the next mutation path: deploy-queue
  recovery/deploy, rollback, or another explicitly scoped recovery action.
