# Task

## Header
- ID: RUNTIME-AUDIT-45
- Title: Preserve runtime position fees under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-44
- Priority: P1
- Iteration: 63
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position read summaries already use full scoped aggregates for counts,
realized PnL, open quantity, and margin under `limit` / `perSessionLimit`, but
`summary.feesPaid` still comes from limited visible mapped positions.

## Goal
Keep runtime positions `summary.feesPaid` truthful when row limits hide older
scoped positions with trade fees.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- Canonical docs/context.

## Success Signal
- User or operator problem: dashboard position/wallet fee summaries can look
  too low when visible position rows are limited.
- Expected product or reliability outcome: visible position rows remain
  limited, but `positions.summary.feesPaid` reflects all scoped position trade
  fees in the session window.
- How success will be observed: failing-then-passing runtime positions e2e with
  `limit=1` and two closed position fees.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed the runtime position fee limit drift and recorded validation evidence.

## Constraints
- Reuse existing runtime position scope predicates.
- Do not change visible position row limits.
- Do not change trade table semantics.
- Do not introduce a new read model.

## Implementation Plan
1. Extend the existing position limit regression to assert hidden fees.
2. Add a repository aggregate for trade fees through scoped positions.
3. Use that aggregate for `positions.summary.feesPaid`.
4. Run focused/full relevant tests and validation gates.
5. Sync canonical docs/context and commit.

## Acceptance Criteria
- `openItems` and `historyItems` remain limited by query limit.
- `summary.feesPaid` includes hidden scoped position trade fees.
- Existing runtime scope and aggregate contracts remain green.

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
- Observability or alerting impact: dashboard fee accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: positions summary fees use limited visible mapped positions.
- Gaps: the position limit regression covers realized PnL but not fees.
- Inconsistencies: other summary totals use full scoped aggregates while fees
  remain visible-row-derived.
- Architecture constraints: reuse existing repository/service scopes.

### 2. Select One Priority Task
- Selected task: preserve runtime position fees under row limits.
- Priority rationale: direct dashboard accounting summary drift.
- Why other candidates were deferred: deeper supplemental DCA fee attribution
  can be audited separately if production evidence shows divergence.

### 3. Plan Implementation
- Files or surfaces to modify: positions repository, positions service, runtime
  scope e2e test.
- Logic: aggregate trade fees through full scoped positions and use the value
  in the positions summary.
- Edge cases: no visible positions, hidden closed positions, empty fee values.

### 4. Execute Implementation
- Implementation notes: positions repository now exposes a full scoped
  position-trade fee aggregate through `Trade.position`, and positions summary
  uses that aggregate while preserving visible row limits.

### 5. Verify and Test
- Validation performed: focused red/green regression, sequential runtime-scope
  e2e, sequential monitoring aggregate e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: summing visible mapped positions, rejected because
  that is the current limit drift.
- Technical debt introduced: no
- Scalability assessment: one aggregate query over indexed trade-position
  relation and existing scoped position predicates.
- Refinements made: kept fee aggregation beside the existing count, margin,
  quantity, and realized-PnL repository aggregates.

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
This slice covers direct trade fees attached to scoped positions.

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
- User or operator affected: dashboard operator monitoring fee cost.
- Existing workaround or pain: dashboard position fees can look too low.
- Smallest useful slice: positions summary fees only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime position fee summary correctness.
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
- Abuse cases: fee summary uses the same scoped positions as visible rows.
- Secret handling: none
- Security tests or scans: existing ownership regressions remain in suites.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: Runtime positions fee summaries now stay truthful when `limit`
  hides older scoped position rows.
- Files changed:
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`,
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`,
  `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task file.
- How tested: focused regression failed with old visible-row fee sum
  (`0.5` vs expected `1.1`) and passed after the fix; runtime-scope e2e
  `12/12`; monitoring aggregate e2e `11/11`; API typecheck; repository
  guardrails; lint; diff check.
- What is incomplete: production deploy/smoke is outside this local slice.
- Next steps: continue the next runtime dashboard read-model audit slice.
- Decisions made: aggregate direct trade fees through the existing scoped
  `Trade.position` relation instead of adding a parallel read model.
