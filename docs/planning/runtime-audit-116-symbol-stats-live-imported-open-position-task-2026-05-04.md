# Task

## Header
- ID: RUNTIME-AUDIT-116
- Title: Include owned LIVE imported open positions in symbol stats
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-115
- Priority: P1
- Iteration: 116
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The runtime positions endpoint already includes bot-owned LIVE imported
exchange positions through the external ownership index. Runtime symbol-stats
live open-position rows still query only direct `botId`, so symbol stats can
miss open PnL/counts for imported positions that are delegated to the bot.

## Goal
Align runtime symbol-stats live open-position scope with the positions read
model for owned LIVE imported positions.

## Success Signal
- User or operator problem: LIVE imported positions can appear in positions but
  not in symbol stats open metrics.
- Expected product or reliability outcome: dashboard symbol stats and positions
  agree for owned imported LIVE open positions.
- How success will be observed: focused unit tests cover owned imported scope
  construction and existing runtime session tests pass.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed implementation, verification, documentation, and commit-ready evidence
for LIVE imported symbol-stats open-position parity.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a pure helper that builds direct bot plus owned LIVE imported position
   scopes for symbol-stats open-position reads.
2. Expose wallet/API-key context needed by the symbol-stats service.
3. Resolve owned external symbols and pass the scope into live open-position
   reads.
4. Add focused unit coverage for the helper.
5. Run targeted tests plus typecheck, guardrails, lint, and diff review.

## Acceptance Criteria
- Direct bot-owned open positions remain included.
- Owned LIVE imported open positions are included through market-aware and
  legacy external-id prefixes.
- Wallet-scoped LIVE imported rows may have `walletId` equal to the bot wallet
  or `null`.
- PAPER symbol-stats behavior is unchanged.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards are satisfied for this slice.
- [x] Focused tests pass.
- [x] Typecheck, guardrails, and lint pass.
- [x] Documentation and queue state are updated.

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
- Tests: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts` (`8/8`), `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`, `pnpm run lint`
- Manual checks: diff review
- Screenshots/logs: not applicable
- High-risk checks: ownership scope remains user, bot/wallet/API-key bounded

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous symbol-stats imported
  scope
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: symbol-stats live open-position reads query only direct `botId`.
- Gaps: owned LIVE imported positions can be absent from symbol stats while
  present in positions.
- Inconsistencies: positions read model uses external ownership fallback;
  symbol stats does not.
- Architecture constraints: external ownership must remain deterministic and
  fail closed by API key, market type, bot, and wallet.

### 2. Select One Priority Task
- Selected task: include owned LIVE imported open positions in symbol stats.
- Priority rationale: directly closes a dashboard parity gap reported around
  LIVE imported exchange positions.
- Why other candidates were deferred: broader symbol-stats realized PnL
  reconciliation remains a separate slice.

### 3. Plan Implementation
- Files or surfaces to modify: runtime read repository, symbol-stats service,
  focused unit test, planning/context docs.
- Logic: reuse external ownership index to derive owned symbols and add
  imported open-position scopes to the live rows query.
- Edge cases: market-aware external IDs, legacy external IDs, walletId null,
  direct bot positions.

### 4. Execute Implementation
- Implementation notes: added a pure symbol-stats open-position scope helper,
  selected wallet/API-key context for the bot read model, resolved owned LIVE
  external symbols, and passed direct plus imported scopes into live
  open-position rows.

### 5. Verify and Test
- Validation performed: focused runtime session position unit test, API
  typecheck, guardrails, lint, and diff review.
- Result: passed.

### 6. Self-Review
- Simpler option considered: querying all botless imported positions by wallet,
  but that would weaken ownership. The implemented scope reuses the external
  ownership index and stays fail-closed.
- Technical debt introduced: no
- Scalability assessment: bounded by configured live metric symbols and owned
  external symbols.
- Refinements made: kept trade/latest-signal reads unchanged.

### 7. Update Documentation and Knowledge
- Docs updated: task contract, MVP queue, task board, project state.
- Context updated: yes
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
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Read-model parity only; no execution, import, or exchange mutation behavior is
changed.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`: Goal, Scope, Implementation Plan, Acceptance Criteria,
Definition of Done, and Result Report.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused runtime session position unit tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reviewing LIVE imported
  positions.
- Existing workaround or pain: symbol stats can under-report owned imported
  positions.
- Smallest useful slice: open-position scope parity.
- Success metric or signal: focused unit tests pass and symbol stats live rows
  use owned imported scope.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: LIVE bot runtime dashboard symbol stats.
- SLI: symbol stats open metrics include delegated imported positions.
- SLO: no change.
- Error budget posture: not applicable
- Health/readiness check: no change.
- Logs, dashboard, or alert route: no change.
- Smoke command or manual smoke: focused unit tests.
- Rollback or disable path: revert this commit.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and runtime dashboard data.
- Trust boundaries: userId, API key, wallet, bot, and market type.
- Permission or ownership checks: external ownership index remains the
  authority.
- Abuse cases: ambiguous or manual-only imported positions must not be counted.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: no owned symbols or API key means direct bot scope only.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: runtime symbol-stats live open-position rows now include direct
  bot positions and owned LIVE imported positions through the external
  ownership scope.
- Files changed: runtime read repository, symbol-stats service, focused unit
  test, planning/context docs.
- How tested: focused runtime session position test (`8/8`), API typecheck,
  guardrails, lint, and diff review.
- What is incomplete: DB-backed e2e was not run because previous local
  PostgreSQL-backed suites have been unavailable in this environment.
- Next steps: continue auditing remaining runtime/dashboard parity drifts.
- Decisions made: reuse external ownership index rather than wallet-only
  imported fallback.
