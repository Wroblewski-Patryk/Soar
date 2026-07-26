# LUC-1891 WriteApiSourceCommit Path Anchoring Repair

Date: 2026-07-26
Owner: 09 CBE (Core Backend Engineer)

## Scope

Repair the `apps/api/scripts/writeApiSourceCommit.mjs` path anchor defect
highlighted after the repeated failed `soar-api` deployment for target SHA
`7742e5b73d89fff0f037b264b96acc0a7f863a9f`, verify the fix locally, and leave
the next deploy retry with the proper release/Ops owner.

No production mutation, deploy, rollback, secret change, database mutation, or
worker/web/runtime change was performed in this lane.

## Starting facts

The active release chain already proved, on Sunday, July 26, 2026:

- `LUC-1889`:
  one exact `instant_deploy=true` for `soar-api` was readable and still failed
- board follow-up:
  `writeApiSourceCommit.mjs` derived `apiDir` from `process.cwd()`
- Docker invocation shape:
  `node apps/api/scripts/writeApiSourceCommit.mjs` ran from `WORKDIR /app`

That meant the fallback could incorrectly look for `/.git` and write
`/app/.build-meta/SOURCE_COMMIT` instead of the intended
`/app/apps/api/.build-meta/SOURCE_COMMIT`.

## Repair

Applied the smallest backend-owned source fix:

- changed `apps/api/scripts/writeApiSourceCommit.mjs` to derive its base path
  from `import.meta.url` via `fileURLToPath(...)`
- set `apiDir` to the script's parent `apps/api` directory instead of
  `process.cwd()`
- kept the existing precedence order:
  exact env SHA first, `.git` fallback second, hard failure when neither exists

Test hardening:

- the script tests now copy the helper into an isolated temp repo fixture
  before execution
- added one regression that runs the copied script from the fake repo root and
  proves it still reads `.git` from the fixture root and writes output into the
  fixture `apps/api/.build-meta`

Changed files:

- `apps/api/scripts/writeApiSourceCommit.mjs`
- `apps/api/scripts/writeApiSourceCommit.test.mjs`

## Validation

Focused local verification on Sunday, July 26, 2026:

- `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS
- `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS
- `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`5/5`)
- `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts`
  -> PASS (`4/4`)

## Conclusion

`LUC-1891` removes the backend-owned script-anchor ambiguity that remained
after the earlier deploy hardening. The source-commit writer now resolves the
intended repo/output paths from the script location regardless of caller
working directory.

The next action is outside this role boundary:

- release/Ops owner should perform one fresh `soar-api` deploy on a commit that
  includes this repair
- the release parent should then rerun the exact `LUC-1887` production proof
  set and confirm whether `api /health` and `api /ready` move off old SHA
  `9d1801d9b023211d4446629aac7bd58def70322d`
