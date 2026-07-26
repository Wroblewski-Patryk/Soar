# LUC-1888 Soar API Deploy Failure Root Cause And Repair

Date: 2026-07-26
Owner: 09 CBE (Core Backend Engineer)

## Scope

Diagnose the Soar-owned cause of the failed production `soar-api` deployment
for target SHA `9b4fa63a35fa7f62c14d66b55721939c9fdf4950`, repair the backend
image provenance path in source control, and leave a precise redeploy handoff.

No push, deploy, restart, rollback, env edit, database mutation, Redis
mutation, account mutation, or protected production smoke was performed.

## Root Cause

`LUC-1887` already proved:

- public Web build-info exposed target SHA `9b4fa63a3`;
- public API `/health` still exposed old SHA `9d1801d9b`;
- a dedicated `soar-api` deployment reached terminal `status=failed`.

Repo inspection then showed an asymmetric provenance contract:

- `apps/web` already had a bounded fallback path that can derive build metadata
  from `.git/HEAD` and `.git/refs` when explicit build args are missing;
- `apps/api/Dockerfile` required a full `SOURCE_COMMIT`/Coolify SHA build arg
  in the runtime stage and aborted the image build if none was present.

That means the API image could fail during build even when the repository
source itself was valid and the Web lane could still derive provenance from the
minimal `.git` metadata allowed by `.dockerignore`.

Classification:

- production deployment ownership: `Soar source/build lane`
- dependency/credential ownership: `not proven as the blocker in this lane`

## Repair

### Files changed

- `apps/api/Dockerfile`
- `apps/api/scripts/writeApiSourceCommit.mjs`
- `apps/api/scripts/writeApiSourceCommit.test.mjs`

### What changed

1. Added `writeApiSourceCommit.mjs` in `apps/api/scripts/`.
2. The script resolves a full SHA from:
   - `SOURCE_COMMIT`
   - `GITHUB_SHA`
   - `COOLIFY_GIT_COMMIT_SHA`
   - `COOLIFY_COMMIT_SHA`
   - then falls back to `.git/HEAD` plus `.git/refs`
3. The script fails closed if neither source produces a valid 40-character SHA.
4. `apps/api/Dockerfile` now:
   - copies only `.git/HEAD` and `.git/refs` into the build stage;
   - runs the script during build;
   - copies the generated `.build-meta/SOURCE_COMMIT` into
     `/etc/soar-source-commit` in the runtime image.

The runtime still exports `SOURCE_COMMIT` from the baked file, so public API
health/readiness keep the same release-identity contract.

## Verification

### Focused syntax checks

- `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS
- `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS

### Focused script tests

Command:

```powershell
node --test apps/api/scripts/writeApiSourceCommit.test.mjs
```

Result:

- `PASS`
- `3` tests passed:
  - env `SOURCE_COMMIT` path
  - `.git` fallback path
  - fail-closed missing-source path

### Existing release-identity coverage

Command:

```powershell
pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts
```

Result:

- `PASS`
- `2` files, `4` tests passed

This proves the repair did not weaken the existing API release identity helper
or public health exposure.

## Limits

- A full local Docker build was **not** run because Docker Desktop is
  unavailable on this Windows runner.
- No production redeploy or Coolify readback occurred in this lane.

## Release Handoff

Next owner: Ops/Release or the release owner for the current Soar candidate.

Required next action:

1. Commit and push a SHA containing this repair.
2. Redeploy `soar-api`.
3. Re-run the exact proof packet from `LUC-1887`:
   - `https://soar.luckysparrow.ch/`
   - `https://soar.luckysparrow.ch/api/build-info`
   - `https://api.soar.luckysparrow.ch/health`
   - `https://api.soar.luckysparrow.ch/ready`
   - Coolify resource SHA readback
   - Coolify deployment queue/detail readback

Expected success condition:

- `api /health` and `api /ready` expose target SHA
  `9b4fa63a35fa7f62c14d66b55721939c9fdf4950`
- `soar-api` resource metadata reconciles to the same SHA
- no new failed deployment row appears for the repaired candidate
