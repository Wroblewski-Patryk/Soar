# BOTMULTI-A - Post-V1 Multi-Strategy Bot Reintroduction Plan

Status: Deferred
Owner: Codex Planning Agent
Stage: planning
Last Updated: 2026-04-29

## Context

The user approved the staged direction on 2026-04-29:

- keep `V1` on the current canonical singular bot model;
- after `V1` hardening is stable, reintroduce multi-strategy-per-bot as a
  deliberate architecture wave.

This is not a small follow-up feature. It reopens the canonical bot model
itself:

- today: `1 bot = 1 wallet + 1 symbol-group market scope + 1 strategy`
- target after this wave: `1 bot = 1 wallet + 1 symbol-group market scope + N strategies`

Because that changes architecture, runtime signal evaluation, ownership,
operator surfaces, and migrations, it must not be mixed with `V1TRUTH-A`.

## Goal

Provide an execution-ready post-`V1` roadmap for multi-strategy-per-bot so the
change can be introduced without regressing `LIVE` money-path truth that
`V1TRUTH-A` is meant to stabilize first.

## Preconditions

- `V1TRUTH-A` is fully closed
- focused post-close production verification remains stable
- singular-bot `LIVE` money-path truth is still green after the closure pack
- architecture docs are allowed to change before any implementation starts

## Architecture Work Required First

Before implementation, this wave must update and freeze at least:

- `docs/architecture/03_domain-model.md`
- `docs/architecture/04_runtime-contexts.md`
- `docs/architecture/05_strategy-signal-and-decision-flow.md`
- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- any affected operator/runtime reference contracts

Required decisions to freeze:

1. strategy ordering and deterministic merge semantics per bot
2. per-strategy versus per-bot risk budget ownership
3. how `DCA/TTP/TSL` attach to one position when multiple strategies can emit
   signals on the same bot scope
4. how manual order context resolves strategy-specific leverage and controls
5. how runtime and dashboard surfaces show per-strategy provenance and state

## Execution Outline

1. `BOTMULTI-00 planning(queue): publish deferred multi-strategy reintroduction packet`
   - Done in this planning stage.

2. `BOTMULTI-01 docs(decision): freeze post-V1 multi-strategy bot contract`
   - Replace the singular contract in architecture only after `V1TRUTH-A`
     closure confirms the current baseline is stable.

3. `BOTMULTI-02 audit(data+runtime): inventory legacy compatibility remnants and migration debt`
   - Classify what still exists from older multi-entity topology and what must
     be removed, reused, or migrated.

4. `BOTMULTI-03 db(schema): finalize canonical multi-strategy topology and migration path`
   - Ensure one canonical persistence model instead of compatibility-layer
     overlap.

5. `BOTMULTI-04 api(write): support bot create/update with multiple strategies`
   - Fail closed on invalid mixes and unsupported symbol-group/strategy
     combinations.

6. `BOTMULTI-05 runtime(signal-merge): execute deterministic multi-strategy evaluation per bot`
   - Reuse one canonical merge contract.

7. `BOTMULTI-06 runtime(risk+lifecycle): align DCA/TTP/TSL and ownership across multiple strategies`
   - Keep one position lifecycle truth even when multiple strategies can
     participate.

8. `BOTMULTI-07 web(ui+operator): expose multi-strategy bot management and runtime truth`
   - Bot forms, runtime widgets, monitoring, and manual-order context must all
     remain honest about strategy provenance.

9. `BOTMULTI-08 qa(closure): run architecture-to-runtime closure pack and publish evidence`
   - Include adversarial `LIVE` and restart/recovery scenarios.

## Acceptance Criteria

- The architecture explicitly defines the canonical multi-strategy bot model
  before code changes start.
- Data model, write paths, runtime merge logic, and UI all reuse one contract.
- Manual order, manual close, protection logic, and operator surfaces remain
  strategy-provenance-aware and fail closed.
- Closure evidence proves multi-strategy support does not regress the `V1TRUTH`
  money path.

## Risks

- reviving legacy topology partially would recreate the same ambiguity the
  singular-bot migration removed
- multi-strategy merge can silently fork lifecycle truth if risk/protection
  ownership is not explicit
- UI can overstate strategy control unless runtime provenance is persisted and
  exposed end to end

## Validation Target

- architecture review against canonical docs
- focused API and web contract packs
- runtime parity tests for merge, protection, and ownership
- go-live smoke for affected `LIVE` scenarios after implementation

## Result Report

- Task summary: deferred post-`V1` execution roadmap only
- Files changed: planning packet only
- How tested: `pnpm run quality:guardrails`
- What is incomplete: architecture updates, code, tests, closure evidence
- Next steps: keep deferred until `V1TRUTH-A` is closed and stable
