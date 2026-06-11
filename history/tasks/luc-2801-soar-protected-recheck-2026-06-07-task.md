# LUC-2801 Soar Protected Recheck

## Header
- ID: LUC-2801
- Title: [Gate recheck][LUC-241] Soar protected recheck
- Task Type: release
- Current Stage: verification
- Status: DONE / FAIL_AUTH
- Owner: Ops/Release
- Parent: [LUC-241](/LUC/issues/LUC-241)
- Priority: P1
- Mission ID: LUC-2801-SOAR-PROTECTED-RECHECK-2026-06-07
- Mission Status: VERIFIED_FAIL_CLOSED

## Context
[LUC-2801](/LUC/issues/LUC-2801) was created from a fresh protected gate fact detected by [LUC-2800](/LUC/issues/LUC-2800) while running `node scripts/run-gate-freshness-watcher.mjs --apply`. The issue authorized exactly one read-only auth/smoke recheck for the [LUC-241](/LUC/issues/LUC-241) protected `/workers/ready` gate.

## Goal
Run one canonical production protected smoke recheck and record the auth/smoke result without deploy, restart, runtime mutation, push, live-account mutation, or unrelated production probing.

## Constraints
- Use existing secret-bearing environment bindings only; do not print, store, or pass secret values through CLI flags.
- Scope the probe to canonical production API/Web smoke plus protected `/workers/ready`.
- Do not deploy, restart, roll back, edit env, mutate accounts, mutate data, mutate exchanges, or perform live-trading actions.

## Definition of Done
- [x] Fresh gate fact was consumed for one read-only recheck.
- [x] Exact command and timestamp are recorded.
- [x] Result for protected `/workers/ready` is recorded with fail/pass reason.
- [x] Parent gate disposition remains fail-closed when auth is not accepted.

## Forbidden
- No deploy.
- No restart or rollback.
- No runtime, account, database, exchange, or live-trading mutation.
- No secret value output or repository storage.

## Validation Evidence
- Timestamp: `2026-06-07T14:12:44.6307728+02:00`.
- Names-only env precheck: `SMOKE_AUTH_TOKEN`, `SMOKE_AUTH_EMAIL`, and `SMOKE_AUTH_PASSWORD` were present; `SMOKE_OPS_BASIC_*` and `SMOKE_OPS_AUTH_HEADER_*` were missing.
- Command:
  `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  with `SMOKE_TIMEOUT_MS=10000` and `SMOKE_TRANSIENT_RETRIES=0`.
- Result:
  - `API /health` -> `200` PASS.
  - `API /ready` -> `200` PASS.
  - `WEB /` -> `200` PASS.
  - `WEB /api/build-info` -> `200` PASS.
  - `API /workers/ready` -> `401` FAIL.
- Reality status: protected gate remains `FAIL_AUTH`; the currently bound smoke principal is still not accepted by the Soar API for protected `/workers/ready`.

## Deployment / Ops Evidence
- Deploy impact: none.
- Push impact: none.
- Runtime mutation: none.
- Env or secret mutation: none.
- Protected probe count: one.
- Rollback note: no rollback action is indicated from this child recheck; parent [LUC-241](/LUC/issues/LUC-241) remains blocked until Security/credential owners bind an accepted production smoke principal.

## Result Report
- Task summary: executed the authorized read-only protected gate recheck and confirmed public production endpoints are healthy while protected worker readiness still fails auth with `401`.
- Files changed: this evidence artifact plus source-of-truth state entries.
- How tested: one production `deploySmokeCheck` run with worker check enabled.
- What is incomplete: accepted protected `/workers/ready` auth proof is still missing.
- Next steps: Security/credential owner replaces or fixes the production smoke auth binding, then Ops may run a fresh authorized one-shot protected recheck.
