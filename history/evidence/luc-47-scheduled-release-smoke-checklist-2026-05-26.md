# LUC-47 Scheduled Release Smoke Checklist (Temp-Domain Parallel Stack)

Date: 2026-05-26  
Issue: `LUC-47`  
Mode: operator-run, evidence-first, no secret disclosure

## Preconditions
- [ ] Runtime bootstrap is stable (no adapter `os error 32` lock contention during run).
- [ ] Operator unblock packet target SHA matches expected candidate SHA.
- [ ] Use explicit packet path for this run (avoid default packet auto-selection drift):
  - `history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json`
  - `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --json`
- [ ] Coolify project/environment targets are confirmed for Soar production context.
- [ ] Old six-app production shape remains untouched before evidence pass.

## Production Account Test Contract (Mandatory For Any Real-Account Smoke)
- [ ] Test objective is explicit and scoped (`what exactly must be proven`).
- [ ] Allowed actions are explicitly listed.
- [ ] Forbidden actions are explicitly listed (`no subscription mutation`, `no API key mutation`, `no exchange/live-risk setting changes`, unless explicitly approved).
- [ ] Cleanup/reset step is explicit (state reset owner + method).
- [ ] Named owner is explicit for the run packet.
- [ ] Evidence packet includes a redaction note (`no secret/token/session value disclosure`).

## Deploy Step (Operator)
- [ ] Execute parallel one-stack deploy on temporary domains in Coolify.
- [ ] Record deploy start/end timestamps.
- [ ] Record target SHA and branch used by deploy action.

## Temp-Domain Smoke (Required)
- [ ] `temp-api` `GET /health` -> `200`
- [ ] `temp-api` `GET /ready` -> `200`
- [ ] `temp-web` `GET /` -> `200`
- [ ] `temp-web` `GET /api/build-info` -> `200`
- [ ] `temp-web /api/build-info` `gitSha` equals expected candidate SHA.

## Worker Readiness Evidence (Required)
- [ ] `workers-market-data` readiness captured.
- [ ] `workers-market-stream` readiness captured.
- [ ] `workers-backtest` readiness captured.
- [ ] `workers-execution` readiness captured.
- [ ] One timestamped proof packet attached for all four workers.

## Rollback Posture
- [ ] Previous stable deploy reference captured.
- [ ] Explicit rollback trigger documented (which failed gate).
- [ ] Rollback command/path owner confirmed.
- [ ] Post-rollback smoke contract listed (`API /health`, `API /ready`, `WEB /`, `build-info`).

## Attachments To Add In LUC-47
- [ ] Temp-domain smoke command log (redacted, no secrets).
- [ ] Build-info payload snapshot with expected SHA.
- [ ] Worker readiness snapshot/log for all four workers.
- [ ] Rollback readiness note (owner + action + stable target).

## Operator Command Template (redacted)
Use temp-domain URLs and protected tokens from operator vault/session only. Do not paste secrets into issue comments.

```bash
# temp API/Web smoke
curl -fsS https://<temp-api>/health
curl -fsS https://<temp-api>/ready
curl -fsS https://<temp-web>/
curl -fsS https://<temp-web>/api/build-info

# protected worker readiness (example header shape only)
curl -fsS -H "Authorization: Bearer <OPS_TOKEN>" https://<temp-api>/workers/health
curl -fsS -H "Authorization: Bearer <OPS_TOKEN>" https://<temp-api>/workers/ready
```

## Closure Comment Template (LUC-47)
- Deploy window: `<start/end UTC>`
- Target SHA: `<sha>` (expected: `<sha>`)
- Temp smoke:
  - `temp-api /health`: `<status>`
  - `temp-api /ready`: `<status>`
  - `temp-web /`: `<status>`
  - `temp-web /api/build-info`: `<status + gitSha>`
- Worker readiness:
  - `workers-market-data`: `<ready/not-ready>`
  - `workers-market-stream`: `<ready/not-ready>`
  - `workers-backtest`: `<ready/not-ready>`
  - `workers-execution`: `<ready/not-ready>`
- Rollback posture: `<previous stable target + owner + trigger>`
- Commit/push/deploy state in this run:
  - `commit: no/yes`
  - `push: no/yes`
  - `deploy: yes` (operator release run)

## Closure Rule
Mark `LUC-47` as closeable only when all required smoke/readiness checks above are attached and SHA-matched.
