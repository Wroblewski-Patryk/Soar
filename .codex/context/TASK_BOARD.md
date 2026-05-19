# TASK_BOARD

Last updated: 2026-05-19

## Agent Workflow Refresh (2026-04-18)

- This board is the canonical execution queue for CryptoSparrow / Soar.
- Active planning source remains `docs/planning/mvp-next-commits.md`.
- If planning docs and this board drift, sync them before implementation.
- Default delivery loop for every execution slice:
  - plan
  - implement
  - run relevant tests and validations
  - capture architecture follow-up if discovered
  - sync task state, project state, planning docs, and learning journal when
    needed

## READY

- [x] `REQUIREMENTS-DELIVERY-MAP-AUDIT-2026-05-19 research: refresh AUD-02 requirements/source-of-truth alignment`
  - 2026-05-19: Completed the dedicated `AUD-02` requirements and delivery-map
    audit after the full reusable rollup. Fresh `AUD-00` generated evidence
    also passed for 2026-05-19: project index `PASS:21`, tests indexed `335`,
    and static scan findings `0`. Follow-up refreshed the delivery map from
    current audit truth, restored risk-ID uniqueness by renumbering the
    audit-process row to `RISK-036`, and synchronized continuation state with
    the rollup. `AUD-02` is current for source-of-truth alignment after
    follow-up; production-boundary requirements remain partial only where fresh
    production proof was intentionally excluded. Evidence:
    `docs/operations/requirements-delivery-map-audit-2026-05-19.md`,
    `docs/operations/project-index-2026-05-19.md`, and
    `docs/operations/v1-static-issue-scan-2026-05-19.md`.

- [x] `FULL-REUSABLE-AUDIT-ROLLUP-2026-05-19 research: close AUD-00 through AUD-23 rollup`
  - 2026-05-19: Published final reusable audit rollup for `AUD-00` through
    `AUD-23`, including stable statuses, residual repair queue, and explicit
    production/LIVE/exchange mutation exclusions. A later decision-sync pass
    resolved `AUD-01` and `AUD-20`, leaving `AUD-19` fresh production release
    evidence as the next production-readiness gate. Evidence:
    `docs/operations/full-reusable-audit-rollup-2026-05-19.md` and
    `docs/planning/full-reusable-audit-rollup-2026-05-19-task.md`.

- [x] `AUDIT-DECISION-PACKET-2026-05-19 research: packet remaining audit decisions`
  - 2026-05-19: Prepared and then resolved the audit decision packet.
    `DEC-AUD-001` accepts Binance + Gate.io as current implementation scope,
    not Binance-only. `DEC-AUD-002` accepts assistant foundation/dry-run as
    current scope and defers hot-path orchestration. Evidence:
    `docs/operations/audit-decision-packet-2026-05-19.md` and
    `docs/planning/audit-decision-packet-2026-05-19-task.md`.

- [x] `AUDIT-OPEN-DECISION-STATE-SYNC-2026-05-19 research: sync residual decision state`
  - 2026-05-19: Synchronized risk, requirement, known-issue, and
    documentation-drift state after the audit decision packet. Repaired
    `AUD-EXCH-002` and closed `AUD-EXCH-007` are no longer described as open
    blockers. A later decision-sync pass accepted `DEC-AUD-001` and
    `DEC-AUD-002`, so the remaining audit blocker is fresh `AUD-19` production
    release evidence before any new production readiness claim. Evidence:
    `docs/planning/audit-open-decision-state-sync-2026-05-19-task.md`.

- [x] `AUDIT-DECISION-REPAIR-PLAYBOOKS-2026-05-19 planning: prepare post-decision repair playbooks`
  - 2026-05-19: Prepared option-specific repair playbooks for `DEC-AUD-001`
    exchange-scope wording and `DEC-AUD-002` assistant runtime truth. They now
    serve as historical guidance for the accepted decision repair; runtime
    behavior was not changed. Evidence:
    `docs/operations/audit-decision-repair-playbooks-2026-05-19.md` and
    `docs/planning/audit-decision-repair-playbooks-2026-05-19-task.md`.

- [x] `AUDIT-MACHINE-READABLE-DECISION-LINKS-2026-05-19 planning: link decision JSON to repair playbooks`
  - 2026-05-19: Added machine-readable links from the full audit rollup JSON
    and audit decision packet JSON to the post-decision repair playbooks.
    Evidence:
    `docs/planning/audit-machine-readable-decision-links-2026-05-19-task.md`.

- [x] `FULL-REUSABLE-AUDIT-HANDOFF-2026-05-19 planning: create audit handoff packet`
  - 2026-05-19: Created a concise handoff packet for the full reusable audit
    mission with current source-of-truth files, validation, open decisions,
    residual risks, and resume instructions. Added a machine-readable JSON
    handoff for future automation/readback. Evidence:
    `docs/operations/full-reusable-audit-handoff-2026-05-19.md`,
    `docs/operations/full-reusable-audit-handoff-2026-05-19.json`, and
    `docs/planning/full-reusable-audit-handoff-2026-05-19-task.md`.

- [x] `AUDIT-HANDOFF-INDEX-LINK-SYNC-2026-05-19 planning: link audit handoff from indexes`
  - 2026-05-19: Added the full reusable audit handoff link to the
    machine-readable rollup JSON and project memory index. Evidence:
    `docs/planning/audit-handoff-index-link-sync-2026-05-19-task.md`.

- [x] `AUDIT-HANDOFF-CROSSLINK-SYNC-2026-05-19 planning: cross-link audit handoff artifacts`
  - 2026-05-19: Linked the handoff Markdown to its JSON pair and linked both
    handoff artifacts from the rollup Markdown. Evidence:
    `docs/planning/audit-handoff-crosslink-sync-2026-05-19-task.md`.

- [x] `REUSABLE-AUDIT-ARTIFACT-MANIFEST-2026-05-19 planning: create audit artifact manifest`
  - 2026-05-19: Created a human-readable and machine-readable manifest mapping
    `AUD-00` through `AUD-23` to current reports, task records, open decisions,
    and safety boundaries for future reruns. Evidence:
    `docs/operations/reusable-audit-artifact-manifest-2026-05-19.md`,
    `docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`, and
    `docs/planning/reusable-audit-artifact-manifest-2026-05-19-task.md`.

- [x] `REUSABLE-AUDIT-MANIFEST-PATH-CHECK-2026-05-19 verification: verify manifest paths`
  - 2026-05-19: Verified the reusable audit artifact manifest references only
    existing repository paths: `81` paths checked, `0` missing. Evidence:
    `docs/planning/reusable-audit-manifest-path-check-2026-05-19-task.md`.

- [x] `REUSABLE-AUDIT-MANIFEST-CHECK-COMMAND-2026-05-19 verification: add reusable manifest check command`
  - 2026-05-19: Added `corepack pnpm run audit:manifest:check`, which
    validates manifest JSON, `AUD-00` through `AUD-23` coverage, referenced
    path existence, and decision packet/playbook links. Added focused
    regression tests via `corepack pnpm run audit:manifest:check:test`.
    Evidence:
    `docs/planning/reusable-audit-manifest-check-command-2026-05-19-task.md`.

- [x] `REUSABLE-AUDIT-MANIFEST-COMPARE-COMMAND-2026-05-19 verification: add reusable manifest comparison command`
  - 2026-05-19: Added `corepack pnpm run audit:manifest:compare`, which
    compares two reusable audit manifests for audit status regressions,
    summary regressions, added open decisions, and safety-boundary regressions.
    The current manifest self-comparison passes and JSON output is available
    for future automation. Added focused regression tests via
    `corepack pnpm run audit:manifest:compare:test`. Evidence:
    `docs/planning/reusable-audit-manifest-compare-command-2026-05-19-task.md`.

- [x] `REUSABLE-AUDIT-MANIFEST-VERIFY-COMMAND-2026-05-19 verification: add one-command manifest verification`
  - 2026-05-19: Added `corepack pnpm run audit:manifest:verify`, which runs
    manifest checker tests, manifest comparison tests, current manifest check,
    and current manifest self-comparison as one fail-fast verification bundle.
    Evidence:
    `docs/planning/reusable-audit-manifest-verify-command-2026-05-19-task.md`.

- [x] `REUSABLE-AUDIT-RERUN-PLAYBOOK-2026-05-19 planning: publish audit rerun playbook`
  - 2026-05-19: Published an operations playbook for rerunning the reusable
    audit set against the 2026-05-19 baseline, including preconditions, run
    order, manifest validation/compare commands, regression rules, stop
    conditions, closure checks, and cleanup checks. Added a machine-readable
    JSON pair for future automation/readback plus `audit:rerun-playbook:check`
    and focused regression tests; `audit:manifest:verify` now includes the
    rerun playbook checks. Evidence:
    `docs/operations/reusable-audit-rerun-playbook-2026-05-19.md`,
    `docs/operations/reusable-audit-rerun-playbook-2026-05-19.json`, and
    `docs/planning/reusable-audit-rerun-playbook-2026-05-19-task.md`.

- [x] `REUSABLE-AUDIT-TOOLING-INDEX-2026-05-19 planning: publish audit tooling index`
  - 2026-05-19: Published a human-readable and machine-readable map of
    reusable audit scripts and commands, with `audit:manifest:verify` as the
    primary closure command and explicit safety boundaries. Added
    `audit:tooling-index:check` and focused regression tests; the primary
    verify command now includes tooling-index checks. Evidence:
    `docs/operations/reusable-audit-tooling-index-2026-05-19.md`,
    `docs/operations/reusable-audit-tooling-index-2026-05-19.json`, and
    `docs/planning/reusable-audit-tooling-index-2026-05-19-task.md`.

- [x] `AUDIT-REMEDIATION-MASTER-PLAN-2026-05-19 planning: convert audit findings into repair roadmap`
  - 2026-05-19: Published a master remediation plan that converts the reusable
    audit rollup into prioritized work packages for exchange architecture
    truth, assistant runtime truth, production release evidence, production-safe
    evidence refreshes, security governance, UX/a11y deepening, mobile
    activation, and audit tooling maintenance. Evidence:
    `docs/planning/audit-remediation-master-plan-2026-05-19.md`.

- [x] `I18N-COPY-REACHABILITY-AUDIT-2026-05-19 research: refresh AUD-22 i18n/copy`
  - 2026-05-19: Completed the `AUD-22` i18n/copy reachability audit.
    Route-reachable i18n audit passed with findings `0`, localCopy `0`,
    fallbackPl `0`, and hardcoded `0`. Focused Web i18n pack passed (`8` files
    / `26` tests). Evidence:
    `docs/operations/i18n-copy-reachability-audit-2026-05-19.md` and
    `docs/planning/i18n-copy-reachability-audit-2026-05-19-task.md`.

- [x] `MOBILE-CROSS-PLATFORM-SCOPE-AUDIT-2026-05-19 research: refresh AUD-21 mobile scope`
  - 2026-05-19: Completed the `AUD-21` mobile/cross-platform scope audit.
    Mobile remains scaffold-only: `apps/mobile` contains only package, README,
    and placeholder source files; mobile build/test scripts intentionally print
    deferred scaffold messages; mobile docs state no production mobile runtime
    and no independent mobile backend contracts. Responsive Web mobile evidence
    remains under `AUD-05`, not native app parity. Evidence:
    `docs/operations/mobile-cross-platform-scope-audit-2026-05-19.md` and
    `docs/planning/mobile-cross-platform-scope-audit-2026-05-19-task.md`.

- [x] `OPERATIONS-RELEASE-DEPLOYMENT-AUDIT-2026-05-19 research: refresh AUD-19 operations/release`
  - 2026-05-19: Completed the local `AUD-19` operations/release/deployment
    audit. Typecheck, lint, build, go-live smoke, and local DB backup/restore
    check passed. Go-live smoke covered API (`4` files / `45` tests) and Web
    (`3` files / `18` tests). The local backup/restore check requires a
    running local Postgres container; the first no-infra run failed with that
    precondition, then passed after `go-live:infra:up`. No production deploy,
    production database mutation, production journey, LIVE mutation,
    exchange-side mutation, or existing production data mutation was performed.
    Evidence:
    `docs/operations/operations-release-deployment-audit-2026-05-19.md` and
    `docs/planning/operations-release-deployment-audit-2026-05-19-task.md`.

- [x] `POST-PUSH-BUILD-INFO-READBACK-36FF999D-2026-05-19 verification: read production build-info after push`
  - 2026-05-19: Completed a read-only post-push production freshness check for
    pushed commit `36ff999d`. Public API/Web smoke passed for the currently
    deployed service, but production build-info stayed on
    `1586f59261cef94d7c513d71bbfcfb697d11ca59` (`gitRef: main`) instead of
    `36ff999d`, so no production readiness claim is made for `36ff999d`. No
    production mutation, database mutation, journey mutation, LIVE
    order/cancel/close, or exchange-side mutation was performed. Evidence:
    `docs/operations/post-push-build-info-readback-36ff999d-2026-05-19.md` and
    `docs/planning/post-push-build-info-readback-36ff999d-2026-05-19-task.md`.

- [x] `MAIN-PROMOTION-BUILD-INFO-DD1A1FAF-2026-05-19 release: promote audit branch to main and verify public freshness`
  - 2026-05-19: Confirmed `origin/main` was an ancestor of the current audit
    branch HEAD, fast-forwarded `origin/main` to
    `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, waited for production
    build-info to expose `dd1a1faf` on attempt `8`, and reran public no-worker
    deploy smoke successfully for API `/health`, API `/ready`, and Web `/`.
    No production data mutation, LIVE order/cancel/close, exchange-side
    mutation, existing production data mutation, or protected authenticated
    journey was performed. Full protected release readiness remains a separate
    `AUD-19` gate. Evidence:
    `docs/operations/main-promotion-build-info-dd1a1faf-2026-05-19.md` and
    `docs/planning/main-promotion-build-info-dd1a1faf-2026-05-19-task.md`.

- [x] `PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-19 verification: classify protected release blockers`
  - 2026-05-19: Ran the no-secret final preflight against deployed
    `dd1a1faf`. Build-info and public smoke passed. The preflight then blocked
    as expected on missing liveimport auth, rollback guard auth, dashboard UI
    auth, admin UI auth, production DB restore context, and stale 2026-05-14
    protected release evidence. No production mutation, LIVE order/cancel/close,
    exchange-side mutation, existing production data mutation, or protected
    authenticated journey was performed. Evidence:
    `docs/operations/v1-final-preflight-dd1a1faf-2026-05-19-noauth.md` and
    `docs/planning/protected-preflight-dd1a1faf-2026-05-19-task.md`.

- [x] `RC-EVIDENCE-BLOCKED-DD1A1FAF-2026-05-19 verification: refresh dated no-secret RC blocked packet`
  - 2026-05-19: Published dated no-secret RC status, sign-off, checklist, and
    strict evidence-check artifacts for deployed `dd1a1faf` without overwriting
    historical 2026-05-14 canonical PASS artifacts. Current snapshot is Gate 1
    `PASS`, Gate 2 `OPEN`, Gate 3 `PASS`, Gate 4 `OPEN`; strict evidence check
    fails as expected on missing Gate 2 PASS and missing Gate 4 approver/owner
    fields. No production mutation, LIVE order/cancel/close, exchange-side
    mutation, protected authenticated journey, or fabricated approval was
    performed. Evidence:
    `docs/operations/v1-rc-external-gates-status-dd1a1faf-2026-05-19-blocked.md`
    and `docs/planning/rc-evidence-blocked-dd1a1faf-2026-05-19-task.md`.

- [x] `V1-OPERATOR-UNBLOCK-PACKET-DD1A1FAF-2026-05-19 release: publish current protected evidence handoff`
  - 2026-05-19: Published a current no-secret operator unblock packet for
    protected `AUD-19` completion on deployed `dd1a1faf`. Production build-info
    readback still points to
    `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`; the packet lists required
    protected auth/context and sign-off inputs, ordered commands, stop
    conditions, and final acceptance rule. It remains `NO-GO` and does not
    claim protected release readiness. Evidence:
    `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-19.md` and
    `docs/planning/v1-operator-unblock-packet-dd1a1faf-2026-05-19-task.md`.

- [x] `V1-PROTECTED-INPUT-READINESS-DD1A1FAF-2026-05-19 verification: sweep protected input names`
  - 2026-05-19: Ran a names-only protected input readiness sweep for the
    current Codex shell. Result: `0` matching protected input names across
    liveimport, rollback, production UI, production DB, RC, and Gate families.
    No secret values were printed or stored. Protected `AUD-19` evidence
    remains blocked until approved operator inputs are supplied. Evidence:
    `docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-19.md` and
    `docs/planning/v1-protected-input-readiness-dd1a1faf-2026-05-19-task.md`.

- [x] `PROTECTED-INPUT-READINESS-COMMAND-2026-05-19 feature: add reusable no-secret readiness command`
  - 2026-05-19: Added `corepack pnpm run ops:protected-inputs:check` and
    `corepack pnpm run ops:protected-inputs:check:test`. The command checks
    protected env-name families only, writes optional JSON/Markdown reports,
    and never prints or stores env values. It is included in the reusable audit
    tooling index and `audit:manifest:verify`. Evidence:
    `docs/planning/protected-input-readiness-command-2026-05-19-task.md`.

- [x] `DATA-MODEL-MIGRATIONS-AUDIT-2026-05-19 research: refresh AUD-07 data model/migrations`
  - 2026-05-19: Completed the `AUD-07` data model/migrations audit. Prisma
    schema validation passed, local migration status reported `54` migrations
    and schema up to date, full local migration replay applied all `54`
    migrations, schema diff generation passed, and isolated representative
    DB-backed tests passed for wallets (`1` file / `24` tests), backtests (`1`
    file / `15` tests), and runtime repository behavior (`1` file / `2`
    tests). Follow-up `corepack pnpm run audit:data:db-isolated` passed and now
    provides the canonical sequential reset-and-run path for representative
    DB-backed audit packs. No production database, production journey, LIVE
    mutation, exchange-side mutation, or existing production data mutation was
    performed.
    Evidence: `docs/operations/data-model-migrations-audit-2026-05-19.md` and
    `docs/planning/data-model-migrations-audit-2026-05-19-task.md`.

- [x] `WORKERS-RUNTIME-OPERATIONS-AUDIT-2026-05-19 research: refresh AUD-08 workers/runtime operations`
  - 2026-05-19: Completed the `AUD-08` workers/runtime operations audit. The
    focused API worker/runtime pack passed (`17` files / `85` tests). Coverage
    includes worker ownership/topology, protected worker health/readiness,
    runtime freshness pass/fail/skip behavior, global `/ready` diagnostics,
    market-stream source config, subscriptions, fanout and routes, exchange
    polling, Binance stream parsing, queue tuning, backtest job persistence,
    execution orchestration, and PAPER runtime-flow telemetry. Expected stderr
    appeared only in the intentional Redis-startup retry test. No production
    journey, LIVE mutation, exchange-side mutation, or existing production data
    mutation was performed. Evidence:
    `docs/operations/workers-runtime-operations-audit-2026-05-19.md` and
    `docs/planning/workers-runtime-operations-audit-2026-05-19-task.md`.

- [x] `ADMIN-SUBSCRIPTIONS-ENTITLEMENTS-AUDIT-2026-05-19 research: refresh AUD-18 admin/subscriptions`
  - 2026-05-19: Completed the `AUD-18` admin/subscriptions/entitlements audit.
    Focused Web admin/profile subscription tests passed (`4` files / `9`
    tests), and DB-backed API admin/subscriptions/entitlements tests passed
    (`5` files / `25` tests). Coverage includes admin-only access, user
    listing with subscription metadata, role/plan updates, self-demotion
    prevention, plan/entitlement validation, profile subscription readback, bot
    limit and LIVE trading gates, and Web admin/profile subscription states. No
    production journey, LIVE mutation, exchange-side mutation, existing
    production data mutation, or production entitlement mutation was performed.
    Evidence:
    `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.md` and
    `docs/planning/admin-subscriptions-entitlements-audit-2026-05-19-task.md`.

- [x] `LOGS-AUDIT-TRAIL-AUDIT-2026-05-19 research: refresh AUD-17 logs/audit trail`
  - 2026-05-19: Completed the `AUD-17` logs/audit-trail audit. Focused Web
    logs/audit tests passed (`2` files / `3` tests), and DB-backed API
    logs/pagination tests passed (`2` files / `5` tests). Coverage includes
    authenticated reads, owner scoping, source/actor/severity filters,
    pagination defaults/bounds, action-produced event visibility, metadata
    trace text rendering, and Web logs route states. No production journey,
    LIVE mutation, exchange-side mutation, or existing production data mutation
    was performed. Evidence:
    `docs/operations/logs-audit-trail-audit-2026-05-19.md` and
    `docs/planning/logs-audit-trail-audit-2026-05-19-task.md`.

- [x] `BACKTESTS-REPORTS-AUDIT-2026-05-19 research: refresh AUD-16 backtests/reports`
  - 2026-05-19: Completed the `AUD-16` backtests/reports audit. Focused Web
    backtest/report UI tests passed (`15` files / `37` tests), and DB-backed
    API backtests/reports tests passed (`13` files / `114` tests). Coverage
    includes run lifecycle, ownership, explicit range validation,
    queue/job/replay, fill model, data gateway, runtime-kernel parity,
    immutable snapshot behavior, pending/degraded report lifecycle,
    trades/report/timeline reads, cross-mode aggregation, and Web
    route/detail/report states. No production journey, LIVE mutation,
    exchange-side mutation, or existing production data mutation was performed.
    Evidence: `docs/operations/backtests-reports-audit-2026-05-19.md` and
    `docs/planning/backtests-reports-audit-2026-05-19-task.md`.

- [x] `MARKETS-STRATEGIES-CONFIGURATION-AUDIT-2026-05-19 research: refresh AUD-15 markets/strategies configuration`
  - 2026-05-19: Completed the `AUD-15` markets/strategies configuration
    audit. Focused Web market/strategy UI tests passed (`19` files / `60`
    tests), and DB-backed API markets/strategies tests passed (`4` files /
    `35` tests). Coverage includes market-universe composition, catalog
    behavior, market and strategy CRUD, ownership, active-bot guards, strategy
    import/export/config validation, inactive-bot edit allowance, active-bot
    lock UI, and indicator registry/presentation parity. No production
    journey, LIVE mutation, exchange-side mutation, or existing production data
    mutation was performed. Evidence:
    `docs/operations/markets-strategies-configuration-audit-2026-05-19.md` and
    `docs/planning/markets-strategies-configuration-audit-2026-05-19-task.md`.

- [x] `WALLETS-CAPITAL-LEDGER-AUDIT-2026-05-19 research: refresh AUD-14 wallets/capital ledger`
  - 2026-05-19: Completed the `AUD-14` wallets/capital-ledger audit. Focused
    Web wallet/ledger UI tests passed (`10` files / `23` tests), and
    DB-backed API wallets/capital tests passed (`7` files / `84` tests).
    Coverage includes wallet CRUD, ownership, PAPER/LIVE validation, API-key
    binding, balance preview, active-bot edit/delete/reset guards, paper reset
    checkpoint, wallet-first bot contract, runtime capital source truth,
    cashflow/equity ledger states, and partial/unavailable ledger UI. No
    production journey, LIVE mutation, exchange-side mutation, or existing
    production data mutation was performed. Evidence:
    `docs/operations/wallets-capital-ledger-audit-2026-05-19.md` and
    `docs/planning/wallets-capital-ledger-audit-2026-05-19-task.md`.

- [x] `POSITIONS-RECONCILIATION-AUDIT-2026-05-19 research: refresh AUD-13 positions/reconciliation`
  - 2026-05-19: Completed the `AUD-13` positions/reconciliation audit.
    Focused Web runtime-position tests passed (`6` files / `46` tests), and
    DB-backed API positions/reconciliation tests passed (`11` files / `68`
    tests). Coverage includes list/read ownership, live-status, exchange
    snapshot selection/normalization/fail-closed behavior, takeover/rebind,
    orphan repair, imported history hydration, reconciliation diagnostics,
    runtime position derivations, and close-state UI. No production journey,
    LIVE mutation, exchange-side mutation, or existing production data mutation
    was performed. Evidence:
    `docs/operations/positions-reconciliation-audit-2026-05-19.md` and
    `docs/planning/positions-reconciliation-audit-2026-05-19-task.md`.

- [x] `ORDERS-MANUAL-TRADING-AUDIT-2026-05-19 research: refresh AUD-12 orders/manual trading`
  - 2026-05-19: Completed the `AUD-12` orders/manual trading audit. Focused
    Web manual/open-order tests passed (`8` files / `46` tests), and
    DB-backed API order lifecycle tests passed (`10` files / `121` tests).
    Coverage includes manual-order context and selected-bot scope, PAPER
    lifecycle, ownership isolation, active-only filtering, fills, fees,
    exchange events, fail-closed exchange-backed cancel boundary, LIVE risk
    guards, quantity/position scope, and Dashboard Home manual/open-order
    action states. No production journey, LIVE mutation, exchange-side
    mutation, or existing production data mutation was performed. Evidence:
    `docs/operations/orders-manual-trading-audit-2026-05-19.md` and
    `docs/planning/orders-manual-trading-audit-2026-05-19-task.md`.

- [x] `ENGINE-TRADING-DECISION-FLOW-AUDIT-2026-05-19 research: refresh AUD-11 engine/trading flow`
  - 2026-05-19: Completed the `AUD-11` engine/trading decision-flow audit.
    Focused engine service/unit tests passed (`15` files / `173` tests), and
    DB-backed engine e2e/smoke tests passed (`4` files / `13` tests). Coverage
    includes deterministic signal merge, final-candle flow, signal loop,
    pre-trade/risk, execution orchestration, dedupe, exchange order guard,
    PAPER/LIVE parity, market-data gateway, position automation, PAPER runtime
    lifecycle, and owned imported-position execution. No production journey,
    LIVE mutation, exchange-side mutation, or existing production data mutation
    was performed. Evidence:
    `docs/operations/engine-trading-decision-flow-audit-2026-05-19.md` and
    `docs/planning/engine-trading-decision-flow-audit-2026-05-19-task.md`.

- [x] `BOTS-RUNTIME-TRUTH-AUDIT-2026-05-19 research: refresh AUD-10 bots/runtime truth`
  - 2026-05-19: Completed the `AUD-10` bots/runtime truth audit. Focused Web
    bot/dashboard runtime tests passed (`8` files / `61` tests), and
    DB-backed API bot/runtime tests passed (`10` files / `88` tests). Coverage
    includes CRUD/ownership, wallet-first writes, duplicate and entitlement
    guards, selected-bot runtime scope, monitoring aggregate truth, runtime
    history parity, takeover visibility, LIVE/PAPER isolation, and delete
    cleanup. No production journey, LIVE mutation, exchange-side mutation, or
    existing production data mutation was performed. Evidence:
    `docs/operations/bots-runtime-truth-audit-2026-05-19.md` and
    `docs/planning/bots-runtime-truth-audit-2026-05-19-task.md`.

- [x] `SECURITY-PRIVACY-AUDIT-2026-05-19 research: refresh AUD-06 security/privacy truth`
  - 2026-05-19: Completed the `AUD-06` security/privacy audit. Local focused
    auth/middleware/header API tests passed (`9` files / `32` tests),
    DB-backed auth/profile/API-key/isolation/abuse tests passed (`7` files /
    `47` tests), focused Web auth/profile/API-key tests passed (`7` files /
    `28` tests), and the public auth cache contract passed (`1` file / `2`
    tests). Local Postgres/Redis were stopped after the DB-backed proof. No
    production journey, LIVE mutation, exchange-side mutation, existing
    production data mutation, or raw-secret artifact was produced. Evidence:
    `docs/operations/security-privacy-audit-2026-05-19.md` and
    `docs/planning/security-privacy-audit-2026-05-19-task.md`.

- [x] `ARCHITECTURE-EXCHANGE-SCOPE-WORDING-AUDIT-2026-05-19 research: prove exchange-scope doc drift`
  - 2026-05-19: Completed the `AUD-01`/`AUD-ARCH-001` architecture wording
    audit and then applied accepted `DEC-AUD-001`: current implementation scope
    is Binance + Gate.io, not Binance-only, while production/live readiness is
    evidence-bound by exact exchange, market type, and operation. Evidence:
    `docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.md`
    and
    `docs/planning/architecture-exchange-scope-wording-audit-2026-05-19-task.md`.

- [x] `EXCHANGE-CAPABILITY-TRUTH-AUDIT-2026-05-19 research: prove exchange capability truth`
  - 2026-05-19: Completed the `AUD-09` exchange capability truth audit. API
    exchange capability/registry/boundary tests passed (`4` files / `21`
    tests), and Web exchange capability tests passed (`2` files / `3` tests).
    Follow-up repair now represents exact operation support as
    `(exchange, marketType, operation)` in API execution/authenticated-read
    contracts and consumers; focused exact contract tests and API typecheck
    passed. No production journey, LIVE mutation, exchange-side mutation, or
    existing production data mutation was performed. Evidence:
    `docs/operations/exchange-capability-truth-audit-2026-05-19.md` and
    `docs/planning/exchange-capability-truth-audit-2026-05-19-task.md`.

- [x] `AUD09-NEUTRAL-EXCHANGE-TYPE-ALIASES-2026-05-19 refactor: close exchange type naming debt`
  - 2026-05-19: Closed `AUD-EXCH-007` by adding neutral exchange-owned type
    aliases and updating non-exchange orders/wallet consumers away from
    CCXT-named connector types. Validation PASS: API typecheck and focused
    orders/wallet classifier tests (`2` files / `41` tests) after local infra
    startup. Evidence:
    `docs/planning/aud09-neutral-exchange-type-aliases-2026-05-19-task.md`.

- [x] `AI-ASSISTANT-RUNTIME-TRUTH-AUDIT-2026-05-19 research: prove assistant runtime truth`
  - 2026-05-19: Completed the `AUD-20` assistant/AI audit. Deterministic
    assistant foundation is proven locally: backend orchestrator tests passed
    (`2` files / `6` tests), focused Web assistant route tests passed (`2`
    files / `3` tests), and bot assistant config/dry-run API e2e passed after
    local Postgres/Redis startup (`1` file / `3` tests). The architecture
    overclaim remains open: no audited BACKTEST/PAPER/LIVE hot-path runtime
    call site to `orchestrateAssistantDecision` was found, and no full
    `AI_TESTING_PROTOCOL.md` multi-turn red-team proof exists. No production
    journey, LIVE mutation, exchange-side mutation, or existing production data
    mutation was performed. Evidence:
    `docs/operations/ai-assistant-runtime-truth-audit-2026-05-19.md` and
    `docs/planning/ai-assistant-runtime-truth-audit-2026-05-19-task.md`.

- [x] `API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19 research: add endpoint-level API docs parity`
  - 2026-05-19: Added reusable endpoint-level docs parity command
    `pnpm run docs:parity:endpoints:api`. Follow-up docs gap closure added
    root/ops endpoint docs and missing route mentions for bots, orders,
    positions, and wallets. Current run is `PASS`: `109` Express endpoints,
    `109` documented, `0` gaps. Existing module-level docs parity still passes
    (`API 22/22`, `Web 16/16`, `Routes 38/38`). No runtime behavior,
    production journey, LIVE mutation, or exchange-side mutation was
    performed. Evidence:
    `docs/operations/api-endpoint-docs-parity-2026-05-19/api-endpoint-docs-parity-2026-05-19.md`
    and `docs/planning/api-endpoint-docs-parity-audit-2026-05-19-task.md`.

- [x] `AUTHENTICATED-ROUTE-STATE-AUDIT-2026-05-19 research: prove local authenticated Web routes`
  - 2026-05-19: Closed the main `AUD-04`/local `AUD-05` gap from the previous
    baseline. Started local API/Web against seeded admin data, logged in
    through the Browser plugin, and audited canonical public/auth/dashboard/
    admin plus legacy route states. Result: `53` route checks, `53` PASS,
    `0` CHECK, `0` console warning/error routes, and `6` screenshots. No
    production journey, LIVE mutation, exchange-side mutation, or existing
    production data mutation was performed. Evidence:
    `docs/analysis/audit-baseline-2026-05-19.md`,
    `docs/operations/route-state-audit-2026-05-19/route-state-audit-2026-05-19.md`,
    and `docs/planning/authenticated-route-state-audit-2026-05-19-task.md`.

- [x] `FULL-LAYERED-AUDIT-RUN-2026-05-18 research: execute reusable audits locally`
  - 2026-05-18: Continued the reusable audit work into a broad local run.
    Current evidence now includes generated project index PASS (`PASS:21`,
    tests indexed `335`), static scan PASS (`0` findings), guardrails PASS,
    docs parity PASS, typecheck PASS, lint PASS, build PASS, full Web Vitest
    PASS (`149` files / `514` tests), route-reachable i18n PASS (`0`
    findings), focused API layer packs PASS, full API Vitest PASS after local
    Postgres/Redis were available, go-live smoke PASS (API `45/45`, Web
    `18/18`), and representative Browser route-state proof PASS/PARTIAL for
    `/`, `/auth/login`, and unauthenticated `/dashboard` redirect on desktop
    and mobile with `0` console warnings/errors. No production journey, LIVE
    mutation, exchange-side mutation, or existing production data mutation was
    performed. Evidence: `docs/analysis/audit-baseline-2026-05-18.md` and
    `docs/planning/full-layered-audit-run-2026-05-18-task.md`.

- [x] `REUSABLE-AUDIT-REGISTRY-2026-05-18 research: define reusable cross-layer audits`
  - 2026-05-18: Created the reusable audit system with stable `AUD-00` through
    `AUD-23` IDs and a current baseline. Covered audit families include project
    index/static scan, architecture, requirements, backend API, Web routes,
    UX/UI/a11y, security, data model, workers, exchange, bots, engine/runtime,
    orders, positions, wallets, markets/strategies, backtests/reports, logs,
    admin/subscriptions, operations, AI assistant, mobile, i18n, and
    documentation/traceability. Today-run evidence: project index PASS
    (`PASS:21`, tests indexed `335`), static scan PASS (`0` findings),
    guardrails PASS, docs parity PASS, typecheck PASS, lint PASS, and build
    PASS.
    Evidence: `docs/analysis/reusable-audit-registry.md`,
    `docs/analysis/audit-baseline-2026-05-18.md`, and
    `docs/planning/reusable-audit-registry-2026-05-18-task.md`.

- [x] `PROJECT-ARCHITECTURE-CODE-DISCREPANCY-AUDIT-2026-05-17 research: audit architecture-code drift`
  - 2026-05-17: Completed an architecture-vs-code discrepancy baseline. Static
    scan rerun passed with `0` findings and dashboard route inventory matches
    the canonical route map. Protected diagnostics, worker topology, bot market
    scope constraints, Prisma lifecycle shape, and exchange SDK ownership are
    broadly aligned in inspected code. Open drift is recorded as assistant
    runtime overclaim and stale exchange-scope wording in older architecture
    overview/domain docs; exchange capability granularity was repaired on
    2026-05-19 with exact `(exchange, marketType, operation)` support. Evidence:
    `docs/analysis/architecture-code-discrepancy-audit-2026-05-17.md` and
    `docs/planning/project-architecture-code-discrepancy-audit-2026-05-17-task.md`.

- [x] `PROJECT-COMPLETE-ANALYSIS-INDEX-2026-05-14 research: classify every project audit lane`
  - 2026-05-14: Expanded the audit thread from V1 scorecard confidence into a
    complete-analysis index. The index classifies root gates, Web/API tests,
    go-live smoke, static scan, Web route inventory, API route inventory,
    mobile scaffold, assistant/AI runtime, LIVE mutation, Gate.io/second-LIVE,
    and existing production data mutation. Active marker scan found no
    `.skip(`, no `.only(`, and no implementation `TODO/FIXME/HACK` markers
    outside the static scanner rule definitions. Mobile is scaffold-only by
    documented design; assistant runtime is locally tested for deterministic
    fail-closed mechanics but still needs full `AI_TESTING_PROTOCOL.md`
    multi-turn red-team proof before any complete AI-behavior claim. Evidence:
    `docs/operations/project-complete-analysis-index-2026-05-14.md`.

- [x] `PROJECT-FULL-SCAN-BASELINE-2026-05-14 research: generate full-project audit baseline`
  - 2026-05-14: Generated current project index and static scan for the
    audit/indexing thread, then refreshed broad local validation. Results:
    V1 matrix `PASS:21`, static findings `0`, tests indexed `335`,
    guardrails PASS, typecheck PASS, lint PASS, full Web Vitest PASS
    (`149` files / `514` tests), full API Vitest PASS, build PASS, and
    go-live smoke PASS (API `45/45`, Web `18/18`). No code change, deploy,
    production mutation, LIVE order/cancel/close, exchange-side mutation, or
    existing production data mutation was performed. Evidence:
    `docs/planning/project-full-scan-baseline-2026-05-14-task.md`,
    `docs/operations/project-full-scan-index-2026-05-14.md`, and
    `docs/operations/project-full-static-scan-2026-05-14.md`.

- [x] `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14 fix: preserve immutable backtest context snapshots`
  - 2026-05-14: New backtest runs persist immutable creation-time strategy and
    market-universe context snapshots; backtest list/timeline/replay prefer
    snapshot strategy truth before mutable strategy records; strategy and
    market-universe deletion now fail closed with `409` while owned backtest
    history references those records. Focused API e2e passed for backtests,
    strategies, and markets (`44/44`). No deploy, production mutation, LIVE
    order/cancel/close, or exchange-side mutation was performed. Evidence:
    `docs/planning/post-v1-strategy-snapshot-history-2026-05-14-task.md`.

- [x] `POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14 test: verify inactive linked strategy edits`
  - 2026-05-14: Verified strategy edit Web/API parity for the suspected
    inactive PAPER linked-bot path. The Web edit page now has submit proof for
    the backend-allowed update path and active-bot lock recovery proof with
    bot-settings navigation. Focused validation passed: Web edit page `3/3`,
    Web strategies suite `14` files / `48` tests, API strategies e2e `11/11`.
    No deploy, production mutation, LIVE order/cancel/close, or exchange-side
    mutation was performed. Evidence:
    `docs/planning/post-v1-inactive-paper-strategy-edit-proof-2026-05-14-task.md`.

- [x] `POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14 fix: harden common crypto icon fallback model`
  - 2026-05-14: Crypto icon lookup now derives CoinGecko ID hints and curated
    URLs from one shared catalog instead of two drifting maps. A focused API
    e2e basket proof forces CoinGecko `503` and verifies common trading assets
    including `TRX`, `LINK`, `ZEC`, `SAND`, and `MANA` resolve to curated
    icons rather than generic placeholders. No deploy, production data
    mutation, LIVE order/cancel/close, or exchange-side mutation was performed.
    Evidence:
    `docs/planning/post-v1-crypto-icon-consistency-2026-05-14-task.md`.

- [x] `V1-POST-V1-LEDGER-RECONCILIATION-2026-05-14 release: reconcile stale proof ledger rows`
  - 2026-05-14: Reconciled stale Profile, Profile API Keys, Wallets, Markets,
    Strategies, Logs/Audit Trail, and Subscriptions/Admin rows with accepted
    production fixture/UI proof. Current module confidence is `VERIFIED:22`,
    `PARTIAL:0`, `IMPLEMENTED_NOT_VERIFIED:0`, `BROKEN:0`, `BLOCKED:0`; risk
    count is `closed:18`, `mitigating:8`. No deploy, production mutation, LIVE
    order/cancel/close, unsafe LIVE position mutation, existing-data mutation,
    or broader Gate.io/second-LIVE proof was performed. Evidence:
    `docs/planning/v1-post-v1-ledger-reconciliation-2026-05-14-task.md`.

- [x] `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14 fix: harden bot cleanup and wallet reset guard`
  - 2026-05-14: Bot deletion now removes bot-owned runtime/trading artifacts
    in one transaction while preserving the strategy, and PAPER wallet reset
    now fails closed with `409` while an active bot uses the wallet. No
    production data, LIVE order/cancel/close, or exchange-side mutation was
    performed. Validation: API typecheck PASS, Bots delete cleanup e2e `1/1`
    PASS, Bots e2e `26/26` PASS, Wallets e2e `24/24` PASS, build PASS.
    Deployed `1586f59261cef94d7c513d71bbfcfb697d11ca59`; build-info wait
    passed on attempt 22 and public deploy smoke passed. Evidence:
    `docs/planning/v1-post-v1-wallet-bot-cleanup-hardening-2026-05-14-task.md`.

- [x] `POSTV1-OPERATOR-FEEDBACK-INTAKE-2026-05-14 planning: index operator feedback follow-up missions`
  - 2026-05-14: Indexed the remaining post-V1 feedback into bounded follow-up
    missions for Dashboard truth/layout/loading, inactive PAPER strategy edit
    reproduction, strategy/market snapshot history, Analytics Reports/Logs UX,
    Strategy Builder previews, crypto icon consistency, table affordances, and
    positions-service decomposition. Evidence:
    `docs/planning/post-v1-bot-wallet-dashboard-cleanup-2026-05-14-task.md`.

- [x] `V1-POST-V1-DASHBOARD-RUNTIME-LEDGER-CLOSURE-2026-05-14 release: close stale Dashboard Home and Bot Runtime proof rows`
  - 2026-05-14: Closed stale `SOAR-DASHBOARD-001` and
    `SOAR-BOT-RUNTIME-001` `PARTIAL` rows using existing local proof plus
    production route/runtime readbacks for the approved non-Gate.io V1/post-V1
    scope. `RISK-002` and `RISK-003` are closed. Its original count readback is
    superseded by the later ledger reconciliation: current module confidence is
    `VERIFIED:22` and `PARTIAL:0`; current risk count is `closed:18` and
    `mitigating:8`. Gate.io/second-LIVE production shape remains separate.
    Evidence:
    `docs/planning/v1-post-v1-dashboard-runtime-ledger-closure-2026-05-14-task.md`.

- [x] `V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14 release: deploy logout invalidation and rerun production Auth proof`
  - 2026-05-14: Deployed fixed commit `84711599` to `origin/main`, waited for
    production build-info to match on attempt 32, and reran
    `pnpm run ops:prod-auth:proof`. PASS: no-session redirect, valid-session
    dashboard render, invalid-token `session=expired` redirect, logout `200`,
    stale pre-logout token `/auth/me` `401`, and post-logout dashboard
    redirect. `SOAR-AUTH-001` is promoted to `VERIFIED`, and `RISK-004` is
    closed. Evidence:
    `docs/planning/v1-post-v1-auth-deploy-rerun-2026-05-14-task.md` and
    `docs/operations/prod-auth-session-browser-proof-84711599-2026-05-14.md`.

- [x] `V1-POST-V1-AUTH-LOGOUT-TOKEN-REUSE-HARDENING-2026-05-14 fix: invalidate reused JWT sessions on logout`
  - 2026-05-14: Production auth browser/API proof on deployed `2fc90a08`
    found a real replay gap: direct reuse of the pre-logout JWT still returned
    `/auth/me` `200` after logout. Browser route checks passed. Local fix
    reuses existing `sessionVersion` invalidation on logout; focused
    Auth/middleware tests passed (`21/21`) and API typecheck passed. Production
    rerun later passed on deployed `84711599`; this task is superseded by
    `V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14`. Evidence:
    `docs/planning/v1-post-v1-auth-logout-token-reuse-hardening-2026-05-14-task.md`
    and `docs/operations/prod-auth-session-browser-proof-2fc90a08-2026-05-14.md`.

- [x] `V1-POST-V1-RELEASE-CONFIDENCE-ROW-CLOSURE-2026-05-14 release: close stale release-confidence proof-map row`
  - 2026-05-14: Closed obsolete `SOAR-REL-001` uncertainty after confirming the
    final V1 master ledger, project index, completion scorecard, evidence
    inventory, and 100 percent truth audit provide the module-by-module proof
    map. This removes the final `IMPLEMENTED_NOT_VERIFIED` module-confidence
    row while preserving unrelated remaining `PARTIAL` rows and mitigating
    risks as post-V1 hardening candidates. No code, deploy, production
    mutation, LIVE order/cancel/close, or exchange-side mutation was performed.
    Evidence:
    `docs/planning/v1-post-v1-release-confidence-row-closure-2026-05-14-task.md`.

- [x] `V1-100-PERCENT-TRUTH-AUDIT-2026-05-14 release: answer whether V1 is truly 100%`
  - 2026-05-14: Verified the 100% claim by cross-checking the final scorecard,
    evidence inventory, active continuation state, module-confidence ledger,
    and risk register. PASS with scoped verdict: tracked V1 release acceptance
    is `YES` (`GO`, `PASS:21`, static findings `0`, implementation/evidence/
    release readiness `100%`, no next work order); absolute
    whole-app/every-function/every-live-action proof remains `NO` only because
    LIVE order submit/cancel/position close, exchange-side mutation,
    existing-data mutation, and broader 2x LIVE including Gate.io production
    proof were intentionally not performed. Its stale `PARTIAL:7` wording is
    superseded by the later ledger reconciliation. No deploy or production
    mutation was performed. Evidence:
    `docs/planning/v1-100-percent-truth-audit-2026-05-14-task.md` and
    `docs/operations/v1-100-percent-truth-audit-2026-05-14.md`.

- [x] `V1-FINAL-EVIDENCE-CONSISTENCY-READBACK-2026-05-14 release: verify final generated evidence consistency`
  - 2026-05-14: Machine-read final generated JSON artifacts and Markdown
    markers. PASS: scorecard `GO`, implementation/evidence/readiness `100%`,
    `PASS:21`, blocked modules `none`, concrete non-proof gaps `0`, no next
    work order, master ledger `GO`, static scan findings `0`, and project index
    V1 PASS rows `21`. No deploy or production mutation was performed.
    Evidence:
    `docs/planning/v1-final-evidence-consistency-readback-2026-05-14-task.md`.

- [x] `V1-ACTIVE-QUEUE-CLOSURE-AUDIT-2026-05-14 release: verify no active V1 completion work remains`
  - 2026-05-14: Verified active V1 continuation sources after final quality and
    go-live smoke checks. PASS: canonical final evidence files exist, active
    `.agents/state/next-steps.md` above the historical superseded section has
    no current NO-GO/BLOCKED completion signal, final scorecard readback is
    `GO` / `100%` / blocked modules `none`, and active task-board/next-commits
    unchecked-row scan found no open V1 completion row. Evidence:
    `docs/planning/v1-active-queue-closure-audit-2026-05-14-task.md`.

- [x] `V1-CURRENT-GO-LIVE-SMOKE-2026-05-14 qa: verify current worktree go-live smoke`
  - 2026-05-14: Verified the current worktree go-live smoke path. The first
    attempt ran DB-backed smoke/API packs in parallel and produced false
    Backtests/Strategies failures from shared DB cleanup interference. Rerun
    sequentially: `pnpm run test:go-live:web` PASS (`18/18`),
    `pnpm run test:go-live:api` PASS (`44/44`), and
    `pnpm run test:go-live:smoke` PASS (API `44/44`, Web `18/18`). No deploy
    or production mutation was performed. Evidence:
    `docs/planning/v1-current-go-live-smoke-2026-05-14-task.md`.

- [x] `V1-CURRENT-WORKTREE-FULL-REGRESSION-2026-05-14 qa: verify current worktree lint and full API/Web tests`
  - 2026-05-14: Refreshed current full local regression after the final V1
    evidence, handoff, inventory, and sanity updates. PASS: `pnpm run lint`,
    full Web Vitest (`149` files / `512` tests), and full API Vitest. This is
    local regression confidence only; no deploy or production mutation was
    performed. Evidence:
    `docs/planning/v1-current-worktree-full-regression-2026-05-14-task.md`.

- [x] `V1-CURRENT-WORKTREE-SANITY-2026-05-14 qa: verify current worktree typecheck, build, and guardrails`
  - 2026-05-14: Refreshed current worktree sanity after the final V1 evidence,
    handoff, and inventory updates. PASS: `pnpm run typecheck`,
    `pnpm run build`, and `pnpm run quality:guardrails`. This is local
    code/build confidence only; no deploy or production mutation was performed.
    Evidence:
    `docs/planning/v1-current-worktree-sanity-2026-05-14-task.md`.

- [x] `V1-FINAL-EVIDENCE-INVENTORY-2026-05-14 release: publish final V1 evidence inventory`
  - 2026-05-14: Published the final V1 evidence inventory and safe
    version-control guidance. It names the canonical V1 proof pack, records the
    LIVE mutation approval boundary, warns against blind staging of the large
    proof-artifact working tree, and clarifies that docs-only commits do not
    imply a fresh production build-info. Evidence:
    `docs/planning/v1-final-evidence-inventory-2026-05-14-task.md` and
    `docs/operations/v1-final-evidence-inventory-2026-05-14.md`.

- [x] `V1-FINAL-HANDOFF-PACKET-2026-05-14 release: publish final V1 handoff packet`
  - 2026-05-14: Published the final V1 handoff packet after the tracked V1
    evidence model reached `GO`. The packet records current source of truth,
    final evidence links, validations, residual risks, explicit LIVE mutation
    approval boundary, and resume instructions. Evidence:
    `docs/planning/v1-final-handoff-packet-2026-05-14-task.md` and
    `docs/operations/v1-final-handoff-packet-2026-05-14.md`.

- [x] `V1-POST-RELEASE-FRESHNESS-MEMORY-SYNC-2026-05-14 release: clarify final V1 GO continuation memory`
  - 2026-05-14: Verified the final V1 scorecard remains the active continuation
    truth (`GO`, `PASS:21`, static findings `0`, implementation/evidence/
    readiness `100%`) and cleaned active `.agents/state/next-steps.md` wording
    so superseded protected-auth, Docker, and preactivation blockers are not
    presented as current next actions. Older `NO-GO` / `BLOCKED` entries remain
    retained below an explicit historical superseded evidence heading. Evidence:
    `docs/planning/v1-post-release-freshness-memory-sync-2026-05-14-task.md`.

- [x] `V1-PRODUCTION-UX-A11Y-MOBILE-PROOF-2FC90A08-2026-05-14 release: prove UX/A11y/Mobile on production`
  - 2026-05-14: Added and ran `scripts/runProdUxA11yMobileProof.mjs` plus the
    production UI route/module audit against deployed `2fc90a08`. PASS:
    authenticated production route/module audit, desktop Dashboard/Wallets/
    Bots/Profile CDP screenshots, mobile Dashboard screenshot, mobile menu
    click, keyboard focus, no framework overlay, no horizontal overflow, and
    no production data mutation. Focused Web UX/header/dashboard tests passed
    (`33/33`). Final generated state is `GO` with `PASS:21`, static findings
    `0`, implementation estimate `100%`, evidence coverage `100%`, and release
    readiness `100%`. Evidence:
    `docs/planning/v1-production-ux-a11y-mobile-proof-2fc90a08-2026-05-14-task.md`,
    `docs/operations/prod-ui-module-clickthrough-2fc90a08-2026-05-14.md`, and
    `docs/operations/prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14.md`.

- [x] `V1-PRODUCTION-POSITIONS-PROOF-2FC90A08-2026-05-14 release: prove Positions on production`
  - 2026-05-14: Added and ran `scripts/runProdPositionsProof.mjs` against
    deployed `2fc90a08`. PASS: build-info freshness, unauthenticated Positions
    fail-closed access, active PAPER runtime candidate selection, PAPER-only
    position open/read, management-mode update/restore, manual TP/SL update,
    live-status read, takeover-status read, exchange-snapshot boundary, runtime
    close fail-closed without `riskAck`, runtime close with `riskAck`, closed
    position readback, and OPEN-list cleanup. No LIVE order/cancel/close, LIVE
    position mutation, exchange-side mutation, or raw secret artifact capture
    was performed. Focused Positions API tests passed (`46/46`). Evidence:
    `docs/planning/v1-production-positions-proof-2fc90a08-2026-05-14-task.md`
    and `docs/operations/prod-positions-proof-2fc90a08-2026-05-14.md`.

- [x] `V1-PRODUCTION-SECURITY-EXCHANGE-PROOF-2FC90A08-2026-05-14 release: prove Security/Privacy and Exchange Adapter on production`
  - 2026-05-14: Added and ran `scripts/runProdSecurityExchangeProof.mjs`
    against deployed `2fc90a08`. PASS: build-info freshness, security headers,
    public readiness, unauthenticated protected/ops/metrics fail-closed checks,
    authenticated no-store profile read, API-key list redaction, untrusted
    Origin controlled `403`, unsupported exchange probe fail-closed behavior,
    Binance futures catalog read-only data, Gate.io futures catalog canonical
    symbols, and authenticated readiness details. No LIVE order/cancel/close,
    position mutation, exchange-side mutation, or raw secret artifact capture
    was performed. Focused market/exchange API tests passed (`22/22`).
    Evidence:
    `docs/planning/v1-production-security-exchange-proof-2fc90a08-2026-05-14-task.md`
    and `docs/operations/prod-security-exchange-proof-2fc90a08-2026-05-14.md`.

- [x] `V1-PRODUCTION-FIXTURE-BACKTESTS-REPORTS-PROOF-457BCE05-2026-05-14 release: prove Backtests and Reports with a disposable run`
  - 2026-05-14: Extended `scripts/runProdFixtureActionProof.mjs` and reran the
    approved disposable production fixture proof against deployed `457bce05`.
    PASS: disposable backtest run create/readback, per-run report readback,
    trades readback, timeline readback with `49` candles, and delete cleanup.
    No LIVE order/cancel/close, exchange-side mutation, unsafe position
    mutation, or existing-data mutation was performed. Regenerated V1 reports
    later advanced after the Security/Exchange and Positions proofs to
    `PASS:20`, `PASS_LOCAL:1`, static findings `0`, and scorecard `NO-GO` at
    `99.7% / 98.8% / 98.1%`. Evidence:
    `docs/planning/v1-production-fixture-backtests-reports-proof-457bce05-2026-05-14-task.md`
    and `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`.

- [x] `V1-PRODUCTION-FIXTURE-PAPER-ORDER-PROOF-457BCE05-2026-05-14 release: prove Manual Orders and Orders with a disposable PAPER order`
  - 2026-05-14: Extended `scripts/runProdFixtureActionProof.mjs` and reran the
    approved disposable production fixture proof against deployed `457bce05`.
    PASS: manual order context read, disposable PAPER limit order open/readback,
    cancel fail-closed without `riskAck`, cancel with `riskAck`, terminal
    canceled order readback, and terminal cleanup as audit/history. The proof
    kept LIVE orders/cancels/closes, exchange-side mutation, and unsafe
    position mutation out of scope. Regenerated V1 reports now show `PASS:15`,
    `PASS_LOCAL:6`, static findings `0`, and scorecard `NO-GO` at `97.5% /
    91.1% / 86.1%`. Evidence:
    `docs/planning/v1-production-fixture-paper-order-proof-457bce05-2026-05-14-task.md`
    and `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`.

- [x] `V1-PRODUCTION-FIXTURE-LOW-RISK-ACTION-PROOF-457BCE05-2026-05-14 release: run low-risk disposable production action proof`
  - 2026-05-14: Extended `scripts/runProdFixtureActionProof.mjs` and ran the
    approved disposable production fixture proof against deployed `457bce05`.
    PASS: build-info matched, auth resolved, Profile read/update/restore,
    API-key create/masked probe/audit/delete, Wallet create/update/read/delete,
    Market universe create/update/catalog/delete, Strategy create/export/update/delete,
    inactive PAPER Bot create/read/update/runtime-graph/market-group/strategy-link/
    assistant-config/delete, and audit log readback all passed. Cleanup passed
    for every created fixture. Regenerated V1 reports now show `PASS:13`,
    `PASS_LOCAL:8`, static findings `0`, and scorecard `NO-GO` at `96.3% /
    87.1% / 79.8%`. Evidence:
    `docs/planning/v1-production-fixture-low-risk-action-proof-457bce05-2026-05-14-task.md`
    and `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`.

- [x] `V1-PRODUCTION-FIXTURE-ACTION-PROOF-PLAN-2026-05-14 release: define safe production fixture action proof boundary`
  - 2026-05-14: Published the safe owner-approval boundary for the remaining
    literal-100% production action proofs. The plan allows future disposable
    fixture create/edit/delete proofs only after explicit owner approval,
    restricts money-adjacent actions to PAPER unless separately approved,
    requires cleanup verification, and forbids raw secret artifact capture.
    No production data was mutated. Evidence:
    `docs/planning/v1-production-fixture-action-proof-plan-2026-05-14-task.md`
    and `docs/operations/v1-production-fixture-action-proof-plan-2026-05-14.md`.

- [x] `V1-BACK-WEB-FULL-LOCAL-BASELINE-457BCE05-2026-05-14 qa: verify full local backend and web baseline`
  - 2026-05-14: After the protected ops checkpoint and controlled LIVE
    readback, refreshed the broad local backend/web confidence baseline without
    production mutation. PASS: `pnpm run quality:guardrails`,
    `pnpm run typecheck`, full Web Vitest (`149` files / `512` tests), full API
    Vitest, `pnpm run lint`, `pnpm run build`, and `git diff --check`
    (line-ending warnings only). Evidence:
    `docs/planning/v1-back-web-full-local-baseline-457bce05-2026-05-14-task.md`.
    This confirms the implemented API/Web layers are locally green, but does
    not replace remaining production-only release evidence.

- [x] `V1-COOLIFY-REDEPLOY-457BCE05-2026-05-14 release: retrigger production Coolify deploy and prove build-info`
  - 2026-05-14: Production build-info later advanced to
    `457bce05338310c198c03a973395a9176f298dc1` and public production smoke
    passed for the deployed surface. Protected runtime freshness and rollback
    guard checks failed closed with HTTP `401` without approved admin/ops
    credentials. Evidence:
    `docs/operations/deploy-freshness-457bce05-2026-05-14.md`.

- [x] `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14 release: rerun protected runtime freshness, rollback guard, and target release gate`
  - Scope: `457bce05` is deployed and public-smoke healthy. Use approved
    admin/ops credentials or local token source to rerun protected runtime
    freshness, alerts/rollback guard, and the target release gate for
    `457bce05` without recording secrets in repository artifacts.
  - 2026-05-14 checkpoint: protected auth is now available for this session
    and the gate is `READY`. Build-info matches
    `457bce05338310c198c03a973395a9176f298dc1`, public API/Web smoke passes,
    protected runtime freshness passes, rollback proof passes with
    `shouldRollback=false` and no alerts, and authenticated production UI
    clickthrough passes. A controlled no-order-guard LIVE proof then produced
    `LIVEIMPORT-03` PASS for the target bot's runtime-visible `TRXUSDT` symbol
    and the controlled runner deactivated the LIVE bot in cleanup. Activation
    audit/plan, RC external gates, RC sign-off, RC checklist, rollback proof,
    UI clickthrough, public smoke, protected smoke, runtime freshness, and
    rollback guard are now fresh/pass for 2026-05-14. Production
    backup/restore drill also passed through `DOCKER_HOST=ssh://codex-vps`
    against the VPS Postgres container. Final preflight is ready and the full
    non-dry-run production release gate reports `Readiness: ready` with
    repository guardrails, typecheck, build, go-live smoke, deploy smoke,
    runtime freshness, and rollback guard all passing.
    Evidence:
    `docs/planning/v1-protected-ops-gate-457bce05-2026-05-14-task.md`,
    `docs/operations/v1-final-preflight-457bce05-2026-05-14-ready.md`,
    `docs/operations/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md`,
    `docs/operations/v1-production-activation-evidence-audit-2026-05-14.md`,
    `docs/planning/v1-production-activation-and-evidence-plan-2026-05-14.md`,
    `docs/operations/v1-rollback-proof-prod-2026-05-14T01-00-18-225Z.md`,
    `docs/operations/liveimport-03-prod-readback-2026-05-14.json`,
    `docs/operations/prod-ui-module-clickthrough-457bce05-2026-05-14.md`,
    and `docs/operations/v1-restore-drill-prod-2026-05-14T00-00-00-000Z.md`.

- [x] `V1-CURRENT-MAIN-PROMOTION-DEPLOY-LAG-457BCE05-2026-05-14 release: promote current candidate and record deploy lag`
  - Scope: pushed `origin/codex/v1-proof-and-ops-evidence`, fast-forwarded
    `origin/main` to `457bce05338310c198c03a973395a9176f298dc1`, checked
    production build-info, and recorded that production initially still served
    `00169d7fdc3aff8317759137b05594b20e773c8e`. Later build-info freshness
    passed for `457bce05`, and public production smoke passed for that
    deployed surface. Evidence:
    `docs/planning/v1-current-main-promotion-deploy-lag-457bce05-2026-05-14-task.md`,
    `docs/operations/deploy-lag-457bce05-2026-05-14.md`.

- [x] `V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13 fix: route runtime derivatives through exchange adapter`
  - Scope: routed runtime symbol-stats fallback derivatives and live signal
    market-data gateway funding/open-interest/order-book supplemental reads
    through the Exchange public adapter for non-Binance exchanges. Binance REST
    paths remain Binance-scoped, unsupported adapter capabilities fail closed,
    and derivative fallback caches are exchange-scoped. Evidence:
    `docs/planning/v1-runtime-non-binance-derivatives-adapter-2026-05-13-task.md`;
    focused runtime tests passed (`26/26`), API typecheck passed, and
    guardrails passed.

- [x] `V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13 fix: read non-Binance backtest funding/OI through exchange adapter`
  - Scope: added Exchange public connector boundaries for funding-rate
    history, open-interest history, and order-book snapshots; normalized those
    CCXT public derivatives payloads; and routed non-Binance futures backtest
    supplemental funding/open-interest history through the Exchange adapter.
    Backtest order-book history remains empty rather than using current
    snapshots as historical data. Evidence:
    `docs/planning/v1-non-binance-backtest-derivatives-adapter-2026-05-13-task.md`;
    focused API tests passed (`26/26`) and API typecheck passed.

- [x] `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13 fix: route runtime ticker fallback through exchange adapter`
  - Scope: moved generic runtime fallback ticker prices onto the Exchange
    public market-data boundary for Binance and non-Binance exchanges, removed
    the Binance-only fallback-price restriction from runtime position readback,
    and surfaced resolved backtest `exchange / marketType / baseCurrency` in
    the Web details header. Evidence:
    `docs/planning/v1-runtime-ticker-and-backtest-venue-ui-2026-05-13-task.md`;
    focused runtime fallback/PnL tests passed (`36/36`), Backtest details Web
    test passed (`4/4`), API typecheck passed, and Web typecheck passed.

- [x] `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13 fix: scope bot/backtest market data by exchange adapter`
  - Scope: audited bot runtime candle fallback, backtest candle loading,
    backtest run/timeline replay, market candle DB cache ownership, and Web
    backtest timeline types against the architecture's exact
    `(exchange, marketType)` contract. Backtest candles and runtime fallback
    candles now use the Exchange public market-data boundary instead of direct
    Binance candle REST; run jobs and timelines carry resolved exchange
    context; market candle cache uniqueness now includes `source`; Web
    backtest timeline types include backend exchange/order-book/parity fields.
    Binance-only derivative supplemental fallbacks remain explicit and fail
    closed for non-Binance exchanges. Evidence:
    `docs/planning/v1-bot-backtest-exchange-adapter-audit-2026-05-13-task.md`;
    focused backtest/bot runtime tests passed (`56/56`), API typecheck passed,
    and Web typecheck passed.

- [x] `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13 fix: align runtime market-data warmup with Exchange adapter boundary`
  - Scope: removed the Engine runtime candle warmup shortcut to Binance public
    REST by routing indicator recovery through the exchange-owned public
    market-data boundary. Runtime candle and derivatives stores are now scoped
    by exchange as well as market/symbol/interval, strategy evaluation and
    runtime read-model fallbacks receive exchange context, and Binance-only
    derivative fallbacks fail closed for non-Binance exchanges instead of
    borrowing Binance data. Evidence:
    `docs/planning/v1-runtime-exchange-adapter-boundary-2026-05-13-task.md`;
    focused runtime/decision-loop tests passed (`55/55`), exchange/stream/
    fallback/read-model tests passed (`12/12`), API typecheck passed, and
    guardrails passed. Production multi-bot/live evidence remains a separate
    partial proof lane.

- [x] `V1-NON-GATEIO-RUNTIME-AND-APP-PROOF-00169D7F-2026-05-13 release: verify current non-Gate.io runtime and app proof`
  - Scope: Gate.io was explicitly deferred by the user for this slice. Ran
    authenticated read-only production runtime readback for the approved
    account without production writes, activation, live orders, close-position
    commands, or exchange mutation. Result `PARTIAL_BINANCE_LIVE_INACTIVE`:
    both active Binance PAPER bots expose fresh RUNNING runtime monitoring
    data through sessions, symbol stats, positions, trades, and aggregate
    endpoints; the Binance LIVE bot exists with live opt-in but is currently
    inactive and has no RUNNING session. Local validation passed: focused
    Web runtime tests (`41/41`), focused API runtime/monitoring tests
    (`47/47` and `29/29`), typecheck, build, guardrails, `test:go-live:web`,
    `test:go-live:api`, and `test:go-live:smoke`. Evidence:
    `docs/planning/v1-non-gateio-runtime-and-app-proof-00169d7f-2026-05-13-task.md`,
    `docs/operations/prod-non-gateio-runtime-readback-00169d7f-2026-05-13.md`.

- [x] `V1-PRODUCTION-RUNTIME-INVENTORY-00169D7F-2026-05-13 qa: capture production runtime inventory for multi-bot proof`
  - Scope: ran authenticated read-only production bot/session inventory for
    the approved account. Result `PARTIAL`: production has 2 active PAPER bots
    and 1 inactive LIVE Binance futures bot; no visible LIVE Gate.io bot and
    fewer than 2 active LIVE bots, so production cannot yet prove the requested
    2x PAPER + 2x LIVE shape. No production writes, activation, or live orders
    were attempted; artifact secret scan passed. Evidence:
    `docs/planning/v1-production-runtime-inventory-00169d7f-2026-05-13-task.md`,
    `docs/operations/prod-runtime-inventory-00169d7f-2026-05-13.md`.

- [x] `V1-PRODUCTION-UI-CLICKTHROUGH-REFRESH-00169D7F-2026-05-13 qa: refresh authenticated production UI module clickthrough`
  - Scope: ran the no-secret production UI module route audit against deployed
    `00169d7fdc3aff8317759137b05594b20e773c8e` with approved application
    auth. Result `PASS`: public `PASS:4`, dashboard `PASS:18`, admin
    `PASS:3`, legacy `PASS:3`, blockers `none`; artifact scan found no raw
    credentials/tokens/cookies/private headers. Evidence:
    `docs/planning/v1-production-ui-clickthrough-refresh-00169d7f-2026-05-13-task.md`,
    `docs/operations/prod-ui-module-clickthrough-00169d7f-2026-05-13-enum-followup.md`.
    This is protected route reachability evidence, not a full action-level
    proof for every module.

- [x] `V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13 fix: reuse runtime enum aliases in Bots Monitoring props`
  - Scope: removed local duplicated fee/capital enum unions from
    `BotsMonitoringTab` props, reusing shared runtime aliases and
    `BotRuntimeTrade["origin"]` instead. Evidence:
    `docs/planning/v1-web-backend-function-parity-monitoring-props-2026-05-13-task.md`;
    focused `BotsManagement` test passed (`14/14`), Web typecheck passed,
    local duplicate-union scan returned no matches, and guardrails passed.

- [x] `V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13 fix: align Web runtime enum contracts with backend schema`
  - Scope: added backend-compatible Web runtime enum aliases for trading
    origin, position management mode, fee source, and runtime capital source;
    narrowed runtime trade payload typing away from free-form strings; reused
    aliases across position/open-order/capital summaries; and removed stale
    impossible enum fixture values from Dashboard Home and Bots monitoring
    tests. Evidence:
    `docs/planning/v1-web-backend-function-parity-runtime-enums-2026-05-13-task.md`;
    focused Web runtime tests passed (`5` files, `47` tests), Web typecheck
    passed, stale-value scan returned no matches, and guardrails passed.

- [x] `V1-WEB-BACKEND-PARITY-RUNTIME-ORIGIN-2026-05-13 fix: align runtime position origin labels`
  - Scope: aligned Web runtime position origin typing with backend
    `TradingRecordOrigin.USER` and mapped Dashboard Home edit-position origin
    labels so backend `USER` appears as Manual instead of Unknown; legacy
    `MANUAL` fixture compatibility remains. Evidence:
    `docs/planning/v1-web-backend-function-parity-runtime-origin-2026-05-13-task.md`;
    focused Web test passed (`3/3`) and Web typecheck passed.

- [x] `V1-WEB-BACKEND-PARITY-DASHBOARD-2026-05-13 fix: close runtime trade/position Web API contract drift`
  - Scope: aligned Web runtime trade IDs with backend nullable
    `orderId`/`positionId`/`strategyId`, rendered missing monitoring IDs as
    `-`, added `openPositionQty` to Web positions summary typing, and filled
    empty aggregate payloads with `openPositionQty: 0` in API/Web fallback
    paths. Evidence: `docs/planning/v1-web-backend-function-parity-dashboard-home-2026-05-13-task.md`;
    Web focused tests passed (`2` files, `17` tests), API runtime monitoring
    aggregate e2e passed (`18/18`), API typecheck passed, and Web typecheck
    passed.

- [x] `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13 qa: prove simultaneous LIVE and PAPER bot behavior`
  - Scope: verify the user's concern directly after the V1 production target
    gate. One active LIVE bot and one active PAPER bot must remain separated by
    wallet/mode/symbol scope, both must appear correctly in operator surfaces,
    runtime reads must stay selected-bot scoped, PAPER must not inherit LIVE
    exchange/import state, LIVE imported positions must not block or pollute
    PAPER decisions, and the shared strategy/merge contract must preserve
    PAPER/LIVE parity where only the execution adapter differs.
  - 2026-05-13 checkpoint: verified local DB-backed API/runtime proof for two
    active PAPER bots plus active Binance LIVE and Gate.io LIVE bots. Runtime
    position reads stay isolated by mode, wallet, API key, exchange, and market
    type. Venue-scoped LIVE overlap, Gate.io-safe runtime market-data fallback,
    duplicate guard regression, runtime PnL parity, typecheck, and focused Web
    Dashboard tests passed. A rendered Dashboard Home regression now proves the
    four-bot selector and selected wallet/runtime row re-scope. At that
    checkpoint, the remaining lane was production-safe authenticated
    UI/runtime clickthrough and real live multi-bot operation evidence.
  - 2026-05-14 refresh after deployed `457bce05`: production build-info passed
    for `457bce05`; focused API LIVE/PAPER tests passed (`25/25`); focused Web
    Dashboard tests passed (`24/24`). A controlled no-order-guard production
    LIVE proof activated the existing Binance LIVE bot only for the observation
    window, verified `LIVEIMPORT-03` for `TRXUSDT`, collected a simultaneous
    read-only runtime snapshot where the Binance LIVE bot and both Binance
    PAPER bots were RUNNING, then deactivated the LIVE bot. Post-cleanup
    readback confirmed the Binance LIVE bot was inactive again while both
    PAPER bots remained healthy. Evidence:
    `docs/planning/v1-live-paper-simultaneous-runtime-proof-refresh-457bce05-2026-05-14-task.md`.
    Runtime artifacts:
    `docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`,
    `docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`,
    and
    `docs/operations/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`.
    Status is closed for the current production non-Gate.io simultaneous
    LIVE/PAPER runtime scope; the unavailable/deferred second LIVE/Gate.io
    shape is not hidden.

- [x] `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13 release: close production target V1 gate`
  - Scope: completed final controlled `LIVEIMPORT-03` proof for the target
    bot's real runtime-visible managed symbol `TRXUSDT`; final preflight now
    has no blockers. The full release gate passed guardrails, typecheck, and
    build, then stopped only because local Docker Desktop was unavailable for
    `test:go-live:smoke`. The production target-only release gate passed with
    `Readiness: ready` after build-info freshness, post-deploy smoke, runtime
    freshness, and rollback guard all passed. Evidence:
    `docs/planning/v1-target-release-gate-pass-00169d7f-2026-05-13-task.md`,
    `docs/operations/v1-release-gate-prod-2026-05-13Ttarget-only-v1-gate.md`.

- [x] `V1-CONTROLLED-LIVE-PROOF-ATTEMPT-00169D7F-2026-05-13 release: run approved controlled LIVE proof`
  - Scope: ran the controlled LIVE proof after explicit user live-risk
    approval. A runner partial-update defect was found and fixed so toggling
    `isActive` preserves LIVE consent/import fields. Production bot
    configuration was restored to inactive LIVE/import-capable state. The proof
    ultimately passed for `TRXUSDT`, the real managed symbol visible in the
    target bot's runtime readback, and cleanup deactivated the bot. Evidence:
    `docs/planning/v1-controlled-live-proof-attempt-00169d7f-2026-05-13-task.md`.

- [x] `V1-CONTROLLED-LIVE-PROOF-PREACTIVATION-00169D7F-2026-05-13 release: verify controlled LIVE proof preactivation gates`
  - Scope: ran the controlled LIVE proof runner through dry-run and
    preactivation only. Build-info matched, no-order guard is fully active,
    and the target LIVE Binance futures bot is inactive and import-capable.
    The runner refused activation because `--i-understand-live-risk` was not
    provided. No LIVE activation or order action occurred. Evidence:
    `docs/planning/v1-controlled-live-proof-preactivation-00169d7f-2026-05-13-task.md`.
    V1 remains `NO-GO` pending explicit live-risk approval or an acceptance
    contract decision.

- [x] `V1-PROD-RESTORE-AND-LIVEIMPORT-TRUTH-00169D7F-2026-05-13 release: refresh production restore and expose LIVEIMPORT truth`
  - Scope: refreshed production backup/restore drill evidence through the
    Coolify PostgreSQL resource terminal and generated canonical LIVEIMPORT
    evidence for final-gate discovery. Restore drill is fresh `PASS`.
    LIVEIMPORT is fresh `failed` because auth works and one LIVE Binance
    futures bot exists, but no running session exists (`NO_RUNNING_SESSION`).
    Final preflight now has one blocker:
    `evidence:liveImportReadback:failed`. Evidence:
    `docs/planning/v1-prod-restore-and-liveimport-truth-00169d7f-2026-05-13-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-PROTECTED-PROOF-REDUCTION-00169D7F-2026-05-13 release: reduce protected V1 blockers with approved app auth`
  - Scope: used user-approved production application credentials only through
    local environment variables to run authenticated production UI clickthrough,
    rollback proof, LIVEIMPORT readback, and final preflight. UI clickthrough
    is fresh `PASS`; rollback proof is fresh `PASS`; LIVEIMPORT auth succeeds
    and finds one LIVE Binance futures bot, but no running session exists, so
    `LIVEIMPORT-03` remains unverified. Final preflight is still `blocked` on
    production DB restore context, missing LIVEIMPORT runtime readback, and
    stale backup/restore drill evidence. Evidence:
    `docs/planning/v1-protected-proof-reduction-00169d7f-2026-05-13-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-GATE4-PATRYK-SIGNOFF-2026-05-13 release: apply Patryk Gate 4 RC sign-off`
  - Scope: applied the user's instruction to use `Patryk` for required Gate 4
    approver/owner fields. RC sign-off now reports `APPROVED`, and final
    preflight reports RC evidence as fresh. Remaining V1 blockers are
    technical protected proof: production auth, DB restore context,
    `LIVEIMPORT-03`, authenticated production UI clickthrough, DB restore
    evidence, and rollback proof. Evidence:
    `docs/planning/v1-gate4-patryk-signoff-2026-05-13-task.md`.

- [x] `V1-GENERATED-STATE-REFRESH-AFTER-RC-ACTIVATION-2026-05-13 release: refresh generated V1 state after activation and RC evidence`
  - Scope: reran the V1 generated-state chain after current activation and RC
    artifact refresh. Generated state remains `NO-GO`: `PASS_LOCAL:20`,
    `BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`),
    scorecard `86.8%` implementation, `61.3%` evidence coverage, and `42.4%`
    release readiness. Evidence:
    `docs/planning/v1-generated-state-refresh-after-rc-activation-2026-05-13-task.md`.

- [x] `V1-RC-CURRENT-BLOCKED-REFRESH-2026-05-13 release: refresh RC artifacts to current blocked truth`
  - Scope: refreshed RC external gates status, RC sign-off, and RC checklist
    artifacts for 2026-05-13. Final preflight now classifies RC evidence as
    current `failed`/`BLOCKED` rather than stale because Gate 4 approver fields
    are still missing. Evidence:
    `docs/planning/v1-rc-current-blocked-refresh-2026-05-13-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-13 release: refresh current activation audit and plan truth`
  - Scope: published current 2026-05-13 production activation audit and
    activation evidence plan artifacts as explicit `NO-GO` truth. Release gate
    dry-run and final preflight now classify activation audit/plan as fresh,
    but V1 remains blocked on missing protected auth, missing DB restore
    context, stale RC/backup-restore/rollback evidence, missing
    `LIVEIMPORT-03`, and failed production UI clickthrough. Evidence:
    `docs/planning/v1-production-activation-refresh-2026-05-13-task.md`.

- [x] `V1-GENERATED-STATE-REFRESH-AFTER-OPERATOR-PACKET-00169D7F-2026-05-13 release: refresh generated V1 state after operator packet`
  - Scope: reran the V1 generated-state chain after publishing the current-day
    operator packet. Generated state remains `NO-GO`: `PASS_LOCAL:20`,
    `BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`),
    scorecard `86.8%` implementation, `61.3%` evidence coverage, and `42.4%`
    release readiness. Evidence:
    `docs/planning/v1-generated-state-refresh-after-operator-packet-00169d7f-2026-05-13-task.md`.

- [x] `V1-OPERATOR-PACKET-CURRENT-DAY-REFRESH-00169D7F-2026-05-13 release: refresh operator unblock packet for current evidence`
  - Scope: published the current no-secret V1 operator unblock packet for the
    2026-05-13 evidence set. The packet references current final preflight,
    protected input readiness, and production UI audit artifacts, lists
    required protected inputs and Gate 4 approver fields, and keeps V1
    explicitly `NO-GO` until the final release gate returns `ready`. Evidence:
    `docs/planning/v1-operator-packet-current-day-refresh-00169d7f-2026-05-13-task.md`
    and `docs/operations/v1-operator-unblock-packet-00169d7f-2026-05-13.md`.

- [x] `V1-GENERATED-STATE-REFRESH-AFTER-CURRENT-DAY-BLOCKER-00169D7F-2026-05-13 release: refresh generated V1 state after current blocker evidence`
  - Scope: refreshed the V1 project index, static issue scan, master state
    ledger, and completion scorecard for 2026-05-13 after the current-day
    blocker refresh. Generated state remains `NO-GO`: `PASS_LOCAL:20`,
    `BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`),
    scorecard `86.8%` implementation, `61.3%` evidence coverage, and `42.4%`
    release readiness. Evidence:
    `docs/planning/v1-generated-state-refresh-after-current-day-blocker-00169d7f-2026-05-13-task.md`.

- [x] `V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13 release: refresh current-day no-secret V1 blockers`
  - Scope: refreshed deployed build-info, protected input readiness, final
    preflight, and production UI clickthrough blocker evidence for 2026-05-13.
    Build-info and public smoke pass for
    `00169d7fdc3aff8317759137b05594b20e773c8e`, but final preflight remains
    `blocked` on missing protected auth/DB context, stale daily release
    artifacts, missing `LIVEIMPORT-03`, current failed production UI
    clickthrough, and stale rollback proof. Evidence:
    `docs/planning/v1-current-day-blocker-refresh-00169d7f-2026-05-13-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-GENERATED-STATE-REFRESH-AFTER-QUEUE-HYGIENE-00169D7F-2026-05-12 release: refresh V1 generated state after queue cleanup`
  - Scope: refreshed `project-index`, `v1-static-issue-scan`, `v1-master-state-ledger`,
    and `v1-completion-scorecard` after stale queue-marker supersessions.
    Generated state remains `NO-GO`: `PASS_LOCAL:20`, `BLOCKED_AUTH:1`,
    static findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard `86.8%`
    implementation, `61.3%` evidence coverage, and `42.4%` release readiness.
    Static scan now reports `2 protected/auth queue blockers remain open`,
    matching `CONTROLLED-LIVE-SESSION-PROOF` and `LIVEIMPORT-03`. Evidence:
    `docs/planning/v1-generated-state-refresh-after-queue-hygiene-00169d7f-2026-05-12-task.md`.

- [x] `PROD-UI-AUDIT-PLAN-SUPERSEDE-00169D7F-2026-05-12 qa: close stale broad UI audit plan`
  - Scope: closed the historical unchecked `PROD-UI-AUDIT-PLAN-2026-05-08`
    queue item as superseded by the current V1 release-gate UI evidence lane:
    `ops:ui:prod-clickthrough` with approved `PROD_UI_AUDIT_*` dashboard/admin
    auth. This does not mark production UI proof verified; the final gate still
    requires a fresh PASS `prod-ui-module-clickthrough-*` artifact. Evidence:
    `docs/planning/prod-ui-audit-plan-supersede-00169d7f-2026-05-12-task.md`.
    V1 remains `NO-GO`.

- [x] `BOTMULTI-09-CONTAINMENT-SUPERSEDE-00169D7F-2026-05-12 release: close contained production promotion marker`
  - Scope: closed the historical unchecked `BOTMULTI-09` production promotion
    marker because its candidate is already contained in the deployed V1 line,
    and the remaining proof is the shared protected runtime readback/final gate
    lane. This does not mark multi-strategy runtime production proof verified;
    it removes a duplicate promotion marker. Evidence:
    `docs/planning/botmulti-09-containment-supersede-00169d7f-2026-05-12-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-PROTECTED-ACCESS-READINESS-SUPERSEDE-00169D7F-2026-05-12 release: close stale protected readiness queue entry`
  - Scope: closed the historical unchecked
    `V1-PROTECTED-ACCESS-READINESS-2026-05-09` queue item as superseded by the
    current `00169d7f` operator packet and protected input readiness sweep.
    This does not unblock V1; it removes a duplicate old queue marker so the
    remaining open tasks represent the actual protected evidence lanes.
    Evidence:
    `docs/planning/v1-protected-access-readiness-supersede-00169d7f-2026-05-12-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12 release: refresh current protected input sweep`
  - Scope: refreshed the no-secret protected input readiness sweep for the
    current Codex shell and confirmed no matching environment variable names
    were present for `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
    `PROD_UI_AUDIT_*`, `PROD_UI_*`, `SOAR_PROD_*`, production DB check, RC, or
    Gate families. No secret values were printed or stored. Evidence:
    `docs/planning/v1-protected-input-readiness-current-sweep-00169d7f-2026-05-12-task.md`
    and
    `docs/operations/v1-protected-input-readiness-00169d7f-2026-05-12.md`.
    V1 remains `NO-GO`.

- [x] `V1-UI-BLOCKER-TRUTH-SYNC-00169D7F-2026-05-12 release: align current UI blocker wording`
  - Scope: aligned active source-of-truth wording after the current production
    UI blocked refresh so `PROJECT_STATE` and `next-steps` describe the UI
    blocker as current `prodUiClickthrough:failed` evidence from 2026-05-12,
    not stale evidence from 2026-05-10. Evidence:
    `docs/planning/v1-ui-blocker-truth-sync-00169d7f-2026-05-12-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-PROD-UI-CURRENT-BLOCKED-REFRESH-00169D7F-2026-05-12 release: refresh current production UI blocked evidence`
  - Scope: captured a current no-auth production UI clickthrough audit for
    deployed `00169d7f`: build-info matched, public routes passed, and
    dashboard/admin/legacy protected routes failed closed to `/auth/login`.
    Updated release-gate artifact discovery so matched evidence date is
    prioritized before filename fallback, then refreshed final preflight so it
    reports `prodUiClickthrough:failed` for the current 2026-05-12 artifact.
    Evidence:
    `docs/planning/v1-prod-ui-current-blocked-refresh-00169d7f-2026-05-12-task.md`,
    `docs/operations/prod-ui-module-clickthrough-00169d7f-2026-05-12.md`,
    and `docs/operations/v1-final-preflight-00169d7f-2026-05-12.md`.
    Validation passed: release gate tests (`13/13`), release-gate syntax
    check, guardrails, and diff check. V1 remains `NO-GO`.

- [x] `V1-OPERATOR-PACKET-UI-ADMIN-AUTH-SYNC-2026-05-12 release: require admin auth in production UI handoff`
  - Scope: aligned the active V1 operator packet with final preflight so the
    default production UI clickthrough requires both dashboard
    `PROD_UI_AUDIT_AUTH_*` and admin `PROD_UI_AUDIT_ADMIN_*` auth. Admin auth
    is required because `ops:ui:prod-clickthrough` includes admin routes by
    default. Evidence:
    `docs/planning/v1-operator-packet-ui-admin-auth-sync-2026-05-12-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-GENERATED-STATE-REFRESH-AFTER-UI-GATE-2026-05-12 release: refresh generated V1 reports after UI gate hardening`
  - Scope: refreshed the V1 project index, static scan, master ledger, and
    completion scorecard after production UI evidence hardening and the
    no-secret preflight update. Generated state remains unchanged in release
    substance: `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static findings `3`
    (`P0:1`, `P1:1`, `P2:1`), scorecard `86.8%` implementation, `61.3%`
    evidence coverage, and `42.4%` release readiness. Evidence:
    `docs/planning/v1-generated-state-refresh-after-ui-gate-2026-05-12-task.md`.
    V1 remains `NO-GO`.

- [x] `V1-RELEASE-GATE-PROD-UI-EVIDENCE-HARDENING-2026-05-12 release: enforce production UI clickthrough in final gate`
  - Scope: updated `scripts/runV1ReleaseGate.mjs` so production readiness now
    requires a fresh PASS `prod-ui-module-clickthrough-*` artifact with
    authenticated Bots UI coverage for `/dashboard/bots` and
    `/dashboard/bots/create`. Updated final preflight so missing
    `PROD_UI_AUDIT_*` dashboard/admin auth and missing/failed UI clickthrough
    evidence produce stable blockers and remediation hints. Evidence:
    `docs/planning/v1-release-gate-prod-ui-evidence-hardening-2026-05-12-task.md`.
    Validation passed: release gate tests (`12/12`), final preflight tests
    (`14/14`), script syntax checks, no-secret production preflight for
    deployed `00169d7f` with expected `BLOCKED`, guardrails, and diff check.
    V1 remains `NO-GO` until approved protected inputs produce fresh PASS
    artifacts and the final gate is rerun.

- [x] `V1-PROD-UI-INPUT-UNBLOCK-SYNC-00169D7F-2026-05-12 release: add production UI audit inputs to operator packet`
  - Scope: synchronized the current V1 operator unblock packet with the
    remaining P1 Bots production-safe clickthrough blocker. The packet now
    lists `PROD_UI_AUDIT_*` auth inputs, includes
    `pnpm run ops:ui:prod-clickthrough` before the final release gate, and
    states that public route reachability or unauthenticated redirects do not
    satisfy V1 UI evidence. Evidence:
    `docs/planning/v1-prod-ui-input-unblock-sync-00169d7f-2026-05-12-task.md`
    and
    `docs/operations/v1-operator-unblock-packet-00169d7f-2026-05-12.md`.
    V1 remains `NO-GO` until approved UI audit auth produces a PASS artifact
    plus the protected Operations evidence and final gate are ready.

- [x] `V1-PROTECTED-QUEUE-DEDUPE-2026-05-12 release: dedupe protected queue blocker reporting`
  - Scope: updated `scripts/runV1StaticIssueScan.mjs` so protected/auth queue
    blockers are deduped by task text across `TASK_BOARD` and
    `mvp-next-commits`, while all source locations remain in evidence.
    Refreshed scan still reports `3` findings (`P0:1`, `P1:1`, `P2:1`), but
    the P2 blocker now reflects `5` unique protected/auth tasks instead of
    `10` duplicated queue markers. V1 remains `NO-GO`.

- [x] `V1-CAPABILITY-GATE-SCAN-CLASSIFICATION-2026-05-12 release: classify approved exchange capability gates`
  - Scope: updated `scripts/runV1StaticIssueScan.mjs` so
    contract-approved exchange capability gates (`ExchangeNotImplementedError`
    boundaries and unsupported/placeholder exchange i18n copy) are skipped as
    accepted static-scan findings. Refreshed scan findings dropped from `32`
    to `3` (`P0:1`, `P1:1`, `P2:1`), leaving Operations `BLOCKED_AUTH`, Bots
    production-safe clickthrough, and protected queue blockers. V1 remains
    `NO-GO`.

- [x] `V1-MANUAL-PAYMENT-METADATA-CLEANUP-2026-05-12 fix: remove placeholder wording from manual payment metadata`
  - Scope: changed manual payment checkout metadata from placeholder wording
    to explicit operator-review wording without changing checkout behavior.
    Focused subscription checkout proof passed (`8/8`). Refreshed V1 static
    scan findings dropped from `33` to `32` (`P0:1`, `P1:1`, `P2:30`), and
    the `source-marker` category is gone. V1 remains `NO-GO` on protected
    production proof and Operations `BLOCKED_AUTH`.

- [x] `V1-QUEUE-NONE-MARKER-CLEANUP-2026-05-12 release: remove false unchecked none markers`
  - Scope: converted old `IN_PROGRESS` and `REVIEW` placeholder rows from
    unchecked `(none)` checkboxes to plain `None.` text, then refreshed the V1
    generator chain. Static findings dropped from `34` to `33`
    (`P0:1`, `P1:1`, `P2:31`), and the master ledger no longer reports the
    `toCleanPlanning` queue-hygiene bucket. V1 remains `NO-GO` on protected
    production proof and Operations `BLOCKED_AUTH`.

- [x] `V1-CURRENT-STATE-DRIFT-CLEANUP-2026-05-12 release: clean current V1 blocker wording`
  - Scope: reran the V1 generator chain and cleaned active queue/state wording
    that still described the final non-dry-run production gate as not yet run
    or rollback proof as stale. Generated state remains `NO-GO` with
    `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static findings `34` (`P0:1`,
    `P1:1`, `P2:32`), scorecard `86.8% / 61.3% / 42.4%`. Current truth: the
    final non-dry-run gate ran and stopped `not_ready`; rollback proof is
    fresh but failed on protected `401`.

- [x] `V1-PROTECTED-INPUT-READINESS-REFRESH-00169D7F-2026-05-12 release: refresh protected input readiness`
  - Scope: checked only environment variable names for
    `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, `PROD_UI_*`, and
    `SOAR_PROD_*` in the current Codex execution session; no matching names
    were present and no secret values were printed. Added
    `docs/operations/v1-protected-input-readiness-00169d7f-2026-05-12.md`
    and corrected the operator packet to state that the final non-dry-run
    production gate already ran and stopped `not_ready` on protected
    `/workers/health` `401`. V1 remains `NO-GO`; the next exact action is
    still the operator packet with approved protected inputs and real Gate 4
    approver fields.

- [x] `V1-STATIC-SCAN-QUEUE-BLOCKER-CLASSIFICATION-2026-05-12 ops: classify protected queue blockers`
  - Scope: updated `scripts/runV1StaticIssueScan.mjs` so known protected/auth
    queue blockers remain open but are classified as `queue-blocked` instead
    of unclassified local queue drift. Script syntax check, V1 generator
    refresh, and repository guardrails passed. The 2026-05-12 static scan now
    reports `34` findings (`P0:1`, `P1:1`, `P2:32`), and
    `concreteNonProofGaps` is `0`. V1 remains `NO-GO`.

- [x] `V1-STATIC-SCAN-LEGACY-ROUTE-CLASSIFICATION-2026-05-12 ops: classify approved legacy web routes`
  - Scope: updated `scripts/runV1StaticIssueScan.mjs` so approved
    `/dashboard/orders` and `/dashboard/positions` legacy redirects plus
    runtime-owned Orders/Positions web feature shells are not reported as
    missing active pages. Script syntax check, V1 generator refresh, and
    repository guardrails passed. The 2026-05-12 static scan now reports `34`
    findings (`P0:1`, `P1:2`, `P2:31`), with concrete non-proof gaps reduced
    to `1`. V1 remains `NO-GO`.

- [x] `V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12 docs: align subscriptions billing boundary`
  - Scope: updated `docs/modules/api-subscriptions.md` to state the V1 billing
    boundary: checkout intent creation and admin/profile subscription state
    are in scope, while provider webhook reconciliation remains future billing
    lifecycle scope. V1 generator refresh passed and repository guardrails
    passed. The 2026-05-12 static scan no longer reports
    `DOC_PLACEHOLDER_DOCS_MODULES_API_SUBSCRIPTIONS_MD`; findings are now
    `38` (`P0:1`, `P1:6`, `P2:31`). V1 remains `NO-GO`.

- [x] `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12 docs: align web Orders/Positions module truth`
  - Scope: updated `docs/modules/web-orders.md` and
    `docs/modules/web-positions.md` to match the canonical route map:
    `/dashboard/orders` and `/dashboard/positions` remain legacy redirects to
    Bot Runtime, while runtime Orders/Positions UX is owned by Dashboard Home
    and Bot Runtime. Middleware redirect tests passed (`3/3`), V1 generator
    refresh passed, and repository guardrails passed. The 2026-05-12 static
    scan no longer reports the two web Orders/Positions documented-placeholder
    gaps; findings are now `39` (`P0:1`, `P1:6`, `P2:32`). V1 remains
    `NO-GO`.

- [x] `V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12 test: add focused subscriptions module coverage`
  - Scope: added direct focused coverage in
    `apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts`
    for invalid entitlement fallback and FREE-plan LIVE trading fail-closed
    behavior. Focused Vitest passed (`2/2`), API typecheck passed, V1
    project-index/static-scan/master-ledger/scorecard refresh passed, and
    repository guardrails passed. The 2026-05-12 static scan no longer reports
    `API_MODULE_NO_TESTS_SUBSCRIPTIONS`; findings are now `41`
    (`P0:1`, `P1:8`, `P2:32`). V1 remains `NO-GO`.

- [x] `V1-RELEASE-GATE-NONDRYRUN-BLOCKED-2026-05-12 release: run production release gate until protected blocker`
  - Scope: ran the production release gate without `--dry-run` and with local
    quality skipped. Build-info freshness passed for
    `00169d7fdc3aff8317759137b05594b20e773c8e`; public API `/health`, API
    `/ready`, and Web `/` passed; deploy smoke failed on protected
    `/workers/health` `401`. Evidence:
    `docs/planning/v1-release-gate-nondryrun-blocked-2026-05-12-task.md` and
    `docs/operations/v1-release-gate-prod-2026-05-12Tnon-dry-run-blocked.md`.
    V1 remains `NO-GO`.

- [x] `V1-OPERATOR-UNBLOCK-PACKET-00169D7F-2026-05-12 release: publish current operator unblock packet`
  - Scope: published the current no-secret operator handoff for deployed
    build-info `00169d7fdc3aff8317759137b05594b20e773c8e`. The packet lists
    required protected auth/approver inputs and the command order for
    `LIVEIMPORT-03`, rollback proof PASS, RC Gate 4/sign-off/checklist, and
    final non-dry-run release gate. Evidence:
    `docs/planning/v1-operator-unblock-packet-00169d7f-2026-05-12-task.md`
    and `docs/operations/v1-operator-unblock-packet-00169d7f-2026-05-12.md`.
    V1 remains `NO-GO` until the packet is executed with approved inputs.

- [x] `V1-FINAL-PREFLIGHT-CURRENT-2026-05-12 release: refresh final no-secret preflight after current evidence updates`
  - Scope: ran no-secret final production preflight for deployed build-info
    `00169d7fdc3aff8317759137b05594b20e773c8e`. Build-info and public smoke
    passed, production DB restore context is satisfied, and preflight remains
    `blocked` on missing `LIVEIMPORT_READBACK_*`, missing `ROLLBACK_GUARD_*`,
    failed RC evidence, missing `LIVEIMPORT-03`, and failed rollback proof.
    Evidence: `docs/planning/v1-final-preflight-current-2026-05-12-task.md`
    and `docs/operations/v1-final-preflight-00169d7f-2026-05-12.md`.

- [x] `V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-12 release: refresh production rollback proof blocked evidence`
  - Scope: ran production rollback proof for 2026-05-12 without auth bypass.
    The proof is fresh but `FAIL`, with `shouldRollback:true` because protected
    runtime freshness and alerts endpoints returned `401`. Release gate dry-run
    now classifies rollback proof as `failed` instead of stale. Evidence:
    `docs/planning/v1-rollback-proof-blocked-refresh-2026-05-12-task.md` and
    `docs/operations/v1-release-gate-prod-2026-05-12Trollback-refresh-dry-run.md`.
    V1 remains `NO-GO` due missing LIVEIMPORT-03, failed rollback proof,
    missing Gate 4 approvers, protected prod auth blockers, and the latest
    non-dry-run gate result still being `not_ready`.

- [x] `V1-RC-BLOCKED-REFRESH-2026-05-12 release: refresh RC sign-off and checklist blocked truth`
  - Scope: rebuilt RC external gates status, RC sign-off, and the release-
    candidate checklist for 2026-05-12 without approver names. Gate 1/2/3 are
    `PASS`, Gate 4 remains `OPEN`, sign-off remains `BLOCKED`, and release
    gate dry-run now classifies RC artifacts as `failed` instead of stale.
    Evidence: `docs/planning/v1-rc-blocked-refresh-2026-05-12-task.md` and
    `docs/operations/v1-release-gate-prod-2026-05-12Trc-blocked-refresh-dry-run.md`.
    V1 remains `NO-GO` due missing LIVEIMPORT-03, failed rollback proof,
    missing Gate 4 approvers, and protected prod auth blockers.

- [x] `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-12 release: refresh production activation audit and plan truth`
  - Scope: published current-date production activation evidence audit and
    activation execution plan as explicit `NO-GO` artifacts, then ran the
    production release-gate dry-run to confirm activation audit/plan are
    classified as `fresh` for 2026-05-12. Evidence:
    `docs/planning/v1-production-activation-refresh-2026-05-12-task.md`,
    `docs/operations/v1-production-activation-evidence-audit-2026-05-12.md`,
    and `docs/operations/v1-release-gate-prod-2026-05-12Tactivation-refresh-dry-run.md`.
    V1 remains `NO-GO` due failed Gate 4/checklist, blocked sign-off, missing
    LIVEIMPORT-03, fresh-but-failed rollback proof, and protected prod auth
    blockers.

- [x] `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12 release: refresh production backup/restore drill evidence`
  - Scope: ran production Postgres isolated backup/restore drill over SSH/VPS
    Docker exec. The PASS run created a compressed dump, restored it into
    `postgres_restore_check_20260512152138`, validated aggregate counts
    (`Bot=6`, `Log=52740`, `Order=3981`, `Position=4787`, `User=4`), dropped
    the restore DB, removed the dump, and cleanup returned `0` restore DBs and
    `0` backup dumps. Release gate dry-run now classifies backup/restore drill
    evidence as `fresh` for 2026-05-12. Evidence:
    `docs/planning/v1-prod-restore-drill-refresh-task-2026-05-12.md` and
    `docs/operations/v1-restore-drill-prod-2026-05-12T15-21-38Z.md`. V1
    remains `NO-GO` due blocked sign-off, failed Gate 4/checklist, missing
    LIVEIMPORT-03, and fresh-but-failed rollback proof.

- [x] `V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12 release: collect production read-only Operations evidence`
  - Scope: ran production public no-worker deploy smoke (`PASS`), stage public
    no-worker deploy smoke (`503` failures), public production build-info/
    health/ready probes, VPS Docker read-only production service inventory,
    API container env-name-only inspection, and production V1 release gate.
    Evidence:
    `docs/planning/v1-operations-production-readonly-proof-task-2026-05-12.md`,
    `docs/operations/v1-release-gate-prod-2026-05-12Tprod-readonly.md`.
    Production public health is `PASS`, but the production release gate is
    `not_ready`: protected `/workers/health` returns `401` without approved
    app/operator auth, `LIVEIMPORT-03` prod readback is missing, RC Gate 4 is
    not approved, and activation/sign-off/backup-restore/rollback proof
    artifacts are stale for 2026-05-12. Operations remains `BLOCKED_AUTH`.

- [x] `V1-OPERATIONS-LOCAL-PROOF-2026-05-12 release: probe Operations release-safety evidence`
  - Scope: ran local rollback proof, short SLO collection/window report, local
    RC gate pipeline, local release gate, and local LIVEIMPORT-03 readback.
    Evidence covers local deploy smoke, runtime freshness, rollback guard,
    rollback proof, alert absence through rollback guard, SLO artifact
    generation, RC Gate 1/2/3 status, Gate 4 sign-off blocker, and liveimport
    readback blocker (`botsChecked:0`). Evidence:
    `docs/planning/v1-operations-local-proof-task-2026-05-12.md`. Operations
    remains `BLOCKED_AUTH`; final V1 release approval requires approved
    stage/prod credentials, production/stage rollback and SLO/release-gate
    evidence, backup/restore evidence, Gate 4 sign-off, and safe LIVE/import
    readback fixture.

- [x] `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12 test: prove Subscriptions/Admin local contracts`
  - Scope: ran focused API Subscriptions/Admin tests, focused Web admin/
    subscription tests, local protected admin route/clickthrough audit, and
    Edge/CDP browser proof for `/admin/subscriptions` and `/admin/users`.
    Evidence covers unauthenticated and non-admin rejection, admin plan catalog,
    price/entitlement update validation, invalid entitlement rejection, admin
    user list with active subscription metadata, role/plan update contracts,
    self-demotion blocking, admin UI loaded/error/action states, protected
    admin route rendering, and no framework overlay. Evidence:
    `docs/planning/v1-subscriptions-admin-local-proof-task-2026-05-12.md`.
    Subscriptions/Admin is now `PASS_LOCAL`; production admin clickthrough
    remains open.

- [x] `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11 test: prove UX/A11y/Mobile local contracts`
  - Scope: ran local authenticated route/clickthrough audit, focused Web
    UX/a11y/state tests, and Edge/CDP browser proof. Evidence covers public
    and dashboard route rendering/redirects, shared loading/empty/error/
    success states, form validation and invalid-field focus, responsive
    dashboard shell, desktop Dashboard empty/onboarding state, desktop Wallets
    empty state, mobile Dashboard/menu rendering, mobile menu focus/click
    interaction, route locale smoke, no framework overlay, and zero CDP
    console/exception events. Evidence:
    `docs/planning/v1-ux-a11y-mobile-local-proof-task-2026-05-11.md`.
    UX/A11y/Mobile is now `PASS_LOCAL`; production browser clickthrough and
    external accessibility review remain open.

- [x] `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11 test: prove Security/Privacy local contracts`
  - Scope: ran focused API Security/Privacy tests and Web Auth/Profile tests,
    and fixed test-only env restoration so JWT rotation and API-key encryption
    keyring variables do not leak between focused security files. Evidence
    covers security/no-store headers, alerts/metrics admin access, `/ready`
    secret/runtime diagnostics, API error redaction, crypto/keyring behavior,
    rate-limit degradation, ops-network/trusted-origin/auth middleware,
    critical secret readiness, Auth lifecycle/JWT/cookie/error contracts,
    ownership isolation, Profile API-key secrecy/probes, Profile security
    actions, stage abuse throttling, authenticated snapshots, and Web auth/
    profile guard states. Evidence:
    `docs/planning/v1-security-privacy-local-proof-task-2026-05-11.md`.
    Security/Privacy is now `PASS_LOCAL`; production-safe protected security
    proof and external/independent review remain open.

- [x] `V1-WORKERS-LOCAL-PROOF-2026-05-11 test: prove Workers local contracts`
  - Scope: ran focused API Workers/stream/runtime tests and fixed worker-
    adjacent e2e DB isolation for runtime sessions, symbol stats, signals,
    backtest runs, assistant/subagent configs, and market candle cache.
    Evidence covers worker ownership/topology, market-stream source config,
    subscriptions, fanout retry, route contracts/e2e, Exchange polling source/
    fanout, Binance stream parsing, protected worker health/readiness, runtime
    freshness pass/fail/skip behavior, protected `/ready` diagnostics, PAPER
    runtime-flow worker telemetry, execution orchestrator import handling,
    execution adapter parity, backtest run job persistence, and queue tuning.
    Evidence: `docs/planning/v1-workers-local-proof-task-2026-05-11.md`.
    Workers are now `PASS_LOCAL`; production-safe protected worker/process
    proof remains open.

- [x] `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11 test: prove Exchange Adapter local contracts`
  - Scope: fixed Gate.io public catalog symbol normalization at the exchange
    boundary and ran focused API Exchange plus Web Exchanges/Profile API-key
    tests. Evidence covers API-key probes, runtime exchange order guard,
    Binance public REST/user data stream, CCXT futures connector behavior,
    adapter boundary fail-closed support, adapter registry, authenticated read
    service/contracts, connector factory, execution capability contract,
    market catalog, metadata contract, public read/market data, symbol rules,
    live order adapter, live fee reconciliation, position exchange snapshot
    normalization, capability gating, `/dashboard/exchanges` redirect, profile
    API-key integration, connection tests, stored-key tests, and delete risk
    confirmation. Evidence:
    `docs/planning/v1-exchange-adapter-local-proof-task-2026-05-11.md`.
    Exchange Adapter is now `PASS_LOCAL`; production-safe exchange-boundary
    proof remains open and real live mutation remains blocked-risk without an
    explicit safe plan.

- [x] `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11 test: prove Logs/Audit Trail local contracts`
  - Scope: ran focused API Logs/pagination tests and Web Logs route/view/
    locale tests. Evidence covers unauthenticated rejection, owner-only log
    reads, source/actor/severity filters, action-produced audit event
    visibility, pagination defaults/bounds, `/dashboard/logs` route shell,
    empty/loaded states, severity filter request payload, metadata trace
    rendering, and route-reachable locale copy. Evidence:
    `docs/planning/v1-logs-audit-local-proof-task-2026-05-11.md`. Logs/Audit
    Trail is now `PASS_LOCAL`; production-safe browser clickthrough remains
    open.

- [x] `V1-REPORTS-LOCAL-PROOF-2026-05-11 test: prove Reports local contracts`
  - Scope: ran focused API Reports service tests and Web Reports route/view/
    locale tests. Evidence covers weighted BACKTEST report aggregation, PAPER
    trade aggregation, `/dashboard/reports` route shell, empty state,
    aggregated cards/tables, and route-reachable locale copy. Evidence:
    `docs/planning/v1-reports-local-proof-task-2026-05-11.md`. Reports is now
    `PASS_LOCAL`; production-safe browser clickthrough remains open and
    export/download is outside the current implemented Reports surface.

- [x] `V1-BACKTESTS-LOCAL-PROOF-2026-05-11 test: prove Backtests local contracts`
  - Scope: ran focused API Backtests tests and Web Backtests route/component/
    hook/utility tests. Evidence covers auth/ownership, create/list/get/delete,
    explicit range validation, enriched list fields, pending report contract,
    strategy-to-backtest-to-paper/live critical flow, paper/live parity with
    reconciliation, venue consistency, market-universe symbol formula,
    empty-symbol fail-closed behavior, 3-symbol paper alignment, failed parity
    diagnostics, run queue/job persistence, replay core, runtime kernel parity,
    contract remediation, data gateway, fill model, range service, indicator
    timeline series, list/create/detail route shells, create form, run details,
    list view, table actions, core-data hook, view-models, pair metrics, trade
    segments, and timeline overlays. Evidence:
    `docs/planning/v1-backtests-local-proof-task-2026-05-11.md`. Backtests is
    now `PASS_LOCAL`; production-safe browser clickthrough remains open.

- [x] `V1-ORDERS-LOCAL-PROOF-2026-05-11 test: prove Orders local contracts`
  - Scope: ran focused API Orders tests and Web Dashboard Home open-orders
    tests. Evidence covers active order filtering, PAPER/LIVE open contracts,
    missing price truth rejection, same-symbol add/reverse conflict handling,
    canonical bot context, LIVE pretrade/risk guards, exchange ids/status/
    fills/fees, execution error propagation, manual context rules, close
    attribution, stale/open exchange-backed cancel and close fail-closed
    behavior, API list/get ownership, exchange event open/close/DCA/account-
    update lifecycle, partial/underfilled/capped fill progress, fee pending/
    backfill, live fill resolution, quantity rules, position scope, live cancel
    boundary, source labels, active open-order cancel action, and terminal
    order read-only behavior. Evidence:
    `docs/planning/v1-orders-local-proof-task-2026-05-11.md`. Orders is now
    `PASS_LOCAL`; production-safe clickthrough remains open and live mutation
    remains blocked-risk without explicit safe plan.

- [x] `V1-POSITIONS-LOCAL-PROOF-2026-05-11 test: prove Positions local contracts`
  - Scope: ran focused API Positions/orders-position tests and Web runtime
    position tests. Evidence covers list/read ownership, symbol filter
    normalization, stale local exclusion, live status scoping, exchange
    snapshot selection/fail-closed behavior, authenticated snapshots, takeover
    classification/rebind, orphan repair, imported lifecycle history,
    reconciliation diagnostics, manual TP/SL safety, management-mode guards,
    runtime visibility, close flows, external DCA separation, carryover open
    orders, runtime PnL derivations/fallbacks, and ignored/closed/pending close
    UI states. Evidence:
    `docs/planning/v1-positions-local-proof-task-2026-05-11.md`. Positions is
    now `PASS_LOCAL`; production-safe clickthrough remains open and LIVE
    mutation remains blocked-risk without explicit safe plan.

- [x] `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11 test: prove Manual Orders local contracts`
  - Scope: ran focused API Manual Orders tests and Web Dashboard Home manual-
    order/open-orders tests. Evidence covers manual context, PAPER market
    truth, open/cancel/close endpoints, order/position ownership,
    selected-bot write/read scope, quantity rules, position scope, LIVE risk
    guards, exchange-backed fail-closed cancel behavior, live fill resolution,
    live cancel boundary, Dashboard Home submit, validation, context/venue/
    scope semantics, open-order source labels, open-order cancel actions, and
    submitted/waiting/ready/imported/position-opened/blocked states. Evidence:
    `docs/planning/v1-manual-orders-local-proof-task-2026-05-11.md`. Manual
    Orders is now `PASS_LOCAL`; production-safe clickthrough remains open and
    LIVE order actions remain blocked-risk without explicit safe plan.

- [x] `V1-STRATEGIES-LOCAL-PROOF-2026-05-11 test: prove Strategies local contracts`
  - Scope: ran focused API Strategies tests and Web Strategies route/form/list/
    preset/indicator/helper tests. Evidence covers CRUD, export/import,
    advanced TSL validation, invalid import rejection, ownership isolation,
    active-bot update/delete blocking, inactive bot update allowance, DCA
    reachability validation, indicator catalog behavior, clone payloads, route
    shells, form validation, tab flow, presets, indicators, form mapping,
    numeric normalization, close validation, presentation, and taxonomy.
    Evidence: `docs/planning/v1-strategies-local-proof-task-2026-05-11.md`.
    Strategies is now `PASS_LOCAL`; production-safe browser clickthrough and
    representative runtime/backtest compatibility proof remain open.

- [x] `V1-MARKETS-LOCAL-PROOF-2026-05-11 test: prove Markets local contracts`
  - Scope: ran focused API Markets e2e and Web Markets form/table/route
    tests. Evidence covers CRUD, normalization, canonical symbol composition,
    linked symbol-group sync, empty symbol sets, Binance/Gate.io catalog reads,
    placeholder persistence, not-implemented catalog responses, active-bot
    update/delete blocking, inactive bot edits, stale legacy link handling,
    ownership isolation, preview parity, placeholder submit, validation helper,
    table clone payload, and route shells. Evidence:
    `docs/planning/v1-markets-local-proof-task-2026-05-11.md`. Markets is now
    `PASS_LOCAL`; production-safe browser clickthrough remains open.

- [x] `V1-WALLETS-LOCAL-PROOF-2026-05-11 test: prove Wallets local contracts`
  - Scope: ran focused API Wallets tests and Web Wallets tests. Evidence
    covers CRUD, ownership isolation, active-bot edit/delete guards, LIVE
    key/allocation validation, preview allocation/fail-closed paths, paper
    reset guards, reset checkpoint preservation, cashflow classification,
    open-PnL scoping, list/create/edit/preview route wrappers, inline API-key
    state, clone payload, form validation, mode-specific fields, reset
    success/error, partial ledger, and unavailable ledger fail-closed UI.
    Evidence: `docs/planning/v1-wallets-local-proof-task-2026-05-11.md`.
    Wallets is now `PASS_LOCAL`; production-safe browser clickthrough remains
    open.

- [x] `V1-PROFILE-LOCAL-PROOF-2026-05-11 test: prove Profile local contracts`
  - Scope: added focused Web tests for Profile basic form submit success/error
    and password security success/error behavior, then ran existing API
    Profile basic/security e2e tests. Evidence covers timezone persistence and
    invalid timezone rejection, unauthenticated security rejection, valid-
    current-password changes, weak/invalid password rejection, old-login
    failure/new-login success, password-confirmed account deletion, Web save
    success/error toasts, timezone preference payload, password mismatch
    short-circuit, and password change feedback. Evidence:
    `docs/planning/v1-profile-local-proof-task-2026-05-11.md`. Profile is now
    `PASS_LOCAL`; production-safe browser clickthrough remains open.

- [x] `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11 test: prove Profile API Keys local contracts`
  - Scope: ran focused API key e2e, exchange probe service, Web API key form,
    and Web API key list tests. Evidence covers encrypted-only storage, masked
    responses, owner-only lifecycle actions, Binance/Gate.io probes, no
    persistence of provided test secrets, audit metadata without raw secrets,
    placeholder fail-closed probes, connection-test-before-save, stored-key test
    action, and delete risk confirmation. Evidence:
    `docs/planning/v1-profile-api-keys-local-proof-task-2026-05-11.md`.
    Profile API Keys is now `PASS_LOCAL`; production-safe browser clickthrough
    and audit-log visibility remain open.

- [x] `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11 test: prove Auth session lifecycle`
  - Scope: added API Auth e2e proof for logout cookie clearing plus
    subsequent `/auth/me` 401 and expired JWT cookie clearing with
    session-expired messaging. Reused existing focused Web Auth tests for
    AuthProvider logout/session-expired warning, API interceptor redirect,
    middleware cookie gate, login form states, and login hook fail-closed
    missing-session-refresh behavior. Evidence:
    `docs/planning/v1-auth-session-lifecycle-proof-task-2026-05-11.md`.
    Auth is now `PASS_LOCAL`; production-safe browser clickthrough remains
    open.

- [x] `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11 test: prove Bot Runtime worker telemetry readback`
  - Scope: extended `runtime-flow.e2e.test.ts` so a real `RuntimeSignalLoop`
    PAPER lifecycle creates a `RUNNING` session, writes runtime events, tracks
    `BTCUSDT` symbol stats with long and exit counters, closes the runtime
    position, and exposes the same telemetry through authenticated runtime
    session list, detail, symbol-stats, and aggregate APIs. Evidence:
    `docs/planning/v1-bot-runtime-worker-telemetry-proof-task-2026-05-11.md`.
    Bot Runtime is now `PASS_LOCAL` in the product action matrix; production-
    safe/non-local clickthrough remains open.

- [x] `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11 test: prove Bot Runtime completed PAPER session`
  - Scope: extended the approved PAPER snapshot import with a deterministic
    local completed session for the representative bot. API readbacks prove
    statuses `RUNNING,COMPLETED`, one completed session with `eventsCount: 1`
    and `symbolsTracked: 3`, completed positions `openCount: 0`, and aggregate
    metadata `sessionsCount: 2`. Authenticated browser proof filters the
    canonical Bot Runtime route to `COMPLETED` and renders PAPER completed
    state with `0 open`, symbols, and wallet totals. Evidence:
    `docs/planning/v1-bot-runtime-completed-session-fixture-task-2026-05-11.md`.
    Worker telemetry is covered by
    `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`; production-safe/non-
    local clickthrough remains open.

- [x] `V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11 test: prove Bot Runtime running PAPER session`
  - Scope: used the approved PAPER snapshot import and local API/Web path to
    prove the canonical Bot Runtime monitoring route
    `/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/preview`.
    API readbacks for sessions, aggregate, positions, symbol stats, and trades
    returned `200`; the browser rendered bot `asd`, `RUNNING`, `PAPER`,
    `BTCUSDT`, `BNBUSDT`, `ETHUSDT`, wallet KPI text, desktop/tablet/mobile
    responsive states, safe view switch, and legacy runtime redirects to
    preview. Evidence:
    `docs/planning/v1-bot-runtime-paper-session-browser-proof-task-2026-05-11.md`.
    `SOAR-BOT-RUNTIME-001` remains `PARTIAL`; the stopped/completed gap is now
    covered by `V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`, while
    worker telemetry/live-loop proof and production-safe/non-local clickthrough
    remain open.

- [x] `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11 test: drive active Dashboard runtime rows`
  - Scope: updated the existing PAPER snapshot import to create deterministic
    local PAPER wallet/session/stat/event fixture data for the imported active
    bot. API readback proves `/runtime-sessions` `RUNNING`, session positions
    `openCount: 3`, and aggregate `openCount: 3`. Authenticated browser proof
    renders status `RUNNING`, open rows for `BTCUSDT`, `BNBUSDT`, and
    `ETHUSDT`, wallet KPIs, desktop/tablet/mobile runtime visibility, and
    `Orders` tab interaction. Evidence:
    `docs/planning/v1-dashboard-home-runtime-session-fixture-task-2026-05-11.md`.

- [x] `V1-DASHBOARD-HOME-ACTIVE-RUNTIME-BROWSER-PROOF-2026-05-11 test: prove Dashboard active PAPER runtime in browser`
  - Scope: captured the first active PAPER snapshot browser proof and exposed
    the missing runtime-session/read-contract fixture gap. Follow-up
    `V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11` fixed that local
    gap through the approved snapshot import path and reran the active browser
    proof successfully.

- [x] `V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11 test: prove Dashboard empty onboarding in browser`
  - Scope: started local API/Web, used a real local `/auth/register` session
    for `/dashboard`, verified authenticated empty/onboarding state on desktop
    `1280x720` and mobile `390x844`, keyboard focus on `Open wallets`, no
    framework overlay, and no console errors after fixing shared
    `ThemeSwitcher` hydration-noise. Evidence:
    `docs/planning/v1-dashboard-home-browser-proof-task-2026-05-11.md`.
    Validation passed: targeted Web Vitest (`4` files, `36` tests), Web
    typecheck, and repository guardrails. `SOAR-DASHBOARD-001` remains
    `PARTIAL`, pending active selected-bot
    runtime browser proof on representative PAPER data, tablet/touch proof,
    and production-safe clickthrough.

- [x] `V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11 fix: add rendered Dashboard selected-bot proof`
  - Scope: added rendered `HomeLiveWidgets` proof for loading state,
    retryable error state, selected-bot switching across two active PAPER
    bots, selected wallet KPI recalculation, open-orders tab data,
    trade-history tab data, and stale previous-bot row suppression. Evidence:
    `docs/planning/v1-dashboard-home-selected-bot-rendered-audit-task-2026-05-11.md`.
    Validation passed: focused Dashboard pack (`3` files, `35` tests), Web
    typecheck, repository guardrails, and diff check. `SOAR-DASHBOARD-001`
    remains `PARTIAL`, pending browser responsive/keyboard proof and
    production-safe clickthrough.

- [x] `BOT-DELETE-ACTIVE-PAPER-2026-05-11 fix: restore active PAPER bot delete path`
  - Scope: corrected the Bots UI delete controller so active PAPER bots no
    longer require the LIVE-risk confirmation; LIVE or live-opt-in bots still
    require the existing confirmation. Added regression coverage for active
    PAPER delete and preserved the LIVE delete cancellation test. Evidence:
    `docs/planning/bot-delete-active-paper-confirmation-task-2026-05-11.md`.
    Validation passed: Web Vitest (`147` files, `501` tests), API Bots e2e
    (`27/27`) with explicit local `DATABASE_URL`, Web typecheck, repository
    guardrails, and diff check. `SOAR-BOTS-001` is now `PARTIAL`, pending
    production-safe clickthrough confirmation.

- [x] `V1-COMPLETION-SCORECARD-2026-05-11 research: quantify V1 progress from ledger`
  - Scope: added `ops:project:scorecard`, a local no-network progress model
    generated from the master ledger. The scorecard separates implementation
    estimate (`77%`), evidence coverage (`47.8%`), and release readiness
    (`33.1%`) so future work does not confuse code presence with safe V1
    completion. V1 remains `NO-GO`; all 13 P0 modules are not release-ready.
    Evidence:
    `docs/planning/v1-completion-scorecard-task-2026-05-11.md` and
    `docs/operations/v1-completion-scorecard-2026-05-11.md`.

- [x] `V1-MASTER-STATE-LEDGER-2026-05-10 research: consolidate full V1 state index`
  - Scope: added `ops:project:ledger`, a local no-network master ledger
    generator that combines the project index and static issue scan into one
    continuation artifact. The current ledger keeps V1 at `NO-GO`, with
    module buckets `toProve: 3`, `blocked: 2`,
    and `doneLocalNeedsProdProof: 16`; it carries 46 findings
    (`P0: 4`, `P1: 10`, `P2: 32`) and separates concrete surface/test/doc
    gaps from missing-proof rows. Evidence:
    `docs/planning/v1-master-state-ledger-task-2026-05-10.md` and
    `docs/operations/v1-master-state-ledger-2026-05-10.md`.

- [x] `PROJECT-INDEXING-BASELINE-2026-05-10 research: build local project index for V1 continuation`
  - Scope: added `ops:project:index` and a no-network local index generator
    that maps the V1 product action matrix to API modules, Web features,
    routes, workers, package scripts, test inventory, architecture sources,
    and open queue markers. Current generated status counts are
    `PASS_LOCAL: 16`, `UNVERIFIED: 3`, and `BLOCKED_AUTH: 2`. This is a
    planning/audit baseline, not V1 approval
    evidence. Evidence:
    `docs/planning/project-indexing-baseline-task-2026-05-10.md` and
    `docs/operations/project-index-2026-05-10.md`.

- [x] `PROJECT-INDEX-V1-CROSSWALK-2026-05-10 research: map V1 rows to code and proof surfaces`
  - Scope: extended the project index with a prioritized V1 audit work map for
    all 21 module action rows. The crosswalk records risk, next proof, API
    modules, Web features, routes, workers, scripts, and candidate tests.
    Dashboard Home is priority 1 and Bot Runtime is priority 2. Evidence:
    `docs/planning/project-index-v1-crosswalk-task-2026-05-10.md` and
    `docs/operations/project-index-2026-05-10.md`.

- [x] `V1-STATIC-ISSUE-SCAN-2026-05-10 research: scan V1 inconsistencies and unfinished surfaces`
  - Scope: added `ops:project:scan`, a no-network static scan over the project
    index and active source files. Current report finds 46 findings:
    `P0: 4`, `P1: 10`, `P2: 32`, separating V1 proof gaps from concrete
    surface/test/doc/queue issues. Strongest concrete surface gaps are empty
    Web `orders`, missing `/dashboard/orders` and `/dashboard/positions`
    pages, missing focused Web `positions` tests, missing focused API
    `subscriptions` tests, and placeholder docs for Web orders/positions.
    Evidence:
    `docs/planning/v1-static-issue-scan-task-2026-05-10.md` and
    `docs/operations/v1-static-issue-scan-2026-05-10.md`.

- [x] `V1-DASHBOARD-HOME-RENDERED-RUNTIME-AUDIT-2026-05-10 fix: add rendered Dashboard TTP proof`
  - Scope: added a dedicated rendered `HomeLiveWidgets` regression showing a
    negative-PnL open position keeps the TTP column visible while suppressing
    prospective TTP label/value. This bridges the presenter proof into the real
    Dashboard component without growing the near-budget main test file.
    Dashboard Home remains `PARTIAL_LOCAL`; broader rendered/browser audit is
    still open. Evidence:
    `docs/planning/v1-dashboard-home-rendered-runtime-audit-task-2026-05-10.md`
    and `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`.

- [x] `V1-DASHBOARD-RUNTIME-TABLE-ACTION-AUDIT-2026-05-10 fix: verify Dashboard runtime table action/display contracts`
  - Scope: added focused Dashboard runtime table presenter proof for
    open-order local cancel, terminal order read-only behavior, exchange-backed
    cancel blocked rows, negative PnL/error styling, prospective TTP hidden at
    zero/negative live PnL, backend/runtime TTP precedence, TSL-only display,
    and non-actionable open-position edit/close buttons. Dashboard Home and
    Bot Runtime rows are `PARTIAL_LOCAL`; rendered browser/component proof
    remains open. Evidence:
    `docs/planning/v1-dashboard-runtime-table-action-audit-task-2026-05-10.md`
    and `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`.

- [x] `V1-BOTS-ACTION-AUDIT-2026-05-10 fix: verify Bots module action contracts`
  - Scope: added focused Bots list delete success/failure coverage and
    refreshed Bots API action evidence across CRUD, delete cleanup, runtime
    close with deterministic ticker context, ownership isolation, market
    groups, strategy links, LIVE opt-in guards, duplicate active guards, and
    runtime monitoring. Reset helpers now clear runtime ticker store state
    between Bots e2e cases. Evidence:
    `docs/planning/v1-bots-action-audit-task-2026-05-10.md` and
    `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`.

- [x] `V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10 fix: seed action audit and close first P0 regressions`
  - Scope: corrected the evidence model after operator-reported UI/action
    failures. Bot deletion now clears `RuntimeExecutionDedupe.botId` before
    deleting the bot, with DB-backed coverage proving runtime history cleanup
    and retained dedupe history. Dashboard/runtime prospective TTP display is
    hidden when live PnL is not positive, with focused row-builder, display
    resolver, and presenter tests. Also published the first action-level V1
    audit matrix so route reachability is no longer treated as functional
    completeness. Evidence:
    `docs/planning/v1-product-action-audit-p0-task-2026-05-10.md` and
    `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`.

- [x] `V1-FINAL-PREFLIGHT-1E11F8DE-2026-05-10 release: refresh final preflight for current deploy`
  - Scope: ran the read-only final V1 preflight for deployed
    `1e11f8de4a3daaa313894a9ccf989237a3e65e5a`. Build-info PASS, public
    API/Web smoke PASS, production DB restore context satisfied by evidence.
    V1 remains `BLOCKED` on protected/formal evidence: missing
    `LIVEIMPORT-03`, failed rollback proof, missing liveimport/rollback auth,
    and failed RC gates/sign-off/checklist. Evidence:
    `docs/planning/v1-final-preflight-1e11f8de-task-2026-05-10.md` and
    `docs/operations/v1-final-preflight-1e11f8de-2026-05-10.md`.

- [x] `DEPLOY-SMOKE-SKIP-WORKERS-ALIAS-2026-05-10 fix: accept skip-workers alias in deploy smoke`
  - Scope: `scripts/deploySmokeCheck.mjs` now accepts `--skip-workers` as an
    alias for canonical `--no-workers`, while default worker checks remain
    enabled. Syntax/help checks and production public smoke with
    `--skip-workers` pass. Evidence:
    `docs/planning/deploy-smoke-skip-workers-alias-task-2026-05-10.md`.

- [x] `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10 release: capture guarded LIVE runtime session readback`
  - 2026-05-10: Added guarded command
    `pnpm run ops:live:controlled-proof` for the remaining controlled LIVE
    proof. The command validates build-info, requires protected no-order guard
    readiness, refuses already-active LIVE bots, runs `LIVEIMPORT-03`, and
    deactivates in cleanup. Actual activation remains blocked on explicit
    operator approval plus `--i-understand-live-risk`.
  - Scope: execute a short controlled LIVE activation only after explicit
    operator approval, with production no-order guard active, collect
    `LIVEIMPORT-03`, deactivate the bot, and record redacted evidence.
    Preactivation read-only check confirms expected `NO_RUNNING_SESSION`.
    Evidence:
    `docs/planning/controlled-live-session-proof-task-2026-05-10.md` and
    `docs/operations/_artifacts-liveimport-readback-preactivation-b1391526-2026-05-10.json`.
  - 2026-05-14 supersession: closed by the `457bce05` controlled
    no-order-guard LIVE proof. Evidence:
    `docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`,
    `docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`,
    and
    `docs/operations/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`.

- [x] `LIVE-RUNTIME-SAFETY-READINESS-DIAGNOSTICS-2026-05-10 fix: expose protected LIVE no-order guard diagnostics`
  - Scope: extended the existing admin/ops protected `/ready/details` endpoint
    with non-secret `runtimeSafety.liveNoOrderGuard` booleans and derived
    `active`, while keeping public `/ready` minimal. Focused readiness tests
    and API typecheck pass. Production no-order guard is active on
    `b139152672aa9f6b0e26f1cab5ba0203beb54741`. Evidence:
    `docs/planning/live-runtime-safety-readiness-diagnostics-task-2026-05-10.md`
    and
    `docs/operations/live-runtime-no-order-guard-prod-b1391526-2026-05-10.md`.

- [x] `LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10 fix: add env-controlled LIVE runtime kill switch`
  - Scope: added `RUNTIME_LIVE_GLOBAL_KILL_SWITCH` and
    `RUNTIME_LIVE_EMERGENCY_STOP` to runtime config and wired them into the
    final-candle LIVE pre-trade path before signal creation/order
    orchestration. Defaults are off. Focused config/final-candle tests and API
    typecheck pass. Production build-info reached
    `f00080842ea59289e8d683ac298939a23b522e67` and public API/Web smoke
    passed after the queued Coolify deploy completed. Evidence:
    `docs/planning/live-runtime-kill-switch-config-task-2026-05-10.md`.

- [x] `PROD-API-RUNTIME-READINESS-8CD5C1B3-2026-05-10 release: rerun production key and liveimport readiness`
  - Scope: after production reached
    `8cd5c1b3f38b9594a9caf15d4b434c853a66fdfe`, public deploy smoke passed
    and the stored Binance key test returned `ok: true`, `code: OK`,
    `permissions.spot: true`, `permissions.futures: true`. `LIVEIMPORT-03`
    still returns `NO_RUNNING_SESSION`, so remaining live proof requires a
    controlled runtime session. Evidence:
    `docs/operations/prod-api-runtime-readiness-8cd5c1b3-2026-05-10.md`.

- [x] `FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10 fix: accept futures-only API key probe success`
  - Scope: changed profile API-key probe semantics so a key is accepted when
    at least one actionable scope validates, preserving `permissions.spot` and
    `permissions.futures` for target-specific checks. Binance UI copy now
    states Spot & Margin permission is only for Spot bots. Focused API/Web
    tests, API/Web typechecks, guardrails, docs parity, and diff check pass.
    Production rerun is required after deploy. Evidence:
    `docs/planning/futures-only-api-key-acceptance-task-2026-05-10.md`.

- [x] `BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10 fix: correct API-key probe scope handling`
  - Scope: corrected the local Binance Futures API-key probe path after the
    operator challenged the production probe interpretation. The old stored
    key probe output is now treated as ambiguous. The local fix probes Spot and
    Futures independently, passes explicit Binance Futures balance params
    through the exchange-owned probe surface, and updates the production
    readiness report. Focused unit tests and API typecheck pass; DB-backed e2e
    is blocked by missing local `DATABASE_URL`. Production rerun is required
    after deploy. Evidence:
    `docs/planning/binance-futures-api-key-probe-scope-fix-task-2026-05-10.md`.

- [x] `PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10 release: capture authenticated API/runtime readiness`
  - Scope: captured authenticated read-only production API and live-runtime
    readiness evidence for deployed
    `f3cb9a24c4c891479d5466a5abae4100ddda5ca8`. Core dashboard/admin API
    modules are reachable and Gate.io Futures market catalog is reachable.
    LIVE Binance Futures remains `NO-GO`: the stored Binance key probe reports
    `spot: true` and `futures: false`, and `LIVEIMPORT-03` wrote fail-closed
    `NO_RUNNING_SESSION` evidence because the configured LIVE bot has no
    running runtime session. Evidence:
    `docs/planning/prod-api-runtime-readiness-audit-f3cb9a24-task-2026-05-10.md`
    and `docs/operations/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`.

- [x] `PROD-UI-AUTH-CLICKTHROUGH-39A52703-2026-05-10 qa: capture authenticated/admin production UI route evidence`
  - Scope: ran the production UI module clickthrough runner with approved
    dashboard/admin credentials against deployed
    `39a5270322a7d1c302cd5a711484af35f4d6be08`. Result PASS: public routes
    `4/4`, dashboard routes `18/18`, admin routes `3/3`, and legacy redirects
    `3/3`. Also aligned the runner and route docs with the documented
    top-level bot helper redirects. Evidence:
    `docs/planning/prod-ui-auth-clickthrough-39a52703-task-2026-05-10.md` and
    `docs/operations/prod-ui-module-clickthrough-39a52703-2026-05-10.md`.

- [x] `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10 fix: close exchange-boundary audit drift`
  - Scope: resolved the architecture audit findings by moving API-key probe
    CCXT client construction from `profile/apiKey` into an exchange-owned
    factory under `modules/exchange`, then refreshed Gate.io runtime context
    and exchange module docs. Focused probe tests, API typecheck, direct CCXT
    boundary grep, guardrails, docs parity, and diff check passed. Evidence:
    `docs/planning/v1-architecture-boundary-cleanup-task-2026-05-10.md` and
    `docs/operations/v1-architecture-function-audit-2026-05-10.md`.

- [x] `V1-ARCH-FUNCTION-AUDIT-2026-05-10 research: audit V1 functions against architecture`
  - Scope: published architecture/function conformity audit across
    architecture contracts, traceability matrix, route/API boundaries, Web
    route ownership, exchange SDK access, runtime/backtest/paper/live parity,
    security, UI proof, and ops/release evidence. Result before remediation
    was mostly aligned, with one P1 exchange-boundary mismatch and two P2
    Gate.io docs drifts. Those local findings are now resolved by
    `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10`; protected production evidence and
    formal approval remain the V1 blockers. Evidence:
    `docs/planning/v1-architecture-function-audit-task-2026-05-10.md` and
    `docs/operations/v1-architecture-function-audit-2026-05-10.md`.

- [x] `V1-FUNCTION-COVERAGE-AUDIT-2026-05-10 research: publish V1 function coverage audit`
  - Scope: published a function/module-oriented V1 audit across architecture,
    route map, API routers, Web route inventory, module inventory, test
    inventory, current final preflight, and production UI clickthrough
    evidence. The audit confirms broad implementation coverage and no broad
    known missing module implementation for the current V1 scope, but V1
    remains `NO-GO` until protected liveimport readback, rollback proof PASS,
    authenticated/admin UI clickthrough, authenticated Gate 2 SLO, RC approval,
    and final non-dry-run release gate evidence are complete. Evidence:
    `docs/planning/v1-function-coverage-audit-task-2026-05-10.md` and
    `docs/operations/v1-function-coverage-audit-2026-05-10.md`.

- [x] `V1-FINAL-PREFLIGHT-82205329-2026-05-10 release: refresh current final no-secret preflight`
  - Scope: ran final V1 preflight against production build-info
    `8220532920e484da9ddaa021ac64b5de4cc5e6e1`. Build-info PASS, public
    smoke PASS, production DB restore context satisfied by evidence, and
    activation/backup restore evidence fresh. V1 remains `BLOCKED` on
    protected/formal blockers: liveimport auth/readback, rollback guard
    auth/proof PASS, RC gate/sign-off/checklist approval, and
    authenticated/admin UI proof. Evidence:
    `docs/planning/v1-final-preflight-82205329-task-2026-05-10.md` and
    `docs/operations/v1-final-preflight-82205329-2026-05-10.md`.

- [x] `V1-OPERATOR-ARTIFACT-NAMING-2026-05-10 release: add SHA suffixes to V1 operator artifacts`
  - Scope: updated the final blocker execution pack, operator unblock
    checklist, and continuation state so preflight, `LIVEIMPORT-03`, UI
    clickthrough, and final release-gate artifact paths include
    `$expectedShaShort-$releaseDate`. Also fixed duplicate final blocker pack
    step numbering. Evidence:
    `docs/planning/v1-operator-artifact-naming-task-2026-05-10.md`.

- [x] `V1-NEXT-STEPS-DYNAMIC-SHA-CLEANUP-2026-05-10 release: remove stale static SHA targets`
  - Scope: cleaned the lower V1 continuation backlog so protected evidence
    runs derive `$expectedSha` from production `/api/build-info` instead of
    stale historical defaults like `c50e1e7c` or `30b027b7`. The final blocker
    pack remains authoritative, and build-info freshness is still not treated
    as liveimport, rollback, RC, or authenticated UI proof. Evidence:
    `docs/planning/v1-next-steps-dynamic-sha-cleanup-task-2026-05-10.md`.

- [x] `PROD-UI-PUBLIC-CLICKTHROUGH-88313309-2026-05-10 qa: refresh current no-auth production UI audit`
  - Scope: ran the existing production UI module clickthrough runner without
    dashboard/admin credentials against deployed
    `88313309200d35275ba6c0d3465c5045c4b6d99e`. Build-info matches, public
    routes PASS, and dashboard/admin/legacy protected routes are
    `BLOCKED_AUTH` with `/auth/login` redirects. This is current fail-closed
    evidence only; full authenticated/admin UI clickthrough remains blocked on
    valid production auth and representative data. Evidence:
    `docs/planning/prod-ui-public-clickthrough-88313309-task-2026-05-10.md`
    and `docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`.

- [x] `V1-CURRENT-RELEASE-GATE-DRY-RUN-2026-05-10 release: refresh current production release-gate dry-run`
  - Scope: confirmed production Web build-info still exposes
    `8f8630b0ad5abd690409d6173c9b247b95948138`, then ran the V1 release gate
    in no-secret `--dry-run` mode for production. Readiness remains
    `not_ready`: activation audit, activation plan, and backup/restore drill
    evidence are fresh, while RC external gates, RC sign-off, RC checklist,
    `LIVEIMPORT-03`, rollback proof PASS, and final non-dry-run execution
    remain blockers. Evidence:
    `docs/planning/v1-current-release-gate-dry-run-task-2026-05-10.md` and
    `docs/operations/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.

- [x] `V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10 release: use build-info as operator target`
  - Scope: updated the final blocker execution pack and operator unblock
    checklist so `$expectedSha` is derived from production
    `https://soar.luckysparrow.ch/api/build-info` immediately before
    protected evidence collection, with an optional explicit intended-candidate
    comparison when promoting one exact runtime SHA. This reduces stale
    docs-only SHA churn while preserving that build-info freshness is not
    protected runtime proof. Evidence:
    `docs/planning/v1-operator-runbook-dynamic-sha-task-2026-05-10.md`,
    `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`, and
    `docs/operations/v1-operator-unblock-checklist-2026-05-10.md`.

- [x] `V1-SLO-GATE2-NOAUTH-PROBE-2026-05-10 release: record no-auth Gate 2 SLO probe`
  - Scope: ran a short read-only production SLO collector without auth against
    `https://api.soar.luckysparrow.ch` on deployed
    `8c85279d13ca56421b09a5c4cd613535a81ef76d`. The probe generated current
    no-secret blocker evidence: `/health` PASS, `/ready` transient FAIL in the
    one-minute window, protected workers/metrics/alerts `401`, and queue/HTTP
    metrics `NO_DATA`. A follow-up public deploy smoke passed. Gate 2 remains
    blocked until an authenticated 30-minute production SLO run is captured.
    Evidence:
    `docs/planning/v1-slo-gate2-noauth-probe-task-2026-05-10.md`,
    `docs/operations/v1-slo-gate2-noauth-probe-2026-05-10.md`, and
    `docs/operations/v1-slo-observation-2026-05-10T05-09-56-366Z.md`.

- [x] `V1-OPERATOR-RUNBOOK-CURRENT-SHA-SYNC-2026-05-10 release: sync operator runbooks to current deploy`
  - Scope: updated the final blocker execution pack and operator unblock
    checklist to target latest verified deployed audit SHA
    `5515f2105d52f25a0d875cbd0b55860a00b4da32`, while keeping build-info
    verification authoritative before protected evidence collection. The sync
    explicitly says later docs-only deploys may supersede the listed SHA but
    cannot substitute for `LIVEIMPORT-03`, rollback proof PASS, RC approval,
    or authenticated/admin UI proof. Evidence:
    `docs/planning/v1-operator-runbook-current-sha-sync-task-2026-05-10.md`,
    `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`, and
    `docs/operations/v1-operator-unblock-checklist-2026-05-10.md`.

- [x] `V1-COVERAGE-CONFIDENCE-AUDIT-2026-05-10 research: publish current V1 coverage confidence audit`
  - Scope: refreshed current no-secret final preflight and no-auth production
    UI module clickthrough for deployed
    `fd8da90bd77c2ddbed800eabd98479c1bd113ac4`, then published a
    perspective-by-perspective V1 confidence report. The audit finds broad
    implementation/local coverage and current public production reachability,
    but V1 remains `NO-GO` because protected liveimport readback, rollback
    proof PASS, RC approval/gates, and authenticated/admin UI clickthrough are
    still missing or blocked. Evidence:
    `docs/planning/v1-coverage-confidence-audit-task-2026-05-10.md`,
    `docs/operations/v1-coverage-confidence-audit-2026-05-10.md`,
    `docs/operations/v1-final-preflight-fd8da90b-2026-05-10.md`, and
    `docs/operations/prod-ui-module-clickthrough-fd8da90b-2026-05-10.md`.

- [x] `PROD-UI-MODULE-CLICKTHROUGH-RUNNER-2026-05-10 qa: add production UI module audit runner`
  - Scope: added `ops:ui:prod-clickthrough`, a no-secret production UI module
    audit runner that verifies build-info, supports optional dashboard/admin
    auth, classifies public/dashboard/admin/legacy routes, and writes redacted
    JSON/Markdown evidence. The current no-auth production run for
    `84e7c0e012a571f18396556a97198dbed08aba7c` reports public routes PASS and
    dashboard/admin/legacy protected routes `BLOCKED_AUTH`. Authenticated UI
    clickthrough remains blocked until production app/admin credentials and
    representative data are available. Evidence:
    `docs/planning/prod-ui-module-clickthrough-runner-task-2026-05-10.md` and
    `docs/operations/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.

- [x] `V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-10 release: refresh rollback-proof blocked evidence`
  - Scope: captured current fail-closed production rollback proof evidence for
    the active evidence date. The proof is fresh but `FAIL` because protected
    rollback guard auth is absent and production runtime-freshness/alerts
    endpoints returned protected `401` responses. Follow-up no-secret final
    preflight for deployed `8df3260b8453be0a39dfa75ce2be281d6571c4de` reports
    build-info PASS, public smoke PASS, production DB restore context
    satisfied, backup/restore fresh, and rollback proof fresh but failed. V1
    remains `BLOCKED / NO-GO`. Evidence:
    `docs/planning/v1-rollback-proof-blocked-refresh-task-2026-05-10.md`,
    `docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`,
    and `docs/operations/v1-final-preflight-8df3260b-2026-05-10.md`.

- [x] `V1-PROD-RESTORE-DRILL-REFRESH-2026-05-10 release: refresh production restore drill evidence`
  - Scope: captured fresh PASS production Postgres restore evidence through
    the approved Coolify terminal for deployed
    `969df7c8f268146ecff3efb9de2fe1841ac8bc75`. The isolated drill created a
    backup dump, restored it into a temporary database, validated aggregate
    counts, dropped the restore database, removed the dump, and verified zero
    leftovers. Follow-up no-secret final preflight now reports production DB
    restore context satisfied and backup/restore drill evidence fresh for
    2026-05-10. V1 remains `BLOCKED / NO-GO` on liveimport auth/readback,
    rollback guard auth/proof, RC approval/gates, and authenticated/admin UI
    clickthrough. Evidence:
    `docs/planning/v1-prod-restore-drill-refresh-task-2026-05-10.md`,
    `docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`, and
    `docs/operations/v1-final-preflight-969df7c8-2026-05-10.md`.

- [x] `V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10 release: recover stale Coolify deploy queue`
  - Scope: cleared stale Soar Coolify deployments after production build-info
    advanced to
    `33a2ebc468be3dbfab7c784f375672ebead5ae16`. Stale `soar-api` jobs for old
    SHAs were cancelled, one fresh `soar-api` redeploy finished on the same
    SHA, public API/Web smoke passed, and the Coolify queue was empty. Current
    no-secret V1 preflight is public PASS and protected/formal BLOCKED.
    Evidence:
    `docs/planning/v1-coolify-deploy-queue-recovery-task-2026-05-10.md`,
    `docs/operations/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md`,
    and `docs/operations/v1-final-preflight-33a2ebc4-2026-05-10.md`.

- [x] `V1-DEPLOY-CONTROL-READINESS-2026-05-10 release: audit deploy control after lag`
  - Scope: confirmed production deployment is manual Coolify/operator
    controlled. The repository has CI checks only and no approved no-secret
    production deploy trigger. Evidence:
    `docs/operations/v1-deploy-control-readiness-2026-05-10.md`.

- [x] `DEPLOY-LAG-E70F5CF6-2026-05-10 release: record protected-input readiness deploy lag`
  - Scope: recorded that pushed commit
    `e70f5cf6229d6fc4d26ea0342b81baab80851800` did not reach production
    build-info during two bounded wait windows. Production still reports
    `40e9b3c35c96d4acced73bbab980039f9e6b6a22`; public smoke passes. Evidence:
    `docs/operations/deploy-lag-e70f5cf6-2026-05-10.md`.

- [x] `V1-PROTECTED-INPUTS-READINESS-2026-05-10 release: recheck protected inputs`
  - Scope: checked required protected env families by presence only and
    recorded that privileged VPS/Docker inspection was rejected by escalation
    review. V1 remains `BLOCKED / NO-GO` until operator inputs or explicit
    production infrastructure authorization are available. Evidence:
    `docs/operations/v1-protected-inputs-readiness-2026-05-10.md`.

- [x] `V1-FINAL-PREFLIGHT-CURRENT-9D28F682-2026-05-10 release: refresh final preflight for current deploy`
  - Scope: captured final no-secret preflight for currently deployed
    `9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info and public smoke
    pass; V1 remains `BLOCKED / NO-GO` on protected/formal evidence. Evidence:
    `docs/planning/v1-final-preflight-current-9d28f682-task-2026-05-10.md`
    and `docs/operations/v1-final-preflight-9d28f682-2026-05-10.md`.

- [x] `V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10 release: publish final operator unblock checklist`
  - Scope: published the exact no-secret protected inputs and command order
    needed to close remaining V1 blockers, retargeted the final blocker
    execution pack to deployed `822d92fc02067fa122e735ab6cc2783e438dc458`, and
    captured current no-secret final preflight. V1 remains `BLOCKED / NO-GO`.
    Evidence: `docs/operations/v1-operator-unblock-checklist-2026-05-10.md`
    and `docs/operations/v1-final-preflight-822d92fc-2026-05-10.md`.

- [x] `V1-PROD-ACTIVATION-REFRESH-2026-05-10 release: refresh production activation plan and audit`
  - Scope: published fresh activation plan and activation evidence audit as
    explicit `NO-GO` for deployed
    `74752f025ef49bf5026ec92e056f59947e00a18f`. Final preflight reports
    activation plan/audit fresh, build-info/public smoke PASS, and V1 still
    `BLOCKED` on protected/formal evidence. Evidence:
    `docs/planning/v1-production-activation-refresh-2026-05-10-task.md` and
    `docs/operations/v1-final-preflight-74752f02-2026-05-10.md`.

- [x] `V1-RC-BLOCKED-REFRESH-2026-05-10 release: refresh current blocked RC evidence`
  - Scope: refreshed RC external gates status, RC sign-off record, and RC
    checklist to 2026-05-10 as current blocked evidence. Final preflight for
    deployed `1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` reports build-info
    PASS, public smoke PASS, and RC evidence `failed` instead of `stale`; V1
    remains `BLOCKED` on protected/formal evidence. Evidence:
    `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
    `docs/operations/v1-final-preflight-1609929e-2026-05-10.md`.

- [x] `DEPLOY-FRESHNESS-9C125683-2026-05-10 release: verify live cancel boundary deployment freshness`
  - Scope: verified production Web build-info for
    `9c12568379ee77cda9c9e9df39879e141b5615fb`, which includes the `b414e523`
    live order cancel boundary. Public API/Web smoke passed. The no-secret
    final V1 preflight public checks passed and remain correctly blocked on
    protected/formal evidence: liveimport auth, rollback guard auth,
    production DB restore context, current activation/RC evidence,
    `LIVEIMPORT-03` readback, backup/restore drill, rollback proof, and
    authenticated/admin UI clickthrough. Evidence:
    `docs/planning/deploy-freshness-9c125683-task-2026-05-10.md`,
    `docs/operations/deploy-freshness-9c125683-2026-05-10.md`, and
    `docs/operations/v1-final-preflight-9c125683-2026-05-10.md`.

- [x] `EXCHANGE2-31-LIVE-ORDER-CANCEL-BOUNDARY-2026-05-10 feature(exchange): enable live order cancel boundary`
  - Scope: add canonical exchange-side `LIVE_ORDER_CANCEL` for Binance and
    Gate.io through `orders.service.ts` -> `exchangeAdapterBoundary.service.ts`
    -> authenticated connector, while preserving fail-closed behavior for
    contextless exchange-backed rows. No real live-money cancel action is
    performed. Focused exchange tests, focused orders cancel tests, API
    typecheck, guardrails, docs parity, and diff check passed. Production
    freshness is now proven by `DEPLOY-FRESHNESS-9C125683`; the earlier
    deploy-lag artifact is superseded. Evidence:
    `docs/planning/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md`
    and `docs/operations/deploy-freshness-9c125683-2026-05-10.md`.

- [x] `EXCHANGE2-30-GATEIO-LIVE-ORDER-SUBMIT-2026-05-10 feature(exchange): enable Gate.io live order submit`
  - Scope: enable Gate.io `LIVE_ORDER_SUBMIT` through the canonical
    orders/exchange boundary and enable shared `LIVE_EXECUTION` compatibility
    gating, while keeping exchange-side cancel unsupported. No real live-money
    action is performed. Focused exchange tests, wallet e2e, Web capability
    test, API typecheck, Web typecheck, production build-info for
    `04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public deploy smoke
    passed. Evidence:
    `docs/planning/exchange2-30-gateio-live-order-submit-task-2026-05-10.md`
    and `docs/operations/deploy-freshness-04a4204c-2026-05-10.md`.

- [x] `EXCHANGE2-29-GATEIO-WALLET-CASHFLOW-HISTORY-2026-05-09 feature(exchange): enable Gate.io wallet cashflow history`
  - Scope: enable only `GATEIO` `WALLET_CASHFLOW_HISTORY` through the existing
    exchange adapter boundary, while keeping Gate.io live/cancel unsupported.
    Focused exchange/wallet cashflow tests, API typecheck, guardrails, docs
    parity, and diff check passed. Production build-info and public smoke pass
    for `8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`.
    Evidence:
    `docs/planning/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md`
    and `docs/operations/deploy-freshness-8ea7f33b-2026-05-09.md`.

- [x] `EXCHANGE2-28-GATEIO-TRADE-HISTORY-SNAPSHOT-2026-05-09 feature(exchange): enable Gate.io trade-history snapshot`
  - Scope: enable only `GATEIO` `TRADE_HISTORY_SNAPSHOT` through the existing
    authenticated-read boundary, while keeping Gate.io wallet cashflow
    history/live/cancel unsupported. Focused exchange tests, authenticated
    snapshot service test, API typecheck, guardrails, docs parity, and diff
    check passed. Production build-info and public smoke pass for
    `432f768701300c7ba600fa7633532c0cc9ef4b96`. Evidence:
    `docs/planning/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md`
    and `docs/operations/deploy-freshness-432f7687-2026-05-09.md`.

- [x] `EXCHANGE2-27-GATEIO-OPEN-ORDERS-SNAPSHOT-2026-05-09 feature(exchange): enable Gate.io open-orders snapshot`
  - Scope: enable only `GATEIO` `OPEN_ORDERS_SNAPSHOT` through the existing
    authenticated-read boundary, while keeping Gate.io trade-history/live/cancel
    unsupported. Focused exchange tests, authenticated snapshot service test,
    API typecheck, guardrails, docs parity, and diff check passed. Production
    build-info and public smoke pass for
    `214a9c034d38ab8670fd4b43d0f8ed692d78d90c`. Evidence:
    `docs/planning/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md`
    and `docs/operations/deploy-freshness-214a9c03-2026-05-09.md`.

- [x] `EXCHANGE2-26-GATEIO-POSITIONS-SNAPSHOT-2026-05-09 feature(exchange): enable Gate.io positions snapshot`
  - Scope: enable only `GATEIO` `POSITIONS_SNAPSHOT` through the existing
    authenticated-read boundary and positions exchange-snapshot route, while
    keeping Gate.io open-orders/trade-history/live/cancel unsupported. Focused
    exchange tests, positions e2e, authenticated snapshot service tests, API
    typecheck, guardrails, docs parity, and diff check passed. Production
    build-info and public smoke pass for
    `4c7548acc74295f27676c1f00d79dbf58b873942`. Evidence:
    `docs/planning/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md`
    and `docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.

- [x] `EXCHANGE2-25-GATEIO-BALANCE-PREVIEW-2026-05-09 feature(exchange): enable Gate.io balance preview`
  - Scope: enable only `GATEIO` `BALANCE_PREVIEW` through the existing
    authenticated-read boundary and wallet preview route, while keeping Gate.io
    positions/open-orders/trade-history/live/cancel unsupported. Focused
    exchange tests, wallet e2e, API typecheck, guardrails, docs parity, and
    diff check passed. Production build-info and public smoke pass for
    `15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`. Evidence:
    `docs/planning/exchange2-25-gateio-balance-preview-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.

- [x] `EXCHANGE2-24-GATEIO-API-KEY-PROBE-2026-05-09 feature(exchange): enable Gate.io API-key probe`
  - Scope: replace the Binance-only profile API-key probe with a shared
    exchange-aware probe service, enable only `GATEIO` `API_KEY_PROBE`, keep
    non-Gate.io placeholders fail-closed, and preserve Gate.io
    balance/positions/open-orders/trade-history/live/cancel as unsupported.
    Focused API/Web tests, API/Web typechecks, guardrails, docs parity, and
    diff check passed. Production build-info and public smoke pass for
    `e76e08a1a20b12abaeabf4edc44a38ba37619005`. Evidence:
    `docs/planning/exchange2-24-gateio-api-key-probe-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-1DC55D96-2026-05-09 release: verify Gate.io PAPER pricing batch deployment`
  - Scope: verified production Web build-info for
    `1dc55d9623bab11dacb5b9f8ce9634778c139249`, ran public API/Web smoke with
    `--no-workers`, and refreshed no-secret final V1 preflight. Public checks
    pass; protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-1dc55d96-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-1dc55d96-2026-05-09.md`.

- [x] `EXCHANGE2-23-GATEIO-PAPER-PRICING-ENABLE-2026-05-09 feature(exchange): enable Gate.io public PAPER pricing`
  - Scope: enabled only `GATEIO` `PAPER_PRICING_FEED` in the shared
    capability matrix, updated API/Web wallet/bot/runtime regressions from
    paper-blocked to paper-supported, and kept Gate.io
    LIVE/authenticated/cancel capabilities fail-closed. Focused validation
    passed for Web exchange/wallet/bot UI, API runtime loop, API wallet
    create/update, and focused API bot Gate.io/placeholder gating. Evidence:
    `docs/planning/exchange2-23-gateio-paper-pricing-enable-task-2026-05-09.md`.

- [x] `V1-COMPLETION-GAP-AUDIT-2026-05-09 research: explain what blocks 100% V1 readiness`
  - Scope: created a concise evidence-backed completion gap report that
    separates implemented/proven work, implemented-but-not-production-proven
    work, missing implementation, protected operator inputs, and release
    blockers. Evidence:
    `docs/planning/v1-completion-gap-audit-task-2026-05-09.md` and
    `docs/operations/v1-completion-gap-report-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-E8CD748E-2026-05-09 release: verify docs/evidence batch deployment`
  - Scope: verified production build-info for the docs/evidence batch ending
    at `e8cd748e80b8693087e01beb21b0085ace747c49`, ran public API/Web smoke
    with `--no-workers`, and refreshed no-secret final V1 preflight. Public
    checks pass; protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-e8cd748e-task-2026-05-09.md`.

- [x] `CURRENT-PROD-BUILDINFO-745B5F5A-SYNC-2026-05-09 release: sync latest public build-info truth`
  - Scope: synchronized active source-of-truth files after public UI evidence
    showed latest observed production build-info at
    `745b5f5a45eab3f86b02e023479c8358f760bbf6`. This SHA is docs/evidence
    only over protected runtime/preflight baseline
    `30b027b78544f76b5b638851e8e27c98f6d22ab5`; protected V1 evidence and
    Gate.io paper/live/authenticated blockers remain open. Evidence:
    `docs/planning/current-production-build-info-745b5f5a-sync-task-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-745B5F5A-2026-05-09 qa: refresh public production UI access evidence`
  - Scope: refreshed public/unauthenticated production access evidence for
    deployed `745b5f5a45eab3f86b02e023479c8358f760bbf6`. Build-info matches
    the expected SHA, API health/readiness and public Web routes return HTTP
    200, and unauthenticated dashboard/admin routes redirect to `/auth/login`.
    The full module clickthrough remains blocked on authenticated/admin
    production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-745b5f5a-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-30B027B7-2026-05-09 release: verify protected-backlog sync batch deployment`
  - Scope: pushed the protected-backlog sync batch ending at
    `30b027b78544f76b5b638851e8e27c98f6d22ab5`, verified production Web
    build-info reached that SHA on the follow-up wait, ran public API/Web
    smoke with `--no-workers`, and refreshed no-secret final V1 preflight.
    Public checks pass; protected/formal V1 evidence remains blocked.
    Evidence:
    `docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md`.

- [x] `OPEN-PROTECTED-BACKLOG-BA3D852D-SYNC-2026-05-09 release: sync protected backlog target`
  - Scope: retargeted the active protected V1 backlog and final blocker pack
    to deployed `ba3d852d5126b625a8cf702ab647d5c644d86f9c` without closing
    protected evidence. `LIVEIMPORT-03`, rollback proof, restore proof, RC
    approval, and authenticated/admin UI audit remain blocked on operator
    inputs. Evidence:
    `docs/planning/open-protected-backlog-ba3d852d-sync-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-BA3D852D-2026-05-09 release: verify docs/status sync batch deployment`
  - Scope: pushed the docs/status sync batch ending at
    `ba3d852d5126b625a8cf702ab647d5c644d86f9c`, verified production Web
    build-info reached that SHA, ran public API/Web smoke with `--no-workers`,
    and refreshed no-secret final V1 preflight. Public checks pass;
    protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-ba3d852d-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-010B4F8B-2026-05-09 release: verify Gate.io source batch deployment`
  - Scope: verified production build-info for the three-commit Gate.io source
    batch ending at `010b4f8b6abfaf4c24d26550eb4761215d119f21`, ran public
    API/Web smoke, and refreshed no-secret final V1 preflight. Public checks
    pass; protected/formal V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md`.

- [x] `EXCHANGE2-22-GATEIO-PUBLIC-SYMBOL-RULES-2026-05-09 fix(exchange): decouple public symbol rules from live execution`
  - Scope: changed public symbol-rule resolution to use `MARKET_CATALOG`
    support instead of `LIVE_EXECUTION`, added Gate.io regression coverage, and
    preserved fail-closed null/no-load behavior for exchanges without market
    catalog. Gate.io paper/live/authenticated capabilities remain unsupported.
    Evidence:
    `docs/planning/exchange2-22-gateio-public-symbol-rules-task-2026-05-09.md`.

- [x] `EXCHANGE2-21-GATEIO-MARKET-STREAM-SOURCE-SMOKE-2026-05-09 qa: add Gate.io public market-stream source smoke`
  - Scope: added a public-read-only smoke runner for the existing Gate.io
    polling market-stream source and captured real `GATEIO/FUTURES/BTCUSDT`
    ticker plus final `1m` candle events. The artifact records no credentials,
    exchange writes, live orders, or paper pricing enablement. Gate.io
    `PAPER_PRICING_FEED`, authenticated reads, live submit, and cancel remain
    unsupported. Evidence:
    `docs/planning/exchange2-21-gateio-market-stream-source-smoke-task-2026-05-09.md`.

- [x] `DEPLOY-LAG-D355DF93-FOLLOW-UP-2026-05-09 release: record deploy lag follow-up after pushed operator handoff`
  - Scope: recorded that the pushed operator handoff/source-of-truth commit
    `d355df93107f4d7ff9d6231107528295cbc873c2` did not reach production
    build-info during a bounded 120-second follow-up wait. Production remains
    build-info-proven at `c50e1e7c`; the next deploy action requires
    operator-side Coolify inspection or an approved trigger, not empty
    retrigger commits. Evidence:
    `docs/planning/deploy-lag-d355df93-follow-up-task-2026-05-09.md`.

- [x] `DASH-RUNTIME-CURRENT-AGGREGATE-2026-05-09 fix(api): prefer running runtime rows for dashboard current aggregate state`
  - Scope: added explicit current-row selection in the runtime monitoring
    aggregate read model so dashboard current open positions, open orders,
    dynamic-stop visibility, unrealized PnL, open counts, and capital summary
    prefer the freshest `RUNNING` session row when one exists. Historical
    closed-position/trade projection continues to use the existing aggregate
    projection rows. Evidence:
    `docs/planning/dashboard-runtime-current-state-aggregate-task-2026-05-09.md`.

- [x] `DASH-RUNTIME-WIDGET-AGGREGATE-CURRENT-RENDER-2026-05-09 test(web): lock dashboard aggregate current-row rendering`
  - Scope: added focused `HomeLiveWidgets` coverage proving a running bot's
    aggregate current open-position row renders on the dashboard while
    completed-session history remains visible in the history tab. Evidence:
    `docs/planning/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-3C5DA343-2026-05-09 release: verify dashboard runtime aggregate batch deployment`
  - Scope: pushed the accumulated dashboard runtime aggregate batch ending at
    `3c5da34371e22aecb1a7aff0a185018870d35cec`, verified production Web
    build-info reached that SHA, and ran public API/Web smoke with
    `--no-workers`. The follow-up no-secret final preflight reports build-info
    and public smoke PASS while protected/formal V1 blockers remain open.
    Evidence:
    `docs/planning/deploy-freshness-3c5da343-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-3c5da343-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-3C5DA343-2026-05-09 qa: refresh public production UI access evidence for dashboard runtime batch`
  - Scope: refreshed the public/unauthenticated production access evidence for
    deployed `3c5da34371e22aecb1a7aff0a185018870d35cec`. Build-info matches
    the expected SHA, API health/readiness and public Web routes return HTTP
    200, and unauthenticated dashboard/admin routes redirect to `/auth/login`.
    The full module clickthrough remains blocked on authenticated/admin
    production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-3c5da343-task-2026-05-09.md`.

- [x] `CURRENT-EXECUTABLE-V1-BOUNDARY-3C5DA343-2026-05-09 release: clarify current executable V1 boundary`
  - Scope: updated active continuation state so future work starts from the
    verified deployed `3c5da34371e22aecb1a7aff0a185018870d35cec` boundary.
    The state now lists completed public/no-secret evidence and explicitly
    blocks protected V1 work on authenticated/admin app access, live-import
    auth, rollback auth, production DB/Coolify context, and RC approval
    identities. Evidence:
    `docs/planning/current-executable-v1-boundary-3c5da343-task-2026-05-09.md`.

- [x] `V1-PROTECTED-OPERATOR-HANDOFF-3C5DA343-2026-05-09 release: publish protected operator handoff`
  - Scope: published a concise no-secret operator handoff for remaining V1
    protected blockers on deployed `3c5da34371e22aecb1a7aff0a185018870d35cec`.
    The handoff lists required protected input names, command order,
    acceptance criteria, and evidence that must not be accepted as protected
    proof. Evidence:
    `docs/planning/v1-protected-operator-handoff-task-2026-05-09.md` and
    `docs/operations/v1-protected-operator-handoff-3c5da343-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-4EE1672E-2026-05-09 release: verify docs/evidence handoff batch deployment`
  - Scope: pushed the accumulated docs/evidence handoff batch ending at
    `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, verified production Web
    build-info reached that SHA, ran public API/Web smoke with `--no-workers`,
    and refreshed the no-secret final V1 preflight. Build-info and public
    smoke pass; protected V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-4ee1672e-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-4EE1672E-2026-05-09 qa: refresh public production UI access evidence for docs/evidence handoff batch`
  - Scope: refreshed the public/unauthenticated production access evidence for
    deployed `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`. Build-info matches
    the expected SHA, API health/readiness and public Web routes return HTTP
    200, and unauthenticated dashboard/admin routes redirect to `/auth/login`.
    The full module clickthrough remains blocked on authenticated/admin
    production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-4ee1672e-task-2026-05-09.md`.

- [x] `V1-NEXT-STEPS-PROTECTED-SHA-SYNC-2026-05-09 release: align protected continuation backlog with deployed SHA`
  - Scope: corrected active continuation backlog instructions so
    `LIVEIMPORT-03` and the final release gate target build-info-proven
    `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f` unless a newer intended
    candidate is deployed and proven by production build-info. Protected
    evidence remains blocked on auth/operator inputs. Evidence:
    `docs/planning/v1-next-steps-protected-sha-sync-task-2026-05-09.md`.

- [x] `CURRENT-FOCUS-4EE1672E-SYNC-2026-05-09 release: align active focus with current production SHA`
  - Scope: updated the first continuation view in
    `.agents/state/current-focus.md` to use current production
    `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, current public/no-secret
    evidence, and the protected preflight command for that SHA. Evidence:
    `docs/planning/current-focus-4ee1672e-sync-task-2026-05-09.md`.

- [x] `MVP-EXECUTION-PLAN-4EE1672E-PROGRESS-SYNC-2026-05-09 docs(planning): prepend current production progress`
  - Scope: prepended the latest `4ee1672e` continuation and protected
    readiness sync entries to the SYSFINAL progress log in
    `docs/planning/mvp-execution-plan.md`, preserving older history below.
    Evidence:
    `docs/planning/mvp-execution-plan-4ee1672e-progress-sync-task-2026-05-09.md`.

- [x] `SYSTEM-HEALTH-4EE1672E-TOPLINE-SYNC-2026-05-09 release: sync system health topline`
  - Scope: prepended the current production health snapshot in
    `.agents/state/system-health.md` so continuation runs see deployed
    `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, public/no-secret PASS
    evidence, `LIVEIMPORT-03` target sync, and protected V1 blockers before
    historical rollout notes. Evidence:
    `docs/planning/system-health-4ee1672e-topline-sync-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-55469CDC-2026-05-09 release: verify source-of-truth sync batch deployment`
  - Scope: pushed the 10-commit source-of-truth synchronization batch ending
    at `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`, verified production Web
    build-info reached that SHA, ran public API/Web smoke with `--no-workers`,
    and refreshed no-secret final V1 preflight for that SHA. Evidence:
    `docs/planning/deploy-freshness-55469cdc-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-55469cdc-2026-05-09.md`.

- [x] `V1-PROTECTED-OPERATOR-DOCS-55469CDC-SYNC-2026-05-09 release: retarget protected operator docs`
  - Scope: retargeted active protected-access readiness, production
    activation, activation audit, and operator handoff docs to current
    production build-info `55469cdc2ad888b822c8cdbd86660c4ed5166e1c` without
    closing protected V1 evidence. Evidence:
    `docs/planning/v1-protected-operator-docs-55469cdc-sync-task-2026-05-09.md`.

- [x] `MVP-EXECUTION-PLAN-55469CDC-PROGRESS-SYNC-2026-05-09 docs(planning): prepend current production progress`
  - Scope: prepended current `55469cdc` deploy freshness and protected
    operator-doc sync entries to the SYSFINAL progress log in
    `docs/planning/mvp-execution-plan.md`, preserving older history below.
    Evidence:
    `docs/planning/mvp-execution-plan-55469cdc-progress-sync-task-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-55469CDC-2026-05-09 qa: refresh public production UI access evidence`
  - Scope: refreshed public/unauthenticated production access evidence for
    deployed `55469cdc2ad888b822c8cdbd86660c4ed5166e1c`. Build-info matches
    the expected SHA, API health/readiness and public Web routes return HTTP
    200, and unauthenticated dashboard/admin routes redirect to `/auth/login`.
    The full module clickthrough remains blocked on authenticated/admin
    production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-55469cdc-task-2026-05-09.md`.

- [x] `UX-UI-MEMORY-AUTONOMY-2026-05-08 design: make UX/UI feedback memory autonomous`
  - Scope: extended the existing user feedback loop, design memory, and screen
    quality checklist so future UX/UI work classifies user guidance, stores it
    in the right source of truth, reviews memory before implementation, and
    asks the user only when feedback conflicts or changes global visual truth.
    Evidence:
    `docs/planning/ux-ui-memory-autonomy-process-task-2026-05-08.md`.

- [x] `EXCHANGE2-LIVE-READINESS-PLAN-2026-05-08 planning: stage second exchange adapter after V1 live readiness`
  - Scope: published and reconciled the safe staged delivery plan for adding
    `GATEIO` through approved exchange adapter boundaries. Planning is
    complete; the deployed foundation covers public catalog, public
    `FUTURES`/swap market-data source, runtime event context, and fail-closed
    Web/API gates. Paper pricing, authenticated reads, live submit, and cancel
    remain unsupported until exact operation support and evidence exist.
    Evidence:
    `docs/planning/second-exchange-live-readiness-plan-2026-05-08.md`.

- [x] `EXCHANGE2-20 planning: reconcile Gate.io second-exchange plan`
  - Scope: updated second-exchange planning/status truth after the deployed
    Gate.io foundation so future iterations do not reopen completed planning
    or infer unsupported paper/live/auth capabilities from public market-data
    support. Evidence:
    `docs/planning/exchange2-20-plan-reconciliation-task-2026-05-09.md`.

- [x] `EXCHANGE2-01 chore(exchange): register GATEIO as fail-closed placeholder`
  - Scope: add `GATEIO` to the Prisma/shared exchange catalogs and exact
    operation matrices while leaving all execution/read capabilities disabled.
    This makes Gate.io a recognized but unsupported exchange until each adapter
    operation is implemented and verified through the approved exchange module
    boundaries. Evidence:
    `docs/planning/exchange2-01-gateio-fail-closed-placeholder-task-2026-05-08.md`.

- [x] `EXCHANGE2-02 feat(exchange): enable Gate.io public market catalog`
  - Scope: enable only Gate.io `MARKET_CATALOG` via the existing exchange
    adapter registry/public read/catalog services, with no authenticated read
    or live execution capability. Gate.io public adapter failures must fail
    closed rather than returning sample markets. Evidence:
    `docs/planning/exchange2-02-gateio-public-market-catalog-task-2026-05-08.md`.

- [x] `EXCHANGE2-03 runtime: generalize market-event exchange boundary`
  - Scope: widen canonical runtime market events to carry registered exchanges
    so a future Gate.io market-data adapter can publish ticker/candle events
    through the existing runtime router without pretending to be Binance.
    Gate.io paper/live/authenticated capabilities remain disabled. Evidence:
    `docs/planning/exchange2-03-runtime-market-event-exchange-boundary-task-2026-05-08.md`.

- [x] `EXCHANGE2-04 feat(exchange): add Gate.io public ticker/candle reader`
  - Scope: add exchange-module public ticker and candle reads through the
    existing CCXT adapter registry, including Gate.io `FUTURES -> swap`
    mapping. Gate.io paper/live/authenticated capabilities remain disabled.
    Evidence:
    `docs/planning/exchange2-04-gateio-public-market-data-reader-task-2026-05-08.md`.

- [x] `EXCHANGE2-05 feat(market-stream): publish Gate.io public data as canonical events`
  - Scope: add an opt-in `MARKET_STREAM_EXCHANGE=GATEIO` market-stream
    polling worker that reads public ticker/candle data through the
    exchange-owned public market-data reader and publishes canonical
    `MarketStreamEvent` payloads with `exchange: GATEIO`. Binance websocket
    remains the default path, and Gate.io paper/live/authenticated capabilities
    remain disabled.
    Evidence:
    `docs/planning/exchange2-05-gateio-market-stream-polling-task-2026-05-08.md`.

- [x] `EXCHANGE2-06 test(runtime): lock Gate.io event consumption context`
  - Scope: add runtime regressions proving Gate.io ticker events and
    final-candle fallback ticker events preserve exact `exchange: GATEIO` and
    market-type context for runtime automation, while Gate.io
    `PAPER_PRICING_FEED` remains disabled.
    Evidence:
    `docs/planning/exchange2-06-gateio-runtime-consumption-regression-task-2026-05-08.md`.

- [x] `EXCHANGE2-07 test(market-stream): lock Gate.io polling source to fanout`
  - Scope: add a mocked Redis regression proving the Gate.io polling worker
    publishes ticker and final-candle events through the canonical
    market-stream fanout/subscriber path with exact `GATEIO` and market-type
    context. Gate.io `PAPER_PRICING_FEED`, authenticated reads, LIVE submit,
    and cancel remain disabled.
    Evidence:
    `docs/planning/exchange2-07-gateio-market-stream-fanout-regression-task-2026-05-08.md`.

- [x] `EXCHANGE2-08 qa(exchange): capture Gate.io public market-data smoke`
  - Scope: captured a real public read-only Gate.io adapter smoke through the
    existing exchange public market-data service. `GATEIO/FUTURES/BTCUSDT`
    ticker and `1m` candle reads passed without secrets, authenticated reads,
    exchange writes, or live orders. Gate.io paper/live/authenticated
    capabilities remain disabled.
    Evidence:
    `docs/planning/exchange2-08-gateio-public-market-data-smoke-task-2026-05-08.md`.

- [x] `EXCHANGE2-09 refactor(market-stream): lock Gate.io worker source selection`
  - Scope: extracted market-stream worker env parsing into
    `marketStreamWorkerConfig.ts` and added focused tests proving Binance is
    the default source, Gate.io polling is explicit opt-in through
    `MARKET_STREAM_EXCHANGE=GATEIO`, and unsupported/invalid env values fall
    back to safe defaults. Gate.io paper/live/authenticated capabilities remain
    disabled.
    Evidence:
    `docs/planning/exchange2-09-gateio-market-stream-worker-config-task-2026-05-08.md`.

- [x] `EXCHANGE2-10 test(web): lock Gate.io capability gating`
  - Scope: added focused Web coverage for `supportsExchangeCapability` so UI
    capability gating shows `GATEIO` as public-catalog only while paper
    pricing, live execution, and API-key probe remain blocked. Unknown/nullish
    exchange values fail closed.
    Evidence:
    `docs/planning/exchange2-10-gateio-web-capability-gating-task-2026-05-08.md`.

- [x] `EXCHANGE2-11 test(web): lock Gate.io wallet and bot form gating`
  - Scope: added product-facing Web form regressions so Gate.io PAPER wallet
    submit remains blocked while `PAPER_PRICING_FEED` is unsupported, and
    Gate.io bot activation cannot be toggled active from the create/edit form.
    Evidence:
    `docs/planning/exchange2-11-gateio-wallet-bot-ui-gating-task-2026-05-08.md`.

- [x] `EXCHANGE2-12 test(api): lock Gate.io wallet create fail closed`
  - Scope: added DB-backed API coverage proving direct Gate.io PAPER wallet
    creation fails closed with `EXCHANGE_NOT_IMPLEMENTED` for
    `PAPER_PRICING_FEED` and leaves no wallet persisted for the user. Gate.io
    paper/live/authenticated capabilities remain disabled.
    Evidence:
    `docs/planning/exchange2-12-gateio-api-wallet-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-13 test(api): lock Gate.io wallet update fail closed`
  - Scope: added wallet CRUD coverage proving an existing Binance PAPER wallet
    cannot be updated to `GATEIO` while `PAPER_PRICING_FEED` is unsupported,
    and the persisted wallet remains unchanged after rejection.
    Evidence:
    `docs/planning/exchange2-13-gateio-api-wallet-update-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-14 test(api): lock Gate.io stored API-key probe fail closed`
  - Scope: added API-key coverage proving a stored Gate.io placeholder key can
    exist, but its stored probe endpoint fails closed with
    `EXCHANGE_NOT_IMPLEMENTED` for `API_KEY_PROBE` and writes no misleading
    connection-test audit log.
    Evidence:
    `docs/planning/exchange2-14-gateio-stored-api-key-probe-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-15 test(api): lock Gate.io wallet balance preview fail closed`
  - Scope: added wallet coverage proving a stored Gate.io placeholder API key
    cannot be used for wallet balance preview while `BALANCE_PREVIEW`
    authenticated reads are unsupported, and the key is not marked used after
    rejection.
    Evidence:
    `docs/planning/exchange2-15-gateio-wallet-balance-preview-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-16 fix(api): lock Gate.io positions snapshot explicit key fail closed`
  - Scope: enforced the existing positions snapshot capability guard before
    test-mode fixture output or connector reads, mapped unsupported capability
    errors to HTTP 501 for the snapshot route, and added DB-backed coverage
    proving an explicit Gate.io `apiKeyId` is rejected while `lastUsed` stays
    unchanged.
    Evidence:
    `docs/planning/exchange2-16-gateio-positions-snapshot-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-17 fix(api): lock Gate.io reconciliation snapshots fail closed`
  - Scope: enforced the existing adapter capability guard before open-orders
    and trade-history test-mode snapshot output, preserved unsupported
    capability errors, and added DB-backed coverage proving Gate.io keys stay
    unused while those authenticated-read operations are disabled.
    Evidence:
    `docs/planning/exchange2-17-gateio-reconciliation-snapshots-fail-closed-task-2026-05-08.md`.

- [x] `EXCHANGE2-18 test(api): lock Gate.io live submit boundary`
  - Scope: added a focused exchange boundary regression proving Gate.io
    `LIVE_ORDER_SUBMIT` fails closed before credentials, connectors, pretrade
    guards, leverage convergence, or live order adapter creation are reached.
    Evidence:
    `docs/planning/exchange2-18-gateio-live-submit-boundary-task-2026-05-08.md`.

- [x] `EXCHANGE2-19 test(api): lock exchange-backed cancel route fail closed`
  - Scope: added route-level API coverage proving persisted exchange-backed
    open orders return HTTP 501 with `LIVE_ORDER_CANCEL_UNSUPPORTED` when
    canceled through `/dashboard/orders/:id/cancel`, and the order remains open
    with no cancellation audit log. Gate.io and all other exchange-side cancel
    capabilities remain disabled until a canonical adapter operation exists.
    Evidence:
    `docs/planning/exchange2-19-exchange-backed-cancel-route-fail-closed-task-2026-05-08.md`.

- [x] `DEPLOY-FRESHNESS-90CD07D6-2026-05-08 release: verify Gate.io fail-closed batch deployment`
  - Scope: verified production Web build-info for pushed `main`
    `90cd07d602f0a31f315719b8a5cd5be3fd112313` and reran public API/Web smoke
    successfully. Evidence:
    `docs/planning/deploy-freshness-90cd07d6-task-2026-05-08.md` and
    `docs/operations/deploy-freshness-90cd07d6-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-NODE-DEPLOY-CHECKS-2026-05-08 fix(ops): remove pnpm dependency from preflight deploy checks`
  - Scope: updated final V1 preflight to call bundled Node scripts directly for
    build-info and public smoke, added focused tests and node-based remediation
    hints, and generated a no-secret preflight report for deployed `90cd07d6`
    showing build-info/public smoke PASS with protected evidence blockers still
    fail-closed. Evidence:
    `docs/planning/v1-final-preflight-node-deploy-checks-task-2026-05-08.md`.

- [x] `PROD-UI-AUDIT-PLAN-2026-05-08 qa: execute production UI module clickthrough audit`
  - Scope: execute a production-wide UI audit across canonical public,
    dashboard, admin, and legacy redirect routes, clicking safe module
    functions and capturing screenshots, console/network evidence, responsive
    checks, accessibility notes, and architecture-alignment findings.
    Current production build-info and public UI access evidence are fresh for
    `745b5f5a45eab3f86b02e023479c8358f760bbf6`. Execution is blocked until
    authenticated/admin production app access, representative production test
    data, and explicit operator approval for live-money or destructive actions
    are available.
    Evidence plan:
    `docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`.
  - 2026-05-12 supersession: closed as superseded by the current V1
    release-gate UI evidence lane: `ops:ui:prod-clickthrough` with approved
    `PROD_UI_AUDIT_*` dashboard/admin auth. This is not accepted UI proof; the
    final gate still requires a fresh PASS `prod-ui-module-clickthrough-*`
    artifact.

- [x] `PROD-UI-AUDIT-CURRENT-BLOCKER-SYNC-55469CDC-2026-05-09 qa: sync production UI audit blocker`
  - Scope: synced the production UI clickthrough audit plan and active
    queue/context docs with deployed build-info `55469cdc`, removing stale
    deploy-blocker language while keeping the authenticated/admin blocker
    explicit. Evidence:
    `docs/planning/prod-ui-audit-current-blocker-sync-55469cdc-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-6C54BB5D-2026-05-09 release: verify protected-backlog sync batch deployment`
  - Scope: pushed the six-commit protected-backlog/source-of-truth sync batch
    ending at `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`, verified production
    Web build-info reached that SHA, ran public API/Web smoke with
    `--no-workers`, and refreshed no-secret final V1 preflight. Build-info and
    public smoke pass; protected V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-6c54bb5d-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-6c54bb5d-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-6C54BB5D-2026-05-09 qa: refresh public production UI access evidence`
  - Scope: refreshed public/unauthenticated production access evidence for
    deployed `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623`. Build-info matches
    the expected SHA, API health/readiness and public Web routes return HTTP
    200, and unauthenticated dashboard/admin routes redirect to `/auth/login`.
    The full module clickthrough remains blocked on authenticated/admin
    production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-6c54bb5d-task-2026-05-09.md`.

- [x] `OPERATOR-PROTECTED-PACK-6C54BB5D-SYNC-2026-05-09 release: retarget protected operator pack`
  - Scope: retargeted active protected command examples, activation plan,
    activation evidence audit, and known-issue state to deployed
    `6c54bb5d02e433af2e6ba1c1d3ed76c685ff6623` without closing protected
    evidence. Evidence:
    `docs/planning/operator-protected-pack-6c54bb5d-sync-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-C50E1E7C-2026-05-09 release: verify protected operator pack deployment`
  - Scope: verified the protected operator pack/source-of-truth sync batch
    reached production build-info
    `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`, ran public API/Web smoke with
    `--no-workers`, and refreshed no-secret final V1 preflight. Build-info and
    public smoke pass; protected V1 evidence remains blocked. Evidence:
    `docs/planning/deploy-freshness-c50e1e7c-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-c50e1e7c-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-C50E1E7C-2026-05-09 qa: refresh public production UI access evidence`
  - Scope: refreshed public/unauthenticated production access evidence for
    deployed `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`. Build-info matches
    the expected SHA, API health/readiness and public Web routes return HTTP
    200, and unauthenticated dashboard/admin routes redirect to `/auth/login`.
    The full module clickthrough remains blocked on authenticated/admin
    production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-c50e1e7c-task-2026-05-09.md`.

- [x] `DEPLOY-LAG-1F1D9C12-2026-05-09 release: wait for pushed evidence batch deployment`
  - Scope: pushed the two-commit docs/evidence batch ending at
    `1f1d9c12e0cc99884eced81546802a261b0925e9`, then waited 900 seconds plus
    two additional 300-second follow-up waits and a later 180-second follow-up
    wait for production build-info. Production
    remained on
    `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`, so `1f1d9c12` is not
    production-current in that historical window. Later production build-info
    advanced to the Gate.io source batch
    `010b4f8b6abfaf4c24d26550eb4761215d119f21`, so this is no longer an active
    deploy-freshness blocker.
    Evidence:
    `docs/planning/deploy-lag-1f1d9c12-task-2026-05-09.md` and
    `docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-CLICKTHROUGH-2026-05-08 qa: verify production public access and auth gates`
  - Scope: captured the public/unauthenticated portion of the production UI
    audit without claiming authenticated module coverage. API `/health` and
    `/ready` passed, public Web routes returned HTTP 200, and protected
    dashboard/admin routes redirected to `/auth/login` with HTTP 307. Build-info
    remains stale at `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d`, so the full
    clickthrough still requires latest deploy plus authenticated/admin access.
    Evidence:
    `docs/planning/prod-ui-public-access-clickthrough-task-2026-05-08.md`.

- [x] `PROD-UI-PUBLIC-ACCESS-REFRESH-90CD07D6-2026-05-09 qa: refresh public production UI access evidence`
  - Scope: refreshed the public/unauthenticated production access evidence for
    deployed `90cd07d602f0a31f315719b8a5cd5be3fd112313`. Build-info matches
    the expected SHA, API health/readiness and public Web routes return HTTP
    200, and unauthenticated dashboard/admin routes redirect to `/auth/login`.
    The full module clickthrough remains blocked on authenticated/admin
    production app access. Evidence:
    `docs/planning/prod-ui-public-access-refresh-90cd07d6-task-2026-05-09.md`.

- [x] `V1-FINAL-PREFLIGHT-REFRESH-90CD07D6-2026-05-09 release: refresh current no-secret V1 blocker report`
  - Scope: generated current no-secret final preflight reports for deployed
    `90cd07d602f0a31f315719b8a5cd5be3fd112313`. Build-info and public API/Web
    smoke passed, while release status remains `BLOCKED` on protected auth,
    production DB restore context, missing `LIVEIMPORT-03`, and stale
    2026-05-08 release evidence for the 2026-05-09 date. Evidence:
    `docs/planning/v1-final-preflight-refresh-90cd07d6-task-2026-05-09.md`.

- [x] `V1-PROD-ACTIVATION-REFRESH-2026-05-09 release: refresh production activation plan and audit`
  - Scope: created fresh 2026-05-09 production activation plan and activation
    evidence audit as `NO-GO` artifacts. Later 2026-05-09 sync retargeted
    those operator-facing artifacts to current production build-info
    `4ee1672e7a3ac6d9b549b4d461120afd7f89d68f`, while protected release
    blockers remain explicit. Evidence:
    `docs/planning/v1-production-activation-refresh-2026-05-09-task.md`.

- [x] `V1-RC-BLOCKED-REFRESH-2026-05-09 release: refresh RC evidence as current blocked`
  - Scope: added explicit RC evidence date support, regenerated RC external
    gates status, sign-off, and checklist for 2026-05-09 as blocked/open
    evidence, and reran the no-secret final preflight. RC blockers are now
    fresh `failed` instead of stale. Evidence:
    `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-09.md`.

- [x] `V1-ROLLBACK-PROOF-DATE-OVERRIDE-2026-05-09 fix(ops): date rollback proof evidence`
  - Scope: added explicit evidence-date support to the rollback proof
    generator so future authenticated operator runs can create artifacts for
    the intended release date. No production rollback proof artifact was
    accepted in this task. Evidence:
    `docs/planning/v1-rollback-proof-date-override-task-2026-05-09.md`.

- [x] `V1-RESTORE-DRILL-DATE-OVERRIDE-2026-05-09 fix(ops): date restore drill evidence`
  - Scope: added explicit evidence-date support to the restore drill evidence
    wrapper so future production DB/Coolify runs can create artifacts for the
    intended release date. No production restore drill artifact was accepted in
    this task. Evidence:
    `docs/planning/v1-restore-drill-date-override-task-2026-05-09.md`.

- [x] `V1-FINAL-BLOCKER-PACK-DATE-OVERRIDES-2026-05-09 release: sync final blocker pack date overrides`
  - Scope: synchronized the final V1 blocker execution pack with existing
    evidence-date override tooling. The pack now defines one `$releaseDate`
    and uses it for supported preflight, restore drill, rollback proof, RC
    evidence, and final gate commands. No production evidence was generated or
    accepted in this task. Evidence:
    `docs/planning/v1-final-blocker-pack-date-overrides-task-2026-05-09.md`.

- [x] `DEPLOY-FRESHNESS-4792FBCA-2026-05-09 release: verify current V1 evidence batch deployment`
  - Scope: pushed the current V1 release-evidence batch, verified production
    Web build-info for `4792fbca9ab3ca44d08c312f219f70d648707886`, and ran
    safe public API/Web smoke. Protected runtime/readback, restore, rollback,
    RC approval, and authenticated UI evidence remain open. Evidence:
    `docs/planning/deploy-freshness-4792fbca-task-2026-05-09.md` and
    `docs/operations/deploy-freshness-4792fbca-2026-05-09.md`.

- [x] `V1-FINAL-PREFLIGHT-4792FBCA-2026-05-09 release: refresh final preflight for deployed batch`
  - Scope: generated no-secret final V1 preflight artifacts for deployed
    `4792fbca`. Build-info and public smoke pass; protected release readiness
    remains blocked on auth, DB/Coolify context, RC approval, `LIVEIMPORT-03`,
    and current restore/rollback evidence. Evidence:
    `docs/planning/v1-final-preflight-4792fbca-task-2026-05-09.md` and
    `docs/operations/v1-final-preflight-4792fbca-2026-05-09.md`.

- [x] `V1-FINAL-BLOCKER-PACK-CANDIDATE-SHA-SYNC-2026-05-09 release: sync final blocker pack candidate SHA`
  - Scope: updated the final blocker execution pack to target the verified
    deployed candidate SHA `4792fbca9ab3ca44d08c312f219f70d648707886` for
    protected evidence, while warning that local evidence-only `HEAD` must not
    be used until build-info proves deployment. Evidence:
    `docs/planning/v1-final-blocker-pack-candidate-sha-sync-task-2026-05-09.md`.

- [x] `V1-CONTINUATION-EXPECTED-SHA-SNIPPETS-2026-05-09 release: align continuation expected-sha snippets`
  - Scope: updated active continuation commands in `.agents/state` so future
    runs use the verified deployed candidate
    `4792fbca9ab3ca44d08c312f219f70d648707886` and date-aware output paths
    for protected evidence examples, not local evidence-only `HEAD`. Evidence:
    `docs/planning/v1-continuation-expected-sha-snippets-task-2026-05-09.md`.

- [x] `V1-PROTECTED-ACCESS-READINESS-2026-05-09 release: provide protected final evidence inputs`
  - Scope: current shell lacks required protected env names for live-import
    auth and rollback auth. The readiness target is now selected dynamically
    from production `/api/build-info` by the final blocker execution pack;
    static historical SHAs are no longer the default protected evidence
    target. Final V1 evidence, rollback proof PASS, RC approval, and
    authenticated UI clickthrough remain blocked until operator inputs are
    supplied. Production DB restore context is currently satisfied by fresh
    evidence. Evidence:
    `docs/planning/v1-protected-access-readiness-task-2026-05-09.md` and
    `docs/operations/v1-protected-access-readiness-2026-05-09.md`. Current
    operator path:
    `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
  - 2026-05-12 supersession: this historical unchecked readiness item is
    closed as superseded by
    `V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12` and the
    current operator packet
    `docs/operations/v1-operator-unblock-packet-00169d7f-2026-05-12.md`.
    Protected evidence remains blocked; use the current packet instead of this
    older queue marker.

- [x] `OPEN-PROTECTED-BACKLOG-55469CDC-SYNC-2026-05-09 release: sync open protected backlog target`
  - Scope: synced open protected backlog entries to current production
    build-info `55469cdc2ad888b822c8cdbd86660c4ed5166e1c` without closing
    protected evidence. `V1-PROTECTED-ACCESS-READINESS`, `LIVEIMPORT-03`, and
    `BOTMULTI-09` remain blocked on authenticated/operator evidence. Evidence:
    `docs/planning/open-protected-backlog-55469cdc-sync-task-2026-05-09.md`.

- [x] `V1-CURRENT-PREFLIGHT-STATUS-SNAPSHOT-2026-05-08 release: publish current no-secret V1 preflight snapshot`
  - Scope: generated and committed the current no-secret final V1 preflight
    JSON/Markdown snapshot for deployed SHA
    `052df82244ea0f81e8611ff8bb2b677db115bd19`. The snapshot reports
    build-info PASS, public smoke PASS, production DB restore context
    SATISFIED, and current blockers limited to live-import auth/readback,
    rollback guard auth/proof, and RC Gate 4 approval evidence. Evidence:
    `docs/operations/_artifacts-v1-final-preflight-current.json`,
    `docs/operations/v1-final-preflight-current.md`, and
    `docs/planning/v1-current-preflight-status-snapshot-task-2026-05-08.md`.

- [x] `V1-FINAL-BLOCKER-PACK-RESTORE-STATE-SYNC-2026-05-08 release: sync final blocker pack after restore evidence`
  - Scope: synchronized the active final blocker pack and continuation state
    after deployed commit `721fe8482922835a9419f0e529baeef4ff6a74c9` confirmed
    build-info PASS, public smoke PASS, and production DB restore context
    SATISFIED by fresh backup/restore drill evidence. Current V1 blockers are
    limited to live-import auth/readback, rollback guard auth/proof, and RC
    Gate 4 approval evidence. Evidence:
    `docs/planning/v1-final-blocker-pack-restore-state-sync-task-2026-05-08.md`.

- [x] `V1-PROTECTED-AUTH-CONTEXT-SWEEP-2026-05-08 release: classify protected auth context after restore drill`
  - Scope: inspected approved Coolify/API runtime context without persisting
    secret values, confirmed no `LIVEIMPORT_READBACK_*` or
    `ROLLBACK_GUARD_*` auth env names are present, reran rollback proof and
    captured the expected fail-closed `401` evidence, and corrected
    `ops:release:v1:preflight` so fresh production restore drill evidence
    satisfies the production DB restore prerequisite instead of leaving a
    stale env blocker. Current preflight still blocks on live-import auth,
    rollback auth, RC Gate 4 approval evidence, missing `LIVEIMPORT-03`, and
    failed rollback proof. Evidence:
    `docs/planning/v1-protected-auth-context-sweep-task-2026-05-08.md`.

- [x] `V1-PROD-RESTORE-DRILL-COOLIFY-TERMINAL-2026-05-08 release: verify production restore drill execution path`
  - Scope: used approved Coolify terminal access for production Postgres
    container `x11cfnz1dd9x0yzccftqzcoe` to execute the isolated production
    restore drill. The corrected `set -eu` run created a compressed backup,
    created and restored into `postgres_restore_check_20260508151624`,
    validated key table counts, dropped the restore DB, removed the backup
    dump, and returned `RESULT: PASS`. Cleanup verification returned `0`
    matching restore databases and no `/tmp/postgres_backup_*.dump` files.
    Final preflight now reports backup/restore drill evidence as fresh.
    Evidence:
    `docs/planning/v1-prod-restore-drill-coolify-terminal-task-2026-05-08.md`.

- [x] `V1-PROTECTED-EVIDENCE-COOLIFY-CONTEXT-2026-05-08 release: resolve protected V1 evidence context`
  - Scope: used the approved Coolify operator path after the latest `main`
    deploy reached production build-info
    `e6e7d4a044ce80279c542412a91bae4a6a012392`. Public API/Web smoke passed.
    Coolify confirms production Postgres container
    `x11cfnz1dd9x0yzccftqzcoe`, but local Docker cannot see that remote
    container, so the existing Docker-based restore drill cannot honestly run
    as production evidence from this workstation. Generated no-secret
    protected-context preflight reports:
    `docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
    and
    `docs/operations/v1-final-preflight-2026-05-08-protected-context.md`.
    Evidence:
    `docs/planning/v1-protected-evidence-coolify-context-task-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-MARKDOWN-REPORT-2026-05-08 release: add no-secret markdown report`
  - Scope: added optional `--markdown-output <path>` support to
    `ops:release:v1:preflight`. The Markdown report is generated from the
    same no-secret preflight report object as JSON and summarizes context,
    public checks, protected prerequisites, release evidence, blockers,
    blocker details, and next actions for operator/Web handoff. Evidence:
    `docs/planning/v1-final-preflight-markdown-report-task-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-BLOCKER-DETAILS-2026-05-08 release: add structured blocker details`
  - Scope: added additive no-secret `blockerDetails` metadata to final V1
    preflight JSON reports. Known and unknown blockers now expose category,
    severity, protected-input requirement, final-evidence requirement,
    required capability tags, and remediation availability for later
    Web/operator status rendering without parsing blocker strings. Evidence:
    `docs/planning/v1-final-preflight-blocker-details-task-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-REMEDIATION-HINTS-2026-05-08 release: add preflight next actions`
  - Scope: added no-secret remediation hints to final V1 preflight CLI/JSON
    output. Known blocker IDs now point to the approved final blocker commands
    for build-info, public smoke, live-import readback, production restore
    drill, rollback proof, RC sign-off, gate refresh, and checklist sync.
    Validation PASS: syntax, focused tests, preflight, guardrails, docs parity,
    public smoke, and diff check. Evidence:
    `docs/planning/v1-final-preflight-remediation-hints-task-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-PUBLIC-SMOKE-2026-05-08 release: include public smoke in preflight`
  - Scope: extended `ops:release:v1:preflight` with the existing public deploy
    smoke command using `--no-workers`, added public-smoke state to JSON
    reports, and covered the skip path in focused tests. Current preflight
    reports build-info PASS and public API/Web smoke PASS before blocking on
    protected auth/DB/approval and evidence inputs. Validation PASS: syntax,
    focused tests, preflight, guardrails, docs parity, public smoke, and diff
    check. Evidence:
    `docs/planning/v1-final-preflight-public-smoke-task-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-JSON-REPORT-2026-05-08 release: add machine-readable preflight report`
  - Scope: added optional `--json-output <path>` support to
    `ops:release:v1:preflight` so later Web/operator visualization can consume
    a no-secret status snapshot without scraping terminal output. The report
    includes deploy freshness, prerequisite readiness, release evidence states,
    and blockers, but it is not final release evidence and contains no secret
    values. Validation PASS: syntax, focused tests, local no-auth JSON output,
    guardrails, docs parity, public smoke, and diff check. Evidence:
    `docs/planning/v1-final-preflight-json-report-task-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-REGRESSION-TESTS-2026-05-08 release: lock final V1 preflight checks`
  - Scope: added focused tests for `ops:release:v1:preflight` prerequisite
    classification so missing production auth/DB inputs fail closed, complete
    token or email/password alternatives pass, DB env families must be
    complete, optional OPS layers remain separate, and skipped build-info is
    testable without network calls. Validation PASS: syntax, focused tests,
    help, no-auth fail-closed preflight, guardrails, docs parity, public smoke,
    and diff check. Evidence:
    `docs/planning/v1-final-preflight-regression-tests-task-2026-05-08.md`.

- [x] `V1-FINAL-PREFLIGHT-COMMAND-2026-05-08 release: add final V1 operator preflight`
  - Scope: added `pnpm run ops:release:v1:preflight`, a read-only command that
    verifies current `HEAD` through web build-info, reports missing protected
    prerequisite env names, and classifies release evidence blockers through
    the existing release-gate model. The command exits non-zero and writes no
    protected production evidence artifacts when auth/DB/approval inputs are
    missing. Validation PASS: syntax, help, no-auth fail-closed preflight,
    guardrails, docs parity, public smoke, and diff check. Evidence:
    `docs/planning/v1-final-preflight-command-task-2026-05-08.md`.

- [x] `V1-RELEASE-STATE-SHA-HANDOFF-2026-05-08 release: keep deploy SHA verification dynamic`
  - Scope: updated the active final blocker handoff and continuation state so
    protected `LIVEIMPORT-03` and final V1 release-gate work starts by
    verifying the currently checked-out `HEAD` through the existing web
    build-info wait command. The previously verified RC approval hardening
    deploy `1100b7fb232ce6195b24522a6a11559fe9fb8634` is retained as
    historical evidence, not the permanent target for future readback.
    Validation PASS: guardrails, docs parity, public smoke, and diff check.
    Evidence:
    `docs/planning/v1-release-state-sha-handoff-task-2026-05-08.md`.

- [x] `V1-RELEASE-GATE-RC-APPROVAL-EVIDENCE-2026-05-08 release: require RC approval in V1 gate`
  - Scope: aligned `ops:release:v1:gate` with the final Gate 4 approval
    requirement by making RC external gates, sign-off, and checklist content
    checks fail closed when the artifacts are fresh but not approved. The
    refreshed dry-run now reports RC external gates, RC sign-off, and RC
    checklist as `failed` while Gate 4 remains open/blocked. Validation PASS:
    release-gate tests, syntax checks, dry-run report generation, guardrails,
    docs parity, public smoke, and diff check. Evidence:
    `docs/planning/v1-release-gate-rc-approval-evidence-task-2026-05-08.md`.

- [x] `V1-RELEASE-GATE-BUILD-INFO-FRESHNESS-2026-05-08 release: require deployed SHA in V1 gate`
  - Scope: added `--expected-sha` / `RELEASE_GATE_EXPECTED_SHA` to
    `ops:release:v1:gate` and reused the existing
    `ops:deploy:wait-web-build-info` command as a pre-smoke build-info
    freshness gate. The final blocker pack now passes `git rev-parse HEAD` to
    the final release gate. Validation PASS: release-gate tests, missing
    web-base-url failure path, dry-run report generation, guardrails, docs
    parity, public smoke, and diff check. Evidence:
    `docs/planning/v1-release-gate-build-info-freshness-task-2026-05-08.md`.

- [x] `V1-RELEASE-GATE-LIVEIMPORT-EVIDENCE-2026-05-08 release: require live-import readback in V1 gate`
  - Scope: aligned `ops:release:v1:gate` with the active `LIVEIMPORT-03`
    blocker by adding production-required live-import runtime readback evidence
    validation. The refreshed dry-run now blocks on
    `evidence:liveImportReadback:missing` until protected runtime readback is
    captured. Validation PASS: release-gate tests, syntax checks, dry-run
    report generation, guardrails, docs parity, and diff check. Evidence:
    `docs/planning/v1-release-gate-liveimport-evidence-task-2026-05-08.md`.

- [x] `V1-RELEASE-GATE-CURRENT-DRY-RUN-2026-05-08 release: refresh deployed-head V1 release gate dry-run`
  - Scope: generated a fresh production V1 release-gate dry-run on deployed
    HEAD `3f065ac5c24ff159f97a94a0bc98948a1739eadf` and synchronized the final
    blocker pack/state to the new report. Readiness remains `not_ready`:
    activation and RC families are fresh; backup/restore drill and rollback
    proof are fresh but failed; dry-run mode blocks final approval. Evidence:
    `docs/planning/v1-release-gate-current-dry-run-task-2026-05-08.md`.

- [x] `V1-RC-SIGNOFF-PREFLIGHT-HARDENING-2026-05-08 release(ops): clarify Gate 4 sign-off blockers`
  - Scope: updated the existing RC sign-off builder output so blocked Gate 4
    runs print the exact missing required fields. The approved-status logic is
    preserved: Gates 1-3 plus Engineering/Product/Operations/RC owner names
    are required, while owner contact is reported as recommended handoff
    metadata. Validation PASS: script syntax, help path, blocked and approved
    temp-output paths, guardrails, docs parity, and diff check. Evidence:
    `docs/planning/v1-rc-signoff-preflight-hardening-task-2026-05-08.md`.

- [x] `V1-RECOVERY-PROOF-PREFLIGHT-HARDENING-2026-05-08 release(ops): clarify recovery proof prerequisites`
  - Scope: clarified production restore drill and rollback proof prerequisite
    handoff in existing ops scripts and the final blocker pack. Restore help
    and missing-container failures now name accepted production DB env choices;
    rollback proof help names base URL, auth, and optional OPS env choices. No
    runtime/API/DB/Web/exchange/deploy or live-money behavior changed.
    Validation PASS: script syntax, help paths, missing prod DB container
    fail-closed path, guardrails, docs parity, and diff check. Evidence:
    `docs/planning/v1-recovery-proof-preflight-hardening-task-2026-05-08.md`.

- [x] `V1-LIVEIMPORT-AUTH-PREFLIGHT-HARDENING-2026-05-08 release(ops): clarify live-import auth preflight`
  - Scope: updated the existing `ops:liveimport:readback` missing-auth
    fail-closed message so an operator sees the exact accepted production auth
    variable choices without any secret values. Updated the final blocker pack
    and next-step state with the clarified handoff. Validation PASS: script
    syntax check, help path, dry-run path, no-auth fail-closed path with no
    artifact creation, repository guardrails, docs parity, and diff check.
    Evidence:
    `docs/planning/v1-liveimport-auth-preflight-hardening-task-2026-05-08.md`.

- [x] `V1-DEPLOY-FRESHNESS-STATE-SYNC-2026-05-08 docs(release): sync final blocker state to deployed SHA`
  - Scope: synchronized active V1 release state and the final blocker
    execution pack to production build-info SHA
    `0a2e2353177c15d4a4934c03837835785e01d710`, after the build-info wait and
    public smoke confirmed the pushed deploy coordination commit is live. This
    is a docs/release-state correction only; no runtime/API/DB/Web/exchange or
    live-money behavior changed. Remaining blockers stay protected:
    authenticated `LIVEIMPORT-03`, production restore drill, rollback proof,
    and Gate 4 sign-off.
    Evidence:
    `docs/planning/v1-deploy-freshness-state-sync-task-2026-05-08.md`.

- [x] `V1-PAPER-LIVE-BACKEND-RUNTIME-PARITY-2026-05-08 fix(api-runtime): keep execution orchestration adapter-pure`
  - Scope: fixed the shared PAPER/LIVE `executionOrchestrator` close-settlement
    path so entry-fee aggregation uses the existing runtime trade gateway
    boundary instead of reaching directly into Prisma when adapter gateways are
    injected. This keeps PAPER/LIVE parity tests database-free and preserves
    the default Prisma-backed gateway for real runtime execution. Validation
    PASS: focused engine parity/crash pack (`4/4` files, `26/26` tests), API
    typecheck, repository guardrails, sequential DB-backed runtime/order/
    exchange/import/readback packs, and full local API suite with test-only
    API-key encryption env. API build and workspace build also pass. Initial
    DB-backed runs were blocked only by an unhealthy `desktop-linux` Docker
    context; the `default` Docker context and local Postgres/Redis ports were
    reachable, and sequential reruns passed. Evidence:
    `docs/planning/v1-paper-live-backend-runtime-parity-task-2026-05-08.md`.
    Candidate commit: current task commit.

- [x] `V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07 fix(api): scope live import diagnostics status`
  - Scope: fixed `/dashboard/positions/live-status` so authenticated users see
    only their own live-import reconciliation diagnostics. The endpoint now
    filters diagnostics by user id and recomputes summary/count fields from the
    scoped payload, preserving the existing route and loop status contract while
    preventing cross-user diagnostic leakage. Validation PASS: pre-fix
    regression failed as expected, post-fix focused e2e (`3/3`), import
    diagnostics/service pack (`35/35`), API typecheck, repository guardrails,
    docs parity, and diff check. Evidence:
    `docs/planning/v1-live-import-status-isolation-task-2026-05-07.md`.

- [x] `V1-DASHBOARD-CRYPTO-ICONS-REGRESSION-2026-05-07 fix(web): restore dashboard crypto icon recovery`
  - Scope: fixed the shared `AssetSymbol` renderer so a previous image load
    failure no longer keeps dashboard asset rows stuck on fallback letters
    after the symbol or icon URL changes. This preserves the existing
    `/dashboard/icons/lookup` flow and adds focused regression coverage.
    Validation PASS: pre-fix regression failed as expected, post-fix component
    test (`4/4`), dashboard widget pack (`25/25`), Web typecheck, Web lint,
    repository guardrails, docs parity, and diff check. Evidence:
    `docs/planning/v1-dashboard-crypto-icons-regression-task-2026-05-07.md`.

- [x] `V1-PROD-GITHUB-ACTIONS-REGRESSION-CLEANUP-2026-05-07 release: remove GitHub Actions production path`
  - Scope: removed the invalid GitHub Actions production promotion/rollback
    path and the local helper that dispatched it. Active deployment state now
    points to Coolify/manual operator deployment plus repository-local
    verification gates. Evidence:
    `docs/planning/v1-prod-github-actions-regression-cleanup-task-2026-05-07.md`.

- [x] `V1-FINAL-BLOCKER-PREREQ-RECHECK-2026-05-07 release: recheck final blocker prerequisites`
  - Scope: rechecked the current shell against the final blocker execution
    pack. Production build-info matches
    `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`, but names-only env scan found
    no required Soar production auth/access. The live-import collector failed
    closed before protected readback, and the refreshed release-gate dry-run
    remains `not_ready`. Evidence:
    `docs/planning/v1-final-blocker-prerequisite-recheck-task-2026-05-07.md`.

- [x] `V1-FINAL-BLOCKER-PACK-2026-05-07 release: publish final blocker execution pack`
  - Scope: added
    `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`, a current
    operator pack for the remaining V1 blockers: `LIVEIMPORT-03`, production
    restore drill, rollback proof, RC gates/sign-off, and final non-dry-run
    release gate. Evidence:
    `docs/planning/v1-final-blocker-execution-pack-task-2026-05-07.md`.

- [x] `V1-CONTINUATION-STATE-SYNC-2026-05-07 release: sync continuation state after recovery blockers`
  - Scope: updated V1 continuation state so future runs target production SHA
    `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` for `LIVEIMPORT-03`, and state
    docs no longer describe local docs-only commits as deployed or synced.
    Evidence:
    `docs/planning/v1-continuation-state-sync-task-2026-05-07.md`.

- [x] `V1-PROD-RECOVERY-PROOF-BLOCKED-REFRESH-2026-05-07 release: refresh restore and rollback blockers`
  - Scope: generated current failed/blocked production recovery evidence.
    Rollback proof failed closed on protected `401` responses, and restore
    drill is recorded as not executed because production database/Coolify
    access is missing in this shell. Release-gate dry-run now classifies both
    recovery evidence families as `FAILED` rather than `stale`. Evidence:
    `docs/planning/v1-prod-recovery-proof-blocked-refresh-task-2026-05-07.md`.

- [x] `V1-RC-BLOCKED-REFRESH-2026-05-07 release: refresh RC evidence as blocked`
  - Scope: refreshed RC external gates status, RC sign-off, and RC checklist
    as current blocked/open evidence. Snapshot is `G1=PASS`, `G2=OPEN`,
    `G3=PASS`, `G4=OPEN`; sign-off is `BLOCKED`. Release-gate dry-run now
    treats RC status/sign-off/checklist as fresh while V1 remains `not_ready`.
    Evidence:
    `docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-07.md`.

- [x] `V1-PROD-ACTIVATION-REFRESH-2026-05-07 release: refresh production activation plan and audit`
  - Scope: created fresh 2026-05-07 production activation plan and activation
    evidence audit as honest `NO-GO` artifacts. Follow-up release-gate dry-run
    confirms activation audit and activation plan are fresh; remaining blockers
    are stale RC external gates status, RC sign-off, RC checklist,
    backup/restore drill evidence, rollback proof pack, and dry-run mode.
    Evidence:
    `docs/planning/v1-production-activation-plan-refresh-task-2026-05-07.md`.

- [x] `V1-PROD-GATE-DRY-RUN-2026-05-07 release: classify current production V1 gate blockers`
  - Scope: ran `ops:release:v1:gate` in production dry-run mode with
    protected execution steps skipped. Generated release-gate artifacts report
    `readiness=not_ready` because required production evidence is stale:
    activation audit, activation plan, RC external gates status, RC sign-off,
    RC checklist, backup/restore drill evidence, and rollback proof pack. The
    dry-run mode blocker remains explicit and no protected OPS, exchange, or
    live-money path was called. Evidence:
    `docs/planning/v1-prod-release-gate-dry-run-task-2026-05-07.md`.

- [x] `PROD-BUILDINFO-LAG-2026-05-07 release: record build-info lag after collector hardening push`
  - Scope: rechecked production build-info after `origin/main` advanced to
    `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3`. The canonical wait command
    timed out after six HTTP 200 polls with production still reporting
    `6bf5de83b8ed285410ecc10ecc50a2567ac68ee1`. Public API `/health` and
    `/ready` passed. No runtime, API, DB, exchange, deployment, or live-money
    behavior changed. Evidence:
    `docs/planning/prod-build-info-lag-after-collector-hardening-task-2026-05-07.md`.

- [x] `LIVEIMPORT-03-COLLECTOR-HARDENING-2026-05-07 fix(ops): fail closed empty runtime readback`
  - Scope: hardened the read-only live-import collector so no-session output
    cannot be mistaken for V1 runtime evidence. The collector now records
    bots-with-readback, bots-without-running-session, and unique visible
    symbols, then exits non-zero when no runtime positions payload was
    collected or when requested symbols are not visible in collected runtime
    readback. Validation PASS: syntax check, help, dry-run, missing-auth
    fail-closed, and a local no-running-session harness. Evidence:
    `docs/planning/liveimport-03-readback-collector-hardening-task-2026-05-07.md`.

- [x] `LIVEIMPORT-03-COLLECTOR-2026-05-07 release(ops): add redacted live-import readback collector`
  - Scope: added `ops:liveimport:readback`, a read-only helper for the active
    `LIVEIMPORT-03` blocker. The script reuses existing ops auth helpers,
    performs optional build-info freshness checks, reads existing protected
    bot runtime session position endpoints, redacts ids, and fails closed when
    production auth is missing. No API route, DB schema, exchange adapter,
    runtime execution, deployment, or live-money behavior changed. Validation
    PASS: help path, dry-run path, and missing-auth fail-closed path. Evidence:
    `docs/planning/liveimport-03-readback-collector-task-2026-05-07.md`.

- [x] `PROD-PROMOTE-PREQ-2026-05-07 release: recheck production promotion prerequisites after validated push`
  - Scope: after the validated local audit closure commits were pushed to
    `origin/main` at `1f816362c93e117e47cfe52a35e0fec93bd0b37d`, checked
    whether production was running that candidate. Production web build-info
    initially stayed on `834f83711ba11288829746338d1097abb6bf1c44` and the
    local build-info wait gate timed out, then a later rerun passed with
    production reporting `1f816362c93e117e47cfe52a35e0fec93bd0b37d`. Public
    API `/health`, API `/ready`, and web `/auth/login` are healthy. No
    runtime, API, DB, Web, deployment, exchange, or live-money behavior
    changed. Evidence:
    `docs/planning/prod-promotion-prerequisite-sweep-task-2026-05-07.md`.

- [x] `PLAN-SWEEP-2026-05-07 release: sync planning status after local audit gates`
  - Scope: swept active planning after `LIVEIMPORT-03` remained blocked by
    missing production read-only auth. Synchronized the top
    `mvp-execution-plan.md` progress log with the already-closed local audit
    gates through `FULLARCH-FIX-11` and the prerequisite sweep. No runtime,
    API, DB, Web, deployment, exchange, or live-money behavior changed.
    Evidence:
    `docs/planning/planning-status-sweep-after-local-audit-gates-task-2026-05-07.md`.

- [x] `LIVEIMPORT-03-PREQ-2026-05-07 release: recheck production readback prerequisites`
  - Scope: after local audit gates closed through `FULLARCH-FIX-11`, rechecked
    whether this shell can execute `LIVEIMPORT-03`. Names-only environment scan
    returned only `FIGMA_OAUTH_TOKEN` and `STITCH_API_KEY`; no production admin
    token, operator login, ops basic auth, bearer/session cookie, or Soar
    production auth variable name is present. No secret values, production
    writes, exchange writes, deploys, or live-money actions were used.
    `LIVEIMPORT-03` remains open. Evidence:
    `docs/planning/liveimport-03-production-readback-prerequisite-sweep-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-11 test(api-web): validate wallet market bot topology gate`
  - Scope: ran focused API and Web evidence for wallet/capital handling,
    market universe scope, bot create/edit/list behavior, single active bot
    market scope, multi-strategy links, subscription entitlements, and the UI
    forms/tables that configure those contracts. No code, schema, deployment,
    exchange, or live-money behavior changed. Validation PASS: API pack
    (`11/11` files, `80/80` tests) and Web pack (`21/21` files, `49/49`
    tests). Evidence:
    `docs/planning/fullarch-fix-11-wallet-market-bot-topology-gate-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-10 test(api-web): validate market stream dashboard monitoring gate`
  - Scope: ran focused API and Web evidence for market stream ingestion/fanout
    routes and dashboard/bot monitoring surfaces after the Web navigation mock
    harness repair. No code, schema, deployment, or live-money behavior
    changed. Validation PASS: API pack (`9/9` files, `63/63` tests) and Web
    pack (`19/19` files, `79/79` tests). Evidence:
    `docs/planning/fullarch-fix-10-market-dashboard-monitoring-gate-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-09 test(api-web): validate strategy backtest reports logs gate`
  - Scope: ran focused API and Web evidence for strategy/indicator parity,
    backtest execution/replay, reports, and logs/audit trail after the Web
    navigation mock harness repair. No code, schema, deployment, or live-money
    behavior changed. Validation PASS: API pack (`12/12` files, `92/92`
    tests) and Web pack (`21/21` files, `49/49` tests). Evidence:
    `docs/planning/fullarch-fix-09-strategy-backtest-reports-logs-gate-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-08 test(api-security): validate local security and isolation release gate`
  - Scope: ran the focused local API security/isolation release-gate pack
    covering rate limiting, auth/session, trusted origin, security headers,
    API-key ownership/encryption, profile security, subscription/admin
    authorization, upload, bot entitlements, and cross-module user-data
    isolation. No code, schema, UI, deployment, or live-money behavior changed.
    Validation PASS: `18/18` files and `87/87` tests with sequential
    execution and test-only API-key encryption env. Evidence:
    `docs/planning/fullarch-fix-08-security-isolation-release-gate-task-2026-05-07.md`.

- [x] `FULLARCH-AUDIT-SYNC-2026-05-07 docs(planning): sync full architecture audit repair queue`
  - Scope: updated the full architecture conformance audit report so its
    prioritized repair queue reflects the completed local chain
    `FULLARCH-FIX-01..07` and leaves only authenticated `LIVEIMPORT-03`
    production readback, then `BOTMULTI-09`, as remaining release evidence.
    No code, schema, UI, deployment, or live-money behavior changed.
    Validation PASS: names-only auth env scan, repository guardrails, docs
    parity, and diff check. Evidence:
    `docs/planning/fullarch-audit-repair-queue-sync-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-07 test(api-runtime): validate runtime repair closure pack after import fixes`
  - Scope: ran the focused post-repair runtime validation pack covering signal
    merge/final-candle/loop, pre-trade and risk, execution orchestration,
    exchange events, order and position lifecycle, imported-position DCA
    visibility, takeover readback, and position automation. No code, schema,
    UI, deployment, or live-money behavior changed. Validation PASS:
    `16/16` files and `240/240` tests with sequential execution. Evidence:
    `docs/planning/fullarch-fix-07-runtime-repair-closure-validation-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-06 fix(api-positions): lock Binance futures position snapshot normalization`
  - Scope: Binance futures snapshots now normalize signed `positionAmt` into
    positive `contracts`, derive one-way `LONG`/`SHORT` from
    `positionSide=BOTH` plus amount sign, and preserve explicit adapter
    `position.side` as highest-priority truth. Added regression coverage for
    one-way short, hedge-mode short, and multi-position snapshots. Validation
    PASS: pre-fix normalizer regression failed as expected (`3 failed`),
    normalizer suite (`5/5`), focused import/reconciliation/takeover pack
    (`42/42`), and API typecheck. Evidence:
    `docs/planning/fullarch-fix-06-binance-futures-position-normalization-task-2026-05-07.md`.

- [x] `AOS-STATE-ENV-2026-05-07 docs(agent-os): capture safe environment scan guardrail`
  - Scope: recorded a verified secret-adjacent execution pitfall in the
    learning journal: production auth prerequisite scans must print
    environment variable names only and must not project secret values by
    default. This docs-only security guardrail does not close `LIVEIMPORT-03`;
    authenticated read-only production runtime readback remains the next real
    evidence task. Validation PASS: names-only env scan, repository
    guardrails, and diff check. Evidence:
    `docs/planning/aos-state-env-scan-secret-safety-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-05 fix(api-bots): close single active bot scope root-suite failures`
  - Scope: bot market-group writes now fail closed with a controlled `409`
    when a request would create or activate a second enabled `ACTIVE` market
    scope for the same bot. Stale API e2e fixtures were realigned to the
    approved post-V1 topology: one active bot market scope with multiple
    ordered strategy links. Manual order fixtures now include wallet ownership
    proof for exchange-synced LIVE open orders and clean backtest rows before
    deleting users. Validation PASS: focused API blocker pack (`6/6` files,
    `59/59` tests), API typecheck, root workspace tests (`api 174/174 files,
    1163/1163 tests; web 145/145 files, 482/482 tests`), lint, guardrails,
    docs parity, and diff check. Evidence:
    `docs/planning/fullarch-fix-05-api-single-active-bot-scope-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-04 fix(web-tests): repair next/navigation mock harness drift`
  - Scope: local Web tests that mock `next/navigation` now expose the
    `usePathname` contract required by `I18nProvider`, matching the global
    Vitest setup and restoring trustworthy Web regression evidence. No
    production Web, API, DB, exchange, deployment, or live-money behavior
    changed. Validation PASS: focused route/form harness pack (`13/13` files,
    `22/22` tests), full Web test suite (`145/145` files, `482/482` tests),
    Web typecheck, and local mock scan. Root workspace test now proceeds past
    Web and exposes remaining API e2e failures around bot market-group
    creation/unique `botId` constraints, manual LIVE exchange-synced
    open-order visibility, and stale DB cleanup FK residue. Evidence:
    `docs/planning/fullarch-fix-04-web-navigation-mock-harness-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-03 feat(api-positions): add live import reconciliation diagnostics`
  - Scope: live position reconciliation now returns structured
    per-symbol diagnostics and stores the last run diagnostics on loop status.
    Diagnostics include outcome, ownership status, management mode, sync state,
    continuity state, projected bot/wallet/strategy ids, bot visibility, and a
    reason. This is additive only: no import ownership, exchange, schema,
    Web, or live-money behavior changed. Validation PASS: focused
    diagnostics/import/ownership/takeover pack (`47/47`), API typecheck.
    Evidence:
    `docs/planning/fullarch-fix-03-reconciliation-diagnostics-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-02 test(api-runtime): cover six-position import/readback path`
  - Scope: added a DB-backed runtime takeover regression that creates one
    active opted-in LIVE bot with a canonical six-symbol market scope, mocks
    six exchange positions, runs reconciliation through the real ownership
    resolver/default DB-backed deps, verifies all six DB rows are
    `BOT_MANAGED`, `IN_SYNC`, `CONFIRMED`, and verifies selected-bot runtime
    readback returns all six symbols. No import, ownership, exchange, schema,
    Web, or live-money behavior changed. Validation PASS: runtime takeover e2e
    (`5/5`), focused import/ownership/takeover pack (`46/46`), API typecheck,
    repository guardrails. Evidence:
    `docs/planning/fullarch-fix-02-six-position-import-readback-regression-task-2026-05-07.md`.

- [x] `FULLARCH-FIX-01 fix(api-runtime): restore recovered imported position visibility`
  - Scope: runtime bot position readback now includes the narrow recovered
    imported LIVE position state required by architecture:
    `origin=EXCHANGE_SYNC`, `continuityState=RECOVERED_UNACTIONABLE`, and
    `syncState=DRIFT`. Actionability remains fail-closed because runtime
    serialization still requires `continuityState=CONFIRMED` plus bot and
    strategy context before automation can act. No ownership proof, exchange,
    DB schema, Web, or live-money behavior changed. Validation PASS: focused
    runtime takeover e2e (`4/4`), focused import/ownership/takeover pack
    (`45/45`), API typecheck, repository guardrails. Evidence:
    `docs/planning/fullarch-fix-01-recovered-imported-position-visibility-task-2026-05-07.md`.

- [x] `FULLARCH-AUDIT-2026-05-07 research(system): audit V1 functions against architecture`
  - Scope: mapped product/architecture-declared V1 functions across auth,
    profile/API keys, wallets/capital, markets/symbol scopes, strategies,
    bots/topology, runtime signal and pre-trade, order/position lifecycle,
    live import/takeover, exchange adapters, market stream, backtests,
    reports/logs, dashboard/bot monitoring, i18n/UI states, admin/subscription
    scope, assistant runtime, security/isolation, deployment/workers, and
    mobile scaffold status. Validation: root typecheck PASS, root lint PASS,
    full test command FAIL with classified issues: one confirmed API runtime
    takeover visibility regression and broad Web harness failures around
    `next/navigation.usePathname` mocks plus dashboard timeouts. Evidence:
    `docs/planning/full-architecture-conformance-audit-task-2026-05-07.md`.

- [x] `LIVEIMPORT-AUDIT-2026-05-07 research(api-runtime): audit exchange import against bot ownership architecture`
  - Scope: reviewed architecture and implementation from exchange snapshot
    normalization through live reconciliation, exact external ownership,
    canonical symbol scope, and bot runtime position readback. Found one
    confirmed contract regression: recovered imported LIVE positions with
    `RECOVERED_UNACTIONABLE`/`DRIFT` are hidden from the bot runtime positions
    endpoint even though architecture and e2e expectations require them to be
    visible but non-actionable. Ranked likely causes for the reported one-of-six
    import symptom and defined the next repair slice: visibility fix,
    six-position DB-backed import/readback regression, per-symbol diagnostics,
    and Binance futures normalization coverage. Validation: focused API pack
    produced `44 passed, 1 failed`, with the failing test matching the
    recovered-position visibility mismatch. Evidence:
    `docs/planning/live-import-runtime-architecture-audit-task-2026-05-07.md`.

- [x] `AOS-STATE-2026-05-07 docs(agent-os): sync continuation state to production readback queue`
  - Scope: synchronized `.agents/state/*` after the agent operating system
    foundation so future short-nudge runs see the actual active blocker:
    `LIVEIMPORT-03` requires authenticated read-only production ETH/DOGE
    runtime readback, and `BOTMULTI-09` still requires protected runtime and V1
    gate evidence. No runtime, API, DB, deployment, or UI behavior changed.
    Validation PASS: queue scan with PowerShell fallback after known local
    `rg` access failure, environment-variable name scan confirming no
    production auth material in this shell, repository guardrails, and
    `git diff --check`. Evidence:
    `docs/planning/agent-state-production-readback-sync-task-2026-05-07.md`.

- [x] `AOS-2026-05-07 docs(agent-os): establish autonomous agent operating system`
  - Scope: created `.agents/core/operating-system.md`,
    `.agents/core/execution-loop.md`, `.agents/core/anti-regression.md`, and
    `.agents/core/quality-gates.md`; added `.agents/state/current-focus.md`,
    `known-issues.md`, `regression-log.md`, `system-health.md`, and
    `next-steps.md`; added agent-readable `docs/flows`, `docs/contracts`, and
    `docs/testing` indexes; linked continuation behavior from `AGENTS.md`,
    documentation indexes, project state, and planning. This is a docs-only
    operating-system slice with no runtime, API, DB, deployment, or UI behavior
    change. Evidence:
    `docs/planning/agent-operating-system-task-2026-05-07.md`.

- [x] `V1UI-41 fix(web-runtime): fail closed dashboard open-order status`
  - Scope: Dashboard Home open-order status cells now keep the shared known
    status mapping but fail closed to the existing compact unknown display for
    unsupported backend status values instead of rendering raw API strings.
    No new dashboard label, badge, status marker, backend behavior, database
    path, or exchange execution behavior changed. Validation PASS: focused
    Dashboard Home table presenter test (`17/17`), Web typecheck, root
    API+Web typecheck, Web lint, repository guardrails, route-reachable i18n
    audit (`findings=0`), full workspace build, `git diff --check`, and
    authenticated rendered `/dashboard` smoke with no framework overlay or
    post-auth console errors. Browser plugin validation was attempted first
    but local `node_repl` resolved Node `v22.13.0` while requiring
    `>=22.22.0`, so rendered validation used bundled Codex Node plus
    Playwright. Evidence:
    `docs/planning/v1ui-41-open-order-status-fail-closed-task-2026-05-07.md`.

- Operator-reported LIVE/PAPER runtime follow-ups are queued after
  `LIVEIMPORT-02`; execute exactly one unchecked task per iteration.

- [x] `OPS-REDIS-20260507 recover production Redis AOF corruption`
  - Scope: production Redis in Coolify was `Restarting (unhealthy)` with over
    670 restarts, causing API `/ready` to return `503` while `/health` stayed
    `200`. Logs identified bad AOF format in
    `appendonly.aof.5.incr.aof`. Recovery stopped the crash-looping Redis
    container, created a Redis volume backup, ran `redis-check-aof --fix`,
    restarted Redis, and verified Coolify Redis `Running (healthy)`, API
    `/ready` `200`, API `/health` `200`, and web `/auth/login` `200`.
    Evidence: `docs/operations/redis-aof-recovery-2026-05-07.md`.

- [x] `V1UI-40 fix(web-runtime): fail closed unknown runtime signal labels`
  - Scope: closed a TESTER-mode runtime signal label hardening slice. Shared
    Dashboard/Bots runtime signal label resolvers now explicitly tolerate
    unknown backend strings and fail closed to unresolved suffixes. Focused
    Dashboard Home and Bots Monitoring tests prove unexpected market state and
    context source values render existing unresolved labels instead of raw
    backend strings or invented semantics. No backend, database, exchange
    execution, displayed copy, or styling behavior changed. Validation PASS:
    focused suffix/Dashboard/Bots tests (`10/10`), Web typecheck, Web lint,
    repository guardrails, route-reachable i18n audit (`findings=0`),
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke after dev-server restart with no visible framework
    overlay, console warnings/errors, page errors, or 5xx responses. Browser
    plugin validation was attempted first but local `node_repl` resolved Node
    `v22.13.0` while requiring `>=22.22.0`, so rendered validation used
    bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-40-runtime-signal-label-unknown-values-task-2026-05-07.md`.

- [x] `V1UI-39 refactor(web-runtime): share runtime signal label suffixes`
  - Scope: closed an ARCHITECT-mode Dashboard/Bots runtime label semantics
    slice. Dashboard Home and Bots Monitoring both render backend runtime
    signal context source and market state values, but their enum-to-label
    branching could drift. Web now resolves those backend values through
    shared suffix helpers while Dashboard Home keeps
    `dashboard.home.runtime.*` labels and Bots Monitoring keeps
    `dashboard.bots.monitoring.*` labels. No backend, database, exchange
    execution, displayed copy, or styling behavior changed. Validation PASS:
    focused suffix/Dashboard/Bots tests (`8/8`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke after dev-server restart with no visible framework
    overlay, console warnings/errors, page errors, or 5xx responses. Browser
    plugin validation was attempted first but local `node_repl` resolved Node
    `v22.13.0` while requiring `>=22.22.0`, so rendered validation used
    bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-39-shared-runtime-signal-label-suffixes-task-2026-05-07.md`.

- [x] `V1UI-38 feat(web-runtime): show dashboard session failure detail`
  - Scope: closed a BUILDER-mode Dashboard Home session diagnostics parity
    slice. Runtime session read models already expose `errorMessage` and
    `stopReason`; Dashboard Home now renders that backend detail inside the
    existing inactive-session warning using message-first, stop-reason
    fallback precedence and keeps the warning generic when both fields are
    absent. Validation PASS: focused RuntimeSidebarSection tests (`13/13`),
    route-reachable i18n audit (`findings=0`), Web typecheck, Web lint,
    repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke after dev-server restart with no
    visible framework overlay, console warnings/errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-38-dashboard-session-failure-detail-task-2026-05-07.md`.

- [x] `V1UI-37 feat(web-runtime): show dashboard signal market state`
  - Scope: closed a BUILDER-mode Dashboard Home runtime-state parity slice.
    The operator surface architecture requires runtime market surfaces to
    distinguish open-position, accepted-signal, evaluated/no-trade,
    configured-only snapshot, and unresolved states. Dashboard Home signal
    cards now render a compact badge from the backend `runtimeMarketState`
    field using route-owned `dashboard.home.runtime.marketState*` labels,
    while keeping existing context source, score, detail, and condition
    rendering intact. Validation PASS: focused RuntimeSignalsSection tests
    (`5/5`), route-reachable i18n audit (`findings=0`), Web typecheck, Web
    lint, repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke after dev-server restart with no
    visible framework overlay, console warnings/errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-37-dashboard-signal-market-state-badge-task-2026-05-07.md`.

- [x] `V1UI-36 fix(web-i18n): restore de-CH exchange order id parity`
  - Scope: closed an ARCHITECT-mode i18n structure slice. Runtime order
    surfaces already render backend `exchangeOrderId` in Dashboard Home and
    Bots Monitoring, and EN/PL/PT namespaces already had the matching labels,
    but `de-CH` was missing `dashboard.home.runtime.exchangeOrderId` and
    `dashboard.bots.monitoring.table.exchangeOrderId`. The German-Swiss
    namespaces now include both labels as `Exchange-ID`, restoring full
    supported-locale key parity for the exchange order identifier. Validation
    PASS: focused i18n parity tests (`9/9`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, and full workspace build. Evidence:
    `docs/planning/v1ui-36-de-ch-exchange-order-id-i18n-parity-task-2026-05-07.md`.

- [x] `V1UI-35 feat(web-runtime): show dashboard signal runtime detail`
  - Scope: closed a TESTER-mode Dashboard Home signal diagnostics parity
    slice. API runtime symbol stats and Web types already expose
    `lastSignalMessage` and `lastSignalReason`, and Bots Monitoring already
    renders those fields as runtime detail; Dashboard Home signal cards now
    render the same backend detail using message-first, reason-second
    precedence and render no invented fallback when both fields are absent.
    Validation PASS: focused RuntimeSignalsSection tests (`4/4`),
    route-reachable i18n audit (`findings=0`), Web typecheck, Web lint,
    repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke after dev-server restart with no
    visible framework overlay, console warnings/errors, page errors, or 5xx
    responses. Browser plugin validation was attempted first but local
    `node_repl` resolved Node `v22.13.0` while requiring `>=22.22.0`, so
    rendered validation used bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-35-dashboard-signal-runtime-detail-task-2026-05-07.md`.

- [x] `V1UI-34 feat(web-runtime): show signal score summary`
  - Scope: closed a BUILDER-mode Dashboard Home signal diagnostics parity
    slice. API runtime symbol stats already expose
    `lastSignalScoreSummary.longScore/shortScore`; Dashboard Home now renders
    those backend scores as a compact localized LONG/SHORT score row on signal
    cards when present, and renders no score row when the backend summary is
    absent. Validation PASS: focused RuntimeSignalsSection tests (`3/3`),
    route-reachable i18n audit (`findings=0`), Web typecheck, Web lint,
    repository guardrails, `git diff --check`, full workspace build, and
    authenticated rendered `/dashboard` smoke with reload and account-menu
    interaction with no visible framework overlay, console errors, page
    errors, or 5xx responses. Browser plugin validation was attempted first
    but local `node_repl` resolved Node `v22.13.0` while requiring
    `>=22.22.0`, so rendered validation used bundled Codex Node plus
    Playwright. Evidence:
    `docs/planning/v1ui-34-dashboard-signal-score-summary-task-2026-05-07.md`.

- [x] `V1UI-33 refactor(web-runtime): share mark-price source label suffix`
  - Scope: closed an ARCHITECT-mode Dashboard Home/Bots runtime label
    semantics slice. Mark-price source kind suffix mapping now lives in the
    shared open-position derivation utility, while each route still owns its
    translation prefix (`dashboard.bots.monitoring.*` for Bots and
    `dashboard.home.runtime.*` for Dashboard Home). Validation PASS: focused
    Dashboard Home presenter tests (`16/16`), focused runtime open-position
    derivation tests (`4/4`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke with reload and CTA interaction with no visible
    framework overlay, console errors, page errors, or 5xx responses. Browser
    plugin validation was attempted first but local `node_repl` resolved Node
    `v22.13.0` while requiring `>=22.22.0`, so rendered validation used
    bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-33-shared-mark-price-source-suffix-task-2026-05-07.md`.

- [x] `V1UI-32 fix(web-dashboard): close route-owned copy leaks`
  - Scope: closed a BUILDER-mode Dashboard Home copy-ownership slice.
    Remaining `/dashboard` runtime presentation labels no longer depend on
    `dashboard.bots.*`: placeholder badge/hint, strategy labels, and
    mark-price source labels now resolve through `dashboard.home.runtime.*`
    across all supported locales. Shared Bots mark-price semantics remain
    unchanged for Bots surfaces. Validation PASS: focused Dashboard Home
    presenter/sidebar tests (`25/25`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke with no console errors or page errors. Browser plugin
    validation was attempted first but local `node_repl` resolved Node
    `v22.13.0` while requiring `>=22.22.0`, so rendered validation used
    bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-32-dashboard-home-route-owned-copy-closure-task-2026-05-07.md`.

- [x] `V1UI-31 fix(web-dashboard): keep runtime labels route-owned`
  - Scope: closed a BUILDER-mode route ownership cleanup slice. Dashboard
    Home runtime/history presentation no longer borrows
    `dashboard.bots.monitoring.*` labels for closed-position entry/exit columns
    or the advanced-options control. The route now owns those labels through
    `dashboard.home.runtime.*` across all supported locales while backend
    runtime data mapping remains unchanged. Validation PASS: focused runtime
    table presenter tests (`15/15`), route-reachable i18n audit
    (`findings=0`), Web typecheck, Web lint, repository guardrails,
    `git diff --check`, full workspace build, and authenticated rendered
    `/dashboard` smoke with no console errors or page errors. Browser plugin
    validation was attempted first but local `node_repl` resolved Node
    `v22.13.0` while requiring `>=22.22.0`, so rendered validation used
    bundled Codex Node plus Playwright. Evidence:
    `docs/planning/v1ui-31-dashboard-home-route-owned-runtime-labels-task-2026-05-07.md`.

- [x] `V1UI-30 fix(web-auth): fail closed pre-hydration auth submit`
  - Scope: closed a TESTER-mode auth entrypoint safety slice. Login/Register
    now render native `POST` forms with disabled fieldsets before hydration,
    enable controls only after the client is ready, and document-navigate to
    `/dashboard` after successful session confirmation. This prevents early
    native submit from leaking credentials into URL query strings and removes
    the auth success-toast redirect side effect while preserving error toasts
    and inline errors. Validation PASS: focused Web auth/navigation tests
    (`19/19`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, `git diff --check`, full workspace
    build, and rendered auth smoke covering SSR `/auth/register` and
    `/auth/login` plus desktop register and mobile login flows to `/dashboard`
    with no credential URL leak and no relevant console/page/5xx errors.
    Evidence:
    `docs/planning/v1ui-30-auth-form-prehydration-fail-closed-task-2026-05-07.md`.

- [x] `V1UI-29 fix(runtime-orders): fail closed exchange-backed local cancel`
  - Scope: closed a BUILDER-mode API/Web order-action parity slice. The
    exchange execution boundary keeps `LIVE_ORDER_CANCEL` unsupported, so
    exchange-backed open orders carrying `exchangeOrderId` must not be locally
    canceled or locally marked filled from dashboard actions. API cancel now
    fails closed with an explicit unsupported cancel error, API close refuses
    exchange-backed local fill closure, and Dashboard Home renders an
    unsupported-cancel action state instead of a cancel button. Validation
    PASS: focused API orders tests (`38/38`), focused Web runtime table
    presenter tests (`15/15`), API typecheck, Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console errors, page errors, or 5xx responses. Evidence:
    `docs/planning/v1ui-29-exchange-backed-order-cancel-fail-closed-task-2026-05-07.md`.

- [x] `V1UI-28 fix(web-runtime): show manual-order blocked reason`
  - Scope: closed a BUILDER-mode manual-order diagnostics parity slice.
    `UOLF` requires manual-order lifecycle states to include a blocked reason,
    but failed `POST /dashboard/orders/open` submissions were only visible in
    a transient toast. Dashboard Home now persists the resolved backend/API
    submit error, renders it in the manual-order action-state panel with
    blocked/error semantics, and clears stale blocked truth when the operator
    edits the next draft. Validation PASS: focused manual-order/sidebar tests
    (`25/25`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke on desktop and mobile with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-28-manual-order-blocked-reason-state-task-2026-05-07.md`.

- [x] `V1UI-27 fix(web-runtime): show manual-order exchange id`
  - Scope: closed an ARCHITECT-mode manual-order response parity slice.
    `POST /dashboard/orders/open` already returns `exchangeOrderId` for LIVE
    exchange-backed orders, but the Web manual-order response type and
    lifecycle panel hid it. Dashboard Home now types the field, shows Exchange
    ID in the action-state block when present, and maps `OPEN + exchange id`
    to the existing imported-open-order lifecycle copy. Validation PASS:
    focused manual-order/sidebar tests (`20/20`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console warnings, console errors, or page errors.
    Evidence:
    `docs/planning/v1ui-27-manual-order-exchange-id-state-task-2026-05-07.md`.

- [x] `V1UI-26 fix(web-runtime): show open-order exchange id`
  - Scope: closed a BUILDER-mode backend-to-Web parity slice. Runtime
    open-order reads already carry backend `exchangeOrderId` for LIVE and
    exchange-synced rows, but Dashboard Home and Bot Monitoring did not type
    or render it. Web now adds an Exchange ID column to both Open Orders
    surfaces and renders `-` when the backend value is absent. Validation
    PASS: focused Web regressions (`28/28`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console warnings, console errors, or page errors.
    Evidence:
    `docs/planning/v1ui-26-open-order-exchange-id-parity-task-2026-05-07.md`.

- [x] `V1UI-25 fix(web-runtime): show submitted manual-order state`
  - Scope: closed a TESTER-mode UOLF lifecycle visibility slice. Dashboard
    Home now renders the localized `order submitted` action state in the
    manual-order panel while `POST /dashboard/orders/open` is in flight,
    without showing a synthetic order id before backend persistence. The
    response-derived waiting/fill/position state still takes over after the
    API resolves. Validation PASS: focused manual-order/sidebar tests
    (`19/19`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke on desktop and mobile with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-25-dashboard-manual-order-submitted-state-task-2026-05-07.md`.

- [x] `V1UI-24 fix(web-runtime): show dashboard open-position fees`
  - Scope: closed an ARCHITECT-mode Dashboard Home open-position parity slice.
    Open Positions now renders backend `feesPaid` with the existing dashboard
    runtime fee label and amount formatter, matching bot monitoring so
    open-position fee truth is visible on the primary runtime surface before
    closure. Validation PASS: focused runtime table presenter test (`14/14`),
    Web typecheck, Web lint, route-reachable i18n audit (`findings=0`),
    repository guardrails, full workspace build, and authenticated rendered
    `/dashboard` smoke on desktop and mobile with no console warnings, console
    errors, or page errors. Evidence:
    `docs/planning/v1ui-24-dashboard-open-position-fee-parity-task-2026-05-07.md`.

- [x] `V1UI-23 fix(web-runtime): show dashboard manual-order lifecycle state`
  - Scope: closed a BUILDER-mode UOLF backend-to-Web parity slice. Dashboard
    Home now types and retains the `POST /dashboard/orders/open` response in
    the manual-order controller, maps returned `status` plus optional
    `positionId` into existing localized lifecycle labels, and renders an
    `aria-live` action-state block in the manual-order sidebar. Stale response
    truth clears when the operator edits the next manual-order inputs.
    Validation PASS: focused manual-order, hook, and sidebar tests (`22/22`),
    Web typecheck, Web lint, route-reachable i18n audit (`findings=0`),
    repository guardrails, full workspace build, and authenticated rendered
    `/dashboard` smoke on desktop and mobile with no console warnings, console
    errors, or page errors. Evidence:
    `docs/planning/v1ui-23-dashboard-manual-order-lifecycle-state-task-2026-05-07.md`.

- [x] `V1UI-22 fix(web-runtime): show dashboard signal context source`
  - Scope: closed a BUILDER-mode Dashboard Home signal-source parity slice.
    Dashboard signal cards now render localized context-source badges for
    latest signal, legacy latest decision, configured fallback, and unresolved
    contexts. The shared Web runtime market-state helper also treats current
    `latest_signal` source as evaluated runtime context instead of unresolved
    when no explicit `runtimeMarketState` is present. Validation PASS:
    focused helper and signal-card tests (`8/8`), broader Dashboard Home and
    preview parity tests (`22/22`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke on desktop
    and mobile with no console warnings, console errors, or page errors.
    Evidence:
    `docs/planning/v1ui-22-dashboard-signal-source-parity-task-2026-05-07.md`.

- [x] `V1UI-21 fix(web-runtime): keep aggregate wallet capital strict`
  - Scope: closed an ARCHITECT-mode aggregate wallet source-of-truth slice.
    Dashboard Home now uses strict aggregate capital helpers for selected
    `AGGREGATE` snapshots, so missing aggregate `referenceBalance/freeCash`
    remains visible as unresolved instead of being masked by compatibility
    fields such as `accountBalance` or `availableBalance`. Non-aggregate
    fallback reads still support compatibility capital fields. Validation
    PASS: focused runtime helper, aggregate wallet, and sidebar tests
    (`13/13`), broader Dashboard Home regression (`20/20`), Web typecheck,
    Web lint, route-reachable i18n audit (`findings=0`), repository
    guardrails, full workspace build, and authenticated rendered `/dashboard`
    smoke on desktop and mobile with no console warnings, console errors, or
    page errors. Evidence:
    `docs/planning/v1ui-21-dashboard-aggregate-wallet-strict-capital-task-2026-05-07.md`.

- [x] `V1UI-20 fix(web-runtime): show dashboard closed-position history`
  - Scope: closed a TESTER-mode architecture-to-Web runtime history parity
    slice. Dashboard Home now renders aggregate `positions.historyItems` as a
    dedicated closed-position table above trade history, preserving
    selected-bot scope and exposing backend duration, DCA, fees paid, close
    reason, close initiator, and realized PnL. Validation PASS: focused
    presenter plus aggregate-history tests (`16/16`), broader Dashboard Home
    plus sidebar regressions (`28/28`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke with no
    console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-20-dashboard-closed-history-table-task-2026-05-07.md`.

- [x] `V1UI-19 fix(web-runtime): show dashboard history close reason`
  - Scope: closed a BUILDER-mode backend-to-Web runtime history parity slice.
    Dashboard home Closed Positions history now renders backend
    `closeReason` with shared close-reason suffix and pill semantics also used
    by bot monitoring. Missing values render `-`. Validation PASS: focused
    shared formatter plus dashboard presenter tests (`22/22`), dashboard
    widget plus bot monitoring regressions (`33/33`), Web typecheck, Web
    lint, route-reachable i18n audit (`findings=0`), repository guardrails,
    full workspace build, and authenticated rendered `/dashboard` smoke with
    no console warnings, console errors, or page errors. Evidence:
    `docs/planning/v1ui-19-dashboard-history-close-reason-task-2026-05-07.md`.

- [x] `V1UI-18 fix(web-runtime): show dashboard trade fee finality`
  - Scope: closed an ARCHITECT-mode backend-to-Web runtime trade parity slice.
    Dashboard home Trade History now renders backend `fee` amount plus
    `feeSource`, `feePending`, and `feeCurrency` metadata through a shared Web
    runtime formatter also used by bot monitoring, keeping estimated,
    exchange-final, and pending fee truth visible on the primary runtime
    surface. Validation PASS: focused shared formatter plus dashboard
    presenter tests (`20/20`), dashboard widget regression pack (`20/20`),
    Web typecheck, Web lint, route-reachable i18n audit (`findings=0`),
    repository guardrails, full workspace build, and authenticated rendered
    `/dashboard` smoke with no console or page errors. Evidence:
    `docs/planning/v1ui-18-dashboard-trade-fee-parity-task-2026-05-07.md`.

- [x] `V1UI-17 fix(web-runtime): show dashboard open-position entry and quantity`
  - Scope: closed a BUILDER-mode backend-to-Web runtime position parity slice.
    Dashboard home Open Positions now renders backend `quantity` and
    `entryPrice` beside existing margin/PnL/mark/DCA/protection fields,
    matching the detailed bot monitoring table so position size and entry
    truth stay visible on the primary runtime surface. Validation PASS:
    focused Web presenter test (`11/11`), dashboard widget regression pack
    (`20/20`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke with no post-auth console
    errors. Evidence:
    `docs/planning/v1ui-17-dashboard-open-position-entry-quantity-task-2026-05-07.md`.

- [x] `V1UI-16 fix(web-runtime): show dashboard open-order execution terms`
  - Scope: closed a BUILDER-mode backend-to-Web runtime order parity slice.
    Dashboard home Open Orders now renders backend `type` and `stopPrice`
    beside existing price/fill fields, matching the detailed bot monitoring
    table so conditional execution terms stay visible on the primary runtime
    surface. Validation PASS: focused Web presenter test (`10/10`),
    dashboard open-order regression tests (`3/3`), Web typecheck, Web lint,
    route-reachable i18n audit (`findings=0`), repository guardrails, full
    workspace build, and authenticated rendered `/dashboard` smoke with no
    post-auth console errors. Evidence:
    `docs/planning/v1ui-16-dashboard-open-order-execution-terms-task-2026-05-07.md`.

- [x] `V1UI-15 fix(web-runtime): show dashboard open-order filled quantity`
  - Scope: closed a TESTER-mode backend-to-Web runtime order parity slice.
    Dashboard home Open Orders now renders backend `filledQuantity` beside
    total `quantity`, matching the detailed bot monitoring table so partial
    fill progress stays visible on the primary runtime surface. Validation
    PASS: focused Web presenter test (`10/10`), dashboard open-order
    regression tests (`3/3`), Web typecheck, Web lint, route-reachable i18n
    audit (`findings=0`), repository guardrails, full workspace build, and
    authenticated rendered `/dashboard` smoke with no post-auth console
    errors. Evidence:
    `docs/planning/v1ui-15-dashboard-open-order-fill-quantity-task-2026-05-07.md`.

- [x] `V1UI-14 fix(web-runtime): align open-order status labels`
  - Scope: closed a BUILDER-mode runtime order lifecycle label parity slice.
    Dashboard home and bot monitoring now share open-order status suffix
    semantics, and bot monitoring renders backend `OPEN`/`PENDING` status as
    route-owned waiting-for-fill lifecycle text instead of a raw status code.
    Unknown statuses remain raw and visible. Validation PASS: focused Web
    runtime formatter/dashboard/bot monitoring tests (`29/29`), Web typecheck,
    Web lint, route-reachable i18n audit (`findings=0`), repository guardrails,
    Web build, and authenticated rendered `/dashboard/bots` route smoke with
    no console errors. Evidence:
    `docs/planning/v1ui-14-runtime-open-order-status-label-task-2026-05-07.md`.

- [x] `V1UI-13 fix(web-runtime): show bot monitoring open-order source labels`
  - Scope: closed a BUILDER-mode backend-to-Web runtime order parity slice.
    Bot monitoring open-order rows now render backend `origin` truth as
    route-owned `Origin` labels, while dashboard home and bot monitoring share
    one runtime order-source suffix helper for manual, bot, and imported
    sources. Validation PASS: focused Web runtime formatter/dashboard/bot
    monitoring tests (`28/28`), Web typecheck, Web lint, route-reachable i18n
    audit (`findings=0`), repository guardrails, Web build, and authenticated
    rendered `/dashboard/bots` route smoke with no console errors. Evidence:
    `docs/planning/v1ui-13-bot-open-orders-source-label-task-2026-05-07.md`.

- [x] `V1UI-12 refactor(web-runtime): centralize continuity label semantics`
  - Scope: closed an ARCHITECT-mode runtime diagnostics drift cleanup.
    Dashboard home and bot monitoring now derive backend `continuityState`
    label semantics from shared `runtimeContinuityLabelSuffix`, preserving
    route-owned i18n namespaces while preventing future runtime status drift.
    Validation PASS: focused Web runtime formatter/dashboard/bot monitoring
    tests (`27/27`), Web typecheck, Web lint, route-reachable i18n audit
    (`findings=0`), repository guardrails, Web build, and authenticated
    rendered `/dashboard/bots` smoke with no console errors. Evidence:
    `docs/planning/v1ui-12-runtime-continuity-label-helper-task-2026-05-07.md`.

- [x] `V1UI-11 fix(web-runtime): show provenance in dashboard position modal`
  - Scope: closed a BUILDER-mode dashboard action-context parity slice.
    `/dashboard` position edit modal now repeats backend provenance from
    `origin`, `syncState`, and `takeoverStatus`, keeping exchange-adopted and
    imported context visible at the action/edit decision point. Web also reuses
    one shared provenance label suffix helper across dashboard and bot
    monitoring presenters. Validation PASS: focused Web runtime/dashboard/bot
    monitoring tests (`46/46`), Web typecheck, Web lint, route-reachable i18n
    audit (`findings=0`), repository guardrails, Web build, and authenticated
    rendered `/dashboard` smoke with no console errors. Evidence:
    `docs/planning/v1ui-11-dashboard-position-modal-provenance-task-2026-05-07.md`.

- [x] `V1UI-10 fix(web-runtime): show position provenance labels`
  - Scope: closed a TESTER-mode backend-to-Web runtime provenance parity
    slice. Dashboard home and bot monitoring open-position status cells now
    render backend `origin`, `syncState`, and `takeoverStatus` truth, so
    imported/adopted exchange-sync rows, drift, and orphan states remain
    operator-visible. Validation PASS: focused Web runtime/dashboard/bot
    monitoring tests (`25/25`), Web typecheck, route-reachable i18n audit
    (`findings=0`), Web lint, repository guardrails, Web build, and
    authenticated rendered `/dashboard` plus `/dashboard/bots` smoke with no
    console errors. Evidence:
    `docs/planning/v1ui-10-runtime-position-provenance-label-task-2026-05-07.md`.

- [x] `V1UI-09 fix(web-runtime): label API fallback TTP protection source`
  - Scope: closed an ARCHITECT-mode runtime protection-truth parity slice.
    API runtime position reads now expose additive `dynamicTtpStopLossSource`
    metadata and Web labels `strategy_fallback` protection as prospective in
    both dashboard home and bot monitoring. Validation PASS: focused API
    serialization tests (`8/8`), focused Web runtime/dashboard/bot monitoring
    tests (`32/32`), API typecheck, Web typecheck, route-reachable i18n audit
    (`findings=0`), Web lint, repository guardrails, Web build, and
    authenticated rendered `/dashboard/bots` smoke with no console errors.
    Evidence:
    `docs/planning/v1ui-09-runtime-ttp-source-parity-task-2026-05-07.md`.

- [x] `V1UI-08 fix(web-runtime): label prospective dashboard TTP protection`
  - Scope: closed a BUILDER-mode dashboard protection-truth parity slice.
    Dashboard home open-position TTP cells now label config-derived fallback
    protection as prospective while keeping backend dynamic TTP as the primary
    unlabeled runtime stop truth. Validation PASS: focused dashboard runtime
    derivation and table presenter tests (`13/13`), Web typecheck,
    route-reachable i18n audit (`findings=0`), Web lint, guardrails, Web build,
    diff check, and authenticated rendered `/dashboard` smoke with no console
    errors. Evidence:
    `docs/planning/v1ui-08-dashboard-prospective-protection-label-task-2026-05-07.md`.

- [x] `V1UI-07 fix(web-runtime): show actionability details in dashboard open positions`
  - Scope: closed a BUILDER-mode dashboard runtime parity slice. Dashboard home
    open-position status cells now render backend `actionable=false` and
    `strategyAutomationContextResolved=false` detail labels below the existing
    continuity badge, keeping the primary operator surface aligned with bot
    monitoring fail-closed diagnostics. Validation PASS: focused dashboard
    presenter test (`6/6`), dashboard integration test (`20/20`), Web
    typecheck, Web lint, Web build, route-reachable i18n audit (`findings=0`),
    guardrails, diff check, and authenticated rendered `/dashboard` smoke with
    no console errors. Evidence:
    `docs/planning/v1ui-07-dashboard-home-actionability-status-parity-task-2026-05-07.md`.

- [x] `V1UI-06 fix(web-runtime): surface continuity state in bot monitoring positions`
  - Scope: closed an ARCHITECT-mode backend-to-Web runtime parity slice. Bot
    monitoring open-position rows now render backend `continuityState`,
    `actionable`, and `strategyAutomationContextResolved` truth, making
    recovered non-actionable rows and unresolved strategy-context rows explicit
    in the detailed operator route. Validation PASS: focused
    `BotsManagement.test.tsx` (`13/13`), Web typecheck, Web lint, Web build,
    route-reachable i18n audit (`findings=0`), guardrails, diff check, and
    authenticated rendered `/dashboard/bots` smoke with no console errors.
    Evidence:
    `docs/planning/v1ui-06-bot-monitoring-continuity-state-web-parity-task-2026-05-07.md`.

- [x] `V1UI-05 fix(web-runtime): surface close attribution in bot monitoring history`
  - Scope: closed a TESTER-mode backend-to-Web runtime parity slice. Bot
    monitoring history now renders backend `closeReason` and `closeInitiator`
    for closed positions and close trades, preserving bot-route i18n ownership
    while sharing attribution tone helpers. Validation PASS: focused
    `BotsManagement.test.tsx` (`13/13`), Web typecheck, Web lint, Web build,
    route-reachable i18n audit (`findings=0`), guardrails, and diff check.
    Evidence:
    `docs/planning/v1ui-05-bot-monitoring-close-attribution-web-parity-task-2026-05-07.md`.

- [x] `V1UI-04 feat(web-runtime): surface runtime mark-price source in monitoring`
  - Scope: closed a BUILDER-mode backend-to-Web runtime parity slice. Web now
    carries `liveMarkPriceSource` through the shared open-position derivation
    and renders compact source labels beside mark prices in both `/dashboard`
    open positions and `/dashboard/bots` monitoring. Stream-enriched prices
    show stream truth, API mark prices preserve backend `markPriceSource`, and
    missing truth stays explicit as unavailable. Validation PASS: focused Web
    runtime tests (`26/26`), Web typecheck, API typecheck, Web lint,
    production Web build, route-reachable i18n audit (`findings=0`),
    guardrails, and diff check. Local Postgres migration status was repaired by
    applying `20260503013000_enforce_single_active_bot_market_group`; rendered
    authenticated runtime smoke remains blocked by missing local
    `API_KEY_ENCRYPTION_KEYS`. Evidence:
    `docs/planning/v1ui-04-runtime-mark-price-source-web-parity-task-2026-05-07.md`.

- [x] `V1UI-03 fix(web-public): hide auth CTAs while session state is loading`
  - Scope: closed an ARCHITECT-mode public access shell/i18n route slice.
    Public header auth CTAs now render only after auth loading resolves with no
    user, preventing logged-out login/register CTAs from flashing while session
    truth is unknown. Route translations now use the current Next pathname
    during render, eliminating public-to-auth client navigation i18n
    missing-key warnings seen when clicking Login from `/`. Validation PASS:
    focused header/i18n tests (`7/7`), Web typecheck, lint, production build,
    local desktop/mobile rendered smoke, route-reachable i18n audit
    (`findings=0`), guardrails, and diff check. Evidence:
    `docs/planning/v1ui-03-public-access-header-route-contract-task-2026-05-07.md`.

- [x] `V1UI-02 fix(web-auth): persist register errors and seed auth i18n route`
  - Scope: closed a BUILDER-mode auth register UI/i18n slice. Registration
    failures now persist inline in the form with `role="alert"` while
    preserving existing toast feedback and auth behavior. `I18nProvider` now
    seeds route-scoped dictionaries from Next's `usePathname`, removing
    first-render auth namespace warning noise seen in rendered `/auth/register`
    smoke. Validation PASS: focused i18n/register tests (`13/13`), Web
    typecheck, local desktop/mobile rendered smoke, route-reachable i18n audit
    (`findings=0`), guardrails, and diff check. Evidence:
    `docs/planning/v1ui-02-auth-register-error-i18n-task-2026-05-07.md`.

- [x] `V1UI-01 fix(web-auth): announce login server errors`
  - Scope: closed a BUILDER-mode auth UI accessibility slice. Rendered
    public/protected route smoke confirmed unauthenticated `/dashboard`
    redirects to `/auth/login`, and the login fail state now announces the
    inline server error with `role="alert"` while preserving the existing
    visual alert styling and auth behavior. Browser plugin validation was
    blocked by an old Node REPL runtime, so the rendered smoke used bundled
    Codex Node `v24.14.0` plus bundled Playwright without changing project
    dependencies. Validation PASS: focused LoginForm tests (`4/4`), Web
    typecheck, local desktop/mobile rendered smoke, guardrails, and diff check.
    Evidence: `docs/planning/v1ui-01-auth-login-error-alert-task-2026-05-07.md`.

- [x] `V1GATE-04 fix(ops): report skipped go-live smoke when local quality is skipped`
  - Scope: closed a BUILDER-mode release-gate tooling fix. The V1 release gate
    now reports `goLiveSmoke: skipped` whenever `--skip-local-quality` is used,
    matching the actual step plan because go-live smoke is nested under local
    quality execution. Added focused regression coverage. Production dry-run
    artifacts were regenerated with readiness `not_ready`; current blockers
    remain stale activation, RC, restore, and rollback evidence plus the
    broader stage/protected/manual/live-money gates. Validation PASS:
    release-gate tests (`8/8`). Evidence:
    `docs/planning/v1gate-04-release-gate-plan-summary-task-2026-05-07.md`.

- [x] `V1GATE-03 release(ops): refresh OPS deploy freshness ledger row`
  - Scope: closed a BUILDER-mode deploy freshness ledger sync. Re-read
    production public `/api/build-info` and confirmed
    `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`, `gitRef=main`, matching
    `origin/main`. `OPS-DEPLOY-001` in the V1 function coverage matrix now
    references the current `V1GATE-02` public target refresh instead of the
    older 2026-05-01 SHA. This does not close restore, stage, GO/NO-GO,
    protected/manual, or live-money evidence blockers. Evidence:
    `docs/planning/v1gate-03-deploy-ledger-refresh-task-2026-05-07.md`.

- [x] `V1MANUAL-01 qa(web): align V1 manual route evidence with runtime IA`
  - Scope: closed an ARCHITECT-mode V1 manual evidence sync. The V1
    orders/positions rows now distinguish authenticated API
    `/dashboard/orders*` and `/dashboard/positions*` read-only proof from web
    legacy redirect proof, matching the canonical dashboard route map. Added a
    focused web middleware regression for legacy orders/positions redirects and
    unauthenticated fail-closed login behavior. Validation PASS: focused
    middleware test (`3/3`). Evidence:
    `docs/planning/v1manual-web-legacy-route-evidence-sync-task-2026-05-07.md`.

- [x] `V1MONEY-02 qa(money): capture paper-safe close evidence for TP SL TTP TSL and DCA guards`
  - Scope: closed a BUILDER-mode paper-safe close evidence slice. Focused API
    close validation passed (`45/45`) across runtime position automation,
    lifecycle close parity, paper lifecycle, and dynamic stop operator truth.
    Evidence now maps TP, SL, TTP, TSL, DCA-first, and DCA-exhausted rows to
    covered local behavior and remaining production/paper-sample proof. No
    live-money mutations were run. Evidence:
    `docs/planning/v1money-paper-safe-close-evidence-task-2026-05-07.md`.

- [x] `MARKETDATA-FUT-01 feat(api-runtime): expose runtime mark-price source for futures evidence`
  - Scope: closed a BUILDER-mode futures market-data evidence slice. Runtime
    position rows now include additive `markPriceSource` metadata beside
    `markPrice`, with source labels for runtime symbol stats, runtime ticker,
    fallback ticker, exchange-unrealized-PnL derived price, runtime candidate,
    and unavailable states. Existing numeric price helper remains compatible.
    Validation PASS: focused runtime lifecycle/position PnL tests (`8/8`), API
    typecheck, Web typecheck, guardrails, and diff check. Evidence:
    `docs/planning/marketdata-fut-runtime-mark-price-source-task-2026-05-07.md`.

- [x] `V1MONEY-01 qa(money): build local and paper-safe V1 money scenario matrix`
  - Scope: closed a TESTER-mode local/paper-safe V1 money matrix. The matrix
    routes `V1MONEY-A` rows through local, paper-safe, read-only production, or
    explicit operator/live-money evidence paths. Focused API money-engine
    validation passed (`49/49`) across order types, pre-trade allow/block/audit,
    position/order lifetime, strategy lifetime policy, lifecycle mark-price,
    and close parity. This does not close production-only TP/SL/TSL/live-close
    rows; it defines the next safe evidence path. Evidence:
    `docs/planning/v1money-local-paper-safe-matrix-task-2026-05-07.md`.

- [x] `LIVEIMPORT-03A qa(planning): triage stale imported-position release candidate against current main`
  - Scope: closed a BUILDER-mode release-candidate triage. The old
    `LIVEIMPORT-03` promotion candidate `39146d2e` is not an ancestor of
    deployed production `6a7c9889` and is not patch-equivalent to deployed
    `main`, while a focused current-main imported-position/runtime strategy
    regression pack passed (`51/51`). `LIVEIMPORT-03` remains open only for
    authenticated ETH/DOGE production readback on current `main`; do not
    promote stale `39146d2e`. BOTMULTI stale build-info blocker text was also
    refreshed because production now contains `f3aaa3d`. Evidence:
    `docs/planning/liveimport-03-current-main-candidate-triage-task-2026-05-07.md`.

- [x] `V1GATE-02 release(ops): refresh public production and stage target truth after PMPLC merge`
  - Scope: closed an ARCHITECT-mode public target refresh after the PMPLC
    hardening merge reached `main`. Production public API/Web smoke is healthy
    and build-info reports `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`,
    matching `origin/main`. Unauthenticated `/dashboard` redirects fail-closed
    to `/auth/login`, and the post-deploy smoke checklist now names
    `/auth/login` as the canonical login page. Stage remains blocked (`503` on
    `stage-api.soar.luckysparrow.ch` and `stage.soar.luckysparrow.ch`; DNS miss
    on `stage-soar.luckysparrow.ch`). V1 remains NO-GO until restore drill,
    stage restoration or waiver, sign-off, protected/manual matrix, and
    live-money proof rows are closed. Evidence:
    `docs/planning/v1gate-02-public-target-refresh-task-2026-05-07.md`.

- [x] `APPCHECK-01 qa(app): verify main after PMPLC merge with local function sweep`
  - Scope: closed a BUILDER-mode local post-merge app-function sweep on branch
    `codex/v1-app-function-check` after `codex/v1-pmplc-hardening` was
    fast-forward merged into `main` and pushed at `6a7c9889`. Validation PASS:
    repository guardrails, API typecheck, Web typecheck, lint, focused
    runtime/order API pack (`90/90`), focused dashboard/strategy Web pack
    (`32/32`), and full workspace build. No executable local regression was
    isolated in this sweep. Evidence:
    `docs/planning/app-function-check-main-sweep-task-2026-05-06.md`.

- [x] `PMPLC-46 docs(planning): clear stale PMPLC-45 follow-up after closure`
  - Scope: closed a BUILDER-mode planning truth sync slice after PMPLC-45.
    Canonical PMPLC planning truth no longer lists `PMPLC-45` as a queued
    follow-up after it was implemented and pushed. Runtime/order discovery pack
    remained green (`64/64` plus exchange-event pack `46/46`) before the
    docs-only sync, so no new executable money-runtime regression was isolated
    in this iteration. Evidence:
    `docs/planning/pmplc-queue-sync-task-2026-05-06.md`.

- [x] `PMPLC-45 fix(api-bots): include imported externally closed positions in aggregate PnL`
  - Scope: closed a TESTER-mode runtime read-model money-truth slice.
    Runtime aggregate positions now include imported `ORPHAN_LOCAL` /
    `EXTERNAL_CLOSE_CONFIRMED` closed positions in closed-position realized
    PnL, while stale open orphans remain excluded. Runtime history also keeps
    carry-over bot-managed `OPEN` trades and legacy wallet-scoped imported DCA
    continuity visible without broadening the primary aggregate ownership
    filter. Validation PASS: pre-fix aggregate regression failed as expected
    (`realizedPnl=0` received vs `37.5` expected), focused aggregate
    regression, focused external-close history regression, runtime/portfolio
    pack (`51/51`), helper unit suite (`16/16`), API typecheck, repository
    guardrails, and lint. Evidence:
    `docs/planning/runtime-aggregate-imported-closed-position-pnl-task-2026-05-06.md`.

- [x] `PMPLC-44 fix(api-bots): mark portfolio history partial for pending fees`
  - Scope: closed a BUILDER-mode LIVE portfolio completeness slice. Portfolio
    history now marks LIVE history as `PARTIAL` with
    `FEE_RECONCILIATION_PENDING` when any scoped trade in the history window
    has `feePending=true`, so provisional fee-adjusted PnL is not presented as
    fully complete. Validation PASS: pre-fix e2e regression failed as expected
    (`completeness=COMPLETE` received vs `PARTIAL` expected), focused
    regression, portfolio-history e2e (`4/4`), API typecheck, repository
    guardrails, and lint. Evidence:
    `docs/planning/portfolio-history-pending-fee-completeness-task-2026-05-06.md`.

- [x] `PMPLC-43 fix(api-orders): keep pending after incomplete partial fee backfill`
  - Scope: closed a BUILDER-mode LIVE fee reconciliation finality slice.
    Exchange-event fee finality now refuses to treat a filled order's existing
    exchange fee as settled while another known `OrderFill` still has missing
    fee truth, and lifecycle trade fee backfill now preserves the computed
    pending decision instead of unconditionally clearing pending. Validation
    PASS: pre-fix DB-backed regression failed as expected
    (`Order.feePending=false` received vs `true` expected), focused
    regression, helper suite (`24/24`), DB-backed exchange-event suite
    (`21/21`), dedicated fee-backfill suite (`1/1`), focused runtime/order
    suites (`105/105`), API typecheck, repository guardrails, lint, and diff
    check. Evidence:
    `docs/planning/position-management-exchange-partial-backfill-still-pending-task-2026-05-06.md`.

- [x] `PMPLC-42 fix(api-orders): refresh close PnL after missing partial close fee backfill`
  - Scope: closed an ARCHITECT-mode LIVE fee/PnL reconciliation slice.
    Exchange-event fee backfill now refreshes close lifecycle
    `Trade.realizedPnl` and linked `Position.realizedPnl` after a delayed
    missing partial close fee settles aggregate exchange fee truth, preventing
    closed-position PnL from remaining overstated after fee reconciliation.
    Validation PASS: pre-fix DB-backed regression failed as expected (`8.8`
    close PnL received vs `8.7` expected), focused regression, helper suite
    (`24/24`), DB-backed exchange-event suite (`21/21`), focused runtime/order
    suites (`104/104`), API typecheck, repository guardrails, lint, and diff
    check. Evidence:
    `docs/planning/position-management-exchange-close-pnl-fee-backfill-task-2026-05-06.md`.

- [x] `PMPLC-41 fix(api-orders): settle lifecycle fee after missing partial fee backfill`
  - Scope: closed a BUILDER-mode LIVE fee reconciliation backfill slice. Fee
    backfill propagation now updates unresolved lifecycle trades by `orderId`
    when the aggregate exchange fee becomes complete, so order, `OrderFill`,
    and lifecycle `Trade` fee truth settle together after a delayed
    partial-fill fee arrives. Validation PASS: pre-fix DB-backed regression
    failed as expected (`0.02` lifecycle fee received vs `0.03` expected),
    helper suite (`24/24`), DB-backed exchange-event suite (`20/20`), focused
    runtime/order suites (`103/103`), API typecheck, repository guardrails,
    lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-missing-partial-fee-backfill-task-2026-05-06.md`.

- [x] `PMPLC-40 fix(api-orders): keep pending when earlier partial fill fee is missing`
  - Scope: closed a TESTER-mode LIVE fee reconciliation finality slice.
    Exchange-event reconciliation now refuses to clear pending from a terminal
    current-fill exact fee while any earlier `OrderFill` for the order still
    has missing fee truth, preserving final fee-total visibility without
    downgrading the current exact fee. Validation PASS: pre-fix DB-backed
    regression failed as expected (`feePending=false` received vs `true`
    expected), helper suite (`24/24`), DB-backed exchange-event suite
    (`19/19`), focused runtime/order suites (`102/102`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-missing-partial-fee-pending-task-2026-05-06.md`.

- [x] `PMPLC-39 fix(api-orders): keep final fill pending after partial fee truth`
  - Scope: closed an ARCHITECT-mode LIVE fee reconciliation finality slice.
    Exchange-event reconciliation now treats an existing exact exchange fee as
    final settled truth only when the order was already terminal `FILLED`
    before the incoming event, so a terminal fill without fee after a partial
    exact fee cannot falsely clear reconciliation pending. Validation PASS:
    pre-fix DB-backed regression failed as expected (`feePending=false`
    received vs `true` expected), helper suite (`24/24`), DB-backed
    exchange-event suite (`18/18`), focused runtime/order suites (`101/101`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-final-fee-pending-task-2026-05-06.md`.

- [x] `PMPLC-38 fix(api-orders): keep fee pending for partial exchange fills`
  - Scope: closed a BUILDER-mode LIVE fee reconciliation finality slice.
    Exchange fee-pending decisions now require terminal `FILLED` status before
    accepted or settled exact exchange fee truth clears final reconciliation
    pending, so non-terminal partial fills can persist exact current-fill fee
    truth without falsely appearing final. Validation PASS: pre-fix helper and
    DB-backed regressions failed as expected (`feePending=false` received vs
    `true` expected), helper suite (`24/24`), DB-backed exchange-event suite
    (`17/17`), focused runtime/order suites (`100/100`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-partial-fee-pending-task-2026-05-06.md`.

- [x] `PMPLC-37 fix(api-orders): clear pending drift when exchange fee is settled`
  - Scope: closed a BUILDER-mode LIVE fee reconciliation drift recovery slice.
    Exchange fee-pending decisions now give already-settled exact
    `EXCHANGE_FILL` fee truth precedence over local `feePending=true` drift, so
    exact fee availability reliably clears pending reconciliation state.
    Validation PASS: pre-fix helper regression failed as expected
    (`feePending=true` received vs `false` expected), DB-backed exchange-event
    suite (`16/16`), focused runtime/order suites (`98/98`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-settled-fee-pending-recovery-task-2026-05-06.md`.

- [x] `PMPLC-36 refactor(api-orders): centralize exchange fee pending decision`
  - Scope: closed an ARCHITECT-mode exchange fee-pending decision boundary
    slice. Exchange fee-pending decisions now live in the pure
    `orders.exchangeEvents.helpers` boundary with no-DB coverage for accepted
    exact fee, rejected raw event fee, existing pending preservation, and
    already-settled exact fee cases, while DB-backed PMPLC-34/35 behavior
    remains unchanged. Validation PASS: helper suite (`22/22`), DB-backed
    exchange-event suite (`15/15`), focused runtime/order suites (`96/96`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-pending-helper-task-2026-05-06.md`.

- [x] `PMPLC-35 fix(api-orders): recover pending truth when rejected fee leaves estimate unresolved`
  - Scope: closed a TESTER-mode LIVE fee reconciliation recovery slice.
    Exchange order-trade event handling now bases pending recovery on accepted
    fee truth rather than raw event fee and restores `feePending=true` on
    unresolved estimated lifecycle trades for the order, so rejected stale
    unknown `exchangeTradeId` fees cannot hide reconciliation drift. Validation
    PASS: pre-fix DB-backed regression failed as expected (`feePending=false`
    received vs `true` expected), DB-backed exchange-event suite (`15/15`),
    focused runtime/order suites (`92/92`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-stale-fee-pending-recovery-task-2026-05-06.md`.

- [x] `PMPLC-34 fix(api-orders): keep fee pending when stale unknown fee is rejected`
  - Scope: closed a BUILDER-mode LIVE fee reconciliation visibility guard.
    Exchange order-trade event handling now clears `feePending` from finite
    event fee only when that fee is actually accepted by the fee
    refresh/backfill decision, so a rejected stale unknown `exchangeTradeId`
    cannot hide unresolved LIVE fee reconciliation. Validation PASS: pre-fix
    DB-backed regression failed as expected (`feePending=false` received vs
    `true` expected), DB-backed exchange-event suite (`14/14`), focused
    runtime/order suites (`91/91`), API typecheck, repository guardrails, lint,
    and diff check. Evidence:
    `docs/planning/position-management-exchange-stale-fee-pending-guard-task-2026-05-06.md`.

- [x] `PMPLC-33 refactor(api-orders): centralize exchange fee refresh decision`
  - Scope: closed an ARCHITECT-mode exchange fee decision boundary slice.
    Exchange fee refresh/backfill decisions now live in the pure
    `orders.exchangeEvents.helpers` boundary with no-DB coverage for normal
    refresh, known-fill missing-fee backfill, stale unknown-fill blocking, and
    already-settled fill fee cases, while DB-backed PMPLC-31/32 behavior
    remains unchanged. Validation PASS: helper suite (`18/18`), DB-backed
    exchange-event suite (`13/13`), focused runtime/order suites (`90/90`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-refresh-helper-task-2026-05-06.md`.

- [x] `PMPLC-32 fix(api-orders): ignore stale terminal fee events for unknown fills`
  - Scope: closed a BUILDER-mode LIVE fee idempotency guard. Exchange
    order-trade event handling now keeps fee-only refreshes limited to known
    `OrderFill` rows with missing fee truth, so a stale terminal event with an
    unknown `exchangeTradeId`, no local fill progress, and finite fee cannot
    inflate settled `Order.fee`. Validation PASS: pre-fix DB-backed regression
    failed as expected (`0.13` received vs `0.04` expected), DB-backed
    exchange-event suite (`13/13`), focused runtime/order suites (`86/86`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-stale-fee-event-guard-task-2026-05-06.md`.

- [x] `PMPLC-31 fix(api-orders): backfill missing exchange fill fee truth`
  - Scope: closed a BUILDER-mode LIVE fee-truth backfill slice. Exchange
    order-trade event handling now treats a later finite exchange fee for an
    already recorded `exchangeTradeId` as a monotonic fee-truth upgrade,
    backfilling `Order.fee`, `OrderFill.feeCost`, and unresolved lifecycle
    `Trade.fee` without duplicating fill/trade rows or reapplying terminal
    lifecycle. Validation PASS: focused DB-backed regression, DB-backed
    exchange-event suite (`12/12`), focused runtime/order suites (`85/85`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-fee-backfill-task-2026-05-06.md`.

- [x] `PMPLC-30 fix(api-orders): aggregate exchange fill fees across partial fills`
  - Scope: closed a TESTER-mode LIVE fee aggregation slice. Exchange
    order-trade event handling now aggregates accepted per-fill
    `OrderFill.feeCost` values across partial and final fills, adding the
    current event fee only when its `exchangeTradeId` is not already recorded,
    so `Order.fee` and lifecycle `Trade.fee` represent total exchange fee
    truth instead of the latest fill fee. Validation PASS: pre-fix DB-backed
    regression failed as expected (`0.02` received vs `0.03` expected),
    DB-backed exchange-event suite (`11/11`), focused runtime/order suites
    (`84/84`), API typecheck, repository guardrails, lint, and diff check.
    Evidence:
    `docs/planning/position-management-exchange-fill-fee-aggregation-task-2026-05-06.md`.

- [x] `PMPLC-29 fix(api-orders): recover unresolved exchange fee pending truth`
  - Scope: closed a BUILDER-mode LIVE fee-truth recovery slice. Exchange
    order-trade event handling now restores `feePending=true` for filled LIVE
    orders and generated lifecycle trades when fee truth remains unresolved
    (`feeSource=ESTIMATED`, no finite fee, and no finite event fee), even if
    the local row previously drifted to `feePending=false`. Validation PASS:
    pre-fix DB-backed regression failed as expected, DB-backed exchange-event
    suite (`10/10`), focused runtime/order suites (`83/83`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-pending-recovery-task-2026-05-06.md`.

- [x] `PMPLC-28 fix(api-orders): preserve exchange fee pending truth without fee`
  - Scope: closed a BUILDER-mode LIVE fee truth slice. Exchange order-trade
    event handling now keeps `feePending=true` on filled LIVE orders and
    generated lifecycle trades when the exchange event confirms fill quantity
    but provides no finite fee truth, preserving operator-visible
    reconciliation state instead of hiding missing fees as settled. Validation
    PASS: pre-fix DB-backed regression failed as expected, DB-backed
    exchange-event suite (`10/10`), focused runtime/order suites (`83/83`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fee-pending-truth-task-2026-05-06.md`.

- [x] `PMPLC-27 refactor(api-orders): centralize exchange recordable fill details`
  - Scope: closed an ARCHITECT-mode exchange event recordability slice.
    Exchange order-trade event handling now resolves recordable fill quantity
    and proportional fee through one private decision helper, keeping
    order-fill quantity and fee parity centralized without behavior changes.
    Validation PASS: local Postgres availability check, DB-backed
    exchange-event suite (`9/9`), focused runtime/order suites (`82/82`), API
    typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-recordable-fill-details-task-2026-05-06.md`.

- [x] `PMPLC-26 fix(api-orders): scale exchange fill fee to accepted local quantity`
  - Scope: closed a BUILDER-mode exchange event fee parity slice. Exchange
    order-trade event handling now scales finite event fee by accepted local
    last-fill quantity when exchange `lastFilledQuantity` is capped, so order,
    order-fill, and trade fee truth stays proportional to accepted local
    quantity under over-reported fills. Validation PASS: DB-backed
    exchange-event suite (`9/9`), focused runtime/order suites (`82/82`), API
    typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-fee-cap-task-2026-05-06.md`.

- [x] `PMPLC-25 fix(api-orders): cap exchange order-fill rows to local fill progress`
  - Scope: closed a TESTER-mode exchange event child-fill quantity slice.
    Exchange order-trade event handling now records `OrderFill.quantity` from
    accepted local fill progress instead of raw exchange `lastFilledQuantity`,
    so over-reported last-fill events cannot inflate child fill rows above the
    locally capped order, trade, or position quantity. Validation PASS:
    DB-backed exchange-event suite (`9/9`), focused runtime/order suites
    (`82/82`), API typecheck, repository guardrails, lint, and diff check.
    Evidence:
    `docs/planning/position-management-exchange-orderfill-quantity-cap-task-2026-05-06.md`.

- [x] `PMPLC-24 refactor(api-orders): centralize exchange fill quantity normalization`
  - Scope: closed an ARCHITECT-mode exchange fill quantity helper slice.
    Exchange fill progress now uses one private quantity normalizer for both
    existing local fill progress and incoming exchange cumulative fill
    quantity, keeping local order-quantity caps centralized without behavior
    changes. Validation PASS: helper plus DB-backed exchange-event suite
    (`22/22`), focused runtime/order suites (`81/81`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-quantity-normalizer-task-2026-05-06.md`.

- [x] `PMPLC-23 fix(api-orders): cap existing exchange fill progress to order quantity`
  - Scope: closed a BUILDER-mode exchange fill quantity cap slice. Exchange
    fill progress now caps both incoming cumulative fill quantity and
    previously persisted local filled quantity to the local order quantity when
    requested quantity truth is available, preventing inherited over-reported
    fill progress from inflating lifecycle truth. Validation PASS: no-DB helper
    regression (`14/14`), DB-backed exchange-event suite (`8/8`), focused
    runtime/order suites (`81/81`), API typecheck, repository guardrails, lint,
    and diff check. Evidence:
    `docs/planning/position-management-exchange-existing-fill-cap-task-2026-05-06.md`.

- [x] `PMPLC-22 fix(api-orders): keep known underfilled exchange events partial`
  - Scope: closed a BUILDER-mode exchange event fail-closed slice. Exchange
    order-trade event reconciliation now passes local requested order quantity
    into the fill-progress helper, caps over-reported cumulative fill quantity
    to local order truth, and keeps known below-request `FILLED` events as
    `PARTIALLY_FILLED` without applying filled lifecycle. Validation PASS:
    no-DB helper regression (`13/13`), focused runtime/order suites (`72/72`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-event-underfilled-entry-task-2026-05-06.md`.

- [x] `PMPLC-21 refactor(api-orders): make exchange persisted status decision explicit`
  - Scope: closed an ARCHITECT-mode exchange fill helper refactor slice.
    Exchange fill progress now resolves persisted order status through an
    explicit pure decision helper instead of nested inline branching, keeping
    terminal-filled, malformed-filled, stale-open, partial-progress, and
    terminal-cancel semantics visible and no-DB testable without behavior
    changes. Validation PASS: no-DB helper regression (`11/11`), focused
    runtime/order suites (`70/70`), API typecheck, repository guardrails, lint,
    and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-status-helper-refactor-task-2026-05-06.md`.

- [x] `PMPLC-20 fix(api-orders): fail closed on exchange FILLED without quantity`
  - Scope: closed a TESTER-mode exchange fill fail-closed slice. Exchange fill
    progress now refuses to terminalize non-terminal local orders when a
    `FILLED` event arrives without positive cumulative fill quantity,
    preserving `OPEN` or `PARTIALLY_FILLED` truth and skipping
    lifecycle/detail refresh until quantity truth is present. Validation PASS:
    no-DB helper regression (`10/10`), focused runtime/order suites (`69/69`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-filled-without-quantity-task-2026-05-06.md`.

- [x] `PMPLC-19 fix(api-orders): keep exchange partial fill status monotonic`
  - Scope: closed a BUILDER-mode exchange fill status monotonicity slice.
    Exchange fill progress now preserves `PARTIALLY_FILLED` when stale `OPEN`
    events arrive after local partial progress, preventing known partial
    execution from being hidden as a plain open order. Validation PASS: no-DB
    helper regression (`8/8`), focused runtime/order suites (`67/67`), API
    typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-partial-status-monotonicity-task-2026-05-06.md`.

- [x] `PMPLC-18 refactor(api-orders): extract pure exchange fill helper boundary`
  - Scope: closed an ARCHITECT-mode exchange fill helper boundary slice. Pure
    exchange close-fill completeness and fill-progress/idempotency decisions
    now live in `orders.exchangeEvents.helpers.ts`, while the DB-backed
    exchange event service imports them. The no-DB helper regression now
    imports only the pure helper module, reducing coupling to Prisma/runtime
    orchestration without behavior changes. Validation PASS: no-DB helper
    regression (`6/6`), focused runtime/order suites (`65/65`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-exchange-fill-helper-boundary-task-2026-05-06.md`.

- [x] `PMPLC-17 fix(api-orders): keep stale exchange events from overwriting terminal fill details`
  - Scope: closed a BUILDER-mode money-impacting exchange-event idempotency
    slice. Exchange order-trade updates now refresh terminal fill details only
    before completion or when cumulative fill progress advances, so stale or
    duplicate events for already-`FILLED` orders cannot rewrite average fill
    price, filled timestamp, fee, fee currency, or exchange trade id while
    still preserving monotonic fill quantity. Validation PASS: no-DB exchange
    fill-progress helper regression (`6/6`), focused runtime/order suites
    (`65/65`), API typecheck, repository guardrails, lint, and diff check.
    DB-backed exchange-event lifecycle suites remain pending because local
    Postgres at `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-exchange-terminal-fill-details-idempotency-task-2026-05-06.md`.

- [x] `PMPLC-16 fix(api-orders): keep duplicate exchange FILLED events idempotent`
  - Scope: closed a BUILDER-mode money-impacting exchange-event idempotency
    slice. Exchange order-trade fill progress now stays monotonic and
    already-`FILLED` local orders do not reapply position lifecycle when a
    duplicate or stale exchange `FILLED` event arrives, preventing double-add
    or double-close exposure drift. Validation PASS: no-DB exchange
    fill-progress helper regression (`5/5`), focused runtime/order suites
    (`64/64`), API typecheck, repository guardrails, lint, and diff check.
    DB-backed exchange-event lifecycle suites remain pending because local
    Postgres at `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-exchange-filled-event-idempotency-task-2026-05-06.md`.

- [x] `PMPLC-15 test(api-orders): lock LIVE entry lifecycle gate for partial fills`
  - Scope: closed a TESTER-mode money-impacting lifecycle gate regression
    slice. Open-order persistence and immediate lifecycle decisions now share a
    pure helper that keeps underfilled LIVE entry orders `PARTIALLY_FILLED`,
    persists the confirmed exchange fill quantity, and blocks immediate
    position lifecycle until a complete fill is resolved, while preserving
    PAPER and no-fill-row LIVE compatibility. Validation PASS: no-DB lifecycle
    gate regression (`5/5`), focused runtime/order suites (`61/61`), API
    typecheck, repository guardrails, lint, and diff check. DB-backed order
    lifecycle suites remain pending because local Postgres at `localhost:5432`
    is unavailable. Evidence:
    `docs/planning/position-management-live-entry-lifecycle-gate-task-2026-05-06.md`.

- [x] `PMPLC-14 fix(api-orders): keep underfilled LIVE entry from opening full position`
  - Scope: closed a BUILDER-mode money-impacting LIVE order creation safety
    slice. LIVE order creation now derives persisted status and filled quantity
    from exchange fill rows when available, persists below-request `FILLED`
    responses as `PARTIALLY_FILLED`, and skips immediate position lifecycle
    until the fill is complete, preventing local position quantity inflation.
    Validation PASS: no-DB live fill resolver and focused runtime/order suites
    (`58/58`), API typecheck, repository guardrails, lint, and diff check.
    DB-backed order lifecycle suites remain pending because local Postgres at
    `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-live-entry-underfill-task-2026-05-06.md`.

- [x] `PMPLC-13 fix(api-orders): keep exchange underfilled close from closing full position`
  - Scope: closed a BUILDER-mode money-impacting exchange-event reconciliation
    safety slice. Exchange order-trade close reconciliation now returns before
    full local close settlement when cumulative close fill quantity is below
    the local open position quantity, preventing local `CLOSED` state and close
    trade creation while residual exposure may remain. Validation PASS: no-DB
    exchange helper and focused runtime suites (`56/56`), API typecheck,
    repository guardrails, lint, and diff check. Full DB-backed
    exchange-events suite remains pending because local Postgres at
    `localhost:5432` is unavailable. Evidence:
    `docs/planning/position-management-exchange-event-underfilled-close-task-2026-05-06.md`.

- [x] `PMPLC-12 fix(api-runtime): keep underfilled close from closing full position`
  - Scope: closed an ARCHITECT-mode money-impacting runtime close safety slice.
    Runtime close orchestration now keeps an underfilled close confirmation in
    submitted/waiting state when the reported filled quantity is below local
    open position quantity, preventing local `CLOSED` state and close trade
    creation while residual exposure may remain. Validation PASS: focused
    runtime orchestrator suite (`18/18`), focused runtime
    orchestrator/automation suites (`54/54`), API typecheck, repository
    guardrails, lint, and diff check. DB-backed exchange-events suite was
    blocked by unavailable local Postgres at `localhost:5432`. Evidence:
    `docs/planning/position-management-underfilled-close-fail-closed-task-2026-05-06.md`.

- [x] `PMPLC-11 fix(api-runtime): cap LIVE free cash by exchange free balance`
  - Scope: closed a BUILDER-mode money-impacting LIVE runtime capital slice.
    Runtime capital now preserves exchange account and free balances
    separately, keeps allocation/reference balance based on account total, caps
    LIVE free cash by exchange free balance when present, and records wallet
    snapshots with the actual free balance. Validation PASS: focused runtime
    capital suite (`18/18`), focused runtime DCA/position suites (`76/76`),
    API typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-live-free-balance-cap-task-2026-05-06.md`.

- [x] `PMPLC-10 fix(api-backtests): reserve entry margin in tracked replay balance`
  - Scope: closed a TESTER-mode money-impacting replay accounting slice.
    Single-symbol replay now reserves entry margin, accumulates DCA margin in
    open position state, returns reserved margin during close/final settlement,
    and checks DCA affordability against remaining free cash. Validation PASS:
    focused backtest replay suite (`29/29`), focused backtest/runtime DCA
    suites (`61/61`), API typecheck, repository guardrails, lint, and diff
    check. Evidence:
    `docs/planning/position-management-replay-tracked-balance-reserve-task-2026-05-06.md`.

- [x] `PMPLC-09 fix(api-backtests): use DCA fill price for replay reserve accounting`
  - Scope: closed an ARCHITECT-mode money-impacting backtest accounting slice.
    Backtest replay now uses the selected DCA fill price for DCA event price,
    affordability checks, and interleaved portfolio reserved-margin accounting,
    preventing false cash exhaustion after wick-priced DCA fills. Validation
    PASS: focused contract remediation suite (`10/10`), focused
    backtest/runtime DCA suites (`60/60`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-portfolio-dca-fill-margin-task-2026-05-06.md`.

- [x] `PMPLC-08 fix(api-backtests): release final-candle reserved margin from portfolio state`
  - Scope: closed a BUILDER-mode money-impacting portfolio accounting slice.
    Interleaved portfolio simulation now removes positions closed in the
    final-candle loop from `openPositions`, so returned margin is not counted
    again in `finalBalance`. Validation PASS: focused contract remediation
    suite (`9/9`), focused backtest/runtime DCA suites (`59/59`), API
    typecheck, repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-portfolio-final-margin-release-task-2026-05-06.md`.

- [x] `PMPLC-07 fix(api-backtests): estimate DCA funds from selected level size`
  - Scope: closed a BUILDER-mode money-impacting backtest/runtime parity
    slice. Backtest replay and interleaved portfolio simulation now estimate
    DCA funds from the core-selected `dcaAddedQuantity` instead of guessing the
    multiplier from aggregate add count, preventing mixed-lane selected-level
    affordability drift. Validation PASS: focused backtest replay suite
    (`28/28`), focused backtest/runtime DCA suites (`50/50`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-backtest-selected-dca-funds-task-2026-05-06.md`.

- [x] `PMPLC-06 fix(api-backtests): respect tracked wallet funds before replay DCA adds`
  - Scope: closed a BUILDER-mode money-impacting backtest/runtime parity
    slice. Single-symbol replay now estimates the next DCA add margin against
    tracked wallet balance before mutating position state, skips unaffordable
    DCA events, and still releases close protection when DCA is
    funds-exhausted. Validation PASS: focused backtest replay suite (`27/27`),
    focused backtest/runtime DCA suites (`49/49`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-backtest-dca-funds-parity-task-2026-05-06.md`.

- [x] `PMPLC-05 fix(api-backtests): preserve mixed DCA lane parity with runtime`
  - Scope: closed a TESTER-mode money-impacting backtest/runtime parity slice.
    Backtest replay now chooses DCA probe prices from the candle extreme that
    matches the pending DCA lane direction, carries
    `executedDcaLevelIndices` across replay state, and interleaved portfolio
    simulation reuses the same resolver so adverse and favorable DCA lanes stay
    aligned with runtime. Validation PASS: focused backtest replay suite
    (`26/26`), focused backtest/runtime DCA suites (`48/48`), API typecheck,
    repository guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-backtest-mixed-dca-parity-task-2026-05-06.md`.

- [x] `PMPLC-04 test(api-runtime): lock LIVE close order contract before venue protection work`
  - Scope: closed a BUILDER-mode money-impacting runtime contract slice.
    Runtime close coverage now explicitly locks the current LIVE close payload
    as a runtime-owned reduce-only `MARKET` order and asserts no hidden
    `stopPrice`, `stopLoss`, or `takeProfit` fields are sent before the future
    exchange-backed protection-order vertical slice exists. Validation PASS:
    focused runtime orchestrator suite (`17/17`), API typecheck, repository
    guardrails, lint, and diff check. Evidence:
    `docs/planning/position-management-live-close-order-contract-task-2026-05-06.md`.

- [x] `PMPLC-03 fix(strategy-config): block unreachable basic DCA levels`
  - Scope: closed a BUILDER-mode money-impacting strategy validation slice.
    Strategy create/update/import validation now rejects basic-mode configs
    where positive DCA levels sit above hard `TP` or negative DCA levels sit
    below hard `SL`, and the strategy form blocks the same invalid payload with
    localized validation feedback. Validation PASS: focused API strategy config
    validation suite (`5/5`), focused web strategy validation/form suite
    (`12/12`), API/web typecheck, route-reachable i18n audit, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/position-management-basic-dca-reachability-task-2026-05-06.md`.

- [x] `PMPLC-02 fix(api-runtime): preserve mixed DCA lane progress`
  - Scope: closed a BUILDER-mode money-impacting runtime lifecycle slice.
    Position-management state now records executed DCA level indices, letting
    positive and negative DCA lanes execute independently from the closest
    pending threshold while preserving `currentAdds` as the compatibility
    count. Validation PASS: focused position management suite (`22/22`),
    runtime automation suite (`36/36`), runtime serialization suite (`8/8`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/position-management-dca-lane-state-task-2026-05-06.md`.

- [x] `PMPLC-01 docs(architecture): freeze PnL position-management lifecycle contract`
  - Scope: closed an ARCHITECT-mode docs-only source-of-truth update for
    operator-clarified DCA/TP/SL/TTP/TSL behavior. Added canonical positive
    and negative DCA lanes, DCA-first close gating, unreachable DCA warnings
    for basic TP/SL, TTP/TSL activation-versus-trail semantics, unaffordable
    DCA policy, live order/position reconciliation, imported-position
    adoption-point rules, and backtest parity requirements. Validation PASS:
    repository guardrails and architecture diff review. Evidence:
    `docs/planning/position-management-pnl-lifecycle-contract-task-2026-05-06.md`.

- [x] `RUNTIME-AUDIT-143 test(web-dashboard): lock dynamic stop display precedence`
  - Scope: closed a money-impacting dynamic stop display coverage gap.
    Resolver-level tests now lock TSL display only when TTP is inactive,
    backend TTP suppression of TSL, fallback TTP suppression of TSL, and
    backend TTP precedence over fallback TTP. Validation PASS: focused runtime
    derivations suite (`5/5`), web typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-143-dynamic-stop-display-contract-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-142 test(web-dashboard): lock backend TTP precedence`
  - Scope: closed a money-impacting dashboard regression gap. Runtime
    view-model coverage now proves backend dynamic TTP protection wins over
    fallback TTP display when both values exist. Validation PASS: focused
    runtime selection view-model suite (`9/9`), web typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-142-backend-ttp-precedence-regression-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-141 fix(web-dashboard): scope fallback TTP sticky state`
  - Scope: closed an ARCHITECT-mode money-impacting runtime display boundary
    fix. Fallback TTP sticky favorable-move state is now keyed by bot id,
    runtime session id, and position id, with regression coverage preventing
    cross-runtime leakage. Validation PASS: focused runtime selection
    view-model suite (`8/8`), web typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-141-scope-fallback-ttp-sticky-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-140 test(web-dashboard): lock fallback TTP disarm behavior`
  - Scope: closed a TESTER-mode money-impacting dashboard regression gap.
    Selected runtime view-model coverage now proves fallback TTP protection
    clears when live PnL drops below the first trailing take-profit disarm
    floor, while planned TTP row truth can keep dynamic stop columns visible.
    Validation PASS: focused runtime selection view-model suite (`7/7`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-140-fallback-ttp-disarm-regression-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-139 fix(web-dashboard): show fallback TTP protection`
  - Scope: closed a BUILDER-mode dashboard TTP display drift. Selected runtime
    open-position rows now compute fallback TTP protected percent from existing
    trailing take-profit levels and live PnL, and the TTP display resolver uses
    that fallback before backend dynamic stop price arrives. Validation PASS:
    focused runtime selection view-model suite (`6/6`), runtime table
    presenter suite, web typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-139-dashboard-fallback-ttp-display-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-138 fix(web-ui): clamp manual total pages with visible rows`
  - Scope: closed an ARCHITECT-mode shared table pagination contract drift.
    Manual pagination now preserves `totalPages=0` for empty tables only and
    reports at least one page when rows are visible, preventing `Page 1/0`
    summaries with rendered runtime rows. Validation PASS: focused `DataTable`
    suite (`9/9`), web typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-138-manual-total-pages-visible-rows-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-137 fix(web-ui): clamp manual table totals without reported totals`
  - Scope: closed a BUILDER-mode shared table display invariant follow-up.
    Manual-pagination footer totals now clamp against visible rows even when
    callers provide only `totalRows` metadata and no `reportedTotalRows`.
    Validation PASS: focused `DataTable` suite (`8/8`), web typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-137-manual-total-display-clamp-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-136 fix(web-ui): clamp manual reported table totals`
  - Scope: closed a BUILDER-mode follow-up to the shared table display
    invariant. Manual pagination reported totals now clamp against visible
    rows as well as external metadata, so stale zero metadata cannot contradict
    rendered rows. Validation PASS: focused `DataTable` suite (`7/7`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-136-manual-reported-table-total-clamp-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-135 fix(web-ui): clamp reported table totals`
  - Scope: closed a TESTER-mode shared table display invariant gap. Display-only
    reported totals now remain at least the effective table row count, so a
    stale or inconsistent runtime counter cannot show `Rows: 0` while rows are
    visible. Validation PASS: focused `DataTable` suite (`6/6`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-135-clamp-reported-table-totals-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-134 fix(web-dashboard): include open-order icon symbols`
  - Scope: closed a BUILDER-mode dashboard open-orders display drift.
    Runtime icon lookup now includes symbols that appear only in open orders,
    reusing the existing shared icon hook and resolver. Validation PASS:
    focused dashboard open-orders source suite (`1/1`), web typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-134-open-orders-icon-symbols-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-133 fix(web-dashboard): preserve position row totals`
  - Scope: closed a BUILDER-mode dashboard position/open-order counter drift.
    `DataTable` now supports display-only reported totals, and the runtime
    open-position/open-order tables pass API `openCount` and `openOrdersCount`
    without creating fake client-side pages. Validation PASS: focused
    `DataTable` suite (`5/5`), focused dashboard open-orders source suite
    (`1/1`), web typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-133-dashboard-position-row-totals-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-132 refactor(web-dashboard): centralize runtime trade-row selector`
  - Scope: closed an ARCHITECT-mode dashboard runtime truth cleanup. Selected
    runtime trade-row resolution now lives in one helper with branch coverage
    for selected query precedence, matching snapshot fallback, and mismatched
    session blocking. Validation PASS: focused runtime selection view-model
    suite (`5/5`), focused dashboard component suite (`20/20`), web typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-132-runtime-trade-row-selector-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-131 fix(web-dashboard): preserve snapshot trade rows`
  - Scope: closed a BUILDER-mode dashboard trade-history visibility drift.
    Runtime selected-data projection now falls back to matching
    `selected.trades.items` until the derived `selectedTrades` query projection
    is ready, while keeping query projection precedence and session-id guards.
    Validation PASS: focused runtime selection view-model suite (`2/2`),
    focused dashboard component suite (`20/20`), web typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-131-snapshot-trade-rows-fallback-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-130 fix(web-ui): preserve empty manual pagination meta`
  - Scope: closed a TESTER-mode shared dashboard pagination contract drift.
    `DataTable` manual pagination now preserves explicit external
    `totalPages=0` for empty runtime metadata while keeping page callbacks
    one-based, so empty dashboard trade history no longer gets normalized to a
    fake page count. Validation PASS: focused `DataTable` suite (`4/4`),
    focused dashboard component suite (`20/20`), web typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-130-manual-pagination-empty-meta-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-129 refactor(web-dashboard): share runtime trade meta builder`
  - Scope: closed an ARCHITECT-mode dashboard runtime source-of-truth cleanup.
    Runtime trade metadata construction now lives in one shared
    `home-live-widgets` helper used by both component fallback and aggregate
    controller paths, preserving empty `totalPages=0` and page clamping without
    duplicated formulas. Validation PASS: focused dashboard component suite
    (`20/20`), focused dashboard controller suite (`2/2`), web typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-129-shared-trade-meta-builder-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-128 fix(web-dashboard): align fallback trade metadata`
  - Scope: closed a BUILDER-mode dashboard runtime fallback metadata drift.
    The home runtime widget now builds fallback trade metadata with runtime API
    empty-state semantics, so empty local trade-history fallback reports
    `totalPages=0` and non-empty fallback pages are clamped to the local page
    range. Validation PASS: focused dashboard component suite (`20/20`), web
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-128-dashboard-trade-meta-fallback-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-127 fix(web-dashboard): preserve aggregate trade totals`
  - Scope: closed a BUILDER-mode dashboard aggregate trade-history counter
    drift. The main dashboard now preserves API aggregate `trades.total` before
    local trade filters or sort are applied, so the unfiltered trade-history
    count no longer collapses to the returned item-window length. Validation
    PASS: focused dashboard controller suite (`2/2`), web typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-127-dashboard-aggregate-trade-total-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-126 fix(web-bots): align empty aggregate trade meta fallback`
  - Scope: closed an ARCHITECT-mode dashboard aggregate fallback contract
    drift. The web no-session aggregate fallback now reports
    `trades.meta.pageSize` from the requested `perSessionLimit`, matching the
    API empty aggregate contract while preserving zero totals and
    `hasNext=false`. Validation PASS: focused web aggregate service suite
    (`3/3`), web typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-126-web-empty-aggregate-trade-meta-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-125 fix(api-bots): align empty aggregate trade meta`
  - Scope: closed a TESTER-mode runtime aggregate empty-state metadata drift.
    Empty aggregate trades now reuse the aggregate trade meta helper with the
    caller's `perSessionLimit`, so `meta.pageSize` matches the same contract as
    non-empty aggregate reads while `total=0`, `totalPages=0`, and
    `hasNext=false` remain unchanged. Validation PASS: focused runtime session
    position unit suite (`16/16`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-125-empty-aggregate-trade-meta-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-124 fix(api-bots): align aggregate trade meta page size`
  - Scope: closed a BUILDER-mode runtime aggregate trade metadata drift.
    Aggregate trades `meta.pageSize` now reports the requested
    `perSessionLimit` instead of the deduped returned item count, while
    `hasNext` remains based on `totalTrades > returnedItems`. Validation PASS:
    focused runtime session position unit suite (`16/16`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-124-aggregate-trade-meta-page-size-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-123 refactor(api-bots): remove stale aggregate position source`
  - Scope: closed an ARCHITECT-mode runtime aggregate source-clarity cleanup.
    Removed the unused all-session `positionResponses` collection after current
    open rows, open orders, history rows, and display flags moved to their
    canonical current/projection sources. Validation PASS: focused runtime
    session position unit suite (`15/15`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-123-remove-stale-position-response-aggregate-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-122 fix(api-bots): preserve aggregate account balance`
  - Scope: closed a BUILDER-mode runtime aggregate wallet/capital visibility
    drift. Aggregate capital summary selection now treats finite
    `accountBalance` as usable evidence, so account-balance-only latest
    snapshots are preserved instead of falling back to older/null capital
    summaries. Validation PASS: focused runtime session position unit suite
    (`15/15`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-122-aggregate-account-balance-summary-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-121 fix(api-bots): align aggregate dynamic stop flag`
  - Scope: closed a BUILDER-mode runtime aggregate dashboard display-flag
    drift. Aggregate `positions.showDynamicStopColumns` now comes from the
    freshest position response, matching current open position/open-order row
    projection and preventing stale older RUNNING snapshots from enabling
    unused dynamic-stop columns. Validation PASS: focused runtime session
    position unit suite (`14/14`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-121-aggregate-dynamic-stop-flag-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-120 fix(api-bots): align aggregate position items`
  - Scope: closed a TESTER-mode runtime aggregate dashboard table/counter
    drift. Aggregate current open position rows and open order rows now come
    from the freshest position response, while historical position rows use the
    latest-running projection rows, so stale older RUNNING snapshots no longer
    stay visible after counters move to the newer snapshot. Validation PASS:
    focused runtime session position unit suite (`13/13`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-120-aggregate-position-items-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-119 fix(api-bots): align aggregate running trade items`
  - Scope: closed a BUILDER-mode runtime aggregate dashboard table/counter
    drift. Aggregate trade table items now use the same latest-running
    projection rows as trade totals and fees, so stale older RUNNING session
    trade rows no longer remain visible after counters project to the newer
    RUNNING session. Validation PASS: focused runtime session position unit
    suite (`12/12`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-119-aggregate-running-trade-items-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-118 fix(api-bots): align aggregate running symbols`
  - Scope: closed a BUILDER-mode runtime aggregate dashboard metadata drift.
    Aggregate `symbolsTracked` now uses the same latest-running projection rows
    as duration and event metadata, so overlapping RUNNING sessions no longer
    inflate the aggregate header while completed/non-running rows still
    contribute normally. Validation PASS: focused runtime session position unit
    suite (`11/11`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-118-aggregate-running-symbols-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-117 fix(api-bots): restrict carry-over session trades`
  - Scope: closed an ARCHITECT-mode runtime trades dashboard window drift.
    Carry-over position trade reads now include normal in-window trades plus
    only persisted imported `OPEN` anchors outside the window, so pre-window
    DCA/CLOSE/fee rows no longer leak into current session trade history or
    fees. Validation PASS: focused runtime session position unit suite
    (`10/10`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-117-trades-carryover-window-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-116 fix(api-bots): include live imported open positions in symbol stats`
  - Scope: closed a BUILDER-mode LIVE dashboard parity drift. Runtime
    symbol-stats live open-position rows now include direct bot positions and
    owned LIVE imported positions via the existing external ownership index,
    including market-aware and legacy external IDs with wallet/null-wallet
    recovery scope. Validation PASS: focused runtime session position unit
    suite (`8/8`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-116-symbol-stats-live-imported-open-position-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-115 fix(api-bots): include carried open positions in symbol stats`
  - Scope: closed a TESTER-mode runtime dashboard parity drift. Runtime
    symbol-stats live open-position reads now include positions opened before
    session start when they remain active by the session window end, matching
    the session positions endpoint's carried-position semantics. Validation
    PASS: focused runtime session position unit suite (`6/6`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-115-symbol-stats-carried-open-position-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-114 fix(api-bots): bound session closed positions by window`
  - Scope: closed an ARCHITECT-mode runtime session dashboard window drift.
    Closed-position history and fee aggregation now bound `closedAt` by both
    session start and resolved window end, so completed sessions cannot include
    later closes or fees. The slice also extracted two small pure helpers out
    of the runtime session position read monolith to keep repository guardrails
    green. Validation PASS: focused runtime session position unit suite
    (`5/5`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-114-session-closed-position-window-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-113 fix(api-wallets): include paper closed position realized PnL`
  - Scope: closed a BUILDER-mode PAPER wallet analytics drift. Wallet
    performance summary and equity timeline now include realized PnL from
    closed `IN_SYNC` PAPER positions owned directly by the wallet or by bots
    using the wallet, while LIVE wallet realized PnL remains cashflow-based.
    Validation PASS: focused wallet service unit suite (`5/5`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-113-paper-wallet-realized-pnl-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-112 fix(api-bots): scope runtime trade wallet fallback to live`
  - Scope: closed a BUILDER-mode runtime read-model drift. Runtime position
    trade reads now include botless wallet-scoped trade fallback only for LIVE
    recovery/import visibility, so PAPER bot dashboards no longer risk mixing
    unrelated botless wallet-scoped trades into bot-scoped position rows.
    Validation PASS: focused runtime positions read unit suite (`4/4`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-112-paper-runtime-trade-wallet-fallback-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-111 test(api-orders): align paper position bot-scope expectations`
  - Scope: closed a BUILDER-mode test-contract drift. DB-backed order tests
    now expect bot-created PAPER positions to persist with
    `Position.walletId=null`, while LIVE remains wallet-scoped, aligning the
    regression suite with the RUNTIME-AUDIT-108 bot-scoped persistence
    contract. Validation PASS: API typecheck, repository guardrails, lint, and
    diff review. Targeted DB-backed order tests were attempted but timed out
    locally after 120s because the local PostgreSQL-backed suite did not
    complete in this environment. Evidence:
    `docs/planning/runtime-audit-111-paper-position-test-contract-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-110 fix(api-bots): preserve paper close bot scope`
  - Scope: closed a TESTER-mode PAPER manual-close ownership drift. Manual
    dashboard close now backfills missing position `walletId` only in LIVE
    recovery paths, so PAPER bot-scoped positions remain in the
    `Position.walletId=null` persistence lane while close orchestration still
    receives wallet context from the bot. Validation PASS: focused runtime
    session position command suite (`11/11`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-110-paper-manual-close-wallet-backfill-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-109 fix(api-wallets): block paper reset on bot-owned positions`
  - Scope: closed a BUILDER-mode PAPER wallet reset safety drift. PAPER wallet
    reset now counts active `OPEN` + `IN_SYNC` positions directly assigned to
    the wallet and positions owned by bots that use the wallet, preserving
    fail-closed reset behavior after PAPER bot positions moved to bot-scoped
    persistence. Validation PASS: focused wallet service unit suite (`3/3`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-109-paper-reset-bot-position-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-108 fix(api-orders): persist paper positions in bot scope`
  - Scope: closed an ARCHITECT-mode PAPER persistence/DB uniqueness drift.
    PAPER bot positions now persist with `Position.walletId=null`, so they use
    the existing bot-scoped DB uniqueness lane instead of colliding with
    wallet-scoped open-position uniqueness. Order/trade wallet attribution is
    preserved, runtime capital reads use bot scope for PAPER, and wallet
    open-PnL reads include PAPER bot positions through the existing bot-wallet
    relation. Validation PASS: focused unit pack (`23/23`), API typecheck,
    repository guardrails, lint, and diff review. DB-backed order-service
    regression remains locally blocked by unavailable PostgreSQL on
    `localhost:5432`. Evidence:
    `docs/planning/runtime-audit-108-paper-position-db-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-107 fix(api-orders): scope PAPER fills by bot`
  - Scope: closed a BUILDER-mode PAPER execution scope drift. Order
    open-position scope is now mode-aware: PAPER orders with a bot id use bot
    scope even when a shared wallet id is present, while LIVE remains
    wallet-scoped. This prevents a PAPER fill from reusing or conflicting with
    another bot's same-symbol position on the same paper wallet, so the active
    bot gets its own dashboard-visible position. Validation PASS: focused
    order-scope unit suite (`2/2`), API typecheck, repository guardrails, lint,
    and diff review. A DB-backed order-service regression was added but local
    execution was blocked by unavailable PostgreSQL on `localhost:5432`.
    Evidence:
    `docs/planning/runtime-audit-107-paper-order-fill-bot-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-106 fix(api-bots): dedupe bot-open DCA display`
  - Scope: closed a BUILDER-mode dashboard DCA display drift reported by the
    operator. Runtime position reads now include `orderId` and infer DCA
    progress from unique entry lifecycle units, so duplicate same-order `OPEN`
    rows from bot runtime and exchange fill handling display DCA `0` until a
    real `DCA` row or runtime progress exists. Validation PASS: focused DCA
    count unit suite (`2/2`), API typecheck, repository guardrails, lint, and
    diff review. Integration e2e scenario was added but local execution was
    blocked by unavailable PostgreSQL on `localhost:5432`. Evidence:
    `docs/planning/runtime-audit-106-bot-open-dca-display-dedupe-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-105 fix(api-engine): scope runtime external count to synced rows`
  - Scope: closed a TESTER-mode runtime cap active-truth drift. LIVE owned
    imported fallback open-position counts now require `syncState=IN_SYNC`,
    so stale `ORPHAN_LOCAL` imported rows cannot inflate bot open-position
    caps or block expected runtime opens after dashboard truth has already
    ignored them. Validation PASS: runtime signal-loop defaults suite
    (`10/10`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-105-runtime-external-count-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-104 fix(api-runtime): guard close mutations by sync state`
  - Scope: closed a BUILDER-mode close mutation active-truth drift. Manual
    order close and runtime execution default close mutations now require the
    linked position to be `OPEN` + `IN_SYNC`, so an `ORPHAN_LOCAL` stale row
    cannot be closed through a valid order or runtime EXIT path. Validation
    PASS: orders service suite (`35/35`), execution orchestrator suite
    (`17/17`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-104-close-position-mutation-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-103 fix(api-positions): scope reconciliation synced lookups`
  - Scope: closed a BUILDER-mode LIVE reconciliation active-truth drift.
    Default open-synced position lookup and API-key stale-position scan now
    exclude `ORPHAN_LOCAL` rows while preserving recoverable `DRIFT`, so stale
    local imported rows no longer steal LIVE exchange updates or receive stale
    close handling after they leave active truth. Validation PASS: focused
    reconciliation suite (`31/31`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-103-reconciliation-open-synced-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-102 fix(api-engine): scope scan watchdog to synced rows`
  - Scope: closed an ARCHITECT-mode runtime scan target drift. Default runtime
    scan watchdog target discovery now derives ticker targets only from
    `OPEN` + `IN_SYNC` supported position contexts, so stale local
    `ORPHAN_LOCAL` rows no longer create inferred watchdog ticker processing
    while explicit `RUNTIME_SCAN_SYMBOLS` remains operator-owned. Validation
    PASS: focused runtime scan suite (`6/6`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-102-runtime-scan-watchdog-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-101 fix(api-engine): scope position automation to synced rows`
  - Scope: closed a BUILDER-mode runtime automation active-truth drift.
    Ticker-driven runtime position automation now hydrates only `OPEN` +
    `IN_SYNC` bot-managed positions, so stale local `ORPHAN_LOCAL` rows cannot
    receive DCA, TP, TTP, SL, or TSL automation decisions while synced
    exchange-imported ownership hydration remains covered. Validation PASS:
    focused automation default-deps suite (`1/1`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-101-position-automation-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-100 fix(api-engine): scope position lifetime to synced rows`
  - Scope: closed a TESTER-mode runtime lifetime active-truth drift. Runtime
    position lifetime scanning now selects only stale `OPEN` + `IN_SYNC`
    positions, so stale local `ORPHAN_LOCAL` rows cannot trigger automated
    close orchestration while synced stale positions still close through the
    canonical runtime path. Validation PASS: focused lifetime suite (`4/4`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-100-position-lifetime-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-99 fix(api-bots): scope PAPER LIVE switch guard`
  - Scope: closed an ARCHITECT-mode bot management active-truth drift. PAPER
    to LIVE mode switch guard now counts only `OPEN` + `IN_SYNC`
    `BOT_MANAGED` paper positions, so stale local `ORPHAN_LOCAL` rows no
    longer block a bot configuration switch while real active paper positions
    remain fail-closed. Validation PASS: focused bot e2e pack (`27/27`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-99-paper-live-switch-active-position-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-98 fix(api-orders): release stale fill blockers`
  - Scope: closed a BUILDER-mode immediate-fill DB blocker drift. Order fill
    lifecycle now repair-closes exact-scope `ORPHAN_LOCAL` open position
    blockers with `SYSTEM_REPAIR` / `REPAIR_ONLY_CLEANUP` before creating a
    fresh `IN_SYNC` position, so stale local rows no longer block PAPER/LIVE
    filled orders at the partial unique index layer. Validation PASS: orders
    service suite (`34/34`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-98-immediate-fill-stale-position-blocker-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-97 fix(api-orders): require synced open position scope`
  - Scope: closed a BUILDER-mode shared order open-position scope drift.
    Shared order open-position scope and LIVE imported-position fallbacks now
    require `syncState=IN_SYNC`, so stale local or imported open rows no longer
    drive manual reverse-conflict checks or unlinked fill reusable-position
    lookup. Validation PASS: orders service suite (`33/33`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-97-open-position-scope-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-96 fix(api-orders): guard linked position fill lifecycle`
  - Scope: closed an ARCHITECT-mode linked-position lifecycle drift. LIVE
    exchange order-trade fills now apply linked-position close/DCA lifecycle
    only when the linked position is `status=OPEN` and `syncState=IN_SYNC`, so
    stale local linked positions can no longer receive DCA/close position
    updates, DCA trades, or runtime DCA dedupe completion. Validation PASS:
    exchange-events suite (`7/7`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-96-linked-position-fill-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-95 fix(api-orders): scope trade updates to synced live orders`
  - Scope: closed a TESTER-mode LIVE order-trade update scope drift. Binance
    order-trade updates now resolve local orders only when `syncState=IN_SYNC`
    and the order belongs to the event's LIVE Binance market through wallet or
    bot scope, so stale same-exchange-id local rows cannot receive fills or
    steal lifecycle updates from the valid active order. Validation PASS:
    exchange-events suite (`6/6`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-95-order-trade-update-order-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-94 fix(api-orders): scope account updates to synced positions`
  - Scope: closed a BUILDER-mode LIVE account-update active-truth drift.
    Binance account-update scope resolution now requires `syncState=IN_SYNC`
    beside `status=OPEN`, so stale same-symbol local rows from another live
    bot/wallet scope cannot create false ambiguity or receive quantity, entry,
    PnL, or external-close updates. Validation PASS: exchange-events suite
    (`6/6`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-94-account-update-scope-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-93 fix(api-engine): guard dedupe success by order state`
  - Scope: closed an ARCHITECT-mode runtime DCA completion drift. Runtime
    execution dedupe success-by-order now requires the linked order to be
    `status=FILLED` and `syncState=IN_SYNC` before writing `SUCCEEDED`, so a
    stale local order cannot complete runtime DCA dedupe or update runtime DCA
    state after exchange-event handling. Validation PASS: runtime execution
    dedupe suite (`11/11`), exchange-events suite (`6/6`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-93-dedupe-success-order-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-92 fix(api-engine): align dedupe linked orders with sync state`
  - Scope: closed a BUILDER-mode runtime execution dedupe active-truth drift.
    Linked orders are now reused as submitted or completed only when
    `syncState=IN_SYNC`; a linked `ORPHAN_LOCAL` order immediately resets the
    dedupe row for a fresh execution attempt instead of keeping the intent
    submitted or inflight. Validation PASS: runtime execution dedupe suite
    (`9/9`), execution orchestrator suite (`17/17`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-92-runtime-dedupe-linked-order-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-91 fix(api-engine): align execution open lookup with sync state`
  - Scope: closed a BUILDER-mode runtime execution active-truth drift. Runtime
    execution open-position lookup now requires `syncState=IN_SYNC` for direct
    and LIVE imported fallback reads, so stale `ORPHAN_LOCAL` open rows no
    longer drive `already_open_same_side`, no-flip, or EXIT close decisions
    after dashboard/pre-trade/runtime loop has stopped treating them as active.
    Validation PASS: focused execution orchestrator suite (`17/17`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-91-execution-open-lookup-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-90 fix(api-engine): align runtime loop repository with sync state`
  - Scope: closed a TESTER-mode runtime loop active-truth drift. Runtime signal
    loop repository reads now require `syncState=IN_SYNC` when hydrating
    managed external open positions and counting bot-symbol open positions for
    caps, so stale `ORPHAN_LOCAL` open rows no longer inflate runtime cap or
    managed-import truth. Validation PASS: focused runtime repository/defaults
    pack (`12/12`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-90-runtime-loop-repository-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-89 fix(api-engine): align pre-trade open guards with sync state`
  - Scope: closed a BUILDER-mode pre-trade/runtime active-truth drift.
    Pre-trade user open-position counts, bot open-position counts,
    same-symbol checks, and LIVE imported fallback reads now require
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open cleanup rows no longer
    block PAPER/LIVE opens through caps or same-symbol guard while active rows
    remain blocking. Validation PASS: focused pre-trade e2e/unit pack
    (`25/25`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-89-pretrade-sync-state-open-guards-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-88 fix(api-positions): scope reconciliation owner cleanup by market`
  - Scope: closed a BUILDER-mode LIVE reconciliation cleanup ownership drift.
    Owner cleanup candidates for open synced orders and local managed positions
    are now seeded only from the reconciled canonical market prefix plus legacy
    unscoped ownership keys, excluding other canonical market prefixes on the
    same API key. This prevents a FUTURES reconciliation pass from checking or
    closing SPOT-only owner cleanup targets. Validation PASS: live position
    reconciliation suite (`30/30`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-88-reconciliation-owner-market-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-87 fix(api-positions): scope stale reconciliation scans by market`
  - Scope: closed an ARCHITECT-mode LIVE reconciliation write-path drift. LIVE
    position reconciliation stale synced-position scans now receive the synced
    API-key market type and include only the current canonical market prefix
    plus legacy unscoped imported IDs, excluding other canonical market
    prefixes from missing/close cleanup. This prevents a FUTURES
    reconciliation pass from marking same-api-key SPOT rows stale. Validation
    PASS: live position reconciliation suite (`29/29`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-87-reconciliation-stale-scan-market-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-86 fix(api-wallets): scope imported open PnL by market type`
  - Scope: closed a BUILDER-mode wallet analytics market-scope drift. Wallet
    performance summary and equity timeline now match botless LIVE imported
    open positions by canonical `apiKeyId:marketType:` external ID prefix
    instead of broad `apiKeyId:`, so a FUTURES wallet no longer includes SPOT
    open PnL from the same API key while same-market `IN_SYNC` imported PnL
    remains included. Validation PASS: wallets e2e (`20/20`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-86-wallet-open-pnl-market-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-85 fix(api-bots): align runtime closed history with sync state`
  - Scope: closed a TESTER-mode runtime/portfolio closed-history drift.
    Runtime closed-position reads, portfolio close-point reads, and runtime
    paper capital open/closed position queries now require `syncState=IN_SYNC`,
    so scoped `ORPHAN_LOCAL` cleanup rows no longer inflate closed counts,
    realized PnL, portfolio CLOSE points, reference balance, or free cash.
    Validation PASS: portfolio-history e2e (`3/3`), runtime-scope e2e
    (`16/16`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-85-runtime-closed-positions-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-84 fix(api-bots): align runtime open positions with sync state`
  - Scope: closed an ARCHITECT-mode runtime dashboard active-position drift.
    Bot runtime session positions now require `syncState=IN_SYNC` for active
    open-position truth, including open-count, open quantity, unrealized PnL,
    margin/free-cash, fee aggregation, and continuity candidate reads, so stale
    scoped `ORPHAN_LOCAL` open rows no longer appear as live bot positions.
    Validation PASS: runtime-scope e2e (`16/16`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-84-runtime-open-positions-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-83 fix(api-bots): align symbol live rows with sync state`
  - Scope: closed a BUILDER-mode runtime symbol KPI drift. Runtime symbol live
    row reads now require `syncState=IN_SYNC`, so scoped `ORPHAN_LOCAL`
    open-position rows no longer inflate symbol-stats open count, quantity,
    unrealized PnL, or derived market state while active synced rows remain
    included. Validation PASS: runtime-scope e2e (`15/15`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-83-symbol-live-rows-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-82 fix(api-wallets): align open PnL with sync state`
  - Scope: closed a BUILDER-mode wallet KPI/timeline parity drift. Wallet
    current open-PnL aggregation now requires `syncState=IN_SYNC` in the shared
    helper used by performance summary and equity timeline, so same-API-key
    `ORPHAN_LOCAL` imported open-position rows no longer inflate wallet
    dashboard PnL while active imported `IN_SYNC` rows remain included.
    Validation PASS: wallets e2e (`20/20`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-82-wallet-open-pnl-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-81 fix(api-wallets): align reset open-position blocker with sync state`
  - Scope: closed an ARCHITECT-mode paper wallet reset parity drift. Paper
    wallet reset now counts open-position blockers only when
    `syncState=IN_SYNC`, matching the existing open-order blocker and active
    position-list/runtime semantics, so stale `ORPHAN_LOCAL` open-position
    rows no longer deny reset. Validation PASS: wallets e2e (`20/20`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-81-wallet-reset-active-position-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-80 fix(api-positions): ignore local orphans in legacy repair`
  - Scope: closed a TESTER-mode legacy open-position repair drift. Local
    legacy repair now excludes `syncState=ORPHAN_LOCAL` from candidate scans
    and from both guarded repair update predicates, so a scope-matching local
    orphan cannot be rebound to a canonical bot or closed again by this repair
    path. Valid `IN_SYNC` legacy rebind, detached-blocker close, and exchange
    re-import behavior remain covered. Validation PASS: orphan-repair e2e
    (`1/1`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-80-orphan-repair-ignore-local-orphans-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-79 fix(api-positions): ignore local orphans in takeover repair`
  - Scope: closed a BUILDER-mode LIVE takeover repair drift. Takeover status
    and rebind candidate scans now exclude `syncState=ORPHAN_LOCAL`, and the
    rebind update predicate repeats the stale-local guard so a scope-matching
    local orphan cannot be shown as takeover-active or rebound back to
    `IN_SYNC`. `DRIFT` repair behavior remains intact. Validation PASS:
    takeover-status e2e (`6/6`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-79-takeover-ignore-local-orphans-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-78 fix(api-positions): reject stale management-mode toggles`
  - Scope: closed an ARCHITECT-mode position management-state drift.
    Dashboard/API management-mode updates now require `status=OPEN` and
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open-position rows cannot be
    switched between `BOT_MANAGED` and `MANUAL_MANAGED` after active lists and
    runtime paths stop treating them as live. Validation PASS: positions
    service suite (`3/3`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-78-position-management-mode-active-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-77 fix(api-positions): require synced state for manual updates`
  - Scope: closed a BUILDER-mode manual position update parity drift. Manual
    TP/SL updates now require `syncState=IN_SYNC` in addition to `status=OPEN`,
    and the mutation uses a guarded `updateMany` predicate so stale
    `ORPHAN_LOCAL` open-position rows cannot be changed after active
    list/runtime close paths stop treating them as active. Validation PASS:
    positions service suite (`2/2`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-77-position-manual-update-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-76 fix(api-positions): align active position lists with sync state`
  - Scope: closed a BUILDER-mode dashboard positions-list parity drift.
    Generic dashboard positions list now requires `syncState=IN_SYNC` when
    filtering `status=OPEN`, so stale `ORPHAN_LOCAL` open-position rows no
    longer appear as active list truth while unfiltered history remains
    available for audit. Validation PASS: positions list e2e (`2/2`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-76-positions-list-active-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-75 fix(api-runtime): require synced state for runtime close`
  - Scope: closed a TESTER-mode runtime manual-close parity drift.
    Dashboard/runtime manual close-position command now requires
    `syncState=IN_SYNC` for the selected open position and for the
    ownership-claim update guard, so stale `ORPHAN_LOCAL` open-position rows
    are ignored as `no_open_position` before close orchestration. Validation
    PASS: runtime position command suite (`10/10`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-75-runtime-close-position-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-74 fix(api-orders): require active sync state for order actions`
  - Scope: closed a BUILDER-mode manual order lifecycle parity drift. Manual
    `cancelOrder` and `closeOrder` now require `syncState=IN_SYNC`, so stale
    `ORPHAN_LOCAL` open-status rows cannot be canceled, filled, or used to
    close linked positions through direct API actions after runtime/dashboard
    has stopped treating them as active. Validation PASS: orders service suite
    (`31/31`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-74-order-actions-active-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-73 fix(api-orders): align active order lists with sync state`
  - Scope: closed a BUILDER-mode dashboard/order-list parity drift. Orders list
    active-status queries now require `syncState=IN_SYNC` for `PENDING`,
    `OPEN`, and `PARTIALLY_FILLED`, so stale `ORPHAN_LOCAL` open-status rows
    no longer appear as active order-list truth while unfiltered history and
    terminal status filters remain available. Validation PASS: orders service
    suite (`29/29`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-73-orders-list-active-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-72 fix(api-engine): align order lifetime with sync state`
  - Scope: closed an ARCHITECT-mode runtime lifecycle parity drift. Runtime
    order lifetime cancellation candidates now require `syncState=IN_SYNC`, so
    stale `ORPHAN_LOCAL` open-status order rows no longer generate cancel
    attempts or dedupe noise while stale confirmed active rows remain
    cancelable. Validation PASS: runtime order lifetime suite (`5/5`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-72-order-lifetime-active-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-71 fix(api-wallets): align reset open-order blocker with sync state`
  - Scope: closed a BUILDER-mode wallet/runtime lifecycle parity drift. Paper
    wallet reset now counts active open-order blockers only when
    `syncState=IN_SYNC`, so stale `ORPHAN_LOCAL` open-order rows no longer
    block reset after runtime/dashboard has stopped treating them as active.
    Active `IN_SYNC` open orders still block reset. Validation PASS: wallet e2e
    (`19/19`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-71-wallet-reset-active-order-sync-state-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-70 fix(api-runtime): hide stale synced open orders`
  - Scope: closed a TESTER-mode dashboard/reconciliation lifecycle drift.
    Runtime open-order reads now require `syncState=IN_SYNC`, so existing
    `ORPHAN_LOCAL` exchange-synced rows no longer inflate dashboard
    `openOrdersCount`; reconciliation stale-order marking now also moves stale
    synced orders to non-open `CANCELED`. Validation PASS: runtime-scope e2e
    (`15/15`), live reconciliation suite (`28/28`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-70-hide-stale-open-orders-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-69 fix(api-positions): scope open-order upsert by owner`
  - Scope: closed an ARCHITECT-mode LIVE open-order write-path ownership
    drift. Exchange-synced open-order upsert now searches existing rows only
    within the same bot or same botless wallet context before updating or
    blocking, so an unrelated wallet-null/botless `exchangeOrderId` collision
    cannot steal the update or prevent the owning bot/wallet row from being
    created. Validation PASS: live reconciliation suite (`27/27`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-69-open-order-upsert-owner-scope-task-2026-05-04.md`.

- [x] `RUNTIME-AUDIT-68 fix(api-runtime): require wallet proof for botless LIVE open orders`
  - Scope: closed a BUILDER-mode dashboard management-state ownership drift.
    Runtime session positions now require exact wallet proof before including
    botless LIVE `EXCHANGE_SYNC` open orders through the external-owned order
    fallback, so stale/global wallet-null rows cannot be counted only because
    they share an owned symbol. Bot-scoped wallet-null orders remain visible
    through the existing bot-scoped filter. Validation PASS: runtime-scope e2e
    (`14/14`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-68-live-open-order-wallet-proof-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-67 fix(api-runtime): scope imported external-id query filters`
  - Scope: closed a TESTER-mode DB candidate-filter drift after market-scoped
    imported IDs. Market-known imported-position queries now filter canonical
    rows by `apiKey:marketType:` and legacy rows by `apiKey:symbol:` instead
    of broad `apiKey:` prefixes, covering runtime dashboard position/trade
    reads, pre-trade guards, runtime loop open-count guards, execution
    no-flip reuse, and order conflict/fill reuse. Validation PASS: runtime
    loop defaults (`10/10`), live reconciliation (`26/26`), pre-trade service
    (`17/17`), orders service (`28/28`), runtime position command (`9/9`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-67-market-scoped-external-id-query-filters-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-66 fix(api-runtime): parse external-id market for ownership reads`
  - Scope: closed an ARCHITECT-mode read-path drift after market-scoped
    imported IDs. Takeover rebind/status, imported runtime ownership hydration,
    and runtime loop managed-external guards now parse `apiKey:marketType:symbol:side`
    IDs and pass the parsed market type into ownership lookup, with legacy
    `apiKey:symbol:side` fallback preserved. Validation PASS: runtime loop
    defaults suite (`10/10`), live reconciliation suite (`26/26`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-66-parse-external-id-market-ownership-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-65 fix(api-positions): market-scope imported external IDs`
  - Scope: closed a BUILDER-mode persisted identity drift after market-scoped
    ownership. LIVE reconciliation now builds imported position external IDs
    as `apiKey:marketType:symbol:side` whenever the synced API-key work item
    carries market type, while helper parsing and stale-symbol extraction stay
    compatible with legacy `apiKey:symbol:side` rows. Reconciliation also
    looks up legacy IDs before creating a fresh row, so existing legacy imports
    can be upgraded instead of duplicated. Validation PASS: live reconciliation
    suite (`26/26`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-65-market-scoped-external-position-id-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-64 fix(api-bots): scope external ownership by market type`
  - Scope: closed a BUILDER-mode LIVE import ownership drift. External
    takeover ownership now keys by `apiKey + marketType + symbol`, resolves
    market type from wallet/bot/active market-group scope, and passes known
    market type through reconciliation, runtime dashboard reads, pre-trade,
    order conflict/fill, and runtime loop call sites. Legacy FUTURES fallback
    and legacy injected ownership maps remain read-compatible. Validation
    PASS: ownership regression suite (`10/10`), live reconciliation suite
    (`25/25`), runtime loop defaults suite (`9/9`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-64-external-ownership-market-type-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-63 fix(api-positions): use market type in live reconciliation`
  - Scope: closed an ARCHITECT-mode LIVE import scope drift. The exchange
    reconciliation worker now expands synced API keys into one work item per
    LIVE wallet/active bot market type and passes that market type through
    position, open-order, trade-history, and owned automation snapshot paths.
    This removes the previous FUTURES-only snapshot assumption while preserving
    FUTURES fallback for legacy API-key-only contexts. Validation PASS: live
    position reconciliation unit suite (`25/25`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-63-live-reconciliation-market-type-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-62 fix(api-bots): show planned dynamic-stop columns`
  - Scope: closed a TESTER-mode API display-contract drift. Runtime session
    positions now return `showDynamicStopColumns=true` when an open position
    has planned trailing take-profit or trailing stop levels before a dynamic
    stop is armed, so dashboard visibility matches canonical row truth instead
    of waiting for `dynamicTtpStopLoss` / `dynamicTslStopLoss` to become
    non-null. Focused operator-truth tests were also aligned to symbols inside
    the bot's assigned market group. Validation PASS: dynamic-stop operator
    truth e2e (`3/3`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-62-planned-dynamic-stop-columns-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-61 fix(web-runtime): align dashboard dynamic-stop plan visibility`
  - Scope: closed a BUILDER-mode dashboard/Bots surface drift. Dashboard home
    and Bots monitoring now share `hasRuntimeDynamicStopRowTruth`, so TTP/TSL
    columns stay visible when an open row has dynamic stop prices, derived
    protected percentages, or planned trailing levels before arm. Validation
    PASS: focused web regression pack (`33/33`), web typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-61-dashboard-dynamic-stop-plan-visibility-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-60 fix(api-bots): prevent aggregate running session metadata overlap double counts`
  - Scope: closed an ARCHITECT-mode aggregate status metadata drift. Runtime
    monitoring aggregate `sessionDetail.durationMs` and
    `sessionDetail.eventsCount` now sum all non-running historical session rows
    plus only the freshest RUNNING session projection, so overlapping running
    sessions no longer double-count active runtime duration or active event
    count. `sessionsCount` and `symbolsTracked` remain unchanged as
    diagnostic/configured-scope metadata. Validation PASS: aggregate e2e
    (`18/18`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-60-aggregate-running-session-metadata-overlap-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-59 fix(api-bots): prevent aggregate running symbol-summary overlap double counts`
  - Scope: closed a BUILDER-mode aggregate market/signal summary drift.
    Runtime monitoring aggregate symbol items and `symbolStats.summary` now
    sum all non-running historical session rows plus only the freshest RUNNING
    session projection, so overlapping running sessions no longer double-count
    signal counters, closed-trade counters, gross PnL, or symbol fees in
    dashboard market/header summaries. Validation PASS: aggregate e2e
    (`17/17`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-59-aggregate-running-symbol-summary-overlap-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-58 fix(api-bots): prevent aggregate running closed-position overlap double counts`
  - Scope: closed a BUILDER-mode aggregate closed-position history drift.
    Runtime monitoring aggregate closed-position counts, realized PnL, and
    position fees now sum all non-running historical session rows plus only
    the freshest RUNNING session projection, so overlapping running sessions
    no longer show one visible closed history row with doubled dashboard
    closed totals. Validation PASS: aggregate e2e (`16/16`), runtime-scope
    e2e (`13/13`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-58-aggregate-running-closed-position-overlap-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-57 fix(api-bots): prevent aggregate symbol open-state overlap double counts`
  - Scope: closed a TESTER-mode aggregate market/signal current-state drift.
    Runtime monitoring aggregate symbol items and summary now keep historical
    counters summed while taking current open-position count, quantity, and
    unrealized PnL from the newest per-symbol snapshot, so overlapping RUNNING
    sessions no longer make symbol summaries disagree with positions current
    state. Validation PASS: aggregate e2e (`15/15`), runtime-scope e2e
    (`13/13`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-57-aggregate-symbol-open-overlap-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-56 fix(api-bots): prevent aggregate running trade overlap double counts`
  - Scope: closed a BUILDER-mode aggregate trade/fee drift. Runtime monitoring
    aggregate trade totals and fees now sum non-running historical session
    totals plus only the freshest RUNNING session projection, so overlapping
    running sessions no longer show one visible trade row with doubled
    `trades.total` or fee summary. Validation PASS: aggregate e2e (`15/15`),
    runtime-scope e2e (`13/13`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-56-aggregate-running-trade-overlap-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-55 fix(api-bots): align aggregate total positions with final counts`
  - Scope: closed a BUILDER-mode aggregate count consistency drift. Runtime
    monitoring aggregate `positions.total` now derives from final aggregate
    `openCount + closedCount`, so overlapping running sessions cannot leave
    `total` higher than the displayed open/closed counts after current
    open-position dedupe. Validation PASS: aggregate e2e (`14/14`),
    runtime-scope e2e (`13/13`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-55-aggregate-total-position-overlap-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-54 fix(api-bots): prevent aggregate open-position overlap double counts`
  - Scope: closed an ARCHITECT-mode current-state dashboard drift. Runtime
    monitoring aggregate now takes current open-position count, quantity, and
    unrealized PnL from the freshest session positions read model instead of
    summing overlapping session projections, so duplicate running sessions do
    not double-count the same open position. Historical closed/trade metrics
    remain session-window sums. Validation PASS: overlapping-session aggregate
    e2e (`14/14`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-54-aggregate-open-position-overlap-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-53 fix(api-bots): preserve portfolio close points under monitoring row caps`
  - Scope: closed a BUILDER-mode portfolio dashboard history drift. Bot
    portfolio history now composes close points from full scoped closed-position
    DB truth instead of capped monitoring aggregate visible rows, so a bot with
    more than 500 closed positions still shows close-point history aligned with
    closed-count and realized-PnL summaries. Validation PASS: 501-close
    portfolio history e2e (`3/3`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-53-portfolio-history-close-points-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-52 fix(api-bots): preserve aggregate symbols-tracked under item limits`
  - Scope: closed a TESTER-mode dashboard aggregate metadata drift. Runtime
    monitoring aggregate `sessionDetail.symbolsTracked` now composes full
    session metadata instead of visible aggregate symbol rows, so
    `perSessionLimit` no longer makes aggregate metadata understate how many
    markets the bot tracked. Validation PASS: failing-then-passing
    `perSessionLimit=1` symbols-tracked regression, monitoring aggregate e2e
    (`13/13`), runtime-scope e2e (`13/13`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-52-aggregate-symbols-tracked-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-51 fix(api-bots): preserve aggregate symbol-stats summaries under item limits`
  - Scope: closed an ARCHITECT-mode dashboard aggregate summary drift. Runtime
    monitoring aggregate now keeps visible `symbolStats.items` limited while
    composing `symbolStats.summary` and aggregate header signal counters from
    per-session summary truth, so hidden assigned symbols no longer disappear
    from aggregate signal and PnL totals under `perSessionLimit`. Validation
    PASS: failing-then-passing `perSessionLimit=1` aggregate symbol-stats
    summary regression, monitoring aggregate e2e (`13/13`), runtime-scope e2e
    (`13/13`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-51-aggregate-symbol-stats-summary-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-50 fix(api-bots): preserve symbol-stats open summary under item limits`
  - Scope: closed a BUILDER-mode dashboard market/signal summary drift.
    Runtime session symbol-stats now keep visible `items` limited while
    composing live open-position summary metrics from the full configured
    symbol scope, so hidden assigned symbols no longer disappear from
    `summary.openPositionCount`, `summary.openPositionQty`, or persisted
    `summary.unrealizedPnl`. Validation PASS: failing-then-passing `limit=1`
    symbol-stats open summary regression, runtime-scope e2e (`13/13`),
    monitoring aggregate e2e (`12/12`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-50-symbol-stats-open-summary-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-49 fix(api-bots): preserve aggregate open-order counts under row limits`
  - Scope: closed a BUILDER-mode dashboard management-state drift. Runtime
    monitoring aggregate `positions.openOrdersCount` now uses full
    current-state session open-order count truth via the maximum session count
    instead of limited visible aggregate rows, so `perSessionLimit` no longer
    hides older open orders from the dashboard count and multiple sessions do
    not double-count the same current open order. Validation PASS:
    failing-then-passing `perSessionLimit=1` aggregate open-order count
    regression, monitoring aggregate e2e (`12/12`), runtime-scope e2e
    (`12/12`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-49-aggregate-open-orders-count-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-48 fix(api-bots): preserve runtime open-order counts under row limits`
  - Scope: closed an ARCHITECT-mode dashboard management-state drift. Runtime
    session positions now return a full deduped `openOrdersCount` separately
    from limited visible `openOrders`, so dashboard open-order counts remain
    truthful when `limit` hides older scoped orders. Duplicate local/exchange
    open orders still dedupe through the existing preference rules.
    Validation PASS: failing-then-passing `limit=1` open-order count
    regression, runtime-scope e2e (`12/12`), monitoring aggregate e2e
    (`11/11`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-48-open-orders-count-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-47 fix(api-bots): preserve aggregate position fees under row limits`
  - Scope: closed a TESTER-mode dashboard accounting summary drift. Runtime
    monitoring aggregate `positions.summary.feesPaid` now composes
    per-session positions summaries instead of limited visible aggregate rows,
    so aggregate positions/wallet fee totals remain truthful when
    `perSessionLimit` hides older positions. Visible rows remain limited.
    Validation PASS: failing-then-passing `perSessionLimit=1` aggregate
    position-fee regression, runtime-scope e2e (`12/12`), monitoring
    aggregate e2e (`11/11`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-47-aggregate-position-fees-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-46 fix(api-bots): preserve runtime unrealized PnL under row limits`
  - Scope: closed a BUILDER-mode money-impacting dashboard summary drift.
    Runtime session positions now aggregate scoped persisted open-position
    `unrealizedPnl`, and monitoring aggregate composes unrealized PnL from
    per-session position summaries instead of limited visible open rows.
    Dashboard PnL summaries now remain truthful when `limit` /
    `perSessionLimit` hides older open positions while visible rows keep their
    existing dynamic display behavior. Validation PASS: failing-then-passing
    `perSessionLimit=1` unrealized-PnL regression, runtime-scope e2e
    (`12/12`), monitoring aggregate e2e (`11/11`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-46-position-unrealized-pnl-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-45 fix(api-bots): preserve runtime position fees under row limits`
  - Scope: closed an ARCHITECT-mode dashboard accounting summary drift.
    Runtime session positions now aggregate direct trade fees through the full
    scoped position set instead of limited visible position rows, so dashboard
    `positions.summary.feesPaid` remains truthful when `limit` /
    `perSessionLimit` hides older positions. Visible `openItems` and
    `historyItems` remain limited. Validation PASS: failing-then-passing
    `limit=1` position-fee regression, runtime-scope e2e (`12/12`),
    monitoring aggregate e2e (`11/11`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-45-position-fees-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-44 fix(api-bots): preserve aggregate trade fees under row limits`
  - Scope: closed a BUILDER-mode dashboard accounting summary drift. Runtime
    session trades now expose unpaginated scoped `feesPaid`, and monitoring
    aggregate `sessionDetail.summary.feesPaid` composes those session fee
    totals instead of limited visible trade rows. Dashboard fee summaries now
    remain truthful when `perSessionLimit` hides older trades while visible
    trade rows remain limited. Validation PASS: failing-then-passing
    `perSessionLimit=1` trade-fee regression, runtime-scope e2e (`12/12`),
    monitoring aggregate e2e (`11/11`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-44-aggregate-trade-fees-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-43 fix(api-bots): preserve free cash under hidden open-position margin`
  - Scope: closed a BUILDER-mode money-impacting dashboard read-model drift.
    Runtime session positions now use scoped persisted open-position
    `marginUsed` as the primary used-margin input for capital summary, so
    dashboard `positions.summary.freeCash` no longer overstates available cash
    when `limit` / `perSessionLimit` hides older open rows. Visible open rows
    remain limited, with visible-row modeled margin retained as fallback when
    no persisted margin exists. Validation PASS: failing-then-passing
    hidden-margin free-cash regression, runtime-scope e2e (`12/12`),
    monitoring aggregate e2e (`11/11`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-43-free-cash-open-margin-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-42 fix(api-bots): preserve aggregate open-position quantity under row limits`
  - Scope: closed an ARCHITECT-mode dashboard read-model quantity drift.
    Runtime session positions now expose scoped `summary.openPositionQty`, and
    monitoring aggregate `sessionDetail.summary.openPositionQty` composes that
    session truth instead of limited visible open rows. Dashboard open-position
    quantity now remains truthful when `perSessionLimit` hides older open
    positions while visible row lists remain limited. Validation PASS:
    failing-then-passing `perSessionLimit=1` open-quantity regression,
    runtime-scope e2e (`12/12`), monitoring aggregate e2e (`11/11`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-42-open-position-qty-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-41 fix(api-bots): preserve runtime position realized PnL under row limits`
  - Scope: closed a BUILDER-mode dashboard read-model summary drift. Runtime
    session positions now aggregate realized PnL from all scoped closed
    positions instead of only visible history rows, and monitoring aggregate
    summaries compose those session position summaries. This keeps dashboard
    realized PnL truthful when `limit` / `perSessionLimit` hides older closed
    positions while visible row lists remain limited. Validation PASS:
    failing-then-passing `limit=1` realized-PnL regression, runtime-scope e2e
    (`12/12`), monitoring aggregate e2e (`10/10`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-41-position-realized-pnl-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-40 fix(api-bots): preserve runtime position counts under row limits`
  - Scope: closed a BUILDER-mode dashboard read-model count drift. Runtime
    session positions and monitoring aggregate position metadata now use true
    scoped open/closed position counts instead of limited visible row counts,
    so dashboard `positions.total`, `openCount`, and `closedCount` stay
    truthful when `limit` / `perSessionLimit` hides older rows. Visible
    `openItems` / `historyItems` remain limited. Validation PASS:
    failing-then-passing `limit=1` regression, runtime-scope e2e (`12/12`),
    monitoring aggregate e2e (`10/10`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-40-position-count-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-39 fix(api-bots): preserve aggregate trade totals under row limits`
  - Scope: closed an ARCHITECT-mode dashboard read-model count drift. Runtime
    monitoring aggregate `trades.total` and `trades.meta.total` now sum the
    true per-session trade totals instead of the limited visible aggregate row
    count, so dashboard trade activity counts stay truthful when
    `perSessionLimit` hides older rows. Visible `trades.items` remain limited,
    with pagination metadata exposing hidden rows via `hasNext`. Validation
    PASS: failing-then-passing `perSessionLimit=1` regression, full monitoring
    aggregate e2e (`10/10`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-39-aggregate-trade-total-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-38 fix(api-bots): align non-running aggregate end time`
  - Scope: closed a BUILDER-mode runtime dashboard timestamp drift. Runtime
    monitoring aggregate `sessionDetail.finishedAt` now uses the same
    non-running session window-end fallback as nested runtime reads
    (`finishedAt ?? lastHeartbeatAt ?? startedAt`), so failed/canceled
    aggregate metadata no longer shows `finishedAt: null` while
    positions/trades windows have a concrete end. RUNNING aggregate still
    reports `finishedAt: null`. Validation PASS: failing-then-passing
    failed-session end-time regression, full monitoring aggregate e2e (`9/9`),
    API typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-38-aggregate-non-running-window-end-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-37 fix(api-bots): do not invent empty aggregate heartbeat`
  - Scope: closed a TESTER-mode false-freshness empty-state bug. Empty runtime
    monitoring aggregate payloads now return
    `sessionDetail.lastHeartbeatAt: null` when no runtime sessions exist, so
    the dashboard no longer receives a fresh synthetic heartbeat timestamp
    alongside `sessionsCount: 0`. Non-empty aggregate heartbeat behavior
    remains session-derived. Validation PASS: failing-then-passing empty
    aggregate heartbeat regression, full monitoring aggregate e2e (`8/8`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-37-empty-aggregate-heartbeat-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-36 fix(api-bots): align aggregate header PnL with positions`
  - Scope: closed an ARCHITECT-mode duplicate-summary truth drift. Runtime
    monitoring aggregate header `sessionDetail.summary.realizedPnl` now reuses
    the scoped positions summary, so imported or externally closed positions
    with canonical position PnL but no local trade rows no longer disappear
    from the dashboard aggregate header. Trade-backed fee behavior is
    unchanged. Validation PASS: failing-then-passing imported closed position
    PnL regression, full monitoring aggregate e2e (`8/8`), runtime history
    parity e2e (`6/6`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-36-aggregate-position-summary-pnl-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-35 fix(api-bots): keep empty running aggregate unfinished`
  - Scope: closed a BUILDER-mode runtime dashboard empty-state timestamp
    drift. Empty runtime monitoring aggregate payloads now set
    `sessionDetail.finishedAt: null` when the effective empty aggregate status
    is `RUNNING`, preventing dashboard metadata from saying an empty running
    view is already finished. Default empty completed metadata remains
    deterministic. Validation PASS: failing-then-passing empty
    `status=RUNNING` regression, full monitoring aggregate e2e (`7/7`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-35-empty-aggregate-running-finished-at-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-34 fix(api-bots): preserve empty aggregate bot mode`
  - Scope: closed a BUILDER-mode runtime dashboard empty-state truth drift.
    Empty runtime monitoring aggregate payloads now preserve the selected
    bot's persisted mode instead of hardcoding `PAPER`, so LIVE bots without
    runtime sessions no longer render misleading paper-mode aggregate metadata.
    Non-empty aggregate mode resolution remains session-derived. Validation
    PASS: failing-then-passing LIVE empty aggregate mode regression, full
    monitoring aggregate e2e (`6/6`), API typecheck, repository guardrails,
    lint, and diff review. Evidence:
    `docs/planning/runtime-audit-34-empty-aggregate-mode-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-33 fix(api-bots): attribute imported open trade anchors to effective strategy`
  - Scope: closed an ARCHITECT-mode runtime dashboard provenance drift.
    Runtime trade synthetic `position-open:*` anchors now resolve the single
    canonical strategy from active bot market-group links when an imported open
    position has `strategyId: null`, keeping runtime trades and aggregate
    strategy attribution aligned with the selected bot configuration.
    Ambiguous multi-strategy provenance remains unassigned. Validation PASS:
    failing-then-passing imported strategy-null open anchor regression, full
    runtime history parity e2e (`6/6`), runtime-scope e2e (`12/12`),
    runtime-strategy-context e2e (`5/5`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-33-trade-anchor-effective-strategy-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-32 fix(api-engine): attribute automation skip telemetry to effective strategy`
  - Scope: closed a TESTER-mode dashboard/runtime event provenance drift.
    Runtime automation `PRETRADE_BLOCKED` skip telemetry now accepts the same
    effective strategy provenance used by lifecycle decisions, so imported or
    strategy-null LIVE positions with one canonical strategy link keep
    fail-closed event attribution aligned with their configured strategy.
    Ambiguous multi-strategy provenance remains unassigned. Validation PASS:
    failing-then-passing imported strategy-null skip telemetry regression, full
    runtime position automation service tests (`36/36`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-32-skip-telemetry-effective-strategy-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-31 fix(api-engine): attribute DCA block telemetry to effective strategy`
  - Scope: closed a dashboard/runtime event provenance drift. Runtime DCA
    funds-exhausted `PRETRADE_BLOCKED` telemetry now uses the same effective
    strategy provenance resolved for lifecycle decisions, so imported or
    strategy-null bot positions with one canonical strategy link keep event
    attribution aligned with their configured strategy. Validation PASS:
    failing-then-passing imported strategy-null DCA block telemetry regression,
    full runtime position automation service tests (`35/35`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-31-dca-block-effective-strategy-telemetry-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-30 fix(api-positions): protect live positions while same-symbol orders are open`
  - Scope: closed a LIVE stale-close lifecycle drift. Owned exchange open
    orders now protect both possible local position sides for the same symbol
    during stale local LIVE position reconciliation, so a pending same-symbol
    close/order lifecycle cannot let the bot close local state before the
    exchange order resolves. Unrelated stale local positions still close after
    the grace window. Validation PASS: failing-then-passing same-symbol
    open-order protection regression, full live reconciliation service tests
    (`24/24`), sequential runtime takeover e2e (`4/4`), sequential
    runtime-scope e2e (`12/12`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-30-live-reconcile-open-order-symbol-protection-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-29 fix(api-bots): keep runtime open orders visible after dedupe`
  - Scope: closed a dashboard runtime open-order drift. Runtime session
    `openOrders` now read a bounded candidate set before exchange/local dedupe
    and apply the dashboard `limit` after dedupe, so duplicate rows sharing an
    `exchangeOrderId` cannot hide distinct open orders from the dashboard.
    Validation PASS: failing-then-passing `limit=2` duplicate-order
    regression, focused runtime-scope e2e (`12/12`), broader bots e2e
    (`26/26`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-29-runtime-open-orders-dedupe-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-28 fix(api-bots): keep runtime open positions visible under history limits`
  - Scope: closed a dashboard runtime positions drift. Runtime session
    positions now read open and closed bot-managed rows as separate scoped
    collections before serialization, so a newer history row cannot hide an
    older open position from the dashboard when the request uses a small
    `limit`. Validation PASS: failing-then-passing `limit=1` open/history
    regression, focused runtime-scope e2e (`11/11`), broader bots e2e
    (`26/26`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-28-runtime-positions-open-history-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-27 fix(api-bots): hydrate limited symbol stats by configured order`
  - Scope: closed a TESTER-mode dashboard signal truth drift. Unfiltered
    selected-bot symbol-stats now select display rows from configured symbol
    order and then hydrate persisted stats for that exact symbol set,
    preventing top-PnL DB ordering from rendering a configured dashboard
    signal row with zero totals when its stat row exists. Explicit symbol
    filters and off-scope empty behavior remain unchanged. Validation PASS:
    failing-then-passing configured-order `limit=1` regression, focused bots
    e2e (`26/26`), broader runtime/read pack (`42/42`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-27-symbol-stats-configured-limit-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-26 fix(api-bots): show canonical symbol TTP plans`
  - Scope: closed a runtime dashboard TTP display drift. Runtime position
    reads now surface canonical symbol-level DCA/TTP/TSL display plans for
    strategy-null positions when active `BotMarketGroup` /
    `MarketGroupStrategyLink` scope resolves the selected symbol, while
    keeping `actionable` fail-closed without an executable strategy identity
    and preserving the stale legacy fallback guard. Validation PASS:
    failing-then-passing canonical strategy-null TTP regression and focused
    runtime strategy context e2e (`5/5`), broader bot runtime/read pack
    (`37/37`), API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-26-runtime-position-symbol-strategy-display-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-25 fix(api-markets): normalize universe symbols`
  - Scope: closed a market-configuration source-of-truth drift. Market
    universe create/update DTOs now normalize `baseCurrency`, `whitelist`, and
    `blacklist` at the API boundary, so dashboard and bot market scopes persist
    canonical uppercase values while preserving operator-provided first
    occurrence order for symbol lists. Validation PASS:
    failing-then-passing lowercase market universe regression, focused markets
    e2e (`16/16`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-25-market-universe-symbol-normalization-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-24 fix(api-orders): normalize list symbol filters`
  - Scope: closed the sibling dashboard order read drift after
    `RUNTIME-AUDIT-23`. Order list `symbol` filters now normalize to uppercase
    at the DTO boundary, so operator/API requests such as `symbol=ethusdt`
    find owned persisted `ETHUSDT` orders instead of rendering an empty orders
    table. Validation PASS: failing-then-passing lowercase symbol filter
    regression, focused orders/positions read e2e (`21/21`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-24-order-list-symbol-normalization-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-23 fix(api-positions): normalize list symbol filters`
  - Scope: closed a dashboard position read drift. Position list `symbol`
    filters now normalize to uppercase at the DTO boundary, so operator/API
    requests such as `symbol=ethusdt` find owned persisted `ETHUSDT` positions
    instead of rendering an empty positions table. Validation PASS:
    failing-then-passing lowercase symbol filter regression, focused positions
    list e2e, API typecheck, repository guardrails, lint, and diff review.
    Evidence:
    `docs/planning/runtime-audit-23-position-list-symbol-normalization-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-22 fix(api-wallets): validate analytics date ranges`
  - Scope: closed a TESTER-mode wallet analytics API-boundary drift. Wallet
    analytics `from` / `to` filters now fail closed when `from` is later than
    `to`, preventing invalid operator-supplied ranges from rendering
    misleading empty dashboard wallet analytics. The service now relies on the
    typed DTO filter instead of a manual cashflow source cast. Validation
    PASS: failing-then-passing inverted date-range regression, focused wallets
    e2e (`18/18`), API typecheck, repository guardrails, lint, and diff
    review. Evidence:
    `docs/planning/runtime-audit-22-wallet-analytics-date-range-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-21 fix(api-wallets): validate analytics source filters`
  - Scope: closed a wallet analytics API-boundary drift. Wallet analytics
    `source` filters now validate against the canonical `WalletCashflowSource`
    enum at the DTO boundary, so invalid dashboard/URL filter values fail
    closed with `400` instead of reaching Prisma and returning `500`.
    Validation PASS: failing-then-passing invalid source regression, focused
    wallets e2e (`17/17`), API typecheck, repository guardrails, lint, and
    diff review. Evidence:
    `docs/planning/runtime-audit-21-wallet-analytics-source-validation-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-20 fix(api-wallets): keep filtered wallet timeline historical`
  - Scope: closed a follow-up wallet timeline edge drift. Wallet equity
    timeline now attaches current owned-import open PnL only to the latest
    overall wallet snapshot point, not to the latest point of a filtered
    historical response. Validation PASS: failing-then-passing filtered
    timeline regression, focused wallets e2e (`16/16`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-20-wallet-timeline-filtered-open-pnl-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-19 fix(api-wallets): align latest wallet timeline open PnL`
  - Scope: closed the next wallet preview parity drift. Wallet equity timeline
    now reuses the selected wallet open-PnL scope for the latest point, so
    owned imported `LIVE` positions with `walletId=null` are reflected in
    current `botOpenPnl` / `botPnl` consistently with wallet performance
    summary. Earlier timeline points remain historical snapshot/cashflow
    points. Validation PASS: failing-then-passing wallet timeline regression,
    focused wallets e2e (`16/16`), API typecheck, repository guardrails, lint,
    and diff review. Evidence:
    `docs/planning/runtime-audit-19-wallet-timeline-open-pnl-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-18 fix(api-wallets): include owned imported LIVE open PnL`
  - Scope: closed the next wallet/dashboard capital drift. Wallet performance
    summary now includes selected `LIVE` wallet imported open positions with
    `walletId=null` when their `externalId` is owned by the wallet API key,
    while excluding other API keys and leaving balance snapshot, cashflow, and
    equity timeline contracts unchanged. Validation PASS: failing-then-passing
    wallet performance regression, focused wallets e2e (`15/15`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-18-wallet-owned-import-open-pnl-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-17 fix(api-orders): scope exchange-fill close fees by position lifecycle`
  - Scope: closed the next TESTER close-PnL parity drift. LIVE exchange
    order-trade close confirmation now aggregates entry-leg fees by the owned
    position lifecycle (`userId + positionId + entry side`) instead of mutable
    `botId` / `walletId` projections, matching the synchronous runtime
    orchestrator close contract. Validation PASS: focused exchange-events pack
    (`6/6`), broader orders/runtime PnL pack (`75/75`), API typecheck,
    repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-17-exchange-fill-close-fee-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-16 fix(api-bots): show selected LIVE bot legacy wallet-null open orders`
  - Scope: closed the next dashboard open-order visibility drift. Runtime
    positions dashboard reads now include direct selected-bot `BOT_MANAGED`
    open orders with legacy `walletId=null` rows in LIVE mode, matching the
    existing selected-bot compatibility scope for positions/trades while
    keeping `botId` ownership mandatory. Validation PASS: focused runtime
    takeover e2e (`4/4`), broader runtime positions/read pack (`33/33`), API
    typecheck, repository guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-16-live-open-order-wallet-null-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-15 fix(api-engine): scope close entry fees by position lifecycle`
  - Scope: closed the next close-PnL attribution drift. Runtime close
    realized-PnL now aggregates entry-leg fees by the owned position lifecycle
    (`userId + positionId + entry side`) instead of mutable `botId` /
    `walletId` projections. Imported or recovered LIVE positions with
    `botId=null` / `walletId=null` can close through the selected bot wallet
    while still subtracting entry fees attached to the same position.
    Validation PASS: focused execution orchestrator pack (`17/17`), broader
    runtime/order/automation pack (`90/90`), API typecheck, repository
    guardrails, lint, and diff review. Evidence:
    `docs/planning/runtime-audit-15-close-fee-position-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-14 fix(api-engine): resolve owned LIVE imports for runtime EXIT lookup`
  - Scope: closed the next LIVE close/automation lookup drift. Runtime
    execution default open-position lookup now keeps the direct scoped query
    first, then resolves selected-bot owned `EXCHANGE_SYNC` / `BOT_MANAGED`
    imported open positions through wallet-first API-key ownership proof when
    the direct LIVE lookup misses. Legacy `walletId=null` imports can now be
    found for the same bot/wallet/symbol instead of producing incorrect
    `no_open_position`, while unowned imports remain invisible. Validation
    PASS: focused orchestrator pack (`18/18`), broader runtime/orders pack
    (`111/111`), typecheck, guardrails, lint, and diff check. Evidence:
    `docs/planning/runtime-audit-14-exit-owned-import-lookup-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-13 fix(api-orders): reuse owned LIVE imports during fill lifecycle`
  - Scope: closed the next LIVE fill lifecycle duplication drift. Filled
    selected-bot `LIVE` orders now reuse same-side deterministically owned
    `EXCHANGE_SYNC` / `BOT_MANAGED` imported open positions when no direct
    scoped position exists, including legacy `botId=null/walletId=null` rows
    after ownership proof succeeds. The filled order and order fills attach to
    the imported position, quantity and weighted entry price update through
    existing fill math, and no duplicate open position is created. Validation
    PASS: focused orders pack (`28/28`), broader orders/e2e/pre-trade/
    final-candle/defaults pack (`90/90`), typecheck, guardrails, lint, and
    diff check. Evidence:
    `docs/planning/runtime-audit-13-fill-lifecycle-owned-import-reuse-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-12 fix(api-orders): fail closed manual LIVE reverse opens against owned imports`
  - Scope: closed the next LIVE manual command guard drift. Manual selected-bot
    `LIVE` opens now check deterministically owned exchange-synced
    `EXCHANGE_SYNC` / `BOT_MANAGED` imported open positions before exchange
    submission, including legacy imported rows persisted as
    `botId=null/walletId=null` after ownership proof succeeds. Opposite-side
    owned imports now fail closed with `OPEN_POSITION_SIDE_CONFLICT`; unowned,
    ambiguous, manual-only, or other-wallet imports remain non-blocking.
    Validation PASS: focused orders pack (`27/27`), broader
    orders/pre-trade/final-candle/defaults pack (`69/69`), typecheck,
    guardrails, lint, and diff check. Evidence:
    `docs/planning/runtime-audit-12-live-manual-reverse-owned-import-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-11 fix(api-runtime): scope final-candle external-position guard to owner bot`
  - Scope: closed the next final-candle false-block drift.
    `EXTERNAL_POSITION_ALREADY_OPEN` runtime blocking now keys managed
    external positions by deterministic owner bot (`userId:botId:symbol`)
    instead of user-wide `userId:symbol`. Imported `botId=null` LIVE rows are
    owner-hydrated through the shared external-position ownership index, so
    one bot's exchange-synced position no longer blocks another bot's signal on
    the same symbol. Validation PASS: focused final-candle/defaults pack
    (`18/18`). Evidence:
    `docs/planning/runtime-audit-11-final-candle-owned-external-bot-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-10 fix(api-engine): count owned LIVE imports in pre-trade bot caps`
  - Scope: closed the next LIVE pre-trade exposure-count drift.
    `maxOpenPositionsPerBot` now counts direct selected-bot open positions plus
    deterministically owned LIVE `EXCHANGE_SYNC` / `BOT_MANAGED` imports for
    the same bot/wallet/API key. PAPER remains direct-bot scoped, and
    ambiguous/manual-only/unowned imports are not counted as bot exposure.
    Validation PASS: focused pre-trade pack (`24/24`). Evidence:
    `docs/planning/runtime-audit-10-pretrade-bot-open-count-owned-imports-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-09 fix(api-engine): scope pre-trade same-symbol guard to runtime bot`
  - Scope: closed the next PAPER/LIVE false-block drift. Pre-trade
    one-position-per-symbol checks now remain user-global only when no
    `botId` is provided; runtime bot decisions with `botId` check direct
    positions for that bot and owned LIVE exchange-synced imports for that
    bot/wallet. Another bot's open same-symbol position can no longer block a
    selected PAPER/LIVE bot from opening. Validation PASS: focused pre-trade
    pack (`23/23`), broader runtime/backtest decision pack (`88/88`), and API
    typecheck. Evidence:
    `docs/planning/runtime-audit-09-pretrade-bot-scoped-symbol-uniqueness-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-08 fix(api-bots): resolve imported LIVE ownership with catalog scope`
  - Scope: closed the next LIVE import ownership drift. External-position
    ownership proof now resolves active canonical bot market groups through
    the shared catalog-aware symbol resolver before building API-key+symbol
    ownership keys. Market-universe-backed groups with empty direct `symbols`
    but whitelist/filter catalog scope can now own and import all assigned
    exchange positions consistently with dashboard/runtime reads. Validation
    PASS: focused ownership regression (`9/9`), broader
    reconciliation/takeover pack (`41/41`), and API typecheck. Evidence:
    `docs/planning/runtime-audit-08-external-position-ownership-catalog-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-07 fix(api-engine): fail closed off-scope runtime position automation`
  - Scope: closed the next money-impacting automation/read parity drift.
    Runtime position automation now resolves an owned position's configured
    bot symbol scope from active canonical market assignment before strategy
    config loading, DCA funds checks, DCA execution, lifecycle price
    evaluation, or protection close orchestration. Stale directly owned
    positions outside the bot's active market scope are skipped with LIVE
    `PRETRADE_BLOCKED` telemetry reason
    `position_symbol_outside_configured_scope`. Validation PASS: focused
    automation/default-deps pack (`35/35`), broader close/ownership
    automation pack (`52/52`), and API typecheck. Evidence:
    `docs/planning/runtime-audit-07-position-automation-canonical-symbol-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-06 fix(api-bots): fail closed off-scope dashboard position close`
  - Scope: closed the next money-impacting command/read parity drift.
    Dashboard runtime position close now resolves selected-bot configured
    symbols from active canonical market scope before ownership claim,
    strategy/wallet backfill, or close orchestration. Stale directly owned
    positions outside the bot's active market scope return the existing
    ignored `no_open_position` result instead of being closed. Validation
    PASS: focused close command regression (`9/9`) and broader
    close/runtime/imported-position pack (`74/74`). Evidence:
    `docs/planning/runtime-audit-06-close-position-canonical-symbol-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-05 fix(api-bots): keep selected-bot runtime rows canonical-symbol scoped`
  - Scope: closed the next default dashboard row drift. Runtime trade history
    and runtime positions now apply selected-bot active canonical configured
    symbols to filtered and unfiltered reads, reusing the shared
    catalog-aware resolver. Stale persisted `Trade.botId` and `Position.botId`
    rows for off-scope symbols can no longer appear in selected-bot dashboard
    history/open positions after market reassignment. Validation PASS:
    focused runtime-scope regression (`1/1`) and broader monitoring/positions
    pack (`57/57`). Evidence:
    `docs/planning/runtime-audit-05-runtime-rows-canonical-symbol-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-04 fix(api-bots): keep runtime trade history canonical-symbol scoped`
  - Scope: closed the next selected-bot dashboard-history drift. Runtime
    trade history now resolves selected-bot configured symbols from active
    canonical `BotMarketGroup` scope through the shared catalog-aware resolver
    before honoring explicit `symbol` filters. Stale persisted `Trade.botId`
    rows for off-scope symbols can no longer appear in runtime trades or
    monitoring aggregate history after market reassignment. Validation PASS:
    focused runtime-scope regression (`1/1`) and broader monitoring pack
    (`45/45`). Evidence:
    `docs/planning/runtime-audit-04-runtime-trades-canonical-symbol-scope-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-03 fix(api-bots): fail closed canonical update scope and symbol-filter pagination`
  - Scope: closed the next residual selected-bot topology drift. Bot update
    defaults now treat existing canonical market-group scope with no enabled
    strategy links as non-actionable instead of selecting disabled links or
    direct legacy `Bot.strategyId`. Runtime symbol-stats now validates
    explicit `symbol` filters against the full configured selected-bot symbol
    scope before applying `limit`, so later configured symbols such as ETH do
    not disappear from dashboard reads when `limit=1`. Validation PASS:
    focused helper/reconciliation pack (`31/31`), focused monitoring filter
    e2e (`1/1`), and broader bot/runtime/position pack (`68/68`). Evidence:
    `docs/planning/runtime-audit-03-canonical-update-and-symbol-filter-scope-task-2026-05-03.md`.

- [x] `ORDDRIFT-01 fix(api-orders): block direct fallback when canonical manual scope exists`
  - Scope: closed the next manual-order strategy-context drift. Manual-order
    strategy context now evaluates active canonical groups first and blocks
    direct/legacy strategy fallback whenever such groups exist but do not
    resolve the requested symbol. Stale direct bot strategy projections can no
    longer alter manual-order preview leverage, margin mode, or order type
    after canonical market reassignment. Validation PASS: focused orders
    service test (`26/26`) and broader orders/manual pack (`49/49`). Evidence:
    `docs/planning/orddrift-01-manual-context-canonical-group-no-direct-fallback-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-02 fix(api-runtime): fail closed empty canonical strategy-link topology`
  - Scope: closed the next execution/display topology drift. Runtime
    signal-loop topology and symbol-stats configured context now use direct
    legacy `Bot.strategyId` only when no active canonical market group exists.
    If an active canonical `BotMarketGroup` exists with no enabled
    `MarketGroupStrategyLink` rows, runtime context is non-actionable and
    dashboard configured strategy context remains empty. Validation PASS:
    focused defaults/symbol-stats tests (`11/11`) and broader
    runtime/symbol-stats pack (`78/78`). Evidence:
    `docs/planning/runtime-audit-02-empty-canonical-strategy-links-task-2026-05-03.md`.

- [x] `DASHDRIFT-05 fix(api-bots): keep runtime symbol-stats symbol filters canonical-scope locked`
  - Scope: closed the next selected-bot signal/market stats drift. Explicit
    `symbol` filters on runtime symbol-stats now intersect with the selected
    bot's active canonical configured symbols and return an empty zero-summary
    response when the requested symbol is outside scope. Stale persisted stats
    for old/off-scope markets can no longer appear through direct symbol
    queries. Validation PASS: focused runtime-scope e2e (`10/10`) and broader
    symbol-stats/market-universe/PnL pack (`25/25`). Evidence:
    `docs/planning/dashdrift-05-symbol-stats-filter-canonical-scope-task-2026-05-03.md`.

- [x] `DASHDRIFT-04 fix(api-bots): keep symbol-level dynamic-stop plans canonical-context scoped`
  - Scope: closed the next dashboard runtime row-data drift. Runtime TTP/TSL
    plan maps by symbol now keep active canonical `BotMarketGroup` /
    `MarketGroupStrategyLink` entries authoritative and let legacy
    `BotStrategy` rows fill only symbols without canonical entries. Stale
    legacy advanced-close rows can no longer overwrite canonical basic-close
    symbol plans. Validation PASS: focused runtime strategy-context e2e
    (`4/4`) and broader bot runtime/dynamic-stop pack (`40/40`). Evidence:
    `docs/planning/dashdrift-04-symbol-dynamic-stop-plans-canonical-task-2026-05-03.md`.

- [x] `DASHDRIFT-03 fix(api-bots): keep dynamic-stop column visibility canonical-context scoped`
  - Scope: closed the next dashboard runtime display drift. Runtime position
    payload `showDynamicStopColumns` now evaluates active canonical
    `BotMarketGroup` / `MarketGroupStrategyLink` strategy configs when present
    and uses legacy `BotStrategy` rows only as compatibility fallback. Stale
    legacy advanced-close rows can no longer turn on TTP/TSL columns for a
    canonical basic-close selected-bot view. Validation PASS: focused runtime
    strategy-context e2e (`3/3`) and broader bot runtime/dynamic-stop pack
    (`31/31`). Evidence:
    `docs/planning/dashdrift-03-dynamic-stop-columns-canonical-task-2026-05-03.md`.

- [x] `POSDRIFT-12 fix(api-positions): keep LIVE reconciliation continuity strategy canonical`
  - Scope: closed the TESTER continuity edge. LIVE exchange reconciliation now
    resolves recovered/imported bot continuity strategy through active
    canonical `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows
    before direct legacy `Bot.strategyId`. Stale direct strategy projection can
    no longer label imported/recovered LIVE exchange-synced rows when canonical
    topology exists. Validation PASS: focused reconciliation test (`23/23`) and
    wider position/reconciliation/automation pack (`29/29`). Evidence:
    `docs/planning/posdrift-12-live-continuity-canonical-strategy-task-2026-05-03.md`.

- [x] `BOTDRIFT-02 fix(api-bots): keep bot update safety guards canonical-context scoped`
  - Scope: closed the next bot-management safety drift. Bot activation/update
    duplicate guard and LIVE overlap guard now derive default target
    strategy/market scope from active canonical `BotMarketGroup` and enabled
    `MarketGroupStrategyLink` rows before direct legacy bot fields. Stale
    direct `Bot.strategyId` / `Bot.symbolGroupId` can no longer let update
    activation bypass canonical duplicate checks. Validation PASS: focused
    duplicate guard (`6/6`) and wider bot write/runtime pack (`43/43`).
    Evidence:
    `docs/planning/botdrift-02-bot-update-canonical-guard-task-2026-05-03.md`.

- [x] `BOTDRIFT-01 fix(api-bots): keep bot list/get projection canonical-context scoped`
  - Scope: closed the next upstream dashboard/runtime drift. `GET
    /dashboard/bots` and `GET /dashboard/bots/:id` now overlay canonical
    primary `BotMarketGroup` / `MarketGroupStrategyLink` context onto response
    `strategyId`, `strategy`, `symbolGroupId`, and `symbolGroup` before direct
    legacy bot projections. Stale direct `Bot.strategyId` can no longer feed
    dashboard and bot-management read models when canonical topology exists.
    Validation PASS: bot runtime-scope e2e (`10/10`) and wider bot pack
    (`41/41`). Evidence:
    `docs/planning/botdrift-01-bot-read-projection-canonical-context-task-2026-05-03.md`.

- [x] `DASHDRIFT-02 fix(web-dashboard): keep position edit strategy display runtime-graph scoped`
  - Scope: closed the next dashboard display drift. The position edit modal in
    `HomeLiveWidgets` now resolves strategy labels from selected bot
    `runtime-graph` market groups and strategy links before direct legacy
    `Bot.strategy`. Stale direct bot strategy projections can no longer
    override canonical runtime strategy display in that position-management
    modal. Validation PASS: focused HomeLiveWidgets regression (`18/18`).
    Evidence:
    `docs/planning/dashdrift-02-position-edit-strategy-display-task-2026-05-03.md`.

- [x] `POSDRIFT-11 fix(api-positions): keep legacy open-position repair canonical-market scoped`
  - Scope: closed the next confirmed position-management drift. Local repair
    of open `BOT` / `USER` positions without `botId` now matches candidate bots
    through active canonical `BotMarketGroup.symbolGroup` symbols before direct
    legacy `Bot.symbolGroup`, and persists strategy provenance from existing
    position provenance or one enabled canonical `MarketGroupStrategyLink`.
    Stale direct bot market/strategy projections can no longer claim or
    mislabel repaired orphan rows when canonical groups exist. Validation PASS:
    focused position repair regression (`1/1`). Evidence:
    `docs/planning/posdrift-11-legacy-position-repair-canonical-scope-task-2026-05-03.md`.

- [x] `POSDRIFT-10 fix(api-orders): fail closed for manual-order multi-strategy ambiguity`
  - Scope: closed the TESTER edge-case for LIVE manual opens. Manual-order
    strategy context now resolves a canonical strategy only when exactly one
    enabled strategy link matches the requested symbol. Matching canonical
    groups with multiple enabled strategies remain unresolved, so LIVE manual
    open fails closed instead of silently selecting the first link. Validation
    PASS: focused LIVE ambiguous manual-order regression. Evidence:
    `docs/planning/posdrift-10-manual-order-multistrategy-ambiguity-task-2026-05-03.md`.

- [x] `POSDRIFT-09 fix(api-orders): keep manual-order context venue canonical`
  - Scope: closed the next confirmed dashboard/manual-order drift.
    Manual-order context now resolves venue from active canonical
    `BotMarketGroup.symbolGroup.marketUniverse` before duplicated bot
    `exchange/marketType`, then uses that venue for connector selection,
    exchange metadata fallback, leverage, and margin-mode semantics. Validation
    PASS: focused manual-order context tests (`5` tests). Evidence:
    `docs/planning/posdrift-09-manual-context-canonical-venue-task-2026-05-03.md`.

- [x] `POSDRIFT-08 fix(api-bots): keep wallet update validation canonical-market scoped`
  - Scope: closed the next confirmed wallet/market write safety drift.
    Existing-bot wallet update validation now checks target wallets against
    active canonical `BotMarketGroup.symbolGroup.marketUniverse` scope before
    falling back to direct legacy `Bot.symbolGroup`. Stale direct projections
    can no longer allow a wallet venue mismatch against the bot's real assigned
    market group. Validation PASS: focused bot context validation test (`2/2`).
    Evidence:
    `docs/planning/posdrift-08-wallet-update-canonical-market-scope-task-2026-05-03.md`.

- [x] `POSDRIFT-07 fix(api-bots): keep active LIVE overlap guard canonical-market scoped`
  - Scope: closed the next confirmed LIVE market-assignment safety drift.
    Active LIVE bot create/update validation now checks other active LIVE bots
    through active canonical `BotMarketGroup.symbolGroup` symbols before
    falling back to direct legacy `Bot.symbolGroup`. Stale direct market
    projections can no longer allow shared symbols in real assigned canonical
    market scope. Validation PASS: focused duplicate guard e2e (`5/5`).
    Evidence:
    `docs/planning/posdrift-07-live-overlap-canonical-market-scope-task-2026-05-03.md`.

- [x] `POSDRIFT-06 fix(api-runtime): keep runtime signal-loop venue on shared canonical resolver`
  - Scope: closed the next architecture drift in the PAPER/LIVE open pipeline.
    Runtime signal-loop inherited execution context now uses the shared
    canonical runtime venue resolver instead of a local
    `botMarketGroups[0] ?? bot.symbolGroup` expression. Ambiguous multiple
    canonical venues fail closed in runtime topology, and direct legacy
    `Bot.symbolGroup` remains fallback only through the shared resolver.
    Validation PASS: focused runtime signal-loop defaults test (`6/6`).
    Evidence:
    `docs/planning/posdrift-06-runtime-signal-loop-canonical-venue-task-2026-05-03.md`.

- [x] `POSDRIFT-05 fix(api-runtime): keep execution venue canonical across pre-trade/manual-open/automation`
  - Scope: closed the next confirmed position-management drift. Pre-trade LIVE
    bot config, manual order open context, runtime position reads, and runtime
    position automation now resolve execution venue from the active canonical
    `BotMarketGroup` market universe before direct legacy `Bot.symbolGroup`.
    Stale direct bot market projections can no longer block or route
    TTP/DCA/close/manual-open behavior away from the assigned canonical market
    scope. Validation PASS: focused runtime/order/position pack (`74/74`).
    Evidence:
    `docs/planning/posdrift-05-canonical-execution-venue-task-2026-05-03.md`.

- [x] `POSDRIFT-04 fix(api-runtime): keep runtime position reads canonical-context aligned`
  - Scope: closed the next dashboard position drift. Runtime position reads now
    resolve inherited execution venue from active canonical `BotMarketGroup`
    market universe when available, using direct `Bot.symbolGroup` only as
    legacy fallback. Position protection/actionable display no longer falls
    back to direct `Bot.strategyId` when position/canonical strategy provenance
    is missing. Validation PASS: runtime strategy-context e2e (`2/2`),
    dynamic-stop/serialization/automation pack (`42/42`),
    runtime-scope/orders/market-universe pack (`34/34`), web history/manual
    pack (`13/13`), and API typecheck. Evidence:
    `docs/planning/posdrift-04-runtime-position-read-canonical-context-task-2026-05-03.md`.

- [x] `POSDRIFT-03 fix(api-runtime): keep imported ownership canonical-market scoped`
  - Scope: closed the next imported-position ownership drift. External-position
    ownership now builds bot symbol scope from active canonical
    `BotMarketGroup` rows when they exist, using direct legacy
    `Bot.symbolGroup` only as fallback. This prevents stale direct bot market
    projections from claiming/importing exchange positions outside the current
    assigned markets. Validation PASS: focused ownership test (`8/8`), takeover
    and reconciliation pack (`34/34`), runtime-scope/market-universe/orders
    pack (`34/34`), and API typecheck. Evidence:
    `docs/planning/posdrift-03-import-ownership-canonical-market-scope-task-2026-05-03.md`.

- [x] `POSDRIFT-02 fix(api-runtime): preserve strategy provenance on imported manual close`
  - Scope: closed the next confirmed position-management drift. Dashboard
    manual close now loads active canonical bot market-group strategy links and
    recovers/persists `strategyId` for imported `EXCHANGE_SYNC` bot-managed
    positions when the selected bot has exactly one active canonical strategy.
    Multi-strategy missing provenance remains non-guessed. Validation PASS:
    focused command test (`8/8`), API order/position + dynamic-stop +
    automation pack (`62/62`), web manual close/history pack (`13/13`), and
    API typecheck. Evidence:
    `docs/planning/posdrift-02-manual-close-strategy-provenance-task-2026-05-03.md`.

- [x] `POSDRIFT-01 fix(api+web): keep manual-order scope canonical-first`
  - Scope: closed the next confirmed dashboard/runtime drift from the
    operator audit. Manual-order API context now resolves active enabled
    `BotMarketGroup` and enabled `MarketGroupStrategyLink` rows before direct
    legacy `Bot.strategy` / `Bot.symbolGroup` projections, and the dashboard
    manual-order hook lists symbols from active canonical runtime graph groups
    before any legacy fallback. Validation PASS: API focused manual-order test
    (`23/23`), web hook test (`3/3`), API positions/market-universe/runtime
    pack (`34/34`), and web manual-order widget pack (`13/13`). Evidence:
    `docs/planning/posdrift-01-manual-order-canonical-context-task-2026-05-03.md`.

- [x] `DASHDRIFT-01 fix(api+web): keep dashboard sidebar runtime context canonical-first`
  - Scope: closed the first confirmed drift from the dashboard-wide audit.
    `runtime-graph` now includes strategy leverage, web types reflect that
    contract, and the dashboard sidebar renders canonical runtime graph
    market/strategy/interval/leverage before direct legacy `Bot.strategy` or
    `Bot.symbolGroup` projections. Validation PASS: sidebar regression
    (`8/8`), runtime-scope API e2e (`10/10`), dashboard aggregate/runtime
    presenter pack (`11/11`), API aggregate/symbol-stats pack (`14/14`),
    API/web typechecks, repository guardrails, and docs parity. Evidence:
    `docs/planning/dashdrift-01-dashboard-runtime-context-parity-task-2026-05-03.md`.

- [x] `RUNTIME-AUDIT-01 fix(api-runtime): align LIVE open-position counts with wallet-first ownership proof`
  - Scope: closed the first confirmed drift from the operator-requested
    production audit. Runtime signal-loop max-open/external-position counting
    now resolves the effective LIVE API key from `wallet.apiKeyId` before
    legacy `Bot.apiKeyId`, matching imported-position ownership proof for
    wallet-first bots. Validation PASS: focused runtime/defaults and ownership
    tests (`13/13`), runtime final-candle/live reconciliation/dynamic-stop
    pack (`75/75`), paper-live equivalence (`2/2`), API typecheck, repository
    guardrails, and docs parity. Evidence:
    `docs/planning/live-paper-runtime-prod-audit-wallet-first-count-task-2026-05-03.md`.

- [x] `LIVEIMPORT-03 release(prod): read back imported ETH/DOGE provenance on current production`
  - Scope: use authenticated read-only dashboard/API evidence against the
    build-info-derived `$expectedSha` from the final blocker execution pack for
    the reported LIVE ETH/DOGE rows:
    ownership, `strategyId` or single-strategy provenance recovery, TTP
    visibility, actionable state, and import completeness across assigned bot
    markets. Do not promote stale candidate `39146d2e`; `LIVEIMPORT-03A`
    confirmed it is not a valid production promotion candidate. 2026-05-10
    refresh: public/no-secret checks pass on the current deployed line, and the
    collector command in the protected operator handoff now derives its target
    from production `/api/build-info`. Validation still required:
    authenticated runtime positions readback and redacted evidence.
  - 2026-05-14 supersession: closed against the current deployed
    `457bce05` target with the runtime-visible managed symbol `TRXUSDT` rather
    than stale ETH/DOGE assumptions. Evidence:
    `docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`.

- [x] `PAPERSIGNAL-01 fix(api-runtime): audit PAPER signal display-to-execution parity`
  - Scope: closed the first confirmed PAPER display-to-execution drift. Runtime
    symbol-stats read models now load active canonical `BotMarketGroup` and
    enabled `MarketGroupStrategyLink` rows, then prefer that configured
    market/strategy context over legacy `Bot.symbolGroup` / `Bot.strategy`
    projections. This aligns dashboard signal cards with the topology used by
    PAPER/LIVE final-candle execution while preserving legacy fallback.
    Validation PASS: focused symbol-stats/final-candle/paper-live pack
    (`18/18`), bot runtime scope/market-universe/dynamic-stop/runtime-loop pack
    (`60/60`), and API typecheck. Evidence:
    `docs/planning/papersignal-01-canonical-symbol-stats-parity-task-2026-05-03.md`.

- [x] `WALLETBAL-01 fix(api-runtime): stabilize LIVE wallet account-balance cache display semantics`
  - Scope: closed the first confirmed dashboard wallet account-balance drift.
    Runtime LIVE balance cache now stores raw exchange `accountBalance`
    separately from allocated `referenceBalance`, so cache hits no longer show
    FIXED/PERCENT allocation values as account balance while preserving
    `freeCash` from allocated trading capital. Validation PASS: focused
    runtime capital test (`15/15`), monitoring aggregate plus wallet e2e tests
    (`19/19`), API typecheck, repository guardrails, and docs parity. Evidence:
    `docs/planning/walletbal-01-live-account-balance-cache-task-2026-05-03.md`.

- [x] `BOTMULTI-09 release(prod): promote multi-strategy runtime topology to production`
  - Scope: release the locally verified BOTMULTI multi-strategy topology
    through the approved GitHub/Coolify production workflow. The API image
    startup migration contract is confirmed: the container command runs
    `node scripts/start-with-migrate.mjs`, which executes `prisma migrate
    deploy` unless `API_AUTO_MIGRATE=false` and fails closed before API boot if
    migration cannot run. Local pre-release build, guardrails, and docs parity
    PASS. Candidate
    `f3aaa3dca6cf4d4b199372563886165638391a77` is already contained in the
    deployed V1 line; the old public build-info blocker remains resolved.
    2026-05-10 refresh: future protected proof must use the dynamic
    build-info-derived `$expectedSha` from the final blocker pack. Remaining
    blocker: authenticated/protected runtime readback and broader V1 release
    gate evidence are still required.
    Evidence:
    `docs/planning/botmulti-09-production-deploy-task-2026-05-03.md` and
    `docs/planning/botmulti-09-current-production-containment-task-2026-05-09.md`.
  - 2026-05-12 supersession: closed as contained/superseded by deployed V1
    line evidence and the current protected runtime readback/final gate lane.
    This is not a production runtime proof; protected verification still lives
    in `LIVEIMPORT-03` and the final release gate.

- [x] `BOTMULTI-08 qa(closure): run architecture-to-runtime closure pack and publish evidence`
  - Scope: closed the post-V1 BOTMULTI wave with focused API/runtime/lifecycle
    and web validation, API/web typechecks, i18n route audit, docs parity, and
    repository guardrails. Evidence:
    `docs/planning/botmulti-08-architecture-runtime-closure-task-2026-05-03.md`.

- [x] `BOTMULTI-07 web(ui+operator): expose multi-strategy bot management and runtime truth`
  - Scope: bot create/edit now exposes explicit primary strategy plus enabled
    additional strategies, submits ordered canonical `strategies[]`, and
    prefills edit mode from canonical runtime graph strategy links. Evidence:
    `docs/planning/botmulti-07-web-operator-multi-strategy-truth-task-2026-05-03.md`.

- [x] `BOTMULTI-06 runtime(risk+lifecycle): align DCA/TTP/TSL and ownership across multiple strategies`
  - Scope: runtime position automation now fails closed when a bot-managed
    position has no `position.strategyId` while its bot has multiple enabled
    canonical strategy links. The guard reuses existing skip telemetry and
    prevents fallback DCA/TTP/SL/TSL settings from acting on ambiguous
    multi-strategy position ownership. Evidence:
    `docs/planning/botmulti-06-runtime-risk-lifecycle-ownership-task-2026-05-03.md`.

- [x] `BOTMULTI-05 runtime(signal-merge): execute deterministic multi-strategy evaluation per bot`
  - Scope: runtime topology and final-candle decision now consume the enabled
    canonical `MarketGroupStrategyLink` set under the one active
    `BotMarketGroup`, evaluate all interval-eligible strategies, merge votes
    with existing deterministic priority/weight semantics, and preserve winner
    provenance for downstream execution context. Evidence:
    `docs/planning/botmulti-05-runtime-signal-merge-task-2026-05-03.md`.

- [x] `BOTMULTI-04 api(write): support bot create/update with multiple strategies`
  - Scope: extended bot create/update API writes with optional ordered
    `strategies` payloads. Writes now persist multiple canonical
    `MarketGroupStrategyLink` rows under one active `BotMarketGroup`, keep
    `Bot.strategyId` as primary compatibility projection, and avoid legacy
    `BotStrategy` writes for multi-strategy payloads. Evidence:
    `docs/planning/botmulti-04-api-write-multi-strategy-task-2026-05-03.md`.

- [x] `BOTMULTI-03 db(schema): finalize canonical multi-strategy topology and migration path`
  - Scope: finalized the persistence boundary for one bot with one wallet, one
    active symbol-group market scope, and an ordered enabled strategy set.
    Added fail-closed migration preflight plus partial unique index
    `BotMarketGroup_one_active_scope_per_bot_idx` so a bot cannot have more
    than one enabled `ACTIVE` `BotMarketGroup`. Evidence:
    `docs/planning/botmulti-03-canonical-topology-migration-task-2026-05-03.md`.

- [x] `BOTMULTI-02 audit(data+runtime): inventory legacy compatibility remnants and migration debt`
  - Scope: inventoried current schema, API, runtime, tests, and module docs
    against the frozen `BOTMULTI-01` contract. Closed after the user selected
    lower numeric strategy-link priority as canonical; architecture reference
    wording and focused runtime merge regression now lock that semantics.
    Evidence:
    `docs/planning/botmulti-02-legacy-compatibility-migration-audit-task-2026-05-03.md`.

- [x] `BOTMULTI-01 docs(decision): freeze post-V1 multi-strategy bot contract`
  - Scope: first executable post-V1 BOTMULTI slice after `SYSFINAL-09` closed
    V1 confidence. Froze architecture target as one bot with one wallet, one
    active symbol-group market scope, and an ordered enabled strategy set.
    Manual-order ambiguity must fail closed, runtime merge must preserve
    primary strategy provenance, and DCA/TTP/SL/TSL ownership remains
    position-scoped. Evidence:
    `docs/planning/botmulti-01-post-v1-multi-strategy-contract-task-2026-05-03.md`.

- [x] `DOCMAP-01 docs(architecture): create engineering documentation system map foundation`
  - Scope: created the first traceable technical documentation map without
    rewriting existing architecture/module docs. Added central docs entrypoint,
    documentation inventory, codebase map, traceability matrix, pipeline
    registry with core flow docs, module registry, drift report, and docs
    maintenance rules. This links core features across frontend routes, API
    routes, services/modules, Prisma models, workers, tests, deployment docs,
    and known gaps. Runtime behavior unchanged. Validation: docs-focused
    parity/guardrail commands. Evidence:
    `docs/planning/docmap-01-engineering-documentation-system-map-task-2026-05-03.md`.

- [x] `SYSFINAL-09 release(closure): execute fixes regression production smoke and closure`
  - Scope: final executable slice from the consolidated final system
    functionality remediation master plan. Because `SYSFINAL-02..08` produced
    no `SYSFIX-*` implementation tasks, run the final closure checks and
    publish residual-risk evidence. Production-impacting smoke must use real
    available credentials/environment; if unavailable, classify the external
    blocker instead of inventing evidence. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-09-final-regression-production-smoke-closure-task-2026-05-03.md`.
    Validation PASS: guardrails, docs parity, lint, typecheck, full API tests,
    full web tests (`141` files / `399` tests), build, public production
    `/health`, `/ready`, web root, login page, web build-info, and protected
    API unauthenticated `401 Missing token`. Authenticated production
    dashboard/runtime smoke remains unavailable without credentials and was not
    claimed.

- [x] `SYSFINAL-08 planning(fixes): convert findings into tiny SYSFIX tasks`
  - Scope: ninth executable slice from the consolidated final system
    functionality remediation master plan. Convert every confirmed finding from
    `SYSFINAL-02..07` into a tiny, scoped `SYSFIX-*` task with reproduction,
    expected behavior, affected files, validation, deployment impact, rollback
    path, and acceptance criteria. If no findings exist, publish explicit empty
    fix-queue closure evidence. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-08-empty-sysfix-queue-task-2026-05-03.md`.
    Review of `SYSFINAL-02..07` found no confirmed discrepancies requiring
    implementation. Current `SYSFIX-*` queue is intentionally empty.

- [x] `SYSFINAL-07 qa(product): audit backtests reports logs i18n and UX states`
  - Scope: eighth executable slice from the consolidated final system
    functionality remediation master plan. Audit backtest create/list/detail
    for SPOT and FUTURES, reports and parity diagnostics states, logs/audit
    filtering, route-reachable i18n, and key dashboard responsive/accessibility
    state coverage. Any confirmed discrepancy becomes a scoped `SYSFIX-*`
    task. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-07-backtests-reports-logs-i18n-ux-audit-task-2026-05-03.md`.
    Validation PASS: focused API backtest/report pack (`13` files / `94`
    tests), sequential DB backtest/logs e2e pack (`2` files / `17` tests),
    focused web product/UX/i18n/a11y/responsive pack (`12` files / `33`
    tests), route-reachable i18n audit (`0` findings), and repository
    guardrails. No `SYSFIX-*` task required.

- [x] `SYSFINAL-06 qa(config): audit wallets markets strategies and bot setup`
  - Scope: seventh executable slice from the consolidated final system
    functionality remediation master plan. Audit wallet create/edit/API-key
    attach/test constraints, market universe and symbol-group
    create/edit/delete guards, strategy create/edit indicator metadata and
    validation, and bot create/edit/start/stop canonical wallet-first
    market/strategy runtime scope. Any confirmed discrepancy becomes a scoped
    `SYSFIX-*` task. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-06-configuration-workflows-audit-task-2026-05-03.md`.
    Validation PASS: API config pack (`16` files / `130` tests), web config
    pack (`11` files / `52` tests), and repository guardrails. No `SYSFIX-*`
    task required.

- [x] `SYSFINAL-05 qa(trading): audit order and position workflows`
  - Scope: sixth executable slice from the consolidated final system
    functionality remediation master plan. Audit PAPER manual market order
    open/fill/position visibility, PAPER runtime signal path through
    pre-trade/order/position/history, manual close, bot close, cancel order,
    history attribution, LIVE read-only imported position ownership/protection
    state, and visible guardrail explanations. Any confirmed discrepancy
    becomes a scoped `SYSFIX-*` task. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-05-order-position-workflows-audit-task-2026-05-03.md`.
    Validation PASS: lifecycle/pre-trade pack (`14` files / `116` tests),
    sequential DB order/position e2e pack (`7` files / `42` tests), focused
    web trading workflow pack (`8` files / `24` tests), and repository
    guardrails. No `SYSFIX-*` task required.

- [x] `SYSFINAL-04 qa(runtime): audit dashboard and bot runtime truth end to end`
  - Scope: fifth executable slice from the consolidated final system
    functionality remediation master plan. Audit Dashboard Home and Bot
    Monitoring against selected bot runtime truth: sessions, symbol stats,
    positions, history, signal cards, indicator value display,
    guardrail-blocked outcomes, Redis market-stream readiness, and
    PAPER/read-only LIVE runtime rows. Any confirmed discrepancy becomes a
    scoped `SYSFIX-*` task. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-04-dashboard-bot-runtime-truth-audit-task-2026-05-03.md`.
    Validation PASS: focused API runtime/readiness pack (`14` files / `113`
    tests), sequential DB runtime e2e pack (`7` files / `33` tests), focused
    web runtime pack (`14` files / `59` tests), and repository guardrails. No
    `SYSFIX-*` task required.

- [x] `SYSFINAL-03 qa(security): audit auth session security and permissions`
  - Scope: fourth executable slice from the consolidated final system
    functionality remediation master plan. Audit login/logout, failed login,
    expired/invalid session, protected route redirect, cross-user ownership
    denial, API-key masking/encryption behavior, connection-test error states,
    and LIVE write entitlement/consent fail-closed behavior. Any confirmed
    discrepancy becomes a scoped `SYSFIX-*` task. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-03-auth-session-security-audit-task-2026-05-03.md`.
    Validation PASS: focused API security pack (`14` files / `75` tests),
    focused web auth/profile/admin pack (`8` files / `28` tests),
    `pnpm audit`, and repository guardrails. No `SYSFIX-*` task required.

- [x] `SYSFINAL-02 qa(repo): run repository baseline gates and classify failures`
  - Scope: third executable slice from the consolidated final system
    functionality remediation master plan. Run the repository baseline gates
    before browser/API product audits: guardrails, docs parity when required,
    lint, typecheck, full API/web tests, and build. Every failure must be
    classified before implementation; confirmed product failures become scoped
    `SYSFIX-*` tasks. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-02-repository-baseline-gates-task-2026-05-03.md`.
    Validation PASS: repository guardrails, docs parity, lint, API+web
    typecheck, full API tests, full web tests (`141` files / `399` tests), and
    workspace build. No `SYSFIX-*` task required from the baseline.

- [x] `SYSFINAL-01 qa(planning): build current route API function inventory`
  - Scope: second executable slice from the consolidated final system
    functionality remediation master plan. Build the current user-facing
    function inventory and route/API matrix before running browser/API audits.
    Output must map every current route and major user function to its backend
    contract, data source, UI states, auth boundary, validation method, and
    explicit V2/deferred exclusions. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed with
    `docs/planning/sysfinal-01-current-function-inventory-task-2026-05-03.md`.
    Current web route families and API families are mapped to backend owners,
    data sources, expected UI states, auth boundaries, validation methods,
    redirect-only compatibility routes, and explicit V2/deferred exclusions.
    Validation PASS: repository guardrails.

- [x] `SYSFINAL-00 docs(planning): synchronize active planning truth before final function audit`
  - Scope: first executable slice from the consolidated final system
    functionality remediation master plan. Reconcile stale active/open-looking
    queue entries against current production evidence, then make the active
    NOW/NEXT queue point to the final audit sequence instead of historical
    carryover checkboxes. Stage remains deferred to V2, and `BOTMULTI-*`
    remains deferred pipeline until the current V1 production system is fully
    re-audited. Evidence plan:
    `docs/planning/system-functionality-final-remediation-master-plan-2026-05-03.md`.
  - 2026-05-03: Closed by synchronizing current queue truth. Runtime signal
    recovery is production-smoked and no longer waiting for deploy evidence;
    duplicate `V1BOT-SIGNALS-02` and older `V1FINAL/V1EXCEL` carryover entries
    are preserved only as historical/superseded context; `BOTMULTI-*` remains
    deferred pipeline. Validation PASS: repository guardrails.

- [x] `LIVEIMPORT-01 fix(api-runtime): restore wallet-first LIVE imported position ownership`
  - Scope: closed the operator-reported LIVE imported-position ownership
    investigation. The external takeover ownership index now resolves the
    canonical LIVE API key from the assigned wallet first, falling back to
    legacy `Bot.apiKeyId` only for old rows, and includes both the legacy
    primary symbol group and active canonical `BotMarketGroup` scopes. This
    lets `EXCHANGE_SYNC` positions on old and newly attached bot markets rebind
    deterministically by exact `apiKeyId:symbol` proof while preserving
    fail-closed `AMBIGUOUS`, `MANUAL_ONLY`, and `UNOWNED` outcomes. Validation
    PASS: focused ownership/takeover tests (`14/14`), API typecheck, API build,
    and repository guardrails. Evidence:
    `docs/planning/live-import-ownership-wallet-scope-task-2026-05-03.md`.

- [x] `LIVEIMPORT-02 fix(api-runtime): recover single-strategy provenance for imported LIVE protection`
  - Scope: closed the operator-reported follow-up where an imported LIVE
    ETH/DOGE position could be owned by a bot but still lack persisted
    `strategyId`, hiding TTP/DCA configuration and preventing protection
    automation from using the intended strategy. Runtime automation and
    runtime positions read models now recover the bot's single enabled
    canonical strategy link only when it is unambiguous; multi-strategy missing
    provenance remains fail-closed. Validation PASS: focused runtime automation
    tests (`33/33`), focused dynamic-stop operator truth e2e (`2/2`), API
    typecheck, and repository guardrails. Evidence:
    `docs/planning/live-import-single-strategy-provenance-task-2026-05-03.md`.

- [x] `ETHDCA-01 fix(api-runtime): preserve LIVE DCA-first gating for trailing-stop close decisions`
  - Scope: closed the operator-reported ETHUSDT investigation slice. Runtime
    position automation now hydrates durable DCA progress from persisted
    `Trade` lifecycle rows before DCA-first protection close evaluation,
    including current-position rows and same bot/wallet/strategy/symbol
    replacement lifecycles cut off by the latest opposite-side close. This
    prevents volatile runtime state loss or exchange-sync rebase from
    undercounting executed adds when a pending affordable DCA level should
    block `TSL` / `SL`. Runtime position serialization now renders finite
    negative trailing-loss `TSL` state instead of hiding an armed loss-side
    stop. Validation PASS: focused runtime automation and position
    serialization tests (`38/38`), API typecheck, API build, and repository
    guardrails.
    Evidence:
    `docs/planning/ethdca-01-live-dca-first-tsl-hardening-task-2026-05-02.md`.

- [x] `RUNTIME-SIGNAL-VOTES-01 fix(api-runtime): recover runtime strategy votes when matched indicators exist`
  - Scope: implementation is locally verified and production-smoked for
    the production-reported PAPER/LIVE runtime signal-vote risk.
    `RuntimeSignalLoop` now makes the final-candle decision path request an
    indicator-ready candle series before strategy evaluation, using the
    engine-owned Binance public REST recovery contract when the in-memory
    runtime series is too short. Runtime candles remain authoritative on
    fallback overlap, dashboard/read-model recovery reuses the same merge
    helper, and all signal execution still flows through the existing strategy
    merge, pre-trade, wallet, max-position, exchange-min-order, and
    orchestrator guardrails. Stale no-vote decisions no longer donate their
    `No votes` reason to recovered configured snapshots. A follow-up
    guardrail-visibility patch now includes latest `PRETRADE_BLOCKED` events
    in symbol-stats so matched conditions stopped by runtime guardrails show a
    concrete block reason instead of degrading to configured fallback. Production
    smoke confirmed API freshness on `26962ea1dbb0981d3885779d01e58485d7e9fd6c`,
    `/health=ok`, `/ready=ready`, active session `RUNNING`, concrete runtime
    block reasons for matched rows, and no unexplained `matched=true` +
    `No votes` contradiction for guardrail-blocked symbols. Validation
    PASS: focused runtime market-data, runtime loop, and read-model tests
    (`4` files / `56` tests), focused blocked-decision read-model tests
    (`2` files / `8` tests), API typecheck, API build, and repository
    guardrails. Evidence:
    `docs/planning/runtime-signal-vote-recovery-audit-plan-2026-05-02.md`.

- [x] `DOCSYNC-V1EXCEL-01 docs(planning): close superseded V1EXCEL evidence gates`
  - Scope: synchronized stale `V1EXCEL-03..06`, `V1EXCEL-04`, and
    `V1EXCEL-05` active queue entries after `V1CLOSEOUT-11` published final V1
    production-only `GO`. Stage refresh is explicitly deferred to V2 by
    operator decision, while production restore/rollback/signoff/release-gate
    evidence is superseded by the 2026-05-02 closeout pack. Validation PASS:
    repository guardrails. Evidence:
    `docs/planning/docsync-v1excel-superseded-gates-task-2026-05-02.md`.

- [x] `DOCSYNC-V1FINAL-01 docs(planning): close superseded V1FINAL-01 gate`
  - Scope: synchronized stale 2026-05-01 final-gate queue truth after
    `V1CLOSEOUT-11` published the current 2026-05-02 V1 production-only `GO`.
    `V1FINAL-01` is now marked closed as superseded by
    `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`, and
    `PROJECT_STATE` no longer describes the current phase as the older
    `V1EXCEL` / `V1FINAL-01` `NO-GO`. Validation PASS: repository guardrails.
    Evidence:
    `docs/planning/docsync-v1final-01-superseded-gate-status-task-2026-05-02.md`.

- [x] `DASHSIGNALS-02 fix(api-runtime): recover indicator candles before unavailable signal values`
  - Scope: closed the deeper follow-up from `DASHSIGNALS-01`. Runtime symbol
    stats now treats a short in-memory candle series as insufficient for
    indicator presentation and tops it up from the approved fallback kline path
    before running the shared indicator analysis. Fallback and runtime candles
    are deduplicated by `openTime`, with runtime candles authoritative on
    overlap. `n/a` remains a final fail-closed display state only when recovery
    cannot produce a valid value. No order execution, position automation, or
    trading mutation behavior changed. Validation PASS: focused backend signal
    recovery/read-model tests (`7/7`), API typecheck, repository guardrails,
    and API build. Production readback after deploy confirmed no raw `n/a`, no
    pending indicator labels, and concrete visible `RSI(14)` values for active
    dashboard signal cards. Evidence:
    `docs/planning/dashsignals-02-indicator-recovery-before-unavailable-task-2026-05-02.md`.

- [x] `V1BOT-SIGNALS-02 fix(api-runtime): expose condition match truth and recover market-stream publishing`
  - Scope: closed the runtime signal truth and market-stream recovery slice.
    Condition lines now carry canonical `matched=true|false|null` truth,
    dashboard/bot monitoring surfaces can distinguish `PASS` and `MISS`,
    market-stream Redis publisher failures retry instead of memoizing a dead
    publisher, Binance USD-M Futures market streams use the routed
    `/market/ws` endpoint, and production readiness now fails closed when
    required Redis is unreachable. Production Redis AOF was recovered from a
    backed-up volume and post-recovery authenticated SSE emitted real
    candle/ticker events. Validation PASS: focused market-stream/runtime
    read-model tests (`50/50`), focused Binance stream/fanout/subscription
    tests (`15/15`), readiness tests (`9/9`), API typecheck, web typecheck,
    API build, and repository guardrails. Evidence:
    `docs/planning/v1bot-signals-runtime-truth-2026-05-02.md`.

- [x] `DASHSIGNALS-01 fix(runtime+web): clarify unavailable indicator signal values`
  - Scope: remediated the operator-reported production dashboard signal-card
    drift where unavailable RSI values rendered as misleading expressions such
    as `n/a < 20` and `n/a > 80`. Runtime analysis now treats unavailable
    indicator operands as unknown display truth instead of normal failed
    matches, the runtime read model prefers concrete snapshot condition values
    when latest-decision payloads contain only unavailable values, and
    Dashboard Home / Bot Monitoring render localized pending-data text while
    preserving thresholds. No order execution, position automation, or trading
    mutation semantics changed. Validation PASS: focused API signal/read-model
    tests (`5/5`), focused web dashboard/bot signal tests (`32/32`), API
    typecheck, web typecheck, repository guardrails, lint, route-reachable
    i18n audit, API build, and web build. Evidence:
    `docs/planning/dashsignals-01-indicator-value-pending-display-task-2026-05-02.md`.

- [x] `DASHDISPLAY-01 fix(web-dashboard): repair production dashboard display polish`
  - Scope: remediated authenticated production dashboard display findings from
    2026-05-02 without changing trading/runtime/API behavior. Manual Order
    quantity helper text is structurally separate from the quantity slider,
    runtime history/trade pills stay on one line in horizontally scrollable
    tables, and the dashboard breadcrumb spacer no longer exposes
    `__dashboard-spacer__` in rendered DOM text. Validation PASS: focused web
    dashboard/title pack (`29/29`), web typecheck, repository guardrails, and
    web build. Evidence:
    `docs/planning/dashdisplay-01-prod-dashboard-display-polish-task-2026-05-02.md`.

- [x] `AWESOME-FIX-01 test(api-positions): isolate imported position history hydrator fixtures`
  - Scope: remediated the only confirmed follow-up from
    `docs/operations/awesome-audit-execution-report-2026-05-02.md`.
    `apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts`
    now cleans dependent rows before users. Validation PASS: affected test file
    (`6` tests), adjacent focused API slices (`58` tests across `7` files),
    full API suite, API typecheck, and repository guardrails.

- [x] `AWESOME-01 qa(product): execute full post-V1 quality audit program`
  - Scope: executed the master audit program from
    `docs/planning/awesome-audit-master-plan-2026-05-02.md`. Start with
    architecture truth and route/API contract audits, then proceed through
    auth/session, frontend-backend integration, dashboard runtime truth, bots,
    orders/positions, wallets/exchange keys, strategies/markets, backtests,
    UX states, security, production runtime, data integrity, and final user
    acceptance matrix. Closed with
    `docs/operations/awesome-audit-execution-report-2026-05-02.md`.
    Result: no product/runtime/security/production public-smoke blocker found;
    the only QA test-isolation follow-up is closed as `AWESOME-FIX-01`.

- [x] `V1CLOSEOUT-01 fix(api-wallets/bots): resolve LIVE external management ownership persistence`
  - Scope: first execution slice from
    `docs/planning/v1closeout-audit-remediation-plan-2026-05-02.md`.
    Reconcile the failing LIVE wallet `manageExternalPositions` assertion with
    the current singular-bot architecture and `V1TAKE-10` ownership decision.
    Fix the API contract or stale test without duplicating wallet/bot
    authority. Required validation: focused wallets e2e, related takeover or
    runtime tests if semantics change, and API typecheck.

- [x] `V1CLOSEOUT-02 fix(api-engine/backtests): restore advanced TSL close parity`
  - Scope: repair the confirmed `advanced-tsl` parity failure where backtest
    returns no close reason while the golden BACKTEST/PAPER/LIVE contract
    expects `trailing_stop`. Reuse shared lifecycle logic and avoid a
    backtest-only workaround. Required validation: lifecycle close parity
    golden test, focused replay/runtime lifecycle tests if touched, and API
    typecheck.

- [x] `V1CLOSEOUT-03 fix(api-bots-runtime): repair monitoring trades and dynamic TSL serialization`
  - Scope: restore deterministic runtime monitoring totals, symbol filters,
    and pre-arm dynamic TSL truth in `bots.e2e.test.ts`. Dynamic TSL stop
    values must remain `null` until the runtime trailing state is actually
    armed. Required validation: focused bots e2e and API typecheck.

- [x] `V1CLOSEOUT-04 fix(api-orders/positions): restore exchange-synced LIVE visibility and close flow`
  - Scope: fix selected-bot LIVE runtime truth for manual LIVE MARKET adoption,
    `EXCHANGE_SYNC BOT_MANAGED` visibility when PAPER shares the symbol,
    dashboard close returning `closed`, and deterministic fixture setup in
    `orders-positions.e2e.test.ts`. Required validation: focused
    orders/positions e2e, related runtime/takeover tests if touched, and API
    typecheck.

- [x] `V1CLOSEOUT-05 fix(api-positions): restore orphan repair canonical rebinding`
  - Scope: make orphan repair re-import exchange truth with deterministic
    `botId` and `walletId` when evidence is sufficient, while preserving
    fail-closed behavior for ambiguous ownership. Required validation: focused
    orphan repair e2e, related restart continuity tests if touched, and API
    typecheck.

- [x] `V1CLOSEOUT-06 qa(api): restore full API suite green after closeout fixes`
  - Scope: after `V1CLOSEOUT-01..05`, rerun every previously failing focused
    API file and then the full API suite. Classify any remaining failure before
    changing code. Required validation: `pnpm --filter api run test -- --run`
    and API typecheck.

- [x] `V1CLOSEOUT-07 fix(docs): repair docs parity route-map path drift`
  - Scope: make docs parity resolve the canonical route map at
    `docs/architecture/reference/dashboard-route-map.md` instead of looking for
    the stale root architecture path. Required validation:
    `pnpm run docs:parity:check` and repository guardrails.

- [x] `V1CLOSEOUT-08 release(ops): resolve RC signoff and release-gate evidence drift`
  - Scope: synchronized RC checklist and external gate status from current
    signoff truth. Gate 4 is no longer presented as approved while
    `v1-rc-signoff-record.md` remains `BLOCKED`; current generated status is
    `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=OPEN`. Validation:
    `pnpm run ops:rc:gates:status` PASS,
    `pnpm run ops:rc:checklist:sync` PASS,
    `pnpm run ops:rc:gates:summary` PASS with G4 OPEN, and
    `pnpm run ops:rc:gates:evidence:check -- --strict` fails as expected
    because approver names and Gate 4 approval are still missing.

- [x] `V1CLOSEOUT-09 release(ops): refresh production restore drill and activation evidence`
  - Scope: refreshed local/stage/prod restore and activation evidence without
    inventing missing target access. Local restore drill PASS; stage/prod
    restore drills produced fresh FAIL artifacts because the required DB
    container env vars are not configured in this execution context. Stage and
    prod release gates were rerun in dry-run mode and remain `not_ready`.
    Current evidence packet:
    `docs/operations/v1-closeout-evidence-refresh-2026-05-02.md`.

- [x] `V1CLOSEOUT-10 refactor(api-exchange): decide and remediate direct exchange boundary access`
  - Scope: remediated direct Binance REST host/fetch ownership and direct
    `ccxt` client bootstrap outside `modules/exchange`. Public Binance REST
    URL/fetch ownership now lives in `binancePublicRest.service.ts`, API-key
    probe client bootstrap lives in `binanceApiKeyProbeClient.service.ts`, and
    backtests/runtime/profile consumers use the exchange-owned seams. Static
    audit no longer finds Binance host/env or direct `ccxt` access outside
    `modules/exchange`; remaining `Ccxt...` references outside exchange are
    type imports only. Validation PASS: focused exchange/backtest/runtime/
    profile pack (`15/15`), runtime loop/pnl pack (`45/45`), and API typecheck.

- [x] `V1CLOSEOUT-11 release(qa): run final V1 go/no-go closure pack`
  - Scope: after P0 fixes and evidence refresh, run the complete validation
    baseline, synchronize RC artifacts, and publish final GO or NO-GO with
    exact evidence. Closed with final `GO` in
    `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`. Repository
    validation baseline is green, and Gate 4 is now approved with Patryk
    Wroblewski as Engineering, Product, Operations, and RC owner. Production
    restore evidence PASS, rollback proof PASS, and the non-dry-run production
    release gate is `ready`. Stage is deferred to V2 per operator decision.

- [x] `V1SEC-01 fix(deps+ops): clear dependency audit and record V1 prod-only release scope`
  - Scope: remediated the confidence-sweep dependency audit findings without
    runtime behavior changes. Updated Next/Tailwind/Vitest-related web
    toolchain dependencies, patched vulnerable transitive packages with
    centralized `pnpm.overrides`, kept `next` and `axios` as production
    dependencies, and recorded the V1 prod-only release decision with stage
    deferred to V2. Validation PASS: `pnpm audit`, `quality:guardrails`,
    `lint`, `typecheck`, full web tests (`139` files / `394` tests), full API
    tests, `build`, and `docs:parity:check`. Evidence:
    `docs/planning/v1sec-01-prod-only-dependency-hardening-task-2026-05-02.md`.

- [x] `V1PRICE-04 fix(api-runtime): propagate fallback ticker price into position markPrice candidates`
  - Scope: closed as part of `V1RUNTIME-TRUST-03`. Runtime Positions now feeds
    valid fallback ticker prices into the existing preferred price resolver for
    open-position `markPrice` when runtime/stat price truth is missing, without
    changing live close command semantics and while preserving exchange-sync
    freshness precedence. Focused API regression PASS. Evidence:
    `docs/planning/v1runtime-operator-trust-hardening-task-2026-05-02.md`.

- [x] `V1SURF-03 fix(web-runtime): reset live ticker state on runtime context changes`
  - Scope: closed as part of `V1RUNTIME-TRUST-03`. Dashboard Home and Bot
    Monitoring now clear symbol-keyed stream prices on runtime context
    boundaries, and Bot Monitoring opens market SSE only for `RUNNING`
    contexts. Focused web regression PASS for same-symbol selected-bot stream
    reset. Evidence:
    `docs/planning/v1runtime-operator-trust-hardening-task-2026-05-02.md`.

- [x] `V1BOT-AUDIT-02 qa(runtime+web): audit runtime freshness, action context, and operator trust`
  - Scope: completed a second operator-trust audit after `V1SURF-02`.
    Findings: Runtime Positions fetches fallback ticker prices but does not
    feed them into open-position `markPrice` candidates; web stream ticker
    state is not reset on all runtime context changes; Bot Monitoring stream
    eligibility is broader than Dashboard Home; runtime price source/freshness
    remains hidden from the web contract; close/cancel paths are backend
    guarded but UI affordances can improve later. Evidence:
    `docs/planning/v1bot-runtime-operator-trust-audit-2026-05-02.md`.

- [x] `V1SURF-02 fix(web-runtime): share live open-position derivation across Bot Runtime and Dashboard`
  - Scope: follow-up from `V1BOT-AUDIT-01`. Consolidated the duplicated open
    runtime position display derivations currently split between
    `BotsManagement.tsx` and dashboard-home `runtimeDerivations.ts`, so both
    surfaces use the same stream/API price precedence, `LONG`/`SHORT` PnL,
    margin-percent, DCA, and `TTP`/`TSL` display contract. Also fixed dashboard
    summary KPI drift by reusing the same selected live unrealized value for
    `summary.unrealized`, `paperDelta`, `paperEquity`, selected `net`, and the
    open-position table. Validation PASS: focused web derivation/component
    tests (`9/9`), web typecheck, web build, and guardrails. Evidence:
    `docs/planning/v1surf-02-shared-runtime-position-derivation-task-2026-05-02.md`.

- [x] `V1DOGE-03 fix(api-runtime+web): align imported LIVE protection and dashboard price truth`
  - Scope: fixed an operator-reported `LIVE DOGEUSDT SHORT` protection concern
    where dashboard PnL had fallen below visible `TTP` while the position
    remained open. Runtime automation now shares the same
    runtime-versus-exchange-sync price preference contract used by the
    dashboard read model, and imported `LIVE EXCHANGE_SYNC` protection decisions
    prefer exchange-derived price from fresh `unrealizedPnl` whenever
    reconciliation is newer than the runtime price candidate. Added a focused
    DOGE short regression proving `closeByExitSignal` receives
    `trailing_take_profit` when exchange-sync PnL is below the tracked TTP
    floor, plus focused locks for `TP`, `SL`, and `TSL` on the same freshness
    contract. A follow-up dashboard-home derivation fix restores live
    market-stream precedence over API snapshots for visible open-position PnL,
    so percentages refresh when market data arrives. Validation PASS: focused
    runtime regression, related runtime/read-model pack (`40/40`), API
    typecheck, focused web derivation test (`3/3`), web typecheck, web build,
    and guardrails. Production deploy and
    protected DOGE readback remain operational follow-up evidence. Evidence:
    `docs/planning/v1doge-ttp-exchange-sync-price-task-2026-05-02.md`.

- [x] `V1MARKET-03 fix(api-markets): ignore stale legacy bot-strategy market links`
  - Scope: reproduced the operator-reported production `LIVE` blocker with
    explicit approval. Disabling `live` correctly moved its canonical `ETH`
    market group to `PAUSED`, but editing `ETH` still failed because the active
    `Peper bot` had a stale legacy `BotStrategy` row pointing at `ETH Group`
    even though its current canonical market scope is `Meme coins`. The market
    universe active-use guard now blocks only active current primary/canonical
    bot market scope and ignores stale legacy `BotStrategy` links. Added a
    regression for this drift shape. Validation PASS: markets e2e (`15/15`),
    bots runtime-scope e2e (`10/10`), API typecheck, and repository guardrails.
    Post-deploy evidence: web build-info reached `8a433e07`, VPS inspection
    then showed `soar-api` was still on `6bc7840a`; `soar-api` was redeployed
    to `8a433e07`, `/health` and `/ready` returned `200`, and the approved
    `LIVE` smoke passed end-to-end (`live` disable -> linked `ETH` edit ->
    whitelist restore -> `live` re-enable, all `200 OK`; final `live` active
    and `ETH` whitelist unchanged).
    Evidence:
    `docs/planning/v1market-03-ignore-stale-legacy-market-guard-task-2026-05-02.md`.

- [x] `V1MARKET-02 fix(web-markets): keep Binance catalog symbols selectable for whitelist`
  - Scope: fixed the operator-reported follow-up where market whitelist
    dropdowns only showed symbols that survived the current volume filter,
    preventing manual selection of lower-volume Binance catalog symbols.
    Manual whitelist/blacklist selection now uses the full current Binance
    catalog for the selected exchange, market type, and base currency, while
    the preview/result contract remains `(volume-filtered catalog U whitelist)
    - blacklist`. Added accessible checkbox labels for market option
    selection and a focused regression covering a below-threshold `SOLUSDT`
    selection. Validation PASS: focused market form component test (`8/8`)
    web typecheck, web build, and repository guardrails. Evidence:
    `docs/planning/v1market-02-whitelist-catalog-selection-task-2026-05-02.md`.

- [x] `V1MARKET-01 fix(api-bots+markets): allow market edits after linked bot deactivation`
  - Scope: fixed the operator-reported blocker where a linked market universe
    could still behave as used by an active bot after that bot was disabled.
    `PUT /dashboard/bots/:id` now synchronizes enabled non-archived canonical
    bot market groups to `PAUSED` on deactivation and back to `ACTIVE` on
    reactivation, while preserving existing inactive-bot runtime graph mapping
    behavior for bots created inactive. Added regression coverage for active
    block -> bot deactivate -> market universe symbol edit/sync -> bot
    reactivate -> active block. Validation PASS: markets e2e (`14/14`), bots
    runtime-scope e2e (`10/10`), bots duplicate guard e2e (`4/4`), API
    typecheck, and repository guardrails. Evidence:
    `docs/planning/v1market-01-deactivated-bot-market-edit-task-2026-05-02.md`.

- [x] `V1BOT-SIGNALS-02 fix(api-runtime): expose condition match truth and recover market-stream publishing`
  - Scope: follow-up for the production `Dashboard -> Markets / Signals`
    signal-count/display concern. Authenticated read-only production smoke
    showed the current PAPER session is `RUNNING` but has only `eventsCount=1`
    and `symbolsTracked=0`, while the market-stream SSE endpoint connects but
    does not emit sampled ticker/candle events. Runtime condition analysis now
    adds canonical per-rule `matched` truth, the dashboard keeps the same
    table structure while rendering `PASS`/`MISS`, and market-stream Redis
    publisher failures reset memoized connection state so transient Redis
    startup/publish failures do not permanently mute events. Follow-up
    websocket smoke identified the deeper remaining blocker: Binance USD-M
    Futures no longer pushes regular market streams from the legacy unrouted
    `wss://fstream.binance.com/ws` endpoint, so the worker now uses
    `wss://fstream.binance.com/market/ws`. Post-deploy smoke then exposed a
    separate production Redis infrastructure failure: Coolify shows Redis
    `restarting:unhealthy` with corrupted AOF logs, blocking authenticated
    login/rate-limit and likely market-stream fanout. API readiness now fails
    closed on required Redis `PING` failure, and the Redis AOF recovery runbook
    plus smoke checklist were updated. Redis AOF was backed up and repaired on
    production, Redis returned to `running:healthy`, authenticated login passed,
    and production SSE emitted real Binance FUTURES ticker/candle events.
    Validation so far: focused
    market-stream/runtime read-model tests (`50/50`), focused Binance
    stream/fanout/subscription tests (`15/15`), readiness test (`9/9`), API
    typecheck, web typecheck, API build, and repository guardrails. Readiness
    hardening deploy/readback was superseded by the later closed entry above
    and by production smoke confirming Redis readiness, real market-stream
    events, and runtime signal guardrail visibility. Evidence:
    `docs/planning/v1bot-signals-runtime-truth-2026-05-02.md`.

- [x] `V1BACKTEST-01 fix(api-backtests): recover futures candles when primary kline endpoint is unavailable`
  - Scope: investigated the operator-reported production backtest details/run
    issue after recent PAPER/LIVE changes. Production smoke reproduced a
    mode-specific failure: `FUTURES` run
    `d92219d3-ae5a-480f-ae35-1293e87339bf` failed with
    `NO_CANDLES_AVAILABLE_FOR_SYMBOL` and `totalTrades=0`, while comparable
    `SPOT` run `553a5c1a-66a9-4c70-be20-6c044cb11010` completed with
    `totalTrades=2`. Added a futures-only `/fapi/v1/continuousKlines`
    fallback in `backtestDataGateway` when the primary `/fapi/v1/klines`
    response is unavailable or empty, preserving SPOT behavior and avoiding
    hidden SPOT/FUTURES substitution. Also aligned stale replay-core TSL test
    data to the current negative-start plus positive-step contract introduced
    by recent strategy changes. Validation PASS: gateway test (`3/3`), replay
    core (`25/25`), backtests e2e (`14/14`), API typecheck, API build, and
    repository guardrails. Evidence:
    `docs/planning/v1backtest-01-futures-kline-fallback-task-2026-05-02.md`.

- [x] `DPL-PROD-BUILDINFO-01 fix(ops): fail promotion when web build-info stays on old SHA`
  - Scope: hardened the canonical production promotion workflow after a
    production deploy lag required an empty retrigger commit. `Promote PROD`
    now polls the public web `/api/build-info` endpoint after the Coolify
    deploy webhook and fails unless the endpoint exposes the promoted
    `github.sha`. Added the reusable `ops:deploy:wait-web-build-info` script
    and updated Coolify/post-deploy runbooks. Validation PASS: script help,
    production readback against active SHA, and repository guardrails.
    Evidence: `docs/operations/prod-web-build-info-gate-2026-05-02.md`.

- [x] `V1BOT-CONDITIONS-01 fix(api-runtime-read): prevent stale signal conditions after bot context edits`
  - Scope: fixed operator-reported runtime monitoring drift where `Markets /
    Signals` could keep displaying old strategy condition indicators after a
    bot was stopped, edited to another strategy, and started again. Runtime
    symbol-stats now treats superseded signal-strategy payloads and signal
    payloads predating a same-strategy config edit as stale for displayed
    condition context, falling back to the current configured strategy until a
    fresh runtime decision arrives. Aggregate merge also preserves current
    configured fallback context over superseded historical signal context after
    restart, including the no-new-session-yet race seen in production paper
    smoke. The market edit question was regression checked without changing UI:
    inactive PAPER and LIVE bots can save market universe symbol edits and
    linked symbol groups sync correctly. Validation PASS: focused bots
    runtime-scope e2e (`10/10`), markets e2e (`13/13`), API typecheck, API
    build, and repository guardrails.
    Evidence:
    `docs/planning/v1bot-conditions-market-sync-2026-05-02.md`.

- [x] `V1I18N-01 feat(web-i18n): add Swiss German locale`
  - Scope: added German (Switzerland) as standard locale code `de-CH` across
    the existing web i18n architecture, including supported locale storage,
    provider hydration, Intl formatting, security bootstrap allow-list, route
    namespace registry, all translation namespace files, language switcher CH
    flag option, and focused parity tests. The work also fixed existing
    Portuguese dashboard-home namespace drift exposed by stronger parity
    checks. Validation PASS: focused i18n/UI tests (`22/22`), web typecheck,
    web build, repository guardrails, and route-reachable i18n audit
    (`findings=0`). Evidence:
    `docs/planning/v1i18n-01-swiss-german-locale-task-2026-05-02.md`.

- [x] `V1UI-FLAG-01 fix(web-footer): restore language switcher flags`
  - Scope: after an operator-reported UI regression, reviewed commits from
    `2026-05-01 09:00` and confirmed no post-09:00 commit directly touched the
    footer or language switcher. Hardened the existing shared
    `LanguageSwitcher` flag output by rendering GB/PL/PT as visual CSS flag
    badges instead of regional-indicator text, then added public and dashboard
    footer regressions proving the active language flag remains visible in the
    footer without text content.
    Validation PASS: focused footer/language switcher tests (`5/5`), web
    typecheck, web build, repository guardrails. Evidence:
    `docs/planning/v1ui-flag-01-footer-language-flags-regression-task-2026-05-01.md`.

- [x] `V1DCA-05 fix(api-runtime-read): restore imported DCA across restarted sessions`
  - Scope: after production deployed `15cddb5a`, authenticated ETHUSDT evidence
    still showed `dcaCount=0` because the current runtime session started at
    `2026-05-01T17:11:21.540Z`, while the open exchange-sync row was a
    continuing lifecycle with DCA rows from the prior session. Runtime
    `Positions` now fetches and reconstructs lifecycle DCA from the earlier of
    bot creation and session start, keeps bot/wallet/symbol/management filters,
    bridges through same-ownership historical position ids for legacy DCA rows
    that lost both bot and wallet refs, includes pre-wallet `walletId=null`
    bot-scoped legacy trades, and preserves close/reopen boundaries. Validation
    PASS: focused imported DCA API e2e (`6/6`), API typecheck, API build,
    repository guardrails, diff check. Evidence:
    `docs/planning/v1dca-05-restarted-session-imported-dca-read-model-task-2026-05-01.md`.

- [x] `V1DCA-04 fix(api-runtime-read): restore wallet-scoped imported DCA in Positions`
  - Scope: after `V1DCA-03` proved the UI no longer hides monitoring content,
    ETH still showed `DCA=0` despite two real DCA adds. The remaining issue was
    backend read-model recovery for imported/exchange-sync DCA trade rows that
    can lose direct `botId` or `strategyId` refs. Runtime `Positions` now
    includes wallet-scoped imported DCA for owned external symbols and allows
    missing strategy refs inside the same lifecycle while preserving close/reopen
    boundaries. Validation PASS: focused imported DCA API e2e (`5/5`), API
    typecheck, API build, repository guardrails. Evidence:
    `docs/planning/v1dca-04-wallet-scoped-imported-dca-read-model-task-2026-05-01.md`.

- [x] `V1DCA-03 fix(web-monitoring): restore DCA visibility when portfolio-history refresh fails`
  - Scope: after production deployed `fbeae8f0`, the operator reported DCA no
    longer showing in the dashboard `Positions` table. Commit review from
    2026-05-01 09:00 identified `fbeae8f0` as the only post-09:00 commit
    touching bot runtime/web monitoring. The portfolio-history fetch added in
    that commit is now fail-soft and cannot set the global monitoring error
    state that hides otherwise-valid positions/DCA content. Validation PASS:
    focused `BotsManagement` web test (`13/13`) with portfolio-history mocked
    as failing while DCA ladder output remains asserted; production web
    build-info reports `19a62b8d20f7e14d2489bbd8a842ca9c0c558efb`; public
    production deploy smoke passed. Evidence:
    `docs/planning/v1dca-03-monitoring-dca-visibility-regression-task-2026-05-01.md`.

- [x] `V1COVER-01 qa(release): create V1 module function coverage ledger`
  - Scope: replace repeated ad-hoc confidence loops with one filterable
    function coverage matrix split by module, submodule, mode, layer,
    capability, child scenario, local status/evidence, production
    status/evidence, risk, priority, owner, and next verification.
  - 2026-05-01: Closed initial ledger with 33 V1 money-path/runtime/release-gate
    rows and an operator workbook. Initial production status split:
    `PASS=14`, `PARTIAL=5`, `NEEDS_PROD_SAMPLE=7`,
    `NEEDS_PROD_UI_CHECK=1`, `BLOCKED=2`, `FAIL=1`,
    `NOT_APPLICABLE=2`, `NOT_VERIFIED=1`. Evidence:
    `docs/operations/v1-function-coverage-audit-2026-05-01.md`,
    `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`.

- [x] `V1COVER-02 qa(release): expand function coverage ledger from code scan`
  - Scope: scan API module directories/routes, web dashboard routes, and test
    files to add missing top-level function rows before the next deeper code
    coverage audit.
  - 2026-05-01: Closed the second coverage pass. The ledger now has 79 rows
    across the primary top-level API/web surfaces. Production status split:
    `PASS=17`, `PARTIAL=22`, `NEEDS_PROD_SAMPLE=9`,
    `NEEDS_PROD_UI_CHECK=12`, `NOT_VERIFIED=11`, `NOT_APPLICABLE=5`,
    `BLOCKED=2`, `FAIL=1`; priorities: `P0=45`, `P1=24`, `P2=10`.
    Evidence:
    `docs/planning/v1cover-02-code-scan-function-ledger-expansion-task-2026-05-01.md`,
    `docs/operations/v1-function-coverage-audit-2026-05-01.md`,
    `docs/operations/v1-function-coverage-matrix-2026-05-01.csv`.

- [x] `V1COVER-03 qa(release): classify function ledger by implementation readiness`
  - Scope: classify all 79 ledger rows into implementation-readiness buckets
    so remaining V1 work can be planned as blockers, evidence tasks, fixes, or
    launch-scope decisions.
  - 2026-05-01: Closed with readiness split `READY=22`,
    `IMPLEMENTED_NEEDS_EVIDENCE=43`, `IMPLEMENTED_NOT_VERIFIED=11`,
    `V1_BLOCKER=3`, `REQUIRES_IMPLEMENTATION_REVIEW=0`. Recommended follow-up
    waves are `V1GATE-A`, `V1MONEY-A`, `V1MANUAL-A`, `V1UX-A`, and
    `V1SCOPE-A`. Evidence:
    `docs/planning/v1cover-03-function-implementation-readiness-task-2026-05-01.md`,
    `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`.

- [x] `V1COVER-04 qa(release): promote function ledger into reusable project standard`
  - Scope: extract the reusable table model from the Soar V1 ledger so other
    projects can adopt the same column contract, status vocabulary, readiness
    buckets, task derivation rules, evidence quality rules, and release-gate
    rules.
  - 2026-05-01: Closed with a governance standard plus copyable CSV template.
    Soar's V1 ledger is now documented as one project-specific instance of the
    model. Evidence:
    `docs/planning/v1cover-04-model-function-ledger-standard-task-2026-05-01.md`,
    `docs/governance/function-coverage-ledger-standard.md`,
    `docs/governance/function-coverage-ledger-template.csv`.

- [x] `V1SUBS-01 fix(api-entitlements): fail closed on LIVE bot writes without live-trading entitlement`
  - Scope: close the remaining local `SUBS-ENTITLEMENTS-001` V1 implementation
    slice by enforcing `features.liveTrading=true` on LIVE bot create and
    `PAPER -> LIVE` mode switch.
  - 2026-05-01: Closed with one shared
    `assertSubscriptionAllowsLiveTrading(...)` guard and focused e2e coverage
    for FREE-plan LIVE-pool drift. Validation PASS: API typecheck, focused
    entitlement e2e (`5/5`), API build, repository guardrails. Evidence:
    `docs/planning/v1subs-01-live-entitlement-bot-write-guard-task-2026-05-01.md`.

- [x] `V1FINAL-01 qa(prod): verify deployed DOGE runtime hardening and run final V1 gates`
  - Scope: execute the final V1 gate structure after production deploys
    `fba29a96` or later. Gate order: deploy freshness, DOGE close/reopen
    runtime regression, production V1EXCEL evidence, manual operator matrix,
    final GO/NO-GO.
  - 2026-05-01 preflight: production public smoke passes, but build-info still
    reports `c081f224134fedb65de2ecad716274b92593c373`, so production does not
    yet include `V1DOGE-02` (`577c45a8`) or the final test structure
    (`fba29a96`). Stage still returns `503`. GitHub workflow recheck shows the
    latest `Promote PROD` run is old (`0f122ed4`, 2026-04-25) and failed; no
    current production promotion run exists for `577c45a8`/`fba29a96`.
    Test structure:
    `docs/operations/v1-final-test-structure-2026-05-01.md`. Planning task:
    `docs/planning/v1final-00-final-test-structure-task-2026-05-01.md`.
  - 2026-05-01 execution: production deploy freshness is now resolved on
    `6a8ded9333eabced5e8461362e9e9237a9bf4e4d`; public and authenticated
    production smoke passed; protected runtime freshness passed; rollback guard
    returned `shouldRollback=false`; rollback proof was regenerated; and the
    active `LIVE` `DOGEUSDT` open row now reports `dcaCount=0`,
    `tradesCount=1`, and `strategyAutomationContextResolved=true`, so stale DCA
    no longer crosses into the fresh lifecycle. Final V1 remains blocked by a
    failed production restore drill caused by missing prod DB container
    configuration, stale activation audit/plan from `2026-04-22`, incomplete
    manual operator matrix, and stage `503`. Evidence:
    `docs/planning/v1final-01-prod-gate-execution-task-2026-05-01.md`,
    `docs/operations/v1-release-gate-prod-2026-05-01T02-44-00-227Z.md`.
  - 2026-05-01 deploy refresh: production web build-info now reports
    `fbeae8f08926bc838141d53397fc142f52945356` on `main`, matching the local
    V1 candidate. Public production deploy smoke passed for API `/health`, API
    `/ready`, and web `/`. Release-gate classification remains `not_ready`
    because activation audit/plan are stale and the production backup/restore
    drill artifact is still failed. Evidence:
    `docs/operations/v1-release-gate-prod-2026-05-01T18-20-00-000Z.md`.
  - 2026-05-03 sync: this older final-gate item is preserved as historical
    evidence and is no longer active V1 work. It is superseded by
    `V1CLOSEOUT-11` and the 2026-05-02 production-only final `GO` closure.
- [x] `V1EXCEL-04 ops(stage-refresh): restore stage target before authenticated gate rerun`
  - Scope: stage release-gate evidence cannot proceed while the stage web/API
    targets are unavailable.
  - 2026-05-01 refresh: public stage smoke now fails before auth with `503 no
    available server` on `https://stage-api.soar.luckysparrow.ch` and
    `https://stage.soar.luckysparrow.ch` for health/ready/root/build-info.
    Evidence:
    `docs/operations/v1excel-04-stage-refresh-503-2026-05-01.md`. Next action
    is a Coolify stage service restore/redeploy, then public smoke and
    authenticated runtime/rollback gate rerun.
  - 2026-05-01 follow-up: stage public smoke still fails with the same `503 no
    available server` response. Coolify web login works for the provided
    operator account, but the visible project/environment does not expose Soar
    resources and Coolify API reads return `401` without a bearer token, so
    automated restore/deploy remains blocked on proper Coolify resource/API
    access. Evidence:
    `docs/operations/v1excel-04-stage-coolify-access-refresh-2026-05-01.md`.
  - 2026-05-01 Coolify team follow-up: the account sees
    `luckysparrow's Team` and `Root Team`, but the active UI remains on
    `luckysparrow's Team`; attempting to switch to `Root Team` through the
    rendered Livewire team switch returned `500`. No stage restore action was
    attempted. Evidence:
    `docs/operations/v1excel-04-stage-coolify-access-refresh-2026-05-01.md`.
  - 2026-05-02: closed for V1 as deferred to V2 by operator decision in
    `V1CLOSEOUT-11`; stage restoration remains a V2 infrastructure task.
- [x] `V1EXCEL-05 ops(prod-refresh): finish broader production evidence families`
  - Scope: production public smoke and protected runtime rollback gates are
    green, but full production release evidence is not yet complete.
  - 2026-05-01 refresh: executable production subset PASS on the current
    deployed runtime candidate. Public smoke passed, protected runtime
    freshness passed, and rollback guard returned `shouldRollback=false`, no
    reasons, no alerts, `runningCount=4`. Production rollback-proof artifact
    also PASS with secret-safe command recording. Evidence:
    `docs/operations/v1excel-05-prod-refresh-2026-05-01.md`. Remaining work:
    restore drill, RC status/sign-off/checklist rebuild, and remaining manual
    matrix items.
  - 2026-05-01 follow-up: RC status/checklist/sign-off were rebuilt and
    rollback proof is fresh/pass for production, but sign-off is now `BLOCKED`
    because approver fields are empty, and the fresh prod restore drill is
    `FAIL` because this context lacks production DB container settings. Latest
    release-gate blockers: `activationAudit:stale`, `activationPlan:stale`,
    `backupRestoreDrill:failed`.
  - 2026-05-02: closed as superseded by `V1CLOSEOUT-11`; production restore
    drill, rollback proof, Gate 4 approval, and non-dry-run production release
    gate are all fresh/pass for the V1 production-only target.

- [x] `V1GATE-01 release(docs+ops): refresh current target freshness and stage availability`
  - Scope: refresh public production/stage deploy smoke, production build-info,
    and deployed SHA ancestry before further final V1 gate claims.
  - 2026-05-01: Closed with production public smoke PASS on
    `662ce9b48fac6a48963a62f8d3bc4ac2f645cac6`, stage public smoke FAIL with
    `503` on API `/health`, API `/ready`, and web `/`, and a git ancestry check
    showing production is an ancestor of local `HEAD` but lacks
    `ca430aa5`, `1e20b6df`, and `ef37fca0`. Evidence:
    `docs/planning/v1gate-01-current-target-freshness-sync-task-2026-05-01.md`.

- [x] `V1SMOKE-01 test(local): restore go-live smoke after entitlement and ownership fixture drift`
  - Scope: recover the local umbrella go-live smoke path after verified local
    Prisma migration-history drift and stale API/web fixtures from approved V1
    entitlement and bot-authority changes.
  - 2026-05-01: Closed with non-destructive local migration-history recovery,
    `backtests.e2e` fixture alignment, `BotsManagement` payload expectation
    alignment, and generic failed-migration guidance in `goLiveSmoke.mjs`.
    Validation PASS: focused backtests e2e (`14/14`), focused web smoke pack
    (`17/17`), bot portfolio-history web test (`1/1`), and full
    `pnpm run test:go-live:smoke` (API `38/38`, web `17/17`). Evidence:
    `docs/planning/v1smoke-01-go-live-smoke-recovery-task-2026-05-01.md`.

- [x] `BHIST-01 feature(bot-history): add bot-scoped portfolio history with reset and wallet-capital markers`
  - Scope: extend selected-bot monitoring with one portfolio-history view from
    active bot start to now, reusing wallet-ledger LIVE cashflow events and
    PAPER reset checkpoint truth instead of creating a parallel accounting
    system.
  - 2026-05-01: Closed by adding
    `GET /dashboard/bots/:id/portfolio-history` and a selected-bot monitoring
    section with summary cards, chart, recent points, and capital-event
    markers. Validation PASS: API typecheck, web typecheck, focused API
    portfolio-history e2e (`2/2`), focused web portfolio-history test (`1/1`),
    API build, web build, repository guardrails.
    Evidence:
    `docs/planning/bhist-01-bot-portfolio-history-and-capital-events-task-2026-05-01.md`.

- [x] `V1DCA-01 fix(api-runtime-read): preserve DCA visibility after exchange-sync position replacement`
  - Scope: keep dashboard runtime `Positions` DCA truth aligned with the
    persisted trade ledger when exchange sync replaces a local open position
    row after a DCA fill.
  - 2026-05-01: Closed after protected production inspection showed DOGEUSDT
    had a real `BOT` `DCA` trade linked to a superseded `positionId`, while the
    current `EXCHANGE_SYNC` open row showed `dcaCount=0`. Runtime positions
    read now includes strictly scoped same-session DCA candidate trades and
    attaches them to the current open lifecycle only when
    bot/wallet/strategy/symbol/side/window match. Validation PASS: focused
    imported DCA visibility e2e, API typecheck, API build, repository
    guardrails. Post-deploy protected production verification PASS on deployed
    commit `9460317c7d9409062ff2ddd284a179a60ac89f1a`: current DOGEUSDT
    `Positions` row reports `dcaCount=1`, `tradesCount=2`, and `lastTradeAt`
    from the real `BOT/DCA` trade. Evidence:
    `docs/operations/v1dca-01-prod-verification-2026-05-01.md`.

- [x] `V1DCA-02 fix(api-runtime-read): preserve multi-level DCA visibility across repeated exchange-sync replacements`
  - Scope: keep runtime `Positions` DCA levels aligned with persisted trade
    truth when one imported managed position is represented by several
    consecutive exchange-sync replacement rows.
  - 2026-05-01: Closed after protected DOGEUSDT ledger inspection showed two
    real persisted `BOT/DCA` fills in the active session while the existing
    read-model window could still start at only the latest replacement row's
    `openedAt`. Runtime positions read now resolves same-session continuity
    from scoped persisted `OPEN/DCA/CLOSE` rows and counts supplemental DCA
    fills from the first same-identity open after the last exit. Validation
    PASS: focused imported DCA visibility e2e (`3/3`), lint, API typecheck,
    API build, repository guardrails. Task packet:
    `docs/planning/v1dca-02-multi-replacement-dca-count-task-2026-05-01.md`.

- [x] `V1DOGE-02 fix(api-runtime): harden DOGE-style LIVE close/reopen lifecycle state`
  - Scope: prevent stale same-symbol DCA/protection state from crossing a
    closed lifecycle into a new `LIVE` open row, preserve strategy identity on
    bot-managed close orders/trades, prove DCA-first close authority for
    `SL/TSL`, and emit operator-visible close/DCA exhaustion telemetry.
  - 2026-05-01: Closed locally after the runtime close path now passes
    `strategyId` into the execution orchestrator, the runtime positions read
    model uses same bot/wallet/symbol close boundaries to cut off stale DCA
    even for legacy close rows lacking strategy id, and supplemental DCA
    attachment remains strict by lifecycle identity. Validation PASS: focused
    runtime automation, position-management, imported DCA visibility, and
    futures market-data gateway packs. Task packet:
    `docs/planning/v1doge-02-runtime-close-reopen-hardening-task-2026-05-01.md`.
    Post-deploy protected production verification is still required.

- [x] `V1FINAL-00 release(planning): freeze final V1 test structure after DOGE runtime hardening`
  - Scope: audit active V1 queues, re-check production/stage public targets,
    compare deployed SHA with repository head, and publish one gate-ordered V1
    test structure.
  - 2026-05-01: Closed as planning. Production public smoke PASS, production
    build-info reports stale `c081f224`, stage public smoke FAIL with `503`,
    and the final V1 structure now blocks DOGE post-deploy verification until
    `577c45a8` or later is deployed. Evidence:
    `docs/operations/v1-final-test-structure-2026-05-01.md`.

- [x] `WLEDGER-07..09 web-wallet-preview: expose ledger-backed wallet preview from wallet list`
  - Scope: add a wallets table preview action and `/dashboard/wallets/:id/preview` surface for ledger-backed summary, equity timeline, and cashflow events.
  - 2026-04-30: Closed by wiring the shared `preview` table action to a new wallet preview route and rendering performance summary, contributed capital, bot PnL, wallet delta, unclassified adjustment, equity timeline, and cashflow events from the prepared wallet analytics APIs. The UI uses existing dashboard view states/table/card patterns, keeps partial ledger state visible, and formats crypto amounts safely as number plus symbol. Validation PASS: focused wallet web tests, web typecheck, web build, route-reachable i18n audit, repository guardrails.

- [x] `WLEDGER-06 api-read: expose wallet performance summary, timeline, and cashflow APIs`
  - Scope: add wallet analytics read endpoints with completeness state from persisted snapshots and cashflow events.
  - 2026-04-30: Closed by adding `performance-summary`, `equity-timeline`, and `cashflow-events` routes under dashboard wallets. The read model exposes current balance, contributed capital, bot PnL fields, fees/funding, unclassified adjustment, wallet delta percent, timeline points, cashflow markers, and completeness state. Validation PASS: focused wallet API e2e and API typecheck.

- [x] `WLEDGER-05 api-classify: classify initial and exchange-backed wallet cashflows`
  - Scope: classify initial contributed capital and deterministic exchange-history wallet movements into `WalletCashflowEvent` rows without using raw balance drift as bot PnL.
  - 2026-04-30: Closed by adding `walletCashflowClassifier.service.ts`, mapping initial allocated balance to `INITIAL_BALANCE`, mapping exchange deposits/withdrawals/transfers/fees/funding/realized-income/unknown movements to explicit cashflow sources, and idempotently upserting stable exchange event ids. Validation PASS: focused classifier, wallet, runtime tests and API typecheck.

- [x] `WLEDGER-04 api-ingest: persist initial and runtime LIVE wallet balance snapshots`
  - Scope: record exchange-backed `WalletBalanceSnapshot` rows during LIVE wallet creation and fresh runtime balance refreshes without changing runtime sizing semantics.
  - 2026-04-30: Closed by adding `walletLedger.service.ts`, recording the initial LIVE wallet snapshot inside wallet creation, and recording periodic snapshots when runtime capital fetches a fresh exchange balance outside the cache. Validation PASS: focused wallet/runtime tests, API typecheck.

- [x] `WLEDGER-03 exchange: expose Binance wallet cashflow history behind the exchange adapter boundary`
  - Scope: add one authenticated-read operation for wallet cashflow history, keep Binance as the only supported V1 exchange, normalize supported CCXT account-history reads, and keep unsupported exchanges fail-closed.
  - 2026-04-30: Closed by adding `WALLET_CASHFLOW_HISTORY` to the exchange execution/authenticated-read contracts, exposing `fetchSupportedExchangeWalletCashflowHistoryRaw(...)` through `exchangeAdapterBoundary`, and teaching `CcxtFuturesConnector` to normalize `fetchLedger`, `fetchDeposits`, `fetchWithdrawals`, and `fetchTransactions` rows into deterministic cashflow-history entries. Validation PASS: focused exchange tests and API typecheck.

- [x] `WLEDGER-02 db: add LIVE wallet balance snapshot and cashflow event persistence`
  - Scope: add persistent wallet balance snapshot and wallet cashflow event models without changing runtime sizing or dashboard read behavior yet.
  - 2026-04-30: Closed by adding Prisma enums/models for `WalletBalanceSnapshot` and `WalletCashflowEvent`, including user/wallet ownership, balance/allocation snapshot fields, cashflow direction/source, deterministic exchange-event uniqueness, optional lifecycle links to position/order/trade, and migration `20260430200000_add_live_wallet_cashflow_ledger`. Validation PASS: Prisma validate and API typecheck.

- [x] `WLEDGER-01 docs(contract): freeze LIVE wallet ledger data model and completeness semantics`
  - Scope: convert the wallet ledger target into an implementation-grade architecture contract before DB/API work begins.
  - 2026-04-30: Closed by publishing `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`, linking it from the wallet source-of-truth contract, and extending the exchange access ownership matrix so future wallet cashflow history reads stay behind the canonical exchange authenticated-read boundary. The contract freezes persistent model semantics, event classification, completeness states (`COMPLETE/PARTIAL/UNAVAILABLE`), read-model formulas, API response fields, dashboard behavior, and forbidden accounting shortcuts. Validation PASS: repository guardrails.

- [x] `WLEDGER-00 docs(product+architecture): freeze LIVE wallet cashflow ledger and equity timeline target`
  - Scope: document the target wallet performance model so future implementation can separate contributed user capital, bot PnL, deposits, withdrawals, transfers, fees/funding, and unclassified exchange adjustments.
  - 2026-04-30: Closed as a documentation/planning slice after operator discussion confirmed the intended model: if a user starts with `5 USDT`, bot earns `+1 USDT`, and the user later deposits `+10 USDT`, wallet delta should remain bot PnL `+1 USDT` over contributed capital `15 USDT`, not treat the deposit as bot profit. Architecture now records the target ledger/equity model, product docs and known limits are aligned, module docs identify wallet/exchange responsibilities, and the queued implementation plan is published in `docs/planning/live-wallet-cashflow-ledger-and-equity-timeline-plan-2026-04-30.md`. Validation PASS: repository guardrails.

- [x] `UXFIX-2026-04-30-B fix(web-dashboard): derive LIVE percent wallet delta from runtime equity and net PnL`
  - Scope: keep dashboard wallet KPI rendering in the web layer aligned with the existing runtime capital snapshot contract, without changing API/runtime behavior.
  - 2026-04-30: Closed after operator review showed the dashboard wallet panel rendered `Delta from start` as `-` for `LIVE` percent-allocation bots even when runtime capital and PnL fields were available. The web now keeps fixed-allocation and PAPER baseline behavior, but for `LIVE` percent allocation derives a session delta baseline from `runtime portfolio - selected net PnL`, so the row can show truthful `net PnL % | amount` whenever runtime equity is present. Validation PASS: focused `RuntimeSidebarSection` test, web typecheck, repository guardrails.

- [x] `UXFIX-2026-04-30-A fix(web-dashboard): align dashboard Positions row actions with shared table action styles`
  - Scope: keep dashboard runtime `Positions` table behavior unchanged while reusing the shared table action button contract for the row-level edit and close controls.
  - 2026-04-30: Closed by replacing ad-hoc `btn-outline` action classes in the dashboard open-positions presenter with shared `TableIconButtonAction` tones (`info` for edit, `danger` for close) while preserving existing icons, disabled state, labels, and callbacks. Validation PASS: focused runtime table presenter test, web typecheck, repository guardrails.

- [x] `V1SAFE-19 fix(api-runtime-read): keep imported LIVE fallback TTP visible when stale runtime state drifts below the armed threshold`
  - Scope: stop dashboard `Positions` from hiding valid `TTP` on imported managed `LIVE` rows when the canonical position is already above the first arm threshold, but stale runtime state still carries an older entry basis or non-positive trailing-take-profit trigger fields.
  - 2026-04-30: Closed after protected production verification on `XRPUSDT` proved the API itself returned `dynamicTtpStopLoss=null` despite `strategyAutomationContextResolved=true`, configured `TTP 5%/2%`, and `PnL%` above the arm threshold. Runtime position serialization now treats runtime `TTP` tracking as authoritative only when it yields a valid positive trigger, and runtime positions read now ignores stale runtime state for display when its canonical basis drifts from the current imported `EXCHANGE_SYNC` position. Validation PASS: focused runtime serialization unit pack, focused dynamic-stop operator-truth e2e, API typecheck, repository guardrails.

- [x] `V1SAFE-18 fix(web-history): unify opened/closed actor truth and remove redundant history subheading`
  - Scope: keep the backend trade-history contract unchanged, but stop leaving imported/open lifecycle rows blank in the actor column and remove the extra `History - operational trade log` caption above the table.
  - 2026-04-30: Closed by switching the trade-history actor column to one `Opened / Closed by` presentation: close rows still use canonical `closeInitiator`, while open/imported rows infer actor from existing `origin` without inventing a second backend contract. The redundant history subheading was removed at the same time. Validation PASS: focused `runtimeUiHelpers` test, web typecheck, route-reachable i18n audit, repository guardrails.

- [x] `V1SAFE-17 fix(web-history): distinguish imported OPEN lifecycle anchors from true position-lifetime closes`
  - Scope: keep the existing backend/runtime trade-history contract intact, but stop the dashboard `History` table from presenting imported `OPEN` anchor rows as if `Position lifetime` were the real close reason.
  - 2026-04-30: Closed after protected production payload inspection and code review confirmed the drift lived in the web reason badge, not in close attribution itself. The dashboard now treats `POSITION_LIFETIME + OPEN` as lifecycle-open context with dedicated copy, while true close-side `POSITION_LIFETIME` rows keep the existing timeout-close label. Validation PASS: focused `runtimeUiHelpers` test, web typecheck, route-reachable i18n audit, repository guardrails.

- [x] `V1SAFE-16 fix(api+web-strategy-edit): clarify active-bot strategy lock and surface direct bot-settings unblock path`
  - Scope: keep the canonical `strategy edit/delete blocked while linked bot isActive=true` guard intact, but stop operators from confusing runtime stop with configuration deactivation when they need to change urgent strategy fields such as lifetime.
  - 2026-04-30: Closed after confirming the current backend guard is intentionally keyed to `bot.isActive`, not to runtime session state. Strategy lock errors now include the blocking `botId + botName`, and the strategy edit page now explains that stopping runtime is not enough, surfaces the blocking bot identity, and links straight to that bot's settings so the operator can switch `Active` off before saving. Validation PASS: focused `strategies.e2e`, web typecheck, route-reachable i18n audit, repository guardrails.

- [x] `V1SAFE-15 fix(api-runtime-serialization): keep fallback dynamic TTP display monotonic from canonical trailing anchor`
  - Scope: stop the live dashboard `Positions` table from lowering displayed `TTP` during a pullback just because runtime serialization still derives fallback `TTP` from current favorable move instead of the already achieved trailing anchor.
  - 2026-04-30: Closed after confirming the drift at the serialization seam. When canonical `trailingTakeProfitHighPercent` is absent but canonical runtime anchor state already exists, runtime position serialization now derives fallback `TTP` from anchor-based `PnL fraction` instead of current favorable move, so the displayed protected floor no longer drops during a pullback. Focused validation PASS: `runtimePositionSerialization.service.test.ts`, `bots.dynamic-stop-operator-truth.e2e.test.ts`, API typecheck, repository guardrails.

- [x] `V1SAFE-14 fix(api+web+runtime+backtest-tsl): restore advanced TSL as negative-start plus positive-step semantics`
  - Scope: stop the advanced strategy editor and strategy validation pipeline from treating `TSL` like a profit-side trailing retrace capped by the activation threshold, because that blocks the intended operator contract `percent=-20 / arm=10` and desynchronizes `LIVE`, `PAPER`, and `BACKTEST`.
  - 2026-04-30: Closed after direct operator repro showed the repository had hardened the wrong `TSL` contract. Web validation and form sanitization now accept negative `TSL start` plus positive `step`, API strategy validation enforces the same rule, runtime strategy parsing no longer drops those levels as invalid, and runtime/backtest management-input builders now align on loss-side `trailingLoss` semantics instead of misclassifying the config as profit-side trailing-stop levels. Validation PASS: focused web `StrategyForm` + `StrategyForm.map`, focused API `strategies.e2e` + `runtimeStrategyConfigParser` + `runtimeBacktestParserParity`, focused runtime `positionManagement` + `runtimePositionAutomation`, API/web typecheck, repository guardrails.

- [x] `V1SAFE-13 feature(web-strategy-form): shared sortable threshold editor for TTP, TSL, and advanced DCA`
  - Scope: remove duplicated threshold-list UI in strategy create/edit, add reorder support for `TTP`, `TSL`, and advanced `DCA`, preserve backend payload compatibility by stripping local-only row ids before submit, and keep trailing-threshold validation behavior unchanged.
  - 2026-04-30: Closed after introducing one shared sortable editor with drag handle plus keyboard-accessible move up/down controls, wiring stable row `clientId` handling into strategy form state, and stripping those local ids from `close` and `additional.dcaLevels` before POST/PUT payload serialization. Validation PASS: focused `StrategyForm` + `StrategyForm.map` tests, web typecheck, route-reachable i18n audit, web build, repository guardrails.

- [x] `V1SAFE-12 fix(web-strategy-edit): sanitize legacy invalid trailing thresholds on strategy form load`
  - Scope: stop legacy invalid advanced `TTP/TSL` values already stored in strategy config from blocking all later edits in the strategy form, while keeping create/update validation fail-closed for newly submitted invalid thresholds.
  - 2026-04-30: Closed after the user reported that editing `TTP` still failed even with the bot disabled. Root cause: the current strategy payload still contained one legacy invalid `TSL` level (`arm=10`, `percent=-20`), so the new fail-closed validation correctly blocked submit before the user could save any unrelated `TTP` change. `dtoToForm` now sanitizes legacy invalid advanced trailing thresholds on form load, keeping only levels that satisfy the same protective-close contract already enforced by API/runtime validation. Validation PASS: focused `StrategyForm.map` tests, focused `StrategyForm` tests, web typecheck, repository guardrails.
  - 2026-04-30 follow-up: extended the same slice after the first sanitize-on-load fix still left one edit trap. The web form now also starts from a valid default `TSL` threshold and strips any legacy-invalid advanced `TTP/TSL` thresholds from the submit payload itself before save, so stale browser/form state can no longer keep blocking unrelated `TTP` edits. Validation PASS: focused `StrategyForm.map` tests, focused `StrategyForm` tests, web typecheck, repository guardrails.

- [x] `V1SAFE-11 fix(api+web-strategy-close): fail closed on invalid advanced trailing thresholds`
  - Scope: stop strategy configuration, runtime parsing, and operator surfaces from accepting `TTP/TSL` thresholds whose trailing retrace exceeds the activation trigger or arm, because those values can produce non-protective or impossible exit percentages on `LIVE`, `PAPER`, and `BACKTEST`.
  - 2026-04-30: Closed after protected production verification on `XRPUSDT` exposed that the absurd `TSL -292.81%` was not a table-formatting glitch but real backend truth derived from an invalid advanced close configuration (`TSL arm=10`, `trail=-20`). The repository now rejects invalid advanced trailing thresholds at strategy create/update/import, blocks them in the strategy form, filters them fail-closed in runtime config parsing and runtime automation even if legacy data still exists, and stops serializing trailing-trigger percent from negative runtime state. Validation PASS: focused API parser + strategies e2e, focused web `StrategyForm` pack, API/web typecheck, route-reachable i18n audit, repository guardrails.

- [x] `V1HIST-10 fix(api-ledger): persist imported OPEN lifecycle anchors and replace them when canonical exchange trades arrive`
  - Scope: stop imported `LIVE` positions from staying ledger-empty under `positions` metadata after dashboard history is already operator-correct, while still allowing later canonical exchange trade reconstruction to replace the fallback anchor instead of duplicating lifecycle rows.
  - 2026-04-30: Closed after the post-deploy production/browser audit showed that imported `BNB/XRP` lifecycles were finally visible in dashboard `History`, but canonical open-position metadata still reported `tradesCount=0` and null trade timestamps because only runtime-only anchors existed. `importedPositionHistoryHydrator` now persists one local `EXCHANGE_SYNC OPEN` anchor trade from canonical `Position` truth whenever imported trade history is not yet derivable, deletes that synthetic anchor automatically when later exchange trade reconstruction succeeds, and runtime history reclassifies persisted imported anchors as `POSITION_LIFETIME` rather than `SIGNAL_ENTRY`. Validation PASS: focused imported-history hydrator suite, focused runtime history parity e2e, API typecheck, repository guardrails.

- [x] `V1HIST-09 fix(api-runtime): restore imported OPEN visibility in dashboard operational history`
  - Scope: keep the live dashboard `History` tab truthful for imported `BOT_MANAGED EXCHANGE_SYNC` positions even when canonical exchange trade hydration has not yet produced any local `Trade` rows for the current lifecycle.
  - 2026-04-30: Closed after fresh protected production/browser verification proved `Positions` and `Orders` were now truthful while `History` still stayed empty for fresh imported `BNB/XRP/DOGE` lifecycles because the runtime trade feed exposed only persisted trade rows. `runtimeSessionTradesRead` now emits one operational `OPEN` anchor row from canonical `Position` truth whenever a scoped lifecycle has no local trade rows yet, reusing existing `POSITION_LIFETIME` semantics instead of inventing fake fills. Focused validation PASS: `bots.runtime-history-parity.e2e.test.ts`, API typecheck, repository guardrails.

- [x] `V1HIST-08 fix(api-exchange): resolve imported trade-history reads through canonical exchange market symbols`
  - Scope: stop imported `LIVE` history hydration from silently returning empty trade windows just because reconciliation asks the exchange boundary for `BNBUSDT/XRPUSDT/...` while the authenticated CCXT connector expects the unified market symbol like `BNB/USDT:USDT`.
  - 2026-04-30: Closed after protected production investigation of `BNB`, `DOGE`, and `XRP` showed the runtime payload still carried `tradesCount=0` and `firstTradeAt=null` for fresh imported open positions even though the surface-truth/UI slice was already green. `CcxtFuturesConnector` now resolves app-normalized symbol ids to canonical CCXT market symbols before `fetchTicker`, `fetchOrder`, `fetchMyTrades`, `fetchOpenOrders`, and trading-rules reads, and a focused connector regression locks `XRPUSDT -> XRP/USDT:USDT` for trade-history fetches. Validation PASS: focused connector/boundary/history/reconciliation API pack, API typecheck, repository guardrails.

- [x] `V1SURF-09 fix(api+web-runtime): restore imported position/trade parity and non-sleeping dashboard truth`
  - Scope: keep `Positions`, `Orders`, and dashboard trade history truthful for imported/adopted `LIVE` rows by removing trade-ownership drift from runtime reads, hydrating imported exchange trade history on both create and adopt/update reconciliation paths, preferring backend PnL truth over stale client-side recomputation, and preventing the dashboard refresh loop from sleeping behind a nominally connected SSE stream.
  - 2026-04-30: Closed after fresh operator notes on `BNB`, `DOGE`, and `XRP` exposed one combined surface-truth slice rather than a single isolated bug. Runtime position/trade reads now fetch trades for already visible positions by canonical `positionId` instead of re-filtering them through older bot-scoped trade ownership, adopted imported `EXCHANGE_SYNC` rows now hydrate exchange trade history the same way freshly created synced rows already did, dashboard runtime derivations now prefer backend `markPrice/unrealizedPnl/unrealizedPnlPercent` truth over stale stream recomputation, and periodic dashboard polling no longer stops just because SSE looks connected. Validation PASS: focused imported-visibility/history/reconciliation API pack, focused dashboard derivation/widget web pack, API/web typecheck, repository guardrails.

- [x] `V1TAKE-10 feat(bot-settings): move LIVE external-position management authority from wallet to bot`
  - Scope: add one canonical bot-level management flag for imported `LIVE` exchange positions, backfill existing bots from linked wallet truth, move the operator control into bot settings, and remove the editable wallet-level toggle so imported-position management has one source of truth only.
  - 2026-04-30: Closed after the user approved the architecture shift. Added `Bot.manageExternalPositions` with SQL backfill from linked wallets, rewired `runtimeExternalPositionOwner` and related takeover surfaces to derive management truth from the bot-level flag, removed the editable wallet takeover toggle from wallet create/edit flows, and added the single checkbox to bot settings for `LIVE` wallets only. Validation PASS: focused runtime ownership/takeover API pack, focused bot+wallet web form pack, API/web typecheck, repository guardrails.

- [x] `V1IMPORT-01 fix(api-reconcile): let owned LIVE import replace or adopt botless wallet-owned local blockers`
  - Scope: stop imported `LIVE` positions from disappearing from bot runtime surfaces when an older open local `BOT/USER` row for the same wallet + symbol still exists without `botId`, and ensure adopted local rows become fully exchange-synced instead of staying half-local.
  - 2026-04-30: Closed after protected production verification on `BNBUSDT` proved the exchange snapshot was fresh while runtime positions still missed the symbol because a stale wallet-owned botless blocker row prevented canonical import. `livePositionReconciliation` now includes wallet-owned botless local managed rows in the same owner-candidate pool it already used for exact local reuse, so existing lifecycle-replacement logic can close stale blockers deterministically before import or adopt a fresh local row into canonical `EXCHANGE_SYNC` truth. Reused local rows now also receive canonical `externalId`, preventing half-synced adoption drift on later iterations. Validation PASS: focused `livePositionReconciliation.service.test.ts`, API typecheck, repository guardrails.

- [x] `V1OWN-01 fix(api-runtime): hydrate imported owned LIVE positions into canonical runtime ownership`
  - Scope: stop runtime automation and bot-scope open-position counting from keying only on persisted `position.botId` when a `BOT_MANAGED EXCHANGE_SYNC` row is canonically owned through the external-position ownership contract.
  - 2026-04-30: Closed by reusing the canonical ownership classifier in `runtimePositionAutomation` default imported-position lookup and in `runtimeSignalLoopDefaults` bot-scope open-position counting. Imported owned rows can now execute automation with effective bot context even when the canonical row still has `botId=null`, and signal-loop bot-scope counts no longer ignore those rows. Closure evidence: `docs/operations/v1own-imported-live-runtime-ownership-closure-2026-04-30.md`.

- [x] `V1AUTO-01 fix(api-runtime): rebase stale imported runtime state to canonical exchange-synced basis`
  - Scope: keep imported `LIVE` automation fail-closed when the same `EXCHANGE_SYNC` row is updated in place by exchange truth but the persisted runtime state still reflects an older basis or older `currentAdds`.
  - 2026-04-30: Closed with a focused runtime-state rebase seam in `runtimePositionAutomation`. Imported `EXCHANGE_SYNC` positions now rebase stale persisted state to canonical exchange-synced `quantity + entryPrice` truth before management evaluation, and the regression pack proves stale `currentAdds` can no longer suppress valid DCA on the new canonical basis. Closure evidence: `docs/operations/v1auto-runtime-state-rebase-closure-2026-04-30.md`.

- [x] `V1AUTO-02 fix(api-reconcile): hydrate imported LIVE automation prospectively from fresh exchange-sync truth`
  - Scope: stop freshly adopted imported `LIVE` positions from remaining dormant until a later ticker-path event arrives, while still reusing the one canonical runtime automation engine.
  - 2026-04-30: Closed by wiring `livePositionReconciliation` to call the existing `runtimePositionAutomationService.handleTickerEvent(...)` path whenever it creates or updates a canonically owned imported `BOT_MANAGED` row with `continuityState=CONFIRMED` and finite positive `markPrice`. This stays aligned with the approved `LIVE` protection-state contract as prospective hydration from the adoption point, not a second imported-position execution path. Closure evidence: `docs/operations/v1auto-reconciliation-automation-hydration-closure-2026-04-30.md`.

- [x] `V1AUTO-03 fix(api-read): restore imported DCA visibility in runtime positions payload`
  - Scope: stop imported managed positions from showing `DCA=0` in operator runtime tables just because the original imported `OPEN` trade is not yet present in local history.
  - 2026-04-30: Closed by extending runtime position trade rows with canonical `lifecycleAction` and deriving `dcaCount` from explicit `DCA` trades plus runtime `currentAdds` before the old `entryLegs - 1` inference. This keeps imported managed position `DCA` truth faithful without inventing missing historical `OPEN` trades. Closure evidence: `docs/operations/v1auto-imported-dca-visibility-closure-2026-04-30.md`.

- [x] `V1ROE-00 analysis(queue): publish LIVE PnL/ROE semantics and imported automation parity packet`
  - Scope: freeze the newly confirmed production drift where operator-visible `PnL %` diverges from Binance Futures semantics while imported/reopened `LIVE` automation also appears stale enough to miss `DCA/TTP` evaluation.
  - 2026-04-30: Closed as an analysis-only slice. Published `docs/planning/v1roe-live-pnl-roe-and-runtime-automation-parity-plan-2026-04-30.md` plus `docs/planning/v1roe-00-analysis-task-2026-04-30.md` after protected production API/UI verification and code review of runtime percent + DCA semantics. Current conclusion: there is one ordinary runtime bug to fix (imported/reopened `LIVE` automation continuity) and one architecture/product decision to make explicitly (`leveraged move` versus exchange `ROE` semantics for the primary percent truth).

- [x] `V1ROE-01 fix(api+web+runtime): align shared lifecycle PnL fraction to canonical margin basis`
  - Scope: keep one shared lifecycle engine while replacing the `LIVE` modeled-margin shortcut with canonical exchange-synced `marginUsed` truth wherever available, and propagate the same basis through runtime automation, read models, and operator surfaces.
  - 2026-04-30: Closed as the first implementation slice of `V1ROE-A`. Added persisted `Position.marginUsed`, normalized exchange margin fields into canonical position truth, introduced shared `positionPnlSemantics`, updated runtime automation to evaluate one canonical `currentPnlFraction`, and aligned runtime/dashboard monitoring surfaces so operator-visible `PnL %` and `DCA/TTP/TSL` decisions use the same margin basis by mode (`LIVE` exchange-synced when available, `PAPER/BACKTEST` modeled). Focused validation PASS: API runtime/read/reconcile pack, focused web runtime derivation pack, API/web typecheck, and repository guardrails.

- [x] `V1ROE-02 test(api-contract): lock runtime positions margin-basis and unrealizedPnlPercent contract`
  - Scope: add focused end-to-end coverage proving the `runtime positions` API cannot silently drop canonical `marginUsed` and `unrealizedPnlPercent` fields after local code has already aligned `LIVE` percent semantics to exchange-synced margin truth.
  - 2026-04-30: Closed with `apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts`. The new proof locks one explicit `LIVE` runtime position where persisted `marginUsed` differs from modeled margin and asserts the endpoint returns the canonical `marginUsed`, `unrealizedPnl`, and `unrealizedPnlPercent` values from that persisted basis. Validation PASS: focused API e2e and `pnpm run quality:guardrails`.

- [x] `V1ROE-03 fix(api-normalization): prefer isolated-wallet margin truth for isolated LIVE futures positions`
  - Scope: correct exchange snapshot normalization so imported `LIVE` isolated futures positions prefer real isolated-wallet margin truth over initial-margin fields when those differ, keeping operator `%` and lifecycle decisions on the same canonical basis.
  - 2026-04-30: Closed with a targeted fix in `positions.exchangeSnapshotNormalization.ts` and focused coverage in `positions.exchangeSnapshotNormalization.test.ts`. `ISOLATED` futures positions now prefer `isolatedWallet` margin truth, while non-isolated positions keep initial-margin precedence. Validation PASS: focused normalization pack, `bots.runtime-pnl-parity.e2e`, and `pnpm run quality:guardrails`.

- [x] `V1REOPEN-00 analysis(queue): publish same-symbol LIVE close/reopen hardening packet`
  - Scope: freeze the newly reported `LIVE close -> reopen same symbol` regression into one exact execution packet covering stale lifecycle visibility, wrong `PnL%` basis, and stale `TTP` continuity risk.
  - 2026-04-29: Closed as an analysis-only slice. Published `docs/planning/v1reopen-live-close-reopen-pnl-ttp-hardening-plan-2026-04-29.md` plus `docs/planning/v1reopen-00-analysis-task-2026-04-29.md` after reviewing reconciliation, runtime protection-state, and dashboard derivation seams. Current strongest hypothesis: the bug is stale lifecycle continuity across same-symbol `LIVE` close/reopen, not a simple UI percent formula drift.

- [x] `V1REOPEN-01 audit(regression-matrix): freeze the exact same-symbol close/reopen failure matrix`
  - Scope: reproduce and lock the reported `DOGEUSDT` class across same-side and opposite-side reentry, including wrong PnL sign/basis and stale protection carryover.
  - 2026-04-29: Closed by freezing the matrix directly in focused reconciliation coverage. The repository now has explicit proofs for stale opposite-side overlap, same-side lifecycle replacement, and stale runtime-state cleanup on lifecycle retirement.

- [x] `V1REOPEN-02 test(api-red): lock stale lifecycle visibility, side truth, and PnL basis on LIVE reopen`
  - Scope: add failing coverage proving a new same-symbol `LIVE` position cannot inherit the old lifecycle row, side, entry basis, or operator-visible PnL sign.
  - 2026-04-29: Closed with focused tests in `livePositionReconciliation.service.test.ts` for opposite-side reopen and same-side reopen with newer exchange timestamp.

- [x] `V1REOPEN-03 fix(api-reconcile): retire superseded same-symbol lifecycle rows deterministically`
  - Scope: harden reconciliation so exchange truth for a new same-symbol lifecycle closes or supersedes the stale old row instead of letting both truths overlap through the grace window.
  - 2026-04-29: Closed by immediately retiring same-symbol conflicting rows and by treating newer exchange open timestamps as lifecycle discontinuity for same-side reopen.

- [x] `V1REOPEN-04 fix(api-runtime-state): clear stale runtime protection state on close or lifecycle replacement`
  - Scope: prevent `TTP`/`TSL`/DCA runtime state from bleeding into the reopened lifecycle after old-position retirement.
  - 2026-04-29: Closed by deleting persisted runtime position state whenever reconciliation closes or supersedes a lifecycle.

- [x] `V1REOPEN-05 test(api-runtime-red): lock TTP continuity and loss-side-only DCA behavior on reopened LIVE positions`
  - Scope: prove the reopened lifecycle arms `TTP` correctly when remaining DCA thresholds are loss-side only and no stale state survives from the prior lifecycle.
  - 2026-04-29 audit note: extend this proof to cover the operator-visible path where row-level dynamic `TTP` exists after reopen but bot-level advanced-close gating may still hide the column.
  - 2026-04-29: Closed by adding focused runtime automation coverage for reopened imported `LIVE` continuity. The proof locks fresh `currentAdds=0`, rejects stale prior lifecycle state bleed-through, and still allows `TTP` close when all remaining `DCA` thresholds are loss-side only.

- [x] `V1REOPEN-06 fix(api+web-truth): align final operator truth for reopened LIVE positions`
  - Scope: keep operator surfaces faithful to the repaired backend truth and only add a minimal read-model adjustment if focused proof shows it is still needed.
  - 2026-04-29 audit note: strongest remaining code-level candidate is `showDynamicStopColumns` gating that depends on bot-level topology rather than actual reopened row truth.
  - 2026-04-29: Closed by OR-ing backend `showDynamicStopColumns` with actual open-row dynamic-stop truth, reusing one shared web visibility helper across dashboard and monitoring surfaces, and repairing missing bot-managed `TTP` fallback/sticky continuity inside runtime serialization. Evidence: focused API dynamic-stop unit/e2e pack, focused web runtime table pack, API/web typecheck, `pnpm run quality:guardrails`.

- [x] `V1REOPEN-07 qa(closure): run focused close/reopen truth pack and publish evidence`
  - Scope: rerun the focused reconciliation/runtime/operator pack, typechecks, and repository guardrails; then publish closure evidence.
  - 2026-04-29: Closed with `docs/operations/v1reopen-live-close-reopen-truth-closure-2026-04-29.md`. Focused validation PASS: API runtime/reconcile/orders pack, focused web operator pack, API/web typecheck, and repository guardrails.

- [x] `V1HIST-00 analysis(queue): publish imported exchange lifecycle history packet and mixed-origin live matrix`
  - Scope: freeze the newly reported imported-position history gap into one exact execution packet covering imported opening-history truth, external-close history parity, and operator-visible history timestamps, plus an explicit mixed-origin `exchange/app` live verification matrix.
  - 2026-04-29: Closed as an analysis-only slice. Published `docs/planning/v1hist-imported-exchange-lifecycle-history-plan-2026-04-29.md`, `docs/planning/v1hist-00-analysis-task-2026-04-29.md`, and `docs/operations/v1live-mixed-origin-verification-matrix-2026-04-29.md` after reviewing imported `EXCHANGE_SYNC` reconciliation, exchange-event close truth, runtime history reads, and dashboard history presentation. Current strongest conclusion: imported position lifecycle history is still snapshot-strong for active rows but ledger-weak for history truth.

- [x] `V1HIST-01 audit(api+history): freeze the imported open/close history failure matrix`
  - Scope: reproduce and lock the missing-history class across imported open, imported external close, and mixed-origin lifecycle continuity.
  - 2026-04-29: Closed by freezing the full imported lifecycle matrix in `docs/planning/v1hist-imported-exchange-lifecycle-history-plan-2026-04-29.md` and `docs/operations/v1live-mixed-origin-verification-matrix-2026-04-29.md`.

- [x] `V1HIST-02 docs(contract): freeze imported lifecycle history and history-table timestamp truth`
  - Scope: document the canonical rule for imported opening history, imported external close history, and explicit `openedAt` plus `closedAt` operator truth.
  - 2026-04-29: Closed by the canonical `V1HIST-A` packet and closure record. Imported lifecycle history is now explicitly constrained to canonical `Position/Trade` truth with deterministic exchange-trade hydration only.

- [x] `V1HIST-03 test(api-red): lock imported opening-history and external-close history parity`
  - Scope: add failing coverage proving imported positions cannot remain history-incomplete and externally closed imported positions cannot disappear without canonical historical continuity.
  - 2026-04-29: Closed with focused API coverage across `exchangeAdapterBoundary`, imported lifecycle hydrator, runtime history parity, and reconciler hydration trigger flow. Imported opening history is now proven to depend on canonical exchange trades, and externally closed imported positions are locked as still visible in runtime `historyItems`.

- [x] `V1HIST-04 fix(api-exchange+reconcile): hydrate imported position opening history through approved lifecycle entities`
  - Scope: extend the approved exchange/reconciliation path so imported opening truth persists through canonical lifecycle entities instead of active-row-only snapshot state.
  - 2026-04-29: Closed with the first backend hydration slice. The authenticated exchange boundary now exposes trade-history reads, imported lifecycle hydrator reconstructs current open lifecycle from canonical fills when deterministic, persists imported `OPEN` / `DCA` / partial `CLOSE` trades, and updates `position.openedAt` from the first canonical fill.

- [x] `V1HIST-05 fix(api-ledger+history): persist external close history for imported managed positions`
  - Scope: ensure externally closed imported positions record truthful close history, attribution, and lifecycle continuity instead of only leaving active positions.
  - 2026-04-29: Closed by extending imported lifecycle hydration to externally closed reconciliation paths. Before Soar finalizes an imported `EXCHANGE_SYNC` position as externally closed, it now fetches canonical exchange trade history for the lifecycle window, persists any missing imported `CLOSE` trades with `USER_EXCHANGE` attribution when deterministic, and updates `closedAt` to the last canonical close fill timestamp.

- [x] `V1HIST-06 fix(api+web-read): expose truthful open/close timestamps in operator history surfaces`
  - Scope: keep history read-model and dashboard history UI faithful to lifecycle truth by showing distinct open and close anchors where applicable.
  - 2026-04-29: Closed as the first operator-truth implementation slice. History positions on the dashboard now show separate `openedAt` and `closedAt` columns, and focused API parity proof in `bots.runtime-history-parity.e2e.test.ts` locks that a closed imported `EXCHANGE_SYNC BOT_MANAGED` position remains visible in `historyItems` with both timestamps preserved.

- [x] `V1HIST-07 qa(closure): run focused history-truth pack and publish evidence`
  - Scope: rerun the focused imported-history pack, typechecks, and repository guardrails; then publish closure evidence.
  - 2026-04-29: Closed with `docs/operations/v1hist-imported-exchange-lifecycle-history-closure-2026-04-29.md`. Focused validation PASS: imported hydrator unit pack, live reconciliation pack, exchange boundary contract pack, runtime history parity e2e, API typecheck, web typecheck, and repository guardrails.

- [x] `V1EXCEL-00 planning(queue): publish full V1 excellence and production-confidence packet`
  - 2026-04-29: Closed as a planning-only slice after reviewing the repo's own completion and activation contracts against the newly closed `V1TRUTH-A` wave. Published `docs/planning/v1excel-full-v1-excellence-and-confidence-plan-2026-04-29.md` plus `docs/planning/v1excel-00-planning-task-2026-04-29.md`, freezing the remaining non-deferred gap as a confidence/evidence wave rather than a code-architecture wave.

- [x] `V1EXCEL-01 audit(v1-gap-map): freeze the exact remaining gap map against DoD, integration, deployment, and activation contracts`
  - Scope: produce one canonical map of what is already closed in code, what is still missing only as fresh evidence, what remains locally blocked by reproducibility debt, and what is explicitly deferred beyond `V1`.
  - 2026-04-29: Closed by publishing `docs/operations/v1excel-gap-map-audit-2026-04-29.md` plus `docs/planning/v1excel-01-gap-map-audit-task-2026-04-29.md`. The audit confirms there is no remaining core implementation gap in `V1`; the remaining blockers are confidence and evidence only.

- [x] `V1EXCEL-02 qa(local-infra): restore fully reproducible local confidence path or classify the exact external blocker`
  - Scope: resolve or strictly classify the remaining `test:go-live:smoke` local blocker around migration-history debt and reusable infra so another engineer can reproduce the local confidence path honestly.
  - 2026-04-29: Closed by non-destructively repairing drifted local Prisma migration history with `migrate resolve`, updating the local-development and smoke-wrapper guidance, and rerunning the umbrella local pack successfully. Fresh evidence: `pnpm run test:go-live:smoke` => PASS with `35/35` API and `17/17` web checks. Canonical closure: `docs/operations/v1excel-local-confidence-path-closure-2026-04-29.md`.

Historical carryover snapshot, superseded by active `READY` and `BLOCKED`
entries above:

- Historical `V1EXCEL-03 qa(manual-matrix): execute the full critical manual UI/API/operator matrix`
  - Scope: run and record the real critical `PAPER` and `LIVE` operator scenarios, including manual order/close, pending external order truth, DCA/close protection behavior, and restart/recovery truth.
  - 2026-04-29 status: IN_PROGRESS. The full matrix remains incomplete, but authenticated Soar production operator access is now available and the first `PAPER` API/operator pass has been executed. Evidence: `docs/operations/v1excel-paper-operator-verification-2026-04-29.md`. That evidence now confirms truthful same-side add behavior for an existing managed `PAPER` position, truthful post-deploy manual close through the protected production API, and aligned authenticated dashboard UI truth for the resulting paper-bot state and history. The remaining incomplete scope is browser-side action proof if required plus the `LIVE` exchange-authority, mixed-origin, and restart/recovery scenarios.

- Historical `V1EXCEL-04 ops(stage-refresh): rerun the latest authenticated stage release gate and smoke on the current candidate`
  - Scope: refresh stage rehearsal and smoke artifacts against the newest repository candidate instead of inheriting older activation evidence.
  - 2026-04-29 status: BLOCKED. Public stage smoke is green, and dry-run rehearsal artifacts were regenerated, but authenticated stage OPS/private-route evidence remains blocked by missing credentials. Canonical status: `docs/operations/v1excel-stage-refresh-2026-04-29.md`.

- Historical `V1EXCEL-05 ops(prod-refresh): rerun fresh production release-gate evidence families on the current candidate`
  - Scope: refresh prod release gate, post-deploy smoke, rollback proof, restore-drill proof, and related candidate-day artifacts.
  - 2026-04-29 status: BLOCKED. Public prod smoke is green, but the prod release-gate dry-run still reports stale evidence families and protected OPS routes remain auth-gated from this session. Canonical status: `docs/operations/v1excel-prod-refresh-2026-04-29.md`.
  - 2026-04-29 post-redeploy check: public prod smoke passed again on candidate `4514894127ad07cbe95415043658e10b8c0cf75d`; protected runtime and rollback probes still fail at the same `401` auth boundary. Follow-up note: `docs/operations/v1excel-prod-post-deploy-check-2026-04-29.md`.

- Historical `V1EXCEL-06 ops(runtime-observability): verify active LIVE worker/runtime diagnostics under current production truth`
  - Scope: confirm worker health, runtime freshness, event visibility, and operator diagnostics remain healthy under the current hardened `LIVE` candidate.
  - 2026-04-29 status: BLOCKED. Stage and prod runtime observability probes both hit protected-route `401` boundaries without OPS auth; this proves the endpoint boundary but not current worker/runtime health. Canonical status: `docs/operations/v1excel-runtime-observability-2026-04-29.md`.
  - 2026-05-01 production refresh: production runtime observability is green with authenticated evidence. Runtime freshness PASS, rollback guard PASS with `shouldRollback=false`, no reasons, no alerts, and `runningCount=4`. Stage runtime observability remains open. Task packet: `docs/planning/v1excel-06-prod-runtime-observability-task-2026-05-01.md`.

- [x] `V1EXCEL-UNBLOCK ops(runbook): execute the final authenticated unblock sequence for GO readiness`
  - Scope: use the prepared operator runbook to clear the remaining external blockers `V1EXCEL-03..06` once Soar operator auth, OPS/private-route auth, and exchange authority are available.
  - 2026-04-29: Ready as an execution handoff only. Canonical runbook: `docs/operations/v1excel-final-unblock-runbook-2026-04-29.md`.
  - 2026-05-03 sync: closed as superseded for current V1 planning. The final
    authenticated unblock sequence was replaced by the later
    `V1CLOSEOUT-11` production-only `GO` path, with stage explicitly deferred
    to V2 by operator decision.

- [x] `V1EXCEL-07 release(go-no-go): rebuild RC status/sign-off/checklist and publish final V1 excellence decision`
  - Scope: produce one final operator-facing `GO / NO-GO` answer for the current candidate with exact residual risks or blockers.
  - 2026-04-29: Closed with an explicit `NO-GO` decision for candidate `51acd9c445227a3ca8cc8b781564d14b55fda43f`. The repository no longer shows a known implementation or architecture gap for `V1`, but fresh manual authenticated operator evidence and protected stage/prod OPS evidence remain missing. Canonical decision: `docs/operations/v1excel-final-go-no-go-2026-04-29.md`.

- [x] `V1EXCEL-08 docs(closure): sync canonical queue/context and freeze the final post-V1 handoff`
  - Scope: if `GO`, close the wave and point future work to `BOTMULTI-A`; if `NO-GO`, open only the smallest missing fix packet(s).
  - 2026-04-29: Closed as a docs/context sync slice. Canonical truth is now frozen: `V1EXCEL-02` is green locally, `V1EXCEL-03..06` remain external-evidence blockers, and the latest candidate stays `NO-GO` until authenticated manual and OPS evidence is rerun.

- [x] `DOCSYNC-2026-05-01-V1EXCEL-HISTORICAL-CARRYOVER docs(queue): mark older V1EXCEL carryover checkboxes non-active`
  - Scope: prevent stale 2026-04-29 V1EXCEL carryover entries from appearing
    as separately executable unchecked work after newer 2026-05-01 target
    evidence superseded them.
  - 2026-05-01: Closed by converting the duplicate historical
    `V1EXCEL-03..06` checklist rows in this older section into non-checkbox
    historical notes. Active execution truth remains in current `READY` and
    `BLOCKED` sections. Evidence:
    `docs/planning/docsync-2026-05-01-v1excel-historical-carryover-task.md`.

- [x] `V1TRUTH-00 planning(queue): publish final LIVE exchange-truth packet`
  - 2026-04-29: Closed as the next planning-only slice after the new real-account notes review. Published `docs/planning/v1truth-live-exchange-truth-hardening-plan-2026-04-29.md` plus `docs/planning/v1truth-00-planning-task-2026-04-29.md`, freezing one final `V1` hardening wave around truthful `LIVE` money paths: leverage-aware futures manual-order sizing, exchange-backed manual close, pending external order versus position truth, and the final explicit `DCA/TTP/TSL` rule. The user-approved staged direction is now canonical: keep the singular bot architecture through this wave and defer multi-strategy-per-bot to post-`V1`.

- [x] `V1TRUTH-01 audit(api+web+exchange): freeze the exact remaining money-path failure matrix`
  - Scope: reproduce and lock the reported real-account scenarios for external DCA pending-order truth, manual close failure, futures manual-order leverage drift, and operator-visible order/position separation.
  - 2026-04-29: Closed by the final `V1TRUTH-A` closure packet, which freezes the exact failure matrix and its resolution status in `docs/operations/v1truth-live-exchange-truth-closure-2026-04-29.md`.

- [x] `V1TRUTH-02 fix(web+api-contract): align futures manual-order sizing and free-funds validation`
  - Scope: unify leverage-aware margin validation between manual-order context and dashboard controller while preserving exchange min-notional truth.
  - 2026-04-29 progress: web-side manual-order controller parity is now in place. `FUTURES` budget/max-size/free-funds checks no longer treat wallet free capital as if it had to cover full notional, while `SPOT` remains unchanged. Focused web validation PASS: `useManualOrderController.test.tsx`, `HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter web run typecheck`.

- [x] `V1TRUTH-03 test(api-red): lock exchange-backed manual close parity`
  - Scope: add failing proof for one canonical app-driven `LIVE` close authority with honest degradation behavior.
  - 2026-04-29: Closed by locking focused regressions at the runtime close command, orchestration, and exchange-boundary seams. The test pack now proves that `LIVE` manual close keeps one approved exchange-backed authority path, including explicit `reduceOnly` propagation and `PAPER`-specific fail-closed behavior when no canonical close price exists.

- [x] `V1TRUTH-04 fix(api-exchange+runtime): make manual close fail-closed and exchange-truthful`
  - Scope: route manual close through the approved exchange boundary and keep runtime diagnostics explicit instead of acting as hidden close authority.
  - 2026-04-29: Closed by extending the canonical `openOrder`/exchange boundary flow with optional `reduceOnly` for `LIVE` close intent, exempting that reduce-only close path from the exposure-open pretrade blocker, and degrading `LIVE` runtime close to persisted `entryPrice` only as reference context when lifecycle mark price is unavailable. Focused API validation PASS: `runtimeSessionPositionCommand.service.test.ts`, `executionOrchestrator.service.test.ts`, `exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1TRUTH-05 test(api+web-red): lock pending external order versus position truth`
  - Scope: prove that unfilled external/manual exchange orders remain in `orders` only and do not inflate open position size, margin, or automation state.
  - 2026-04-29: Closed by adding a focused `orders-positions.e2e` reproduction for one open `LIVE` position plus one pending external/manual exchange `DCA` order on the same symbol. The canonical session read and dashboard aggregate both stay truthful: `openCount=1`, `openOrdersCount=1`, unchanged position quantity/notional, and the external order remains only in `openOrders` until fill.

- [x] `V1TRUTH-06 fix(api+reads+web): harden order/position merge and operator presentation`
  - Scope: keep reconciliation, read models, and dashboard surfaces aligned to exchange-confirmed fill truth.
  - 2026-04-29: Closed by fixing the strongest confirmed reconcile drift above the green pending-order baseline. When exchange snapshot truth arrives for a bot-owned `LIVE` position and the repository already has a local open `BOT`/`USER` managed row for the same owner plus `symbol/side`, reconciliation now updates that row to exchange truth instead of creating a duplicate `EXCHANGE_SYNC` open position. Focused validation PASS: `livePositionReconciliation.service.test.ts`, `orders-positions.e2e.test.ts`, focused manual-close/runtime/exchange packs, API typecheck, guardrails.

- [x] `V1TRUTH-07 docs+test(runtime-red): freeze and prove the final DCA/TTP/TSL rule`
  - Scope: document and prove when `TTP` must and must not consider DCA thresholds.
  - 2026-04-29: Closed by freezing the exact rule in the protection architecture refs and by adding focused shared-kernel plus runtime regressions for profit-side versus loss-side-only pending DCA. Canonical task record: `docs/planning/v1truth-07-08-protection-rule-task-2026-04-29.md`.

- [x] `V1TRUTH-08 fix(api-runtime+web): align protection execution and operator truth`
  - Scope: close any remaining implementation drift versus the frozen protection contract.
  - 2026-04-29: Closed by updating the shared lifecycle kernel so `TTP` waits only for remaining profit-side DCA thresholds, while `SL` and `TSL` keep the stricter DCA-first fail-closed block. No additional web-specific drift survived once runtime parity was restored.

- [x] `V1TRUTH-09 qa(closure): run focused real-money truth pack and publish closure evidence`
  - Scope: run the final focused closure pack for API, web, runtime, and guardrails before the post-`V1` architecture wave begins.
  - 2026-04-29: Closed by running the focused API closure pack (`99/99 PASS`), focused web closure pack (`15/15 PASS`), API/web typecheck, and repository guardrails. Closure evidence: `docs/operations/v1truth-live-exchange-truth-closure-2026-04-29.md`.

- [x] `BOTMULTI-00 planning(post-v1): publish deferred multi-strategy reintroduction packet`
  - 2026-04-29: Closed as a deferred planning-only slice. Published `docs/planning/botmulti-post-v1-multi-strategy-reintroduction-plan-2026-04-29.md` plus `docs/planning/botmulti-00-planning-task-2026-04-29.md`, recording the approved post-`V1` architecture direction: only after `V1TRUTH-A` closes and remains stable should Soar reopen the bot model from `1 strategy` to `N strategies`.

- [x] `V1MARK-00 planning(queue): publish LIVE futures mark-price parity packet`
  - 2026-04-29: Closed as the next derived post-`V1COVER-A` planning slice. Published the canonical packet `docs/planning/v1mark-live-futures-mark-price-parity-plan-2026-04-29.md` plus `docs/planning/v1mark-00-planning-task-2026-04-29.md`, freezing the next `LIVE exchange` hardening wave around one concrete futures-only drift: runtime protection and position-lifetime automation still resolve lifecycle price from ticker `lastPrice` / candle close instead of preferring futures mark price through the existing shared seam.

- [x] `V1MARK-02..05 docs+api+qa(closure): close LIVE futures lifecycle-price parity for runtime protection`
  - 2026-04-29: Closed the full `V1MARK-A` wave. Binance futures mark-price updates now flow through the approved market-stream boundary, runtime ticker state preserves mark price without dropping last trade price, and the shared lifecycle-price resolver now prefers `markPrice -> lastPrice -> recent close` for `LIVE FUTURES`. Closure evidence: `docs/operations/v1mark-live-futures-mark-price-parity-closure-2026-04-29.md`. Validation PASS: focused `binanceStream`, `runtimeTickerStore`, `runtimeLifecycleMarkPrice`, `runtimePositionAutomation`, and `runtimePositionLifetime` suites, API typecheck, and repository guardrails.

- [x] `V1COVER-01 test(runtime-state): reset shared runtime candle/ticker stores at canonical test boundaries`
  - 2026-04-29: Closed the first `V1COVER-A` slice by clearing module-global runtime candle/ticker stores in `runtime-flow.e2e.test.ts` and `runtimeSignalLoop.service.test.ts`. Focused combined validation now passes when those two files run together, which removes one confirmed source of false-red `LIVE` parity noise caused by inherited runtime market data.

- [x] `V1COVER-02 test(shared-cleanup): repair singular-bot wallet cleanup drift in runtime takeover helpers`
  - 2026-04-29: Closed by restoring `wallet.deleteMany()` to the shared takeover reset helper and updating the stale overlap proof to the current architecture. Runtime takeover coverage now matches the approved rule set: `LIVE + PAPER` may share a symbol, but the imported `LIVE` position stays visible only for the owning LIVE bot, while the older two-active-LIVE overlap assumption is no longer treated as valid proof.

- [x] `V1COVER-03..05 qa+test(closure): rerun stabilized broad LIVE runtime coverage and close residual fixture drift`
  - 2026-04-29: Closed the full `V1COVER-A` wave. Sequential broad runtime/order coverage is green again after removing shared runtime-state leaks, restoring shared wallet cleanup, aligning takeover overlap proof to the current architecture, and stabilizing the remaining `orders.service` LIVE fixture path through nested user+API-key setup. Closure evidence: `docs/operations/v1cover-live-runtime-regression-coverage-closure-2026-04-29.md`. Validation PASS: broad sequential runtime/order pack, full `orders.service`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `GOLIVE-2026-04-29-A tooling(smoke): harden local go-live smoke wrapper for reusable local infra`
  - 2026-04-29: Closed the local tooling slice. The umbrella smoke wrapper now reuses already-running reachable Postgres/Redis when Docker Compose cannot bind `5432/6379`, avoids shutting down infra it did not start, and surfaces the real remaining local blocker explicitly: Prisma `P3009` from failed migration `20260424094500_add_single_context_bot_refs`. Direct canonical go-live packs remain green, so the unresolved blocker is local DB state rather than current repo code.

- [x] `V1GUARD-01..05 docs+api+qa(closure): close final LIVE protection drifts for DCA/TTP/TSL parity`
  - 2026-04-29: Closed the full `V1GUARD-A` wave. Shared engine parity now keeps `TTP` blocked until the canonical `DCA-first` guard is satisfied, exchange-confirmed `LIVE DCA` fills now mark runtime dedupe success and converge persisted runtime position-state truth, and runtime protection evaluation now flows through one explicit lifecycle-price seam instead of hardcoding ticker `lastPrice`. Closure evidence: `docs/operations/v1guard-live-protection-final-closure-2026-04-29.md`. Validation PASS: focused `positionManagement`, focused `runtimePositionAutomation`, focused `orders.exchangeEvents`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1SAFE-00 planning(audit): publish LIVE protection and liquidation-safety analysis plus execution packet`
  - 2026-04-29: Closed as a planning-only analysis slice after refining the earlier broad liquidation-safety draft to the exact remaining parity problem. Published `docs/planning/v1safe-live-protection-and-liquidation-safety-plan-2026-04-29.md` plus the task packet `docs/planning/v1safe-00-analysis-task-2026-04-29.md`. The packet freezes the strongest confirmed drifts behind the current real-account symptom class: imported and recovered `LIVE` positions can still lack canonical trailing/DCA runtime state, runtime read-models can imply dynamic protection through fallback logic the engine cannot execute, and `DCA-first` close gating still lacks focused parity proof across `backtest`, `paper`, and `live`.
- [x] `V1SAFE-01..10 docs+api+web+qa(closure): close LIVE DCA/TTP/TSL parity for imported and recovered positions`
  - 2026-04-29: Closed the full `V1SAFE-A` wave. Added the canonical `LIVE` protection-state parity contract, proved prospective imported-position `TTP` hydration in focused runtime tests, removed API dynamic-stop fallback that could overstate `TTP` / `TSL` beyond runtime truth, and removed sticky fallback overlays from dashboard-home and bot-monitoring surfaces. Closure evidence: `docs/operations/v1safe-live-dca-ttp-tsl-parity-closure-2026-04-29.md`. Validation PASS: focused `runtimePositionAutomation`, focused `runtimePositionSerialization`, API typecheck, web typecheck, focused `HomeLiveWidgets`, focused `BotsManagement`, and repository guardrails.

- [x] `DOCSYNC-2026-04-28-E docs(planning-history): normalize remaining historical status wording`
  - 2026-04-28: Closed by normalizing the last ambiguous historical planning headers that still looked active after their owning waves had closed: `dashboard-loading-skeleton-progress-plan`, both dashboard planner briefs, and `xvenue-02-exchange-boundary-leak-audit`. The planning catalog now records those artifacts truthfully as historical implemented or superseded references instead of leaving mixed `PLANNED/planned/Published` wording in place. Validation PASS: `pnpm run quality:guardrails`.
- [x] `DOCSYNC-2026-04-28-D docs(planning-catalog): refresh catalog index and correct stale UOLF queued header`
  - 2026-04-28: Closed by refreshing `planning-catalog-index-2026-04-19.md` with the post-2026-04-20 wave history and correcting the stale `Status: queued` header left in the already closed `UOLF` plan. The slice restored truthful classification for newer `implemented` and `superseded` planning artifacts without changing runtime or feature behavior. Validation PASS: `pnpm run quality:guardrails`.
- [x] `DOCSYNC-2026-04-28-C docs(planning-status): close stale Active headers in already closed planning packets`
  - 2026-04-28: Closed by correcting stale `Status: Active` headers in already closed planning packets for `SCALE-A`, `V1FACT-A`, `V1TAKE-01`, `XADAPT-02`, and `XADAPT-06`. The task changed no runtime or feature behavior; it only restored parity between individual plan headers and canonical closure truth already recorded in `PROJECT_STATE` and `TASK_BOARD`. Validation PASS: `pnpm run quality:guardrails`.
- [x] `QH-E2E-2026-04-28-A qa(api-e2e): stabilize full markets and wallets CRUD suites after focused regression closure`
  - 2026-04-28: Closed by stabilizing the two legacy CRUD suites without loosening runtime behavior. `markets.e2e.test.ts` now uses one-time cleanup plus unique per-test identities so the full file can run deterministically without auth/session cross-talk, and `wallets.crud.e2e.test.ts` now uses the same unique-identity approach while reserving a shared bearer helper only for explicit multi-user ownership assertions. Added `apps/api/src/test/authenticatedRequest.ts` as the canonical helper for those multi-user authenticated-request cases. Validation PASS: full `markets.e2e`, full `wallets.crud.e2e`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `UXSAFE-2026-04-28-A fix(api-markets+wallets): harden active market-universe edit guard and wallet delete history cleanup`
  - 2026-04-28: Closed by hardening `MarketUniverse` active-usage detection and wallet delete history cleanup. `markets.service.ts` now blocks edit/delete only when the universe is still owned by an active bot through primary/canonical/legacy scope, matching the approved `Strategies` behavior for inactive bots while staying fail-closed for active runtime scope drift. `wallets.service.ts` now detaches nullable `walletId` references from historical `Position`, `Order`, and `Trade` rows before deleting a wallet, so operator history survives and the API no longer degrades to raw `500` on historical rows. Validation PASS: focused `markets.e2e` inactive/active guard regressions, focused `wallets.crud.e2e` history-detach regression, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `BOTLIVE-2026-04-28-A api(bot-guard): block active LIVE bot market-group overlap against other active LIVE bot scopes`
  - 2026-04-28: Closed by adding one canonical create/update guard for bots that would become `LIVE + isActive + liveOptIn`. The write path now fails closed when the selected market group overlaps any symbol already covered by another active opted-in LIVE bot for the same user, while still allowing `PAPER` and `LIVE` overlap. Conflict responses now identify the blocking bot name plus exact conflicting symbols, e.g. `ETHUSDT` owned by another active LIVE bot. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.duplicate-guard.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1RESTART-00 planning(queue): publish canonical LIVE restart continuity and recovery hardening packet`
  - 2026-04-28: Closed as a planning-only task after a fresh user-reported production analysis of restart-time LIVE position disappearance. Published `docs/planning/v1restart-live-position-continuity-hardening-plan-2026-04-28.md` plus `docs/planning/v1restart-00-planning-task-2026-04-28.md`, freezing the target model as a high-quality continuity wave rather than a narrow bugfix. The plan locks restart-safe position continuity, event-first recovery authority, staged reconcile semantics for missing exchange rows, canonical ownership and strategy-context restoration for recovered positions, explicit operator recovery states, and an adversarial verification matrix for manual exchange close, liquidation, partial snapshots, and post-restart DCA/TSL continuity.
- [x] `V1RESTART-01 docs(contract): freeze canonical LIVE restart and downtime continuity model`
  - 2026-04-28: Closed by publishing `docs/architecture/reference/live-position-restart-continuity-contract.md` and normalizing the contract into `docs/architecture/06_execution-lifecycle.md`, `docs/architecture/04_runtime-contexts.md`, and `docs/architecture/reference/position-lifecycle-parity-matrix.md`. The repository now explicitly freezes that restart is not close authority, that one missing post-restart snapshot is insufficient to classify a previously open `LIVE` position as closed, that recovery evidence is ordered `events -> durable local state -> repeated snapshot confirmation -> repair`, and that recovered actionability requires restored canonical ownership plus strategy context rather than mere visibility.
- [x] `V1RESTART-02..11 db+api+runtime+web+qa(closure): implement restart-safe LIVE position continuity and recovery truth`
  - 2026-04-28: Closed as the full `V1RESTART-A` implementation wave. Added durable restart continuity persistence on `Position` (`continuityState`, `lastExchangeSeenAt`, `lastExchangeSyncAt`, `missingSince`, `missingSyncCount`) plus migration `20260428113000_add_position_restart_continuity_state`; upgraded exchange-event close handling so confirmed external closes persist `EXTERNAL_CLOSE_CONFIRMED`; replaced reconcile's destructive one-pass stale close with staged recovery that first marks missing rows `RECOVERING` and only closes them after repeated missing confirmation; restored canonical `botId + walletId + strategyId` for deterministically owned recovered imported rows by reusing `bot.strategyId`; kept runtime automation and manual runtime close fail-closed until continuity returns to `CONFIRMED`; exposed `continuityState` and `actionable` in runtime/read surfaces; and updated dashboard runtime typing plus the open-positions presenter so degraded rows are explicit and action buttons disable until continuity is confirmed. Validation PASS: focused restart reconciliation tests, focused runtime automation tests, focused runtime takeover e2e for recovered/non-actionable visibility, API typecheck, web typecheck, and repository guardrails. Local Prisma note: due a pre-existing failed local migration `20260424094500_add_single_context_bot_refs`, this task validated schema changes with `prisma db push` after client generation instead of `migrate deploy`.

- [x] `V1CLOSE-00 planning(queue): publish canonical close-attribution and external-close hardening packet`
  - 2026-04-27: Closed after a focused audit of close-lifecycle semantics across architecture, runtime close commands, exchange-event application, reconciliation, and repair flows. The repository can already close positions technically, but it still lacked one canonical model for who or what initiated the close. The user approved the architecture extension on 2026-04-27: keep `closeReason` separate from a new canonical `closeInitiator` dimension. Published `docs/planning/v1close-position-close-attribution-hardening-plan-2026-04-27.md`, normalized the contract into `docs/architecture/06_execution-lifecycle.md` plus new `docs/architecture/reference/position-close-attribution-contract.md`, extended lifecycle parity docs, and synchronized canonical planning/context truth for the follow-up implementation wave.
- [x] `V1CLOSE-01..09 docs+db+api+web+qa(closure): implement canonical close-attribution truth across write paths, read models, and operator history`
  - 2026-04-27: Closed as the full `V1CLOSE-A` implementation wave. Added nullable `closeReason` / `closeInitiator` on `Position`, `Order`, and `Trade`, plus migration `20260427103000_add_position_close_attribution`. `positionCloseAttribution.ts` is now the canonical mapper for `USER_APP`, `BOT_APP`, `USER_EXCHANGE`, `EXCHANGE`, and `SYSTEM_REPAIR`, and that mapping is reused by `orders.service.ts`, `executionOrchestrator.service.ts`, `orders.exchangeEvents.service.ts`, `livePositionReconciliation.service.ts`, and `positions.service.ts` instead of inferring close authorship from logs or orphan states. Runtime read models now expose persisted close attribution, and dashboard aggregate history renders operator-facing labels for the persisted initiator truth. Validation PASS: `pnpm --filter api run test -- --run src/modules/orders/orders.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimeCrashRetry.regression.test.ts`, `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm run build`.

- [x] `V1LIVE-01 audit(api+docs): publish canonical live-execution and takeover regression packet`
  - 2026-04-26: Fresh repository audit after the user's live-position report confirmed this is no longer only a manual-order bug. The current drift spans exact adapter selection from user/bot exchange settings, ownership classification, imported live entry truth, runtime visibility/close parity for exchange-synced positions, and missing live event-stream lifecycle support for the first Binance adapter family. The task must publish one canonical investigation packet with exact findings, file-scoped follow-up tasks, and focused validation evidence.
  - 2026-04-26: Closed by publishing the canonical packet `docs/planning/v1live-binance-execution-and-takeover-hardening-plan-2026-04-26.md`, the follow-up audit `docs/planning/v1live-post-fix-quality-audit-and-plan-2026-04-26.md`, and synchronized queue/context truth for the active `V1LIVE-A` execution wave.

- [x] `V1LIVE-PROD-2026-04-26-A web(prod-manual-order): close stale manual-order symbol-context drift on the real account and verify by browser`
  - 2026-04-26: Closed after real-account production browser verification on the affected account. The deployed dashboard no longer reuses stale previous-symbol manual-order context price after bot/symbol switches, and authenticated production submit on the real account now follows current `botId + symbol` truth instead of freezing a previous-symbol `markPrice` into the request payload. Validation PASS locally: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm --filter web run build`; production browser verification PASS after manual Coolify deploy.

- [x] `V1LIVE-PROD-2026-04-26-B api(prod-position-truth): recover imported leverage truth and stale local LIVE cleanup on the affected account`
  - 2026-04-26: Closed after real-account production verification on the affected live bot. `positions.service.ts` now reads leverage truth from nested raw Binance Futures payload fields and can infer leverage from notional/margin when the explicit field is absent, while `livePositionReconciliation.service.ts` now treats open-orders fetch as fail-soft for stale local managed LIVE cleanup and rounds imported leverage truth before persistence. Production proof after manual Coolify deploys and authenticated `POST /dashboard/positions/orphan-repair`: stale `BNBUSDT` no longer remains in runtime `openItems` and is now closed as `ORPHAN_LOCAL`, the imported `DOGEUSDT` exchange snapshot exposes `leverage≈15`, and the runtime/live position now persists `leverage=15` instead of degrading to `1x` or `14`. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`, `pnpm --filter api run build`.

- [x] `V1LIVE-02 test(api-exchange-red): lock adapter selection to exact user/bot exchange context`
  - 2026-04-26: Add failing coverage proving that live execution and authenticated exchange reads resolve from the exact selected `exchange + marketType` context. Binance must be the first implemented adapter family, not a hidden default when another exchange is selected or unsupported.

- [x] `V1LIVE-03 fix(api-exchange): make adapter selection strictly follow user-selected exchange settings`
  - 2026-04-26: After the red contract is frozen, make adapter selection resolve only from linked wallet/bot execution context. Keep `BINANCE + SPOT` and `BINANCE + FUTURES` as the first implemented family while unsupported exchange paths stay explicit and fail closed.
  - 2026-04-26: Post-fix quality audit confirmed that env-driven runtime/manual helpers still carry hidden `BINANCE` defaults in places such as `runtimeScanLoop.service.ts` and `runtimePositionAutomation.service.ts`. Fold that cleanup into this slice instead of shipping another hotfix seam.
  - 2026-04-26: Closed together with `V1LIVE-02`. Runtime watchdog targets now preserve exact context instead of synthesizing generic ticker scope, runtime position automation fails closed when canonical execution context is unresolved instead of inheriting env defaults, and live-order submit now rejects resolved API-key exchange drift before connector bootstrap. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

## BACKLOG

- [x] `V1LIVE-04 test(api-red): lock one canonical ownership classifier for imported LIVE positions`
  - 2026-04-26: Add DB-backed failing coverage for disagreement between reconciliation, takeover-status, runtime visibility, and runtime close authority. This slice must prove the exact path where a position is imported as owned but still not surfaced or closeable by the bot runtime.
  - 2026-04-26: Closed together with `V1LIVE-05/08/09`. Focused unit and DB-backed e2e coverage now freezes exact imported ownership by `apiKeyId + symbol`, shared-API-key symbol isolation, wallet-managed versus manual-only takeover truth, and runtime visibility parity for competing live bots sharing one API key. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-05 fix(api-ownership): reuse one ownership classifier across reconciliation, runtime, and takeover`
  - 2026-04-26: Remove ownership drift after `V1LIVE-04` is red. Reuse one canonical classifier across `livePositionReconciliation`, runtime ownership, runtime read visibility, and takeover-status flows without adding a parallel ownership system.
  - 2026-04-26: Closed together with `V1LIVE-04/08/09`. `runtimeExternalPositionOwner.service.ts` now exposes one exact ownership index with explicit `OWNED | AMBIGUOUS | MANUAL_ONLY | UNOWNED` semantics, and reconciliation plus takeover-status/rebind flows now read that same truth instead of collapsing ownership by API-key counts alone. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-06 test(api-red): lock fail-closed imported entry/fill truth`
  - 2026-04-26: Add focused regressions proving imported live positions must not synthesize canonical entry truth from `markPrice` or other convenience fallbacks. Missing exchange entry truth must stay unresolved or fail closed.
  - 2026-04-26: Post-fix quality audit confirmed this remains a live architecture violation today: `livePositionReconciliation.service.ts` still falls back from imported `entryPrice` to `markPrice`.

- [x] `V1LIVE-07 fix(api-reconciliation): remove synthetic mark-price entry fallback and keep unresolved states explicit`
  - 2026-04-26: Remove the live import fallback from `entryPrice -> markPrice`, then keep downstream order/position behavior explicit and fail-closed where canonical truth is unavailable.
  - 2026-04-26: Closed together with `V1LIVE-06`. `livePositionReconciliation.service.ts` now accepts imported entry truth only from canonical `entryPrice`, and the focused reconciliation regression now proves `markPrice` alone is insufficient to materialize or update imported live positions. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-08 test(api-runtime-red): lock runtime visibility and close parity for owned imported LIVE positions`
  - 2026-04-26: Add focused DB-backed red coverage for `EXCHANGE_SYNC BOT_MANAGED` runtime visibility and dashboard close semantics so the current regression is frozen before more exchange work lands.
  - 2026-04-26: Closed together with `V1LIVE-04/05/09`. Runtime takeover e2e now locks exact imported-position visibility for two live bots sharing one API key but owning different symbol scopes, and close-command unit coverage now locks exact imported ownership claiming before exit orchestration. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-09 fix(api-runtime): recover imported-position runtime visibility and close authority`
  - 2026-04-26: Make owned imported `LIVE` positions visible and closeable through the same canonical runtime/read-model path used for other execution lifecycle states.
  - 2026-04-26: Closed together with `V1LIVE-04/05/08`. Runtime imported-position read visibility now scopes unclaimed `EXCHANGE_SYNC` rows by exact `apiKeyId + symbol` ownership instead of broad symbol heuristics, and runtime close authority now claims only canonically owned imported rows before issuing the exit orchestration. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-10 test(api-engine-red): lock signal -> LIVE order -> position lifecycle truth`
  - 2026-04-26: Add focused signal-driven `LIVE` execution coverage and remove stale fixtures that still represent retired bot contracts or older exchange assumptions.
  - 2026-04-26: Closed by adding focused `runtimeFinalCandleDecision.service.test.ts` regression coverage proving signal-driven `LIVE` execution may remain explicitly `submitted` without degrading into `PRETRADE_BLOCKED`, while still forwarding exact canonical runtime context (`walletId`, strategy scope, candle window, mode, and mark price) into orchestration. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-11 refactor(api-exchange): complete Binance adapter family inside the existing exchange boundary`
  - 2026-04-26: Implement the first supported adapter family explicitly as `BINANCE + SPOT` and `BINANCE + FUTURES`, including user-data-stream/event handling where Binance supports it. Adapter selection must remain exact to the chosen exchange context and fail closed for unsupported venues.
  - 2026-04-26: Closed by making the Binance family explicit under the current boundary instead of implicitly reusing a futures-biased generic path. `exchangeAdapterRegistry.service.ts` now resolves exact SPOT versus FUTURES connector families, `exchangeAdapterBoundary.service.test.ts` now locks SPOT live submit through the exact adapter family, and the new `binanceUserDataStream.service.ts` / `binanceUserDataStream.types.ts` add exact listenKey lifecycle plus normalized Binance stream events for both supported market families. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-12 fix(api-execution): wire Binance adapter-family events into canonical order and position lifecycle`
  - 2026-04-26: Normalize Binance live event updates into existing order/position/runtime services so `LIVE` state truth becomes event-driven inside the current lifecycle contract for the first adapter family.
  - 2026-04-26: Closed by adding `orders.exchangeEvents.service.ts` as one canonical apply seam for normalized Binance stream events. Confirmed order-trade updates now fill pending LIVE orders through `applyOrderFillLifecycle()`, close linked LIVE positions on final close fills, write idempotent `orderFill`/`trade` rows from exchange truth, and apply supported account updates back onto canonical open-position quantity, entry, and unrealized-PnL state. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIVE-13 cleanup(api+tests+web): remove stale fallback paths, stale fixtures, and misleading manual-order semantics`
  - 2026-04-26: Remove fallback and compatibility paths that actively conflict with the approved live/paper execution model. Keep orphan repair as a repair tool only, not a normal lifecycle truth source.
  - 2026-04-26: Include removal of remaining legacy runtime-sidebar strategy/group fallbacks once the singular inherited bot-context path is fully proven. The post-fix quality audit identified `RuntimeSidebarSection.tsx` legacy strategy reads as residual operator-surface debt, not canonical long-term behavior.
  - 2026-04-26: Closed by removing the residual runtime-sidebar legacy strategy fallback and correcting the stale `orders-positions.e2e` LIVE imported-position fixtures so they now include canonical exact ownership proof (`bot.apiKeyId + wallet.apiKeyId + externalId`). Focused validation PASS: `pnpm --filter api test -- --run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps EXCHANGE_SYNC BOT_MANAGED runtime positions visible for LIVE bot even when PAPER bot shares symbol|closes EXCHANGE_SYNC BOT_MANAGED runtime position selected from LIVE dashboard flow"`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`.

- [x] `V1LIVE-14 qa(closure): rerun focused live/paper/takeover closure pack and sync canonical docs/context`
  - 2026-04-26: Run the final focused closure evidence for exact adapter selection, signal-driven `LIVE`, manual `LIVE`, `PAPER` no-exchange parity, imported-position takeover visibility/close, and Binance Spot/Futures adapter-family lifecycle truth.
  - 2026-04-26: Closed with a green `V1LIVE-A` closure pack across API, web, repository typecheck, and repository guardrails. Final evidence PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1FIX-2026-04-26-B api/ops(orphan-repair): recover canonical bot ownership for legacy open-position debt and unblock prod manual-order + exchange takeover`
  - 2026-04-26: In progress after real-account production reproduction proved two concrete blockers on the user account: authenticated Binance position snapshot works, but legacy open positions with `botId=null` still exist as hidden blockers, so manual order collides with invisible stale rows and exchange takeover cannot project current exchange truth into runtime/UI cleanly. Added explicit `POST /dashboard/positions/orphan-repair` flow that rebinds local open rows only when canonical bot proof exists and closes only fully detached local orphans before forcing exchange reconciliation and takeover rebind. Validation PASS so far: `pnpm --filter api test -- --run src/modules/positions/positions.orphan-repair.e2e.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Remaining step: deploy to prod, execute repair on the affected account, and recheck dashboard/takeover behavior end-to-end.
  - 2026-04-26: Live prod verification after the orphan repair exposed one more blocking drift: manual-order conflict/reuse still searched open positions globally by `userId + symbol`, so a `LIVE` DOGE position on the live wallet falsely blocked a `PAPER` DOGE manual order on the paper wallet. Repository fix is now ready locally: `orders.positionScope.ts` centralizes wallet-first open-position scoping, manual pre-submit and fill-lifecycle paths both reuse it, and the new partial unique index migration scopes `OPEN` uniqueness by wallet/bot/unowned contract instead of user-global symbol. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Remaining step: deploy the latest API migration+code to prod and rerun the exact paper-bot manual-order dashboard flow on the affected account.
  - 2026-04-26: Local deploy-readiness gate is now green after the final repository closure pass. Backtests hardening now keeps wallet-first takeover fixtures truthful, makes report polling deterministic for the slow 3-symbol parity contract, and makes delete-run resilient to async worker/report races. Validation PASS: `pnpm --filter api exec vitest run src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtests.e2e.test.ts`, `pnpm run test:go-live:api`, `pnpm run typecheck`, `pnpm run quality:guardrails`, `pnpm run build`. Remaining step is operational only: deploy latest code + migration to prod, then rerun manual-order and live-takeover smoke on the affected account.
  - 2026-04-28: Closed after production push of `25276b475937d9dcf4af6337abf10185ec7dcd0c` and authenticated affected-account smoke. Public prod baseline passed (`/health`, `/ready`, web root, protected redirect, protected metrics denial), `GET /api/build-info` confirmed the exact deployed SHA, and the affected account loaded `/dashboard` with live runtime truth present for the selected live bot, including visible managed `DOGEUSDT SHORT` position, `RUNNING` LIVE runtime status, and authenticated exchange-balance wallet context. Evidence: `docs/operations/v1fix-2026-04-26-b-prod-smoke-2026-04-28.md`.

- [x] `V1FIX-2026-04-26-A api(manual-order-lifecycle): reuse existing same-symbol open position on manual fill and fail closed on reverse-side conflict`
  - 2026-04-26: Closed after reproducing the production `P2002` crash path directly in `soar-api` for manual `PAPER MARKET` open on a user who already had an open same-symbol position. `applyOrderFillLifecycle()` now updates and links the existing open position for same-direction fills, `openOrder()` fails closed with an explicit `409` for reverse-direction open attempts, and focused service + route regressions lock both cases. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1UX-01 web(manual-order-autofill): refresh Price from market reference on first symbol hydrate and symbol change`
  - 2026-04-25: Closed together with `V1UX-02/03` under one selected-bot dashboard manual-order UX polish slice. `Price` now auto-fills from the canonical `Use market` reference on first symbol hydrate, symbol changes reset the field back onto the current symbol reference, and ordinary same-symbol manual edits are no longer overwritten. Focused validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm --filter web run build`.

- [x] `V1UX-02 web(manual-order-budget): add quote-budget input under Qty slider with wallet free-funds cap`
  - 2026-04-25: Closed together with `V1UX-01/03`. The manual-order sidebar now exposes a quote-budget input under the qty slider, derives `Qty` from final order cost, keeps budget/qty synchronized through the existing selected-bot controller, and fails closed when requested spend exceeds wallet free funds. Focused validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm --filter web run build`.

- [x] `V1UX-03 web(manual-order-sidebar): remove summary/lifecycle/action-state noise and rerun focused closure pack`
  - 2026-04-25: Closed as the final manual-order sidebar cleanup slice. The runtime sidebar now keeps only the actionable fields (`order type`, `margin mode`, `leverage`) and removes the summary line, lifecycle hint, and action-state card that were adding operator noise without helping V1 execution flow. Focused validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm --filter web run build`.

- [x] `V1COH-07 web(manual-live-state): expose ready state for actionable dashboard manual LIVE context`
  - 2026-04-25: Closed the misleading operator-surface gap where dashboard manual LIVE state defaulted to `blocked` even in a valid actionable context. The runtime sidebar now exposes an explicit `ready` state before submit, keeps `blocked` only for genuinely non-actionable dashboard contexts, and locks the semantics with focused `HomeLiveWidgets.manual-order` regression coverage plus i18n sync.

- [x] `V1DEPLOY-2026-04-25-B ops/web-build-meta: make deployed web git SHA resolvable inside Coolify Docker builds`
  - 2026-04-25: Closed the last deploy-proof gap for `soar-web`. `GET /api/build-info` now falls back to runtime env commit/branch hints when file metadata is absent, the build metadata writer still reads `SOURCE_COMMIT` / `SOURCE_BRANCH` first, and the Coolify ops guide now freezes the required production wiring: declare `SOURCE_COMMIT=$SOURCE_COMMIT`, `SOURCE_BRANCH=$COOLIFY_BRANCH`, and enable `Include Source Commit in Build` for the web app. Validation PASS: `pnpm --filter web run build`, `docker build -f apps/web/Dockerfile -t soar-web-gitsha-fix .`.

- [x] `V1DEPLOY-2026-04-25-A ops/web-image: restore production web Docker build parity after build-metadata rollout`
  - 2026-04-25: Fixed the production-only deploy regression introduced after deploy-truth hardening. `apps/web/Dockerfile` now copies the repo `scripts/` directory into the build stage, so the existing `web` build contract `node ../../scripts/writeWebBuildMetadata.mjs && next build` remains valid inside Coolify just as it does locally. Validation PASS: `pnpm --filter web run build`, `docker build -f apps/web/Dockerfile -t soar-web-localfix .`.

- [x] `V1TAKE-09 web(wallet-ui): remove API-key takeover toggles and keep wallet as the single editable management switch`
  - 2026-04-25: Removed the legacy API-key takeover/import switches from `ApiKeyForm` and deleted the helper bot-takeover list that depended on API-key-level management. The wallet form remains the only editable takeover-management surface, while API-key saves still submit compatibility-safe `syncExternalPositions=true` and `manageExternalPositions=false` defaults behind the scenes. Validation PASS: `pnpm --filter web exec vitest run src/features/profile/components/ApiKeyForm.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1READY-2026-04-25-C ops/deploy(sync): expose deployed commit truth and reconcile residual V1 activation artifacts`
  - 2026-04-25: Closed the residual post-approval truth gap that still made V1 verification unnecessarily ambiguous. Added web build metadata generation plus `/api/build-info` git SHA exposure for deploy verification, made `ops:rc:gates:summary` report stale evidence timing instead of silently presenting old evidence as current, and resynced the architecture-V1 checklist plus activation/checklist docs so already-closed V1 waves are no longer labeled as active `PARTIAL` closures. Validation PASS: `pnpm run quality:guardrails`, `pnpm run typecheck`, `pnpm run build`, `pnpm run ops:rc:gates:summary`.
- [x] `V1TAKE-08 qa(closure): rerun focused DB-backed API + web closure pack and sync canonical docs/context`
  - 2026-04-25: Reran the full focused `V1TAKE-A` closure pack across takeover-status, reconciliation, runtime ownership/visibility, manual-order API truth, and dashboard manual-order surfaces. Final evidence is green when DB-backed API suites are executed sequentially on the shared local Postgres instance. Synced queue/context docs and recorded the local testing pitfall in `LEARNING_JOURNAL.md`. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption"`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1TAKE-07 fix(api+web-orders): harden manual-order fill/context truth and fail-closed UI semantics`
  - 2026-04-25: `PAPER MARKET` manual open now fails closed when canonical fill price cannot be proven. Added explicit `PAPER_MARKET_PRICE_UNAVAILABLE` handling in `orders.service.ts`/`orders.controller.ts`, blocked the same degraded submit path in `useManualOrderController.ts`, and synced dashboard i18n copy for the new validation message. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1TAKE-06 test(api+web-red): lock manual PAPER/LIVE open truth from dashboard submission to order/position state`
  - 2026-04-25: Added focused regression coverage proving two things: `PAPER MARKET` without canonical price truth must not cross the dashboard/API boundary as a fake waiting-for-fill order, and the existing `LIVE` manual-order state progression remains the truthful operator path. The red slice is now frozen in `orders.service.test.ts`, `orders.manual-paper-market.e2e.test.ts`, and `HomeLiveWidgets.manual-order.test.tsx`.
- [x] `V1TAKE-05 fix(api-runtime): align runtime position adoption with canonical owned external-position truth`
  - 2026-04-25: Reused wallet-owned takeover truth inside `runtimeExternalPositionOwner.service.ts`, so LIVE runtime ownership candidates now exclude bots whose linked wallets disable external-position management. Added focused unit coverage plus `bots.runtime-takeover.e2e.test.ts`, proving a wallet-managed bot now sees its owned `EXCHANGE_SYNC` position even when another LIVE bot shares the same symbol scope but is manual-only. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1TAKE-04 test(api-runtime-red): lock deterministic runtime visibility for owned exchange-synced LIVE positions`
  - 2026-04-25: Added focused DB-backed runtime coverage for the exact path "active exchange position exists, ownership is deterministic, bot runtime must show it". The new runtime takeover regression first failed with `expected +0 to be 1`, proving runtime ownership still counted a competing LIVE bot whose wallet disabled external-position management and therefore collapsed deterministic ownership into false ambiguity.
- [x] `V1TAKE-03 fix(api-positions): unify external-position management contract and takeover status ownership`
  - 2026-04-25: Made wallet the only management source of truth for takeover-related positions behavior. `livePositionReconciliation.service.ts` no longer consumes API-key-level `manageExternalPositions`, and `positions.service.ts` takeover-status classification now treats API-key-level management as compatibility-only while failing closed to `MANUAL_ONLY` when the linked LIVE wallet disables management. Validation PASS: `positions.takeover-status.e2e.test.ts`, `livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1TAKE-02 test(api-red): lock takeover authority drift between API key, wallet, and bot visibility`
  - 2026-04-25: Added focused DB-backed takeover-status coverage proving the old drift around stale `BOT_MANAGED` rows and then refined it under the user-approved wallet-only contract. The red slice now documents that API-key-level `manageExternalPositions=false` is compatibility-only, while wallet-disabled takeover must fail closed.
- [x] `V1TAKE-01 audit(api+runtime): publish confirmed ownership/manual-order investigation packet with DB-backed validation`
  - 2026-04-25: Published `docs/planning/v1take-01-investigation-audit-2026-04-25.md` and the matching task packet `docs/planning/v1take-01-investigation-audit-task-2026-04-25.md`. The audit freezes four concrete classes: a confirmed ownership-contract split between API key and wallet flags, the intentional `BINANCE + FUTURES` import boundary, the operator gap between takeover status and runtime `BOT_MANAGED` visibility, and a narrower manual-order watch item around UI estimation versus backend truth. Validation PASS: `positions.takeover-status.e2e.test.ts`, targeted `orders.service.test.ts`, targeted `orders-positions.e2e.test.ts`, and `pnpm run quality:guardrails`.
- [x] `V1TAKE-A planning queued (exchange takeover ownership and manual-order truth closure after fresh live investigation)`
  - 2026-04-25: Published `docs/planning/v1take-exchange-takeover-manual-order-closure-plan-2026-04-25.md` plus the planning task packet `docs/planning/v1take-00-planning-task-2026-04-25.md`. The new wave freezes four confirmed audit findings: takeover authority drift between API-key and wallet flags, Binance Futures-only import scope, runtime visibility gated by deterministic `BOT_MANAGED` ownership, and remaining manual `PAPER/LIVE` open truth closure. Local Docker verification is no longer engine-blocked; DB-backed `positions.takeover-status.e2e.test.ts` now passes and the targeted `orders.service` manual-LIVE regression also passes.

- [x] `XADAPT-02 audit(api-exchange): classify Binance-specific assumptions across orders, exchange, and reconciliation paths`
  - 2026-04-25: Published the classification packet for orders, exchange, and reconciliation paths. The repository now distinguishes intentional Binance-only runtime scope, compatibility-only generic seams, and generic-looking drift risks that `XADAPT-03` must narrow.

- [x] `XADAPT-03 refactor(api-exchange): expose one canonical exchange adapter boundary for write and authenticated-read consumers`
  - 2026-04-25: Added one code-level capability matrix for authenticated reads plus `LIVE_ORDER_SUBMIT` / `LIVE_ORDER_CANCEL`, introduced `exchangeAdapterBoundary.service.ts` as the single feature-facing exchange boundary, moved `orders.service.ts`, `positions.service.ts`, and `wallets.service.ts` to that boundary, and kept lower-level connector/CCXT seams internal to `exchange`. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `pnpm --filter api exec vitest run src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `XADAPT-04 test(api-binance): add focused Binance adapter contract coverage for live submit and reconciliation-facing reads`
  - 2026-04-25: Added focused boundary-first coverage in `exchangeAdapterBoundary.service.test.ts` plus capability-matrix coverage in `exchangeExecutionCapabilityContract.service.test.ts`, locking Binance-only read/submit support, explicit `LIVE_ORDER_CANCEL` non-support, unsupported-exchange fail-closed behavior, and live-submit normalization through the new boundary. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `XADAPT-05 qa(closure): run focused exchange-adapter closure pack and sync canonical docs/context`
  - 2026-04-25: Reran the focused exchange-hardening closure pack, confirmed the adapter boundary and capability-contract suites stay green together, and synced queue/context artifacts to point at `XADAPT-06` as the next smallest slice. Validation PASS: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `XADAPT-06 planning(readiness): publish staged next-exchange rollout packet after Binance boundary closure`
  - 2026-04-25: Published the staged next-exchange readiness packet in `docs/planning/xadapt-06-next-exchange-readiness-packet-2026-04-25.md`. The packet chooses `BYBIT` as the next target, freezes staged rollout order (`API_KEY_PROBE -> BALANCE_PREVIEW -> POSITIONS_SNAPSHOT -> OPEN_ORDERS_SNAPSHOT -> LIVE_ORDER_SUBMIT`), keeps reconciliation broadening out of scope, and preserves `LIVE_ORDER_CANCEL` as unsupported. Validation PASS: `pnpm run quality:guardrails`.

- [x] `V1REG-02 qa(auto): execute architecture-v1 automated verification pack and record function-by-function status`
  - 2026-04-25: Ran the first post-`V1COH-A` / post-`XADAPT-A` automated architecture-V1 sweep and wrote results back into the checklist. Web suites and non-DB API suites passed; DB-backed API verification is environment-blocked by unreachable local Postgres at `localhost:5432`, so affected functions are recorded as `INFRA_BLOCKED` or `PARTIAL_PASS_INFRA_BLOCKED` instead of false product failures. Validation PASS: web regression batches, non-DB API regression batch, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `XADAPT-01 docs(contract): freeze exchange execution capability matrix for authenticated reads and write-side execution`
  - 2026-04-25: Updated architecture docs so authenticated reads and write-side execution now share one explicit capability matrix. Frozen V1 truth is: Binance-only support for `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`, `OPEN_ORDERS_SNAPSHOT`, and `LIVE_ORDER_SUBMIT`, with `LIVE_ORDER_CANCEL` explicitly unsupported for every exchange until a canonical exchange-cancel boundary exists.

- [x] `V1READY-2026-04-25-B ops/signoff(sync): rebuild RC sign-off artifact and publish final V1 READY/BLOCKED launch decision`
  - 2026-04-25: Rebuilt the RC sign-off artifact, refreshed RC external gate status, rebuilt sign-off once more so its own gate snapshot captured `G4=PASS`, and resynced the RC checklist. Activation pack, closure, and project/context truth now agree that V1 is formally approved from the current repository evidence set.

- [x] `V1READY-2026-04-25-A docs/ops(sync): reconcile final V1 activation truth, remaining blockers, and operator handoff`
  - 2026-04-25: Reconciled activation pack, activation closure, RC gate status, RC checklist, RC sign-off record, and `PROJECT_STATE.md` against the frozen activation contract. Canonical truth is now fail-closed: V1 remains blocked only because the RC sign-off artifact still contains mixed gate truth and must be rebuilt before Gate 4 can close honestly.

- [x] `V1COH-06 qa(closure): run focused API + web closure pack and sync canonical docs/context`
  - 2026-04-25: Ran the focused closure pack across API and web, including the manual `LIVE` submitted->imported order->position regressions, the dashboard manual-order action-state regressions, typechecks, and repository guardrails. Guardrail closure required splitting manual-order coverage into a dedicated `HomeLiveWidgets.manual-order.test.tsx` file so the suite stayed under the repository file-size budget.

- [x] `V1COH-05 web(runtime-state): expose explicit manual LIVE action states on dashboard surfaces`
  - 2026-04-25: Added explicit manual LIVE action-state presenters plus sidebar UI, localized the new state contract, and locked it with focused `HomeLiveWidgets` and `RuntimeSidebarSection` regressions plus web typecheck.

## IN_PROGRESS

None.

## BLOCKED

- No active BOTMULTI blocker remains. The earlier `BOTMULTI-02` priority
  semantics blocker was resolved on 2026-05-03 when lower numeric
  strategy-link priority was selected as canonical and the BOTMULTI wave
  closed through `BOTMULTI-08`.

- Historical `V1EXCEL-03..06 confidence gates: finish authenticated manual operator, stage/prod, and runtime observability evidence`
  - Scope: execute the remaining V1 excellence evidence wave: full manual matrix, authenticated stage refresh, authenticated prod refresh, and runtime observability closure on the current candidate.
  - 2026-05-01: `V1ROE-04` is no longer blocked; it is closed by authenticated production evidence. Production runtime observability under `V1EXCEL-06` is also green with auth. The remaining blocked or incomplete confidence work belonged to manual matrix, stage refresh, broader prod refresh evidence families, and stage runtime observability.
  - 2026-05-02 supersession: no longer an active V1 blocker after
    `V1CLOSEOUT-11` published final production-only `GO`; stage moves to V2 by
    operator decision.

## REVIEW

None.

## DONE

- [x] `V1ROE-04 qa(prod-manual): verify exchange-aligned LIVE PnL truth and imported automation on protected DOGEUSDT`
  - 2026-05-01: Closed with authenticated protected production evidence. Production build-info reports `e6bdcfda35698dbb29513490a953e15b9a2c0469` on `main`, public deploy smoke and protected runtime freshness pass, protected `DOGEUSDT` runtime truth is `IN_SYNC`, `CONFIRMED`, `actionable=true`, and strategy-context resolved, and headless dashboard proof confirms the `live` bot `Positions` row matches protected API truth. Evidence: `docs/operations/v1roe-04-prod-verification-closure-2026-05-01.md`.

- [x] `V1PARITY-01 docs(contract): freeze LIVE add-fill, account-update scope, and runtime/read-model strategy-context parity`
  - 2026-04-29: Closed by publishing `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md` and normalizing the contract into `06_execution-lifecycle.md`, `04_runtime-contexts.md`, and `reference/execution-lifecycle-parity-contract.md`. The repository now explicitly freezes that confirmed LIVE add-fills on an existing position must update canonical quantity/entry from fill truth, that add-leg fills must preserve `DCA` semantics instead of collapsing into generic `OPEN`, that `ACCOUNT_UPDATE` is confirmation/repair rather than broad rewrite authority across all `userId + symbol + side` rows, and that read models must not visually imply strategy-manageable runtime truth when canonical `position.strategyId` is missing.
- [x] `V1PARITY-10 qa(closure): run focused LIVE parity pack and publish closure evidence`
  - 2026-04-29: Closed the remaining `V1PARITY-02..10` implementation slices end to end. `orders.exchangeEvents.service.ts` now reprices existing LIVE positions through canonical add-update fill math with explicit `DCA` trade attribution and narrow `ACCOUNT_UPDATE` ownership scope; runtime read models no longer surface DCA/TSL plans through symbol fallback when canonical `strategyId` is missing; and fail-closed LIVE automation skips now emit operator-visible `PRETRADE_BLOCKED` diagnostics through runtime telemetry. Closure evidence: `docs/operations/v1parity-live-runtime-lifecycle-parity-closure-2026-04-29.md`. Validation PASS: focused `orders.exchangeEvents`, `runtimePositionAutomation`, `bots.runtime-strategy-context`, focused DCA ladder e2e, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1PARITY-00 planning(audit): publish LIVE runtime lifecycle parity analysis and execution packet`
  - 2026-04-29: Closed as a planning-only analysis slice after a fresh repository audit requested by the user. Published `docs/planning/v1parity-live-runtime-lifecycle-parity-hardening-plan-2026-04-29.md` plus the task packet `docs/planning/v1parity-00-analysis-task-2026-04-29.md`. The packet freezes five high-value confirmed drifts behind the reported `LIVE DCA` mismatch: exchange-confirmed fills on existing positions do not fully reuse canonical add-update lifecycle authority, add-leg fills are persisted as generic `OPEN` instead of explicit `DCA`, `ACCOUNT_UPDATE` scoping is too broad (`userId + symbol + side`), runtime read models can mask missing `strategyId` with symbol-level fallback, and fail-closed runtime skip reasons are still mostly console-only instead of operator-visible telemetry.

- [x] `V1COH-04 fix(api-reconciliation): tighten exchange-synced order/position adoption around manual LIVE opens`
  - 2026-04-25: Extended runtime session open-order reads to adopt eligible `EXCHANGE_SYNC` orders through the same symbol-ownership contract already used for external positions, and deduplicated manual-vs-synced open-order visibility by `exchangeOrderId` with preference for the exchange-synced row. This keeps the runtime view truthful across `submitted -> imported_open_order -> position_opened` without double-counting the same LIVE order. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption"`, `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps LIVE open orders visible in runtime view when order was created before current session start"`, `pnpm --filter api run typecheck`.

- [x] `V1COH-03 test(api-runtime-red): lock manual LIVE market submitted->reconciled truth across order, open order, and position visibility`
  - 2026-04-25: Added a focused `orders.service` regression proving manual `LIVE MARKET` orders stay `OPEN/submitted` with `waitingForFill=true` when exchange placement returns no fill truth, plus a route-level runtime e2e regression that currently fails exactly on missing `EXCHANGE_SYNC` open-order visibility before later `EXCHANGE_SYNC` position adoption. Validation evidence: PASS `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`, expected RED `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption"`.

- [x] `V1REG-01 docs(audit): publish architecture-v1 functionality inventory and reusable regression checklist`
  - 2026-04-25: Published one reusable V1 checklist in `docs/operations/v1-architecture-functionality-regression-checklist-2026-04-25.md` plus the execution packet in `docs/planning/v1-architecture-functionality-verification-plan-2026-04-25.md`, mapping architecture-defined functions to implementation status, automated tests, manual browser checks, and follow-up task families.

- [x] `V1REG-03 qa(browser): execute architecture-v1 browser checklist and capture findings`
  - 2026-04-25: Completed the local browser/manual sweep against the reachable web target. `/auth/login` and `/auth/register` rendered correctly, unauthenticated `/dashboard` redirected back to `/auth/login`, and invalid sign-in stayed explicit with `Sign-in failed: Network Error` instead of false success. No new product-visible regression was isolated; the remaining manual function checks are infra-blocked locally because the API dev target fails closed on missing `API_KEY_ENCRYPTION_KEYS` and local Docker/Postgres were unavailable.

- [x] `V1REG-04 planning(sync): classify failures and queue missing or regressed functions`
  - 2026-04-25: Classified every remaining non-green checklist verdict against the current queue and local environment blockers. No new `V1REG-Fxx` product task was justified: `F09`, `F10`, and `F12` stay owned by already-closed waves, while the broader remaining gaps are infra-only blockers tied to local Docker/Postgres availability and local API secret-readiness prerequisites.

- [x] `V1REG-05 qa(regression): rerun touched function packs and refresh checklist status`
  - 2026-04-25: Closure rerun confirmed that the reusable V1 verification loop is complete and stable: the web checklist pack and non-DB API checklist pack remain green, API/web typechecks remain green, and DB-backed auth/API still fail only because `localhost:5432` is unreachable. No new product regression was isolated, so the queue now has no active follow-up from `V1REG-A`.

- [x] `XVENUE-01 docs(contract): freeze exact exchange-context and adapter-family model`
  - 2026-04-25: Froze the approved exchange/runtime architecture in canonical docs. `04_runtime-contexts.md`, `05_strategy-signal-and-decision-flow.md`, and `09_integrations-deployment-and-runtime-services.md` now explicitly require exact `(exchange, marketType)` context, forbid mixing `SPOT` and `FUTURES` or cross-exchange market-data reuse, freeze the narrow adapter-family model, and require worker health/readiness to reflect the full deployed topology.

- [x] `XVENUE-02 audit(api): inventory boundary leaks and direct exchange SDK usage`
  - 2026-04-25: Published `docs/planning/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md`, which inventories the confirmed direct exchange leaks still living outside `modules/exchange`: market catalog and public ticker access in `markets.service.ts`, live balance reads in `runtimeCapitalContext.service.ts`, runtime/backtest Binance REST dependencies in `runtimeSignalMarketDataGateway.ts`, `runtimeMarketDataFallback.service.ts`, and `backtestDataGateway.ts`, Binance-specific API-key probing outside the exchange module, and worker topology drift in `/workers/*` plus `workerOwnership.ts`. This closes the audit uncertainty and moves the queue to `XVENUE-03`.

- [x] `XVENUE-03 docs(contract): freeze capability matrix migration rules`
  - 2026-04-25: Canonical docs now distinguish compatibility-stage exchange-level flags from the target exact-stage `(exchange, marketType, operation)` matrix. `exchange-access-ownership-matrix.md` freezes the migration rules and forbidden inferences, while `09_integrations-deployment-and-runtime-services.md` makes explicit that broad exchange flags cannot override narrower operation contracts. This moves the queue to `XVENUE-04`.

- [x] `XVENUE-04 refactor(api-exchange): registry-driven adapter-family entrypoints`
  - 2026-04-25: Added `exchangeAdapterRegistry.service.ts` as the canonical family registry keyed by exact `(exchange, marketType)` context, with fail-closed rejection for unsupported venue pairs such as `KRAKEN + FUTURES`. `exchangeConnectorFactory.service.ts`, `exchangePublicRead.service.ts`, `exchangeAuthenticatedRead.service.ts`, and the default execution path in `exchangeAdapterBoundary.service.ts` now reuse that registry instead of rebuilding connector bootstrap locally. Validation PASS: focused exchange-module tests, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `XVENUE-05 refactor(api-markets-engine): remove direct exchange SDK access from feature modules`
  - 2026-04-25: Added `exchangeMarketCatalog.service.ts` so public market catalog ownership now lives under `modules/exchange`, and routed `runtimeCapitalContext.service.ts` live balance reads through `fetchSupportedExchangeBalanceRaw` instead of direct `ccxt/binance` construction. Validation PASS: `pnpm --filter api run test -- --run src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`. Note: local `markets.e2e.test.ts` remains infra-blocked by unreachable `localhost:5432`.

- [x] `XVENUE-06 test(api): add no-mixing parity coverage`
  - 2026-04-25: Added focused exact-context regression coverage proving `BINANCE + SPOT` does not reuse `BINANCE + FUTURES` in the registry and market catalog seams, while unsupported venue pairs remain fail-closed. Validation PASS: `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `XVENUE-07 refactor(api-ops): align worker topology truth`
  - 2026-04-25: Expanded the canonical worker-topology contract to model `market-data`, `market-stream`, `backtest`, and `execution`, rewired `/workers/health` and `/workers/ready` to expose explicit topology truth, and limited passive runtime-freshness skips to explicit local/test inline mode. Deployed `inline` or partial-split topology now surfaces as degraded/not-ready instead of silently healthy. Validation PASS: `pnpm --filter api run test -- --run src/workers/workerOwnership.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `XVENUE-08 qa(closure): rerun focused closure pack and sync docs/context`
  - 2026-04-25: Reran the focused `XVENUE-A` closure pack across exchange exact-context seams, worker-topology truth, API typecheck, and repository guardrails, then synced queue/context artifacts so the wave no longer remains active. Validation PASS: `pnpm --filter api run test -- --run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeConnectorFactory.service.test.ts src/modules/exchange/exchangePublicRead.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeMarketCatalog.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/workers/workerOwnership.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `DOCSYNC-2026-04-25-C docs(sync): reconcile stale V1 current-phase wording in project state`
  - 2026-04-25: Removed the last contradictory `Current phase` wording in `PROJECT_STATE.md` that still implied unreconciled activation truth even after the closed `V1READY-2026-04-25-A/B` refresh. The canonical source-of-truth now states consistently that V1 is approved from the current evidence set and that active work has moved to post-V1 hardening. Validation PASS: `pnpm run quality:guardrails`.

- [x] `V1COH-01 test(api-red): lock manual LIVE order against out-of-scope symbol and unresolved strategy context`
  - 2026-04-25: Added focused service and API e2e regressions proving manual `LIVE` open is rejected when the selected bot has no canonical symbol-matching strategy scope, and that accepted `LIVE` fixtures must provide the full inherited bot context.

- [x] `V1COH-02 fix(api-orders): enforce inherited wallet+venue context and fail closed for unresolved LIVE manual scope`
  - 2026-04-25: Manual `LIVE` write authorization now reuses inherited wallet + market-universe truth through `resolveInheritedRuntimeExecutionContext()` and rejects unresolved scope with explicit `LIVE_BOT_CONTEXT_MISMATCH` / `LIVE_MANUAL_SCOPE_UNRESOLVED` errors instead of trusting duplicated bot snapshot venue fields.

- [x] `DOCSYNC-2026-04-25-B docs(sync): remove closed PAPERPNL entry from TASK_BOARD READY lane`
  - 2026-04-25: Removed the already-closed `PAPERPNL-01` entry from the `READY` lane so `TASK_BOARD` now matches the closed queue state already reflected in `mvp-next-commits.md`, `mvp-execution-plan.md`, and `PROJECT_STATE.md`.

- [x] `DOCSYNC-2026-04-25-A docs(sync): remove stale V1POSTBOT full-api red-suite drift from project state`
  - 2026-04-25: Removed the stale `PROJECT_STATE.md` sentence that still claimed a separate 7-case full-API red-suite follow-up outside `V1IND-A`, keeping project-state wording aligned with the already-closed `V1POSTBOT-A` parity recovery.

- [x] `DEPLOY-2026-04-25-B qa(web-build): validate Coolify deploy hotfix locally and sync closure evidence`
  - 2026-04-25: Verified the local deploy gate for the same-day Coolify hotfix. Validation PASS: `pnpm --filter web run build`, `pnpm run quality:guardrails`.

- [x] `PAPERPNL-02 test(api-runtime): lock profitable PAPER EXIT realized-PnL sign for canonical LONG and SHORT closes`
  - 2026-04-25: Added focused `executionOrchestrator.service.test.ts` regression coverage proving the canonical `PAPER` `EXIT` lifecycle keeps positive realized PnL for profitable `LONG` and `SHORT` closes, and that the same positive value is written to both `position.closePosition(...)` and `trade.createTrade(...)`.

- [x] `DEPLOY-2026-04-25-A fix(web-build): remove Coolify deploy blockers in dashboard test helper and wallets table deps`
  - 2026-04-25: Fixed the `apps/web` deploy gate reported by Coolify for commit `0dd951d1696bd45ac11983c67e72213134a632d3`. Replaced `any` in `HomeLiveWidgets.test-helpers.ts` with canonical bot runtime response types and removed redundant `useMemo` dependencies from `WalletsListTable.tsx`.
  - 2026-04-25: Closure evidence captured in `DEPLOY-2026-04-25-B`. Validation PASS: `pnpm --filter web run build`, `pnpm run quality:guardrails`.

- [x] `UXUI-2026-04-24-A web(uxui): refine strategies tabs, dashboard runtime density, and wallets form layout`
  - 2026-04-24: Simplified strategy tab framing to one content container, removed closed-position history table from dashboard `Historia`, reduced runtime market-card helper chrome (`Status` / `Source` / `Strategy` / `Decision` labels plus extra market-state counters), improved warning readability on dashboard runtime surfaces, and tightened wallet create/edit layout with requested row grouping plus a button-style mode switcher. Validation PASS: `pnpm --filter web exec vitest run src/features/strategies/components/StrategyForm.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `DOCSYNC-QUEUE-2026-04-24 planning/docs: sync canonical queue state after closed V1SIG and V1CAP waves`
  - 2026-04-24: `PROJECT_STATE.md` no longer lists closed `V1SIG-01` / `V1CAP-01` slices as the next queued follow-up. Current source of truth now explicitly reflects that `TASK_BOARD` has no `READY` / `IN_PROGRESS` work and `mvp-next-commits.md` has no `NOW` / `NEXT` items, so any next engineering slice must be derived fresh rather than revived from stale follow-up text.

- [x] `V1LIFE-05 web(open-orders-action): add final Action column with cancel affordance in dashboard Orders tab`
  - 2026-04-24: Dashboard `Orders` tab now exposes a final `Action` column that reuses the existing `POST /dashboard/orders/:id/cancel` endpoint instead of a parallel web-only path. Cancel affordance is only shown for active open-order statuses (`PENDING` / `OPEN` / `PARTIALLY_FILLED`), runs with explicit pending state, and refreshes the selected-bot runtime snapshot after success. Focused validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIFE-06 qa(closure): run focused lifetime/order-control pack and sync canonical docs/context`
  - 2026-04-24: Closed the lifetime/order-control wave after rerunning the focused closure pack across strategy `0 = no limit` semantics, shared lifetime policy normalization, runtime stale-order cancellation, runtime stale-position close flow, and dashboard open-order cancel action. Validation PASS: `pnpm --filter web exec vitest run src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/utils/StrategyForm.map.test.ts src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx`, `pnpm --filter api exec vitest run src/modules/engine/strategyLifetimePolicy.test.ts src/modules/engine/runtimeOrderLifetime.service.test.ts src/modules/engine/runtimePositionLifetime.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1SURF-B planning: publish residual operator-surface truth closure after V1LIFE`
  - 2026-04-24: Fresh post-`V1LIFE` audit found that the backend/runtime core is no longer the main risk; the remaining drift is on operator surfaces. `dashboard-home` still reconstructs runtime aggregate in the browser when the aggregate endpoint fails, while dashboard/manual-order and bot-monitoring quick-context surfaces still read some venue semantics from duplicated bot snapshot fields instead of inherited context. Published `docs/planning/v1-residual-operator-truth-closure-2026-04-24.md` and queued `V1SURF-05..08`.

- [x] `V1SURF-05 web(aggregate-truth): remove selected-bot dashboard aggregate fallback and fail closed on aggregate errors`
  - 2026-04-24: Removed the remaining browser-side aggregate reconstruction path from `useHomeLiveWidgetsController.ts`. Selected-bot dashboard now keeps only real session truth from `listBotRuntimeSessions`, clears runtime aggregate payloads on aggregate endpoint failure, and exposes degraded selected-bot state instead of reconstructing symbol stats, positions, and trades in web. Added focused regression coverage proving aggregate failure does not trigger session-level reconstruction. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1SURF-06 web(inherited-venue): align runtime sidebar and manual-order estimate semantics to inherited bot context`
  - 2026-04-24: Runtime sidebar and dashboard manual-order estimate semantics now reuse inherited venue truth from `resolveBotVenueContext()` instead of duplicated bot snapshot `exchange/marketType` fields. `HomeLiveWidgets`, `RuntimeSidebarSection`, `runtimeSidebarPresenters`, and `useManualOrderController` now prefer the linked symbol-group market-universe context for capability checks, sidebar venue labels, manual-order margin fallback, and SPOT-vs-FUTURES estimate behavior. Added focused regression coverage for inherited venue labels and SPOT fallback semantics when manual-order context is unavailable. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1SURF-07 web(bot-monitoring-context): align quick-context/control venue labels and capability checks to inherited context`
  - 2026-04-24: Bot monitoring quick-context cards and placeholder capability warning now resolve venue semantics through `resolveBotVenueContext()` instead of duplicated bot snapshot `exchange/marketType` fields. Monitoring cards show inherited market-universe venue labels, capability badges evaluate against inherited exchange truth, and the warning banner now names the same inherited venue as the rest of the monitoring surface. Focused validation PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1SURF-08 qa(closure): rerun focused residual surface-truth pack and sync canonical docs/context`
  - 2026-04-24: Closed `V1SURF-B` after rerunning the focused residual operator-surface pack across dashboard aggregate fail-closed behavior, inherited dashboard venue semantics, bot-monitoring inherited venue truth, and shared runtime parity views. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-error.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order-venue.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIFE-04 api(position-lifetime): enforce strategy-configured position lifetime via canonical close lifecycle`
  - 2026-04-24: Added canonical runtime stale-position enforcement in `runtimePositionLifetime.service.ts` and wired it into the runtime session watchdog so stale `OPEN` positions for active bots are closed through the existing runtime EXIT lifecycle instead of a second cleanup path. The close flow now resolves one runtime mark price from ticker truth with a recent-close fallback, and fails closed when no valid price can be proven. Focused validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimePositionLifetime.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIFE-03 api(order-lifetime): enforce strategy-configured order lifetime via canonical cancel path`
  - 2026-04-24: Added canonical runtime order-lifetime enforcement in `runtimeOrderLifetime.service.ts` and wired it into the runtime session watchdog so stale `PENDING` / `OPEN` / `PARTIALLY_FILLED` orders are canceled through the existing `cancelOrder` path, guarded by runtime `CANCEL` dedupe with `reasonCode=stale_open`. Focused validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeOrderLifetime.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIFE-02 api(shared-lifetime): add one canonical strategy-lifetime resolver for order and position policies`
  - 2026-04-24: Added one canonical strategy-lifetime resolver in `strategyLifetimePolicy.ts` for both order and position lifecycle policies. The helper owns `orderLifetime/orderUnit` and `positionLifetime/positionUnit`, treats `0`, missing, negative, non-finite, and unsupported-unit cases as fail-closed `disabled`, and emits normalized duration-in-milliseconds output for downstream runtime/order consumers. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/strategyLifetimePolicy.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1LIFE-01 docs+web(contract): freeze and expose 0=no-limit semantics for strategy order/position lifetime`
  - 2026-04-24: Strategy form lifetime inputs now allow `0` for both position and order lifetime, helper copy explicitly documents `0 = no time limit`, and focused regressions prove the submit payload preserves zero values instead of coercing them away. Validation PASS: `pnpm --filter web exec vitest run src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/utils/StrategyForm.map.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1FINAL-03 qa(prod-closure): rerun focused runtime closure pack and capture remaining infra-only blockers`
  - 2026-04-24: Reran the focused backend runtime-closure pack and confirmed green results for aggregate monitoring truth, paper manual-order immediate-fill behavior, runtime flow parity, `api` typecheck, and repository guardrails. Recorded that the remaining blocker for local `test:go-live:smoke` is infra-only on this machine: Docker cannot bind `5432/6379` because another local stack (`cryptosparrow-postgres-1`, `cryptosparrow-redis-1`) is already occupying those ports.

- [x] `V1FINAL-02 api/ops(paper-order-recovery): classify and recover orphaned PAPER MARKET manual orders persisted pre-fix as OPEN without fill/position`
  - 2026-04-24: Confirmed that the known production orphan was a historical pre-fix `PAPER MARKET` manual order persisted as `OPEN` with `positionId=null`, not a new runtime regression. Recovery reused the existing canonical `cancelOrder` path: order `3c147495-519e-4f74-b8eb-07027e4a49f1` was canceled successfully on production via `POST /dashboard/orders/:id/cancel`, and the paper bot runtime aggregate now reports `openOrdersCount=0`.

- [x] `V1LIFE-A planning: publish order/position lifetime enforcement and dashboard open-order control wave`
  - 2026-04-24: Audited strategy builder, API/runtime, and dashboard open orders surfaces after the final V1 runtime review. Confirmed that lifetime fields already exist in `strategy.config.additional` and are exposed in the web form, but runtime currently only consumes `maxPositions`; no canonical enforcement path was found for `orderLifetime`, `positionLifetime`, or `maxOrders`, and dashboard orders table still lacks a cancel action despite an existing backend cancel endpoint. Published `docs/planning/v1-order-position-lifetime-and-manual-order-closure-2026-04-24.md` and queued `V1LIFE-01..06`.

- [x] `V1FINAL-A planning: publish final runtime closure wave after full repo green plus fresh production aggregate audit`
  - 2026-04-24: After rerunning full `api`, full `web`, `build`, and `quality:guardrails`, the repository is green again. Fresh production API verification showed the main runtime/signal path is now healthy, but two narrow follow-ups remain: aggregate session detail still mixed `RUNNING` with stale `finishedAt`, and production still contains at least one legacy paper manual `MARKET` order persisted pre-fix as `OPEN` without fill/position. Published `docs/planning/v1-final-runtime-closure-2026-04-24.md` and queued `V1FINAL-01..03`.

- [x] `V1FINAL-01 api(aggregate-session-truth): keep aggregate sessionDetail finishedAt null while any session is still RUNNING`
  - 2026-04-24: Fixed synthetic aggregate session semantics in `runtimeMonitoringAggregateRead.service.ts` so `sessionDetail.finishedAt` stays `null` whenever any aggregated runtime session is still `RUNNING`, instead of copying a stale finished timestamp from older completed sessions. Added regression coverage in `bots.monitoring-aggregate.e2e.test.ts`. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1MON-A planning: publish bot monitoring runtime-truth hardening wave`
  - 2026-04-24: After the post-`V1IND-A` operator-surface audit, user explicitly approved the strict architecture direction for bot monitoring: one backend aggregate endpoint is the only truth, and web must fail closed into degraded/error state instead of reconstructing runtime aggregate locally. Published `docs/planning/v1-monitoring-runtime-truth-hardening-2026-04-24.md` and queued `V1MON-01..04`.

- [x] `V1MON-01 web(aggregate-truth): remove client-side monitoring aggregate fallback and fail closed on backend aggregate errors`
  - 2026-04-24: Removed the browser-side aggregate reconstruction path from `botsMonitoringAggregate.service.ts`. Bot monitoring now depends on the canonical backend aggregate endpoint and surfaces endpoint failure through the existing degraded/error state instead of building a second runtime truth path in web code. Validation PASS: `pnpm --filter web exec vitest run src/features/bots/services/botsMonitoringAggregate.service.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1MON-02 web(inherited-context): make bot list and bot management prefer inherited venue/strategy context over duplicated bot snapshot fields`
  - 2026-04-24: Bot list and bot management now prefer inherited venue truth from `symbolGroup.marketUniverse` (with compatibility-only fallback to wallet/bot snapshot fields) and derive displayed max-open-position limits from linked strategy configuration instead of treating bot snapshot values as the primary truth. Focused validation PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotsListTable.test.tsx src/features/bots/components/BotsManagement.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1MON-03 web(signal-semantics): align bot monitoring future-signals semantics with dashboard-home runtime truth`
  - 2026-04-24: Bot monitoring now renders future-signal rows with the same operator semantics as dashboard-home: runtime state, context source, strategy context, decision detail, and canonical condition lines are shown explicitly, while configured-only rows remain visually degraded closed-candle market snapshots instead of reading like accepted runtime signals. Focused validation PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts src/i18n/translations.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1MON-04 qa(closure): rerun focused monitoring truth pack and sync canonical queue/context`
  - 2026-04-24: Closed `V1MON-A` after rerunning the focused bot-monitoring truth pack, keeping aggregate fail-closed behavior, inherited venue/strategy context, and future-signal semantics under one closure record. Validation PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts src/i18n/translations.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1SIGSEM-A planning: publish signal-surface semantic hardening slice`
  - 2026-04-24: After `V1IND-A` closed the canonical indicator and signal-analysis drift, a smaller operator-surface issue remained: `CONFIGURED_ONLY` rows still read too much like runtime decisions even though architecture defines them as market snapshots from the latest closed candle. Published `docs/planning/v1-signal-surface-semantic-hardening-2026-04-24.md` to lock the slice as presentation-only semantic hardening.

- [x] `V1SIGSEM-01 web(copy+semantics): make configured-only signal rows explicit market snapshots`
  - 2026-04-24: Dashboard-home and bot-monitoring copy now describe `CONFIGURED_ONLY` / `configured_fallback` rows as closed-candle market snapshots instead of pseudo-signals or runtime decisions. The selected-bot signal rail also reduces visual emphasis for snapshot-only rows while keeping the same conditions visible for operator comparison. Validation PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/i18n/translations.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1POSTBOT-A planning: publish post-V1BOT full API contract recovery wave`
  - 2026-04-24: After `V1IND-A` closure, full `pnpm --filter api run test -- --run` still had 7 red cases in `backtests/orders` suites. Audit grouped them into one post-`V1BOT` singular-context recovery wave rather than an indicator regression: older e2e fixtures still assumed partially configured LIVE bots, manual-order persistence expectations still depended on legacy linkage, and runtime session positions read/close flows still drifted for carryover open orders plus `EXCHANGE_SYNC BOT_MANAGED` LIVE ownership. Published `docs/planning/v1-post-v1bot-runtime-contract-recovery-2026-04-24.md` and queued `V1POSTBOT-01..05`.

- [x] `V1POSTBOT-01..05 api(test+qa): recover full API contract parity after V1BOT singular-context migration`
  - 2026-04-24: Closed the post-`V1BOT` recovery wave by aligning the affected `backtests/orders` e2e fixtures with the canonical singular bot contract (`walletId + symbolGroupId + strategyId`) instead of relying on partially configured LIVE/PAPER bots plus legacy graph rows. This restored the expected pre-trade/live parity checks, deterministic selected-bot order ownership expectations, runtime positions visibility for carryover open orders, and `EXCHANGE_SYNC BOT_MANAGED` LIVE close/read parity. Validation PASS: `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts`, full `pnpm --filter api run test -- --run` with required API-key encryption env, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1IND-01..07 docs/api/web/test/qa: recover canonical indicator parity and truthful signal surfaces`
  - 2026-04-24: Closed the full `V1IND-A` wave. Architecture now freezes one canonical V1 indicator registry scope and one shared parity contract for builder, runtime, backtest, and operator surfaces. Strategy-builder metadata is served from the canonical registry, signal read-models no longer own a subset indicator formatter that emitted opaque `X` placeholders, configured market snapshots are analyzed through the same shared indicator kernel used by runtime/backtest, and signal-surface venue truth now derives from inherited `SymbolGroup -> MarketUniverse` context. Added parity coverage proving every builder-exposed indicator is executable through the canonical registry/evaluator path. Focused validation PASS: `pnpm --filter api exec vitest run src/modules/engine/strategyIndicatorRegistryParity.test.ts src/modules/strategies/indicators/indicators.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter web exec vitest run src/features/strategies/components/StrategyFormSections/Indicators.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`, `pnpm --filter web exec vitest run src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts`, `pnpm --filter web run test -- --run`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm run build`.

- [x] `V1IND-A planning: publish canonical indicator parity and signal-surface recovery wave`
  - 2026-04-24: Audited builder-exposed indicators, shared runtime/backtest kernel coverage, signal-surface read models, and architecture contracts. Found that the currently exposed indicator families are broadly implemented in `strategyIndicatorKernel.ts`, but architecture docs still disagree on the frozen V1 parity scope, strategy-builder metadata still comes from standalone `indicators.data.ts`, signal read-models still contain subset fallback formatting that emits `X`/`-`, and operator surfaces still blur configured market snapshots with evaluated runtime decisions. Published `docs/planning/v1-indicator-parity-and-signal-surface-recovery-2026-04-24.md` and queued `V1IND-01..07`.

- [x] `V1BOT-09 api+web(manual-order): recover dashboard manual-order truth and singular-context execution for PAPER and LIVE`
  - 2026-04-24: Manual-order context now resolves against the singular bot contract first (`bot -> symbolGroup + strategy`) and fails closed when a symbol is outside the direct bot scope. `PAPER` `MARKET` orders without explicit request price now resolve one canonical fill price from manual-order context and immediately apply the shared order -> fill -> position lifecycle instead of persisting as hanging `OPEN` orders. The dashboard manual-order symbol list now prefers the selected bot market scope even before runtime activity appears. Validation PASS: `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order-scope.test.tsx`.

- [x] `V1DASH-01..04 web/qa(dashboard-truth): align selected-bot dashboard capital KPIs plus pending/degraded runtime truth`
  - 2026-04-24: Selected-bot dashboard capital widgets now reuse one shared runtime-capital truth helper, so `PAPER` and `LIVE` portfolio/free-funds KPI math prefer authoritative runtime capital summary fields over legacy bot snapshot baselines. The selected-bot markets rail now exposes operator state counts for `POSITION_OPEN`, `EVALUATED_NO_TRADE`, and `CONFIGURED_ONLY`, making running-but-non-actionable runtime states explicit instead of visually collapsing into empty healthy state. Focused dashboard truth pack PASS: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`.

- [x] `V1BOT-12..15 web/qa(bot-surface-truth): align bot monitoring/list surfaces to runtime capital truth and runtime state visibility`
  - 2026-04-24: Bot monitoring now derives portfolio/free-funds/capital-source context from authoritative runtime capital summary semantics, surfaces runtime market states and context-source truth directly in the future-signals table, and elevates configured-only / evaluated-no-trade counts into operator summary cards. Bot list and inline bot-management table now label paper values as configuration baseline context rather than implying active runtime capital truth. Focused bot-surface pack PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`.

- [x] `V1SURF-01..04 web/qa(shared-operator-truth): align repeated capital/runtime-state presentation across dashboard-home and bot monitoring`
  - 2026-04-24: Added one shared runtime-surface truth helper for capital and runtime-market-state derivation, reused by selected-bot dashboard and bot monitoring aggregate surfaces so the same backend truth now produces the same operator narrative across both views. Closure validation PASS: `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1BOT-01 docs(architecture): freeze single-context bot contract`
  - 2026-04-24: Canonical architecture was updated to the approved singular bot model where one bot owns exactly one wallet, one symbol-group-derived market scope, and one strategy. `BotMarketGroup` and `MarketGroupStrategyLink` were reclassified as migration compatibility only, while the canonical runtime contract moved to inherited wallet/market-group/strategy context.

- [x] `V1BOT-02..05 foundation: add direct bot refs, backfill migration, and align singular bot command/read contracts`
  - 2026-04-24: Added direct `Bot.strategyId` and `Bot.symbolGroupId` refs in Prisma schema plus migration/backfill SQL, updated create/update flows to persist the direct single-context refs while still syncing legacy compatibility rows, and aligned bot read contracts so list/get/runtime-graph return singular inherited bot context without reconstructing canonical truth only from legacy graph. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter web exec vitest run src/features/bots/components/BotCreateEditForm.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1BOT-06 engine(runtime-topology): replace multi-group runtime topology with singular bot context`
  - 2026-04-24: Canonical runtime routing and final-candle execution now use one direct bot runtime context (`symbolGroupId + strategyId`) instead of iterating over legacy `botMarketGroups/strategyLinks`. Dynamic market-stream subscriptions now read direct bot refs first, selected-bot runtime symbol stats build configured truth from the singular bot context, and dashboard runtime strategy/market context prefers direct inherited bot data. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1BOT-07 engine(capital-strategy-inheritance): source runtime parameters from wallet and strategy modules`
  - 2026-04-24: Runtime execution now derives mode/paper baseline/LIVE credential ownership from wallet context and venue truth from the linked symbol-group market universe. Active runtime topology fails closed on wallet-vs-market-scope drift, pre-trade loads inherited execution config instead of bot snapshots, runtime position automation executes DCA/close decisions against inherited wallet/venue context, and canonical runtime capital no longer falls back to bot-owned paper/api-key execution truth. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1BOT-07B fix(api-paper-capital): keep PAPER runtime capital bot-scoped under the linked wallet and align selected-bot monitoring reads to inherited execution context`
  - 2026-04-24: Production investigation proved a critical drift: the PAPER wallet showed `100 USDT` baseline and the selected strategy used `walletRisk=2` with `25x` leverage, yet the runtime dashboard reported `referenceBalance ~= 96,695 USDT` and opened ~`48k` notional paper positions. Root cause: PAPER runtime capital could still be derived from wallet-scoped lifecycle rows, allowing historical or legacy bot rows on the same wallet to inflate the currently selected bot. Fixed by keeping PAPER capital bot-scoped under the linked wallet while preserving LIVE wallet authority from authenticated exchange balance, and by aligning runtime position monitoring reads to inherited wallet/market-universe execution context instead of deprecated bot-owned mode/venue snapshots. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`.

- [x] `V1BOT-08 web(bot-crud): align create/edit/detail flows to the singular contract`
  - 2026-04-24: Bot create/edit flows now prefill and submit against the direct singular bot contract (`walletId + symbolGroupId + strategyId`) without depending on runtime-graph fallback reconstruction. Edit mode loads inherited context directly from `GET /dashboard/bots/:id`, while compatibility graph reads remain available only for legacy monitoring surfaces that have not yet been retired. Validation PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotCreateEditForm.test.tsx`, `pnpm --filter web run typecheck`.

- [x] `V1BOT-10 cleanup(legacy-runtime): remove legacy topology from canonical runtime path`
  - 2026-04-24: Canonical bot reads, duplicate-active validation, wallet-context validation, market-stream subscription discovery, external-position ownership, and manual-order bot-context resolution no longer infer singular truth from legacy `botMarketGroups` / `marketGroupStrategyLinks` / `botStrategies`. Legacy topology remains compatibility-only and explicit drift analysis moved onto dedicated helper ownership instead of silently affecting the primary runtime/API path. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/modules/orders/orders.service.test.ts`, `pnpm --filter api run typecheck`.

- [x] `V1BOT-11 qa(closure): full parity and migration closure pack`
  - 2026-04-24: Closure pack passed for the single-context bot migration across API, runtime, web, build, and repository guardrails. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/workers/marketStreamSubscriptions.service.test.ts src/modules/orders/orders.service.test.ts`, `pnpm --filter web exec vitest run src/features/bots/components/BotCreateEditForm.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`, `pnpm run build`.

- [x] `V1BOT-A closure: single-context bot architecture migration`
  - 2026-04-24: The approved singular bot model is now the canonical implementation path for Soar V1. One bot owns exactly one wallet, one symbol-group-derived market scope, and one strategy; runtime and operator surfaces consume inherited context from those linked modules, while legacy topology is compatibility-only and excluded from canonical execution truth.

- [x] `V1BOTSURF-A planning: queue bot operator-surface truth hardening after the wider dashboard audit`
  - 2026-04-24: A broader operator-surface audit confirmed that dashboard-home is not the only place still capable of drifting away from runtime truth. `BotsManagement` and `BotsListTable` still partly seed paper values from legacy bot snapshot fields, and bot monitoring does not yet expose pending open-order / degraded runtime states strongly enough for operator use. Published `docs/planning/v1-bot-surfaces-truth-hardening-2026-04-24.md` and queued `V1BOT-12..15`.

- [x] `V1BOT-A planning: approve and queue the single-context bot architecture migration`
  - 2026-04-24: User approved the full target-domain rewrite where one bot owns exactly one wallet, one symbol-group market scope, and one strategy, while inheriting execution context from wallet, venue/symbol scope from market group, and logic/risk settings from strategy. Published detailed migration packet `docs/planning/v1-single-context-bot-architecture-migration-2026-04-24.md`, updated the canonical architecture docs, and queued `V1BOT-01..11`.

- [x] `V1RT-02 fix(api-market-stream-endpoint): select Binance websocket default by runtime market type`
  - 2026-04-23: Authenticated production verification after the `V1RT-01` deploy showed that only symbols listed on both Binance spot and futures were receiving runtime decisions, while futures-only symbols stayed at `configured_fallback`. Root cause: `BinanceMarketStreamWorker` defaulted to the spot websocket even for `FUTURES` runtime. The worker now defaults `FUTURES` to `wss://fstream.binance.com/ws` and `SPOT` to `wss://stream.binance.com:9443/ws`, with focused regression coverage in `src/modules/market-stream/binanceStream.service.test.ts`.

- [x] `V1RT-01 fix(api-market-stream): align market-stream worker subscriptions with canonical runtime symbol scope`
  - 2026-04-23: Found and fixed a production-relevant contract drift where `marketStream.worker` built symbol subscriptions from ad-hoc whitelist logic instead of the canonical symbol-group resolver already used by runtime signal topology. Active bot stream subscriptions now resolve the same symbol scope as runtime and operator reads, including catalog-backed/filter-backed market universes. Validation PASS: `pnpm --filter api exec vitest run src/workers/marketStreamSubscriptions.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, `pnpm --filter api run typecheck`.

- [x] `V1SURF-01 fix(api+web-runtime-surface): make selected-bot dashboard markets section truth-based instead of mixing fallback context with accepted signal feed`
  - 2026-04-23: Added one explicit runtime market truth state to runtime symbol stats (`CONFIGURED_ONLY`, `EVALUATED_NO_TRADE`, `SIGNAL_ACTIVE`, `POSITION_OPEN`, `UNRESOLVED`) and rewired the dashboard selected-bot markets section to render all attached/runtime markets with factual state instead of filtering fallback context into a pseudo-signal feed. Synced architecture and task packet in `docs/planning/v1-runtime-market-truth-surface-2026-04-23.md`. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`.

- [x] `V1ALIGN-01 docs(architecture-worker-ownership): freeze split workers as deployed target and inline as local/degraded-only contract`
  - 2026-04-23: Updated canonical architecture and deployment docs so `split` is now the explicit deployed worker-ownership target for `STAGE` and `PROD`, while `inline` is documented as local/test-only or explicit degraded fallback. Synced the canonical queue so implementation can now proceed against one honest architecture contract instead of the prior half-state.
- [x] `V1ALIGN-02 fix(api-runtime-symbol-scope): keep empty resolved symbol scope fail-closed instead of widening to wildcard routing`
  - 2026-04-23: Runtime routing no longer widens empty resolved symbol scope into wildcard `*`. Empty market-group symbol sets now stay fail-closed, and the final-candle decision path emits explicit `SIGNAL_DECISION` telemetry with reason `EMPTY_SYMBOL_SCOPE` instead of silently routing all symbols.
- [x] `V1ALIGN-03 fix(api-signal-interval-truth): persist truthful runtime signal interval/window metadata`
  - 2026-04-23: Runtime signal persistence now stores the real normalized candle interval used by the decision path instead of hardcoding `1m`, keeping `Signal.timeframe` aligned with the architecture's `intervalWindow` truth.
- [x] `V1ALIGN-04 fix(api-runtime-freshness-authority): scope freshness truth to active runtime sessions instead of global latest-signal presence`
  - 2026-04-23: `/workers/runtime-freshness` now evaluates decision-activity truth per active runtime session. One unrelated fresh signal can no longer mask a starving running session, and the readiness payload exposes stale session ids explicitly.
- [x] `V1ALIGN-05 fix(api-runtime-diagnostics): make no-route and missing-runtime-input conditions explicit operator telemetry where architecture allows`
  - 2026-04-23: Completed the explicit diagnostics slice by recording empty-scope runtime decisions as operator-visible telemetry and keeping route/decision handling fail-closed instead of collapsing back into silent "nothing happened" gaps.
- [x] `V1ALIGN-06 qa(closure): run focused runtime-alignment closure pack and sync canonical docs/context`
  - 2026-04-23: Focused runtime-alignment tests, API typecheck, repository guardrails, and the full API pack all passed. Full API validation required explicit test-only encryption env (`API_KEY_ENCRYPTION_KEYS`, `API_KEY_ENCRYPTION_ACTIVE_VERSION`). `pnpm run test:go-live:smoke` remained workstation-blocked because local Docker bootstrap could not bind `5432` while another Postgres container was already using that port.
- [x] `V1ALIGN-A planning: runtime worker-ownership alignment plus symbol-scope, interval-truth, freshness-authority, and diagnostics closure`
  - 2026-04-23: Published `docs/planning/v1-runtime-architecture-and-truth-alignment-2026-04-23.md` after a fresh architecture-conformance review. The planned wave freezes one target answer for the current worker-ownership drift (`split` as deployed target, `inline` as local/degraded-only), then queues executor-ready slices for empty-scope runtime routing, truthful signal interval persistence, per-active-session freshness authority, and explicit no-route/runtime-input diagnostics.

- [x] `V1SIG-01 diagnose(prod-runtime-truth): reproduce and classify why active PAPER/LIVE bots stay at zero persisted runtime signals/positions/trades`
  - 2026-04-23: Closed the diagnosis slice by confirming through authenticated production investigation plus local code tracing that the active PAPER/LIVE bots are not failing at the paper/live execution adapter boundary. The canonical runtime evidence points instead to repeated decision-stage `No trade decision after strategy merge` / `No votes` outcomes, while the monitoring read model previously overstated configured fallback strategy context as if it were accepted signal truth.
- [x] `V1SIG-02 refactor(api-runtime-events): make no-trade/route/block reasons explicit runtime telemetry instead of silent absence where architecture permits diagnostics`
  - 2026-04-23: Runtime final-candle processing now records explicit `PRETRADE_BLOCKED` telemetry when a bot market-group is already at `maxOpenPositions`, complementing the existing explicit diagnostics for `No trade decision after strategy merge`, pre-trade guard blocks, orchestration ignores, external-position ownership conflicts, exchange min-order constraints, and insufficient funds. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts`.
- [x] `V1SIG-03 fix(operator-signal-truth): separate configured fallback strategy context from accepted runtime signal truth in monitoring read models and web surfaces`
  - 2026-04-23: Runtime symbol stats and dashboard monitoring now distinguish `latest_signal`, `latest_decision`, and `configured_fallback`. `lastSignal*` fields no longer inherit fallback strategy identity, while configured strategy context stays explicit through dedicated `configuredStrategy*` fields and web labels. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`.
- [x] `V1SIG-04 audit(paper-reset-capital): verify and fix wallet-reset/runtime-capital parity for PAPER bots after reset checkpoints`
  - 2026-04-23: Verified the canonical paper reset capital path and locked it with focused coverage so runtime reference balance continues to use wallet `paperInitialBalance` plus realized PnL only from `paperResetAt` onward. Added a DB-backed aggregate regression for the same scenario, but local execution remains infra-blocked until Postgres/Docker is available. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts`.
- [x] `V1SIG-05 qa(runtime-recovery): run focused backtest-paper-live parity and runtime delivery closure pack, then sync docs/context`
  - 2026-04-23: Full focused runtime recovery pack now passes end-to-end, including DB-backed symbol-stats/aggregate e2e coverage and paper/live execution parity tests. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`, `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoop.service.test.ts`, `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`, `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`, `pnpm --filter api run typecheck`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1SIG-A planning: runtime signal delivery recovery and truthful operator diagnostics`
  - 2026-04-23: Investigated production through authenticated API access on `https://api.soar.luckysparrow.ch` for the active PAPER bot `859fd4f7-cbb1-4f8e-b52a-5d119442e265` and LIVE bot `7204173d-af68-494a-bca8-95d3c1ba8ef1`. Both sessions are `RUNNING` with fresh heartbeats, but aggregate runtime truth shows `totalSignals=0`, `openPositionCount=0`, and `tradesTotal=0`. Runtime symbol monitoring currently exposes `configured_fallback` strategy context that can look like "signals" even when no persisted runtime signal exists. Published recovery packet `docs/planning/v1-runtime-signal-delivery-recovery-2026-04-23.md` and promoted the diagnosis slice plus follow-up recovery slices into the canonical queue.
- [x] `V1CAP-A planning: wallet capital authority recovery for reset and post-deposit cases`
  - 2026-04-23: Analyzed wallet/runtime capital authority against current Soar architecture and production investigation. Published `docs/planning/v1-wallet-capital-authority-recovery-2026-04-23.md` to freeze the two critical operator cases: `PAPER` reset checkpoint semantics and `LIVE` post-loss/post-deposit exchange balance refresh behavior under wallet allocation modes (`PERCENT`, `FIXED`, effective full balance). Promoted the capital-authority follow-up slices into the canonical queue.
- [x] `V1CAP-01 docs(capital-authority): freeze wallet capital rules for PAPER reset and LIVE post-deposit recovery`
  - 2026-04-23: Froze the explicit capital-authority contract in architecture/module docs so `PAPER` reset checkpoints and `LIVE` post-deposit allocation behavior are now documented as source-of-truth instead of planning-only intent.
- [x] `V1CAP-02 test(wallet-runtime): add focused regression coverage for reset checkpoint and refreshed exchange balance semantics`
  - 2026-04-23: Added focused API regressions covering `PAPER` reset checkpoint truth plus `LIVE` refreshed exchange balance behavior under `PERCENT`, `FIXED`, and effective full-balance semantics. Validation PASS: `pnpm -C apps/api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`.
- [x] `V1CAP-03 fix(wallet-runtime): align runtime capital snapshot and wallet/operator read-model behavior`
  - 2026-04-23: Introduced one shared API capital-allocation helper for wallet preview and runtime use, promoted runtime capital into an explicit snapshot contract, and extended runtime monitoring summaries with capital-source, allocation, account-balance, and `paperResetAt` truth.
- [x] `V1CAP-04 fix(wallet-ui): expose capital source/allocation/reset truth in wallet and runtime monitoring surfaces`
  - 2026-04-23: Wallet list/form and runtime wallet sidebar now expose capital source and mode-specific hints so operators can distinguish paper reset checkpoints, live percent/fixed allocation, and full-balance live behavior.
- [x] `V1CAP-05 qa(wallet-closure): run focused wallet/runtime closure pack and sync docs/context`
  - 2026-04-23: Closure pack PASS with focused API/web regression suites, API/web typecheck, and repository guardrails. No recurring pitfall strong enough for learning-journal entry was confirmed in this slice.

- [x] `V1CONF-07 test(signal-cleanup): reduce remaining non-failing web warning noise outside the high-signal confidence pack`
  - 2026-04-23: Removed the remaining non-failing web warning noise by aligning bots/markets/strategies form-and-table suites with their real dashboard routes, adding provider-safe render/teardown helpers for route-aware dashboard-home suites, and settling async widget/table assertions so the full web pack now runs cleanly. Validation PASS: `pnpm --filter web exec vitest run src/features/bots/components/BotCreateEditForm.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/strategies/components/StrategyForm.test.tsx src/features/strategies/components/StrategiesList.test.tsx src/features/markets/components/MarketUniversesTable.test.tsx`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`, `pnpm --filter web run test -- --run`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1CONF-06 test(i18n-signal): reduce remaining I18nProvider act warnings and route-namespace noise in high-signal web suites`
  - 2026-04-23: Removed mount-time `I18nProvider` hydration drift by lazily initializing locale/timezone from storage, mapped `/dashboard/profile` to the `auth` namespace, aligned the affected auth/profile/reports/backtests/dashboard suites with their real route context, and stabilized `BotsManagement` against brittle render/fetch timing assumptions. Validation PASS: `pnpm --filter web exec vitest run src/i18n/I18nProvider.test.tsx src/i18n/namespaceRegistry.test.ts src/features/auth/components/LoginForm.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/profile/components/Security.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx src/features/backtest/components/BacktestsListView.test.tsx`, `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx`, `pnpm --filter web run test -- --run`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1CONF-01 docs(sync): align canonical phase + queue with approved V1 and confidence-hardening mode`
  - 2026-04-23: Published `docs/planning/v1-confidence-hardening-plan-2026-04-23.md`, updated the canonical queue, and aligned project state with the fact that V1 is already approved and active engineering work is now a post-approval confidence-hardening wave.
- [x] `V1CONF-02 test(web-route-context): continue removing false i18n/noise drift from high-signal dashboard table tests`
  - 2026-04-23: Aligned the bots, wallets, and backtests table tests with their real dashboard route context so route-owned namespaces load intentionally instead of producing false `/`-route i18n warnings. Validation PASS: `pnpm --filter web exec vitest run src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`.
- [x] `V1CONF-03 investigate(web-test-noise): isolate remaining AggregateError source after route-context cleanup`
  - 2026-04-23: Traced the remaining dashboard-table test noise to `DataTable` column-visibility hydration issuing `/dashboard/profile/basic` requests through `profileBasicCache`, then stabilized the Vitest harness with a default `profileBasicCache` mock for component tests. Validation PASS: `pnpm --filter web exec vitest run src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`.
- [x] `V1CONF-04 qa(confidence): rerun focused web confidence pack, guardrails, and selected go-live evidence where applicable`
  - 2026-04-23: Re-ran the full web confidence pack after the route-context and test-harness fixes. Validation PASS: `pnpm --filter web run test -- --run`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`. Residual signal noise is now limited to non-failing `I18nProvider` `act(...)` warnings and a few route-namespace warnings.
- [x] `V1CONF-05 docs(sync): refresh confidence findings in context and activation notes if any runtime-relevant truth changes`
  - 2026-04-23: Synchronized planning/context/learning docs so the remaining confidence work is narrowed to residual i18n signal cleanup instead of mixed dashboard/auth/DataTable noise.
- [x] `WALLETS-PAGE-ROUTE-CONTEXT-TEST-SIGNAL cleanup dashboard wallets route drift`
  - 2026-04-23: Aligned the dashboard wallets list page test with its real route context so i18n namespace loading matches runtime ownership instead of emitting avoidable `/`-route missing-key noise. Validation PASS: `pnpm --filter web exec vitest run src/app/dashboard/wallets/list/page.test.tsx`.
- [x] `AUTH-NAVIGATION-FALLBACK-REGRESSION lock delayed auth-route retry semantics`
  - 2026-04-23: Added a focused `navigateWithFallback()` regression pack so auth success navigation now explicitly proves one delayed retry on stuck auth routes, no retry after the browser already leaves the fallback route, and test-mode retry suppression for deterministic hook tests. Validation PASS: `pnpm --filter web exec vitest run src/lib/navigation.test.ts src/features/auth/hooks/useLoginForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx src/context/AuthContext.test.tsx src/lib/api.test.ts src/i18n/useOptionalI18n.test.tsx`.
- [x] `AUTH-REGISTER-HOOK-REGRESSION lock register request/session-confirmation outcomes`
  - 2026-04-23: Added a focused `useRegisterForm` regression pack so registration now proves request-failure handling, success redirect, and missing session-confirmation failure behavior symmetrically with the existing login-hook tests. Validation PASS: `pnpm --filter web exec vitest run src/features/auth/hooks/useRegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx`.
- [x] `AUTH-SESSION-UX-REGRESSION lock explicit expired-session and logout provider flows`
  - 2026-04-23: Added focused `AuthProvider` regression tests so the explicit `session=expired` hint now proves one-time warning behavior plus URL query cleanup after unauthorized refetch handling, and logout now proves `/auth/logout` post, local auth-state clearing, and redirect back to login. Validation PASS: `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/lib/api.test.ts src/i18n/useOptionalI18n.test.tsx`.
- [x] `AUTH-I18N-TEST-SIGNAL cleanup provider-backed auth translation test context`
  - 2026-04-23: Aligned `useOptionalI18n.test.tsx` with the real `/auth/login` route context so the auth regression pack no longer emits a false missing-namespace warning for auth translation keys. Validation PASS: `pnpm --filter web exec vitest run src/i18n/useOptionalI18n.test.tsx src/lib/api.test.ts src/context/AuthContext.test.tsx`.
- [x] `AUTH-INTERCEPTOR-REGRESSION lock protected-route auth-me redirect semantics`
  - 2026-04-23: Added a focused shared-API interceptor regression test so protected-route `/auth/me` behavior is now explicit for `401` session-expired redirect, `429` non-redirect handling, and repeated backend-failure fallback to `/`. Validation PASS: `pnpm --filter web exec vitest run src/lib/api.test.ts src/context/AuthContext.test.tsx src/i18n/useOptionalI18n.test.tsx`.
- [x] `AUTH-BOOTSTRAP-REGRESSION lock single auth bootstrap fetch across rerenders`
  - 2026-04-23: Added a focused `AuthProvider` regression test so providerless bootstrap auth now proves it performs only one initial `/auth/me` fetch across parent rerenders, complementing the optional-i18n fallback stabilization test. Validation PASS: `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/i18n/useOptionalI18n.test.tsx`.
- [x] `PROD-AUTH-HOTFIX stop providerless i18n fallback from looping auth bootstrap`
  - 2026-04-23: traced the remaining prod login bounce to repeated `/auth/me` calls from the login chunk, caused by `useOptionalI18n()` returning a fresh fallback translator on every render while `AuthProvider` bootstraps above route i18n providers. Memoized the fallback translator/object and locked the contract with a focused rerender-identity test. Validation PASS: `pnpm --filter web exec vitest run src/i18n/useOptionalI18n.test.tsx src/features/auth/hooks/useLoginForm.test.tsx`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- [x] `PROD-AUTH-HOTFIX prevent stale cached auth shells after deploy`
  - 2026-04-23: Reproduced production login successfully with direct API calls and browser automation, verified that the remaining drift vector was stale public auth page delivery, then marked `/auth/login` and `/auth/register` as dynamic/non-revalidated and locked the contract with a focused regression test. Validation PASS: `pnpm --filter web exec vitest run src/app/(public)/auth/authPageCacheContract.test.ts`, `pnpm run quality:guardrails`.
- [x] `V1FACT-FOLLOWUP3 formal sign-off closure`
  - 2026-04-22: Filled engineering/product/operations sign-offs and rollback owner in `docs/operations/v1-rc-signoff-record.md`, fixed the Gate 4 circular approval logic in `scripts/buildRcSignoffRecord.mjs`, and refreshed RC status/checklist to `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS`. Validation PASS: `pnpm run ops:rc:signoff:build -- --engineering-name "Patryk Wróblewski" --product-name "Patryk Wróblewski" --operations-name "Patryk Wróblewski" --owner-name "Patryk Wróblewski" --owner-contact "<redacted>"`, `pnpm run ops:rc:gates:status`, `pnpm run ops:rc:checklist:sync`.
- [x] `V1FACT-FOLLOWUP2 prod restore proof recovery + final non-dry-run gate`
  - 2026-04-22: Executed the prod restore drill inside Coolify production postgres (`x11cfnz1dd9x0yzccftqzcoe`), captured fresh PASS artifacts, fixed `scripts/runV1ReleaseGate.mjs` so same-day evidence picks the latest timestamped artifact instead of an older same-day file, and reran the full prod release gate without `--dry-run` to `PASS`. Remaining blocker is now formal `Gate 4` sign-off completion only. Validation PASS: `node --test scripts/runV1ReleaseGate.test.mjs`, `pnpm run quality:guardrails`, `pnpm run ops:release:v1:gate -- --environment prod --skip-local-quality --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --auth-email prod-ops-admin@luckysparrow.ch --auth-password <redacted>`, `pnpm run ops:rc:gates:status`, `pnpm run ops:rc:signoff:build`, `pnpm run ops:rc:checklist:sync`.
- [x] `V1FACT-FOLLOWUP prod gate truth refresh after real rollback/SLO evidence`
  - 2026-04-22: Refreshed production activation truth after generating a real prod rollback proof and fresh prod SLO evidence, closed `RC Gate 2` to `PASS`, and hardened `scripts/runV1ReleaseGate.mjs` so fresh proof artifacts count only when they explicitly report `Status: **PASS**`. Remaining blockers are now limited to the failing prod restore-drill proof (`PROD_DB_CHECK_*` env profile missing), missing named sign-offs, and one final non-dry-run prod gate execution after those inputs exist. Validation PASS: `node --test scripts/runV1ReleaseGate.test.mjs`, `pnpm run ops:rc:gates:status`, `pnpm run ops:rc:checklist:sync`, `pnpm run ops:rc:signoff:build`, `pnpm run ops:release:v1:gate -- --environment prod --dry-run --skip-local-quality --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`, `pnpm run quality:guardrails`.
- [x] `PROD-HOTFIX web auth base-url fallback for login/runtime API calls`
  - 2026-04-22: Closed a production login incident by adding browser-side API base inference for canonical Soar domains (`soar -> api`, `stage.soar -> stage-api`) and reusing the same resolver for auth/API and market-stream calls. Validation PASS: `pnpm --filter web exec vitest run src/lib/publicApiBaseUrl.test.ts`, `pnpm --filter web run build`, `pnpm --filter web run typecheck`, `pnpm run quality:guardrails`.
- [x] `V1FACT-A group closure (evidence-backed activation path published; candidate still blocked on operator-only inputs)`
  - 2026-04-22: Closed `V1FACT-A` as an engineering/doc wave by publishing the final activation packet plus closure record and leaving only explicit operator-owned blockers for prod proof artifacts and named sign-offs.
- [x] `V1FACT-11 docs(sync): close wave, sync canonical queue/context, and freeze future-agent activation rules`
  - 2026-04-22: Published `docs/operations/v1-production-activation-closure-2026-04-22.md`, synchronized queue/context to the final `CLOSED_WITH_OPERATOR_BLOCKERS` state, and froze future-agent rules so production activation cannot be inferred from stage success, public prod smoke, or fresh docs alone.
- [x] `V1FACT-A4 final activation pack + closure sync (V1FACT-10..V1FACT-11)`
  - 2026-04-22: Closed the final `V1FACT-A` slice by publishing both the consolidated activation packet and the closure record, and by narrowing the remaining production blockers to explicit operator-only inputs.
- [x] `V1FACT-10 qa(prod-pack): build final prod activation evidence pack and sign-off summary`
  - 2026-04-22: Published `docs/operations/v1-production-activation-pack-2026-04-22.md`, refreshed RC status/sign-off/checklist truth for the current day, and reduced remaining blockers to missing prod restore-drill proof, missing prod rollback-proof pack, open RC Gate 2, and missing named human approvers.
- [x] `V1FACT-07B inline runtime-freshness truth after authenticated stage rehearsal`
  - 2026-04-22: Closed the inline runtime-freshness blocker by aligning `WORKER_MODE=inline` readiness truth with actual worker demand, deploying SHA `49ea8e0c`, and rerunning authenticated stage rehearsal successfully with fresh stage artifacts.
- [x] `V1FACT-A3 rollback/backup proof as first-class gate inputs (V1FACT-08..V1FACT-09)`
  - 2026-04-22: Closed the third `V1FACT-A` slice by making prod backup/restore drill and rollback proof explicit release-gate evidence families, exposing canonical rollback-proof commands, and updating activation/runbook docs so stale or missing prod proof remains fail closed.
- [x] `V1FACT-A2 release-gate freshness + stage rehearsal evidence (V1FACT-04..V1FACT-07)`
  - 2026-04-22: Closed the second `V1FACT-A` slice by making release-gate evidence freshness explicit in `scripts/runV1ReleaseGate.mjs`, adding the canonical stage rehearsal entrypoint `scripts/runV1StageRehearsal.mjs`, fixing deploy-smoke target passthrough for both API and web URLs, and publishing fresh stage dry-run artifacts in `docs/operations/v1-release-gate-stage-2026-04-22T17-53-09-987Z.md` and `docs/operations/v1-stage-rehearsal-2026-04-22T17-53-09-987Z.md` with blockers kept explicit.
- [x] `V1FACT-A1 contract + audit + queue truth (V1FACT-01..V1FACT-03)`
  - 2026-04-22: Closed the first `V1FACT-A` slice by freezing the activation contract, auditing current operator evidence freshness in `docs/operations/v1-production-activation-evidence-audit-2026-04-22.md`, and advancing canonical queue/context to the stage-rehearsal + release-gate freshness slice.

- [x] `REVIEW-D1 runtime live opt-in admission truth (REVIEW-D-01..REVIEW-D-03)`
  - 2026-04-22: Closed the first `REVIEW-D` slice by excluding `LIVE` bots without `liveOptIn=true` from runtime signal topology in both repository and defaults-level admission, and by making runtime position automation skip non-opted-in live positions before any strategy lookup, DCA, or close path can run. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run quality:guardrails`.
- [x] `REVIEW-D2 orphan bot-origin automation fail-closed contract (REVIEW-D-04..REVIEW-D-05)`
  - 2026-04-22: Closed the second `REVIEW-D` slice by making runtime automation skip orphan `origin='BOT'` positions before any manual env-default mode/exchange/market fallback can apply, keeping BOT-origin orphan state explicit and unresolved. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `REVIEW-D3 canonical takeover-rebind ownership truth (REVIEW-D-06..REVIEW-D-07)`
  - 2026-04-22: Closed the third `REVIEW-D` slice by removing heuristic rebind for orphan `origin='BOT'` positions; takeover rebind now leaves bot-origin orphan state unresolved unless explicit canonical ownership proof exists, while `EXCHANGE_SYNC` api-key-based rebind stays deterministic. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `REVIEW-D4 readiness-truth hardening + closure evidence (REVIEW-D-08..REVIEW-D-10)`
  - 2026-04-22: Closed the final `REVIEW-D` slice by requiring versioned `API_KEY_ENCRYPTION_KEYS` for readiness and new encryption writes, keeping legacy `API_KEY_ENCRYPTION` as compatibility-only decrypt material, and publishing closure evidence in `docs/operations/review-d-live-opt-in-and-ownership-safety-closure-2026-04-22.md`. Validation PASS: focused `REVIEW-D` pack (`38/38 PASS`), `pnpm --filter api run typecheck`, `pnpm --filter api run build`, `pnpm run quality:guardrails`.
- [x] `REVIEW-D group closure (live opt-in admission truth, orphan bot-position fail-closed safety, canonical takeover rebind, and readiness-truth hardening)`
  - 2026-04-22: Closed `REVIEW-D` end-to-end by finishing all four remediation slices and publishing closure evidence in `docs/operations/review-d-live-opt-in-and-ownership-safety-closure-2026-04-22.md`.

- [x] `SAFEV1-A4 production rate-limit degradation hardening (SAFEV1-08..SAFEV1-09)`
  - 2026-04-22: Closed the fourth `SAFEV1-A` slice by locking prod degraded-mode behavior for rate limiting, adding Redis reconnect cooldown/retry behavior, and making production requests fail closed with explicit `503 + X-RateLimit-Degraded` instead of silently settling into indefinite local-only enforcement. Validation PASS: `pnpm --filter api exec vitest run src/middleware/rateLimit.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `SAFEV1-A group closure (live/paper runtime safety closure for V1)`
  - 2026-04-22: Closed `SAFEV1-A` end-to-end by completing all four remediation slices plus closure pack, publishing `docs/operations/safev1-a-live-paper-runtime-safety-closure-2026-04-22.md`, and passing the focused validation pack (`27/27 PASS`), `api typecheck`, `api build`, and `quality:guardrails`.
- [x] `SAFEV1-A3 canonical external ownership resolution (SAFEV1-06..SAFEV1-07)`
  - 2026-04-22: Closed the third `SAFEV1-A` slice by replacing symbol-only external ownership heuristics with an explicit `OWNED/AMBIGUOUS` contract, preferring canonical market-group scope over legacy-only bridges, and making manual runtime close fail closed on ambiguous ownership. Validation PASS: `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `SAFEV1-A2 fail-closed live capital truth (SAFEV1-04..SAFEV1-05)`
  - 2026-04-22: Closed the second `SAFEV1-A` slice by adding focused runtime-capital regressions and removing the forbidden live fallback to unrelated recent API keys on the same exchange. Validation PASS: `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `SAFEV1-A1 zero-entry reconciliation truth closure (SAFEV1-01..SAFEV1-03)`
  - 2026-04-22: Closed the first `SAFEV1-A` slice by freezing the runtime safety contract and blocking exchange reconciliation from creating or updating open synced positions when canonical entry truth is missing. Validation PASS: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`, `pnpm --filter api run typecheck`, `pnpm --filter api run build`.
- [x] `SAFEV1-A planning queued (V1 runtime safety closure for reconciliation, live capital truth, external ownership, and limiter degradation)`
  - 2026-04-22: Published `docs/planning/safev1-a-live-paper-runtime-safety-plan-2026-04-22.md`, froze permanent rules in `docs/architecture/reference/live-paper-runtime-safety-contract.md`, published audit evidence in `docs/operations/safev1-a-live-paper-runtime-safety-audit-2026-04-22.md`, and activated the new remediation family in canonical queue/context so future execution can close the remaining V1 runtime safety gaps without reconstructing intent from review notes.

- [x] `RELEASE-HARDEN-A group closure (canonical V1 release gate entrypoint)`
  - 2026-04-22: Closed `RELEASE-HARDEN-A` by adding `scripts/runV1ReleaseGate.mjs`, exposing `pnpm run ops:release:v1:gate`, publishing `docs/operations/v1-release-gate-runbook.md`, and aligning V1 release/smoke docs with the new canonical gate entrypoint. Validation PASS: `pnpm run ops:release:v1:gate -- --dry-run --base-url http://localhost:3001 --skip-go-live-smoke --skip-deploy-smoke --skip-runtime-freshness --skip-rollback-guard`, `pnpm run quality:guardrails`.
- [x] `REVIEW-C group closure (runtime-state replay truth + snapshot error normalization + reconciliation truth)`
  - 2026-04-22: Closed `REVIEW-C-01..REVIEW-C-07` end-to-end by deriving completed DCA replay state from canonical persisted position truth, normalizing authenticated exchange snapshot failures through one explicit operator error contract, replacing synthetic stale-order cancelation with explicit unresolved reconciliation truth, and publishing closure evidence in `docs/operations/review-c-runtime-state-and-reconciliation-closure-2026-04-22.md`. Validation PASS: focused runtime/positions pack, `api typecheck`, `api build`, `quality:guardrails`.
- [x] `REVIEW-B group closure (runtime/exchange production-readiness closure after XLIFE-A)`
  - 2026-04-22: Closed `REVIEW-B-01..REVIEW-B-08` end-to-end by moving DCA/add-leg execution onto canonical fill-result lifecycle, making submitted dedupe non-terminal until linked order truth is known, making exchange snapshots fail closed when multiple supported API keys exist unless `apiKeyId` is explicit, narrowing watchdog symbol scope to explicit Binance-futures contexts, and publishing closure evidence in `docs/operations/review-b-runtime-exchange-production-closure-2026-04-22.md`. Validation PASS: focused runtime/positions pack, `api typecheck`, `api build`, repo-wide `typecheck`, repo-wide `build`, `quality:guardrails`.
- [x] `REVIEW-B planning queued (post-XLIFE runtime/exchange production-readiness closure)`
  - 2026-04-22: Published `docs/planning/review-b-runtime-exchange-production-readiness-plan-2026-04-22.md` after the post-`XLIFE-A` review confirmed four remaining production risks: DCA lifecycle still bypassing canonical fill truth, submitted dedupe becoming terminal too early, generic exchange snapshots choosing ambiguous API-key ownership, and watchdog symbol scope being broader than its explicit Binance-only coverage.
- [x] `XLIFE-A group closure (one canonical PAPER/LIVE execution lifecycle, fill-truth accounting, and explicit runtime exchange-scope truth)`
  - 2026-04-22: Closed `XLIFE-A` end-to-end by making LIVE close flow fail-closed until canonical fill truth exists, switching runtime trade/PnL persistence to canonical fill price and quantity, persisting runtime-origin orders with `origin=BOT` so bot-opened positions keep ownership truth through the shared order-fill-position lifecycle, keeping runtime automation alive during submitted close state, and publishing closure evidence in `docs/operations/execution-lifecycle-parity-and-exchange-truth-closure-2026-04-22.md`. Validation PASS: focused XLIFE engine/runtime pack, `api typecheck`, `api build`, `quality:guardrails`.
- [x] `XLIFE-A planning queued (one canonical PAPER/LIVE execution lifecycle, fill-truth accounting, and explicit runtime exchange-scope truth)`
  - 2026-04-22: Executor-ready wave published in `docs/planning/execution-lifecycle-parity-and-exchange-truth-plan-2026-04-22.md` with one shared lifecycle target for `PAPER` and `LIVE`, explicit fill-truth over `markPrice`, no local close-before-fill rule, and explicit runtime exchange-scope hardening tasks.

- [x] `TRUTH-A execution-plan parity sync`
  - 2026-04-22: Corrected the remaining planning drift by marking `TRUTH-01..TRUTH-14` closed in `docs/planning/mvp-execution-plan.md` and confirming no residual unchecked tasks remained in canonical planning files.
- [x] `TRUTH-A group closure (fail-closed LIVE ownership + authenticated read contract truth + web guardrail truthfulness)`
  - 2026-04-22: Closed `TRUTH-A` end-to-end by removing the forbidden LIVE order fallback to unrelated recent API keys, introducing canonical authenticated exchange-read support truth (`BINANCE` supported, other exchanges explicit fail-closed per operation family), hardening runtime/dashboard copy guardrails to catch JSX prop literals and nullish fallback strings, migrating shared UI defaults (`ConfirmModal`, `DataTable`, `SearchableMultiSelect`) to canonical `public.sharedUi.*` i18n, and publishing closure evidence in `docs/operations/truth-a-live-safety-and-contract-truth-closure-2026-04-22.md`. Validation PASS: focused API tests, focused web guardrails test, `quality:guardrails`, `api build`, `web build`, `typecheck`.
- [x] `TRUTH-A planning queued (fail-closed LIVE key ownership + exchange contract truth + web guardrail truthfulness)`
  - 2026-04-22: Published executor-ready plan `docs/planning/truth-a-live-safety-and-contract-truth-plan-2026-04-22.md`, froze permanent remediation rules in `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`, and queued detailed follow-up tasks for LIVE key ownership safety, authenticated exchange-read contract truth, and JSX/presenter guardrail hardening.

- [x] `SCALE-17 docs(sync): publish closure evidence, future-agent coding rules, and residual backlog handoff`
  - 2026-04-22: Published `docs/operations/scale-cd-closure-evidence-2026-04-22.md`, synchronized canonical queue/context/planning status, and froze future-agent extension rules in `web-container-split-contract` plus module handoff docs.
- [x] `SCALE-16 test(web-seams): run focused parity/regression pack for dashboard and backtests seam extraction`
  - 2026-04-22: Focused dashboard/backtests seam pack passed (`31/31`) across `HomeLiveWidgets`, preview parity, `BacktestRunDetails`, `useBacktestRunCoreData`, and `backtestRunDetailsViewModel`; `quality:guardrails`, `web build`, and `web typecheck` all PASS.
- [x] `SCALE-15 refactor(web-backtests): extract trades analytics and tab presenters from BacktestRunDetails`
  - 2026-04-22: Extracted backtest trades analytics ownership into `useBacktestTradesAnalytics` and moved tab rendering ownership into `BacktestRunDetailsTabPanels` (`summary`, `markets`, `trades`, `raw`), leaving `BacktestRunDetails` as composition shell over seams. Validation: focused backtest tests + `web typecheck` + `web build` PASS.
- [x] `SCALE-14 refactor(web-backtests): extract timeline orchestration hook from BacktestRunDetails`
  - 2026-04-22: Extracted timeline chunk-loading, cursor progression, cache merge, in-flight request guard, and parity-failed symbol handling into `useBacktestTimelineOrchestration`; `BacktestRunDetails` now consumes the dedicated seam while preserving behavior. Validation: focused backtest tests + `web typecheck` + `web build` PASS.
- [x] `SCALE-13 refactor(web-dashboard): extract runtime tables and selected-bot summary presenters from HomeLiveWidgets`
  - 2026-04-22: Extracted runtime table column ownership from `HomeLiveWidgets` into `runtimeDataTablePresenters.tsx` and moved selected-bot sidebar summary/manual-order presenter assembly into `runtimeSidebarPresenters.ts`, leaving the container as composition-focused orchestration; focused dashboard tests, `web typecheck`, and `web build` passed.
- [x] `SCALE-12 refactor(web-dashboard): extract manual-order controller seam from HomeLiveWidgets`
  - 2026-04-22: Added canonical `useManualOrderController` seam for symbol/side/qty/price state, manual-context fetch, slider math, and submit lifecycle; rewired `HomeLiveWidgets` to compose this seam and passed focused dashboard tests plus `web typecheck` + `web build`.
- [x] `SCALE-11 docs(contract): freeze container/controller/view-model split contract for HomeLiveWidgets and BacktestRunDetails`
  - 2026-04-22: Added `docs/architecture/reference/web-container-split-contract.md`, linked it from architecture/module docs, and froze explicit ownership boundaries plus remaining extraction targets (`SCALE-13..15`).
- [x] `SCALE-B group closure (SCALE-06..SCALE-10)`
  - 2026-04-22: Closed exchange-access convergence wave by publishing the canonical duplicate-flow audit in `docs/operations/scale-b-exchange-access-audit-2026-04-22.md`, adding shared exchange read boundaries (`exchangePublicRead`, `exchangeAuthenticatedRead`, `exchangeMetadataContract`), rewiring symbol rules + manual-order context + positions snapshots + wallet metadata/balance preview to those boundaries, and passing focused exchange regression pack + `api typecheck` + `api build` + `quality:guardrails`.
- [x] `SCALE-A group closure (SCALE-01..SCALE-05)`
  - 2026-04-22: Completed anti-drift foundation slice by auditing guardrail allowlists against real pattern matches, removing stale local-copy/hardcoded/monolith exceptions from `scripts/repoGuardrails.mjs`, synchronizing maintainability inventory metrics to current hotspot reality, and freezing canonical exchange access ownership in `docs/architecture/reference/exchange-access-ownership-matrix.md` with links from architecture/module docs.
- [x] `SCALE-A planning queued (post-L10NQ anti-drift foundation: truthful guardrails, canonical exchange access, and web container ownership closure)`
  - 2026-04-22: Published `docs/planning/scalability-anti-drift-foundation-plan-2026-04-22.md`, froze the permanent anti-drift delivery rules in `docs/architecture/reference/scalability-anti-drift-delivery-contract.md`, and activated `SCALE-01..SCALE-17` in the canonical queue/context so future executors get one self-sufficient task packet per change instead of reconstructing context from multiple files.
- [x] `L10NQ-E-01..L10NQ-E-10 residual route-reachable i18n closure`
  - 2026-04-21: Closed the entire residual post-`CQLT` i18n wave by hardening route-reachable audit signal quality, migrating remaining public/profile/wallets/markets/backtests/shared UI copy to canonical namespaces, retiring local locale maps from `backtestRunDetails.copy.ts`, and passing closure gates (`i18n audit=0`, `quality:guardrails`, focused web i18n tests, `web build`, `typecheck`). Evidence published in `docs/operations/l10nq-e-residual-route-reachable-i18n-closure-2026-04-21.md`.
- [x] `L10NQ-E planning queued (residual route-reachable i18n debt closure + audit signal-quality hardening after CQLT closure)`
  - 2026-04-21: Published `docs/planning/l10nq-e-residual-route-reachable-i18n-closure-plan-2026-04-21.md` and activated `L10NQ-E-01..10` in canonical queue/context so the residual i18n audit debt is now an explicit execution wave instead of informal carry-over from `CQLT`.
- [x] CQLT-33 qa(closure): run full quality closure pack and publish maintainability delta evidence
  - 2026-04-21: Passed sequential DB-backed API closure suites for `orders`, `backtests`, and `bots`, then passed repository-wide `build`, `typecheck`, `quality:guardrails`, and refreshed `i18n:audit:route-reachable:web`; maintainability delta evidence published in `docs/operations/code-quality-maintainability-closure-2026-04-21.md`.
- [x] CQLT-34 docs(sync): update queue/context/module docs and capture post-wave coding rules for future agents
  - 2026-04-21: Synchronized queue/context/planning docs after the API maintainability wave and recorded the remaining closure blocker explicitly.
- [x] CQLT-32 docs(decision): freeze legacy bridge sunset list and mark compatibility-only code paths that remain intentional
  - 2026-04-21: Added explicit legacy bridge inventory and sunset rule to `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`.
- [x] CQLT-31 refactor(shared): replace forbidden hidden fallbacks in non-critical quality paths with explicit unresolved states where safe
  - 2026-04-21: Removed hidden `USDT` inference from bot update-path wallet context checks so unresolved ownership now fails closed instead of guessing base currency.
- [x] CQLT-30 docs(inventory): catalog fallback/default patterns as allowed, temporary, or forbidden
  - 2026-04-21: Added fallback classification matrix to the maintainability inventory covering allowed, temporary, and forbidden patterns.
- [x] CQLT-29 test(api): add focused regression packs for orders, bots, backtests, and exchange-rule access after service decomposition
  - 2026-04-21: Added focused non-DB API seam regressions for orders quantity rules, bot strategy-projection drift, backtest range helpers, and exchange connector factory bootstrap; the pack, `api build`, and `quality:guardrails` passed.
- [x] CQLT-28 refactor(api-exchange): centralize exchange/ccxt bootstrap and capability access behind narrower adapter entrypoints
  - 2026-04-21: Added one exchange connector factory for public/authenticated bootstrap and rewired orders to the canonical path.
- [x] CQLT-27 refactor(api-backtests): split range resolution, symbol preparation, report lifecycle, and timeline helpers out of backtests.service
  - 2026-04-21: Extracted backtest range/symbol preparation and report-lifecycle helpers into dedicated services while keeping compatibility re-exports in `backtests.service.ts`; `api build` stayed green.
- [x] CQLT-26 refactor(api-bots): split command validation, canonical bot context checks, and projection-drift helpers out of botsCommand.service
  - 2026-04-21: Extracted bot wallet-context validation and strategy-projection drift ownership into dedicated services, slimming `botsCommand.service.ts`.
- [x] CQLT-25 refactor(api-orders): split manual-order context, quantity-rule normalization, lifecycle authority, and persistence mapping out of orders.service
  - 2026-04-21: Extracted orders manual-context, quantity-rule, and lifecycle services plus canonical exchange-connector bootstrap, while preserving compatibility facade exports in `orders.service.ts`.

- [x] CQLT-24 test(web): run focused parity/regression pack for decomposed modules after each extraction
  - 2026-04-21: Ran the focused decomposition regression pack for `HomeLiveWidgets`, selected-bot preview parity, `BacktestRunDetails`, `BotsManagement`, and `WalletCreateEditForm` (`46/46 PASS`) while `web build` and `quality:guardrails` stayed green.
- [x] CQLT-23 refactor(web-wallets): split WalletCreateEditForm into form state, metadata preview/reset actions, and presentation sections
  - 2026-04-21: Extracted wallet form state helpers, metadata/preview/reset action helpers, and dedicated presentational sections under `apps/web/src/features/wallets/components/wallet-create-edit-form/`, reducing `WalletCreateEditForm.tsx` from 791 to 483 lines while keeping focused wallet create/edit/reset coverage green.
- [x] CQLT-22 refactor(web-bots): split BotsManagement and BotsMonitoringTab into tab controllers, tables, and summary sections
  - 2026-04-21: Extracted dedicated `BotsAssistantTab` plus monitoring presentational sections (`MonitoringQuickContextSection`, `MonitoringControlsSection`, `MonitoringQuickNavSection`, `MonitoringAsyncState`), reducing `BotsManagement.tsx` from 1093 to 826 lines and `BotsMonitoringTab.tsx` from 1078 to 890 lines while keeping focused bots-management tests, `web build`, and `quality:guardrails` green.
- [x] CQLT-21 refactor(web-backtests): split BacktestRunDetails into read-model hooks, chart helpers, and presentational sections
  - 2026-04-21: Extracted deterministic backtest detail view-model helpers into `apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.ts`, moved summary/timeline chart rendering into `apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx`, reduced `BacktestRunDetails.tsx` from 2037 to 1137 lines, and kept focused backtests tests, `web build`, and `quality:guardrails` green.
- [x] CQLT-20 refactor(web-dashboard): split HomeLiveWidgets into controller-owned orchestration plus smaller sections/helpers without behavior changes
  - 2026-04-21: Extracted runtime input, direction-pill, trade-action, and trade-reason UI helpers into `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeUiHelpers.tsx`, reduced `HomeLiveWidgets.tsx` to orchestration over the existing route modules, and kept focused dashboard-home tests, `web build`, and `quality:guardrails` green for the seam-first split.
- [x] CQLT-19 test(web): add focused regressions proving helper extraction preserves dashboard/bots rendering parity
  - 2026-04-21: Extended selected-bot `/dashboard` vs `/dashboard/bots/:id/preview` parity coverage with DCA ladder and runtime trade-label assertions, and aligned bots preview DCA formatting with the dashboard locale-aware formatter so the extracted shared-helper seam remains parity-safe.
- [x] CQLT-18 refactor(web-shared): centralize recurring async list/page boilerplate helpers for load-error-retry state
  - 2026-04-21: Added shared `runAsyncWithViewState` helper in `apps/web/src/lib/async.ts`, rewired scoped profile hooks, strategies list, and wallet form initial-load path to one `loading + error + retry` contract, extended async helper tests, and switched API keys retry from full reload to local refresh.
- [x] CQLT-17 refactor(web-shared): extract shared runtime badge/formatting helpers where dashboard and bots contracts match
  - 2026-04-21: Extracted shared runtime badge/formatting helpers into `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`, rewired dashboard home and bots monitoring to the same compact-age and status/side/lifecycle tone map, and added focused unit coverage for the shared helper contract.
- [x] CQLT-16 refactor(web-shared): extract canonical DCA ladder helper used by dashboard and bots monitoring
  - 2026-04-21: Extracted one shared DCA ladder renderer in `apps/web/src/features/shared/dcaLadderCell.tsx`, rewired dashboard home and bots monitoring to the same helper, added focused regression coverage for zero/planned/executed/custom-format cases, and hardened `repoGuardrails` so tracked-but-deleted files do not break guardrail runs during staged refactors.
- [x] CQLT-12..CQLT-14 profile/strategies/wallets i18n copy migration
  - 2026-04-21: Moved profile copy dictionaries, strategy list labels, and wallet-form locale maps to canonical namespaces (`dashboard-shell`, `dashboard-strategies`, `dashboard-wallets`), removed the corresponding production guardrail allowlist entries, and kept `pnpm run quality:guardrails` green after exception removal.
- [x] CQLT-15 planning split for executable route-parity closure
  - 2026-04-21: Replaced the single blocked `CQLT-15` umbrella with executable subtasks `CQLT-15A..C` covering tooling restoration, focused migrated-route i18n regressions, and final route-reachable audit closure in the same architecture-safe order required by the project.
- [x] CQLT-15A..C route-parity closure for migrated CQLT-C slice
  - 2026-04-21: Restored local workspace dependencies, added focused route/i18n regression locks for profile/strategies/wallets migrations, generated the route-reachable audit artifact, and passed `web build`, `web typecheck`, `web i18n tests`, and `quality:guardrails`.
- [x] CQLT-11 shared i18n fallback foundations
  - 2026-04-21: Added canonical `dashboard.shared.*` copy, moved `AuthContext` toast strings to i18n-aware resolution, and removed the hardcoded `handleError` default fallback by switching it to shared translation-backed fallback with caller override support.
- [x] CQLT-B group closure (`CQLT-06..CQLT-10`)
  - 2026-04-21: Added repository guardrails that block new production-local copy dictionaries, raw user-facing hardcoded UI literals, and non-allowlisted `1000`+ line monoliths; published the active exception policy in `docs/governance/code-quality-guardrails.md`; and added the duplicate-helper snapshot artifact under `docs/modules/`.
- [x] CQLT-A group closure (`CQLT-01..CQLT-05`)
  - 2026-04-21: Published the maintainability remediation contract in `docs/architecture/reference/maintainability-remediation-contract.md`, recorded concrete web/API/monolith inventories in `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`, and updated the active CQLT plan with frozen extraction-order rules before refactor work.

- [x] ARCCON group closure (`ARCCON-01..ARCCON-12`)
  - 2026-04-21: Closed architecture-conformance wave end-to-end by removing hidden manual-order strategy fallback, locking wallet+market-universe canonical precedence in bot ownership checks, formalizing worker ownership contract (`inline|worker`) in bootstrap and `/workers/health|ready`, hardening backtest report lifecycle to explicit `runLifecycle` pending/degraded semantics, and removing `/dashboard/bots` i18n leakage into `dashboard.home.*`. Closure validation PASS: `api focused tests (52/52)`, `web focused bots tests (15/15)`, `api/web typecheck`, `api/web build`, `quality:guardrails`.
- [x] CQLT planning queued (code-quality and maintainability remediation)
  - 2026-04-21: Added `docs/planning/code-quality-maintainability-remediation-plan-2026-04-21.md` and synchronized canonical queue/context so a future executor can reduce hardcoded copy, oversized modules, duplicated helpers, spread exchange bootstrap ownership, fallback drift, and async controller boilerplate in tiny, regression-safe slices.
- [x] ARCCON planning queued (architecture conformance remediation)
  - 2026-04-21: Added `docs/planning/architecture-conformance-remediation-plan-2026-04-21.md` and synchronized canonical queue/context so the next safe execution wave can close architecture drift only where code still violates canonical source-of-truth ownership, split-worker runtime-service contracts, async backtest report lifecycle clarity, or route-level i18n ownership.
- [x] DOCARC-02 architecture top-level cleanup and temp artifact removal
  - 2026-04-21: Reduced `docs/architecture/` top-level to the numbered
    canonical core plus `reference/` and `archive/`, moved active supporting
    contracts into `reference/`, moved superseded and compatibility-only files
    into `archive/`, updated repository-wide links and agent entrypoints to
    the new paths, and removed the untracked local `.tmp/` audit artifact
    folder.
- [x] DOCARC-01 canonical architecture documentation restructure
  - 2026-04-21: Rebuilt `docs/architecture/` into a numbered canonical set for
    Soar behavior and runtime invariants, moved non-canonical
    closure/remediation files to `docs/architecture/archive/`, converted old
    overview files to compatibility stubs, normalized docs indexes to the new
    reading order, reduced `docs/planning/open-decisions.md` to
    unresolved-only usage, and added agent-facing documentation governance
    workflow rules in `.agents` and `.codex` so architecture truth is no
    longer split across planning, modules, and legacy architecture notes.
- [x] UOLF-HF-01 fill-price integrity hotfix (`UOLF` regression closure)
  - 2026-04-21: Closed regression where `MARKET` lifecycle could open positions with zero entry by hardening order-fill-position transition to require positive resolved fill price, propagating runtime `markPrice` into order-open command payloads (`open/close/DCA`), adding dashboard manual-order MARKET price fallback to reference price, and locking coverage with focused API/web regressions plus deploy gates (`api/web typecheck`, `api/web build`, `quality:guardrails`).
- [x] PLNC-D planning parity sync (`PLNC-09`)
  - 2026-04-20: Synchronized stale `mvp-execution-plan` closure drift by marking `DAWR`, `OOSC`, `BTCF`, and `UOLF` phase headers as `Closed` and aligning `UOLF-02..UOLF-15` checklist status with canonical closure already recorded in queue/context artifacts.
- [x] WAPR group closure (`WAPR-02..WAPR-10`)
  - 2026-04-20: Closed wallets list + paper reset wave end-to-end by shipping row-only wallets table (`no Details`) with inline deterministic `API key` status (`Connected/Not connected`), dedicated fail-closed `POST /dashboard/wallets/:id/reset-paper`, reset-aware paper-capital baseline using wallet checkpoint (`paperResetAt`), paper-only reset action in wallet edit flow with deterministic UX states, and closure pack PASS (`api wallets.e2e`, `web wallets tests`, `api/web typecheck`, `quality:guardrails`).
- [x] WAPR-01 docs(contract): freeze wallets list api-key column and paper-reset safety contract
  - 2026-04-20: Frozen canonical `WAPR` contract in `open-decisions` and wallet module docs (`api-wallets`, `web-wallets`) with explicit list-table scope (`no Details`, inline `API key` column between `Allocation` and `Actions`, deterministic `Connected/Not connected` mapping) and dedicated fail-closed non-destructive paper-reset command baseline (`POST /dashboard/wallets/:id/reset-paper`, reset-checkpoint capital semantics).
- [x] UOLF group closure (`UOLF-02..UOLF-15`)
  - 2026-04-20: Closed unified order lifecycle wave end-to-end by locking selected-bot manual-order scope regressions, enforcing canonical bot context on order open, introducing shared order-fill-position lifecycle handling (`order -> fill -> position`) for manual/runtime paths, adding runtime `submitted/waiting_fill` semantics, aligning dashboard copy/statuses, and completing closure validation pack (`api UOLF test matrix`, `HomeLiveWidgets + preview parity`, `api/web typecheck`, `build`, `quality:guardrails`, `test:go-live:smoke`).
- [x] WAPR planning queued (wallets list api-key status + paper reset safety)
  - 2026-04-20: Added `docs/planning/wallets-list-paper-reset-safety-plan-2026-04-20.md` and queued `WAPR-01..WAPR-10` for wallet-list simplification (`remove Details`, add inline `API key` status column) plus dedicated non-destructive `PAPER` wallet reset with reset-aware capital baseline, fail-closed guards, focused API/web regressions, and closure validation.
- [x] UOLF-01 docs(contract): supersede manual-order order-only contract with unified order-fill-position lifecycle
  - 2026-04-20: Frozen canonical `UOLF` contract in `open-decisions` and module deep-dives (`api-orders`, `api-bots`, `web-dashboard-home`), explicitly superseding historical `SOPR-C order-only` wording with unified lifecycle target (`order -> fill -> position`), strict selected-bot scope, and wallet-scoped exchange takeover ownership expectations.
- [x] UOLF planning queued (unified order lifecycle + exchange-sync parity)
  - 2026-04-20: Added `docs/planning/unified-order-lifecycle-and-exchange-sync-plan-2026-04-20.md` and queued `UOLF-01..UOLF-15` to replace the superseded `order-only` target with one exchange-native lifecycle (`order -> fill -> position`) across manual and bot entries, tighten selected-bot context, align Binance adapter/pretrade rules, restore external exchange import parity for wallet-owned bots, and require a focused real-money safety pack before closure.
- [x] BTCF-01 docs(contract): freeze backtests list columns and explicit time-window create contract
  - 2026-04-20: Locked canonical backtests list/create contract in `open-decisions` and module docs (`web-backtest`, `api-backtests`) with exact list-column set (`Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`), explicit create range fields (`startAt/endAt`), slider bounds (`250..10000`), and legacy run compatibility requirement.
- [x] BTCF planning queued (`BTCF-01..BTCF-12`)
  - 2026-04-20: Added `docs/planning/backtests-list-create-time-window-remediation-plan-2026-04-20.md` and synchronized canonical queue (`mvp-next-commits` + `mvp-execution-plan`) for backtests list contract update, create-form 3-column time-window UX, backend explicit range execution path, i18n sync, and closure validations.
- [x] BTCF-A group closure (`BTCF-01..BTCF-04`)
  - 2026-04-20: Closed list-contract wave by adding API regression for enriched list rows (`strategyName`, `markets`, `initialBalance`), implementing list payload enrich on API, and switching web runs table to canonical columns (`Strategy`, `Markets`, `Init balance`, `Status`, `Start`, `Actions`) with focused API+web test coverage.
- [x] BTCF-B group closure (`BTCF-05..BTCF-09`)
  - 2026-04-20: Closed create/runtime-range wave by adding create-form regressions for `startAt/endAt` + md 3-column layout + `250..10000` bounds, implementing deterministic range/candle sync in web create form, extending API create DTO validation and persisted seed contract with explicit range fields, and wiring backtest job/gateway/timeline read path to use configured `startAt/endAt` boundaries while preserving legacy-run fallback compatibility.
- [x] BTCF-C group closure (`BTCF-10..BTCF-12`)
  - 2026-04-20: Closed i18n/docs/qa wave by completing `en/pl/pt` copy parity for new list/create keys, synchronizing `web-backtest` + `api-backtests` + `trading-logic` docs to explicit range semantics, and passing closure pack (`backtests api/web tests`, `api/web typecheck`, `api/web build`, `quality:guardrails`, `i18n:audit:route-reachable:web`).
- [x] PLNC-C planning parity closure (`PLNC-06..PLNC-08`)
  - 2026-04-20: Closed stale planning-status sweep by syncing closed-wave statuses (`UXR-I`, `DAGG`, `SBSC`, `UXR`, `POS`, `PLNC`, `V1/LBT`), updating `mvp-execution-plan` phase headers to closed (`PLNC`, `ARC`, `POS`, `OPV`, `UXR-I`, `UXR-J`), and reconciling `planning-catalog-index` classifications with canonical closure state.
- [x] OOSC-C group closure (`OOSC-07..OOSC-08`)
  - 2026-04-20: Synchronized OOSC rollout state across planning/context docs and completed focused closure validation (`orders-positions.e2e`, `bots.monitoring-aggregate.e2e`, `HomeLiveWidgets.test`, `HomeLiveWidgets.open-orders-source.test`, `api/web typecheck`, `quality:guardrails`).
- [x] OOSC-B group closure (`OOSC-04..OOSC-06`)
  - 2026-04-20: Added dashboard Open Orders `Source` column with deterministic mapping (`USER/BOT/EXCHANGE_SYNC|BACKTEST -> Manual/Bot/Imported`), shipped i18n keys for `en/pl/pt`, and locked web regression coverage in `HomeLiveWidgets.test.tsx`.
- [x] OOSC-A group closure (`OOSC-01..OOSC-03`)
  - 2026-04-20: Closed contract + API origin plumbing by adding regressions and implementation for explicit manual-order persistence (`origin=USER`) and runtime open-orders origin projection in both session and aggregate responses.
- [x] OOSC-01 docs(contract): freeze dashboard open-orders source-column and active-only status contract
  - 2026-04-20: Frozen canonical Open Orders `Source` mapping (`USER/BOT/EXCHANGE_SYNC/BACKTEST` -> `Manual/Bot/Imported`), locked explicit manual-order write-origin requirement (`origin=USER`), and confirmed unchanged active-only Open Orders status scope (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) in `open-decisions`, `api-orders`, and `web-dashboard-home`.
- [x] OOSC planning queued (open-orders source column + active-only status contract)
  - 2026-04-20: Added `docs/planning/dashboard-open-orders-source-column-plan-2026-04-20.md` and queued `OOSC-01..OOSC-08` for executor delivery. Scope is locked to dashboard Open Orders `Source` column (`Manual/Bot/Imported`), explicit manual-order write origin (`USER`), and preserving active-only order visibility (`PENDING`, `OPEN`, `PARTIALLY_FILLED`) with no new orders-history table.
- [x] EXTM-01 wallet-scoped external position takeover contract
  - 2026-04-20: Added `Wallet.manageExternalPositions` as the bot-facing takeover switch (with DB backfill from legacy API-key takeover flag), wired runtime reconciliation ownership to wallet-scoped takeover intent first (legacy API-key fallback preserved), and extended wallet create/edit web UX + tests so external exchange positions can be explicitly managed per LIVE wallet context.
- [x] DEPFIX-01 web deploy lint hotfix
  - 2026-04-20: Unblocked Coolify web build for commit `b345a009` by removing `@typescript-eslint/no-explicit-any` violations in new dashboard regression tests (`HomeLiveWidgets.aggregate-wallet.test.tsx`, `RuntimeSidebarSection.test.tsx`) with no behavior changes.
- [x] PLNC-B planning parity sync (`PLNC-05`)
  - 2026-04-20: Reconciled stale `DASHR-01..DASHR-11` unchecked checklist drift in `docs/planning/mvp-execution-plan.md` with canonical closure state already recorded in `mvp-next-commits` and `TASK_BOARD`; phase is now explicitly marked closed with completion log.
- [x] DAWR-A group closure (`DAWR-01..DAWR-03`)
  - 2026-04-20: Closed Stage A end-to-end by freezing aggregate wallet-summary + strategy sidebar null/mismatch edge contract (`open-decisions`, `api-bots`, `web-dashboard-home`), adding API aggregate regression locks for `positions.summary.referenceBalance/freeCash`, and extending aggregate projection with parity fields (latest capital context, explicit `null` on unresolved in empty aggregate). Validation PASS: `bots.monitoring-aggregate.e2e`, `api typecheck`, `api build`.
- [x] DAWR-B group closure (`DAWR-04..DAWR-07`)
  - 2026-04-20: Closed Stage B end-to-end by adding aggregate-success LIVE wallet regression coverage in `HomeLiveWidgets.aggregate-wallet`, adding dedicated sidebar edge tests for `strategyId` null/mismatch in `RuntimeSidebarSection`, and tightening sidebar precedence so canonical runtime topology remains first source when canonical mapping exists.
- [x] DAWR-C group closure (`DAWR-08..DAWR-10`)
  - 2026-04-20: Closed Stage C by documenting strategy-drift audit/repair triage in ops + module docs, synchronizing planning queue/status files, and completing closure validation pack (`api aggregate e2e`, `web HomeLiveWidgets + HomeLiveWidgets.aggregate-wallet + RuntimeSidebarSection tests`, `api/web typecheck`, `quality:guardrails`).
- [x] DAWR planning queued (`DAWR-01..DAWR-10`)
  - 2026-04-20: Added `docs/planning/dashboard-aggregate-wallet-strategy-regression-plan-2026-04-20.md` and synchronized canonical queue (`mvp-next-commits` + `mvp-execution-plan`) to fix aggregate LIVE wallet KPI contract drift, strategy sidebar null/mismatch edge behavior, and planning-status synchronization.
- [x] MURC group closure (`MURC-01..MURC-12`)
  - 2026-04-20: Closed market-universe symbol contract parity end-to-end by freezing canonical formula (`final = unique(filter_result U whitelist) - blacklist`) in open decisions + module docs, unifying API consumers (markets sync, bot auto-group, runtime, backtests, manual-order context) on shared resolver path, aligning web preview/validation to allow valid empty sets, adding parity regressions (including runtime/backtest/manual-context and web empty-preview submit), splitting oversized bots e2e coverage into dedicated `bots.market-universe-contract.e2e.ts` to satisfy repository size guardrails, and completing closure validation pack (`api full tests`, `web full tests`, `api/web typecheck`, `quality:guardrails`).
- [x] SOPR-C group closure (`SOPR-09..SOPR-12`)
  - 2026-04-19: Closed manual-order semantics as explicit `order-only` contract with audit-safe metadata, shipped contract regressions (`orders.service.test.ts`, `orders-positions.e2e.test.ts`), completed closure validation pack (`api/web full tests`, `typecheck`, `lint`, `build`, `guardrails`, `route-reachable i18n audit`), and synchronized canonical queue/context to move focus to `MURC`.
- [x] SOPR-B group closure (`SOPR-05..SOPR-08`)
  - 2026-04-19: Locked selected-bot `/dashboard` vs `/dashboard/bots/:id/preview` parity via dedicated web regression, ensured runtime blocked-diagnostics visibility in API parity tests, and published parity evidence matrix artifacts under `docs/operations/`.
- [x] SOPR-A group closure (`SOPR-01..SOPR-04`)
  - 2026-04-19: Hardened signal-context source-of-truth by removing cross-bot global fallback, exposing explicit source tags (`latest_signal`, `configured_fallback`, `unresolved`), and locking selected-bot signal-card scope regressions in API+web suites.
- [x] SOPR-01 Lock consolidated source-of-truth and parity contract for signals/open flows after DAGG+SBSC
  - 2026-04-19: Published consolidated selected-bot signals/open-runtime parity contract in canonical docs (`open-decisions`, `web-dashboard-home`, `api-bots`, `api-orders`) with explicit prerequisite baseline (`DAGG`, `SBSC`), signal-context precedence, runtime no-open diagnostics visibility, and manual-order semantic baseline before `SOPR-09`.
- [x] MURC planning queued (`MURC-01..MURC-12`)
  - 2026-04-19: Added `docs/planning/market-universe-symbol-contract-parity-plan-2026-04-19.md` and synchronized canonical queue (`mvp-next-commits` + `mvp-execution-plan`) as post-`SOPR` follow-up to fix symbol-composition drift across markets sync, runtime, backtests, manual-order context, and web preview/validation.
- [x] SBSC-C group closure (`SBSC-07..SBSC-08`)
  - 2026-04-19: Focused SBSC closure pack PASS (`bots.runtime-scope.e2e`, `bots.e2e`, `HomeLiveWidgets`, `api/web typecheck`) and canonical queue/context synchronized; `SOPR-01` promoted to active queue.
- [x] SBSC-B group closure (`SBSC-04..SBSC-06`)
  - 2026-04-19: Added deterministic API drift diagnostics (`GET /dashboard/bots/strategy-drift`) plus idempotent safe repair path (`POST /dashboard/bots/strategy-drift/repair`) and locked sidebar `Market + Strategy` switch parity in web regression.
- [x] SBSC-A group closure (`SBSC-01..SBSC-03`)
  - 2026-04-19: Locked source-of-truth contract and fixed list/get projection precedence to canonical runtime links first, with explicit API parity regression for list/get vs runtime-graph strategy alignment.
- [x] SBSC-08 Publish closure sync for sidebar strategy parity phase
  - 2026-04-19: Synced `mvp-next-commits`, `mvp-execution-plan`, `TASK_BOARD`, and `PROJECT_STATE` with SBSC closure evidence.
- [x] SBSC-07 Run focused sidebar parity api+web validation pack
  - 2026-04-19: PASS:
    - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.e2e.test.ts --run`
    - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
- [x] SBSC-06 Lock dashboard sidebar strategy/market switch parity regression (two bots, different strategies)
  - 2026-04-19: Extended `HomeLiveWidgets` switch regression assertions to lock simultaneous `Market` and `Strategy` context update on selected-bot change.
- [x] SBSC-05 Add safe drift-repair path aligning legacy linkage with canonical strategy
  - 2026-04-19: Added user-scoped idempotent reconciliation endpoint (`POST /dashboard/bots/strategy-drift/repair`) with API e2e coverage.
- [x] SBSC-04 Add deterministic drift audit for bots with legacy/canonical strategy divergence
  - 2026-04-19: Added deterministic audit endpoint (`GET /dashboard/bots/strategy-drift`) with projection/canonical/legacy divergence flags and API e2e coverage.
- [x] SBSC-03 Make listBots/getBot strategy projection canonical-first and runtime-graph compatible
  - 2026-04-19: `mapBotResponse` and bot read projection now resolve strategy from canonical active+enabled market-group links first; legacy used only as fallback.
- [x] SBSC-02 Add API regression for listBots.strategyId vs runtime-graph primary strategy mismatch
  - 2026-04-19: Added API e2e regression in `bots.runtime-scope.e2e.test.ts` that reproduces legacy/canonical divergence and asserts list/get parity with runtime-graph primary strategy.
- [x] SBSC-01 Freeze sidebar strategy source-of-truth and projection parity rules
  - 2026-04-19: Frozen contract in canonical docs (`open-decisions`, `web-dashboard-home`, `api-bots`).
- [x] DAGG-C group closure (`DAGG-09..DAGG-10`)
  - 2026-04-19: Closed preview-vs-dashboard aggregate parity by adding cross-route selected-bot parity regression and completing focused closure pack (`api aggregate e2e`, `web aggregate parity tests`, `api/web typecheck`, `web build`, `quality:guardrails`) with canonical queue/context sync.
- [x] DAGG-10 Run focused aggregate parity closure pack and sync canonical queue/context
  - 2026-04-19: Focused `DAGG` closure pack PASS:
    - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
    - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm --filter web run build`
    - `pnpm run quality:guardrails`
- [x] DAGG-09 Add /dashboard vs /preview selected-bot parity regression scenario
  - 2026-04-19: Added cross-route web regression in `HomeLiveWidgets.preview-parity.test.tsx` that renders `/dashboard` (`HomeLiveWidgets`) and `/dashboard/bots/:id/preview` (`BotsManagement` locked to monitoring) on shared runtime mocks, proving selected-bot aggregate history/trade parity and no cross-bot leakage in both views.
- [x] DAGG-B group closure (`DAGG-05..DAGG-08`)
  - 2026-04-19: Closed aggregate history/API hardening scope end-to-end by adding closed-positions history table in dashboard history tab, locking selected-bot history re-scope regressions in `HomeLiveWidgets`, adding mixed-session aggregate API regression, and hardening aggregate deterministic ordering with timestamp+id tie-break semantics.
- [x] DAGG-A group closure (`DAGG-01..DAGG-04`)
  - 2026-04-19: Closed aggregate selected-bot source migration by enforcing aggregate-first dashboard runtime loading (with fallback), aligning runtime view-model derivation to aggregate payload (`positions/orders/trades`), and locking RUNNING-empty-session history parity regression.
- [x] DAGG-08 Harden aggregate API determinism for dashboard table contract
  - 2026-04-19: Added deterministic timestamp+id tie-break ordering for aggregate `openItems`, `historyItems`, `openOrders`, and `trades.items` in `runtimeMonitoringAggregateRead.service.ts`.
- [x] DAGG-07 Add aggregate API regression for positions/orders/history counts across mixed session statuses
  - 2026-04-19: Added focused e2e coverage (`bots.monitoring-aggregate.e2e.test.ts`) for mixed-session aggregate contract (`RUNNING` empty + older `COMPLETED` history) including deterministic history/trade order assertions across repeated calls.
- [x] DAGG-06 Lock dashboard history positions/trades parity and selected-bot switch behavior
  - 2026-04-19: Added `HomeLiveWidgets` regressions for aggregate history positions/trades visibility and immediate selected-bot re-scope in history tab.
- [x] DAGG-05 Add aggregate closed-positions table in dashboard history tab
  - 2026-04-19: Added dedicated closed-positions DataTable to dashboard history tab with deterministic empty-state and persistent sort/column preferences.
- [x] DAGG-04 Align dashboard runtime view-model/table derivation to aggregate payload
  - 2026-04-19: Runtime selection view-model now derives session-sensitive trade/KPI state from aggregate session domain (`selected.trades.sessionId` + `actionSessionId`) without dropping valid aggregate rows.
- [x] DAGG-03 Switch dashboard selected-bot runtime loading to aggregate endpoint
  - 2026-04-19: Dashboard controller now loads selected-bot aggregate runtime payload by default and applies deterministic local trade query derivation for table filters/sort/pagination.
- [x] DAGG-02 Add failing web regression for selected-bot aggregate parity when RUNNING session is empty
  - 2026-04-19: Added web regression proving aggregate history remains visible when current `RUNNING` session is empty and older session contains closed history.
- [x] DAGG-01 Freeze /dashboard aggregate selected-bot runtime contract (positions/orders/history)
  - 2026-04-19: Contract linkage is frozen in canonical docs (`open-decisions`, `web-dashboard-home`, `web-bots`) and enforced by implementation evidence from `DAGG-A`.
- [x] SOPR planning queued (`SOPR-01..SOPR-12`)
  - 2026-04-19: Added `docs/planning/signals-open-runtime-parity-plan-2026-04-19.md` and synchronized canonical queue (`mvp-next-commits` + `mvp-execution-plan`) as post-`DAGG`/`SBSC` follow-up for selected-bot signal context parity, dashboard-vs-preview parity, runtime no-open diagnostics clarity, and manual-order lifecycle semantics closure.

- [x] SBSC planning queued (`SBSC-01..SBSC-08`)
  - 2026-04-19: Added `docs/planning/dashboard-sidebar-strategy-contract-plan-2026-04-19.md` and synchronized canonical queue (`mvp-next-commits` + `mvp-execution-plan`) as post-`DAGG` follow-up for selected-bot sidebar strategy source-of-truth parity.

- [x] DAGG planning queued (`DAGG-01..DAGG-10`)
  - 2026-04-19: Added `docs/planning/dashboard-aggregate-selected-bot-view-plan-2026-04-19.md` and synchronized canonical queue (`mvp-next-commits` + `mvp-execution-plan`) to implement aggregate selected-bot contract for dashboard `positions/orders/history`.

- [x] DASHR-C group closure (`DASHR-09..DASHR-11`)
  - 2026-04-19: Closed signal execution diagnostics path and `DASHR` closure pack end-to-end; runtime now emits explicit `PRETRADE_BLOCKED` event for ignored orchestration outcomes and closure validation passed (`bots.e2e`, `bots.runtime-scope.e2e`, `runtimeSignalDecisionEngine`, `orders.service`, `runtime-history-parity`, `runtimeFinalCandleDecision`, `HomeLiveWidgets`, api/web typecheck, web build, guardrails).
- [x] DASHR-B group closure (`DASHR-05..DASHR-08`)
  - 2026-04-19: Closed positions/history/signals selected-bot parity by preserving carry-over history rows for default window, guarding web history against mismatched `sessionId`, and locking legacy signals enrichment to canonical ACTIVE+enabled selected-bot market-group scope.
- [x] DASHR-11 Run focused closure pack and sync canonical queue/context
  - 2026-04-19: Focused `DASHR` closure pack PASS and canonical queue/context synchronized.
- [x] DASHR-10 Restore signal->order->position path or explicit blocked diagnostics
  - 2026-04-19: Added explicit blocked-path runtime diagnostics (`PRETRADE_BLOCKED`) for ignored orchestration outcomes to keep condition-met flow fail-closed and observable.
- [x] DASHR-09 Reproduce condition-met but no-order/no-position execution gap with runtime/order regressions
  - 2026-04-19: Added runtime final-candle regression lock for condition-met ignored outcomes and explicit blocked-reason event persistence.
- [x] DASHR-08 Enforce selected-bot scope in runtime symbol/strategy enrichment consumed by dashboard signals
  - 2026-04-19: Tightened legacy `botStrategy` enrichment so selected-bot signal strategy context is sourced only from symbol groups linked to ACTIVE+enabled canonical bot market-groups.
- [x] DASHR-07 Lock selected-bot-only signals markets/strategy scope with regression tests
  - 2026-04-19: Added API e2e regression lock excluding paused legacy `botStrategy` symbol-groups from selected-bot symbol-stats payload.
- [x] DASHR-06 Align selected session/snapshot mapping for dashboard positions and history tabs
  - 2026-04-19: Fixed API/web runtime mapping so completed-session carry-over history remains visible in default dashboard window and mismatched trades payload `sessionId` cannot leak rows into selected session snapshot.
- [x] DASHR-05 Reproduce positions/history mismatch between runtime module and dashboard selected snapshot (api+web red tests)
  - 2026-04-19: Added focused API+web regressions for carry-over history parity and selected-session mismatch guard behavior.
- [x] DASHR-A group closure (`DASHR-01..DASHR-04`)
  - 2026-04-19: Stage A closed with web parity evidence: orders tab now uses DataTable with deterministic empty state, selected-bot strategy context refresh is deterministic on bot switch, and selected-bot section layout order/spacing is locked (`KPI -> selector -> market/strategy`, `mt-6`).
- [x] DASHR-04 Fix selected-bot strategy refresh and apply requested selected-bot section spacing/layout order
  - 2026-04-19: Sidebar strategy context now prefers selected bot `strategyId` from runtime graph links (with legacy fallback), selector row moved below KPI row, and requested `mt-6` spacing applied to selector and context cards.
- [x] DASHR-03 Replace dashboard orders placeholder with DataTable + deterministic empty state
  - 2026-04-19: Replaced open-orders placeholder panel with shared DataTable contract (sorting, pagination, column-visibility preferences) and deterministic empty-state copy.
- [x] DASHR-02 Add failing web regression for orders-tab table rendering and selected-bot strategy refresh
  - 2026-04-19: Added focused dashboard regressions in `HomeLiveWidgets.test.tsx` for orders-table rendering and selected-bot strategy-context switching (`Alpha/Beta`) and stabilized helper default runtime-graph mock to avoid overriding per-test custom graphs.
- [x] DASHR-01 Freeze dashboard runtime parity contract for positions/orders/history/signals/selected-bot section
  - 2026-04-19: Frozen `DASHR` contract in canonical docs (`open-decisions`, `web-dashboard-home`) with strict selected-bot scope for `signals/strategy`, table-first `orders` tab contract (including deterministic empty state), `positions/history` selected-session parity expectation, and selected-bot panel layout order (`KPI -> selector -> market/strategy`) plus `mt-6` spacing lock.
- [x] DASHR planning queued (`DASHR-01..DASHR-11`)
  - 2026-04-19: Added `docs/planning/dashboard-runtime-data-parity-recovery-plan-2026-04-19.md` and synchronized canonical queue (`mvp-next-commits` NOW/NEXT/PIPELINE) to unblock executor with strict scope lock on reported dashboard runtime issues only.

- [x] UXR-J-C group closure (`UXR-J-08`)
  - 2026-04-19: Closure pack PASS (`DataTable + bots/backtests/profile/logs/home focused suite: 25/25`, `web typecheck`, `web build`) and canonical queue/context synchronized.
- [x] UXR-J-B group closure (`UXR-J-05..UXR-J-07`)
  - 2026-04-19: Locked shared table regression coverage (`DataTable`, `TableUi`) and aligned consuming table suites (`bots`, `backtests`) to module-tone contract (`runtime/preview` => `text-accent`).
- [x] UXR-J-A group closure (`UXR-J-03..UXR-J-04`)
  - 2026-04-19: Kept columns dropdown open on checkbox toggles and enforced icon-only columns trigger as global default with preserved accessible naming (`aria-label` + `sr-only`).
- [x] UXR-J-08 Run web table closure checks (focused suite + typecheck + build) and sync canonical queue/context
  - 2026-04-19: `pnpm --filter web run test -- src/ui/components/DataTable.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/logs/components/AuditTrailView.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run` => `25/25 PASS`; `pnpm --filter web run typecheck` => `PASS`; `pnpm --filter web run build` => `PASS`.
- [x] UXR-J-07 Align focused web table suites to shared action-tone and dropdown/trigger behavior contract
  - 2026-04-19: Updated focused assertions in `BotsListTable.test.tsx` and `BacktestsRunsTable.test.tsx` to the canonical module tone (`text-accent`) for `runtime/preview` presets.
- [x] UXR-J-06 Add shared table-action preset tone regression coverage
  - 2026-04-19: Added `TableUi.test.tsx` regression locks for `clone=neutral` and `runtime/preview=module` mapping.
- [x] UXR-J-05 Add DataTable regression coverage for columns dropdown persistence and icon-only trigger contract
  - 2026-04-19: Added interaction tests in `DataTable.test.tsx` for checkbox-toggle persistence and close-only via trigger/outside click/Escape, plus icon-only trigger class contract.
- [x] UXR-J-04 Enforce icon-only columns trigger globally with accessible label contract
  - 2026-04-19: Set `DataTable` default `settingsControlsIconOnly=true` while preserving accessible label exposure.
- [x] UXR-J-03 Keep columns dropdown open on checkbox toggles in shared DataTable
  - 2026-04-19: Removed checkbox-toggle auto-close path from `DataTable` column visibility menu.
- [x] UXR-J-02 Add dedicated module action tone mapping and dropdown/trigger shared behavior updates
  - 2026-04-19: Added shared `module` action tone in `TableUi` and remapped `runtime` + `preview` presets to the same module tone while preserving `clone` neutral and distinct from system actions (`edit`/`delete`).
- [x] UXR-J-01 Freeze dashboard table action-color and columns-dropdown behavior contract
  - 2026-04-19: Frozen shared table-system refresh contract in canonical docs (`open-decisions`, `web-dashboard-home`, `web-bots`) with explicit action-tone matrix updates (`clone` distinct from system actions; `runtime` + `preview` same module tone), columns-dropdown persistence behavior, and icon-only columns trigger accessibility rules.
- [x] UXR-I-14 Run web forms closure checks (typecheck, build, guardrails) and sync canonical queue/context
  - 2026-04-19: Closure pack PASS (`web typecheck`, `web build`, `quality:guardrails`) and canonical queue/context docs synchronized; `UXR-I` wave closed end-to-end and queue advanced to `UXR-J-01`.
- [x] UXR-I-13 Run and align focused web-forms regression suite for wrapper, i18n, and consistency contracts
  - 2026-04-19: Focused UXR-I suite PASS (`33/33`) for wallets/markets/backtests/bots form modules, wallet/bot create-edit wrappers, and i18n translation/namespace registry contracts.
- [x] UXR-I-12 Apply sticky mobile action bar contract to long dashboard forms
  - 2026-04-19: Added shared `FormMobileActionBar` to remaining long-form wrappers (`strategies` create/edit, `backtests` create) and made page-header save actions desktop-only (`hidden md:inline-flex`) to keep one consistent mobile action entrypoint.
- [x] UXR-I-11 Standardize first-error focus/scroll + summary and inline validation sync across scoped forms
  - 2026-04-19: Added shared validation-feedback helper in `ui/forms` and switched scoped forms (`wallets`, `markets`, `backtests`, `strategies`, `bots`) to one focus-first-invalid + summary error pipeline; wallet form now renders titled validation summary for parity.
- [x] UXR-I-10 Reduce bots-form layout density and align controls to shared form system
  - 2026-04-19: Refactored `BotCreateEditForm` into clearer two-column section cards (`setup`, `market`, `strategy`) using shared `ui/forms` primitives while preserving existing domain safeguards (`wallet context match`, `exchange capability`, `LIVE API key`, `live confirm`) and updated focused bots-form regression expectations.
- [x] UXR-I-09 Preserve strategies tabs while normalizing section internals to shared primitives
  - 2026-04-19: Preserved strategies tab flow and normalized `close`/`additional` tab internals to shared `ui/forms` primitives (section cards, radio groups, number/toggle/compound fields) with focused tab-switch regression coverage in `StrategyForm.test.tsx`.
- [x] UXR-I-08 Finalize backtests-form decoupling from feature-local controls and summary ergonomics
  - 2026-04-19: Aligned backtests create form shell to shared `FormPageShell` + section-card structure by removing feature-local outer container wrappers while preserving run-config/simulation payload behavior and focused backtests-form tests.
- [x] UXR-I-07 Enforce markets-form sectioned IA and remove residual local generic controls
  - 2026-04-19: Reworked `MarketUniverseForm` into shared `FormSectionCard` + `FormGrid` IA structure, removing ad-hoc section layout wrappers while preserving catalog/filter behavior and focused market-form regression coverage.
- [x] UXR-I-06 Close wallets-form residual layout/control parity gaps using ui/forms primitives
  - 2026-04-19: Standardized wallet form controls to shared `ui/forms` primitives for mode/base-currency/live-allocation sections (`RadioGroupField`, `SelectField`, `NumberField`) and updated focused wallet regression tests to the new control contract.
- [x] UXR-I-05 Unify create/edit wrappers i18n, breadcrumb, and save-action contract
  - 2026-04-19: Unified wrapper save-action behavior in wallet/bot create-edit shells by wiring form-level `submitting` status to desktop+mobile actions (`disabled` + saving label) and adding missing localized saving labels (`dashboard-wallets`, `dashboard-bots.page`).
- [x] UXR-I-04 Lock guardrails for no-cross-feature generic controls and no-hardcoded-wrapper-copy regressions
  - 2026-04-19: Expanded route-reachable i18n guardrail coverage to full `UXR-I` wrapper set and tightened repository guardrails so `FieldControls` imports are blocked outside same-feature ownership (or any non-feature file), preserving `ui/forms` as generic-control source.
- [x] UXR-I-03 Normalize shared ui/forms primitive API surface for refresh migration
  - 2026-04-19: Normalized `ui/forms` API surface by exporting shared primitive prop/type contracts to stabilize downstream wrapper/form migration usage without behavior changes.
- [x] UXR-I-02 Publish residual forms consistency gap map per route/module
  - 2026-04-19: Published deterministic route/module gap inventory in `docs/operations/uxr-i-forms-gap-map-2026-04-19.md` with machine-readable artifact `_artifacts-uxr-i-forms-gap-map-2026-04-19.json`.
- [x] UXR-I-01 Freeze dashboard forms consistency refresh boundaries after UXR-F
  - 2026-04-19: Locked canonical UXR-I scope/behavior boundaries in `open-decisions` and module linkage docs (`web-dashboard-home`) before refresh migration tasks.
- [x] UXR-J planning queued: `UXR-J-01..UXR-J-08` dashboard tables consistency refresh wave activated from planner brief
- [x] UXR-I planning queued: `UXR-I-01..UXR-I-14` dashboard forms consistency refresh wave activated from planner brief
- [x] OPV-05 Gate-aware RC status follow-ups
  - 2026-04-19: Updated RC gate status generator to emit only unresolved manual follow-ups per current gate state (`Gate1..Gate4`) and stop listing already-closed evidence steps as required.
- [x] POS-B group closure (`POS-39..POS-42`)
  - 2026-04-19: Closed queue drift by confirming existing implementation and running focused runtime/parity verification pack (`50/50 PASS`); evidence in `docs/operations/pos-ab-closure-2026-04-19.md`.
- [x] POS-A group closure (`POS-36..POS-38`)
  - 2026-04-19: Closed queue drift by confirming implementation-complete state and syncing canonical queue/context after focused verification (`runtimePositionAutomation`, `runtimeCapitalContext`, `backtestReplayCore`, `lifecycleCloseParity`).
- [x] OPV-A group closure (`OPV-01..OPV-04`)
  - 2026-04-19: Executed production verification wave end-to-end with rehearsal, takeover verification, RC gate refresh, and closure sync. Final external-gate snapshot is fully closed: `G1=PASS`, `G2=PASS`, `G3=PASS`, `G4=PASS` (`2026-04-19T15:13:58.943Z`).
- [x] OPV-04 Sync LBT/V1 planning statuses and residual external blockers
  - 2026-04-19: Synced closure state across canonical queue/context and linked updated OPV evidence (`opv-02`, `opv-03`) in planning docs; interim blockers from this sync were closed in the final RC pass run.
- [x] OPV-03 Refresh RC external-gates/sign-off artifacts with fresh production evidence
  - 2026-04-19: Collected new production SLO observation, rebuilt 7d/30d windows, refreshed RC gate status/checklist/sign-off artifacts, then reran final status sync + diagnostics (`_artifacts-opv-03-rc-evidence-final-sync-2026-04-19T01-43-32-327Z.json`).
- [x] OPV-02 Verify takeover endpoint and private ops probes on production target
  - 2026-04-19: Production takeover API routes now return `401 Missing token` (protected route present, no `404`), while private OPS probes remain blocked without VPS private-route admin auth; evidence captured in `docs/operations/opv-02-prod-live-takeover-2026-04-19.md` and `_artifacts-opv-02-*`.
- [x] OPV-01 Execute Dockerfile-first stage/prod rehearsal and capture deployment evidence
  - 2026-04-19: Dockerfile-first rehearsal passed for `api`, `web`, and all worker images; production smoke (`api.soar.luckysparrow.ch` + `soar.luckysparrow.ch`) passed for `/health`, `/ready`, and web root. Stage smoke is now also confirmed on `stage-api.soar.luckysparrow.ch` and `stage.soar.luckysparrow.ch`; evidence captured in `docs/operations/opv-01-vps-rehearsal-2026-04-19.md` and follow-up RC artifacts.
- [x] UXR-H group closure (`UXR-H-02..UXR-H-10`)
  - 2026-04-19: Closed dashboard manual-order advanced UX wave end-to-end by delivering API manual-order context endpoint + regression locks, wiring typed web context/state integration, adding price input + market-price fill + qty slider + side-aware summary + single-layer container layout, completing EN/PL/PT i18n parity, and running focused closure pack (`api tests`, `web tests`, `api/web typecheck`, `api/web build`, `quality:guardrails`).
- [x] UXR-H-02 Add API manual-order context endpoint for symbol constraints, price reference, and bot execution metadata
  - 2026-04-19: Added `GET /dashboard/orders/manual-context` with ownership validation and canonical response contract (`orderType`, `marginMode`, `leverage`, reference price, qty constraints, side-aware preview) including explicit `orderType -> MARKET` fallback behavior.
- [x] UXR-H-03 Lock API regression coverage for manual-order context fallback and constraints
  - 2026-04-19: Added focused service + e2e coverage for fallback order type, min-executable quantity derivation, degraded exchange fetch stability, and route ownership isolation.
- [x] UXR-H-04..UXR-H-09 Web dashboard manual-order advanced state/UI/i18n/test rollout
  - 2026-04-19: Added typed manual-order context client and web contracts, wired context-aware controller state (`price`, `slider`, `min qty`, derived estimates), implemented runtime sidebar UI expansion + container simplification, localized new copy in `dashboard-home` EN/PL/PT, and updated dashboard-home regression tests for advanced interactions.
- [x] UXR-H-01 Freeze dashboard manual-order advanced input/context contract before implementation
  - 2026-04-19: Contract frozen in canonical docs (`open-decisions`, `web-dashboard-home`, `api-orders`) with explicit `orderType` fallback (`MARKET`) and scope lock for advanced manual-order UX.
- [x] POS-36 Remove strategy-exit close bypass from backtest/replay/runtime lifecycle flow
  - 2026-04-19: Closed by enforcing EXIT trace-only behavior in backtest replay/interleaved flows (`strategy_exit_trace_only` diagnostic reason) and locking runtime final-candle EXIT trace-only execution skip contract with focused regression tests.
- [x] ARC-E closed implementation scope (`ARC-19..ARC-20`): guardrail tightening + architecture closure evidence
- [x] ARC-C closed implementation scope (`ARC-11..ARC-13`): shared runtime/backtest indicator kernel + backtest facade alignment
- [x] ARC-20 Publish architecture maintainability delta and residual-risk closure snapshot
- [x] ARC-19 Tighten production maintainability guardrails (byte + line budgets)
- [x] ARC-13 Add shared-kernel parity regression lock between runtime and backtest indicator projections
- [x] ARC-12 Reduce backtests service to facade by extracting dedicated simulation service ownership
- [x] ARC-11 Extract shared indicator projection/evaluation kernel for runtime and backtests
- [x] ARC-B closed implementation scope (`ARC-06..ARC-10`): bots runtime CQRS decomposition + aggregate monitoring contract
- [x] UXR-H planning queued: `UXR-H-01..UXR-H-10` dashboard manual-order advanced UX wave with price input, current-price fill, qty min-constraints, slider row, bot-context order metadata, and focused closure pack
- [x] ARC-10 Lock API+WEB aggregate monitoring contract and fallback behavior
- [x] ARC-09 Add API aggregate monitoring endpoint for web consumers
- [x] ARC-08 Move runtime close-position command path into command service ownership
- [x] ARC-07 Split bots runtime read service trades/positions slices from monolith read flow
- [x] ARC-06 Split bots runtime read service session/symbol-stats slices from monolith read flow
- [x] ARC-D closed implementation scope (`ARC-14..ARC-18`): web container slimming + DataTable split + i18n literal cleanup + regression lock
- [x] ARC-18 Add focused web regression locks for extracted ARC-D seams
- [x] ARC-17 Remove BacktestRunDetails inline locale-branch labels
- [x] ARC-16 Split DataTable column-visibility state ownership into dedicated helper
- [x] ARC-15 Move bots monitoring aggregate payload assembly into dedicated service
- [x] ARC-14 Split HomeLiveWidgets onboarding/view-model ownership into dedicated modules
- [x] ARC-A closed implementation scope (`ARC-01..ARC-05`): runtime critical-path decomposition foundations
- [x] ARC-05 Split and lock runtime regression tests by extracted seams
- [x] ARC-04 Extract final-candle decision execution application service from runtimeSignalLoop
- [x] ARC-03 Extract runtime supervisor/watchdog from runtimeSignalLoop
- [x] ARC-02 Extract typed runtime/live-ordering config from runtime services
- [x] ARC-01 Freeze architecture maintainability remediation boundaries and extraction guardrails
- [x] PLNC-A closed implementation scope (`PLNC-01..PLNC-04`): planning catalog classification + status/header sync + canonical linkage + queue/context closure sync
- [x] PLNC-04 Publish planning-catalog closure sync in task/project context docs
- [x] PLNC-03 Add canonical queue linkage in active non-closed planning docs
- [x] PLNC-02 Update stale status lines in completed planning docs and classify superseded plans
- [x] PLNC-01 Classify planning catalog coverage and map active plans to canonical queue ownership
- [x] UXR-G-06 Run focused dashboard-home closure checks and sync canonical queue/context docs
- [x] UXR-G-05 Add focused dashboard-home regression coverage for manual-order placement and wallet KPI ordering/layout
- [x] UXR-G-04 Enforce 50/50 width split for free-funds and in-positions wallet KPI rows
- [x] UXR-G-03 Restyle wallet portfolio row and move delta directly under allocation
- [x] UXR-G-02 Move dashboard manual-order section below wallet as same-level sidebar section
- [x] UXR-G-01 Freeze dashboard wallet/manual-order layout contract in canonical docs
- [x] BRS-C closed implementation scope (`BRS-09..BRS-12`): web switch regression + runtime-consumer compatibility check + closure evidence sync
- [x] Planning catalog coverage queued: `PLNC`, `ARC`, `POS`, `OPV` waves added as post-`BRS`/`UXR-G` execution backlog
- [x] ARCH-AUDIT-2026-04-18 publish maintainability/monolith audit report for planner handoff
- [x] BRS-B closed implementation scope (`BRS-05..BRS-08`): canonical update-path fix + precedence unification
- [x] BRS-08 Add closure regression for strict selected-bot scope + canonical strategy precedence
- [x] BRS-07 Enforce canonical-first strategy assignment in runtime symbol projection
- [x] BRS-06 Make PUT /dashboard/bots/:id update canonical group+strategy mapping transactionally
- [x] BRS-05 Add failing regression for PUT bot canonical update drift
- [x] UXR-G planning queued: `UXR-G-01..UXR-G-06` dashboard wallet/manual-order layout polish wave added as post-BRS queue with tiny-commit execution doc
- [x] BRS-A closed implementation scope (`BRS-01..BRS-04`): selected-bot runtime scope foundation (decision + regression + repository/service hardening)
- [x] BRS-04 Prevent runtime symbol expansion beyond canonical selected-bot scope
- [x] BRS-03 Narrow runtime read filters to `ACTIVE` canonical groups/links only
- [x] BRS-02 Add failing API regression for selected-bot symbol leakage across canonical/legacy/session/event paths
- [x] BRS planning queued: `BRS-01..BRS-12` selected-bot runtime scope remediation wave published and promoted to NOW/NEXT/PIPELINE in canonical queue
- [x] BRS-01 Close selected-bot runtime scope policy (`ACTIVE` canonical only, `PAUSED` exclusion default)
- [x] QH-TSC-01 Add canonical web verification script (`build -> typecheck`) and document it for closure packs
- [x] QH-LINT-02 Resolve remaining `react-hooks/exhaustive-deps` warnings in backtests/wallets table components
- [x] QH-LINT-01 Remove `no-unused-vars` warning noise in web build-critical dashboard/bots files
- [x] SOAR-000 Establish Soar-specific agent workflow scaffolding refresh
- [x] L10NQ-D-06..10 Reports, markets, backtests, bots, and dashboard-home copy migration completed and reflected in `docs/planning/mvp-next-commits.md`
- [x] UXR-F-A closed: `UXR-F-01..UXR-F-04` (contract freeze + shared `ui/forms` core/fields + import-boundary guardrail enforcement)
- [x] UXR-F-05 Unify dashboard create/edit wrappers with shared shell and namespace-driven copy
- [x] UXR-F-06 Migrate wallet create/edit form to shared ui/forms primitives
- [x] UXR-F-07 Migrate markets create/edit form to shared ui/forms primitives
- [x] UXR-F-08 Migrate backtests create form to shared ui/forms primitives
- [x] UXR-F-09 Migrate strategies create/edit form internals to shared ui/forms primitives
- [x] UXR-F-10 Migrate bots create/edit form internals to shared ui/forms primitives
- [x] UXR-F-11 Standardize form submit/disabled states and validation summary+focus behavior
- [x] UXR-F-12 Add reusable mobile sticky action bar pattern for long dashboard forms
- [x] UXR-F-13 Run focused cross-form regression pack for UXR-F-C
- [x] UXR-F-14 Publish UXR-F closure sync and evidence notes across canonical docs/context
- [x] UXR-F-D closed: `UXR-F-13..UXR-F-14` (focused regression + closure evidence + canonical queue sync)
