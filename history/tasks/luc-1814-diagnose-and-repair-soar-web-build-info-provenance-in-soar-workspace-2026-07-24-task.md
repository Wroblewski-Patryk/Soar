# Task

## Header
- ID: LUC-1814
- Title: Diagnose and repair Soar web build-info provenance in Soar workspace
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: 09 EDL (Engineering Delivery Lead)
- Depends on: none
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not changed
- Quality Scenario Rows: deployment/release provenance
- Risk Rows: web build-info provenance regression
- Iteration: 2026-07-24 EDL heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1814-WEB-BUILD-INFO-PROVENANCE-2026-07-24
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through active project instructions and current state files.
- [x] `.agents/core/mission-control.md` was represented through active mission/state review.
- [x] Missing or template-like state tables were not bootstrapped because the affected ledgers already existed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: restore authoritative build-time Web provenance in the Soar workspace by making generated build metadata survive into the `.next` artifact tree.
- Release objective advanced: future Web runtime/build-info reads can stay on build-time metadata instead of falling back to diagnostic-only `env-runtime`.
- Included slices: diagnose current writer/route/wait-gate contract, patch Web production wrapper, add focused regression coverage, update project truth.
- Explicit exclusions: deploy, env mutation, protected runtime proof, release gate policy changes, source-control cleanup.
- Checkpoint cadence: one bounded heartbeat.
- Stop conditions: architecture mismatch, failing focused tests, or need for deploy approval.
- Handoff expectation: local fix closes the issue; future deploy/readback lane must confirm production reports non-diagnostic metadata.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, state/context files | task closure, source-of-truth updates | integrated closeout | focused tests + context sync | DONE |
| Architecture | Coordinator | existing build-info route + release scripts | `scripts/runWebNextProductionCommand.mjs` | architecture-aligned artifact propagation | code review of existing contract | DONE |
| Implementation | Coordinator fallback | Web production wrapper + tests | `scripts/runWebNextProductionCommand.mjs`, `scripts/runWebNextProductionCommand.test.mjs` | `.next/BUILD_META.json` sync after build | focused Node tests | DONE |
| QA/Test | Coordinator fallback | existing route/wait tests | focused test commands | regression proof | test pass logs | DONE |
| Documentation/Memory | Coordinator | project state/context | task packet + ledgers | durable trace | state update | DONE |

## Context

Existing Soar release logic intentionally treats `metadataSource=env-runtime` as
diagnostic-only. The workspace already generated `apps/web/.build-meta/BUILD_META.json`,
but the runtime route also checks `apps/web/.next/BUILD_META.json`. The Web
production wrapper wrote metadata before `next build` and did not sync it into
`.next`, so runtime provenance could regress to env fallback despite a valid
build-time metadata file being available during the build phase.

## Goal

Preserve authoritative build metadata into the Web build artifact tree so the
runtime build-info route can continue serving build-time provenance without
weakening the existing release gate.

## Success Signal
- User or operator problem: Web build-info provenance in the workspace can fall back to diagnostic-only runtime metadata.
- Expected product or reliability outcome: production build wrapper copies generated metadata into `.next` after a successful build.
- How success will be observed: focused wrapper tests pass and existing route/wait tests remain green.
- Post-launch learning needed: yes

## Deliverable For This Stage

Verified code and state updates that repair workspace build artifact
provenance and preserve the existing strict gate behavior.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Root cause of the workspace provenance drift is identified.
- [x] Web production build wrapper copies `BUILD_META.json` into `.next` after build.
- [x] Focused regression coverage proves the sync behavior and existing build-info contracts still pass.
- [x] Durable task/context trace is updated.

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
- Tests:
  - `node --test scripts/runWebNextProductionCommand.test.mjs` -> PASS (`8/8`).
  - `pnpm --filter web exec vitest run src/app/api/build-info/route.test.ts` -> PASS (`2/2`).
  - `node --test scripts/waitForWebBuildInfo.test.mjs` -> PASS (`8/8`).
- Manual checks:
  - confirmed `apps/web/.build-meta/BUILD_META.json` existed in workspace with `metadataSource=git`.
  - confirmed `apps/web/.next/BUILD_META.json` was missing before the fix path was added.
- Screenshots/logs: not applicable.
- High-risk checks: no deploy, no secret reads, no release gate weakening.
- Module confidence ledger updated: yes
- Module confidence rows closed or changed: SOAR-OPERATIONS-001
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: existing Web build-info route and release wait scripts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none required for this bounded wrapper fix.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: future Web build-info runtime can read authoritative metadata from `.next`
- Smoke steps updated: none
- Rollback note: revert the wrapper sync if it causes build artifact issues; no deploy occurred in this task
- Observability or alerting impact: release provenance should drift less often to `env-runtime`
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: workspace had `.build-meta/BUILD_META.json` but not `.next/BUILD_META.json`.
- Gaps: runtime route can search `.next`, but the build wrapper never populated that location.
- Inconsistencies: release gate treats `env-runtime` as non-authoritative while the build wrapper left a path that could trigger it.
- Architecture constraints: keep strict provenance acceptance (`env`, `git`, `git-files`) unchanged.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none required
- Sources scanned: build-info route/tests, metadata writer, wait gate, current state/context
- Rows created or corrected: task packet and context rows only
- Assumptions recorded: runtime route should keep existing metadata-source policy
- Blocking unknowns: none
- Why it was safe to continue: prior `LUC-4912` already recorded that `env-runtime` must remain diagnostic-only

### 2. Select One Priority Mission Objective
- Selected task: LUC-1814
- Priority rationale: direct reliability fix for release provenance in the touched workspace
- Why other candidates were deferred: no other lane was required to implement or prove this local artifact propagation fix

### 3. Plan Implementation
- Files or surfaces to modify: Web production wrapper and its unit tests
- Logic: generate build metadata before build, then copy it into `.next` after a successful Next build
- Edge cases: preserve fail-closed behavior if the build or copy step fails

### 4. Execute Implementation
- Implementation notes: added `syncBuildMetadataIntoNextOutput` to copy `.build-meta/BUILD_META.json` into `.next/BUILD_META.json`; invoked it only after successful `next build`; added explicit regression coverage

### 5. Verify and Test
- Validation performed: focused Node/Vitest test runs on wrapper, build-info route, and wait gate
- Result: PASS

### 6. Self-Review
- Simpler option considered: changing the route to accept runtime fallback as release-grade provenance; rejected because it would weaken the existing deployment gate
- Technical debt introduced: no
- Scalability assessment: low-risk, uses existing metadata file and artifact tree
- Refinements made: kept build/start command contract unchanged except for post-build metadata sync

### 7. Update Documentation and Knowledge
- Docs updated: task packet only
- Context updated: project state, task board, module confidence ledger
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

## Result Report

- Task summary: the Web production wrapper now promotes generated build metadata into `.next`, closing the workspace gap that could force `/api/build-info` onto diagnostic-only runtime provenance.
- Files changed: `scripts/runWebNextProductionCommand.mjs`, `scripts/runWebNextProductionCommand.test.mjs`, this task packet, and project context files.
- How tested: focused wrapper test, Web build-info route test, and deploy wait gate test.
- What is incomplete: no production build/deploy/readback happened in this task.
- Next steps: the next approved Web build or deploy lane should confirm `/api/build-info` reports the target SHA with `metadataSource=env`, `git`, or `git-files`, not `env-runtime`.
- Decisions made: keep `env-runtime` diagnostic-only; fix artifact propagation instead of weakening the gate.
