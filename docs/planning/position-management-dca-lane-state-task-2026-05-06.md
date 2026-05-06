# Task

## Header
- ID: PMPLC-02
- Title: Preserve mixed positive/negative DCA lane progress
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: `PMPLC-01`
- Priority: P1
- Iteration: 2026-05-06 runtime implementation slice
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this implementation iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`PMPLC-01` made positive and negative DCA lanes canonical. The runtime
position-management core still used `currentAdds` as a single linear pointer,
which meant a configured positive level could block a later negative level, or
the reverse, even though the contract requires each lane to execute from the
closest threshold in its own PnL direction.

## Goal
Make DCA level progress track executed level indices while preserving the
existing `currentAdds` count for read models and parity consumers.

## Scope
- `apps/api/src/modules/engine/positionManagement.types.ts`
- `apps/api/src/modules/engine/positionManagement.service.ts`
- `apps/api/src/modules/engine/positionManagement.service.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.helpers.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionState.store.ts`
- `.codex/context/LEARNING_JOURNAL.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: mixed DCA ladders must not silently skip or block
  valid adds in the opposite PnL lane.
- Expected product or reliability outcome: runtime and replay lifecycle logic
  can execute positive and negative DCA thresholds independently.
- How success will be observed: focused regression proves a profit-side add
  does not prevent the first loss-side add from executing later.
- Post-launch learning needed: no.

## Deliverable For This Stage
Runtime core fix, focused regression coverage, validation evidence, and
source-of-truth synchronization.

## Constraints
- reuse the existing position-management core
- keep `currentAdds` as a compatibility count
- do not add a database migration for this small runtime-state slice
- do not introduce workaround paths or duplicated lifecycle engines

## Implementation Plan
1. Extend position runtime state with optional executed DCA level indices.
2. Select the next DCA level by current PnL direction and closest pending
   threshold.
3. Persist executed indices in the existing runtime state store.
4. Use the selected DCA level index for runtime DCA dedupe and funds estimate.
5. Add a focused regression for mixed positive/negative DCA lanes.
6. Run focused tests, typecheck, lint, guardrails, and diff review.

## Acceptance Criteria
- A positive DCA add at `+20%` records level index `0`.
- A later negative move to `-25%` executes the `-20%` level at index `2`.
- `currentAdds` remains the total count for existing consumers.
- Runtime state persistence preserves the executed index list.
- Runtime DCA dedupe uses the selected level index when available.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed for applicable runtime task rules.
- [x] Focused lifecycle regression added and passing.
- [x] Runtime automation tests passing.
- [x] API typecheck passing.
- [x] Repository guardrails and lint passing.
- [x] Planning/context files updated.
- [x] Learning journal updated for reconfirmed `rg.exe` access-denied pitfall.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- database schema churn for this narrow state-cache fix
- hidden fallback execution paths
- treating `currentAdds` as the only source of DCA lane truth going forward
- changing user-facing strategy configuration semantics

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts --run` PASS (`22/22`).
- Tests: `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`36/36`).
- Tests: `pnpm --filter api exec vitest run src/modules/bots/runtimePositionSerialization.service.test.ts --run` PASS (`8/8`).
- Typecheck: `pnpm --filter api run typecheck` PASS.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Lint: `pnpm run lint` PASS.
- Manual checks: diff review PASS.
- High-risk checks: money-impacting DCA selection now has focused regression
  evidence; no live exchange call was made.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
  - `docs/architecture/06_execution-lifecycle.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, linear `currentAdds` conflicted with mixed-lane
  DCA execution.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable; implementation
  aligned to existing canonical contract.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: not applicable.
- Design source reference: not applicable.
- Required states: not applicable.
- Responsive checks: not applicable.
- Accessibility checks: not applicable.
- Parity evidence: core lifecycle regression applies to shared runtime/replay
  position-management evaluation.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the code and task/context doc changes.
- Observability or alerting impact: existing DCA/protection telemetry remains
  in use.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: DCA level selection used `currentAdds` as one linear pointer.
