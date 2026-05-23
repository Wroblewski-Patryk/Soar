# V1 Release Candidate Checklist

## Build and Test Gates
- [x] `pnpm --filter api build` passes.
- [x] `pnpm --filter web build` passes.
- [x] Critical server tests pass:
  - auth regression,
  - exchange retry path,
  - health/readiness,
  - metrics/alerts.
- [x] Critical client tests pass:
  - logs decision trace,
  - bots LIVE confirmations,
  - shell/accessibility smoke.

### Latest Verification (2026-05-23)
- `pnpm --filter api build` passed.
- `pnpm --filter web build` passed.
- `pnpm --filter api test -- src/modules/auth/auth.e2e.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/router/health-readiness.test.ts src/router/workers-health-readiness.test.ts src/router/metrics.test.ts src/router/alerts.test.ts` passed (`6` files, `20` tests).
- `pnpm --filter web exec vitest run src/features/logs/components/AuditTrailView.test.tsx src/features/bots/components/BotsManagement.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx` passed (`3` files, `8` tests).
- API runtime endpoint coverage confirmed via `health-readiness`, `metrics`, and `alerts` test suites.
- Worker runtime endpoint coverage confirmed via `workers-health-readiness` test suite.
- `pnpm --filter api test -- src/modules/auth/auth.jwt.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/engine/preTrade.e2e.test.ts` passed (`3` files, `11` tests).
- `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx` passed (`1` file, `5` tests).
- Ownership audit reviewed: `history/audits/security-ownership-audit-2026-03-16.md` (baseline review date `2026-03-16`).
- Final security verification: `history/audits/security-audit-verification-2026-03-21.md` (`9` files, `34` tests, all green).
- `pnpm --filter api exec prisma migrate deploy` passed (`16` migrations found, no pending migrations).
- `pnpm --filter api test -- src/modules/orders/orders-positions.e2e.test.ts src/modules/logs/logs.e2e.test.ts src/modules/pagination/pagination-query.test.ts` passed (`3` files, `8` tests).
- Documentation reviewed: `docs/operations/user-guide.md`, `docs/operations/operator-handbook.md`.
- QA docs reviewed: `docs/ux/localization-qa.md`, `docs/ux/dashboard-accessibility-baseline.md`.
- Release docs drafted: `docs/operations/v1-changelog.md`, `docs/operations/v1-migration-notes.md`.
- Load baseline evidence: `history/audits/v1-load-baseline-2026-03-21.md` (error rate `0`, p95 `37ms`, p99 `72ms`, threshold gate `PASS`).
- 2026-03-25 local backup/restore dry-run passed via `pnpm run ops:db:backup-restore:check-local` (artifacts: `history/artifacts/_artifacts-db-restore-check-2026-03-25T18-10-26-980Z.txt`, `history/evidence/v1-db-restore-check-2026-03-25T18-10-26-980Z.md`).
- Canonical release gate runbook: `docs/operations/v1-release-gate-runbook.md`.

## Runtime and Operations Gates
- [x] API endpoints healthy:
  - `/health`,
  - `/ready`,
  - `/metrics`,
  - `/alerts`.
- [x] Worker endpoints healthy:
  - `/workers/health`,
  - `/workers/ready`.
- [x] Runtime freshness gate healthy:
  - `/workers/runtime-freshness`.
- [x] Queue lag metrics reviewed and within baseline.
- [x] Incident contacts and escalation chain confirmed.

### Current Runtime Gate Override (2026-05-23)
- Fresh production SLO, split-worker proof, `LIVEIMPORT-03 --symbols auto`,
  final preflight, and the full non-dry-run release gate supersede the
  2026-05-21 inline topology failure and the later stale-symbol
  `72b547e` liveimport attempt. Follow-up docs/state deploys must prove the
  pushed `HEAD` through public Web build-info and public deploy smoke after
  deployment convergence. Authenticated deploy smoke is not claimed for the
  latest docs/state sync because the available Coolify credential is not a
  valid Soar application password. The protected release gate evidence for
  `b1ba69edccc639e97943f37fb2b1e6249a62e87c` is ready, including
  auto-discovered open runtime readbacks for `SOLUSDT` and `BNBUSDT`.
- Latest public deploy-proof follow-up: commit
  `878e199dd13cabc9a8a25b1ece83d0c483ec0c22` is deployed on `main` after Web
  Docker build-arg stage-scope repair. Public `/api/build-info` returns that
  SHA and public deploy smoke passes API `/health`, API `/ready`, and Web `/`.

