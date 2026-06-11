# Task

## Header
- ID: LUC-19-WORKER-PROOF-AUTH-GATE-2026-05-26
- Title: Validate no-secret worker readiness proof boundary for ops lane
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P1

## Architecture Links

- Primary feature/module: Protected worker runtime readiness gate.
- Architecture nodes: `docs/architecture/nodes/SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS.md`, `docs/architecture/nodes/SOAR-SERVICE-MARKET-STREAM-FANOUT.md`, `docs/architecture/nodes/SOAR-SERVICE-MARKET-STREAM.md`.
- Function chains: `docs/architecture/chains/CHAIN-MARKET-DATA-STREAM-ADAPTERS.md`, `docs/operations/post-deploy-smoke-checklist.md`.
- Affected files: `apps/api/src/router/index.ts`, `apps/api/src/workers`, `docs/operations/post-deploy-smoke-checklist.md`.
- Tests/proof: public no-secret probes for `/workers/health`, `/workers/ready`, and `/metrics` returned `401 Unauthorized`.
- Docs updated: `history/tasks/luc-19-worker-proof-auth-gate-2026-05-26-task.md`.

## Goal
Determine whether worker/readiness runtime proof can be collected from public no-secret endpoints.

## Result Report
- `GET https://api.soar.luckysparrow.ch/workers/health` => `401 Unauthorized`
- `GET https://api.soar.luckysparrow.ch/workers/ready` => `401 Unauthorized`
- `GET https://api.soar.luckysparrow.ch/metrics` => `401 Unauthorized`

Interpretation:
- Worker/runtime readiness evidence is protected by auth in this deployment.
- Public no-secret checks cannot prove worker stability for stack cutover acceptance.
- Existing blocker is sharpened, not resolved.

## Blocker
1. Worker stability proof remains blocked by protected auth boundary.
   - Owner: release owner/operator + Ops Release Lead.
   - Unblock action: run authenticated worker/readiness proof during temp-domain stack redeploy and attach evidence tied to target SHA.

## Validation Evidence
- `curl.exe -sS -D - https://api.soar.luckysparrow.ch/workers/health -o NUL`
- `curl.exe -sS -D - https://api.soar.luckysparrow.ch/workers/ready -o NUL`
- `curl.exe -sS -D - https://api.soar.luckysparrow.ch/metrics -o NUL`

Reality status: blocked
