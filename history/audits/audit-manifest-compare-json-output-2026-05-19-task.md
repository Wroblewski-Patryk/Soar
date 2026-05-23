# Task

## Header
- ID: AUDIT-MANIFEST-COMPARE-JSON-OUTPUT-2026-05-19
- Title: Persist manifest comparison JSON reports
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-MANIFEST-COMPARE-STATUS-BUCKET-CHECK-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-MANIFEST-COMPARE-REPORT-OUTPUT`
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
- Mission objective: make reusable audit manifest comparisons persistable as JSON evidence.
- Release objective advanced: future broad audits can save machine-readable comparison reports instead of relying on copied terminal output.
- Included slices: manifest comparison CLI option, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: future reruns can use `--json-output <path>` when comparing manifests.

## Context

`audit:manifest:compare` already printed JSON with `--json`, but it did not write a comparison artifact to disk. Future monthly audit reruns need durable JSON output to show regressions, improvements, decisions, and safety-boundary changes without manual copy/paste.

## Goal

Add `--json-output <path>` to `audit:manifest:compare` and lock the behavior with a CLI regression test.

## Scope

- `scripts/compareReusableAuditManifests.mjs`
- `scripts/compareReusableAuditManifests.test.mjs`
- `history/audits/reusable-audit-tooling-index-2026-05-19.md`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: future audit comparison evidence is not trapped in terminal output.
- Expected reliability outcome: comparison JSON can be persisted under a chosen path.
- How success will be observed: CLI regression test writes and reads a JSON report from a temporary path.
- Post-launch learning needed: no.

## Deliverable For This Stage

A manifest comparison command that can write a machine-readable JSON report with `--json-output`.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add `--json-output <path>` parsing to the manifest comparison command.
2. Create parent directories before writing the JSON report.
3. Add a CLI regression test that writes and reads a comparison report.
4. Update tooling index docs and source-of-truth state.

## Acceptance Criteria
- [x] `audit:manifest:compare -- --json-output <path>` writes JSON output.
- [x] Parent output directories are created automatically.
- [x] Existing stdout behavior remains available.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:manifest:compare:test`
  - `corepack pnpm run audit:manifest:compare -- --base history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --target history/artifacts/reusable-audit-artifact-manifest-2026-05-19.json --json-output docs/operations/_tmp-audit-manifest-compare-self-check.json`
  - `Remove-Item -LiteralPath docs/operations/_tmp-audit-manifest-compare-self-check.json`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed persisted JSON shape against existing comparison output.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: manifest comparison can now persist JSON reports with `--json-output`.
- Files changed: manifest compare command/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: manifest compare test, explicit self-compare JSON-output write, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
