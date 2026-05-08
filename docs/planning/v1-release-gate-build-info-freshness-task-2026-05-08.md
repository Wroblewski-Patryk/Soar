# V1 Release Gate Build-Info Freshness Task (2026-05-08)

## Header
- ID: V1-RELEASE-GATE-BUILD-INFO-FRESHNESS-2026-05-08
- Title: Require deployed SHA freshness in final V1 release gate
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-RELEASE-GATE-LIVEIMPORT-EVIDENCE-2026-05-08
- Priority: P0
- Iteration: 38
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final blocker pack requires a deployed build-info check before protected
readback, but `ops:release:v1:gate` itself does not currently enforce that the
web build-info SHA matches the promoted `HEAD`. A final non-dry-run gate should
not be able to approve a stale deployment.

## Goal
Add an expected deployed SHA check to the V1 release gate by reusing the
existing `ops:deploy:wait-web-build-info` command.

## Success Signal
- User or operator problem: final release gate catches stale production deploys.
- Expected product or reliability outcome: `ready` requires the deployed web
  build-info to match the promoted commit when `--expected-sha` is supplied.
- How success will be observed: release gate includes a build-info freshness
  step before deploy smoke.
- Post-launch learning needed: no

## Scope
- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1ReleaseGate.test.mjs`
- `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
- source-of-truth state/context docs
- this task artifact

## Implementation Plan
1. Add `--expected-sha` / `RELEASE_GATE_EXPECTED_SHA` parsing.
2. Add a build-info freshness step before deploy smoke when expected SHA is
   provided.
3. Include expected SHA in execution summary and reports.
4. Update tests and final blocker pack to pass `HEAD`.
5. Validate release-gate tests, guardrails, docs parity, diff check, dry-run,
   deploy wait, and public smoke.

## Acceptance Criteria
- `buildSteps` emits `ops:deploy:wait-web-build-info` before deploy smoke when
  `expectedSha` and `webBaseUrl` are supplied.
- Missing `webBaseUrl` with `expectedSha` is rejected.
- Final blocker pack final gate command passes `--expected-sha $expectedSha`.
- Existing auth env passthrough remains secret-safe.

## Definition of Done
- [x] Release gate supports expected SHA freshness.
- [x] Tests cover the new step.
- [x] Final blocker pack uses it.
- [x] Validation passes.

## Forbidden
- Creating a parallel deployment system.
- Using GitHub Actions for deploy.
- Printing secrets in command args.
- Weakening existing evidence checks.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1ReleaseGate.mjs` => PASS
  - `node --check scripts/runV1ReleaseGate.test.mjs` => PASS
  - `node --test scripts/runV1ReleaseGate.test.mjs` => PASS (`10/10`)
- Manual checks:
  - `node scripts/runV1ReleaseGate.mjs --environment prod --expected-sha abc123 --dry-run` exits non-zero with missing `--web-base-url`
  - `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 1baa13da02029d75c77aba7026936c41c1ee9963 --skip-local-quality --dry-run --artifact-stamp 2026-05-08Tbuild-info-required-dry-run` => PASS command, `readiness=not_ready`
- Screenshots/logs:
  - `docs/operations/v1-release-gate-prod-2026-05-08Tbuild-info-required-dry-run.md`
  - `docs/operations/_artifacts-v1-release-gate-prod-2026-05-08Tbuild-info-required-dry-run.json`
- High-risk checks:
  - dry-run only
  - no protected production credentials, exchange writes, DB writes,
    live-money actions, or destructive operations were used

## Architecture Evidence
- Architecture source reviewed: final blocker pack, active state, release gate
  script.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: release gate adds an optional build-info freshness step
- Smoke steps updated: final blocker pack command includes expected SHA
- Rollback note: revert this gate/docs commit if needed; no runtime behavior
  change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: final release gate does not directly enforce deployed SHA freshness.
- Gaps: build-info wait is only a manual pack step.
- Inconsistencies: final gate could be run without checking deployed HEAD.
- Architecture constraints: use accepted Coolify/manual deploy plus local
  build-info verification.

### 2. Select One Priority Task
- Selected task: add expected SHA freshness to release gate.
- Priority rationale: protects final approval from stale production deploys.
- Why other candidates were deferred: protected evidence execution still needs
  unavailable access.

### 3. Plan Implementation
- Files or surfaces to modify: release gate script/tests and final blocker
  docs/state.
- Logic: optional build-info step before deploy smoke.
- Edge cases: expected SHA requires web base URL.

### 4. Execute Implementation
- Implementation notes: added expected SHA parsing and reused
  `ops:deploy:wait-web-build-info` as the first release-gate runtime step when
  expected SHA is provided.

### 5. Verify and Test
- Validation performed: syntax checks, Node release-gate tests, missing
  web-base-url failure path, and production dry-run generation.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave as separate pack step; rejected because the
  final gate should enforce the final approval precondition itself.
- Technical debt introduced: no
- Scalability assessment: reuses existing wait script.
- Refinements made: made `--expected-sha` require `--web-base-url` to avoid a
  silent no-op freshness check.

### 7. Update Documentation and Knowledge
- Docs updated: final blocker pack, planning queue, task artifact.
- Context updated: next steps, system health, known issues, project state,
  task board.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: added deployed SHA freshness enforcement to the final V1
  release gate.
- Files changed: release gate script/tests, new dry-run artifacts, final
  blocker pack, active state/context docs, planning queue, and this task
  artifact.
- How tested: syntax checks, focused Node tests, missing web-base-url failure,
  and production dry-run.
- What is incomplete: final production `ready` still requires protected
  readback, restore, rollback, sign-off, and non-dry-run execution.
- Next steps: execute final blocker pack with production access and approver
  inputs.
- Decisions made: build-info freshness belongs inside the final gate when
  `--expected-sha` is supplied.
