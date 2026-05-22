# Task

## Header
- ID: `V1-OPERATOR-UNBLOCK-PACKET-CHECK-COMMAND-2026-05-20`
- Title: Add machine-checkable validation for the current V1 operator unblock packet
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1-OPERATOR-UNBLOCK-PACKET-DD1A1FAF-2026-05-20`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-FUNC-021`
- Quality Scenario Rows: `QA-021`
- Risk Rows: `RISK-021`
- Iteration: AUD-19 protected release continuation
- Operation Mode: TESTER
- Mission ID: `V1-AUD19-PROTECTED-RELEASE-GATE-2026-05-20`
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the release-risk validation posture.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by preventing operator packet drift.

## Mission Block
- Mission objective: keep the blocked protected `AUD-19` operator handoff
  machine-checkable until approved protected inputs are available.
- Release objective advanced: final V1 deployment evidence reliability.
- Included slices: validation script, focused tests, package scripts, source
  sync.
- Explicit exclusions: no protected auth use, no production mutation, no LIVE
  order/cancel/close, no exchange-side mutation, no final readiness claim.
- Checkpoint cadence: one bounded tooling/evidence slice.
- Stop conditions: validator cannot prove the current packet has required
  evidence paths, protected input families, proof steps, boundaries, and
  acceptance rule.
- Handoff expectation: next operator run can first execute the packet check
  before using protected credentials.

## Context
The current V1 release gate is blocked by absent protected inputs. The
operator packet now contains the command order for the last mile, so it needs a
small regression lock to prevent losing critical release-gate requirements
while waiting for access.

## Goal
Add a reusable validator for the no-secret V1 operator unblock packet.

## Scope
- `scripts/checkOperatorUnblockPacket.mjs`
- `scripts/checkOperatorUnblockPacket.test.mjs`
- `package.json`
- state and planning references

## Success Signal
- User or operator problem: final release handoff can drift while waiting for
  protected inputs.
- Expected product or reliability outcome: the packet check fails if the
  handoff omits protected inputs, evidence paths, proof steps, safety
  boundaries, target SHA, or final acceptance rule.
- How success will be observed: test command and live packet check both pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
Reusable command plus tests:
`corepack pnpm run ops:operator-unblock:check` and
`corepack pnpm run ops:operator-unblock:check:test`.

## Constraints
- Use existing Node script validation pattern.
- Do not change runtime behavior.
- Do not add a release bypass.
- Do not store or request secret values.

## Implementation Plan
1. Implement validator with exported `validateOperatorUnblockPacket`.
2. Add focused Node tests for pass/fail cases.
3. Register package scripts.
4. Validate the real 2026-05-20 packet.
5. Sync source-of-truth state.

## Acceptance Criteria
- [x] Validator passes the current 2026-05-20 operator packet.
- [x] Validator fails SHA mismatch.
- [x] Validator fails missing evidence paths.
- [x] Validator fails missing protected input family fragments.
- [x] Validator fails missing acceptance rule fragments.

## Definition of Done
- [x] New command and test command exist in `package.json`.
- [x] Focused tests pass.
- [x] Current packet check passes.
- [x] Docs/state name the new validation command.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Runtime/deployment behavior changes.
- Production data mutation.
- LIVE order submit/cancel/close.
- Exchange-side mutation.
- Fabricated approval or bypassing protected evidence.

## Validation Evidence
- Tests:
  - `corepack pnpm run ops:operator-unblock:check:test` -> PASS (`5/5`)
  - `corepack pnpm run ops:operator-unblock:check -- --packet docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-20.json --expected-sha dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` -> PASS
  - `corepack pnpm run quality:guardrails` -> PASS
  - `git diff --check` -> PASS with line-ending warnings only
- Manual checks:
  - production build-info still reports `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`
  - protected input readiness still reports `0` matching protected input names
  - `Get-Process chrome-headless-shell` -> no matching process
  - `Get-NetTCPConnection -LocalPort 3000,3001,4000,5432,6379` -> no matching
    listener/connection
  - `docker compose ps --format json` -> no active services reported; Docker
    only emitted the existing obsolete `version` warning
- Screenshots/logs: not applicable.
- High-risk checks: no secrets requested or stored; no production mutation.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: `SOAR-OPERATIONS-001` note
- Requirements matrix updated: yes
- Requirement rows closed or changed: `REQ-FUNC-021` note
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: `QA-021` note
- Risk register updated: yes
- Risk rows closed or changed: `RISK-021` note
- Reality status: blocked

## Architecture Evidence
- Architecture source reviewed:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`,
  `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-20.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: rollback proof remains a protected operator step.
- Observability or alerting impact: Gate2/SLO remains a protected operator step.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: protected inputs absent, final gate cannot run to `ready`.
- Gaps: operator packet needed a machine-checkable drift guard.
- Inconsistencies: none in runtime; risk is handoff drift.
- Architecture constraints: protected evidence remains mandatory.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Missing or template-like files: none.
- Sources scanned: package scripts, protected-input validator, reusable audit
  validators, current operator packet.
- Rows created or corrected: this task and state references.
- Assumptions recorded: validating the handoff is safe without protected
  inputs.
- Blocking unknowns: credentials and approver identities.
- Why it was safe to continue: local script/test only.

### 2. Select One Priority Mission Objective
- Selected task: operator packet validation command.
- Priority rationale: it strengthens the only executable no-secret path toward
  final release.
- Why other candidates were deferred: protected release execution still needs
  approved inputs.

### 3. Plan Implementation
- Files or surfaces to modify: script, test, package scripts, state docs.
- Logic: validate JSON fields, paths, fragments, and acceptance semantics.
- Edge cases: fail on SHA mismatch, missing path, missing input, missing
  acceptance rule.

### 4. Execute Implementation
- Implementation notes: added a standalone Node validator following existing
  audit tooling patterns.

### 5. Verify and Test
- Validation performed: focused test pack and real packet check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave packet manual-only.
- Technical debt introduced: no.
- Scalability assessment: command can validate future dated packets with
  `--packet` and `--expected-sha`.
- Refinements made: validator exports pure function for tests.

### 7. Update Documentation and Knowledge
- Docs updated: task and state references.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to release-risk posture.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs and context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report

- Task summary: added a focused validator and tests for the current V1 operator
  unblock packet.
- Files changed: script, test, package scripts, task/state references.
- How tested: focused validator tests and live packet validation.
- What is incomplete: protected V1 release evidence remains blocked until
  approved inputs exist.
- Next steps: provide protected inputs, run the packet check, then execute the
  packet in order.
- Decisions made: none.
