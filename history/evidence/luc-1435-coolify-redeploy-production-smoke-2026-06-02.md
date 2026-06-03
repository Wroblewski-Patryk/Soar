# LUC-1435 Coolify Redeploy Production Smoke

- Issue: `LUC-1435`
- Title: `Verify Coolify redeploy and production smoke for DCA-before-close fix`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: partially verified, blocked on protected smoke credentials

## Scope

Verify whether Soar production redeployed a source revision containing the
DCA-before-close fix and whether the deployed API/Web runtime is operational.
No deploy, restart, rollback, environment edit, database action, account
mutation, live-trading mutation, or secret readback was performed.

## Source And Freshness Evidence

- Required fix SHA from issue: `2dc983ced4a4c66e31e7f37264710c124955e57b`.
- Production web build-info at `https://soar.luckysparrow.ch/api/build-info`
  returned:
  - `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
  - `gitRef=main`
  - `metadataSource=github-branch`
  - `buildId=9_MzvzTWKAhz25Nco5xPY`
- Local git ancestry check:
  - command: `git merge-base --is-ancestor 2dc983ced4a4c66e31e7f37264710c124955e57b 6839cd6b8884e26eca735ce32cea98c1dadccfbe`
  - result: pass, deployed SHA contains the required fix SHA.
- `origin/main` also contains the required fix SHA.

## Public Production Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- `API /health` -> `200`
- `API /ready` -> `200`
- `WEB /` -> `200`
- `WEB /api/build-info` -> `200`
- `API /workers/ready` -> `401`

Additional public route readback:

- `https://soar.luckysparrow.ch/auth/login` -> `200`
- `https://api.soar.luckysparrow.ch/health` -> `200`
- `https://api.soar.luckysparrow.ch/ready` -> `200`

## Protected Worker Readiness

Status: blocked by credential/session validity, not by public runtime health.

- `SMOKE_AUTH_TOKEN` binding was present, but protected `/workers/ready`
  returned `401`.
- Retrying through the repo smoke script with token suppressed and
  `SMOKE_AUTH_EMAIL`/`SMOKE_AUTH_PASSWORD` bindings present failed at login:
  `login failed (400): Validation failed`.
- No secret values, token values, cookies, account details, or response bodies
  containing credentials were stored.

## Coolify Read-Only Production Projection

Authenticated read-only Coolify API projection at `2026-06-02T06:05:46Z`:

- configured project resolves to `Soar`;
- redacted production resource count remains `8`;
- applications: `soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`;
- data services: `postgresql`, `redis`;
- PostgreSQL and Redis report `running:healthy`;
- application inventory layer reports `running:unknown`, so application
  readiness remains proven through public/protected smoke rather than inventory
  status alone.

## Verdict

Partially verified:

- Production web/API are reachable and ready.
- Deployed production web SHA `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
  contains the required DCA-before-close fix SHA.
- Coolify read-only inventory still resolves the expected Soar production
  resources.

Blocked:

- Protected worker readiness could not be verified because the approved smoke
  credential/session bindings available in this heartbeat failed (`401` token
  path, `400 Validation failed` login path).

## Required Unblock

Security/Ops credential owner must refresh or provide an approved read-only
production smoke principal/session that can authenticate to protected
`GET /workers/ready` without exposing secret values. After that, Ops should
rerun:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Expected closure condition: all checks pass, including protected
`API /workers/ready`.
