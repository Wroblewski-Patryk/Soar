# Task

## Header
- ID: LUC-1891
- Title: Repair `writeApiSourceCommit` path anchoring and hand off `soar-api` redeploy retry for SHA `7742e5b73`
- Task Type: fix
- Current Stage: verification
- Status: REVIEW
- Owner: Backend Builder
- Depends on: one exact `soar-api` redeploy by the release/Ops owner after this source fix lands on the deployable commit
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not changed
- Quality Scenario Rows: deployment/release provenance
- Risk Rows: production-release-drift
- Iteration: 2026-07-26-05
- Operation Mode: TESTER
- Mission ID: LUC-1891-write-api-source-commit-anchor
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
  repair the `writeApiSourceCommit.mjs` path anchor defect proven by the failed
  Docker deployment shape and leave a bounded redeploy handoff.
- Release objective advanced:
  removes the remaining backend-owned source-path ambiguity before the next
  exact `soar-api` production retry.
- Included slices:
  inspect the script anchor, patch it to script-relative resolution, add an
  isolated regression, run focused checks, publish durable evidence.
- Explicit exclusions:
  no push, deploy, rollback, env edit, DB mutation, Redis mutation, or runtime
  mutation.
- Checkpoint cadence:
  one bounded backend verification heartbeat.
- Stop conditions:
  path-anchor repair is locally proven or the defect is disproven.
- Handoff expectation:
  release/Ops owner reruns exactly one `soar-api` deploy for commit
  `7742e5b73d89fff0f037b264b96acc0a7f863a9f` after this fix is included in the
  deployable source commit.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, wake payload, `LUC-1887` / `LUC-1889` / `LUC-1890` packets | task closure, issue evidence, repo truth | integrated backend packet | focused checks + Paperclip closeout | DONE |
| Architecture | Coordinator | existing API release identity contract | `apps/api/scripts/writeApiSourceCommit.mjs` | architecture-aligned repair | code review against current contract | DONE |
| Implementation | Coordinator | exact failing script path | `apps/api/scripts/writeApiSourceCommit.mjs`, `apps/api/scripts/writeApiSourceCommit.test.mjs` | minimal backend fix | node tests + release identity tests | DONE |
| QA/Test | Coordinator fallback | focused script + release identity tests | targeted verification commands | regression proof | passing checks | DONE |
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
`LUC-1889` proved the exact `soar-api` deployment row was readable and still
failed. The release parent then recorded a narrower board finding: the
provenance writer resolved `apiDir` from `process.cwd()`, while Docker invoked
`node apps/api/scripts/writeApiSourceCommit.mjs` from `/app`.

## Goal
Make the source-commit writer resolve repo/output paths from the script
location, not the caller working directory, without weakening fail-closed
release identity behavior.

## Success Signal
- User or operator problem:
  the next `soar-api` deployment could still fail because the provenance writer
  reads/writes the wrong paths when invoked from the repo root.
- Expected product or reliability outcome:
  the writer uses stable script-relative anchoring in both local and Docker
  build contexts.
- How success will be observed:
  an isolated regression passes when the script is executed from the fake repo
  root, and release identity tests still pass.
- Post-launch learning needed: yes

## Deliverable For This Stage
Verified source changes plus durable evidence and a clean redeploy handoff.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `writeApiSourceCommit.mjs` no longer anchors to `process.cwd()`.
- [x] Focused regression coverage reproduces the Docker-like working-directory shape.
- [x] Durable repo evidence and issue handoff identify the next deploy owner.

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
- `node --test apps/api/scripts/writeApiSourceCommit.test.mjs` -> PASS (`5/5`)
- `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts` -> PASS (`4/4`)
- `git rev-parse HEAD` -> `adc82a154c9023256e454accfb4edda2d3f0a378`
- `git ls-remote origin refs/heads/main` ->
  `adc82a154c9023256e454accfb4edda2d3f0a378`
- public `https://api.soar.luckysparrow.ch/health` at
  `2026-07-26T01:59:41Z` -> `200`,
  `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d`
- public `https://api.soar.luckysparrow.ch/ready` at
  `2026-07-26T01:59:41Z` -> `200`,
  `release.gitSha=9d1801d9b023211d4446629aac7bd58def70322d`
