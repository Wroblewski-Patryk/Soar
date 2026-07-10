# LUC-172 Protected Authenticated Browser Proof Packet

## Context

[LUC-172](/LUC/issues/LUC-172) asks QA to prepare the protected authenticated
browser proof packet for Dashboard runtime, Bots runtime monitoring, Manual
Orders, Positions/Orders readback, and Backtests/Reports confidence.

The 2026-07-10 wake comment selected an autonomous local repair/source-control
lane and explicitly forbade push, deploy, production restart, protected smoke,
live account mutation, and secret disclosure until protected gate evidence
exists.

## Goal

Produce a durable route/action checklist with auth/session preconditions,
desktop/mobile coverage expectations, required evidence, stop conditions,
validation results, regression risk, and source-control disposition.

## Constraints

- No raw secrets, tokens, cookies, credentials, API keys, payment data, or
  exchange credentials in repo files, logs, comments, or artifacts.
- No push, deploy, restart, rollback, production protected smoke, protected
  account mutation, or LIVE trading action in this heartbeat.
- Existing production auth evidence may be referenced but not reclassified as a
  fresh protected LUC-172 run.

## Stage

- Current stage: `verification`
- Output expected: prepared proof packet plus local helper validation evidence.

## Implementation Plan

1. Acknowledge the wake comment and keep the heartbeat inside local
   repair/source-control boundaries.
2. Inspect the current issue context, worktree state, local commits, and
   existing protected smoke helper/evidence files.
3. Validate the proof helpers without production access.
4. Record the LUC-172 proof packet and update project source-of-truth files.
5. Commit the docs/evidence/context-only closure if validation passes.

## Acceptance Criteria

- Route/action checklist exists for the affected runtime/trading top flows.
- Auth/session preconditions and stop conditions are explicit.
- Validation commands and outcomes are recorded.
- Regression risk and follow-up gap are recorded.
- Source-control disposition is explicit.

## Definition Of Done

- `history/evidence/luc-172-protected-authenticated-browser-proof-packet-2026-07-10.md`
  exists.
- Project/task state names the LUC-172 closure path.
- Relevant validation has run.
- Dirty docs/history/context set is committed locally or the blocker is named.

## Validation

- `git diff --check`
  - PASS, no whitespace errors.
- `node --test scripts/runProdAuthSessionBrowserProof.test.mjs scripts/runProdFixtureActionProof.test.mjs`
  - PASS, `12/12` tests.
- `corepack pnpm exec vitest run scripts/runProdAuthSessionBrowserProof.test.mjs scripts/runProdFixtureActionProof.test.mjs --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
  - FAIL due to stale copied tests under `.paperclip/worktrees`, not the current
    checkout helper tests.

## Forbidden

- Push.
- Deploy.
- Production restart.
- Protected smoke/live account mutation.
- Secret/cookie/token value capture.
- Subscriptions/API-key/trading setting mutation.
- LIVE order, LIVE cancel, or LIVE close.

## Result Report

Prepared the protected browser proof packet and verified the local helper
contracts with Node's file-level runner. No production protected proof was run.
No runtime code changed. The remaining operational gate is an approved
protected-session run using the existing helper scripts and redacted artifacts.
