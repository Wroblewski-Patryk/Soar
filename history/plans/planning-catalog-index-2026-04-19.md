# Planning Catalog Index (2026-04-19)

Status: synchronized snapshot (2026-04-28)
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
| `history/audits/architecture-maintainability-audit-2026-04-18.md` | `implemented` | closed (`ARC-A..ARC-E`) | Audit findings were executed through ARC wave and closed in canonical queue/history. |
| `history/plans/architecture-conformance-remediation-plan-2026-04-21.md` | `implemented` | closed (`ARCCON-01..ARCCON-12`) | Architecture-conformance remediation wave completed with API and web validation. |
| `history/audits/backtest-multi-market-parity-remediation-plan-2026-04-17.md` | `implemented` | closed (`BTMM-A..BTMM-C`) | Wave completed and reflected in canonical queue/history. |
| `history/plans/cpu-db-optimization-commit-plan-2026-04-06.md` | `implemented` | closed (`CPDB-*`) | Historical optimization wave completed; status sync tracked in PLNC. |
| `history/plans/code-quality-maintainability-remediation-plan-2026-04-21.md` | `implemented` | closed (`CQLT-25..CQLT-34`) | Maintainability hardening wave completed and closure evidence was published. |
| `history/audits/dashboard-runtime-bot-selector-parity-plan-2026-04-18.md` | `implemented` | closed (`DBSEL-A`) | Mixed LIVE/PAPER selector parity wave completed. |
| `history/plans/dashboard-selected-bot-runtime-scope-remediation-plan-2026-04-18.md` | `implemented` | closed (`BRS-A..BRS-C`) | Scope-hardening wave completed with API+WEB regression closure. |
| `history/plans/dashboard-forms-consistency-planner-brief-2026-04-19.md` | `superseded` | none | Planner brief was executed through the canonical `UXR-I` wave and remains a source brief only. |
| `history/plans/dashboard-loading-skeleton-progress-plan-2026-04-05.md` | `implemented` | closed (`LDUX-01..LDUX-09`) | Dashboard loading skeleton/progress wave completed; plan remains as historical UI contract reference. |
| `history/plans/dashboard-tables-consistency-planner-brief-2026-04-19.md` | `superseded` | none | Planner brief was executed through the canonical `UXR-J` wave and remains a source brief only. |
| `docs/planning/full-commit-roadmap.md` | `superseded` | none | Historical checklist superseded by `mvp-execution-plan` + `mvp-next-commits`. |
| `history/plans/i18n-contract-remediation-plan-2026-04-17.md` | `implemented` | closed (`L10NQ-A..L10NQ-D`) | i18n remediation wave completed in canonical queue. |
| `history/plans/l10nq-d-total-web-i18n-coverage-plan-2026-04-18.md` | `implemented` | closed (`L10NQ-D-A..L10NQ-D-C`) | Final web-wide localization coverage wave closed. |
| `history/plans/l10nq-e-residual-route-reachable-i18n-closure-plan-2026-04-21.md` | `implemented` | closed (`L10NQ-E`) | Residual route-reachable i18n closure completed and synchronized. |
| `history/audits/live-exchange-takeover-parity-plan-2026-04-11.md` | `implemented` | closed (`OPV-A`) | OPV private-route verification and final RC closure run completed (`G1..G4 = PASS`). |
| `history/plans/planning-catalog-coverage-follow-up-plan-2026-04-18.md` | `implemented` | closed (`PLNC-A`, `PLNC-B`) | Planning catalog reconciliation and post-closure parity sync completed. |
| `history/audits/position-lifecycle-parity-remediation-plan-2026-03-29.md` | `implemented` | closed (`POS-A..POS-B`) | POS parity scope reconciled and validated with closure evidence. |
| `history/plans/release-harden-v1-canonical-gate-plan-2026-04-22.md` | `implemented` | closed (`RELEASE-HARDEN-A`) | Release-gate hardening wave completed and is retained as historical release-readiness contract. |
| `history/evidence/review-b-runtime-exchange-production-readiness-plan-2026-04-22.md` | `implemented` | closed (`REVIEW-B`) | Post-XLIFE production-readiness review wave completed. |
| `history/plans/review-c-runtime-state-and-reconciliation-closure-plan-2026-04-22.md` | `implemented` | closed (`REVIEW-C`) | Runtime replay, snapshot-error normalization, and reconciliation-truth wave completed. |
| `history/plans/review-d-live-opt-in-and-ownership-safety-plan-2026-04-22.md` | `implemented` | closed (`REVIEW-D`) | Live opt-in, orphan-ownership, and readiness-truth safety wave completed. |
| `history/plans/safev1-a-live-paper-runtime-safety-plan-2026-04-22.md` | `implemented` | closed (`SAFEV1-A`) | V1 runtime safety wave completed and handed off to later activation work. |
| `history/plans/scalability-anti-drift-foundation-plan-2026-04-22.md` | `implemented` | closed (`SCALE-A`) | Anti-drift foundation wave completed and later status drift was resynchronized. |
| `history/audits/security-audit-hardening-plan-2026-04-04.md` | `implemented` | closed (`SEC-*`) | Security hardening wave completed; retained as evidence trail. |
| `history/plans/subscription-entitlements-rollout-plan-2026-04-06.md` | `superseded` | none | Deferred from active MVP/V1 queue; not part of current canonical NOW/NEXT pipeline. |
| `history/plans/truth-a-live-safety-and-contract-truth-plan-2026-04-22.md` | `implemented` | closed (`TRUTH-A`) | Live-safety and contract-truth wave completed with closure evidence in operations docs. |
| `history/plans/unified-order-lifecycle-and-exchange-sync-plan-2026-04-20.md` | `implemented` | closed (`UOLF-01..UOLF-15`) | Unified order lifecycle and exchange-sync parity wave completed; stale `queued` header was later corrected in docs sync. |
| `history/plans/uxr-e-table-actions-clone-dashboard-polish-plan-2026-04-18.md` | `implemented` | closed (`UXR-E-A..UXR-E-C`) | UXR-E wave completed and closed. |
| `history/plans/uxr-f-dashboard-forms-unification-plan-2026-04-18.md` | `implemented` | closed (`UXR-F-A..UXR-F-D`) | Forms unification wave completed and closed. |
| `history/plans/uxr-g-dashboard-wallet-manual-order-layout-plan-2026-04-18.md` | `implemented` | closed (`UXR-G-A..UXR-G-B`) | Wallet/manual-order layout wave completed and closed. |
| `history/audits/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md` | `implemented` | closed (`XVENUE-02`) | Exchange boundary leak audit packet was published, executed, and later status wording was normalized. |
| `history/plans/v1-production-activation-and-evidence-plan-2026-04-22.md` | `implemented` | closed (`V1FACT-A`) | V1 activation wave is engineering-doc complete and retained as historical activation contract/evidence packet. |
| `history/plans/v1close-position-close-attribution-hardening-plan-2026-04-27.md` | `implemented` | closed (`V1CLOSE-A`) | Close-attribution hardening wave completed end-to-end. |
| `history/plans/v1live-binance-execution-and-takeover-hardening-plan-2026-04-26.md` | `implemented` | closed (`V1LIVE-A`) | Binance execution/takeover hardening wave completed with focused closure pack. |
| `history/plans/v1restart-live-position-continuity-hardening-plan-2026-04-28.md` | `implemented` | closed (`V1RESTART-A`) | Restart-safe LIVE position continuity wave completed with persistence, runtime, and UI truth updates. |
| `history/plans/v1take-exchange-takeover-manual-order-closure-plan-2026-04-25.md` | `implemented` | closed (`V1TAKE-A`) | Exchange takeover and manual-order truth closure wave completed. |
| `history/plans/v1-binance-live-backtest-alignment-plan-2026-04-06.md` | `implemented` | closed (`OPV-A`) | V1B scope and production sign-off synchronization are complete. |
| `docs/planning/v1-live-release-plan.md` | `implemented` | closed (`OPV-A`) | Final release-gate snapshot is fully closed (`G1..G4 = PASS`). |
| `history/plans/v1-live-stability-closure-plan-2026-04-06.md` | `implemented` | closed (`OPV-A`) | Stability closure evidence is finalized with all RC gates PASS. |
| `history/plans/vps-coolify-deployment-hardening-plan-2026-04-03.md` | `implemented` | closed (`DPL-*`) + `OPV-A` follow-up | Deployment hardening implementation completed; stage/prod rehearsal evidence moved to OPV queue. |
| `history/plans/wallet-module-implementation-plan-2026-04-07.md` | `implemented` | closed (`WLT-*`) | Wallet implementation wave completed; doc retained as historical implementation contract. |
| `history/audits/xadapt-02-binance-assumption-audit-2026-04-25.md` | `implemented` | closed (`XADAPT-02`) | Binance-assumption audit packet was executed and later status drift was synchronized. |
| `history/evidence/xadapt-06-next-exchange-readiness-packet-2026-04-25.md` | `implemented` | closed (`XADAPT-06`) | Planning-only next-exchange readiness packet was published and later status drift was synchronized. |
| `history/audits/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md` | `implemented` | closed (`XVENUE-02`) | Exchange-boundary leak audit packet was published and advanced the canonical wave. |

## Non-Implemented Work Ownership
- Current snapshot has no canonical `queued` or `external-blocked` wave plans in this catalog index.
- Historical source briefs may retain context-specific wording, but they are not active execution sources once their owning wave has been queued or closed in canonical queue/context files.
- `superseded` items are retained for historical traceability and must not be treated as active execution sources.
