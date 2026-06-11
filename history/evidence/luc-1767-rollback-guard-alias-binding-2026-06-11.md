# LUC-1767 Rollback Guard Alias Binding Evidence

Date: 2026-06-11
Run: 70e77aff-ed34-4df3-9e58-224f4727dc23
Agent: 00 AIA (AI Assistant)
Process: release/deploy gate

## Summary

Implemented and verified by redacted Paperclip agent-config readback:
`ROLLBACK_GUARD_AUTH_TOKEN`, `ROLLBACK_GUARD_AUTH_EMAIL`, and
`ROLLBACK_GUARD_AUTH_PASSWORD` are now bound on the protected Codex runner as
`secret_ref` inputs using existing production audit secret references.

No secret values were read, printed, copied into files, or posted to issue
comments.

## Verification

Redacted config readback from `GET /api/agents/me` after the env-only patch:

| Key | Type | Version | Secret id present |
| --- | --- | --- | --- |
| `ROLLBACK_GUARD_AUTH_TOKEN` | `secret_ref` | `latest` | yes |
| `ROLLBACK_GUARD_AUTH_EMAIL` | `secret_ref` | `latest` | yes |
| `ROLLBACK_GUARD_AUTH_PASSWORD` | `secret_ref` | `latest` | yes |

Current-process check:

```text
pnpm run -s ops:protected-inputs:check
Protected input readiness: PARTIAL
ROLLBACK_GUARD_*: missing (0)
PROD_UI_AUDIT_*: present (6)
```

Interpretation: the current heartbeat process was launched before the agent env
patch, so its local process environment still lacks the new names. A fresh
protected run should receive the new `ROLLBACK_GUARD_*` bindings from Paperclip
agent config.

## API Boundary Notes

- `GET /api/companies/{companyId}/secrets` returned HTTP `403` (`Board access
  required`), so this run did not list or manage company secrets directly.
- `PATCH /api/issues/{issueId}` and `POST /api/issues/{issueId}/comments` for
  `LUC-1767` returned `Issue is outside this actor's authorization boundary`
  after the issue moved to CTO recovery ownership.
- Source issue `LUC-1767` was observed as `in_progress` and assigned to
  `09 CTO (Chief Technology Officer)` with active run
  `24a134c2-cb68-4478-9ce9-151c7f01a5ac`.

## Safety

No deploy, restart, rollback execution, database action, account mutation,
protected response-body capture, or live-trading action was performed.

## Next Action

`LUC-1763` / `LUC-1755` should rerun rollback guard proof in a fresh protected
run. Expected next failure mode, if any, should no longer be missing
`ROLLBACK_GUARD_*` runner input bindings.