- Manual checks:
  - reviewed the current script and confirmed it previously resolved
    `apiDir` from `process.cwd()`
  - reviewed `LUC-1889` evidence confirming Docker invoked the script from
    `/app`, which mis-anchored both `.git` fallback and `.build-meta` output
  - confirmed the test harness now runs a copied script in an isolated fake
    repo so fixture assertions no longer leak to the real repo `.git`
  - consumed the reopen comment that advanced the deploy target to
    `adc82a154...` and requested one exact `soar-api` `instant_deploy=true`
  - names-only environment scan in this resumed runner returned no
    `COOLIFY_*` bindings, so the exact Coolify mutation could not be executed
    from this shell and no deploy request was sent
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
  for the source repair; blocked for the resumed deploy mutation because the
  required Coolify runtime bindings are absent in this runner

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  existing API release identity contract plus the current `LUC-1889` post-closeout finding
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
  future API images will resolve provenance output and `.git` fallback from the
  intended `apps/api` tree even when the caller `cwd` is `/app`
- Smoke steps updated:
  no
- Rollback note:
  revert the script-anchor repair if a later deploy proves regression; no
  deploy occurred in this task
- Observability or alerting impact:
  narrows future failed API deploys away from caller-working-directory drift
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  exact `soar-api` deploys on Sunday, July 26, 2026 were still failing after
  earlier backend repairs
- Gaps:
  the script anchor itself remained wrong under the Docker invocation shape
- Inconsistencies:
  the provenance writer intended to be reusable but still depended on the
  caller's working directory
- Architecture constraints:
  preserve exact image-baked SHA behavior and fail closed when no valid commit
  source exists

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none required
- Sources scanned:
  wake payload, `LUC-1889` evidence, current script/tests, current repo state
- Rows created or corrected:
  this task/evidence packet and `.codex/context/*` updates
- Assumptions recorded:
  the board's direct finding about `/app` invocation is accurate and safe to
  codify as regression coverage
- Blocking unknowns:
  the requested exact production redeploy cannot run from this resumed runner
  until Coolify bindings are restored or the mutation is handed to a bound
  release/Ops runner
- Why it was safe to continue:
  only local source/test wiring was changed and verified

### 2. Select One Priority Mission Objective
- Selected task:
  repair the script path anchor defect
- Priority rationale:
  it is the narrowest remaining backend-owned blocker on the active production
  release path
- Why other candidates were deferred:
  broader deploy actions belong to the release/Ops owner

### 3. Plan Implementation
- Files or surfaces to modify:
  `apps/api/scripts/writeApiSourceCommit.mjs`,
  `apps/api/scripts/writeApiSourceCommit.test.mjs`,
  history/context evidence files
- Logic:
  derive `apps/api` from `import.meta.url` and prove that with an isolated
  fake-repo test running from the repo root
- Edge cases:
  preserve env-first SHA handling, `.git` fallback, and fail-closed behavior

### 4. Execute Implementation
- Implementation notes:
  switched the script anchor from `process.cwd()` to script-relative path
  resolution, then updated tests to copy the script into a temp repo before
  execution so they validate the intended repo-local filesystem semantics

### 5. Verify and Test
- Validation performed:
  node syntax checks, five script tests, and four release identity tests
- Result:
  all focused local checks passed; resumed read-only release checks confirm
  `main` advanced to `adc82a154...` while public API still serves old
  `9d1801d9...`

### 6. Self-Review
- Simpler option considered:
  patch only the Dockerfile invocation; rejected because the board finding was
  a script contract bug and the helper should not depend on one caller shape
- Technical debt introduced: no
- Scalability assessment:
  script-relative resolution is stable across local, Docker, and future build
  callers
- Refinements made:
  tightened the tests to avoid accidental dependence on the real repo `.git`

### 7. Update Documentation and Knowledge
- Docs updated:
  `history/tasks/luc-1891-repair-write-api-source-commit-path-anchoring-2026-07-26-task.md`,
  `history/evidence/luc-1891-write-api-source-commit-path-anchoring-2026-07-26.md`
- Context updated:
  `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`
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
