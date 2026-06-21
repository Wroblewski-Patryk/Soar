# Task

## Header
- ID: LUC-5316
- Title: Make wallet API LIVE/PAPER readback e2e deterministic
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: LUC-5309
- Priority: P1
- Module Confidence Rows: wallet; exchange adapter; API test runtime
- Requirement Rows: not updated
- Quality Scenario Rows: not updated
- Risk Rows: not updated
- Iteration: 2026-06-20
- Operation Mode: BUILDER
- Mission ID: LUC-5316-WALLET-API-LIVE-PAPER-READBACK-E2E-DETERMINISTIC-2026-06-20
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through project wake/context requirements.
- [x] `.agents/core/mission-control.md` was reviewed through project wake/context requirements.
- [x] Missing or template-like state tables were confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were marked not applicable for this narrow repair.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: make the wallet API LIVE/PAPER readback e2e command deterministic under the repository's local Vitest runtime.
- Release objective advanced: LUC-5309 wallet LIVE/PAPER readback blocker repair.
- Included slices: wallet LIVE preview/create local stub detection, wallet e2e isolation, shared rate-limit test-runtime detection, focused validation.
- Explicit exclusions: deploy, push, real exchange I/O, secret/account readback, production smoke, UI changes.
- Checkpoint cadence: one backend repair heartbeat.
- Stop conditions: scoped command passes or a first-class blocker is identified.
- Handoff expectation: close LUC-5316 with evidence for parent LUC-5309.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | Paperclip wake, Soar AGENTS | Integration, task closure, state updates | Closure packet | Parent validation gate | DONE |
| Implementation | Core Backend Engineer | LUC-5316 | Wallet service/test, rate-limit middleware | Deterministic test-runtime behavior | Focused Vitest commands | DONE |
| QA/Test | Core Backend Engineer | Project validation baseline | Wallet e2e, CRUD e2e, rate-limit unit | PASS evidence | `36/36`, `7/7` | DONE |
| Documentation/Memory | Coordinator | Project source-of-truth files | history, context, ledger, learning journal | Durable evidence | File updates | DONE |

## Context

LUC-5309 proved Web wallet/dashboard readback locally but delegated LUC-5316
because the default wallet API e2e command was nondeterministic: LIVE
preview/create could hit authenticated exchange behavior when Vitest supplied
`VITEST=true` without `NODE_ENV=test`, and broad per-test cleanup in the wallet
suite created shared DB interference.

## Goal

Close the backend/test-harness blocker so wallet API LIVE/PAPER readback can be
proved by a deterministic local e2e command without real authenticated exchange
I/O.

## Success Signal
- User or operator problem: wallet confidence could not be advanced because API readback proof was unstable.
- Expected product or reliability outcome: deterministic local wallet API proof for LIVE/PAPER readback.
- How success will be observed: scoped wallet e2e plus CRUD e2e command passes.
- Post-launch learning needed: no.

## Deliverable For This Stage

Verified backend/test repair plus durable task and evidence records.

## Scope

- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `apps/api/src/middleware/rateLimit.ts`
- `history/evidence/luc-5316-wallet-api-live-paper-readback-e2e-deterministic-2026-06-20.md`
- source-of-truth context and ledger entries

## Implementation Plan

1. Treat `VITEST=true` as test runtime in the wallet authenticated balance preview path.
2. Remove broad destructive per-test wallet e2e cleanup and use unique emails for test users.
3. Treat `VITEST=true` as test runtime in shared rate-limit middleware so normal e2e tests are not throttled.
4. Run focused red-case wallet tests, the scoped wallet e2e command, and the focused rate-limit unit test.
5. Update task/evidence and project memory.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- do not perform deploy, push, exchange action, secret/account readback, or live-trading action

## Acceptance Criteria
- [x] Deterministic wallet API proof command exists and passes locally.
- [x] LIVE preview/create tests do not reach real authenticated exchange I/O under local e2e.
- [x] Shared DB interference is removed from this wallet suite by eliminating broad cleanup and using unique test users.
- [x] No live exchange mutation, secret/account readback, deploy, push, restart, or production action occurs.

