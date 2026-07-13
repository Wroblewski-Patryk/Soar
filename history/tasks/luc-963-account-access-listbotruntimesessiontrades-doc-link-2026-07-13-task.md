# Task

## Header
- ID: LUC-963
- Title: Account access `listBotRuntimeSessionTrades` doc-link closure
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Product Docs Agent
- Depends on: [LUC-938](/LUC/issues/LUC-938)
- Priority: P1
- Module Confidence Rows: Account access / API bots runtime session trades docs truth
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion missing-doc-link routing for Account access runtime session trades route
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-963-ACCOUNT-ACCESS-LISTBOTRUNTIMESESSIONTRADES-DOC-LINK-2026-07-13
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
- Mission objective: close the docs-owned `missing_doc_link` routing for the Account access runtime session trades route.
- Release objective advanced: app-completion/project-truth can route to the next docs gap instead of the scoped `listBotRuntimeSessionTrades` rows.
- Included slices: module doc update, documentation-link registry update, scanner document override, generated readback, evidence/state sync, and same-issue source-control closure.
- Explicit exclusions: runtime code changes, new tests, deploy, protected smoke, secret/account reads, DB mutations.
- Checkpoint cadence: one docs edit checkpoint and one generator-readback checkpoint.
- Stop conditions: the scoped controller row disappears from `missing_doc_link` routing or a generator mismatch is discovered.
- Handoff expectation: close the issue with documentation evidence and local source-control disposition.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, Paperclip wake | issue closure and integration | closeout packet | final readback | COMPLETE |
| Product/Requirements | coordinator | `docs/status/project-truth-index.md` | scoped Account access gaps | scoped problem statement | generated readback | COMPLETE |
| Architecture | coordinator | `docs/modules/api-bots.md`, `documentation-links.csv`, `scanner-overrides.json` | docs relation truth | durable doc-link closure | generator chain | COMPLETE |
| Implementation | coordinator | docs/state only | no runtime code | source-of-truth edits | `git diff --check` | COMPLETE |
| QA/Test | coordinator | existing proof from [LUC-938](/LUC/issues/LUC-938) | focused readback only | no new proof required | generator chain | COMPLETE |
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
`[LUC-938](/LUC/issues/LUC-938)` already proved the controller and paired read-service behavior. Generated truth on July 13, 2026 still routed `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades` as the first Account access `missing_doc_link` gap.

## Goal
Attach durable module documentation and graph relations for the runtime session trades route so generated app-completion/project-truth no longer classify the scoped trades rows as `missing_doc_link`.

## Success Signal
- User or operator problem: the first Account access gap is stale docs routing, not a missing backend proof.
- Expected product or reliability outcome: future agents see the controller as documented and move to the next true docs gap.
- How success will be observed: generator chain removes the scoped trades rows from project truth first-gap and the app-completion missing-doc-link queue.
- Post-launch learning needed: no

## Deliverable For This Stage
A verified docs/evidence/state packet that closes the scoped trades doc-link gap, records the next routed gap, and captures local source-control disposition.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `docs/modules/api-bots.md` explicitly documents the scoped trades route contract.
- [x] `documentation-links.csv` and `scanner-overrides.json` contain the matching `documents` relation.
- [x] Generated app-completion/project-truth readback no longer routes the scoped trades rows as `missing_doc_link`.
- [x] Local source-control disposition is explicit for this docs-only packet.

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
- Manual checks: targeted `rg` for the scoped controller in docs/status outputs; `git diff --check`; clean-start worktree verification
- Screenshots/logs: not applicable
- High-risk checks: not applicable
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: Account access / API bots runtime session trades docs truth
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/graphs/architecture-awareness.json`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: generated graph/status refresh only

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: project truth first gap was the runtime session trades controller `missing_doc_link`.
- Gaps: no durable route-level docs relation was being honored for the scoped trades lane.
- Inconsistencies: proof existed, docs relation did not.
- Architecture constraints: use canonical module docs and graph registries only.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: `AGENTS.md`, `docs/status/project-truth-index.md`, `docs/status/app-completion-index.md`, `docs/modules/api-bots.md`, `documentation-links.csv`, `scanner-overrides.json`
- Rows created or corrected: scoped trades route doc row and relation overrides
- Assumptions recorded: safe to start from the controller because Paperclip wake/title names `listBotRuntimeSessionTrades` and current `project-truth` first-gap evidence points to `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades`
- Blocking unknowns: none
- Why it was safe to continue: wake payload and generated first-gap evidence resolved the controller-vs-service ambiguity

### 2. Select One Priority Mission Objective
- Selected task: close `listBotRuntimeSessionTrades` doc-link routing
- Priority rationale: first Account access project-truth gap
- Why other candidates were deferred: other non-trades Account access gaps remain separate follow-ups after this route-level closure

### 3. Plan Implementation
- Files or surfaces to modify: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/architecture/scanner-overrides.json`, generated status outputs, state/evidence files
- Logic: add route contract text plus matching `documents` relations, then rerun generators in strict sequence
- Edge cases: generated readback may collapse both controller and paired service rows once the route-level doc linkage is refreshed; `project-truth` must run after `app-completion`

### 4. Execute Implementation
- Implementation notes: updated the API bots runtime-read description, refreshed the trades classification row, and registered the matching relation in the canonical doc-link registries.

### 5. Verify and Test
- Validation performed: serial graph/app-completion/project-truth generation, strict graph drift audit, targeted `rg` readback for the scoped trades rows
- Result: pass; neither the controller nor the paired read-service row routes as `missing_doc_link`

### 6. Self-Review
- Simpler option considered: adding only the CSV/override relation without module-doc text
- Technical debt introduced: no
- Scalability assessment: follows the existing doc-link closure pattern used by prior scoped app-completion fixes
- Refinements made: kept the implementation minimal, then accepted the broader generated readback result when the paired read-service row cleared without extra code or doc expansion

### 7. Update Documentation and Knowledge
- Docs updated: yes
- Context updated: yes
- Learning journal updated: not applicable

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

- Task summary: closed the scoped runtime session trades doc-link gap across the module doc and canonical relation registries, then verified generated truth advanced to the next docs gap.
- Files changed: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/architecture/scanner-overrides.json`, generated docs/status outputs, state/evidence files.
- How tested: serial generator chain plus `pnpm run architecture:graph:drift:strict`, targeted readback searches, and source-control readback.
- What is incomplete: no remaining `listBotRuntimeSessionTrades` docs gap stays in the priority readback after refresh.
- Next steps: route the next first-gap docs closure from refreshed project truth, now `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts#registerAndLogin`.
- Decisions made: started from the controller source item named in project truth and accepted the paired read-service closure once refreshed truth removed both trades rows.
