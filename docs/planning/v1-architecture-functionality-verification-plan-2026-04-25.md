# Task

## Header
- ID: V1REG-A
- Title: Architecture-V1 functionality verification loop and reusable regression protocol
- Status: DONE
- Owner: Planning Agent
- Depends on: V1COH-A, XADAPT-A
- Priority: P1

## Context
The architecture set now describes a stable V1 product surface clearly enough
to support a function-by-function verification loop, but the repository lacked
one reusable checklist that connects:

- architecture truth
- current implementation status
- automated verification paths
- manual browser verification paths
- follow-up task planning when behavior is missing or regressed

That gap makes deep validation expensive because each new pass starts with
re-discovery. It also makes weekly or post-deploy regression work fragile:
there was no single list saying "these are the V1 functions, this is how we
prove each one, and this is where fixes should be queued."

This wave creates that missing loop. It is intentionally bigger than a one-off
QA note: the target is one reusable A-to-Z verification protocol that can be
re-run a week later without rebuilding scope from memory.

## Goal
Create and use one architecture-based verification loop for V1 so Soar can be
checked function by function, with deterministic follow-up planning for:

- missing functionality
- incorrect behavior
- regressions after later changes

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- treat architecture docs as the function inventory source of truth
- reuse existing queued waves when they already cover a discovered gap

## Definition of Done
- [x] One reusable architecture-based functionality checklist exists in docs and
      maps each V1 function to implementation status plus auto/manual checks.
- [x] The automated verification sweep has been executed and results are
      recorded against the checklist.
- [x] The manual browser sweep has been executed and findings are recorded with
      enough detail to reproduce later.
- [x] Every failed or partial function is either mapped to an existing queued
      wave or queued as a new explicit follow-up task.
- [x] The checklist can be re-used for weekly regression without re-auditing
      the architecture set from scratch.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- treating plan files as the only result without a reusable execution checklist
- queuing duplicate tasks when an existing active wave already covers the gap

## Validation Evidence
- Tests:
  - function-group-focused Vitest/e2e packs listed in the checklist
  - `pnpm run quality:guardrails`
- Manual checks:
  - browser pass across the architecture function inventory
- Screenshots/logs:
  - browser notes or artifacts only when a failure or drift is observed
- High-risk checks:
  - keep partial states explicit rather than marking them falsely complete
  - do not collapse ops-truth gaps into product-code success claims

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/02_system-topology.md`
  - `docs/architecture/03_domain-model.md`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/07_modes-parity-and-data.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/10_safety-entitlements-and-risk.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - only if checklist execution reveals a genuine contract gap rather than an
    implementation bug

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: operator surfaces already approved in canonical UX
  docs; this wave verifies them against architecture truth rather than changing
  visual design by default
- Required states: loading | empty | degraded | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - keyboard and readable state transitions on key operator paths
- Parity evidence:
  - dashboard and bots runtime surfaces must stay parity-compatible for the same
    bot where architecture says they should

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This wave should be executed only after the currently queued partial closures
that would otherwise create noisy or known-failing results:

- `V1COH-A` for manual LIVE submitted->reconciled truth
- `XADAPT-A` for exchange adapter and Binance-boundary hardening

The checklist itself can still be used earlier, but expected partial failures
must then be recorded honestly rather than treated as surprises.

Primary reusable artifact:
- `docs/operations/v1-architecture-functionality-regression-checklist-2026-04-25.md`

## Execution Plan

### Slice 1 - Inventory and checklist
- [x] `V1REG-01 docs(audit): publish architecture-v1 functionality inventory and reusable regression checklist`
  - derive V1 function inventory from canonical architecture docs
  - classify each function as implemented, partial, or ops-partial
  - attach automated and manual verification paths for each function

### Slice 2 - Automated verification sweep
- [x] `V1REG-02 qa(auto): execute architecture-v1 automated verification pack and record function-by-function status`
  - run grouped API and web packs from the checklist
  - record pass/fail by function instead of only per test file
  - keep known queued partials explicit

### Slice 3 - Manual browser verification sweep
- [x] `V1REG-03 qa(browser): execute architecture-v1 browser checklist and capture findings`
  - click through each function surface
  - record observed states and any divergence from architecture truth
  - capture enough notes for repeatability one week later

### Slice 4 - Queue sync from findings
- [x] `V1REG-04 planning(sync): classify failures and queue missing or regressed functions`
  - reuse existing queued waves when scope already matches
  - add new `V1REG-Fxx` tasks only for uncovered gaps
  - update queue/context after triage

### Slice 5 - Regression closure
- [x] `V1REG-05 qa(regression): rerun touched function packs and refresh checklist status`
  - rerun only the changed function groups plus required guardrails
  - refresh checklist state and notes after fixes land
