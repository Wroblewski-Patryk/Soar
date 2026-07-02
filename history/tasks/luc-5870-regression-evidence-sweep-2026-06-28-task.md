# LUC-5870 Regression Evidence Sweep - 2026-06-28

## Header
- ID: LUC-5870-REGRESSION-EVIDENCE-SWEEP-2026-06-28
- Title: Regression Evidence Sweep
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: local Docker availability for infra-aware API/backtests smoke
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001; Web smoke pack; API DB-backed smoke; Backtests smoke; Architecture Evidence Graph
- Requirement Rows: regression baseline evidence; safe public smoke; repository guardrails
- Quality Scenario Rows: release regression confidence; local testability; architecture drift prevention
- Risk Rows: protected gate hold; stale smoke-token residual; dirty/divergent source-control state
- Iteration: 2026-06-28
- Operation Mode: TESTER
- Mission ID: LUC-5870
- Mission Status: VERIFIED_LOCAL_AND_PUBLIC_SAFE

## Context
[LUC-5870](/LUC/issues/LUC-5870) asked for a safe regression/smoke evidence
baseline while Soar V1 remains under takeover and protected-gate constraints.
Current same-day state already records production protected-gate proof, stale
`SMOKE_AUTH_TOKEN` cleanup as a separate Security/Ops lane, and exchange parent
closure as a separate Integration/Delivery lane. This heartbeat stayed within
QA verification scope.

## Goal
Refresh the safe regression baseline, classify any failures, and leave durable
evidence without deploy, protected smoke, account, secret, exchange, payment, or
live-trading mutation.

## Scope
- Repeatable QA smoke runner for Web, API, and focused backtests.
- Repository guardrails.
- Strict architecture graph drift check.
- Repeatable smoke runner unit tests.
- Public no-worker production deploy smoke.
- Local cleanup checks for test-owned Docker/browser processes.

## Implementation Plan
1. Read Paperclip wake payload, role instructions, issue context, and Soar state.
2. Run the established repeatable QA smoke command with LUC-5870 artifact prefix.
3. Run guardrails and architecture drift checks.
4. Run focused runner unit tests.
5. Run public no-worker deploy smoke.
6. Verify cleanup of local Docker/browser validation processes.
7. Record evidence and final issue disposition.

## Acceptance Criteria
- Safe checks are run or a concrete blocker is recorded.
- Results are recorded with exact command/status.
- Evidence paths are durable in `history/`.
- No protected or production-mutating action occurs.
- Local validation processes started by the task are cleaned up.

## Definition of Done
- Evidence file and task record exist.
- Relevant source-of-truth files reference this baseline.
- Paperclip issue receives final disposition with commands/results.
- Residual risk and next owner/action are clear.

## Validation Evidence
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests --artifact-prefix luc-5870-qa-repeatable-smoke-e2e --today 2026-06-28`
  - Result: PASS.
  - Web smoke pack: PASS, `3` files / `18` tests.
  - API smoke pack: PASS, `4` files / `45` tests.
  - Focused backtests e2e: PASS, `1` file / `15` tests.
  - Evidence:
    `history/artifacts/luc-5870-qa-repeatable-smoke-e2e-2026-06-28.json`;
    `history/evidence/luc-5870-qa-repeatable-smoke-e2e-2026-06-28.md`.
- `pnpm run quality:guardrails`
  - Result: PASS.
- `pnpm run architecture:graph:drift:strict`
  - Result: PASS, `849/849` covered, `0` missing.
- `pnpm exec node --test scripts/runQaRepeatableSmokeE2e.test.mjs`
  - Result: PASS, `7/7` tests.
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - Result: PASS for API `/health`, API `/ready`, Web `/`, and Web `/api/build-info`.
- Cleanup:
  - `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned no process rows.
  - `docker compose ps` returned no running service rows after the smoke runner's `docker compose down`.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/project-memory-index.md`;
  `.agents/core/quality-gates.md`; current generated architecture reports.
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
- Trust boundaries: protected workers/auth/account/exchange/payment/live actions excluded.
- Secret handling: no secret readback or secret mutation.
- Fail-closed behavior: protected-gate residuals remain on existing owner paths.
- Residual risk: this sweep is local and public no-worker proof; it does not
  close stale smoke-token cleanup, host-level VPS proof, release-grade build
  provenance, or [LUC-5636](/LUC/issues/LUC-5636) exchange parent closure.

## Source-Control Evidence
- Repo path: `C:\Personal\Projekty\Aplikacje\Soar`.
- Pre-existing status: `main...origin/main [ahead 15, behind 2]` with many
  unrelated modified and untracked files before this heartbeat.
- Files changed by this lane:
  `history/tasks/luc-5870-regression-evidence-sweep-2026-06-28-task.md`;
  `history/artifacts/luc-5870-qa-repeatable-smoke-e2e-2026-06-28.json`;
  `history/evidence/luc-5870-qa-repeatable-smoke-e2e-2026-06-28.md`;
  plus source-of-truth status entries.
- Commit: not committed because the shared worktree is mixed dirty and
  divergent, and this QA heartbeat did not own source-control closure.
- Push: not needed.
- Deploy impact: none.

## Result Report
- Task summary:
  Safe regression baseline is verified for this heartbeat. Web smoke, API
  infra-aware smoke, focused backtests smoke, guardrails, strict architecture
  drift, repeatable-smoke runner tests, and public no-worker production smoke
  all passed.
- What is incomplete:
  Protected production worker/auth proof, stale smoke-token cleanup,
  host-level VPS proof, release-grade build provenance, and exchange parent
  integration closure remain separate owner paths.
- Next steps:
  No QA repair child is required from this sweep. Keep [LUC-5636](/LUC/issues/LUC-5636)
  with Integration/Delivery, stale `SMOKE_AUTH_TOKEN` cleanup with
  Security/Ops, and source-control/build provenance with the release/source-
  control owner.
- Decisions made:
  Did not run protected production, account, subscription/payment, exchange,
  order, position, or live-trading checks.

## Review Checklist
- [x] Current stage declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing smoke and guardrail systems reused.
- [x] No workaround path or product code change introduced.
- [x] Verification evidence recorded.
- [x] Residual risk and next owner/action recorded.
