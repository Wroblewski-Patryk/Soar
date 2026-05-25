# Task

## Header
- ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Title: Coordinate full readiness proof and blockers
- Task Type: release
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: Coordinator
- Priority: P0
- Module Confidence Rows: SOAR-BOT-RUNTIME-001, SOAR-ORDERS-001, SOAR-OPERATIONS-001, SOAR-EXCHANGE-ADAPTER-001
- Requirement Rows: REQ-FUNC-010, REQ-FUNC-011, REQ-FUNC-012, REQ-FUNC-021, REQ-FUNC-022
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: IN_PROGRESS

## Context
The operator asked the coordinator to make Soar work fully and correctly. The
current repository has strong local and public proof, but literal whole-product
100% is scope-sensitive: protected production readbacks require transient auth,
real LIVE exchange mutation requires explicit approval, native mobile is
scaffold-only, and assistant hot-path trading remains deferred.

## Goal
Open a bounded multi-lane readiness mission, collect the first no-secret public
and local proof, and record the exact blockers before claiming full readiness.

## Scope
- Coordination, state, and integration of the already-present runtime DCA
  exchange-PnL fix found during verification.
- Public build-info, public deploy smoke, read-only V1 preflight, guardrails,
  and docs parity.
- No code behavior changes, no production data mutation, no LIVE order/cancel/
  close, no secret capture.

## Implementation Plan
1. Refresh active mission and current queue state.
2. Delegate read-only lanes for Backend/Runtime, QA/Ops, and Documentation/State.
3. Run no-secret public production checks.
4. Update source-of-truth state with evidence and blockers.
5. Leave the next executable checkpoint clear.

## Acceptance Criteria
- Active mission reflects the new readiness objective.
- Public production SHA and local SHA are recorded.
- Public smoke/preflight outcomes are recorded with blocked protected gates.
- Remaining 100% scope risks are stated without overclaiming.

## Definition of Done
- Current checkpoint evidence is recorded.
- State files route future continuation to this readiness mission.
- No raw secrets, live-money mutation, or workaround path is introduced.

## Validation Evidence
- 2026-05-24 cleanup checkpoint: local `HEAD` and `origin/main` both point at
  `52be8b614d2da9ec05d368ac4fbd05f3ec8f8332`; `HEAD...origin/main` is `0 0`.
- 2026-05-24 public Web/API check: BLOCKED/FAIL from this workstation. `curl`
  to `https://soar.luckysparrow.ch/api/build-info`,
  `https://api.soar.luckysparrow.ch/health`, and
  `https://api.soar.luckysparrow.ch/ready` timed out with `Failed to connect`
  after roughly `21` seconds.
- 2026-05-24 infrastructure diagnostics: DNS resolves `soar.luckysparrow.ch`,
  `api.soar.luckysparrow.ch`, and `vps-9a62b0a4.vps.ovh.net` to
  `141.227.149.67`; TCP checks fail on ports `80`, `443`, and `22`; `tracert`
  stops with destination host unreachable after OVH-side hops; Jina external
  reader returns `ERR_ADDRESS_UNREACHABLE`; SSH to configured `codex-vps` and
  `debian-vps` users times out. No local `OVH`/`COOLIFY`/VPS control token env
  var is available in this session.
- 2026-05-24 local validation: `pnpm run quality:guardrails`, `pnpm run
  docs:parity:check`, `pnpm run typecheck`, and focused runtime automation
  exchange-PnL/service/DCA parity tests passed (`3` files / `41` tests).
- 2026-05-24 docs parity repair: `pnpm run docs:parity:check` initially
  failed with stale route `/dashboard/exchanges` (`Routes: 37/38`). The current
  Web route files no longer include that page, so canonical route/docs entries
  were updated to point exchange integrations at `/dashboard/profile#api`.
  Rerun passed with `Routes: 37/37`.
