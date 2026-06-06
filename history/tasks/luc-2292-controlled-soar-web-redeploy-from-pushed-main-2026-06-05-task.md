# LUC-2292 Task Contract - Controlled soar-web Redeploy From Pushed Main

## Context

[LUC-2292](/LUC/issues/LUC-2292) is a release mutation permit for one controlled
`Soar / production / soar-web` redeploy after restart recovery did not clear the
production Web `503`.

## Goal

Execute one permitted Coolify redeploy of `soar-web` from pushed `main` at
`6e31d814046b640ad529d1cd57f968ba6f67b05e`, then verify public Web/API
readiness and record evidence.

## Constraints

- Stage: verification.
- Target resource: `soar-web` only.
- No rollback under this issue.
- No deploy, restart, env, DB, Redis, worker, team/account, protected-smoke,
  exchange, or live-trading mutation outside the single redeploy.
- Do not print or store secrets, raw resource ids, raw deployment ids, raw logs,
  generated database suffixes, tokens, cookies, or env values.

## Definition Of Done

- [x] Confirm local `HEAD` and `origin/main` match the expected SHA.
- [x] Confirm API `/health` and `/ready` are `200` before mutation.
- [x] Confirm Web `/` and `/api/build-info` are failing before mutation.
- [x] Request exactly one `soar-web` redeploy.
- [x] Poll Web `/` and `/api/build-info` for the required eight attempts.
- [x] Recheck API `/health` and `/ready`.
- [x] Run the focused local Coolify env-check regression.
- [x] Record redacted evidence and final disposition.

## Forbidden

- Rollback execution.
- Second deploy/restart attempt under the same permit.
- Raw Coolify resource/deployment id disclosure.
- Secret, cookie, token, env value, generated database suffix, raw log, account
  data, exchange credential, or live-trading mutation.

## Result Report

Result: failed closed.

- Source precheck: `HEAD` and `origin/main` were
  `6e31d814046b640ad529d1cd57f968ba6f67b05e`.
- Pre-mutation public state: API health/ready `200`; Web root/build-info `503`.
- Mutation: one Coolify redeploy request for `soar-web`; request accepted.
- Post-mutation Web polling: all eight polls stayed `503`; build-info did not
  expose the expected SHA; Coolify ended `restarting:unknown`.
- Post-mutation API regression: health/ready remained `200`.
- Local regression: `pnpm run ops:coolify-stack:env-check:test` passed, 8/8.
- Evidence: `history/evidence/luc-2292-controlled-soar-web-redeploy-2026-06-05.md`.
- Commit/push: not committed; existing dirty tree contains unrelated prior
  state/evidence files and this heartbeat only added task/evidence artifacts.
- Deploy impact: completed one permitted redeploy attempt; Web remains
  unhealthy.
- Residual risk: production Web remains `503`; rollback is still blocked until
  a previous stable deployment/image or source ref is selected from approved
  redacted log/history evidence under [LUC-2289](/LUC/issues/LUC-2289).
