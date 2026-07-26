# Task

## Header
- ID: LUC-1888
- Title: Diagnose and repair failed `soar-api` deployment for SHA `9b4fa63a3`
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: production redeploy of a commit containing the API image provenance repair
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not changed
- Quality Scenario Rows: deployment/release provenance
- Risk Rows: production-release-drift
- Iteration: 2026-07-26-02
- Operation Mode: BUILDER
- Mission ID: LUC-1888-soar-api-deploy-failure
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
- Mission objective:
  diagnose why the production `soar-api` deployment for target SHA
  `9b4fa63a35fa7f62c14d66b55721939c9fdf4950` failed and repair the owned
  backend image contract without weakening release attestation.
- Release objective advanced:
  converts the failure from a generic Coolify deploy blocker into a
  source-controlled API image fix ready for redeploy.
- Included slices:
  inspect the failed release packet, audit API Docker build provenance wiring,
  implement a fail-closed fallback from build args to minimal `.git` files,
  add focused regression coverage, update durable repo truth.
- Explicit exclusions:
  no push, deploy, rollback, env edit, database mutation, Redis mutation,
  account mutation, or protected production smoke.
- Checkpoint cadence:
  one bounded backend repair heartbeat.
- Stop conditions:
  root cause identified and locally verified, or architecture mismatch found.
- Handoff expectation:
  Ops/Release or the release owner redeploys a commit containing this fix and
  reruns the exact production proof set from `LUC-1887`.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, Paperclip wake, `LUC-1887` packet | task closure, source-of-truth updates | integrated fix packet | focused tests + evidence | DONE |
