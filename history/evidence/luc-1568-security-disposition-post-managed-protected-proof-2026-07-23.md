# LUC-1568 Security Disposition After Managed Protected Proof

Date: 2026-07-23
Owner: Security Review Lead

## Scope

Record the SPA security disposition after the approved managed read-only protected readiness proof executed through `LUC-1569`.

## Inputs

- Parent issue: `LUC-1568`
- Child evidence: `LUC-1569` protected post-Redis readback managed bindings proof dated `2026-07-23`
- Approval gate: `aba2e3f6-d2c3-4dce-8cf5-59f25ee178b7` approved before the managed proof ran

## Security Disposition

`DONE / PROTECTED_PROOF_EXECUTED / AUTH_PATH_VERIFIED / RUNTIME_DEGRADATION_OBSERVED`

## Verified Result

- The protected proof path is now verified as executable through approved managed bindings.
- The ordinary production test account remained fail-closed for protected ops routes:
  - `GET /ready/details -> 403`
  - `GET /workers/ready -> 403`
- The admin smoke account completed the approved protected readback:
  - `GET /ready/details -> 200`
  - `GET /workers/ready -> 503`

## Interpretation

- The prior `LUC-1568` blocker is resolved: this is not an auth-path or secret-access failure anymore.
- Protected API readiness is healthy:
  - `status=ready`
  - `service=api`
- Protected worker readiness is degraded:
  - `status=not_ready`
  - `service=workers`
  - `staleWorkers=["execution"]`
- Coolify read-only evidence corroborates the protected worker result:
  - `workers-execution -> exited:unhealthy`
  - `redis -> running:healthy`

## Boundary Notes

- The proof remained read-only and used approved managed bindings only.
- No secret values, cookies, bearer tokens, passwords, private keys, or raw provider tokens were printed or stored.
- No deploy, restart, rollback, secret rotation, database mutation, or other production mutation was performed in this SPA disposition lane.

## Handoff

- `LUC-1568` can close as complete because the protected proof obligation is satisfied.
- `LUC-1556` should resume independent QVE acceptance using the fresh protected result.
- Runtime recovery remains outside this SPA proof lane and follows the worker degradation outcome on the `execution` worker.
