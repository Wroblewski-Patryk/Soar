# System Health

Last updated: 2026-05-08

## Latest Health Snapshot

- Production web build-info reached
  `052df82244ea0f81e8611ff8bb2b677db115bd19`, which contains the backend
  runtime parity fix, final release-gate build-info freshness, strict RC
  approval evidence hardening, production restore evidence alignment, and
  final preflight restore-context classification plus the current no-secret
  preflight status snapshot.
  Production API `/health`, API `/ready`, and WEB `/`
  passed the latest public smoke check. GitHub Actions is not an accepted
  production deployment path for this project, so future production deployment
  must still be performed through Coolify/manual operator controls followed by
  local build-info verification.
- Canonical queue check found two open production-evidence items:
  `LIVEIMPORT-03` and `BOTMULTI-09`.
- The local full-architecture repair and validation chain is closed through
  `FULLARCH-FIX-11`; remaining release evidence requires authenticated or
  protected production access.
- The current shell exposes no production admin token, operator login, ops
  basic auth, or ops header environment variables. Authenticated production
  readback is therefore blocked in this session.
- Latest V1 final preflight on deployed `052df82244ea0f81e8611ff8bb2b677db115bd19`
  reports build-info PASS, public smoke PASS, production DB restore context
  SATISFIED, activation evidence fresh, restore evidence fresh/PASS, and
  `BLOCKED` only on live-import auth, rollback auth, failed RC Gate 4 approval
  evidence, missing `LIVEIMPORT-03`, and failed rollback proof.
- Current no-secret final V1 preflight snapshot for deployed
  `052df82244ea0f81e8611ff8bb2b677db115bd19` is available at
  `docs/operations/_artifacts-v1-final-preflight-current.json` and
  `docs/operations/v1-final-preflight-current.md`. It is status-only handoff
  material, not final release evidence.
- Final blocker execution pack:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
- Production restore drill evidence is fresh/PASS and final preflight now
  treats it as satisfying the production DB restore context prerequisite.
  Current preflight still exits `BLOCKED` on live-import auth, rollback auth,
  failed RC Gate 4 approval evidence, missing `LIVEIMPORT-03`, and failed
  rollback proof.

## Latest Validation

- `V1-PAPER-LIVE-BACKEND-RUNTIME-PARITY-2026-05-08` PASS: fixed
  `executionOrchestrator` so close-settlement entry-fee truth is read through
  `RuntimeTradeGateway.sumEntryFees`, not a direct Prisma call inside the
  shared PAPER/LIVE orchestration path. Validation passed: focused engine
  parity/crash pack (`4/4` files, `26/26` tests), API typecheck, and
  repository guardrails. After verifying the reachable local DB stack through
  `localhost:5432`/`6379` and avoiding the unhealthy `desktop-linux` Docker
  context, the broader runtime sweep also passed sequentially (`10/10` files,
  `157/157` tests), including bot runtime scope and PnL parity e2e. The
  follow-up backend V1 evidence line also passed sequential exchange
  fill/live-import/takeover coverage (`8/8` files, `76/76` tests),
  manual/order/runtime orchestration coverage (`9/9` files, `75/75` tests),
  runtime service coverage (`19/19` files, `115/115` tests), exchange adapter
  coverage (`17/17` files, `86/86` tests), bot/position readback coverage
  (`16/16` files, `72/72` tests), bot contract/backtest parity coverage
  (`12/12` files, `84/84` tests), and the full local API suite with test-only
  API-key encryption env (Vitest exit `0`).
  Build validation also passed: `pnpm --filter api run build` and
  `pnpm run build`.
- Post-push deployment freshness check for the V1 backend parity candidate:
  `ops:deploy:wait-web-build-info` timed out after eight HTTP 200 polls over
  120 seconds; production web build-info remained on
  `4f6832d6d94d0d9e86a2504b4a00fe177a1c6c44`. Public production API `/health`
  returned `ok` and `/ready` returned `ready`. This is a Coolify/manual
  deployment boundary, not a local backend regression.
- Extended post-push deployment freshness check for the pushed V1 backend
  parity line: `ops:deploy:wait-web-build-info` timed out after thirty HTTP
  200 polls over 900 seconds; production web build-info still remained on
  `4f6832d6d94d0d9e86a2504b4a00fe177a1c6c44`. Public deploy smoke without
  workers passed (`API /health`, `API /ready`, and `WEB /` all returned 200).
  This confirms the production site is healthy but not yet deployed to the
  pushed candidate.
