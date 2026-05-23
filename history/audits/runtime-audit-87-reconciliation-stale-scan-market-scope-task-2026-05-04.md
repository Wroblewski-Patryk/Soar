# Task

## Header
- ID: RUNTIME-AUDIT-87
- Title: Scope reconciliation stale-position scans by market type
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-86
- Priority: P0
- Iteration: 87
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After wallet imported open PnL was scoped by market type, architecture review
found another broad `apiKeyId:` match in LIVE position reconciliation. The
stale synced-position scan used the API key only, so a FUTURES reconciliation
could inspect SPOT rows from the same API key.

## Goal
Ensure reconciliation stale-position scans only consider positions from the
reconciled market type, while preserving legacy unscoped imported IDs for
compatibility.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- Canonical planning/context files for closure evidence

## Success Signal
- User or operator problem: same-api-key cross-market rows can be marked
  missing or closed by the wrong market reconciliation pass.
- Expected product or reliability outcome: FUTURES reconciliation does not mark
  SPOT imported positions stale.
- How success will be observed: focused default-deps regression returns
  FUTURES and legacy unscoped rows, but excludes canonical SPOT rows.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and regression coverage for market-scoped reconciliation stale
scans.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add optional `marketType` to the stale synced-position dependency contract.
2. Pass the synced API-key work item market type into stale scans.
3. Update default dependency query to include canonical current-market rows and
   legacy unscoped rows, excluding other canonical market prefixes.
4. Add default-deps regression coverage.
5. Run focused reconciliation tests and repository validation gates.

## Acceptance Criteria
- Stale scans include `apiKey:FUTURES:*` for FUTURES reconciliation.
- Stale scans exclude `apiKey:SPOT:*` for FUTURES reconciliation.
- Legacy `apiKey:symbol:side` rows remain included for compatibility.
- Focused tests and relevant gates pass.

## Definition of Done
- [x] Implementation completed in the declared scope.
- [x] Regression coverage proves cross-market stale-scan exclusion.
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
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` PASS (`29/29`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: focused reconciliation regression covers wrong-market stale
  scan leakage

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
- Rollback note: revert this commit to restore broad stale-position API-key scan
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default reconciliation stale scan matched `externalId startsWith apiKeyId:`.
- Gaps: canonical imported external IDs are market-scoped, but stale scan was
  still API-key scoped.
- Inconsistencies: wallet/runtime reads use market-scoped ownership while
  stale cleanup could cross market boundaries.
- Architecture constraints: execution context includes market type and must be
  explicit for fail-closed LIVE automation.

### 2. Select One Priority Task
- Selected task: market-scope reconciliation stale-position scan.
- Priority rationale: wrong-market stale cleanup can mutate live trading state.
- Why other candidates were deferred: read-only dashboard drifts are lower risk
  than reconciliation write-path drift.

### 3. Plan Implementation
- Files or surfaces to modify: reconciliation dependency contract, default
  dependency query, reconciliation call site, focused tests, planning/context
  docs.
- Logic: include current market prefix and legacy unscoped prefix while
  excluding other canonical market prefixes.
- Edge cases: legacy unscoped rows, FUTURES work item, SPOT row with same API
  key.

### 4. Execute Implementation
- Implementation notes: added optional market type to stale synced-position
  scan contract, passed the synced API-key work item market type, and updated
  default dependency filtering to current market prefix plus legacy unscoped
  rows.

### 5. Verify and Test
- Validation performed: focused live position reconciliation suite, API
  typecheck, repository guardrails, lint, and diff whitespace review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only passing market type without legacy support;
  rejected because existing legacy imported rows still need stale repair.
- Technical debt introduced: no
- Scalability assessment: reuses canonical imported-position market prefix
  helper and keeps dependency shape explicit.
- Refinements made: kept the reconciliation service under the production
  monolith line budget without adding an allowlist.

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
- Regression check performed: live position reconciliation suite (`29/29`)

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: live bot operator
- Existing workaround or pain: same-api-key cross-market stale mutation risk
- Smallest useful slice: reconciliation stale-position scan predicate
- Success metric or signal: focused reconciliation regression stays green
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no
- Critical user journey: LIVE exchange reconciliation
- SLI: stale cleanup mutates only scoped market rows
- SLO: no wrong-market stale close/mark from reconciliation pass
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused API unit tests
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no
- Data classification: user trading/runtime data
- Trust boundaries: internal worker reconciliation for user-owned API key
- Permission or ownership checks: unchanged
- Abuse cases: same-api-key cross-market stale mutation can distort or close
  unrelated local state
- Secret handling: none
- Security tests or scans: not applicable
- Fail-closed behavior: market type is passed explicitly into stale scan
- Residual risk: legacy unscoped rows remain included by design until migrated

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: reconciliation stale synced-position scans now use explicit
  market type, keeping current-market and legacy unscoped rows while excluding
  other canonical market prefixes.
- Files changed:
  - `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-87-reconciliation-stale-scan-market-scope-task-2026-05-04.md`
- How tested: live position reconciliation suite (`29/29`), API typecheck,
  repository guardrails, lint, and `git diff --check`.
- What is incomplete: no work remains in this slice.
- Next steps: continue reconciliation/runtime write-path drift audit.
- Decisions made: legacy unscoped imported positions remain included in stale
  scans for compatibility, but canonical other-market rows are excluded.
