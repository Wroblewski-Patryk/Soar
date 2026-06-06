# LUC-2504 Soar Web Failed Deploy Diagnosis

- Date: 2026-06-06
- Checked at: 2026-06-06T16:39:15Z
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Scope: read-only `soar-web` deploy metadata, deployment endpoint availability,
  sanitized Web logs, public Web root, and public Web build-info after
  [LUC-2499](/LUC/issues/LUC-2499).
- Secret handling: Coolify token/config bindings were used only from the
  runtime environment. No token, cookie, account data, raw resource id, raw
  deployment id, internal host/path, container id, generated name, or secret
  value was printed or stored.

## Result

Status: verified for read-only diagnosis; production mutation not justified by
this evidence.

Public Web is currently reachable and public `/api/build-info` returns
`56d8d440bfe0fd9ee692e9f669e35414d85d2493`. Coolify's `soar-web` application
metadata still reports configured `git_commit_sha` as
`b894e5dd30614dfd2035e91e3d848c842d3ff380`, but deployment-list endpoints
available to this token show no queued, in-progress, failed, or historical rows
to correlate.

The Web log tail still contains the Next.js Server Action mismatch message from
the previous deploy/recovery window. A short repeat read did not increase the
observed mismatch line count or log size. This is consistent with stale clients
posting an older action id after deploy/recovery rather than an active failed
deploy by itself.

Important caveat: public build-info currently reports
`metadataSource=github-branch`, generated at `2026-06-06T02:55:48.688Z`. That
means the public SHA is useful public freshness evidence, but it is weaker than
authoritative container-source provenance. A separate hardening lane should
restore build metadata to prefer the actual Coolify/source commit available at
build time.

## Read-Only Checks

| Check | Result |
| --- | --- |
| Paperclip heartbeat context | [LUC-2504](/LUC/issues/LUC-2504), no comments, no blockers, parent [LUC-2499](/LUC/issues/LUC-2499) done |
| Web `/` | `200` |
| Web `/api/build-info` | `200`, `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`, `gitRef=main`, `metadataSource=github-branch` |
| Web build metadata generated at | `2026-06-06T02:55:48.688Z` |
| Coolify `soar-web` app readback | `200`, name `soar-web`, branch `main`, configured `git_commit_sha=b894e5dd30614dfd2035e91e3d848c842d3ff380`, status `running:unknown`, port `3002` |
| Coolify `soar-api` app readback | `200`, name `soar-api`, branch `main`, configured `git_commit_sha=HEAD`, status `running:unknown`, port `3001` |
| Coolify app deployment endpoint | `/api/v1/applications/{web}/deployments` returned `404` in this API scope |
| Global deployments filtered by application/resource/uuid | `200`, `0` rows |
| Global deployments filtered by queued/in-progress/failed | `200`, `0` rows |
| Global deployments unfiltered | `200`, `0` rows |
| Web logs endpoint | `200` |
| Server Action mismatch observation | initial sanitized log sample had one JSON log line containing two mismatch entries; repeat read 10 seconds later had the same log size and line count |

## Prior Recovery Context Reviewed

- [LUC-2285](/LUC/issues/LUC-2285): a controlled `soar-web` redeploy at
  `6e31d814046b640ad529d1cd57f968ba6f67b05e` failed closed with Web `503`.
- [LUC-2286](/LUC/issues/LUC-2286): Web remained `503`; previous finished
  source candidate `b894e5dd30614dfd2035e91e3d848c842d3ff380` was identified.
- [LUC-2302](/LUC/issues/LUC-2302): CTO selected redacted Web runtime crash
  investigation instead of another source/image mutation.
- [LUC-2304](/LUC/issues/LUC-2304): Frontend fixed the Web runtime image start
  wrapper locally after the crash showed the wrapper was missing from the
  runtime image.
- [LUC-2499](/LUC/issues/LUC-2499): later read-only sweep verified public Web
  and API health green at public build-info SHA `56d8d440...`.

## Interpretation

Current evidence does not support an immediate restart, redeploy, rollback, env
edit, queue clear, or host mutation:

- public Web root and build-info are reachable;
- Coolify exposes no active failed or queued deployment rows to this token;
- Web logs show a known Next.js stale-client/server-action mismatch, not a
  current startup crash;
- the observed mismatch tail did not grow during the short repeat read;
- the older `b894e5dd...` value is still present in Coolify app metadata after
  the rollback/recovery path, but is not enough by itself to prove the running
  container is stale.

The remaining deploy-confidence gap is source provenance. Because build-info is
currently generated from the GitHub branch fallback, future release gates should
not treat it as the only proof of the exact container source commit. Restore
the build metadata path so `SOURCE_COMMIT`, `GITHUB_SHA`,
`COOLIFY_GIT_COMMIT_SHA`, or equivalent build-time metadata is present and
reported before using Web build-info as authoritative image/source proof.

Follow-up created: [LUC-2506](/LUC/issues/LUC-2506) owns the separate
authoritative Web build-info source-provenance hardening lane and was
immediately checked out by a separate DRE run. That issue is not a production
mutation permit; it must request explicit approval if it finds that
env/deploy/restart changes are required.

## Validation

- Paperclip heartbeat-context readback for [LUC-2504](/LUC/issues/LUC-2504) ->
  PASS.
- Public Web `/` probe -> `200`.
- Public Web `/api/build-info` probe -> `200`,
  `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`,
  `metadataSource=github-branch`.
- Coolify read-only app/log/deployment endpoint probes -> PASS/PARTIAL:
  app/log endpoints readable; deployment history endpoints returned no rows
  or `404` for the application-specific path.
- Source inspection:
  - `b894e5dd30614dfd2035e91e3d848c842d3ff380` is commit
    `test: align release preflight contracts`, dated 2026-06-05.
  - `56d8d440bfe0fd9ee692e9f669e35414d85d2493` is commit
    `docs: close LUC-2395 coordination state`, dated 2026-06-06.

## Mutation Boundary

No deploy, restart, rollback, queue clear, force start, env edit, database or
Redis action, team/account change, protected smoke, secret value readback,
exchange action, screenshot, or live-trading action occurred.

## Residual Risk

- Coolify application `running:unknown` remains a metadata limitation.
- This API token did not expose deploy history rows for deeper deploy-log
  correlation.
- Web build-info is not authoritative source provenance while
  `metadataSource=github-branch`.
- Protected worker/dashboard/account/SLO/rollback/live runtime evidence remains
  separate and fail-closed through the existing protected release chain.
- Follow-up [LUC-2506](/LUC/issues/LUC-2506) is open with a live DRE execution
  path for authoritative Web build-info source provenance.
