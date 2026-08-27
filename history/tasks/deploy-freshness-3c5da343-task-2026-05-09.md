# Task

## Header
- ID: DEPLOY-FRESHNESS-3C5DA343-2026-05-09
- Title: Verify production deploy freshness for dashboard runtime aggregate batch
- Task Type: release
- Current Stage: post-release
- Status: DONE
- Owner: Ops/Release
- Depends on: DASH-RUNTIME-WIDGET-AGGREGATE-CURRENT-RENDER-2026-05-09
- Priority: P0
- Iteration: 2026-05-09-dashboard-runtime-deploy
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is declared for this release verification iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The local branch accumulated a validated batch ending at `3c5da343` that
included dashboard runtime aggregate current-state correctness and focused Web
rendering coverage. The user asked to continue toward complete V1 correctness,
and previous workflow guidance asked not to push after every tiny commit.

## Goal
Push the accumulated batch and verify production Web build-info exposes the new
candidate SHA, then run safe public API/Web smoke checks.

## Success Signal
- User or operator problem: dashboard runtime correctness fixes are not useful
  on the VPS until production runs the expected SHA.
- Expected product or reliability outcome: production freshness is known and
  public health checks pass for the pushed dashboard runtime batch.
- How success will be observed: `/api/build-info` returns `3c5da343...` and
  public smoke checks return `200`.
- Post-launch learning needed: no

## Scope
- Push current `main` batch ending at `3c5da343`.
- Verify `https://soar.luckysparrow.ch/api/build-info`.
- Run no-secret public smoke for:
  - `https://api.soar.luckysparrow.ch/health`
  - `https://api.soar.luckysparrow.ch/ready`
  - `https://soar.luckysparrow.ch/`
- Update release evidence and state docs.

## Implementation Plan
1. Confirm the local branch contains only the intended ahead commits.
2. Run relevant local validations for the touched runtime/dashboard scope.
3. Push the batch to `origin/main`.
4. Wait for Web build-info to expose `3c5da343`.
5. Run public deploy smoke without protected worker/auth checks.
6. Record evidence and synchronize project state.

## Acceptance Criteria
- [x] `git push` succeeds for the current batch.
- [x] Web build-info exposes
  `3c5da34371e22aecb1a7aff0a185018870d35cec`.
- [x] Public API/Web smoke passes.
- [x] Protected evidence blockers remain explicit and are not marked done.

## Definition of Done
- [x] Deploy freshness evidence artifact exists.
- [x] Source-of-truth state files are updated.
- [x] No fake authenticated, DB, rollback, live-trading, or UI clickthrough
  evidence is accepted.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- treating public smoke as authenticated module clickthrough evidence
- treating build-info freshness as final V1 release approval
- running live-money or destructive production actions
- recording secrets in repository artifacts

## Validation Evidence
- Tests:
  - `apps/api/node_modules/.bin/vitest.CMD run src/modules/bots/runtimeSessionPositionsRead.service.test.ts` => PASS, 18/18.
  - `apps/web/node_modules/.bin/vitest.CMD run src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS, 41/41.
  - `apps/api/node_modules/.bin/tsc.CMD --noEmit` => PASS.
  - `apps/web/node_modules/.bin/tsc.CMD --noEmit` => PASS.
  - `node scripts/repoGuardrails.mjs` => PASS.
  - `apps/web/node_modules/.bin/next.CMD build` => PASS after approved network access for `next/font` Google font fetches.
- Manual checks:
  - `git log --oneline origin/main..HEAD`
  - `git status --short --branch`
- Screenshots/logs:
  - `history/plans/deploy-freshness-3c5da343-2026-05-09.md`
- High-risk checks: no protected credentials, exchange writes, live orders, or
  DB restore operations were used.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `docs/operations/deployment-rollback-playbook.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: public API/Web checks pass
- Smoke steps updated: evidence artifact added
- Rollback note: if later protected checks fail due this deploy, use the
  existing Coolify rollback path from `docs/operations/deployment-rollback-playbook.md`.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: local `main` was ahead of `origin/main` by eight validated commits.
- Gaps: production had to prove the pushed SHA before dashboard/runtime fixes
  could be considered deployed.
- Inconsistencies: public deploy smoke initially used `--skip-workers`, which
  is not a supported flag; rerun used the canonical `--no-workers` flag.
- Architecture constraints: Coolify/VPS remains the accepted deployment target;
  public smoke must not be overclaimed as protected runtime evidence.

### 2. Select One Priority Task
- Selected task: verify production freshness for `3c5da343`.
- Priority rationale: the user asked to continue until the app works correctly,
  and the dashboard runtime fix needed to reach production.
- Why other candidates were deferred: authenticated/admin UI audit and
  protected V1 evidence still require credentials/context not available in this
  shell.

### 3. Plan Implementation
- Files or surfaces to modify: release evidence and state docs only after
  successful push/smoke.
- Logic: no application logic changes in this release verification task.
- Edge cases: build-info may lag after push; wait command records repeated
  stale but healthy responses until the expected SHA appears.

### 4. Execute Implementation
- Implementation notes: pushed `main`, waited for Web build-info, and ran
  no-secret public smoke.

### 5. Verify and Test
- Validation performed: local focused/runtime/dashboard gates, Web build,
  build-info wait, public deploy smoke, and no-secret final preflight.
- Result: PASS, except the intentionally corrected smoke invocation noted
  above.

### 6. Self-Review
- Simpler option considered: pushing without deployment freshness evidence.
- Technical debt introduced: no
- Scalability assessment: evidence artifact keeps deployment freshness
  recoverable for future agents/operators.
- Refinements made: residual blockers remain explicitly separated from public
  smoke.

### 7. Update Documentation and Knowledge
- Docs updated: release evidence, final preflight status, planning queue,
  project state, agent state.
- Context updated: yes
- Learning journal updated: yes, `--no-workers` public smoke guardrail

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was declared.
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
- Task summary: pushed the dashboard runtime aggregate batch and verified
  production build-info plus public API/Web smoke.
- Files changed: this task artifact, deployment evidence, and source-of-truth
  state docs.
- How tested: local focused gates, Web build, build-info wait PASS, public
  deploy smoke PASS, final preflight PASS for build-info/public smoke and
  BLOCKED only on protected/formal release evidence.
- What is incomplete: protected V1 evidence and authenticated UI clickthrough
  remain blocked on credentials/context.
- Next steps: run final preflight for the deployed SHA, then continue protected
  evidence once auth/DB/Coolify context is available.
- Decisions made: public smoke is recorded only as deploy freshness evidence.
