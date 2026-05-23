# Task

## Header
- ID: EXCHANGE2-16
- Title: Lock Gate.io positions snapshot fail-closed for explicit API keys
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: EXCHANGE2-15
- Priority: P0
- Iteration: 16
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Gate.io is registered as a fail-closed second-exchange placeholder. Stored
Gate.io API keys can exist, but authenticated read capabilities remain disabled
until exact adapter support is implemented and verified.

The positions snapshot route filtered unsupported exchanges when no explicit
key was selected. The explicit `apiKeyId` path entered the snapshot builder and
the test-mode fallback before the adapter capability guard, which could mark a
Gate.io key as used in tests despite `POSITIONS_SNAPSHOT` being unsupported.

## Goal
Ensure explicit Gate.io positions snapshot requests fail closed before test
fallbacks or connector reads, and prove the stored key is not marked used.

## Scope
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.controller.ts`
- `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`
- `docs/modules/api-positions.md`
- Source-of-truth planning and state files.

## Implementation Plan
1. Reuse the existing exchange adapter capability guard in the positions
   snapshot builder before test-mode fixture output.
2. Map the existing unsupported-capability domain error to HTTP 501 in the
   positions controller.
3. Add DB-backed e2e coverage for explicit Gate.io `apiKeyId` snapshot reads.
4. Update module and planning/state docs.
5. Run focused e2e, API typecheck, guardrails, docs parity, and diff checks.

## Acceptance Criteria
- Explicit `GET /dashboard/positions/exchange-snapshot?apiKeyId=<gateio-key>`
  returns HTTP 501 while `POSITIONS_SNAPSHOT` is unsupported.
- Response details identify `GATEIO` and `POSITIONS_SNAPSHOT`.
- The Gate.io API key `lastUsed` field remains `null`.
- Binance snapshot behavior remains covered by the existing test pack.

## Definition of Done
- [x] Capability guard executes before test-mode snapshot fallback.
- [x] Unsupported explicit Gate.io key path has regression coverage.
- [x] Relevant docs and source-of-truth state are updated.
- [x] Relevant validations pass.

## Forbidden
- Enabling Gate.io `POSITIONS_SNAPSHOT`.
- Creating a new exchange access path outside the existing adapter boundary.
- Falling back to Binance or sample data for an unsupported Gate.io request.
- Marking unsupported Gate.io keys as used.

## Validation Evidence
- Tests:
  - `node_modules\.bin\vitest.CMD run src/modules/positions/positions.exchangeSnapshot.e2e.test.ts --run --sequence.concurrent=false`
    - PASS: 1 file, 7/7 tests.
  - `apps\api\node_modules\.bin\tsc.CMD --noEmit -p apps\api\tsconfig.json`
    - PASS.
  - `node scripts/repoGuardrails.mjs`
    - PASS.
- Manual checks:
  - `node scripts/checkDocsParity.mjs`
    - PASS.
  - `git diff --check`
    - PASS with line-ending warnings only.
- Screenshots/logs: not applicable.
- High-risk checks: fail-closed unsupported exchange read; key `lastUsed`
  remains unchanged.

## Architecture Evidence
- Architecture source reviewed:
  - `history/evidence/second-exchange-live-readiness-plan-2026-05-08.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/modules/api-positions.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required; module doc updated.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore prior behavior, though that
  would reopen unsupported Gate.io snapshot fixture leakage.
- Observability or alerting impact: none
- Staged rollout or feature flag: existing capability matrix remains the gate.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: explicit `apiKeyId` snapshot path could reach test fallback before
  capability enforcement.
- Gaps: no Gate.io e2e regression for positions snapshot explicit key.
- Inconsistencies: auto-select path filtered unsupported exchanges; explicit
  path relied on deeper adapter guard that test mode bypassed.
- Architecture constraints: unsupported exchange operations must fail closed.

### 2. Select One Priority Task
- Selected task: Gate.io positions snapshot explicit-key fail-closed.
- Priority rationale: authenticated read boundaries protect future adapter
  rollout and avoid false confidence in tests.
- Why other candidates were deferred: open-orders/trade-history and production
  UI audit remain separate follow-up slices.

### 3. Plan Implementation
- Files or surfaces to modify: positions service/controller/e2e, module docs,
  planning/state files.
- Logic: enforce existing adapter capability before fallback or connector use.
- Edge cases: unsupported Gate.io key must not update `lastUsed`.

### 4. Execute Implementation
- Implementation notes: reused `assertExchangeAdapterOperationSupport` and the
  existing `ExchangeExecutionCapabilityUnsupportedError` response details.

### 5. Verify and Test
- Validation performed: focused e2e, API typecheck, guardrails, docs parity,
  diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: test-only assertion without code change.
- Technical debt introduced: no
- Scalability assessment: keeps capability enforcement centralized and reusable.
- Refinements made: controller now maps the existing unsupported capability
  error to HTTP 501 for this route.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-positions.md`, planning/state files.
- Context updated: yes
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Production-Grade Required Contract
- Goal: fail closed for explicit Gate.io positions snapshots.
- Scope: positions snapshot API vertical slice from route/service to DB-backed
  e2e and docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above.
- Result Report: see below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: yes
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused DB-backed e2e.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: stored exchange API credentials, secret encrypted at rest.
- Trust boundaries: authenticated dashboard route and user-owned API key lookup.
- Permission or ownership checks: existing user-scoped key lookup retained.
- Abuse cases: unsupported Gate.io key cannot trigger fixture success or mark
  usage metadata.
- Secret handling: no secret values logged or documented.
- Security tests or scans: focused e2e verifies fail-closed behavior.
- Fail-closed behavior: HTTP 501 before `lastUsed` update.
- Residual risk: open-orders/trade-history internal snapshots should receive
  their own explicit Gate.io regressions before enabling authenticated reads.

## Result Report
- Task summary: explicit Gate.io positions snapshot reads now fail closed before
  test fallback output and leave the API key unused.
- Files changed:
  - `apps/api/src/modules/positions/positions.service.ts`
  - `apps/api/src/modules/positions/positions.controller.ts`
  - `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`
  - `docs/modules/api-positions.md`
  - planning/state files
- How tested: focused positions e2e, API typecheck, guardrails, docs parity,
  diff check. `corepack pnpm` and `corepack pnpm@10.13.1` were blocked by the
  known local Corepack signature-key failure, so guardrails and docs parity
  were executed through their underlying Node scripts.
- What is incomplete: broader open-orders/trade-history authenticated-read
  Gate.io boundaries remain follow-up tasks.
- Next steps: lock the next Gate.io authenticated-read boundary or continue
  production evidence work once protected auth is available.
- Decisions made: keep `POSITIONS_SNAPSHOT` disabled for Gate.io.
