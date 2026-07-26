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

## Current Root Cause
- `docs/operations/coolify-linux-vps-setup-guide.md` already states that Coolify Docker builds needing `SOURCE_COMMIT` must enable `Include Source Commit in Build`.
- `LUC-1893` proved the `soar-api` Coolify flag was previously disabled, then repaired to `true`.
- Exact contrary production proof from deployment `gkd7yst34j2ew415xjn2u1xy` then showed the injected Coolify Dockerfile already carried the full `ARG SOURCE_COMMIT=adc82a154c9023256e454accfb4edda2d3f0a378`.
- The remaining backend/source-build gap was our later bare `ARG SOURCE_COMMIT` redeclaration inside the repository build stage, which cleared the injected value before `writeApiSourceCommit.mjs` ran.

## Root Fix Applied
- Moved provenance `ARG` consumption to an ancestor stage in `apps/api/Dockerfile`.
- Removed the later bare `ARG SOURCE_COMMIT`, `ARG COOLIFY_GIT_COMMIT_SHA`, `ARG COOLIFY_COMMIT_SHA`, and `ARG GITHUB_SHA` redeclarations from the `build` stage.
- Kept remote builds independent of `.git` paths, which Coolify excludes from its source context; the writer remains fail-closed if no full provenance argument is supplied.
- Added a focused Dockerfile-layout regression test so the build stage cannot silently reintroduce the later bare `ARG` redeclaration pattern.

## Files Changed
- `apps/api/Dockerfile`
- `apps/api/scripts/apiDockerfileProvenanceLayout.test.mjs`
- `apps/api/scripts/writeApiSourceCommit.mjs`
- `apps/api/scripts/writeApiSourceCommit.test.mjs`
- `docs/operations/coolify-linux-vps-setup-guide.md`

## Verification
- `node --check apps/api/scripts/apiDockerfileProvenanceLayout.test.mjs` -> PASS
- `node --test apps/api/scripts/apiDockerfileProvenanceLayout.test.mjs` -> PASS (`1/1`)
- `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS
- `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS
- `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`6/6`)
- `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts` -> PASS (`4/4`)

## Release Boundary / Residual Blocker
- Git worktree was already dirty before this run because `LUC-1891` left unrelated edits in `.codex/context/*` and `history/*`.
- This runner has no `COOLIFY_*` environment bindings and no `COOLIFY_DEPLOY_API_TOKEN`.
- Result: the backend hardening is implemented and locally verified, but the observed production blocker remains unproven until the Coolify application metadata is read and the config path is validated or corrected.

## Next Owner Path
- Release/Coolify owner: redeploy `soar-api` once on a commit containing the ancestor-stage ARG layout fix plus the existing writer hardening, then return exact build/deploy proof.
- Backend owner: keep the writer regression and the Dockerfile layout regression as guards, but do not treat the `.git` fallback as the root fix for this incident.
