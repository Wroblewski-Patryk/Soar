# LUC-5542 Regression Evidence Sweep - 2026-06-27

## Header
- ID: LUC-5542-REGRESSION-EVIDENCE-SWEEP-2026-06-27
- Title: Regression Evidence Sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: local runner dependency approval and local Postgres/Docker for DB-backed API smoke
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001; Web dashboard smoke; API DB-backed smoke
- Requirement Rows: regression baseline evidence; safe public smoke
- Quality Scenario Rows: release regression confidence; local testability
- Risk Rows: protected gate hold; local runner/tooling drift
- Iteration: 2026-06-27
- Operation Mode: TESTER
- Mission ID: LUC-5542
- Mission Status: PARTIALLY_VERIFIED

## Context
Soar remains in V1 takeover verification under protected gate hold. The same-day security gate sweep shows protected inputs are incomplete, so this heartbeat was limited to safe local/public regression evidence. No deploy, push, restart, rollback, env edit, secret/account readback, DB/Redis mutation, production account mutation, subscription/payment mutation, exchange mutation, order, position, or live-trading action was authorized or performed.

## Goal
Refresh the safe regression/smoke evidence baseline and classify failed checks as product regression, protected-gate blocker, or local runner/tooling blocker.

## Scope
- Safe repeatable QA smoke runner.
- Web smoke pack.
- API DB-backed smoke pack collection and execution attempt.
- Public production no-worker deploy smoke.
- Repository guardrails.
- Evidence and state updates only.

## Implementation Plan
1. Read current Paperclip issue context and Soar state.
2. Run the established repeatable QA smoke command.
3. If package-managed command fails before tests execute, rerun direct local binaries to recover actual test evidence.
4. Run safe public production no-worker smoke.
5. Run repository guardrails.
6. Record evidence and source-of-truth updates.

## Acceptance Criteria
- Safe checks are run or a concrete blocker is recorded.
- Failed checks are classified with exact cause and next owner/action.
- Evidence paths are durable in `history/`.
- No protected or production-mutating action occurs.

## Definition of Done
- Evidence file and task record exist.
- Paperclip issue receives final disposition with commands/results.
- Residual risk and next owner/action are clear.
- No task-owned browser/server/Docker process is left running.

## Validation Evidence
- `node scripts/runQaRepeatableSmokeE2e.mjs --checks web,api,backtests --artifact-prefix luc-5542-qa-repeatable-smoke-e2e --today 2026-06-27`
  - Result: FAIL, artifact written.
  - Initial failure cause: package-managed `pnpm` path invoked dependency/install status check and failed with `ERR_PNPM_IGNORED_BUILDS` before tests executed.
  - Evidence:
    `history/artifacts/luc-5542-qa-repeatable-smoke-e2e-2026-06-27.json`;
    `history/evidence/luc-5542-qa-repeatable-smoke-e2e-2026-06-27.md`.
- `node scripts/repoGuardrails.mjs`
  - Result: PASS.
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - Result: PASS for API `/health`, API `/ready`, Web `/`, and Web `/api/build-info`.
- Command from `apps/web`: `.\node_modules\.bin\vitest.cmd run src/features/bots/components/BotsManagement.test.tsx src/features/logs/components/AuditTrailView.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx`
  - Result: PASS, `3` files / `18` tests.
- Command from `apps/api`: `.\node_modules\.bin\prisma.cmd generate --schema .\prisma\schema.prisma`
  - Result: PASS; regenerated local Prisma Client in `node_modules`.
- Command from `apps/api`: `.\node_modules\.bin\vitest.cmd run src/modules/auth/auth.e2e.test.ts src/modules/strategies/strategies.e2e.test.ts src/modules/backtests/backtests.e2e.test.ts src/modules/engine/preTrade.e2e.test.ts`
  - Result: FAIL, `45` tests failed at first DB access because local Postgres at `localhost:5432` is unavailable.
- Docker availability:
  - `docker ps` and `docker compose ps` failed because Docker Desktop Linux engine pipe was unavailable.
- Cleanup:
  - No `chrome-headless-shell` process found from this heartbeat.
  - No local Docker containers were started.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/project-memory-index.md`; `.agents/core/quality-gates.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no architecture changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: no runtime change.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.

## Security / Privacy Evidence
- Data classification: no secret values read or recorded.
- Trust boundaries: protected production/account/exchange/payment/live actions excluded.
- Secret handling: no secret readback; public smoke only.
- Fail-closed behavior: protected gates remain closed under [LUC-5543](/LUC/issues/LUC-5543).
- Residual risk: API DB-backed local smoke not proven in this runner.

## Result Report
- Task summary:
  Safe regression sweep is partially verified. Web smoke, public no-worker production smoke, and repository guardrails are green. API DB-backed smoke is blocked by local runner environment, not by a product assertion failure.
- Files changed:
  `history/tasks/luc-5542-regression-evidence-sweep-2026-06-27-task.md`;
  `history/artifacts/luc-5542-qa-repeatable-smoke-e2e-2026-06-27.json`;
  `history/evidence/luc-5542-qa-repeatable-smoke-e2e-2026-06-27.md`;
  state/context files updated with this evidence.
- How tested:
  See Validation Evidence.
- What is incomplete:
  API DB-backed smoke could not complete because local Postgres/Docker is unavailable in this runner. Package-managed pnpm smoke also fails before test execution due ignored-build approval state under pnpm `11.7.0`.
- Next steps:
  [LUC-5577](/LUC/issues/LUC-5577) is assigned to Test Automation to provide a non-interactive dependency/build approval path compatible with pnpm `11.7.0` and a runnable local Postgres/Docker test service, then rerun API DB-backed smoke.
- Decisions made:
  Did not run protected production workers/auth/account/exchange/payment/live-trading checks because [LUC-5543](/LUC/issues/LUC-5543) still reports protected inputs incomplete.

## Review Checklist
- [x] Current stage declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing smoke and guardrail systems reused.
- [x] No workaround path or product code change introduced.
- [x] Verification evidence recorded.
- [x] Residual risk and next owner/action recorded.
