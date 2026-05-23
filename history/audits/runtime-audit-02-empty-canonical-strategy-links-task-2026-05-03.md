# Task

## Header
- ID: RUNTIME-AUDIT-02
- Title: Fail closed when canonical runtime market group has no enabled strategy links
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: DASHDRIFT-05
- Priority: P1
- Iteration: 19
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The post-V1 runtime topology contract makes active canonical
`BotMarketGroup` / enabled `MarketGroupStrategyLink` rows authoritative. Legacy
`Bot.strategyId` remains a compatibility fallback only when canonical topology
is absent. If an active canonical group exists but has no enabled strategy
links, runtime must not silently execute or display legacy strategy context.

## Goal
Ensure PAPER/LIVE runtime topology and runtime symbol-stats read context fail
closed when the active canonical market group has no enabled strategy links.

## Scope
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts`
- `docs/modules/api-engine.md`
- `docs/modules/api-bots.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: a bot can appear runnable or signal-configured from
  stale legacy strategy projection even though its canonical strategy links are
  disabled or absent.
- Expected product or reliability outcome: canonical empty strategy topology is
  explicitly non-actionable.
- How success will be observed: runtime context is `null` and symbol-stats
  strategy assignments are empty when canonical group exists without enabled
  links.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready runtime/read-model fail-closed fix with regression evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Audit runtime topology and symbol-stats configured context fallback rules.
2. Restrict direct legacy strategy fallback to bots with no canonical group.
3. Keep canonical group with zero enabled links as empty strategy context.
4. Add focused regressions for runtime execution topology and symbol-stats
   configured context.
5. Run focused and broader runtime/symbol-stats validations.
6. Update source-of-truth docs and context.

## Acceptance Criteria
- Runtime signal loop does not build an executable runtime context from
  `Bot.strategyId` when an active canonical group exists without enabled links.
- Runtime symbol-stats does not use legacy strategy projection in that same
  empty canonical-link state.
- Legacy fallback remains available only when canonical topology is absent.
- Focused and broader runtime tests pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this scoped runtime hardening fix.
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
  - `pnpm --filter api test -- src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts --run --sequence.concurrent=false` PASS (`11/11`)
  - `pnpm --filter api test -- src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false` PASS (`78/78`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
- Manual checks:
  - Reviewed post-V1 runtime topology contract and selected-bot scope docs.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - Regression confirms no legacy execution fallback when canonical group is
    present but empty of enabled strategy links.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/modules/api-engine.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: selected-bot runtime signal/market dashboard
  contract.
- Canonical visual target: dashboard configured strategy context reflects
  canonical enabled links only.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: runtime symbol-stats read model.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none known.
- Required states: empty canonical strategy context is represented as no
  configured strategy.
- Responsive checks: desktop | tablet | mobile unchanged.
- Input-mode checks: touch | pointer | keyboard unchanged.
- Accessibility checks: no DOM changes.
- Parity evidence: runtime execution and symbol-stats tests cover same
  fail-closed topology.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore legacy fallback under empty
  canonical strategy-link topology.
- Observability or alerting impact: no new telemetry.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime and symbol-stats could use `Bot.strategyId` even when active
  canonical group existed with no enabled strategy links.
- Gaps: no regression covered empty canonical strategy-link topology.
- Inconsistencies: manual order context already fails closed for canonical
  groups without exactly one matching strategy.
- Architecture constraints: canonical links are authoritative once canonical
  topology exists.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-02`.
- Priority rationale: execution topology can affect PAPER/LIVE opening
  decisions, not only dashboard display.
- Why other candidates were deferred: positions/trades symbol filtering was
  not changed because direct bot-owned rows may need to remain visible for risk
  and history.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `runtimeSignalLoopDefaults.ts`
  - `runtimeSessionSymbolStatsRead.service.ts`
- Logic: direct strategy fallback requires `!canonicalGroup`.
- Edge cases: bots without canonical topology keep legacy compatibility
  fallback.

### 4. Execute Implementation
- Implementation notes: changed only fallback conditions; no new runtime
  subsystem or query path was introduced.

### 5. Verify and Test
- Validation performed: focused defaults/symbol-stats tests and broader
  runtime loop/symbol-stats pack.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: removing all legacy fallback.
- Technical debt introduced: no.
- Scalability assessment: aligns with migration contract and keeps legacy bots
  operational where canonical topology is absent.
- Refinements made: added read-model regression alongside execution regression.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/modules/api-engine.md`
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
This fix does not delete legacy strategy compatibility. It prevents legacy
projection from overriding an explicitly present canonical topology that has no
enabled strategy links.

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
- User or operator affected: PAPER/LIVE bot operator.
- Existing workaround or pain: disabled/empty canonical strategy links could be
  masked by stale legacy strategy projection.
- Smallest useful slice: fallback condition on runtime topology and read model.
- Success metric or signal: focused and broader tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: PAPER/LIVE signal evaluation and selected-bot signal
  display.
- SLI: runtime topology correctness.
- SLO: not formally defined for this internal topology helper.
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused runtime topology regression.
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
- Trust boundaries: authenticated dashboard API and internal runtime worker.
- Permission or ownership checks: unchanged.
- Abuse cases: no new write or privilege path.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable for this internal fallback condition.
- Fail-closed behavior: empty canonical strategy-link topology no longer
  executes or displays stale legacy strategy context.
- Residual risk: none known for this scoped topology fix.

## Result Report
- Task summary: runtime execution and symbol-stats read context now fail closed
  when active canonical market group has no enabled strategy links.
- Files changed:
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
  - `apps/api/src/modules/engine/runtimeSignalLoopDefaults.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts`
  - `docs/modules/api-engine.md`
  - `docs/modules/api-bots.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused and broader runtime/symbol-stats packs.
- What is incomplete: production deployment/readback not performed in this
  slice.
- Next steps: continue one-slice runtime/dashboard drift audit.
- Decisions made: legacy strategy fallback is allowed only when canonical group
  topology is absent.
