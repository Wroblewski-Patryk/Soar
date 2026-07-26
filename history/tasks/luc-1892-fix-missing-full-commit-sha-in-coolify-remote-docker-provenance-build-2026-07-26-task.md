# Task

## Header
- ID: LUC-1892
- Title: Fix missing full commit SHA in Coolify remote Docker provenance build for `soar-api`
- Task Type: fix
- Current Stage: implementation
- Status: BLOCKED
- Owner: Backend Builder
- Depends on: LUC-1887
- Priority: P0
- Module Confidence Rows: release identity / API image provenance
- Requirement Rows: release provenance must stay fail-closed and report the exact 40-character image SHA
- Quality Scenario Rows: deployment readiness / release traceability
- Risk Rows: stale or truncated deploy provenance
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1892
- Mission Status: PARTIALLY_VERIFIED

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
- Mission objective: finish the backend/source-build repair now that `LUC-1893` proved the remaining production blocker still occurs after the Coolify app flag was repaired and the full SHA is already injected upstream.
- Release objective advanced: preserve the injected Coolify `SOURCE_COMMIT` through stage inheritance instead of clearing it with a later build-stage bare `ARG` redeclaration.
- Included slices: DRE contrary-proof review, API Dockerfile ARG-layout fix, focused regression test, docs/task/evidence update, focused validation.
- Explicit exclusions: no worker/web logic changes, no DB/runtime mutation, no Coolify mutation from this runner.
- Checkpoint cadence: one implementation checkpoint, one verification checkpoint.
- Stop conditions: verification fails, architecture mismatch appears, or commit/push/deploy boundary is not legal from this runner.
- Handoff expectation: release/Ops owner resumes from this verified backend patch on a clean, bound runner.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, project state | Issue closure, project truth | Task/evidence packet, final disposition | Issue closeout | DONE |
| Implementation | Backend Builder | `apps/api` provenance path | `apps/api/scripts/writeApiSourceCommit.*` | Source fix and regression test | `node --test`, focused vitest | DONE |
| QA/Test | Backend Builder | release identity tests | focused API checks | proof of exact fallback case | targeted tests | DONE |
| Documentation/Memory | Active chat | `.codex/context/*`, `history/*` | task/evidence packet, state notes | durable trace | file readback | DONE |
| Coolify/Deploy | Follow-up owner | `docs/operations/coolify-linux-vps-setup-guide.md`, LUC-1887 | `soar-api` application metadata and deploy settings | redeploy proof on fixed backend commit | Coolify metadata + single-app deploy proof | BLOCKED |

## Context
`LUC-1887` provided the exact remote Docker failure line for `soar-api`: the build reached `node apps/api/scripts/writeApiSourceCommit.mjs`, but the script still failed closed with `missing full SOURCE_COMMIT...` during Coolify remote build for target `adc82a154c9023256e454accfb4edda2d3f0a378`.

## Goal
Implement the remaining backend/source-build fix so the API Docker layout preserves the injected `SOURCE_COMMIT` in the real Coolify remote Docker build context.