- Follow-up production freshness check then showed production web build-info
  advanced to `da1e52cfec0b70e5a94e59d75fe702a55c348d74`, which contains the
  V1 backend PAPER/LIVE adapter-pure runtime fix. A later wait for the
  docs-only state commit `156e19ea42b50b20201ebec9f040a1b3749a4978` timed out
  after ten HTTP 200 polls over 300 seconds, with production still on
  `da1e52cf...`. Public deploy smoke without workers passed again. A
  read-only `LIVEIMPORT-03` collector attempt against deployed
  `da1e52cf...` failed closed with missing production auth, and a names-only
  env scan found only `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`.
- Latest V1 release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-27-38-139Z.md` reports
  `readiness=not_ready`. It marks the 2026-05-07 activation, RC,
  backup/restore, and rollback artifacts as stale for 2026-05-08, and dry-run
  mode still cannot approve production. Fresh no-auth protected probes remain
  fail-closed: runtime freshness returned HTTP `401`, and rollback guard
  returned `shouldRollback=true` due to `runtime_freshness_endpoint_http_401`
  and `alerts_endpoint_http_401`.
- Final refreshed 2026-05-08 V1 release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-36-43-320Z.md` reports
  `readiness=not_ready`. Activation audit, activation plan, RC external gates
  status, RC sign-off record, and RC checklist are fresh. Backup/restore drill
  evidence is fresh but `FAILED` because production DB/Coolify access is not
  available in this shell. Rollback proof is fresh but `FAILED` because
  protected runtime freshness and alerts endpoints return HTTP `401` without
  auth.
- Follow-up production freshness check for latest `main`
  `d1755b45fc5a6fa901b86519366188efe743a05a` timed out after ten HTTP 200
  polls over 300 seconds; production advanced from `76a7d0fc...` to
  `e6ccbedaa1d0074d5dc335935bb6b51a9bb1e387`, but not to `d1755b45...`.
  Public deploy smoke without workers passed. `LIVEIMPORT-03` readback against
  deployed `e6ccbeda...` still failed closed with missing production auth.
  Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08T05-43-51-157Z.md` remains
  `not_ready` with the same fresh activation/RC and failed recovery blockers.
- RC evidence preflight on 2026-05-08: strict production evidence check
  reports `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=OPEN`; blockers are limited to
  Gate 4 sign-off identity/final approval fields (Engineering, Product,
  Operations, RC owner, and final status not `APPROVED`). RC gates summary
  also reports Gate2 policy `PASS_ONLY` and notes the underlying evidence
  artifact is stale relative to the refreshed status.
- Deployment coordination note: when a future step depends on a pushed commit
  being live, wait for production build-info before continuing. This shell does
  not expose Coolify deploy webhook/API token variables, so force deploy must
  be done by an operator in Coolify or by providing out-of-repository deploy
  webhook credentials.
- Deploy freshness coordination PASS: `ops:deploy:wait-web-build-info` for
  `0a2e2353` passed after production advanced from `2c232699...` to
  `0a2e2353177c15d4a4934c03837835785e01d710`. Public deploy smoke without
  workers passed immediately afterward.
- `LIVEIMPORT-03` auth preflight hardening PASS: the existing
  `ops:liveimport:readback` missing-auth fail-closed path now names the
  accepted auth variable choices without printing secret values. Validation
  covered script syntax, help, dry-run, no-auth fail-closed output, and no
  artifact creation.
- Recovery proof preflight hardening PASS: restore drill help and missing prod
  container failure now name `PROD_DB_CHECK_*` / `PRODUCTION_DB_CHECK_*`
  choices, and rollback proof help names `ROLLBACK_GUARD_*` base URL/auth/OPS
  choices. Validation covered script syntax, help paths, missing prod DB
  container fail-closed path, guardrails, docs parity, and diff check.
- RC sign-off preflight hardening PASS: blocked `ops:rc:signoff:build` runs
  now print missing required Gate 4 fields, while approved temp-output behavior
  remains available when Gates 1-3 pass and required names are provided.
  Owner contact is reported as recommended handoff metadata.
- Current deployed-HEAD V1 release-gate dry-run:
  `docs/operations/v1-release-gate-prod-2026-05-08Tcurrent-deployed-head-dry-run.md`
  reports `readiness=not_ready`. Activation and RC families are fresh;
  backup/restore drill and rollback proof are fresh but failed; dry-run mode
  still blocks final approval.
- Release gate live-import evidence enforcement PASS: `ops:release:v1:gate`
  now requires `LIVEIMPORT-03 runtime readback` for production. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Tliveimport-required-dry-run.md`
  reports `readiness=not_ready` with `evidence:liveImportReadback:missing`,
  backup/restore failed, rollback proof failed, and dry-run mode blockers.
