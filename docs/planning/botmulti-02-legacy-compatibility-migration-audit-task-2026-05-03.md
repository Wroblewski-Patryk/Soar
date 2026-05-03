# Task

## Header
- ID: BOTMULTI-02
- Title: Inventory legacy compatibility remnants and migration debt
- Task Type: research
- Current Stage: analysis
- Status: DONE
- Owner: Planning Agent
- Depends on: BOTMULTI-01
- Priority: P1
- Iteration: 2026-05-03 post-V1 BOTMULTI activation
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`BOTMULTI-01` froze the post-V1 target:

```text
1 bot = 1 wallet + 1 active symbol-group market scope + N enabled strategies
```

`BOTMULTI-02` audits current schema, API, runtime, order, and web surfaces
against that target before schema or implementation work begins.

## Goal
Classify the existing bot/strategy topology surfaces as canonical,
compatibility-only, stale, or migration debt. Stop before implementation if an
architecture-vs-code mismatch requires an explicit decision.

## Success Signal
- User or operator problem: the multi-strategy wave must not revive ambiguous
  legacy topology.
- Expected product or reliability outcome: implementation tasks start from a
  precise debt map.
- How success will be observed: every major surface has a disposition and the
  blocker is explicit.
- Post-launch learning needed: no.

## Deliverable For This Stage
Audit inventory and blocker classification only. No code, schema, API, runtime,
or UI changes.

