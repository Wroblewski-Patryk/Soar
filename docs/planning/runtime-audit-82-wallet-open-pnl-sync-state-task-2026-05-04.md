# Task

## Header
- ID: RUNTIME-AUDIT-82
- Title: Align wallet open PnL aggregation with sync state
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-81
- Priority: P1
- Iteration: 82
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Wallet performance summary and equity timeline derive current open PnL from
`buildWalletOpenPnlWhere`. That helper scopes by wallet/API-key ownership and
`status=OPEN`, but did not require `syncState=IN_SYNC`, which can let stale
local open-position rows inflate wallet dashboard PnL.

## Goal
Ensure wallet current open-PnL aggregations include only active synced open
positions.

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- this task file

## Success Signal
- User or operator problem: wallet dashboard PnL must not include stale local
  positions that active position views no longer treat as live.
- Expected product or reliability outcome: wallet KPI and timeline current PnL
  match active-position truth.
- How success will be observed: `OPEN + ORPHAN_LOCAL` imported rows owned by
  the same API key are ignored by wallet open-PnL aggregation.
- Post-launch learning needed: no.

## Deliverable For This Stage
Implement the `IN_SYNC` guard in wallet open-PnL aggregation, add focused e2e
coverage, run relevant API/repository validations, and sync canonical
planning/context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- preserve wallet-owned imported `IN_SYNC` open-PnL inclusion

## Implementation Plan
1. Add `syncState=IN_SYNC` to `buildWalletOpenPnlWhere`.
2. Extend wallet performance-summary and equity-timeline coverage with a
   scope-matching `ORPHAN_LOCAL` open imported position that must be ignored.
3. Run focused wallets e2e, API typecheck, guardrails, lint, and diff review.
4. Update canonical task, project-state, and MVP planning files.

## Acceptance Criteria
- Wallet performance summary excludes stale local open imported PnL.
- Wallet equity timeline excludes stale local open imported PnL from the latest
  point.
- Existing wallet-owned imported `IN_SYNC` PnL remains included.
- Validation evidence is recorded before the task is marked `DONE`.

## Definition of Done
- [ ] Wallet open-PnL helper requires `OPEN + IN_SYNC`.
- [ ] Regression coverage proves stale local imported PnL is ignored.
- [ ] Relevant validation commands pass.
- [ ] Canonical docs/context are updated.

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
  - `pnpm --filter api run test -- src/modules/wallets/wallets.e2e.test.ts --run` PASS (`20/20`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS with line-ending warnings only
- Screenshots/logs: not applicable
- High-risk checks: e2e proves same-API-key `OPEN + ORPHAN_LOCAL` imported
  positions are ignored by performance summary and equity timeline open-PnL
  calculations.

## Architecture Evidence
- Architecture source reviewed: `docs/governance/autonomous-engineering-loop.md`,
  prior active-state runtime audit slices, and existing wallet open-PnL tests.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this small service/test/docs commit.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: wallet open-PnL aggregation filters `OPEN` rows but not sync state.
- Gaps: stale local imported positions can inflate current wallet PnL.
- Inconsistencies: active position list/runtime paths require synced truth.
- Architecture constraints: keep wallet-owned imported LIVE open PnL included
  when it is `IN_SYNC`.

### 2. Select One Priority Task
- Selected task: align wallet open-PnL aggregation with sync state.
- Priority rationale: wallet dashboard KPIs are user-visible money metrics.
- Why other candidates were deferred: this is a confirmed single-helper drift
  shared by summary and timeline.

### 3. Plan Implementation
- Files or surfaces to modify: wallets service, wallets e2e, and canonical
  docs/context.
- Logic: add `syncState=IN_SYNC` to `buildWalletOpenPnlWhere`.
- Edge cases: stale API-key-owned imported rows ignored; active imported rows
  still included.

### 4. Execute Implementation
- Implementation notes: `buildWalletOpenPnlWhere` now requires
  `syncState=IN_SYNC`, so both wallet summary and timeline use the same active
  open-position truth.

### 5. Verify and Test
- Validation performed: focused wallets e2e, API typecheck, repository
  guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: add the filter once in the shared helper used by
  both summary and timeline.
- Technical debt introduced: no
- Scalability assessment: shared helper keeps both wallet projections aligned.
- Refinements made: placed the guard in the shared helper instead of duplicating
  endpoint-local filters.

### 7. Update Documentation and Knowledge
- Docs updated: task file and MVP planning files.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
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
This task changes only current open-PnL aggregation. Historical cashflow and
closed-position accounting are outside this slice.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for this narrow service
  guard.
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable for
  this narrow owner-scoped guard.
- Data classification: user-owned wallet and trading position PnL state
- Trust boundaries: authenticated user to owned wallet analytics endpoints
- Permission or ownership checks: existing `userId`, wallet ownership, and
  API-key ownership matching retained
- Abuse cases: stale local position cannot inflate dashboard wallet PnL
- Secret handling: none
- Security tests or scans: pending relevant validation
- Fail-closed behavior: only synced active rows contribute to open PnL
- Residual risk: authenticated production dashboard smoke is not claimed in
  this local slice

## Result Report
- Task summary: wallet current open-PnL aggregation now requires
  `OPEN + IN_SYNC`, preventing stale local imported rows from inflating summary
  and timeline PnL.
- Files changed:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-82-wallet-open-pnl-sync-state-task-2026-05-04.md`
- How tested: focused wallets e2e (`20/20`), API typecheck, guardrails, lint,
  and diff review all passed.
- What is incomplete: authenticated production dashboard smoke is not claimed
  in this local slice.
- Next steps: continue scanning bot portfolio/runtime projection aggregates.
- Decisions made: put the sync-state guard in the shared wallet open-PnL
  helper.
