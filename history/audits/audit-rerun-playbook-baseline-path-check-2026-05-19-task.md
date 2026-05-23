# Task

## Header
- ID: AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-CHECK-2026-05-19
- Title: Validate rerun playbook baseline paths
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-HANDOFF-ROLLUP-SUMMARY-PARITY-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-RERUN-PLAYBOOK-BASELINE-PATHS`
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
- [x] The task improves future audit rerun trust without changing runtime behavior.

## Mission Block
- Mission objective: prevent reusable audit rerun playbook baseline-path drift.
- Release objective advanced: future audit reruns start from resolvable manifest and rollup baseline artifacts.
- Included slices: rerun playbook baseline metadata, validator rule, regression tests, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:rerun-playbook:check` fails when required baseline paths are missing or unresolved.

## Context

The reusable audit rerun playbook points future broad audits at the 2026-05-19 baseline. The validator already checked audit coverage, commands, sections, closure checks, and safety boundaries, but it did not verify that baseline manifest and rollup artifacts were complete and resolvable.

## Goal

Harden `audit:rerun-playbook:check` so it verifies baseline manifest, rollup Markdown, and rollup JSON paths.

## Scope

- `history/audits/reusable-audit-rerun-playbook-2026-05-19.md`
- `history/artifacts/reusable-audit-rerun-playbook-2026-05-19.json`
- `scripts/checkReusableAuditRerunPlaybook.mjs`
- `scripts/checkReusableAuditRerunPlaybook.test.mjs`
- `history/audits/reusable-audit-tooling-index-2026-05-19.md`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: a future audit rerun could start from a playbook with stale or missing baseline artifact paths.
- Expected reliability outcome: rerun playbook baseline paths stay complete and resolvable.
- How success will be observed: rerun playbook validator fails when baseline keys or referenced paths are missing.
- Post-launch learning needed: no.

## Deliverable For This Stage

A rerun playbook validator that checks required baseline keys and path existence.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add `baseline.rollupJson` to the rerun playbook JSON and Markdown baseline list.
2. Validate required baseline keys and path existence in `audit:rerun-playbook:check`.
3. Add focused regression coverage for missing baseline keys and missing baseline paths.
4. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] `audit:rerun-playbook:check` reports missing baseline keys.
- [x] `audit:rerun-playbook:check` reports missing baseline paths.
- [x] Existing rerun playbook coverage, command, closure, section, and safety checks still pass.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:rerun-playbook:check:test`
  - `corepack pnpm run audit:rerun-playbook:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed rerun playbook baseline links against current baseline artifacts.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: no `chrome-headless-shell` rows remained after final cleanup; no local `5432`/`6379` listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: rerun playbook validation now catches missing or unresolved baseline manifest/rollup paths.
- Files changed: rerun playbook Markdown/JSON, rerun playbook validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: focused rerun playbook validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