### Mandatory Post-Deploy Validation Sequence (Runtime + Cache + Stream)
1. API baseline:
   - `GET /health` -> `200`
   - `GET /ready` -> `200`
2. Worker baseline:
   - `GET /workers/health` -> `200`
   - `GET /workers/ready` -> `200`
3. Runtime freshness:
   - `GET /workers/runtime-freshness` -> `200`, payload `status=PASS`
4. Deploy identity:
   - `GET /api/build-info` on the deployed web target
   - verify returned `gitSha` matches the promoted commit SHA
5. Runtime alert sanity:
   - `GET /alerts` and confirm no rollback-critical alerts (`worker_heartbeat_missing`, `market_data_staleness`, `runtime_signal_lag_stale`, `runtime_restarts_repeated(SEV-1)`, `runtime_reconciliation_drift(SEV-1)`).
6. Cache and stream contract:
   - protected routes return no-store headers (`/auth|/dashboard|/admin`),
   - service worker runtime cache stays static-only (no API/runtime payload caching),
   - stream freshness (`WORKER_LAST_MARKET_DATA_AT`) within threshold and no stale alert.
7. Gate commands (recommended order):
   - canonical one-command gate:
     - `pnpm run ops:release:v1:gate -- --base-url https://<target-api> --auth-token <ADMIN_JWT>`
   - manual equivalent:
     - `pnpm run ops:deploy:smoke`
     - `pnpm run ops:deploy:runtime-freshness -- --base-url https://<target-api> --auth-token <ADMIN_JWT>`
     - `pnpm run ops:deploy:rollback-guard -- --base-url https://<target-api> --auth-token <ADMIN_JWT>`
8. Binance live-ops verification:
   - execute and fill `history/plans/binance-live-ops-verification-checklist-2026-04-06.md`

## Security and Risk Gates
- [x] JWT rotation window policy verified.
- [x] API-key lifecycle policy verified (create/rotate/revoke).
- [x] Ownership enforcement audit reviewed.
- [x] LIVE mode requires explicit user confirmations.
- [x] Kill-switch and emergency stop paths verified.

## Data and Migration Gates
- [x] Prisma migrations applied to target environment.
- [x] Backup snapshot created and restore path validated.
- [x] Index and pagination changes validated on representative datasets.

## Documentation and Communication Gates
- [x] User guide reviewed (`docs/operations/user-guide.md`).
- [x] Operator handbook reviewed (`docs/operations/operator-handbook.md`).
- [x] Design/accessibility/localization QA docs reviewed.
- [x] Release notes and migration notes drafted.
- [x] Launch evidence pack compiled (`history/evidence/v1-launch-evidence-pack.md`).

## RC Sign-Off
- [x] Engineering sign-off.
- [x] Product sign-off.
- [x] Operations sign-off.
- [x] RC owner assigned with rollback authority.
- Sign-off record template: `docs/operations/v1-rc-signoff-record.md`.

## Outstanding External Gates (2026-05-23)
- current snapshot is `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS` (synced 2026-05-23).
- Gate 1 is satisfied by
  `history/evidence/v1-restore-drill-prod-2026-05-23T00-00-00-000Z.md`.
- Gate 2 is satisfied by
  `history/evidence/v1-slo-observation-2026-05-23T04-38-07-393Z.md`; the only
  `NO_DATA` objective is live order failure ratio because no live order
  attempts occurred.
- `LIVEIMPORT-03` is satisfied by
  `history/artifacts/liveimport-03-prod-readback-2026-05-23.json` after the
  runner used `--symbols auto` and read actual open runtime payloads for
  `SOLUSDT` and `BNBUSDT`; no LIVE order or position was created by Codex.
- Final protected release gate evidence is satisfied by
  `history/releases/v1-final-preflight-b1ba69ed-2026-05-23-after-liveimport.md`
  and
  `history/releases/v1-release-gate-prod-b1ba69ed-2026-05-23-after-liveimport.md`.
- Execution guide: `docs/operations/v1-rc-external-gates-runbook.md`.
- SLO definitions and metric mapping: `docs/operations/v1-slo-catalog.md`.
- Binance live bot-control verification checklist: `history/plans/binance-live-ops-verification-checklist-2026-04-06.md`.

