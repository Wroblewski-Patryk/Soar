# Live Safety and Contract Truth Remediation Contract

Status: Active  
Updated: 2026-04-22

## Purpose

Freeze the permanent rules for fixing and extending three high-risk areas
without reopening drift:

- LIVE execution credential ownership
- exchange capability and account-read contract truthfulness
- web UI copy guardrail truthfulness

This contract exists so future agents do not reintroduce hidden fallbacks,
silent Binance-only behavior behind generic APIs, or guardrails that report
"green" while literal UI debt still slips through.

## Why This Contract Exists

The latest architecture review found three failure modes that are small in
surface area but dangerous in long-term impact:

1. LIVE order execution can still fall back to "latest API key for exchange"
   instead of staying bound to canonical bot or wallet ownership.
2. Some authenticated exchange read paths accept generic `exchange` input while
   still executing Binance-only behavior and returning Binance-only source
   labels.
3. The repository guardrail for hardcoded UI strings is narrower than the real
   debt patterns used in React props and JSX, which creates false closure
   confidence.

If these are not closed systemically now, V2 feature work and agent-driven
execution will keep landing on misleading foundations.

## Non-Negotiable Rules

1. LIVE credential resolution must be fail-closed.
2. API contract breadth must never exceed implementation truth.
3. Exchange support must be explicit per capability family.
4. Guardrails must block the real regression shape, not only a subset.
5. Closure requires code, tests, docs, queue state, and evidence to agree.

## Canonical Rules

### LIVE Execution Ownership

- LIVE order execution must use the API key canonically bound to the selected
  bot or its canonical wallet context.
- If canonical key ownership cannot be resolved, the command must fail with an
  explicit domain error.
- Selecting "some other recent API key for the same exchange" is forbidden.
- Ownership validation must be shared and reusable across manual-order and
  future agent/operator execution paths.

### Exchange Capability Truthfulness

- Authenticated account-read capabilities must be modeled separately from broad
  `LIVE_EXECUTION` capability.
- At minimum, capability truth must distinguish:
  - balance preview support
  - positions snapshot support
  - open-orders snapshot support
- If a requested exchange is unsupported for a specific authenticated read, the
  API must return an explicit unsupported-capability/domain error.
- A route may be Binance-only in V1, but then:
  - its API contract must say so explicitly, or
  - its generic `exchange` input must be narrowed or guarded fail-closed.

### Web UI Copy and Guardrails

- User-facing literals rendered through JSX props or presenter inputs are still
  UI copy and must be governed by i18n or a documented presenter contract.
- Guardrails must detect hardcoded UI debt in:
  - toast/confirm paths
  - JSX prop literals
  - presenter/section labels passed as string literals
  - local runtime fallback labels shown directly to operators
- Once a literal surface is migrated, no permanent allowlist may remain without
  a current documented reason.

## Required Task Packet Content

Every remediation task in this family must define:

- exact risk being removed
- exact files or module family in scope
- exact predecessor dependencies
- explicit non-goals
- acceptance criteria
- validation commands
- required docs/context sync outputs

If the task cannot be executed safely from one packet, it must be split before
implementation.

## Forbidden Patterns

- fallback from missing bot-bound API key to any other user API key
- generic `exchange` request shapes that still hardcode `BINANCE` internally
- returning `source: 'BINANCE'` from a path that claims broader exchange scope
- calling a helper named for one exchange from a supposedly generic route
- declaring guardrails closed while known JSX or presenter string literals still
  bypass detection

## Required Closure Outputs

This remediation family is only closed when all of the following are present
and agree:

- detailed plan under `docs/planning/`
- queue state in `docs/planning/mvp-next-commits.md`
- mirrored phase state in `docs/planning/mvp-execution-plan.md`
- synchronized `.codex/context/TASK_BOARD.md`
- synchronized `.codex/context/PROJECT_STATE.md`
- focused validation evidence under `docs/operations/`
- updated architecture/module/governance docs for any changed ownership or
  capability contract
