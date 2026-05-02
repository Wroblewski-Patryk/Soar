# Task

## Header
- ID: V1FINAL-01
- Title: Verify deployed DOGE runtime hardening and run final V1 production gates
- Task Type: release
- Current Stage: post-release
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1DOGE-02`, production deploy freshness
- Priority: P0

## Context
Production deployed `6a8ded9333eabced5e8461362e9e9237a9bf4e4d` on 2026-05-01,
which includes the DOGE close/reopen lifecycle hardening. This task executed
the planned post-deploy V1 gate sequence against production and classified the
remaining GO/NO-GO blockers.

## 2026-05-02 Supersession Note
This 2026-05-01 `NO-GO/BLOCKED` task is closed as superseded by
`V1CLOSEOUT-11`, which refreshed the missing production-only release evidence
and published final V1 status `GO` in
`docs/operations/v1-final-go-no-go-closure-2026-05-02.md`. Stage is deferred
to V2 by operator decision and is no longer a V1 blocker.

## Goal
Confirm the deployed production candidate contains the DOGE runtime hardening,
verify the active DOGE runtime read model no longer carries stale DCA across
same-symbol lifecycle boundaries, and regenerate the executable production
release evidence.

## Scope
- Production web build identity: `https://soar.luckysparrow.ch/api/build-info`
- Production API smoke and protected OPS checks:
  `https://api.soar.luckysparrow.ch`
- Runtime `Positions` payload for the active `LIVE` futures bot and `DOGEUSDT`
- RC status/checklist/sign-off artifacts
- Production rollback-proof and release-gate classification artifacts

## Implementation Plan
1. Verify deployed web build-info SHA.
2. Run production public and authenticated deploy smoke.
3. Run protected runtime freshness and rollback guard.
4. Inspect authenticated `DOGEUSDT` runtime `Positions` payload.
5. Regenerate rollback-proof evidence.
6. Refresh RC status/checklist/sign-off.
7. Run release-gate classification and record remaining blockers.

## Acceptance Criteria
- Production build-info reports `6a8ded93` or later.
- Production smoke passes.
- Runtime freshness is `PASS`.
- Rollback guard returns `shouldRollback=false`.
- Active `DOGEUSDT` open position does not show stale DCA from the previous
  closed lifecycle.
- Release-gate blockers are explicit and evidence-backed.

## Definition of Done
- [x] Production deploy freshness verified.
- [x] Public and authenticated production smoke passed.
- [x] Runtime freshness and rollback guard passed.
- [x] DOGE runtime read verification captured.
- [x] Rollback-proof artifact regenerated for 2026-05-01.
- [x] RC status/checklist/sign-off refreshed.
- [x] Superseded by `V1CLOSEOUT-11` production restore drill PASS evidence.
- [x] Superseded by `V1CLOSEOUT-11` final V1 production-only release gate.
- [x] Superseded by operator decision and `V1CLOSEOUT-11` Gate 4 approval.

## Validation Evidence
- Tests:
  - `GET https://soar.luckysparrow.ch/api/build-info` -> PASS,
    `gitSha=fbeae8f08926bc838141d53397fc142f52945356`, `gitRef=main`
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS on deployed `fbeae8f0`
  - `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-local-quality --skip-deploy-smoke --skip-runtime-freshness --skip-rollback-guard --artifact-stamp 2026-05-01T18-20-00-000Z` -> expected `not_ready`
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS
  - authenticated `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` -> PASS, including `/workers/health`
  - authenticated `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` -> PASS, `runningCount=4`
  - authenticated `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` -> PASS, `shouldRollback=false`, no alerts
  - `pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch` -> PASS
  - `pnpm run ops:rc:gates:refresh:summary:strict:prod` -> PASS
  - `pnpm run ops:db:restore-drill -- --profile prod` -> FAIL, missing production DB container configuration
  - `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-local-quality --skip-deploy-smoke --skip-runtime-freshness --skip-rollback-guard` -> expected `not_ready`
- Manual checks:
  - `GET https://soar.luckysparrow.ch/api/build-info` returned `gitSha=fbeae8f08926bc838141d53397fc142f52945356`.
  - `GET https://soar.luckysparrow.ch/api/build-info` returned `gitSha=6a8ded9333eabced5e8461362e9e9237a9bf4e4d`.
  - Authenticated `DOGEUSDT` runtime read for the active `LIVE` bot returned one open `SHORT` position opened at `2026-05-01T01:50:55.213Z` with `dcaCount=0`, `tradesCount=1`, and `strategyAutomationContextResolved=true`.
- Screenshots/logs:
  - `docs/operations/v1-release-gate-prod-2026-05-01T18-20-00-000Z.md`
  - `docs/operations/v1-rollback-proof-prod-2026-05-01T02-42-49-727Z.md`
  - `docs/operations/v1-release-gate-prod-2026-05-01T02-44-00-227Z.md`
  - `docs/operations/v1-restore-drill-prod-2026-05-01T02-43-39-008Z.md`
- High-risk checks:
  - No secret-bearing auth arguments were persisted in the rollback-proof
    command artifact.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/v1-final-test-structure-2026-05-01.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no, unless release owner wants to waive the
  remaining manual/stage/restore blockers.
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: high, production candidate verified after deploy
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: rollback guard passed and rollback-proof artifact regenerated
- Observability or alerting impact: runtime freshness PASS; no rollback-critical alerts
- Staged rollout or feature flag: not applicable

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update not required; existing secret-safe OPS artifact
  guardrail still applies.

## Result Report
- Task summary: executable production gates passed for deploy freshness, DOGE
  stale-DCA regression, runtime freshness, rollback guard, rollback proof, and
  RC status/checklist refresh. The originally blocked final V1 GO is now
  superseded by `V1CLOSEOUT-11`, which closed V1 production-only release as
  `GO`.
- Files changed: planning/context/operations evidence docs.
- How tested: commands listed in Validation Evidence.
- What is incomplete: nothing for current V1 production-only release status;
  this task remains as historical evidence of the 2026-05-01 blocker state.
- Next steps: use `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`
  as current release status source.
- Decisions made: `V1CLOSEOUT-11` supersedes this task's earlier
  `NO-GO/BLOCKED` classification.
