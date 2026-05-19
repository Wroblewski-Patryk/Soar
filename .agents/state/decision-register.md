# Decision Register

Last updated: 2026-05-19

This file records product, architecture, UX, data, integration, and delivery
decisions that future agents must treat as durable project memory.

| ID | Date | Source | Decision | Alternatives | Status | Impact | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-000 | 2026-05-11 | Agent operating system | Use this register for accepted assumptions and direction-setting decisions before implementation. | Chat-only decisions; scattered planning notes | accepted | Future agents can recover product intent without hidden chat memory. | Replace sample row with real project decisions. |
| DEC-001 | 2026-05-14 | `docs/operations/v1-completion-scorecard-2026-05-14-final.md`; `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`; user continuation approval 2026-05-14 | Remaining V1 `PASS_LOCAL` rows cannot be promoted to production `PASS` by route reachability or local proof alone. Production write/delete fixture proofs are approved only inside the disposable `Codex V1 Proof <timestamp>` boundary with cleanup verification, redacted artifacts, PAPER-only money-adjacent actions, and no LIVE exchange mutation unless separately approved. | Treat local proof plus release gate as sufficient; silently mutate production data; leave rows `PASS_LOCAL` indefinitely | accepted_limited_fixture_boundary | Prevents an unsafe literal "100% V1" claim and enabled the first low-risk production fixture proof to pass without retaining production fixture data. | Continue remaining production-safe proofs one module at a time; require separate approval for any LIVE order/cancel/close or existing-data mutation. |
| DEC-AUD-001 | 2026-05-19 | User decision 2026-05-19; `docs/operations/audit-decision-packet-2026-05-19.md`; `AUD-01` | Soar architecture current exchange implementation scope is Binance + Gate.io, not Binance-only. Production/live readiness must still be claimed only by exact exchange, market type, operation, and evidence; this decision does not authorize LIVE or exchange-side mutation. | Keep Gate.io transitional only; narrow newer exchange contracts/code back to Binance-only | accepted | Resolves `AUD-01` architecture wording drift by aligning overview/domain source-of-truth with current exchange contracts and code-supported Gate.io scope. | Keep Gate.io production proof and any LIVE mutation under separate explicit gates. |
| DEC-AUD-002 | 2026-05-19 | User decision 2026-05-19; `docs/operations/audit-decision-packet-2026-05-19.md`; `AUD-20` | Assistant hot-path trading orchestration is later/future scope. Current architecture truth is assistant foundation: bot-scoped configuration, deterministic orchestrator coverage, and owner-scoped dry-run diagnostics. No BACKTEST/PAPER/LIVE hot-path AI behavior is claimed until implementation, persisted traces, fail-closed integration, and AI red-team evidence exist. | Implement hot-path AI now; keep the overbroad architecture claim as current | accepted_deferred_scope | Resolves `AUD-20` by narrowing current architecture truth and preserving hot-path AI as a separate future product/security slice. | Plan hot-path assistant orchestration separately before any runtime AI trading claim. |

## Open Decision Queue

- `DEC-AUD-001` is accepted as Binance + Gate.io implementation scope with
  evidence-bound production/live claims.
- `DEC-AUD-002` is accepted as current assistant foundation/dry-run scope with
  hot-path orchestration deferred to later gated work.
- `DEC-001` is accepted only for the documented disposable fixture boundary;
  any LIVE exchange mutation still needs a separate decision.
