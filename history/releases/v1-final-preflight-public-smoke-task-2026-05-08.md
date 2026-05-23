# V1 Final Preflight Public Smoke Task (2026-05-08)

## Header
- ID: V1-FINAL-PREFLIGHT-PUBLIC-SMOKE-2026-05-08
- Title: Include public deploy smoke in final V1 preflight
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-FINAL-PREFLIGHT-JSON-REPORT-2026-05-08
- Priority: P0
- Iteration: 44
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`ops:release:v1:preflight` verifies deployed build-info and protected
prerequisites, but its `apiBaseUrl` is only reported in context. A safe public
smoke check is already part of deployment discipline and can be composed into
preflight without touching protected routes or live-money paths.

## Goal
Make the final V1 preflight verify public API/Web reachability via the existing
deploy smoke command before protected evidence collection.

## Scope
- `scripts/runV1FinalPreflight.mjs`
- `scripts/runV1FinalPreflight.test.mjs`
- final blocker/state/context/planning docs
- this task artifact

## Success Signal
- User or operator problem: preflight detects stale deploy identity and basic
  public API/Web reachability in one safe command.
- Expected product or reliability outcome: fewer partial final-evidence runs
  against unhealthy public targets.
- How success will be observed: preflight output/report includes public smoke
  state and blocks if public smoke fails.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement public smoke in preflight with a test skip option and validation.

## Constraints
- Use the existing `ops:deploy:smoke` command.
- Run with `--no-workers` to avoid protected/private worker checks.
- Do not call protected routes or create final release evidence.
- Keep `--skip-public-smoke` available for local unit tests or constrained
  environments.

## Implementation Plan
1. Add `--skip-public-smoke` and public smoke execution to preflight.
2. Include public smoke state in JSON reports and blockers.
3. Add focused test coverage for skipped public smoke report shape.
4. Update final blocker/state docs and validate.

## Acceptance Criteria
- Preflight runs public deploy smoke by default.
- Preflight JSON includes public smoke state.
- Preflight blocks on public smoke failure.
- Unit tests can skip public smoke without network calls.

## Definition of Done
- [x] Public smoke included in preflight.
- [x] JSON report includes public smoke.
- [x] Tests and docs updated.
- [x] Validation passes.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Protected worker checks in preflight.
- Authenticated route probing without operator credentials.
- Live-money, exchange-write, destructive DB, or rollback actions.
- Treating preflight as final release evidence.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1FinalPreflight.mjs; node --check scripts/runV1FinalPreflight.test.mjs` => PASS
  - `node --test scripts/runV1FinalPreflight.test.mjs` => PASS (`7/7`)
- Manual checks:
  - `pnpm run ops:release:v1:preflight -- --skip-build-info --skip-public-smoke --today 2026-05-08` => expected exit `1`, skip paths visible
  - `pnpm run ops:release:v1:preflight -- --timeout-seconds 30 --interval-seconds 5` => expected exit `1`, build-info PASS, public API/Web smoke PASS, protected blockers remain
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `git diff --check` => PASS
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS
- Screenshots/logs: preflight output shows public smoke PASS before protected
  blockers.
- High-risk checks: public smoke uses `--no-workers`; no protected routes,
  DB/Coolify, exchange, live-money, rollback, or destructive operations.

## Architecture Evidence
- Architecture source reviewed: final blocker pack, deploy smoke command,
  release-gate/preflight scripts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: preflight now includes public API/Web smoke.
- Smoke steps updated: yes, preflight composes existing smoke.
- Rollback note: revert this preflight composition commit if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: preflight reports API base URL but does not validate public API/Web
  reachability.
- Gaps: one-command operator preflight should include safe public smoke.
- Inconsistencies: final gate and deploy discipline already run smoke
  separately.
- Architecture constraints: use existing smoke command and avoid protected
  worker checks.

### 2. Select One Priority Task
- Selected task: include public deploy smoke in final V1 preflight.
- Priority rationale: improves final V1 readiness check without protected
  access.
- Why other candidates were deferred: real evidence collection still requires
  unavailable protected auth/access.

### 3. Plan Implementation
- Files or surfaces to modify: preflight script/test and release docs/state.
- Logic: run existing `ops:deploy:smoke --no-workers`, add blocker/report state.
- Edge cases: smoke can be skipped in local tests.

### 4. Execute Implementation
- Implementation notes: added `runPublicSmoke`, `--skip-public-smoke`, public
  smoke output, JSON report state, and focused skip-path test coverage.

### 5. Verify and Test
- Validation performed: syntax, focused tests, skip-path CLI check, full
  preflight with public smoke, guardrails, docs parity, diff check, and public
  deploy smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: keep smoke as a separate operator command;
  rejected because preflight already claims public target context and should
  fail early on public reachability issues.
- Technical debt introduced: no
- Scalability assessment: composes existing deploy smoke instead of duplicating
  HTTP checks.
- Refinements made: public smoke state is included in JSON output.

### 7. Update Documentation and Knowledge
- Docs updated: final blocker pack, state files, context files, planning queue,
  and this task artifact.
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
- Task summary: final V1 preflight now includes public API/Web smoke before
  protected blocker classification.
- Files changed: `scripts/runV1FinalPreflight.mjs`,
  `scripts/runV1FinalPreflight.test.mjs`, final blocker pack,
  state/context/planning docs, and this task artifact.
- How tested: syntax, focused tests, skip-path preflight, full preflight with
  public smoke, guardrails, docs parity, diff check, and public smoke.
- What is incomplete: protected V1 evidence still requires operator auth,
  production DB/Coolify access, and real Gate 4 approver inputs.
- Next steps: commit, push, wait for deploy, then continue protected V1
  evidence once operator inputs exist.
- Decisions made: preflight uses `ops:deploy:smoke --no-workers` to stay
  public/read-only.
