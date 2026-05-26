# LUC-98 Release Permit Checkpoint (2026-05-26)

## Scope
Read-only verification heartbeat for temp stack + `workers-market-stream` recovery permit gate.

## Commands
1. `corepack pnpm run ops:operator-unblock:check -- --packet history/artifacts/v1-operator-unblock-packet-3fedb7a9-2026-05-26.json --json`
2. `corepack pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --skip-workers`

## Results
- Operator packet check: `PASS`.
- Public smoke: `PASS` for API `/health`, API `/ready`, Web `/`, Web `/api/build-info` on expected SHA.
- Additional reference snapshot:
  `history/evidence/luc-86-coolify-production-health-sweep-2026-05-26-final.md`
  reports `workers-market-stream` as `running:unknown` in production inventory.

## Disposition
`blocked` for LUC-98 release permit scope because temp-domain parallel-stack acceptance packet is not attached yet.

## Unblock Owner/Action
- Owner: scheduled Coolify operator + local-board release controller.
- Action: expose/create temp stack resources, deploy expected SHA, attach temp-domain acceptance packet including temp API/Web smoke, four-worker readiness, and rollback note.
