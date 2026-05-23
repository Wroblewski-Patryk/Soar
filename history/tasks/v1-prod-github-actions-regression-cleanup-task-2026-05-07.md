# Task

## Header
- ID: V1-PROD-GITHUB-ACTIONS-REGRESSION-CLEANUP-2026-05-07
- Title: Remove GitHub Actions production promotion path
- Task Type: release
- Current Stage: implementation
- Status: DONE
- Owner: Ops/Release
- Depends on: V1 production deploy path correction
- Priority: P0
- Iteration: 2026-05-07 regression cleanup
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this correction slice.
- [x] The task is aligned with the updated operator constraint.

## Context
The operator confirmed that GitHub Actions is not an accepted production
deployment mechanism for this project because the GitHub account is not paid
and workflow attempts create unwanted email noise. Recent continuation work
incorrectly treated GitHub Actions `workflow_dispatch` as the canonical
promotion path. This introduced an operational regression.

## Goal
Stop future agents and operators from using GitHub Actions for production
promotion or rollback, and point active release state back to direct Coolify
operator deployment plus repository-local verification gates.

## Scope
- Remove `.github/workflows/promote-prod.yml`.
- Remove `.github/workflows/prod-rollback.yml`.
- Remove `scripts/promoteProdWorkflow.mjs`.
- Remove `ops:prod:promote` from `package.json`.
- Remove superseded GitHub Actions blocker/helper task artifacts.
- Update active state and operations docs to reflect manual Coolify deployment.

## Implementation Plan
1. Remove GitHub Actions promotion/rollback workflow files.
2. Remove the local helper that dispatches those workflows.
3. Update active docs/state so the next V1 step is Coolify/manual deploy, not
   GitHub Actions.
4. Validate repository guardrails, docs parity, and diff hygiene.

## Acceptance Criteria
- No active package script dispatches GitHub Actions production promotion.
- No active `.github/workflows/promote-prod.yml` or `prod-rollback.yml`
  remains.
- Active next steps no longer mention resolving GitHub billing or rerunning
  `Promote PROD`.
- Production remains `NO-GO` until manual Coolify deploy and V1 evidence gates
  pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` intent satisfied for an ops regression cleanup.
- [x] Existing app/runtime behavior is unchanged.
- [x] No workaround deploy path is introduced.
- [x] Relevant docs/state are updated.

## Forbidden
- Using GitHub Actions for production deployment.
- Calling unknown deploy hooks directly from local scripts.
- Marking V1 ready without production evidence.
- Running live-money or destructive production actions.

## Validation Evidence
- Tests:
  - `.github/workflows` file list now contains only `ci.yml`.
  - `node -e "const p=require('./package.json'); if (p.scripts['ops:prod:promote']) process.exit(1); console.log('ops_prod_promote_removed=PASS')"` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
  - `git diff --check` PASS with line-ending warnings only.
- Manual checks:
  - Active deployment source should be Coolify operator deploy plus local
    release evidence scripts.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No production deploy or rollback was triggered by this cleanup.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/coolify-linux-vps-setup-guide.md`
  - `docs/operations/deployment-readiness-gates.md`
  - `docs/operations/dev-stage-prod-promotion-contract.md`
- Fits approved architecture: yes, after correcting the operator constraint.
- Mismatch discovered: yes, GitHub Actions was documented as active but is not
  allowed by the operator.
- Decision required from user: no, operator decision was explicit.
- Approval reference if architecture changed: user correction on 2026-05-07.
- Follow-up architecture doc updates: operations docs updated in this task.

## Deployment / Ops Evidence
- Deploy impact: low; removes unusable workflow entrypoints.
- Env or secret changes: no secrets changed.
- Health-check impact: none.
- Smoke steps updated: yes, active docs now point to Coolify/manual deploy and
  local verification commands.
- Rollback note: rollback is manual in Coolify until a non-GitHub automation is
  explicitly approved.
- Observability or alerting impact: removes GitHub Actions billing/email noise.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: GitHub Actions workflow attempts are invalid for this project and
  create unwanted email noise.
- Gaps: V1 still needs production deploy and protected evidence, but not via
  GitHub Actions.
- Inconsistencies: active docs and state referred to `Promote PROD`.
- Architecture constraints: no unapproved deployment systems or workaround
  paths.

### 2. Select One Priority Task
- Selected task: remove GitHub Actions production promotion path.
- Priority rationale: continuing with a forbidden deployment mechanism would
  cause repeated regressions and noise.
- Why other candidates were deferred: production import/readback evidence still
  depends on an accepted deploy path and protected production access.

### 3. Plan Implementation
- Files or surfaces to modify: workflows, package script, active docs/state.
- Logic: remove invalid entrypoints, keep verification scripts.
- Edge cases: preserve historical evidence where useful, but active queue must
  not point to GitHub Actions.

### 4. Execute Implementation
- Implementation notes: removed GitHub Actions workflow entrypoints and helper.

### 5. Verify and Test
- Validation performed: workflow file listing, repository guardrails, docs
  parity, and diff check.
- Result: PASS for regression cleanup; historical archived/planning references
  may still mention removed GitHub Actions but active state no longer uses it.

### 6. Self-Review
- Simpler option considered: only stop using the workflow.
- Technical debt introduced: no.
- Scalability assessment: reduces operational ambiguity for future agents.
- Refinements made: active docs now separate deploy execution from local
  release gates.

### 7. Update Documentation and Knowledge
- Docs updated: operations/state/context docs.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to continuation scope.
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
Removed GitHub Actions production promotion/rollback entrypoints and the local
helper that dispatched them. Active operations docs and state now point to
Coolify/manual operator deployment followed by repository-local verification
gates. No production deployment, rollback, DB, exchange, or live-money action
was triggered by this cleanup.
