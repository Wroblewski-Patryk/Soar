# Task

## Header
- ID: POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14
- Title: Verify inactive PAPER strategy edit Web/API parity
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: `POSTV1-OPERATOR-FEEDBACK-INTAKE-2026-05-14`
- Priority: P1
- Module Confidence Rows: `SOAR-STRATEGIES-001`
- Requirement Rows: `REQ-FUNC-009`
- Quality Scenario Rows: `QA-009`
- Risk Rows: `RISK-009`
- Iteration: 2026-05-14 post-V1 continuation
- Operation Mode: BUILDER
- Mission ID: `POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the continuation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was previously reviewed in this post-V1 continuation session.
- [x] `.agents/core/mission-control.md` was previously reviewed in this post-V1 continuation session.
- [x] Missing or template-like state tables were not found for this slice.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by proving the user-facing edit path, not only backend behavior.

## Mission Block
- Mission objective: verify that strategy edit works through Web when backend allows the linked inactive PAPER bot case, while still surfacing active-bot locks precisely.
- Release objective advanced: post-V1 function confidence for strategy authoring.
- Included slices: Web edit-page submit/active-lock tests, API strategy guard rerun, docs/state updates.
- Explicit exclusions: no strategy snapshot/versioning implementation, no production deploy, no live trading, no exchange mutation.
- Checkpoint cadence: complete implementation and focused validation in one bounded slice.
- Stop conditions: backend and Web contract mismatch, failing focused tests, or architecture mismatch.
- Handoff expectation: record exact proof and remaining follow-ups.

## Context
User feedback identified inactive PAPER strategy editing as suspicious. API coverage already had active-bot blocking and inactive-bot allowance, but the Web edit page test only proved loading/rendering. This left a gap in the actual user-facing submit path.

## Goal
Prove the full Web/API behavior for strategy edit guard parity:
- inactive linked bots do not block strategy update,
- active linked bots still block update,
- the Web page surfaces the active-bot lock with a recovery action.

## Scope
- `apps/web/src/app/dashboard/strategies/[id]/edit/page.test.tsx`
- `apps/api/src/modules/strategies/strategies.e2e.test.ts` validation only
- `docs/modules/api-strategies.md`
- `docs/modules/web-strategies.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/quality-attribute-scenarios.md`
- `.agents/state/risk-register.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/next-steps.md`

## Implementation Plan
1. Inspect API strategy active-bot guard and existing tests.
2. Inspect Web strategy edit page and current route tests.
3. Extend the Web edit-page test mock to execute `onSubmit`.
4. Add Web tests for successful update and active-bot lock rendering.
5. Rerun focused Web/API strategy suites.
6. Update source-of-truth files with the new proof.

## Acceptance Criteria
- Web edit page calls `updateStrategy(id, form)` when the loaded form is submitted and the backend allows the update.
- Web edit page does not show an active-bot lock on successful submit.
- Web edit page renders active-bot lock details and bot-settings navigation when backend returns the active-bot guard.
- API strategy e2e still proves active linked bot blocks and inactive linked bot allows update.

## Definition of Done
- [x] Focused Web edit-page tests pass.
- [x] Focused Web strategies suite passes.
- [x] Focused API strategies e2e passes.
- [x] Docs/state ledgers are updated with the proof.
- [x] Broader typecheck/guardrails pass before commit.

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run 'src/app/dashboard/strategies/[id]/edit/page.test.tsx' --run` PASS (`3/3`).
  - `pnpm --filter web exec vitest run src/features/strategies src/app/dashboard/strategies --run` PASS (`14` files, `48` tests).
  - `pnpm --filter api exec vitest run src/modules/strategies/strategies.e2e.test.ts --run` PASS (`11/11`).
  - `pnpm run typecheck` PASS.
  - `pnpm run lint` PASS.
  - `pnpm run build` PASS.
  - `pnpm run quality:guardrails` PASS.
- Manual checks:
  - Inspected Web `StrategiesEditPage` active-bot lock handling and API `strategies.service.ts` guard logic.
- Screenshots/logs: not applicable; focused component/API proof.
- High-risk checks: no production mutation, live order/cancel/close, exchange-side mutation, or credential use.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: `SOAR-STRATEGIES-001`.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: `REQ-FUNC-009`.
- Quality scenarios updated: yes.
- Quality scenario rows closed or changed: `QA-009`.
- Risk register updated: yes.
- Risk rows closed or changed: `RISK-009`.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-strategies.md`, `docs/modules/web-strategies.md`, `docs/modules/system-modules.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: existing shared strategy edit page.
- Design source reference: `docs/modules/web-strategies.md`.
- Required states: loading, error, success submit, active-bot blocked submit.
- Responsive checks: not rendered in browser for this non-layout proof.
- Input-mode checks: pointer submit and active-lock action covered by component tests.
- Accessibility checks: active-lock action is a real button with accessible name.
- Parity evidence: Web submit and active-lock behavior now matches API active/inactive bot guard contract.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not needed.
- Rollback note: revert the test/docs commit; no production behavior change in this slice.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Web edit-page proof did not submit the strategy form.
- Gaps: API inactive-bot allowance existed, but the user-facing Web path lacked direct submit proof.
- Inconsistencies: none found in implementation.
- Architecture constraints: preserve backend active-bot safety guard.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: strategy API service/tests, Web edit page/tests, module docs.
- Rows created or corrected: existing strategy rows updated; no new requirement needed.
- Assumptions recorded: inactive PAPER strategy edit means backend allows update when linked bots are inactive.
- Blocking unknowns: none.
- Why it was safe to continue: tests only, no runtime behavior or production data mutation.

### 2. Select One Priority Mission Objective
- Selected task: inactive PAPER strategy edit proof.
- Priority rationale: directly tied to a suspected user-facing function failure.
- Why other candidates were deferred: dashboard layout and snapshot history are broader; this proof is smaller and function-critical.

### 3. Plan Implementation
- Files or surfaces to modify: Web edit page test and source-of-truth docs/state.
- Logic: invoke the mocked form `onSubmit` and assert success/error behavior.
- Edge cases: backend active-bot guard with details, successful allowed update.

### 4. Execute Implementation
- Implementation notes: extended the mocked `StrategyForm` to expose a submit button and added success plus active-lock tests.

### 5. Verify and Test
- Validation performed: focused Web edit-page test, Web strategies suite, API strategies e2e.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: relying only on existing API inactive-bot test.
- Technical debt introduced: no.
- Scalability assessment: Web route test now protects the real operator submit path.
- Refinements made: active-bot lock assertion includes bot-settings navigation and toast details.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, API/Web strategies module docs, state ledgers.
- Context updated: task board, project state, next steps.
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
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update was not required.

## Result Report
- Task summary: proved inactive linked bot strategy updates through API and user-facing Web submit path, while preserving active-bot lock behavior.
- Files changed: Web strategy edit test plus docs/state.
- How tested: focused Web/API strategy tests listed above, typecheck PASS, lint PASS, build PASS, guardrails PASS, `git diff --check` PASS with line-ending warnings only, touched-file credential scan PASS.
- What is incomplete: no production deploy or browser screenshot in this slice.
- Next steps: commit and push.
- Decisions made: no runtime behavior change was needed because the implementation already matched the intended contract; the missing piece was Web submit evidence.
