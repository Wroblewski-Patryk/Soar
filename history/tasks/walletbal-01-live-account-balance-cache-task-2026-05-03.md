# Task

## Header
- ID: WALLETBAL-01
- Title: Stabilize LIVE wallet account balance cache semantics
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: operator-reported runtime/dashboard audit
- Priority: P0
- Iteration: 2026-05-03 operator follow-up
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported intermittent dashboard wallet account-balance display
drift while LIVE/PAPER runtime follow-ups were active. The dashboard balance is
fed by runtime capital snapshots, aggregate monitoring, and wallet read models.

## Goal
Keep LIVE `accountBalance` as the raw exchange account balance across fresh and
cached runtime capital reads while `referenceBalance` remains the allocation
limited trading capital.

## Scope
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Success Signal
- User or operator problem: dashboard account balance should not intermittently
  collapse to an allocation value after a cache hit.
- Expected product or reliability outcome: LIVE wallet widgets receive stable
  raw account balance and allocated reference balance values.
- How success will be observed: focused runtime capital regression proves fresh
  and cached snapshots keep distinct balances.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified code fix, regression coverage, and source-of-truth synchronization.

## Constraints
- Use existing runtime capital snapshot and cache path.
- Do not introduce a second wallet balance system.
- Do not change dashboard UI behavior without a confirmed frontend defect.
- Keep LIVE trading capital allocation semantics unchanged.

## Implementation Plan
1. Inspect the runtime capital snapshot source chain.
2. Change the LIVE balance cache entry to store `accountBalance` and
   `referenceBalance` separately.
3. Preserve allocated `freeCash` math from `referenceBalance`.
4. Add regression coverage for cached FIXED-allocation LIVE snapshots.
5. Run focused API tests, typecheck, guardrails, and docs parity.

## Acceptance Criteria
- Cached LIVE snapshots return raw exchange `accountBalance`.
- Cached LIVE snapshots return allocated `referenceBalance`.
- `fetchLiveBalance` is not called again inside the cache TTL.
- Existing wallet and monitoring aggregate tests remain green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` constraints are satisfied for the touched slice.
- [x] Focused regression test covers the defect.
- [x] API typecheck passes.
- [x] Repository guardrails pass.
- [x] Documentation/context are synchronized.

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
  - `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts --run` => PASS, 15/15.
  - `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/wallets/wallets.e2e.test.ts --run` => PASS, 19/19.
  - `pnpm --filter api run typecheck` => PASS.
- Manual checks: source-chain audit from runtime capital snapshot to monitoring
  aggregate and dashboard wallet display.
- Screenshots/logs: not applicable.
- High-risk checks: LIVE allocation remains fail-closed and uses existing
  exchange-balance boundary.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`,
  `docs/modules/system-modules.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert the cache-entry shape change in
  `runtimeCapitalContext.service.ts`.
- Observability or alerting impact: dashboard/runtime snapshots should stop
  showing allocation values as account balances after cache hits.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: LIVE balance cache stored one numeric `value` and reused it for both
  `referenceBalance` and `accountBalance`.
- Gaps: no regression asserted cached account-balance semantics under FIXED or
  PERCENT allocation.
- Inconsistencies: fresh reads returned raw `accountBalance`, cached reads
  returned allocated `referenceBalance` as `accountBalance`.
- Architecture constraints: keep wallet-first runtime capital source and
  exchange adapter boundary.

### 2. Select One Priority Task
- Selected task: `WALLETBAL-01`.
- Priority rationale: direct operator-reported dashboard balance drift with a
  small confirmed backend defect.
- Why other candidates were deferred: production ETH/DOGE readback requires a
  fresh deploy/authenticated evidence; PAPER signal topology fix is already
  pushed and awaiting promotion.

### 3. Plan Implementation
- Files or surfaces to modify: runtime capital context service and tests.
- Logic: cache distinct `referenceBalance` and `accountBalance` values.
- Edge cases: FIXED allocation, cache hit inside TTL, reserved margin math.

### 4. Execute Implementation
- Implementation notes: `freeCash` continues to derive from allocated
  `referenceBalance`; account balance display receives raw exchange balance.

### 5. Verify and Test
- Validation performed: focused runtime capital, aggregate monitoring, wallet
  e2e, API typecheck, guardrails, docs parity.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: disabling cache; rejected because it would increase
  exchange calls and not address semantic drift.
- Technical debt introduced: no
- Scalability assessment: cache entry remains small and keyed by existing
  wallet/bot/exchange/market/base-currency context.
- Refinements made: added a regression that asserts one exchange fetch with
  stable fresh and cached values.

### 7. Update Documentation and Knowledge
- Docs updated: this task record.
- Context updated: task board and project state.
- Learning journal updated: yes.

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
This fix does not deploy production by itself. It must be promoted with the
pending runtime fixes before the operator can verify dashboard behavior in
production.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`: stabilize LIVE wallet account-balance cache semantics.
- `Scope`: listed above.
- `Implementation Plan`: listed above.
- `Acceptance Criteria`: listed above.
- `Definition of Done`: listed above.
- `Result Report`: listed below.

Runtime task vertical slice: API runtime capital logic, wallet snapshot
semantics, aggregate read model compatibility, regression tests, and
documentation evidence. UI code was not changed because the confirmed defect
was upstream of the existing dashboard display.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE wallet dashboard user.
- Existing workaround or pain: intermittent balance display drift.
- Smallest useful slice: backend cache semantics correction.
- Success metric or signal: cached snapshots preserve raw account balance.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: production dashboard readback after
  deployment.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: dashboard wallet balance and runtime capital snapshot.
- SLI: runtime capital snapshot correctness.
- SLO: cached snapshot values must preserve their semantic fields.
- Error budget posture: not applicable.
- Health/readiness check: unchanged.
- Logs, dashboard, or alert route: dashboard wallet widget.
- Smoke command or manual smoke: production authenticated dashboard readback
  after deployment.
- Rollback or disable path: revert service/test change.

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: cache-hit regression performed.
- Regression check performed: yes

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: account balance metadata from configured exchange
  account.
- Trust boundaries: existing exchange adapter and wallet ownership path.
- Permission or ownership checks: unchanged.
- Abuse cases: no new external access or secret handling.
- Secret handling: unchanged; no secrets recorded.
- Security tests or scans: not required for this cache-shape change.
- Fail-closed behavior: missing LIVE API key still returns zero balance.
- Residual risk: production confirmation requires fresh deployment.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: LIVE runtime capital cache now stores raw `accountBalance`
  separately from allocated `referenceBalance`.
- Files changed:
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `history/tasks/walletbal-01-live-account-balance-cache-task-2026-05-03.md`
- How tested: focused runtime capital, aggregate monitoring, wallet e2e, API
  typecheck, guardrails, docs parity.
- What is incomplete: production deployment and authenticated dashboard readback.
- Next steps: promote pending runtime commits and run `LIVEIMPORT-03` readback.
- Decisions made: keep UI unchanged until API-provided balance semantics are
  correct in production.
