# Task

## Header
- ID: FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10
- Title: Accept futures-only API-key probe success
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10
- Priority: P0
- Iteration: 52
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Soar supports Binance Futures live bot configuration. The operator confirmed
the production key is Futures-capable but not Spot-oriented. A generic all-scope
probe must not reject a key that validates for the target futures scope.

## Goal
Treat any successfully validated actionable scope as an API-key probe success
while preserving `permissions.spot` and `permissions.futures` booleans for UI
and later runtime decisions.

## Success Signal
- User or operator problem: a Futures-only key can be accepted instead of being
  blocked by missing Spot permission.
- Expected product or reliability outcome: profile key testing reflects actual
  usable scopes.
- How success will be observed: unit and UI tests cover Futures-only success
  and Binance permission copy no longer implies Spot is mandatory for Futures.
- Post-launch learning needed: no

## Deliverable For This Stage
Backend probe contract and UI copy/tests that support Futures-only key success.

## Constraints
- keep live bot activation disabled in this task
- do not submit orders
- do not store secrets
- do not add new probe systems
- preserve existing permission booleans

## Scope
- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts`
- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts`
- `apps/web/src/features/profile/components/ApiKeyForm.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-shell.*.ts`
- state/context docs

## Implementation Plan
1. Add success message formatting that can name Spot, Futures, or both.
2. Return `ok: true` with `code: OK` when at least one scope validates.
3. Update focused API-key probe tests.
4. Update Binance permission hint copy and UI test.
5. Run focused API and Web tests, typecheck, guardrails, docs parity, and diff
   check.

## Acceptance Criteria
- Futures-only probe returns `ok: true`, `code: OK`, `permissions.futures:
  true`, `permissions.spot: false`.
- Spot-only probe returns `ok: true`, `code: OK`, `permissions.spot: true`,
  `permissions.futures: false`.
- Both-scope failure still returns fail-closed error codes.
- UI copy does not claim Spot is mandatory for Futures use.

## Definition of Done
- [x] Focused API probe tests pass.
- [x] Focused Web profile form tests pass.
- [x] API/Web typechecks for touched scope pass or blockers are recorded.
- [x] Source-of-truth docs are updated.
- [x] Changes are ready for commit.

## Forbidden
- hidden bypasses
- fake OK for keys that fail both scopes
- live-money testing
- destructive production cleanup

## Validation Evidence
- Tests:
  - `apps/api .\node_modules\.bin\vitest.CMD run src\modules\profile\apiKey\exchangeApiKeyProbe.service.test.ts` PASS 8 tests.
  - `apps/web .\node_modules\.bin\vitest.CMD run src\features\profile\components\ApiKeyForm.test.tsx` PASS 12 tests.
  - `apps/api .\node_modules\.bin\tsc.CMD --noEmit` PASS.
  - `apps/web .\node_modules\.bin\tsc.CMD --noEmit` PASS.
  - `corepack pnpm --filter web run typecheck` and `corepack pnpm@10.13.1 --filter web run typecheck` were blocked by a Corepack signature keyid error before package execution.
  - `node scripts\repoGuardrails.mjs` PASS.
  - `node scripts\checkDocsParity.mjs` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed UI copy so Binance Spot permission is described as
  required only for Spot bots.
- Screenshots/logs: not applicable
- High-risk checks: no live-money actions

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-profile.md`,
  `docs/modules/api-exchange.md`, `docs/security/api-key-lifecycle-policy.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this single commit if probe semantics regress
- Observability or alerting impact: existing API-key audit logs retain
  permissions
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: missing Spot can still make a Futures-capable key fail profile save.
- Gaps: UI copy implies Spot & Margin is always required for Binance.
- Inconsistencies: product uses Futures bots but probe success semantics are
  all-scope.
- Architecture constraints: exchange module owns SDK details; profile owns
  user-facing probe result.

### 2. Select One Priority Task
- Selected task: Futures-only API-key acceptance.
- Priority rationale: it blocks the user's actual production key workflow.
- Why other candidates were deferred: production rerun should wait for correct
  semantics.

### 3. Plan Implementation
- Files or surfaces to modify: API probe service/tests, Web copy/test, state
  docs.
- Logic: success if any supported scope validates, failure only if all scopes
  fail.
- Edge cases: both fail with different errors; both pass; only Spot passes;
  only Futures passes.

### 4. Execute Implementation
- Implementation notes: changed API-key probe success semantics so any
  validated scope returns `ok: true`, preserved per-scope booleans, added
  scope-specific success messages, and updated Binance permission copy.

### 5. Verify and Test
- Validation performed: focused API/Web tests, API/Web typechecks, guardrails,
  docs parity, diff check.
- Result: PASS except pnpm/Corepack wrapper was blocked before execution; local
  package binaries passed the intended typecheck commands.

### 6. Self-Review
- Simpler option considered: changing only UI copy was rejected because API
  `ok` would still block saving.
- Technical debt introduced: no
- Scalability assessment: partial-scope success preserves scope booleans for
  later target-specific checks.
- Refinements made: kept failure behavior for keys that fail both scopes.

### 7. Update Documentation and Knowledge
- Docs updated: source-of-truth state and planning queue.
- Context updated: yes
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
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
Futures-only API-key probes now return `ok: true` when Futures validates even
if Spot does not. Spot-only keys are similarly accepted for Spot use. The UI
now clarifies that Binance Spot & Margin permission is only needed for Spot
bots, while Futures remains listed for Futures/live bot use.
