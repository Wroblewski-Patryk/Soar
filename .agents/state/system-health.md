# System Health

Last updated: 2026-05-19

## 2026-05-19 Audit System Health Addendum

- `AUD-00` refreshed locally on 2026-05-19: project index `PASS:21`, tests
  indexed `335`, static scan findings `0`.
- `AUD-02` dedicated source-of-truth audit is current after follow-up:
  delivery-map rows were refreshed, risk-ID uniqueness was restored by
  renumbering the audit-process row to `RISK-036`, and continuation state was
  synchronized. Production-boundary rows remain intentionally partial where
  fresh production proof was not run.
- Final reusable rollup exists at
  `docs/operations/full-reusable-audit-rollup-2026-05-19.md`.
- `DEC-AUD-001` and `DEC-AUD-002` are accepted and applied to source truth:
  `AUD-01` is Binance + Gate.io implementation scope, not Binance-only, and
  `AUD-20` is assistant foundation/dry-run current scope with hot-path
  orchestration deferred.
- Remaining production-readiness blocker is `AUD-19`: rerun fresh production
  release evidence before any new production readiness claim.
- Post-push readback for pushed commit `36ff999d` found production build-info
  still on `1586f59261cef94d7c513d71bbfcfb697d11ca59` (`gitRef: main`) while
  public API/Web smoke passed. `36ff999d` is not production-ready by
  build-info.
- Follow-up confirmed production tracks `main`. `origin/main` was
  fast-forwarded to `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`; production
  build-info reached that SHA and public API/Web smoke passed.
- Post-decision repair playbooks are available at
  `docs/operations/audit-decision-repair-playbooks-2026-05-19.md`; they are
  historical planning guidance and do not change runtime behavior.
- Audit remediation roadmap is now machine-checkable:
  `corepack pnpm run audit:remediation-plan:check` validates the plan JSON,
  required phases/work packages, the `AUD-19` blocker, closure checks, and
  safety boundaries.
- Reusable audit rerun closure now explicitly requires
  `audit:manifest:verify`, `audit:remediation-plan:check`, docs parity,
  guardrails, and diff check; `audit:rerun-playbook:check` fails if any
  required closure check is missing.
- Reusable audit tooling-index validation now enforces the same required
  closure command set and fails if manifest verification, remediation-plan
  validation, docs parity, guardrails, or diff check are omitted.
- Full reusable audit handoff validation is now included in
  `audit:manifest:verify`; `audit:handoff:check` verifies source paths,
  residual risks, forbidden boundaries, validation checks, and fail-closed
  safety booleans.
- Reusable audit tooling-index validation now checks referenced `corepack pnpm
  run` commands against `package.json` scripts and reports missing package
  scripts separately.
- Reusable audit manifest validation now checks declared summary counts and
  `manifestValidation` path metadata against actual audit rows and collected
  repository paths.
- Full reusable audit rollup validation is now included in
  `audit:manifest:verify`; `audit:rollup:check` verifies audit coverage,
  summary counts, source paths, repair queue items, and fail-closed safety
  booleans.
- Reusable audit manifest comparison now ranks only leading status buckets,
  aligning comparison semantics with manifest and rollup validators and
  avoiding false regressions from hybrid current/deferred wording.
- Reusable audit manifest comparison can now persist machine-readable reports
  with `--json-output <path>` for future rerun evidence.
- Reusable audit rerun playbook validation now requires `compareJson` to use
  `--json-output`, preventing stdout-only structured comparison instructions.
- Reusable audit tooling-index validation now checks companion Markdown/JSON
  tool ID parity when the Markdown file is available.
- Reusable audit manifest validation now checks companion Markdown/JSON
  summary count parity when the Markdown file is available.
- Reusable audit rollup validation now checks companion Markdown/JSON audit ID
  parity when the Markdown file is available.
- Reusable audit rollup validation now checks companion Markdown/JSON summary
  count parity when the Markdown file is available.
- Reusable full-audit handoff validation now checks handoff rollup-summary
  parity against the referenced rollup JSON.
- Reusable audit rerun playbook validation now checks baseline manifest and
  rollup Markdown/JSON path completeness and existence.
- Reusable audit remediation-plan validation now requires its own self-check
  command in closure checks.

## Latest Health Snapshot

- `I18N-COPY-REACHABILITY-AUDIT-2026-05-19` LOCAL I18N/COPY PASS:
  route-reachable i18n audit passed with findings `0`, localCopy `0`,
  fallbackPl `0`, and hardcoded `0`. Focused Web i18n pack passed (`8` files /
  `26` tests). Evidence:
  `docs/operations/i18n-copy-reachability-audit-2026-05-19.md` and
  `docs/planning/i18n-copy-reachability-audit-2026-05-19-task.md`.

- `MOBILE-CROSS-PLATFORM-SCOPE-AUDIT-2026-05-19` MOBILE SCOPE VERIFIED:
  `apps/mobile` remains scaffold-only with package, README, and placeholder
  source files only. Mobile build/test scripts intentionally print deferred
  scaffold messages. Mobile docs state no production mobile runtime and no
  independent mobile backend contracts. Responsive Web mobile evidence remains
  under `AUD-05`, not native app parity. Evidence:
  `docs/operations/mobile-cross-platform-scope-audit-2026-05-19.md` and
  `docs/planning/mobile-cross-platform-scope-audit-2026-05-19-task.md`.

- `OPERATIONS-RELEASE-DEPLOYMENT-AUDIT-2026-05-19` LOCAL OPS/RELEASE PASS:
  typecheck, lint, build, go-live smoke, and local DB backup/restore check
  passed. Go-live smoke covered API (`4` files / `45` tests) and Web (`3` files
  / `18` tests). Local backup/restore check produced
  `docs/operations/v1-db-restore-check-2026-05-19T01-30-47-200Z.md` after the
  required local Postgres container was started. Local Postgres/Redis were
  stopped after the proof. No production deploy, production database mutation,
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/operations/operations-release-deployment-audit-2026-05-19.md` and
  `docs/planning/operations-release-deployment-audit-2026-05-19-task.md`.

- `POST-PUSH-BUILD-INFO-READBACK-36FF999D-2026-05-19` PRODUCTION FRESHNESS
  BLOCKED FOR TARGET SHA: `ops:deploy:wait-web-build-info` did not observe
  pushed commit `36ff999d` within the readback window; production build-info
  stayed on `1586f59261cef94d7c513d71bbfcfb697d11ca59` while public deploy
  smoke passed for the currently deployed service. Evidence:
  `docs/operations/post-push-build-info-readback-36ff999d-2026-05-19.md` and
  `docs/planning/post-push-build-info-readback-36ff999d-2026-05-19-task.md`.

- `MAIN-PROMOTION-BUILD-INFO-DD1A1FAF-2026-05-19` PUBLIC DEPLOY FRESHNESS
  PASS: `origin/main` was fast-forwarded to
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`; production Web build-info
  exposed that SHA on attempt `8`; public no-worker deploy smoke passed for
  API `/health`, API `/ready`, and Web `/`. Full protected `AUD-19` release
  readiness still requires protected runtime, rollback, backup/restore, and
  sign-off evidence. Evidence:
  `docs/operations/main-promotion-build-info-dd1a1faf-2026-05-19.md` and
  `docs/planning/main-promotion-build-info-dd1a1faf-2026-05-19-task.md`.

- `PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-19` PROTECTED RELEASE GATE BLOCKED AS
  EXPECTED: no-auth final preflight for the deployed `dd1a1faf` target passed
  build-info and public smoke, then blocked on missing liveimport auth,
  rollback guard auth, dashboard UI auth, admin UI auth, production DB restore
  context, and stale 2026-05-14 protected release evidence. Evidence:
  `docs/operations/v1-final-preflight-dd1a1faf-2026-05-19-noauth.md` and
  `docs/planning/protected-preflight-dd1a1faf-2026-05-19-task.md`.

- `RC-EVIDENCE-BLOCKED-DD1A1FAF-2026-05-19` RC PACKET BLOCKED AS EXPECTED:
  dated no-secret RC status/checklist/sign-off artifacts for `dd1a1faf` show
  Gate 1 `PASS`, Gate 2 `OPEN`, Gate 3 `PASS`, Gate 4 `OPEN`; strict evidence
  check fails on missing Gate 2 PASS and missing Gate 4 approver/owner fields.
  Evidence:
  `docs/operations/v1-rc-external-gates-status-dd1a1faf-2026-05-19-blocked.md`,
  `docs/operations/v1-rc-signoff-record-dd1a1faf-2026-05-19-blocked.md`, and
  `docs/planning/rc-evidence-blocked-dd1a1faf-2026-05-19-task.md`.

- `V1-OPERATOR-UNBLOCK-PACKET-DD1A1FAF-2026-05-19` OPERATOR HANDOFF CURRENT:
  production build-info readback still points to
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` on `main`; the packet lists the
  required protected inputs, command order, stop conditions, and final
  acceptance rule for completing `AUD-19`. It is intentionally `NO-GO` and does
  not replace missing protected evidence. Evidence:
  `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-19.md` and
  `docs/planning/v1-operator-unblock-packet-dd1a1faf-2026-05-19-task.md`.

- `V1-PROTECTED-INPUT-READINESS-DD1A1FAF-2026-05-19` PROTECTED INPUTS ABSENT:
  a names-only env sweep for this Codex shell found `0` matching protected
  input names across liveimport, rollback, production UI, production DB,
  RC, and Gate families. No secret values were printed or stored. Evidence:
  `docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-19.md` and
  `docs/planning/v1-protected-input-readiness-dd1a1faf-2026-05-19-task.md`.

- `AUDIT-REMEDIATION-PLAN-CHECK-2026-05-19` LOCAL AUDIT TOOLING PASS:
  `audit:remediation-plan:check` verifies the machine-readable remediation
  plan has phases `P0..P6`, work packages `WP-01..WP-08`, current `AUD-19`
  blockers, closure checks, and safe boundaries. It is included in
  `audit:manifest:verify`. Evidence:
  `docs/operations/audit-remediation-master-plan-2026-05-19.json` and
  `docs/planning/audit-remediation-plan-check-2026-05-19-task.md`.
  Follow-up hardening verifies remediation-plan source/evidence references;
  current output reports `7` references checked and `0` missing references.
  Evidence:
  `docs/planning/audit-remediation-plan-reference-check-2026-05-19-task.md`.
  Follow-up closure sync requires the remediation-plan check in the reusable
  audit rerun playbook and validator. Evidence:
  `docs/planning/audit-rerun-playbook-remediation-closure-sync-2026-05-19-task.md`.
  Follow-up tooling-index hardening requires the same closure command set in
  the reusable tooling index. Evidence:
  `docs/planning/audit-tooling-index-closure-command-check-2026-05-19-task.md`.
  Follow-up handoff validation makes the full reusable audit handoff
  machine-checkable. Evidence:
  `docs/planning/audit-handoff-check-command-2026-05-19-task.md`.
  Follow-up package-script validation keeps reusable tooling-index commands
  aligned with `package.json`. Evidence:
  `docs/planning/audit-tooling-index-package-script-check-2026-05-19-task.md`.
  Follow-up manifest metadata validation keeps reusable audit rollup counts and
  path metadata aligned with actual manifest contents. Evidence:
  `docs/planning/audit-manifest-summary-metadata-check-2026-05-19-task.md`.
  Follow-up rollup validation makes the full reusable audit rollup
  machine-checkable. Evidence:
  `docs/planning/audit-rollup-check-command-2026-05-19-task.md`.
  Follow-up manifest-comparison hardening aligns status ranking to leading
  buckets, preventing hybrid current/deferred statuses from being misread as
  regressions. Evidence:
  `docs/planning/audit-manifest-compare-status-bucket-check-2026-05-19-task.md`.
  Follow-up JSON-output hardening allows `audit:manifest:compare` to persist
  the full comparison report with `--json-output <path>`. Evidence:
  `docs/planning/audit-manifest-compare-json-output-2026-05-19-task.md`.
  Follow-up rerun-playbook sync requires `compareJson` to persist structured
  comparison evidence with `--json-output`. Evidence:
  `docs/planning/audit-rerun-playbook-compare-json-output-sync-2026-05-19-task.md`.
  Follow-up tooling-index parity validation catches missing Markdown entries
  for JSON tool IDs. Evidence:
  `docs/planning/audit-tooling-index-markdown-json-parity-2026-05-19-task.md`.
  Follow-up manifest summary parity validation catches stale Markdown current
  summary counts against the JSON manifest summary. Evidence:
  `docs/planning/audit-manifest-markdown-summary-parity-2026-05-19-task.md`.

- `DATA-MODEL-MIGRATIONS-AUDIT-2026-05-19` LOCAL DATA/MIGRATIONS PASS WITH
  FINDING: Prisma schema validation passed, local migration status reported
  `54` migrations and schema up to date, full local migration replay applied
  all `54` migrations, schema diff generation passed, and isolated
  representative DB-backed tests passed for wallets (`1` file / `24` tests),
  backtests (`1` file / `15` tests), and runtime repository behavior (`1` file
  / `2` tests). Follow-up `corepack pnpm run audit:data:db-isolated` passed and
  now enforces reset before each representative DB-backed pack. The shared-DB
  parallel pitfall remains a run-policy warning, not a migration failure. Local
  Postgres/Redis were started only for DB-backed checks and then stopped. No
  production database, production journey, LIVE mutation, exchange-side
  mutation, or existing production data mutation was performed. Evidence:
  `docs/operations/data-model-migrations-audit-2026-05-19.md` and
  `docs/planning/data-model-migrations-audit-2026-05-19-task.md`.

- `WORKERS-RUNTIME-OPERATIONS-AUDIT-2026-05-19` LOCAL WORKERS/RUNTIME PASS:
  focused API worker/runtime pack passed (`17` files / `85` tests). Coverage
  includes worker ownership/topology, protected worker health/readiness,
  runtime freshness pass/fail/skip behavior, global `/ready` diagnostics,
  market-stream source config, subscriptions, fanout and routes, exchange
  polling, Binance stream parsing, queue tuning, backtest job persistence,
  execution orchestration, and PAPER runtime-flow telemetry. Expected stderr
  appeared only in the intentional Redis-startup retry test. Local
  Postgres/Redis were started only for DB-backed tests and then stopped. No
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/operations/workers-runtime-operations-audit-2026-05-19.md` and
  `docs/planning/workers-runtime-operations-audit-2026-05-19-task.md`.

- `ADMIN-SUBSCRIPTIONS-ENTITLEMENTS-AUDIT-2026-05-19` LOCAL ADMIN/SUBSCRIPTIONS
  PASS: focused Web admin/profile subscription tests passed (`4` files / `9`
  tests), and DB-backed API admin/subscriptions/entitlements tests passed (`5`
  files / `25` tests). Coverage includes admin-only access, user listing with
  subscription metadata, role/plan updates, self-demotion prevention,
  plan/entitlement validation, profile subscription readback, bot limit and
  LIVE trading gates, and Web admin/profile subscription states. Local
  Postgres/Redis were started only for DB-backed tests and then stopped. No
  production journey, LIVE mutation, exchange-side mutation, existing
  production data mutation, or production entitlement mutation was performed.
  Evidence:
  `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.md` and
  `docs/planning/admin-subscriptions-entitlements-audit-2026-05-19-task.md`.

- `LOGS-AUDIT-TRAIL-AUDIT-2026-05-19` LOCAL LOGS/AUDIT PASS: focused Web
  logs/audit tests passed (`2` files / `3` tests), and DB-backed API
  logs/pagination tests passed (`2` files / `5` tests). Coverage includes
  authenticated reads, owner scoping, source/actor/severity filters, pagination
  defaults/bounds, action-produced event visibility, metadata trace text
  rendering, and Web logs route states. Local Postgres/Redis were started only
  for DB-backed tests and then stopped. No production journey, LIVE mutation,
  exchange-side mutation, or existing production data mutation was performed.
  Evidence: `docs/operations/logs-audit-trail-audit-2026-05-19.md` and
  `docs/planning/logs-audit-trail-audit-2026-05-19-task.md`.