### External Gates Quick Commands
- Collect SLO observation evidence:
  - `pnpm run ops:slo:collect -- --base-url https://<target-api> --duration-minutes 30 --interval-seconds 30 --auth-token <ADMIN_JWT> --environment production`
- Run local backup/restore validation dry-run (Docker postgres):
  - `pnpm run ops:db:backup-restore:check-local`
  - profile command set:
    - `pnpm run ops:db:backup-verify:local`
    - `pnpm run ops:db:backup-verify:stage`
    - `pnpm run ops:db:backup-verify:prod`
- Generate restore drill evidence artifact (PASS/FAIL contract):
  - `pnpm run ops:db:restore-drill:local`
  - `pnpm run ops:db:restore-drill:stage`
  - `pnpm run ops:db:restore-drill:prod`
- Build RC external-gates status snapshot from latest SLO artifact:
  - `pnpm run ops:rc:gates:status`
- Build rolling SLO summaries (for recurring 7d/30d review cadence):
  - `pnpm run ops:slo:window-report -- --window-days 7`
  - `pnpm run ops:slo:window-report -- --window-days 30`
- Build template-only snapshot before SLO artifact exists:
  - `pnpm run ops:rc:gates:status -- --template-only`
- Build RC sign-off artifact from current gate status + approvers:
  - `pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<email/slack>"`
- Sync RC checklist gate/sign-off checkboxes from current status artifacts:
  - `pnpm run ops:rc:checklist:sync`
- Check missing evidence fields before formal sign-off:
  - `pnpm run ops:rc:gates:evidence:check`
  - strict production policy shortcut: `pnpm run ops:rc:gates:evidence:check:strict:prod`
- Quick gate summary:
  - `pnpm run ops:rc:gates:summary`
- Run local end-to-end helper pipeline:
  - `pnpm run ops:rc:gates:local-pipeline -- --base-url http://localhost:4001 --duration-minutes 5 --interval-seconds 15`
  - Includes status rebuild + checklist sync + evidence diagnostics by default.
  - Use `--skip-checklist-sync` / `--skip-evidence-check` to disable selected steps.
  - Use `--strict-evidence-check` to fail pipeline when evidence is incomplete.
  - Use `--require-production-gate2` to require Gate2=`PASS` (no `LOCAL_PASS` accepted).
  - Use `--evidence-output <file>` to override JSON evidence artifact path.
  - Shortcut strict mode: `pnpm run ops:rc:gates:local-pipeline:strict`
  - Shortcut strict production mode: `pnpm run ops:rc:gates:local-pipeline:strict:prod`
- Dedicated production pipeline alias: `pnpm run ops:rc:gates:prod-pipeline -- --base-url https://<target-api> --auth-token <ADMIN_JWT> --duration-minutes 30 --interval-seconds 30`
  - Required production DB profile envs: `PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME`
  - Offline fallback: `pnpm run ops:rc:gates:local-pipeline -- --allow-offline`
  - Quick refresh (no DB/SLO collection): `pnpm run ops:rc:gates:refresh`
  - Quick refresh strict mode: `pnpm run ops:rc:gates:refresh:strict`
  - Quick refresh strict production mode: `pnpm run ops:rc:gates:refresh:strict:prod`
  - Quick refresh with summary output: `pnpm run ops:rc:gates:refresh:summary`
  - Quick refresh strict with guaranteed summary output: `pnpm run ops:rc:gates:refresh:summary:strict`
  - Quick refresh strict production with guaranteed summary output: `pnpm run ops:rc:gates:refresh:summary:strict:prod`
- Run local cutover dry-run with structured artifact output:
  - `pnpm run ops:cutover:dry-run`
- Expected outputs:
  - `history/artifacts/_artifacts-slo-window-*.json`
  - `history/artifacts/_artifacts-db-restore-check-*.txt`
  - `history/evidence/v1-db-restore-check-*.md`
  - `history/artifacts/_artifacts-restore-drill-*.json`
  - `history/evidence/v1-restore-drill-*.md`
  - `history/evidence/v1-slo-observation-*.md`
  - `history/evidence/v1-slo-window-report-7d-*.md`
  - `history/evidence/v1-slo-window-report-30d-*.md`
  - `docs/operations/v1-rc-external-gates-status.md`
  - `docs/operations/v1-rc-signoff-record.md`
  - `history/artifacts/_artifacts-rc-evidence-check-latest.json`
  - `history/artifacts/_artifacts-cutover-dry-run-*.json`
  - `history/evidence/v1-local-cutover-dry-run-*.md`

