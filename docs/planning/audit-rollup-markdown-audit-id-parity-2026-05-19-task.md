# Task

## Header
- ID: AUDIT-ROLLUP-MARKDOWN-AUDIT-ID-PARITY-2026-05-19
- Title: Validate rollup Markdown and JSON audit ID parity
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-MANIFEST-MARKDOWN-SUMMARY-PARITY-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-ROLLUP-MARKDOWN-ID-PARITY`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the implementation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement and risk rows were identified.
- [x] The task improves future audit rollup trust without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit rollup Markdown/JSON audit ID drift.
- Release objective advanced: future agents can trust that the human-readable rollup table covers the same audit IDs as the machine-readable rollup.
- Included slices: rollup validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:rollup:check` fails when the companion Markdown omits an audit ID present in JSON.

## Context

The reusable full-audit rollup exists as a JSON artifact and a Markdown companion. The JSON validator already checked audit ID coverage, summary counts, paths, repair queue items, and safety booleans, but it did not verify that the Markdown table still listed every audit ID present in JSON.

## Goal

Harden `audit:rollup:check` so it detects Markdown/JSON audit ID drift when the Markdown companion exists.

## Scope

- `scripts/checkFullReusableAuditRollup.mjs`
- `scripts/checkFullReusableAuditRollup.test.mjs`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: a future agent could read a stale Markdown rollup table while JSON remains complete.
- Expected reliability outcome: Markdown and JSON rollup audit ID coverage stay aligned.
- How success will be observed: rollup validator fails when Markdown omits an audit ID from JSON.
- Post-launch learning needed: no.

## Deliverable For This Stage

A rollup validator that checks companion Markdown audit IDs when the Markdown file is available.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Load the companion Markdown file in the rollup CLI when it exists next to the JSON file.
2. Validate that each JSON audit ID appears in the Markdown rollup table.
3. Add focused regression coverage for a missing Markdown audit ID.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] `audit:rollup:check` reports missing Markdown audit IDs.
- [x] Existing rollup JSON checks still pass.
- [x] Tooling index Markdown/JSON purpose text reflects audit ID parity checking.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:rollup:check:test`
  - `corepack pnpm run audit:rollup:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed rollup Markdown table audit IDs and JSON audit IDs.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: five residual `chrome-headless-shell` rows were inspected as
  a Playwright tree, removed by stopping the parent process, and rechecked with
  no rows remaining. A follow-up docs/guardrails recheck spawned a second
  four-row tree; stopping the parent was insufficient, so a narrow
  `Get-Process chrome-headless-shell | Stop-Process -Force` cleanup was used
  and the final process check returned no rows. No local `5432`/`6379`
  listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: rollup validation now catches Markdown rollup tables that omit audit IDs present in JSON.
- Files changed: rollup validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: focused rollup validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
