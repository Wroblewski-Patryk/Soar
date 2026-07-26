# Task

## Header
- ID: LUC-1890
- Title: Diagnose repeated failed `soar-api` deployment for SHA `7742e5b73`
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: production redeploy of a commit containing this backend hardening
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not changed
- Quality Scenario Rows: deployment/release provenance
- Risk Rows: production-release-drift
- Iteration: 2026-07-26-04
- Operation Mode: BUILDER
- Mission ID: LUC-1890-soar-api-repeated-deploy-failure
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository
      sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or
      marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective:
  diagnose why the repaired `soar-api` deployment for target SHA
  `7742e5b73d89fff0f037b264b96acc0a7f863a9f` still fails and apply the
  smallest backend-owned hardening.
- Release objective advanced:
  narrows the release blocker from generic backend packaging ambiguity to one
  updated source-controlled API image contract ready for redeploy proof.
- Included slices:
  read exact Paperclip issue context, inspect current API Docker provenance
  path, repair builder-context fragility, add focused regression proof, update
  durable repo truth.
- Explicit exclusions:
  no push, deploy, rollback, env edit, DB mutation, Redis mutation, or runtime
  mutation.
- Checkpoint cadence:
  one bounded backend repair heartbeat.
- Stop conditions:
  backend-owned repeat deploy fragility identified and locally verified, or a
  non-backend blocker is proven.
- Handoff expectation:
  release owner redeploys `soar-api` on the updated commit and reruns
  `LUC-1887` production proof.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, wake payload, `LUC-1889` packet | task closure, issue evidence, repo truth | integrated backend packet | focused checks + issue closeout | DONE |
| Architecture | Coordinator | API release identity contract, deploy docs | `apps/api/Dockerfile` | architecture-aligned hardening | code review against existing contract | DONE |
| Implementation | Coordinator | API build provenance path | `apps/api/Dockerfile`, `apps/api/scripts/writeApiSourceCommit.test.mjs` | minimal backend fix | node tests + release identity tests | DONE |
| QA/Test | Coordinator fallback | existing targeted tests | focused validation commands | regression proof | passing checks | DONE |
| Documentation/Memory | Coordinator | `.codex/context/*`, history packet | task/evidence/context files | durable trace | file review | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this
      is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1889` disproved queue/readback ownership by showing one exact
application-scoped `soar-api` deploy for SHA `7742e5b73...` remained readable
and still finished `failed`. That moved ownership back to backend
source/build/runtime packaging.

## Goal
Remove the remaining backend-owned deploy fragility without weakening the
fail-closed API release identity contract.

## Success Signal
- User or operator problem:
  repaired production `soar-api` deploy still fails on the new target SHA.
- Expected product or reliability outcome:
  the API image build no longer hard-requires `.git` files in the Docker build
  context before it can consume explicit deploy SHA inputs.
- How success will be observed:
  targeted tests pass and the Dockerfile now forwards explicit deploy SHA args
  directly to the source-commit writer without mandatory `.git` `COPY` steps.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified code and evidence that harden the API image provenance path and leave
an exact redeploy handoff.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Repeated backend-owned deploy fragility is identified.
- [x] Smallest source-controlled API build hardening is implemented.
- [x] Focused regression proof and durable repo evidence are updated.

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
  - `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS
  - `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS
  - `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`4/4`)
  - `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts` -> PASS (`4/4`)
- Manual checks:
  - verified from live `LUC-1890` heartbeat context that deployment
    `kmpm887pdgo48b8l5j13q5cw` for commit `7742e5b73...` is the repeated exact
    failed deploy
  - inspected `apps/api/Dockerfile` and confirmed the `.git` `COPY` steps were
    still a hard prerequisite before the provenance writer ran
  - inspected `docs/operations/coolify-linux-vps-setup-guide.md` and confirmed
    Coolify build identity should be forwarded by explicit build args
- Screenshots/logs:
  none
