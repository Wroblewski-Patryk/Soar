# Project Memory Index

Last updated: 2026-05-19

## Purpose

This file is the mandatory full-picture protocol for agents. It prevents the
project from drifting into repeated small fixes with no clear release progress.
Every non-trivial task must connect local code changes to the current product
state, architecture intent, module confidence, and the next release objective.

## Current Architecture-Code Audit Baseline

Latest discrepancy audit:
`PROJECT-ARCHITECTURE-CODE-DISCREPANCY-AUDIT-2026-05-17`.

Use this audit before planning architecture repairs:

- Dashboard route inventory matched `docs/architecture/reference/dashboard-route-map.md`.
- Static scan passed with `0` findings after sequential project index refresh.
- Inspected protected diagnostics, worker topology, bot market-scope
  constraints, Prisma lifecycle shape, and exchange SDK ownership are broadly
  aligned.
- Resolved architecture/code drift: `AUD-ARCH-001` is repaired by
  `DEC-AUD-001` as Binance + Gate.io implementation scope, and `AUD-AI-003` is
  repaired by `DEC-AUD-002` as current assistant foundation/dry-run scope with
  hot-path orchestration deferred. `AUD-EXCH-002` was repaired on 2026-05-19
  with exact `(exchange, marketType, operation)` capability support.
- The resolved decision packet is
  `docs/operations/audit-decision-packet-2026-05-19.md`: `DEC-AUD-001`
  for exchange scope and `DEC-AUD-002` for assistant runtime truth.
- Option-specific post-decision repair playbooks are prepared in
  `docs/operations/audit-decision-repair-playbooks-2026-05-19.md`.
- Evidence:
  `docs/analysis/architecture-code-discrepancy-audit-2026-05-17.md` and
  `docs/planning/project-architecture-code-discrepancy-audit-2026-05-17-task.md`.

## Reusable Audit Registry

Latest reusable audit system:
`REUSABLE-AUDIT-REGISTRY-2026-05-18`.

Before any future "full audit" request, start from:

- `docs/analysis/reusable-audit-registry.md`: stable audit IDs `AUD-00` through
  `AUD-23`, run order, evidence expectations, trend fields, and boundaries.
- `docs/analysis/audit-baseline-2026-05-18.md`: current baseline separating
  today-run commands from historical evidence.
- `docs/planning/reusable-audit-registry-2026-05-18-task.md`: task contract and
  validation evidence.
- `docs/planning/full-layered-audit-run-2026-05-18-task.md`: broad local audit
  execution evidence against the reusable registry.
- `docs/analysis/audit-baseline-2026-05-19.md` and
  `docs/planning/authenticated-route-state-audit-2026-05-19-task.md`:
  authenticated local route-state proof for `AUD-04` and local `AUD-05`.
- `docs/planning/api-endpoint-docs-parity-audit-2026-05-19-task.md`:
  endpoint-level API docs parity automation and current gap list for
  `AUD-03`/`AUD-23`.
- `docs/operations/ai-assistant-runtime-truth-audit-2026-05-19.md` and
  `docs/planning/ai-assistant-runtime-truth-audit-2026-05-19-task.md`:
  assistant runtime truth evidence for `AUD-20`.
- `docs/operations/exchange-capability-truth-audit-2026-05-19.md` and
  `docs/planning/exchange-capability-truth-audit-2026-05-19-task.md`:
  exchange capability truth evidence for `AUD-09`.
- `docs/planning/aud09-exact-exchange-capability-matrix-2026-05-19-task.md`:
  exact `(exchange, marketType, operation)` capability repair for `AUD-09`.
- `docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.md`
  and `docs/planning/architecture-exchange-scope-wording-audit-2026-05-19-task.md`:
  architecture exchange-scope wording evidence for `AUD-01`/`AUD-ARCH-001`.
- `docs/operations/data-model-migrations-audit-2026-05-19.md` and
  `docs/planning/data-model-migrations-audit-2026-05-19-task.md`:
  data-model/migrations evidence for `AUD-07`.
- `docs/operations/security-privacy-audit-2026-05-19.md` and
  `docs/planning/security-privacy-audit-2026-05-19-task.md`:
  security/privacy evidence for `AUD-06`.
- `docs/operations/bots-runtime-truth-audit-2026-05-19.md` and
  `docs/planning/bots-runtime-truth-audit-2026-05-19-task.md`:
  bots/runtime truth evidence for `AUD-10`.
