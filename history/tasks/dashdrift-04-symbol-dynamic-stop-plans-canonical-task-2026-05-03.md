# Task

## Header
- ID: DASHDRIFT-04
- Title: Keep symbol-level dynamic-stop plans canonical-context scoped
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: DASHDRIFT-03
- Priority: P1
- Iteration: 17
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position rows can enrich DCA/TTP/TSL display from strategy plans by
symbol. After canonical bot topology was introduced, stale legacy
`BotStrategy` rows remain as compatibility data but cannot override active
canonical strategy links for selected-bot dashboard truth.

## Goal
Prevent stale legacy advanced-close `BotStrategy` rows from overriding
canonical symbol-level trailing stop and trailing take-profit plans when active
canonical strategy links already define that symbol.

## Scope
- `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts`
- `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
- `docs/modules/api-bots.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard row-level TTP/TSL plans can be polluted
  by stale legacy strategy topology.
- Expected product or reliability outcome: symbol-level dynamic-stop plans
  reflect canonical selected-bot topology before legacy compatibility data.
- How success will be observed: canonical basic-close strategy plus stale
  legacy advanced-close link returns empty TTP/TSL symbol plans.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-ready fix, regression evidence, and source-of-truth documentation.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Inspect `runtimeStrategyDisplayBySymbol` map-building precedence.
2. Keep canonical strategy links allowed to resolve their symbol maps first.
3. Allow legacy links to fill only symbols that have no canonical map entry.
4. Add a regression that calls symbol-level TTP/TSL plan helpers directly.
5. Run focused and broader runtime position validations.
6. Update context and module docs.

## Acceptance Criteria
- Legacy TTP/TSL plans cannot replace an existing canonical symbol map entry.
- Canonical multiple-link behavior within canonical topology remains unchanged.
- Legacy fallback remains available when no canonical symbol map entry exists.
- Runtime position/dynamic-stop tests pass.

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
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-strategy-context.e2e.test.ts --run --sequence.concurrent=false` PASS (`4/4`)
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-strategy-context.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts --run --sequence.concurrent=false` PASS (`40/40`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
- Manual checks:
  - Reviewed symbol-level DCA/TTP/TSL helper precedence.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - Existing dynamic-stop operator truth tests retained row-truth behavior.

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
- Canonical visual target: row-level TTP/TSL plans reflect canonical runtime
  strategy topology.
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: runtime positions API payload.
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none known.
- Required states: loading | empty | error | success unchanged.
- Responsive checks: desktop | tablet | mobile unchanged.
- Input-mode checks: touch | pointer | keyboard unchanged.
- Accessibility checks: no DOM changes.
- Parity evidence: direct e2e regression on symbol-level TTP/TSL helper output.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore legacy overwrite behavior for
  symbol-level TTP/TSL plans.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: symbol-level TTP/TSL map builders allowed legacy advanced-close plans
  to overwrite an already-present canonical empty plan.
- Gaps: regression only covered column visibility, not row-level helper plans.
- Inconsistencies: DCA map already blocked legacy once canonical created a
  symbol entry.
- Architecture constraints: canonical topology is authoritative when present.

### 2. Select One Priority Task
- Selected task: `DASHDRIFT-04`.
- Priority rationale: row-level dashboard position data must not reflect stale
  legacy strategy topology.
- Why other candidates were deferred: order context direct `strategyId` remains
  non-authoritative for execution/lifecycle.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `runtimeStrategyDisplayBySymbol.service.ts`
  - `bots.runtime-strategy-context.e2e.test.ts`
- Logic: legacy TTP/TSL assignment skips symbols already populated by canonical
  processing.
- Edge cases: canonical link priority behavior remains unchanged.

### 4. Execute Implementation
- Implementation notes: added an `allowExistingOverride` control local to each
  trailing plan helper; canonical passes allow overrides inside canonical
  processing, legacy does not.

### 5. Verify and Test
- Validation performed: focused runtime strategy-context test and broader bot
  runtime/dynamic-stop pack.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: skip all legacy links whenever any canonical link
  exists.
- Technical debt introduced: no.
- Scalability assessment: preserves legacy fallback per missing symbol.
- Refinements made: direct helper regression added.

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
This slice affects display/read-model plan enrichment only. Runtime automation
execution remains position/strategy scoped.

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
- Existing workaround or pain: stale TTP/TSL display could contradict current
  strategy topology.
- Smallest useful slice: symbol-level TTP/TSL map precedence.
- Success metric or signal: focused and broader test packs pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: selected-bot position management dashboard truth.
- SLI: runtime positions payload correctness.
- SLO: not formally defined for this display helper.
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
- Task summary: symbol-level TTP/TSL plan maps now keep canonical entries
  authoritative before legacy compatibility links.
- Files changed:
  - `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-strategy-context.e2e.test.ts`
  - `docs/modules/api-bots.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused and broader bot runtime/dynamic-stop packs.
- What is incomplete: production deployment/readback not performed in this
  slice.
- Next steps: continue one-slice runtime/dashboard drift audit.
- Decisions made: canonical symbol plan entries are authoritative over stale
  legacy strategy links.
