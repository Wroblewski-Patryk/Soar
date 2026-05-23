# Task

## Header
- ID: RUNTIME-AUDIT-72
- Title: Align runtime order lifetime candidates with active sync state
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-71
- Priority: P1
- Iteration: 72
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime dashboard and wallet reset now treat stale `ORPHAN_LOCAL` orders as
inactive. The runtime order lifetime policy still selected stale cancellation
candidates by open status only, which could schedule cancel attempts for
orphaned exchange-synced rows.

## Goal
Make runtime order lifetime enforcement select only active `IN_SYNC` open-order
rows for stale cancellation.

## Scope
- `apps/api/src/modules/engine/runtimeOrderLifetime.service.ts`
- `apps/api/src/modules/engine/runtimeOrderLifetime.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: stale orphaned orders should not keep producing
  runtime cancel attempts or dedupe noise.
- Expected product or reliability outcome: runtime cancellation policy and
  dashboard/wallet active-order semantics match.
- How success will be observed: focused regression proves default candidate
  query ignores `ORPHAN_LOCAL` open-status rows.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one focused runtime order lifetime candidate filter fix and test.

## Constraints
- Reuse existing `syncState` field.
- Do not change order lifetime policy configuration semantics.
- Do not add migrations or new lifecycle systems.
- Keep changes small and reversible.

## Implementation Plan
1. Add test coverage for the default stale-order candidate query.
2. Require `syncState = IN_SYNC` in that query.
3. Run focused order lifetime tests, API typecheck, guardrails, lint, and diff
   review.
4. Sync source-of-truth docs.

## Acceptance Criteria
- `IN_SYNC` stale open orders remain cancellation candidates.
- `ORPHAN_LOCAL` stale open-status orders are not cancellation candidates.
- Existing injected-dependency unit tests remain unchanged.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items are satisfied with evidence.
- [x] Focused runtime order lifetime regression passes.
- [x] API typecheck, guardrails, lint, and diff review pass.
- [x] Source-of-truth docs are updated.

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
  - `pnpm --filter api run test -- src/modules/engine/runtimeOrderLifetime.service.test.ts --run` => PASS (`5/5`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run lint` => PASS
  - `git diff --check` => PASS
- Manual checks: code review of default stale-order candidate query and
  regression fixture
- Screenshots/logs: not applicable
- High-risk checks: `ORPHAN_LOCAL` open-status rows are excluded while stale
  `IN_SYNC` rows remain candidates

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous order lifetime query.
- Observability or alerting impact: reduced stale cancel noise
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: order lifetime candidate query used open status only.
- Gaps: runtime lifetime enforcement did not match dashboard/wallet active
  sync-state semantics.
- Inconsistencies: `ORPHAN_LOCAL` open-status rows could be hidden from
  dashboard and reset blockers but still sent through cancel lifecycle.
- Architecture constraints: runtime lifecycle guardrails should operate on
  confirmed active order state.

### 2. Select One Priority Task
- Selected task: require `IN_SYNC` for runtime order lifetime candidates.
- Priority rationale: runtime noise and stale lifecycle parity.
- Why other candidates were deferred: broader order history UX is separate.

### 3. Plan Implementation
- Files or surfaces to modify: runtime order lifetime service/test,
  source-of-truth docs.
- Logic: export default lifetime deps for regression and add `syncState:
  IN_SYNC` to default query.
- Edge cases: injected dependency tests remain valid; policy-disabled bots are
  unaffected.

### 4. Execute Implementation
- Implementation notes: default runtime order lifetime deps are exported for
  regression coverage and the default candidate query now requires
  `syncState=IN_SYNC`.

### 5. Verify and Test
- Validation performed: focused runtime order lifetime suite, API typecheck,
  repository guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering after candidate fetch, rejected because
  DB query should own the active candidate contract.
- Technical debt introduced: no
- Scalability assessment: sufficient for existing lifecycle enforcement.
- Refinements made: none needed.

### 7. Update Documentation and Knowledge
- Docs updated: this task, MVP next commits queue.
- Context updated: task board and project state.
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

## Notes
This task affects runtime cancellation candidates only.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: persisted DB candidate query
- Regression check performed: default candidate query regression

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operator relying on clean runtime lifecycle
- Existing workaround or pain: stale order rows can produce unnecessary cancel
  attempts
- Smallest useful slice: candidate query alignment
- Success metric or signal: focused test evidence
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: runtime order lifecycle enforcement
- SLI: stale cancel candidate correctness
- SLO: orphaned orders do not enter active lifetime cancellation
- Error budget posture: not applicable
- Health/readiness check: not affected
- Logs, dashboard, or alert route: not affected
- Smoke command or manual smoke: focused unit/integration-style test
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: order metadata
- Trust boundaries: runtime worker DB read/write path
- Permission or ownership checks: existing user/bot query scope
- Abuse cases: stale row causes unintended cancel path
- Secret handling: no secrets touched
- Security tests or scans: focused runtime query regression
- Fail-closed behavior: only confirmed in-sync rows are cancel candidates
- Residual risk: none known for this slice

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: runtime order lifetime enforcement no longer selects stale
  `ORPHAN_LOCAL` open-status order rows as cancel candidates.
- Files changed:
  - `apps/api/src/modules/engine/runtimeOrderLifetime.service.ts`
  - `apps/api/src/modules/engine/runtimeOrderLifetime.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-72-order-lifetime-active-sync-state-task-2026-05-04.md`
- How tested: runtime order lifetime suite (`5/5`), API typecheck, guardrails,
  lint, and diff check all passed.
- What is incomplete: no broader unresolved-order UI in this slice.
- Next steps: continue auditing stale lifecycle parity in manual-order and bot
  deletion flows.
- Decisions made: runtime order lifetime candidates require `IN_SYNC`.
