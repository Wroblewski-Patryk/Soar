# LUC-1177 Deploy/Restart/Release-Readiness Reconciliation (2026-06-01)

## Wake And Lane Contract
- Wake comment acknowledged first: `softwarehouse-local-repair-lane-starter:v1`.
- Lane mode: autonomous local repair/source-control closure (local edits allowed; push/deploy/restart forbidden).

## Affected Capability Chain
1. Public deploy health and build-info reachability.
2. Coolify restart/recovery evidence continuity for Soar services/workers.
3. Protected `/workers/ready` authorization gate and readiness smoke path.
4. Release-readiness gate classification (fail closed when protected runtime proof is missing).

## Evidence Reconciled
- Deploy health sweep: `history/evidence/luc-1186-coolify-production-deploy-health-sweep-2026-06-01.md`.
  - Public API/Web health/readiness/build-info checks returned `200`.
  - No production mutation performed.
- Protected authz gate packet: `history/releases/luc-1190-workers-ready-smoke-principal-authorization-gate-2026-06-01.md`.
  - Guard chain requires `requireAuth` + `requireRole('ADMIN')` + `requireOpsNetwork`.
  - Fresh protected runtime smoke remains blocked without approved principal/session artifact and stable preconditions.
- Local workers-ready contract proof: `history/evidence/luc-1197-workers-ready-contract-suite-closure-2026-06-01.md`.
  - Local contract suite passes (`8/8`) with deterministic auth harness.

## Reconciled Readiness Classification
- Public deploy reachability: `implemented and verified`.
- Coolify restart evidence continuity (read-only proof): `implemented and verified` for this checkpoint scope.
- Workers-ready authorization contract in source/tests: `implemented and verified`.
- Protected runtime workers-ready smoke execution with approved principal artifact: `blocked by error` (artifact/precondition gap).
- Full release-readiness promotion: `blocked` (cannot be inferred from public smoke + local tests alone).

## Validation Commands Run In This Lane
- `rg -n "LUC-1177|1186|1190|1197|workers-ready|Coolify|release readiness" .codex/context .agents/state history/tasks history/evidence history/releases`
- Readback checks of:
  - `history/evidence/luc-1186-coolify-production-deploy-health-sweep-2026-06-01.md`
  - `history/releases/luc-1190-workers-ready-smoke-principal-authorization-gate-2026-06-01.md`
  - `history/evidence/luc-1197-workers-ready-contract-suite-closure-2026-06-01.md`
- Result: PASS for documentation/evidence reconciliation; no runtime mutation attempted.

## Regression Risk And Gaps
- Risk: false-green readiness if public endpoints are treated as protected-release proof.
- Gap: fresh approved protected principal/session artifact and one bounded protected read-only `/workers/ready` smoke execution.
- Next owner: Ops Release Lead + Security Review Lead to execute protected smoke packet from `LUC-1190` and publish redacted result.

## Source-Control Closure Decision
- Decision: `not committed` in this heartbeat.
- Reason: workspace contains broad unrelated runtime/product dirty changes outside `LUC-1177` scope; this lane preserved scope and avoided staging cross-lane files.
- Push status: `not needed`.
- Deploy impact: `none`.

## Continuation Delta (finish_successful_run_handoff, 2026-06-01)

### Explicit Reconciliation With LUC-1160 / LUC-1161
- `LUC-1160` established:
  - transient `soar-api` crash/restart evidence in Coolify (`last_restart_type=crash`, `last_restart_at=2026-05-31T21:08:45Z`, `restart_count=2`),
  - simultaneously green public probes and protected-path `401` when unauthenticated.
- `LUC-1161` established:
  - no contradiction between public green endpoints and unresolved crash-origin classification,
  - readiness stays blocked until protected authorized probe and crash-cause retention evidence are captured.
- `LUC-1177` reconciliation result:
  - these findings remain consistent and unchanged; release-readiness must stay fail-closed.

### Fresh Read-Only Verification In This Heartbeat
- Command:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
- Result:
  - `API /health -> 200`
  - `API /ready -> 200`
  - `WEB / -> 200`
  - `WEB /api/build-info -> 200`

### Source-Control State Reconciliation
- Local refs now:
  - `HEAD=89bbf392dfb89c0a17c0326d9bff423b7f93033f`
  - `origin/main=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Latest production build-info in reconciled evidence (`LUC-1186`/`LUC-1161`) points to:
  - `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Classification:
  - production matches `origin/main` evidence ref,
  - local `HEAD` is ahead/different from deployed ref,
  - no push/deploy/restart is allowed in this lane, so no mutation performed.

### Gate That Blocks Push/Deploy/Restart
1. Protected gate evidence is still missing: one approved read-only principal/session + ops-network protected `/workers/ready` smoke result.
2. Crash-cause classification gate still open: pre-crash host/Coolify retention evidence around `2026-05-31T21:08:45Z` is not yet present.
3. Lane policy gate: this heartbeat is local repair/source-control closure only (explicitly forbids push/deploy/restart/protected mutation).

### Disposition Update
- `LUC-1177` acceptance criteria are satisfied for reconciliation and gate classification.
- Final status recommendation for issue: `done` (with explicit residual blockers delegated to `LUC-1190` protected smoke owner path and `LUC-1160` crash-cause owner path).
