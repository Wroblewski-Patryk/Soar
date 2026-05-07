# System Health

Last updated: 2026-05-07

## Latest Health Snapshot

- Local and remote `main` are synchronized at
  `6bf5de83a482eda08543138d8518e0aa23ccb3c6` after the readback collector
  push, while public production web build-info still reports runtime candidate
  `1f816362c93e117e47cfe52a35e0fec93bd0b37d`. Production API `/health`, API
  `/ready`, and web `/auth/login` are healthy. The runtime candidate contains
  the live-import fixes required for `LIVEIMPORT-03`; the newer pushed commits
  are docs/ops-tooling only.
- Canonical queue check found two open production-evidence items:
  `LIVEIMPORT-03` and `BOTMULTI-09`.
- The local full-architecture repair and validation chain is closed through
  `FULLARCH-FIX-11`; remaining release evidence requires authenticated or
  protected production access.
- The current shell exposes no production admin token, operator login, ops
  basic auth, or ops header environment variables. Authenticated production
  readback is therefore blocked in this session.
- Public production baseline is not revalidated in this docs-only state sync;
  the latest recorded production readiness evidence remains the 2026-05-07
  Redis recovery (`/health` 200, `/ready` 200, web `/auth/login` 200).

## Latest Validation

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

The collector/docs commits are pushed, but production build-info has not moved
past `1f816362c93e117e47cfe52a35e0fec93bd0b37d`. This is acceptable for the
runtime readback gate because `1f816362` contains the required runtime fixes
and `ops:liveimport:readback` runs from the local/repo workspace. The next
executable release task requires authenticated read-only production evidence.
