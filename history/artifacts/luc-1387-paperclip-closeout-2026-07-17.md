# LUC-1387 Closeout

Date: 2026-07-17

## Summary

`LUC-1387` narrowed the Soar Redis authorization blocker to one exact owner
path. The DRE evidence remains unchanged: direct Coolify Redis mutation probes
still return `403 Missing required permissions: deploy`, so the next legal step
is not another retry with the same token set.

## Decision

- Allowed next action for board/operator review:
  `POST /api/v1/databases/{redis-id}/restart`
- Alternate accepted shape:
  designate one deploy-capable Coolify owner for that same single action only
- Explicitly forbidden:
  broader deploy, rollback, env/secret mutation, database writes, or unrelated
  Coolify mutations

## Follow-up

If the confirmation is accepted, execute the single Redis restart action and
return `LUC-1374` to DRE for bounded readiness smoke. If rejected, keep the
incident fail-closed and preserve the blocker.

## Outcome

The confirmation was accepted by `local-board` on 2026-07-20. This closes the
CLO owner-path restoration lane. The remaining work is operational execution of
that already-approved single Redis restart action and the DRE readiness recheck
in `LUC-1374`.
