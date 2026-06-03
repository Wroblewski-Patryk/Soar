# LUC-1755 ROLLBACK_GUARD Protected Evidence Packet

## Context

- Issue: `LUC-1755`
- Parent: `LUC-405`
- Evidence date: 2026-06-03
- Production target SHA: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Public build-info source: `LUC-1756` readback at `2026-06-03T13:13:08.769Z`
- Base URL: `https://api.soar.luckysparrow.ch`
- Scope: read-only rollback guard proof attempt and protected-input readiness classification
- Secret handling: no secret values printed, copied, stored, or passed through CLI flags

## Result

- Packet status: `PRODUCED_BLOCKED`
- Rollback proof status: `FAIL`
- Release impact: `NO-GO`
- Verification status: `blocked`
- First-class blocker: [LUC-1763](/LUC/issues/LUC-1763)

The rollback guard proof was executed without `ROLLBACK_GUARD_*` credentials in
the current execution shell. The proof failed closed with protected endpoint
`401` responses and did not claim production readiness.

## Evidence

| Evidence | Result | Path |
| --- | --- | --- |
| Protected input readiness sweep | `BLOCKED`, `0` matching protected input names | `history/evidence/luc-1756-soar-prod-protected-app-evidence-blocked-6839cd6b-2026-06-03.md` |
| Rollback proof artifact | `FAIL`, protected endpoints returned `401` | `history/artifacts/_artifacts-v1-rollback-proof-prod-2026-06-03T00-00-00-000Z.json` |
| Rollback proof report | `FAIL`, `shouldRollback=true` | `history/evidence/v1-rollback-proof-prod-2026-06-03T00-00-00-000Z.md` |

## Command Evidence

```powershell
pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today 2026-06-03 --expected-sha 6839cd6b8884e26eca735ce32cea98c1dadccfbe
```

Result:

- Exit code: `1`
- `workers/ready`: `401`
- `workers/runtime-freshness`: `401`
- `alerts`: `401`
- `shouldRollback`: `true`
- Critical outcome: fail-closed; do not proceed to release activation from this evidence

## Rollback Path

- Approved rollback playbook: `docs/operations/deployment-rollback-playbook.md`
- Runtime rollback guard command: `pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch --today 2026-06-03 --expected-sha <sha>`
- Required protected inputs:
  - `ROLLBACK_GUARD_API_BASE_URL`, or explicit non-secret `--base-url`
  - `ROLLBACK_GUARD_AUTH_TOKEN`, or `ROLLBACK_GUARD_AUTH_EMAIL` plus `ROLLBACK_GUARD_AUTH_PASSWORD`
  - Optional private OPS layer: `ROLLBACK_GUARD_OPS_BASIC_USER` plus `ROLLBACK_GUARD_OPS_BASIC_PASSWORD`, or `ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME` plus `ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE`

## Stop Conditions

Stop and keep release gate blocked when any of these are true:

- no `ROLLBACK_GUARD_*` auth family is present in the execution shell;
- any protected endpoint returns `401`, `403`, timeout, or non-2xx status;
- rollback decision reports `shouldRollback=true`;
- runtime freshness status is not `PASS`;
- workers readiness is not `ready` or topology is degraded;
- critical alerts include missing worker heartbeat, market data staleness, stale runtime signal lag, repeated runtime restarts at `SEV-1`, or runtime reconciliation drift at `SEV-1`;
- target SHA does not match the deployed build-info target for the active protected evidence window.

## Ownership

- Delivery disposition owner: Engineering Delivery Lead.
- Protected credential/input owner: Security/Ops protected evidence owner under `LUC-405`.
- Execution owner after inputs are available: Ops Release Lead or an active Ops-capable owner delegated by the board.
- Concrete unblock issue: [LUC-1763](/LUC/issues/LUC-1763), assigned to Security Review Lead.

## No-Mutation Statement

No deploy, restart, rollback execution, database write, env mutation, production
configuration change, account mutation, live-trading action, or secret readback
was performed. The only production interaction was read-only HTTP requests to
guard endpoints, which failed closed without authentication.

## Next Action

Use this packet as the `ROLLBACK_GUARD_*` protected evidence result for the
current ARB-006 window: evidence exists, but it is blocked/failed until approved
protected rollback guard inputs are available and the rollback proof reruns to
`PASS`.
