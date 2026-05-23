# Task

## Header
- ID: V1GATE-02
- Title: Refresh public production and stage target truth after PMPLC merge
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: APPCHECK-01
- Priority: P0
- Iteration: 48
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After the PMPLC hardening branch was merged into `main` and a local app-function
sweep passed, the next V1 risk is deploy-target truth. The V1 readiness audit
still lists release-gate blockers around stage, restore drill, sign-off, and
manual/protected evidence. Public endpoints can be checked safely without
secrets or live-money mutations.

## Goal
Refresh the public production and stage target status, confirm whether
production is running current `main`, correct any discovered smoke-documentation
drift, and keep V1 GO/NO-GO truth honest.

## Scope
- Public production API/Web smoke only.
- Public stage API/Web smoke only.
- Production build-info readback.
- Git SHA comparison against `origin/main` and local `HEAD`.
- Post-deploy smoke checklist canonical auth-route correction.
- Source-of-truth planning/context updates.

## Success Signal
- User or operator problem: V1 cannot be judged from stale release evidence.
- Expected product or reliability outcome: current public prod/stage status is
  recorded and remaining blockers are classified accurately.
- How success will be observed: production public smoke, stage public smoke,
  build-info, and git ancestry evidence are captured in operations docs.
- Post-launch learning needed: no

## Deliverable For This Stage
Release-stage public target refresh evidence and source-of-truth sync.

## Constraints
- Do not run destructive deploy, database, restore, or live-money actions.
- Do not claim protected/authenticated production evidence from public checks.
- Do not mark stage green while public targets return `503`.
- Do not introduce workaround routes or compatibility aliases.

## Acceptance Criteria
- Production public API/Web status is recorded.
- Production build-info SHA is recorded and compared with `origin/main`.
- Stage public API/Web status is recorded.
- Any smoke checklist route drift found during the task is corrected.
- Remaining V1 blockers are updated without overstating readiness.

## Definition of Done
- [x] Production public smoke evidence exists.
- [x] Stage public smoke evidence exists.
- [x] Production build-info evidence exists.
- [x] Git freshness comparison is captured.
- [x] Canonical docs/context are updated.
- [x] Relevant validation passes.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` PASS.
  - `git diff --check` PASS.
- Manual checks:
  - `GET https://api.soar.luckysparrow.ch/health` PASS `200`.
  - `GET https://api.soar.luckysparrow.ch/ready` PASS `200`.
  - `GET https://soar.luckysparrow.ch/` PASS `200`.
  - `GET https://soar.luckysparrow.ch/auth/login` PASS `200`.
  - `GET https://soar.luckysparrow.ch/api/build-info` PASS with
    `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`.
  - `curl.exe -I -L --max-time 25 https://soar.luckysparrow.ch/dashboard`
    PASS: unauthenticated dashboard redirects `307` to `/auth/login`, then
    returns `200`.
  - `GET https://stage-api.soar.luckysparrow.ch/health` FAIL `503`.
  - `GET https://stage-api.soar.luckysparrow.ch/ready` FAIL `503`.
  - `GET https://stage.soar.luckysparrow.ch/` FAIL `503`.
  - `GET https://stage.soar.luckysparrow.ch/api/build-info` FAIL `503`.
  - `GET https://stage-soar.luckysparrow.ch/` FAIL DNS.
- Screenshots/logs:
  - `history/plans/v1gate-02-public-target-refresh-2026-05-07.md`
- High-risk checks:
  - No secrets, auth tokens, live orders, deploys, restore actions, or DB
    mutations were used.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no for this public refresh; release-owner
  decision remains required for stage waiver/manual matrix/sign-off.
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: yes; canonical login route clarified as `/auth/login`.
- Rollback note: no runtime change; rollback not applicable.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: stage public targets remain unavailable; restore drill and
  protected/manual matrix evidence remain outside public smoke.
- Gaps: no authenticated production evidence was available in this task.
- Inconsistencies: post-deploy checklist referred generically to login, while
  a legacy `/login` probe returns `404`; canonical route is `/auth/login`.
- Architecture constraints: V1 GO requires evidence, not assumptions; public
  smoke cannot substitute for protected/manual/live-money proofs.

### 2. Select One Priority Task
- Selected task: V1GATE-02 public target refresh after PMPLC merge.
- Priority rationale: release-gate truth is the highest remaining V1 blocker
  once local runtime/build checks are green.
- Why other candidates were deferred: restore drill, deploy workflow dispatch,
  authenticated manual matrix, and live-money mutations require external
  operator context or credentials that are not present in this local session.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `history/plans/v1gate-02-public-target-refresh-2026-05-07.md`
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
  - `history/tasks/v1gate-02-public-target-refresh-task-2026-05-07.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Logic: run public smoke first, classify results, update docs only after
  evidence is available.
- Edge cases: keep `/login` as an expected legacy miss, not a product bug,
  because the app route and middleware contract use `/auth/login`.

### 4. Execute Implementation
- Implementation notes: no runtime code changes were required. The smoke
  checklist now names `/auth/login` explicitly.

### 5. Verify and Test
- Validation performed: public target smoke, build-info readback, git ancestry,
  repository guardrails, and diff whitespace check.
- Result: production public baseline is healthy and current with `origin/main`;
  stage remains blocked.

### 6. Self-Review
- Simpler option considered: only report the smoke in chat. Rejected because
  repository truth must survive the chat.
- Technical debt introduced: no
- Scalability assessment: this evidence cleanly separates public target health
  from protected/manual/live-money V1 proof.
- Refinements made: corrected the post-deploy smoke checklist to avoid future
  false `/login` failures.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `history/plans/v1gate-02-public-target-refresh-2026-05-07.md`
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `history/audits/v1-function-implementation-readiness-audit-2026-05-01.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Learning journal updated: not applicable.

## Review Checklist
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

## Result Report
- Task summary: refreshed public production/stage target truth after PMPLC
  merge; production is public healthy and current with `main`, while stage is
  still unavailable.
- Files changed: operations/planning/context docs only.
- How tested: commands and public endpoint checks listed in Validation
  Evidence.
- What is incomplete: V1 remains blocked by restore drill, stage restoration or
  waiver, sign-off, authenticated manual matrix, and live-money proof rows.
- Next steps: restore stage or record waiver, run the production restore drill
  in the real VPS/Coolify DB context, then execute authenticated/manual V1
  matrix proofs.
