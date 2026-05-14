# Decision Register

Last updated: 2026-05-14

This file records product, architecture, UX, data, integration, and delivery
decisions that future agents must treat as durable project memory.

| ID | Date | Source | Decision | Alternatives | Status | Impact | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-000 | 2026-05-11 | Agent operating system | Use this register for accepted assumptions and direction-setting decisions before implementation. | Chat-only decisions; scattered planning notes | accepted | Future agents can recover product intent without hidden chat memory. | Replace sample row with real project decisions. |
| DEC-001 | 2026-05-14 | `docs/operations/v1-completion-scorecard-2026-05-14-final.md`; `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`; user continuation approval 2026-05-14 | Remaining V1 `PASS_LOCAL` rows cannot be promoted to production `PASS` by route reachability or local proof alone. Production write/delete fixture proofs are approved only inside the disposable `Codex V1 Proof <timestamp>` boundary with cleanup verification, redacted artifacts, PAPER-only money-adjacent actions, and no LIVE exchange mutation unless separately approved. | Treat local proof plus release gate as sufficient; silently mutate production data; leave rows `PASS_LOCAL` indefinitely | accepted_limited_fixture_boundary | Prevents an unsafe literal "100% V1" claim and enabled the first low-risk production fixture proof to pass without retaining production fixture data. | Continue remaining production-safe proofs one module at a time; require separate approval for any LIVE order/cancel/close or existing-data mutation. |

## Open Decision Queue

- None. `DEC-001` is accepted only for the documented disposable fixture boundary; any LIVE exchange mutation still needs a separate decision.
