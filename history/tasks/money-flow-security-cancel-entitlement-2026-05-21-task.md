# Money-Flow Security Cancel Entitlement Task

## Header
- ID: `MONEY-FLOW-SECURITY-CANCEL-ENTITLEMENT-2026-05-21`
- Title: Fail closed LIVE exchange-backed cancel after entitlement downgrade
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Security
- Depends on: none
- Priority: P1
- Module Confidence Rows: `SOAR-ORDERS-001`, `SOAR-MANUAL-ORDERS-001`, `SOAR-EXCHANGE-ADAPTER-001`
- Requirement Rows: `REQ-SEC-040`
- Quality Scenario Rows: `QA-027`
- Risk Rows: `RISK-037`
- Iteration: 2026-05-21 security/money-flow lane
- Operation Mode: TESTER
- Mission ID: `MONEY-FLOW-SECURITY-CANCEL-ENTITLEMENT-2026-05-21`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is selected as security/tester for money-impacting review.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were not found for this scope.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by closing a LIVE cancel fail-closed gap.

## Mission Block
- Mission objective: audit money-impacting LIVE/PAPER trading flows for fail-closed behavior and repair a confirmed local LIVE cancel entitlement gap.
- Release objective advanced: local security hardening for commercial readiness without production or LIVE exchange mutation.
- Included slices: DCA/TTP/TSL ordering inspection, LIVE entitlement inspection, runtime/manual order open/cancel/close inspection, exchange adapter boundary inspection, price-truth inspection, idempotency/dedupe inspection, rate-limit inspection, and focused cancel entitlement repair.
- Explicit exclusions: no production mutation, no real LIVE exchange-side submit/cancel/close, no protected production proof, no external penetration test.
- Checkpoint cadence: update repository state after repair and validation.
- Stop conditions: production credentials, raw secrets, or live-money action.
- Handoff expectation: report fixed file, test file, verified DB proof, and residual production/LIVE mutation risks.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, `.agents/state/active-mission.md` | Integration, task closure, source-of-truth updates | This task packet and final report | Parent validation gate | VERIFIED |
| Security/Money-Flow | Active chat | `docs/security/secure-development-lifecycle.md`, `docs/modules/api-orders.md`, `docs/modules/api-engine.md`, `docs/architecture/reference/exchange-access-ownership-matrix.md` | Orders cancel, runtime stale cancel, exchange boundary | Confirmed defect and fix | Focused DB-backed tests passed | VERIFIED |
| QA/Test | Active chat | `.agents/core/quality-gates.md` | API focused test and typecheck | Validation evidence | API typecheck, guardrails, build, and DB tests PASS | VERIFIED |
| Documentation/Memory | Active chat | state/context files | Source-of-truth updates | Requirement/risk/quality/task notes | Inspection | VERIFIED |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed by checkpoint note.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry in this task.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not discovered.

## Context
The previous security hardening mission added execution-time LIVE entitlement checks for LIVE order open, runtime close, and runtime topology. A follow-up money-flow audit found that exchange-backed LIVE order cancel still entered the exchange cancel boundary after `riskAck` without rechecking the user's current `liveTrading` entitlement.

## Goal
Ensure exchange-backed LIVE cancel fails closed after subscription downgrade and does not call the exchange cancel boundary or mutate local order state.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.liveCancelBoundary.service.test.ts`
- Source-of-truth state/context docs for the finding and residual risk.

## Implementation Plan
1. Inspect money-flow surfaces against secure-by-design and fail-closed rules.
2. Add `assertSubscriptionAllowsLiveTrading(userId)` before exchange-backed cancel boundary.
3. Add focused DB-backed tests for allowed entitlement and downgraded entitlement paths.
4. Run focused test, API typecheck, guardrails, and cleanup checks.
5. Update state files with evidence and residual risk.

## Acceptance Criteria
- Exchange-backed LIVE cancel checks current `liveTrading` entitlement before adapter boundary call.
- Downgraded FREE entitlement rejects before exchange cancel and leaves order `OPEN`.
- Existing allowed LIVE cancel path remains covered with an entitlement-enabled plan.
- No real LIVE exchange mutation or production mutation is performed.

## Definition of Done
- [x] Confirmed local defect repaired in code.
- [x] Focused regression test added.
- [x] API typecheck passed.
- [x] Repository guardrails passed.
- [x] DB-backed focused test passed locally.
- [x] Earlier DB proof blocker was superseded by parent rerun evidence.

## Forbidden
- Real LIVE mutation.
- Production data mutation.
- Hidden `riskAck` bypass in manual/user flows.
- Direct exchange connector usage outside approved exchange boundary.
- Temporary bypasses or mock-only product behavior.

## Validation Evidence
- Tests:
  - Parent rerun `corepack pnpm --dir apps/api exec vitest run src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000` PASS, `2` files / `20` tests.
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run build` PASS.
- Manual checks:
  - Local Postgres/Redis were started for DB-backed verification and stopped after the test run.
  - `docker ps --filter name=soar --format "{{.Names}}"` returned no rows after cleanup.
  - `Get-Process chrome-headless-shell` returned no rows.
- High-risk checks:
  - No production commands and no real LIVE exchange mutation were run.
  - Exchange cancel boundary call is now gated by current entitlement.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: `SOAR-ORDERS-001`, `SOAR-MANUAL-ORDERS-001`, `SOAR-EXCHANGE-ADAPTER-001`
- Requirements matrix updated: yes
- Requirement rows closed or changed: `REQ-SEC-040`
- Quality scenarios updated: yes
- Quality scenario rows closed or changed: `QA-027`
- Risk register updated: yes
- Risk rows closed or changed: `RISK-037`
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/modules/api-orders.md`
  - `docs/modules/api-engine.md`
  - `docs/security/secure-development-lifecycle.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none; behavior aligns with existing fail-closed entitlement and exchange-boundary contracts.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the single entitlement guard and focused test if needed.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: money-impacting trading command path with exchange credentials behind adapter boundary.
- Trust boundaries: authenticated user -> API route/service -> subscription entitlement -> exchange adapter boundary.
- Permission or ownership checks: existing user/order ownership remains; current live entitlement now checked before exchange-backed cancel.
- Abuse cases:
  - User downgrades to FREE then attempts to cancel a LIVE exchange-backed order.
  - Runtime stale-order automation attempts exchange-backed cancel after entitlement downgrade.
- Secret handling: no secret values read, printed, or stored.
- Security tests or scans: focused test added; static gates passed; DB-backed execution blocked by local infra.
- Fail-closed behavior: downgraded entitlement throws before adapter call and before local cancel mutation.
- Residual risk: local DB proof still needs rerun when Postgres is available; protected production and real LIVE mutation proof remain separate approval gates.

## Result Report
- Task summary: fixed a confirmed LIVE cancel entitlement gap by gating exchange-backed cancel with current `liveTrading` entitlement.
- Files changed:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.liveCancelBoundary.service.test.ts`
  - source-of-truth state/context files
- How tested: API typecheck and guardrails passed; focused DB test was attempted and blocked by unavailable local Postgres/Docker.
- What is incomplete: DB-backed focused test pass is not collected in this environment.
- Next steps: start local Postgres/Redis and rerun the focused orders cancel test; then broaden to the existing API orders/runtime packs if needed.
- Decisions made: no architecture or product decision required.
