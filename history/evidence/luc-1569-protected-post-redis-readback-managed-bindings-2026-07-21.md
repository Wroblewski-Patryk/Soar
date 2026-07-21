# LUC-1569 Protected Post-Redis Readback Using Managed Bindings - 2026-07-21

## Scope

- Current Paperclip issue: `LUC-1569`
- Goal: protected post-Redis readiness readback using already authorized bindings
- Constraints: no restart, redeploy, rotate, or mutation of production

## Read-Only Checks

- `pnpm run -s ops:protected-inputs:check -- --json`
- Coolify team selector readback
- Coolify global resources readback

## Results

- Protected-input readiness returned `PARTIAL` with `matchingProtectedInputNamesPresent=6`.
- Account-access gate remained incomplete because required families were still missing:
  `ROLLBACK_GUARD_*`, `PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*`, `RC_*`,
  and `GATE* / GATE_*`.
- Coolify read-only inventory confirmed:
  - selector id `0`, name `LuckySparrow`
  - project `Soar`
  - production environment `production`
  - application rows `soar-api`, `soar-web`, `workers-backtest`,
    `workers-execution`, `workers-market-data`, and `workers-market-stream`
    with `running:unknown`
  - `postgresql` with `running:healthy`
  - `redis` with `running:healthy`

## Board Action

- A typed `request_confirmation` interaction was created on `LUC-1569`.
- Interaction id: `ba1b3b44-55a9-402e-91ef-e6543bb3e385`
- Prompt summary: request an approved managed `SMOKE_AUTH_*` binding or direct
  operator execution for the protected `/ready/details` and `/workers/ready`
  readback.

## Residual Risk

- The protected Soar endpoints remain unproven from this runner until the
  approved smoke auth path or operator-supervised execution is provided.
- No secret values were printed, copied, or stored.
