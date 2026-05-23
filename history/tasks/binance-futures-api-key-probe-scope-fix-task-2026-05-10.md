# Task

## Header
- ID: BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10
- Title: Fix API-key probe scope handling for Binance Futures keys
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10
- Priority: P0
- Iteration: 51
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Production API-key probe evidence reported a Binance key as Spot-ready and
Futures-not-ready, but the operator confirmed the key is intended and known to
work for Futures. The probe currently tests Spot first, then Futures, and calls
CCXT `fetchBalance()` without explicit per-scope parameters.

## Goal
Make profile API-key probing scope-aware enough that Binance Futures validation
does not rely on ambiguous CCXT defaults or short-circuit away Futures-only key
evidence.

## Success Signal
- User or operator problem: production key validation must not mislead the
  operator about Futures readiness.
- Expected product or reliability outcome: Spot and Futures probe results are
  collected independently and CCXT receives explicit scope parameters.
- How success will be observed: focused probe tests cover independent probing
  and Binance Futures `fetchBalance` params.
- Post-launch learning needed: yes

## Deliverable For This Stage
Code, tests, and documentation/context correction for the probe scope bug.

## Constraints
- keep CCXT construction and CCXT-specific params owned by `modules/exchange`
- do not change live bot activation behavior
- do not submit exchange orders
- do not introduce a second probe path
- keep repository artifacts secret-free

## Scope
- `apps/api/src/modules/exchange/exchangeApiKeyProbeClient.service.ts`
- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts`
- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts`
- production readiness report correction
- source-of-truth state updates

## Implementation Plan
1. Add exchange-owned resolver for API-key probe balance params.
2. Pass explicit params to `fetchBalance` during profile probe.
3. Probe Spot and Futures independently instead of stopping after the first
   failure.
4. Add focused tests for Binance Futures params and Futures-only permission
   reporting.
5. Correct the production readiness report wording so it treats prior probe
   output as ambiguous until the fixed probe deploys.
6. Run focused tests, typecheck, guardrails, docs parity, and diff check.

## Acceptance Criteria
- Binance Futures probe calls `fetchBalance` with explicit Futures params.
- Futures-only keys can report `permissions.futures: true` even when Spot
  probing fails.
- The previous production report no longer claims the operator's key is
  definitively not Futures-capable.
- Validation evidence is recorded.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for the changed backend behavior.
- [x] Focused API-key probe tests pass.
- [x] API typecheck passes.
- [x] Guardrails/docs parity pass.
- [x] Changes are ready for commit.

## Forbidden
- live-order placement
- live-bot activation
- fake success responses
- storing credentials or raw exchange errors containing secrets
- moving CCXT-specific logic back into profile ownership

## Validation Evidence
- Tests:
  - `apps/api .\node_modules\.bin\vitest.CMD run src\modules\profile\apiKey\exchangeApiKeyProbe.service.test.ts` PASS 8 tests.
  - `apps/api .\node_modules\.bin\vitest.CMD run src\modules\profile\apiKey\apiKey.e2e.test.ts` BLOCKED before assertions because `DATABASE_URL` is not present in this shell.
  - `apps/api .\node_modules\.bin\tsc.CMD --noEmit` PASS.
  - `node scripts\repoGuardrails.mjs` PASS.
  - `node scripts\checkDocsParity.mjs` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed CCXT Binance `fetchBalance` implementation in local dependency and confirmed explicit `type` influences the selected balance endpoint.
- Screenshots/logs: not applicable
- High-risk checks: no live-money actions

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-exchange.md`,
  `docs/modules/api-profile.md`,
  `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: production evidence correction only

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the single commit if probe behavior regresses
- Observability or alerting impact: API-key test audit logs continue to capture
  redacted permissions
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: probe result can be misleading for Binance Futures because scope is
  implicit and probes are sequential.
- Gaps: tests do not verify `fetchBalance` params or Futures-only key outcome.
- Inconsistencies: production report overinterpreted the current probe result.
- Architecture constraints: exchange module owns CCXT details.

### 2. Select One Priority Task
- Selected task: API-key probe scope fix.
- Priority rationale: it directly affects whether the operator can trust live
  readiness evidence.
- Why other candidates were deferred: runtime readback and cleanup depend on
  accurate exchange-key validation.

### 3. Plan Implementation
- Files or surfaces to modify: exchange probe factory, profile probe service,
  focused tests, and evidence docs.
- Logic: independent scope probing with explicit fetch-balance params.
- Edge cases: one scope passes while the other fails; both scopes fail with
  different error categories.

### 4. Execute Implementation
- Implementation notes: added exchange-owned
  `resolveApiKeyProbeFetchBalanceParams`, passed explicit params to
  `fetchBalance`, changed profile probing to collect Spot and Futures
  independently, and corrected the prior production readiness report.

### 5. Verify and Test
- Validation performed: focused probe unit test, attempted API-key e2e,
  API typecheck.
- Result: focused and typecheck pass; e2e is environment-blocked on missing
  `DATABASE_URL`.

### 6. Self-Review
- Simpler option considered: changing only the report was rejected because the
  product behavior would remain misleading.
- Technical debt introduced: no
- Scalability assessment: exchange-owned scope params scale to Gate.io and
  future adapters.
- Refinements made: previous production report now labels the old key-probe
  result as ambiguous instead of authoritative.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/evidence/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
Probe scope handling is fixed locally: Spot and Futures are probed
independently, Binance Futures balance checks now pass explicit
`{ type: "future", useV2: true }` params, and the prior production report no
longer treats the old probe output as authoritative Futures-permission proof.
