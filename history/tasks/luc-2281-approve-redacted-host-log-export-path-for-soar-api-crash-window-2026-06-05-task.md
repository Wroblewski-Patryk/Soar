# LUC-2281 - Approve Redacted Host-Log Export Path For soar-api Crash Window

## Context

[LUC-2279](/LUC/issues/LUC-2279) could not retrieve the required
`2026-05-31T21:08:45Z` `soar-api` crash-window evidence through the current
Coolify read-only API. Runtime app logs retained through the API start at
`2026-06-03T14:35:04.875Z`, while retained deployment logs include
secret-adjacent build material and internal generated names that must not be
posted raw.

## Goal

Approve a redaction-safe, read-only host/Coolify export path for Ops to recover
the narrow crash-window evidence needed by [LUC-2279](/LUC/issues/LUC-2279).

## Constraints

- Read-only diagnostics only.
- No deploy, restart, rollback, environment edit, DNS change, database action,
  production account action, protected smoke, exchange mutation, or live-trading
  action.
- No raw deployment logs, `env`, `printenv`, `docker inspect .Config.Env`,
  `.Mounts`, `.NetworkSettings`, raw container/resource ids, connection strings,
  tokens, cookies, credentials, account data, exchange credentials, or generated
  database suffixes may be posted to issues, docs, screenshots, artifacts, or
  final reports.
- Raw host output, if collected by Ops, must remain local to the approved
  operator session and be deleted after the redacted export is produced.

## Definition of Done

- [x] Security review records an approved export path or a governance block.
- [x] The decision is posted back to [LUC-2279](/LUC/issues/LUC-2279).
- [x] Residual risk and unblock owner/action are explicit.

## Forbidden

- Production mutation.
- Secret or raw host-log disclosure.
- Asking for broad host access when a narrow command export is sufficient.
- Claiming root cause before Ops retrieves the approved evidence.

## Stage

- `verification`

## Security Approval

Status: approved with constraints.

Ops Release Lead may run or receive only the following bounded read-only export
for `2026-05-31T20:50:00Z` through `2026-05-31T21:20:00Z`:

1. Docker event readback filtered to the `soar-api` name/label and the incident
   window.
2. Docker inspect projection for the historical/current `soar-api` container
   limited to non-secret lifecycle fields: name, image tag or digest if already
   public, created time, state status, started/finished timestamps, exit code,
   error string after redaction, OOMKilled, restart count, health status when
   present, and non-sensitive labels required to confirm resource identity.
3. Docker daemon, kernel, systemd, and Coolify host journal snippets for the same
   window filtered to `soar-api`, Docker container lifecycle, OOM, exit, restart,
   and Coolify event terms.
4. Retained Coolify terminal/event snippets for production `soar-api` in the same
   window after applying the same redaction rules.

Required redaction before posting:

- Replace secrets, tokens, cookies, passwords, JWTs, API keys, private keys,
  bearer/basic auth headers, DSNs, connection strings, webhook URLs, account
  identifiers, email addresses, exchange credentials, generated resource ids,
  generated DB suffixes, container ids, network ids, volume ids, internal
  network names, IP addresses, and host paths with stable placeholders.
- Use stable aliases such as `[SOAR_API_CONTAINER]`, `[COOLIFY_RESOURCE]`,
  `[INTERNAL_NETWORK]`, `[CONTAINER_ID]`, `[HOST_PATH]`, `[CONNECTION_STRING]`,
  and `[SECRET_REDACTED]` so event ordering remains inspectable.
- Preserve timestamps, lifecycle verbs, exit codes, OOMKilled values, health
  status, and normalized error classes.
- If any redaction uncertainty remains, do not post the snippet. Send the
  unresolved redaction concern back to Security.

Approved posting target:

- Post only the redacted export summary or redacted artifact link to
  [LUC-2279](/LUC/issues/LUC-2279), with a note that raw host output was not
  persisted to the repo or issue thread.

## Validation Evidence

- Reviewed [LUC-2279](/LUC/issues/LUC-2279) task and evidence artifacts.
- Reviewed `docs/security/secure-development-lifecycle.md`.
- Reviewed `docs/operations/service-reliability-and-observability.md`.
- No host, Coolify, deploy, account, database, exchange, browser, or protected
  production command was run by Security in this lane.
- Artifact-only redaction scan performed against this file before closure.

## Security / Privacy Evidence

- Data classification: production host/Coolify logs; high-risk because they may
  contain secrets, connection material, internal ids, account data, and exchange
  credentials.
- Trust boundaries: Paperclip issue thread, repo artifacts, Ops host session,
  Coolify/VPS host logs.
- Permission or ownership checks: Ops owns host/Coolify retrieval; Security
  owns approval, redaction constraints, and block conditions.
- Abuse cases: leaked credentials in issue artifacts; host identifiers enabling
  lateral targeting; accidental deploy/restart/env mutation during diagnosis;
  false root-cause claim from incomplete logs.
- Secret handling: raw output must remain local to the approved Ops session and
  must not be attached or pasted. Only redacted summaries/artifacts may be
  posted.
- Fail-closed behavior: unresolved redaction uncertainty blocks posting and
  returns to Security.
- Residual risk: root cause remains unknown until Ops retrieves the approved
  redacted evidence.

## Result Report

- Task summary: approved a constrained redaction-safe host-log export path for
  Ops to unblock [LUC-2279](/LUC/issues/LUC-2279).
- Files changed: this task artifact only.
- How tested: source artifact review and focused artifact redaction scan.
- What is incomplete: Ops still needs to run or receive the approved read-only
  export and post redacted evidence.
- Next steps: Ops Release Lead resumes [LUC-2279](/LUC/issues/LUC-2279) after
  this blocker is closed.
- Decisions made: approved path is read-only, time-bounded, field-projected, and
  fail-closed on redaction uncertainty.