- Gaps: no focused regression for alternating positive and negative DCA lanes.
- Inconsistencies: `PMPLC-01` requires lane-independent closest-threshold
  execution, while code could block the opposite lane.
- Architecture constraints: reuse existing lifecycle core and preserve
  `currentAdds` compatibility.

### 2. Select One Priority Task
- Selected task: fix mixed positive/negative DCA lane progress in the runtime
  position-management core.
- Priority rationale: money-impacting runtime behavior has higher priority
  than UI polish or broad refactors.
- Why other candidates were deferred: unreachable basic-mode DCA validation
  and exchange protection reshaping need separate slices.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: store executed DCA level indices, select pending levels by current PnL
  direction, and keep `currentAdds` as the count.
- Edge cases: existing states without indices use a deterministic compatibility
  fallback from `currentAdds`.

### 4. Execute Implementation
- Implementation notes: added optional `executedDcaLevelIndices`, persisted it
  in the runtime state store, and returned `dcaLevelIndex` from the evaluator
  so runtime dedupe can key the real selected level.

### 5. Verify and Test
- Validation performed: focused unit tests, runtime automation suite, API
  typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: reorder configured DCA arrays.
- Technical debt introduced: no.
- Scalability assessment: explicit executed indices can support mixed lanes
  without a schema change and remains backward-compatible for cached states.
- Refinements made: funds-estimation path now uses the selected eligible level
  when current PnL is known.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence plus planning/context source-of-truth files.
- Context updated: yes.
- Learning journal updated: yes, reconfirmed `rg.exe` access-denied fallback.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to task nature.
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
Residual risk: durable DCA progress reconstructed only from historical trade
counts cannot know exact historical level indices for older positions. New
runtime state preserves the precise indices from this slice forward.

## Production-Grade Required Contract
- Goal: recorded above.
- Scope: recorded above.
- Implementation Plan: recorded above.
- Acceptance Criteria: recorded above.
- Definition of Done: recorded above.
- Result Report: recorded below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, runtime position-management service path.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable; no DB schema change.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: runtime state store serialization test
  remains green.
- Regression check performed: focused lifecycle and runtime automation suites.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: LIVE/PAPER bot operators using mixed DCA ladders.
- Existing workaround or pain: none safe; incorrect lane blocking is internal.
- Smallest useful slice: explicit executed DCA level indices in existing state.
- Success metric or signal: regression stays green and future DCA tasks build
  on precise level identity.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable for this narrow core fix.
- Critical user journey: automated position lifecycle management.
- SLI: not applicable.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: existing runtime DCA telemetry remains.
- Smoke command or manual smoke: focused automated tests listed above.
- Rollback or disable path: revert commit.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: trading lifecycle state, no secrets.
- Trust boundaries: no new external boundary.
- Permission or ownership checks: unchanged.
- Abuse cases: not applicable.
- Secret handling: none.
- Security tests or scans: not applicable.
- Fail-closed behavior: existing protection/DCA funds gating preserved.
- Residual risk: older reconstructed states may not contain exact DCA indices.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable.
- Memory consistency scenarios: not applicable.
- Multi-step context scenarios: not applicable.
- Adversarial or role-break scenarios: not applicable.
- Prompt injection checks: not applicable.
- Data leakage and unauthorized access checks: not applicable.
- Result: not applicable.

## Result Report
- Task summary: Runtime position management now tracks executed DCA level
  indices, allowing positive and negative DCA lanes to execute independently.
- Files changed: listed in Scope.
- How tested: focused lifecycle, runtime automation, serialization, API
  typecheck, repository guardrails, lint, and diff review.
- What is incomplete: basic-mode unreachable DCA validation and live venue
  protection reshaping remain separate follow-up slices.
- Next steps: add validation warnings for basic `TP`/`SL` configurations that
  make DCA levels unreachable.
- Decisions made: no new DB migration; exact DCA level identity lives in the
  existing runtime state cache while `currentAdds` stays as compatibility
  count.