- `docs/operations/workers-runtime-operations-audit-2026-05-19.md` and
  `docs/planning/workers-runtime-operations-audit-2026-05-19-task.md`:
  workers/runtime operations evidence for `AUD-08`.
- `docs/operations/engine-trading-decision-flow-audit-2026-05-19.md` and
  `docs/planning/engine-trading-decision-flow-audit-2026-05-19-task.md`:
  engine/trading decision-flow evidence for `AUD-11`.
- `docs/operations/orders-manual-trading-audit-2026-05-19.md` and
  `docs/planning/orders-manual-trading-audit-2026-05-19-task.md`:
  orders/manual trading evidence for `AUD-12`.
- `docs/operations/positions-reconciliation-audit-2026-05-19.md` and
  `docs/planning/positions-reconciliation-audit-2026-05-19-task.md`:
  positions/reconciliation evidence for `AUD-13`.
- `docs/operations/wallets-capital-ledger-audit-2026-05-19.md` and
  `docs/planning/wallets-capital-ledger-audit-2026-05-19-task.md`:
  wallets/capital-ledger evidence for `AUD-14`.
- `docs/operations/markets-strategies-configuration-audit-2026-05-19.md` and
  `docs/planning/markets-strategies-configuration-audit-2026-05-19-task.md`:
  markets/strategies configuration evidence for `AUD-15`.
- `docs/operations/backtests-reports-audit-2026-05-19.md` and
  `docs/planning/backtests-reports-audit-2026-05-19-task.md`:
  backtests/reports evidence for `AUD-16`.
- `docs/operations/logs-audit-trail-audit-2026-05-19.md` and
  `docs/planning/logs-audit-trail-audit-2026-05-19-task.md`:
  logs/audit-trail evidence for `AUD-17`.
- `docs/operations/admin-subscriptions-entitlements-audit-2026-05-19.md` and
  `docs/planning/admin-subscriptions-entitlements-audit-2026-05-19-task.md`:
  admin/subscriptions/entitlements evidence for `AUD-18`.
- `docs/operations/operations-release-deployment-audit-2026-05-19.md` and
  `docs/planning/operations-release-deployment-audit-2026-05-19-task.md`:
  local operations/release/deployment evidence for `AUD-19`.
- `docs/operations/post-push-build-info-readback-36ff999d-2026-05-19.md`,
  `.json`, and
  `docs/planning/post-push-build-info-readback-36ff999d-2026-05-19-task.md`:
  read-only post-push production freshness evidence for pushed commit
  `36ff999d`; production public smoke passed but build-info stayed on
  `1586f59261cef94d7c513d71bbfcfb697d11ca59`.
