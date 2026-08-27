# Task

## Header
- ID: BOT-DELETE-ACTIVE-PAPER-2026-05-11
- Title: Fix active PAPER bot delete confirmation path
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: user-reported `SOAR-BOTS-001`
- Priority: P0
- Module Confidence Rows: `SOAR-BOTS-001`
- Requirement Rows: `REQ-FUNC-001`
- Quality Scenario Rows: `QA-001`
- Risk Rows: `RISK-001`
- Iteration: 2026-05-11-BOT-DELETE
- Operation Mode: BUILDER
- Mission ID: BOT-DELETE-ACTIVE-PAPER-2026-05-11
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches default continuation when no numeric rotation is active.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were updated with project-specific rows.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by addressing a P0 broken bot action.

## Mission Block
- Mission objective: restore the active PAPER bot deletion path without weakening LIVE delete guardrails.
- Release objective advanced: V1 action-level product correctness for Bots.
- Included slices: inspect UI/API delete path, adjust PAPER delete guard, add regression coverage, run focused validation, sync state.
- Explicit exclusions: controlled LIVE activation, production destructive delete clickthrough, unrelated bot action audits.
- Checkpoint cadence: after analysis, implementation, validation, and state sync.
- Stop conditions: architecture conflict, missing local validation capability, or any live-money action requirement.
- Handoff expectation: next agent can continue from module confidence row and validation notes.

## Context
The module confidence ledger recorded `SOAR-BOTS-001` as P0 `BROKEN` after the operator reported bot deletion did not work in Soar UI. API delete already has broad e2e coverage, so the smallest safe slice was the UI decision path for deleting active PAPER bots.

## Goal
Allow active PAPER bot deletion to call the normal delete action directly while keeping LIVE-mode or LIVE-opt-in bots behind the existing LIVE risk confirmation.

## Success Signal
- User or operator problem: deleting an active PAPER bot should not be blocked by a misleading LIVE confirmation.
- Expected product or reliability outcome: PAPER delete works through the UI controller path; LIVE delete still requires explicit confirmation.
- How success will be observed: regression test proves active PAPER delete calls `deleteBot` and does not show the LIVE confirmation; API delete e2e remains green.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verified code fix plus source-of-truth state updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the selected bot-delete mission

## Definition of Done
- [x] Active PAPER delete no longer uses the LIVE confirmation condition.
- [x] LIVE or live-opt-in delete still uses the LIVE confirmation condition.
- [x] Web regression and API delete e2e evidence are recorded.
- [x] Source-of-truth files are updated.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- live-money or destructive production actions

## Validation Evidence
- Tests:
  - `corepack pnpm@10.13.1 --filter web run test -- src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx --run` passed as a broad Web Vitest run: `147` files, `501` tests.
  - From `apps/api`, with `DATABASE_URL` loaded from `.env` without printing it: `.\node_modules\.bin\vitest.CMD run src/modules/bots/bots.e2e.test.ts --sequence.concurrent=false` passed: `1` file, `27` tests.
  - `corepack pnpm@10.13.1 --filter web run typecheck` passed.
  - `node scripts/repoGuardrails.mjs` passed.
  - `git diff --check` passed with line-ending warnings only.
