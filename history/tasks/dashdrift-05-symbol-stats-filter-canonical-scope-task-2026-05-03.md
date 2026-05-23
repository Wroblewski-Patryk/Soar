# Task

## Header
- ID: DASHDRIFT-05
- Title: Keep runtime symbol-stats symbol filter canonical-scope locked
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: DASHDRIFT-04
- Priority: P1
- Iteration: 18
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats` already
builds the default dashboard symbol list from active canonical bot market
scope. The explicit `symbol` query path also has to obey that same selected-bot
scope, otherwise stale runtime stats for an old market can be shown after bot
market changes.

## Goal
Make explicit symbol-stats filtering return an empty zero summary when the
requested symbol is outside the selected bot's active canonical runtime scope.

## Scope
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `docs/modules/api-bots.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard can show stale signal/market stats for a
  symbol no longer assigned to the selected bot.
- Expected product or reliability outcome: selected-bot symbol-stats stays
  canonical with or without a `symbol` filter.
- How success will be observed: `symbol=SOLUSDT` returns no items and zero
  summary for a bot whose active canonical scope is only `BTCUSDT`.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready fix, regression coverage, and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Audit symbol-stats configured scope and explicit `symbol` query behavior.
2. Add a canonical scope guard after configured symbols are resolved.
3. Return an empty zero-summary response for off-scope symbols.
4. Add e2e coverage to existing runtime-scope test.
5. Run focused and broader symbol-stats/runtime read validations.
6. Update module and planning docs.

## Acceptance Criteria
- Explicit `symbol` query cannot return stats for stale/off-scope selected-bot
  symbols.
- Default symbol-stats list behavior remains unchanged.
- Legacy fallback still works through configured context when no canonical
  topology exists.
- Runtime-scope, symbol-stats, market-universe, and PnL parity tests pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this scoped read-model fix.
- [x] Regression coverage added.
- [x] Relevant validations pass.
- [x] Docs and context updated.

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
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false` PASS (`10/10`)
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/bots/bots.market-universe-contract.e2e.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --run --sequence.concurrent=false` PASS (`25/25`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
- Manual checks:
  - Reviewed explicit `symbol` query path against selected-bot canonical scope.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - Regression verifies stale/off-scope symbol returns zeroed stats.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: dashboard selected-bot signal/market stats contract.
- Canonical visual target: dashboard symbol stats reflect active assigned
  markets only.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: runtime symbol-stats API response.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none known.
- Required states: loading | empty | error | success unchanged; off-scope
  symbol now resolves to empty.
- Responsive checks: desktop | tablet | mobile unchanged.
- Input-mode checks: touch | pointer | keyboard unchanged.
- Accessibility checks: no DOM changes.
- Parity evidence: e2e regression on symbol-filtered endpoint.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore stale/off-scope symbol-filter
  read behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default symbol-stats used canonical symbols, but explicit symbol
  query bypassed the configured-symbol intersection.
- Gaps: no regression covered symbol-filtered stale stats.
- Inconsistencies: docs already state fallback paths cannot add symbols outside
  canonical selected-bot active scope.
- Architecture constraints: selected-bot runtime read scope is canonical first.

### 2. Select One Priority Task
- Selected task: `DASHDRIFT-05`.
- Priority rationale: signal display and dashboard market stats are core
  operator truth surfaces.
- Why other candidates were deferred: broader runtime graph audit continues in
  later slices.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `runtimeSessionSymbolStatsRead.service.ts`
  - `bots.runtime-scope.e2e.test.ts`
- Logic: when `normalizedSymbol` is present and absent from resolved
  configured symbols, return an empty read model with zero summary.
- Edge cases: in-scope explicit symbols continue to read as before.

### 4. Execute Implementation
- Implementation notes: added a small local empty-response helper to avoid
  leaking stale aggregate summary from the preloaded filtered DB query.

### 5. Verify and Test
- Validation performed: focused and broader runtime symbol-stats packs.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering DB query only.
- Technical debt introduced: no.
- Scalability assessment: cheap in-memory scope check after configured symbols
  resolution.
- Refinements made: zero summary avoids stale aggregate leakage.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/api-bots.md`
  - `docs/planning/mvp-next-commits.md`
  - this task evidence file
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
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

## Notes
This is a read-model scope fix only; it does not change signal-loop execution
or persisted runtime stat writes.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: selected-bot dashboard operator.
- Existing workaround or pain: stale signal stats could appear for off-scope
  markets after market reassignment.
- Smallest useful slice: explicit `symbol` query scope lock.
- Success metric or signal: focused and broader test packs pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: selected-bot signals/markets dashboard truth.
- SLI: runtime symbol-stats response scope correctness.
- SLO: not formally defined for this read model.
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused e2e regression.
- Rollback or disable path: revert commit.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user-owned bot/runtime metadata.
- Trust boundaries: authenticated dashboard API.
- Permission or ownership checks: existing endpoint ownership checks unchanged.
- Abuse cases: no new write or privilege path.
- Secret handling: no secrets touched.
- Security tests or scans: existing ownership tests retained in broader pack.
- Fail-closed behavior: off-scope selected-bot symbol filter returns empty
  zero-summary read model.
- Residual risk: none known for this read-model slice.

## Result Report
- Task summary: explicit symbol-stats filters now obey active canonical
  selected-bot scope.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `docs/modules/api-bots.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused and broader runtime symbol-stats packs.
- What is incomplete: production deployment/readback not performed in this
  slice.
- Next steps: continue one-slice runtime/dashboard drift audit.
- Decisions made: off-scope explicit symbol filters return empty zero-summary
  response instead of stale persisted stats.