- `docs/operations/main-promotion-build-info-dd1a1faf-2026-05-19.md`,
  `.json`, and
  `docs/planning/main-promotion-build-info-dd1a1faf-2026-05-19-task.md`:
  public deploy freshness checkpoint after fast-forwarding `origin/main` to
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`; build-info and public smoke
  passed, while full protected release readiness remains a separate gate.
- `docs/operations/v1-final-preflight-dd1a1faf-2026-05-19-noauth.md`,
  `_artifacts-v1-final-preflight-dd1a1faf-2026-05-19-noauth.json`, and
  `docs/planning/protected-preflight-dd1a1faf-2026-05-19-task.md`:
  no-secret protected preflight classifier for deployed `dd1a1faf`; build-info
  and public smoke passed, while protected release readiness remains blocked on
  missing approved auth/context and stale 2026-05-14 protected evidence.
- `docs/operations/v1-rc-external-gates-status-dd1a1faf-2026-05-19-blocked.md`,
  `docs/operations/v1-rc-signoff-record-dd1a1faf-2026-05-19-blocked.md`,
  `docs/operations/v1-release-candidate-checklist-dd1a1faf-2026-05-19-blocked.md`,
  `docs/operations/_artifacts-rc-evidence-check-dd1a1faf-2026-05-19-blocked.json`,
  and `docs/planning/rc-evidence-blocked-dd1a1faf-2026-05-19-task.md`:
  dated no-secret RC blocked packet for deployed `dd1a1faf`; Gate 2 and Gate 4
  remain open and strict evidence check fails as expected.
- `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-19.md`,
  `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-19.json`, and
  `docs/planning/v1-operator-unblock-packet-dd1a1faf-2026-05-19-task.md`:
  current no-secret operator handoff for completing protected `AUD-19`
  evidence on deployed `dd1a1faf`; it lists required inputs, command order,
  stop conditions, and the acceptance rule, but remains `NO-GO`.
- `docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-19.md`,
  `docs/operations/v1-protected-input-readiness-dd1a1faf-2026-05-19.json`, and
  `docs/planning/v1-protected-input-readiness-dd1a1faf-2026-05-19-task.md`:
  current names-only protected input readiness sweep for deployed `dd1a1faf`;
  it found `0` matching protected input names in this shell and printed no
  secret values.
- `scripts/checkProtectedInputReadiness.mjs`,
  `scripts/checkProtectedInputReadiness.test.mjs`, and
  `docs/planning/protected-input-readiness-command-2026-05-19-task.md`:
  reusable no-secret protected input readiness command for future `AUD-19`
  sweeps.
- `docs/operations/audit-remediation-master-plan-2026-05-19.json`,
  `scripts/checkAuditRemediationPlan.mjs`,
  `scripts/checkAuditRemediationPlan.test.mjs`, and
  `docs/planning/audit-remediation-plan-check-2026-05-19-task.md`:
  machine-readable remediation plan and validator for future audit repair
  reruns. It checks phases `P0..P6`, work packages `WP-01..WP-08`, the current
  `AUD-19` blocker, closure checks, safety boundaries, and source/evidence
  reference path existence. Follow-up task:
  `docs/planning/audit-remediation-plan-reference-check-2026-05-19-task.md`.
- `docs/planning/audit-rerun-playbook-remediation-closure-sync-2026-05-19-task.md`:
  rerun playbook closure now explicitly requires `audit:manifest:verify`,
  `audit:remediation-plan:check`, docs parity, guardrails, and diff check, and
  the rerun playbook validator fails if those closure checks are missing.
- `docs/planning/audit-tooling-index-closure-command-check-2026-05-19-task.md`:
  tooling index validation now enforces the same required closure command set
  so the audit tooling registry cannot silently drop remediation, parity,
  guardrail, or diff checks.
- `scripts/checkFullReusableAuditHandoff.mjs`,
  `scripts/checkFullReusableAuditHandoff.test.mjs`, and
  `docs/planning/audit-handoff-check-command-2026-05-19-task.md`: full
  reusable audit handoff validation for source paths, residual risks,
  forbidden boundaries, validation checks, and fail-closed safety booleans.
- `docs/planning/audit-tooling-index-package-script-check-2026-05-19-task.md`:
  tooling index validation now checks that referenced `corepack pnpm run`
  commands exist in `package.json`.
- `docs/planning/audit-manifest-summary-metadata-check-2026-05-19-task.md`:
  manifest validation now checks declared summary counts and
  `manifestValidation` path metadata against actual manifest contents.
- `scripts/checkFullReusableAuditRollup.mjs`,
  `scripts/checkFullReusableAuditRollup.test.mjs`, and
  `docs/planning/audit-rollup-check-command-2026-05-19-task.md`: full reusable
  audit rollup validation for audit coverage, summary counts, source paths,
  repair queue, and fail-closed safety booleans.
- `scripts/compareReusableAuditManifests.mjs`,
  `scripts/compareReusableAuditManifests.test.mjs`, and
  `docs/planning/audit-manifest-compare-status-bucket-check-2026-05-19-task.md`:
  manifest comparison ranks only leading status buckets, matching manifest and
  rollup validators so hybrid current/deferred wording does not become a false
  regression. Follow-up
  `docs/planning/audit-manifest-compare-json-output-2026-05-19-task.md` adds
  `--json-output <path>` for persisted machine-readable comparison reports.
  Follow-up
  `docs/planning/audit-rerun-playbook-compare-json-output-sync-2026-05-19-task.md`
  makes the rerun playbook validator require persisted `compareJson` output.
  Follow-up
  `docs/planning/audit-tooling-index-markdown-json-parity-2026-05-19-task.md`
  makes the tooling index validator check companion Markdown/JSON tool ID
  parity.
- `docs/planning/audit-manifest-markdown-summary-parity-2026-05-19-task.md`:
  manifest validation now checks companion Markdown/JSON summary count parity
  when the Markdown file is available.
- `docs/planning/audit-rollup-markdown-audit-id-parity-2026-05-19-task.md`:
  rollup validation now checks companion Markdown/JSON audit ID parity when
  the Markdown file is available.
- `docs/planning/audit-rollup-markdown-summary-parity-2026-05-19-task.md`:
  rollup validation now checks companion Markdown/JSON summary count parity
  when the Markdown file is available.
- `docs/planning/audit-handoff-rollup-summary-parity-2026-05-19-task.md`:
  handoff validation now checks handoff `rollupSummary` key/value parity
  against the referenced rollup JSON.
- `docs/planning/audit-rerun-playbook-baseline-path-check-2026-05-19-task.md`:
  rerun playbook validation now checks baseline manifest and rollup
  Markdown/JSON path completeness and existence.
- `docs/planning/audit-remediation-plan-self-check-closure-2026-05-19-task.md`:
  remediation-plan validation now requires its own self-check command in
  closure checks.
- `docs/planning/audit-tooling-index-cleanup-check-command-2026-05-19-task.md`:
  tooling index validation now requires cleanup checks for headless browser
  processes, local DB/Redis listeners, and Docker compose services.
- `docs/planning/audit-rerun-playbook-cleanup-check-command-2026-05-19-task.md`:
  rerun playbook validation now requires the same cleanup checks for future
  audit reruns.
- `docs/planning/audit-handoff-self-check-validation-2026-05-19-task.md`:
  handoff validation now requires `audit:handoff:check` in latest validation
  evidence.
- `docs/planning/audit-handoff-cleanup-validation-command-2026-05-19-task.md`:
  handoff validation now requires cleanup validation evidence for headless
  browser processes, local DB/Redis listeners, and Docker compose services.
- `docs/planning/audit-handoff-tooling-index-source-check-2026-05-19-task.md`:
  handoff validation now requires reusable tooling-index Markdown and JSON
  source paths.
- `docs/planning/audit-handoff-self-source-check-2026-05-19-task.md`:
  handoff validation now requires the handoff Markdown and JSON self-source
  paths.
- `docs/planning/audit-rerun-playbook-self-check-closure-2026-05-19-task.md`:
  rerun playbook validation now requires `audit:rerun-playbook:check` in
  closure checks.
- `docs/planning/audit-tooling-index-self-check-closure-2026-05-19-task.md`:
  tooling index validation now requires `audit:tooling-index:check` in closure
  commands.
- `docs/planning/audit-remediation-plan-cleanup-check-command-2026-05-19-task.md`:
  remediation-plan validation now requires cleanup checks for headless browser
  processes, local DB/Redis listeners, and Docker compose services.
- `docs/planning/audit-manifest-source-chain-key-check-2026-05-19-task.md`:
  manifest validation now requires source-chain keys for registry, baseline,
  rollup, handoff, rerun playbook, tooling index, remediation plan, decision
  packet, and repair playbooks.
- `docs/planning/audit-manifest-source-chain-path-check-2026-05-19-task.md`:
  manifest validation now requires required source-chain values to be
  repository paths under approved roots.
- `docs/operations/mobile-cross-platform-scope-audit-2026-05-19.md` and
  `docs/planning/mobile-cross-platform-scope-audit-2026-05-19-task.md`:
  mobile/cross-platform scope evidence for `AUD-21`.
- `docs/operations/i18n-copy-reachability-audit-2026-05-19.md` and
  `docs/planning/i18n-copy-reachability-audit-2026-05-19-task.md`:
  i18n/copy reachability evidence for `AUD-22`.
- `docs/operations/audit-decision-packet-2026-05-19.md` and
  `docs/planning/audit-decision-packet-2026-05-19-task.md`: resolved decision
  packet for `AUD-01` and `AUD-20`.
- `docs/operations/audit-decision-repair-playbooks-2026-05-19.md` and
  `docs/planning/audit-decision-repair-playbooks-2026-05-19-task.md`:
  option-specific repair steps, validation gates, and stop conditions for
  future reference after `DEC-AUD-001` and `DEC-AUD-002` acceptance.
- `docs/operations/full-reusable-audit-handoff-2026-05-19.md` and
  `docs/operations/full-reusable-audit-handoff-2026-05-19.json` plus
  `docs/planning/full-reusable-audit-handoff-2026-05-19-task.md`: concise
  human-readable and machine-readable resume packet for the full reusable
  audit mission. Current handoff JSON is validated by
  `corepack pnpm run audit:handoff:check`.
- `docs/operations/reusable-audit-artifact-manifest-2026-05-19.md` and
  `docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`: manifest
  mapping `AUD-00` through `AUD-23` to current reports, task records, decisions,
  safety boundaries, checked summary counts, and checked path metadata.
- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.md`: operational
  rerun guide for comparing future manifests against the 2026-05-19 baseline
  with explicit safety boundaries, regression rules, and required closure
  checks including rerun-playbook and remediation-plan validation.
- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.json`:
  machine-readable rerun order, commands, stop conditions, regression rules,
  required closure checks, and required cleanup checks for future audit
  automation.
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md` and
  `docs/operations/reusable-audit-tooling-index-2026-05-19.json`: command and
  script map for reusable audit validation, comparison, rerun playbook checks,
  handoff checks, endpoint parity, isolated DB-backed audit packs, and
  required self-check closure-command, cleanup-check, and package-script
  existence enforcement.
  Manifest validation also requires the full source-chain key set before a
  reusable audit manifest can pass, and required source-chain values must be
  repository paths.

Current baseline facts: project index passed on 2026-05-18 with `PASS:21` and
`335` indexed tests; static scan passed with `0` findings; guardrails, docs
parity, typecheck, lint, build, full Web Vitest (`149` files / `514` tests),
focused API layer packs, full API Vitest exit `0`, route-reachable i18n audit
(`0` findings), go-live smoke (API `45/45`, Web `18/18`), and representative
Browser route-state proof passed locally. The registry is not production proof
and does not claim LIVE mutation, exchange-side mutation, existing production
data mutation, authenticated all-route proof, or screenshot proof.

Current route-state extension: on 2026-05-19, authenticated local Browser proof
passed for `53` route checks with `53` PASS, `0` CHECK, `0` console
warning/error routes, and `6` screenshots. This makes `AUD-04` current locally
and improves local `AUD-05`, but still does not replace production proof or an
external accessibility review.

