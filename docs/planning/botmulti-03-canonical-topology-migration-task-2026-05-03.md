# Task

## Header
- ID: BOTMULTI-03
- Title: db(schema): finalize canonical multi-strategy topology and migration path
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: DB/Migrations
- Depends on: BOTMULTI-02
- Priority: P1
- Iteration: 2026-05-03 post-V1 BOTMULTI activation, iteration 3
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`BOTMULTI-01` froze the target topology:

```text
1 bot = 1 wallet + 1 active symbol-group market scope + N enabled strategies
```

`BOTMULTI-02` inventoried the migration debt and resolved strategy-link
priority semantics. The current schema already contains the canonical
`BotMarketGroup` and `MarketGroupStrategyLink` graph, but the database does not
yet fail closed on more than one enabled `ACTIVE` market group for the same bot.

## Goal
Finalize the persistence-level topology boundary for the post-V1
multi-strategy bot model without introducing a parallel linking system.

## Scope
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/*_enforce_single_active_bot_market_group/migration.sql`
- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: multi-strategy work cannot reintroduce ambiguous
  multi-market-scope bot execution.
- Expected product or reliability outcome: database and architecture both
  enforce the same one-active-market-scope invariant.
- How success will be observed: Prisma schema validates, focused migration SQL
  review confirms fail-closed conflict handling, and repository guardrails pass.
- Post-launch learning needed: no.

## Deliverable For This Stage
A small schema/migration slice that reuses the approved topology and prevents
multiple enabled `ACTIVE` `BotMarketGroup` rows per bot.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add a manual PostgreSQL migration with a preflight conflict check.
2. Create a partial unique index on `BotMarketGroup(botId)` for rows where
   `isEnabled = true` and `lifecycleStatus = 'ACTIVE'`.
3. Add Prisma schema documentation comments because Prisma cannot model partial
   indexes directly.
4. Update architecture/planning/context docs with the persistence boundary and
   migration behavior.
5. Run Prisma validation, API typecheck, docs parity, and repository guardrails.

## Acceptance Criteria
- Existing `BotMarketGroup` and `MarketGroupStrategyLink` remain the canonical
  persistence model.
- Database migration fails closed with an explicit error if existing data has
  multiple enabled `ACTIVE` market groups for one bot.
- Database migration enforces at most one enabled `ACTIVE` market group per bot
  after it succeeds.
- Compatibility fields remain documented as projection/migration-only until
  later BOTMULTI slices remove their write/runtime precedence.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are represented for this schema slice.
- [x] Persistence invariant is enforced in migration SQL.
- [x] Prisma schema documents the unsupported partial-index invariant.
- [x] Architecture and planning docs are synchronized.
- [x] Relevant validations pass.

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
- automatic production data mutation to resolve multiple active market scopes

## Validation Evidence
- Tests:
  - `pnpm --filter api exec prisma validate` => PASS.
  - `pnpm --filter api run typecheck` => PASS.
  - `pnpm run docs:parity:check` => PASS.
  - `pnpm run quality:guardrails` => PASS.
- Manual checks:
  - Reviewed migration SQL: preflight raises an explicit exception when a bot
    already has more than one enabled `ACTIVE` `BotMarketGroup`.
  - `pnpm --filter api exec prisma migrate status` connected to local
    `cryptosparrow` and reported the new migration as not yet applied, which is
    expected before deploy/apply.
- Screenshots/logs:
  - not applicable
- High-risk checks:
  - migration must fail closed instead of silently choosing one active scope

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: user approved safe
  architecture-first continuation on 2026-05-03.
- Follow-up architecture doc updates: persistence boundary note for the partial
  unique index.

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: web bot form remains single-strategy for BOTMULTI-07.
- Required states: future UI work must cover loading, empty, error, success.
- Responsive checks: future UI work.
- Input-mode checks: future UI work.
- Accessibility checks: future UI work.
- Parity evidence: not applicable.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: remove the new partial unique index if rollback is required;
  no production data is mutated by this migration.
- Observability or alerting impact: migration error explicitly identifies
  conflicting bot ids before schema enforcement.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: schema allows more than one enabled `ACTIVE` market group for one bot.
- Gaps: partial unique index is missing because Prisma schema cannot express it.
- Inconsistencies: architecture states one active market scope per bot, while
  the database only has `@@unique([botId, symbolGroupId])`.
- Architecture constraints: reuse `BotMarketGroup` and
  `MarketGroupStrategyLink`; compatibility fields cannot become canonical.

### 2. Select One Priority Task
- Selected task: `BOTMULTI-03`.
- Priority rationale: schema boundary must be safe before API/runtime writes are
  expanded for multiple strategies.
- Why other candidates were deferred: API, runtime, and web work depend on this
  persistence invariant.

### 3. Plan Implementation
- Files or surfaces to modify: Prisma migration/schema plus source-of-truth
  docs/context.
- Logic: fail closed on existing duplicate active scopes, then enforce a
  partial unique index for future writes.
- Edge cases: existing duplicate active scopes must block migration rather than
  silently pause/archive rows.

### 4. Execute Implementation
- Implementation notes: added a manual PostgreSQL migration with an explicit
  conflict preflight and partial unique index
  `BotMarketGroup_one_active_scope_per_bot_idx`.

### 5. Verify and Test
- Validation performed: Prisma schema validation, API typecheck, docs parity,
  repository guardrails, and local migration status inspection.
- Result: PASS for schema/type/docs/guardrails. Migration status shows the new
  migration is pending local application, as expected.

### 6. Self-Review
- Simpler option considered: document-only closure. Rejected because it would
  leave database behavior weaker than architecture.
- Technical debt introduced: no
- Scalability assessment: partial unique index keeps the invariant cheap and
  database-native.
- Refinements made: kept compatibility fields in place and documented why the
  unsupported partial index is owned by migration SQL.

### 7. Update Documentation and Knowledge
- Docs updated: architecture docs, BOTMULTI plan, task evidence, MVP queue, and
  execution plan.
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
This slice intentionally does not remove `Bot.strategyId`, `Bot.symbolGroupId`,
or `BotStrategy`; those compatibility/write-path changes belong to later
BOTMULTI tasks.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: not applicable for migration-only slice
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: Prisma validation, API typecheck, docs parity,
  and repository guardrails

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operators using multi-strategy bots after V1.
- Existing workaround or pain: without DB enforcement, API/runtime code could
  accidentally revive multi-market-scope ambiguity.
- Smallest useful slice: one partial unique index with a fail-closed preflight.
- Success metric or signal: no bot can have two enabled `ACTIVE` market groups.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: bot activation and runtime market-scope resolution
- SLI: migration succeeds only when data satisfies one-active-scope invariant
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: migration error names conflict cause
- Smoke command or manual smoke: `pnpm --filter api exec prisma migrate status`
  confirmed the migration is pending local application.
- Rollback or disable path: drop the partial unique index

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
- Trust boundaries: database invariant protects API/runtime callers
- Permission or ownership checks: unchanged
- Abuse cases: malformed writes attempting multiple active market scopes
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: migration blocks ambiguous existing data
- Residual risk: later API write paths must expose multi-strategy edits safely

## Result Report

- Task summary: finalized the database-level one-active-market-scope invariant
  for post-V1 multi-strategy bots with a fail-closed migration preflight and a
  partial unique index.
- Files changed: Prisma schema, new migration SQL, architecture docs, planning
  packet, queue/context files, and this task artifact.
- How tested: `pnpm --filter api exec prisma validate`, `pnpm --filter api run
  typecheck`, `pnpm run docs:parity:check`, `pnpm run quality:guardrails`, and
  `pnpm --filter api exec prisma migrate status`.
- What is incomplete: API write support, runtime merge integration, lifecycle
  ownership, web UI, and final closure remain in `BOTMULTI-04..08`.
- Next steps: continue to `BOTMULTI-04` API write-path support.
- Decisions made: use the existing canonical `BotMarketGroup` /
  `MarketGroupStrategyLink` graph and enforce one enabled `ACTIVE`
  `BotMarketGroup` per bot at the database layer.
