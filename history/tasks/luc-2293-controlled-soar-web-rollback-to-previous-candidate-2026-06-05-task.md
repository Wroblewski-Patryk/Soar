# LUC-2293 Task Contract - Controlled soar-web Rollback To Previous Candidate

## Context

[LUC-2293](/LUC/issues/LUC-2293) is a release mutation permit created after the
completed `6e31d814046b640ad529d1cd57f968ba6f67b05e` `soar-web` redeploy
still left production Web at `503`.

Approved redacted history identified the previous finished source candidate as
`b894e5dd30614dfd2035e91e3d848c842d3ff380`.

## Goal

Execute one controlled `Soar / production / soar-web` rollback or redeploy to
`b894e5dd30614dfd2035e91e3d848c842d3ff380`, then verify public Web/API state
and record redacted evidence.

## Constraints

- Stage: verification.
- Target resource: `soar-web` application only.
- Exactly one rollback/redeploy mutation.
- Use Paperclip/Coolify bindings only; never print or store secret values.
- Do not print or store raw resource ids, raw deployment ids, generated
  database suffixes, raw logs, tokens, cookies, or env values.
- Stop after one attempt if Web remains `503`, build-info does not expose the
  rollback SHA after eight 15-second polls, API regresses, or Coolify returns to
  an unknown/restarting state.

## Definition Of Done

- [x] Confirm public API `/health` and `/ready` are `200`.
- [x] Confirm public Web `/` and `/api/build-info` are still `503`.
- [x] Confirm local and remote `origin/main` remain
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`, so rollback is not a branch-head
  deploy.
- [x] Confirm unrelated dirty local state is not used as release source.
- [x] Execute exactly one permitted `soar-web` rollback/redeploy mutation to
  `b894e5dd30614dfd2035e91e3d848c842d3ff380`.
- [x] Poll Web `/` and `/api/build-info` eight times at 15-second intervals.
- [x] Recheck API `/health` and `/ready`.
- [x] Run `pnpm run ops:coolify-stack:env-check:test`.
- [x] Record redacted Coolify/public evidence and final disposition.

## Forbidden

- Second deploy/restart/rollback mutation under this issue.
- API, worker, Postgres, Redis, env, team/account, protected-smoke, exchange,
  database, force-start, or live-trading mutation.
- Raw Coolify resource/deployment id disclosure.
- Secret, cookie, token, env value, generated database suffix, raw log, account
  data, exchange credential, or live-trading evidence disclosure.

## Result Report

Result: failed closed.

- Precheck: API health/ready `200`; Web root/build-info `503`.
- Source-state precheck: local `HEAD`, local `origin/main`, and remote
  `origin/main` were `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- Coolify pre-readback: `soar-web`, branch `main`, configured
  `git_commit_sha=b894e5dd30614dfd2035e91e3d848c842d3ff380`, status
  `restarting:unknown`.
- Mutation: one Coolify application update for `soar-web` with
  `git_commit_sha=b894e5dd30614dfd2035e91e3d848c842d3ff380` and
  `instant_deploy=true`; request returned success.
- Post-mutation Web polling: all eight polls stayed `503`; build-info did not
  expose the rollback SHA.
- Post-mutation Coolify status: `restarting:unknown` for polls 1-7 and
  `running:unknown` at poll 8.
- Post-mutation API regression: `/health` and `/ready` remained `200`.
- Local regression: `pnpm run ops:coolify-stack:env-check:test` passed (`8/8`).
- Evidence:
  `history/evidence/luc-2293-soar-web-rollback-to-previous-candidate-2026-06-05.md`.
- Deploy impact: one permitted production Web rollback/redeploy attempt was
  executed; production Web remains unhealthy.
- Residual risk: public Web remains `503`; next mutation requires a new
  CTO/Ops decision and a separate permit.

