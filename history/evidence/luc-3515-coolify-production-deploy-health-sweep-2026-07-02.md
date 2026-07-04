# LUC-3515 Coolify Production Deploy Health Sweep Evidence

## Scope

- Issue: [LUC-3515](/LUC/issues/LUC-3515)
- Role: 09 DRE (Deployment and Reliability Engineer)
- Timestamp: 2026-07-02T17:23Z
- Mode: read-only verification and deploy-log evidence integration
- Production mutation: none

## Wake Context

- Wake reason: `issue_children_completed`.
- Direct child [LUC-3525](/LUC/issues/LUC-3525) is `done` and supplied the redacted Coolify deploy-log export attachment.
- Harness already held checkout; checkout was not repeated.
- Parent issue readback: `in_progress`, no first-class blockers.

## Public Production Smoke

- `https://api.soar.luckysparrow.ch/health` returned `200` with `status=ok`.
- `https://api.soar.luckysparrow.ch/ready` returned `200` with `status=ready`.
- `https://soar.luckysparrow.ch/` returned `200`.
- `https://soar.luckysparrow.ch/api/build-info` returned `200` with:
  - `gitSha=c357d957741f56835f27a1fc3a948dad43a91036`
  - `gitRef=main`
  - `metadataSource=env-runtime`

Focused smoke:

```text
corepack pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --no-workers

[deploy-smoke] summary
- PASS API /health -> 200
- PASS API /ready -> 200
- PASS WEB / -> 200
- PASS WEB /api/build-info (gitSha=c357d957741f56835f27a1fc3a948dad43a91036) -> 200 gitSha=c357d957741f56835f27a1fc3a948dad43a91036
[deploy-smoke] all checks passed
```

## Coolify Read-Only Projection

- Coolify `/api/v1/version`: `200`, version `4.0.0-beta.473`.
- Coolify current team: `200`, selector `LuckySparrow`.
- Coolify global resources: `17` visible rows.
- Soar application resources:
  - `soar-web`: `running:unknown`, `server_status=true`, resource metadata `git_commit_sha=b894e5dd30614dfd2035e91e3d848c842d3ff380`, restart count `0`.
  - `soar-api`: `running:unknown`, `server_status=true`, resource metadata `git_commit_sha=HEAD`, `last_restart_type=crash`, restart count `2`.
  - `workers-backtest`: `running:unknown`, `server_status=true`, `git_commit_sha=HEAD`.
  - `workers-execution`: `running:unknown`, `server_status=true`, `git_commit_sha=HEAD`.
  - `workers-market-data`: `running:unknown`, `server_status=true`, `git_commit_sha=HEAD`.
  - `workers-market-stream`: `running:unknown`, `server_status=true`, `git_commit_sha=HEAD`.
- Data resources:
  - PostgreSQL rows are `running:healthy`.
  - Redis is `running:healthy`.

## Deploy-Log Export Integration

[LUC-3525](/LUC/issues/LUC-3525) uploaded a redacted artifact:

- Attachment: [LUC-3525 redacted Coolify deploy-log export](/api/attachments/0b0453e1-1fd1-4dfa-9ac2-31049a414b1e/content)
- SHA-256: `56179c92b8f1359fef3866940d764c6b531c65d99434801e3bb0dd23a299924c`
- Work product id reported by child: `ce66ebe4-1ae5-4580-b0e4-0c0fba6c426c`
- Redaction statement: no secret values or private account data intentionally included; bearer/JWT/cookie/password/API-key/DB/Redis/email patterns were scanned before upload.

The artifact changes the prior diagnosis:

- The earlier blocker "no failed-deploy log/export path" is resolved for this sweep.
- Available read-only deploy/log surfaces with current token/API shape:
  - global `/api/v1/deployments`
  - API application `/logs`
  - Web application `/logs`
- Still unavailable through current token/API shape:
  - per-application `/deployments`
  - `/logs/build`
  - `/logs/deployment`
  - application-log paths for PostgreSQL/Redis, which are not application resources.

