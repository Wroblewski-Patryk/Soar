# Task

## Header
- ID: LUC-1011
- Title: Prove Account access missing-doc-link for `registerAndLogin`
- Task Type: fix
- Current Stage: verification
- Status: VERIFIED
- Owner: Documentation Steward
- Depends on: none
- Priority: P1
- Module Confidence Rows: Account access / API bots subscription-entitlements docs truth
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion missing-doc-link routing for Account access entitlement auth helper
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1011-ACCOUNT-ACCESS-REGISTERANDLOGIN-DOC-LINK-2026-07-14
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
- Mission objective: close the docs-owned `missing_doc_link` routing for `registerAndLogin`.
- Release objective advanced: project truth now advances past the subscription-entitlements auth helper to the next real Account access proof gap.
- Included slices: module doc update, documentation-link registry update, scanner `documents` override, generated readback, evidence/state sync.
- Explicit exclusions: runtime code changes, new tests, deploy, push, protected smoke, secret/account reads, DB mutations.
- Checkpoint cadence: one source-of-truth edit checkpoint and one generator-readback checkpoint.
- Stop conditions: the scoped helper disappears from `missing_doc_link` routing or a generator mismatch is found.
- Handoff expectation: close with documentation evidence and explicit next routed gap.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, Paperclip wake | issue closure and integration | closeout packet | final readback | COMPLETE |
| Product/Requirements | coordinator | `docs/status/project-truth-index.md` | scoped Account access gap | scoped problem statement | generated readback | COMPLETE |
| Architecture | coordinator | `docs/modules/api-bots.md`, `documentation-links.csv`, `scanner-overrides.json` | docs relation truth | durable doc-link closure | generator chain | COMPLETE |
| Implementation | coordinator | docs/state only | no runtime code | source-of-truth edits | `git diff --check` | COMPLETE |
| QA/Test | coordinator | existing subscription-entitlements proof file | focused readback only | no new proof required | generator chain | COMPLETE |
| Security/Ops/UX | omitted | not applicable | none | none | none | OMITTED |
| Documentation/Memory | coordinator | task/evidence/context files | durable memory | evidence packet and state sync | file review | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`docs/status/project-truth-index.md` routed
`apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin`
as the first Account access `missing_doc_link` gap after
[LUC-1004](/LUC/issues/LUC-1004) closed the neighboring `seedTicker` helper on
2026-07-14. The helper already had executable coverage inside
`apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts`, but repo
truth did not yet document that auth bootstrap helper in the API bots module or
map the `documents` relation into the generated graph.

## Goal
Attach durable module documentation and graph relations for
`apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts#registerAndLogin`
so generated app-completion and project-truth no longer classify it as
`missing_doc_link`.

## Success Signal
- User or operator problem: the wake named a docs-owned Account access gap, not a runtime defect.
- Expected product or reliability outcome: future agents can reason about the subscription-entitlements auth bootstrap helper from canonical docs and skip this stale gap.
- How success will be observed: app-completion removes the helper from the priority `missing_doc_link` queue and project truth advances to `resolveAggregateSessionWindowEnd` as the next gap.
- Post-launch learning needed: no

