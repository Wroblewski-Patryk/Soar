# LUC-2278 Soar Web Coolify Recovery Attempt Evidence

- Date: 2026-06-05
- Owner: Ops Release Lead
- Resource: `soar-web`
- Coolify resource UUID: `ato4fqkncd6t38wzlle2m0rv`
- Expected source SHA: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Secret handling: values not printed or stored.

## Source Ref

- Local `HEAD`: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- `origin/main`: `6e31d814046b640ad529d1cd57f968ba6f67b05e`
- Worktree branch status: `## main...origin/main`

## Pre-Action Coolify State

- `soar-web` metadata readback succeeded.
- Status: `restarting:unknown`
- Repository: `Wroblewski-Patryk/Soar`
- Branch: `main`
- Git commit setting: `HEAD`
- Visible deployment rows included:
  - `b894e5dd30614dfd2035e91e3d848c842d3ff380` rows in `in_progress`
  - `6e31d814046b640ad529d1cd57f968ba6f67b05e` rows in `queued`

## Recovery Action

Exactly one production-impacting action was taken:

`POST /api/v1/deploy?uuid=ato4fqkncd6t38wzlle2m0rv&force=false`

The request returned successfully. No restart, rollback, env edit, database
operation, API resource action, worker action, account action, or live-trading
action was performed.

## Verification

Web convergence command:

```text
node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 6e31d814 --timeout-seconds 600 --interval-seconds 20 --request-timeout-ms 15000
```

Result: failed after 30 attempts. Every completed poll returned `503`; one
attempt aborted by request timeout. No `gitSha` was observed.

Final endpoint probes:

- `https://api.soar.luckysparrow.ch/health` -> `200 OK`
- `https://soar.luckysparrow.ch/api/build-info` -> `503 Service Unavailable`,
  body `no available server`

Final Coolify readback:

- `soar-web` status remained `restarting:unknown`
- deployment history still showed old `b894e5dd...` in-progress rows and
  `6e31d814...` queued rows.

## Disposition

Blocked. The authorized single Web deploy did not recover production Web. The
next owner/action is Coolify/platform runtime intervention for the stuck
`soar-web` deployment queue/runtime state, followed by one fresh public
build-info/API health verification.
