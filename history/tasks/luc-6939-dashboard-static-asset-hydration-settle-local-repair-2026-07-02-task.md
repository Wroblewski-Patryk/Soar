# LUC-6939 Dashboard Static Asset Hydration Settle Local Repair

## Header
- ID: LUC-6939
- Title: Reduce production dashboard static asset/hydration settle time after LUC-3841 proof failure
- Task Type: fix
- Current Stage: verification
- Status: PARTIALLY_VERIFIED
- Owner: Frontend
- Priority: P0
- Module Confidence Rows: Dashboard runtime surface; Production protected dashboard proof
- Requirement Rows: Protected authenticated dashboard performance proof
- Quality Scenario Rows: Dashboard load/hydration responsiveness
- Risk Rows: Production static asset settle risk
- Operation Mode: BUILDER
- Mission ID: LUC-6939-DASHBOARD-STATIC-ASSET-HYDRATION-LOCAL-REPAIR-2026-07-02
- Mission Status: PARTIALLY_VERIFIED

## Context

LUC-3841 protected production proof on 2026-07-02 passed auth, session, dashboard
document, aggregate, runtime sessions, and runtime graph timing, but failed
sellability on browser-side dashboard settle:

- DOMContentLoaded: `19180 ms` over `3000 ms` threshold.
- Browser network settle: not settled after `30036 ms`.
- Static asset max: `22759 ms` over `3000 ms` threshold.
- Loading failures: `5` over `0` threshold.

Evidence source:

- `history/artifacts/luc-3841-protected-dashboard-performance-recheck-c357d957-2026-07-02.json`
- `history/tasks/luc-3841-protected-dashboard-performance-recheck-c357d957-2026-07-02-task.md`

## Goal

Reduce the initial protected `/dashboard` shell asset and hydration pressure
without changing dashboard runtime behavior, backend API contracts, credentials,
production state, or live trading state.

## Scope

- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/app/layout.tsx`

## Implementation Plan

1. Split the heavy dashboard runtime widget out of the dashboard page entry
   through an existing Next.js dynamic client-only import.
2. Preserve a semantic loading region for accessibility while the runtime
   widget chunk loads.
3. Remove unused `300` font weights from the two global Google font families to
   reduce declared font asset variants in the shell.
4. Verify with focused dashboard route accessibility smoke, web typecheck, and
   production build output.

## Acceptance Criteria

- `/dashboard` keeps one accessible H1 and a navigable runtime region.
- Runtime widget behavior is not rewritten or bypassed.
- Production build succeeds.
- Build output shows a small `/dashboard` route entry and separates at least
  part of dashboard runtime code into an async chunk.
- Production protected proof remains required before closing sellability.

## Definition of Done

- Local source changes are implemented.
- Local checks pass for the touched frontend shell.
- Residual production verification risk is recorded.
- No push, deploy, restart, production smoke, secret readback, account mutation,
  exchange action, order, position, payment/subscription, or live-trading action
  occurred in this heartbeat.

## Forbidden

- No protected production smoke without the protected gate.
- No push or deploy from this heartbeat.
- No backend/API contract changes.
- No temporary bypass or fake runtime data.

## Validation Evidence

- `pnpm --filter web exec vitest run src/app/dashboard/dashboard.a11y.smoke.test.tsx`
  - Result: pass, `1` file / `4` tests.
- `pnpm --filter web run typecheck`
  - Result: pass, `tsc --noEmit`.
- `pnpm --filter web run build`
  - Result: pass.
  - `/dashboard` build output: route size `6.29 kB`, first load JS `228 kB`.
  - Manifest key `/dashboard/page` includes dashboard page chunk
    `static/chunks/app/dashboard/page-a2c2d4a643559367.js`.
  - Async chunk inspection found runtime/dashboard-home code in
    `static/chunks/5819.4104eac810b11690.js`.

Additional command note:

- `pnpm --filter web run test -- src/app/dashboard/dashboard.a11y.smoke.test.tsx --run`
  unintentionally ran a broader Vitest set. The dashboard a11y file passed, but
  unrelated existing `HomeLiveWidgets` expectations failed around runtime
  aggregate limits/trade queries. That failure was not introduced or repaired
  in this scoped issue.

## Architecture Evidence

- Architecture source reviewed: AGENTS.md, active mission state, LUC-3841 proof
  artifact.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: not required; route shell implementation
  changed, not the architecture contract.

## UX/UI Evidence

- Existing shared pattern reused: `LoadingState`.
- Required states: loading state preserved through a semantic runtime region.
- Accessibility checks: dashboard a11y smoke passed.
- Remaining mismatches: no screenshot parity proof was run because this was a
  performance shell repair, not a visual redesign.

## Deployment / Ops Evidence

- Deploy impact: low, frontend-only build output change.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the two frontend file changes if production timing or
  runtime behavior regresses.
- Staged rollout or feature flag: not applicable.

## Result Report

- Task summary: `/dashboard` now loads `HomeLiveWidgets` through a Next.js
  dynamic client-only import with an accessible fallback, and global font
  declarations no longer request unused `300` weights.
- Files changed:
  - `apps/web/src/app/dashboard/page.tsx`
  - `apps/web/src/app/layout.tsx`
  - `history/tasks/luc-6939-dashboard-static-asset-hydration-settle-local-repair-2026-07-02-task.md`
- How tested:
  - Focused dashboard a11y smoke passed.
  - Web typecheck passed.
  - Web production build passed.
- What is incomplete:
  - Production protected dashboard timing proof was not rerun because push,
    deploy, and protected smoke are forbidden in this heartbeat.
  - Build manifest still contains large shared chunks in the `/dashboard/page`
    entry, so this is a local reduction, not definitive production sellability
    proof.
- Next steps:
  - Source-control close this local repair.
  - A protected delivery/Ops lane must decide when to push/deploy and rerun
    LUC-3841 protected dashboard timing proof against the deployed SHA.
