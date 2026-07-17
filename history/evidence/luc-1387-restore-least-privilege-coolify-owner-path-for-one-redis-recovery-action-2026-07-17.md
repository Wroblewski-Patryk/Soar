# LUC-1387 Least-Privilege Coolify Redis Owner Path

Date: 2026-07-17

## Scope

Security/Ops governance lane for `LUC-1387` on Friday, July 17, 2026. Scope
stayed limited to restoring an authorized owner path for exactly one Soar
production Redis recovery action after the DRE runner proved the direct
mutation path is not permitted.

No secret values were handled, printed, or persisted. No deploy, rollback,
environment edit, database write, or Redis mutation was executed from this
runner.

## Evidence Basis

Verified upstream evidence already exists in `LUC-1374` and was reused here:

- Fresh public smoke still shows:
  - API `/health` -> `200`
  - API `/ready` -> `503`
  - Web `/` -> `200`
  - Web `/api/build-info` -> `200`
- Fresh Coolify readback still shows Soar production `redis` as
  `restarting:unhealthy`.
- Direct Coolify Redis mutation probes still fail:
  - `POST /api/v1/databases/{redis-id}/restart` ->
    `403 Missing required permissions: deploy`
  - `POST /api/v1/databases/{redis-id}/start` ->
    `403 Missing required permissions: deploy`
  - `POST /api/v1/databases/{redis-id}/stop` ->
    `403 Missing required permissions: deploy`

This means the correct next step is an authorized owner-path restoration, not
another retry with the same token set and not a broader production mutation.

## Roster and Ownership Findings

- `09 DRE (Deployment & Reliability Engineer)` exists and owns diagnosis,
  runtime verification, and post-recovery smoke.
- `10 CLO (Chief Legal Officer)` and `10 SPA (Security & Privacy Auditor)`
  exist for security/privacy review coordination.
- No separate active Ops Release Lead agent is present in the current roster to
  own the protected Coolify write on its own lane.

## Authorized Owner Path Decision

The least-privilege path for this incident is:

1. Board/operator approves or rejects one exact production action:
   `POST /api/v1/databases/{redis-id}/restart`.
2. If approved, the approved owner executes only that Redis restart action or
   explicitly designates one deploy-capable Coolify owner for that same single
   action.
3. After that action lands, DRE resumes `LUC-1374` for bounded readiness
   recheck only.

Forbidden scope for this lane:

- no broader deploy/restart/rollback
- no env or secret mutation
- no database writes
- no unrelated Coolify resource mutation

## Durable Output

- Repo truth updated to name `LUC-1387` as the current owner-path gate for the
  Redis incident.
- A typed Paperclip `request_confirmation` interaction is the live waiting path
  for board/operator acceptance.
- The issue should rest in `in_review` while that interaction remains pending.

## Residual Risk

If board/operator rejects the one-action Redis restart lane, the Soar
production incident remains fail-closed and `LUC-1374` stays blocked on the
same protected runtime gate.