- Manual checks: inspected Web delete controller and API delete cleanup path.
- Screenshots/logs: not applicable; no browser production clickthrough was run.
- High-risk checks: no live-money action executed; LIVE delete confirmation remains.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: `SOAR-BOTS-001`.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: `REQ-FUNC-001`.
- Quality scenarios updated: yes.
- Quality scenario rows closed or changed: `QA-001`.
- Risk register updated: yes.
- Risk rows closed or changed: `RISK-001`.
- Reality status: partially verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`, `docs/modules/system-modules.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Bots UI and action-level regression matrix.
- Canonical visual target: existing Bots management/list table behavior.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: no, targeted behavior fix only.
- Visual-direction brief reviewed: no, targeted behavior fix only.
- Existing shared pattern reused: existing `useAsyncConfirm` LIVE risk modal.
- New shared pattern introduced: no.
- Design-memory entry reused: not applicable.
- Design-memory update required: no.
- Visual gap audit completed: not applicable.
- Required states: success and blocked confirmation paths covered; loading/error unchanged.
- Responsive checks: no layout changed.
- Input-mode checks: pointer path covered by component tests.
- Accessibility checks: existing button/modal accessible names preserved.
- Parity evidence: test asserts active PAPER delete does not show LIVE confirmation; existing LIVE confirmation test remains.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: revert the hook condition and test if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `SOAR-BOTS-001` marked bot delete as P0 broken.
- Gaps: production clickthrough was not available in this safe local slice.
- Inconsistencies: active PAPER bot deletion was routed through LIVE risk confirmation because `isActive` was included in the LIVE delete guard.
- Architecture constraints: bot CRUD belongs to `bots`; safety guardrails must remain fail-closed for LIVE contexts.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: yes.
- Missing or template-like files: requirements, quality, and risk tables only had process seed rows.
- Sources scanned: module ledger, task board, architecture overview, module map, Web/API bot delete code and tests.
- Rows created or corrected: `REQ-FUNC-001`, `QA-001`, `RISK-001`.
- Assumptions recorded: active PAPER deletion is safe to proceed without LIVE risk modal; LIVE or live-opt-in deletion remains protected.
- Blocking unknowns: production report confirmation remains open.
- Why it was safe to continue: no live-money action or architecture change was required.

### 2. Select One Priority Mission Objective
- Selected task: fix active PAPER bot delete confirmation path.
- Priority rationale: P0 broken bot action outranks missing proof work.
- Why other candidates were deferred: controlled LIVE proof requires explicit operator approval; Dashboard proof is lower priority than a reported broken action.

### 3. Plan Implementation
- Files or surfaces to modify: `useBotsListController.ts`, `BotsManagement.test.tsx`, source-of-truth docs/state.
- Logic: remove `isActive` from LIVE delete confirmation criteria; keep `mode === "LIVE"` and `liveOptIn`.
- Edge cases: active PAPER, active LIVE, live opt-in, API cleanup and ownership isolation.

### 4. Execute Implementation
- Implementation notes: added `deletesLiveTradingContext` local predicate and a regression test for active PAPER delete.

### 5. Verify and Test
- Validation performed: Web test run, API bots e2e with explicit `DATABASE_URL`, Web typecheck, guardrails, diff check.
- Result: local UI/API evidence passed; initial broad API command failed because the package script passed arguments incorrectly and did not expose `DATABASE_URL` to Prisma, then the documented local guardrail fixed the run.

### 6. Self-Review
- Simpler option considered: only changing the condition without tests.
- Technical debt introduced: no.
- Scalability assessment: predicate keeps current controller contract simple and explicit.
- Refinements made: added regression evidence for the exact active PAPER path.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, task board, project state, module confidence, requirement matrix, quality scenarios, risk register, system health, next steps, MVP next commits.
- Context updated: yes.
- Learning journal updated: not needed; existing `2026-05-10 - API readiness tests may need explicit DATABASE_URL load` entry applied.

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

## Result Report
- Task summary: fixed active PAPER bot deletion so it no longer asks for LIVE-risk confirmation; LIVE delete guard remains.
- Files changed: `apps/web/src/features/bots/hooks/useBotsListController.ts`, `apps/web/src/features/bots/components/BotsManagement.test.tsx`, source-of-truth docs/state.
- How tested: Web Vitest, API bots e2e, Web typecheck, guardrails, diff check.
- What is incomplete: no production browser delete clickthrough was run.
- Next steps: run a safe production/non-destructive bot action clickthrough only with operator-approved representative data.
- Decisions made: `isActive` alone is not a LIVE trading context; `mode === "LIVE"` or `liveOptIn` is.