- `BACKTESTS-REPORTS-AUDIT-2026-05-19` LOCAL BACKTESTS/REPORTS PASS: focused
  Web backtest/report UI tests passed (`15` files / `37` tests), and
  DB-backed API backtests/reports tests passed (`13` files / `114` tests).
  Coverage includes run lifecycle, ownership, explicit range validation,
  queue/job/replay, fill model, data gateway, runtime-kernel parity, immutable
  snapshot behavior, pending/degraded report lifecycle, trades/report/timeline
  reads, cross-mode aggregation, and Web route/detail/report states. Local
  Postgres/Redis were started only for DB-backed tests and then stopped. No
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/operations/backtests-reports-audit-2026-05-19.md` and
  `docs/planning/backtests-reports-audit-2026-05-19-task.md`.

- `MARKETS-STRATEGIES-CONFIGURATION-AUDIT-2026-05-19` LOCAL
  MARKETS/STRATEGIES PASS: focused Web market/strategy UI tests passed (`19`
  files / `60` tests), and DB-backed API markets/strategies tests passed (`4`
  files / `35` tests). Coverage includes market-universe composition, catalog
  behavior, market and strategy CRUD, ownership, active-bot guards, strategy
  import/export/config validation, inactive-bot edit allowance, active-bot lock
  UI, and indicator registry/presentation parity. Local Postgres/Redis were
  started only for DB-backed tests and then stopped. No production journey,
  LIVE mutation, exchange-side mutation, or existing production data mutation
  was performed. Evidence:
  `docs/operations/markets-strategies-configuration-audit-2026-05-19.md` and
  `docs/planning/markets-strategies-configuration-audit-2026-05-19-task.md`.

- `WALLETS-CAPITAL-LEDGER-AUDIT-2026-05-19` LOCAL WALLETS/CAPITAL PASS:
  focused Web wallet/ledger UI tests passed (`10` files / `23` tests), and
  DB-backed API wallets/capital tests passed (`7` files / `84` tests).
  Coverage includes wallet CRUD, ownership, PAPER/LIVE validation, API-key
  binding, balance preview, active-bot edit/delete/reset guards, paper reset
  checkpoint, wallet-first bot contract, runtime capital source truth,
  cashflow/equity ledger states, and partial/unavailable ledger UI. Local
  Postgres/Redis were started only for DB-backed tests and then stopped. No
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/operations/wallets-capital-ledger-audit-2026-05-19.md` and
  `docs/planning/wallets-capital-ledger-audit-2026-05-19-task.md`.

- `POSITIONS-RECONCILIATION-AUDIT-2026-05-19` LOCAL POSITIONS PASS: focused
  Web runtime-position tests passed (`6` files / `46` tests), and DB-backed
  API positions/reconciliation tests passed (`11` files / `68` tests).
  Coverage includes list/read ownership, live-status, exchange snapshot
  selection/normalization/fail-closed behavior, takeover/rebind, orphan repair,
  imported history hydration, reconciliation diagnostics, runtime position
  derivations, and close-state UI. Expected stderr appeared only in tests that
  intentionally simulate ambiguous/unowned/missing-entry and snapshot-failure
  diagnostics. Local Postgres/Redis were started only for DB-backed tests and
  then stopped. No production journey, LIVE mutation, exchange-side mutation,
  or existing production data mutation was performed. Evidence:
  `docs/operations/positions-reconciliation-audit-2026-05-19.md` and
  `docs/planning/positions-reconciliation-audit-2026-05-19-task.md`.

- `ORDERS-MANUAL-TRADING-AUDIT-2026-05-19` LOCAL ORDERS/MANUAL PASS: focused
  Web manual/open-order tests passed (`8` files / `46` tests), and DB-backed
  API order lifecycle tests passed (`10` files / `121` tests). Coverage
  includes manual-order context and selected-bot scope, PAPER lifecycle,
  ownership isolation, active-only filtering, fills, fees, exchange events,
  fail-closed exchange-backed cancel boundary, LIVE risk guards,
  quantity/position scope, and Dashboard Home manual/open-order action states.
  Local Postgres/Redis were started only for DB-backed tests and then stopped.
  No production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/operations/orders-manual-trading-audit-2026-05-19.md` and
  `docs/planning/orders-manual-trading-audit-2026-05-19-task.md`.

- `ENGINE-TRADING-DECISION-FLOW-AUDIT-2026-05-19` LOCAL ENGINE PASS: focused
  engine service/unit tests passed (`15` files / `173` tests), and DB-backed
  engine e2e/smoke tests passed (`4` files / `13` tests). Coverage includes
  deterministic signal merge, final-candle flow, signal loop/supervisor,
  pre-trade/risk, execution orchestration, dedupe, exchange order guard,
  PAPER/LIVE parity, market-data gateway, position automation, PAPER runtime
  lifecycle, and owned imported-position execution. Expected stderr appeared
  only in tests that intentionally simulate failover/fail-closed paths. Local
  Postgres/Redis were started only for DB-backed tests and then stopped. No
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/operations/engine-trading-decision-flow-audit-2026-05-19.md` and
  `docs/planning/engine-trading-decision-flow-audit-2026-05-19-task.md`.

