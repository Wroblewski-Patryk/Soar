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

- [ ] UXR-J-03 Keep columns dropdown open on checkbox toggles in shared DataTable
  - Status: READY
  - Group: Dashboard Tables Consistency Refresh (`UXR-J-A`)
  - Owner: Frontend Builder
  - Depends on: none
  - Priority: P2

## BACKLOG

- [ ] UXR-J-04 Enforce icon-only columns trigger globally with accessible label contract
  - Status: BACKLOG
  - Group: Dashboard Tables Consistency Refresh (`UXR-J-A`)
  - Owner: Frontend Builder
  - Depends on: UXR-J-03
  - Priority: P2

## IN_PROGRESS

- [ ] (none)

## BLOCKED

- [ ] (none)

## REVIEW

- [ ] (none)

## DONE

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
  - 2026-04-19: Executed production verification wave end-to-end with rehearsal, takeover verification, RC gate refresh, and closure sync. Final release state remains externally blocked on Gate 2 private-route OPS validation and missing stage DNS records.
- [x] OPV-04 Sync LBT/V1 planning statuses and residual external blockers
  - 2026-04-19: Synced closure state across canonical queue/context and linked updated OPV evidence (`opv-02`, `opv-03`) in planning docs; residual blockers explicitly tracked in `docs/operations/opv-04-closure-sync-2026-04-19.md`.
- [x] OPV-03 Refresh RC external-gates/sign-off artifacts with fresh production evidence
  - 2026-04-19: Collected new production SLO observation, rebuilt 7d/30d windows, refreshed RC gate status/checklist/sign-off artifacts, then reran final status sync + diagnostics (`_artifacts-opv-03-rc-evidence-final-sync-2026-04-19T01-43-32-327Z.json`).
- [x] OPV-02 Verify takeover endpoint and private ops probes on production target
  - 2026-04-19: Production takeover API routes now return `401 Missing token` (protected route present, no `404`), while private OPS probes remain blocked without VPS private-route admin auth; evidence captured in `docs/operations/opv-02-prod-live-takeover-2026-04-19.md` and `_artifacts-opv-02-*`.
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
