# Task

## Header
- ID: DASHDRIFT-03
- Title: Keep dynamic-stop column visibility canonical-context scoped
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: DASHDRIFT-02, POSDRIFT-12
- Priority: P1
- Iteration: 16
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position dashboard payloads expose `showDynamicStopColumns` so the web
surface can decide whether TTP/TSL columns belong in the selected bot view.
After the canonical multi-strategy topology work, stale legacy `BotStrategy`
rows can remain as compatibility data. Those rows must not override active
canonical `BotMarketGroup` / `MarketGroupStrategyLink` strategy truth.

## Goal
Make dynamic-stop column visibility use active canonical strategy links when
they exist, with legacy `BotStrategy` rows only as a no-canonical-topology
compatibility fallback.

## Scope
- `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts`
- `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
- `docs/modules/api-bots.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard TTP/TSL column visibility can look stale
  after strategy topology changes.
- Expected product or reliability outcome: dashboard dynamic-stop columns
  reflect current canonical bot strategy topology.
- How success will be observed: stale legacy advanced-close rows no longer turn
  on dynamic-stop columns when canonical active strategy links are basic.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready fix, regression coverage, and source-of-truth documentation.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Inspect runtime position read and strategy-display helpers for legacy vs
   canonical precedence.
2. Change `resolveBotAdvancedCloseMode` to prefer canonical active strategy
   links whenever present.
3. Add an e2e regression with canonical basic close strategy plus stale legacy
   advanced close link.
4. Run focused and broader bot runtime validations.
5. Update source-of-truth docs and context.

## Acceptance Criteria
- `showDynamicStopColumns=false` when active canonical strategy links are basic
  and stale legacy links are advanced.
- Legacy links remain supported when no active canonical strategy topology
  exists.
- Existing dynamic-stop operator truth tests keep passing.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this scoped runtime/display fix.
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
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-strategy-context.e2e.test.ts --run --sequence.concurrent=false` PASS (`3/3`)
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts --run --sequence.concurrent=false` PASS (`31/31`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
- Manual checks:
  - Reviewed runtime position read `showDynamicStopColumns` pipeline.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - Regression confirms stale legacy advanced close does not override canonical
    basic close for dashboard column visibility.

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
- Design source reference: existing dashboard runtime position table contract.
- Canonical visual target: dynamic-stop columns reflect API `showDynamicStopColumns`.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: dashboard runtime positions payload.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none known.
- Required states: loading | empty | error | success are unchanged.
- Responsive checks: desktop | tablet | mobile unchanged.
- Input-mode checks: touch | pointer | keyboard unchanged.
- Accessibility checks: no DOM changes.
- Parity evidence: API payload visibility flag now follows canonical topology.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore legacy-union visibility behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `resolveBotAdvancedCloseMode` used both canonical and legacy strategy
  configs, allowing stale legacy advanced-close rows to affect dashboard
  visibility.
- Gaps: no regression covered stale legacy advanced vs canonical basic close.
- Inconsistencies: other runtime strategy display paths already prefer
  canonical context before legacy fallback.
- Architecture constraints: canonical topology is authoritative when present.

### 2. Select One Priority Task
- Selected task: `DASHDRIFT-03`.
- Priority rationale: visible dashboard truth drift in the position-management
  surface.
- Why other candidates were deferred: order-context direct `strategyId` was
  found to be non-authoritative for execution/lifecycle.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `runtimeStrategyDisplayBySymbol.service.ts`
  - `bots.runtime-strategy-context.e2e.test.ts`
- Logic: canonical configs first; legacy configs only when canonical links are
  absent.
- Edge cases: no canonical links keeps legacy fallback.

### 4. Execute Implementation
- Implementation notes: changed only the config set used by
  `resolveBotAdvancedCloseMode`; DCA/TTP/TSL per-symbol plan resolution remains
  untouched.

### 5. Verify and Test
- Validation performed: focused and broader bot runtime packs.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: removing legacy lookup entirely.
- Technical debt introduced: no.
- Scalability assessment: preserves existing query shape and compatibility.
- Refinements made: test covers the stale legacy advanced-close branch directly.

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
This slice intentionally does not change runtime automation execution. It only
keeps dashboard column visibility aligned with canonical selected-bot topology.

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
- Existing workaround or pain: stale strategy projection could make TTP/TSL
  display inconsistent with the real configured strategy.
- Smallest useful slice: `showDynamicStopColumns` canonical precedence.
- Success metric or signal: regression PASS and no dynamic-stop pack regression.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: selected-bot position management dashboard truth.
- SLI: dashboard runtime positions response correctness.
- SLO: not formally defined for this display flag.
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
- Security tests or scans: existing e2e ownership coverage retained in broader
  bot pack.
- Fail-closed behavior: canonical topology remains authoritative when present.
- Residual risk: none known for this display-only slice.

## Result Report
- Task summary: dynamic-stop dashboard column visibility now ignores stale
  legacy advanced-close strategy links when active canonical strategy topology
  exists.
- Files changed:
  - `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
  - `docs/modules/api-bots.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused and broader bot runtime e2e packs.
- What is incomplete: production deployment/readback not performed in this
  slice.
- Next steps: continue one-slice runtime/dashboard drift audit.
- Decisions made: canonical strategy links are authoritative for selected-bot
  dynamic-stop column visibility.
