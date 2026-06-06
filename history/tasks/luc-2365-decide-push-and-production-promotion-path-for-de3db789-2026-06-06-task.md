# LUC-2365 Decide Push And Production Promotion Path For de3db789

Date: 2026-06-06
Issue: [LUC-2365](/LUC/issues/LUC-2365)
Role: CTO / Ops decision
Candidate: `de3db789177cd497447343395d335fca6a84444c`
Stage: release
Status: blocked / no-go

## Context

[LUC-2361](/LUC/issues/LUC-2361) confirmed local `HEAD=de3db789`, but the
final no-secret release gate returned `NO-GO`: production Web build-info still
reports `a70d7881b69e605c537af5f81cbeb74dc81e9329`, repository guardrails fail,
RC Gate 2 remains `OPEN`, and protected runtime proof lacks approved inputs.

This wake payload scoped the heartbeat to [LUC-2365](/LUC/issues/LUC-2365).
Checkout was already claimed by the harness. The issue did not grant a push,
deploy, restart, rollback, protected-smoke, account, secret, exchange, or
live-trading permit.

## Goal

Decide whether `de3db789` may be pushed and/or promoted to production, and
record the required path before any source-control or production mutation.

## Scope

- Branch: `main`.
- Remote: `origin` (`https://github.com/Wroblewski-Patryk/Soar.git`).
- Local candidate: `de3db789`.
- Target environment for any future promotion: Soar production on Coolify.
- Decision only; no mutation.

## Implementation Plan

1. Confirm current branch, candidate SHA, remote relationship, and dirty state.
2. Reuse [LUC-2361](/LUC/issues/LUC-2361) final release-gate evidence.
3. Separate source-control push disposition from production promotion
   disposition.
4. Record blockers, required unblock order, rollback path, smoke plan, and
   residual risk.

## Acceptance Criteria

- Push disposition is explicit.
- Deploy disposition is explicit.
- Blockers name the owner lane and next action.
- No forbidden mutation occurs.

## Definition Of Done

This task is not `DONE`; it is correctly `blocked`. Per `DEFINITION_OF_DONE.md`,
candidate promotion cannot be marked complete while required guardrails,
protected proof, and production evidence are missing.

## Forbidden

- No push from a dirty worktree.
- No deploy, restart, rollback, env/database/team/account mutation, protected
  smoke, secret readback, exchange mutation, or live-trading action.
- No workaround bypass around failed guardrails or missing protected proof.

## Commands And Results

- `git rev-parse --short HEAD` -> `de3db789`.
- `git branch --show-current` -> `main`.
- `git status -sb` -> `main...origin/main [ahead 4]` with uncommitted
  release/state/evidence files.
- `git log --oneline origin/main..HEAD` ->
  - `de3db789 fix: stabilize runtime aggregate closure`
  - `0ef4b50e docs: close LUC-2340 source state`
  - `10f1cfce docs: close LUC-2312 source state`
  - `4d2a7d9a docs: record LUC-2290 Coolify access closure`
- `git merge-base --is-ancestor origin/main HEAD` -> PASS.
- `git diff --check` -> whitespace check passed with CRLF conversion warnings
  only.
- [LUC-2361](/LUC/issues/LUC-2361) release-gate evidence reused:
  - `pnpm run quality:guardrails` -> FAIL.
  - `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
  - `pnpm run ops:rc:gates:evidence:check` -> FAIL; Gate 2 `OPEN`.
  - `pnpm run ops:deploy:smoke ... --expected-sha de3db789 --no-workers` ->
    FAIL because production Web build-info reports
    `a70d7881b69e605c537af5f81cbeb74dc81e9329`.
  - `pnpm run ops:deploy:runtime-freshness ... --expected-sha de3db789` ->
    FAIL with HTTP `401` due missing approved protected auth.
  - `pnpm run ops:release:v1:preflight ... --expected-sha de3db789` ->
    BLOCKED.

## Resume Recheck - 2026-06-06

Wake reason: `issue_blockers_resolved`.
[LUC-2364](/LUC/issues/LUC-2364) was marked `done`, so CTO/Ops reran the
smallest relevant release-decision checks from the current checkout.

Fresh results:

- `git status -sb` -> `main...origin/main [ahead 4]` with a broad dirty
  release/guardrail/proof/source-of-truth set still present.
- `git rev-parse --short HEAD` -> `de3db789`.
- `pnpm run quality:guardrails` -> PASS.
- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha de3db789177cd497447343395d335fca6a84444c --no-workers`
  -> FAIL.
  - API `/health`: PASS `200`.
  - API `/ready`: PASS `200`.
  - Web `/`: PASS `200`.
  - Web `/api/build-info`: FAIL, observed
    `a70d7881b69e605c537af5f81cbeb74dc81e9329`, expected
    `de3db789177cd497447343395d335fca6a84444c`.
- `pnpm run ops:rc:gates:evidence:check -- --strict --require-production-gate2`
  -> FAIL.
  - Gate labels: `G1=PASS | G2=OPEN | G3=PASS | G4=PASS`.
  - Missing: Gate 2 status is not `PASS`.
- `git diff --check` -> PASS with LF/CRLF warnings only.

Follow-up created:

- [LUC-2374](/LUC/issues/LUC-2374): close dirty source state before any
  `de3db789` push decision.

## Decision

Push disposition: `blocked / not pushed`.

Reason: the worktree is dirty with uncommitted release/state/evidence updates,
and release policy forbids push from a dirty worktree without an explicit
emergency exception. Guardrails now pass, but push still requires clean
source-state closure and a coherent push packet.

Production promotion disposition: `blocked / no deploy`.

Reason: production promotion is not allowed while RC Gate 2 is open,
production build-info does not match the candidate, protected runtime freshness
is not verified, and no explicit Ops mutation permit exists for this decision
issue.

## Required Unblock Order

1. [LUC-2374](/LUC/issues/LUC-2374) commits or intentionally excludes the current dirty
   release/state/evidence packet so `git status --short` is clean before push.
2. [LUC-2366](/LUC/issues/LUC-2366) completes protected runtime, worker, and
   SLO proof with approved non-secret handling.
3. Ops creates an explicit production mutation permit naming source commit,
   target environment, migration risk, rollback path, smoke plan, and
   fail-closed limits.
4. Only after those conditions pass, push the approved commit range to
   `origin/main`, then promote through the permitted Coolify path.

## Future Promotion Packet

- Source commit: `de3db789177cd497447343395d335fca6a84444c` or a later
  coherent successor after guardrail/source closure.
- Branch/remote: `main` -> `origin/main`.
- Target environment: Soar production on Coolify.
- Migration risk: no migration observed in the current candidate packet, but
  must be reconfirmed from the final clean diff before promotion.
- Rollback path: rollback to last known production Web build-info SHA
  `a70d7881b69e605c537af5f81cbeb74dc81e9329` or a newer verified stable image
  selected by Ops from deployment history.
- Smoke plan:
  - public API `/health` and `/ready`;
  - public Web `/` and `/api/build-info` matching expected SHA;
  - worker readiness when permitted;
  - protected runtime aggregate freshness with approved auth;
  - RC external gates evidence check and release preflight.

## Result Report

`de3db789` must not be pushed or promoted from this heartbeat.

The release path is blocked until guardrails, clean source state, protected
runtime/worker/SLO proof, and an explicit Ops mutation permit all exist. No
push, deploy, restart, rollback, env/database/team/account mutation, protected
smoke, secret readback, exchange mutation, or live-trading action occurred.
