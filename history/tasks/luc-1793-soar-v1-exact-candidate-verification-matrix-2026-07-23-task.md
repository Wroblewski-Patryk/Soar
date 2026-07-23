# Task

## Header
- ID: LUC-1793
- Title: [Soar][QA] Build exact-candidate v1.0 sale-readiness verification matrix
- Task Type: release
- Current Stage: planning
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-1787, LUC-1791, LUC-1792, LUC-4103
- Priority: P0
- Module Confidence Rows: SOAR release confidence / sale-readiness governance
- Requirement Rows: release provenance; protected acceptance proof; supportability truth; owner acceptance
- Quality Scenario Rows: reliability; supportability; rollback readiness; security/privacy
- Risk Rows: release overclaim; source/deploy parity drift; stale protected proof
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1793-2026-07-23-QA-MATRIX
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
- Mission objective: publish one exact-candidate QA verification matrix for the Soar v1.0 sale-readiness contract.
- Release objective advanced: convert `SRG-002` into an execution-ready QA packet that can be run against the approved deployed candidate SHA without redefining scope at smoke time.
- Included slices: contract readback, release/provenance evidence readback, smoke/runbook alignment, verification matrix authoring, source-of-truth sync.
- Explicit exclusions: push, deploy, production proof execution, owner-login execution, secret readback, env mutation, code implementation.
- Checkpoint cadence: one bounded documentation heartbeat.
- Stop conditions: architecture mismatch, missing exact-candidate contract references, or need to redefine owner-login policy.
- Handoff expectation: release lane deploys exact candidate; QA/Security rerun matrix after approved deploy and selected owner-login path.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | Wake payload, `AGENTS.md`, project state, sale-readiness contract | Task packet, issue closeout, source-of-truth sync | Integrated QA lane output | Focused repo readback | DONE |
| Product/Requirements | Existing contract owner | `docs/planning/soar-v1-sale-readiness-contract.md`, `history/evidence/luc-1787-soar-v1-sale-readiness-gap-register-2026-07-23.md` | Contract gates reused as QA rows | Stable contract input | Requirements readback | DONE |
| Architecture | Coordinator | Release/smoke runbooks and API route docs | No architecture change | Architecture fit confirmation | Doc alignment check | DONE |
| Implementation | QA/Test | `history/evidence/luc-1793-soar-v1-exact-candidate-verification-matrix-2026-07-23.md` | Verification matrix artifact | Inspectable matrix | Targeted readback | DONE |
| QA/Test | QA/Test | Smoke/rollback/observability docs | Acceptance rerun order and PASS/FAIL criteria | Exact-candidate proof path | Checklist alignment | DONE |
| Security/Ops/UX | Follow-up lanes | `LUC-1791`, `LUC-1792`, `LUC-4103` | None in this task | Dependency boundary preserved | No overclaim | DONE |
| Documentation/Memory | Coordinator | `.codex/context/*`, `.agents/state/*` | Top-of-file state refresh | Durable repo truth | Focused diff/readback | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1787` established Soar's v1.0 sale-readiness contract and deduplicated gap register on Thursday, July 23, 2026. `SRG-002` specifically requires QA to translate that contract into an exact-candidate verification matrix so the approved candidate SHA can be proven after deploy without relying on adjacent historical smoke.

## Goal
Produce one canonical QA packet that defines what must be re-run, in which order, against which SHA, with which evidence and dependency gates, before Soar can claim v1.0 sale-readiness for the exact candidate.

## Success Signal
- User or operator problem: sale-readiness says "rerun QA" but does not yet freeze the exact proof scope/order for the unreleased candidate.
- Expected product or reliability outcome: release, QA, and security lanes share one fail-closed verification matrix bound to the exact candidate SHA.
- How success will be observed: a durable packet exists under `history/evidence/` and repo state points future lanes to it.
- Post-launch learning needed: yes

## Deliverable For This Stage
One planning-stage verification matrix and acceptance rerun packet for `SRG-002`, plus synchronized project-state references.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] One exact-candidate QA verification matrix is published under `history/evidence/`.
- [x] The packet binds scope to candidate SHA `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa` and distinguishes pre-deploy from post-deploy gates.
- [x] Project source-of-truth files point follow-up lanes to the matrix without claiming proof execution.

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
- Tests: none; documentation-only lane
- Manual checks: targeted `Get-Content` / `rg` readback of contract, gap register, smoke checklist, release provenance packets, and state files
- Screenshots/logs: not applicable
- High-risk checks: preserved exact-candidate fail-closed wording; did not claim deploy/protected proof without execution
- Module confidence ledger updated: no
- Module confidence rows closed or changed: none
- Requirements matrix updated: no
- Requirement rows closed or changed: none
- Quality scenarios updated: no
- Quality scenario rows closed or changed: none
- Risk register updated: no
- Risk rows closed or changed: none
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/planning/soar-v1-sale-readiness-contract.md`, `docs/operations/post-deploy-smoke-checklist.md`, `docs/operations/deployment-rollback-playbook.md`, `docs/operations/service-reliability-and-observability.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: existing QA packet structure
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Input-mode checks: touch | pointer | keyboard
- Accessibility checks: documented as required follow-up proof, not executed here
- Parity evidence: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no; existing smoke runbook reused
- Rollback note: matrix points to existing rollback playbook
- Observability or alerting impact: none
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `SRG-002` lacked an execution-ready exact-candidate QA matrix.
- Gaps: contract and gap register named the lane but did not freeze its detailed proof order.
- Inconsistencies: current green runtime proof belongs to deployed SHA `b0b2c2ce...`, not local candidate `40cfb8f2...`.
- Architecture constraints: release claims must bind to the exact deployed candidate and approved protected routes.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none needed for this lane
- Sources scanned: sale-readiness contract, gap register, release-parity packets, smoke/rollback/observability docs, task template, current state files
- Rows created or corrected: top-of-file `TASK_BOARD`, `PROJECT_STATE`, `active-mission`, and `next-steps` entries for `LUC-1793`
- Assumptions recorded: exact candidate remains `40cfb8f2...`; owner-login boundary remains `LUC-4103`
- Blocking unknowns: deploy approval timing and owner-login method selection remain outside this task
- Why it was safe to continue: task scope is documentation/planning for already-approved follow-up lane

### 2. Select One Priority Mission Objective
- Selected task: build the exact-candidate sale-readiness verification matrix
- Priority rationale: `SRG-002` is a first-class blocker for truthful v1.0 readiness claims
- Why other candidates were deferred: release parity and owner-login execution belong to `LUC-1791` and `LUC-1792` / `LUC-4103`

### 3. Plan Implementation
- Files or surfaces to modify: one task file, one evidence packet, four source-of-truth ledgers
- Logic: convert contract gates into executable QA phases with pass/fail exits and dependency boundaries
- Edge cases: prevent historical production proof from being reused for unreleased SHA; keep protected routes and owner-login separate

### 4. Execute Implementation
- Implementation notes: published an evidence packet with pre-deploy, post-deploy public, protected, acceptance, supportability, and closeout gates bound to exact candidate SHA `40cfb8f2...`

### 5. Verify and Test
- Validation performed: targeted repo readback of referenced docs, scripts, routes, and state files
- Result: packet aligns with current contract and release blocker wording

### 6. Self-Review
- Simpler option considered: a short checklist in an issue comment
- Technical debt introduced: no
- Scalability assessment: packet can be reused for future exact-candidate reruns by swapping SHA/date
- Refinements made: separated gates by dependency and execution time so release/protected/owner lanes do not overclaim each other

### 7. Update Documentation and Knowledge
- Docs updated: `history/tasks/luc-1793-soar-v1-exact-candidate-verification-matrix-2026-07-23-task.md`, `history/evidence/luc-1793-soar-v1-exact-candidate-verification-matrix-2026-07-23.md`
- Context updated: `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`, `.agents/state/active-mission.md`, `.agents/state/next-steps.md`
- Learning journal updated: not applicable.

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