- Release gate build-info freshness hardening PASS: `ops:release:v1:gate`
  now supports `--expected-sha` / `RELEASE_GATE_EXPECTED_SHA` and adds a web
  build-info freshness gate before deploy smoke. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Tbuild-info-required-dry-run.md`
  shows the planned `ops:deploy:wait-web-build-info` step and remains
  `not_ready` for the expected protected evidence blockers.
- Release gate RC approval evidence hardening PASS: `ops:release:v1:gate`
  now requires RC external gates to show all four gates `PASS`, the RC
  sign-off record to report `RC status: APPROVED`, and the RC checklist to
  show `G4=PASS`. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`
  reports RC external gates, RC sign-off, and RC checklist as `failed` while
  current Gate 4 remains open/blocked, so final `ready` cannot pass on fresh
  but unapproved RC artifacts.
- Final V1 preflight command PASS as fail-closed tooling: `ops:release:v1:preflight`
  confirms deployed build-info for current `HEAD`, reports missing
  `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, and production DB restore env
  names, classifies current release evidence blockers, exits non-zero, and
  writes no protected production evidence artifacts when operator access is
  absent.
- Final V1 preflight regression lock PASS: focused tests now cover missing
  required envs, token or email/password alternatives, both production DB env
  families, optional OPS auth layers, and skipped build-info behavior for local
  unit tests.
- Final V1 preflight JSON report PASS: `ops:release:v1:preflight` now supports
  `--json-output <path>` for a no-secret machine-readable blocker report. A
  local no-auth run against a temporary JSON path produced `status=blocked`
  and no secret/token value exposure; the generated file was not committed as
  source-of-truth because it contains a point-in-time expected SHA.
- Final V1 preflight public smoke PASS: `ops:release:v1:preflight` now runs
  the existing public deploy smoke with worker checks disabled. Current
  preflight reports build-info PASS and public API/Web smoke PASS, then blocks
  only on protected auth/DB/approval and evidence inputs.
- Final V1 preflight remediation hints PASS: known blocker IDs now include
  no-secret next actions in CLI/JSON output, pointing to the approved final
  blocker commands for live-import readback, restore drill, rollback proof,
  RC sign-off, and checklist sync.
- Final V1 preflight blocker details PASS: the optional no-secret JSON report
  now includes additive `blockerDetails` metadata for known and unknown
  blockers, including category, severity, protected-input requirement,
  final-evidence requirement, and remediation availability for later
  Web/operator status rendering.
- Final V1 preflight Markdown report PASS: `ops:release:v1:preflight` now
  accepts `--markdown-output <path>` and writes a human-readable no-secret
  status report from the same preflight report object as JSON. It remains
  status-only handoff material, not final V1 release evidence.
- Protected-context Coolify sweep PASS as blocker classification:
  production build-info for `e6e7d4a044ce80279c542412a91bae4a6a012392`
  passes, public API/Web smoke passes, and Coolify exposes the production
  Postgres container name `x11cfnz1dd9x0yzccftqzcoe`. The sweep remains
  release-blocked because local Docker cannot reach that VPS container, Soar
  application auth is not present for `LIVEIMPORT-03`, rollback proof auth is
  not present, and RC Gate 4 approver identities are still missing. Generated
  reports:
  `docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
  and
  `docs/operations/v1-final-preflight-2026-05-08-protected-context.md`.
- Production restore drill PASS: approved Coolify terminal access executed the
  isolated backup/restore drill against production Postgres container
  `x11cfnz1dd9x0yzccftqzcoe`. Evidence:
  `docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`. Follow-up
  V1 preflight reports `backup/restore drill evidence: fresh for 2026-05-08`.
