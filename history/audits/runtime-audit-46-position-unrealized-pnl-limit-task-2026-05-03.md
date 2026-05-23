# Task

## Header
- ID: RUNTIME-AUDIT-46
- Title: Preserve runtime position unrealized PnL under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-45
- Priority: P1
- Iteration: 64
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position summaries now use full scoped aggregates for counts,
realized PnL, open quantity, margin, and fees, but `summary.unrealizedPnl`
still comes from limited visible open rows.

## Goal
Keep runtime positions `summary.unrealizedPnl` truthful when row limits hide
older scoped open positions with persisted unrealized PnL.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical docs/context.

## Success Signal
- User or operator problem: dashboard open-position PnL can look too low when
  visible open rows are limited.
- Expected product or reliability outcome: visible position rows remain
  limited, but positions and aggregate summaries include all scoped open
  position unrealized PnL.
- How success will be observed: failing-then-passing aggregate e2e with
  `perSessionLimit=1` and two open positions carrying unrealized PnL.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed the runtime unrealized-PnL limit drift and recorded validation evidence.

## Constraints
- Reuse existing runtime position scope predicates.
- Do not change visible position row limits.
- Do not alter dynamic mark-price rendering for visible rows.
- Do not introduce a new read model.

## Implementation Plan
1. Extend the open-position limit regression to assert hidden unrealized PnL.
2. Add a repository aggregate for scoped open-position `unrealizedPnl`.
3. Use the aggregate in positions summary and aggregate summary composition.
4. Run focused/full relevant tests and validation gates.
5. Sync canonical docs/context and commit.

## Acceptance Criteria
- `openItems` remains limited by query limit.
- `positions.summary.unrealizedPnl` includes hidden scoped open positions.
- `sessionDetail.summary` and `symbolStats.summary.totalPnl` remain coherent
  with existing aggregate contracts.

## Definition of Done
- [x] Regression test fails before implementation and passes after.
- [x] Runtime-scope and monitoring aggregate e2e suites pass sequentially.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Canonical docs/context are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was planned explicitly for this autonomous
  iteration.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Visibility-limit changes.
- Workarounds or fake data.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests: PASS
- Manual checks: diff review and self-review complete
- Screenshots/logs: not applicable
- High-risk checks: existing position ownership scopes remain reused.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/01_overview-and-principles.md`,
  `docs/architecture/architecture-source-of-truth.md`
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
- Rollback note: revert this read-model commit if needed.
- Observability or alerting impact: dashboard PnL accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: positions and aggregate summaries can use limited visible open rows
  for unrealized PnL.
- Gaps: open-position limit regression covers quantity/free cash but not
  unrealized PnL.
- Inconsistencies: other open-position summary fields use full scoped
  aggregates while unrealized PnL remains visible-row-derived.
- Architecture constraints: reuse existing repository/service scopes.

### 2. Select One Priority Task
- Selected task: preserve runtime position unrealized PnL under row limits.
- Priority rationale: direct dashboard money-impacting summary drift.
- Why other candidates were deferred: live mark-price recalculation for hidden
  rows is a larger pricing-policy slice.

### 3. Plan Implementation
- Files or surfaces to modify: positions repository, positions service,
  aggregate read service, aggregate e2e test.
- Logic: aggregate persisted open-position unrealized PnL across full scope
  and compose it upward.
- Edge cases: no visible open positions, hidden open positions, null PnL.

### 4. Execute Implementation
- Implementation notes: positions repository now exposes scoped open-position
  `unrealizedPnl`, positions summary uses it, and aggregate composes
  unrealized PnL from per-session position summaries instead of visible rows.

### 5. Verify and Test
- Validation performed: focused red/green regression, sequential runtime-scope
  e2e, sequential monitoring aggregate e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: summing visible open rows, rejected because it
  repeats the limit drift.
- Technical debt introduced: no
- Scalability assessment: one aggregate query over existing scoped open
  position predicates.
- Refinements made: kept hidden-row summary on persisted
  `Position.unrealizedPnl` while leaving visible dynamic position rendering
  unchanged.

### 7. Update Documentation and Knowledge
- Docs updated: task, project state, task board, and MVP next commits queue.
- Context updated: yes
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

## Notes
This slice uses persisted `Position.unrealizedPnl` for hidden rows; visible
rows still retain their existing dynamic display behavior.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring open PnL.
- Existing workaround or pain: dashboard unrealized PnL can look too low.
- Smallest useful slice: positions and aggregate summary unrealized PnL only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime unrealized PnL summary correctness.
- SLO: not formally tracked for this tiny read-model slice.
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused API e2e
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading telemetry.
- Trust boundaries: authenticated dashboard API, existing ownership scopes.
- Permission or ownership checks: unchanged.
- Abuse cases: PnL summary uses the same scoped positions as visible rows.
- Secret handling: none
- Security tests or scans: existing ownership regressions remain in suites.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: Runtime positions and aggregate unrealized-PnL summaries now
  stay truthful when limits hide older scoped open position rows.
- Files changed:
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`,
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`,
  `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`,
  `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task file.
- How tested: focused regression failed with old visible-row aggregate
  (`11` vs expected `18`) and passed after the fix; runtime-scope e2e
  `12/12`; monitoring aggregate e2e `11/11`; API typecheck; repository
  guardrails; lint; diff check.
- What is incomplete: production deploy/smoke is outside this local slice.
- Next steps: continue the next runtime dashboard read-model audit slice.
- Decisions made: aggregate hidden-row unrealized PnL from persisted scoped
  open positions while preserving existing dynamic rendering for visible rows.