Current endpoint docs extension: `pnpm run docs:parity:endpoints:api` now
generates endpoint-level API documentation parity. Current accepted run is
PASS: `109` endpoints, `109` documented route mentions, `0` gaps after root
and module doc gap closure. Module-level `docs:parity:check` remains PASS.

Current security/privacy extension: on 2026-05-19, focused local security proof
passed for auth/middleware/headers (`9` API files / `32` tests),
DB-backed auth/profile/API-key/isolation/abuse (`7` API files / `47` tests),
Web auth/profile/API-key (`7` Web files / `28` tests), and the public auth
cache contract (`1` Web file / `2` tests). External independent security
review remains a governance follow-up.

Current bots/runtime extension: on 2026-05-19, focused local bot/runtime proof
passed for Web bot/dashboard runtime surfaces (`8` Web files / `61` tests) and
DB-backed API bot/runtime contracts (`10` API files / `88` tests). Production
freshness remains historical/scoped, and assistant hot-path truth remains under
`AUD-20`.

Current workers/runtime operations extension: on 2026-05-19, focused local
worker/runtime proof passed for API worker/runtime contracts (`17` API files /
`85` tests). Coverage includes worker topology/ownership, protected
health/readiness, runtime freshness, market-stream fanout and subscriptions,
queue tuning, backtest job persistence, execution orchestration, and PAPER
runtime-flow telemetry. Refresh production-safe protected worker/process proof
after future deployments or worker topology changes; Gate.io/second-LIVE
production runtime shape remains outside current claims until explicitly
planned.

Current data-model/migrations extension: on 2026-05-19, local schema and
migration proof passed for Prisma validation, migration status (`54`
migrations), full local migration replay, schema diff generation, isolated
wallets data-contract e2e (`24` tests), isolated backtests data-contract e2e
(`15` tests), and runtime repository contract (`2` tests). Shared local DB
parallel DB-backed e2e execution remains a P1 test-isolation finding; keep
DB-backed audit packs sequential or isolated.

Current operations/release extension: on 2026-05-19, local release-safety proof
passed for typecheck, lint, build, go-live smoke (`45` API tests and `18` Web
tests), and local backup/restore after starting local Postgres. Production
release readiness remains historical for deployed `457bce05`; rerun production
build-info, deploy smoke, protected runtime, rollback, backup/restore, and
sign-off evidence before any new production release claim.

