# Audit Decision Packet - 2026-05-19

## Context

This packet captures the decision items from the 2026-05-19 reusable audit
mission and records the accepted 2026-05-19 outcomes. It changes architecture
truth only; it does not change runtime behavior, production readiness, or
LIVE/exchange mutation boundaries.

Primary sources:

- `docs/operations/full-reusable-audit-rollup-2026-05-19.md`
- `docs/operations/architecture-exchange-scope-wording-audit-2026-05-19.md`
- `docs/operations/ai-assistant-runtime-truth-audit-2026-05-19.md`
- `docs/analysis/audit-baseline-2026-05-19.md`
- `.agents/state/decision-register.md`

Implementation playbooks after a decision is accepted:

- `docs/operations/audit-decision-repair-playbooks-2026-05-19.md`

## Decision Queue

| ID | Audit | Status | Decision Needed | Recommended Default | Why |
| --- | --- | --- | --- | --- | --- |
| DEC-AUD-001 | `AUD-01` / `AUD-ARCH-001` | accepted | Exchange architecture current implementation scope is Binance + Gate.io, not Binance-only. | Update overview/domain to current Binance + Gate.io implementation truth. | It matches current code truth while keeping production/live-money claims conservative until exact operation proof exists. |
| DEC-AUD-002 | `AUD-20` / `AUD-AI-003` / `AUD-AI-004` | accepted_deferred_scope | Assistant hot-path orchestration is later/gated scope; current truth is foundation/dry-run. | Narrow docs to foundation-only before implementing hot-path AI. | It removes overclaim risk and avoids attaching AI to trading decisions before a full red-team/proof harness exists. |

## DEC-AUD-001 - Exchange Scope Wording

Accepted result: current implementation scope is Binance + Gate.io, not
Binance-only. Production/live readiness remains evidence-bound by exact
exchange, market type, operation, and validation.

### Problem

Older high-level architecture documents still imply a narrower exchange scope
than current exchange contracts and implementation:

- `docs/architecture/01_overview-and-principles.md` says `Binance-only
  exchange scope`.
- `docs/architecture/03_domain-model.md` says `one exchange family in
  production scope`.
- Newer architecture contracts and code support exact exchange context through
  `(exchange, marketType)` and include `GATEIO`.

### Valid Options

| Option | Meaning | Files Likely Affected | Risk |
| --- | --- | --- | --- |
| 1 | Update overview/domain to current Binance + Gate.io implementation truth. | `docs/architecture/01_overview-and-principles.md`, `docs/architecture/03_domain-model.md`, module docs, audit baseline. | May sound broader than current production proof if wording is not careful. |
| 2 | Mark Gate.io as approved staged adapter scope while keeping production proof narrow. | Same docs as option 1, with explicit staged wording. | Requires future agents to distinguish code support from production-readiness proof. |
| 3 | Narrow newer contracts and code expectations back to Binance-only. | Runtime contexts, integration docs, exchange matrix, shared options/tests/code. | Highest churn and conflicts with current tested implementation. |

### Acceptance Criteria After Decision

- The chosen scope is recorded in `.agents/state/decision-register.md`.
- Architecture overview, domain model, integration docs, and exchange ownership
  matrix no longer conflict.
- `AUD-01` status changes from `failed doc consistency / decision required` to
  either `current` or a clearly named staged/partial state.
- `docs:parity:check` and relevant exchange capability tests pass after any
  implementation or documentation change.

## DEC-AUD-002 - Assistant Runtime Truth

Accepted result: current assistant scope is bot-scoped configuration,
deterministic orchestration contracts, and owner-scoped dry-run diagnostics.
BACKTEST/PAPER/LIVE hot-path assistant orchestration is future/gated scope.

### Problem

Assistant architecture describes BACKTEST/PAPER/LIVE runtime decision
orchestration, but audited production call sites only prove config and dry-run
foundation behavior. No hot-path call site into the runtime signal loop,
execution orchestrator, backtest execution path, PAPER decision loop, or LIVE
decision loop was found.

### Valid Options

| Option | Meaning | Files Likely Affected | Risk |
| --- | --- | --- | --- |
| 1 | Implement hot-path assistant orchestration with persisted traces, fail-closed guards, and full AI red-team evidence. | Engine runtime, assistant services, trace storage, tests, AI protocol reports, docs. | Highest product/risk impact; must be staged carefully before any LIVE claim. |
| 2 | Narrow architecture to assistant config plus deterministic dry-run foundation until hot-path AI is explicitly planned. | Assistant architecture docs, engine module docs, audit baseline, decision register. | Product ambition is deferred, but source-of-truth becomes honest. |
| 3 | Keep architecture claim open as future-state only with prominent partial status. | Assistant docs, audit registry, module confidence, risk register. | Keeps recurring audit noise unless future-state wording is very explicit. |

### Acceptance Criteria After Decision

- The chosen assistant runtime truth is recorded in
  `.agents/state/decision-register.md`.
- Architecture and module docs no longer imply unproven hot-path AI behavior as
  current implementation.
- If implementing hot-path AI, `AI_TESTING_PROTOCOL.md` scenarios produce
  reproducible red-team evidence before deployable AI behavior is claimed.
- If narrowing docs, `AUD-20` status changes from `partial / failed against
  hot-path architecture claim` to a truthful foundation-only state.

## Safety Boundaries

- No production journey was run for this packet.
- No LIVE order, cancel, close, or exchange-side mutation was run.
- No existing production data was mutated.
- Architecture decisions `DEC-AUD-001` and `DEC-AUD-002` were applied to
  source-of-truth docs and audit artifacts.
- No runtime behavior was changed.

## Next Action

The next implementation step is validation and future planning:

1. keep `AUD-19` for later fresh production release-gate proof before any new
   production readiness claim;
2. plan hot-path assistant orchestration only as a separate future AI/security
   slice with fail-closed integration and red-team proof;
3. prove Gate.io production/live readiness only by exact exchange, market type,
   and operation before claiming it.
