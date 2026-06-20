# Task

## Header
- ID: LUC-4912
- Title: Resolve current Web build-info env-runtime provenance gate mismatch
- Task Type: DRE verification and ops contract clarification
- Current Stage: verification
- Status: DONE
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Parent: [LUC-2880](/LUC/issues/LUC-2880)
- Priority: critical
- Mission ID: LUC-4912-WEB-BUILD-INFO-ENV-RUNTIME-PROVENANCE-2026-06-20
- Mission Status: VERIFIED_NO_CODE_CHANGE

## Context

[LUC-4912](/LUC/issues/LUC-4912) followed [LUC-2880](/LUC/issues/LUC-2880)
after the stale redeploy confirmation expired. Current production Web now
reports `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`, matching
`origin/main`, but `/api/build-info` reports `metadataSource=env-runtime`.
The deploy wait gate still fails closed because `env-runtime` is not accepted
release-grade provenance.

## Goal

Decide whether `metadataSource=env-runtime` is release-grade Web build
provenance, verify the deploy gate behavior, and record the deploy/source-control
implication before any fresh `soar-web` redeploy approval.

## Constraints

- No production deploy, restart, rollback, env edit, secret readback, account
  mutation, database/Redis mutation, or live-trading action.
- Do not weaken the provenance gate unless `env-runtime` is intended to be
  release-grade.
- Respect existing dirty/untracked state in the shared workspace.

## Definition Of Done

- [x] Build-info route, metadata writer, wait gate, Dockerfile, and ops docs
  inspected.
- [x] Current public production build-info readback captured without secrets.
- [x] Current wait gate behavior verified.
- [x] Decision recorded: `env-runtime` is diagnostic only, not release-grade
  provenance.
- [x] Required deploy implication recorded for the next selected Web commit.
- [x] Ops docs clarified so `env-runtime` is explicitly listed as a failing
  provenance source.

## Verification Evidence

- Public readback:
  `https://soar.luckysparrow.ch/api/build-info` returned
  `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`, `gitRef=main`,
  `metadataSource=env-runtime`, `buildId=Urnq8xtZUh932c0e3vKGl`,
  `metadataGeneratedAt=2026-06-15T21:00:54.489Z`, checked at
  `2026-06-20T06:56:21.980Z`.
- Gate reproduction:
  `node scripts/waitForWebBuildInfo.mjs --build-info-url https://soar.luckysparrow.ch/api/build-info --expected-sha 42177530 --timeout-seconds 1 --interval-seconds 1 --request-timeout-ms 10000`
  failed closed with `unaccepted metadataSource=env-runtime`.
- Focused local proof:
  `node --test scripts/waitForWebBuildInfo.test.mjs scripts/writeWebBuildMetadata.test.mjs scripts/runWebNextProductionCommand.test.mjs`
  passed (`17/17`).

## Decision

`metadataSource=env-runtime` is not release-grade Web image/source provenance.
It means the route recovered commit/ref from runtime environment fallback rather
than from the Web build metadata file. Keep `scripts/waitForWebBuildInfo.mjs`
strict: accepted deploy metadata sources remain `env`, `git`, and `git-files`.

## Source-Control And Deploy Implication

- Current production matches `origin/main`
  `42177530f2a2ddc22832133b545bccab6ab404eb`, not local dirty/ahead `HEAD`
  `5478f764b2513494644b2c9a74b6fb82c5cc5e6c`.
- Local source state at verification time was `origin/main...HEAD = 1 behind /
  3 ahead`, with pre-existing dirty/untracked docs/evidence/generated files.
- No new `soar-web` deploy approval should target dirty local `HEAD`.
- The next approved Web deploy must select a reconciled commit and ensure the
  build stage emits `.build-meta/BUILD_META.json` with `metadataSource=env`,
  `git`, or `git-files`; preferred production path is `SOURCE_COMMIT=<selected
  full SHA>` plus `SOURCE_BRANCH=main` / `COOLIFY_BRANCH=main`.

## Files Changed

- `docs/operations/deployment-readiness-gates.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `history/tasks/luc-4912-web-build-info-env-runtime-provenance-gate-mismatch-2026-06-20-task.md`
- `.agents/state/active-mission.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/next-steps.md`
- `.agents/state/system-health.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

## Result Report

Status: `DONE / VERIFIED_NO_CODE_CHANGE / DEPLOY_APPROVAL_STILL_REQUIRED`.

No runtime code change was needed because the gate behavior is already correct.
The current production app is public-smoke healthy and source-fresh relative to
`origin/main`, but its Web build-info provenance remains diagnostic-only while
it reports `env-runtime`. A fresh protected redeploy approval is still needed
only after source-control reconciliation selects the target commit, currently
expected to be `42177530f2a2ddc22832133b545bccab6ab404eb` or a later approved
main commit.

No deploy, push, restart, rollback, env edit, secret/account readback,
database/Redis mutation, protected account mutation, exchange action, order,
position, payment/subscription mutation, or live-trading action occurred.
