# LUC-107 - Coolify production deploy health sweep (2026-05-26)

## Context
Issue was assigned as a critical Ops heartbeat for production deploy-health verification in Coolify.

## Goal
Produce fresh no-secret production health evidence for Soar and set a clear lane disposition.

## Constraints
- Read-only verification only (no deploy/restart/rollback/env mutation).
- No secret/token value exposure.
- Keep proof tied to current production SHA.

## Delivery Stage
`verification`

## Definition of Done
- Public production probes captured (`/health`, `/ready`, `/api/build-info`).
- Coolify production resource snapshot captured for Soar services.
- Worker-fleet blocker status made explicit with unblock owner/action.
- Final disposition recorded.

## Forbidden
- Production mutation without explicit release mutation permit.
- Any secret leakage in logs or docs.

## Actions Executed
1. Ran no-secret public production probes:
   - `GET https://api.soar.luckysparrow.ch/health` -> `200`
   - `GET https://api.soar.luckysparrow.ch/ready` -> `200`
   - `GET https://soar.luckysparrow.ch/api/build-info` -> `200`
2. Confirmed deployed build-info SHA:
   - `gitSha=3fedb7a9170097b40accb6ccea1915064f383f11`
   - `metadataSource=github-branch`
3. Queried Coolify read-only inventory and filtered Soar production resources (`environment_id=6`).
4. Captured current worker status:
   - `workers-market-stream (d2oo1wwy8i55q27e5mdky0i4)` -> `exited:unhealthy`

## Verification Result
- Public production endpoints: `verified`.
- Coolify production topology visibility: `verified`.
- Fleet health gate: `failed` (single critical worker unhealthy).

## Residual Risk
- With `workers-market-stream=exited:unhealthy`, runtime stream continuity is not proven healthy for production operations.
- Temp-domain acceptance packet for expected SHA is still missing in this lane.

## Unblock Owner / Action
- Owner: Ops Release Lead + Coolify operator (host access owner).
- Action: execute authenticated worker recovery and attach temp-domain acceptance packet (expected-SHA smoke + worker readiness + rollback note).

## Final Disposition
`blocked`


## 2026-05-26 Source-Scoped Recovery Delta
- Ran a fresh read-only expected-SHA smoke in this runtime:
  - 
ode scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers
  - Result: PASS (/health 200, /ready 200, / 200, /api/build-info 200).
- Probed protected worker endpoint without auth context:
  - GET https://api.soar.luckysparrow.ch/workers/ready -> 401.
- Interpretation: public deploy health remains stable; authenticated worker readiness proof is still missing in this runtime.
- Evidence: history/evidence/luc-107-source-scoped-recovery-action-2026-05-26.md.

