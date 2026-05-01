# Task

## Header
- ID: V1COVER-03
- Title: Classify function ledger by V1 implementation readiness
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1COVER-02
- Priority: P0

## Context
The V1 function ledger now lists 79 top-level function rows. The operator needs
to know whether these functions are actually implemented, partially implemented,
missing, blocked, or only lacking production evidence, so the remaining V1 work
can be planned without guessing.

## Goal
Classify every ledger row into a V1 readiness bucket and publish the remaining
features, fixes, evidence tasks, and scope decisions needed for V1.

## Scope
- `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`
- `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Import the function coverage CSV and count local/production statuses.
2. Classify rows into `READY`, `IMPLEMENTED_NEEDS_EVIDENCE`,
   `IMPLEMENTED_NOT_VERIFIED`, `V1_BLOCKER`, and
   `REQUIRES_IMPLEMENTATION_REVIEW`.
3. Identify all non-ready `P0` rows.
4. Convert the findings into grouped V1 execution waves.
5. Update context and queue docs with the readiness interpretation.
6. Run repository guardrails.

## Acceptance Criteria
- Every ledger row is accounted for by one readiness bucket.
- The audit distinguishes implementation gaps from evidence gaps.
- The audit names concrete V1 follow-up waves.
- No missing implementation row is hidden.
- Repository guardrails pass.

## Definition of Done
- [x] Ledger imported and counted.
- [x] Readiness buckets computed.
- [x] P0 non-ready rows listed.
- [x] V1 blocker rows listed.
- [x] Recommended V1 execution plan published.
- [x] Context and planning docs updated.
- [x] Repository guardrails passed.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Treating `PARTIAL` or `NEEDS_PROD_SAMPLE` as V1-ready.
- Creating new feature implementations during this audit.
- Running live-money mutations as part of this classification task.
- Hiding scope decisions as implementation status.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` -> PASS
- Manual checks:
  - CSV row count: `79`.
  - Local status split: `PASS=74`, `COVERED_LOCAL=3`,
    `NOT_APPLICABLE=1`, `BLOCKED=1`.
  - Production status split: `PASS=17`, `PARTIAL=22`,
    `NEEDS_PROD_SAMPLE=9`, `NEEDS_PROD_UI_CHECK=12`,
    `NOT_VERIFIED=11`, `NOT_APPLICABLE=5`, `BLOCKED=2`, `FAIL=1`.
  - Readiness split: `READY=22`, `IMPLEMENTED_NEEDS_EVIDENCE=43`,
    `IMPLEMENTED_NOT_VERIFIED=11`, `V1_BLOCKER=3`,
    `REQUIRES_IMPLEMENTATION_REVIEW=0`.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - The audit does not classify live-money rows as V1-ready unless production
    is already `PASS` or explicitly `NOT_APPLICABLE`.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/system-modules.md`,
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable
- Observability or alerting impact: none
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
- [x] Docs or context were updated.
- [x] Learning journal update not required.

## Result Report
- Task summary: classified all 79 ledger rows into V1 readiness buckets and
  published a grouped execution plan for remaining V1 confidence work.
- Files changed: readiness audit, planning task, project state, task board, MVP
  queue.
- How tested: CSV status/count checks and repository guardrails.
- What is incomplete: execution of the follow-up waves is still required.
- Next steps: execute `V1GATE-A`, `V1MONEY-A`, `V1MANUAL-A`, `V1UX-A`, and
  `V1SCOPE-A` in that order.
- Decisions made: no broad missing implementation area was found in the current
  ledger; remaining V1 closure is mainly evidence, release blockers, and
  launch-scope decisions.
