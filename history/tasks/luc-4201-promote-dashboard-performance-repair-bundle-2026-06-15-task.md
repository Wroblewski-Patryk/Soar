# LUC-4201 Promote Dashboard Performance Repair Bundle

## Header

- ID: LUC-4201
- Title: Promote dashboard performance repair bundle and verify deploy provenance
- Task Type: release
- Current Stage: verification
- Status: PARTIALLY_COMPLETE_LOCAL_COMMIT_READY
- Owner: Deployment and Reliability Engineer
- Depends on: LUC-3839, LUC-3840, LUC-4174
- Priority: P0
- Module Confidence Rows: `web-dashboard-home`, `api-bots` runtime aggregate, `SOAR-API-BOT-RUNTIME-AGGREGATE`
- Mission ID: LUC-4201-PROMOTE-DASHBOARD-PERFORMANCE-REPAIR-BUNDLE-2026-06-15

## Context

[LUC-3841](/LUC/issues/LUC-3841) could not run the protected dashboard timing
proof because production still served committed SHA
`9f61eb9781c323f052f95cae7cf0c1c3c71901c7` while the
[LUC-3839](/LUC/issues/LUC-3839) backend aggregate bound,
[LUC-3840](/LUC/issues/LUC-3840) frontend fan-out reduction, and
[LUC-4174](/LUC/issues/LUC-4174) local Vitest startup repair remained
uncommitted in the shared [LUC-3832](/LUC/issues/LUC-3832) execution
workspace.

## Goal

Classify and close the local source-control gap for the dashboard performance
repair bundle, then only push/deploy when release gates clearly authorize the
production mutation path.

## Scope

- Backend aggregate runtime bounds and regression proof.
- Frontend Dashboard Home selected-bot aggregate fan-out reduction and
  regression proof.
- Web Vitest/Vite startup repair required to run the focused regression.
- Runtime config ledger and incident evidence/state records.

Explicitly excluded: secret readback, raw token/cookie logging, database/Redis
mutation, exchange action, order, position, payment/subscription,
live-trading action, production restart, and any production deploy path without
gate evidence.

## Implementation Plan

1. Inspect the shared execution workspace and classify dirty state.
2. Re-run the smallest sufficient local checks for the repair bundle.
3. Commit the coherent validated bundle locally with no unrelated files.
4. Verify whether push/deploy gates authorize production promotion from this
   issue branch or require a separate owner action.
5. Record provenance status and leave [LUC-3841](/LUC/issues/LUC-3841) with a
   concrete unblock path.

## Acceptance Criteria

- Dirty state is classified before source-control operation.
- Focused backend and frontend repair proofs pass.
- Source commit is created for the coherent repair bundle.
- Push/deploy status and production provenance status are recorded.
- Rollback note is recorded.

## Validation Evidence

- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts --run`
  (`1` file / `2` tests; Vite CJS Node API deprecation warning only).
- PASS: `pnpm --filter web exec vitest src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx --run`
  (`1` file / `5` tests).
- PASS: `pnpm --filter web exec tsc --noEmit --pretty false --project tsconfig.json`.
- PASS: focused `git diff --check` for touched API/Web/package/config/ledger
  files with CRLF warnings only.

## Deployment / Ops Evidence

- Source-control status before this task: dirty worktree on branch
  `LUC-3832-soar-production-performance-diagnose-slow-authenticated-dashboard-and-server-health`,
  based on `origin/main` at
  `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`.
- Production provenance before promotion: Web `/api/build-info` reported
  `gitSha=9f61eb9781c323f052f95cae7cf0c1c3c71901c7` and
  `metadataSource=env-runtime`, so production could not contain the local
  repair diff.
- Push/deploy gate: this worktree is not `main`; production mutation requires
  an explicit release path decision for branch push, main fast-forward/merge,
  or Coolify deploy trigger before protected timing proof can resume.
- Rollback note: revert the dashboard repair source commit, or use the
  existing runtime aggregate env overrides to raise/lower timeout and session
  caps if production proof shows unacceptable aggregate truncation.

## Result Report

Status at task-packet creation:
`LOCAL_VALIDATION_PASSED / LOCAL_COMMIT_READY / PRODUCTION_PROMOTION_GATE_PENDING`.

The source commit SHA, push/deploy disposition, and production build-info
readback are recorded in the [LUC-4201](/LUC/issues/LUC-4201) final Paperclip
comment after the commit operation.

## Review Checklist

- [x] Current stage declared and respected.
- [x] Existing deploy provenance/build-info mechanism reused.
- [x] No workaround path introduced.
- [x] No logic duplication introduced.
- [x] No secret/account value captured.
- [x] Focused local validation passed.
- [x] Push/deploy gate evaluated fail-closed.
