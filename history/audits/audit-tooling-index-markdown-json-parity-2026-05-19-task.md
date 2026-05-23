# Task

## Header
- ID: AUDIT-TOOLING-INDEX-MARKDOWN-JSON-PARITY-2026-05-19
- Title: Validate tooling index Markdown and JSON tool parity
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-RERUN-PLAYBOOK-COMPARE-JSON-OUTPUT-SYNC-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-TOOLING-INDEX-PARITY`
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
- [x] The task improves future audit tooling discoverability without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit tooling index Markdown/JSON drift.
- Release objective advanced: future agents can trust the human-readable and machine-readable tooling index pair.
- Included slices: tooling index validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:tooling-index:check` fails when the Markdown companion omits a JSON tool ID.

## Context

The reusable audit tooling index has a Markdown file for humans and a JSON file for automation. The validator checked the JSON structure but did not verify that the companion Markdown still listed every JSON tool ID.

## Goal

Harden `audit:tooling-index:check` so it detects Markdown/JSON tool ID drift.

## Scope

- `scripts/checkReusableAuditToolingIndex.mjs`
- `scripts/checkReusableAuditToolingIndex.test.mjs`
- `history/audits/reusable-audit-tooling-index-2026-05-19.md`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: a future agent could miss a reusable audit command because Markdown and JSON drift apart.
- Expected reliability outcome: the JSON tool list and Markdown tool table stay aligned.
- How success will be observed: tooling-index validator fails when Markdown omits a JSON tool ID.
- Post-launch learning needed: no.

## Deliverable For This Stage

A tooling-index validator that checks companion Markdown tool ID coverage when the Markdown file is available.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Load the companion Markdown file in the tooling-index CLI when it exists next to the JSON file.
2. Validate that each JSON tool ID is present in the Markdown text.
3. Add focused regression coverage for a missing Markdown tool ID.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] `audit:tooling-index:check` reports missing Markdown tool IDs.
- [x] Existing tooling-index JSON checks still pass.
- [x] Tooling index Markdown/JSON purpose text reflects the parity check.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:tooling-index:check:test`
  - `corepack pnpm run audit:tooling-index:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed tooling index Markdown/JSON tool table parity.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: tooling-index validation now catches missing Markdown entries for JSON tool IDs.
- Files changed: tooling-index validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: focused tooling-index validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
