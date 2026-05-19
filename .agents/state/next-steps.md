# Next Steps

Last updated: 2026-05-19

## Next Tiny Task

Latest requirements/delivery-map audit:
`REQUIREMENTS-DELIVERY-MAP-AUDIT-2026-05-19` is the latest `AUD-02` evidence.
It also refreshed `AUD-00`: project index passed with V1 statuses `PASS:21`
and tests indexed `335`, and static scan passed with findings `0`. Follow-up
refreshed the delivery map from current audit truth, restored risk-ID
uniqueness by renumbering the audit-process row to `RISK-036`, and synchronized
continuation state with the final rollup and fresh generated audit evidence.
`AUD-02` is current for source-of-truth alignment after follow-up; production
boundary requirements remain partial only where fresh production proof was
intentionally excluded. Evidence:
`docs/operations/requirements-delivery-map-audit-2026-05-19.md`,
`docs/operations/project-index-2026-05-19.md`, and
`docs/operations/v1-static-issue-scan-2026-05-19.md`.
Next exact source-of-truth follow-up: recheck `AUD-02` on the next broad audit
and keep production-boundary rows partial unless fresh production proof exists.

Latest full reusable audit rollup:
`FULL-REUSABLE-AUDIT-ROLLUP-2026-05-19` is the current `AUD-00` through
`AUD-23` rollup. It separates current local evidence, historical production
evidence, deferred mobile scope, and explicit forbidden production/LIVE/exchange
mutation boundaries.
Evidence: `docs/operations/full-reusable-audit-rollup-2026-05-19.md`.
Next audit repair queue: `AUD-19` fresh production release gate before any new
production readiness claim; future hot-path assistant orchestration requires a
separate AI/security implementation and red-team proof; future Gate.io
production/live claims require exact operation proof.
Resolved audit decisions are recorded in
`docs/operations/audit-decision-packet-2026-05-19.md`: `DEC-AUD-001`
accepts Binance + Gate.io implementation scope, and `DEC-AUD-002` accepts
assistant foundation/dry-run current scope.
Option-specific post-decision repair playbooks are prepared in
`docs/operations/audit-decision-repair-playbooks-2026-05-19.md`.
Resume packet for the full audit mission:
`docs/operations/full-reusable-audit-handoff-2026-05-19.md`.

Latest i18n/copy reachability audit:
`I18N-COPY-REACHABILITY-AUDIT-2026-05-19` is verified as the latest `AUD-22`
evidence. Route-reachable i18n audit passed with findings `0`, localCopy `0`,
fallbackPl `0`, and hardcoded `0`. Focused Web i18n pack passed (`8` files /
`26` tests). Evidence:
`docs/operations/i18n-copy-reachability-audit-2026-05-19.md` and
`docs/planning/i18n-copy-reachability-audit-2026-05-19-task.md`.
Next i18n follow-up: rerun route-reachable i18n audit after route/copy changes.

Latest mobile/cross-platform scope audit:
`MOBILE-CROSS-PLATFORM-SCOPE-AUDIT-2026-05-19` is verified as the latest
`AUD-21` evidence. Mobile remains scaffold-only: `apps/mobile` contains only
package, README, and placeholder source files; mobile build/test scripts print
deferred scaffold messages; mobile docs state no production mobile runtime and
no independent mobile backend contracts. Evidence:
`docs/operations/mobile-cross-platform-scope-audit-2026-05-19.md` and
`docs/planning/mobile-cross-platform-scope-audit-2026-05-19-task.md`.
Next mobile follow-up: before mobile activation, create module docs and replace
scaffold echoes with real Expo/native build/test validation.

