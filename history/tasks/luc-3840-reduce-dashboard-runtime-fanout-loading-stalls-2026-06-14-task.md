# LUC-3840 Reduce Dashboard Runtime Fan-Out And Loading Stalls

## Header

- ID: LUC-3840
- Title: [Soar][Frontend] Reduce dashboard runtime fan-out and loading stalls
- Task Type: fix
- Current Stage: verification
- Status: VERIFIED_LOCAL
- Owner: Frontend Web Engineer
- Priority: P0
- Module Confidence Rows: Dashboard Home, Bot Runtime
- Requirement Rows: REQ-FUNC-002, REQ-FUNC-003
- Risk Rows: RISK-002, RISK-003, RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25
- Iteration: 2026-06-14 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3840-DASHBOARD-RUNTIME-FANOUT-2026-06-14
- Mission Status: VERIFIED_LOCAL

## Context

[LUC-3832](/LUC/issues/LUC-3832) reproduced an authenticated production
dashboard stall: `/dashboard` DOM content loaded quickly, but the browser did
not reach network idle within `70000 ms`. The dominant protected request was
`GET /dashboard/bots/:id/runtime-monitoring/aggregate`, with repeated calls and
production tails up to `26312 ms`.

## Goal

Reduce frontend dashboard fan-out by avoiding aggregate calls for every active
bot during normal Dashboard Home refreshes, while keeping selected-bot runtime
data available and reloadable.

## Scope

- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx`

Explicitly excluded: backend aggregate implementation, production deploy,
protected production smoke, database/Redis mutation, exchange actions, orders,
positions, subscriptions, payments, and live-trading mutation.

## Implementation Plan

1. Keep `listBots`, `listBotRuntimeSessions`, and runtime graph reads as the
   lightweight per-bot dashboard discovery path.
2. Call `getBotRuntimeMonitoringAggregate` only for the selected bot, or the
   first active bot when no explicit selection exists.
3. Return lightweight secondary snapshots for non-selected bots with primary
   session and runtime graph only.
4. Wrap the exposed selected-bot setter so it updates the selection ref before
   triggering a silent reload for the newly selected bot.
5. Add regression coverage proving three active bots produce one aggregate call
   on initial load and a second targeted aggregate call after selecting another
   bot.

## Acceptance Criteria

- Initial Dashboard Home load does not call the runtime aggregate endpoint once
  per active bot.
- Switching the selected bot still loads aggregate data for the new selected
  bot.
- The Web hook remains type-safe.
- Validation limitations are recorded truthfully.

## Result Report

- Implemented selected-only aggregate loading in
  `useHomeLiveWidgetsController`.
- Removed the secondary aggregate limits because secondary bots now use
  lightweight snapshots.
- Added a focused controller test for aggregate fan-out reduction and
  selected-bot refresh.

## Validation Evidence

- PASS: `pnpm install --frozen-lockfile` restored local dependencies without
  lockfile changes.
- PASS: `pnpm --filter web exec tsc --noEmit --pretty false --project
  tsconfig.json`.
- PASS: `git diff --check -- apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx`
  with line-ending warnings only.
- PASS: after [LUC-4174](/LUC/issues/LUC-4174) repaired the local Vitest
  startup blocker, `pnpm --filter web exec vitest src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx --run`
  passed (`1` file / `5` tests).

Reality status: verified locally. Typecheck, focused diff check, and focused
runtime regression proof pass. Protected production timing proof remains
separate in [LUC-3841](/LUC/issues/LUC-3841) after approved source
promotion/deploy.

## Architecture Evidence

- Architecture source reviewed:
  `docs/architecture/nodes/SOAR-FEATURE-DASHBOARD-RUNTIME.md`,
  `docs/architecture/nodes/SOAR-FEATURE-BOT-RUNTIME.md`, and
  `.agents/state/risk-register.md`.
- Fits approved architecture: yes. Dashboard Home remains a selected-bot
  runtime monitoring surface and still uses existing bot/session/runtime graph
  APIs.
- Mismatch discovered: no.
- Decision required from user: no.

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issue: production dashboard stalls on repeated expensive aggregate requests.
- Gap: frontend loaded aggregate data for every active bot in the dashboard
  scope even though only the selected bot drives the heavy runtime tables.
- Constraint: stay in frontend ownership; backend aggregate work belongs to
  [LUC-3839](/LUC/issues/LUC-3839).

### 2. Select One Priority Mission Objective

Selected task: reduce Dashboard Home aggregate fan-out without changing API
contracts.

### 3. Plan Implementation

Modify only the Dashboard Home controller and its focused hook regression test.

### 4. Execute Implementation

Secondary bot snapshots now omit aggregate data. The exposed selected-bot setter
updates `selectedBotIdRef` before silent reload so the next aggregate request
targets the newly selected bot.

### 5. Verify and Test

Typecheck, diff checks, and focused Vitest passed after the local Vitest startup
repair in [LUC-4174](/LUC/issues/LUC-4174).

### 6. Self-Review

The change reuses existing API clients and UI data contracts. It avoids a new
cache layer or backend workaround. Residual UX risk: a selected secondary bot
may briefly show lightweight session data until the silent reload resolves.

### 7. Update Documentation and Knowledge

Updated project state, task board, system health, and module confidence ledger
for [LUC-3840](/LUC/issues/LUC-3840).

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Exactly one priority task was selected.
- [x] Existing systems were reused.
- [x] No workaround path or duplicate API client was introduced.
- [x] Typecheck passed.
- [x] Focused regression test added.
- [x] Focused regression test executed successfully.

## Deployment / Ops Evidence

- Deploy impact: none in this heartbeat.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the two Web hook/test file changes.
- Production proof: not run; protected production recheck remains
  [LUC-3841](/LUC/issues/LUC-3841) after source promotion/deploy approval.
