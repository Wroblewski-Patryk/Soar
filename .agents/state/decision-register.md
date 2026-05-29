# Decision Register

Last updated: 2026-05-29

This file records product, architecture, UX, data, integration, and delivery
decisions that future agents must treat as durable project memory.

| ID | Date | Source | Decision | Alternatives | Status | Impact | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-000 | 2026-05-11 | Agent operating system | Use this register for accepted assumptions and direction-setting decisions before implementation. | Chat-only decisions; scattered planning notes | accepted | Future agents can recover product intent without hidden chat memory. | Replace sample row with real project decisions. |
| DEC-001 | 2026-05-14 | `history/releases/v1-completion-scorecard-2026-05-14-final.md`; `history/audits/v1-product-action-audit-matrix-2026-05-10.md`; user continuation approval 2026-05-14 | Remaining V1 `PASS_LOCAL` rows cannot be promoted to production `PASS` by route reachability or local proof alone. Production write/delete fixture proofs are approved only inside the disposable `Codex V1 Proof <timestamp>` boundary with cleanup verification, redacted artifacts, PAPER-only money-adjacent actions, and no LIVE exchange mutation unless separately approved. | Treat local proof plus release gate as sufficient; silently mutate production data; leave rows `PASS_LOCAL` indefinitely | accepted_limited_fixture_boundary | Prevents an unsafe literal "100% V1" claim and enabled the first low-risk production fixture proof to pass without retaining production fixture data. | Continue remaining production-safe proofs one module at a time; require separate approval for any LIVE order/cancel/close or existing-data mutation. |
| DEC-AUD-001 | 2026-05-19 | User decision 2026-05-19; `history/audits/audit-decision-packet-2026-05-19.md`; `AUD-01` | Soar architecture current exchange implementation scope is Binance + Gate.io, not Binance-only. Production/live readiness must still be claimed only by exact exchange, market type, operation, and evidence; this decision does not authorize LIVE or exchange-side mutation. | Keep Gate.io transitional only; narrow newer exchange contracts/code back to Binance-only | accepted | Resolves `AUD-01` architecture wording drift by aligning overview/domain source-of-truth with current exchange contracts and code-supported Gate.io scope. | Keep Gate.io production proof and any LIVE mutation under separate explicit gates. |
| DEC-AUD-002 | 2026-05-19 | User decision 2026-05-19; `history/audits/audit-decision-packet-2026-05-19.md`; `AUD-20` | Assistant hot-path trading orchestration is later/future scope. Current architecture truth is assistant foundation: bot-scoped configuration, deterministic orchestrator coverage, and owner-scoped dry-run diagnostics. No BACKTEST/PAPER/LIVE hot-path AI behavior is claimed until implementation, persisted traces, fail-closed integration, and AI red-team evidence exist. | Implement hot-path AI now; keep the overbroad architecture claim as current | accepted_deferred_scope | Resolves `AUD-20` by narrowing current architecture truth and preserving hot-path AI as a separate future product/security slice. | Plan hot-path assistant orchestration separately before any runtime AI trading claim. |
| DEC-ARB-001 | 2026-05-29 | `history/plans/luc-616-arb-001-activation-scope-decision-2026-05-29.md`; `LUC-616` | For Soar V1, assistant hot-path orchestration is explicitly not activated for runtime decision loops (`BACKTEST`, `PAPER`, `LIVE`). Current allowed scope stays foundation + dry-run; hot-path reopening requires a separate gated post-V1 slice. | Activate hot-path now for backtest/paper; allow partial runtime wiring before trace/red-team gates | accepted_with_cto_review | Removes activation ambiguity on `ARB-001`, keeps current fail-closed safety boundary, and prevents accidental runtime AI authority expansion during V1 closure work. | CTO review of activation envelope, then Delivery child issues for AI Runtime + Security implementation gates. |
| DEC-ARB-002 | 2026-05-29 | `LUC-633`; `history/tasks/luc-633-mobile-lane-activation-trigger-2026-05-29-task.md` | ARB-002 mobile doc-registry follow-up reopens only when a non-scaffold mobile implementation lane is explicitly activated. Activation trigger is met only when both conditions are true: (1) a Product/CTO-approved issue moves to `in_progress` with owner in Frontend/Mobile scope, and (2) the issue scope includes runtime behavior in `apps/mobile` beyond docs/scaffold/index updates. | Reopen on any mobile mention; reopen only at V2 release label; keep permanently closed | accepted | Prevents premature ARB-002 churn while ensuring documentation expands immediately when real mobile runtime scope starts. | PM/Docs Memory should create ARB-002 follow-up task in the same heartbeat that first qualifying mobile runtime lane enters `in_progress`. |
| DEC-DOC-003 | 2026-05-24 | User request for digital nervous system; `docs/architecture/architecture-evidence-graph-system.md` | Soar's architecture evidence graph uses CSV registries as the source of truth, with generated Obsidian Markdown nodes and JSON graph exports as derived artifacts. The graph extends existing traceability/module/confidence docs and does not replace them. | Prose-only documentation; generated graph without CSV source; separate graph system disconnected from existing docs | accepted | Future feature work must add/update node, relation, chain, test, and docs records before the feature exists officially in the graph. | Backfill all P0/P1 modules and add drift checks against routes, tests, and docs. |

## Open Decision Queue

- `DEC-AUD-001` is accepted as Binance + Gate.io implementation scope with
  evidence-bound production/live claims.
- `DEC-AUD-002` is accepted as current assistant foundation/dry-run scope with
  hot-path orchestration deferred to later gated work.
- `DEC-ARB-001` narrows V1 activation scope to no runtime hot-path assistant
  authority and routes any activation to post-V1 gated work with CTO review.
- `DEC-ARB-002` defines the mobile-lane activation trigger for ARB-002 as a
  qualifying non-scaffold `apps/mobile` runtime issue entering `in_progress`
  under Product/CTO-approved scope.
- `DEC-001` is accepted only for the documented disposable fixture boundary;
  any LIVE exchange mutation still needs a separate decision.
- `DEC-DOC-003` is accepted as the architecture evidence graph foundation:
  CSV is the graph source of truth, generated Markdown/JSON is derived, and
  missing graph records are confidence gaps rather than implicit success.
