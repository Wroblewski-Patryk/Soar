# Web Dashboard DCA Protection Truth Parity - 2026-05-23

## Header
- ID: WEB-DASHBOARD-DCA-PROTECTION-TRUTH-PARITY-2026-05-23
- Title: Keep Dashboard Home TTP display behind backend protection truth
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Coordinator + Frontend Builder
- Depends on: `RUNTIME-DCA-PROTECTION-DISPLAY-PARITY-2026-05-23`
- Priority: P0
- Module Confidence Rows: `SOAR-DASHBOARD-001`, `SOAR-BOT-RUNTIME-001`
- Requirement Rows: runtime DCA-first close gating, live protection-state parity
- Quality Scenario Rows: operator-visible runtime truth, live-trading safety
- Risk Rows: misleading protection read models
- Iteration: 2026-05-23 dashboard truth follow-up
- Operation Mode: BUILDER
- Mission ID: `WEB-DASHBOARD-DCA-PROTECTION-TRUTH-PARITY-2026-05-23`
- Mission Status: VERIFIED_LOCAL

## Context
The backend now suppresses `dynamicTtpStopLoss` and `dynamicTslStopLoss` until
the relevant side-aware DCA gate is satisfied. A frontend explorer found that
Dashboard Home still rebuilt a display-only `fallbackTtpProtectedPercent` from
`trailingTakeProfitLevels`, which could show prospective TTP even when the API
intentionally withheld dynamic TTP because DCA was still pending.

## Goal
Make Dashboard Home display TTP/TSL protection only from backend-visible
runtime protection truth, not from frontend-only trailing-level reconstruction.

## Constraints
- Reuse existing Dashboard Home and Bot Runtime derivation utilities.
- Do not duplicate backend DCA gate logic in Web.
- Do not remove API-provided `strategy_fallback`/prospective labels when the
  backend explicitly returns them.
- No production auth, live exchange mutation, or Coolify mutation in this task.

## Definition of Done
- [x] Dashboard Home no longer computes local fallback TTP protection from
  `trailingTakeProfitLevels`.
- [x] Dynamic TTP display resolver ignores local fallback fields as protection
  truth.
- [x] API-provided backend/prospective TTP display remains supported.
- [x] Focused Web regression pack passes.
- [x] Web typecheck, guardrails, and diff check pass.
- [x] Source-of-truth state is updated.

## Forbidden
- Frontend-only masking that still lets fallback truth drive table cells.
- Reconstructing dynamic protection from one UI snapshot.
- Treating public deploy smoke as authenticated dashboard readback.

## Validation Evidence
- Focused Web tests:
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx --run` => PASS, `45/45`.
- Parent hygiene:
  - `pnpm --filter web run typecheck` => PASS.
  - `pnpm run quality:guardrails` => PASS.
  - `git diff --check` => PASS with line-ending normalization warnings only.
- High-risk checks: no production LIVE mutation, no production auth use.
- Reality status: verified locally.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-protection-state-parity-contract.md`.
- Fits approved architecture: yes. Web now avoids display-only sticky fallback
  acting as execution/read-model truth.
- Mismatch discovered: frontend drift only.
- Decision required from user: no.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Backend truth had already been repaired, but Web could still synthesize
  prospective TTP from trailing levels.

### 2. Select One Priority Mission Objective
- Selected this task because it directly affects the operator-reported
  dashboard protection display and is locally executable without secrets.

### 3. Plan Implementation
- Remove local fallback TTP calculation from `useRuntimeSelectionViewModel`.
- Make TTP display resolver ignore fallback fields.
- Update focused regression expectations.

### 4. Execute Implementation
- Removed sticky favorable-move fallback wiring from Dashboard Home.
- Kept API-provided backend/prospective TTP display handling intact.

### 5. Verify and Test
- Focused Web pack passed `45/45`.

### 6. Self-Review
- Avoided duplicating backend DCA-gate rules in Web.
- Preserved explicit backend prospective source labels.

### 7. Update Documentation and Knowledge
- This task file records the local proof; context/state updates are part of
  the parent closure.