Latest operations/release/deployment audit:
`OPERATIONS-RELEASE-DEPLOYMENT-AUDIT-2026-05-19` is verified as the latest
local `AUD-19` evidence. Typecheck, lint, build, go-live smoke, and local DB
backup/restore check passed. Go-live smoke covered API (`4` files / `45`
tests) and Web (`3` files / `18` tests). Evidence:
`docs/operations/operations-release-deployment-audit-2026-05-19.md` and
`docs/planning/operations-release-deployment-audit-2026-05-19-task.md`.
Post-push readback for pushed audit commit `36ff999d` found production
build-info still on `1586f59261cef94d7c513d71bbfcfb697d11ca59` (`gitRef:
main`) while public API/Web smoke passed for the deployed service. Evidence:
`docs/operations/post-push-build-info-readback-36ff999d-2026-05-19.md` and
`docs/planning/post-push-build-info-readback-36ff999d-2026-05-19-task.md`.
Follow-up confirmed production tracks `main`; `origin/main` was fast-forwarded
to `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, production build-info reached
that SHA on attempt `8`, and public API/Web smoke passed. Evidence:
`docs/operations/main-promotion-build-info-dd1a1faf-2026-05-19.md` and
`docs/planning/main-promotion-build-info-dd1a1faf-2026-05-19-task.md`.
Next operations follow-up: rerun full protected release-gate evidence
(protected runtime, rollback, backup/restore, sign-off, and any approved
protected journeys) before any full production readiness claim.
No-auth protected preflight for `dd1a1faf` passed build-info and public smoke,
then blocked as expected on missing protected production inputs and stale
2026-05-14 protected evidence. Evidence:
`docs/operations/v1-final-preflight-dd1a1faf-2026-05-19-noauth.md` and
`docs/planning/protected-preflight-dd1a1faf-2026-05-19-task.md`.
Next exact protected follow-up: provide approved liveimport auth, rollback
guard auth, dashboard/admin UI auth, and production DB/Coolify restore context,
then rerun protected runtime, rollback, backup/restore, sign-off, liveimport,
and production UI clickthrough evidence for 2026-05-19.
Dated no-secret RC packet for `dd1a1faf` now records Gate 1 `PASS`, Gate 2
`OPEN`, Gate 3 `PASS`, and Gate 4 `OPEN`; strict RC evidence check fails as
expected on missing Gate 2 PASS and missing Gate 4 approver/owner fields.
Evidence:
`docs/operations/v1-rc-external-gates-status-dd1a1faf-2026-05-19-blocked.md`,
`docs/operations/v1-rc-signoff-record-dd1a1faf-2026-05-19-blocked.md`, and
`docs/planning/rc-evidence-blocked-dd1a1faf-2026-05-19-task.md`.
Next RC follow-up: collect approved production SLO/Gate2 evidence and provide
named sign-off/owner fields before rebuilding RC status, sign-off, and
checklist as `APPROVED`.
Current no-secret operator handoff for that follow-up:
`docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-19.md` and
`docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-19.json`.
Current protected-input readiness sweep:
`docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-19.md` and
`docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-19.json`
report `0` matching protected input names in this shell.
Reusable command for future sweeps:
`corepack pnpm run ops:protected-inputs:check -- --today <yyyy-mm-dd> --expected-sha <sha> --json-output <path> --markdown-output <path>`.
Current machine-readable remediation plan:
`docs/operations/audit-remediation-master-plan-2026-05-19.json` is verified by
`corepack pnpm run audit:remediation-plan:check`; it keeps phases `P0..P6`,
work packages `WP-01..WP-08`, the `AUD-19` blocker, closure checks, and safety
boundaries checkable during future reruns. Follow-up hardening now also checks
`sourceMarkdown` and `primaryEvidence` paths; the current plan reports `7`
references checked and `0` missing references.
Reusable audit rerun closure now explicitly requires `audit:manifest:verify`
and `audit:remediation-plan:check`, and `audit:rerun-playbook:check` fails if
required closure checks are missing.
Reusable audit tooling-index validation now also fails if closure omits
manifest verification, remediation-plan validation, docs parity, guardrails, or
diff check.
Reusable full-audit handoff validation is now part of `audit:manifest:verify`;
`audit:handoff:check` verifies handoff source paths, residual risks, forbidden
boundaries, validation checks, and fail-closed safety booleans.
Next executable protected step remains the same: provide the approved
protected inputs named in that packet and execute the commands in order.

Latest data-model/migrations audit:
`DATA-MODEL-MIGRATIONS-AUDIT-2026-05-19` is verified locally as the latest
`AUD-07` evidence. Prisma schema validation passed, local migration status
reported `54` migrations and schema up to date, full local migration replay
applied all `54` migrations, schema diff generation passed, and isolated
representative DB-backed tests passed for wallets (`1` file / `24` tests),
backtests (`1` file / `15` tests), and runtime repository behavior (`1` file /
`2` tests). Follow-up `corepack pnpm run audit:data:db-isolated` passed and
now provides the canonical sequential reset-and-run path for these
representative DB-backed packs. Evidence:
`docs/operations/data-model-migrations-audit-2026-05-19.md` and
`docs/planning/data-model-migrations-audit-2026-05-19-task.md`.
Next data follow-up: use `audit:data:db-isolated` after route/data changes;
refresh production migration status and backup/restore evidence under `AUD-19`
before future deploys.

Latest workers/runtime operations audit:
`WORKERS-RUNTIME-OPERATIONS-AUDIT-2026-05-19` is verified as the latest
`AUD-08` evidence. The focused API worker/runtime pack passed (`17` files /
`85` tests). Coverage includes worker ownership/topology, protected worker
health/readiness, runtime freshness pass/fail/skip behavior, global `/ready`
diagnostics, market-stream source config, subscriptions, fanout and routes,
exchange polling, Binance stream parsing, queue tuning, backtest job
persistence, execution orchestration, and PAPER runtime-flow telemetry.
Expected stderr appeared only in the intentional Redis-startup retry test.
Evidence: `docs/operations/workers-runtime-operations-audit-2026-05-19.md` and
`docs/planning/workers-runtime-operations-audit-2026-05-19-task.md`.
Next workers follow-up: refresh production-safe protected worker/process proof
after future deploys or worker topology changes; keep Gate.io/second-LIVE
production runtime shape outside current claims until explicitly planned.

Latest admin/subscriptions/entitlements audit:
`ADMIN-SUBSCRIPTIONS-ENTITLEMENTS-AUDIT-2026-05-19` is verified as the latest
`AUD-18` evidence. Focused Web admin/profile subscription tests passed (`4`
files / `9` tests), and DB-backed API admin/subscriptions/entitlements tests
passed (`5` files / `25` tests). Coverage includes admin-only access, user
listing with subscription metadata, role/plan updates, self-demotion
prevention, plan/entitlement validation, profile subscription readback, bot
limit and LIVE trading gates, and Web admin/profile subscription states.
Evidence: `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.md`
and `docs/planning/admin-subscriptions-entitlements-audit-2026-05-19-task.md`.
Next admin/subscription follow-up: refresh production-safe protected admin
route proof after future deploys; keep production entitlement mutation excluded
until an explicit safe admin-ops plan exists; track checkout provider e2e,
webhook lifecycle, and admin UX follow-ups.

Latest logs/audit-trail audit:
`LOGS-AUDIT-TRAIL-AUDIT-2026-05-19` is verified as the latest `AUD-17`
evidence. Focused Web logs/audit tests passed (`2` files / `3` tests), and
DB-backed API logs/pagination tests passed (`2` files / `5` tests). Coverage
includes authenticated reads, owner scoping, source/actor/severity filters,
pagination defaults/bounds, action-produced event visibility, metadata trace
text rendering, and Web logs route states. Evidence:
`docs/operations/logs-audit-trail-audit-2026-05-19.md` and
`docs/planning/logs-audit-trail-audit-2026-05-19-task.md`.
Next logs follow-up: refresh production-safe action-produced audit readback
after future deploys; track total-count envelope, pagination controls, saved
filters, index tuning, and wallet command audit-event write coverage.

Latest backtests/reports audit:
`BACKTESTS-REPORTS-AUDIT-2026-05-19` is verified as the latest `AUD-16`
evidence. Focused Web backtest/report UI tests passed (`15` files / `37`
tests), and DB-backed API backtests/reports tests passed (`13` files / `114`
tests). Coverage includes run lifecycle, ownership, explicit range validation,
queue/job/replay, fill model, data gateway, runtime-kernel parity, immutable
snapshot behavior, pending/degraded report lifecycle, trades/report/timeline
reads, cross-mode aggregation, and Web route/detail/report states. Evidence:
`docs/operations/backtests-reports-audit-2026-05-19.md` and
`docs/planning/backtests-reports-audit-2026-05-19-task.md`.
Next backtests/reports follow-up: refresh production-safe disposable fixture
proof after future deploys; keep non-Binance historical order-book parity and
richer report filters/snapshots/i18n as future scope.

Latest markets/strategies configuration audit:
`MARKETS-STRATEGIES-CONFIGURATION-AUDIT-2026-05-19` is verified as the latest
`AUD-15` evidence. Focused Web market/strategy UI tests passed (`19` files /
`60` tests), and DB-backed API markets/strategies tests passed (`4` files /
`35` tests). Coverage includes market-universe composition, catalog behavior,
market and strategy CRUD, ownership, active-bot guards, strategy import/export/
config validation, inactive-bot edit allowance, active-bot lock UI, and
indicator registry/presentation parity. Evidence:
`docs/operations/markets-strategies-configuration-audit-2026-05-19.md` and
`docs/planning/markets-strategies-configuration-audit-2026-05-19-task.md`.
Next markets/strategies follow-up: refresh production-safe disposable fixture
proof after future deploys; track catalog freshness telemetry, typed strategy
domain errors, and Web strategy i18n/dirty-state follow-ups.

Latest wallets/capital-ledger audit:
`WALLETS-CAPITAL-LEDGER-AUDIT-2026-05-19` is verified as the latest `AUD-14`
evidence. Focused Web wallet/ledger UI tests passed (`10` files / `23` tests),
and DB-backed API wallets/capital tests passed (`7` files / `84` tests).
Coverage includes wallet CRUD, ownership, PAPER/LIVE validation, API-key
binding, balance preview, active-bot edit/delete/reset guards, paper reset
checkpoint, wallet-first bot contract, runtime capital source truth,
cashflow/equity ledger states, and partial/unavailable ledger UI. Evidence:
`docs/operations/wallets-capital-ledger-audit-2026-05-19.md` and
`docs/planning/wallets-capital-ledger-audit-2026-05-19-task.md`.
Next wallet follow-up: refresh production-safe disposable wallet proof after
future deploys, keep LIVE exchange mutation excluded until an explicit safe
plan exists, and track wallet command audit-log events under `AUD-17`.

Latest positions/reconciliation audit:
`POSITIONS-RECONCILIATION-AUDIT-2026-05-19` is verified as the latest `AUD-13`
evidence. Focused Web runtime-position tests passed (`6` files / `46` tests),
and DB-backed API positions/reconciliation tests passed (`11` files / `68`
tests). Coverage includes list/read ownership, live-status, exchange snapshot
selection/normalization/fail-closed behavior, takeover/rebind, orphan repair,
imported history hydration, reconciliation diagnostics, runtime position
derivations, and close-state UI. Evidence:
`docs/operations/positions-reconciliation-audit-2026-05-19.md` and
`docs/planning/positions-reconciliation-audit-2026-05-19-task.md`.
Next positions follow-up: refresh production-safe PAPER proof after future
deploys and keep LIVE position mutation excluded until an explicit safe plan
exists.

Latest orders/manual trading audit:
`ORDERS-MANUAL-TRADING-AUDIT-2026-05-19` is verified as the latest `AUD-12`
evidence. Focused Web manual/open-order tests passed (`8` files / `46` tests),
and DB-backed API order lifecycle tests passed (`10` files / `121` tests).
Coverage includes manual-order context and selected-bot scope, PAPER lifecycle,
ownership isolation, active-only filtering, fills, fees, exchange events,
fail-closed exchange-backed cancel boundary, LIVE risk guards,
quantity/position scope, and Dashboard Home manual/open-order action states.
Evidence: `docs/operations/orders-manual-trading-audit-2026-05-19.md` and
`docs/planning/orders-manual-trading-audit-2026-05-19-task.md`.
Next orders follow-up: refresh production-safe PAPER proof after future deploys
and keep LIVE order/cancel/close mutation excluded until an explicit safe plan
exists.

Latest engine/trading decision-flow audit:
`ENGINE-TRADING-DECISION-FLOW-AUDIT-2026-05-19` is verified as the latest
`AUD-11` evidence. Focused engine service/unit tests passed (`15` files / `173`
tests), and DB-backed engine e2e/smoke tests passed (`4` files / `13` tests).
Coverage includes deterministic signal merge, final-candle flow, signal loop,
pre-trade/risk, execution orchestration, dedupe, exchange order guard,
PAPER/LIVE parity, market-data gateway, position automation, PAPER runtime
lifecycle, and owned imported-position execution. Evidence:
`docs/operations/engine-trading-decision-flow-audit-2026-05-19.md` and
`docs/planning/engine-trading-decision-flow-audit-2026-05-19-task.md`.
Next engine follow-up: keep LIVE/exchange-side mutation excluded until an
explicit safe plan exists; keep assistant hot-path truth under `AUD-20`.

Latest bots/runtime truth audit:
`BOTS-RUNTIME-TRUTH-AUDIT-2026-05-19` is verified as the latest `AUD-10`
evidence. Focused Web bot/dashboard runtime tests passed (`8` files / `61`
tests), and DB-backed API bot/runtime tests passed (`10` files / `88` tests).
Coverage includes CRUD/ownership, wallet-first writes, duplicate and entitlement
guards, selected-bot runtime scope, aggregate monitoring truth, runtime history
parity, takeover visibility, LIVE/PAPER isolation, and delete cleanup.
Evidence: `docs/operations/bots-runtime-truth-audit-2026-05-19.md` and
`docs/planning/bots-runtime-truth-audit-2026-05-19-task.md`.
Next bot/runtime follow-up: refresh production-safe proof after future deploys;
keep assistant hot-path truth under `AUD-20`.

Latest security/privacy audit:
`SECURITY-PRIVACY-AUDIT-2026-05-19` is verified as the latest `AUD-06`
evidence. Local focused auth/middleware/header API tests passed (`9` files /
`32` tests), DB-backed auth/profile/API-key/isolation/abuse tests passed (`7`
files / `47` tests), focused Web auth/profile/API-key tests passed (`7` files
/ `28` tests), and the public auth cache contract passed (`1` file / `2`
tests). Evidence:
`docs/operations/security-privacy-audit-2026-05-19.md` and
`docs/planning/security-privacy-audit-2026-05-19-task.md`.
Next security follow-up: refresh production-safe proof after future deploys and
schedule external independent security review before broader public launch.

Latest architecture exchange-scope wording audit:
`ARCHITECTURE-EXCHANGE-SCOPE-WORDING-AUDIT-2026-05-19` is complete as
`AUD-01`/`AUD-ARCH-001` evidence. `DEC-AUD-001` accepted Binance + Gate.io as
current implementation scope, not Binance-only, while production/live readiness
remains evidence-bound by exact exchange, market type, and operation. Evidence:
`docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.md` and
`docs/planning/architecture-exchange-scope-wording-audit-2026-05-19-task.md`.
Next exchange follow-up: prove any Gate.io production/live readiness claim by
exact exchange, market type, and operation before promoting it.

Latest exchange capability truth audit:
`EXCHANGE-CAPABILITY-TRUTH-AUDIT-2026-05-19` is verified as the latest
`AUD-09` truth audit after exact matrix repair. API exchange
capability/registry/boundary tests passed (`4` files / `21` tests), focused
contract tests passed with exact `(exchange, marketType, operation)` support,
and API typecheck passed after updating exchange boundary, wallet preview, and
positions snapshot consumers. Web exchange capability tests passed (`2` files
/ `3` tests). Evidence:
`docs/operations/exchange-capability-truth-audit-2026-05-19.md` and
`docs/planning/exchange-capability-truth-audit-2026-05-19-task.md`.
Next exchange follow-up: keep future exchange additions on the exact capability
contract and neutral exchange-owned type aliases. `AUD-EXCH-007` is closed by
`AUD09-NEUTRAL-EXCHANGE-TYPE-ALIASES-2026-05-19`.

Latest AI assistant runtime truth audit:
`AI-ASSISTANT-RUNTIME-TRUTH-AUDIT-2026-05-19` is complete as an `AUD-20`
truth audit. Deterministic assistant foundation is locally proven: backend
orchestrator tests passed (`2` files / `6` tests), focused Web assistant route
tests passed (`2` files / `3` tests), and bot assistant config/dry-run e2e
passed after local Postgres/Redis startup (`1` file / `3` tests). `DEC-AUD-002`
accepted this as current foundation/dry-run scope and deferred
BACKTEST/PAPER/LIVE hot-path assistant orchestration. Evidence:
`docs/operations/ai-assistant-runtime-truth-audit-2026-05-19.md` and
`docs/planning/ai-assistant-runtime-truth-audit-2026-05-19-task.md`.
Next assistant follow-up: before any runtime AI trading claim, implement
hot-path orchestration separately with persisted trace, fail-closed integration,
and AI red-team evidence.

Latest endpoint-level API docs parity audit:
`API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19` is verified and current after docs
gap closure. Command: `pnpm run docs:parity:endpoints:api`. Current result:
`109` Express endpoints, `109` documented route mentions, `0` gaps. Existing module-level
`pnpm run docs:parity:check` still passes (`API 22/22`, `Web 16/16`, Routes
`38/38`). Evidence:
`docs/operations/api-endpoint-docs-parity-2026-05-19/api-endpoint-docs-parity-2026-05-19.md`
and `docs/planning/api-endpoint-docs-parity-audit-2026-05-19-task.md`.
Next documentation improvement: rerun endpoint parity after API route or module
docs changes.

Latest authenticated route-state audit:
`AUTHENTICATED-ROUTE-STATE-AUDIT-2026-05-19` is verified locally. Local API/Web
were started against seeded admin data, Browser login reached `/dashboard`,
and route-state proof passed for canonical public/auth/dashboard/admin plus
legacy routes. Result: `53` route checks, `53` PASS, `0` CHECK, `0` console
warning/error routes, and `6` screenshots. Evidence:
`docs/analysis/audit-baseline-2026-05-19.md`,
`docs/operations/route-state-audit-2026-05-19/route-state-audit-2026-05-19.md`,
and `docs/planning/authenticated-route-state-audit-2026-05-19-task.md`.
Next audit improvement is deeper keyboard/focus/a11y assertions if needed.

Latest full layered audit run:
`FULL-LAYERED-AUDIT-RUN-2026-05-18` is verified as a broad local audit pass
with explicit production/LIVE exclusions. Current evidence includes generated
project index PASS (`PASS:21`, tests indexed `335`), static scan PASS (`0`
findings), guardrails PASS, docs parity PASS, typecheck PASS, lint PASS, build
PASS, full Web Vitest PASS (`149` files / `514` tests), route-reachable i18n
PASS (`0` findings), focused API layer packs PASS, full API Vitest PASS after
local Postgres/Redis were available, go-live smoke PASS (API `45/45`, Web
`18/18`), and representative Browser route-state proof for `/`, `/auth/login`,
and unauthenticated `/dashboard` redirect on desktop/mobile with `0` console
warnings/errors. Evidence: `docs/analysis/audit-baseline-2026-05-18.md` and
`docs/planning/full-layered-audit-run-2026-05-18-task.md`.
Next audit improvement is deeper authenticated browser/screenshot/a11y proof
where needed. Keep DB-backed API packs sequential unless isolated database
state is introduced.

Latest reusable audit system:
`REUSABLE-AUDIT-REGISTRY-2026-05-18` is verified as the reusable audit map.
It defines stable audit IDs `AUD-00` through `AUD-23` across project index,
architecture, requirements, backend API, Web routes, UX/UI/a11y, security,
data model, workers, exchange, bots, engine, orders, positions, wallets,
markets/strategies, backtests/reports, logs, admin/subscriptions, operations,
AI assistant, mobile, i18n, and documentation/traceability. Today-run baseline:
project index PASS (`PASS:21`, tests indexed `335`) and static scan PASS
(`0` findings). Evidence: `docs/analysis/reusable-audit-registry.md`,
`docs/analysis/audit-baseline-2026-05-18.md`, and
`docs/planning/reusable-audit-registry-2026-05-18-task.md`.
Validation added to the baseline: guardrails PASS, docs parity PASS, typecheck
PASS, lint PASS, and build PASS. Browser route-state, full API/Web test suite,
production proofs, and LIVE/exchange-side mutation were not run in this
registry task.

Latest architecture-code discrepancy audit:
`PROJECT-ARCHITECTURE-CODE-DISCREPANCY-AUDIT-2026-05-17` is complete as an
audit baseline, not a repair. Static scan is green with `0` findings and the
dashboard route inventory matches the canonical route map. Open repair
candidates, in order: decide assistant runtime truth (`AUD-AI-003`), clean up
exchange scope overview/domain wording (`AUD-ARCH-001`), then keep endpoint
parity automation green (`AUD-TRACE-006`). `AUD-EXCH-002` was repaired on
2026-05-19 by exact `(exchange, marketType, operation)` capability support.
Evidence:
`docs/analysis/architecture-code-discrepancy-audit-2026-05-17.md` and
`docs/planning/project-architecture-code-discrepancy-audit-2026-05-17-task.md`.

Latest full-project audit baseline:
`PROJECT-FULL-SCAN-BASELINE-2026-05-14` is verified. The audit thread
generated a current no-network project index and static scan, then ran broad
local validation. Results: V1 matrix `PASS:21`, static findings `0`, tests
indexed `335`, guardrails PASS, typecheck PASS, lint PASS, full Web Vitest
PASS (`149` files / `514` tests), full API Vitest PASS, build PASS, and
go-live smoke PASS (API `45/45`, Web `18/18`). Evidence:
`docs/planning/project-full-scan-baseline-2026-05-14-task.md`,
`docs/operations/project-full-scan-index-2026-05-14.md`, and
`docs/operations/project-full-static-scan-2026-05-14.md`.
Next audit candidate: run manual/browser route-state coverage from the
generated route map, prioritizing Dashboard Home, Bots, Wallets, Markets,
Strategies, Backtests, Reports, Logs, Profile, Admin, and Auth states. Keep
LIVE order/cancel/close, exchange-side mutation, existing production data
mutation, and broader Gate.io/second-LIVE production shape out of scope unless
the user explicitly approves that proof lane.

Latest complete-analysis expansion:
`PROJECT-COMPLETE-ANALYSIS-INDEX-2026-05-14` is indexed in
`docs/operations/project-complete-analysis-index-2026-05-14.md`. It expands
the audit target beyond the V1 scorecard and classifies Web/API, mobile,
assistant/AI, route-state, API endpoint, LIVE mutation, Gate.io/second-LIVE,
and production-data mutation lanes. Key findings: no `.skip(` or `.only(`
markers found in the active scan; no active implementation `TODO/FIXME/HACK`
markers found beyond scanner rule definitions; mobile is explicitly scaffold
only; assistant runtime has local deterministic safety tests but no full
`AI_TESTING_PROTOCOL.md` multi-turn red-team report. Next exact audit mission:
`PROJECT-ROUTE-STATE-AUDIT-2026-05-14`, a browser-driven route-state proof for
all Web routes.

Latest post-V1 strategy snapshot history:
`POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14` is locally verified. New
backtest runs now persist immutable creation-time strategy and market-universe
snapshots, backtest list/timeline/replay paths prefer snapshot strategy truth
before mutable strategy records, and strategy/market-universe deletion now
fails closed with `409` while owned backtest history references those records.
Focused API e2e passed for backtests, strategies, and markets (`44/44`). No
deploy, production mutation, LIVE order/cancel/close, or exchange-side mutation
was performed. Evidence:
`docs/planning/post-v1-strategy-snapshot-history-2026-05-14-task.md`.

Latest post-V1 inactive PAPER strategy edit proof:
`POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14` is locally verified.
The Web edit page now has direct submit proof for the backend-allowed inactive
linked-bot strategy update path, and active linked-bot blocking renders a
targeted lock with bot-settings navigation. Focused validation passed: Web edit
page `3/3`, Web strategies suite `14` files / `48` tests, and API strategies
e2e `11/11`. No deploy, production mutation, LIVE order/cancel/close, or
exchange-side mutation was performed. Evidence:
`docs/planning/post-v1-inactive-paper-strategy-edit-proof-2026-05-14-task.md`.

Latest post-V1 crypto icon consistency:
`POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14` is locally verified. The resolver
now uses one curated asset catalog for both CoinGecko hints and local icon
fallback URLs, so common-symbol fixes are catalog-level rather than one-off.
Focused API icon e2e passes (`6/6`), including a CoinGecko `503` basket proof
where common trading assets such as `TRX`, `LINK`, `ZEC`, `SAND`, and `MANA`
resolve to curated icons instead of generic placeholders. No deploy,
production mutation, LIVE order/cancel/close, or exchange-side mutation was
performed. Evidence:
`docs/planning/post-v1-crypto-icon-consistency-2026-05-14-task.md`.

Latest post-V1 ledger reconciliation:
`V1-POST-V1-LEDGER-RECONCILIATION-2026-05-14` is verified. Stale module
confidence rows for Profile, Profile API Keys, Wallets, Markets, Strategies,
Logs/Audit Trail, and Subscriptions/Admin were reconciled with already accepted
production fixture/UI proof artifacts. Current module-confidence count is
`VERIFIED:22`, `PARTIAL:0`, `IMPLEMENTED_NOT_VERIFIED:0`, `BROKEN:0`, and
`BLOCKED:0`. Risk-register count is now `closed:18`, `mitigating:8`. The
reconciliation did not perform a deploy, production mutation, LIVE order/cancel/
close, unsafe LIVE position mutation, existing-data mutation, or broader
Gate.io/second-LIVE proof. Evidence:
`docs/planning/v1-post-v1-ledger-reconciliation-2026-05-14-task.md`.

Latest post-V1 wallet/bot cleanup hardening:
`V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` is locally verified. Bot
deletion now removes bot-owned runtime/trading artifacts in one transaction
while preserving the linked strategy, and PAPER wallet reset now fails closed
with `409` while an active bot uses the wallet. No production data, LIVE order/
cancel/close, or exchange-side mutation was performed. Validation: API
typecheck PASS, Bots delete cleanup e2e `1/1` PASS, Bots e2e `26/26` PASS,
Wallets e2e `24/24` PASS, build PASS. The fix is deployed as
`1586f59261cef94d7c513d71bbfcfb697d11ca59`; build-info wait passed on attempt
22, and public deploy smoke passed. Evidence:
`docs/planning/v1-post-v1-wallet-bot-cleanup-hardening-2026-05-14-task.md`.

Post-V1 operator feedback follow-up queue is indexed in
`docs/planning/post-v1-bot-wallet-dashboard-cleanup-2026-05-14-task.md`.
Next runnable candidates: Dashboard truth/layout/loading polish, Analytics
Reports/Logs UX, Strategy Builder preview charts, bot history/versioned bot
context, per-symbol best-parameter comparison, and
positions-service decomposition. Crypto icon consistency is now closed by
`POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14`; inactive PAPER strategy edit
reproduction is now closed by
`POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14`; backtest immutable
strategy/market-universe snapshot history is now closed by
`POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14`.

Latest 100 percent truth audit:
`V1-100-PERCENT-TRUTH-AUDIT-2026-05-14` is verified as the current wording for
the user's "is it 100%?" question. Tracked V1 release acceptance is `YES`:
final scorecard `GO`, `PASS:21`, static findings `0`, implementation/evidence/
release readiness `100%`, and no generated next work order. Absolute
whole-app/every-function/every-live-action proof remains `NO` only because LIVE
order submit/cancel/position close, exchange-side mutation, existing-data
mutation, and broader 2x LIVE including Gate.io production proof were
intentionally not performed. The stale `PARTIAL:7` module-confidence wording in
that audit is superseded by the ledger reconciliation above. Evidence:
`docs/planning/v1-100-percent-truth-audit-2026-05-14-task.md` and
`docs/operations/v1-100-percent-truth-audit-2026-05-14.md`.

Latest post-V1 Dashboard/Runtime ledger closure:
`V1-POST-V1-DASHBOARD-RUNTIME-LEDGER-CLOSURE-2026-05-14` is verified. Existing
local and production evidence closes stale `SOAR-DASHBOARD-001` and
`SOAR-BOT-RUNTIME-001` `PARTIAL` rows for the approved non-Gate.io V1/post-V1
scope. `RISK-002` and `RISK-003` are closed. Its original count readback is
superseded by the later ledger reconciliation: current module confidence is
`VERIFIED:22` and `PARTIAL:0`; current risk count is `closed:18` and
`mitigating:8`. Gate.io/second-LIVE production shape remains separate. Evidence:
`docs/planning/v1-post-v1-dashboard-runtime-ledger-closure-2026-05-14-task.md`.

Latest post-V1 release-confidence row closure:
`V1-POST-V1-RELEASE-CONFIDENCE-ROW-CLOSURE-2026-05-14` is verified. The stale
`SOAR-REL-001` row no longer claims that the module-by-module proof ledger is
missing; the final evidence pack is now the proof-map evidence for that row.
This removed the last `IMPLEMENTED_NOT_VERIFIED` module-confidence row without
promoting unrelated `PARTIAL` rows. Superseded by later Dashboard/Runtime and
ledger reconciliation tasks: current counts are `PARTIAL:0` and `VERIFIED:22`.
Evidence:
`docs/planning/v1-post-v1-release-confidence-row-closure-2026-05-14-task.md`.

Latest post-V1 Auth hardening:
`V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14` is verified. Production proof on
deployed `2fc90a08` first found direct reuse of the pre-logout JWT still
returned `/auth/me` `200`; the fixed build `84711599` was deployed and the
rerun passed with stale-token `/auth/me` returning `401`. `SOAR-AUTH-001` is
now `VERIFIED`, and `RISK-004` is `closed`. Evidence:
`docs/planning/v1-post-v1-auth-deploy-rerun-2026-05-14-task.md` and
`docs/operations/prod-auth-session-browser-proof-84711599-2026-05-14.md`.

Current continuation target:
No active V1 completion task remains in the generated work order. The final
tracked V1 evidence snapshot is `GO` with all `21` product-action rows at
`PASS`, static findings `0`, and no next-work-order rows. Continue only with
post-V1 polish or freshness reruns unless a new failing signal appears.

Latest completion scorecard:
`docs/operations/v1-completion-scorecard-2026-05-14-final.md` is freshly
regenerated after the UX/A11y/Mobile production proof. Current matrix counts
are `PASS:21`, static findings `0`, implementation estimate `100%`, evidence
coverage `100%`, release readiness `100%`, and status `GO`.

Latest final handoff:
`docs/operations/v1-final-handoff-packet-2026-05-14.md` is published and
records current source of truth, evidence links, validations, residual risks,
the LIVE mutation approval boundary, and resume instructions for future
sessions.

Latest final evidence inventory:
`docs/operations/v1-final-evidence-inventory-2026-05-14.md` is published and
names the canonical V1 proof pack, the source-of-truth state files, the LIVE
mutation boundary, and safe version-control guidance. It explicitly warns
against blind staging of the large proof-artifact working tree.

Latest current worktree sanity:
`V1-CURRENT-WORKTREE-SANITY-2026-05-14` passed after final evidence updates:
`pnpm run typecheck`, `pnpm run build`, and `pnpm run quality:guardrails`.
No deploy or production mutation was performed.

Latest current full regression:
`V1-CURRENT-WORKTREE-FULL-REGRESSION-2026-05-14` passed after final evidence
updates: `pnpm run lint`, full Web Vitest (`149` files / `512` tests), and
full API Vitest. No deploy or production mutation was performed.

Latest current go-live smoke:
`V1-CURRENT-GO-LIVE-SMOKE-2026-05-14` passed when DB-backed packs were run
sequentially: `pnpm run test:go-live:web` (`18/18`),
`pnpm run test:go-live:api` (`44/44`), and `pnpm run test:go-live:smoke`
(API `44/44`, Web `18/18`). Do not run DB-backed smoke/API packs in parallel;
the false failure pattern is recorded in `.codex/context/LEARNING_JOURNAL.md`.

Latest active queue closure audit:
`V1-ACTIVE-QUEUE-CLOSURE-AUDIT-2026-05-14` passed. Active V1 continuation
sources have no open V1 completion row and no current NO-GO/BLOCKED completion
signal above the historical superseded evidence section.

Latest final evidence consistency readback:
`V1-FINAL-EVIDENCE-CONSISTENCY-READBACK-2026-05-14` passed. Final generated
JSON artifacts and Markdown markers agree on `GO`, `PASS:21`, `100%`
implementation/evidence/readiness, static findings `0`, blocked modules
`none`, concrete non-proof gaps `0`, and no next work order.

Latest back/web local baseline:
`V1-BACK-WEB-FULL-LOCAL-BASELINE-457BCE05-2026-05-14` is verified. The current
release line is green locally across API/Web type contracts, tests, lint,
guardrails, and production build: `pnpm run quality:guardrails` PASS,
`pnpm run typecheck` PASS, full Web Vitest PASS (`149` files / `512` tests),
full API Vitest PASS, `pnpm run lint` PASS, `pnpm run build` PASS, and
`git diff --check` PASS with line-ending warnings only. Evidence:
`docs/planning/v1-back-web-full-local-baseline-457bce05-2026-05-14-task.md`.
Next exact task: no active V1 completion task; rerun freshness checks only if
code changes, deployment changes, or a new failing signal appears.

Latest protected ops gate for `457bce05`:
`V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14` is verified and `READY`.
Production build-info matches
`457bce05338310c198c03a973395a9176f298dc1`, public API/Web smoke passes,
protected runtime freshness passes, rollback proof passes with
`shouldRollback=false` and no alerts, authenticated production UI clickthrough
passes, and controlled no-order-guard LIVE readback now produces
`LIVEIMPORT-03` PASS for `TRXUSDT`; the runner deactivated the bot afterward
and a post-check found `isActive=false` with zero running sessions. The
2026-05-14 release gate is ready. The production backup/restore drill passed
through `DOCKER_HOST=ssh://codex-vps`, final preflight is ready, and the full
non-dry-run production release gate reports `Readiness: ready`. Activation
audit/plan, RC external gates, RC sign-off, RC checklist, rollback proof, UI
clickthrough, LIVEIMPORT, public smoke, protected smoke, runtime freshness,
rollback guard, local guardrails, typecheck, build, and go-live smoke are
fresh/pass for 2026-05-14.
Evidence:
`docs/planning/v1-protected-ops-gate-457bce05-2026-05-14-task.md`,
`docs/operations/v1-final-preflight-457bce05-2026-05-14-ready.md`,
`docs/operations/v1-release-gate-prod-457bce05-2026-05-14-full-ready.md`,
`docs/operations/liveimport-03-prod-readback-2026-05-14.json`, and
`docs/operations/v1-rollback-proof-prod-2026-05-14T01-00-18-225Z.md`.
Next exact task: keep the release regression loop green; do not reopen V1
release readiness unless a new failing signal appears.

Latest deploy status:
`V1-CURRENT-MAIN-PROMOTION-DEPLOY-LAG-457BCE05-2026-05-14` is superseded by
deploy freshness evidence. The current candidate was pushed to
`origin/codex/v1-proof-and-ops-evidence`, and `origin/main` was fast-forwarded
to `457bce05338310c198c03a973395a9176f298dc1`. A later production build-info
recheck passed on attempt 1 for `457bce05`, and public production smoke passed
against that deployed surface. The later protected ops gate superseded the
initial protected-auth `401` checks: protected runtime freshness, rollback
guard, UI clickthrough, restore drill, final preflight, and full release gate
are all fresh/pass for 2026-05-14. Next exact task: none for V1 release
completion unless a new deploy or failing signal appears.

Latest runtime non-Binance derivatives adapter:
`V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13` is locally verified.
Runtime symbol-stats fallback derivatives and live signal market-data gateway
derivatives now use the Exchange public adapter for non-Binance funding-rate
history, open-interest history, and current order-book snapshots where
supported. Binance REST remains scoped to Binance, and unsupported adapter
methods fail closed. Focused runtime tests passed (`26/26`), API typecheck
passed, and guardrails passed. Next related lane is production-safe multi-bot
runtime/backtest clickthrough and target-environment proof.

Latest non-Binance backtest derivatives adapter:
`V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13` is locally verified.
Non-Binance futures backtests can now fetch supplemental funding-rate and
open-interest history through the Exchange public market-data adapter when the
underlying CCXT connector supports it. Backtest order-book history remains
empty by design until a historical order-book/depth source exists; current
snapshots must not be used as historical input. Focused API tests passed
(`26/26`) and API typecheck passed. Next related lane is runtime live
derivatives supplemental adapter support for non-Binance, or production-safe
multi-bot/backtest clickthrough.

Latest runtime ticker/backtest UI parity:
`V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` is locally verified.
Generic runtime ticker fallback now uses the Exchange public market-data
boundary for Binance and non-Binance exchanges, runtime position readback asks
for fallback prices in the actual bot exchange context, and Backtest details
shows resolved `exchange / marketType / baseCurrency` in the header. Focused
runtime tests passed (`36/36`), Backtest details Web test passed (`4/4`), and
API/Web typechecks passed. Next implementation lane remains generic
non-Binance derivatives supplemental adapters, or production-safe multi-bot
runtime clickthrough once the production resource shape exists.

Latest bot/backtest adapter audit:
`V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` is locally verified.
Backtest candle loading, backtest run/timeline replay, bot runtime candle
fallback, market candle DB cache ownership, and Web backtest timeline typing
were audited against the exact `(exchange, marketType)` architecture contract.
Backtest and runtime fallback candles now use the Exchange public market-data
boundary; cache uniqueness includes `source`; and Web timeline types include
backend `exchange`, order-book, and parity mismatch fields. Focused
bot/backtest tests passed (`56/56`), API typecheck passed, and Web typecheck
passed. Next proof remains production-safe multi-bot/runtime clickthrough once
the production LIVE/Gate.io resource shape exists; generic non-Binance
derivatives supplemental data remains a future Exchange adapter capability.

Latest runtime adapter boundary proof:
`V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` is locally verified. Runtime
candle warmup and indicator recovery now use the exchange-owned public
market-data boundary instead of direct Binance REST from Engine. Runtime candle
and derivative stores are exchange-scoped, and strategy/lifecycle/read-model
consumers receive exchange context, so Binance and Gate.io cannot share
in-memory series for the same symbol/interval. Focused runtime/decision-loop
tests passed (`55/55`), exchange/stream/fallback/read-model tests passed
(`12/12`), API typecheck passed, and guardrails passed. Next proof remains
production-safe multi-bot/runtime clickthrough after the production LIVE/Gate.io
resource shape exists.

Latest non-Gate.io LIVE/PAPER proof:
`V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13` is now verified
for the current production non-Gate.io simultaneous runtime scope after the
`457bce05` deploy. Focused API LIVE/PAPER tests passed (`25/25`) and focused
Web Dashboard tests passed (`24/24`). A controlled no-order-guard production
LIVE proof activated the existing Binance LIVE bot only for the observation
window, verified `LIVEIMPORT-03` for `TRXUSDT`, and collected a simultaneous
read-only runtime snapshot where the Binance LIVE bot and both Binance PAPER
bots were RUNNING. Post-cleanup readback confirmed the Binance LIVE bot was
inactive again while both PAPER bots remained healthy. Evidence:
`docs/planning/v1-live-paper-simultaneous-runtime-proof-refresh-457bce05-2026-05-14-task.md`,
`docs/operations/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`,
`docs/operations/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`,
and
`docs/operations/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`.
Gate.io/second-LIVE production shape remains unavailable/deferred rather than
hidden.

Latest production runtime inventory:
`V1-PRODUCTION-RUNTIME-INVENTORY-00169D7F-2026-05-13` is superseded for the
non-Gate.io runtime question by the 2026-05-14 controlled Binance LIVE/PAPER
proof. It remains true that production has no visible second LIVE/Gate.io bot,
so a broader 2x PAPER + 2x LIVE proof would require a separate approved
resource setup decision rather than being part of this release slice.

Latest production UI route proof:
`V1-PRODUCTION-UX-A11Y-MOBILE-PROOF-2FC90A08-2026-05-14` supersedes the older
`00169d7f` route proof. Authenticated production UI route/module audit passed
for deployed `2fc90a08`, and the CDP UX proof captured desktop Dashboard,
Wallets, Bots, Profile, and mobile Dashboard screenshots with mobile menu,
keyboard focus, no framework overlay, no horizontal overflow, and no production
data mutation. Evidence:
`docs/operations/prod-ui-module-clickthrough-2fc90a08-2026-05-14.md` and
`docs/operations/prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14.md`.

Closed proof after V1 target gate:
`V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13` verified the
user's concern for the current release scope: one active Binance LIVE bot and
the active Binance PAPER bots remained separated by wallet/mode/symbol scope,
runtime reads stayed selected-bot scoped, PAPER runtime did not inherit LIVE
exchange/import state, and the architecture's PAPER/LIVE parity rules remain
covered locally where only the execution adapter differs. Gate.io runtime
fallback market data uses the exchange-owned public market-data boundary, and
active LIVE symbol overlap is scoped by exact `(exchange, marketType)`.
Production proof now covers simultaneous Binance LIVE + Binance PAPER runtime
during the controlled no-order-guard observation window. Future proof should
only reopen this lane if a second LIVE/Gate.io production bot is intentionally
created for a broader 2x LIVE shape or a new failing signal appears.

Latest Web/API runtime enum parity checkpoint:
`V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13` tightened Web runtime payload
types to backend enum domains for fee source, trading origin, position
management mode, and capital source, and removed stale impossible enum values
from Dashboard Home/Bots monitoring fixtures. Focused Web runtime tests passed
(`5` files, `47` tests), Web typecheck passed, stale-value scan returned no
matches, and repository guardrails passed. Next Web/API parity work should
continue with endpoint-to-surface checks rather than re-opening these enum
fixtures unless new backend enum values are introduced.
`V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13` also removed the remaining
local Bots Monitoring prop duplicate unions for fee/capital source by reusing
shared aliases. Focused `BotsManagement` test passed (`14/14`), Web typecheck
passed, duplicate-union scan returned no matches, and guardrails passed.

Latest V1 target release gate:
`V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13` is superseded by the
2026-05-14 `457bce05` protected ops gate and the later `2fc90a08` final V1
proof pack. The current tracked completion snapshot is `GO`; the older Docker
Desktop limitation no longer blocks the active V1 evidence model because the
2026-05-14 full release gate and go-live smoke evidence are fresh/pass.

Latest controlled LIVE proof attempt:
`V1-CONTROLLED-LIVE-PROOF-ATTEMPT-00169D7F-2026-05-13` ran after explicit
user live-risk approval. The first attempt exposed and recovered from a runner
partial-update defect that cleared LIVE consent/import flags; production bot
configuration was restored to inactive `liveOptIn=true`,
`manageExternalPositions=true`, consent `mvp-v1`. The runner now preserves
those fields while toggling `isActive`. The corrected proof ultimately passed
for `TRXUSDT`, the real managed LIVE symbol visible to the target bot's runtime
session, and cleanup deactivated the bot. No orders were placed.

Latest controlled LIVE proof preactivation:
`V1-CONTROLLED-LIVE-PROOF-PREACTIVATION-00169D7F-2026-05-13` ran only dry-run
and preactivation checks for the controlled LIVE proof runner. The runner
confirmed matching build-info, fully active no-order guard
(`globalKillSwitch=true`, `emergencyStop=true`, `active=true`), and one
inactive LIVE Binance futures target bot with import management enabled. It
then stopped before activation because `--i-understand-live-risk` was not
provided. This is historical: the later approved controlled no-order-guard proof
produced `LIVEIMPORT-03` readback and deactivated the bot afterward. Any future
LIVE order/cancel/close or exchange-side mutation still requires a separate
explicit approval.

## Historical Superseded Evidence Log

Entries below this heading are retained as audit history. They may contain
older `NO-GO`, `BLOCKED`, or `failed` wording that was true at the time but is
not the active V1 continuation target. Use the `Next Tiny Task` section above
and the final 2026-05-14 scorecard for current GO/NO-GO status.

Latest production restore and LIVEIMPORT truth:
`V1-PROD-RESTORE-AND-LIVEIMPORT-TRUTH-00169D7F-2026-05-13` refreshed the
production restore drill through the Coolify PostgreSQL resource terminal.
Restore evidence is fresh `PASS` for 2026-05-13 with zero leftover restore
databases and zero leftover backup dumps. LIVEIMPORT evidence is now canonical
and fresh, but it fails closed: auth works and one LIVE Binance futures bot
exists, but there is no running session (`NO_RUNNING_SESSION`). Final preflight
now has exactly one blocker: `evidence:liveImportReadback:failed`. Next exact
unblock action requires explicit live-risk approval and a safe way to produce a
running LIVE/import session for the existing LIVE bot, or a product decision to
change the V1 acceptance contract.

Latest protected proof reduction:
`V1-PROTECTED-PROOF-REDUCTION-00169D7F-2026-05-13` used approved production
application credentials only in the local execution environment. Production UI
module clickthrough is fresh `PASS`, and production rollback proof is fresh
`PASS`. LIVEIMPORT auth now works and finds one LIVE Binance futures bot, but
there is no running session, so `LIVEIMPORT-03` still fails closed with
`NO_RUNNING_SESSION`. Final preflight remains `blocked` on production DB
restore context, missing LIVEIMPORT runtime readback, and stale backup/restore
drill evidence. Next exact unblock actions are to obtain non-secret production
DB restore context from Coolify and refresh the restore drill, then produce
LIVEIMPORT readback from an explicitly approved running LIVE/import session.

Latest Gate 4 sign-off:
`V1-GATE4-PATRYK-SIGNOFF-2026-05-13` applied the user's instruction to use
`Patryk` for the required Gate 4 approver/owner fields. RC sign-off now reports
`APPROVED`, and final preflight reports RC evidence as fresh. Remaining V1
blockers are technical protected proof: production auth, DB restore context,
`LIVEIMPORT-03`, authenticated production UI clickthrough, DB restore evidence,
and rollback proof.

Latest generated state refresh after activation and RC evidence:
`V1-GENERATED-STATE-REFRESH-AFTER-RC-ACTIVATION-2026-05-13` reran the V1
generated-state chain after current activation and RC artifact refresh.
Generated state remains `NO-GO`: `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static
findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard `86.8%` implementation,
`61.3%` evidence coverage, and `42.4%` release readiness.

Latest RC blocked refresh:
`V1-RC-CURRENT-BLOCKED-REFRESH-2026-05-13` refreshed RC external gates status,
RC sign-off, and RC checklist artifacts for 2026-05-13. Final preflight now
classifies RC evidence as current `failed`/`BLOCKED` rather than stale because
Gate 4 approver fields are still missing. V1 remains `NO-GO`.

Latest production activation refresh:
`V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-13` refreshed activation audit and
activation evidence plan artifacts for the current evidence date. Final
preflight now classifies activation evidence as fresh for 2026-05-13, but V1
remains `NO-GO` on missing protected auth, missing DB restore context, stale
RC/backup-restore/rollback evidence, missing `LIVEIMPORT-03`, and failed
authenticated production UI clickthrough.

Latest generated state refresh after operator packet:
`V1-GENERATED-STATE-REFRESH-AFTER-OPERATOR-PACKET-00169D7F-2026-05-13`
reran the V1 generated-state chain after the current operator packet was
published. Generated state remains `NO-GO`: `PASS_LOCAL:20`,
`BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard
`86.8%` implementation, `61.3%` evidence coverage, and `42.4%` release
readiness.

Latest operator packet current-day refresh:
`V1-OPERATOR-PACKET-CURRENT-DAY-REFRESH-00169D7F-2026-05-13` published the
current no-secret V1 operator unblock packet:
`docs/operations/v1-operator-unblock-packet-00169d7f-2026-05-13.md`. The
packet references the 2026-05-13 final preflight, protected input readiness,
and production UI audit artifacts, and keeps V1 `NO-GO` until protected inputs
and Gate 4 approval allow the final release gate to return `ready`.

Latest generated state refresh after current-day blocker evidence:
`V1-GENERATED-STATE-REFRESH-AFTER-CURRENT-DAY-BLOCKER-00169D7F-2026-05-13`
refreshed the V1 project index, static scan, master ledger, and completion
scorecard for 2026-05-13. Generated state remains `NO-GO`: `PASS_LOCAL:20`,
`BLOCKED_AUTH:1`, static findings `3` (`P0:1`, `P1:1`, `P2:1`), scorecard
`86.8%` implementation, `61.3%` evidence coverage, and `42.4%` release
readiness. The only executable next steps remain protected/operator-gated:
approved production auth, admin auth, rollback guard auth, DB restore context,
Gate 4 approver fields, then the active operator packet.

Latest current-day V1 blocker refresh:
`V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13` refreshed no-secret
release evidence for deployed build
`00169d7fdc3aff8317759137b05594b20e773c8e`. Build-info and final preflight
public smoke passed, but preflight remains `blocked`: protected auth and DB
context are missing, daily activation/RC/backup-restore/rollback artifacts are
stale for 2026-05-13, `LIVEIMPORT-03` is missing, and the fresh production UI
clickthrough is `BLOCKED_AUTH`/`failed` because dashboard/admin auth is
missing. V1 remains `NO-GO`.

Latest generated state refresh after queue hygiene:
`V1-GENERATED-STATE-REFRESH-AFTER-QUEUE-HYGIENE-00169D7F-2026-05-12`
refreshed the V1 project index, static scan, master ledger, and completion
scorecard after stale queue-marker supersessions. Generated state remains
`NO-GO`: `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static findings `3`
(`P0:1`, `P1:1`, `P2:1`), scorecard `86.8%` implementation, `61.3%` evidence
coverage, and `42.4%` release readiness. Static scan now reports
`2 protected/auth queue blockers remain open`, matching
`CONTROLLED-LIVE-SESSION-PROOF` and `LIVEIMPORT-03`.

Latest production UI audit plan supersession:
`PROD-UI-AUDIT-PLAN-SUPERSEDE-00169D7F-2026-05-12` closed the historical
unchecked `PROD-UI-AUDIT-PLAN-2026-05-08` queue item as superseded by the
current V1 release-gate UI evidence lane: `ops:ui:prod-clickthrough` with
approved `PROD_UI_AUDIT_*` dashboard/admin auth. This is not production UI
verification; the final gate still requires a fresh PASS
`prod-ui-module-clickthrough-*` artifact. V1 remains `NO-GO`.

Latest BOTMULTI production marker supersession:
`BOTMULTI-09-CONTAINMENT-SUPERSEDE-00169D7F-2026-05-12` closed the historical
unchecked `BOTMULTI-09` production promotion marker as contained in the
deployed V1 line and superseded by the shared protected runtime readback/final
gate lane. This is not production runtime verification; `LIVEIMPORT-03` and
the final release gate remain required protected proof. V1 remains `NO-GO`.

Latest protected readiness supersession:
`V1-PROTECTED-ACCESS-READINESS-SUPERSEDE-00169D7F-2026-05-12` closed the
historical unchecked `V1-PROTECTED-ACCESS-READINESS-2026-05-09` queue item as
superseded by the current `00169d7f` operator packet and protected input
readiness sweep. This is queue hygiene only: protected evidence remains
blocked, and V1 remains `NO-GO`.

Latest protected input readiness current sweep:
`V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12` refreshed the
no-secret protected input readiness sweep in the current Codex shell. No
matching environment variable names were present for `LIVEIMPORT_READBACK_*`,
`ROLLBACK_GUARD_*`, `PROD_UI_AUDIT_*`, `PROD_UI_*`, `SOAR_PROD_*`,
production DB check, RC, or Gate families. No secret values were printed or
stored. V1 remains `NO-GO`; next exact unblock action is still to provide
approved protected auth and real Gate 4 approver inputs, then execute the
operator unblock packet.

Latest production UI current blocked refresh:
`V1-PROD-UI-CURRENT-BLOCKED-REFRESH-00169D7F-2026-05-12` captured a current
no-auth production UI clickthrough audit for deployed
`00169d7fdc3aff8317759137b05594b20e773c8e`. Build-info matched, public routes
passed, and dashboard/admin/legacy protected routes failed closed to
`/auth/login` without storing secrets or protected payloads. The release gate
now prioritizes matched artifact evidence date before filename fallback, so the
current 2026-05-12 UI artifact is evaluated instead of older lexically later
SHA evidence. Refreshed preflight now reports `prodUiClickthrough:failed`. V1
remains `NO-GO`; next exact unblock action is approved `PROD_UI_AUDIT_*`
dashboard/admin auth plus PASS UI clickthrough, protected Operations evidence,
RC Gate 4 approval, and the final non-dry-run release gate.

Latest operator packet UI admin auth sync:
`V1-OPERATOR-PACKET-UI-ADMIN-AUTH-SYNC-2026-05-12` aligned the active V1
operator packet with final preflight: the default production UI clickthrough
requires both dashboard `PROD_UI_AUDIT_AUTH_*` and admin
`PROD_UI_AUDIT_ADMIN_*` auth because admin routes are included by the runner.
V1 remains `NO-GO`.

Latest generated state refresh:
`V1-GENERATED-STATE-REFRESH-AFTER-UI-GATE-2026-05-12` refreshed the V1 project
index, static scan, master ledger, and completion scorecard after production UI
evidence hardening. Generated state remains unchanged in release substance:
`PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static findings `3`
(`P0:1`, `P1:1`, `P2:1`), scorecard `86.8%` implementation, `61.3%` evidence
coverage, and `42.4%` release readiness. V1 remains `NO-GO`.

Latest release gate production UI evidence hardening:
`V1-RELEASE-GATE-PROD-UI-EVIDENCE-HARDENING-2026-05-12` updated the final V1
release gate so production readiness now requires a fresh PASS
`prod-ui-module-clickthrough-*` artifact with authenticated Bots UI coverage
for `/dashboard/bots` and `/dashboard/bots/create`. Final preflight now reports
missing `PROD_UI_AUDIT_*` dashboard/admin auth as protected prerequisites and
maps missing/failed UI clickthrough evidence to the existing
`ops:ui:prod-clickthrough` command. V1 remains `NO-GO`; next exact unblock
action is still approved protected inputs plus fresh PASS evidence for
production UI clickthrough, `LIVEIMPORT-03`, rollback proof, RC Gate 4, and the
final non-dry-run release gate. The refreshed no-secret preflight for deployed
`00169d7fdc3aff8317759137b05594b20e773c8e` has build-info and public smoke
`PASS`, production DB restore context satisfied, and blocks on missing
`PROD_UI_AUDIT_*` dashboard/admin auth plus current failed production UI
clickthrough evidence from 2026-05-12.

Latest production UI input unblock sync:
`V1-PROD-UI-INPUT-UNBLOCK-SYNC-00169D7F-2026-05-12` synchronized the current
V1 operator unblock packet with the remaining P1 Bots production-safe
clickthrough blocker. The packet now lists `PROD_UI_AUDIT_*` auth inputs,
includes `pnpm run ops:ui:prod-clickthrough` before the final release gate, and
states that public route reachability or unauthenticated redirects do not
satisfy V1 UI evidence. V1 remains `NO-GO`; next exact unblock action is to
provide approved `PROD_UI_AUDIT_*` app/admin auth and run the UI clickthrough
to `PASS` alongside `LIVEIMPORT-03`, rollback proof PASS, RC Gate 4 approval,
and the final non-dry-run release gate.

Latest protected queue dedupe:
`V1-PROTECTED-QUEUE-DEDUPE-2026-05-12` updated V1 static scan reporting so
protected/auth queue blockers are deduped by task text across `TASK_BOARD` and
`mvp-next-commits`, while all source locations remain in evidence. The scan
still reports `3` findings (`P0:1`, `P1:1`, `P2:1`), but the P2 blocker now
reflects `5` unique protected/auth tasks instead of `10` duplicated queue
markers. V1 remains `NO-GO`.

Latest capability gate scan classification:
`V1-CAPABILITY-GATE-SCAN-CLASSIFICATION-2026-05-12` updated the V1 static scan
so contract-approved exchange capability gates are no longer counted as
unresolved findings. Refreshed static scan findings dropped from `32` to `3`
(`P0:1`, `P1:1`, `P2:1`), leaving Operations `BLOCKED_AUTH`, Bots
production-safe clickthrough, and protected queue blockers. V1 remains
`NO-GO`.

Latest manual payment metadata cleanup:
`V1-MANUAL-PAYMENT-METADATA-CLEANUP-2026-05-12` removed ambiguous
`placeholder` wording from manual payment checkout metadata without changing
checkout behavior. Focused subscription checkout proof passed (`8/8`);
refreshed V1 static scan findings dropped from `33` to `32`
(`P0:1`, `P1:1`, `P2:30`), and the `source-marker` category is gone. V1
remains `NO-GO` on protected production proof and Operations `BLOCKED_AUTH`.

Latest queue none-marker cleanup:
`V1-QUEUE-NONE-MARKER-CLEANUP-2026-05-12` converted false unchecked `(none)`
placeholders in `TASK_BOARD` to plain `None.` text and refreshed the V1
generator chain. Static scan findings dropped from `34` to `33`
(`P0:1`, `P1:1`, `P2:31`), and the master ledger no longer reports the
`toCleanPlanning` queue-hygiene bucket. V1 remains `NO-GO` on protected
production proof and Operations `BLOCKED_AUTH`.

Latest current-state drift cleanup:
`V1-CURRENT-STATE-DRIFT-CLEANUP-2026-05-12` reran the V1 generator chain and
cleaned active queue/state wording that still described the final non-dry-run
production gate as not yet run or rollback proof as stale. Generated state
remains `NO-GO`: `PASS_LOCAL:20`, `BLOCKED_AUTH:1`, static findings `34`
(`P0:1`, `P1:1`, `P2:32`), and scorecard `86.8% / 61.3% / 42.4%`. Current
truth: the final non-dry-run gate ran and stopped `not_ready`; rollback proof
is fresh but failed on protected `401`.

Latest protected input readiness refresh:
`V1-PROTECTED-INPUT-READINESS-REFRESH-00169D7F-2026-05-12` checked only
environment variable names for `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
`PROD_UI_*`, and `SOAR_PROD_*` in the current Codex execution session. No
matching names were present and no secret values were printed. The operator
packet now also reflects that the final non-dry-run production gate has already
run and stopped `not_ready` on protected `/workers/health` `401`. V1 remains
`NO-GO`; the next exact production unblock action remains executing the
operator packet with approved protected inputs and real Gate 4 approver fields.

Latest queue blocker classification:
`V1-STATIC-SCAN-QUEUE-BLOCKER-CLASSIFICATION-2026-05-12` updated
`scripts/runV1StaticIssueScan.mjs` so known protected/auth queue blockers
remain open but are classified as `queue-blocked` instead of unclassified
local queue drift. Refreshed V1 generators now show `34` findings
(`P0:1`, `P1:1`, `P2:32`) and `concreteNonProofGaps:0`. V1 remains `NO-GO`;
the next exact production unblock action remains the operator packet.

Latest static scan route classification:
`V1-STATIC-SCAN-LEGACY-ROUTE-CLASSIFICATION-2026-05-12` updated
`scripts/runV1StaticIssueScan.mjs` so approved `/dashboard/orders` and
`/dashboard/positions` legacy redirects plus runtime-owned Orders/Positions
web feature shells are not reported as missing active pages. Refreshed V1
generators now show `34` findings (`P0:1`, `P1:2`, `P2:31`) and concrete
non-proof gaps are down to `1`. V1 remains `NO-GO`; the next exact production
unblock action remains the operator packet.

Latest API Subscriptions doc truth update:
`V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12` aligned
`docs/modules/api-subscriptions.md` with the V1 billing boundary. Checkout
intent creation and admin/profile subscription state are in scope; provider
webhook reconciliation remains future billing lifecycle scope. Refreshed V1
generators now show `38` findings (`P0:1`, `P1:6`, `P2:31`) and no longer
report `DOC_PLACEHOLDER_DOCS_MODULES_API_SUBSCRIPTIONS_MD`. V1 remains
`NO-GO`; the next exact production unblock action remains the operator packet.

Latest web Orders/Positions doc truth update:
`V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligned
`docs/modules/web-orders.md` and `docs/modules/web-positions.md` with the
canonical route map. `/dashboard/orders` and `/dashboard/positions` remain
legacy redirects to Bot Runtime, while runtime Orders/Positions UX is owned by
Dashboard Home and Bot Runtime. Middleware redirect tests passed (`3/3`);
refreshed V1 generators now show `39` findings (`P0:1`, `P1:6`, `P2:32`) and
no longer report the two web Orders/Positions documented-placeholder gaps. V1
remains `NO-GO`; the next exact production unblock action remains the
operator packet.

Latest subscriptions focused test gap closure:
`V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12` adds direct focused coverage for
the core `subscriptions` module. Focused Vitest passed (`2/2`) for invalid
entitlement fallback and FREE-plan LIVE trading fail-closed behavior; API
typecheck passed; refreshed V1 generators now show `41` findings
(`P0:1`, `P1:8`, `P2:32`) and no longer report
`API_MODULE_NO_TESTS_SUBSCRIPTIONS`. V1 remains `NO-GO`; the next exact
unblock action remains the operator packet.

Latest non-dry-run release gate:
`V1-RELEASE-GATE-NONDRYRUN-BLOCKED-2026-05-12` ran the production release gate
without `--dry-run` and with local quality skipped. Build-info freshness
passed for `00169d7fdc3aff8317759137b05594b20e773c8e`; public API `/health`,
API `/ready`, and Web `/` passed inside deploy smoke; protected
`/workers/health` returned `401`, so the gate stopped at `not_ready`.
Evidence: `docs/operations/v1-release-gate-prod-2026-05-12Tnon-dry-run-blocked.md`.
Next exact unblock action remains the operator packet.

Current operator unblock packet:
`V1-OPERATOR-UNBLOCK-PACKET-00169D7F-2026-05-12` publishes the active no-secret
handoff for deployed build-info `00169d7fdc3aff8317759137b05594b20e773c8e`:
`docs/operations/v1-operator-unblock-packet-00169d7f-2026-05-12.md`. Next
exact unblock action: provide `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
and `PROD_UI_AUDIT_*` auth, run the packet's `LIVEIMPORT-03`, rollback proof,
and production UI clickthrough commands to PASS, provide real Gate 4
approvers, refresh RC artifacts, then run the final production release gate
without dry-run.

Latest final preflight refresh:
`V1-FINAL-PREFLIGHT-CURRENT-2026-05-12` refreshes the no-secret final
production preflight for deployed build-info
`00169d7fdc3aff8317759137b05594b20e773c8e`. Build-info and public smoke pass.
Preflight remains `blocked` on missing `LIVEIMPORT_READBACK_*`, missing
`ROLLBACK_GUARD_*`, failed RC external gates/sign-off/checklist, missing
`LIVEIMPORT-03`, and failed rollback proof. Next exact unblock action: provide
approved production app/operator auth, run `LIVEIMPORT-03`, rerun rollback
proof to PASS, provide real Gate 4 approvers, refresh RC artifacts, then rerun
the final production gate without dry-run.

Latest rollback proof blocked refresh:
`V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-12` refreshes production rollback
proof to current-date fail-closed evidence. The artifact reports
`Status: **FAIL**`, `shouldRollback: true`, and reasons
`runtime_freshness_endpoint_http_401` plus `alerts_endpoint_http_401`.
Release gate dry-run now classifies rollback proof as `failed` for 2026-05-12
instead of stale. Remaining exact V1 blockers: LIVEIMPORT-03 production
readback is missing, rollback proof needs approved auth to PASS, the latest
non-dry-run release gate stopped `not_ready`, and real Gate 4 approver fields
are still needed.

Latest RC blocked refresh:
`V1-RC-BLOCKED-REFRESH-2026-05-12` refreshes RC external gates status,
RC sign-off, and release-candidate checklist to current-date blocked truth.
Release gate dry-run now classifies RC external gates, RC sign-off, and RC
checklist as `failed` for 2026-05-12 instead of stale. Remaining exact V1
blockers: LIVEIMPORT-03 production readback is missing, rollback proof is
failed on protected `401`, the latest non-dry-run release gate stopped
`not_ready`, and approved protected prod ops auth plus real Gate 4 approver
fields are still needed.

Latest production activation refresh:
`V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-12` refreshes activation audit and
activation execution plan artifacts to current-date `NO-GO` truth. Release
gate dry-run now classifies activation evidence audit and activation execution
plan as `fresh` for 2026-05-12. Remaining exact V1 blockers: RC Gate 4/sign-
off is not approved, LIVEIMPORT-03 production readback is missing, rollback
proof is fresh but failed on protected `401`, and approved protected prod ops
auth is still needed.

Latest production restore drill refresh:
`V1-PROD-RESTORE-DRILL-REFRESH-2026-05-12` refreshes the production
backup/restore drill to current-date `PASS`. The isolated restore drill used
production Postgres container `x11cfnz1dd9x0yzccftqzcoe`, restored into
`postgres_restore_check_20260512152138`, validated aggregate counts
(`Bot=6`, `Log=52740`, `Order=3981`, `Position=4787`, `User=4`), dropped the
restore database, removed the backup dump, and cleanup returned `0` matching
restore DBs/backups. Release gate dry-run now classifies backup/restore drill
evidence as `fresh` for 2026-05-12. Remaining exact V1 blockers: RC
sign-off/Gate 4/checklist failed, LIVEIMPORT-03 production readback missing,
rollback proof stale, and protected prod ops auth still needed.

Latest Operations production read-only proof:
`V1-OPERATIONS-PROD-READONLY-PROOF-2026-05-12` collected safe current
production/stage evidence and keeps V1 `NO-GO`. Production public no-worker
smoke passed, public `build-info`/`/health`/`/ready` returned `200`, and VPS
Docker inventory showed Soar API, Web, workers, Redis, and Postgres running.
Stage public smoke failed with `503`. The production release gate report
`docs/operations/v1-release-gate-prod-2026-05-12Tprod-readonly.md` is
`not_ready`: protected `/workers/health` returned `401` without approved
app/operator auth, LIVEIMPORT-03 production readback is missing, RC external
gates/checklist remain failed because Gate 4 is not approved, and activation,
sign-off, backup/restore, and rollback proof artifacts are stale for
2026-05-12. Next exact unblock action: provide approved production app/operator
auth for protected worker/runtime/rollback endpoints, produce Gate 4 sign-off,
run a current production backup/restore drill and rollback proof, and provide a
safe running LIVE/import readback fixture for LIVEIMPORT-03.

Latest Operations local proof:
`V1-OPERATIONS-LOCAL-PROOF-2026-05-12` partially proves the Operations scripts
locally but keeps Operations `BLOCKED_AUTH` for V1 release approval. Local
rollback proof passed, short SLO collection/window report was generated, local
RC gate pipeline produced Gate 1/2/3 `PASS` with Gate 4 sign-off blocked, and
local V1 release gate passed deploy smoke/runtime freshness/rollback guard.
Local LIVEIMPORT-03 readback authenticated but failed because no LIVE bots or
running import sessions were available. Next exact unblock action: provide
approved stage/prod target credentials, Gate 4 sign-off, backup/restore
evidence, and a safe LIVE/import readback fixture, then rerun the Operations
gate pack.

Latest Subscriptions/Admin local proof:
`V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12` moves
Subscriptions/Admin to `PASS_LOCAL`. API Subscriptions/Admin tests passed
(`3` files, `18` tests), Web Admin/Profile Subscription tests passed
(`3` files, `7` tests), local protected admin route audit passed, and
Edge/CDP browser proof rendered `/admin/subscriptions` and `/admin/users`
with no framework overlay. The remaining V1 blocker is Operations protected/
production-safe evidence: rollback proof PASS, liveimport readback, SLO/release
gate, alerts, and cleanup-safe evidence. Regenerated reports now show
`PASS_LOCAL:20`, `BLOCKED_AUTH:1`, scorecard `NO-GO`, implementation estimate
`86.8%`, evidence coverage `61.3%`, and release readiness `42.4%`.

Latest UX/A11y/Mobile local proof:
`V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11` moves UX/A11y/Mobile to
`PASS_LOCAL`. Local authenticated route/clickthrough audit passed, focused Web
UX/a11y/state tests passed (`25` files, `126` tests), and Edge/CDP browser
proof captured desktop Dashboard, desktop Wallets, mobile Dashboard, and
mobile menu screenshots with no framework overlay. Mobile menu focus/click
interaction was exercised, and CDP console/exception proof returned `0`
events. Production browser clickthrough and external accessibility review
remain open. The remaining V1 blockers are protected/auth or production-safe
evidence rows, especially Subscriptions/Admin and Operations.

Latest Security/Privacy local proof:
`V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11` moves Security/Privacy to
`PASS_LOCAL` in the product action matrix. API Security/Privacy tests passed
(`23` files, `111` tests), covering security/no-store headers, admin/ops
diagnostics, `/ready` secret/runtime diagnostics, API error redaction, crypto
keyring behavior, rate-limit degradation, ops-network/trusted-origin/auth
middleware, critical secret readiness, Auth lifecycle/JWT/cookie/error
contracts, cross-module data isolation, Profile API-key ownership/secret
handling/probes, Profile password/account deletion, stage abuse throttling,
and authenticated position snapshots. Web Auth/Profile tests passed (`13`
files, `48` tests), covering middleware, AuthContext, login/register flows,
auth cache contract, profile page, API-key form/list, security form, and basic
profile form. Remaining proof is production-safe protected security proof and
external/independent security review. After report refresh, the next unblocked
local proof gap is UX/A11y/Mobile; Subscriptions/Admin and Operations remain
blocked on protected/auth or production-safe evidence.

Latest Workers local proof:
`V1-WORKERS-LOCAL-PROOF-2026-05-11` moves Workers to `PASS_LOCAL` in the
product action matrix. API Workers/stream/runtime tests passed (`18` files,
`88` tests), covering worker ownership/topology, split/inline readiness,
protected worker health, runtime freshness pass/fail/skip behavior, protected
`/ready` diagnostics, market-stream fanout/source/subscription behavior, queue
tuning, backtest job persistence, execution/runtime orchestration, and PAPER
runtime-flow telemetry. The slice also fixed worker-adjacent e2e DB isolation
for runtime sessions/symbol stats/signals/backtest runs and market candle
cache. Workers are now `PASS_LOCAL`; production-safe protected worker/process
proof remains open.

Latest Exchange Adapter local proof:
`V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11` moves Exchange Adapter to
`PASS_LOCAL` in the product action matrix and fixes Gate.io public catalog
symbol normalization (`BTC_USDT` -> `BTCUSDT`) at the adapter boundary. API
Exchange tests passed (`19` files, `93` tests), and Web Exchanges/Profile
API-key tests passed (`5` files, `17` tests). Remaining proof is production-
safe exchange-boundary proof with approved credentials or read-only operations;
real live mutation remains blocked-risk without an explicit safe plan. The
next unblocked local P0 modules from the refreshed V1 ledger are Workers and
Security/Privacy.

Latest Logs/Audit Trail local proof:
`V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11` moves Logs/Audit Trail to `PASS_LOCAL`
in the product action matrix. API Logs tests passed (`2` files, `5` tests),
covering unauthenticated rejection, owner-only reads, source/actor/severity
filters, action-produced audit event visibility, and pagination defaults/
bounds. Web Logs tests passed (`3` files, `4` tests), covering
`/dashboard/logs` route shell, empty/loaded states, severity filter request
payload, metadata trace rendering, and route-reachable locale copy. Remaining
proof is production-safe Logs/Audit Trail browser clickthrough. The next
unblocked local modules from the refreshed V1 ledger are Exchange Adapter,
Workers, Security/Privacy, and UX/A11y/Mobile; choose by P0 risk order unless
production-safe/auth proof becomes available.

Latest Reports local proof:
`V1-REPORTS-LOCAL-PROOF-2026-05-11` moves Reports to `PASS_LOCAL` in the
product action matrix. API Reports tests passed (`1` file, `2` tests),
covering weighted BACKTEST report aggregation and PAPER trade aggregation. Web
Reports tests passed (`3` files, `5` tests), covering `/dashboard/reports`
route shell, empty state, aggregated cards/tables, and route-reachable locale
copy. Remaining proof is production-safe Reports browser clickthrough;
export/download is outside the current implemented Reports surface. The next
unblocked local module from the refreshed V1 ledger is Logs/Audit Trail.

Latest Backtests local proof:
`V1-BACKTESTS-LOCAL-PROOF-2026-05-11` moves Backtests to `PASS_LOCAL` in the
product action matrix. API Backtests tests passed (`12` files, `110` tests),
covering auth/ownership, create/list/get/delete, explicit range validation,
pending report lifecycle, strategy-to-backtest-to-paper/live critical flow,
paper/live parity, venue consistency, market-universe symbol formula,
fail-closed empty symbols, failed parity diagnostics, run queue/job
persistence, replay core, runtime kernel parity, contract remediation, data
gateway, fill model, range service, and indicator timeline series. Web
Backtests tests passed (`13` files, `32` tests), covering list/create/detail
route shells, create form, run details, list view, runs table actions, core
data hook, view-models, trade segments, pair metrics, and timeline overlays.
Remaining proof is production-safe Backtests browser clickthrough. The next
unblocked local module from the refreshed V1 ledger is Reports.

Latest Orders local proof:
`V1-ORDERS-LOCAL-PROOF-2026-05-11` moves Orders to `PASS_LOCAL` in the product
action matrix. API Orders tests passed (`10` files, `121` tests), covering
active order filtering, PAPER/LIVE open contracts, missing price truth
rejection, same-symbol add/reverse conflict handling, canonical bot context,
LIVE pretrade/risk guards, exchange ids/status/fills/fees, execution error
propagation, manual context rules, close attribution, stale/open exchange-
backed cancel and close fail-closed behavior, API list/get ownership, exchange
event open/close/DCA/account-update lifecycle, partial/underfilled/capped fill
progress, fee pending/backfill, live fill resolution, quantity rules, position
scope, and live cancel boundary. Web Orders tests passed (`2` files, `3`
tests), covering source labels, active open-order cancel action, and terminal
order read-only behavior. Remaining proof is production-safe Orders browser
clickthrough; live mutation remains blocked-risk without explicit safe plan.
The next unblocked local module from the refreshed V1 ledger is Backtests.

Latest Positions local proof:
`V1-POSITIONS-LOCAL-PROOF-2026-05-11` moves Positions to `PASS_LOCAL` in the
product action matrix. API Positions tests passed (`12` files, `90` tests),
covering list/read ownership, symbol filter normalization, stale local
exclusion, live status scoping, exchange snapshot selection/fail-closed
behavior, authenticated snapshots, takeover classification/rebind, orphan
repair, imported lifecycle history, reconciliation diagnostics, manual TP/SL
safety, management-mode guards, runtime visibility, close flows, external DCA
separation, and carryover open orders. Web Positions tests passed (`3` files,
`10` tests), covering runtime PnL derivations/fallbacks and ignored/closed/
pending close UI states. Remaining proof is production-safe Positions browser
clickthrough; LIVE mutation remains blocked-risk without explicit safe plan.

Latest Manual Orders local proof:
`V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11` moves Manual Orders to `PASS_LOCAL`
in the product action matrix. API Manual Orders tests passed (`7` files,
`75` tests), covering manual context, PAPER market truth, open/cancel/close
endpoints, order/position ownership, selected-bot write/read scope, quantity
rules, position scope, LIVE risk guards, exchange-backed fail-closed cancel
behavior, live fill resolution, and live cancel boundary. Web Manual Orders
tests passed (`6` files, `20` tests), covering Dashboard Home submit,
validation, context/venue/scope semantics, open-order source labels,
open-order cancel actions, and submitted/waiting/ready/imported/position-
opened/blocked action states. Remaining proof is production-safe Manual Orders
browser clickthrough; LIVE order actions remain blocked-risk without explicit
safe plan.

Latest Strategies local proof:
`V1-STRATEGIES-LOCAL-PROOF-2026-05-11` moves Strategies to `PASS_LOCAL` in the
product action matrix. API Strategies tests passed (`3` files, `17` tests),
covering CRUD, export/import, advanced TSL validation, invalid import
rejection, ownership isolation, active-bot update/delete blocking, inactive bot
update allowance, DCA reachability validation, and indicator catalog behavior.
Web Strategies tests passed (`14` files, `46` tests), covering clone payload,
route shells, form validation, tab flow, advanced TSL and DCA validation,
presets, indicators, form mapping, numeric normalization, close validation,
presentation, and taxonomy. Remaining proof is production-safe Strategies
browser clickthrough plus representative runtime/backtest compatibility proof.

Latest Markets local proof:
`V1-MARKETS-LOCAL-PROOF-2026-05-11` moves Markets to `PASS_LOCAL` in the
product action matrix. API Markets e2e passed (`17/17`), covering CRUD,
normalization, canonical symbol composition, linked symbol-group sync, empty
symbol sets, Binance/Gate.io catalog reads, placeholder persistence,
not-implemented catalog responses, active-bot update/delete blocking,
inactive PAPER/LIVE bot edits, bot-API deactivation edits, stale legacy link
ignore, active primary bot drift blocking, and ownership isolation. Web Markets
tests passed (`5` files, `12` tests), covering preview parity, whitelist/
blacklist composition, empty preview submit, placeholder exchange submit,
validation helper, table clone payload, and route shells. Remaining proof is
production-safe Markets browser clickthrough.

Latest Wallets local proof:
`V1-WALLETS-LOCAL-PROOF-2026-05-11` moves Wallets to `PASS_LOCAL` in the
product action matrix. API Wallets tests passed (`4` files, `43` tests),
covering CRUD, ownership isolation, active-bot guards, LIVE key/allocation
validation, preview allocation/fail-closed paths, paper reset guards, reset
checkpoint preservation, cashflow classification, and open-PnL scoping. Web
Wallets tests passed (`9` files, `22` tests), covering list/create/edit/
preview routes, inline API-key state, clone payload, form validation,
mode-specific fields, LIVE preview, reset success/error, partial ledger, and
unavailable ledger fail-closed state. Remaining proof is production-safe
Wallets browser clickthrough.

Latest Profile local proof:
`V1-PROFILE-LOCAL-PROOF-2026-05-11` moves Profile to `PASS_LOCAL` in the
product action matrix. API Profile basic/security e2e passed (`2` files,
`7` tests), covering timezone persistence/rejection, unauthenticated security
rejection, valid-current-password change, weak/invalid password rejection,
old-login failure/new-login success, and password-confirmed account deletion.
Web tests passed (`2` files, `5` tests), covering basic profile save
success/error toasts, timezone preference payload, password mismatch
short-circuit, and password change payload/feedback. Remaining proof is
production-safe Profile browser clickthrough.

Latest Profile API Keys local proof:
`V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11` moves Profile API Keys to
`PASS_LOCAL` in the product action matrix. API key e2e and probe service tests
passed (`2` files, `25` tests), covering encrypted storage, masked responses,
create/update/delete/rotate/revoke ownership, Binance/Gate.io provided and
stored probes, audit metadata without raw secrets, placeholder fail-closed
probe behavior, and no persistence of provided test secrets. Web tests passed
(`2` files, `13` tests), covering connection-test-before-save, stored-key test
action, probe support status, placeholder exchange save behavior, and delete
risk confirmation. Remaining proof is production-safe browser clickthrough and
audit-log visibility.

Latest Auth session lifecycle proof:
`V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11` moves Auth to `PASS_LOCAL` in
the product action matrix. API Auth e2e passed (`11/11`) and proves login
cookie TTLs, logout cookie clearing plus `/auth/me` 401, deleted-user session
expiry, expired JWT cookie clearing with session-expired message, and duplicate
token precedence. Focused Web Auth tests passed (`5` files, `17` tests) and
prove AuthProvider bootstrap/logout/session-expired warning, API interceptor
redirect, middleware cookie gate, login form states, and login hook fail-closed
missing-session-refresh behavior. Remaining Auth proof is production-safe
browser clickthrough for login, logout, and expired-session redirect.

Latest Bot Runtime PAPER session browser proof:
`V1-BOT-RUNTIME-PAPER-SESSION-BROWSER-PROOF-2026-05-11` adds local
authenticated browser evidence for the canonical Bot Runtime route
`/dashboard/bots/2009f226-28ed-4231-878b-350d27057b5f/preview`. The approved
PAPER snapshot import passed, API readbacks for sessions, aggregate,
positions, symbol stats, and trades returned `200`, and the browser rendered
bot `asd`, PAPER mode, status `RUNNING`, `BTCUSDT`, `BNBUSDT`, `ETHUSDT`,
wallet KPI text, desktop/tablet/mobile runtime visibility, safe view switch,
and both legacy runtime redirects to preview. `SOAR-BOT-RUNTIME-001` remains
`PARTIAL`; the stopped/completed gap is now covered by
`V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11`, and worker telemetry is
covered by `V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11`. Next Bot
Runtime proof is production-safe/non-local clickthrough when approved.

Latest Bot Runtime completed session proof:
`V1-BOT-RUNTIME-COMPLETED-SESSION-FIXTURE-2026-05-11` extends the approved
PAPER snapshot import with a deterministic local `COMPLETED` session. API
readbacks prove runtime session statuses `RUNNING,COMPLETED`, one completed
session with `eventsCount: 1`, `symbolsTracked: 3`, completed positions
`openCount: 0`, and aggregate metadata `sessionsCount: 2`. Authenticated
browser proof filters Bot Runtime to `COMPLETED` and renders PAPER completed
state with `0 open`, symbols, and wallet totals.

Latest Bot Runtime worker telemetry proof:
`V1-BOT-RUNTIME-WORKER-TELEMETRY-PROOF-2026-05-11` extends
`runtime-flow.e2e.test.ts` so a real `RuntimeSignalLoop` PAPER lifecycle
creates a `RUNNING` session, writes runtime events, tracks `BTCUSDT` symbol
stats with long and exit counters, closes the runtime position, and exposes
the same telemetry through authenticated runtime session list, detail,
symbol-stats, and aggregate APIs. `SOAR-BOT-RUNTIME-001` remains `PARTIAL`
only because production-safe/non-local clickthrough is still open.

Latest Dashboard Home active runtime browser proof:
`V1-DASHBOARD-HOME-RUNTIME-SESSION-FIXTURE-2026-05-11` upgrades the approved
PAPER snapshot import so it creates deterministic local PAPER wallet/session/
stat/event fixture data for the imported active bot. API readback now proves
`/runtime-sessions` `RUNNING`, session positions `openCount: 3`, and aggregate
`openCount: 3`. Authenticated `/dashboard` browser proof now renders bot `asd`,
PAPER mode, status `RUNNING`, open rows for `BTCUSDT`, `BNBUSDT`, `ETHUSDT`,
portfolio `10,000.00 USDT`, free funds `7,000.00 USDT`, desktop/tablet/mobile
runtime visibility, and `Orders` tab interaction. `SOAR-DASHBOARD-001` remains
`PARTIAL` only because production-safe clickthrough/non-local proof is still
open.

Latest Dashboard Home browser proof:
`V1-DASHBOARD-HOME-BROWSER-PROOF-2026-05-11` adds local authenticated browser
evidence for `/dashboard` empty/onboarding state. Desktop `1280x720` and mobile
`390x844` passed with no framework overlay and no console errors after the
shared `ThemeSwitcher` hydration-noise fix; keyboard focus on `Open wallets`
passed. Targeted Web Vitest (`4` files, `36` tests), Web typecheck, and
repository guardrails passed. `SOAR-DASHBOARD-001` remains `PARTIAL`. Next executable Dashboard task:
seed or approve representative active PAPER runtime data, then prove selected
bot runtime tabs/wallet KPIs in browser across desktop/tablet/mobile, including
touch/menu interaction and production-safe clickthrough when approved.

Latest Dashboard Home rendered action proof:
`V1-DASHBOARD-HOME-SELECTED-BOT-RENDERED-AUDIT-2026-05-11` adds local
rendered evidence for loading state, retryable error state, selected-bot
switching across two active PAPER bots, selected wallet KPI recalculation,
open-orders tab data, trade-history tab data, and stale previous-bot row
suppression. Validation passed: focused Dashboard pack (`3` files, `35`
tests), Web typecheck, guardrails, and diff check. `SOAR-DASHBOARD-001` is
`PARTIAL`; the next executable Dashboard proof is browser-level responsive
desktop/tablet/mobile, keyboard/touch interaction, and safe clickthrough on
representative data.

Latest Bots delete action fix:
`BOT-DELETE-ACTIVE-PAPER-2026-05-11` fixes the local active PAPER delete
controller path so PAPER activity alone no longer triggers the LIVE-risk
confirmation. LIVE and live-opt-in bots remain guarded. Local validation
passes: Web Vitest (`147` files, `501` tests), API Bots e2e (`27/27`) with
explicit local `DATABASE_URL`, Web typecheck, guardrails, and diff check.
`SOAR-BOTS-001` is `PARTIAL`; the next executable proof is a safe
production/non-destructive Bots action clickthrough with approved
representative data after deployment, or operator confirmation that the
reported delete failure is resolved.

Latest V1 completion scorecard:
`V1-COMPLETION-SCORECARD-2026-05-11` adds the current weighted progress model:
implementation estimate `77%`, evidence coverage `47.8%`, release readiness
`33.1%`. Before each broad continuation, refresh
`ops:project:index -> ops:project:scan -> ops:project:ledger ->
ops:project:scorecard`. Then choose work from the scorecard's top blockers and
next work order, starting with Dashboard Home and Bot Runtime production-safe
proof or the next unverified P0 module.

Latest V1 master state ledger:
`V1-MASTER-STATE-LEDGER-2026-05-10` adds the consolidated state file for
continuation: `docs/operations/v1-master-state-ledger-2026-05-10.md`. Before
the next broad repair or audit slice, refresh the source reports with
`pnpm run ops:project:index`, `pnpm run ops:project:scan`, then
`pnpm run ops:project:ledger`. Start from the ledger's `Next Work Order`.
Current first priorities are Dashboard Home, Bot Runtime, Auth, Profile API
Keys, Bots, Profile, Wallets, and Markets production-safe proof. The next
unblocked local module from the refreshed ledger is Backtests. Concrete non-proof triage candidates are
still listed separately in the ledger.

Latest project indexing baseline:
`PROJECT-INDEXING-BASELINE-2026-05-10` adds `pnpm run ops:project:index`, a
local no-network index generator for V1 continuation. Current generated index:
`docs/operations/project-index-2026-05-10.md`. Before the next repair slice,
use the index to select one non-`PASS` V1 matrix row and map it to the matching
API module, Web feature, route, worker, and focused tests. This index is not
V1 approval evidence; it is the baseline for the next action audit.
`PROJECT-INDEX-V1-CROSSWALK-2026-05-10` adds the per-row crosswalk. The next
executable product task should start from priority 1 in the generated V1 Audit
Work Map: Dashboard Home rendered/browser action audit, then Bot Runtime.
`V1-STATIC-ISSUE-SCAN-2026-05-10` adds the current static inconsistency scan.
Before implementing fixes, use its P0/P1 section to distinguish missing V1
proof from concrete surface gaps. The concrete non-proof triage candidates are:
Web orders empty, `/dashboard/orders` missing, `/dashboard/positions` missing,
Web positions missing focused tests, API subscriptions missing focused tests,
and Web orders/positions docs still describing placeholders.

Latest Dashboard Home rendered runtime audit:
`V1-DASHBOARD-HOME-RENDERED-RUNTIME-AUDIT-2026-05-10` is locally complete for
one rendered component bridge: `HomeLiveWidgets` renders a negative-PnL open
position with the TTP column present while suppressing prospective TTP
label/value. Next executable Dashboard Home task: continue rendered audit for
selected-bot switching, wallet KPIs, loading/empty/error, responsive states,
table tabs, and non-destructive clickthrough.

Latest Dashboard runtime table action audit:
`V1-DASHBOARD-RUNTIME-TABLE-ACTION-AUDIT-2026-05-10` is locally complete for
the presenter/action slice. Evidence covers open-order local cancel and
terminal/exchange-backed blocked paths, open-position negative PnL styling,
prospective TTP hidden at zero/negative live PnL, backend/runtime TTP
precedence, TSL-only display, and non-actionable edit/close action buttons.
Dashboard Home and Bot Runtime now have local proof rows, not release-ready
status, because production-safe/non-local proof remains open. Next executable
task: production-safe clickthrough when approved, or continue the next
unverified P0 module from the master ledger.

Latest Bots action audit:
`V1-BOTS-ACTION-AUDIT-2026-05-10` is locally complete. Bots action evidence
now covers Web delete success/failure and API CRUD/delete/runtime
close/ownership/market-group/strategy-link/LIVE guard/duplicate guard/runtime
monitoring paths. Next executable product-audit task: run the Dashboard
Home/runtime table action audit with deterministic runtime payloads, including
positive/zero/negative PnL, TTP/TSL/DCA rendering, selected-bot filtering,
orders/trades/positions table states, and error/loading/empty behavior.

Latest product action audit:
`V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10` fixes the first two operator-reported
P0 action regressions locally and publishes the active action-level audit
matrix. V1 must not be described as ready based only on deploy health, public
smoke, or route reachability. Next executable task: run the Bots module action
audit on safe fixture/local data, covering create/edit/delete, activation/
deactivation, assistant config, market groups, strategy links, and error
states; then update
`docs/operations/v1-product-action-audit-matrix-2026-05-10.md` with PASS/FAIL
evidence.

Latest final V1 preflight:
`V1-FINAL-PREFLIGHT-1E11F8DE-2026-05-10` confirms the deployed production
candidate `1e11f8de4a3daaa313894a9ccf989237a3e65e5a` passes build-info and
public API/Web smoke, and production DB restore context is satisfied by fresh
evidence. V1 is still `BLOCKED`, not because of missing public deployment, but
because protected/formal release evidence is incomplete: missing
`LIVEIMPORT-03`, failed rollback proof, missing liveimport/rollback auth, and
failed RC gates/sign-off/checklist. Evidence:
`docs/operations/v1-final-preflight-1e11f8de-2026-05-10.md`.

Latest deploy smoke tooling fix:
`DEPLOY-SMOKE-SKIP-WORKERS-ALIAS-2026-05-10` makes
`deploySmokeCheck.mjs --skip-workers` behave like canonical `--no-workers`.
This prevents false deploy-smoke failures on protected `/workers/health` when
the intended check is public-only API/Web reachability. Default behavior still
checks workers unless skipped explicitly. Evidence:
`docs/planning/deploy-smoke-skip-workers-alias-task-2026-05-10.md`.

Latest controlled LIVE proof runner:
`CONTROLLED-LIVE-PROOF-RUNNER-2026-05-10` adds
`pnpm run ops:live:controlled-proof`, a guarded command for the remaining
short LIVE runtime-session proof. It validates build-info, requires protected
`/ready/details` to report both no-order flags and derived `active=true`,
refuses already-active LIVE bots, runs `LIVEIMPORT-03`, and deactivates the
bot in cleanup. Local syntax/help/dry-run checks pass. The next step is still
explicit operator-approved controlled LIVE activation; do not pass
`--i-understand-live-risk` until the operator approves that exact window.

Latest LIVE runtime safety readiness diagnostics:
`LIVE-RUNTIME-SAFETY-READINESS-DIAGNOSTICS-2026-05-10` adds protected
`/ready/details` visibility for the LIVE no-order guard:
`runtimeSafety.liveNoOrderGuard.globalKillSwitch`,
`runtimeSafety.liveNoOrderGuard.emergencyStop`, and derived
`runtimeSafety.liveNoOrderGuard.active`. After this deploys, the controlled
LIVE proof must first set the Coolify API/execution-worker flags, redeploy, and
confirm `/ready/details` reports `active=true` before any LIVE bot activation.
This precondition is now satisfied on production for
`b139152672aa9f6b0e26f1cab5ba0203beb54741`; the next step is explicit
operator-approved controlled LIVE bot activation, `LIVEIMPORT-03` readback,
bot deactivation, and flag cleanup.

Latest controlled LIVE proof preactivation:
`CONTROLLED-LIVE-SESSION-PROOF-2026-05-10` is READY but blocked on explicit
operator approval for LIVE activation. Preactivation `LIVEIMPORT-03` against
`b1391526` confirmed one LIVE Binance Futures bot and expected
`NO_RUNNING_SESSION`; artifact:
`docs/operations/_artifacts-liveimport-readback-preactivation-b1391526-2026-05-10.json`.

Latest LIVE runtime kill-switch config:
`LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10` adds an env-controlled no-order
guard for controlled LIVE session proof:
`RUNTIME_LIVE_GLOBAL_KILL_SWITCH=true` and/or
`RUNTIME_LIVE_EMERGENCY_STOP=true`. After this deploys, the next executable
production proof is: set the flag(s) in Coolify API/execution worker env,
redeploy/restart, activate the LIVE bot briefly, verify a RUNNING session and
`PRETRADE_BLOCKED` telemetry, rerun `LIVEIMPORT-03`, deactivate the bot, and
clear the flags before any real trading.

Latest production rerun after API-key probe fixes:
Production is deployed on `8cd5c1b3f38b9594a9caf15d4b434c853a66fdfe`.
Public smoke passes. The stored Binance key now validates successfully on
production with Spot and Futures permissions true. `LIVEIMPORT-03` still
returns `NO_RUNNING_SESSION`, so the next executable V1 step is a controlled
LIVE runtime/session proof that avoids unintended order placement, then a
rerun of `LIVEIMPORT-03`. Evidence:
`docs/operations/prod-api-runtime-readiness-8cd5c1b3-2026-05-10.md`.

Latest Futures-only API-key acceptance:
`FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10` closes the semantic gap where a
Futures-capable key could still fail because Spot was unavailable. After this
deploys, rerun the stored production API-key test; the expected good outcome
for the user's current key is `ok: true`, `code: OK`,
`permissions.futures: true`, and `permissions.spot: false` if it is truly
Futures-only. Then rerun live-runtime/readback readiness.

Latest Binance Futures API-key probe correction:
`BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10` found the previous stored
key probe output was ambiguous for Binance Futures. The local fix probes Spot
and Futures independently and passes explicit Binance Futures balance params
to CCXT. Next executable action after deployment is to rerun the stored API-key
test on production and update `LIVEIMPORT-03` readiness based on the corrected
probe, not the old `spot/futures` booleans.

Latest production API/runtime readiness:
`PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10` captured authenticated
read-only API evidence on deployed `f3cb9a24c4c891479d5466a5abae4100ddda5ca8`.
Core dashboard/admin API modules are reachable and Gate.io Futures market
catalog is reachable. LIVE launch remains `NO-GO`: the stored Binance key
probe fails Futures readiness (`spot: true`, `futures: false`), and
`LIVEIMPORT-03` is blocked fail-closed because the configured LIVE bot has no
running runtime session. Next executable action is to remediate the Binance
Futures API key, then rerun stored key test and `LIVEIMPORT-03` after a
controlled runtime session exists. Evidence:
`docs/operations/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`.

Latest authenticated UI evidence:
`PROD-UI-AUTH-CLICKTHROUGH-39A52703-2026-05-10` passed production UI
route/module reachability with approved dashboard/admin credentials on deployed
`39a52703`. Public, dashboard, admin, and legacy route groups all pass. The
next V1 proof lanes are now narrower: `LIVEIMPORT-03` protected runtime
readback, rollback proof PASS, authenticated Gate 2 SLO, RC approval/signoff/
checklist, and optional deeper production action/form clickthrough that avoids
live-money or destructive writes unless explicitly approved. Evidence:
`docs/operations/prod-ui-module-clickthrough-39a52703-2026-05-10.md`.

Latest architecture cleanup:
`V1-ARCH-BOUNDARY-CLEANUP-2026-05-10` resolved the implementation boundary and
docs drift found by the architecture function audit. API-key probe CCXT client
construction now lives behind `modules/exchange`, profile consumes that
exchange-owned factory, and Gate.io runtime/exchange docs are current. The
next executable V1 work is no longer local architecture cleanup; it is one of
the protected/formal evidence lanes when inputs are available:
`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, `PROD_UI_AUDIT_*`,
authenticated Gate 2 SLO, RC approvals, and final non-dry-run release gate.
Evidence:
`docs/planning/v1-architecture-boundary-cleanup-task-2026-05-10.md` and
`docs/operations/v1-architecture-function-audit-2026-05-10.md`.

Latest architecture function audit:
`V1-ARCH-FUNCTION-AUDIT-2026-05-10` originally found broad architecture
alignment but one local boundary mismatch and two Gate.io-era docs drifts.
Those findings are now resolved by
`V1-ARCH-BOUNDARY-CLEANUP-2026-05-10`; keep the audit as historical evidence,
not as an open local implementation blocker. Evidence:
`docs/operations/v1-architecture-function-audit-2026-05-10.md`.

Latest function coverage audit:
`V1-FUNCTION-COVERAGE-AUDIT-2026-05-10` confirms that broad V1 implementation
and local coverage exist across the documented module/route/test surfaces. No
broad missing module implementation was found for the current V1 scope. V1 is
still `NO-GO` because the missing work is protected production proof and
formal release approval: `LIVEIMPORT-03` protected readback, rollback proof
PASS, authenticated/admin UI clickthrough, authenticated Gate 2 SLO, RC
approval/sign-off/checklist, and final non-dry-run release gate. Evidence:
`docs/operations/v1-function-coverage-audit-2026-05-10.md`.

Latest final preflight:
`V1-FINAL-PREFLIGHT-82205329-2026-05-10` refreshed the no-secret final
preflight for deployed build-info
`8220532920e484da9ddaa021ac64b5de4cc5e6e1`. Build-info PASS, public smoke
PASS, production DB restore context satisfied by evidence, activation evidence
fresh, and backup/restore drill fresh. Remaining blockers are protected/formal:
`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, RC external gates/sign-off/
checklist, missing `LIVEIMPORT-03`, rollback proof PASS, and authenticated/
admin UI proof. Evidence:
`docs/operations/v1-final-preflight-82205329-2026-05-10.md`.

Latest production UI audit:
`PROD-UI-PUBLIC-CLICKTHROUGH-88313309-2026-05-10` refreshed no-auth UI
route/module evidence for deployed build-info
`88313309200d35275ba6c0d3465c5045c4b6d99e`. Public routes pass; dashboard,
admin, and legacy protected routes are `BLOCKED_AUTH` and redirect to
`/auth/login`. Next executable UI work requires valid `PROD_UI_AUDIT_*`
dashboard/admin auth and representative production data to perform the full
authenticated/admin module clickthrough. Evidence:
`docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`.

Latest release-gate truth:
`V1-CURRENT-RELEASE-GATE-DRY-RUN-2026-05-10` ran the production V1 release gate
in no-secret `--dry-run` mode against build-info
`8f8630b0ad5abd690409d6173c9b247b95948138`. Readiness is `not_ready`.
Fresh evidence exists for activation audit, activation plan, and production
backup/restore drill. Remaining blockers are `RC external gates failed`,
`RC sign-off failed`, `RC checklist failed`, missing `LIVEIMPORT-03` runtime
readback, rollback proof fresh but failed, and the need to run the final gate
without `--dry-run` after protected inputs are present. Evidence:
`docs/operations/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.

Latest operator target rule:
`V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10` removes the need to re-sync static
SHA targets after docs-only deploys. The final blocker pack now reads
production `https://soar.luckysparrow.ch/api/build-info` and uses that value
as `$expectedSha`, unless an operator intentionally promotes one exact runtime
candidate and compares it first. Next executable V1 work still requires
operator-provided `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
`PROD_UI_AUDIT_*`, authenticated Gate 2 SLO, and real RC approver inputs.
Evidence: `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.

Latest Gate 2 evidence boundary:
`V1-SLO-GATE2-NOAUTH-PROBE-2026-05-10` proves Gate 2 cannot be completed from
this no-auth shell. The one-minute production SLO probe generated blocker
evidence only: protected workers/metrics/alerts returned `401`, queue/API/
live-order metrics were `NO_DATA`, and `/ready` had a short transient that
passed on follow-up public smoke. Next executable Gate 2 work requires an
operator-authenticated 30-minute SLO collector run, then RC gate status refresh.
Evidence: `docs/operations/v1-slo-gate2-noauth-probe-2026-05-10.md`.

Latest operator runbook target:
`V1-OPERATOR-RUNBOOK-CURRENT-SHA-SYNC-2026-05-10` updated the final blocker
execution pack and operator unblock checklist to latest verified deployed audit
SHA `5515f2105d52f25a0d875cbd0b55860a00b4da32`. The next executable V1 step
requires operator-provided `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
`PROD_UI_AUDIT_*`, and real RC approver/gate inputs. If a later docs-only sync
commit has already deployed, first verify the currently observed build-info SHA
and use that as `$expectedSha`; do not treat docs-only deploy freshness as
protected runtime proof. Evidence:
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` and
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md`.

Latest V1 coverage confidence audit:
`V1-COVERAGE-CONFIDENCE-AUDIT-2026-05-10` confirms the project should not be
called 100% V1-ready yet. Current audited production SHA is
`fd8da90bd77c2ddbed800eabd98479c1bd113ac4`; build-info and public preflight
smoke pass, but final preflight remains `BLOCKED` on liveimport auth/readback,
rollback guard auth/proof, failed RC evidence/sign-off/checklist, and missing
`LIVEIMPORT-03`. The no-auth UI module clickthrough reports public routes PASS
and dashboard/admin/legacy routes `BLOCKED_AUTH`. Next executable work requires
operator-provided `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
`PROD_UI_AUDIT_*`, and real RC approver/gate inputs. Evidence:
`docs/operations/v1-coverage-confidence-audit-2026-05-10.md`,
`docs/operations/v1-final-preflight-fd8da90b-2026-05-10.md`, and
`docs/operations/prod-ui-module-clickthrough-fd8da90b-2026-05-10.md`.

Latest production UI audit tooling:
`PROD-UI-MODULE-CLICKTHROUGH-RUNNER-2026-05-10` added
`ops:ui:prod-clickthrough` and captured current no-auth production evidence for
deployed `84e7c0e012a571f18396556a97198dbed08aba7c`. Public routes PASS;
dashboard/admin/legacy protected routes are `BLOCKED_AUTH`, which is correct
until app/admin credentials are supplied. Next executable UI work is to rerun
the same command with `PROD_UI_AUDIT_AUTH_*` and `PROD_UI_AUDIT_ADMIN_*`
inputs, plus representative route IDs through `--extra-routes` when needed.
Evidence:
`docs/planning/prod-ui-module-clickthrough-runner-task-2026-05-10.md` and
`docs/operations/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.

Latest rollback-proof refresh:
`V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-10` captured current fail-closed
production rollback proof evidence for 2026-05-10. The proof is fresh but
`FAIL` because protected rollback guard auth is missing and production
runtime-freshness/alerts endpoints returned `401`. Final preflight for
deployed `8df3260b8453be0a39dfa75ce2be281d6571c4de` now reports rollback
proof `failed` instead of `stale`. Next executable V1 work requires either
`ROLLBACK_GUARD_*` auth to make rollback proof PASS, `LIVEIMPORT_READBACK_*`
auth to run `LIVEIMPORT-03`, real RC approver identities/gate evidence, or
authenticated/admin production UI access. Evidence:
`docs/planning/v1-rollback-proof-blocked-refresh-task-2026-05-10.md`,
`docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`, and
`docs/operations/v1-final-preflight-8df3260b-2026-05-10.md`.

Latest production restore-drill refresh:
`V1-PROD-RESTORE-DRILL-REFRESH-2026-05-10` captured fresh PASS production
Postgres restore evidence through the approved Coolify terminal. The follow-up
no-secret final preflight for deployed
`969df7c8f268146ecff3efb9de2fe1841ac8bc75` now reports production DB restore
context `satisfied_by_evidence` and backup/restore drill evidence `fresh` for
2026-05-10. Next executable V1 work is one of the remaining protected/formal
lanes: provide `LIVEIMPORT_READBACK_*` app auth and run `LIVEIMPORT-03`,
provide `ROLLBACK_GUARD_*` auth and refresh rollback proof, provide real RC
approver identities/gate evidence, or provide authenticated/admin production
UI access for the module clickthrough. Evidence:
`docs/planning/v1-prod-restore-drill-refresh-task-2026-05-10.md`,
`docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`, and
`docs/operations/v1-final-preflight-969df7c8-2026-05-10.md`.

Latest Coolify deploy-queue recovery:
`V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10` supersedes the older
`e70f5cf6` deploy-lag blocker. Production Web build-info exposes
`33a2ebc468be3dbfab7c784f375672ebead5ae16`, stale `soar-api` jobs were
cancelled through the operator-approved Coolify UI, one fresh `soar-api`
redeploy finished on the same SHA, public API/Web smoke passes, and the
Coolify queue is empty. Current no-secret final preflight is public PASS and
protected/formal BLOCKED. Next executable work requires protected
`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, production DB restore context,
real RC approver identities, or authenticated/admin production UI access.
Evidence:
`docs/operations/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md` and
`docs/operations/v1-final-preflight-33a2ebc4-2026-05-10.md`.

Latest deploy-control readiness:
`V1-DEPLOY-CONTROL-READINESS-2026-05-10` confirms production deploy control is
manual Coolify/operator owned. The repository has CI checks only, no approved
no-secret production deploy trigger, and webhook/API credentials are
operator-held secrets. Next action requires operator-side Coolify
inspection/retrigger, approved deploy credentials, or explicit production
infrastructure authorization. Evidence:
`docs/operations/v1-deploy-control-readiness-2026-05-10.md`.

Latest deploy freshness blocker:
`DEPLOY-LAG-E70F5CF6-2026-05-10` records that pushed commit
`e70f5cf6229d6fc4d26ea0342b81baab80851800` did not reach production
build-info during two bounded wait windows; production still reports
`40e9b3c35c96d4acced73bbab980039f9e6b6a22`, while public smoke passes. Next
action is operator-side Coolify deploy inspection/retrigger or explicit
production infrastructure authorization. Evidence:
`docs/operations/deploy-lag-e70f5cf6-2026-05-10.md`.

Latest protected-input readiness:
`V1-PROTECTED-INPUTS-READINESS-2026-05-10` confirms this session does not have
the required protected env families for `LIVEIMPORT-03`, rollback proof, or
production DB restore context. Privileged VPS/Docker inspection was rejected by
the escalation reviewer and must not be bypassed. Next executable work requires
operator-provided credentials/context or explicit production infrastructure
authorization. Evidence:
`docs/operations/v1-protected-inputs-readiness-2026-05-10.md`.

Latest current preflight:
`V1-FINAL-PREFLIGHT-CURRENT-9D28F682` captured final no-secret preflight for
deployed `9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info and public
smoke pass; V1 remains `BLOCKED / NO-GO` only on protected/formal evidence.
The next executable work requires the operator inputs listed in
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md`: liveimport auth,
rollback guard auth, production DB restore context, and real RC approver
identities. Evidence:
`docs/planning/v1-final-preflight-current-9d28f682-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-9d28f682-2026-05-10.md`.

Latest operator unblock packet:
`V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10` published the exact protected
inputs and command order needed to move V1 from `BLOCKED / NO-GO` to final
release evidence. The packet targets deployed
`822d92fc02067fa122e735ab6cc2783e438dc458`; current preflight build-info and
public smoke pass. Next executable work requires operator-provided
`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, production DB restore context, and
real RC approver identities. Evidence:
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md` and
`docs/operations/v1-final-preflight-822d92fc-2026-05-10.md`.

Latest activation evidence refresh:
`V1-PROD-ACTIVATION-REFRESH-2026-05-10` published fresh activation plan and
activation evidence audit artifacts as explicit `NO-GO`. Final preflight for
deployed `74752f025ef49bf5026ec92e056f59947e00a18f` now reports activation
plan/audit fresh, build-info/public smoke PASS, and V1 `BLOCKED` only on
protected/formal blockers: liveimport auth/readback, rollback guard auth,
production DB restore context, failed RC evidence, stale backup/restore drill,
and stale rollback proof. Next mission checkpoint is protected evidence collection when
operator credentials and DB context are available; if they are not available,
the only useful no-secret task is to publish a concise operator unblock
checklist for those exact inputs. Evidence:
`docs/planning/v1-production-activation-refresh-2026-05-10-task.md` and
`docs/operations/v1-final-preflight-74752f02-2026-05-10.md`.

Latest release evidence refresh:
`V1-RC-BLOCKED-REFRESH-2026-05-10` refreshed RC external gates, RC sign-off,
and RC checklist as current blocked evidence. Final preflight for deployed
`1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` now reports build-info/public
smoke PASS and RC evidence `failed` instead of `stale`. Next mission checkpoint is to
refresh activation audit/plan as current `NO-GO` for the deployed SHA, because
that can be done without protected secrets. Protected tasks after that remain
blocked on liveimport auth/readback, rollback guard auth, production DB restore
context, backup/restore drill, rollback proof, Gate 2 SLO evidence, and real
RC approver identities. Evidence:
`docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-1609929e-2026-05-10.md`.

Latest release evidence:
`DEPLOY-FRESHNESS-9C125683-2026-05-10` proves production Web build-info now
exposes `9c12568379ee77cda9c9e9df39879e141b5615fb`, which includes the
`b414e523` live order cancel boundary. Public API/Web smoke passes. The
no-secret final V1 preflight public checks pass and remain correctly blocked
on protected/formal evidence: liveimport readback auth, rollback guard auth,
production DB restore context, current activation/RC evidence,
`LIVEIMPORT-03` runtime readback, backup/restore drill, rollback proof, and
authenticated/admin UI clickthrough. Next mission checkpoint is to refresh one
protected/formal V1 evidence lane when operator credentials and production DB
restore context are available, or continue a no-secret status cleanup if those
inputs remain unavailable. Evidence:
`docs/planning/deploy-freshness-9c125683-task-2026-05-10.md`,
`docs/operations/deploy-freshness-9c125683-2026-05-10.md`, and
`docs/operations/v1-final-preflight-9c125683-2026-05-10.md`.

Current implementation slice:
`EXCHANGE2-31-LIVE-ORDER-CANCEL-BOUNDARY-2026-05-10` adds canonical
exchange-side `LIVE_ORDER_CANCEL` for Binance and Gate.io through the existing
orders/exchange/authenticated connector boundary. Focused exchange tests,
focused orders cancel tests, API typecheck, guardrails, docs parity, and diff
check pass. Production freshness is now proven by `DEPLOY-FRESHNESS-9C125683`;
the earlier deploy-lag artifact is superseded.

Latest local implementation slice:
`EXCHANGE2-30-GATEIO-LIVE-ORDER-SUBMIT-2026-05-10` enabled Gate.io
`LIVE_ORDER_SUBMIT` through the canonical orders/exchange boundary and enables
Gate.io shared `LIVE_EXECUTION` compatibility gating. Gate.io exchange-side
cancel remains unsupported. No real live-money action is performed in this
task. Focused exchange tests, wallet e2e, Web capability test, API typecheck,
Web typecheck, production build-info for
`04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public deploy smoke pass. The
no-secret final V1 preflight public checks pass and remain correctly blocked on
protected/formal evidence. The remaining V1 blockers are protected production
evidence and authenticated/admin UI clickthrough. Evidence:
`docs/operations/deploy-freshness-04a4204c-2026-05-10.md`.

Latest local implementation slice:
`EXCHANGE2-29-GATEIO-WALLET-CASHFLOW-HISTORY-2026-05-09` enabled only Gate.io
`WALLET_CASHFLOW_HISTORY` through the existing exchange adapter boundary.
Gate.io live submit and exchange-side cancel remain unsupported. Focused
exchange/wallet cashflow tests, API typecheck, guardrails, docs parity, and
diff check pass. Production build-info now exposes
`8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`, public deploy smoke passes, and
no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Evidence:
`docs/operations/deploy-freshness-8ea7f33b-2026-05-09.md`. The next Gate.io
implementation gap is `LIVE_ORDER_SUBMIT`, which is money-impacting and must
remain a separate protected-evidence task.

Latest local implementation slice:
`EXCHANGE2-28-GATEIO-TRADE-HISTORY-SNAPSHOT-2026-05-09` enabled only Gate.io
`TRADE_HISTORY_SNAPSHOT` through the existing authenticated-read boundary.
Gate.io wallet cashflow history, live submit, and exchange-side cancel remain
unsupported. Focused exchange tests, authenticated snapshot service test, API
typecheck, guardrails, docs parity, and diff check pass. Production build-info
now exposes `432f768701300c7ba600fa7633532c0cc9ef4b96`, public deploy smoke
passes, and no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-432f7687-2026-05-09.md`. The next exact
Gate.io gap is either `WALLET_CASHFLOW_HISTORY` if product scope requires
ledger ingestion parity, or `LIVE_ORDER_SUBMIT` if the user confirms Gate.io
live-money execution belongs in V1.

Latest local implementation slice:
`EXCHANGE2-27-GATEIO-OPEN-ORDERS-SNAPSHOT-2026-05-09` enabled only Gate.io
`OPEN_ORDERS_SNAPSHOT` through the existing authenticated-read boundary.
Gate.io trade-history, live submit, and exchange-side cancel remain
unsupported. Production build-info now exposes
`214a9c034d38ab8670fd4b43d0f8ed692d78d90c`, public deploy smoke passes, and
the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-214a9c03-2026-05-09.md`. The next exact
Gate.io authenticated-read gap is `TRADE_HISTORY_SNAPSHOT`.

Latest local implementation slice:
`EXCHANGE2-26-GATEIO-POSITIONS-SNAPSHOT-2026-05-09` enabled only Gate.io
`POSITIONS_SNAPSHOT` through the existing authenticated-read boundary and
positions exchange-snapshot route. Gate.io open-orders/trade-history, live
submit, and exchange-side cancel remain unsupported. The next exact Gate.io
authenticated-read gap is `OPEN_ORDERS_SNAPSHOT`. Production build-info now
exposes `4c7548acc74295f27676c1f00d79dbf58b873942`, public deploy smoke
passes, and the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.

Latest local implementation slice:
`EXCHANGE2-25-GATEIO-BALANCE-PREVIEW-2026-05-09` enabled only Gate.io
`BALANCE_PREVIEW` through the existing authenticated-read boundary and wallet
preview route. Gate.io positions/open-orders/trade-history, live submit, and
exchange-side cancel remain unsupported. The next Gate.io authenticated-read
gap is `POSITIONS_SNAPSHOT`, but it carries higher live-read semantics and
should be implemented only through the exact authenticated snapshot contract.
Production build-info now exposes
`15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`, public deploy smoke passes, and
the no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Evidence:
`docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.

Latest local implementation slice:
`EXCHANGE2-24-GATEIO-API-KEY-PROBE-2026-05-09` enabled Gate.io
`API_KEY_PROBE` for provided and stored profile API-key connection tests
through a shared exchange-aware probe service. This is credential validation
only; Gate.io balance preview, positions/open-orders, trade-history, live
submit, and exchange-side cancel remain unsupported. The next Gate.io gap is
the first exact authenticated read slice, likely `BALANCE_PREVIEW`, unless
protected production evidence becomes unblocked first. Production build-info
now exposes `e76e08a1a20b12abaeabf4edc44a38ba37619005`, public deploy smoke
passes, and the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.

Latest deployed implementation slice:
`EXCHANGE2-23-GATEIO-PAPER-PRICING-ENABLE-2026-05-09` enabled only Gate.io
public `PAPER_PRICING_FEED` through the shared capability matrix and existing
public market-stream source. Focused local validation passed, and production
Web build-info now exposes
`1dc55d9623bab11dacb5b9f8ce9634778c139249`; public API/Web smoke passes.
Gate.io `LIVE_EXECUTION`, `API_KEY_PROBE`, authenticated reads, live submit,
and exchange-side cancel remain unsupported. The next Gate.io gaps are
authenticated read operations and live submit, not paper capability gating.
Evidence: `docs/operations/deploy-freshness-1dc55d96-2026-05-09.md`.

Latest V1 completion gap report:
`docs/operations/v1-completion-gap-report-2026-05-09.md`.
Short answer: the app is not broadly missing; remaining 100% readiness is
blocked by protected production evidence, authenticated/admin UI clickthrough,
Gate.io paper/live implementation beyond public market data, and a few
product/UX confidence gaps. Use this report before starting more broad
implementation or deploy-evidence loops.

Current deployed production build-info candidate:
`1dc55d9623bab11dacb5b9f8ce9634778c139249`.

Latest observed pushed batch is deployed:
`e8cd748e80b8693087e01beb21b0085ace747c49`. Production build-info matches
this SHA, public API/Web smoke passes, and no-secret final V1 preflight public
checks pass while protected/formal evidence remains correctly `BLOCKED`. This
batch is docs/evidence only over the protected runtime baseline; it does not
change runtime behavior, close protected V1 evidence, or enable Gate.io
paper/live/authenticated capabilities. Evidence:
`docs/planning/deploy-freshness-e8cd748e-task-2026-05-09.md` and
`docs/operations/deploy-freshness-e8cd748e-2026-05-09.md`.

Latest protected runtime/preflight baseline:
`30b027b78544f76b5b638851e8e27c98f6d22ab5`. Production build-info advanced
from `ba3d852d` to the protected-backlog sync batch on the follow-up wait
attempt 11. Public API/Web smoke and no-secret final V1 preflight public checks
pass for this SHA. The batch records the `ba3d852d` deploy evidence and
retargets the protected V1 backlog/runbook instructions.

Previous pushed batch:
`ba3d852d5126b625a8cf702ab647d5c644d86f9c`. Production build-info advanced
from `010b4f8b` to the docs/status sync batch on the corrected wait attempt 2.
Public API/Web smoke and no-secret final V1 preflight public checks pass for
this SHA. The batch records the `010b4f8b` deploy freshness, closes the
historical `1f1d9c12` deploy-lag queue entry, and syncs the stale historical
`V1TRUTH-01` checkbox. It does not change runtime behavior or enable Gate.io
paper/live/authenticated capabilities.

Previous pushed batch:
`010b4f8b6abfaf4c24d26550eb4761215d119f21`. Production build-info advanced
from `d355df93` to the Gate.io source batch after the earlier wait used an
incorrect full SHA for short commit `010b4f8b`; the corrected build-info wait
passed on attempt 1. Public API/Web smoke and the no-secret final preflight
public checks pass for this SHA. The prior evidence batch
`1f1d9c12e0cc99884eced81546802a261b0925e9` timed out during the 900-second
production build-info wait, two additional 300-second follow-up waits, and a
later 180-second follow-up wait with production still on `c50e1e7c`. After the
`d355df93` operator handoff/source-of-truth commit was pushed, a bounded
120-second follow-up wait initially timed out on the same production SHA, but
the next batch wait later showed production on `d355df93`. See
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.
Current shell still has no protected live-import, rollback, production DB, or
authenticated/admin app context, so the next V1 action remains protected
operator evidence rather than another public deploy wait.
Diff scope confirmed pushed `1f1d9c12` had no `apps`, `packages`, `prisma`, or
`scripts` changes over deployed `c50e1e7c`; it was a docs/evidence batch. The
latest deployed `010b4f8b` includes Gate.io source-smoke tooling and public
symbol-rule behavior, while Gate.io paper/live/authenticated capabilities
remain disabled.

Runtime/dashboard behavior source candidate:
`3c5da34371e22aecb1a7aff0a185018870d35cec`.

Completed for that candidate:
- dashboard runtime aggregate current-state API fix
- `HomeLiveWidgets` aggregate current-row regression coverage
- production build-info freshness and public smoke with `--no-workers`
- no-secret final V1 preflight showing public checks PASS
- public/unauthenticated production UI access and auth-gate refresh
- protected operator handoff docs pushed as one batch and verified on
  production build-info
- source-of-truth synchronization batch pushed as one group and verified on
  production build-info
- protected-backlog/source-of-truth sync batch pushed and verified on
  production build-info
- protected operator pack/source-of-truth sync batch pushed and verified on
  production build-info
- public/unauthenticated production UI access refreshed for the same deployed
  batch
- historical pushed evidence lag ending at `1f1d9c12` is closed by later
  build-info progress

Evidence:
- `docs/operations/prod-ui-public-access-clickthrough-745b5f5a-2026-05-09.md`
- `docs/planning/dashboard-runtime-current-state-aggregate-task-2026-05-09.md`
- `docs/planning/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md`
- `docs/operations/deploy-freshness-3c5da343-2026-05-09.md`
- `docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`
- `docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`
- `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md`
- `docs/operations/v1-final-preflight-4ee1672e-2026-05-09.md`
- `docs/operations/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`
- `docs/operations/deploy-freshness-55469cdc-2026-05-09.md`
- `docs/operations/v1-final-preflight-55469cdc-2026-05-09.md`
- `docs/operations/deploy-freshness-6c54bb5d-2026-05-09.md`
- `docs/operations/v1-final-preflight-6c54bb5d-2026-05-09.md`
- `docs/operations/deploy-freshness-c50e1e7c-2026-05-09.md`
- `docs/operations/v1-final-preflight-c50e1e7c-2026-05-09.md`
- `docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`
- `docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`

Next executable V1 steps are protected and remain blocked until the operator
supplies authenticated/admin production app access, live-import auth, rollback
auth, production DB/Coolify context for current-date restore evidence, and real
RC approval identities. Do not treat public health/build-info, public UI
access, or local regression suites as completion evidence for `LIVEIMPORT-03`,
rollback proof, restore proof, RC approval, or authenticated module clickthrough.
BOTMULTI-09 is also current against production build-info:
`f3aaa3dca6cf4d4b199372563886165638391a77` is contained in deployed
`30b027b78544f76b5b638851e8e27c98f6d22ab5`, but BOTMULTI remains open until
protected runtime/V1 gate evidence is collected.
Use `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` and the
current protected access readiness artifact before running the full blocker
pack.

UX/UI process note: future UX/UI work must start with the autonomous memory
preflight now documented in `docs/governance/user-feedback-loop.md`,
`docs/ux/design-memory.md`, and `docs/ux/screen-quality-checklist.md`.
Classify user feedback as reusable rule, visual direction, anti-pattern,
screen-specific feedback, open design decision, or recurring agent mistake;
store it in the matching source of truth; and record applied design-memory
entries in the active task before implementation. Evidence:
`docs/planning/ux-ui-memory-autonomy-process-task-2026-05-08.md`.

Second-exchange implementation is now planned with `GATEIO` selected as the
target exchange. Use
`docs/planning/second-exchange-live-readiness-plan-2026-05-08.md` as the
canonical staged plan. Do not enable broad `LIVE_EXECUTION` or
`PAPER_PRICING_FEED` for another exchange until exact operation support is
implemented and verified. Gate.io public market catalog is the first adapter
slice and remains separate from paper/live/authenticated capabilities. The
foundation slices now generalize runtime market events, add an exchange-module
Gate.io public ticker/candle reader, and add an opt-in
`MARKET_STREAM_EXCHANGE=GATEIO` polling adapter that publishes canonical
ticker/candle events without misrepresenting Gate.io as Binance. Runtime
regression coverage now also locks Gate.io ticker and final-candle fallback
consumption context. Remaining required implementation/evidence before Gate.io
paper enablement: verify runtime consumption from the Gate.io event source in a
target environment, then enable `PAPER_PRICING_FEED` only if that evidence is
clean. Remaining required
user/operator decisions: whether the next live slice is API-key probe,
authenticated readback, live order submit, and whether exchange-side cancel is
in scope.
Local source-path regression is now also covered: `EXCHANGE2-07` proves the
Gate.io polling worker publishes through `publishMarketStreamEvent` and
subscribers receive canonical `GATEIO/FUTURES` ticker/candle events. The next
Gate.io paper-readiness boundary is deployed or target-environment source
evidence; do not enable `PAPER_PRICING_FEED` from local mocked evidence alone.
`EXCHANGE2-21` now adds real public source evidence: the new
`ops:exchange:gateio-market-stream-smoke` runner captured `GATEIO/FUTURES`
`BTCUSDT` ticker and final `1m` candle events from
`ExchangePublicPollingMarketStreamWorker` without credentials, writes, or live
orders. This advances source confidence but still does not enable
`PAPER_PRICING_FEED`; deployed build-info/source evidence and exact capability
enablement remain required before paper support.
`EXCHANGE2-22` also decouples public symbol rules from `LIVE_EXECUTION`:
Gate.io can now resolve public symbol rules through the existing
`MARKET_CATALOG`/market-map boundary, while exchanges without market catalog
still fail closed and Gate.io paper/live/authenticated capabilities remain
disabled.
Post-push build-info for `4ef3ec58` remained stale on
`d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` during the 120-second wait, even
though public smoke passed.
Follow-up production build-info now exposes
`36ac02696ac0ce22a6b8bab545fcfb741125ea4b`, and public smoke passed. Gate.io
`PAPER_PRICING_FEED` still remains disabled until target-environment source
evidence proves the live polling source behavior cleanly.
Real public Gate.io adapter smoke is now captured:
`docs/operations/gateio-public-market-data-smoke-2026-05-08.md` shows
`GATEIO/FUTURES/BTCUSDT` ticker and `1m` candle reads passing through
`exchangePublicMarketData.service.ts` without secrets or writes. This still
does not enable `PAPER_PRICING_FEED`; the remaining Gate.io paper boundary is
target worker/source evidence and exact capability enablement.
Post-push public smoke for the evidence commit `d4bdc7f0` passed, but
build-info stayed on `36ac02696ac0ce22a6b8bab545fcfb741125ea4b` during the
120-second wait.
Worker bootstrap source selection is now locally regression-locked:
`EXCHANGE2-09` proves Binance remains the default market-stream source, Gate.io
polling is selected only by `MARKET_STREAM_EXCHANGE=GATEIO`, and invalid env
values fall back to safe defaults. This is still not production target-source
evidence and does not enable Gate.io `PAPER_PRICING_FEED`. Follow-up
production build-info reached
`9382d9317a5ae82d404559398922a253bef9e697`, and public API/Web smoke passed.
Web capability gating is now locally regression-locked: `EXCHANGE2-10` proves
Gate.io appears as a shared exchange option but only supports `MARKET_CATALOG`;
paper pricing, live execution, and API-key probe remain blocked in UI gating.
Post-push public API/Web smoke for `21ec8efa` passed, but build-info stayed on
`9382d9317a5ae82d404559398922a253bef9e697` during the 120-second wait.
Product-facing wallet/bot setup gates are also locally regression-locked:
`EXCHANGE2-11` proves Gate.io PAPER wallet submit and Gate.io bot activation
remain blocked while `PAPER_PRICING_FEED` is unsupported.
Direct API wallet setup is now also locally regression-locked: `EXCHANGE2-12`
proves a direct Gate.io PAPER wallet create request fails closed with
`EXCHANGE_NOT_IMPLEMENTED` for `PAPER_PRICING_FEED` and leaves no user wallet
persisted. This still does not enable Gate.io paper pricing; target
worker/source evidence remains required before capability enablement.
Direct API wallet update is now also locally regression-locked: `EXCHANGE2-13`
proves an existing Binance PAPER wallet cannot be updated to `GATEIO` while
`PAPER_PRICING_FEED` is unsupported, and the persisted wallet remains
unchanged after rejection.
Stored API-key probing is now locally regression-locked: `EXCHANGE2-14` proves
a stored Gate.io placeholder key can exist, but the stored probe endpoint fails
closed with `EXCHANGE_NOT_IMPLEMENTED` for `API_KEY_PROBE` and writes no
connection-test audit log.
Stored-key wallet balance preview is now locally regression-locked:
`EXCHANGE2-15` proves a stored Gate.io placeholder key cannot be used for
wallet preview while `BALANCE_PREVIEW` authenticated reads are unsupported, and
the key remains unused after rejection.
Explicit-key positions snapshot reads are now locally regression-locked:
`EXCHANGE2-16` proves a stored Gate.io placeholder key cannot be selected via
`apiKeyId` while `POSITIONS_SNAPSHOT` is unsupported; the route returns HTTP
501 with unsupported capability details and leaves `lastUsed` unchanged.
Open-orders and trade-history reconciliation snapshots are now locally
regression-locked: `EXCHANGE2-17` proves stored Gate.io placeholder keys cannot
reach `OPEN_ORDERS_SNAPSHOT` or `TRADE_HISTORY_SNAPSHOT` test fallback data
while those authenticated-read operations are unsupported, and `lastUsed`
remains unchanged after rejection.
Gate.io LIVE order submit is now locally regression-locked at the exchange
boundary: `EXCHANGE2-18` proves `LIVE_ORDER_SUBMIT` fails closed before
credential resolution, connector construction, pretrade guards, leverage
convergence, or live order adapter creation.
Exchange-backed cancel is now locally regression-locked at the API route:
`EXCHANGE2-19` proves `/dashboard/orders/:id/cancel` returns HTTP 501 with
`LIVE_ORDER_CANCEL_UNSUPPORTED` for persisted exchange-backed open orders,
leaves the order open, and writes no cancellation audit log. Gate.io and all
other exchange-side cancel capabilities remain disabled until a canonical
adapter operation exists.
The pushed Gate.io fail-closed batch is now deployed: production build-info
exposes `90cd07d602f0a31f315719b8a5cd5be3fd112313`, and public API/Web smoke
passed. Evidence:
`docs/operations/deploy-freshness-90cd07d6-2026-05-08.md`.
Final V1 preflight deploy checks are now portable on this Windows workstation:
`runV1FinalPreflight.mjs` calls bundled Node scripts directly for build-info
and public smoke instead of depending on global `pnpm`. The refreshed no-secret
preflight for deployed `90cd07d6` reports build-info PASS and public smoke
PASS, then blocks only on protected live-import auth/readback, rollback
auth/proof, and RC Gate 4 evidence. Evidence:
`docs/operations/v1-final-preflight-90cd07d6-2026-05-08.md`.
Second-exchange planning is now reconciled with the deployed Gate.io
foundation. Treat `EXCHANGE2-LIVE-READINESS-PLAN-2026-05-08` as complete
planning, not an open implementation blocker. The current supported Gate.io
truth is narrow: public catalog plus public `FUTURES`/swap market-data
foundation only. Keep `PAPER_PRICING_FEED`, authenticated reads,
`LIVE_ORDER_SUBMIT`, and `LIVE_ORDER_CANCEL` unsupported until exact operation
support and evidence exist. Evidence:
`docs/planning/exchange2-20-plan-reconciliation-task-2026-05-09.md`.

After the planned Gate.io/deploy-auth blockers are cleared, execute the
production UI module clickthrough audit from
`docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`. The audit
now has current production build-info at
`c50e1e7cf1e37d9c799031cacbb30a834f57e81d` and latest public access evidence
for the same SHA, but must still wait for
authenticated/admin app access, representative production test data, and
explicit operator approval before any live-money or destructive action.
Public-only checks cannot prove protected dashboard/admin flows.
The public/unauthenticated access slice has been captured at
`docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`:
API health and readiness passed, public routes returned HTTP 200, and
protected dashboard/admin routes redirected to `/auth/login`. It does not
satisfy the full module clickthrough because no authenticated/admin production
app session is available.
After pushing the public-access evidence commit
`d55a86007b80733d67e793c261a5208c6734ab79`, public smoke still passed but
build-info remained stale on `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` during
the 120-second wait.
Refreshed public/unauthenticated production access evidence is now current for
the deployed Gate.io fail-closed batch:
`docs/operations/prod-ui-public-access-clickthrough-90cd07d6-2026-05-09.md`
shows Web build-info matching
`90cd07d602f0a31f315719b8a5cd5be3fd112313`, API `/health` and `/ready`
passing, public Web routes returning HTTP 200, and unauthenticated
dashboard/admin routes returning HTTP 307 to `/auth/login`. This still does
not satisfy the full production UI module clickthrough, which remains blocked
on authenticated/admin production app access.
The current no-secret V1 final preflight for deployed
`90cd07d602f0a31f315719b8a5cd5be3fd112313` is now refreshed for 2026-05-09 at
`docs/operations/v1-final-preflight-90cd07d6-2026-05-09.md`. Build-info and
public smoke pass, but V1 remains `BLOCKED` on missing live-import auth,
rollback auth, production DB restore context, missing `LIVEIMPORT-03`, and
stale 2026-05-08 release evidence for the 2026-05-09 evidence date.
Production activation plan and activation evidence audit are now fresh
2026-05-09 `NO-GO` artifacts:
`docs/planning/v1-production-activation-and-evidence-plan-2026-05-09.md` and
`docs/operations/v1-production-activation-evidence-audit-2026-05-09.md`.
The follow-up preflight confirms those two evidence families are fresh; the
remaining blockers are protected auth, production DB restore context, stale
RC/recovery evidence, missing `LIVEIMPORT-03`, and rollback proof.
RC external gates status, RC sign-off, and RC checklist are now also current
for 2026-05-09 as blocked/open evidence. The final preflight now reports RC
evidence as fresh `failed`, not stale. Remaining V1 blockers are protected
auth, production DB restore context, `LIVEIMPORT-03`, backup/restore freshness,
rollback proof, and real RC approval.
Rollback proof tooling now supports `--today <yyyy-mm-dd>` for the next
authenticated operator run. The actual 2026-05-09 rollback proof is still not
captured because this shell lacks approved protected auth/network execution;
do not accept sandbox fetch failures as production rollback evidence.
Restore drill tooling now also supports `--today <yyyy-mm-dd>` for the next
production DB/Coolify run. The actual 2026-05-09 restore drill is still not
captured because this shell lacks approved production DB/Coolify execution
context; do not accept local or empty restore output as production evidence.
The final blocker execution pack is now synced to those date-aware commands:
set `$releaseDate` once and reuse it for preflight, restore drill, rollback
proof, RC status/sign-off/checklist, live-import output paths, and the final
release gate. Evidence:
`docs/planning/v1-final-blocker-pack-date-overrides-task-2026-05-09.md`.
The dashboard runtime aggregate batch is now deployed: production Web
build-info exposes `3c5da34371e22aecb1a7aff0a185018870d35cec`, and public
API/Web smoke passed for API `/health`, API `/ready`, and Web `/`. Evidence:
`docs/operations/deploy-freshness-3c5da343-2026-05-09.md`. Continue from the
final blocker pack against this deployed SHA; do not treat this public smoke as
protected runtime, restore, rollback, RC approval, or authenticated UI evidence.
The no-secret final V1 preflight for deployed `3c5da343` is now fresh:
`docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`. Build-info and
public smoke pass. Remaining blockers are live-import auth, rollback auth,
production DB restore context, failed RC evidence, missing `LIVEIMPORT-03`, and
stale restore/rollback proof evidence for the 2026-05-09 evidence date.
Public production UI access evidence has been refreshed for the same deployed
candidate at
`docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`;
it confirms public route reachability and unauthenticated auth gates only.
The final blocker execution pack now separates the deployed code/tooling
candidate from local evidence-only commits. For protected evidence, derive
`$expectedSha` from production `/api/build-info` at the start of the operator
run unless the operator intentionally compares one exact intended runtime
candidate first.
Evidence:
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
Protected access readiness is currently BLOCKED. Names-only checks in this
shell found no `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, or production
DB/Coolify restore context env names. Evidence:
`docs/operations/v1-protected-access-readiness-2026-05-09.md`. The next
executable step requires protected app/operator auth, DB/Coolify context, RC
approval identities, and authenticated/admin UI access.

The local V1 backend paper/live runtime line is closed for this slice: focused
parity/crash coverage, DB-backed runtime/order/exchange/import/readback packs,
and the full local API suite pass. Continue at the remaining production
evidence boundary, not by reopening local backend packs unless code changes or
new failures appear.

Local DB-backed runtime evidence is available if the `default` Docker context
or existing local ports are used; avoid treating the unhealthy `desktop-linux`
context as the only Docker signal.

```powershell
docker --context default info --format '{{.ServerVersion}}'
Test-NetConnection -ComputerName localhost -Port 5432
pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --run --sequence.concurrent=false
```

Next production release evidence line:

Latest pushed `main` is deployed through the accepted Coolify operator path,
not GitHub Actions. GitHub Actions production promote/rollback entrypoints have
been removed because the project does not use paid GitHub Actions and workflow
attempts create unwanted email noise.

```powershell
$buildInfo = Invoke-RestMethod "https://soar.luckysparrow.ch/api/build-info"
$expectedSha = $buildInfo.gitSha
$expectedSha
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 15
```

After production build-info exposes the selected SHA, continue with
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` once
production auth and DB/Coolify access are available. Start with
`pnpm run ops:release:v1:preflight`; it is read-only and reports deploy
freshness, missing prerequisite env names, and current release evidence
blockers without creating protected artifacts. Then continue with
`LIVEIMPORT-03` authenticated read-only production runtime readback on the
current pushed `main` V1 backend parity candidate or later.
Evidence must cover ownership, `strategyId` or single-strategy provenance
recovery, TTP visibility, actionable state, and import completeness across
assigned bot markets. Do not run live-money or destructive production actions.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output must not be accepted as
release evidence.

Latest protected-context recheck after the final blocker pack confirmed
production build-info is current at
`e6e7d4a044ce80279c542412a91bae4a6a012392`, and public API/Web smoke passes.
Coolify project/resource pages are reachable after switching to Root Team, and
the production Postgres container is visible as
`x11cfnz1dd9x0yzccftqzcoe`. Local Docker does not expose that remote
container, so the existing Docker-based restore drill cannot honestly run as
production PASS evidence from this workstation. The current shell still lacks
the required Soar production auth/access. A no-auth collector attempt failed
closed before runtime readback, which is the expected safe result. The latest
no-secret status reports are:
`docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
and
`docs/operations/v1-final-preflight-2026-05-08-protected-context.md`.

The production restore drill is now PASS through approved Coolify terminal
access. Evidence:
`docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md` and
`docs/operations/_artifacts-restore-drill-prod-coolify-2026-05-08T15-16-24Z.json`.
The corrected run created a compressed backup, restored it into isolated DB
`postgres_restore_check_20260508151624`, validated key table counts, dropped
the restore DB, removed the backup dump, and cleanup verification returned `0`
matching restore DBs.

Final preflight now treats that fresh restore drill evidence as satisfying the
production DB restore context prerequisite. The current `ops:release:v1:preflight`
run still exits `BLOCKED`, but the remaining blockers are now limited to
live-import auth, rollback guard auth, failed RC Gate 4 approval evidence,
missing `LIVEIMPORT-03` readback, and failed rollback proof. The latest
rollback proof rerun failed closed on protected `401` responses and is recorded
in `docs/operations/v1-rollback-proof-prod-2026-05-08T15-30-28-231Z.md`.
The current no-secret preflight snapshot for deployed SHA
`052df82244ea0f81e8611ff8bb2b677db115bd19` is committed at
`docs/operations/_artifacts-v1-final-preflight-current.json` and
`docs/operations/v1-final-preflight-current.md` for Web/operator status
visualization.

The next executable production evidence step requires approved Soar
application/operator auth for `LIVEIMPORT-03` and rollback proof, or real RC
Gate 4 approver identities. Do not reuse the Coolify login as Soar application
auth unless the user explicitly confirms it is valid for that target.

Post-backend-parity and restore-context check: production web build-info
reached `721fe8482922835a9419f0e529baeef4ff6a74c9`, which includes the
adapter-pure PAPER/LIVE runtime fix, blocker evidence alignment, deploy-wait
coordination docs, live-import release-gate evidence enforcement, build-info
freshness hardening, strict RC approval evidence enforcement, and final
preflight restore-context classification. Public deploy smoke without workers
passed. Continue with
authenticated read-only `LIVEIMPORT-03` production runtime readback once
credentials are available. Do not use GitHub Actions for production
deployment.

Canonical command once auth is available:

```powershell
$releaseDate = Get-Date -Format yyyy-MM-dd
$buildInfo = Invoke-RestMethod "https://soar.luckysparrow.ch/api/build-info"
$expectedSha = $buildInfo.gitSha
$expectedShaShort = $expectedSha.Substring(0, 8)
$expectedSha
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$expectedShaShort-$releaseDate.json"
```

If the operator is promoting one exact intended runtime candidate, compare that
intended SHA with production build-info before protected readback. Do not
substitute local evidence-only `HEAD` unless production build-info proves that
SHA is deployed or the user/operator explicitly confirms those docs-only
changes are irrelevant to the protected readback.

## Candidate Backlog

0. Follow the final blocker execution pack:
   `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
0-preflight. Run `pnpm run ops:release:v1:preflight` first. It should be
   `BLOCKED` until live-import auth, rollback auth, RC approval, live-import
   readback, and rollback evidence are all present. Fresh production restore
   drill evidence now satisfies the production DB restore context prerequisite,
   so missing DB envs are not a blocker once that evidence is fresh/PASS. The
   command also runs public API/Web smoke with worker checks disabled, prints
   env variable names only, and writes no protected evidence artifacts. Its
   prerequisite classification and public-smoke skip path are covered by
   focused regression tests in `scripts/runV1FinalPreflight.test.mjs`. For
   later Web/operator visualization, use `--json-output <path>` to write a
   no-secret structured status report; this report is not final V1 release
   evidence. The preflight also emits no-secret `next actions` for known
   blockers, pointing back to the approved commands in the final blocker
   execution pack. Its JSON report includes `blockerDetails` so later
   Web/operator status can render blocker category, severity, protected-input
   requirement, final-evidence requirement, and remediation availability
   without parsing blocker strings. For a human-readable operator handoff from
   the same no-secret data, add `--markdown-output <path>`; the Markdown report
   is status only and not final release evidence.
0a. Production build-info is the default protected evidence target source.
   The final blocker execution pack now reads
   `https://soar.luckysparrow.ch/api/build-info` at the start of the operator
   run and assigns `$expectedSha = $buildInfo.gitSha`. Do not use GitHub
   Actions. If an operator is promoting one exact intended runtime candidate,
   compare that intended SHA with production build-info first. If a future step
   depends on a pushed commit being deployed, wait for build-info before
   continuing; an operator can speed this up with Coolify dashboard force
   deploy, or with deploy webhook/API token if those secrets are available
   outside the repository.
1. If production credentials or ops auth are available, execute
   `ops:liveimport:readback` with the build-info-derived `$expectedSha`.
   Record redacted `LIVEIMPORT-03` evidence only after the protected readback
   succeeds. The latest names-only prerequisite sweep found no required
   `LIVEIMPORT_READBACK_*` inputs in this shell. The collector names the exact
   accepted auth variable choices on the fail-closed missing-auth path. The
   evidence run must include actual protected runtime positions payloads for
   the requested symbols. The final V1 release gate requires this artifact as
   `LIVEIMPORT-03 runtime readback` and blocks with
   `evidence:liveImportReadback:missing` until it exists.
2. If authenticated readback remains unavailable, keep `LIVEIMPORT-03` open and
   do not downgrade it to public health/build-info evidence.
3. After `LIVEIMPORT-03`, continue `BOTMULTI-09` protected runtime readback and
   broader V1 release gate evidence.
4. Refresh production V1 release evidence with real non-dry-run execution:
   backup/restore drill evidence is fresh/PASS; rollback proof is fresh but
   failed in the latest report. Activation audit and activation plan are fresh,
   while RC status, RC sign-off, and RC checklist are fresh blocked/NO-GO
   artifacts for 2026-05-08.
   - Rollback proof and runtime freshness need protected OPS auth. Required
     auth env choices are now explicit in the tool/help path:
     `ROLLBACK_GUARD_AUTH_TOKEN`, or `ROLLBACK_GUARD_AUTH_EMAIL` plus
     `ROLLBACK_GUARD_AUTH_PASSWORD`, with optional OPS basic/header envs.
   - Gate 4 sign-off needs real Engineering, Product, Operations, and RC owner
     names. The sign-off builder now prints missing required Gate 4 fields on
     the blocked path; owner contact is recommended for rollback authority
     handoff. The final V1 release gate now also fails fresh RC artifacts until
     the external-gates status shows Gate 4 `PASS`, the sign-off record reports
     `RC status: APPROVED`, and the checklist shows `G4=PASS`.
   - Final release gate must run without `--dry-run` and with the
     build-info-derived `$expectedSha` plus the deployed web base URL so
     build-info freshness is enforced inside the gate.
5. If the active queue is empty, run a planning-status sweep before saying
   nothing is planned.

## Continuation Command Handling

On "rob dalej", "rób dalej", "kontynuuj", "continue", or "next":

1. Read `.agents/core/operating-system.md`.
2. Read this file.
3. Cross-check canonical planning.
4. Pick one bounded mission objective or task.
5. Execute through `.agents/core/execution-loop.md`.
