# LUC-1892 Evidence

## Summary
- Issue: the observed `soar-api` Coolify remote Docker failure still showed `SOURCE_COMMIT=""` at build time, so backend fallback hardening alone does not prove the root fix.
- Date: Sunday, July 26, 2026
- Scope: correct the backend evidence, preserve the focused regression guard, and hand off the root unblock to the Coolify/deploy owner

## Backend Finding
`apps/api/scripts/writeApiSourceCommit.mjs` previously read the first non-empty env from:

- `SOURCE_COMMIT`
- `GITHUB_SHA`
- `COOLIFY_GIT_COMMIT_SHA`
- `COOLIFY_COMMIT_SHA`

It then validated only that one candidate. That left a real backend weakness for the shape `short SOURCE_COMMIT + full COOLIFY_GIT_COMMIT_SHA`.

However, the exact Coolify log captured for this issue showed `SOURCE_COMMIT=""` at runtime. That means the locally verified writer hardening is only a secondary guard; it does not by itself explain or fix the observed empty-arg failure.

## Backend Hardening Kept
- Added `readFirstValidEnvSha(...)` to iterate the candidate env vars until a normalized full 40-character SHA is found.
- Preserved existing fail-closed behavior when no full SHA exists in envs or `.git` fallback.
- Added a focused regression test for `SOURCE_COMMIT=adc82a154` together with full `COOLIFY_GIT_COMMIT_SHA`.

## Current Root-Fix Hypothesis
- `docs/operations/coolify-linux-vps-setup-guide.md` already states that Coolify Docker builds needing `SOURCE_COMMIT` must enable `Include Source Commit in Build`.
- `LUC-1893` proved the `soar-api` Coolify flag was previously disabled, then repaired to `true`, but the next exact redeploy still reached the same build step with `SOURCE_COMMIT=""`.
- The remaining backend/source-build gap is that the API Docker build stage did not copy `.git/HEAD` and `.git/refs`, so the already-implemented git-file fallback in `apps/api/scripts/writeApiSourceCommit.mjs` could never succeed in the remote Docker context.

## Root Fix Applied
- Added `COPY .git/HEAD .git/HEAD` and `COPY .git/refs .git/refs` to `apps/api/Dockerfile` build stage only.
- Kept runtime image clean: no `.git` paths are copied into the runtime stage.
- Updated `docs/operations/coolify-linux-vps-setup-guide.md` so the API deploy-proof contract now explicitly matches the web contract for `SOURCE_COMMIT` fallback.

## Files Changed
- `apps/api/Dockerfile`
- `apps/api/scripts/writeApiSourceCommit.mjs`
- `apps/api/scripts/writeApiSourceCommit.test.mjs`
- `docs/operations/coolify-linux-vps-setup-guide.md`

## Verification
- `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS
- `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS
- `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`6/6`)
- `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS
- `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS
- `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`6/6`)
- `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts` -> PASS (`4/4`)

## Release Boundary / Residual Blocker
- Git worktree was already dirty before this run because `LUC-1891` left unrelated edits in `.codex/context/*` and `history/*`.
- This runner has no `COOLIFY_*` environment bindings and no `COOLIFY_DEPLOY_API_TOKEN`.
- Result: the backend hardening is implemented and locally verified, but the observed production blocker remains unproven until the Coolify application metadata is read and the config path is validated or corrected.

## Next Owner Path
- Release/Coolify owner: redeploy `soar-api` once on a commit containing the Dockerfile fallback copy plus the existing writer hardening, then return exact build/deploy proof.
- Backend owner: keep the writer regression as a guard against `short SOURCE_COMMIT + full fallback SHA`; the Dockerfile now makes the `git-files` fallback reachable in the real remote Docker context.