- 2026-05-24 Web route cleanup validation: focused Web tests passed (`4` files
  / `8` tests), and `pnpm --filter web run build` passed. The build retains an
  older unrelated `react-hooks/exhaustive-deps` warning in
  `useHomeLiveWidgetsController.ts`.
- 2026-05-24 local hygiene: transient `.tmp/prod-auth-cdp-*`, `tmp/login.json`,
  and `tmp/prod-cookies.txt` artifacts were removed; `.tmp/` and `tmp/` are
  ignored.
- Historical 2026-05-23 direct API `/health`: PASS, response status `ok`.
- Historical 2026-05-23 direct API `/ready`: PASS, response status `ready`.
- Historical 2026-05-23 Web build-info: PASS for deployed `52e08aababb0e02c9237ab40c76d3057a107eeac`,
  `metadataSource=github-branch`, build id `EDl9OdoGRfgKNOrv3IAp0`.
- Historical 2026-05-23 `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`: PASS.
- Historical 2026-05-23 `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha abeb8bd1 --timeout-seconds 30 --interval-seconds 10`: expected FAIL at that time because production still exposed `52e08aab`. Superseded by later source/deploy checks; current 2026-05-24 public reachability is blocked by connection timeouts.
- Historical 2026-05-23 `pnpm run ops:release:v1:preflight -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 52e08aab --timeout-seconds 30 --interval-seconds 10`: BLOCKED after build-info/public smoke PASS due missing protected auth/context and final evidence families.
- `pnpm run quality:guardrails`: PASS.
- `pnpm run docs:parity:check`: PASS.
- Runtime exchange-PnL fix validation:
  `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run`: PASS, `38/38`.
- DCA/position parity validation:
  `pnpm --filter api run test -- src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.dcaTpParity.test.ts --run --sequence.concurrent=false`: PASS, `27/27`.
- `pnpm --filter api run typecheck`: PASS.
- Reality status: partially verified.

## Responsibility Lanes

| Lane | Owner | Output | Status |
| --- | --- | --- | --- |
| Coordinator | Active chat | Mission opened, evidence integrated, state updated | IN_PROGRESS |
| Backend/Runtime | Explorer lane | No fresh P0/P1 code blocker; next proof is protected readback | CHECKPOINTED |
| QA/Ops | Explorer lane | Validation order and protected blockers identified | CHECKPOINTED |
| Documentation/State | Coordinator cleanup lane | Stale active source-of-truth deploy facts corrected; future agents routed to authenticated journey proof | CHECKPOINTED |
| Protected Production Proof | Operator/future coordinator | Requires transient auth/context | BLOCKED |
| LIVE Mutation Proof | Operator/future coordinator | Requires explicit per-action approval | BLOCKED |

## Result Report
- Task summary: Opened a full-readiness coordination mission, captured the
  first public/local no-secret checkpoint, then cleaned the stale active
  source-of-truth rows around current local/origin commit
  `52be8b614d2da9ec05d368ac4fbd05f3ec8f8332` and current public reachability
  failures.
- Files changed: active mission, current focus, known issues, task board,
  project state, next steps, system health, delivery map, risk/QAS/requirements
  records, regression log, responsibility/eval ledgers, `.gitignore`, runtime
  automation PnL helper/service/test, and task records.
- How tested: public build-info/API health/readiness checks, repository
  guardrails, docs parity, typecheck, focused runtime automation DCA tests, and
  `git diff --check`.
- What is incomplete: public Web/API/VPS reachability, authenticated
  app-journey proof for the operator-reported broken flows, protected
  production manual/bot readbacks, native mobile parity, deferred AI hot-path
  trading, and any real LIVE mutation proof.
- Next steps: restore VPS/provider/Coolify reachability from an operator
  control plane, rerun public build-info/API health/API ready smoke, then run
  authenticated app-journey triage/proof for
  login/dashboard/bot/runtime/manual-order/DCA behavior and update module
  confidence with the exact failing or verified journey evidence before any
  approval-gated LIVE proof request.