- `BOTS-RUNTIME-TRUTH-AUDIT-2026-05-19` LOCAL BOTS/RUNTIME PASS: focused Web
  bot/dashboard runtime tests passed (`8` files / `61` tests), and DB-backed
  API bot/runtime tests passed (`10` files / `88` tests). Coverage includes
  CRUD/ownership, wallet-first writes, duplicate and entitlement guards,
  selected-bot runtime scope, monitoring aggregate truth, runtime history
  parity, takeover visibility, LIVE/PAPER isolation, and delete cleanup. Local
  Postgres/Redis were started only for DB-backed tests and then stopped. No
  production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/operations/bots-runtime-truth-audit-2026-05-19.md` and
  `docs/planning/bots-runtime-truth-audit-2026-05-19-task.md`.

- `SECURITY-PRIVACY-AUDIT-2026-05-19` LOCAL SECURITY/PRIVACY PASS: focused
  auth/middleware/header API tests passed (`9` files / `32` tests),
  DB-backed auth/profile/API-key/isolation/abuse tests passed (`7` files /
  `47` tests), focused Web auth/profile/API-key tests passed (`7` files /
  `28` tests), and the public auth cache contract passed (`1` file / `2`
  tests). Local Postgres/Redis were started only for DB-backed tests and then
  stopped. No production journey, LIVE mutation, exchange-side mutation,
  existing production data mutation, or raw-secret artifact was produced.
  External independent security review remains a governance follow-up.
  Evidence: `docs/operations/security-privacy-audit-2026-05-19.md` and
  `docs/planning/security-privacy-audit-2026-05-19-task.md`.

- `ARCHITECTURE-EXCHANGE-SCOPE-WORDING-AUDIT-2026-05-19` ARCHITECTURE DOC
  DRIFT REPAIRED: `DEC-AUD-001` accepted Binance + Gate.io implementation
  scope, not Binance-only, while production/live readiness remains
  evidence-bound by exact exchange, market type, and operation. Evidence:
  `docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.md`
  and
  `docs/planning/architecture-exchange-scope-wording-audit-2026-05-19-task.md`.

- `EXCHANGE-CAPABILITY-TRUTH-AUDIT-2026-05-19` EXCHANGE AUDIT CURRENT LOCAL:
  exact `(exchange, marketType, operation)` capability support is implemented
  in API exchange execution/authenticated-read contracts and consumers.
  Evidence passed: API exchange capability/registry/boundary tests (`4` files
  / `21` tests), focused exact contract tests (`2` files / `4` tests), and API
  typecheck. Web exchange capability tests (`2` files / `3` tests) remain
  current for compatibility-stage UI gates. No production or exchange-side
  mutation was run. Evidence:
  `docs/operations/exchange-capability-truth-audit-2026-05-19.md` and
  `docs/planning/exchange-capability-truth-audit-2026-05-19-task.md`.

- `AI-ASSISTANT-RUNTIME-TRUTH-AUDIT-2026-05-19` AI ASSISTANT FOUNDATION
  CURRENT: deterministic assistant foundation is locally green. Evidence
  passed: backend assistant orchestrator tests (`2` files / `6` tests), Web
  assistant route tests (`2` files / `3` tests), and bot assistant config/dry-run
  e2e after local Postgres/Redis startup (`1` file / `3` tests). `DEC-AUD-002`
  accepts this as current scope and defers BACKTEST/PAPER/LIVE hot-path
  assistant orchestration until a separate implementation with persisted
  traces, fail-closed integration, and AI red-team proof. Local infra was
  stopped after validation.
  Evidence:
  `docs/operations/ai-assistant-runtime-truth-audit-2026-05-19.md` and
  `docs/planning/ai-assistant-runtime-truth-audit-2026-05-19-task.md`.

- `API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19` API DOCS PARITY PASS:
  endpoint-level docs parity automation now exists as
  `pnpm run docs:parity:endpoints:api`. Current result detects `109` Express
  endpoints, `109` documented route mentions, and `0` gaps after root/ops,
  bots, orders, positions, and wallets docs gap closure. Existing module docs
  parity remains PASS (`API 22/22`, `Web 16/16`, `Routes 38/38`). Evidence:
  `docs/operations/api-endpoint-docs-parity-2026-05-19/api-endpoint-docs-parity-2026-05-19.md`
  and `docs/planning/api-endpoint-docs-parity-audit-2026-05-19-task.md`.

- `AUTHENTICATED-ROUTE-STATE-AUDIT-2026-05-19` LOCAL WEB/UX ROUTE AUDIT PASS:
  local API/Web were started against seeded admin data, Browser login reached
  `/dashboard`, and canonical public/auth/dashboard/admin plus legacy routes
  were audited. Result: `53` route checks, `53` PASS, `0` CHECK, `0` console
  warning/error routes, and `6` screenshots. No production journey, LIVE
  mutation, exchange-side mutation, or existing production data mutation was
  performed. Evidence: `docs/analysis/audit-baseline-2026-05-19.md`,
  `docs/operations/route-state-audit-2026-05-19/route-state-audit-2026-05-19.md`,
  and `docs/planning/authenticated-route-state-audit-2026-05-19-task.md`.

- `FULL-LAYERED-AUDIT-RUN-2026-05-18` BROAD LOCAL AUDIT PASS / PARTIAL ONLY
  WHERE EXPLICITLY OUT OF SCOPE: the reusable audit registry has now been
  exercised against current local evidence. Passed evidence includes project
  index (`PASS:21`, tests `335`), static scan (`0` findings), guardrails, docs
  parity, typecheck, lint, build, full Web Vitest (`149` files / `514` tests),
  route-reachable i18n (`0` findings), focused API layer packs, full API
  Vitest exit `0`, and go-live smoke (API `45/45`, Web `18/18`). Browser
  route-state proof passed for `/`, `/auth/login`, and unauthenticated
  `/dashboard` redirect on desktop and mobile with `0` console warnings/errors.
  No production journey, LIVE mutation, exchange-side mutation, or existing
  production data mutation was performed. Evidence:
  `docs/analysis/audit-baseline-2026-05-18.md` and
  `docs/planning/full-layered-audit-run-2026-05-18-task.md`.

- `REUSABLE-AUDIT-REGISTRY-2026-05-18` AUDIT SYSTEM BASELINE PASS: the project
  now has stable reusable audit IDs `AUD-00` through `AUD-23` covering the
  application layers needed for future full audits. The dated baseline clearly
  separates commands actually run today from historical/current evidence.
  Today-run validation: `pnpm run ops:project:index` PASS with V1 statuses
  `PASS:21` and tests indexed `335`; `pnpm run ops:project:scan -- --index
  docs/operations/project-index-2026-05-18.json` PASS with static findings
  `0`; guardrails PASS; docs parity PASS; typecheck PASS; lint PASS; build
  PASS. Evidence: `docs/analysis/reusable-audit-registry.md`,
  `docs/analysis/audit-baseline-2026-05-18.md`, and
  `docs/planning/reusable-audit-registry-2026-05-18-task.md`.

- `PROJECT-ARCHITECTURE-CODE-DISCREPANCY-AUDIT-2026-05-17` ARCHITECTURE-CODE
  AUDIT PARTIAL PASS: generated project index and static scan are current for
  this audit, with V1 matrix `PASS:21`, tests indexed `335`, and static
  findings `0`. Dashboard route inventory matches the canonical dashboard
  route map. Protected API diagnostics, worker topology visibility, bot market
  scope constraints, Prisma lifecycle shape, and exchange SDK ownership are
  aligned in the inspected code. Open architecture/code drift remains in two
  planning lanes: assistant runtime hot-path integration is over-described in
  architecture, and older architecture overview/domain wording still implies
  Binance-only or one-exchange-family baseline. The exchange capability
  granularity lane was repaired on 2026-05-19 with exact `(exchange,
  marketType, operation)` support. Evidence:
  `docs/analysis/architecture-code-discrepancy-audit-2026-05-17.md` and
  `docs/planning/project-architecture-code-discrepancy-audit-2026-05-17-task.md`.

- `PROJECT-COMPLETE-ANALYSIS-INDEX-2026-05-14` AUDIT MAP UPDATED:
  repository-wide analysis now explicitly separates verified Web/API local
  confidence from deferred or deeper-audit lanes. Active marker scan found no
  `.skip(`, no `.only(`, and no implementation `TODO/FIXME/HACK` markers
  outside static-scan rule definitions. API inventory shows `108` route
  handlers; Web source has `38` `page.tsx` route files while build reports
  `30` generated pages; `apps/mobile` is documented scaffold-only; assistant
  runtime has local fail-closed/circuit/policy tests but does not yet have a
  full AI red-team report. Evidence:
  `docs/operations/project-complete-analysis-index-2026-05-14.md`.

- `PROJECT-FULL-SCAN-BASELINE-2026-05-14` LOCAL AUDIT BASELINE PASS:
  generated the current full project index and static scan for this audit
  thread. Index results: V1 matrix `PASS:21`, tests indexed `335`; static
  scan findings `0`. Validation passed: `pnpm run quality:guardrails`,
  `pnpm run typecheck`, `pnpm run lint`, full Web Vitest (`149` files /
  `514` tests), full API Vitest, `pnpm run build`, and
  `pnpm run test:go-live:smoke` (API `45/45`, Web `18/18`). Cleanup check
  found no validation-owned `chrome-headless-shell` or repo Node process left
  running. This is local audit confidence only; unsafe LIVE mutation,
  exchange-side mutation, existing production data mutation, broader
  Gate.io/second-LIVE production shape, and manual browser state coverage for
  every route remain outside this checkpoint. Evidence:
  `docs/planning/project-full-scan-baseline-2026-05-14-task.md`,
  `docs/operations/project-full-scan-index-2026-05-14.md`, and
  `docs/operations/project-full-static-scan-2026-05-14.md`.

- `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14` LOCAL CONTRACT PASS: new
  backtest runs persist immutable creation-time strategy and market-universe
  snapshots; backtest list/timeline/replay paths prefer snapshot strategy truth
  before mutable strategy records; strategy and market-universe deletion now
  fail closed with `409` while owned backtest history references those records.
  Focused API e2e passed for backtests, strategies, and markets (`44/44`). No
  deploy, production mutation, LIVE order/cancel/close, or exchange-side
  mutation was performed. Evidence:
  `docs/planning/post-v1-strategy-snapshot-history-2026-05-14-task.md`.

- `POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14` LOCAL CONTRACT PASS:
  strategy edit Web/API parity is verified for inactive linked-bot updates and
  active-bot guard recovery. Focused validation passed: Web edit page `3/3`,
  Web strategies suite `14` files / `48` tests, and API strategies e2e `11/11`.
  No deploy, production mutation, LIVE order/cancel/close, or exchange-side
  mutation was performed. Evidence:
  `docs/planning/post-v1-inactive-paper-strategy-edit-proof-2026-05-14-task.md`.

- `POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14` LOCAL CONTRACT PASS: API icon
  lookup now derives CoinGecko ID hints and curated fallback URLs from one
  catalog, so common-symbol fixes are model-level instead of one-off. Focused
  `icons.e2e.test.ts` passes (`6/6`), including a CoinGecko `503` basket proof
  for common trading assets resolving to curated icons rather than generic
  placeholders. No deploy, production mutation, LIVE order/cancel/close, or
  exchange-side mutation was performed. Evidence:
  `docs/planning/post-v1-crypto-icon-consistency-2026-05-14-task.md`.

- `V1-POST-V1-LEDGER-RECONCILIATION-2026-05-14` SOURCE-OF-TRUTH PASS:
  accepted production fixture/UI proof is now reflected in the durable module
  confidence, requirement, quality, and risk ledgers. Current module-confidence
  count is `VERIFIED:22`, `PARTIAL:0`, `IMPLEMENTED_NOT_VERIFIED:0`,
  `BROKEN:0`, and `BLOCKED:0`; risk-register count is `closed:18`,
  `mitigating:8`. No deploy, production mutation, LIVE order/cancel/close,
  unsafe LIVE position mutation, existing-data mutation, or broader
  Gate.io/second-LIVE proof was performed. Evidence:
  `docs/planning/v1-post-v1-ledger-reconciliation-2026-05-14-task.md`.

- `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` LOCAL HARDENING PASS:
  bot deletion now removes bot-owned runtime/trading artifacts in one
  transaction while preserving the strategy, and PAPER wallet reset now fails
  closed with `409` while an active bot uses the wallet. No production data,
  LIVE order/cancel/close, or exchange-side mutation was performed. Validation:
  API typecheck PASS, Bots delete cleanup e2e `1/1` PASS, Bots e2e `26/26`
  PASS, Wallets e2e `24/24` PASS, build PASS. The fix is deployed as
  `1586f59261cef94d7c513d71bbfcfb697d11ca59`; build-info wait passed on
  attempt 22, and public deploy smoke passed for API `/health`, API `/ready`,
  and Web `/`.
  Evidence:
  `docs/planning/v1-post-v1-wallet-bot-cleanup-hardening-2026-05-14-task.md`.

- `V1-POST-V1-DASHBOARD-RUNTIME-LEDGER-CLOSURE-2026-05-14` SOURCE-OF-TRUTH
  CONSISTENCY PASS: local and production-safe evidence closes stale
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001` `PARTIAL` rows for the
  approved non-Gate.io V1/post-V1 scope. `RISK-002` and `RISK-003` are closed.
  Its original count readback is superseded by the later ledger reconciliation:
  current module confidence is `VERIFIED:22` and `PARTIAL:0`; current risk
  count is `closed:18` and `mitigating:8`. Gate.io/second-LIVE production shape
  remains separate. Evidence:
  `docs/planning/v1-post-v1-dashboard-runtime-ledger-closure-2026-05-14-task.md`.

- `V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14` AUTH PASS: production proof on
  deployed `2fc90a08` found a stale-token replay gap after logout. The fixed
  build `84711599` is deployed, build-info matches, and the production rerun
  passes with stale-token `/auth/me` returning `401` after logout. `SOAR-AUTH-001`
  is `VERIFIED`, and `RISK-004` is `closed`. Evidence:
  `docs/planning/v1-post-v1-auth-deploy-rerun-2026-05-14-task.md` and
  `docs/operations/prod-auth-session-browser-proof-84711599-2026-05-14.md`.

- `V1-100-PERCENT-TRUTH-AUDIT-2026-05-14` TRUTH AUDIT PASS: the tracked V1
  release acceptance answer is `YES` (`GO`, `PASS:21`, static findings `0`,
  implementation/evidence/release readiness `100%`, no next work order). The
  absolute whole-app/every-function/every-live-action answer remains `NO` only
  because LIVE order submit/cancel/position close, exchange-side mutation,
  existing-data mutation, and broader 2x LIVE including Gate.io production
  proof were intentionally not performed. Its stale `PARTIAL:7` wording is
  superseded by the later ledger reconciliation. Evidence:
  `docs/planning/v1-100-percent-truth-audit-2026-05-14-task.md` and
  `docs/operations/v1-100-percent-truth-audit-2026-05-14.md`.

- `V1-POST-V1-RELEASE-CONFIDENCE-ROW-CLOSURE-2026-05-14` SOURCE-OF-TRUTH
  CONSISTENCY PASS: stale `SOAR-REL-001` release-confidence inventory wording
  is closed as `VERIFIED` because the final V1 master ledger, project index,
  completion scorecard, evidence inventory, and 100 percent truth audit now
  provide the module-by-module proof map. That row was superseded by the
  Dashboard/Runtime ledger closure; remaining post-V1 incompleteness is now
  represented by follow-up risk rows and explicit safety boundaries, not by
  a missing proof-map row. Evidence:
  `docs/planning/v1-post-v1-release-confidence-row-closure-2026-05-14-task.md`.

- `V1-FINAL-EVIDENCE-CONSISTENCY-READBACK-2026-05-14` FINAL EVIDENCE
  CONSISTENCY PASS: final generated JSON artifacts and Markdown markers agree
  on scorecard `GO`, implementation/evidence/readiness `100%`, `PASS:21`,
  blocked modules `none`, concrete non-proof gaps `0`, no next work order,
  master ledger `GO`, static scan findings `0`, and project-index V1 PASS rows
  `21`. Evidence:
  `docs/planning/v1-final-evidence-consistency-readback-2026-05-14-task.md`.

- `V1-ACTIVE-QUEUE-CLOSURE-AUDIT-2026-05-14` ACTIVE QUEUE CLOSED: canonical
  final evidence files exist, active `next-steps` has no current
  NO-GO/BLOCKED completion signal, final scorecard readback is `GO` / `100%`
  / blocked modules `none`, and active unchecked-row scan found no open V1
  completion row. Evidence:
  `docs/planning/v1-active-queue-closure-audit-2026-05-14-task.md`.

- `V1-CURRENT-GO-LIVE-SMOKE-2026-05-14` CURRENT GO-LIVE SMOKE PASS: current
  worktree go-live smoke passed when DB-backed packs were run sequentially:
  Web `18/18`, API `44/44`, and full smoke API `44/44` plus Web `18/18`.
  The first parallel attempt produced false DB cleanup interference and is
  recorded in the learning journal. No deploy or production mutation was
  performed. Evidence:
  `docs/planning/v1-current-go-live-smoke-2026-05-14-task.md`.

- `V1-CURRENT-WORKTREE-FULL-REGRESSION-2026-05-14` CURRENT FULL REGRESSION
  PASS: after final V1 evidence, handoff, inventory, and sanity updates,
  `pnpm run lint`, full Web Vitest (`149` files / `512` tests), and full API
  Vitest all passed. No deploy or production mutation was performed. Evidence:
  `docs/planning/v1-current-worktree-full-regression-2026-05-14-task.md`.

- `V1-CURRENT-WORKTREE-SANITY-2026-05-14` CURRENT WORKTREE PASS: after final
  V1 evidence, handoff, and inventory updates, `pnpm run typecheck`,
  `pnpm run build`, and `pnpm run quality:guardrails` all passed. No deploy or
  production mutation was performed. Evidence:
  `docs/planning/v1-current-worktree-sanity-2026-05-14-task.md`.

- `V1-FINAL-GENERATED-STATE-2FC90A08-2026-05-14` FINAL GENERATED STATE GO:
  project index reports `PASS:21`, static issue scan findings `0`, master
  state ledger status `GO`, and completion scorecard status `GO` with
  implementation estimate `100%`, evidence coverage `100%`, and release
  readiness `100%`. Evidence:
  `docs/operations/v1-master-state-ledger-2026-05-14-final.md` and
  `docs/operations/v1-completion-scorecard-2026-05-14-final.md`.

- `V1-PRODUCTION-UX-A11Y-MOBILE-PROOF-2FC90A08-2026-05-14` PRODUCTION UX PASS:
  deployed build-info matches `2fc90a08`. Production route/module audit passed,
  and production CDP browser proof passed for desktop Dashboard, Wallets,
  Bots, Profile, and mobile Dashboard with screenshots, mobile menu click,
  keyboard focus, no framework overlay, and no horizontal overflow. Evidence:
  `docs/operations/prod-ui-module-clickthrough-2fc90a08-2026-05-14.md` and
  `docs/operations/prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14.md`.

- `V1-PRODUCTION-POSITIONS-PROOF-2FC90A08-2026-05-14` PRODUCTION POSITIONS
  PASS: deployed build-info matches
  `2fc90a0810032f2fedb744d69505a3bd55a23779`. Production proof verifies
  unauthenticated Positions rejection, active PAPER runtime candidate
  selection, PAPER-only position open/read, management-mode update/restore,
  manual TP/SL update, live-status read, takeover-status read, exchange
  snapshot boundary, runtime close fail-closed without `riskAck`, runtime close
  with `riskAck`, closed position readback, and OPEN-list cleanup. No LIVE
  order, LIVE cancel, LIVE close, LIVE position mutation, exchange-side
  mutation, or raw secret artifact capture was performed. Evidence:
  `docs/operations/prod-positions-proof-2fc90a08-2026-05-14.md`.

- `V1-PRODUCTION-SECURITY-EXCHANGE-PROOF-2FC90A08-2026-05-14`
  PRODUCTION SECURITY/EXCHANGE PASS: deployed build-info matches
  `2fc90a0810032f2fedb744d69505a3bd55a23779`. Production proof verifies
  security headers, public readiness, unauthenticated protected route
  rejection, unauthenticated ops diagnostics and metrics rejection, authenticated
  no-store profile read, API-key list redaction, untrusted Origin controlled
  `403`, unsupported exchange probe fail-closed behavior, Binance futures
  catalog read-only data, Gate.io futures catalog canonical symbols, and
  authenticated readiness details. No LIVE order, LIVE cancel, LIVE close,
  position mutation, exchange-side mutation, or raw secret artifact capture was
  performed. Evidence:
  `docs/operations/prod-security-exchange-proof-2fc90a08-2026-05-14.md`.

- `V1-PRODUCTION-FIXTURE-PAPER-ORDER-PROOF-457BCE05-2026-05-14` PARTIAL V1
  PRODUCTION PROOF PASS: the accepted limited fixture boundary was used to run
  a disposable production proof against deployed `457bce05`. Profile, Profile
  API Keys, Wallets, Markets, Strategies, Bots, Manual Orders, Orders,
  Backtests, Reports, Logs/Audit Trail, and Exchange Adapter probe fail-closed
  behavior passed. Cleanup passed for every created fixture, the disposable
  PAPER limit order was left terminal `CANCELED` as audit/history, and the
  disposable backtest run was deleted after report/trades/timeline readback. No
  LIVE order, LIVE cancel, LIVE close, position mutation, or exchange-side
  mutation was performed. Generated V1 state has since advanced after the
  Security/Exchange, Positions, and UX proofs to `GO`, `PASS:21`, and release
  readiness `100%`.
  Evidence:
  `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md` and
  `docs/operations/v1-completion-scorecard-2026-05-14-final.md`.

- `V1-BACK-WEB-FULL-LOCAL-BASELINE-457BCE05-2026-05-14` LOCAL BASELINE PASS:
  repository guardrails, API/Web typecheck, full Web Vitest (`149` files /
  `512` tests), full API Vitest, lint, production build, and `git diff --check`
  passed. This confirms broad local backend/web health for the current release
  line; production-only proof gaps remain tracked separately.

- `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14` READY / PROTECTED RELEASE PASS:
  production build-info is fresh for
  `457bce05338310c198c03a973395a9176f298dc1`, public API/Web smoke passes,
  protected runtime freshness passes with `runningCount=4`, rollback proof
  passes with `shouldRollback=false` and no alerts, and authenticated
  production UI clickthrough passes. Controlled no-order-guard `LIVEIMPORT-03`
  readback passes for `TRXUSDT`, and post-check confirmed the LIVE bot was
  deactivated in cleanup. Activation audit/plan, RC external gates, RC
  sign-off, RC checklist, rollback proof, UI clickthrough, public smoke,
  protected smoke, runtime freshness, rollback guard, production
  backup/restore drill, final preflight, and the full non-dry-run release gate
  are fresh/pass for 2026-05-14. Evidence:
  `docs/operations/v1-final-preflight-457bce05-2026-05-14-ready.md`,
  `docs/operations/liveimport-03-prod-readback-2026-05-14.json`,
  `docs/operations/v1-rollback-proof-prod-2026-05-14T01-00-18-225Z.md`, and
  `docs/operations/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md`.

- `V1-CURRENT-MAIN-PROMOTION-DEPLOY-LAG-457BCE05-2026-05-14` SUPERSEDED BY
  DEPLOY FRESHNESS: current candidate
  `457bce05338310c198c03a973395a9176f298dc1` is pushed to
  `origin/codex/v1-proof-and-ops-evidence` and `origin/main`; production
  build-info now reports `457bce05`, and public production smoke passed for
  that deployed surface. The later protected ops gate superseded the initial
  protected-auth `401` checks: protected runtime freshness, rollback guard,
  UI clickthrough, restore drill, final preflight, and full release gate are
  fresh/pass for 2026-05-14. No active V1 completion task remains unless a new
  deploy or failing signal appears.

- `V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13` LOCAL ADAPTER PASS:
  runtime symbol-stats fallback derivatives and live signal market-data gateway
  derivatives now use Exchange public adapter boundaries for non-Binance
  funding-rate history, open-interest history, and current order-book
  snapshots where supported. Binance REST remains Binance-scoped, unsupported
  methods fail closed, and derivative fallback caches are exchange-scoped.
  Focused runtime tests passed (`26/26`), API typecheck passed, and guardrails
  passed.

- `V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13` LOCAL ADAPTER PASS:
  non-Binance futures backtest supplemental funding-rate and open-interest
  history now read through the Exchange public market-data adapter where CCXT
  supports those methods. Backtest order-book history remains empty rather
  than using current snapshots as historical data. Focused API tests passed
  (`26/26`) and API typecheck passed.

- `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` LOCAL CONTRACT PASS:
  runtime fallback ticker prices now use the Exchange public market-data
  boundary for Binance and non-Binance exchanges, runtime position readback no
  longer restricts fallback ticker lookup to Binance, and Backtest details
  renders the resolved `exchange / marketType / baseCurrency` context in the
  header. Focused API runtime tests passed (`36/36`), Backtest details Web test
  passed (`4/4`), API typecheck passed, and Web typecheck passed.

- `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` LOCAL ADAPTER-BACKTEST
  PASS: audited bot runtime fallback and backtest data paths against the exact
  `(exchange, marketType)` architecture contract. Backtest candles and bot
  runtime fallback candles now use the Exchange public market-data boundary
  instead of direct Binance candle REST. Backtest run/timeline replay carries
  exchange context, Web timeline types match backend parity/order-book fields,
  and `MarketCandleCache` uniqueness now includes `source`. Focused
  bot/backtest tests passed (`56/56`), API typecheck passed, and Web typecheck
  passed. Production LIVE/Gate.io operation proof remains a separate lane.

- `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` LOCAL ADAPTER-BOUNDARY
  PASS: runtime candle warmup and indicator recovery now use the Exchange
  module public market-data boundary instead of direct Binance REST from
  Engine. Runtime candle and derivative series are exchange-scoped, strategy
  evaluation receives exchange context, and Binance-only derivative fallbacks
  fail closed for Gate.io. Focused runtime/decision-loop tests passed
  (`55/55`), exchange/stream/fallback/read-model tests passed (`12/12`), API
  typecheck passed, and guardrails passed. Production multi-bot/live runtime
  evidence remains a separate partial lane.

- `V1-NON-GATEIO-RUNTIME-AND-APP-PROOF-00169D7F-2026-05-13` NON-GATE.IO
  PARTIAL: Gate.io is deferred by user decision for this slice. Authenticated
  read-only production runtime readback confirms both active Binance PAPER bots
  are RUNNING with fresh monitoring data across runtime sessions, symbol stats,
  positions, trades, and aggregate endpoints. The Binance LIVE bot exists and
  has live opt-in enabled, but is currently inactive with no RUNNING session.
  Local verification is green: focused Web runtime tests (`41/41`), focused
  API runtime/monitoring tests (`47/47` and `29/29`), typecheck, build,
  guardrails, `test:go-live:web`, `test:go-live:api`, and
  `test:go-live:smoke`. No production writes, bot activation, orders,
  close-position commands, or exchange mutation were attempted.

- `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-REFRESH-457BCE05-2026-05-14`
  PRODUCTION NON-GATE.IO PASS: production build-info is fresh for `457bce05`;
  focused API LIVE/PAPER isolation tests passed (`25/25`); focused Web
  Dashboard selected-bot/runtime tests passed (`24/24`). Controlled
  no-order-guard production proof activated the existing Binance LIVE bot only
  for the observation window, verified `LIVEIMPORT-03` for `TRXUSDT`, captured
  a simultaneous read-only runtime snapshot with the Binance LIVE bot and both
  Binance PAPER bots RUNNING, and then deactivated the LIVE bot. Post-cleanup
  readback confirmed the LIVE bot was inactive again while PAPER runtime stayed
  healthy. Gate.io/second-LIVE production shape remains unavailable/deferred.

- `V1-PRODUCTION-RUNTIME-INVENTORY-00169D7F-2026-05-13` PRODUCTION MULTI-BOT
  SHAPE PARTIAL: authenticated read-only inventory found 3 visible bots:
  2 active PAPER bots and 1 inactive LIVE Binance futures bot. Latest PAPER
  sessions are RUNNING with fresh heartbeats; latest LIVE sessions are
  CANCELED. Production currently lacks the requested second active LIVE bot and
  has no visible LIVE Gate.io bot, so the 2x PAPER + 2x LIVE production proof
  is blocked on resource setup/activation decisions. No production writes,
  activation, or live orders were attempted.

- `V1-PRODUCTION-UI-CLICKTHROUGH-REFRESH-00169D7F-2026-05-13` PRODUCTION UI
  ROUTE AUDIT PASS: deployed build-info matched
  `00169d7fdc3aff8317759137b05594b20e773c8e`; authenticated production UI
  module clickthrough passed for public `PASS:4`, dashboard `PASS:18`, admin
  `PASS:3`, and legacy `PASS:3` routes with no blockers. Artifact no-secret
  inspection found no raw credentials, tokens, cookies, or private headers.
  This is route/module reachability evidence; deeper action-level journeys and
  live multi-bot runtime behavior remain separate proof lanes.

- `V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13` LOCAL CONTRACT PASS:
  Bots Monitoring props now reuse shared runtime enum aliases instead of local
  fee/capital source unions. Focused `BotsManagement` test passed (`14/14`),
  Web typecheck passed, duplicate-union scan returned no matches, and
  repository guardrails passed.

- `V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13` LOCAL CONTRACT PASS:
  Web runtime trade/order/position enum typing now matches backend fee source,
  trading origin, position management mode, and capital-source domains. Focused
  Web runtime tests passed (`5` files, `47` tests), Web typecheck passed,
  stale-value scan returned no matches, and repository guardrails passed. This
  is local contract evidence; production-safe browser/runtime clickthrough
  remains a separate V1 proof lane.

- `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13` PRODUCTION TARGET GATE
  READY: final `LIVEIMPORT-03` passed for `TRXUSDT`, final preflight has no
  blockers, and the production target-only release gate reports
  `Readiness: ready` for deployed `00169d7f...`. Production build-info
  freshness, post-deploy smoke, runtime freshness, and rollback guard all
  passed. The full gate artifact remains `not_ready` only because local
  Docker-backed `test:go-live:smoke` could not run without Docker Desktop after
  guardrails, typecheck, and build had already passed.

- `V1-CONTROLLED-LIVE-PROOF-ATTEMPT-00169D7F-2026-05-13` CONTROLLED LIVE
  PROOF PASS: after explicit user live-risk approval, the
  controlled runner started a RUNNING session and deactivated the bot in
  cleanup. A partial-update defect that cleared `liveOptIn`/import fields was
  found, production state was restored, and the runner was fixed to preserve
  those fields. The accepted runtime readback passed for the target bot's real
  managed symbol `TRXUSDT`; no orders were placed.

- `V1-CONTROLLED-LIVE-PROOF-PREACTIVATION-00169D7F-2026-05-13` BLOCKED ON
  EXPLICIT LIVE-RISK APPROVAL: controlled LIVE proof preactivation confirmed
  matching build-info, fully active no-order guard, and an inactive
  import-capable LIVE Binance futures bot. The runner refused activation
  without `--i-understand-live-risk`; no activation or order action occurred.

- `V1-PROD-RESTORE-AND-LIVEIMPORT-TRUTH-00169D7F-2026-05-13` FINAL PREFLIGHT
  ONE BLOCKER / V1 NO-GO: production restore drill is fresh `PASS` for
  2026-05-13 with zero cleanup leftovers. LIVEIMPORT evidence is canonical and
  fresh but failed because the existing LIVE Binance futures bot has no running
  session. Final preflight now blocks only on
  `evidence:liveImportReadback:failed`.

- `V1-PROTECTED-PROOF-REDUCTION-00169D7F-2026-05-13` PROTECTED PROOF REDUCED /
  V1 NO-GO: approved production application auth produced a fresh PASS
  production UI module clickthrough and a fresh PASS rollback proof. LIVEIMPORT
  readback auth succeeds and finds one LIVE Binance futures bot, but there is
  no running session, so runtime readback remains missing. Final preflight now
  blocks only on production DB restore context, LIVEIMPORT runtime readback,
  and stale backup/restore drill evidence.

- `V1-GATE4-PATRYK-SIGNOFF-2026-05-13` RC APPROVED / V1 NO-GO: Gate 4 was
  approved using the user-authorized `Patryk` approver/owner fields. Final
  preflight now reports RC external gates, sign-off, and checklist as fresh.
  Remaining blockers are technical protected proof and stale DB/rollback
  evidence.

- `V1-GENERATED-STATE-REFRESH-AFTER-RC-ACTIVATION-2026-05-13` GENERATED
  STATE / NO-GO: project index, static scan, master ledger, and completion
  scorecard were rerun after activation and RC evidence refresh. Generated
  state remains `NO-GO` with `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static
  findings `3`, implementation `86.8%`, evidence coverage `61.3%`, and
  release readiness `42.4%`.

- `V1-RC-CURRENT-BLOCKED-REFRESH-2026-05-13` RC FRESH / BLOCKED: RC external
  gates, RC sign-off, and RC checklist were refreshed for 2026-05-13. Gate 4
  remains open because real approver fields are missing; final preflight now
  reports RC artifacts as current failed evidence rather than stale evidence.

- `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-13` ACTIVATION FRESH / NO-GO:
  production activation audit and activation evidence plan are fresh for
  2026-05-13 and explicitly `NO-GO`. Final preflight removed the activation
  stale blockers but remains blocked on missing protected auth, missing DB
  restore context, stale RC/backup-restore/rollback evidence, missing
  `LIVEIMPORT-03`, and failed production UI clickthrough.

- `V1-GENERATED-STATE-REFRESH-AFTER-OPERATOR-PACKET-00169D7F-2026-05-13`
  GENERATED STATE / NO-GO: project index, static scan, master ledger, and
  completion scorecard were rerun after the current operator packet. Generated
  state remains `NO-GO` with `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static
  findings `3`, implementation `86.8%`, evidence coverage `61.3%`, and
  release readiness `42.4%`.

- `V1-OPERATOR-PACKET-CURRENT-DAY-REFRESH-00169D7F-2026-05-13` HANDOFF READY /
  V1 NO-GO: the current no-secret operator packet for deployed `00169d7f...`
  references the 2026-05-13 final preflight, protected input readiness, and
  production UI audit artifacts. It lists required protected inputs, Gate 4
  approver fields, execution order, and stop conditions. It does not approve
  V1.

- `V1-GENERATED-STATE-REFRESH-AFTER-CURRENT-DAY-BLOCKER-00169D7F-2026-05-13`
  GENERATED STATE / NO-GO: project index, static scan, master ledger, and
  completion scorecard were refreshed for 2026-05-13. Generated state remains
  `NO-GO` with `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static findings `3`
  (`P0:1`, `P1:1`, `P2:1`), implementation `86.8%`, evidence coverage
  `61.3%`, and release readiness `42.4%`.

- `V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13` PUBLIC PASS / FINAL
  BLOCKED: deployed build-info matches
  `00169d7fdc3aff8317759137b05594b20e773c8e`, final preflight public smoke
  passes, and the current production UI audit is fresh `BLOCKED_AUTH` with
  protected dashboard/admin/legacy routes failing closed to `/auth/login`.
  Final preflight remains blocked on missing protected auth and DB context,
  stale daily release artifacts for 2026-05-13, missing `LIVEIMPORT-03`,
  current failed production UI clickthrough evidence, and stale rollback proof.
  V1 remains `NO-GO`.

- `V1-PROTECTED-INPUT-READINESS-REFRESH-00169D7F-2026-05-12` BLOCKED /
  NO SECRET VALUES: the current Codex execution session has no environment
  variable names matching `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
  `PROD_UI_*`, or `SOAR_PROD_*`. The session cannot produce protected
  production readback, rollback PASS, or production-safe browser proof until
  approved inputs and real Gate 4 approver fields are provided.

- `V1-RELEASE-GATE-NONDRYRUN-BLOCKED-2026-05-12` NON-DRY-RUN / NOT READY:
  production release gate executed without `--dry-run` and skipped local
  quality only. Build-info freshness passed, public API/Web smoke checks
  passed, and deploy smoke failed on protected `/workers/health` `401`.

- `V1-OPERATOR-UNBLOCK-PACKET-00169D7F-2026-05-12` HANDOFF READY / V1
  NO-GO: the current no-secret operator packet for deployed `00169d7f...`
  lists required protected inputs and the command order for `LIVEIMPORT-03`,
  rollback proof PASS, RC Gate 4/sign-off/checklist, and final non-dry-run
  release gate. It does not approve V1.

- `V1-FINAL-PREFLIGHT-CURRENT-2026-05-12` PUBLIC PASS / FINAL BLOCKED:
  deployed build-info matches `00169d7f...`, public API/Web smoke passes, and
  production DB restore context is satisfied by fresh evidence. Final preflight
  remains blocked on missing `LIVEIMPORT_READBACK_*`, missing
  `ROLLBACK_GUARD_*`, failed RC evidence, missing `LIVEIMPORT-03`, and failed
  rollback proof.

- `V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-12` FRESH / FAIL: production
  rollback proof was refreshed for 2026-05-12 and failed closed. The artifact
  reports `shouldRollback:true` because protected runtime freshness and alerts
  endpoints returned `401`; release gate dry-run now classifies rollback proof
  as `failed` rather than stale.

- `V1-RC-BLOCKED-REFRESH-2026-05-12` FRESH / BLOCKED: RC external gates
  status, RC sign-off, and release-candidate checklist were refreshed to
  current-date blocked truth. Gate 1/2/3 are `PASS`, Gate 4 is `OPEN`, and
  sign-off status is `BLOCKED` because required approver fields are missing.
  Release gate dry-run now classifies RC artifacts as `failed` rather than
  stale for 2026-05-12.

- `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-12` FRESH / NO-GO: activation
  evidence audit and activation execution plan were refreshed to current-date
  `NO-GO` truth. Release gate dry-run now classifies both activation evidence
  families as `fresh` for 2026-05-12. Remaining blockers are RC Gate 4/sign-
  off, missing LIVEIMPORT-03, fresh-but-failed rollback proof, and missing
  approved protected prod ops auth.

- `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12` PASS / V1 STILL BLOCKED:
  production Postgres backup/restore drill passed on current-date evidence.
  The drill created a compressed dump, restored into isolated database
  `postgres_restore_check_20260512152138`, validated aggregate counts
  (`Bot=6`, `Log=52740`, `Order=3981`, `Position=4787`, `User=4`), dropped the
  restore DB, removed the dump, and cleanup returned `0` restore DBs and `0`
  backup dumps. Release gate dry-run now classifies backup/restore drill as
  `fresh` for 2026-05-12. V1 remains blocked on failed RC Gate 4/checklist/
  sign-off, missing LIVEIMPORT-03, and fresh-but-failed rollback proof.

- `V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12` PRODUCTION PUBLIC PASS /
  RELEASE BLOCKED: production public no-worker deploy smoke passed, public
  `build-info`, `/health`, and `/ready` returned `200`, and VPS Docker
  read-only inventory showed Soar API, Web, four workers, Redis, and Postgres
  running. Stage public smoke failed with `503` on API health, API ready, and
  web `/`. The production release gate remains `not_ready` in
  `docs/operations/v1-release-gate-prod-2026-05-12Tprod-readonly.md`: protected
  `/workers/health` returns `401` without approved app/operator auth,
  LIVEIMPORT-03 production readback is missing, RC Gate 4 is not approved, and
  activation, sign-off, backup/restore, and rollback proof artifacts are stale
  for 2026-05-12.

- `V1-OPERATIONS-LOCAL-PROOF-2026-05-12` PARTIAL LOCAL PASS / RELEASE BLOCKED:
  local rollback proof passed with `shouldRollback:false`, runtime freshness
  `PASS`, and no alerts. A short local SLO collection and SLO window report
  were generated. Local RC gate pipeline produced Gate 1/2/3 `PASS` and Gate 4
  sign-off blocked. Local V1 release gate passed deploy smoke, runtime
  freshness, and rollback guard. Local LIVEIMPORT-03 readback authenticated and
  avoided token capture, but failed because there were no LIVE bots/running
  import sessions (`botsChecked:0`). Operations remains blocked for V1 release
  approval until production/stage target evidence, sign-off, backup/restore,
  and liveimport readback are available.

- `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12` LOCAL PASS / PRODUCT AUDIT
  OPEN: API Subscriptions/Admin tests passed (`3` files, `18` tests),
  covering unauthenticated and non-admin rejection, admin subscription plan
  catalog, plan price/entitlement update validation, invalid entitlement
  rejection, admin users list with active subscription metadata, role/plan
  updates, self-demotion blocking, and profile subscription readback. Web
  Admin/Profile Subscription tests passed (`3` files, `7` tests), covering
  loaded, error, role-toggle, and plan-assignment states. Local protected admin
  route audit passed, and Edge/CDP screenshots rendered `/admin/subscriptions`
  and `/admin/users` without framework overlay. Subscriptions/Admin is now
  `PASS_LOCAL`; production admin clickthrough remains open.

- `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  authenticated local route audit passed; focused Web UX/a11y/state tests
  passed (`25` files, `126` tests); Edge/CDP browser proof captured desktop
  Dashboard, desktop Wallets, mobile Dashboard, and mobile menu screenshots;
  mobile menu focus/click interaction worked; no framework overlay was
  detected; CDP console/exception proof returned `0` events. UX/A11y/Mobile is
  now `PASS_LOCAL`; production browser clickthrough and external accessibility
  review remain open.

- `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Security/Privacy tests passed (`23` files, `111` tests), covering
  security/no-store headers, alerts/metrics admin access, `/ready` secret and
  runtime diagnostics, API error redaction, crypto/keyring behavior, rate-limit
  degradation, ops-network/trusted-origin/auth middleware, critical secret
  readiness, Auth lifecycle/JWT/cookie/error contracts, ownership isolation,
  Profile API-key secrecy/probes, Profile security actions, stage abuse
  throttling, and authenticated snapshots. Web Auth/Profile tests passed
  (`13` files, `48` tests). Security/Privacy is now `PASS_LOCAL`;
  production-safe protected security proof and external review remain open.

- `V1-WORKERS-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Workers/stream/runtime tests passed (`18` files, `88` tests), covering
  worker ownership/topology, market-stream source config, subscriptions,
  fanout retry, market-stream route contracts/e2e, Exchange polling source/
  fanout, Binance stream parsing, protected worker health/readiness, runtime
  freshness pass/fail/skip behavior, protected `/ready` diagnostics, PAPER
  runtime-flow worker telemetry, execution orchestrator behavior/import
  cleanup, execution adapter parity, backtest run job persistence, and queue
  tuning. Workers are now `PASS_LOCAL`; production-safe protected worker/
  process proof remains open.

- `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  fixed Gate.io public catalog symbol normalization so generic adapter ids
  like `BTC_USDT` become canonical Soar symbols like `BTCUSDT`. API Exchange
  tests passed (`19` files, `93` tests), covering API-key probes, runtime
  exchange order guard, Binance public REST/user data stream, CCXT futures
  connector behavior, adapter boundary fail-closed support, adapter registry,
  authenticated read service/contracts, connector factory, execution
  capability contract, market catalog, metadata contract, public read/market
  data, symbol rules, live order adapter, live fee reconciliation, and
  position exchange snapshot normalization. Web Exchanges/Profile API-key
  tests passed (`5` files, `17` tests), covering capability gating, route
  redirect, profile API-key integration, connection tests, stored-key tests,
  and delete risk confirmation. Exchange Adapter is now `PASS_LOCAL`;
  production-safe exchange-boundary proof remains open and real live mutation
  remains blocked-risk without an explicit safe plan.

- `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Logs tests passed (`2` files, `5` tests), covering unauthenticated
  rejection, owner-only reads, source/actor/severity filters, bot action-
  produced audit event visibility, and pagination defaults/bounds. Web Logs
  tests passed (`3` files, `4` tests), covering `/dashboard/logs` route shell,
  empty/loaded states, severity filter request payload, metadata trace
  rendering, and route-reachable locale copy. Logs/Audit Trail is now
  `PASS_LOCAL`; production-safe browser clickthrough remains open.

- `V1-REPORTS-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Reports service tests passed (`1` file, `2` tests), covering weighted
  BACKTEST report aggregation and PAPER trade aggregation. Web Reports tests
  passed (`3` files, `5` tests), covering `/dashboard/reports` route shell,
  empty state, aggregated cards/tables, and route-reachable locale copy.
  Reports is now `PASS_LOCAL`; production-safe browser clickthrough remains
  open and export/download is outside the current implemented Reports surface.

- `V1-BACKTESTS-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Backtests tests passed (`12` files, `110` tests), covering auth/
  ownership, create/list/get/delete, explicit range validation, enriched list
  fields, pending report contract, strategy-to-backtest-to-paper/live critical
  flow, paper/live parity with reconciliation, venue consistency, market-
  universe symbol formula, empty-symbol fail-closed behavior, 3-symbol paper
  alignment, failed parity diagnostics, run queue/job persistence, replay
  core, runtime kernel parity, contract remediation, data gateway, fill model,
  range service, and indicator timeline series. Web Backtests tests passed
  (`13` files, `32` tests), covering route shells, create form, list/details
  views, runs table actions, core-data hook, view-models, trade segments, pair
  metrics, and timeline overlays. Backtests is now `PASS_LOCAL`; production-
  safe browser clickthrough remains open.

- `V1-ORDERS-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Orders tests passed (`10` files, `121` tests), covering active filtering,
  PAPER/LIVE open contracts, missing price truth rejection, add/reverse
  conflicts, canonical bot context, LIVE pretrade/risk guards, exchange
  ids/status/fills/fees, execution errors, manual context rules, close
  attribution, exchange-backed fail-closed cancel/close behavior, list/get
  ownership, exchange event open/close/DCA/account-update lifecycle, partial/
  underfilled/capped fill progress, fee pending/backfill, live fill resolution,
  quantity rules, position scope, and live cancel boundary. Web Orders tests
  passed (`2` files, `3` tests), covering source labels, active open-order
  cancel action, and terminal order read-only behavior. Orders is now
  `PASS_LOCAL`; production-safe clickthrough remains open and live mutation
  remains blocked-risk without explicit safe plan.

- `V1-POSITIONS-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Positions tests passed (`12` files, `90` tests), covering list/read
  ownership, symbol filter normalization, stale local exclusion, live status
  scoping, exchange snapshot selection/fail-closed behavior, authenticated
  snapshots, takeover classification/rebind, orphan repair, imported lifecycle
  history, reconciliation diagnostics, manual TP/SL safety, management-mode
  guards, runtime visibility, close flows, external DCA separation, and
  carryover open orders. Web Positions tests passed (`3` files, `10` tests),
  covering runtime PnL derivations/fallbacks and ignored/closed/pending close
  UI states. Positions is now `PASS_LOCAL`; production-safe clickthrough
  remains open and LIVE mutation remains blocked-risk without explicit safe
  plan.

- `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Manual Orders tests passed (`7` files, `75` tests), covering manual
  context, PAPER market truth, open/cancel/close endpoints, order/position
  ownership, selected-bot write/read scope, quantity rules, position scope,
  LIVE risk guards, exchange-backed fail-closed cancel behavior, live fill
  resolution, and live cancel boundary. Web Manual Orders tests passed (`6`
  files, `20` tests), covering Dashboard Home submit, validation,
  context/venue/scope semantics, open-order source labels, open-order cancel
  actions, and submitted/waiting/ready/imported/position-opened/blocked action
  states. Manual Orders is now `PASS_LOCAL`; production-safe clickthrough
  remains open and LIVE order actions remain blocked-risk without explicit safe
  plan.

- `V1-STRATEGIES-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT OPEN:
  API Strategies tests passed (`3` files, `17` tests), covering CRUD,
  export/import, advanced TSL validation, invalid import rejection, ownership
  isolation, active-bot update/delete blocking, inactive bot update allowance,
  DCA reachability validation, and indicator catalog behavior. Web Strategies
  tests passed (`14` files, `46` tests), covering clone payloads, route shells,
  form validation, tab flow, presets, indicators, form mapping, numeric
  normalization, close validation, presentation, and taxonomy. Strategies is
  now `PASS_LOCAL`; production-safe browser clickthrough and representative
  runtime/backtest compatibility proof remain open.

- `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT
  OPEN: API key e2e and exchange probe service tests passed (`2` files,
  `25` tests), covering encrypted-only storage, masked responses, owner-only
  create/update/delete/rotate/revoke/test behavior, Binance and Gate.io
  provided/stored probes, no persistence of provided test credentials, audit
  metadata without raw secrets, placeholder probe fail-closed behavior, and
  bad-key/futures-missing rejection. Web API key form/list tests passed
  (`2` files, `13` tests), covering connection-test-before-save, stored-key
  test action, probe support status, placeholder exchange save behavior, and
  delete risk confirmation. Profile API Keys is now `PASS_LOCAL`; production-
  safe clickthrough and audit-log visibility remain open.

- `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11` LOCAL PASS / PRODUCT AUDIT
  OPEN: API Auth e2e passed (`11/11`) and proves registration/login cookie
  TTLs, logout cookie clearing with subsequent `/auth/me` 401, deleted-user
  session expiry, expired JWT cookie clearing with session-expired message, and
  duplicate token precedence. Focused Web Auth tests passed (`5` files,
  `17` tests) and prove AuthProvider bootstrap/logout/session-expired warning,
  API interceptor redirect to `/auth/login?session=expired`, middleware cookie
  gate, login form states, and login hook fail-closed missing-session-refresh
  behavior. Auth is now `PASS_LOCAL`; production-safe browser clickthrough
  remains open.

- `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11` LOCAL PASS / PRODUCT
  AUDIT OPEN: focused API e2e proof now validates live-loop worker telemetry.
  `runtime-flow.e2e.test.ts` passed with a real `RuntimeSignalLoop` PAPER
  lifecycle that creates a `RUNNING` session, writes at least three runtime
  events, tracks `BTCUSDT` symbol stats with long and exit counters, closes
  the runtime position, and reads the same data through authenticated runtime
  session list, detail, symbol-stats, and aggregate APIs. Bot Runtime is now
  `PASS_LOCAL` in the product action matrix; production-safe/non-local
  clickthrough remains open.

- `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11` LOCAL PASS/PARTIAL
  PRODUCT AUDIT OPEN: the approved PAPER snapshot import now creates one
  deterministic completed runtime session beside the running session. API
  readbacks returned `RUNNING,COMPLETED`, completed status `COMPLETED`,
  `eventsCount: 1`, `symbolsTracked: 3`, completed positions `openCount: 0`,
  and aggregate metadata `sessionsCount: 2`. Authenticated Node REPL
  Playwright proof filtered Bot Runtime to `COMPLETED` and rendered PAPER
  completed state with `0 open`, the three symbols, and wallet totals. One
  browser-bootstrap `401 Unauthorized` console resource was observed, while
  authenticated completed-session data rendered correctly. Worker telemetry is
  now covered by `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`;
  production-safe proof remains open.

- `V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11` LOCAL PASS/PARTIAL
  PRODUCT AUDIT OPEN: approved PAPER snapshot import passed and local
  API/Web were reachable. API readbacks for Bot Runtime sessions, aggregate,
  positions, symbol stats, and trades returned `200`; the representative
  session is PAPER `RUNNING` with 3 open positions. Authenticated Playwright
  fallback proof rendered the canonical Bot Runtime preview route on desktop
  `1280x720`, tablet `768x1024`, and mobile `390x844` with bot `asd`,
  `RUNNING`, `PAPER`, `BTCUSDT`, `BNBUSDT`, `ETHUSDT`, wallet KPI text, safe
  view switch, no console issues, and legacy runtime redirects to preview.
  Browser plugin path was attempted first and failed with
  `No active Codex browser pane available`, so standalone Playwright was used.

- `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11` LOCAL PASS/PARTIAL
  RELEASE: the existing PAPER snapshot import now creates deterministic local
  PAPER wallet/session/stat/event fixture data for the imported active bot.
  API readback proves `/runtime-sessions` `RUNNING`, session positions
  `openCount: 3`, and aggregate `openCount: 3`. Authenticated Playwright
  fallback proof renders Dashboard Home on desktop `1280x720`, tablet
  `768x1024`, and mobile `390x844` with status `RUNNING`, rows for `BTCUSDT`,
  `BNBUSDT`, `ETHUSDT`, wallet KPIs, and `Orders` tab interaction. Browser
  run had restricted-network resource console failures, but no framework
  overlay or page errors and the app runtime data rendered completely.

- `V1-DASHBOARD-HOME-ACTIVE-RUNTIME-BROWSER-PROOF-2026-05-11` LOCAL
  PARTIAL/BLOCKER FOUND: approved PAPER snapshot import succeeded and local
  API/Web were reachable (`/health` `200`, `/auth/login` `200`). Authenticated
  Playwright fallback proof rendered `/dashboard` on desktop `1280x720`,
  tablet `768x1024`, and mobile `390x844` with bot `asd`, PAPER mode,
  `BTCUSDT`/`BNBUSDT`/`ETHUSDT`, market/strategy context, wallet baseline
  `10,000.00`, no framework overlay, no console/page errors, and `Orders` tab
  interaction. It is not full Dashboard Home verification: the page reports
  `NO_SESSION`, shows `No open positions`, and `/runtime-sessions` returns
  `[]` despite the snapshot importing 3 open position fixture rows.

- `V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11` LOCAL PASS/PARTIAL BROWSER
  PROOF: local API/Web started successfully after process-only test keyring
  env override; authenticated `/dashboard` empty/onboarding state passed on
  desktop `1280x720` and mobile `390x844`, keyboard focus on `Open wallets`
  passed, framework overlay check passed, and console health passed after the
  shared `ThemeSwitcher` hydration-noise fix. Dashboard Home remains
  `PARTIAL`, not `VERIFIED`, because active selected-bot runtime browser proof
  on representative data, tablet/touch proof, and production-safe clickthrough
  are still open. Validation passed: targeted Web Vitest (`4` files, `36`
  tests), Web typecheck, and repository guardrails.

- `V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11` LOCAL
  PASS/PARTIAL PRODUCT AUDIT OPEN: rendered `HomeLiveWidgets` proof now covers
  loading state, retryable error state, selected-bot switching across two
  active PAPER bots, selected wallet KPI recalculation, open-orders tab data,
  trade-history tab data, and stale previous-bot row suppression. Validation
  passed: focused Dashboard pack (`3` files, `35` tests), Web typecheck,
  repository guardrails, and
  `git diff --check` with line-ending warnings only. Dashboard Home remains
  `PARTIAL`, not `VERIFIED`, because browser responsive/keyboard proof and
  production-safe clickthrough are still open.

- `BOT-DELETE-ACTIVE-PAPER-2026-05-11` LOCAL PASS/PARTIAL PRODUCT FIX:
  active PAPER bot deletion in `BotsManagement` no longer routes through the
  LIVE-risk confirmation; LIVE or live-opt-in bots remain guarded by the
  existing LIVE confirmation. Validation passed: Web Vitest (`147` files,
  `501` tests), API Bots e2e (`27/27`) after explicitly loading local
  `DATABASE_URL` without printing it, Web typecheck, repository guardrails,
  and `git diff --check` with line-ending warnings only. Production-safe
  browser clickthrough remains the next proof before `SOAR-BOTS-001` can be
  marked `VERIFIED`.

- `V1-COMPLETION-SCORECARD-2026-05-11` LOCAL PASS/SCORECARD COMPLETE:
  added `ops:project:scorecard` and generated
  `docs/operations/v1-completion-scorecard-2026-05-11.md` plus JSON from the
  master ledger. Validation passed: `node --check
  scripts/buildV1CompletionScorecard.mjs`, script help, and scorecard
  generation for `2026-05-11`. Current derived status remains `NO-GO`:
  implementation estimate `61.4%`, evidence coverage `25.4%`, release
  readiness `17.6%`, and all 13 P0 modules not release-ready.

- `V1-MASTER-STATE-LEDGER-2026-05-10` LOCAL PASS/LEDGER COMPLETE:
  added `ops:project:ledger` and generated
  `docs/operations/v1-master-state-ledger-2026-05-10.md` plus JSON. Validation
  passed: `node --check scripts/buildV1MasterStateLedger.mjs`, script help,
  and ledger generation for `2026-05-10`. The generated ledger keeps V1 at
  `NO-GO` with module buckets `toProve: 11`, `blocked: 2`, and
  `doneLocalNeedsProdProof: 8`; it includes 54 static findings (`P0: 8`,
  `P1: 13`, `P2: 33`).

- `PROJECT-INDEXING-BASELINE-2026-05-10` LOCAL PASS/INDEX BASELINE:
  added `ops:project:index` and generated
  `docs/operations/project-index-2026-05-10.md` plus JSON. Validation passed:
  `node scripts/buildProjectIndex.mjs --help` and
  `node scripts/buildProjectIndex.mjs --today 2026-05-10`. The generated V1
  module action status counts are `PASS_LOCAL: 8`, `UNVERIFIED: 11`, and
  `BLOCKED_AUTH: 2`. The first `corepack pnpm` attempt
  failed before script execution due to a Corepack signature issue on this
  workstation; direct Node execution was used because the script has no package
  dependency and performs only local indexing.

- `PROJECT-INDEX-V1-CROSSWALK-2026-05-10` LOCAL PASS/INDEX CROSSWALK:
  the project index now includes a prioritized V1 audit work map for all 21
  module action rows, with per-row risk, next proof, API/Web/route/worker/
  script/test surfaces. Validation passed: `node --check
  scripts/buildProjectIndex.mjs`, script help, report generation, repository
  guardrails, and `git diff --check`.

- `V1-STATIC-ISSUE-SCAN-2026-05-10` LOCAL PASS/SCAN COMPLETE: added
  `ops:project:scan` and generated
  `docs/operations/v1-static-issue-scan-2026-05-10.md`. Current scan reports
  54 findings (`P0: 8`, `P1: 13`, `P2: 33`) across V1 proof gaps, Web/API
  surface gaps, placeholder docs, queue hygiene, and capability-gate source
  markers. Validation passed: `node --check scripts/runV1StaticIssueScan.mjs`,
  script help, scan generation, repository guardrails, and `git diff --check`.

- `V1-DASHBOARD-HOME-RENDERED-RUNTIME-AUDIT-2026-05-10` LOCAL PASS/PARTIAL
  PRODUCT AUDIT OPEN: added a dedicated rendered `HomeLiveWidgets` regression
  proving a negative-PnL open position renders the Dashboard runtime TTP column
  without showing the prospective TTP label/value. Validation passed: focused
  Web rendered+presenter pack (`25/25`), Web typecheck, repository guardrails,
  and diff check. Dashboard Home remains `PARTIAL_LOCAL`, not full PASS.

- `V1-DASHBOARD-RUNTIME-TABLE-ACTION-AUDIT-2026-05-10` LOCAL PASS/PARTIAL
  PRODUCT AUDIT OPEN: Dashboard runtime table presenters now have focused
  local proof for local open-order cancel, terminal open-order read-only
  behavior, exchange-backed cancel blocked display, negative PnL/error styling,
  prospective TTP hidden at zero/negative live PnL, backend/runtime TTP
  precedence, TSL-only display, and non-actionable open-position action
  buttons. Validation passed: focused Web presenter suite (`24/24`), Web
  typecheck, repository guardrails, and diff check. Dashboard Home and Bot
  Runtime are `PARTIAL_LOCAL` in the action matrix; full V1 remains `NO-GO`.

- `V1-BOTS-ACTION-AUDIT-2026-05-10` LOCAL PASS/PRODUCT AUDIT OPEN:
  Bots action contracts now have local safe-fixture proof. Validation passed:
  Web Bots list table tests (`4/4`), API Bots e2e suite (`27/27`), duplicate
  active guard e2e (`6/6`), runtime close command service tests (`11/11`),
  API typecheck, and Web typecheck. Bots is `PASS_LOCAL` in the action matrix;
  V1 remains `NO-GO` until remaining module action rows are executed or
  explicitly blocked with safe operator plans.

- `V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10` LOCAL PASS/PRODUCT AUDIT OPEN:
  two confirmed P0 UI/action regressions are fixed locally. API bot deletion
  cleanup now clears runtime dedupe references; Dashboard/runtime prospective
  TTP display is hidden when live PnL is not positive. Validation passed:
  focused API bot deletion e2e (`1/1`), focused Web runtime/dashboard TTP tests
  (`13/13`), Dashboard presenter tests (`17/17`), API typecheck, Web typecheck,
  and `git diff --check` with line-ending warnings only. V1 product readiness
  remains `NO-GO` until the action matrix is executed. Evidence:
  `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`.

- `V1-FINAL-PREFLIGHT-1E11F8DE-2026-05-10` PASS/BLOCKED:
  refreshed no-secret final V1 preflight for deployed
  `1e11f8de4a3daaa313894a9ccf989237a3e65e5a`. Build-info PASS, public
  API/Web smoke PASS, and production DB restore context is satisfied by fresh
  evidence. V1 remains `BLOCKED` on protected/formal evidence:
  `LIVEIMPORT-03` runtime readback missing, rollback proof failed,
  liveimport/rollback auth missing, and RC gates/sign-off/checklist failed.
  Evidence:
  `docs/operations/v1-final-preflight-1e11f8de-2026-05-10.md`.

- `DEPLOY-SMOKE-SKIP-WORKERS-ALIAS-2026-05-10` LOCAL PASS:
  `scripts/deploySmokeCheck.mjs` now accepts `--skip-workers` as an alias for
  canonical `--no-workers`. The default protected worker check remains enabled
  unless skipped explicitly. Syntax/help checks pass, and production public
  smoke with `--skip-workers` passes API `/health`, API `/ready`, and Web `/`.
  Evidence:
  `docs/planning/deploy-smoke-skip-workers-alias-task-2026-05-10.md`.

- `CONTROLLED-LIVE-PROOF-RUNNER-2026-05-10` LOCAL PASS/BLOCKED_APPROVAL:
  added `pnpm run ops:live:controlled-proof`, a guarded operator runner for
  the short LIVE runtime-session proof. The runner checks build-info, requires
  protected `/ready/details` to report `globalKillSwitch=true`,
  `emergencyStop=true`, and `active=true`, refuses an already-active LIVE
  bot, runs `LIVEIMPORT-03`, and deactivates in a cleanup path. Syntax,
  `--help`, and local `--dry-run` checks pass. Actual LIVE activation remains
  blocked on explicit operator approval.

- `LIVE-RUNTIME-SAFETY-READINESS-DIAGNOSTICS-2026-05-10` LOCAL PASS/PENDING
  DEPLOY/PROD GUARD ACTIVE: protected `/ready/details` now includes
  `runtimeSafety.liveNoOrderGuard` booleans and derived `active`; public
  `/ready` remains minimal and does not expose runtime safety diagnostics.
  Focused API readiness tests pass after loading local `DATABASE_URL` from
  `apps/api/.env`; API typecheck passes. Production build-info reached
  `b139152672aa9f6b0e26f1cab5ba0203beb54741`; public smoke and protected
  worker smoke pass; protected `/ready/details` confirms
  `globalKillSwitch=true`, `emergencyStop=true`, and `active=true`. Evidence:
  `docs/operations/live-runtime-no-order-guard-prod-b1391526-2026-05-10.md`.

- `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10` READY/BLOCKED_APPROVAL:
  preactivation read-only `LIVEIMPORT-03` against deployed `b1391526`
  confirms one LIVE Binance Futures bot and expected `NO_RUNNING_SESSION`.
  Controlled LIVE activation/readback/deactivation remains pending explicit
  operator approval. Evidence:
  `docs/planning/controlled-live-session-proof-task-2026-05-10.md` and
  `docs/operations/_artifacts-liveimport-readback-preactivation-b1391526-2026-05-10.json`.

- `LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10` PASS/DEPLOYED:
  runtime config now exposes `RUNTIME_LIVE_GLOBAL_KILL_SWITCH` and
  `RUNTIME_LIVE_EMERGENCY_STOP`; final-candle LIVE pre-trade receives these
  flags and blocks before signal creation/order orchestration when enabled.
  Focused runtime config/final-candle tests and API typecheck pass. Production
  build-info now exposes `f00080842ea59289e8d683ac298939a23b522e67`, public
  API/Web smoke passes, and Coolify shows the Soar services running after the
  queued deploy completed.

- `PROD-API-RUNTIME-READINESS-8CD5C1B3-2026-05-10` PASS/BLOCKED:
  production build-info matches
  `8cd5c1b3f38b9594a9caf15d4b434c853a66fdfe`, public deploy smoke passes, and
  the stored Binance key test now returns `ok: true`, `code: OK`,
  `permissions.spot: true`, `permissions.futures: true`. `LIVEIMPORT-03`
  remains blocked fail-closed with `NO_RUNNING_SESSION` because no LIVE runtime
  session exists. Evidence:
  `docs/operations/prod-api-runtime-readiness-8cd5c1b3-2026-05-10.md`.

- `FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10` LOCAL PASS/PENDING DEPLOY:
  API-key probe semantics now accept keys that validate at least one actionable
  scope. Futures-only success returns `ok: true` with
  `permissions.futures: true`; Binance UI copy no longer implies Spot &
  Margin is mandatory for Futures bots. Focused API/Web tests, API/Web
  typechecks, guardrails, docs parity, and diff check pass. Production rerun is
  required after deploy.

- `BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10` LOCAL PASS/PENDING
  DEPLOY: the prior production stored-key probe result is now treated as
  ambiguous for Binance Futures. Local code now probes Spot and Futures
  independently and passes explicit Binance Futures balance params
  `{ type: "future", useV2: true }`. Focused probe tests and API typecheck pass;
  DB-backed e2e was blocked by missing local `DATABASE_URL`. Production rerun
  is required after deploy.

- `PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10` PASS/BLOCKED:
  production build-info matches
  `f3cb9a24c4c891479d5466a5abae4100ddda5ca8`, authenticated read-only API
  module reachability passed for the checked dashboard/admin endpoints, and
  Gate.io Futures catalog is reachable. LIVE Binance Futures remains
  `NO-GO`: the stored Binance key probe returned `ok: false`, `spot: true`,
  `futures: false`, and `LIVEIMPORT-03` wrote fail-closed
  `NO_RUNNING_SESSION` evidence for the configured LIVE bot. Evidence:
  `docs/operations/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`.

- `PROD-UI-AUTH-CLICKTHROUGH-39A52703-2026-05-10` PASS/BLOCKED: authenticated
  dashboard/admin production UI route/module reachability passed for deployed
  `39a5270322a7d1c302cd5a711484af35f4d6be08`. Public routes PASS `4/4`,
  dashboard routes PASS `18/18`, admin routes PASS `3/3`, and legacy redirects
  PASS `3/3`. This is route/module reachability evidence; deeper form/action
  coverage and live-money flows remain separate. Evidence:
  `docs/operations/prod-ui-module-clickthrough-39a52703-2026-05-10.md`.

- `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10` PASS/BLOCKED: the local architecture
  findings from the V1 architecture audit are resolved. API-key probe CCXT
  client construction moved behind `modules/exchange`, profile now consumes
  the exchange-owned factory, and Gate.io runtime/exchange docs are refreshed.
  Focused probe tests, API typecheck, direct CCXT boundary grep, guardrails,
  docs parity, and diff check passed. V1 remains blocked only on the separate
  protected/formal evidence lanes. Evidence:
  `docs/planning/v1-architecture-boundary-cleanup-task-2026-05-10.md` and
  `docs/operations/v1-architecture-function-audit-2026-05-10.md`.

- `V1-ARCH-FUNCTION-AUDIT-2026-05-10` PASS: architecture function audit found
  broad alignment across route maps, API auth boundaries, Web route ownership,
  runtime parity contracts, and production fail-closed posture. Its original
  local P1/P2 findings are now resolved by
  `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10`. Evidence:
  `docs/operations/v1-architecture-function-audit-2026-05-10.md`.
- `V1-FUNCTION-COVERAGE-AUDIT-2026-05-10` PASS/BLOCKED: function/module audit
  confirms broad implementation and local coverage across 38 Web route files,
  22 API modules, 16 Web feature areas, 180 API test files, and 145 Web test
  files. It found no broad missing module implementation for the current V1
  scope, but V1 remains `NO-GO` until protected liveimport readback, rollback
  proof PASS, authenticated/admin UI clickthrough, authenticated Gate 2 SLO,
  RC approval/sign-off/checklist, and final non-dry-run release gate are
  complete. Evidence:
  `docs/operations/v1-function-coverage-audit-2026-05-10.md`.
- `V1-FINAL-PREFLIGHT-82205329-2026-05-10` PASS/BLOCKED: production Web
  build-info matches `8220532920e484da9ddaa021ac64b5de4cc5e6e1`, public
  API/Web smoke passes, and production DB restore context is satisfied by
  fresh restore evidence. V1 remains `BLOCKED` on liveimport auth/readback,
  rollback guard auth/proof PASS, RC external gates/sign-off/checklist, and
  authenticated/admin UI proof. Evidence:
  `docs/operations/v1-final-preflight-82205329-2026-05-10.md`.
- `PROD-UI-PUBLIC-CLICKTHROUGH-88313309-2026-05-10` PASS/BLOCKED: current
  production build-info matches
  `88313309200d35275ba6c0d3465c5045c4b6d99e`. No-auth production UI audit
  reports public routes `PASS:4`, dashboard routes `BLOCKED_AUTH:18`, admin
  routes `BLOCKED_AUTH:3`, and legacy redirects `BLOCKED_AUTH:3`. This proves
  public reachability and protected-route fail-closed redirects on the current
  deploy, but not authenticated module functionality. Evidence:
  `docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`.
- `V1-CURRENT-RELEASE-GATE-DRY-RUN-2026-05-10` PASS/BLOCKED: production Web
  build-info still exposes
  `8f8630b0ad5abd690409d6173c9b247b95948138`. The V1 release-gate dry-run
  generated current artifacts and correctly reports readiness `not_ready`.
  Activation audit, activation plan, and backup/restore drill evidence are
  fresh; RC external gates, RC sign-off, RC checklist, `LIVEIMPORT-03`, and
  rollback proof remain failed or missing. The final production gate must still
  run without `--dry-run` after protected inputs and RC approvals exist.
  Evidence:
  `docs/operations/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.
- `V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10` PASS/BLOCKED: final V1
  runbooks now derive `$expectedSha` from production build-info by default and
  preserve explicit intended-candidate comparison when needed. V1 remains
  blocked on protected liveimport readback, rollback proof PASS, authenticated
  Gate 2 SLO, RC approval, and authenticated/admin UI clickthrough. Evidence:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
- `V1-SLO-GATE2-NOAUTH-PROBE-2026-05-10` BLOCKED: one-minute no-auth
  production SLO collection generated current blocker evidence. `/health`
  availability was 100%, `/ready` availability was 50% during the short
  window, protected workers/metrics/alerts returned `401 Missing token`, and
  queue/API/live-order metrics were `NO_DATA`. Follow-up public deploy smoke
  passed. Gate 2 still needs authenticated 30-minute production SLO evidence.
  Evidence: `docs/operations/v1-slo-gate2-noauth-probe-2026-05-10.md`.
- `V1-OPERATOR-RUNBOOK-CURRENT-SHA-SYNC-2026-05-10` PASS/BLOCKED: final V1
  operator runbooks now target latest verified deployed audit SHA
  `5515f2105d52f25a0d875cbd0b55860a00b4da32` and keep build-info
  verification authoritative. V1 remains `NO-GO` until protected
  liveimport readback, rollback proof PASS, RC approval/gates, and
  authenticated/admin UI clickthrough are captured. Evidence:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` and
  `docs/operations/v1-operator-unblock-checklist-2026-05-10.md`.
- `V1-COVERAGE-CONFIDENCE-AUDIT-2026-05-10` PASS/BLOCKED: current audited
  production SHA is
  `fd8da90bd77c2ddbed800eabd98479c1bd113ac4`. Build-info and public preflight
  smoke pass; direct worker health without protected auth returns `401`, and
  the no-auth UI module clickthrough reports public routes PASS with
  dashboard/admin/legacy routes `BLOCKED_AUTH`. The confidence audit says V1
  is broadly implemented locally but still `NO-GO` until protected
  liveimport readback, rollback proof PASS, RC approval/gates, and
  authenticated/admin UI clickthrough are captured. Evidence:
  `docs/operations/v1-coverage-confidence-audit-2026-05-10.md`,
  `docs/operations/v1-final-preflight-fd8da90b-2026-05-10.md`, and
  `docs/operations/prod-ui-module-clickthrough-fd8da90b-2026-05-10.md`.
- `PROD-UI-MODULE-CLICKTHROUGH-RUNNER-2026-05-10` PASS/BLOCKED: a canonical
  production UI module audit runner now exists as `ops:ui:prod-clickthrough`.
  The no-auth production run against
  `84e7c0e012a571f18396556a97198dbed08aba7c` reports public routes PASS and
  dashboard/admin/legacy protected routes `BLOCKED_AUTH`. Authenticated/admin
  UI clickthrough remains blocked until valid production app/admin auth and
  representative data are available. Evidence:
  `docs/operations/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.
- `V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-10` PASS/BLOCKED: production
  rollback-proof evidence was refreshed for the 2026-05-10 evidence date and
  correctly remains `FAIL` because protected rollback guard auth is absent.
  The proof failed closed on protected `401` responses for runtime freshness
  and alerts. Follow-up final preflight for
  `8df3260b8453be0a39dfa75ce2be281d6571c4de` reports build-info PASS, public
  smoke PASS, production DB restore context satisfied, backup/restore fresh,
  and rollback proof fresh but failed. Evidence:
  `docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md` and
  `docs/operations/v1-final-preflight-8df3260b-2026-05-10.md`.
- `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-10` PASS/BLOCKED: approved Coolify
  terminal access executed the isolated production Postgres backup/restore
  drill for the 2026-05-10 evidence date. The drill returned PASS markers,
  aggregate validation counts, and cleanup verification with zero leftover
  restore databases or backup dumps. Follow-up V1 final preflight for
  `969df7c8f268146ecff3efb9de2fe1841ac8bc75` reports production DB restore
  context satisfied and backup/restore drill evidence fresh. V1 remains
  `BLOCKED / NO-GO` on liveimport auth/readback, rollback guard auth/proof, RC
  approval/gates, and authenticated/admin production UI clickthrough. Evidence:
  `docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md` and
  `docs/operations/v1-final-preflight-969df7c8-2026-05-10.md`.
- `V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10` PASS/BLOCKED: Coolify stale
  Soar deploy jobs were cleared, one fresh `soar-api` redeploy finished on
  `33a2ebc468be3dbfab7c784f375672ebead5ae16`, production Web build-info
  matches the same SHA, public API/Web smoke passes, and the Coolify queue is
  empty. The refreshed no-secret V1 final preflight remains correctly
  `BLOCKED` on protected/formal evidence. Evidence:
  `docs/operations/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md` and
  `docs/operations/v1-final-preflight-33a2ebc4-2026-05-10.md`.
- `V1-DEPLOY-CONTROL-READINESS-2026-05-10` PASS/BLOCKED: production deployment
  is manual Coolify/operator controlled; GitHub Actions contains CI checks
  only and no approved no-secret production deploy trigger. Evidence:
  `docs/operations/v1-deploy-control-readiness-2026-05-10.md`.
- `DEPLOY-LAG-E70F5CF6-2026-05-10` BLOCKED/PASS: pushed commit
  `e70f5cf6229d6fc4d26ea0342b81baab80851800` did not reach production
  build-info during two bounded wait windows. Last observed production
  build-info remains `40e9b3c35c96d4acced73bbab980039f9e6b6a22`; public
  API/Web smoke passes. Evidence:
  `docs/operations/deploy-lag-e70f5cf6-2026-05-10.md`.
- `V1-PROTECTED-INPUTS-READINESS-2026-05-10` PASS/BLOCKED: protected input
  families required for `LIVEIMPORT-03`, rollback proof, and production DB
  restore context are not present in this shell. Privileged VPS/Docker
  inspection was rejected by the escalation reviewer. V1 remains
  `BLOCKED / NO-GO` until approved operator inputs or explicit infrastructure
  authorization are available. Evidence:
  `docs/operations/v1-protected-inputs-readiness-2026-05-10.md`.
- `V1-FINAL-PREFLIGHT-CURRENT-9D28F682` PASS/BLOCKED: final no-secret
  preflight now targets currently deployed
  `9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info PASS, public smoke
  PASS, activation artifacts fresh, RC artifacts fresh but failed, and V1
  remains `BLOCKED` on protected/formal evidence. Evidence:
  `docs/planning/v1-final-preflight-current-9d28f682-task-2026-05-10.md` and
  `docs/operations/v1-final-preflight-9d28f682-2026-05-10.md`.
- `V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10` PASS/BLOCKED: the operator
  unblock checklist and final blocker execution pack now target deployed
  `822d92fc02067fa122e735ab6cc2783e438dc458`. Final preflight for that SHA
  reports build-info PASS, public smoke PASS, activation artifacts fresh, RC
  artifacts fresh but failed, and V1 `BLOCKED` on protected/formal evidence.
  Evidence: `docs/operations/v1-operator-unblock-checklist-2026-05-10.md` and
  `docs/operations/v1-final-preflight-822d92fc-2026-05-10.md`.
- `V1-PROD-ACTIVATION-REFRESH-2026-05-10` PASS/BLOCKED: production activation
  plan and evidence audit are fresh for 2026-05-10 and explicitly `NO-GO` for
  deployed `74752f025ef49bf5026ec92e056f59947e00a18f`. Final preflight reports
  build-info PASS, public smoke PASS, activation artifacts fresh, and V1 still
  `BLOCKED` on protected/formal evidence: liveimport auth/readback, rollback
  guard auth, production DB restore context, failed RC evidence, stale
  backup/restore drill, and stale rollback proof. Evidence:
  `docs/planning/v1-production-activation-refresh-2026-05-10-task.md` and
  `docs/operations/v1-final-preflight-74752f02-2026-05-10.md`.
- `V1-RC-BLOCKED-REFRESH-2026-05-10` PASS/BLOCKED: RC external gates status,
  RC sign-off record, and RC checklist are fresh for 2026-05-10 and correctly
  remain blocked/failed instead of approved. Final preflight for deployed
  `1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` reports build-info PASS and
  public smoke PASS; V1 remains `BLOCKED` on protected/formal evidence:
  liveimport auth/readback, rollback guard auth, production DB restore
  context, stale activation audit/plan, stale backup/restore drill, stale
  rollback proof, Gate 2 SLO evidence, and real RC approvers. Evidence:
  `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
  `docs/operations/v1-final-preflight-1609929e-2026-05-10.md`.
- `DEPLOY-FRESHNESS-9C125683` validation PASS/BLOCKED: production Web
  build-info now exposes
  `9c12568379ee77cda9c9e9df39879e141b5615fb`, which includes `b414e523`
  canonical exchange-side `LIVE_ORDER_CANCEL` for Binance and Gate.io. Public
  API/Web smoke passes. The no-secret final V1 preflight public checks pass and
  remain correctly `BLOCKED` on protected/formal evidence: liveimport auth,
  rollback guard auth, production DB restore context, current activation/RC
  evidence, `LIVEIMPORT-03` readback, backup/restore drill, rollback proof,
  and authenticated/admin UI clickthrough. Evidence:
  `docs/planning/deploy-freshness-9c125683-task-2026-05-10.md`,
  `docs/operations/deploy-freshness-9c125683-2026-05-10.md`, and
  `docs/operations/v1-final-preflight-9c125683-2026-05-10.md`.
- `EXCHANGE2-31` local validation PASS: canonical exchange-side
  `LIVE_ORDER_CANCEL` is added for Binance and Gate.io through the existing
  orders/exchange/authenticated connector boundary. Exchange-backed local
  order state is mutated only after the boundary call succeeds; contextless
  exchange-backed rows remain fail-closed. Focused exchange tests, focused
  orders cancel tests, API typecheck, guardrails, docs parity, and diff check
  pass. Production freshness is now proven by `DEPLOY-FRESHNESS-9C125683`;
  the earlier deploy lag is superseded. Evidence:
  `docs/planning/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md`
  and `docs/operations/deploy-freshness-9c125683-2026-05-10.md`.
- `EXCHANGE2-30` validation and deployment PASS: Gate.io `LIVE_ORDER_SUBMIT` and
  shared `LIVE_EXECUTION` compatibility support are enabled through the
  canonical orders/exchange boundary. Gate.io exchange-side cancel remains
  unsupported. No real live-money action is performed. Focused exchange tests,
  wallet e2e, Web capability test, API typecheck, Web typecheck, production
  build-info for `04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public
  deploy smoke pass. The no-secret final V1 preflight public checks pass and
  remain correctly blocked on protected/formal evidence.
  Evidence:
  `docs/planning/exchange2-30-gateio-live-order-submit-task-2026-05-10.md`
  and `docs/operations/deploy-freshness-04a4204c-2026-05-10.md`.
- `EXCHANGE2-29` local validation PASS: Gate.io `WALLET_CASHFLOW_HISTORY` is
  enabled through the existing exchange adapter boundary. Gate.io live submit
  and exchange-side cancel remain unsupported. Focused exchange/wallet
  cashflow tests, API typecheck, guardrails, docs parity, and diff check pass.
  Production build-info now exposes
  `8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`, public deploy smoke passes, and
  no-secret final V1 preflight remains correctly blocked.
  Evidence:
  `docs/planning/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-8ea7f33b-2026-05-09.md`.
- `EXCHANGE2-28` local validation PASS: Gate.io `TRADE_HISTORY_SNAPSHOT` is
  enabled through the existing authenticated-read boundary. Gate.io wallet
  cashflow history, live submit, and exchange-side cancel remain unsupported.
  Focused exchange tests, authenticated snapshot service test, API typecheck,
  guardrails, docs parity, and diff check pass. Production build-info now
  exposes `432f768701300c7ba600fa7633532c0cc9ef4b96`, public deploy smoke
  passes, and no-secret final V1 preflight remains correctly blocked.
  Evidence:
  `docs/planning/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-432f7687-2026-05-09.md`.
- `EXCHANGE2-27` validation and deployment PASS: Gate.io
  `OPEN_ORDERS_SNAPSHOT` is enabled through the existing authenticated-read
  boundary. Production build-info now exposes
  `214a9c034d38ab8670fd4b43d0f8ed692d78d90c`, and public deploy smoke passes.
  The no-secret final V1 preflight remains correctly blocked on
  protected/formal evidence. Gate.io trade-history, live submit, and
  exchange-side cancel remain unsupported.
  Evidence:
  `docs/planning/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-214a9c03-2026-05-09.md`.
- `EXCHANGE2-26` local validation PASS: Gate.io `POSITIONS_SNAPSHOT` is
  enabled through the existing authenticated-read boundary and positions
  exchange-snapshot route. Gate.io open-orders/trade-history, live submit, and
  exchange-side cancel remain unsupported. Production build-info now exposes
  `4c7548acc74295f27676c1f00d79dbf58b873942`, and public deploy smoke passes.
  Evidence:
  `docs/planning/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.
- `EXCHANGE2-25` local validation PASS: Gate.io `BALANCE_PREVIEW` is enabled
  through the existing authenticated-read boundary and wallet preview route.
  Gate.io positions/open-orders/trade-history, live submit, and exchange-side
  cancel remain unsupported. Production build-info now exposes
  `15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`, and public deploy smoke passes.
  Evidence:
  `docs/planning/exchange2-25-gateio-balance-preview-task-2026-05-09.md` and
  `docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.
- `EXCHANGE2-24` local validation PASS: Gate.io `API_KEY_PROBE` is enabled for
  provided and stored profile API-key connection tests through the shared
  exchange-aware probe service. Gate.io balance preview, positions/open-orders,
  trade-history, live submit, and exchange-side cancel remain unsupported.
  Production build-info now exposes
  `e76e08a1a20b12abaeabf4edc44a38ba37619005`, and public deploy smoke passes.
  Evidence: `docs/planning/exchange2-24-gateio-api-key-probe-task-2026-05-09.md`
  and `docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.
- Latest observed production build-info is
  `e8cd748e80b8693087e01beb21b0085ace747c49`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  This is docs/evidence only over the protected runtime baseline. Evidence:
  `docs/operations/deploy-freshness-e8cd748e-2026-05-09.md` and
  `docs/operations/v1-final-preflight-e8cd748e-2026-05-09.md`.
- Previous public UI build-info was
  `745b5f5a45eab3f86b02e023479c8358f760bbf6`: public routes PASS and
  dashboard/admin no-auth gates redirect to `/auth/login`. This is
  docs/evidence only over the protected runtime baseline and does not close
  protected V1 evidence. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-745b5f5a-2026-05-09.md`.
- Latest protected runtime/preflight baseline is verified at
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  Evidence:
  `docs/operations/deploy-freshness-30b027b7-2026-05-09.md`,
  `docs/operations/v1-final-preflight-30b027b7-2026-05-09.md`, and
  `docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md`.
- Current production build-info is verified at
  `ba3d852d5126b625a8cf702ab647d5c644d86f9c`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  Evidence:
  `docs/operations/deploy-freshness-ba3d852d-2026-05-09.md`,
  `docs/operations/v1-final-preflight-ba3d852d-2026-05-09.md`, and
  `docs/planning/deploy-freshness-ba3d852d-task-2026-05-09.md`.
- Active protected V1 backlog/runbook targets are synced to deployed
  `30b027b78544f76b5b638851e8e27c98f6d22ab5`. This is a target sync only:
  `LIVEIMPORT-03`, rollback proof, restore proof, RC approval, and
  authenticated/admin UI audit remain blocked on operator inputs. Evidence:
  `docs/planning/open-protected-backlog-ba3d852d-sync-task-2026-05-09.md` and
  `docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md`.
- Current production build-info is verified at
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`: build-info PASS, public
  API/Web smoke PASS, and no-secret final V1 preflight public checks PASS.
  The preflight remains correctly `BLOCKED` on protected/formal V1 evidence.
  `LIVEIMPORT-03` target sync
  remains PASS, and protected readiness check remains PASS as a fail-closed
  blocker classification. V1 remains `BLOCKED` on missing live-import auth,
  rollback auth, production DB/Coolify restore context for current-date
  evidence, failed/open RC evidence, missing `LIVEIMPORT-03`, stale
  2026-05-08 restore evidence, and stale 2026-05-08 rollback proof. Evidence:
  `docs/operations/deploy-freshness-c50e1e7c-2026-05-09.md`,
  `docs/operations/v1-final-preflight-c50e1e7c-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`,
  `docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`,
  `docs/operations/deploy-freshness-6c54bb5d-2026-05-09.md`,
  `docs/operations/v1-final-preflight-6c54bb5d-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-6c54bb5d-2026-05-09.md`,
  `docs/operations/deploy-freshness-55469cdc-2026-05-09.md`,
  `docs/operations/v1-final-preflight-55469cdc-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-55469cdc-2026-05-09.md`,
  `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md`,
  `docs/operations/v1-final-preflight-4ee1672e-2026-05-09.md`,
  `docs/operations/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`,
  `docs/planning/liveimport-03-current-production-target-sync-task-2026-05-09.md`,
  and `docs/operations/v1-protected-access-readiness-2026-05-09.md`.
- Pushed `origin/main` currently ends at `010b4f8b`. Production build-info
  also exposes the correct full SHA
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`. The earlier deploy-lag
  interpretation came from using an incorrect full SHA for the same short
  commit; the corrected wait passed on attempt 1. Evidence:
  `docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md`.
- Current production public smoke passes on the deployed `010b4f8b` surface:
  API `/health` 200, API `/ready` 200, and Web `/` 200.
- Historical deploy-lag entry `1f1d9c12` had no `apps`, `packages`, `prisma`,
  or `scripts` changes over then-deployed `c50e1e7c`; it was a docs/evidence
  batch. Later production build-info advanced beyond that lag to
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`, so deploy freshness is no longer
  the active blocker. Runtime protected readback remains blocked on
  authenticated/operator evidence.
- Gate.io second-exchange foundation has advanced through `EXCHANGE2-06`.
  Latest pushed `main` is `5517f027`, including Gate.io public catalog,
  runtime event exchange generalization, public ticker/candle reader,
  opt-in `MARKET_STREAM_EXCHANGE=GATEIO` market-stream polling, and runtime
  consumption regressions for exact `GATEIO` ticker/final-candle context.
  Local validation for `EXCHANGE2-06` passed: API typecheck, repository
  guardrails, docs parity, diff check, and focused runtime loop Vitest
  (`47/47`). Production public smoke still passes, but production build-info
  remains at `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`; latest Gate.io
  market-stream/runtime commits are pushed but not yet verified as deployed.
- `EXCHANGE2-07` local source-path evidence is now added: a mocked Redis
  regression proves the Gate.io polling worker publishes ticker and
  final-candle events through canonical market-stream fanout and subscribers
  receive exact `GATEIO/FUTURES` context. This is not production/deployed
  source evidence and does not enable Gate.io `PAPER_PRICING_FEED`. Validation
  PASS: focused market-stream Vitest pack (`3` files, `7/7`), API typecheck,
  repository guardrails, docs parity, and diff check. Post-push public deploy
  smoke passed, but build-info waited 120 seconds for `4ef3ec58` and remained
  on `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`. Follow-up build-info now
  exposes `36ac02696ac0ce22a6b8bab545fcfb741125ea4b`, and public API/Web smoke
  passed after the freshness check.
- `EXCHANGE2-08` public Gate.io adapter smoke PASS: the existing
  `exchangePublicMarketData.service.ts` path read `GATEIO/FUTURES/BTCUSDT`
  ticker and `1m` candles successfully from public data without secrets,
  authenticated reads, exchange writes, or live orders. Gate.io
  `PAPER_PRICING_FEED` remains disabled pending target worker/source evidence.
  Post-push public API/Web smoke passed for `d4bdc7f0`, but build-info stayed
  on `36ac02696ac0ce22a6b8bab545fcfb741125ea4b` during the 120-second wait.
- `EXCHANGE2-09` worker source-selection regression PASS: market-stream worker
  env parsing is now tested through `marketStreamWorkerConfig.ts`. Binance
  remains the default source, Gate.io polling is explicit opt-in via
  `MARKET_STREAM_EXCHANGE=GATEIO`, and unsupported/invalid env values fall
  back to safe defaults. Validation PASS: focused worker/market-stream Vitest
  pack (`4` files, `8/8`) and API typecheck. Follow-up production build-info
  reached `9382d9317a5ae82d404559398922a253bef9e697`, and public API/Web
  smoke passed. Gate.io `PAPER_PRICING_FEED` remains disabled pending target
  environment source evidence with `MARKET_STREAM_EXCHANGE=GATEIO`.
- `EXCHANGE2-10` Web capability gating regression PASS: focused Web coverage
  proves `GATEIO` is listed in shared exchange options, supports only
  `MARKET_CATALOG`, and remains blocked for `PAPER_PRICING_FEED`,
  `LIVE_EXECUTION`, and `API_KEY_PROBE`; unknown/nullish exchanges fail
  closed. Validation PASS: focused Web Vitest pack (`3` files, `22/22`) and
  Web typecheck. Post-push public API/Web smoke passed for
  `21ec8efa01ec14ae7fd2c039ac4f9884a2564f65`, but build-info stayed on
  `9382d9317a5ae82d404559398922a253bef9e697` during the 120-second wait.
- `EXCHANGE2-11` wallet/bot form gating regression PASS: focused Web coverage
  proves Gate.io PAPER wallet submit stays blocked while
  `PAPER_PRICING_FEED` is unsupported, and Gate.io bot activation keeps the
  Active toggle disabled. Validation PASS: focused Web Vitest pack (`3` files,
  `19/19`) and Web typecheck.
- `EXCHANGE2-12` API wallet create fail-closed regression PASS: focused
  DB-backed wallet coverage proves a direct Gate.io PAPER wallet create request
  returns `EXCHANGE_NOT_IMPLEMENTED` for `PAPER_PRICING_FEED` and leaves no
  wallet persisted for the user. Validation PASS: focused wallet e2e (`21/21`),
  API typecheck from repo root, repository guardrails, docs parity, and diff
  check. Gate.io `PAPER_PRICING_FEED` remains disabled pending target source
  evidence.
- `EXCHANGE2-13` API wallet update fail-closed regression PASS: focused wallet
  CRUD coverage proves an existing Binance PAPER wallet cannot be updated to
  `GATEIO` while `PAPER_PRICING_FEED` is unsupported, and the wallet remains
  unchanged after rejection. Validation PASS: focused wallet CRUD e2e
  (`12/12`), API typecheck, repository guardrails, docs parity, and diff check.
- `EXCHANGE2-14` stored API-key probe fail-closed regression PASS: focused
  profile API-key coverage proves stored Gate.io placeholder credentials can
  exist, but the stored probe endpoint fails closed with `API_KEY_PROBE`
  unsupported and writes no connection-test audit log. Validation PASS: local
  Gate.io enum migration deploy, focused API-key e2e (`16/16`), API typecheck,
  repository guardrails, docs parity, and diff check.
- `EXCHANGE2-15` wallet balance preview fail-closed regression PASS: focused
  wallet coverage proves a stored Gate.io placeholder API key cannot be used
  for wallet balance preview while `BALANCE_PREVIEW` authenticated reads are
  unsupported, and the key is not marked used after rejection. Validation PASS:
  focused wallet e2e (`22/22`), API typecheck, repository guardrails, docs
  parity, and diff check.
- `EXCHANGE2-21` Gate.io public market-stream source smoke PASS: the new
  public-read-only runner captured real `GATEIO/FUTURES/BTCUSDT` ticker and
  final `1m` candle events through `ExchangePublicPollingMarketStreamWorker`
  with no credentials, exchange writes, or live orders. Evidence:
  `docs/operations/gateio-market-stream-source-smoke-2026-05-09.md`. Gate.io
  `PAPER_PRICING_FEED`, authenticated reads, live submit, and cancel remain
  disabled pending exact operation support and deployment/protected evidence.
- `EXCHANGE2-22` public symbol-rules regression PASS: Gate.io public symbol
  rules now resolve through the existing `MARKET_CATALOG`/market-map boundary
  instead of being coupled to `LIVE_EXECUTION`; unsupported exchanges without
  market catalog still return `null` without market loads. Gate.io paper/live
  and authenticated capabilities remain disabled.
- `EXCHANGE2-16` positions snapshot explicit-key fail-closed regression PASS:
  focused positions coverage proves a stored Gate.io placeholder API key cannot
  be selected via `apiKeyId` while `POSITIONS_SNAPSHOT` is unsupported. The
  service now enforces the adapter capability guard before test fallback data
  or connector reads, the route returns HTTP 501 with unsupported capability
  details, and `lastUsed` stays unchanged after rejection. Validation PASS:
  focused positions exchange snapshot e2e, API typecheck, repository
  guardrails, docs parity, and diff check.
- `EXCHANGE2-17` reconciliation snapshot fail-closed regression PASS: focused
  DB-backed service coverage proves stored Gate.io placeholder keys cannot
  reach open-orders or trade-history test fallback data while
  `OPEN_ORDERS_SNAPSHOT` and `TRADE_HISTORY_SNAPSHOT` are unsupported. Both
  paths preserve unsupported capability errors and leave `lastUsed` unchanged.
  Validation PASS: focused authenticated snapshots service test, API
  typecheck, repository guardrails, docs parity, and diff check.
- `EXCHANGE2-18` live submit boundary regression PASS: focused exchange
  boundary coverage proves Gate.io `LIVE_ORDER_SUBMIT` fails closed before
  credential resolution, connector construction, pretrade guards, leverage
  convergence, or live order adapter creation. Validation PASS: focused
  exchange adapter boundary test, API typecheck, repository guardrails, docs
  parity, and diff check.
- `EXCHANGE2-19` exchange-backed cancel route regression PASS: route-level API
  coverage proves persisted exchange-backed open orders fail closed through
  `/dashboard/orders/:id/cancel` with HTTP 501 and
  `LIVE_ORDER_CANCEL_UNSUPPORTED`, while order state and cancellation audit
  truth remain unchanged. Validation PASS: focused route e2e (`1/1`), full
  orders/positions e2e (`22/22`), API typecheck, repository guardrails, docs
  parity, and diff check.
- Production deploy freshness for the Gate.io fail-closed batch PASS:
  `/api/build-info` exposed
  `90cd07d602f0a31f315719b8a5cd5be3fd112313` after a longer wait, and public
  smoke passed for API `/health`, API `/ready`, and Web `/`. Evidence:
  `docs/operations/deploy-freshness-90cd07d6-2026-05-08.md`.
- Final V1 preflight public deploy checks now avoid global `pnpm` PATH drift by
  spawning bundled Node scripts directly. Focused tests passed (`13/13` before
  the remediation-hint assertion was added, then rerun in final validation),
  and the production preflight for deployed `90cd07d6` reports build-info PASS
  plus public smoke PASS while remaining correctly BLOCKED on protected
  auth/readback, rollback proof, and RC Gate 4 approval evidence. Evidence:
  `docs/operations/v1-final-preflight-90cd07d6-2026-05-08.md`.
- `EXCHANGE2-20` planning reconciliation PASS: second-exchange planning now
  reflects the deployed Gate.io foundation instead of treating all work as
  blocked. Current supported Gate.io truth remains public catalog plus public
  `FUTURES`/swap market-data foundation only; paper pricing, authenticated
  reads, live submit, and cancel remain unsupported. Evidence:
  `docs/planning/exchange2-20-plan-reconciliation-task-2026-05-09.md`.
- Production public UI access refresh PASS for deployed `90cd07d6`: Web
  build-info matches
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`, API `/health` and `/ready`
  return HTTP 200, public Web routes return HTTP 200, and unauthenticated
  dashboard/admin routes redirect to `/auth/login` with HTTP 307. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-90cd07d6-2026-05-09.md`.
  The full production UI module clickthrough remains blocked on valid
  authenticated/admin app access.
- V1 final preflight refresh for deployed `90cd07d6` is PASS for public deploy
  health and correctly BLOCKED for release readiness. Build-info and public
  API/Web smoke pass, while missing live-import auth, rollback auth,
  production DB restore context, missing `LIVEIMPORT-03`, and stale 2026-05-08
  release evidence block the 2026-05-09 release date. Evidence:
  `docs/operations/v1-final-preflight-90cd07d6-2026-05-09.md`.
- Production activation refresh for 2026-05-09 is current and `NO-GO`:
  activation plan and activation evidence audit are fresh, and the follow-up
  no-secret preflight confirms those two evidence families are no longer stale.
  V1 remains blocked on protected auth, production DB restore context, stale
  RC/recovery evidence, missing `LIVEIMPORT-03`, and rollback proof. Evidence:
  `docs/planning/v1-production-activation-and-evidence-plan-2026-05-09.md` and
  `docs/operations/v1-production-activation-evidence-audit-2026-05-09.md`.
- RC evidence refresh for 2026-05-09 is current and blocked: RC external
  gates status is fresh with Gate 2 and Gate 4 open, RC sign-off is fresh and
  `BLOCKED`, and RC checklist is synced to the same date. Final preflight now
  reports RC evidence as fresh `failed`, not stale. Evidence:
  `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-09.md`.
- Rollback proof tooling now supports explicit `--today` evidence-date stamps,
  but no 2026-05-09 rollback proof artifact is accepted yet. A no-auth
  sandboxed attempt could not reach production or write an artifact; protected
  rollback auth/network access is still required.
- Restore drill tooling now supports explicit `--today` evidence-date stamps,
  but no 2026-05-09 production restore drill artifact is accepted yet.
  Approved production DB/Coolify context is still required.
- Final blocker pack date synchronization PASS: the active V1 operator pack now
  declares one `$releaseDate` and passes it to supported date-aware preflight,
  restore drill, rollback proof, RC evidence, and final release gate commands.
  This is runbook/state evidence only; no protected production evidence was
  generated or accepted. Evidence:
  `docs/planning/v1-final-blocker-pack-date-overrides-task-2026-05-09.md`.
- Dashboard runtime aggregate deploy freshness PASS: production Web build-info
  now exposes `3c5da34371e22aecb1a7aff0a185018870d35cec`, and safe public smoke
  passed for API `/health`, API `/ready`, and Web `/`. Evidence:
  `docs/operations/deploy-freshness-3c5da343-2026-05-09.md`. Protected release
  evidence and authenticated UI clickthrough remain blocked on approved
  credentials/context.
- Final V1 preflight for deployed `3c5da343` is current and safely BLOCKED:
  build-info PASS, public smoke PASS, missing protected live-import and
  rollback auth, missing production DB restore context, failed RC evidence,
  missing `LIVEIMPORT-03`, and stale 2026-05-08 restore/rollback evidence for
  the 2026-05-09 evidence date. Evidence:
  `docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`.
- Production public UI access refresh PASS for deployed `3c5da343`: Web
  build-info matches `3c5da34371e22aecb1a7aff0a185018870d35cec`, API
  `/health` and `/ready` return HTTP 200, public Web routes return HTTP 200,
  and unauthenticated dashboard/admin routes redirect to `/auth/login` with
  HTTP 307. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`.
  The full production UI module clickthrough remains blocked on valid
  authenticated/admin app access.
- Final blocker pack candidate SHA sync PASS: protected evidence commands now
  use the verified deployed docs/evidence handoff candidate
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` as `$expectedSha`. The runtime
  code behavior remains the previously verified dashboard aggregate batch, but
  protected commands must match current production build-info. Evidence:
  `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
- Docs/evidence handoff deploy freshness PASS: production Web build-info now
  exposes `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, public API/Web smoke
  passed with `--no-workers`, and no-secret final V1 preflight reports
  build-info/public smoke PASS while protected V1 remains BLOCKED. Evidence:
  `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md` and
  `docs/operations/v1-final-preflight-4ee1672e-2026-05-09.md`.
- Production public UI access refresh PASS for deployed `4ee1672e`: Web
  build-info matches `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, API
  `/health` and `/ready` return HTTP 200, public Web routes return HTTP 200,
  and unauthenticated dashboard/admin routes redirect to `/auth/login` with
  HTTP 307. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`.
  The full production UI module clickthrough remains blocked on valid
  authenticated/admin app access.
- `LIVEIMPORT-03` current production target is now synced to deployed
  `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`. Public/no-secret checks pass,
  but this does not close the blocker; it still requires authenticated
  read-only runtime positions readback and redacted evidence for the reported
  LIVE ETH/DOGE rows.
- Protected access readiness BLOCKED: current shell lacks required
  live-import auth, rollback auth, and production DB/Coolify restore context
  env names. No protected production evidence, rollback proof, restore drill,
  RC approval, or authenticated/admin UI clickthrough can be completed until
  operator inputs are supplied. Evidence:
  `docs/operations/v1-protected-access-readiness-2026-05-09.md`.
- Production public UI access probe on 2026-05-08 passed for API `/health`,
  API `/ready`, Web `/`, `/auth/login`, `/auth/register`, `/offline`, and
  `/api/build-info`; unauthenticated dashboard/admin routes returned HTTP 307
  to `/auth/login`, confirming fail-closed auth gates. The same evidence keeps
  deploy freshness blocked because build-info reports
  `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` while latest expected prefix was
  `373a0ceb`. Evidence:
  `docs/operations/prod-ui-public-access-clickthrough-2026-05-08.md`.
  Follow-up after pushing docs commit
  `d55a86007b80733d67e793c261a5208c6734ab79`: public deploy smoke still
  passed, but build-info waited 120 seconds and remained on
  `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`.
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

The latest evidence-only restore-drill refresh has no runtime deployment
impact. It closes the stale production DB restore-context blocker for the
2026-05-10 evidence date, but it does not change application code, secrets,
workers, exchange behavior, or live-money behavior.

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
