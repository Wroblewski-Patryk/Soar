# LUC-384 Architecture Repair Backlog

Last updated: 2026-05-28
Source issue: `LUC-384 [Soar][Architecture Planning] Convert architecture docs into executable repair backlog`
Status: `ready_for_delegation`

## Scope
- Convert architecture/documentation drift and architecture-evidence gaps into executable repair lanes.
- Keep this backlog planning-only; no runtime/deploy mutation.

## Backlog Rows
| Backlog ID | Source gap | Owner lane | Layer | Severity | Executable repair slice | Verification contract | Dependency | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ARB-001 | Assistant hot-path orchestration is deferred (`docs/architecture/11_assistant-runtime.md`, `docs/analysis/documentation-drift.md`) | AI Runtime + Security | API/runtime | high | Implement gated hot-path assistant orchestration with persisted traces and fail-closed boundaries. | Multi-turn AI protocol + prompt-injection/data-leak tests + red-team packet + runtime integration tests. | Product/CTO decision on activation scope | blocked_on_decision |
| ARB-002 | Mobile module registry is missing (`docs/analysis/documentation-drift.md`) | Product Docs + Architecture | Docs/traceability | medium | Add `docs/modules/mobile-*.md` index + module registry rows once mobile lane is active. | Module registry row coverage + doc parity check across mobile routes/modules. | Mobile activation decision | queued |
| ARB-003 | Web feature test mappings are partially inferred (`docs/analysis/documentation-drift.md`, `docs/architecture/traceability-matrix.md`) | QA/Test + Docs Memory | QA/docs | medium | Expand module deep dives with exact `Tests` tables for web features with inferred coverage. | `rg`-backed per-module file mapping + updated matrix entries with explicit test file references. | None | ready |
| ARB-004 | UX scorecard has unresolved `TBD` placeholders (`docs/ux/ui-scorecard.md`) | UX + Docs Memory | UX/docs | medium | Replace `TBD` metrics with measured values or explicit defer metadata (`owner/date/reason`). | Scorecard rows have non-TBD values or explicit defer fields; review note attached. | UX measurement input availability | ready |
| ARB-005 | Route/docs drift can recur unless checked every change (`docs/analysis/documentation-drift.md`) | Delivery + QA Automation | Tooling/docs | medium | Add mandatory pipeline hook/checklist enforcement for `docs:parity:endpoints:api` and web route map parity on route changes. | Guardrail/check script fails when route parity is stale; CI/local evidence attached. | Delivery approval for guardrail strictness | queued |
| ARB-006 | Architecture graph reports high proof gaps (function/user-action indices; production/authenticated proof still missing) (`docs/architecture/architecture-evidence-graph-system.md`) | QA + Ops + Security | Verification | critical | Convert high proof gaps into dated protected/public evidence tasks per critical chain. | Fresh evidence artifacts for auth browser, protected runtime readback, and production proof linked to expected SHA. | Protected inputs + Ops window | execution_register_ready_blocked_on_inputs |
| ARB-007 | Historical records can still be misread as active truth (`docs/analysis/documentation-drift.md`) | Docs Memory | Docs/governance | low | Add explicit “history is evidence, not active owner” guard note to high-traffic docs entrypoints. | Entry docs contain guard language and cross-links to active state files. | None | ready |
| ARB-008 | Exchange capability exact matrix can regress during future expansion (`docs/analysis/documentation-drift.md`) | Backend + Architecture + QA | API/integration | high | Add regression suite that enforces `(exchange, marketType, operation)` capability contract and neutral type boundary imports. | Focused exchange/orders/wallet tests + API typecheck + contract diff review. | None | ready |

## Delegation Order
1. `ARB-006` (critical release-proof blocker class)
2. `ARB-003` and `ARB-004` (high-value docs/QA fidelity with low coupling)
3. `ARB-008` and `ARB-005` (contract regression hardening)
4. `ARB-007` (memory hygiene)
5. `ARB-001` and `ARB-002` only after explicit scope activation decisions

## Notes
- This backlog is intentionally executable: each row has one owner lane, a narrow repair slice, and a closure-proof contract.
- Rows `ARB-001`, `ARB-002`, and `ARB-006` remain blocked by first-class external gates; they should not be silently implemented without those inputs.
- `ARB-006` execution register is now published at `history/plans/luc-402-arb-006-evidence-task-register-2026-05-28.md` with dated tasks `ARB6-EV-001..008`.
