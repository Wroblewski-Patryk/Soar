# Task

## Header
- ID: AUDIT-RERUN-PLAYBOOK-COMPARE-JSON-OUTPUT-SYNC-2026-05-19
- Title: Require persisted manifest comparison output in rerun playbook
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-MANIFEST-COMPARE-JSON-OUTPUT-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-RERUN-COMPARE-OUTPUT-ENFORCEMENT`
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
- [x] The task improves future audit rerun evidence capture without changing runtime behavior.

## Mission Block
- Mission objective: make the reusable audit rerun playbook require persisted manifest comparison output.
- Release objective advanced: future broad audits produce durable comparison evidence instead of stdout-only JSON.
- Included slices: rerun playbook JSON/Markdown, validator rule, regression test, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: future reruns should use `--json-output docs/operations/reusable-audit-manifest-comparison-YYYY-MM-DD.json`.

## Context

`audit:manifest:compare` now supports `--json-output <path>`, but the rerun playbook still described the structured comparison command as `--json`, which prints to stdout only. That would make future monthly rerun evidence easier to lose.

## Goal

Update the rerun playbook and validator so `futureManifestCommands.compareJson` must persist a JSON report with `--json-output`.

## Scope

- `scripts/checkReusableAuditRerunPlaybook.mjs`
- `scripts/checkReusableAuditRerunPlaybook.test.mjs`
- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.md`
- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: rerun playbook can no longer silently point to stdout-only structured comparison output.
- Expected reliability outcome: rerun comparison JSON output is durable by default.
- How success will be observed: rerun playbook validator fails when `compareJson` omits `--json-output`.
- Post-launch learning needed: no.

## Deliverable For This Stage

A rerun playbook and validator that require persisted JSON output for structured manifest comparisons.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Update `futureManifestCommands.compareJson` to use `--json-output`.
2. Update Markdown rerun instructions to name the persisted JSON artifact.
3. Add validator logic that fails if `compareJson` omits `--json-output`.
4. Add focused regression coverage.
5. Update source-of-truth state.

## Acceptance Criteria
- [x] Rerun playbook JSON `compareJson` uses `--json-output`.
- [x] Rerun playbook Markdown instructs persisted JSON output.
- [x] Validator fails when `compareJson` is stdout-only.
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
- Manual checks: reviewed playbook Markdown/JSON command parity.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: reusable audit rerun playbook now requires persisted JSON comparison output.
- Files changed: rerun playbook validator/test, rerun playbook Markdown/JSON, and source-of-truth state docs.
- How tested: focused rerun-playbook validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
