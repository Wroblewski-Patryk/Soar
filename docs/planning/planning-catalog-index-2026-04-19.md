# Planning Catalog Index (2026-04-19)

Status: active
Owner: Product Docs
Canonical queue source: `docs/planning/mvp-next-commits.md`

## Classification Legend
- `implemented`: delivered and closed in canonical queues or closure logs.
- `queued`: not closed, but explicitly owned by current canonical queue/group.
- `external-blocked`: implementation mostly complete, waiting for production-only evidence or rollout validation.
- `superseded`: historical or replaced by newer canonical planning artifacts.

## Deterministic Catalog Map
| Planning file | Classification | Canonical ownership | Notes |
| --- | --- | --- | --- |
| `docs/planning/architecture-maintainability-audit-2026-04-18.md` | `queued` | `ARC-A..ARC-E` | Audit findings are translated into queued ARC tasks in `mvp-next-commits` and `mvp-execution-plan`. |
| `docs/planning/backtest-multi-market-parity-remediation-plan-2026-04-17.md` | `implemented` | closed (`BTMM-A..BTMM-C`) | Wave completed and reflected in canonical queue/history. |
| `docs/planning/cpu-db-optimization-commit-plan-2026-04-06.md` | `implemented` | closed (`CPDB-*`) | Historical optimization wave completed; status sync tracked in PLNC. |
| `docs/planning/dashboard-runtime-bot-selector-parity-plan-2026-04-18.md` | `implemented` | closed (`DBSEL-A`) | Mixed LIVE/PAPER selector parity wave completed. |
| `docs/planning/dashboard-selected-bot-runtime-scope-remediation-plan-2026-04-18.md` | `implemented` | closed (`BRS-A..BRS-C`) | Scope-hardening wave completed with API+WEB regression closure. |
| `docs/planning/full-commit-roadmap.md` | `superseded` | none | Historical checklist superseded by `mvp-execution-plan` + `mvp-next-commits`. |
| `docs/planning/i18n-contract-remediation-plan-2026-04-17.md` | `implemented` | closed (`L10NQ-A..L10NQ-D`) | i18n remediation wave completed in canonical queue. |
| `docs/planning/l10nq-d-total-web-i18n-coverage-plan-2026-04-18.md` | `implemented` | closed (`L10NQ-D-A..L10NQ-D-C`) | Final web-wide localization coverage wave closed. |
| `docs/planning/live-exchange-takeover-parity-plan-2026-04-11.md` | `external-blocked` | `OPV-A` | Requires production target rollout verification evidence (`takeover-status` + private ops probes). |
| `docs/planning/planning-catalog-coverage-follow-up-plan-2026-04-18.md` | `queued` | `PLNC-A` | Source plan for planning-catalog reconciliation tasks (`PLNC-01..04`). |
| `docs/planning/position-lifecycle-parity-remediation-plan-2026-03-29.md` | `queued` | `POS-A..POS-B` | Not yet implemented; explicitly queued as `POS-36..POS-42`. |
| `docs/planning/security-audit-hardening-plan-2026-04-04.md` | `implemented` | closed (`SEC-*`) | Security hardening wave completed; retained as evidence trail. |
| `docs/planning/subscription-entitlements-rollout-plan-2026-04-06.md` | `superseded` | none | Deferred from active MVP/V1 queue; not part of current canonical NOW/NEXT pipeline. |
| `docs/planning/uxr-e-table-actions-clone-dashboard-polish-plan-2026-04-18.md` | `implemented` | closed (`UXR-E-A..UXR-E-C`) | UXR-E wave completed and closed. |
| `docs/planning/uxr-f-dashboard-forms-unification-plan-2026-04-18.md` | `implemented` | closed (`UXR-F-A..UXR-F-D`) | Forms unification wave completed and closed. |
| `docs/planning/uxr-g-dashboard-wallet-manual-order-layout-plan-2026-04-18.md` | `implemented` | closed (`UXR-G-A..UXR-G-B`) | Wallet/manual-order layout wave completed and closed. |
| `docs/planning/v1-binance-live-backtest-alignment-plan-2026-04-06.md` | `external-blocked` | `OPV-A` | Code-scope closure completed; remaining ownership is production evidence/sign-off refresh. |
| `docs/planning/v1-live-release-plan.md` | `external-blocked` | `OPV-A` | Remaining closure is production release evidence/sign-off, not code-scope implementation. |
| `docs/planning/v1-live-stability-closure-plan-2026-04-06.md` | `external-blocked` | `OPV-A` | Functional fixes completed; final state still depends on production gate evidence refresh. |
| `docs/planning/vps-coolify-deployment-hardening-plan-2026-04-03.md` | `implemented` | closed (`DPL-*`) + `OPV-A` follow-up | Deployment hardening implementation completed; stage/prod rehearsal evidence moved to OPV queue. |
| `docs/planning/wallet-module-implementation-plan-2026-04-07.md` | `implemented` | closed (`WLT-*`) | Wallet implementation wave completed; doc retained as historical implementation contract. |

## Non-Implemented Work Ownership
- `queued` items are implementation-owned by canonical queue groups (`PLNC`, `ARC`, `POS`) and should not run outside those groups.
- `external-blocked` items require production/VPS evidence and release sign-off (`OPV`), not new feature expansion.
- `superseded` items are retained for historical traceability and must not be treated as active execution sources.
