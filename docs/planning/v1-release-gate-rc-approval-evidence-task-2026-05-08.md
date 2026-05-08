# V1 Release Gate RC Approval Evidence Task (2026-05-08)

## Header
- ID: V1-RELEASE-GATE-RC-APPROVAL-EVIDENCE-2026-05-08
- Title: Require RC approval status in V1 release gate
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-RELEASE-GATE-BUILD-INFO-FRESHNESS-2026-05-08
- Priority: P0
- Iteration: 39
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The V1 release gate currently treats RC external gates, sign-off, and checklist
as passing when they are fresh, even if Gate 4 is still OPEN and the sign-off
record is `BLOCKED`. The final blocker pack requires approved Gate 4, so the
gate must enforce approval state, not only freshness.

## Goal
Require RC external gates, RC sign-off, and RC checklist artifacts to show
approved/closed status before final V1 `ready`.

## Success Signal
- User or operator problem: final release gate cannot pass with a fresh but
  blocked RC sign-off.
- Expected product or reliability outcome: final `ready` requires real Gate 4
  approval.
- How success will be observed: current dry-run reports RC artifacts as
  `failed`, not merely `fresh`.
- Post-launch learning needed: no

## Scope
- `scripts/runV1ReleaseGate.mjs`
- `scripts/runV1ReleaseGate.test.mjs`
- generated dry-run artifacts under `docs/operations`
- final blocker/state/context docs
- this task artifact

## Implementation Plan
1. Add required pass patterns for RC external gate status, sign-off record, and
   checklist.
2. Update tests to provide approved RC fixtures in happy paths and assert
   blocked RC fixtures fail.
3. Regenerate dry-run artifacts showing current RC blockers.
4. Validate release-gate tests, guardrails, docs parity, diff check, and smoke.

## Acceptance Criteria
- `v1-rc-external-gates-status.md` must show Gate 4 PASS.
- `v1-rc-signoff-record.md` must show `RC status: APPROVED`.
- `v1-release-candidate-checklist.md` must show `G4=PASS`.
- Current production dry-run reports RC artifacts failed while Gate 4 remains
  open/blocked.

## Definition of Done
- [x] Release gate enforces RC approval state.
- [x] Tests cover blocked and approved RC evidence.
- [x] Dry-run artifact shows current RC blockers.
- [x] Validation passes.

## Forbidden
- Writing fake approver names.
- Changing canonical RC artifacts to approved without real approval.
- Weakening live-import, restore, rollback, or build-info gates.
- Running destructive production actions.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1ReleaseGate.mjs` => PASS
  - `node --check scripts/runV1ReleaseGate.test.mjs` => PASS
  - `node --test scripts/runV1ReleaseGate.test.mjs` => PASS (`11/11`)
- Manual checks:
  - `pnpm run ops:release:v1:gate -- --environment prod --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 5cf5a4ce983e313060f78270f47ba026f33b676f --skip-local-quality --dry-run --artifact-stamp 2026-05-08Trc-approval-required-dry-run` => PASS dry-run, `readiness=not_ready`
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS
  - `git diff --check` => PASS
- Screenshots/logs: `docs/operations/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`
- High-risk checks: no fake approval, no protected credentials, no exchange writes, no DB writes, no live-money or destructive operations.

## Architecture Evidence
- Architecture source reviewed: final blocker pack, RC status/sign-off/checklist,
  release gate script.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this gate/docs commit if needed; no runtime change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: RC evidence freshness can mask blocked approval state.
- Gaps: final gate does not enforce Gate 4 approval content.
- Inconsistencies: final blocker pack and release gate differ.
- Architecture constraints: no fake approval, fail closed.

### 2. Select One Priority Task
- Selected task: enforce RC approval evidence in final gate.
- Priority rationale: final `ready` must require real release approval.
- Why other candidates were deferred: actual approval requires real names and
  authority from the operator/user.

### 3. Plan Implementation
- Files or surfaces to modify: release gate script/tests and release state.
- Logic: content pass-patterns for RC artifacts.
- Edge cases: current blocked artifacts must become `failed`.

### 4. Execute Implementation
- Implementation notes: added RC approval pass-patterns to the existing
  release-gate evidence-family model, added approved RC fixtures for happy
  paths, and added a blocked-RC regression test.

### 5. Verify and Test
- Validation performed: syntax checks, release-gate tests, dry-run report,
  guardrails, docs parity, public deploy smoke, and diff check.
- Result: PASS; dry-run remains `not_ready` because current production
  evidence is still blocked as expected.

### 6. Self-Review
- Simpler option considered: leave strict RC check separate; rejected because
  final release gate itself must enforce approval.
- Technical debt introduced: no
- Scalability assessment: extends existing evidence-family model.
- Refinements made: added family-specific failure reasons so RC blockers do
  not reuse live-import wording.

### 7. Update Documentation and Knowledge
- Docs updated: final blocker pack, state files, context files, planning queue,
  and dry-run report.
- Context updated: yes
- Learning journal updated: not applicable

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
- Task summary: final V1 release gate now fails closed on fresh but
  unapproved RC artifacts.
- Files changed: `scripts/runV1ReleaseGate.mjs`,
  `scripts/runV1ReleaseGate.test.mjs`, dry-run artifacts, final blocker/state
  docs, planning/context docs, and this task artifact.
- How tested: syntax checks, release-gate unit tests, production dry-run
  artifact generation, guardrails, docs parity, public smoke, and diff check.
- What is incomplete: real Gate 4 approval still requires named Engineering,
  Product, Operations, and RC owner inputs from an authorized operator/user.
- Next steps: collect protected `LIVEIMPORT-03`, restore drill, rollback proof,
  and real RC approval, then run the final non-dry-run release gate.
- Decisions made: do not synthesize approver names; keep current RC artifacts
  blocked and make the final gate enforce that truth.
