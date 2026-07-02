# LUC-6413 Regression Evidence Sweep - 2026-06-30

## Header
- ID: LUC-6413-REGRESSION-EVIDENCE-SWEEP-2026-06-30
- Title: Regression Evidence Sweep
- Task Type: verification
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: Docker Desktop local engine availability; Web smoke timeout triage; production Web restoration
- Priority: P1
- Module Confidence Rows: regression baseline; Web smoke pack; API DB-backed smoke; Backtests smoke; Architecture Evidence Graph
- Requirement Rows: regression baseline evidence; safe public smoke; repository guardrails
- Quality Scenario Rows: release regression confidence; local testability; architecture drift prevention
- Risk Rows: Docker unavailable; Web smoke timeout; production Web 503
- Iteration: 2026-06-30
- Operation Mode: TESTER
- Mission ID: LUC-6413
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] Operation mode is TESTER for the regression sweep.
- [x] Existing source-of-truth state and prior sweep evidence were reviewed.
- [x] The task improves release confidence by recording current failed checks.

## Mission Block
- Mission objective: refresh the safe regression evidence baseline for LUC-6413.
- Release objective advanced: identify whether local repeatable regression proof is currently executable.
- Included slices: repeatable Web/API/backtests smoke, guardrails, architecture drift, runner unit tests, public no-workers smoke, cleanup checks.
- Explicit exclusions: no deploy, push, restart, protected production worker/auth/account proof, secret/account readback, DB mutation outside test runner, exchange/payment mutation, order, position, or live trading.
- Stop conditions: any failed regression check requiring owner triage.
- Handoff expectation: record blockers and route to the owning lanes.

## Context
[LUC-6413](/LUC/issues/LUC-6413) requested a QA regression evidence sweep.
The latest wake comments were janitor status-sync comments only, so they did not
change the regression scope. Previous successful sweeps [LUC-5870](/LUC/issues/LUC-5870)
and [LUC-6205](/LUC/issues/LUC-6205) used the same safe local/public packet.

## Goal
Refresh the regression baseline or record first-class blockers with evidence.

## Scope
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests`
- `pnpm run quality:guardrails`
- `pnpm run architecture:graph:drift:strict`
- `pnpm exec node --test scripts/runQaRepeatableSmokeE2e.test.mjs`
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
- Local process cleanup checks for Docker/browser validation residue.

## Implementation Plan
1. Review wake payload, QVE role, Soar active state, task board, and prior sweep packets.
2. Run the established repeatable smoke runner with an LUC-6413 artifact prefix.
3. Classify failures from the generated JSON artifact.
4. Run smaller independent guardrail/drift/runner/public-smoke checks.
5. Record evidence and final disposition.

## Acceptance Criteria
- Commands are run or blockers are concretely recorded.
- Evidence paths exist in `history/`.
- No protected or mutating production action is performed.
- Residual risk and next owner/action are explicit.

## Definition of Done
- [x] Evidence file and artifact exist.
- [x] Task record exists.
- [x] Source-of-truth status entries are updated.
- [x] Final disposition is not optimistic; failed checks are blocked/routed.

## Validation Evidence
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests --artifact-prefix luc-6413-qa-repeatable-smoke-e2e --today 2026-06-30`
  - Result: FAIL.
  - Web smoke pack: FAIL after `203957 ms`.
  - API smoke pack: FAIL after `12227 ms`.
  - Focused backtests e2e: FAIL after `13048 ms`.
  - Evidence:
    `history/artifacts/luc-6413-qa-repeatable-smoke-e2e-2026-06-30.json`;
    `history/evidence/luc-6413-qa-repeatable-smoke-e2e-2026-06-30.md`.
- Web smoke failure:
  - `BotsManagement.test.tsx` monitoring-tab test timed out at `5000 ms`.
  - `Header.responsive.test.tsx` navigation-landmark test timed out at `5000 ms`.
- API/backtests failure:
  - Docker Desktop Linux engine pipe was unavailable.
  - API failed while resolving `redis:7`.
  - Backtests failed while resolving `postgres:15`.
- `pnpm run quality:guardrails`
  - Result: PASS.
- `pnpm run architecture:graph:drift:strict`
  - Result: PASS, `850/850` covered, `0` missing.
- `pnpm exec node --test scripts/runQaRepeatableSmokeE2e.test.mjs`
  - Result: PASS, `7/7`.
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - Result: FAIL.
  - API `/health` PASS `200`; API `/ready` PASS `200`.
  - Web `/` FAIL `503`; Web `/api/build-info` FAIL `503`.
- Cleanup:
  - `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned no rows.
  - `docker compose ps` could not query because the Docker Desktop engine pipe is unavailable; no compose-managed process was started successfully.

## Architecture Evidence
- Architecture source reviewed: prior regression sweep task packets, active mission, task board, module confidence ledger.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no architecture changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: no runtime change.
- Rollback note: not applicable.
- Observability or alerting impact: none.

## Security / Privacy Evidence
- Data classification: no secret values read or recorded.
- Trust boundaries: protected workers/auth/account/exchange/payment/live actions excluded.
- Secret handling: no secret readback or secret mutation.
- Residual risk: local DB-backed API/backtests regression proof is blocked until Docker is restored; production Web remains `503` and blocks public Web smoke.

## Autonomous Loop Evidence
- Analyze current state: prior sweeps passed; current production state already records Web `503` via same-day production watches.
- Select one objective: LUC-6413 regression evidence sweep.
- Plan implementation: reuse established repeatable smoke packet and small independent checks.
- Execute implementation: ran the commands listed above.
- Verify and test: guardrails, architecture drift, and runner unit tests passed; repeatable smoke and public Web smoke failed.
- Self-review: no code fix was attempted because QVE owns verification and routing, not implementation.
- Update documentation and knowledge: this task, evidence, active mission, next steps, task board, project state, module confidence, and regression log were updated.

## Review Checklist
- [x] Current stage declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing smoke and guardrail systems reused.
- [x] No workaround path or product code change introduced.
- [x] No logic duplication introduced.
- [x] Verification evidence recorded.
- [x] Residual risk and next owner/action recorded.

## Result Report
- Task summary: LUC-6413 did not refresh to a green regression baseline; it produced a blocked/failing regression packet with concrete evidence.
- Files changed: this task file, generated LUC-6413 smoke artifact/evidence, and source-of-truth status entries.
- How tested: commands in Validation Evidence.
- What is incomplete: repeatable Web/API/backtests smoke baseline is not green; public Web smoke is not green.
- Next steps:
  - Ops/DRE restores Docker Desktop local engine, then QVE reruns API/backtests repeatable smoke.
  - TAE/FEW triages the two Web Vitest 5s timeout failures or reruns with a justified deterministic timeout if these are known slow tests.
  - DRE/Ops continues [LUC-6331](/LUC/issues/LUC-6331) for production Web `503`, then public Web smoke can be rerun.
- Control-plane caveat: Paperclip heartbeat-context and PATCH paths timed out
  through both local ports and `PAPERCLIP_API_URL`; the intended issue
  disposition is `blocked` using this task/evidence packet.
- Decisions made: no repair child was created from this local runner because
  this QVE heartbeat cannot mutate the Paperclip control plane while API calls
  time out; the blockers and owner paths are recorded here.
