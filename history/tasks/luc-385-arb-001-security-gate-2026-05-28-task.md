# Task

## Header
- ID: LUC-385-ARB-001-security-gate-2026-05-28
- Title: [Soar][ARB-001] Security fail-closed gate + trace sanitization for assistant orchestration
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Security
- Priority: P1

## Context
`ARB-001` is blocked on activation-scope decision for hot-path assistant rollout, but the existing orchestrator already handles advisory traces and accepted unsanitized user-controlled metadata. LIVE mode must remain fail-closed until explicit activation.

## Goal
Harden the current assistant orchestration boundary without activating deferred hot-path behavior.

## Scope
- `apps/api/src/modules/engine/assistantOrchestrator.service.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.service.test.ts`

## Implementation Plan
1. Fail closed for `LIVE` mode unless explicit runtime flag enables hot path.
2. Sanitize persisted trace metadata fields that are user-controlled.
3. Add focused tests for both controls.

## Acceptance Criteria
- `LIVE` input returns `NO_TRADE` with explicit fail-closed reason by default.
- Trace fields (`requestId`, `botId`, `botMarketGroupId`, `symbol`, `role`) are sanitized before trace write.
- Focused orchestrator test file passes.

## Definition of Done
- [x] Security boundary patch implemented without enabling deferred product scope.
- [x] Focused automated verification passed.
- [x] Source-of-truth context files updated with evidence.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/engine/assistantOrchestrator.service.test.ts --reporter=basic`
- Reality status: verified

## Security / Privacy Evidence
- Permission or ownership checks: unchanged (bot ownership still upstream in `botAssistant.service.ts`).
- Abuse cases: prompt/HTML/control-char injection through `role`/`symbol`/metadata traces.
- Secret handling: unchanged; no secret values introduced.
- Fail-closed behavior: `LIVE` is blocked by default via `live_mode_disabled_fail_closed` unless `ASSISTANT_HOTPATH_LIVE_ENABLED=true`.
- Residual risk: trace persistence is still adapter/no-op by default; DB-backed immutable trace storage remains pending broader ARB-001 implementation lane.

## Result Report
- Task summary: added security fail-closed LIVE gate and trace metadata sanitization on current assistant orchestrator path.
- Files changed:
  - `apps/api/src/modules/engine/assistantOrchestrator.service.ts`
  - `apps/api/src/modules/engine/assistantOrchestrator.service.test.ts`
- How tested: focused vitest run (7/7 passing).
- What is incomplete: full ARB-001 hot-path activation, persisted DB traces, and red-team packet remain blocked on product/CTO decision.
- Next steps:
  1. CTO/Product decision on ARB-001 activation scope.
  2. AI Runtime lane implements persisted trace storage + integration contract.
  3. Security lane executes prompt-injection/data-leak red-team packet on new hot-path slice.