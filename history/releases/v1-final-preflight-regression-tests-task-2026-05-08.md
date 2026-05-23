# V1 Final Preflight Regression Tests Task (2026-05-08)

## Header
- ID: V1-FINAL-PREFLIGHT-REGRESSION-TESTS-2026-05-08
- Title: Lock final V1 preflight prerequisite checks
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-FINAL-PREFLIGHT-COMMAND-2026-05-08
- Priority: P0
- Iteration: 42
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final V1 preflight command is now the safe first operator step before
protected release evidence collection. Its prerequisite classification must
remain fail-closed and must not silently accept incomplete auth or DB input.

## Goal
Add automated regression coverage for `ops:release:v1:preflight` prerequisite
classification and keep the CLI behavior unchanged.

## Scope
- `scripts/runV1FinalPreflight.mjs`
- `scripts/runV1FinalPreflight.test.mjs`
- state/context/planning docs
- this task artifact

## Success Signal
- User or operator problem: preflight cannot regress into accepting incomplete
  auth/DB inputs.
- Expected product or reliability outcome: final V1 evidence collection remains
  fail-closed before protected access is available.
- How success will be observed: focused preflight tests pass and no-auth
  preflight still exits `1` without creating protected artifacts.
- Post-launch learning needed: no

## Deliverable For This Stage
Regression tests and documentation/state sync.

## Constraints
- Do not print or inspect secret values.
- Do not create production evidence artifacts.
- Do not change accepted env names or final release-gate behavior.
- Keep the CLI operator output compatible.

## Implementation Plan
1. Export small prerequisite-classification helpers from the preflight script
   while preserving entrypoint behavior.
2. Add focused Node tests for missing envs, token/email-password alternatives,
   DB env families, optional OPS layers, and skipped build-info behavior.
3. Run syntax, tests, no-auth CLI preflight, guardrails, docs parity, diff
   check, and public smoke.
4. Sync state/context/planning docs.

## Acceptance Criteria
- Missing production auth/DB envs evaluate as blocked.
- Token and email/password alternatives are accepted only when complete.
- Both production DB env families are accepted only when complete.
- Optional OPS layer checks stay separate from required blockers.
- CLI no-auth preflight still blocks and creates no `LIVEIMPORT-03` artifact.

## Definition of Done
- [x] Preflight prerequisite tests exist.
- [x] CLI behavior remains fail-closed.
- [x] Validation passes.
- [x] Docs/context reflect the regression lock.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Fake protected evidence.
- New auth mechanisms.
- Secret value logging.
- Live-money, exchange-write, destructive DB, or rollback actions.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1FinalPreflight.mjs; node --check scripts/runV1FinalPreflight.test.mjs` => PASS
  - `node --test scripts/runV1FinalPreflight.test.mjs` => PASS (`5/5`)
- Manual checks:
  - `pnpm run ops:release:v1:preflight -- --help` => PASS
  - `pnpm run ops:release:v1:preflight -- --timeout-seconds 30 --interval-seconds 5` => expected exit `1`, build-info PASS, no protected artifact created
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `git diff --check` => PASS
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS
- Screenshots/logs: no-auth preflight output shows missing env names and
  current evidence blockers.
- High-risk checks: no secret values printed; no protected evidence artifact
  created.

## Architecture Evidence
- Architecture source reviewed: final blocker execution pack, release gate,
  deployment and production hardening contracts.
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
- Rollback note: revert this test/helper export commit if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: preflight command had manual validation but no automated regression
  lock.
- Gaps: env prerequisite alternatives could drift silently.
- Inconsistencies: none found.
- Architecture constraints: preflight must remain read-only and fail-closed.

### 2. Select One Priority Task
- Selected task: add preflight regression tests.
- Priority rationale: preflight is now the first operator step for final V1
  evidence.
- Why other candidates were deferred: real V1 evidence still needs protected
  access not present in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: preflight script/test and state docs.
- Logic: export helper classification without changing CLI behavior.
- Edge cases: partial email/password and partial DB env sets must stay blocked.

### 4. Execute Implementation
- Implementation notes: exported `evaluatePrerequisiteGroups` and
  `runBuildInfoWait`; added focused Node tests.

### 5. Verify and Test
- Validation performed: syntax, focused tests, help, no-auth fail-closed
  preflight, guardrails, docs parity, diff check, and public deploy smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: keep manual validation only; rejected because this
  is a release-critical fail-closed command.
- Technical debt introduced: no
- Scalability assessment: tests cover the policy without invoking protected
  network paths.
- Refinements made: entrypoint guard added so tests can import the module.

### 7. Update Documentation and Knowledge
- Docs updated: state/context/planning docs.
- Context updated: yes
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
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
- Task summary: added automated regression coverage for final V1 preflight
  prerequisite checks.
- Files changed: `scripts/runV1FinalPreflight.mjs`,
  `scripts/runV1FinalPreflight.test.mjs`, state/context/planning docs, and
  this task artifact.
- How tested: syntax checks, focused tests, no-auth preflight, guardrails,
  docs parity, diff check, and public smoke.
- What is incomplete: protected V1 evidence still requires operator access.
- Next steps: with protected access, run preflight then final blocker pack.
- Decisions made: test helper exports are allowed because CLI behavior is
  preserved and entrypoint execution is guarded.