Current mobile/cross-platform extension: on 2026-05-19, `AUD-21` confirms
`apps/mobile` is scaffold-only. Build/test scripts intentionally echo deferred
status, and mobile docs state no production native runtime or independent
mobile backend contracts. Responsive Web mobile proof belongs to `AUD-05`, not
native app parity.

Current i18n/copy extension: on 2026-05-19, route-reachable i18n audit passed
with findings `0`, localCopy `0`, fallbackPl `0`, and hardcoded `0`. Focused
Web i18n tests passed (`8` files / `26` tests). Rerun
`i18n:audit:route-reachable:web` after future route/copy changes.

Current engine/trading extension: on 2026-05-19, focused local engine proof
passed for service/unit decision-flow contracts (`15` API files / `173` tests)
and DB-backed runtime/pre-trade/orchestration smoke (`4` API files / `13`
tests). LIVE/exchange-side mutation remains explicitly excluded.

Current orders/manual extension: on 2026-05-19, focused local orders proof
passed for Web manual/open-order surfaces (`8` Web files / `46` tests) and
DB-backed API order lifecycle contracts (`10` API files / `121` tests). LIVE
order/cancel/close mutation remains explicitly excluded.

Current positions/reconciliation extension: on 2026-05-19, focused local
positions proof passed for Web runtime-position surfaces (`6` Web files / `46`
tests) and DB-backed API positions/reconciliation contracts (`11` API files /
`68` tests). LIVE position mutation remains explicitly excluded.

Current wallets/capital-ledger extension: on 2026-05-19, focused local wallets
proof passed for Web wallet/ledger UI surfaces (`10` Web files / `23` tests)
and DB-backed API wallets/capital contracts (`7` API files / `84` tests). LIVE
exchange mutation remains explicitly excluded; wallet command audit-log events
remain tracked under `AUD-17`.

Current markets/strategies configuration extension: on 2026-05-19, focused
local markets/strategies proof passed for Web market/strategy UI surfaces (`19`
Web files / `60` tests) and DB-backed API markets/strategies contracts (`4`
API files / `35` tests). Catalog source freshness telemetry, typed strategy
domain errors, and Web strategy i18n/dirty-state follow-ups remain tracked
separately from current runtime correctness.

Current backtests/reports extension: on 2026-05-19, focused local
backtests/reports proof passed for Web backtest/report UI surfaces (`15` Web
files / `37` tests) and DB-backed API backtests/reports contracts (`13` API
files / `114` tests). Non-Binance historical order-book parity and richer
report filters/snapshots/i18n remain future scope.

Current logs/audit-trail extension: on 2026-05-19, focused local logs proof
passed for Web logs/audit surfaces (`2` Web files / `3` tests) and DB-backed
API logs/pagination contracts (`2` API files / `5` tests). Total-count
envelope, pagination controls, saved filters, index tuning, and command-event
write coverage remain future scope.

Current admin/subscriptions extension: on 2026-05-19, focused local
admin/subscriptions proof passed for Web admin/profile subscription surfaces
(`4` Web files / `9` tests) and DB-backed API admin/subscriptions/entitlements
contracts (`5` API files / `25` tests). Production entitlement mutation remains
excluded until a separate safe admin-ops plan exists.

Current assistant runtime truth extension: `AUD-20` deterministic foundation is
locally proven by backend orchestrator tests (`2` files / `6` tests), focused
Web assistant route tests (`2` files / `3` tests), and bot assistant
config/dry-run API e2e after local Postgres/Redis startup (`1` file / `3`
tests). `DEC-AUD-002` makes this the current architecture truth. Hot-path
BACKTEST/PAPER/LIVE assistant orchestration is future/gated scope and requires
separate implementation, persisted traces, fail-closed integration, and full
AI red-team proof before any runtime AI trading claim.

Current exchange capability truth extension: `AUD-09` exact capability truth is
locally proven by API exchange capability/registry/boundary tests (`4` files /
`21` tests), focused exact contract tests (`2` files / `4` tests), API
typecheck, and Web exchange capability tests (`2` files / `3` tests). Operation
support now resolves by `(exchange, marketType, operation)` in execution and
authenticated-read contracts and their consumers.
Follow-up `AUD-EXCH-007` is closed by neutral exchange-owned type aliases for
non-exchange orders/wallet consumers.

