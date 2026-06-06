# LUC-2506 Web Build-Info Source Provenance

- Date: 2026-06-06
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Scope: Web build metadata generation, public build-info route fallback,
  deploy wait provenance gate, and operations documentation.
- Secret handling: no secret, token, cookie, account, production payload, or
  Coolify value was read or stored.

## Result

Status: implemented and verified locally.

Soar Web build-info no longer substitutes the GitHub `main` branch head when
build-time source metadata is missing. The metadata writer now uses only
authoritative build/source inputs in this order:

1. explicit env/build args such as `SOURCE_COMMIT`, `GITHUB_SHA`, or
   `COOLIFY_GIT_COMMIT_SHA`;
2. repository `git`;
3. repository `.git` files;
4. `unknown`.

The runtime `/api/build-info` route also no longer performs its own GitHub
branch-head lookup when metadata is absent. Deploy wait now accepts only
`metadataSource=env`, `metadataSource=git`, or `metadataSource=git-files` by
default. Historical `github-branch` and `github-branch-runtime` values are
diagnostic only and fail the provenance gate unless the operator explicitly
uses the existing diagnostics-only runtime fallback flag.

## Files Changed

- `apps/web/src/app/api/build-info/route.ts`
- `scripts/writeWebBuildMetadata.mjs`
- `scripts/writeWebBuildMetadata.test.mjs`
- `scripts/waitForWebBuildInfo.mjs`
- `scripts/waitForWebBuildInfo.test.mjs`
- `scripts/releaseOpsScriptContracts.test.mjs`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-readiness-gates.md`

## Validation

- `node --check scripts/writeWebBuildMetadata.mjs` -> PASS.
- `node --check scripts/writeWebBuildMetadata.test.mjs` -> PASS.
- `node --check scripts/waitForWebBuildInfo.mjs` -> PASS.
- `node --check scripts/waitForWebBuildInfo.test.mjs` -> PASS.
- `node --test scripts/writeWebBuildMetadata.test.mjs` -> PASS (`2/2`).
- `node --test scripts/waitForWebBuildInfo.test.mjs` -> PASS (`4/4`).
- `node --test scripts/releaseOpsScriptContracts.test.mjs scripts/writeWebBuildMetadata.test.mjs scripts/waitForWebBuildInfo.test.mjs` -> PASS (`8/8`).
- `pnpm --filter web run typecheck` -> PASS.
- `pnpm run quality:guardrails` -> PASS.

## Deployment Impact

- No deploy, restart, rollback, env edit, database/Redis action, account
  mutation, protected smoke, exchange action, or live-trading action occurred.
- Deploy impact is low but release-gate meaningful: the next Web deployment
  must provide `SOURCE_COMMIT` or another authoritative build source metadata
  input. If it does not, `/api/build-info` will fail closed with missing/unknown
  provenance instead of reporting the current GitHub branch head.
- The existing Coolify Service Stack manifest already requires
  `SOURCE_COMMIT` and passes it as a Web build arg.

## Residual Risk

- Current production will continue reporting its existing metadata until a
  future approved Web deployment uses this code.
- This issue did not mutate production, so it does not by itself prove current
  production image provenance.
- Separate protected worker/dashboard/account/SLO/rollback/live runtime gates
  remain fail-closed through the existing release chain.
