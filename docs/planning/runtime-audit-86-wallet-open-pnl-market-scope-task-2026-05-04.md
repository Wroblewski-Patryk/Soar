# Task

## Header
- ID: RUNTIME-AUDIT-86
- Title: Scope wallet imported open PnL by market type
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-85
- Priority: P0
- Iteration: 86
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Wallet performance summary and equity timeline use a shared open-PnL predicate
for wallet-owned imported LIVE positions. After canonical imported external IDs
became market-scoped, this wallet predicate still matched broad
`apiKeyId:` prefixes.

## Goal
Ensure wallet imported open PnL is scoped by the wallet's market type, so a
FUTURES wallet cannot include SPOT positions from the same API key.

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- Canonical planning/context files for closure evidence

## Success Signal
- User or operator problem: wallet dashboard PnL can drift when one API key has
  positions in more than one market type.
- Expected product or reliability outcome: wallet performance and timeline open
  PnL reflect the selected wallet market only.
- How success will be observed: wallet e2e includes same-API-key FUTURES and
  SPOT imported open positions and reports only the FUTURES PnL for a FUTURES
  wallet.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and regression test for wallet imported open-PnL market scoping.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Pass wallet `marketType` into the shared wallet open-PnL predicate.
2. Replace broad `apiKeyId:` matching with canonical
   `apiKeyId:marketType:` prefix matching.
3. Extend wallet summary and timeline regressions with same-API-key SPOT drift
   rows.
4. Run wallet e2e and relevant gates.

## Acceptance Criteria
- Wallet performance summary excludes same-api-key positions from other market
  types.
- Wallet equity timeline excludes same-api-key positions from other market
  types.
- Existing `IN_SYNC` same-market imported open PnL remains included.
- Focused tests and relevant gates pass.

## Definition of Done
- [x] Implementation completed in the declared scope.
- [x] Regression coverage proves market-type exclusion.
- [x] Relevant validations pass.
- [x] Canonical context and planning files are synchronized.
- [x] Result report is complete.

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
- Manual checks: `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: focused wallet API regression covers cross-market leakage

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/README.md`,
  `docs/architecture/01_overview-and-principles.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore broad wallet open-PnL matching
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: wallet open-PnL helper used `externalId startsWith apiKeyId:` for
  botless imported LIVE positions.
- Gaps: market-scoped imported IDs were enforced in runtime paths, but wallet
  analytics still matched by API key only.
- Inconsistencies: same API key could inflate FUTURES wallet PnL with SPOT open
  position PnL.
- Architecture constraints: execution context includes market type and must be
  explicit for operator-facing runtime truth.

### 2. Select One Priority Task
- Selected task: market-scope wallet imported open PnL.
- Priority rationale: wallet dashboard PnL and timeline are core operator trust
  surfaces.
- Why other candidates were deferred: broader wallet cashflow/realized-PnL
  audit remains separate because this is a smaller confirmed leakage path.

### 3. Plan Implementation
- Files or surfaces to modify: wallet service, wallet e2e, planning/context
  docs.
- Logic: build canonical imported external-position market prefix from
  wallet `apiKeyId` and `marketType`.
- Edge cases: same API key, different market type, stale orphan local row,
  unrelated API key.

### 4. Execute Implementation
- Implementation notes: wallet open-PnL helper now receives wallet market type
  and uses canonical imported external-position market prefix matching; wallet
  summary/timeline regressions now include same-api-key SPOT drift rows.

### 5. Verify and Test
- Validation performed: wallets e2e, API typecheck, repository guardrails,
  lint, and diff whitespace review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: keep broad legacy prefix and add symbol checks;
  rejected because wallet-wide analytics has no safe symbol-to-market proof for
  legacy IDs.
- Technical debt introduced: no
- Scalability assessment: reuses canonical imported external-position ID helper.
- Refinements made: none required.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, `docs/planning/mvp-next-commits.md`,
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: wallets e2e (`20/20`)

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: wallet dashboard operator
- Existing workaround or pain: same-api-key cross-market PnL leakage
- Smallest useful slice: wallet imported open-PnL predicate
- Success metric or signal: focused wallet regression stays green
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: wallet performance summary and equity timeline
- SLI: correctness of wallet open-PnL read model
- SLO: wallet open PnL reflects selected market type only
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused API e2e
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user wallet/runtime data
- Trust boundaries: authenticated user-owned wallet analytics endpoints
- Permission or ownership checks: unchanged existing wallet ownership
- Abuse cases: same user API-key cross-market leakage can mislead capital/PnL
  display
- Secret handling: none
- Security tests or scans: ownership path unchanged
- Fail-closed behavior: imported wallet PnL requires canonical market prefix
- Residual risk: legacy unscoped imported external IDs are not included in
  wallet-wide imported open PnL without market proof

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: wallet imported LIVE open-PnL analytics now use canonical
  market-scoped external IDs and exclude same-api-key positions from other
  market types.
- Files changed:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-86-wallet-open-pnl-market-scope-task-2026-05-04.md`
- How tested: wallets e2e (`20/20`), API typecheck, repository guardrails,
  lint, and `git diff --check`.
- What is incomplete: no work remains in this slice.
- Next steps: continue wallet cashflow and bot strategy dashboard drift audit.
- Decisions made: wallet-wide botless imported open PnL now requires canonical
  market-scoped external IDs.