## Definition of Done
- [x] Code changes are scoped to wallet backend/test and shared test-runtime rate-limit behavior.
- [x] Relevant tests pass.
- [x] Source-of-truth evidence is updated.
- [x] Residual production/live proof risk is explicit.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts -t "caps LIVE preview reference balance|persists an initial LIVE wallet balance snapshot|includes wallet-owned imported LIVE open positions|includes wallet-owned imported LIVE open PnL only" --run` PASS, `1` file / `4` tests.
  - `pnpm --filter api test -- src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts --run` PASS, `2` files / `36` tests.
  - `pnpm --filter api test -- src/middleware/rateLimit.test.ts --run` PASS, `1` file / `7` tests.
- Manual checks: diff reviewed for scoped file ownership and no production/live operation.
- Screenshots/logs: not applicable.
- High-risk checks: no real exchange I/O, exchange mutation, secret/account readback, deploy, push, or live trading.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: wallet; exchange adapter; API test runtime.
- Requirements matrix updated: not applicable.
- Requirement rows closed or changed: not applicable.
- Quality scenarios updated: not applicable.
- Quality scenario rows closed or changed: not applicable.
- Risk register updated: not applicable.
- Risk rows closed or changed: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: existing wallet and exchange adapter service boundaries.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the three scoped code/test file changes.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default wallet API command was failing from test-runtime detection, shared DB cleanup, and rate limiting.
- Gaps: no deterministic `VITEST=true` local path for wallet preview/create.
- Inconsistencies: adjacent backend repairs used `NODE_ENV === 'test' || VITEST === 'true'`, but wallet preview and rate limit did not.
- Architecture constraints: keep real exchange behavior outside local e2e and do not add bypasses.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: LUC-5309 evidence, wallet service/tests, rate-limit middleware, project task template.
- Rows created or corrected: task/evidence and source-of-truth status entries.
- Assumptions recorded: production/live proof remains separate.
- Blocking unknowns: none.
- Why it was safe to continue: issue acceptance was explicit and local-only.

### 2. Select One Priority Mission Objective
- Selected task: LUC-5316.
- Priority rationale: parent wallet readback proof was blocked by this backend/test repair.
- Why other candidates were deferred: out of scope for assigned issue.

### 3. Plan Implementation
- Files or surfaces to modify: wallet service, wallet e2e test, rate-limit middleware.
- Logic: recognize Vitest runtime and isolate test data by unique users rather than broad DB deletion.
- Edge cases: preserve explicit rate-limit test mode and do not change production exchange behavior.

### 4. Execute Implementation
- Implementation notes:
  - Added `isApiTestRuntime()` guard where wallet preview and rate-limit middleware already had test-only behavior.
  - Replaced fixed wallet e2e emails with unique emails.
  - Removed broad per-test cleanup that could race or delete shared DB-backed e2e data.

### 5. Verify and Test
- Validation performed: focused wallet red cases, full scoped wallet command, rate-limit unit tests.
- Result: all passed.

### 6. Self-Review
- Simpler option considered: setting `NODE_ENV=test` in the command only.
- Technical debt introduced: no.
- Scalability assessment: aligns with existing repository Vitest runtime convention.
- Refinements made: validated shared rate-limit tests after touching middleware.

### 7. Update Documentation and Knowledge
- Docs updated: task and evidence history.
- Context updated: project state, task board, module confidence ledger, active mission.
- Learning journal updated: yes.

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
- [x] Learning journal was updated for the recurring test-runtime pitfall.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Result Report

- Task summary: repaired wallet API e2e deterministic local proof for LIVE/PAPER readback.
- Files changed:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `apps/api/src/middleware/rateLimit.ts`
  - source-of-truth history/context files
- How tested: focused wallet red cases, full wallet e2e plus CRUD e2e command, rate-limit unit tests.
- What is incomplete: production/live wallet exchange proof remains separately protected and unrun.
- Next steps: parent LUC-5309 can consume local backend proof.
- Decisions made: encode `VITEST=true` as repository API test runtime for the touched test-only guards.