## Success Signal
- User or operator problem: Coolify remote Docker build still fails before API image build completes, and the exact DRE proof now shows the full SHA is injected upstream but cleared by our later Dockerfile layout.
- Expected product or reliability outcome: the API build stage now inherits the injected provenance args from an ancestor stage instead of resetting them.
- How success will be observed: focused provenance regression still passes and a Dockerfile-layout regression test proves the build stage no longer redeclares the same bare provenance args.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified backend source/build patch, retained regression proof, added a Dockerfile-layout regression test, and left durable evidence that the next required action is one exact redeploy on the new backend commit.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `writeApiSourceCommit.mjs` checks all candidate SHA envs until it finds a full 40-character commit.
- [x] Focused regression covers `short SOURCE_COMMIT + full COOLIFY_GIT_COMMIT_SHA`.
- [x] API Docker provenance `ARG` names are consumed in an ancestor stage and not redeclared bare in the `build` stage.
- [x] Focused regression proves the Dockerfile layout no longer allows the later bare `ARG` redeclaration pattern.
- [x] Task and evidence state that the earlier writer hardening and `.git` fallback alone were not the root fix for the observed Coolify failure.
- [ ] Exact `soar-api` redeploy proof on the new backend commit is recorded.

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
- Tests: `node --check apps/api/scripts/apiDockerfileProvenanceLayout.test.mjs`; `node --test apps/api/scripts/apiDockerfileProvenanceLayout.test.mjs`; `node --check apps/api/scripts/writeApiSourceCommit.mjs`; `node --check apps/api/scripts/writeApiSourceCommit.test.mjs`; `node --test apps/api/scripts/writeApiSourceCommit.test.mjs`; `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts`
- Manual checks: compared the DRE contrary proof against `apps/api/Dockerfile`, `.dockerignore`, and the existing `git-files` fallback in `writeApiSourceCommit.mjs`; re-read `docs/operations/coolify-linux-vps-setup-guide.md` for the `SOURCE_COMMIT` contract.
- Screenshots/logs: exact failure line captured in issue description and mirrored in evidence packet.
- High-risk checks: not applicable; no runtime mutation performed.
- Module confidence ledger updated: not applicable
- Module confidence rows closed or changed: none
- Requirements matrix updated: not applicable
- Requirement rows closed or changed: none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed: none
- Risk register updated: not applicable
- Risk rows closed or changed: none
- Reality status: backend source/build fix implemented and regression-guarded; redeploy proof still pending on release owner

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/assistant-runtime-contract.md`, `docs/operations/coolify-linux-vps-setup-guide.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low in backend code; requires one exact `soar-api` redeploy to verify
- Env or secret changes: none
- Health-check impact: no health contract change
- Smoke steps updated: no
- Rollback note: revert the API Dockerfile ancestor-stage ARG layout change and its focused regression test together if this provenance path must be backed out
- Observability or alerting impact: none
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: remote Docker build still failed after the DRE repaired `include_source_commit_in_build=true`, and the exact DRE readback showed the full `SOURCE_COMMIT` was injected upstream before the repository Dockerfile cleared it.
- Gaps: the writer hardening and `.git` fallback were useful guards, but the actual production blocker was the later build-stage bare `ARG` redeclaration pattern.
- Inconsistencies: the repo task narrative had temporarily overfit to the `.git` fallback theory before the exact contrary Dockerfile-transformation proof arrived from DRE.
- Architecture constraints: release identity must remain exact and fail-closed.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none
- Sources scanned: AGENTS.md, `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`, `apps/api/scripts/writeApiSourceCommit.*`, `apps/api/Dockerfile`, `docs/operations/coolify-linux-vps-setup-guide.md`
- Rows created or corrected: task/evidence packet only
- Assumptions recorded: Coolify can inject the full SHA before repository instructions run, so the Dockerfile must preserve inherited provenance args across stages instead of relying on a same-stage redeclaration.
- Blocking unknowns: commit/push/deploy rights from this runner
- Why it was safe to continue: the backend-owned Dockerfile layout change is local, minimal, and directly implied by the exact DRE Dockerfile-transformation proof.

### 2. Select One Priority Mission Objective
- Selected task: LUC-1892 API Docker ARG-layout repair
- Priority rationale: the new board comment supplied exact contrary production proof that invalidated the previous root-cause direction and pointed to a narrower backend fix
- Why other candidates were deferred: the production retry cannot succeed until this exact API Docker build gap is fixed

### 3. Plan Implementation
- Files or surfaces to modify: `apps/api/Dockerfile`, `apps/api/scripts/apiDockerfileProvenanceLayout.test.mjs`, `docs/operations/coolify-linux-vps-setup-guide.md`, `history/tasks/...`, `history/evidence/...`, `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`
- Logic: consume provenance args in an ancestor stage and remove the later build-stage bare redeclaration so Coolify-injected values survive into `writeApiSourceCommit.mjs`
- Edge cases: short `SOURCE_COMMIT`, empty `SOURCE_COMMIT`, absent envs, stage inheritance, plain local `--build-arg` usage, no `.git` paths in runtime image

### 4. Execute Implementation
- Implementation notes: moved provenance `ARG` consumption to the `base` stage, removed the build-stage bare redeclarations, and added a focused Dockerfile-layout regression test

### 5. Verify and Test
- Validation performed: ran the new Dockerfile-layout regression test, reused the targeted provenance tests, confirmed the remote Dockerfile has no `.git` copy dependency, and read back the API Dockerfile/doc changes
- Result: PASS for the backend provenance checks; issue remains blocked only for downstream commit/redeploy proof

### 6. Self-Review
- Simpler option considered: keep the previous `.git` fallback theory and ask DRE to retry again
- Technical debt introduced: no
- Scalability assessment: the writer hardening still improves future env-ordering resilience, the `.git` fallback remains a safe secondary path, and the new layout regression test guards the exact Coolify transform failure mode that just occurred.
- Refinements made: kept the Dockerfile scope narrow by removing only the problematic build-stage bare `ARG` redeclarations and leaving runtime-stage `.git` exclusion intact

### 7. Update Documentation and Knowledge
- Docs updated: `history/tasks/...`, `history/evidence/...`, `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`
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
