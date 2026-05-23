# V1 Final Preflight Remediation Hints Task (2026-05-08)

## Header
- ID: V1-FINAL-PREFLIGHT-REMEDIATION-HINTS-2026-05-08
- Title: Add no-secret remediation hints to final V1 preflight
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-FINAL-PREFLIGHT-PUBLIC-SMOKE-2026-05-08
- Priority: P0
- Iteration: 45
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final V1 preflight now verifies deploy freshness, public smoke, protected
prerequisite groups, and release evidence blockers. The output still requires
the operator or Web visualization layer to map blocker keys back to commands
and required inputs.

## Goal
Attach no-secret remediation hints to preflight blockers so the operator/Web
status view can show the exact safe next action for each blocker.

## Scope
- `scripts/runV1FinalPreflight.mjs`
- `scripts/runV1FinalPreflight.test.mjs`
- final blocker/state/context/planning docs
- this task artifact

## Success Signal
- User or operator problem: blocker keys become directly actionable without
  reading multiple runbooks.
- Expected product or reliability outcome: final V1 handoff remains fail-closed
  while becoming easier to execute correctly.
- How success will be observed: JSON/CLI report includes no-secret actions for
  `LIVEIMPORT-03`, rollback, restore, and RC approval blockers.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement remediation hints, tests, docs, and validation.

## Constraints
- Hints must not contain secret values.
- Hints must not add new auth, approval, or bypass paths.
- Hints must point to existing approved commands only.
- Preflight remains non-evidence and fail-closed.

## Implementation Plan
1. Add a static blocker-to-remediation map for existing blocker keys.
2. Include remediation hints in JSON output and print concise CLI next actions.
3. Add focused tests for hint coverage and no-secret command placeholders.
4. Update docs/state and validate.

## Acceptance Criteria
- Known blocker keys produce remediation entries.
- RC approval blockers point to the existing sign-off command and required
  approver fields.
- Live-import/rollback/restore blockers point to existing commands/env names.
- Tests prove the report contains remediation hints without secret values.

## Definition of Done
- [x] Remediation hints implemented.
- [x] Tests cover hint output.
- [x] Docs/context updated.
- [x] Validation passes.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Fake approvals.
- Secret values in output.
- New production auth paths.
- Treating remediation hints as release evidence.

## Validation Evidence
- Tests:
  - `node --check scripts/runV1FinalPreflight.mjs; node --check scripts/runV1FinalPreflight.test.mjs` => PASS
  - `node --test scripts/runV1FinalPreflight.test.mjs` => PASS (`8/8`)
- Manual checks:
  - `pnpm run ops:release:v1:preflight -- --timeout-seconds 30 --interval-seconds 5` => expected exit `1`, build-info PASS, public smoke PASS, next actions printed
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `git diff --check` => PASS
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS
- Screenshots/logs: preflight output includes `next actions` for known
  blockers.
- High-risk checks: next actions contain placeholders/env names only, not
  secret values; no protected evidence generated.

## Architecture Evidence
- Architecture source reviewed: final blocker execution pack, preflight script,
  release-gate evidence classifier.
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
- Rollback note: revert this preflight hints commit if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: blocker keys are accurate but not self-remediating.
- Gaps: Web visualization would otherwise need to duplicate blocker-to-command
  mapping.
- Inconsistencies: none found.
- Architecture constraints: final blocker pack remains source of truth for
  actual evidence commands.

### 2. Select One Priority Task
- Selected task: no-secret preflight remediation hints.
- Priority rationale: makes the remaining protected V1 path actionable without
  weakening gates.
- Why other candidates were deferred: real evidence collection still requires
  protected inputs absent from this shell.

### 3. Plan Implementation
- Files or surfaces to modify: preflight script/test and state docs.
- Logic: map existing blocker IDs to title, action, command, and required
  inputs.
- Edge cases: unknown blockers still appear without remediation.

### 4. Execute Implementation
- Implementation notes: added a blocker remediation catalog,
  `buildRemediationHints`, JSON report remediation entries, and CLI next-action
  output for blocked preflight runs.

### 5. Verify and Test
- Validation performed: syntax, focused tests, full no-auth preflight,
  repository guardrails, docs parity, diff whitespace check, and public deploy
  smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave remediation only in docs; rejected because
  the JSON report is intended for Web/operator visualization.
- Technical debt introduced: no
- Scalability assessment: centralizes blocker-to-action mapping next to the
  preflight that emits blocker IDs.
- Refinements made: fixed the no-secret test to allow env names while still
  rejecting secret values.

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
- Task summary: added no-secret next-action hints to final V1 preflight.
- Files changed: `scripts/runV1FinalPreflight.mjs`,
  `scripts/runV1FinalPreflight.test.mjs`, final blocker pack,
  state/context/planning docs, and this task artifact.
- How tested: syntax, focused tests, full no-auth preflight, repository
  guardrails, docs parity, diff whitespace check, and public deploy smoke.
- What is incomplete: protected V1 evidence still requires operator auth,
  production DB/Coolify access, and real Gate 4 approver inputs.
- Next steps: commit, push, wait for deploy, and rerun public smoke against the
  deployed commit.
- Decisions made: remediation hints point to existing approved commands only
  and do not replace final release evidence.