- Protected auth context sweep PASS as blocker classification: approved
  API runtime env-name sweep recorded no `LIVEIMPORT_READBACK_*` or
  `ROLLBACK_GUARD_*` auth env names, rollback proof rerun failed closed on
  protected `401` responses, and `ops:release:v1:preflight` now reports
  production DB restore context as satisfied by fresh backup/restore drill
  evidence. Focused tests passed (`node --test scripts/runV1FinalPreflight.test.mjs`,
  `11/11`). Remaining preflight blockers are live-import auth, rollback auth,
  failed RC Gate 4 approval evidence, missing `LIVEIMPORT-03`, and failed
  rollback proof.
- `V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07` PASS: pre-fix e2e proved
  `/dashboard/positions/live-status` returned global reconciliation diagnostic
  counts for an authenticated user. The route now filters
  `lastPositionDiagnostics` by `req.user.id` and recomputes summary/count
  fields from the user-scoped diagnostics. Post-fix validation passed: focused
  e2e (`3/3`), import diagnostics/service pack (`35/35`), API typecheck,
  repository guardrails, docs parity, and diff check.
- `V1-DASHBOARD-CRYPTO-ICONS-REGRESSION-2026-05-07` PASS: pre-fix Web
  regression proved `AssetSymbol` stayed stuck on a fallback badge after a
  prior image error and a later symbol/icon URL change. The shared component
  now resets image failure state when the normalized symbol or icon URL changes.
  Post-fix validation passed: component test (`4/4`), focused dashboard widget
  pack (`25/25`), Web typecheck, Web lint, repository guardrails, docs parity,
  and diff check.
- `V1-PROD-GITHUB-ACTIONS-REGRESSION-CLEANUP-2026-05-07` in progress:
  removing GitHub Actions production promote/rollback entrypoints and the
  local helper because the operator confirmed GitHub Actions is not an accepted
  deployment mechanism for this project.
- Superseded GitHub Actions deploy-path notes are closed as invalid for the
  active project setup. Production deployment is Coolify/manual operator owned.
