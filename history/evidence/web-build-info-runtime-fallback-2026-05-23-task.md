# Web Build Info Runtime Fallback Task - 2026-05-23

## Context

After commit `49a59b69` was pushed to `main`, Coolify did not auto-deploy the
new `soar-web` build. The coordinator cancelled stale queued/in-progress
worker/API/Web deployments and triggered `soar-web` manually. Production then
served a new Web build, but `/api/build-info` reported `gitSha: null` and
`metadataSource: unknown`.

## Goal

Keep deploy freshness proof reliable when build-time metadata resolution fails
inside Coolify.

## Scope

- Make `apps/web/src/app/api/build-info/route.ts` dynamic instead of static.
- Add a runtime GitHub `main` fallback when file/env metadata does not provide a
  commit SHA.
- Retry the existing build-time GitHub fallback in
  `scripts/writeWebBuildMetadata.mjs`.

## Implementation Plan

1. Preserve file/env metadata as the primary source.
2. If both are missing, resolve the latest `main` SHA from the GitHub commits
   API at request time with `cache: "no-store"` and a short timeout.
3. Retry the build-time GitHub fallback up to three times for transient Coolify
   network failures.
4. Validate Web typecheck/build and repository guardrails before commit.
5. Push to `main`, redeploy `soar-web`, and require production build-info plus
   public smoke evidence before closure.

## Acceptance Criteria

- `/api/build-info` can recover a SHA at runtime when build metadata was written
  as `gitSha: null`.
- Build-time metadata resolution is less sensitive to transient network
  failures.
- The route does not use cached GitHub fallback responses.
- Local Web typecheck/build and guardrails pass.
- Production `/api/build-info` matches the pushed `HEAD` before this task is
  considered done.

## Definition of Done

- Code and source-of-truth state are updated.
- Commit is pushed to `main`.
- Coolify `soar-web` is deployed to the commit.
- Public deploy smoke passes.

## Forbidden

- Do not bypass the build-info freshness gate.
- Do not claim authenticated app or worker readiness without valid Soar app
  credentials.
- Do not perform production LIVE exchange, order, position, or bot activation
  mutations.

## Result Report

- Status: verified and deployed for code commit `f822adef`.
- Local changes implemented:
  - `apps/web/src/app/api/build-info/route.ts`
  - `scripts/writeWebBuildMetadata.mjs`
- Production observation before the fix:
  - `/api/build-info` served build `ownhF2rz9PTbbfD7bjapg`
  - `gitSha: null`
  - `metadataSource: unknown`
- Local validation:
  - `pnpm --filter web run typecheck` - PASS
  - `pnpm --filter web run build` - PASS; `/api/build-info` remains dynamic
    in the Next route manifest.
  - `pnpm run quality:guardrails` - PASS
  - `git diff --check` - PASS with line-ending warnings only.
- Production validation after manual Coolify queue cleanup and `soar-web`
  trigger:
  - `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha f822adef --timeout-seconds 900 --interval-seconds 30`
    - PASS; production returned
      `f822adef3381cd74412d6ee248a84298b9ac04be`.
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
    - PASS API `/health` 200, API `/ready` 200, Web `/` 200.
  - Public build-info readback:
    - `buildId`: `dlbLKwBTKf2H0xApVEoJY`
    - `gitSha`: `f822adef3381cd74412d6ee248a84298b9ac04be`
    - `gitRef`: `main`
    - `metadataSource`: `github-branch`
    - `metadataGeneratedAt`: `2026-05-23T10:07:09.813Z`
    - `checkedAt`: `2026-05-23T10:09:38.432Z`
- Residual operational risk:
  - Coolify still accumulates stale queued/in-progress worker/API deployments
    and did not auto-start `soar-web`; manual queue cleanup plus Web trigger was
    required.
  - Authenticated app smoke and protected `/workers/ready` were not claimed
    because the available Coolify credential is not a valid Soar application
    credential.
