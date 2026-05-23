# Task

## Header
- ID: V1MONEY-02
- Title: Capture paper-safe close evidence for TP SL TTP TSL and DCA-first guards
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: MARKETDATA-FUT-01
- Priority: P0
- Iteration: 52
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`V1MONEY-01` defined the local/paper-safe money scenario matrix. The next safe
slice is to capture fresh close-path evidence for TP, SL, TTP, TSL, DCA-first,
and DCA-exhausted guards without running live-money mutations.

## Goal
Record a focused paper-safe validation packet for V1 close behavior and keep
the remaining production/operator proof gaps explicit.

## Scope
- Focused API tests for runtime position automation, lifecycle close parity,
  paper lifecycle, and dynamic stop operator truth.
- Operations evidence artifact.
- Source-of-truth planning/context updates.

## Success Signal
- User or operator problem: V1 close rows need confidence before any live
  operator sample.
- Expected product or reliability outcome: local/paper-safe close behavior is
  green and next production/paper sample steps are precise.
- How success will be observed: focused close pack passes and evidence maps
  each V1 row to remaining proof.
- Post-launch learning needed: no

## Deliverable For This Stage
Verification-stage close evidence artifact and source-of-truth sync.

## Constraints
- Do not run live-money mutations.
- Do not mark production-only rows complete from local tests.
- Do not change runtime behavior in this evidence slice.
- Do not hide remaining operator/prod requirements.

## Acceptance Criteria
- Focused paper-safe close pack passes.
- Evidence maps each close-related V1 row to covered and remaining proof.
- Remaining live/paper/prod proof gaps stay explicit.
- Canonical docs/context are updated.

## Definition of Done
- [x] Focused close pack passes.
- [x] Operations evidence artifact exists.
- [x] Remaining production/operator gaps are documented.
- [x] Source-of-truth docs/context are updated.
- [x] Repository guardrails pass.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/lifecycleCloseParity.golden.test.ts src/modules/engine/paperLifecycle.service.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` PASS (`45/45`).
  - `pnpm run quality:guardrails` PASS.
  - `git diff --check` PASS.
- Manual checks:
  - Reviewed close-related V1MONEY rows against focused tests.
- Screenshots/logs:
  - `history/evidence/v1money-paper-safe-close-evidence-2026-05-07.md`
- High-risk checks:
  - No secrets, auth tokens, live orders, deploys, restore actions, or
    production database mutations were used.

## Architecture Evidence
- Architecture source reviewed:
  - `history/audits/v1money-local-paper-safe-scenario-matrix-2026-05-07.md`
  - `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no runtime change.
- Observability or alerting impact: no new telemetry; existing telemetry paths
  verified by tests.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: close-related V1 rows still needed a fresh paper-safe evidence packet.
- Gaps: production/paper samples with redacted payloads remain outside this
  local test slice.
- Inconsistencies: none found.
- Architecture constraints: live close evidence requires explicit operator
  intent; local tests must not be overstated.

### 2. Select One Priority Task
- Selected task: V1MONEY-02 paper-safe close evidence.
- Priority rationale: it directly supports the highest-risk money-close rows
  without requiring live exposure.
- Why other candidates were deferred: authenticated production readbacks,
  restore drill, and stage restoration require external operator or infra
  access.

### 3. Plan Implementation
- Files or surfaces to modify:
  - this task evidence
  - `history/evidence/v1money-paper-safe-close-evidence-2026-05-07.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Logic: run focused close pack, then map evidence to V1 rows.
- Edge cases: keep live/prod sample rows open.

### 4. Execute Implementation
- Implementation notes: docs/evidence only; no runtime code changed.

### 5. Verify and Test
- Validation performed: focused close pack, guardrails, and diff check.
- Result: selected checks passed.

### 6. Self-Review
- Simpler option considered: only append the test command to the matrix.
  Rejected because row-by-row evidence mapping is needed for V1 continuation.
- Technical debt introduced: no
- Scalability assessment: gives the operator a repeatable close-proof route.
- Refinements made: production-only rows remain open.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `history/evidence/v1money-paper-safe-close-evidence-2026-05-07.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Learning journal updated: not applicable.

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
- Task summary: recorded fresh paper-safe close evidence for close-related V1
  money rows.
- Files changed: planning/context/operations docs only.
- How tested: focused API close pack (`45/45`), guardrails, and diff check.
- What is incomplete: production or paper-sample payload evidence for TP, SL,
  TSL/TTP, DCA-first, and live-close rows.
- Next steps: execute paper-safe close samples or authenticated read-only
  production event capture, then update the V1 coverage matrix.
