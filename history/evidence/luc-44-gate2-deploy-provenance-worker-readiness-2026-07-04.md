# LUC-44 Gate 2 Deploy Provenance And Worker Readiness Evidence

Date: 2026-07-04
Operator: 09 DRE (Deployment & Reliability Engineer)
Issue: LUC-44
Parent: LUC-34
Repo: `C:/Personal/Projekty/Aplikacje/Soar`

## Decision

Current release candidate for Gate 2 verification is `8271f1cb22dfaf18e354843311cb9b0854cf7dba`.

Reason:
- production web `/api/build-info` reports `gitSha=8271f1cb22dfaf18e354843311cb9b0854cf7dba`;
- `origin/main` is `8271f1cb22dfaf18e354843311cb9b0854cf7dba`;
- local `main` is `c941dc053c1c9e8e53cd93babb2d71369ec386db` and is ahead of `origin/main` by 25 commits;
- no push or deploy/restart was performed in this heartbeat because the issue scope forbids mutation unless the required deploy gate is already approved.

## Architecture And Runbook Preflight

Read:
- `docs/architecture/README.md`
- `docs/architecture/architecture-source-of-truth.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`

Fit status: current checks fit the documented topology. `/workers/ready` is intentionally protected by auth, ADMIN role, and ops-network guard.

## Git State

Command: `git rev-parse HEAD; git rev-parse origin/main; git status --short --branch`

Observed:
- `HEAD`: `c941dc053c1c9e8e53cd93babb2d71369ec386db`
- `origin/main`: `8271f1cb22dfaf18e354843311cb9b0854cf7dba`
- branch state: `main...origin/main [ahead 25]`
- working tree: clean

## Coolify Read-Only Observation

Read-only Coolify API observation showed Soar production resources running with these source bindings:

| Resource | UUID | Git repo | Branch | Coolify commit field | Status |
| --- | --- | --- | --- | --- | --- |
| `soar-api` | `k126p7vqxs5cly2zc4y4g4rq` | `Wroblewski-Patryk/Soar` | `main` | `HEAD` | `running:unknown` |
| `soar-web` | `ato4fqkncd6t38wzlle2m0rv` | `Wroblewski-Patryk/Soar` | `main` | `b894e5dd30614dfd2035e91e3d848c842d3ff380` | `running:unknown` |
| `workers-market-data` | `sj0bh3pirqq1jf41bijaf77y` | `Wroblewski-Patryk/Soar` | `main` | `HEAD` | `running:unknown` |
| `workers-market-stream` | `d2oo1wwy8i55q27e5mdky0i4` | `Wroblewski-Patryk/Soar` | `main` | `HEAD` | `running:unknown` |
| `workers-backtest` | `gktawk85w6826z2bs8z123mz` | `Wroblewski-Patryk/Soar` | `main` | `HEAD` | `running:unknown` |
| `workers-execution` | `s2qz86w8c9hc5anajdtl5d8r` | `Wroblewski-Patryk/Soar` | `main` | `HEAD` | `running:unknown` |

## Deploy Smoke

Command:

```sh
pnpm run ops:deploy:smoke -- --api-base-url $SOAR_API_BASE_URL --web-base-url $SOAR_PROD_BASE_URL --expected-sha 8271f1cb22dfaf18e354843311cb9b0854cf7dba
```

Secret-bearing values were provided only from environment refs and were not printed.

Result:

```text
[deploy-smoke] summary
- PASS API /health -> 200
- PASS API /ready -> 200
- PASS WEB / -> 200
- PASS WEB /api/build-info (gitSha=8271f1cb22dfaf18e354843311cb9b0854cf7dba) -> 200 gitSha=8271f1cb22dfaf18e354843311cb9b0854cf7dba
- FAIL API /workers/ready -> status 403
[deploy-smoke] failed checks: 1
```

## Worker Readiness Access Diagnosis

Probe:
- production login with `SOAR_PROD_TEST_EMAIL` / `SOAR_PROD_TEST_PASSWORD` succeeded;
- `GET /auth/me` returned `200`;
- the authenticated principal role was `USER`;
- `GET /workers/ready` with that session returned `403`.

Code path:
- `apps/api/src/router/index.ts` defines `GET /workers/ready` with `...requireOpsAccess`;
- `requireOpsAccess` is `requireAuth`, `requireRole('ADMIN')`, `requireOpsNetwork`;
- the current smoke account fails the ADMIN requirement before worker readiness can be inspected.

Conclusion: the remaining Gate 2 blocker is an access/configuration blocker, not a current build-info mismatch. Gate 2 cannot close until the protected smoke path has an approved ADMIN-capable production smoke principal and an allowed ops-network path, or an equivalent no-secret read-only worker readiness proof path.

## Rollback Note

No deploy, restart, secret mutation, or production configuration mutation was performed. Rollback action for this heartbeat is therefore none. If a future approved deploy aligns production to `c941dc05`, rollback should use the previous stable production artifact/source currently evidenced by build-info `8271f1cb22dfaf18e354843311cb9b0854cf7dba` unless a newer stable artifact is recorded before deployment.

## Residual Risk

- Gate 2 remains open because worker readiness body could not be inspected.
- Current production public health/readiness and build-info for `8271f1cb22dfaf18e354843311cb9b0854cf7dba` pass.
- Local `c941dc05` is not a production candidate until the 25 local commits are pushed and an approved deployment is performed.