## Scope
- `apps/api/prisma/schema.prisma`
- `apps/api/src/modules/bots/*`
- `apps/api/src/modules/engine/runtimeSignalLoop.repository.ts`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts`
- `apps/api/src/modules/engine/runtimeSignalMerge.ts`
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
- `apps/web/src/features/bots/*`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- BOTMULTI planning/context docs.

## Implementation Plan
1. Review canonical schema topology.
2. Review bot create/update/read/projection paths.
3. Review runtime topology, final-candle decision, and merge implementation.
4. Review manual-order strategy context resolution.
5. Review web bot form/list/runtime exposure.
6. Classify compatibility and migration debt.
7. Stop if architecture and implementation conflict.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within analysis stage
- do not continue to schema/API/runtime changes while a decision is pending

## Acceptance Criteria
- Inventory names all material BOTMULTI migration surfaces.
- Each surface is classified.
- Any architecture-vs-code mismatch is surfaced with options.
- `BOTMULTI-03` is not started until the decision is made.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are represented for an analysis task.
- [x] Current surfaces are inventoried.
- [x] Mismatch is identified and options are documented.
- [x] No implementation work was started.
- [x] User decision is received for the blocking priority semantics mismatch.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- implementation before resolving architecture mismatch
- silent priority semantic changes

## Inventory
| Surface | Current state | Classification | Follow-up |
| --- | --- | --- | --- |
| Prisma `BotMarketGroup` / `MarketGroupStrategyLink` | Schema already has market-group and strategy-link tables with `priority`, `weight`, and enabled flags. | Canonical candidate. | `BOTMULTI-03` should enforce one active market group per bot or define migration constraints. |
| Prisma `Bot.strategyId`, `Bot.symbolGroupId`, `BotStrategy` | Direct singular fields and legacy link table still exist. | Compatibility-only / migration debt. | `BOTMULTI-03` must decide persistence compatibility window and backfill/drop path. |
| Bot create/update DTO | `CreateBotSchema` and `UpdateBotSchema` accept one `strategyId` and one `marketGroupId`. | Migration debt. | `BOTMULTI-04` must introduce strategy-link payload or separate attach flow. |
| Bot create command | Creates one bot, one active market group, one strategy link, and stores direct `strategyId` / `symbolGroupId`. | Transitional. | `BOTMULTI-04` must keep canonical writes link-first and direct fields projection-only. |
| Bot market-group service | CRUD supports many bot market groups and strategy links. | Partly canonical, partly over-broad for BOTMULTI-01. | `BOTMULTI-03/04` must fail closed on multiple active market scopes for this wave. |
| Bot read projection | `bots.repository.ts` includes direct `strategy` and `symbolGroup`; response mapper returns one projected strategy. | Compatibility projection. | `BOTMULTI-04/07` must expose strategy set while preserving old projection if needed. |
| Legacy strategy upsert | `botLegacyStrategyLink.service.ts` writes `BotStrategy` and may auto-create default symbol groups. | Stale compatibility debt. | `BOTMULTI-03` should remove from canonical writes or isolate as legacy repair only. |
| Runtime active topology | `runtimeSignalLoop.repository.ts` selects direct `Bot.strategyId`, `Bot.symbolGroupId`, `strategy`, `symbolGroup`, while topology version observes groups/links. | Migration debt. | `BOTMULTI-05` must read active group/link topology as canonical. |
| Runtime context type | `ActiveBotRuntimeContext` holds one `strategy` and one `strategyId`. | Migration debt. | `BOTMULTI-05` must carry strategy array plus primary provenance. |
| Final-candle decision | `eligibleStrategies = [runtimeContext.strategy]`; only one strategy is evaluated. | Migration debt. | `BOTMULTI-05` must evaluate all enabled links for the active group. |
| Runtime merge helper | `mergeRuntimeStrategyVotes` accepts many strategies/votes and returns winner metadata. | Canonical candidate with blocker. | Priority semantics mismatch must be resolved before implementation. |
| Manual order context | Direct bot strategy wins first; canonical links fallback selects `group.strategyLinks[0]`; legacy links fallback remains. | Migration debt and fail-closed gap for BOTMULTI. | `BOTMULTI-04/06` must reject ambiguous multi-strategy manual context unless explicit strategy is provided. |
| Web bot form | `BotCreateEditForm` selects one strategy and submits one `strategyId`. | Migration debt. | `BOTMULTI-07` needs multi-select/order/weight UI and clear validation states. |
| Web bot list/runtime types | Current list surfaces project one strategy name/context. | Compatibility projection. | `BOTMULTI-07` must show strategy set and runtime provenance without overstating control. |
| Tests | Existing tests cover singular create/update plus some strategy-link orchestration and runtime merge pieces. | Mixed. | `BOTMULTI-03..08` need red/green tests for link-first write, merge, manual-order ambiguity, and lifecycle ownership. |

## Blocking Mismatch
`docs/architecture/reference/runtime-signal-merge-contract.md` still describes
tie-break priority as higher numeric `priority` winning, while current
implementation uses lower numeric `priority` first:

- `botMarketGroups.service.ts` lists and reorders links by `priority: asc`.
- `runtimeSignalMerge.ts` sorts exit and directional winner votes with
  `left.priority - right.priority`.
- `botResponseMapper.service.ts` also selects projected primary strategy with
  lower numeric priority first.

This was architecture-vs-implementation drift in a money-impacting runtime
decision contract. The user selected the safe architecture/code direction on
2026-05-03: lower numeric `priority` wins.

## Decision Options
1. Make lower numeric priority canonical. Selected 2026-05-03.
   - Matches existing code and common "rank 1 first" semantics.
   - Requires architecture doc correction and focused tests locking ascending
     priority behavior.
2. Keep higher numeric priority canonical.
   - Matches the current wording in the merge reference.
   - Requires runtime, projection, CRUD ordering, tests, and possible data
     migration to avoid inverted strategy behavior.
3. Rename/clarify the field contract before implementation.
   - For example, freeze `executionRank` / `sortOrder` as lower-first and keep
     `weight` for score strength.
   - Highest clarity, but requires broader schema/API migration and likely more
     UI copy work.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/engine/runtimeSignalMerge.test.ts` => PASS (`2` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run docs:parity:check` => PASS.
  - `pnpm run quality:guardrails` => PASS.
- Manual checks:
  - Reviewed schema bot topology around `Bot`, `BotStrategy`,
    `BotMarketGroup`, and `MarketGroupStrategyLink`.
  - Reviewed bot command/read/projection and market-group services.
  - Reviewed runtime topology, final-candle decision, and merge helper.
  - Reviewed manual-order context resolution.
  - Reviewed web bot create/edit form and bot feature file layout.
- Screenshots/logs: not applicable.
- High-risk checks: no LIVE mutation, code change, schema change, or deployment.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes, after priority semantics were clarified.
- Mismatch discovered: yes, resolved in this task.
- Decision required from user: received 2026-05-03.
- Approval reference if architecture changed: user approved safe
  architecture-first continuation in chat on 2026-05-03.
- Follow-up architecture doc updates:
  `docs/architecture/reference/runtime-signal-merge-contract.md` now states
  lower numeric priority wins.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: current dashboard design system.
- Canonical visual target: future bot create/edit and monitoring surfaces.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: not applicable for analysis.
- Visual-direction brief reviewed: not applicable.
- Existing shared pattern reused: future `BOTMULTI-07` should reuse shared
  form/table patterns.
- New shared pattern introduced: no.
- Design-memory entry reused: not applicable.
- Design-memory update required: only if future multi-strategy controls create
  an approved new pattern.
- Visual gap audit completed: no.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: not required.
- Remaining mismatches: web form is single-strategy.
- Required states: future UI work must cover loading, empty, error, success.
- Responsive checks: future UI work.
- Input-mode checks: future UI work.
- Accessibility checks: future UI work.
- Parity evidence: not applicable.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: docs-only audit; no runtime rollback.
- Observability or alerting impact: future runtime merge must preserve trace
  metadata.
- Staged rollout or feature flag: future implementation tasks must define.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current code is partially link-aware but runtime/write/UI still use
  singular strategy assumptions.
- Gaps: implementation debt remains for `BOTMULTI-03..08`.
- Inconsistencies: architecture says one post-V1 strategy set, code still
  projects and evaluates one strategy.
- Architecture constraints: no money-path ambiguity, fail-closed manual order,
  deterministic merge, position-scoped protection ownership.

### 2. Select One Priority Task
- Selected task: `BOTMULTI-02`.
- Priority rationale: it is the next planned task and must precede schema/API
  changes.
- Why other candidates were deferred: `BOTMULTI-03..08` depend on this debt map
  and the priority decision.

### 3. Plan Implementation
- Files or surfaces to modify: planning/context docs only.
- Logic: inventory and classify, then stop on architecture mismatch.
- Edge cases: conditional compatibility paths must not be misread as approved
  canonical behavior.

### 4. Execute Implementation
- Implementation notes: no product code changed. Audit artifact produced.

### 5. Verify and Test
- Validation performed: source inspection and repository guardrails after sync.
- Result: audit complete; `BOTMULTI-03` can proceed.

### 6. Self-Review
- Simpler option considered: assume lower-first priority because code already
  does that.
- Technical debt introduced: no.
- Scalability assessment: the blocker is small to decide now and expensive to
  correct after schema/UI/runtime changes.
- Refinements made: separated canonical candidates from compatibility debt.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this audit artifact
  - context and queue docs
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed as blocked.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run after final sync.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update is not applicable.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: future multi-strategy bot operators.
- Existing workaround or pain: current code can only safely expose one strategy
  in create/edit/runtime paths.
- Smallest useful slice: audit and decision gate.
- Success metric or signal: user selected canonical priority semantics and the
  contract/test lock was added.
- Feature flag, staged rollout, or disable path: future implementation.
- Post-launch feedback or metric check: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: future multi-strategy runtime decision and operator
  trace.
- SLI: not applicable.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not impacted.
- Logs, dashboard, or alert route: future merge trace must preserve strategy
  provenance.
- Smoke command or manual smoke: not applicable.
- Rollback or disable path: no runtime change.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: represented through pre-implementation
  inventory.
- Real API/service path used: source inspection only.
- Endpoint and client contract match: currently not BOTMULTI-ready.
- DB schema and migrations verified: schema inspected, not changed.
- Loading state verified: not applicable.
- Error state verified: manual-order ambiguity gap identified.
- Refresh/restart behavior verified: not changed.
- Regression check performed: repository guardrails after sync.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: trading configuration, runtime strategy provenance,
  orders, positions.
- Trust boundaries: browser, API, DB, runtime engine, exchange adapters.
- Permission or ownership checks: future implementation must preserve current
  ownership isolation.
- Abuse cases: silent strategy priority inversion could create unintended
  trading behavior.
- Secret handling: not touched.
- Security tests or scans: not required.
- Fail-closed behavior: manual-order ambiguity gap identified.
- Residual risk: BOTMULTI implementation remains incomplete until
  `BOTMULTI-03..08`.

## Result Report
- Task summary: inventoried BOTMULTI migration debt, resolved the priority
  semantics mismatch by making lower numeric priority canonical, and added a
  focused merge regression lock.
- Files changed: planning/context documentation, architecture reference, and
  focused runtime merge test.
- How tested: source inspection, focused API merge test, docs parity, and
  repository guardrails.
- What is incomplete: schema/API/runtime/web implementation remains in
  `BOTMULTI-03..08`.
- Next steps: continue to `BOTMULTI-03` schema and migration planning.
- Decisions made: lower numeric strategy-link priority wins.
