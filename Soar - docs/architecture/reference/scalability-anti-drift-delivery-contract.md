# Scalability and Anti-Drift Delivery Contract

Status: Active  
Updated: 2026-04-22

## Purpose

Define the permanent delivery rules for post-`L10NQ` / post-`CQLT` Soar work
so the repository scales by extending canonical seams instead of reintroducing
duplicate ownership, local feature exceptions, or planning drift.

## Why This Contract Exists

The main failure modes observed in prior waves were:

- feature work landing on top of stale allowlists and outdated inventories
- multiple partially-canonical ownership paths existing at the same time
- large containers/services continuing to grow because extraction targets were
  not frozen early enough
- tasks requiring an executor to reconstruct intent from multiple files instead
  of one self-sufficient task packet
- closure evidence updating one source of truth while leaving queue, inventory,
  or guardrail files behind

This contract exists to stop those loops.

## Core Anti-Drift Rules

1. One task must be self-sufficient.
2. One domain responsibility must have one canonical owner.
3. Guardrails must be truthful to the current repository state.
4. Inventory and planning docs must be updated before more feature growth lands
   on the same hotspot.
5. Closure means code, tests, queue, inventory, and evidence all agree.

## Task Packet Standard

Every queued task in a remediation wave must contain, either directly in the
queue or in its linked planning section:

- objective and reason for existence
- exact predecessor tasks, if any
- exact files or module families in scope
- explicit non-goals
- acceptance criteria
- validation commands
- required docs/context sync outputs

If the task cannot be executed safely from one packet, it must be split before
implementation starts.

## Ownership Rules

### Exchange and Runtime Access

- authenticated exchange access must converge through one canonical client
  boundary per capability family
- public exchange metadata / market map / symbol rules access must converge
  through one canonical read boundary
- wallet metadata, manual-order context, symbol rules, and external snapshots
  must not each invent parallel exchange-resolution logic

### Web UI Containers

- route containers may orchestrate data flow, but domain formatting, tab
  analytics, table column ownership, and section presentation should live in
  extracted seams
- no new feature work should expand an existing oversized container when the
  change can land in a dedicated controller/view-model/section seam

### Guardrails and Inventory

- once a hotspot is cleaned, its allowlist entry must be removed in the same
  wave or explicitly justified as temporary
- maintainability inventory must reflect current code, not historical hotspot
  sizes after refactors have already landed

## Required Closure Artifacts

Every anti-drift wave is only truly closed when all of the following exist and
agree:

- queue state in `docs/planning/mvp-next-commits.md`
- detailed phase state in `docs/planning/mvp-execution-plan.md`
- canonical state in `.codex/context/TASK_BOARD.md`
- canonical state in `.codex/context/PROJECT_STATE.md`
- updated inventory / guardrails docs when hotspot ownership changed
- validation evidence under `docs/operations/`

## Forbidden Patterns

- leaving stale allowlists after hotspot closure
- introducing new ad hoc exchange bootstrap paths while a canonical factory or
  access layer already exists
- expanding `1000+` line containers/services without an explicit decomposition
  queue item
- merging structural decomposition with unrelated feature behavior changes
- marking a wave closed when queue/context and evidence disagree
