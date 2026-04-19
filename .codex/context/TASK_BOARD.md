# TASK_BOARD

Last updated: 2026-04-19

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

- [ ] OPV-02 Verify takeover endpoint and private ops probes on production target
  - Status: READY
  - Group: Production Verification Follow-up (`OPV-A`)
  - Owner: Ops/Release
  - Depends on: OPV-01
  - Priority: P3

## BACKLOG

- [ ] (none)

## IN_PROGRESS

- [ ] (none)

## BLOCKED

- [ ] (none)

## REVIEW

- [ ] (none)

## DONE

- [x] OPV-01 Execute Dockerfile-first stage/prod rehearsal and capture deployment evidence
  - 2026-04-19: Dockerfile-first rehearsal passed for `api`, `web`, and all worker images; production smoke (`api.soar.luckysparrow.ch` + `soar.luckysparrow.ch`) passed for `/health`, `/ready`, and web root. Stage rehearsal is externally blocked because stage Soar DNS records are missing; evidence captured in `docs/operations/opv-01-vps-rehearsal-2026-04-19.md` and `_artifacts-opv-01-*`.
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