- `V1-FINAL-BLOCKER-PREREQ-RECHECK-2026-05-07` PASS as blocker
  classification: public production build-info matches
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`; names-only env scan found
  `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`, not the Soar production auth variables
  required by the final blocker pack; `ops:liveimport:readback` failed closed
  before protected runtime readback with missing auth; refreshed release-gate
  dry-run remains `not_ready`.
- `V1-PROD-RECOVERY-PROOF-BLOCKED-REFRESH-2026-05-07` PASS as blocker
  classification: rollback proof failed closed on protected `401` responses;
  restore drill is recorded as not executed due to missing production
  DB/Coolify access; release-gate dry-run classifies both recovery proof
  families as `FAILED`.
- `V1-RC-BLOCKED-REFRESH-2026-05-07` PASS: RC status/sign-off/checklist were
  refreshed as blocked/open evidence. Follow-up production release-gate dry-run
  reports RC families fresh and readiness still `not_ready`.
- `V1-PROD-ACTIVATION-REFRESH-2026-05-07` PASS: fresh production activation
  plan and activation audit were created as `NO-GO` artifacts. Follow-up
  production release-gate dry-run reports activation plan/audit `fresh` and
  readiness still `not_ready` due to stale RC, backup/restore, rollback, and
  dry-run blockers.
- `V1-PROD-GATE-DRY-RUN-2026-05-07` release-gate classifier PASS in dry-run
  mode: generated production report with `readiness=not_ready`. Blockers:
  stale activation audit, activation plan, RC external gates status, RC
  sign-off, RC checklist, backup/restore drill evidence, rollback proof pack,
  plus dry-run mode requiring remote/non-dry-run execution for approval.
- `PROD-BUILDINFO-LAG-2026-05-07` production freshness recheck: canonical
  build-info wait for `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` timed out
  after six HTTP 200 polls with last seen SHA
  `6bf5de83b8ed285410ecc10ecc50a2567ac68ee1`. Public API `/health` and
  `/ready` passed. A later wait passed on attempt 1 for `21bb52f1...`, closing
  this deploy-lag note for the code/tooling commit.
- `LIVEIMPORT-03-COLLECTOR-HARDENING-2026-05-07` collector hardening PASS:
  syntax check, help path, dry-run path, missing-auth fail-closed path, and a
  local no-running-session harness. The collector now exits non-zero when no
  runtime positions payload was collected from a RUNNING session.
- `LIVEIMPORT-03-COLLECTOR-2026-05-07` ops collector validation PASS:
  `ops:liveimport:readback -- --help`, dry-run with expected production SHA,
  and missing-auth fail-closed path all behaved as expected. The fail-closed
  run did not access protected API without credentials and did not print
  secret values.
- Post-push deploy freshness check for docs/collector SHA `6bf5de83` timed out
  twice; production remained on runtime candidate `1f816362`. This does not
  block `LIVEIMPORT-03` because the collector runs locally and the deployed
  runtime fix is already present in `1f816362`.
- `PROD-PROMOTE-PREQ-2026-05-07` production promotion prerequisite sweep:
  remote `main` check PASS for `1f816362c93e117e47cfe52a35e0fec93bd0b37d`.
  First public web build-info wait timed out on stale
  `834f83711ba11288829746338d1097abb6bf1c44`; later rerun PASS on attempt 1
  with `gitSha=1f816362c93e117e47cfe52a35e0fec93bd0b37d`. Public production
  API `/health`, API `/ready`, and web `/auth/login` PASS.
- `PLAN-SWEEP-2026-05-07` planning-status sweep PASS: active planning now
  records local audit closure through `FULLARCH-FIX-11` and the
  `LIVEIMPORT-03` prerequisite sweep; no executable local NOW task remains
  before authenticated production readback.
- `FULLARCH-FIX-11` focused wallet/market/bot topology gate PASS: API pack
  (`11/11` files, `80/80` tests) and Web pack (`21/21` files, `49/49` tests).
- `FULLARCH-FIX-10` focused market-stream/dashboard-monitoring gate PASS: API
  pack (`9/9` files, `63/63` tests) and Web pack (`19/19` files, `79/79`
  tests).
- `FULLARCH-FIX-09` focused strategy/backtest/reports/logs gate PASS: API pack
  (`12/12` files, `92/92` tests) and Web pack (`21/21` files, `49/49` tests).
- `FULLARCH-FIX-08` focused security/isolation release-gate validation PASS:
  `18/18` API test files and `87/87` tests using sequential execution with
  test-only API-key encryption env.
- `FULLARCH-FIX-07` focused runtime repair closure validation PASS:
  `16/16` API test files and `240/240` tests using sequential execution.
- `FULLARCH-FIX-06` focused import-normalization validation PASS:
  normalizer suite (`5/5`), import/reconciliation/takeover pack (`42/42`), and
  API typecheck.
- `pnpm run quality:guardrails` PASS.
- `git diff --check` PASS with line-ending warnings only.
- 2026-05-07 safe env-scan guardrail: names-only PowerShell scan confirmed
  only `FIGMA_OAUTH_TOKEN` and `STITCH_API_KEY` match the broad auth/prod
  name pattern in this shell; no values are recorded in repository artifacts.
- 2026-05-07 post-`FULLARCH-FIX-11` prerequisite sweep: names-only PowerShell
  scan again found only `FIGMA_OAUTH_TOKEN` and `STITCH_API_KEY`; no production
  read-only auth variable name is present in this shell.
- 2026-05-07 state-sync analysis: PowerShell queue scan found first open tasks
  at `LIVEIMPORT-03` and `BOTMULTI-09`; environment-variable name scan found
  only `FIGMA_OAUTH_TOKEN`, not production auth material.

## Validation Expectations

Docs-only agent workflow changes require at minimum:

- path/link review
- `pnpm run quality:guardrails`

Broader lint, typecheck, tests, and build are not required unless code or
runtime contracts are changed.

## Deployment Impact

Production build-info reached `721fe8482922835a9419f0e529baeef4ff6a74c9`,
which contains the V1 backend PAPER/LIVE adapter-pure runtime fix, refreshed
release-state docs, blocker evidence alignment, deploy-wait coordination,
operator preflight hardening notes, live-import evidence enforcement,
build-info freshness enforcement, strict RC approval evidence enforcement, and
restore-context preflight alignment. The next executable release task must
still verify the currently checked-out `HEAD` with build-info before protected
evidence collection. It requires authenticated read-only production evidence,
protected production rollback proof, and real RC approval inputs; the current
shell still lacks those credentials and approvals.
