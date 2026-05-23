# Task

## Header
- ID: AUDIT-REMEDIATION-PLAN-SELF-CHECK-CLOSURE-2026-05-19
- Title: Require remediation plan self-check closure
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: `AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-CHECK-2026-05-19`
- Priority: P1
- Module Confidence Rows: `SOAR-OPERATIONS-001`
- Requirement Rows: `REQ-AUDIT-031`, `REQ-FUNC-021`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-021`, `RISK-036`
- Iteration: 2026-05-19 continuation
- Operation Mode: BUILDER
- Mission ID: `AUDIT-REMEDIATION-SELF-CHECK-CLOSURE`
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
- [x] The task improves future audit remediation trust without changing runtime behavior.

## Mission Block
- Mission objective: prevent remediation plan closure from omitting its own validator.
- Release objective advanced: future audit repair roadmaps stay self-verifying.
- Included slices: remediation validator rule, regression test, tooling index docs, source-of-truth state sync.
- Explicit exclusions: no production calls, no secret use, no runtime behavior changes, no architecture decision changes.
- Checkpoint cadence: one bounded audit-tooling slice.
- Stop conditions: any validation would require production credentials, LIVE mutation, exchange-side mutation, or new architecture approval.
- Handoff expectation: `audit:remediation-plan:check` fails when remediation closure omits `audit:remediation-plan:check`.

## Context

The remediation master plan already listed `corepack pnpm run audit:remediation-plan:check` in `closureChecks`, but the validator did not require that self-check fragment. A future edit could remove the command while the plan still passed validation.

## Goal

Harden `audit:remediation-plan:check` so remediation closure must include the remediation-plan self-check command.

## Scope

- `scripts/checkAuditRemediationPlan.mjs`
- `scripts/checkAuditRemediationPlan.test.mjs`
- `history/audits/reusable-audit-tooling-index-2026-05-19.md`
- `history/artifacts/reusable-audit-tooling-index-2026-05-19.json`
- source-of-truth state references

## Success Signal
- User or operator problem: a future remediation roadmap could pass validation after dropping the command that validates it.
- Expected reliability outcome: remediation plans remain self-checking before closure.
- How success will be observed: remediation validator fails when `audit:remediation-plan:check` is missing from closure checks.
- Post-launch learning needed: no.

## Deliverable For This Stage

A remediation-plan validator that requires the remediation self-check in closure checks.

## Constraints
- use existing Node script/package command patterns
- do not introduce runtime systems
- do not change product/runtime behavior
- do not run production or protected journeys
- keep production readiness `NO-GO` until real `AUD-19` evidence exists

## Implementation Plan
1. Add `audit:remediation-plan:check` to required remediation closure fragments.
2. Update focused regression coverage for incomplete closure checks.
3. Update tooling index purpose text and source-of-truth state.

## Acceptance Criteria
- [x] `audit:remediation-plan:check` reports missing remediation self-check closure commands.
- [x] Existing phase, work-package, reference, blocker, and safety checks still pass.
- [x] Full audit verification remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a no-secret audit tooling slice.
- [x] Relevant tests and guardrails pass.
- [x] Docs/state references are updated.
- [x] No production mutation, protected route call, LIVE mutation, or exchange-side mutation occurred.

## Validation Evidence
- Tests:
  - `corepack pnpm run audit:remediation-plan:check:test`
  - `corepack pnpm run audit:remediation-plan:check`
  - `corepack pnpm run audit:manifest:verify`
  - `corepack pnpm run docs:parity:check`
  - `corepack pnpm run quality:guardrails`
  - `git diff --check`
- Manual checks: reviewed remediation plan `closureChecks`.
- High-risk checks: no production calls, no protected inputs, no LIVE/exchange-side mutation.
- Cleanup checks: no `chrome-headless-shell` rows remained after final cleanup; no local `5432`/`6379` listeners were found and Docker had no running compose services.
- Module confidence ledger updated: yes
- Requirements matrix updated: yes
- Risk register updated: yes
- Reality status: verified

## Result Report

- Task summary: remediation plan validation now catches closure sets that omit the remediation self-check.
- Files changed: remediation validator/test, tooling index Markdown/JSON, and source-of-truth state docs.
- How tested: focused remediation validator tests/check, full audit manifest verification, docs parity, guardrails, diff check.
- What is incomplete: protected `AUD-19` execution remains blocked by missing approved inputs.
- Next steps: provide approved protected inputs and execute the current operator unblock packet, or continue local audit tooling maintenance if inputs remain unavailable.
- Decisions made: none.
