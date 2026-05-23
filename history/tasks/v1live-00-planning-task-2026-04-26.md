# Task

## Header
- ID: V1LIVE-00
- Title: planning(queue): publish exchange-selected live-execution and takeover hardening packet
- Status: DONE
- Owner: Planning Agent
- Depends on:
- Priority: P0

## Context
Fresh user-reported analysis on 2026-04-26 showed that live execution,
exchange takeover, and manual takeover/runtime visibility are still not closed
under one canonical contract. The existing repository contains residual drift
between exact exchange selection, reconciliation, runtime ownership,
imported-position lifecycle truth, and the first live adapter family behavior.
A planning-only synchronization task is required before further implementation
so future commits can execute in a safe, reversible order.

## Goal
Publish one detailed, file-scoped execution packet that:

- keeps `PAPER` exchange-free,
- makes adapter resolution follow the user-selected `exchange + marketType`
  context,
- completes the first live adapter family inside the existing exchange
  boundary as `BINANCE + SPOT` and `BINANCE + FUTURES`,
- unifies imported-position ownership/runtime/takeover truth,
- queues the exact red-test and fix order needed to close the path end-to-end.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] A new canonical plan documents the wave, invariants, exact tasks, and file scope.
- [x] Canonical queue/context files are synced to the new `V1LIVE-A` wave.
- [x] Project state records the newly queued post-V1 hardening focus and the confirmed regression packet.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtime-flow.e2e.test.ts src/modules/engine/executionAdapterParity.test.ts src/modules/engine/executionOrchestrator.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`
  - `pnpm run quality:guardrails`
- Manual checks:
  - reviewed current architecture and module docs for execution, ownership, and exchange boundaries
  - verified repository queue/context drift before writing the new packet
- Screenshots/logs:
- `runtime-flow.e2e.test.ts` still uses stale singular-bot setup expectations and currently fails with `POST /dashboard/bots` returning `500`
- `orders-positions.e2e.test.ts` still exposes imported `LIVE` runtime visibility and close regressions for `EXCHANGE_SYNC BOT_MANAGED`
- High-risk checks:
  - confirmed the repository still lacks adapter-family event handling for Binance live user-data-stream flows and still behaves too REST/polling-first
  - confirmed the plan had to be corrected so Binance is the first adapter family, not a hidden execution default
  - confirmed imported live entry truth still falls back to `markPrice`, which conflicts with the live-safety contract

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/reference/execution-lifecycle-parity-contract.md`
  - `docs/architecture/reference/live-paper-runtime-safety-contract.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:
  - none in this planning-only task; implementation tasks will reuse the approved architecture and remove code drift

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: planning only; no UI implementation shipped
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: not applicable in this planning-only task
- Parity evidence: the packet queues explicit API/runtime/web tasks so operator UI never claims stronger truth than the backend can prove

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This planning packet intentionally starts with exact adapter selection and
ownership/fail-closed truth before Binance family completion work. The goal is
to avoid repeating the earlier pattern where exchange import, takeover,
runtime visibility, and live submit evolved in partially separate slices.
