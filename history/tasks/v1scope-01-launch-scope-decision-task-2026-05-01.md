# Task

## Header
- ID: V1SCOPE-01
- Title: Classify lower-priority not-verified surfaces into launch scope, post-V1, or waived-for-V1
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: V1COVER-03
- Priority: P1
- Iteration: V1 scope-decision pass 1
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The V1 function readiness audit proved that the repository does not have a
broad missing-implementation gap. The remaining ambiguity is mostly around
lower-priority rows marked `NOT_VERIFIED`, where the repo already contains
working implementation but the launch scope is not explicit enough. That
ambiguity creates false V1 pressure and makes the queue look broader than the
actual replacement gate.

## Goal
Decide which lower-priority implemented surfaces are:
- still in current V1 launch scope and need verification,
- explicitly post-V1, or
- allowed to remain unverified for V1 because they are convenience or
  incident-only surfaces.

## Success Signal
- User or operator problem:
  - backlog and readiness docs overstate remaining V1 work by mixing launch
    blockers with post-V1 or non-blocking surfaces.
- Expected product or reliability outcome:
  - the queue becomes more truthful, and future iterations focus only on real
    V1 blockers or explicit post-V1 work.
- How success will be observed:
  - the readiness audit, planning queue, and project context all carry the
    same scope decision set.
- Post-launch learning needed: no

## Deliverable For This Stage
One explicit launch-scope decision packet plus synchronized planning/product
context for the affected `NOT_VERIFIED` rows.

## Scope
- `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
- `docs/product/product.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md` if writable in the current environment
- `.codex/context/PROJECT_STATE.md` if writable in the current environment

Affected rows:
- `REPORTS-CROSSMODE-001`
- `REPORTS-PNL-001`
- `STRAT-IO-001`
- `SUBS-ENTITLEMENTS-001`
- `ADMIN-USERS-001`
- `ADMIN-SUBS-001`
- `BOTS-ASSISTANT-001`
- `BOTS-ASSISTANT-002`
- `PROFILE-SUBS-001`
- `UPLOAD-AVATAR-001`
- `POSITIONS-REPAIR-001`

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within documentation/planning scope only
- do not silently change product or architecture behavior

## Implementation Plan
1. Re-read current product and architecture scope statements for admin,
   billing, assistant, entitlement, reporting, strategy import/export,
   profile media, and repair tooling.
2. Classify each affected row as `IN_V1`, `POST_V1`, or `WAIVED_FOR_V1`.
3. Sync the decision into the readiness audit and active planning/context docs.
4. Update product scope wording only where existing docs are too implicit for
   the chosen decision.

## Acceptance Criteria
- [x] Every affected row has an explicit launch-scope decision.
- [x] `POST_V1` rows are reflected in source-of-truth planning/product docs.
- [x] `WAIVED_FOR_V1` rows are explicitly documented as non-blocking.
- [x] Remaining `IN_V1` rows are narrowed to a smaller follow-up verification set.

## Definition of Done
- [x] One canonical decision packet exists for this scope pass.
- [x] The readiness audit records the concrete decisions.
- [x] Queue/context docs reflect the same decision outcome.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - not applicable; docs/planning classification task
- Manual checks:
  - compared `docs/product/product.md`, the readiness audit, and module scope
    docs for each affected surface
- Screenshots/logs:
  - not applicable
- High-risk checks:
  - keep subscription entitlement enforcement inside V1 because it affects
    runtime/business safety

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
  - `docs/architecture/11_assistant-runtime.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: none
- Rollback note: revert docs only
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  - lower-priority `NOT_VERIFIED` rows mixed launch blockers with optional or
    post-V1 surfaces
- Gaps:
  - no explicit scope decision packet existed for `V1SCOPE-A`
- Inconsistencies:
  - product docs already treated some surfaces as planned/post-MVP, while the
    readiness audit still treated them as ambiguous
- Architecture constraints:
  - entitlement enforcement remains a V1 safety/commercial rule, while
    assistant/admin/billing expansion can stay out of the replacement gate

### 2. Select One Priority Task
- Selected task:
  - classify the lower-priority `NOT_VERIFIED` rows into explicit launch scope
- Priority rationale:
  - external V1 gates are blocked, so the highest-value local step is reducing
    false queue pressure and preserving truthful release scope
- Why other candidates were deferred:
  - production/manual/ops evidence tasks remain blocked on external access;
    runtime/UI implementation gaps were not the current bottleneck

### 3. Plan Implementation
- Files or surfaces to modify:
  - readiness audit, product scope doc, planning queue, execution plan, task board, project state
- Logic:
  - use existing product truth to mark `POST_V1`, preserve one `IN_V1`
    entitlement row, and mark convenience or incident-only surfaces as
    `WAIVED_FOR_V1`
- Edge cases:
  - do not defer subscription entitlement enforcement because it still affects
    V1 plan-gating behavior

### 4. Execute Implementation
- Implementation notes:
  - marked admin, billing/profile subscription, assistant, and strategy
    import/export as `POST_V1`
  - marked reports, avatar upload, and orphan-repair command as
    `WAIVED_FOR_V1`
  - kept `SUBS-ENTITLEMENTS-001` as `IN_V1`

### 5. Verify and Test
- Validation performed:
  - manual source-of-truth consistency review across updated docs
- Result:
  - PASS

### 6. Self-Review
- Simpler option considered:
  - leave all ambiguous rows in the audit and only mention a verbal decision
- Technical debt introduced: no
- Scalability assessment:
  - the decision pattern can be reused for future readiness audits
- Refinements made:
  - added explicit product wording so the assistant/admin/billing status is not
    only implied by older sections

### 7. Update Documentation and Knowledge
- Docs updated:
  - readiness audit, product scope doc, planning queue, execution plan
- Context updated:
  - blocked for `.codex/context/*` by current filesystem permissions
- Learning journal updated: not applicable

## Review Checklist (mandatory)
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
- Task summary:
  - reduced `V1SCOPE-A` ambiguity by classifying lower-priority implemented
    surfaces into `IN_V1`, `POST_V1`, and `WAIVED_FOR_V1`
- Files changed:
  - readiness audit, product scope doc, planning queue, execution plan,
    task packet
- How tested:
  - manual cross-check of updated source-of-truth docs
- What is incomplete:
  - the remaining `IN_V1` follow-up is still explicit verification of
    `SUBS-ENTITLEMENTS-001`, and `.codex/context/{TASK_BOARD,PROJECT_STATE}`
    stayed read-only in this environment
- Next steps:
  - keep external focus on `V1EXCEL`/manual operator gates; if another local
    docs-only slice is needed, derive it from the single remaining `IN_V1`
    scope row or remaining route/browser evidence gaps
- Decisions made:
  - `POST_V1`: `ADMIN-USERS-001`, `ADMIN-SUBS-001`, `PROFILE-SUBS-001`,
    `STRAT-IO-001`, `BOTS-ASSISTANT-001`, `BOTS-ASSISTANT-002`
  - `WAIVED_FOR_V1`: `REPORTS-CROSSMODE-001`, `REPORTS-PNL-001`,
    `UPLOAD-AVATAR-001`, `POSITIONS-REPAIR-001`
  - `IN_V1`: `SUBS-ENTITLEMENTS-001`
