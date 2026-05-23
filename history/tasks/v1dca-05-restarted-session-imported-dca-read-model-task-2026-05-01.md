# Task

## Header
- ID: V1DCA-05
- Title: Restore imported DCA visibility across restarted runtime sessions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Codex Execution Agent
- Depends on: `V1DCA-04`
- Priority: P0
- Iteration: 2026-05-01 DCA hotfix follow-up
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active hotfix iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Production verification on deployed commit `15cddb5a` showed the `LIVE` bot's
current runtime session started at `2026-05-01T17:11:21.540Z`, while the open
`ETHUSDT` exchange-synced position was a continuing lifecycle whose current
replacement row opened at `2026-05-01T16:00:03.313Z`. The two real DCA rows
were earlier in the prior runtime session (`2026-05-01T03:20:19.592Z` and
`2026-05-01T13:13:43.493Z`), so the runtime `Positions` read model still
rendered `dcaCount=0`.

## Goal
Make runtime `Positions` reconstruct open imported DCA continuity across a bot
runtime-session restart without broadening ownership beyond the existing
bot/wallet/symbol/management filters and without migrating data.

## Success Signal
- User or operator problem: ETHUSDT had two real DCA adds but the dashboard
  showed `DCA=0`.
- Expected product or reliability outcome: the open ETHUSDT row shows
  `dcaCount=2` after deploy.
- How success will be observed: authenticated production API and dashboard
  runtime Positions response show the DCA ladder on the current session.
- Post-launch learning needed: yes

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- Canonical planning/context docs and learning journal.

## Implementation Plan
1. Confirm production build freshness and inspect authenticated ETHUSDT runtime
   Positions/trades evidence.
2. Extend the lifecycle trade window for runtime `Positions` from
   `session.startedAt` to the earlier of `bot.createdAt` and
   `session.startedAt`.
3. Use the same widened window for continuity reconstruction, not only for the
   query.
4. Include legacy `LIVE` bot-scoped trade rows with `walletId=null` so
   pre-wallet-migration DCA rows remain visible.
5. Fetch same-ownership historical position ids for visible symbols and include
   their direct trades, so DCA rows that lost both bot and wallet refs can still
   be recovered through owned superseded positions.
6. Keep existing close/reopen boundary logic unchanged.
7. Add a focused ETH-like regression where DCA happened before the current
   session and the current open row is a later exchange-sync replacement.

## Acceptance Criteria
- The ETH-like regression returns `dcaCount=2`, planned levels, executed levels,
  and `tradesCount=3`.
- Existing same-symbol close/reopen stale-DCA regression still passes.
- API typecheck/build and repository guardrails pass.
- No migration or UI-only fallback is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed.
- [x] `INTEGRATION_CHECKLIST.md` reviewed.
- [x] `NO_TEMPORARY_SOLUTIONS.md` reviewed.
- [x] `DEPLOYMENT_GATE.md` reviewed.
- [x] Read-model fix implemented.
- [x] Regression coverage added for restarted sessions and fully nullable
  legacy DCA trade refs.
- [x] Focused tests and build checks passed.
- [x] Source-of-truth docs updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Do not create a second DCA source of truth.
- Do not patch production data for a read-model bug.
- Do not weaken close/reopen stale-DCA boundaries.
- Do not add a dashboard-only display fallback.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts` -> PASS, `6/6`
  - `pnpm --filter api run typecheck` -> PASS
  - `pnpm --filter api run build` -> PASS
  - `pnpm run quality:guardrails` -> PASS
  - `git diff --check` -> PASS
- Manual checks:
  - Production before fix on deployed `15cddb5a`: `GET /build-info` returned
    `15cddb5a51bc77085e3272f49104ad59c9275c6f`.
  - Authenticated production before fix: current `ETHUSDT` Positions row
    returned `dcaCount=0`, `tradesCount=1`, current session start
    `2026-05-01T17:11:21.540Z`, position open
    `2026-05-01T16:00:03.313Z`.
  - Authenticated prior-session trades/positions showed ETHUSDT DCA rows at
    `2026-05-01T03:20:19.592Z` and `2026-05-01T13:13:43.493Z`.
- Screenshots/logs: API JSON evidence collected in this execution.
- High-risk checks: same-symbol close/reopen stale-DCA test remains in the
  focused pack and passed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/01_overview-and-principles.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: medium, API read-model behavior changes for runtime Positions.
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the read-model commit if production shows false-positive
  DCA carryover; the close/reopen regression protects the known stale risk.
- Observability or alerting impact: operator-visible API/dashboard response.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production still showed `ETHUSDT dcaCount=0` after `V1DCA-04`.
- Gaps: existing regression did not cover DCA before the current runtime
  session.
- Inconsistencies: trade ledger retained DCA truth while the current session
  read model filtered it out.
- Architecture constraints: use persisted trades as source of truth, keep
  fail-closed ownership and close/reopen boundaries.

### 2. Select One Priority Task
- Selected task: restore imported DCA visibility across restarted sessions.
- Priority rationale: P0 operator-visible live-money dashboard correctness.
- Why other candidates were deferred: broader V1 gates remain separate release
  work; this is the active production regression.

### 3. Plan Implementation
- Files or surfaces to modify: API read model, focused API regression, docs.
- Logic: widen lifecycle trade query and reconstruction start to bot lifetime
  for this runtime read, fetch same-ownership historical position ids for
  visible symbols, while keeping filters strict.
- Edge cases: pre-wallet fully nullable DCA trade refs and stale close/reopen
  DCA.

### 4. Execute Implementation
- Implementation notes: selected `bot.createdAt`, derived
  `lifecycleTradeWindowStart`, added a same-ownership historical position-id
  bridge, and reused existing continuity and dedupe logic.

### 5. Verify and Test
- Validation performed: focused API e2e, API typecheck, API build, guardrails,
  diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: query from current position `openedAt`; rejected
  because production DCA rows occurred before the replacement row opened.
- Technical debt introduced: no
- Scalability assessment: bounded by bot lifetime and visible symbols; no broad
  user-wide matching.
- Refinements made: continuity reconstruction now uses the same widened window
  as the query.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet, task board, project state, MVP queue.
- Context updated: yes
- Learning journal updated: yes

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
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal was updated because a recurring pitfall was confirmed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable, no schema change
- Loading state verified: not applicable, API read-model fix
- Error state verified: not applicable, no new error path
- Refresh/restart behavior verified: yes, focused restarted-session regression
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: authenticated operator runtime data
- Trust boundaries: existing user/bot ownership route guard
- Permission or ownership checks: unchanged
- Abuse cases: no unauthenticated or cross-user query added
- Secret handling: production credentials used only for authenticated probe and
  not written to artifacts.
- Security tests or scans: existing auth-owned e2e route context
- Fail-closed behavior: strict bot/wallet/symbol/management filters retained
- Residual risk: post-deploy production verification still required.

## Result Report
- Task summary: runtime Positions can now recover imported DCA rows from before
  the current runtime session when the open exchange-sync row is a continuing
  bot lifecycle, including legacy DCA rows that are only recoverable through
  owned superseded position ids.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
  - `history/tasks/v1dca-05-restarted-session-imported-dca-read-model-task-2026-05-01.md`
- How tested: commands listed above.
- What is incomplete: production verification after deploy.
- Next steps: commit, push to `main`, wait for Coolify/VPS deploy, then verify
  build-info and authenticated ETHUSDT DCA response.