## Deliverable For This Stage
A verified docs/evidence/state packet that closes the scoped doc-link gap and
records the next routed Account access gap.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `docs/modules/api-bots.md` explicitly documents the scoped helper contract.
- [x] `documentation-links.csv` and `scanner-overrides.json` contain the matching `documents` relation.
- [x] Generated app-completion and project-truth readback no longer route `registerAndLogin` as `missing_doc_link`.
- [x] Context and evidence files record the next routed gap and validation commands.

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
- Tests: generator chain; `pnpm run architecture:graph:drift:strict`
- Manual checks: targeted `rg` readback for scoped entities in `docs/status` outputs; `git diff --check`
- Screenshots/logs: `history/artifacts/luc-1011-build-architecture-awareness-log.txt`
- High-risk checks: not applicable
- Module confidence ledger updated: not applicable
- Module confidence rows closed or changed: none
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

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: documentation and generated status metadata only
- Trust boundaries: local repo docs plus generated graph/status indexes
- Permission or ownership checks: no runtime ownership logic changed; this lane only documented the already-tested entitlement auth helper boundary
- Abuse cases: not applicable
- Secret handling: no secret, cookie, token, credential, account, or protected runtime value was read or written
- Security tests or scans: not applicable
- Fail-closed behavior: not applicable to this docs-only closure
- Residual risk: adjacent Account access helper docs and proof gaps still remain after this slice

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: project truth first gap was `registerAndLogin` as `missing_doc_link`.
- Gaps: no durable doc relation existed for the helper in the subscription-entitlements pack.
- Inconsistencies: executable proof existed in the e2e file, docs relation did not.
- Architecture constraints: use canonical module docs and graph registries only.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: `AGENTS.md`, `.agents/core/project-memory-index.md`, `.agents/core/mission-control.md`, `.agents/workflows/responsibility-lanes.md`, `docs/status/project-truth-index.md`, `docs/status/app-completion-index.md`, `docs/modules/api-bots.md`, `documentation-links.csv`, `scanner-overrides.json`, `apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts`
- Rows created or corrected: scoped module-doc row plus matching `documents` relations
- Assumptions recorded: safe to treat the helper as docs-owned because the entitlement e2e proof already existed and the wake named only a missing doc link
- Blocking unknowns: none
- Why it was safe to continue: current proof stayed local and the closure pattern matches prior DSM account-access slices

### 2. Select One Priority Mission Objective
- Selected task: close the `registerAndLogin` doc-link routing
- Priority rationale: first Account access project-truth gap and direct wake scope
- Why other candidates were deferred: `resolveAggregateSessionWindowEnd` and the remaining helper gaps belong to later routed slices

### 3. Plan Implementation
- Files or surfaces to modify: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/architecture/scanner-overrides.json`, generated status outputs, state/evidence files
- Logic: add helper contract text plus matching `documents` relations, then rerun the generator chain in sequence
- Edge cases: avoid claiming runtime behavior changes or expanding into adjacent helper closures

### 4. Execute Implementation
- Implementation notes: documented the subscription-entitlements auth bootstrap helper in the API bots module, added the matching CSV relation, and added the scanner `documents` override.

### 5. Verify and Test
- Validation performed: architecture-awareness rebuild, app-completion rebuild, project-truth rebuild, strict graph drift audit, targeted readback search, `git diff --check`
- Result: pass; app-completion no longer routes the helper, and project truth advanced to `apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd` as the next Account access gap

### 6. Self-Review
- Simpler option considered: adding only a CSV row without module-doc text
- Technical debt introduced: no
- Scalability assessment: follows the existing narrow docs-gap closure pattern for app-completion burn-down
- Refinements made: reused the redirected-log builder pattern already proven in the neighboring helper closures

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

- Task summary: closed the docs-owned `registerAndLogin` gap across the module doc and canonical relation registries, then verified generated truth advanced to the next Account access proof gap.
- Files changed: `docs/modules/api-bots.md`, `docs/architecture/relations/documentation-links.csv`, `docs/architecture/scanner-overrides.json`, generated `docs/graphs/*` and `docs/status/*`, state/evidence files.
- How tested: architecture-awareness rebuild with redirected log, app-completion rebuild, project-truth rebuild, `pnpm run architecture:graph:drift:strict`, targeted readback search, `git diff --check`.
- What is incomplete: the next Account access gap remains open as a separate follow-up outside this issue.
- Next steps: route `apps/api/src/modules/bots/runtimeMonitoringAggregateFallbacks.service.ts#resolveAggregateSessionWindowEnd` to Test Automation Engineer + QA Regression Lead for the focused `missing_test_link` closure.
- Decisions made: kept the slice scoped to the wake-target helper only and did not opportunistically close adjacent helpers.
