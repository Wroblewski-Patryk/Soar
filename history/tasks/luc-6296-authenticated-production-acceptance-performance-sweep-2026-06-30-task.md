# Task

## Header
- ID: LUC-6296
- Title: Authenticated Production Acceptance And Performance Sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P0
- Module Confidence Rows: production auth/session, dashboard shell, admin shell, worker readiness
- Requirement Rows: production acceptance, protected smoke, logout/session invalidation, read-only module clickthrough
- Quality Scenario Rows: production availability, auth fail-closed behavior, performance timing, runtime freshness
- Risk Rows: production auth, market catalog cold-start latency, source-control/build provenance residual, protected runner binding drift
- Iteration: 2026-06-30 QVE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6296-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-30
- Mission Status: VERIFIED

## Context
Recurring QVE production acceptance issue for Soar. The wake payload assigned
[LUC-6296](/LUC/issues/LUC-6296) with no pending comments. Current production
build-info still reports Web SHA `c357d957741f56835f27a1fc3a948dad43a91036`.

## Goal
Prove current production Soar can pass authenticated acceptance, protected
smoke, runtime freshness, rollback guard, and representative performance checks
using redacted evidence.

## Constraints
- Use existing scripts and approved production-safe mechanisms.
- Do not introduce new structures without approval.
- Do not implement workarounds.
- Do not duplicate logic.
- Stay within read-only verification.

## Definition of Done
- [x] Production build-info SHA captured.
- [x] Protected deploy smoke passes with authenticated audit-login binding.
- [x] Auth-session browser proof passes and verifies logout/session invalidation.
- [x] UI module clickthrough passes.
- [x] Runtime freshness and rollback guard pass with authenticated audit-login binding.
- [x] Performance timing sample captured.
- [x] Browser/headless process cleanup checked.
- [x] Evidence recorded.
- [x] Paperclip issue updated to `done`.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.
- Production mutation, trading/live settings mutation, secret readback, or deploy.

## Validation Evidence
- `node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036` with audit-login binding by environment: PASS.
- `node scripts/runProdAuthSessionBrowserProof.mjs --i-understand-production-auth-proof --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --today 2026-06-30 --output-json history/artifacts/luc-6296-prod-auth-session-browser-proof-2026-06-30.json --output-md history/evidence/luc-6296-prod-auth-session-browser-proof-2026-06-30.md`: PASS.
- `node scripts/runProdUiModuleClickthroughAudit.mjs --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --today 2026-06-30 --output-json history/artifacts/luc-6296-prod-ui-module-clickthrough-2026-06-30.json --output-md history/evidence/luc-6296-prod-ui-module-clickthrough-2026-06-30.md`: PASS.
- `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch` with audit-login binding by environment: PASS.
- `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch` with audit-login binding by environment: PASS, `shouldRollback=false`.
- Timing sample: PASS, `history/artifacts/luc-6296-production-performance-timing-2026-06-30.json`.
- Focused market catalog follow-up: `200:5`, max `86.1 ms`, avg `45.8 ms`.
- Cleanup: `Get-Process msedge,chrome,chrome-headless-shell,chromium,playwright -ErrorAction SilentlyContinue` returned no validation processes.

## Architecture Evidence
- Architecture source reviewed: issue description, active mission state, production proof scripts, and prior QVE acceptance evidence.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: current production checks passed when supplied the approved audit-login binding.
- Rollback note: rollback guard returned `shouldRollback=false`.
- Observability or alerting impact: alerts empty.

## Result Report
- Task summary: production acceptance sweep passed with authenticated audit-login binding.
- Files changed:
  - `history/evidence/luc-6296-authenticated-production-acceptance-performance-sweep-2026-06-30.md`
  - `history/evidence/luc-6296-prod-auth-session-browser-proof-2026-06-30.md`
  - `history/evidence/luc-6296-prod-ui-module-clickthrough-2026-06-30.md`
  - `history/artifacts/luc-6296-prod-auth-session-browser-proof-2026-06-30.json`
  - `history/artifacts/luc-6296-prod-ui-module-clickthrough-2026-06-30.json`
  - `history/artifacts/luc-6296-production-performance-timing-2026-06-30.json`
  - `history/tasks/luc-6296-authenticated-production-acceptance-performance-sweep-2026-06-30-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/risk-register.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- What is incomplete: host-level VPS proof and release-grade source/build provenance remain separate gates; market catalog cold sample and runner protected-auth binding drift remain watch items.
- Next steps: no [LUC-6296](/LUC/issues/LUC-6296) repair child required.
