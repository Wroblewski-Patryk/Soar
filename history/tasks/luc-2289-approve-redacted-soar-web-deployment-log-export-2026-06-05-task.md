# LUC-2289 - Approve Redacted soar-web Deployment-Log Export

## Context

- Issue: [LUC-2289](/LUC/issues/LUC-2289)
- Parent: [LUC-2286](/LUC/issues/LUC-2286)
- Lane owner: Security Review Lead
- Stage: `verification`

[LUC-2286](/LUC/issues/LUC-2286) executed the single permitted `soar-web`
redeploy after [LUC-2280](/LUC/issues/LUC-2280) restart recovery did not clear
production Web `503`. The redeploy queued but Web remained `503`, and Coolify
still showed `soar-web` as `restarting:unknown` with queued deployment rows.

Rollback or a second recovery mutation is not safe until Ops selects the exact
previous stable deployment, image, or source ref from deployment-history or
log evidence. That evidence can contain secrets, generated resource names, raw
resource ids, internal host details, and deployment environment material, so
Security must approve the export path first.

## Goal

Approve or block a redaction-safe, read-only deployment-log and
deployment-history export path for `Soar / production / soar-web`.

## Constraints

- Read-only diagnostics only.
- No deploy, restart, rollback, force-start, env edit, database action,
  team/account change, protected smoke, exchange mutation, or live-trading
  action.
- No raw secret values, tokens, cookies, auth headers, env values, private keys,
  payment data, account data, exchange credentials, protected user data, raw
  resource ids, generated database suffixes, raw container ids, raw deployment
  ids, host paths, internal IPs, network ids, volume ids, or full unredacted
  logs may be posted to issues, docs, screenshots, artifacts, or final reports.
- Raw export output, if viewed by Ops, must remain local to the approved
  operator session and must be discarded after the redacted summary or artifact
  is produced.

## Definition Of Done

- [x] Security decision states whether Ops may read/export the required logs
      and history.
- [x] Allowed evidence fields are named.
- [x] Redaction requirements are explicit.
- [x] Fail-closed and residual-risk conditions are explicit.
- [x] The decision is posted back to [LUC-2289](/LUC/issues/LUC-2289).

## Forbidden

- Production mutation.
- Raw host, Coolify, deployment, or env output disclosure.
- Posting raw resource/deployment ids or generated database suffixes.
- Claiming a rollback target is safe before Ops retrieves and redacts the
  required deployment-history or log evidence.

## Security Approval

Status: approved with constraints.

Ops Release Lead may read or export only the minimum `soar-web` deployment
history and deployment-log evidence needed to select the next recovery action.
The approved target is `Soar / production / soar-web` only.

Approved read-only sources:

1. Coolify deployment-history rows for `soar-web` after redaction/projection.
2. Coolify deployment terminal/build/runtime snippets for the failed redeploy
   window and the immediately preceding candidate stable deployment.
3. Host-side Docker/Coolify lifecycle snippets only if the Coolify API/UI view
   cannot name the required previous stable deployment/image/source ref.
4. Local source-control readback for public git branch/commit confirmation.

Approved fields that may be posted after projection/redaction:

- Normalized resource alias: `soar-web`.
- Deployment status or lifecycle state, for example `queued`, `in_progress`,
  `failed`, `succeeded`, `cancelled`, `restarting`, or normalized error class.
- Timestamps and ordering.
- Branch name and exact git commit SHA when it is a source ref.
- Build/deploy command exit code and normalized error class.
- Public image tag or digest only when required to choose rollback and only
  after removing registry host/path material that includes raw ids or generated
  names.
- Stable local aliases for deployment candidates, for example
  `[FAILED_REDEPLOY_1]`, `[PREVIOUS_STABLE_CANDIDATE_A]`, and
  `[SOAR_WEB_IMAGE_CANDIDATE_A]`.

Required redaction before posting:

- Replace tokens, cookies, bearer/basic auth headers, passwords, private keys,
  API keys, DSNs, connection strings, webhook URLs, account identifiers,
  emails, exchange credentials, raw Coolify resource ids, raw deployment ids,
  generated database suffixes, generated app/container names, container ids,
  network ids, volume ids, internal network names, internal IPs, host paths,
  and unneeded environment material with stable placeholders.
- Preserve enough chronology to compare deployment rows and identify the
  previous stable source/image candidate.
- If a log line mixes useful lifecycle evidence with secret-adjacent material,
  post a paraphrased normalized event instead of the raw line.
- If redaction uncertainty remains, do not post the snippet. Return the
  snippet classification question to Security.

Approved posting target:

- Post only the redacted export summary or redacted artifact link to
  [LUC-2286](/LUC/issues/LUC-2286) or its active Ops follow-up. Mention
  [LUC-2289](/LUC/issues/LUC-2289) as the approval source.

## Security / Privacy Evidence

- Data classification: production deployment history and logs; high risk
  because they may contain secrets, internal ids, generated deployment names,
  account data, and environment material.
- Trust boundaries: Ops local host/Coolify session, Paperclip issue thread,
  repo artifacts, Coolify API/UI, VPS host logs.
- Permission checks: Ops owns retrieval and mutation decisions; Security owns
  redaction constraints and block conditions.
- Abuse cases: leaked Coolify token or env value; raw id disclosure enabling
  targeted platform probing; accidental second mutation during diagnosis;
  rollback to the wrong image because evidence was over-redacted or incomplete.
- Required controls: read-only retrieval, field projection, stable aliases,
  raw-output non-persistence, fail-closed review for uncertain lines.

## Validation Evidence

- Reviewed [LUC-2289](/LUC/issues/LUC-2289) heartbeat context.
- Reviewed local recovery artifacts for [LUC-2280](/LUC/issues/LUC-2280),
  [LUC-2281](/LUC/issues/LUC-2281), and [LUC-2282](/LUC/issues/LUC-2282).
- Reviewed `docs/security/secure-development-lifecycle.md`.
- Reviewed `docs/operations/service-reliability-and-observability.md`.
- Targeted redaction scan over this task artifact returned no secret-value,
  connection-string, or private-key pattern matches.
- No host, Coolify, deploy, rollback, restart, account, database, exchange,
  browser, or protected production command was run by Security in this lane.

## Result Report

- Task summary: approved a constrained redaction-safe `soar-web` deployment-log
  and deployment-history export path for Ops.
- Files changed: this task artifact and project context files.
- How tested: source artifact review and targeted redaction scan over the new
  security approval wording.
- What is incomplete: Ops still needs to retrieve or read the approved evidence
  and choose the next recovery action under a separate permit.
- Next owner/action: Ops Release Lead retrieves the redacted deployment-history
  evidence and posts only the approved summary/artifact link.
- Residual risk: rollback target remains unknown until Ops completes the
  approved evidence retrieval.
