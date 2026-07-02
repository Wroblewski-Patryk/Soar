# LUC-5590 Repair QA Repeatable API/Backtests Infra Teardown Sequencing

## Header
- ID: LUC-5590
- Title: Repair QA repeatable api/backtests infra teardown sequencing
- Task Type: fix
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: QA/Test
- Depends on: LUC-5586 local Docker/Postgres/Redis availability
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001 / safe regression baseline; QA repeatable smoke runner
- Iteration: 2026-06-27 LUC-5590
- Operation Mode: TESTER
- Mission ID: LUC-5590-QA-REPEATABLE-API-BACKTESTS-INFRA-TEARDOWN-SEQUENCING-2026-06-27
- Mission Status: PARTIALLY_VERIFIED / TEARDOWN_SEQUENCING_REPAIRED / API_PACK_DB_CLEANUP_RESIDUAL

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue role and current tester lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/state/active-mission.md` and `.agents/state/next-steps.md` were reviewed.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: repair the repeatable QA runner so a selected `api,backtests` run does not leave Backtests dependent on infra torn down by the preceding API wrapper.
- Release objective advanced: local repeatable DB-backed regression proof for V1.
- Included slices: repeatable smoke command routing, `goLiveSmoke` Backtests target support, script contract tests, focused real runner evidence classification.
- Explicit exclusions: production smoke, deploy, push, secret/account readback, exchange action, payment/subscription mutation, live trading, broad API test-harness refactor.
- Checkpoint cadence: one heartbeat verification checkpoint.
- Stop conditions: script contract verified and real runner residual classified; stop before broad unrelated DB cleanup refactor.
- Handoff expectation: close teardown sequencing as repaired; route remaining API-pack DB cleanup flake as a follow-up blocker if full command still fails.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| QA/Test | 09 TAE | LUC-5590 wake, LUC-5586 residual, runner scripts | `scripts/runQaRepeatableSmokeE2e.mjs`, `scripts/goLiveSmoke.mjs`, tests, evidence | sequencing repair verification | focused Node contract tests and real runner artifact | PARTIALLY_VERIFIED |
| Backend/Test Harness follow-up | Backend + QA | real runner artifact | API DB-backed e2e cleanup order | separate fix for API pack cleanup residue | rerun `api,backtests` after fix | ROUTED |
| Documentation/Memory | 09 TAE | project state files | task/evidence/state notes | durable status and residual risk | source-of-truth updates | DONE |

## Context
[LUC-5586](/LUC/issues/LUC-5586) restored local Docker Desktop, Postgres, and Redis and proved API plus focused Backtests while infra stayed available. It left [LUC-5590](/LUC/issues/LUC-5590) for Test Automation because the combined repeatable command previously allowed the API wrapper to run `docker compose down` before a bare Backtests command.

## Goal
Make `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests` use infra-aware ownership for both selected DB-backed checks, so Backtests can run after API teardown without depending on the previous wrapper's Compose lifetime.

## Scope
- `scripts/runQaRepeatableSmokeE2e.mjs`
- `scripts/runQaRepeatableSmokeE2e.test.mjs`
- `scripts/goLiveSmoke.mjs`
- `scripts/goLiveSmoke.test.mjs`
- `package.json` script `test:go-live:backtests:with-infra`
- LUC-5590 task/evidence/state notes

## Implementation Plan
1. Keep repeatable API smoke routed through `test:go-live:api:with-infra`.
2. Route repeatable Backtests smoke through `test:go-live:backtests:with-infra`.
3. Add `goLiveSmoke --target=backtests` so Backtests has its own infra setup, migration, focused pack, and teardown.
4. Lock both command contracts with focused Node tests.
5. Run focused script tests.
6. Run or read the real repeatable artifact and classify failures by layer.

## Acceptance Criteria
- Repeatable `api` check invokes the infra-aware API wrapper.
- Repeatable `backtests` check invokes the infra-aware Backtests wrapper.
- `goLiveSmoke --target=backtests` starts infra, runs migrations, executes the focused Backtests e2e file, and tears down only the infra it started.
- Focused contract tests pass.
- Real runner evidence distinguishes teardown sequencing from remaining API-pack failures.

## Definition of Done
- [x] Backtests repeatable check owns local infra independently.
- [x] Focused runner and wrapper contract tests pass.
- [x] Real `api,backtests` artifact shows Backtests can run after API teardown.
- [ ] Full `api,backtests` command exits zero. Blocked by separate API-pack DB cleanup residue.

## Validation Evidence
- `pnpm exec node --test scripts/goLiveSmoke.test.mjs scripts/runQaRepeatableSmokeE2e.test.mjs` PASS (`20/20`).
- `history/artifacts/luc-5590-api-backtests-teardown-sequencing-2026-06-27.json` real runner artifact:
  - `API smoke pack` FAIL after running `pnpm run test:go-live:api:with-infra`.
  - API wrapper did run `docker compose down`.
  - `Focused backtests e2e` then PASS through `pnpm run test:go-live:backtests:with-infra`.
  - Backtests wrapper recreated/started Postgres and Redis, applied migrations, ran `src/modules/backtests/backtests.e2e.test.ts`, and tore down its own Compose services.
- `history/evidence/luc-5590-api-backtests-teardown-sequencing-2026-06-27.md` records the same check summary.
- Reality status: partially verified.

## Residual / Follow-Up
- The original teardown sequencing problem is repaired: Backtests no longer depends on infra surviving from the previous API check.
- The full repeatable command still exits nonzero because the API smoke pack fails inside `apps/api/src/modules/backtests/backtests.e2e.test.ts` before the standalone Backtests segment:
  - missing user after `registerAndLogin` / `findUniqueOrThrow`;
  - FK cleanup failures on `BotMarketGroup_symbolGroupId_fkey`;
  - FK cleanup failures on `MarketUniverse_userId_fkey`;
  - FK cleanup failures on `Position_userId_fkey`.
- Classification: separate shared-DB API e2e cleanup/isolation issue, not the teardown sequencing issue.
- Next owner/action: Backend + QA should repair broad API DB-backed e2e cleanup isolation/order, then rerun `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests`.

## Architecture Evidence
- Architecture source reviewed: `.agents/state/active-mission.md`, `.agents/state/next-steps.md`, LUC-5586 evidence, existing smoke runner scripts.
- Fits approved architecture: yes, reuses existing `goLiveSmoke` local infra wrapper.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: not needed for script-only test automation routing.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: repeatable Backtests now uses the infra-aware smoke wrapper.
- Rollback note: revert `scripts/runQaRepeatableSmokeE2e.mjs`, `scripts/runQaRepeatableSmokeE2e.test.mjs`, `scripts/goLiveSmoke.mjs`, and `scripts/goLiveSmoke.test.mjs`.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: combined repeatable DB-backed runner had an infra lifetime gap after the API wrapper.
- Gaps: full command still fails due API-pack DB cleanup residue.
- Inconsistencies: Backtests focused standalone proof passed while broad API pack's embedded Backtests file failed.
- Architecture constraints: reuse existing local infra wrapper; do not bypass DB-backed tests.

### 2. Select One Priority Mission Objective
- Selected task: close [LUC-5590](/LUC/issues/LUC-5590) teardown sequencing for repeatable API/Backtests smoke.
- Priority rationale: [LUC-5586](/LUC/issues/LUC-5586) explicitly delegated this residual to Test Automation.
- Why other candidates were deferred: API-pack DB cleanup is adjacent but broader than teardown sequencing and needs a separate owner/follow-up.

### 3. Plan Implementation
- Files or surfaces to modify: runner scripts and tests, evidence/state.
- Logic: make both DB-backed selected checks infra-aware and let `goLiveSmoke` own focused Backtests.
- Edge cases: API check failure must not prevent the Backtests check from proving its own infra path under default continue-on-fail behavior.

### 4. Execute Implementation
- Implementation notes: repeatable Backtests command uses `pnpm run test:go-live:backtests:with-infra`; `goLiveSmoke` supports `--target=backtests` through a focused target command.

### 5. Verify and Test
- Validation performed: focused Node tests and real artifact classification.
- Result: script contract pass; real Backtests segment pass after API teardown; full command still nonzero due API DB cleanup residual.

### 6. Self-Review
- Simpler option considered: documenting that Backtests can be run manually after API. Rejected because repeatable automation must own the sequence.
- Technical debt introduced: no.
- Scalability assessment: the wrapper now centralizes DB-backed smoke infra ownership per selected check.
- Refinements made: residual split recorded instead of hiding the API-pack failure.

### 7. Update Documentation and Knowledge
- Docs updated: this task record and LUC-5590 evidence/state notes.
- Context updated: active mission, next steps, task board, project state, module confidence ledger.
- Learning journal updated: not required; the residual is a newly classified follow-up, not a confirmed repeated tooling pitfall in this task.

## Review Checklist
- [x] Process self-audit completed before implementation closure.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Relevant validations were run.
- [x] Docs/context were updated.
- [x] Required responsibility lanes were integrated or tracked as follow-up.

## Result Report
- Task summary: repeatable API/Backtests teardown sequencing is repaired at script-contract level and proven by a real artifact where standalone Backtests starts and tears down infra after API teardown.
- Files changed: `scripts/runQaRepeatableSmokeE2e.mjs`, `scripts/runQaRepeatableSmokeE2e.test.mjs`, `scripts/goLiveSmoke.mjs`, `scripts/goLiveSmoke.test.mjs`, task/evidence/state files.
- How tested: `pnpm exec node --test scripts/goLiveSmoke.test.mjs scripts/runQaRepeatableSmokeE2e.test.mjs` PASS (`20/20`); real repeatable artifact shows Backtests PASS after API teardown.
- What is incomplete: full `api,backtests` repeatable command still exits nonzero due broad API-pack DB cleanup residue in `backtests.e2e.test.ts`.
- Next steps: create/route a follow-up Backend + QA cleanup-isolation issue, then rerun the full repeatable command.
- Decisions made: do not mark the API-pack cleanup failure as teardown sequencing; keep local DB-backed tests real and fail-closed.