- High-risk checks:
  no production mutation was performed in this backend lane
- Module confidence ledger updated: not applicable
- Module confidence rows closed or changed:
  not applicable
- Requirements matrix updated: not applicable
- Requirement rows closed or changed:
  none
- Quality scenarios updated: not applicable
- Quality scenario rows closed or changed:
  none
- Risk register updated: not applicable
- Risk rows closed or changed:
  none
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  existing API release-identity contract and
  `docs/operations/coolify-linux-vps-setup-guide.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none required for this bounded repair

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes:
  none
- Health-check impact:
  future API images can consume explicit deploy SHA args without requiring
  `.git` files as a mandatory Docker build input
- Smoke steps updated:
  no
- Rollback note:
  revert the Dockerfile hardening if a later deploy proves regression; no
  deploy occurred in this task
- Observability or alerting impact:
  narrows future failed API deploys away from builder-context `.git`
  assumptions
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  the exact repaired `soar-api` deploy still failed on SHA `7742e5b73...`
- Gaps:
  previous fix addressed missing build-arg-only provenance, but not the
  Dockerfile's hard dependency on `.git` `COPY` steps
- Inconsistencies:
  the source-commit writer supported env-first provenance, yet the Dockerfile
  still forced `.git` inputs before the script could run
- Architecture constraints:
  preserve image-baked exact SHA and fail-closed behavior

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required
- Sources scanned:
  live `LUC-1890` heartbeat context, `LUC-1889` evidence/task packet,
  `apps/api/Dockerfile`, `apps/api/scripts/writeApiSourceCommit.mjs`,
  `docs/operations/coolify-linux-vps-setup-guide.md`
- Rows created or corrected:
  this task/evidence packet and `.codex/context/*` updates
- Assumptions recorded:
  the repeated failure remains backend-owned because the deployment row is
  already proven readable and terminal `failed`
- Blocking unknowns:
  final production redeploy proof remains external to this backend lane
- Why it was safe to continue:
  only local source/build wiring was changed and validated with focused tests

### 2. Select One Priority Mission Objective
- Selected task:
  remove the repeated backend-owned `soar-api` deploy fragility
- Priority rationale:
  this is on the blocked critical production release path
- Why other candidates were deferred:
  queue/readback ownership was already disproven and broader ops action would
  have been speculative

### 3. Plan Implementation
- Files or surfaces to modify:
  `apps/api/Dockerfile`,
  `apps/api/scripts/writeApiSourceCommit.test.mjs`,
  history/context evidence files
- Logic:
  make Docker invoke the provenance writer with explicit deploy SHA args and
  stop hard-copying `.git` files into the build stage
- Edge cases:
  keep `.git` fallback behavior for non-Docker contexts and fail closed when no
  valid exact SHA exists

### 4. Execute Implementation
- Implementation notes:
  removed `.git` `COPY` lines from API Dockerfile, forwarded build args
  explicitly to the writer script, and added a focused regression test for
  `COOLIFY_GIT_COMMIT_SHA`

### 5. Verify and Test
- Validation performed:
  focused Node syntax checks, source-commit writer tests, and release identity
  tests
- Result:
  all focused checks passed

### 6. Self-Review
- Simpler option considered:
  only remove the `.git` `COPY` lines; rejected because explicit build-arg
  forwarding keeps the deploy contract unambiguous
- Technical debt introduced: no
- Scalability assessment:
  the fix narrows the API Docker provenance path without adding a new build
  system or runtime contract
- Refinements made:
  added targeted regression proof for Coolify SHA input

### 7. Update Documentation and Knowledge
- Docs updated:
  `history/evidence/luc-1890-soar-api-repeated-deploy-failure-diagnosis-and-hardening-2026-07-26.md`,
  `history/tasks/luc-1890-diagnose-repeated-soar-api-deploy-failure-2026-07-26-task.md`
- Context updated:
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`
- Learning journal updated: yes

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
