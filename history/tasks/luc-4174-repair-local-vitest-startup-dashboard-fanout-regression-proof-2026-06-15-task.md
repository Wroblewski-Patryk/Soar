# LUC-4174 Repair Local Vitest Startup For Dashboard Fan-Out Regression Proof

## Header
- ID: LUC-4174
- Title: [Soar][QA] Repair local Vitest startup for dashboard fan-out regression proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-3840](/LUC/issues/LUC-3840)
- Priority: P0
- Module Confidence Rows: `web-dashboard-home`, Web Vitest local test runtime
- Requirement Rows: dashboard runtime fan-out regression proof
- Quality Scenario Rows: local regression test reliability
- Risk Rows: production dashboard performance proof chain
- Iteration: 2026-06-15
- Operation Mode: TESTER
- Mission ID: LUC-3832-PRODUCTION-DASHBOARD-PERFORMANCE-DIAGNOSIS-2026-06-14
- Mission Status: VERIFIED

## Context
[LUC-3840](/LUC/issues/LUC-3840) had implemented the Dashboard Home runtime aggregate fan-out mitigation, but the focused Web regression test could not start locally. The failure happened before test collection with `ERR_PACKAGE_IMPORT_NOT_DEFINED` from the local Web Vitest/Vite stack.

## Goal
Repair or normalize the local Web Vitest runtime enough for the focused dashboard fan-out regression command to start and produce a real pass/fail result.

## Scope
- `apps/web/package.json`
- `apps/web/vitest.config.mts` (renamed from `vitest.config.ts`)
- `package.json`
- `pnpm-lock.yaml`
- Local dependency install state through `pnpm install --frozen-lockfile`

## Implementation Plan
1. Reproduce the exact failing command.
2. Inspect Vitest/Vite package resolution and repo package versions.
3. Normalize Web to the repository's working Vitest major (`3.2.4`) and pin Vite to `5.4.21`, avoiding the newer `#module-sync-enabled` package-import path that fails under this runner's Node `v22.13.0`.
4. Rename the Web Vitest config to `.mts` so Vite 5 loads the ESM-only React plugin cleanly.
5. Rerun the exact focused Web command and one related focused API regression.

## Acceptance Criteria
- The command `pnpm --filter web exec vitest src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx --run` starts and reports pass/fail.
- If it passes, [LUC-3840](/LUC/issues/LUC-3840) receives the exact result.
- No product behavior, production environment, secrets, protected account, database, exchange, payment, or live-trading state is mutated.

## Validation Evidence
- PASS: `pnpm install --frozen-lockfile`.
- PASS: `pnpm --filter web exec vitest src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx --run` (`1` file / `5` tests).
- PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeMonitoringAggregateConcurrency.test.ts --run` (`1` file / `2` tests). The command emitted Vite's CJS Node API deprecation warning, but tests passed.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: current mission, module confidence, system health, project state.
- Fits approved architecture: yes. This is a local test tooling normalization and does not alter runtime product architecture.
- Mismatch discovered: no product architecture mismatch.
- Decision required from user: no.
- Follow-up architecture doc updates: not required.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert package/config changes if the workspace moves to a newer Node/toolchain that supports Vite 6/7 package-import conditions.
- Observability or alerting impact: none.

## Security / Privacy Evidence
- Data classification: local package/test tooling only.
- Trust boundaries: no protected production access used.
- Secret handling: no secrets read or written.
- Security tests or scans: not applicable.
- Fail-closed behavior: startup failure was repaired locally; no bypass or mock-only test path added.
- Residual risk: Vite 5 emits a CJS Node API deprecation warning in the API focused regression path; this is not a failing proof but should be revisited during a future Node/toolchain upgrade.

## Result Report
- Task summary: normalized the local Web Vitest runtime from Vitest 4/Vite 7 to Vitest 3/Vite 5, made the Web Vitest config explicitly ESM, and proved the dashboard fan-out regression test now runs and passes.
- Files changed: `package.json`, `apps/web/package.json`, `apps/web/vitest.config.mts`, `pnpm-lock.yaml`; `apps/web/vitest.config.ts` removed by rename.
- How tested: focused Web regression (`5/5`) and focused API aggregate regression (`2/2`).
- What is incomplete: no production timing proof was run; that remains [LUC-3841](/LUC/issues/LUC-3841) after approved source promotion/deploy.
- Next steps: source-control/release closure for the parent repair batch, then protected post-fix dashboard timing proof.
- Decisions made: exact acceptance command should remain unchanged; package/config repair made the default command work without `NODE_OPTIONS` or wrapper scripts.