## Current Deployment Queue Signal

Fresh `/api/v1/deployments` readback returned `7` deployment rows:

- `workers-execution`: `in_progress`, commit `c357d957741f56835f27a1fc3a948dad43a91036`, `finished_at=2026-07-02T14:02:46`.
- `soar-api`: `in_progress`, commit `c357d957741f56835f27a1fc3a948dad43a91036`, `finished_at=2026-07-02T15:17:29`.
- `workers-market-stream`: `queued`, commit `c357d957741f56835f27a1fc3a948dad43a91036`, no `finished_at`.
- `workers-execution`: `queued`, commit `c357d957741f56835f27a1fc3a948dad43a91036`, no `finished_at`.
- `soar-api`: `queued`, commit `c357d957741f56835f27a1fc3a948dad43a91036`, no `finished_at`.
- `workers-market-data`: `queued`, commit `c357d957741f56835f27a1fc3a948dad43a91036`, no `finished_at`.
- `soar-web`: `queued`, commit `HEAD`, no `finished_at`.

Interpretation:

- Public Web/API no-worker production smoke is verified on `c357d957741f56835f27a1fc3a948dad43a91036`.
- Coolify deploy/log provenance is now partially available and no longer blocked by total API invisibility.
- Full Coolify production deploy health remains blocked because the deployment queue still exposes queued rows and inconsistent `in_progress` rows with `finished_at`.
- The next remediation likely requires a production-impacting Coolify queue/deploy/restart action, so DRE stopped fail-closed and requested explicit approval instead of mutating production.

## Source Control And Deployment Impact

- Repo path: `C:/Personal/Projekty/Aplikacje/Soar`.
- Branch: `main`.
- Local HEAD short SHA: `fc0f6d9f`.
- Divergence at check time: ahead `23`, behind `3` versus `origin/main`.
- Existing dirty worktree was present before this heartbeat.
- Files changed by this heartbeat: evidence/task/state/context files only.
- Commit: not created because the worktree is shared, dirty, and divergent.
- Push: not needed and not allowed from this state.
- Deploy/restart/rollback/env/DB/Redis/account/exchange/payment/live-trading mutation: none.

## Residual Risk

- Protected worker readiness was not rerun from this lane.
- Coolify application rows remain `running:unknown` even when `server_status=true`.
- Stuck/queued deployment rows may require explicit queue cleanup, restart, or redeploy approval.
- Release-grade source/build provenance is stronger than the previous `github-branch` signal because Web now reports `metadataSource=env-runtime`, but Coolify resource metadata still reports mixed `HEAD`/older SHA values.

## Approval Follow-Up Amendment

- Timestamp: 2026-07-02T18:41Z.
- Wake reason: `approval_approved`.
- Approval: [af477e6c-de65-42c9-b3f3-85e88706f3cc](/LUC/approvals/af477e6c-de65-42c9-b3f3-85e88706f3cc).
- Concrete follow-up: repeated the smallest safe read-only production checks before mutating Coolify.
- Public no-worker deploy smoke still passes for `c357d957741f56835f27a1fc3a948dad43a91036`: API `/health`, API `/ready`, Web `/`, and Web `/api/build-info`.
- Fresh Coolify redacted GET snapshot: `/api/v1/version` -> `200`; `/api/v1/teams/current` -> `200`, selector `LuckySparrow`; `/api/v1/resources` -> `200`, `17` visible rows; `/api/v1/deployments` -> `200`, `0` visible deployment rows.
- Result: the previously visible queued/in-progress deployment rows were no longer present at follow-up time, so the approved queue-remediation mutation had no remaining target and was not executed.
- Production mutation: none. No deploy, restart, rollback, env edit, DB/Redis mutation, secret readback, account/exchange/payment/subscription mutation, order, position, or live-trading action occurred.
- Remaining release gates: protected worker readiness/authenticated acceptance and release-grade build provenance remain separate gates outside this queue-sweep closure.
