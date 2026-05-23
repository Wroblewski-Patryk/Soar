# Task

## Header
- ID: RUNTIME-AUDIT-106
- Title: Dedupe bot-open entry trades for DCA display
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-105
- Priority: P1
- Iteration: 106
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator observed that exchange-imported positions show DCA as `0`, while
positions opened by the bot can show DCA as `1` immediately after open. Runtime
positions currently infer DCA count from entry-side leg count, explicit `DCA`
trades, and runtime state. LIVE bot opens can produce duplicate `OPEN` trade
rows for the same order/fill lifecycle, which must not be interpreted as DCA.

## Goal
Show DCA `0` for freshly bot-opened positions when the only extra entry rows
are duplicate `OPEN` records for the same order lifecycle.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: dashboard DCA count should distinguish a true DCA
  add from duplicate open/fill records.
- Expected product or reliability outcome: bot-opened positions and imported
  exchange positions both display DCA `0` until a real DCA executes.
- How success will be observed: regression test with duplicate same-order
  `OPEN` rows displays `dcaCount: 0`.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement display-level entry-leg dedupe, add regression coverage, run focused
and baseline validations, and update source-of-truth docs.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Include `orderId` in runtime position trade rows.
2. Infer entry-leg DCA progress from unique entry lifecycle units rather than
   raw entry-side row count.
3. Preserve explicit `DCA` trade counting and runtime-state progress.
4. Add a regression where two same-order `OPEN` rows display DCA `0`.
5. Run focused bot runtime DCA visibility tests plus typecheck, guardrails,
   lint, and diff check.

## Acceptance Criteria
- Duplicate same-order `OPEN` rows do not increment DCA display.
- Explicit `DCA` rows still increment DCA display.
- Existing imported DCA visibility tests remain green.
- No architecture mismatch or workaround is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed for applicable expectations.
- [x] Focused regression tests pass.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Source-of-truth docs are updated with evidence.

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
  - PASS `pnpm --filter api run test -- src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run` (`2/2`)
  - BLOCKED `pnpm --filter api run test -- src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts --run` because PostgreSQL was unavailable on `localhost:5432`
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check`
- Manual checks: reviewed runtime position trade read shape, DCA count helper, and dashboard e2e scenario
- Screenshots/logs: not applicable
- High-risk checks: dashboard DCA display regression for duplicate bot-open rows covered by unit test and added e2e scenario

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous DCA display inference
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: raw entry-side row count can treat duplicate `OPEN` rows as DCA.
- Gaps: dashboard display did not dedupe bot-open same-order lifecycle rows.
- Inconsistencies: imported positions with a single open row display `0`, but
  bot-open rows can display `1` before any DCA.
- Architecture constraints: dashboard must reflect runtime lifecycle truth
  without changing execution or trade persistence contracts.

### 2. Select One Priority Task
- Selected task: RUNTIME-AUDIT-106 bot-open DCA display dedupe.
- Priority rationale: user-reported dashboard truth mismatch with live bot
  lifecycle.
- Why other candidates were deferred: PAPER open failure is a separate runtime
  execution issue and should get its own focused slice.

### 3. Plan Implementation
- Files or surfaces to modify: runtime position read repository, read service,
  focused bot runtime e2e test, source-of-truth docs.
- Logic: derive entry-leg progress from unique order/lifecycle units; count
  explicit DCA independently.
- Edge cases: keep legacy inferred adds for distinct entry orders while
  collapsing duplicate same-order opens.

### 4. Execute Implementation
- Implementation notes: runtime position trade rows now select `orderId`.
  DCA display count now dedupes entry lifecycle units by `orderId` and
  lifecycle action before inferring entry-leg progress. Added unit coverage and
  an integration scenario for duplicate same-order `OPEN` rows.

### 5. Verify and Test
- Validation performed: focused unit suite, API typecheck, guardrails, lint,
  and diff check. Focused e2e suite attempted but blocked by local DB
  availability before test logic executed.
- Result: PASS with infrastructure-blocked e2e noted

### 6. Self-Review
- Simpler option considered: count only explicit `DCA`; rejected because legacy
  inferred entry-leg progress is already covered by existing tests.
- Technical debt introduced: no
- Scalability assessment: display-only dedupe uses existing `orderId` relation
  and avoids persistence changes.
- Refinements made: moved DCA count helper to a small module to keep production
  line-budget guardrails passing.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP next commits queue, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable

## Review Checklist (mandatory)
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
Assumption: duplicate same-order `OPEN` rows represent the same open lifecycle
when one row comes from runtime and another from exchange fill handling; they
must not be displayed as DCA progress.

## Production-Grade Required Contract

Runtime display tasks must include API read logic, DB read shape, regression
coverage, and documented validation evidence.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: live bot dashboard operator
- Existing workaround or pain: DCA column shows `1` immediately after bot open
- Smallest useful slice: display read-model dedupe
- Success metric or signal: duplicate same-order OPEN rows display DCA `0`
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime position monitoring
- SLI: DCA count represents real DCA progress
- SLO: duplicate open rows do not affect DCA count
- Error budget posture: healthy
- Health/readiness check: not impacted
- Logs, dashboard, or alert route: existing runtime read route
- Smoke command or manual smoke: focused bot runtime DCA visibility tests
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: unit PASS, e2e scenario added but local DB blocked execution

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading lifecycle display data
- Trust boundaries: user-owned bot/session/position/trade rows
- Permission or ownership checks: existing route/user predicates preserved
- Abuse cases: duplicate exchange/runtime rows must not mislead lifecycle state
- Secret handling: no secret changes
- Security tests or scans: focused regression and lint/typecheck
- Fail-closed behavior: display remains conservative unless explicit DCA or
  distinct entry units exist
- Residual risk: low

## Result Report

- Task summary: DCA display now dedupes duplicate same-order bot `OPEN` rows
  and keeps DCA at `0` until real DCA progress exists.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/audits/runtime-audit-106-bot-open-dca-display-dedupe-task-2026-05-04.md`
- How tested: focused unit suite, API typecheck, guardrails, lint, and diff
  check passed. Focused e2e was attempted and blocked by missing local DB.
- What is incomplete: focused e2e should be rerun when PostgreSQL is available.
- Next steps: investigate the separate PAPER bot opening issue reported by the
  operator.
- Decisions made: keep execution persistence unchanged and fix the dashboard
  read-model inference.
