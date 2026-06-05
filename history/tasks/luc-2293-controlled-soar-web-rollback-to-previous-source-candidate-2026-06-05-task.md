# LUC-2293 Task Contract - Controlled soar-web Rollback To Previous Source Candidate

## Context

[LUC-2293](/LUC/issues/LUC-2293) is a release mutation permit for one
controlled `Soar / production / soar-web` rollback or redeploy to the previous
finished source candidate after the current `6e31d814046b640ad529d1cd57f968ba6f67b05e`
redeploy left public Web at `503`.

## Goal

Execute one permitted Coolify rollback/redeploy of `soar-web` to
`b894e5dd30614dfd2035e91e3d848c842d3ff380`, then verify public Web/API
readiness and record redacted evidence.

## Constraints

- Stage: release / verification.
- Target resource: `soar-web` only.
- Coolify project/environment: `Soar / production`.
- No API, worker, Postgres, Redis, env, team/account, protected-smoke,
  exchange, force-start, second restart, second deploy, or live-trading
  mutation.
- Use Paperclip/Coolify bindings only.
- Do not print or store secrets, raw resource ids, raw deployment ids, raw
  logs, generated database suffixes, host paths, internal IPs, cookies, tokens,
  account data, exchange credentials, or live-trading state.

## Definition Of Done

- [x] Confirm local `HEAD` and `origin/main` remain the current branch-head SHA.
- [x] Confirm API `/health` and `/ready` are `200` before mutation.
- [x] Confirm Web `/` and `/api/build-info` are still failing before mutation.
- [x] Pin `soar-web` Coolify source commit to the approved rollback SHA.
- [x] Request exactly one `soar-web` deploy for the pinned rollback SHA.
- [x] Poll Web `/` and `/api/build-info` for eight attempts at 15-second
  intervals.
- [x] Recheck API `/health` and `/ready`.
- [x] Record redacted Coolify readback.
- [x] Run `pnpm run ops:coolify-stack:env-check:test`.
- [x] Record final disposition.

## Forbidden

- Any second production mutation under this issue after the single rollback
  attempt.
- Raw Coolify resource/deployment id disclosure.
- Raw logs, secrets, cookies, tokens, env values, generated database suffixes,
  host paths, internal IPs, account data, exchange credentials, or live-trading
  mutation.

## Result Report

Result: failed closed; production Web remains degraded.

- Source precheck: local `HEAD` and `origin/main` were
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- Pre-mutation public state: API health/ready `200`; Web root/build-info `503`.
- Mutation: set `soar-web` Coolify `git_commit_sha` to
  `b894e5dd30614dfd2035e91e3d848c842d3ff380`, then submitted one deploy
  request for `soar-web`; request accepted.
- Post-mutation Web polling: all eight polls stayed unhealthy; Web root was
  `503` except one `502`, Web build-info stayed `503`, and no build-info SHA
  was exposed.
- Coolify readback during all eight polls: `soar-web` remained
  `restarting:unknown`, pinned to
  `b894e5dd30614dfd2035e91e3d848c842d3ff380`.
- Post-mutation API regression: health/ready remained `200`.
- Local regression: `pnpm run ops:coolify-stack:env-check:test` passed, 8/8.
- Evidence:
  `history/evidence/luc-2293-controlled-soar-web-rollback-2026-06-05.md`.
- Commit/push: not committed; this heartbeat added only task/evidence records
  and did not push.
- Deploy impact: completed one permitted rollback/redeploy attempt for
  `soar-web`; Web remains unhealthy.
- Residual risk: production `soar-web` is still pinned to the rollback SHA in
  Coolify but did not recover. Do not chain another mutation under
  [LUC-2293](/LUC/issues/LUC-2293).

Next owner/action: CTO/Ops must approve the next explicit recovery permit:
host-level Coolify queue/runtime repair, redacted container crash
investigation, proxy/runtime repair, or another named source/image action.
