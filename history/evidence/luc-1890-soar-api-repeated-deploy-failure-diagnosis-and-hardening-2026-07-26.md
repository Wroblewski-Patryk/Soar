# LUC-1890 Soar API Repeated Deploy Failure Diagnosis And Hardening

Date: 2026-07-26
Owner: 09 CBE (Core Backend Engineer)

## Scope

Diagnose the repeated failed `soar-api` deployment for target SHA
`7742e5b73d89fff0f037b264b96acc0a7f863a9f` after the prior provenance repair
from `LUC-1888`, apply the smallest backend-owned fix, and leave a redeploy
handoff back to the release parent.

No production mutation, deploy, rollback, secret change, database mutation, or
worker/web/runtime change was performed in this lane.

## Starting facts

Taken from the live `LUC-1890` heartbeat context on Sunday, July 26, 2026:

- target app: `soar-api`
- target deployment UUID: `kmpm887pdgo48b8l5j13q5cw`
- target commit: `7742e5b73d89fff0f037b264b96acc0a7f863a9f`
- previous Ops lane `LUC-1889` already proved:
  - `instant_deploy=true` works for this app
  - the exact deployment row is readable
  - the deployment still reaches terminal `failed`
  - public `/health` and `/ready` remain on the older running SHA

That removed queue/readback ambiguity and left backend build/runtime packaging
as the first actionable owner path.

## Diagnosis

The repeated failure path was still present in `apps/api/Dockerfile` even after
`LUC-1888`:

- the Dockerfile still executed:
  - `COPY .git/HEAD .git/HEAD`
  - `COPY .git/refs .git/refs`
- only after those `COPY` steps did it run
  `node apps/api/scripts/writeApiSourceCommit.mjs`

This means the intended "fallback to `.git` files" was not merely a fallback.
It had become a hard Docker build prerequisite.

For a remote builder such as Coolify, that is fragile because the deployment
pipeline may know the commit SHA and still not provide a usable `.git` tree in
the Docker build context. In that shape, the build can fail before the source
commit writer script has any chance to consume `SOURCE_COMMIT`,
`COOLIFY_GIT_COMMIT_SHA`, `COOLIFY_COMMIT_SHA`, or `GITHUB_SHA`.

## Repair

Backend-owned hardening applied:

- removed the hard Docker build dependency on `.git/HEAD` and `.git/refs`
  from `apps/api/Dockerfile`
- changed the source-commit writer invocation to explicitly forward the known
  build args into the script environment:
  - `SOURCE_COMMIT`
  - `COOLIFY_GIT_COMMIT_SHA`
  - `COOLIFY_COMMIT_SHA`
  - `GITHUB_SHA`
- kept the script itself fail-closed:
  - exact env SHA first
  - `.git` fallback second when available
  - hard failure when neither source is present
- added focused regression coverage proving the Coolify-style
  `COOLIFY_GIT_COMMIT_SHA` path

Changed files:

- `apps/api/Dockerfile`
- `apps/api/scripts/writeApiSourceCommit.test.mjs`

## Validation

Focused local checks on Sunday, July 26, 2026:

- `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS
- `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS
- `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`4/4`)
- `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts`
  -> PASS (`4/4`)

## Limits

- Docker CLI is installed in this runner, but the Docker Desktop engine is not
  available, so no local container build proof could be executed here.
- Effective `COOLIFY_*` runtime bindings were not present in this shell, so
  this lane used the exact Paperclip issue payload and repo source inspection
  rather than direct Coolify API log readback.

## Conclusion

`LUC-1890` found a second backend-owned deploy fragility after `LUC-1888`:
the API provenance fallback still required `.git` files to exist as a Docker
build-time input. The repair makes the API image prefer explicit deploy SHA
build args without forcing `.git` into the builder context, while preserving
the fail-closed release identity contract.

Next owner action is back in the release lane: redeploy `soar-api` for commit
`7742e5b73d89fff0f037b264b96acc0a7f863a9f` and rerun the exact `LUC-1887`
production proof set.
