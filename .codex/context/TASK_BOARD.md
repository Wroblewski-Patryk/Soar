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

- [ ] ARC-02 Extract typed runtime/live-ordering config from runtime services
  - Status: READY
  - Group: Architecture Maintainability Remediation (`ARC-A`)
  - Owner: Backend Builder
  - Depends on: ARC-01
  - Priority: P2

## BACKLOG

- [ ] POS-36 Remove strategy-exit close bypass from backtest/replay/runtime lifecycle flow
  - Status: BACKLOG
  - Group: Position Lifecycle Parity Closure (`POS-A`)
  - Owner: Backend Builder
  - Depends on: ARC-20
  - Priority: P2
- [ ] OPV-01 Execute Dockerfile-first stage/prod rehearsal and capture deployment evidence
  - Status: BACKLOG
  - Group: Production Verification Follow-up (`OPV-A`)
  - Owner: Ops/Release
  - Depends on: POS-42
  - Priority: P3

## IN_PROGRESS

- [ ] (none)

## BLOCKED

- [ ] (none)

## REVIEW

- [ ] (none)

## DONE

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
