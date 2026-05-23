# Task

## Header
- ID: RUNTIME-AUDIT-62
- Title: Show dynamic-stop columns for planned pre-arm levels
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-61
- Priority: P1
- Iteration: 80
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard dynamic-stop visibility was aligned on the web surface in
`RUNTIME-AUDIT-61`, but the API session positions contract still derives
`showDynamicStopColumns` only from armed dynamic stop-loss values. A row can have
canonical planned TTP/TSL levels before the arm threshold is reached, and the
dashboard must still receive a truthful API signal so live and paper management
surfaces do not drift.

## Goal
Make `/dashboard/bots/:botId/runtime-sessions/:sessionId/positions` expose
`showDynamicStopColumns=true` when an open position has planned trailing
take-profit or trailing stop levels, even if the dynamic stop has not armed yet.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- this task evidence file

## Success Signal
- User or operator problem: API and dashboard disagree about pre-arm dynamic stop visibility.
- Expected product or reliability outcome: planned TTP/TSL levels keep dynamic-stop columns visible before activation.
- How success will be observed: focused API e2e regression fails before the fix and passes after it.
- Post-launch learning needed: no

## Deliverable For This Stage
One tested backend contract correction plus updated planning and project state.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add an e2e regression where a bot's active strategy is basic, but an open
   legacy position still owns an advanced dynamic-stop strategy with planned TTP
   levels below the arm threshold.
2. Update the API visibility predicate to treat planned trailing TTP/TSL levels
   as row-level dynamic-stop truth.
3. Run focused API tests, typecheck, lint, guardrails, and diff whitespace check.
4. Update canonical task and project state docs.

## Acceptance Criteria
- API returns `showDynamicStopColumns=true` for a visible open item with planned
  TTP levels and `dynamicTtpStopLoss=null`.
- Existing armed dynamic-stop operator truth remains unchanged.
- No new endpoint, schema, or parallel visibility mechanism is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied with validation evidence.
- [x] Focused e2e regression covers the pre-arm planned-level case.
- [x] Relevant repository truth files are updated.

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
  - `pnpm --filter api run test -- src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts --run --sequence.concurrent=false` PASS (`3/3`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks: source inspection confirmed API used armed dynamic values only
- Screenshots/logs: not applicable
- High-risk checks: fail-closed ownership unchanged; display-only API contract

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

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
- Remaining mismatches: none expected
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: API contract test

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous API visibility predicate
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API visibility predicate ignored planned levels when stops were not armed.
- Gaps: pre-arm planned dynamic-stop truth lacked direct backend regression coverage.
- Inconsistencies: web row-level truth was broader than API session-level truth.
- Architecture constraints: runtime positions API remains the dashboard source for session position state.

### 2. Select One Priority Task
- Selected task: expose planned dynamic-stop levels in `showDynamicStopColumns`.
- Priority rationale: directly affects live and paper position-management observability.
- Why other candidates were deferred: broader import and wallet audits need separate, isolated slices.

### 3. Plan Implementation
- Files or surfaces to modify: API runtime session positions service, focused e2e test, planning/context docs.
- Logic: include non-empty planned trailing TTP/TSL arrays in the existing visibility predicate.
- Edge cases: pre-arm dynamic values null, legacy position strategy after bot topology downgrade.

### 4. Execute Implementation
- Implementation notes: updated the existing session positions visibility
  predicate to include non-empty `trailingTakeProfitLevels` and
  `trailingStopLevels`; added a pre-arm planned-level e2e regression and aligned
  existing operator-truth fixtures to assigned market-group symbols.

### 5. Verify and Test
- Validation performed: focused e2e, API typecheck, lint, repository
  guardrails, and diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: reusing the existing row-level predicate was
  simpler and safer than adding a new visibility source.
- Technical debt introduced: no
- Scalability assessment: bounded to already serialized visible rows and does
  not add DB work.
- Refinements made: compacted the predicate after guardrails caught the service
  crossing the production monolith line budget.

### 7. Update Documentation and Knowledge
- Docs updated: task file, MVP next commits queue.
- Context updated: task board, project state.
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
- [x] Learning journal was updated if a recurring pitfall is confirmed.

## Notes
This is a display-contract correction only. It must not affect execution,
exchange calls, ownership checks, or lifecycle state transitions.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB -> validation -> error handling -> test. Partial implementations, mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: live and paper bot operators reading dashboard position-management state
- Existing workaround or pain: columns may be hidden before dynamic stops arm despite planned levels existing
- Smallest useful slice: one API visibility predicate and one e2e regression
- Success metric or signal: focused API e2e passes
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: runtime position dashboard inspection
- SLI: runtime positions endpoint returns truthful display contract for scoped positions
- SLO: not applicable for this code-only slice
- Error budget posture: not applicable
- Health/readiness check: not affected
- Logs, dashboard, or alert route: not affected
- Smoke command or manual smoke: focused e2e test
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: no migration required
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: dynamic-stop operator truth e2e (`3/3`)

## AI Testing Evidence

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: user-owned bot/runtime position metadata
- Trust boundaries: existing authenticated dashboard route and ownership filtering unchanged
- Permission or ownership checks: unchanged
- Abuse cases: no new data exposure path introduced
- Secret handling: no secret changes
- Security tests or scans: existing route tests rely on owner-authenticated requests
- Fail-closed behavior: execution/lifecycle behavior unchanged
- Residual risk: low display-contract risk

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: API dynamic-stop column visibility now treats planned trailing
  TTP/TSL levels as row truth before dynamic stops arm.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.dynamic-stop-operator-truth.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-62-planned-dynamic-stop-columns-task-2026-05-03.md`
- How tested: focused e2e (`3/3`), API typecheck, lint, guardrails, diff check.
- What is incomplete: broader live import and wallet audits remain separate
  follow-up slices.
- Next steps: continue with the next smallest LIVE/PAPER runtime drift audit.
- Decisions made: no architecture change; existing API/display contract was
  extended to include planned row-level dynamic-stop truth.
