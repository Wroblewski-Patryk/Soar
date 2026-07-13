# Task

## Header
- ID: LUC-975
- Title: Close bots `registerAndLogin` missing-doc-link routing
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: [LUC-734](/LUC/issues/LUC-734)
- Priority: P1
- Module Confidence Rows: Account access / API bots auth bootstrap helper documentation
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation discoverability
- Risk Rows: app-completion Account access doc-link risk for bots auth bootstrap helpers
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-975-ACCOUNT-ACCESS-REGISTERANDLOGIN-DOC-LINK-2026-07-13
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: close the bots `registerAndLogin` docs-owned Account access gap in generated truth.
- Release objective advanced: app-completion/project-truth can move from the bots auth bootstrap helpers to the next true docs gap.
- Included slices: module doc update, documentation-link registry update, scanner document overrides, generated readback, evidence/state sync.
- Explicit exclusions: runtime code changes, new tests, deploy, push, protected smoke, secret/account reads, DB mutations, source-control closure.
- Checkpoint cadence: one docs edit checkpoint and one generator-readback checkpoint.
- Stop conditions: both scoped rows disappear from `missing_doc_link` routing or a generator mismatch is discovered.
- Handoff expectation: close the issue with documentation evidence and explicit residual dirty-state scope.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, Paperclip wake | issue closure and integration | closeout packet | final readback | COMPLETE |
| Product/Requirements | coordinator | `docs/status/project-truth-index.md` | scoped Account access gap | scoped problem statement | generated readback | COMPLETE |
| Architecture | coordinator | `docs/modules/api-bots.md`, `documentation-links.csv`, `scanner-overrides.json` | docs relation truth | durable doc-link closure | generator chain | COMPLETE |
| Implementation | coordinator | docs/state only | no runtime code | source-of-truth edits | `git diff --check` | COMPLETE |
| QA/Test | coordinator | existing bots e2e proof pack | focused readback only | no new proof required | generator chain | COMPLETE |
| Security/Ops/UX | omitted | not applicable | none | none | none | OMITTED |
| Documentation/Memory | coordinator | task/evidence/state files | durable memory | evidence packet and state sync | file review | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`[LUC-734](/LUC/issues/LUC-734)` already established the repair pattern for a
`registerAndLogin` docs-ingestion gap on the Backtests side. Current generated
truth on July 13, 2026 still routed the first Account access docs gaps to the
Bots module auth bootstrap helpers
`apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts#registerAndLogin`
and `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin`.

## Goal
Attach durable module documentation and graph relations for the bots shared and
duplicate-guard `registerAndLogin` helpers so generated app-completion/project-truth
no longer classify them as `missing_doc_link`.

## Success Signal
- User or operator problem: project truth still claimed missing docs for bots auth bootstrap helpers even though they are standard reusable proof setup.
- Expected product or reliability outcome: future agents see the bots auth bootstrap helpers as documented setup surfaces and advance to the next true docs gap.
- How success will be observed: generator chain removes both scoped rows from app-completion/project-truth `missing_doc_link` routing.
- Post-launch learning needed: no

## Deliverable For This Stage
A verified docs/evidence/state packet that closes the scoped doc-link gaps,
records the next routed gap, and preserves the boundary against unrelated dirty
state already present in the worktree.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `docs/modules/api-bots.md` explicitly documents the shared and duplicate-guard `registerAndLogin` helper contracts.
- [x] `documentation-links.csv` and `scanner-overrides.json` contain the matching `documents` relations.
- [x] Generated app-completion/project-truth readback no longer routes the scoped entities as `missing_doc_link`.
- [x] Residual dirty-state scope is explicit and does not get misattributed to this issue.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: serial generator chain; `pnpm run architecture:graph:drift:strict`
- Manual checks: targeted `rg` for scoped entities in docs/status outputs; `git diff --check`; `git status --short`
- Screenshots/logs: not applicable
- High-risk checks: not applicable
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Account access / API bots auth bootstrap helper documentation
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/graphs/architecture-awareness.json`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: generated graph/status refresh only

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: project truth first gap routed to the bots duplicate-guard `registerAndLogin`; app-completion also routed the shared helper.
- Gaps: no direct `documents` relation existed for either scoped entity.
- Inconsistencies: the reusable auth bootstrap pattern was documented at file level, but not at function-entity level for both helpers.
- Architecture constraints: use canonical module docs and graph registries only.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: `AGENTS.md`, `docs/status/project-truth-index.md`, `docs/status/app-completion-index.md`, `docs/modules/api-bots.md`, `documentation-links.csv`, `scanner-overrides.json`, prior `LUC-734` task/evidence
- Rows created or corrected: scoped doc rows and relation overrides
- Assumptions recorded: safe to close both bots rows together because both are the same auth bootstrap contract reused across protected bot e2e scenarios
- Blocking unknowns: none
- Why it was safe to continue: existing tests and module ownership already made the helper behavior explicit

### 2. Select One Priority Mission Objective
- Selected task: close bots `registerAndLogin` doc-link routing
- Priority rationale: first Account access docs gap and direct wake scope
- Why other candidates were deferred: later helper gaps such as `bots.subscription-entitlements.e2e.test.ts#registerAndLogin` remain separate follow-ups

### 3. Plan Implementation
- Files or surfaces to modify: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/architecture/scanner-overrides.json`, generated status outputs, state/evidence files
- Logic: add shared and duplicate-guard helper contract text plus matching `documents` relations, then rerun generators in strict sequence
- Edge cases: keep the helper description tied to real `/auth/register` plus subscription upgrade, not to unrelated runtime scenario details

### 4. Execute Implementation
- Implementation notes: updated the API bots test-coverage description and doc-link classification table, then registered both function-level relations in the canonical doc-link registries.

### 5. Verify and Test
- Validation performed: serial graph/app-completion/project-truth generation, strict graph drift audit, targeted `rg` readback for scoped entities, dirty-state readback
- Result: pass; scoped entities no longer route as `missing_doc_link`, and the shared helper advanced to `implemented_needs_proof`

### 6. Self-Review
- Simpler option considered: adding only registry rows without module-doc text
- Technical debt introduced: no
- Scalability assessment: follows the existing doc-link closure pattern used by prior scoped app-completion fixes
- Refinements made: closed the shared helper and duplicate-guard helper together so bots auth bootstrap truth stays aligned

### 7. Update Documentation and Knowledge
- Docs updated: yes
- Context updated: yes
- Learning journal updated: no

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
- [x] Parent validation ran after accepted lane integration.

## Result Report

- Task summary: closed the scoped bots auth-bootstrap doc-link gaps across the module doc and canonical relation registries, then verified generated truth converted the shared helper from a docs gap into a proof-owned `implemented_needs_proof` row.
- Files changed: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/architecture/scanner-overrides.json`, generated docs/status outputs, state/evidence files.
- How tested: serial generator chain plus `pnpm run architecture:graph:drift:strict`, targeted readback searches, and dirty-state readback.
- What is incomplete: broader source-control closure remains out of scope because unrelated dirty state already existed in the local worktree.
- Next steps: hand off the new first-gap proof row `apps/api/src/modules/bots/bots.e2e.shared.ts#registerAndLogin` to QA/Test Automation, while the next docs-owned Account access row is `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin`.
- Decisions made: treated both bots helpers as one bounded docs slice because they represent the same auth bootstrap contract at shared-helper and scenario-specific layers.
