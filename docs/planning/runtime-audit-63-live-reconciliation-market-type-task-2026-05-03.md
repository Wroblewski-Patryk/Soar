# Task

## Header
- ID: RUNTIME-AUDIT-63
- Title: Use wallet market type for LIVE reconciliation snapshots
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-62
- Priority: P1
- Iteration: 81
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The product contract includes bot-managed manual positions for both Binance
Futures and Spot market groups. The LIVE reconciliation worker currently uses
`FUTURES` when fetching exchange position, open-order, and trade-history
snapshots, which can make SPOT wallet/market-group assignments invisible to the
import pipeline even when ownership scope resolves correctly.

## Goal
Make LIVE exchange reconciliation fetch snapshots using the market type of the
wallet or active bot context tied to a synced API key, while preserving the
existing FUTURES fallback for legacy API-key-only contexts.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `apps/api/src/modules/positions/positions.service.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- this task evidence file

## Success Signal
- User or operator problem: LIVE import can miss manually opened positions when
  assigned bot markets are not FUTURES.
- Expected product or reliability outcome: reconciliation uses market-type
  truth from wallet/bot context.
- How success will be observed: unit regression proves SPOT synced keys fetch
  SPOT snapshots; validation gates pass.
- Post-launch learning needed: no

## Deliverable For This Stage
One tested backend correction to the existing reconciliation path.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Extend `SyncedApiKey` with optional `marketType`.
2. Resolve synced API-key work items from LIVE wallets and active LIVE bots so
   one API key can be reconciled once per required market type.
3. Pass market type into position, open-order, and trade-history snapshot
   fetches; keep existing FUTURES fallback.
4. Add focused tests for SPOT propagation.
5. Run focused tests, typecheck, lint, guardrails, and diff check.

## Acceptance Criteria
- SPOT synced API-key work item calls snapshot dependencies with `marketType:
  'SPOT'`.
- Existing tests that omit `marketType` keep FUTURES behavior.
- No schema migration or new reconciliation system is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied with validation evidence.
- [x] Market-type propagation is covered by regression tests.
- [x] Repository truth files are updated.

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
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` PASS (`25/25`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks: source inspection found hardcoded `FUTURES` in exchange snapshot calls
- Screenshots/logs: not applicable
- High-risk checks: execution and order placement paths unchanged

## Architecture Evidence
- Architecture source reviewed: `docs/product/product.md`, `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none expected
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: backend tests

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to return snapshot reconciliation to FUTURES-only behavior
- Observability or alerting impact: reconciliation status unchanged
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: snapshot fetches were hardcoded to FUTURES.
- Gaps: no regression covered SPOT reconciliation market-type propagation.
- Inconsistencies: wallet-first market context existed, but reconciliation did not consume it.
- Architecture constraints: wallet is runtime mode and budget source-of-truth.

### 2. Select One Priority Task
- Selected task: propagate wallet/bot market type through LIVE reconciliation snapshot reads.
- Priority rationale: directly affects whether assigned-market manual positions are imported.
- Why other candidates were deferred: broader dashboard and wallet display audits need separate slices.

### 3. Plan Implementation
- Files or surfaces to modify: reconciliation types/service/tests and snapshot fetch service.
- Logic: derive one reconciliation work item per synced API key and market type.
- Edge cases: legacy API-key-only contexts default to FUTURES; one API key may be used by both SPOT and FUTURES wallets.

### 4. Execute Implementation
- Implementation notes: added `marketType` to reconciliation API-key work
  items, expanded default synced API-key discovery by LIVE wallet/active bot
  market types, passed market type into snapshot reads and owned automation,
  and extracted small helpers to keep the reconciliation service under the
  monolith budget.

### 5. Verify and Test
- Validation performed: focused reconciliation unit suite, API typecheck, lint,
  repository guardrails, and diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: adding an optional market type parameter with
  FUTURES fallback is smaller than introducing a new reconciliation scheduler.
- Technical debt introduced: no
- Scalability assessment: one API key can now create at most one work item per
  market type, which is bounded by the existing `TradeMarket` enum.
- Refinements made: extracted API-key market-type expansion and canonical
  continuity context to keep file budgets healthy.

### 7. Update Documentation and Knowledge
- Docs updated: task file, MVP next commits queue.
- Context updated: task board, project state.
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
- [x] Learning journal was updated if a recurring pitfall is confirmed.

## Notes
This slice changes read synchronization context only. It does not change order
submission, pre-trade checks, wallet allocation, or exchange credentials.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB -> validation -> error handling -> test. Partial implementations, mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE bot operators with assigned SPOT market groups
- Existing workaround or pain: manual SPOT positions can be absent from bot runtime import
- Smallest useful slice: propagate market type through existing reconciliation reads
- Success metric or signal: focused tests pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: LIVE manual exchange position import
- SLI: reconciliation fetches the market type matching wallet/bot context
- SLO: not applicable for this code-only slice
- Error budget posture: not applicable
- Health/readiness check: not affected
- Logs, dashboard, or alert route: existing reconciliation status remains
- Smoke command or manual smoke: focused unit tests
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: no migration required
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: reconciliation loop path tested
- Regression check performed: live position reconciliation unit suite (`25/25`)

## AI Testing Evidence

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: exchange account position metadata
- Trust boundaries: existing user-owned API key and wallet filters unchanged
- Permission or ownership checks: unchanged ownership index
- Abuse cases: no new credential exposure path
- Secret handling: no secret changes
- Security tests or scans: typecheck and existing auth-scoped service tests
- Fail-closed behavior: unsupported snapshot fetches still fail through existing exchange errors
- Residual risk: low

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: LIVE reconciliation now uses wallet/bot market type instead of
  assuming all snapshots are FUTURES.
- Files changed:
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `apps/api/src/modules/positions/livePositionReconciliationApiKeys.ts`
  - `apps/api/src/modules/positions/livePositionReconciliationContext.ts`
  - `apps/api/src/modules/positions/positions.service.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-63-live-reconciliation-market-type-task-2026-05-03.md`
- How tested: focused reconciliation unit suite (`25/25`), API typecheck, lint,
  guardrails, diff check.
- What is incomplete: production verification against a real SPOT exchange
  account remains an ops smoke task.
- Next steps: continue auditing LIVE/PAPER runtime dashboard drift one slice at
  a time.
- Decisions made: no architecture change; existing wallet-first market context
  is now consumed by reconciliation.