Current architecture exchange-scope wording extension: `AUD-01` is repaired by
`DEC-AUD-001`. Current implementation scope is Binance + Gate.io, not
Binance-only; production/live readiness remains evidence-bound by exact
exchange, market type, and operation.

## Required Indexes

Agents must keep these indexes current enough that another Codex session can
continue from repository files alone:

- `.codex/context/PROJECT_STATE.md`: where the project is now, current phase,
  validation commands, deployment shape, and known runtime reality.
- `.codex/context/TASK_BOARD.md`: canonical task queue with `NOW`, `NEXT`,
  blockers, and done evidence.
- `.agents/core/mission-control.md`: mission block rules for multi-hour
  autonomous work.
- `.agents/state/module-confidence-ledger.md`: module-by-module confidence,
  working state, evidence, and next proof or fix.
- `.agents/state/system-health.md`: latest validation, broken journeys, stale
  checks, and environment state.
- `.agents/state/known-issues.md`: real unresolved defects, not vague concerns.
- `.agents/state/next-steps.md`: next executable tasks in priority order.
- `docs/architecture/`: current architecture truth.
- `docs/modules/` or module maps when present: implementation ownership and
  surface maps.
- `docs/planning/`: release plan and task sequencing.
- `docs/operations/`: release, deploy, smoke, rollback, and target-environment
  evidence.

If one of these files is missing, empty, stale, or still template-like, rebuild
the minimum useful version from architecture docs, context files, accepted
feedback, code, tests, and planning notes before choosing implementation work.
Every inferred row must name its source and use a cautious status.

## Architecture Refresh Protocol

When architecture, module boundaries, app flow, route ownership, data model,
runtime behavior, UX system, or deployment shape changes, the same task must
refresh the relevant indexes before it can be called done.

Minimum refresh checklist:

1. Update the canonical architecture or ADR file that owns the decision.
2. Update module maps or route/component/API ownership docs when affected.
3. Update `.codex/context/PROJECT_STATE.md` if phase, stack, deploy shape,
   validation commands, or runtime reality changed.
4. Update `.codex/context/TASK_BOARD.md` and `docs/planning/*` so the next
   task queue reflects the new architecture.
5. Update `.agents/state/module-confidence-ledger.md` for every affected
   module.
6. Update `.agents/state/system-health.md` when validation, smoke, deploy, or
   runtime status changed.
7. Record unresolved mismatches in `.agents/state/known-issues.md`.

Architecture changes left only in chat, commit messages, or scattered planning
notes are not accepted as source of truth.

## Module Confidence Ledger Protocol

Use `.agents/state/module-confidence-ledger.md` as the fast answer to:

- Which modules exist?
- Which user journeys does each module own?
- Does it work in the real app?
- What evidence proves that?
- What is blocked, broken, stale, or unverified?
- What is the next smallest proof or fix?

Before selecting a new implementation task, read the ledger and prefer work in
this order:

1. `BROKEN` or `FAIL` release-critical journeys.
2. `BLOCKED` release-critical journeys.
3. `IMPLEMENTED_NOT_VERIFIED` P0/P1 journeys.
4. `PARTIAL` journeys where evidence points to a real defect.
5. New features only after release-critical existing flows are stable or
   explicitly deferred.

Do not convert unknowns into features. First create a verification task. Create
a fix only when proof, code inspection, or a reproducible user journey shows a
real defect.

## Reality Language Rule

Agents must not report vague completion states such as "almost done", "close",
"should work", "looks good", or "probably fixed" without evidence.

Allowed completion language:

- `verified`: evidence exists and is recorded.
- `implemented, not verified`: code exists but proof is missing.
- `partially verified`: exact passing and missing scenarios are listed.
- `blocked`: exact blocker and next unblock action are listed.
- `failed`: fresh verification failed and the failure is recorded.

The user should not be the first tester of a core journey. If a task affects a
browser, mobile, API, auth, data, money, AI, or deployment flow, the agent must
run the relevant automated or manual journey proof where local access allows it.

## Real Journey Proof

For user-facing work, validation must prove the real journey, not just that code
compiled. Examples:

- create, edit, delete, and refresh the target entity when CRUD changed;
- navigate from the real entry point, not only direct route access;
- verify loading, empty, error, success, and blocked states when the action has
  those states;
