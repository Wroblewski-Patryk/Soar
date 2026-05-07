# System Health

Last updated: 2026-05-07

## Latest Health Snapshot

- `origin/main` and public production web build-info are aligned at
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, the latest pushed code/tooling
  commit. The local branch is ahead with docs/evidence-only commits that are
  intentionally not pushed yet, so they are not production deploy targets.
  Production API `/health` and API `/ready` are healthy in the latest public
  checks.
- Canonical queue check found two open production-evidence items:
  `LIVEIMPORT-03` and `BOTMULTI-09`.
- The local full-architecture repair and validation chain is closed through
  `FULLARCH-FIX-11`; remaining release evidence requires authenticated or
  protected production access.
- The current shell exposes no production admin token, operator login, ops
  basic auth, or ops header environment variables. Authenticated production
  readback is therefore blocked in this session.
- Latest V1 release-gate dry-run
  `docs/operations/v1-release-gate-prod-2026-05-07T18-04-30-000Z.md` reports
  `readiness=not_ready`: activation plan/audit and RC artifacts are fresh;
  backup/restore drill and rollback proof are fresh but failed; protected
  non-dry-run release execution is still missing.
- Final blocker execution pack:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.

## Latest Validation

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

Production build-info now exposes `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`,
which contains the live-import collector and fail-closed hardening. Local
docs/evidence commits are ahead of `origin/main` and intentionally unpushed to
avoid creating new production deploy targets for documentation-only changes.
The next executable release task requires authenticated read-only production
evidence and protected production recovery proof.
