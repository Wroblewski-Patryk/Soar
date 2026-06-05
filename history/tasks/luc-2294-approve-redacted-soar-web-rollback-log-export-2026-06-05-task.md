# LUC-2294 - Security Approval For Redacted soar-web Rollback/Log Export Path

## Context

- Issue: [LUC-2294](/LUC/issues/LUC-2294)
- Blocked issue: [LUC-2285](/LUC/issues/LUC-2285)
- Lane owner: Security Review Lead
- Stage: `verification`

[LUC-2285](/LUC/issues/LUC-2285) cleared stale `soar-web` deployment queue rows
and triggered one controlled redeploy from pushed `main` at
`6e31d814046b640ad529d1cd57f968ba6f67b05e`. Production Web stayed `503`,
build-info stayed unavailable, API `/health` and `/ready` stayed `200`, and
Coolify still reported `soar-web` as unhealthy, restarting, or not converged.

This Security gate approves the safe evidence path for the next Ops action. It
does not itself execute rollback, redeploy, restart, env edit, queue cleanup, or
host mutation.

## Goal

Approve or block a redacted, least-privilege path for Ops to retrieve enough
`Soar / production / soar-web` deployment history, deployment logs, and host
lifecycle evidence to choose either a rollback target or a separate remediation
permit after the failed redeploy.

## Constraints

- Target resource is `Soar / production / soar-web` only.
- Read-only diagnostics only under this Security issue.
- Raw outputs may be viewed only inside the approved Ops operator session and
  must not be persisted after the redacted summary/artifact is produced.
- No raw secret values, tokens, cookies, auth headers, env values, private keys,
  DSNs, connection strings, webhook URLs, account identifiers, emails, payment
  data, exchange credentials, protected user data, raw Coolify resource ids,
  raw deployment ids, generated database suffixes, generated app/container
  names, container ids, network ids, volume ids, internal network names,
  internal IPs, host paths, or full unredacted logs may be posted to issues,
  docs, screenshots, artifacts, or final reports.

## Definition Of Done

- [x] Security decision names the approved retrieval path.
- [x] Redaction and projection rules are explicit.
- [x] Rollback boundary is explicit.
- [x] Host/Coolify direct retrieval boundary is explicit.
- [x] Fail-closed conditions and residual risk are recorded.

## Forbidden

- Production mutation under this issue.
- Posting raw host, Coolify, deployment, container, or env output.
- Printing or storing secret-bearing values.
- Claiming rollback is executable without an exact previous stable source ref,
  image, or deployment candidate from redacted evidence.

## Security Decision

Status: approved with constraints.

Ops Release Lead may retrieve the minimum read-only evidence needed to select
the next `soar-web` recovery action. The approved evidence path is ordered:

1. Coolify UI/API deployment-history projection for `soar-web`.
2. Coolify terminal/build/deployment-log snippets for the failed redeploy
   window and the immediately preceding stable candidate.
3. Coolify application metadata limited to lifecycle state, restart class,
   branch, commit/source ref, public FQDN alias, and port alias.
4. Host-side Docker/Coolify lifecycle snippets only if Coolify UI/API cannot
   identify the previous stable source/image or the crash class. Host retrieval
   must be narrow to the `soar-web` container/application lifecycle window.
5. Local git readback only for public source-ref confirmation.

Ops may use its approved Coolify/API/operator access directly for this
read-only retrieval. A narrower UI-only path is not required because the issue
needs deployment-history ordering and failed redeploy diagnostics, but host
access must be used only as a fallback when Coolify UI/API evidence is
insufficient.

Approved fields that may be posted after projection/redaction:

- Normalized resource alias: `soar-web`.
- Deployment or lifecycle state such as `queued`, `in_progress`, `finished`,
  `failed`, `cancelled`, `running`, `restarting`, or normalized crash class.
- Timestamps and ordering.
- Branch name and exact git commit SHA when it is a public source ref.
- Build/deploy command exit code and normalized error class.
- Public image tag or digest only when required for rollback selection, after
  removing registry host/path material that includes raw ids or generated
  names.