| Architecture | Coordinator | release-identity contract, deploy docs | `apps/api/Dockerfile`, API build provenance flow | architecture-aligned fallback | code review against existing contract | DONE |
| Implementation | Coordinator | API Docker/runtime build path | `apps/api/Dockerfile`, `apps/api/scripts/writeApiSourceCommit*` | fail-closed image provenance fallback | Node tests + release-identity tests | DONE |
| QA/Test | Coordinator fallback | existing release-identity tests | focused validation commands | regression proof | test passes | DONE |
| Documentation/Memory | Coordinator | `.codex/context/*`, history packet | task/evidence/context files | durable trace | file diff review | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1887` proved that production Web already exposed target SHA `9b4fa63a3`,
while `soar-api` remained on old SHA `9d1801d9b` and a dedicated
single-resource Coolify deploy later reached terminal `status=failed`. The
backend lane owns the API image contract and must repair repo truth if the
failure is caused by the Soar source/build path rather than by dependency or
credential denial.

## Goal
Repair the API image provenance path so `soar-api` can still bake an exact
full SHA into the image when `SOURCE_COMMIT` build args are absent, while
remaining fail-closed if neither build args nor minimal `.git` metadata are
available.

## Success Signal
- User or operator problem:
  the `soar-api` target deployment fails before production can move off the old
  image SHA.
- Expected product or reliability outcome:
  the API image no longer depends on one fragile build-arg path for release
  identity, but still embeds a verified exact SHA.
- How success will be observed:
  focused script and release-identity tests pass, and the Dockerfile now writes
  `SOURCE_COMMIT` from env or `.git` fallback into the runtime image.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified code and evidence that repair the API image provenance contract in the
workspace and leave a precise redeploy handoff.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Root cause of the API deploy failure is identified in owned source/build wiring.
- [x] API Docker build resolves a full source SHA from `SOURCE_COMMIT` or minimal `.git` files and still fails closed when neither exists.
- [x] Focused regression coverage passes and durable repo truth is updated.

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
  - `node --check apps/api/scripts/writeApiSourceCommit.mjs` -> PASS.
  - `node --check apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS.
  - `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`3/3`).
  - `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts` -> PASS (`4/4`).
- Manual checks:
  - inspected `history/evidence/luc-1887-complete-pushed-sha-9b4fa63a3-deployment-and-production-proof-2026-07-26.md`;
  - confirmed `apps/api/Dockerfile` previously aborted runtime image creation when no full `SOURCE_COMMIT` build arg was present;
  - confirmed `.dockerignore` already permits `.git/HEAD` and `.git/refs`, enabling a bounded build-time fallback.
- Screenshots/logs:
  none.
- High-risk checks:
  no production mutation was performed in this backend repair lane.
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
  existing API release-identity contract, `docs/operations/coolify-linux-vps-setup-guide.md`, and `LUC-1739` verification evidence.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none required for this bounded repair.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes:
  none
- Health-check impact:
  future `soar-api` images can still expose `release.gitSha` even when Coolify
  does not inject the exact build arg path.
- Smoke steps updated:
  no
- Rollback note:
  revert the API provenance writer/fallback if it causes build regressions; no
  deploy occurred in this task.
- Observability or alerting impact:
  narrows future API deploy failures away from missing build-arg provenance.
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  dedicated `soar-api` deployment for `9b4fa63a3` failed while old API runtime
  and core dependencies remained healthy.
- Gaps:
  deployment metadata proved failure ownership, but not the build-stage cause.
- Inconsistencies:
  Web already had a `.git`-file-aware provenance fallback, while API required a
  full `SOURCE_COMMIT` build arg only.
- Architecture constraints:
  keep API release identity image-baked and fail-closed; do not weaken the
  health/readiness contract to accept unknown provenance.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required
- Sources scanned:
  `LUC-1887` evidence/task packet, `apps/api/Dockerfile`,
  `apps/api/src/lib/releaseIdentity.ts`, `.dockerignore`, Web provenance task
  history.
- Rows created or corrected:
  this task/evidence packet and `.codex/context/*` entries.
- Assumptions recorded:
  the failed deployment is caused by API image provenance wiring, not by DB or
  Redis startup, because old runtime and dependencies remained healthy and only
  the target deployment failed.
- Blocking unknowns:
  final production proof must still come from a redeploy.
- Why it was safe to continue:
  the lane changed only local source/build code and ran focused local tests.

### 2. Select One Priority Mission Objective
- Selected task:
  repair the API image provenance build path behind `LUC-1888`.
- Priority rationale:
  this is the smallest Soar-owned slice that can directly unblock the failed
  `soar-api` deployment.
- Why other candidates were deferred:
  deploy/release mutation belongs to the follow-up operational heartbeat after
  source repair is ready.

### 3. Plan Implementation
- Files or surfaces to modify:
  `apps/api/Dockerfile`,
  `apps/api/scripts/writeApiSourceCommit.mjs`,
  `apps/api/scripts/writeApiSourceCommit.test.mjs`.
- Logic:
  resolve a full SHA from build args first, then `.git/HEAD` plus `.git/refs`,
  write it into a build artifact, and copy only that artifact into the runtime
  image.
- Edge cases:
  invalid abbreviated SHAs, missing `.git` fallback, and keeping runtime free
  of raw `.git` contents.

### 4. Execute Implementation
- Implementation notes:
  added `writeApiSourceCommit.mjs`; copied minimal `.git` files into the build
  stage only; generated `.build-meta/SOURCE_COMMIT`; and changed the runtime
  stage to copy the generated file into `/etc/soar-source-commit` instead of
  validating only build args in-place.

### 5. Verify and Test
- Validation performed:
  focused syntax checks, new Node tests for env/git-file/missing-source paths,
  and existing API release-identity Vitest coverage.
- Result:
  PASS.

### 6. Self-Review
- Simpler option considered:
  remove the strict `SOURCE_COMMIT` requirement and allow unknown runtime
  provenance.
- Technical debt introduced: no
- Scalability assessment:
  low-risk and aligned with the existing Web provenance fallback pattern.
- Refinements made:
  copied only one generated source-commit artifact into runtime instead of raw
  `.git` metadata.

### 7. Update Documentation and Knowledge
- Docs updated:
  `history/tasks/luc-1888-diagnose-and-repair-soar-api-deploy-failure-2026-07-26-task.md`,
  `history/evidence/luc-1888-soar-api-deploy-failure-root-cause-and-repair-2026-07-26.md`.
- Context updated:
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/LEARNING_JOURNAL.md`.
- Learning journal updated: yes.

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
- Task summary:
  repaired the API image provenance path so `soar-api` can derive a valid exact
  SHA from `SOURCE_COMMIT` or minimal `.git` refs during build, instead of
  failing whenever Coolify omits the explicit build arg.
- Files changed:
  `apps/api/Dockerfile`,
  `apps/api/scripts/writeApiSourceCommit.mjs`,
  `apps/api/scripts/writeApiSourceCommit.test.mjs`,
  the `LUC-1888` task/evidence packet, and `.codex/context/*`.
- How tested:
  focused Node checks/tests plus existing release-identity Vitest coverage.
- What is incomplete:
  no local Docker image build ran because Docker Desktop is unavailable on this
  runner, and no production redeploy/readback happened in this heartbeat.
- Next steps:
  push a commit containing this fix, redeploy `soar-api`, then rerun the exact
  public/Coolify proof set from `LUC-1887`.
- Decisions made:
  keep fail-closed API release attestation; add the same class of bounded
  `.git` fallback already accepted for Web provenance rather than weakening the
  contract.
