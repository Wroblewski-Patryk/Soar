# Task

## Header
- ID: RUNTIME-AUDIT-71
- Title: Align paper wallet reset open-order blocker with active sync state
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-70
- Priority: P1
- Iteration: 71
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime dashboard open-order reads now treat `ORPHAN_LOCAL` order rows as
inactive. Paper wallet reset still counted open-order blockers by order status
only, so stale orphaned rows could block wallet reset even though runtime no
longer considers them active.

## Goal
Align paper wallet reset blockers with the runtime active-order definition by
requiring `syncState = IN_SYNC` for active open-order counts.

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: paper wallet reset should not be blocked by stale
  orphaned order rows that are no longer active.
- Expected product or reliability outcome: wallet reset blockers and dashboard
  active-order state use the same lifecycle semantics.
- How success will be observed: focused wallet e2e proves `ORPHAN_LOCAL` open
  rows do not block reset while `IN_SYNC` open rows still do.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one focused wallet reset blocker fix and regression.

## Constraints
- Reuse existing `syncState` field.
- Do not change position reset blockers.
- Do not delete or mutate historical order rows during reset.
- Keep changes small and reversible.

## Implementation Plan
1. Add wallet reset regression for stale orphaned open order rows.
2. Require `syncState = IN_SYNC` in the reset open-order blocker count.
3. Run focused wallet tests, API typecheck, guardrails, lint, and diff review.
4. Sync source-of-truth docs.

## Acceptance Criteria
- Paper wallet reset still rejects `IN_SYNC` open orders.
- Paper wallet reset succeeds with only `ORPHAN_LOCAL` open-order rows.
- Historical/stale order rows remain persisted after reset.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items are satisfied with evidence.
- [x] Focused wallet reset regression passes.
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
  - `pnpm --filter api run test -- src/modules/wallets/wallets.e2e.test.ts --run` => PASS (`19/19`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run lint` => PASS
  - `git diff --check` => PASS
- Manual checks: code review of wallet reset blocker query and e2e fixtures
- Screenshots/logs: not applicable
- High-risk checks: active `IN_SYNC` open orders still block reset; stale
  `ORPHAN_LOCAL` open rows no longer block reset

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
- Rollback note: revert this commit to restore previous reset blocker behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: wallet reset counted open orders by status only.
- Gaps: reset blocker did not reuse the post-`RUNTIME-AUDIT-70` active sync
  state semantics.
- Inconsistencies: dashboard hid `ORPHAN_LOCAL` open orders while reset could
  still block on them.
- Architecture constraints: runtime/accounting operations must reflect
  confirmed active lifecycle state and preserve historical rows.

### 2. Select One Priority Task
- Selected task: align paper wallet reset open-order blocker with `IN_SYNC`.
- Priority rationale: operator workflow correctness after stale-order cleanup.
- Why other candidates were deferred: broader stale-order audit UI is not
  needed for the reset blocker.

### 3. Plan Implementation
- Files or surfaces to modify: wallet service, wallet e2e test, source-of-truth
  docs.
- Logic: add `syncState: 'IN_SYNC'` to open-order blocker count.
- Edge cases: normal active orders retain default `IN_SYNC` and still block.

### 4. Execute Implementation
- Implementation notes: `resetPaperWallet` open-order blocker now requires
  `syncState = IN_SYNC`, matching runtime dashboard active-order semantics.

### 5. Verify and Test
- Validation performed: focused wallet e2e, API typecheck, repository
  guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: ignore orders entirely during reset, rejected
  because active in-sync open orders must still block.
- Technical debt introduced: no
- Scalability assessment: sufficient for existing wallet reset contract.
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
This task does not change live wallet behavior or order history retention.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: active-order blocker still returns conflict
- Refresh/restart behavior verified: persisted DB rows are retained
- Regression check performed: wallet e2e reset blocker regression

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: paper bot operator resetting a paper wallet
- Existing workaround or pain: stale open-order row can require manual DB cleanup
- Smallest useful slice: reset blocker query alignment
- Success metric or signal: focused e2e evidence
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: paper wallet reset
- SLI: reset blocker correctness
- SLO: stale orphaned orders do not block reset
- Error budget posture: not applicable
- Health/readiness check: not affected
- Logs, dashboard, or alert route: not affected
- Smoke command or manual smoke: focused wallet e2e
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: wallet and order metadata
- Trust boundaries: authenticated dashboard API and user-owned wallet scope
- Permission or ownership checks: existing wallet ownership check
- Abuse cases: stale user-owned row blocks operation incorrectly
- Secret handling: no secrets touched
- Security tests or scans: focused ownership-scoped e2e
- Fail-closed behavior: active `IN_SYNC` open orders still block reset
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
- Task summary: paper wallet reset no longer treats stale `ORPHAN_LOCAL`
  open-order rows as active blockers.
- Files changed:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-71-wallet-reset-active-order-sync-state-task-2026-05-04.md`
- How tested: wallet e2e (`19/19`), API typecheck, guardrails, lint, and diff
  check all passed.
- What is incomplete: no broader unresolved-order UI in this slice.
- Next steps: continue auditing stale lifecycle parity in bot deletion and
  manual-order flows.
- Decisions made: wallet reset open-order blocker uses `IN_SYNC` as the active
  order state.