- verify persistence after reload or service restart when data changes;
- verify mobile or responsive behavior when the surface is browser-facing;
- verify auth, ownership, and fail-closed behavior when data access matters.

If a journey cannot be exercised locally, record why, the residual risk, and the
next best proof. Do not mark the module as working.

## Full-Picture Mission Selection

Every autonomous run must start by answering:

- Where are we now?
- What is the final or current release objective?
- Which module or journey is the biggest blocker to that objective?
- What evidence do we already have?
- What mission or checkpoint would most increase release confidence?

Only then select one scoped mission or checkpoint. Small tasks are useful as
mission slices only when they are anchored to the release picture.

## Handoff Requirement

After substantial work, update the indexes and leave the next agent a clear
handoff:

- current objective;
- files and modules changed;
- evidence collected;
- module confidence changes;
- known broken or unverified journeys;
- next tiny task.

## Current 2026-05-13 Adapter/Runtime Index

## Current 2026-05-14 Full Audit Baseline

- `PROJECT-COMPLETE-ANALYSIS-INDEX-2026-05-14` expands the audit target beyond
  green V1 validation and is the current "analyze everything" map. Evidence:
  `docs/operations/project-complete-analysis-index-2026-05-14.md`. It
  classifies root gates, Web/API test health, Web route inventory, API route
  inventory, mobile scaffold, assistant/AI safety, LIVE mutation boundaries,
  Gate.io/second-LIVE resource shape, and existing production data mutation.
  Next audit lane is route-by-route browser state proof, followed by an API
  endpoint ledger for all `108` route handlers.
- `PROJECT-FULL-SCAN-BASELINE-2026-05-14` is the current repository-wide
  local audit baseline for this audit/indexing thread. Evidence lives in
  `docs/planning/project-full-scan-baseline-2026-05-14-task.md`.
- Generated index artifacts:
  `docs/operations/project-full-scan-index-2026-05-14.md` and
  `docs/operations/project-full-scan-index-2026-05-14.json`.
- Generated static scan artifacts:
  `docs/operations/project-full-static-scan-2026-05-14.md` and
  `docs/operations/project-full-static-scan-2026-05-14.json`.
- Fresh baseline results: V1 matrix rows `PASS:21`, static findings `0`,
  tests indexed `335`, guardrails PASS, typecheck PASS, lint PASS, full Web
  Vitest PASS (`149` files / `514` tests), full API Vitest PASS, production
  build PASS, and go-live smoke PASS (API `45/45`, Web `18/18`).
- This is a broad local confidence baseline, not proof of unsafe LIVE
  order/cancel/close, exchange-side mutation, existing production data
  mutation, broader Gate.io/second-LIVE production shape, or manual browser
  state coverage for every route.

- `V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13` is the current local
  runtime non-Binance derivatives fallback proof. Evidence lives in
  `docs/planning/v1-runtime-non-binance-derivatives-adapter-2026-05-13-task.md`.
  It extends `REQ-FUNC-022`, `RISK-023`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`.
- `V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13` is the current
  local non-Binance futures backtest supplemental-data proof. Evidence lives in
  `docs/planning/v1-non-binance-backtest-derivatives-adapter-2026-05-13-task.md`.
  It extends `REQ-FUNC-022`, `RISK-023`, `SOAR-BACKTESTS-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`.
- `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` is the current local
  ticker fallback and Backtest details UI parity proof. Evidence lives in
  `docs/planning/v1-runtime-ticker-and-backtest-venue-ui-2026-05-13-task.md`.
  It extends `REQ-FUNC-022` and `RISK-023`.
- `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` is the current local
  bot/backtest exchange-boundary proof. Evidence lives in
  `docs/planning/v1-bot-backtest-exchange-adapter-audit-2026-05-13-task.md`.
  It updates `SOAR-BACKTESTS-001`, `SOAR-BOT-RUNTIME-001`,
  `SOAR-EXCHANGE-ADAPTER-001`, `REQ-FUNC-022`, and `RISK-023`.
- `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` is the prior runtime
  warmup/indicator exchange-boundary proof. Evidence lives in
  `docs/planning/v1-runtime-exchange-adapter-boundary-2026-05-13-task.md`.
- These proofs are local adapter-boundary evidence. Production LIVE/Gate.io
  operation evidence remains a separate proof lane, and non-Binance historical
  backtest order-book support remains intentionally unclaimed.