- Stable aliases for deployment candidates, such as `[FAILED_REDEPLOY_1]`,
  `[PREVIOUS_STABLE_CANDIDATE_A]`, and `[SOAR_WEB_IMAGE_CANDIDATE_A]`.

Required redaction before posting:

- Replace tokens, cookies, bearer/basic auth headers, passwords, private keys,
  API keys, DSNs, connection strings, webhook URLs, account identifiers, emails,
  exchange credentials, raw Coolify resource ids, raw deployment ids, generated
  database suffixes, generated app/container names, container ids, network ids,
  volume ids, internal network names, internal IPs, host paths, and unneeded
  environment material with stable placeholders.
- Preserve enough chronology to compare failed and previously stable
  deployments.
- If a line mixes useful lifecycle evidence with secret-adjacent material,
  paraphrase it as a normalized event instead of posting the raw line.
- If redaction uncertainty remains, fail closed and return the snippet
  classification question to Security before posting.

## Rollback Boundary

Security approval here does not execute or independently authorize a rollback
mutation. It approves the evidence path and the security preconditions for a
separate Ops release permit.

Rollback may proceed only under a separate Ops permit when the permit names:

- exact target resource: `Soar / production / soar-web`;
- exact previous stable source ref, image tag/digest, or deployment candidate
  chosen from redacted evidence;
- pre-state proof that API `/health` and `/ready` remain healthy and Web still
  requires recovery;
- mutation limit of one rollback/redeploy action;
- post-action smoke for Web `/`, Web `/api/build-info`, API `/health`, and API
  `/ready`;
- stop condition forbidding chained redeploys, restarts, env edits, broader
  queue cleanup, or second rollback attempts under the same permit.

If the current redacted evidence already identifies
`b894e5dd30614dfd2035e91e3d848c842d3ff380` as the previous finished
`soar-web` source candidate, Ops may use that public commit SHA as the named
candidate in the separate rollback permit, provided it also records the
deployment chronology and public smoke proof without raw ids or logs.

## Security / Privacy Evidence

- Data classification: production deployment history and logs; high risk for
  secret-adjacent env, generated identifiers, host internals, and account data.
- Trust boundaries: Paperclip issue thread, repo artifacts, Ops local operator
  session, Coolify UI/API, VPS host logs.
- Abuse cases considered: secret leakage through logs, targeted probing through
  raw ids, accidental mutation during diagnostics, rollback to the wrong image
  because evidence is over-redacted, and persistence of raw logs in repo or
  issue artifacts.
- Required controls: read-only retrieval, field projection, stable aliases,
  raw-output non-persistence, source-ref exactness before rollback, and
  fail-closed review for uncertain snippets.

## Validation Evidence

- Reviewed [LUC-2294](/LUC/issues/LUC-2294) heartbeat context.
- Reviewed `history/evidence/luc-2285-soar-web-queue-clear-redeploy-2026-06-05.md`.
- Reviewed `history/tasks/luc-2285-clear-soar-web-queued-deployments-and-redeploy-main-sha-2026-06-05-task.md`.
- Reviewed related artifacts for [LUC-2289](/LUC/issues/LUC-2289),
  [LUC-2292](/LUC/issues/LUC-2292), [LUC-2287](/LUC/issues/LUC-2287), and
  [LUC-2282](/LUC/issues/LUC-2282).
- No host, Coolify, deploy, rollback, restart, account, database, exchange,
  browser, or protected production command was run by Security in this lane.

## Result Report

- Task summary: approved a constrained redacted `soar-web` deployment-history,
  log, and fallback host-lifecycle evidence path; rollback remains a separate
  Ops permit requiring an exact named candidate.
- Files changed: this task artifact.
- Deployment impact: none from Security.
- Residual risk: production Web remains `503` until Ops completes the approved
  evidence retrieval and executes a separately permitted recovery action.
