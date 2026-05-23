# DEPLOY-BUILD-INFO-FRESHNESS-GATE-HARDENING-2026-05-23

## Context

The production Web build-info endpoint can recover a SHA from GitHub `main`
when normal build metadata is absent. That recovery is useful for diagnosis,
but the deployment freshness wait script must not treat runtime fallback alone
as proof that the deployed image was rebuilt from the expected commit.

Before this task, production exposed
`069aa36f4918cbf4ed062f50425288dff30a2b89` on `main` with build id
`orQiE9zTo_TVTcAoXpzI6`, `metadataSource=github-branch`, and public deploy
smoke passed for API `/health`, API `/ready`, and Web `/`.

## Goal

Make the Web build-info deploy gate fail closed when a matching SHA is supplied
only by runtime fallback metadata, or when the response lacks a real production
build id.

## Scope

- `scripts/waitForWebBuildInfo.mjs`
- `scripts/waitForWebBuildInfo.test.mjs`
- Current state/source-of-truth files that mention the latest public deploy
  checkpoint.

## Implementation Plan

1. Log `metadataSource` and `buildId` during deploy freshness polling.
2. Accept build-time metadata sources by default: `env`, `git`, `git-files`,
   and `github-branch`.
3. Reject runtime fallback or missing metadata sources by default, even if
   `gitSha` matches.
4. Reject missing, development, or `unknown-production-build` build ids.
5. Add a diagnostics-only `--allow-runtime-fallback` escape hatch that is not
   used by release gates.
6. Add node tests for the PASS and false-positive FAIL cases.

## Acceptance Criteria

- Matching SHA plus build-time metadata and real build id passes.
- Matching SHA plus `github-branch-runtime` fails by default.
- Matching SHA plus `unknown-production-build` fails by default.
- Public production build-info for the pre-task deployed SHA remains compatible
  with the stricter gate.

## Definition of Done

- Focused node test passes.
- Production build-info wait passes for the current deployed SHA.
- Repository guardrails pass.
- `git diff --check` passes or only reports known CRLF warnings.
- Source-of-truth state files are updated without rewriting historical
  checkpoint evidence.

## Forbidden

- Do not use Coolify credentials as Soar application credentials.
- Do not claim protected `/workers/ready` proof without valid app auth.
- Do not mutate LIVE exchange orders, positions, bots, or production data.
- Do not accept runtime GitHub fallback as release-gate proof by default.

## Result Report

- `scripts/waitForWebBuildInfo.mjs` now logs `metadataSource` and `buildId`,
  rejects runtime fallback deploy metadata by default, and rejects non-real
  production build ids.
- Added `scripts/waitForWebBuildInfo.test.mjs` with three scenarios:
  accepted build-time metadata, rejected `github-branch-runtime`, and rejected
  `unknown-production-build`.
- Verified the current production build-info response for
  `069aa36f4918cbf4ed062f50425288dff30a2b89` still passes the stricter gate
  because it has `metadataSource=github-branch` and build id
  `orQiE9zTo_TVTcAoXpzI6`.
- Validation passed:
  - `node --test scripts/waitForWebBuildInfo.test.mjs`
  - `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 069aa36f --timeout-seconds 30 --interval-seconds 5`
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - `pnpm run quality:guardrails`
  - `git diff --check` (CRLF warnings only)
