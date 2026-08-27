# Task

## Header
- ID: BOTMULTI-04
- Title: api(write): support bot create/update with multiple strategies
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: BOTMULTI-03
- Priority: P1
- Iteration: 2026-05-03 post-V1 BOTMULTI activation, iteration 4
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`BOTMULTI-03` enforced one enabled `ACTIVE` `BotMarketGroup` per bot. The next
safe slice is the API write path: create/update must be able to persist an
ordered strategy-link set inside that single market scope while preserving
current singular `strategyId` compatibility projection.

## Goal
Extend bot create/update API writes to accept and persist multiple ordered
strategy links for one canonical bot market scope.

## Scope
- `apps/api/src/modules/bots/bots.types.ts`
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- BOTMULTI planning/context docs

## Success Signal
- User or operator problem: API cannot yet create or update a bot with more
  than one enabled strategy under the canonical market scope.
- Expected product or reliability outcome: API stores multiple strategy links
  deterministically without creating extra market scopes or legacy mappings.
- How success will be observed: focused bots e2e tests verify create/update
  multi-strategy persistence and existing single-strategy compatibility.
- Post-launch learning needed: no.

## Deliverable For This Stage
Backward-compatible API write support for optional `strategies` arrays on bot
create/update.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add shared strategy-link payload validation.
2. Reuse `BotMarketGroup` and `MarketGroupStrategyLink` in create/update.
3. Keep `Bot.strategyId` as primary compatibility projection from the ordered
   enabled strategy set.
4. Fail closed on unknown/duplicate/disabled-primary strategy mixes.
5. Add focused e2e coverage for create and update.

## Acceptance Criteria
- Existing single-strategy create/update payloads still pass.
- Create can persist multiple `MarketGroupStrategyLink` rows under one active
  `BotMarketGroup`.
- Update can replace the strategy-link set without creating another active
  market group.
- Duplicate active bot guard checks every enabled strategy link in the target
  set.

## Definition of Done
- [x] API validation supports the optional strategy-link set.
- [x] API write path persists ordered links using existing canonical tables.
- [x] Focused e2e coverage passes.
- [x] API typecheck passes.
- [x] Docs/context/queue sync is complete.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new strategy-link persistence systems
- extra active market groups per bot
- temporary bypasses
- silent primary strategy selection when an explicit primary conflicts
- UI/runtime changes outside the write-path slice

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- --run src/modules/bots/bots.multi-strategy-write.e2e.test.ts` => PASS (`1` test).
  - `pnpm --filter api run test -- --run src/modules/bots/bots.e2e.test.ts` => PASS (`26` tests).
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run docs:parity:check` => PASS.
  - `pnpm run quality:guardrails` => PASS after moving the new test into a
    dedicated file to stay under source-size budgets.
- Manual checks:
  - Reviewed create/update writes to confirm they reuse `BotMarketGroup` and
    `MarketGroupStrategyLink`, keep `Bot.strategyId` as primary projection, and
    skip legacy `BotStrategy` writes when `strategies` is supplied.
- Screenshots/logs: not applicable
- High-risk checks: active duplicate checks must cover every enabled strategy

## Architecture Evidence
- Architecture source reviewed: `03_domain-model`, `04_runtime-contexts`,
  runtime merge contract, BOTMULTI plan.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: user approved safe
  architecture-first continuation on 2026-05-03.
- Follow-up architecture doc updates: none expected.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: create/update accept one `strategyId` and write one strategy link.
- Gaps: API cannot replace the canonical link set with multiple strategies.
- Inconsistencies: architecture now allows N enabled strategies, while write
  DTOs are singular.
- Architecture constraints: one active market scope only; compatibility fields
  stay projection-only.

### 2. Select One Priority Task
- Selected task: `BOTMULTI-04`.
- Priority rationale: runtime/web work depends on API persistence.
- Why other candidates were deferred: runtime merge and UI need this write path
  first.

### 3. Plan Implementation
- Files or surfaces to modify: bot DTOs, bot command service, focused bot e2e,
  planning/context docs.
- Logic: optional `strategies` array replaces canonical strategy links for the
  one active market group; `strategyId` remains primary projection.
- Edge cases: duplicate strategy ids, unknown strategies, primary not included
  or disabled, active duplicate bot conflicts.

### 4. Execute Implementation
- Implementation notes: added `strategies` DTO validation, multi-link create
  writes, update replacement of the canonical link set, and focused e2e
  coverage.

### 5. Verify and Test
- Validation performed: focused multi-strategy e2e, existing bots e2e, API
  typecheck, docs parity, and repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only document future API. Rejected because
  BOTMULTI-04 is explicitly a write-path slice.
- Technical debt introduced: no
- Scalability assessment: ordered links remain database-native.
- Refinements made: moved the new e2e into a dedicated test file after
  guardrails flagged `bots.e2e.test.ts` size budget.

### 7. Update Documentation and Knowledge
- Docs updated: runtime contexts architecture, BOTMULTI plan, MVP queue, and
  task artifact.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

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
Web UI and runtime execution remain later BOTMULTI slices.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes, via BOTMULTI-03
- Loading state verified: not applicable
- Error state verified: yes
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused multi-strategy write e2e plus existing
  bots e2e

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operators after multi-strategy UI is enabled
- Existing workaround or pain: operators can only assign one strategy at bot
  create/update.
- Smallest useful slice: API write support with focused e2e coverage.
- Success metric or signal: a bot can persist two ordered enabled strategy
  links under one market group.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: bot create/update
- SLI: write requests fail closed on invalid strategy sets
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: API error response
- Smoke command or manual smoke: focused e2e
- Rollback or disable path: omit `strategies` payload to keep legacy
  single-strategy behavior.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: bot topology metadata
- Trust boundaries: authenticated dashboard API
- Permission or ownership checks: all strategies must belong to the user
- Abuse cases: linking another user's strategy, duplicate strategy ids,
  disabling the explicit primary strategy
- Secret handling: unchanged
- Security tests or scans: focused ownership/error e2e
- Fail-closed behavior: invalid sets reject before writes
- Residual risk: runtime and UI still need BOTMULTI-05..07.

## Result Report

- Task summary: extended bot create/update writes with optional ordered
  `strategies` payloads that persist multiple canonical
  `MarketGroupStrategyLink` rows under one active `BotMarketGroup`.
- Files changed: bot DTOs, bot command service, focused multi-strategy e2e
  test, architecture/runtime-context doc, planning/context docs.
- How tested: focused multi-strategy e2e, existing bots e2e, API typecheck,
  docs parity, and repository guardrails.
- What is incomplete: runtime multi-strategy evaluation, lifecycle ownership,
  web UI, and closure evidence remain in `BOTMULTI-05..08`.
- Next steps: continue to `BOTMULTI-05` runtime signal-merge execution.
- Decisions made: keep `strategyId` as primary compatibility projection while
  `strategies` is the canonical ordered write set for the single market scope.
