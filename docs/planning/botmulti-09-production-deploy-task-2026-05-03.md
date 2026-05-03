# Task

## Header
- ID: BOTMULTI-09
- Title: Promote multi-strategy runtime topology to production
- Task Type: release
- Current Stage: release
- Status: IN_PROGRESS
- Owner: Ops/Release
- Depends on: BOTMULTI-08
- Priority: P0
- Iteration: 9
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
BOTMULTI-01 through BOTMULTI-08 closed the local implementation, validation,
architecture synchronization, and planning closure for the canonical
multi-strategy bot topology. Production promotion must use the approved
Coolify/GitHub release path and preserve the API startup migration contract.

## Goal
Promote the verified multi-strategy topology changes to production using the
approved deployment workflow, with migration behavior and rollback expectations
explicitly verified.

## Scope
- Release surfaces:
  - `.github/workflows/promote-prod.yml`
  - `docs/operations/coolify-trigger-wiring.md`
  - `docs/operations/coolify-linux-vps-setup-guide.md`
  - `docs/operations/post-deploy-smoke-checklist.md`
- Runtime migration surfaces:
  - `apps/api/Dockerfile`
  - `apps/api/scripts/start-with-migrate.mjs`
  - `apps/api/prisma/migrations/20260503013000_enforce_single_active_bot_market_group/migration.sql`
- Source-of-truth updates:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Confirm the production deploy path and automatic migration behavior.
2. Run the strongest relevant local release validation before promotion.
3. Commit and push only the intended BOTMULTI release scope.
4. Trigger the approved production deployment workflow or document the exact
   access blocker if workflow dispatch is unavailable from this environment.
5. Record release evidence and next action in canonical context files.

## Acceptance Criteria
- The API image still starts through `scripts/start-with-migrate.mjs`.
- `prisma migrate deploy` remains fail-closed before API boot when
  `API_AUTO_MIGRATE` is not `false`.
- Local build and relevant quality gates pass before production promotion.
- Deployment is triggered through the approved production workflow, or a clear
  blocker is recorded with the candidate SHA ready for manual dispatch.
- Post-deploy smoke expectations are documented.

## Success Signal
- User or operator problem: the completed BOTMULTI vertical slice is deployed
  without a manual production migration step.
- Expected product or reliability outcome: production API applies the new
  Prisma migration idempotently before boot and exposes the promoted SHA.
- How success will be observed: GitHub/Coolify promotion plus build-info,
  health, readiness, and runtime freshness gates.
- Post-launch learning needed: no

## Deliverable For This Stage
Production promotion evidence or a precise deployment access blocker with the
candidate commit prepared for the approved workflow.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [ ] `DEFINITION_OF_DONE.md` release expectations are satisfied with evidence.
- [ ] Candidate SHA is committed and pushed or a concrete push blocker is
  recorded.
- [ ] Production workflow is triggered or a concrete workflow-dispatch blocker
  is recorded.
- [ ] Migration behavior, rollback path, and smoke gates are recorded.
- [ ] Canonical context and planning files are synchronized.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- direct database migration commands against production outside the approved
  API startup migration path

## Validation Evidence
- Tests:
  - Pending release build validation.
- Manual checks:
  - Pending migration and deployment path confirmation.
- Screenshots/logs:
  - Not applicable.
- High-risk checks:
  - Production migration must be idempotent and fail-closed before API boot.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required unless deployment uncovers
  drift.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: high
- Env or secret changes: none expected; production workflow requires existing
  `COOLIFY_PROD_DEPLOY_HOOK_URL`, optional `PROD_WEB_BASE_URL`, and runtime
  freshness secrets.
- Health-check impact: API startup fails closed if migration fails.
- Smoke steps updated: existing `docs/operations/post-deploy-smoke-checklist.md`
  applies.
- Rollback note: existing `prod-rollback.yml` / Coolify rollback hook path.
- Observability or alerting impact: no new alerts introduced.
- Staged rollout or feature flag: not applicable for this schema/runtime
  release.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: deployment requires GitHub workflow/Coolify access, not a direct local
  database command.
- Gaps: local environment may not have GitHub CLI or deploy hook secrets.
- Inconsistencies: none found in the documented migration startup contract.
- Architecture constraints: production migrations must use `prisma migrate
  deploy` through approved startup path.

### 2. Select One Priority Task
- Selected task: promote BOTMULTI release candidate to production.
- Priority rationale: user explicitly requested deployment after migration
  question.
- Why other candidates were deferred: no active NOW/READY feature work remains
  ahead of the release request.

### 3. Plan Implementation
- Files or surfaces to modify: release evidence docs/context only.
- Logic: verify, commit, push, dispatch, smoke.
- Edge cases: unavailable GitHub CLI, missing deploy hook secret, migration
  preflight failure on dirty production data.

### 4. Execute Implementation
- Implementation notes: pending.

### 5. Verify and Test
- Validation performed: pending.
- Result: pending.

### 6. Self-Review
- Simpler option considered: direct production migration command; rejected
  because the approved deployment path already owns migration execution.
- Technical debt introduced: no
- Scalability assessment: uses existing release workflow.
- Refinements made: pending.

### 7. Update Documentation and Knowledge
- Docs updated: this task.
- Context updated: pending.
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [ ] Deliverable for the current stage is complete.
- [ ] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Do not run direct production database commands for this release. The production
API container must run `prisma migrate deploy` before starting the API process.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB -> validation -> error handling -> test. Partial implementations, mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: production operator
- Existing workaround or pain: uncertainty whether migration runs at redeploy.
- Smallest useful slice: promote one verified candidate through approved
  production workflow.
- Success metric or signal: deployed SHA visible in production build-info.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: production smoke gates.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: pending
- Critical user journey: production API boot and runtime loop freshness.
- SLI: health, readiness, web build-info SHA, runtime freshness.
- SLO: existing production gate expectations.
- Error budget posture: healthy
- Health/readiness check: `/health`, `/ready`.
- Logs, dashboard, or alert route: Coolify/GitHub workflow logs.
- Smoke command or manual smoke: `promote-prod.yml` gates plus post-deploy
  checklist.
- Rollback or disable path: Coolify production rollback webhook.

- `INTEGRATION_CHECKLIST.md` reviewed: pending
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: pending release validation
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: pending deployment
- Regression check performed: pending

## AI Testing Evidence (required for AI features)

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: production operational metadata and schema state.
- Trust boundaries: GitHub Actions secrets and Coolify deploy hooks.
- Permission or ownership checks: workflow dispatch requires GitHub production
  access.
- Abuse cases: deploy hook secret leakage; mitigated by not printing secret
  values and using GitHub secrets.
- Secret handling: no secrets stored in repository.
- Security tests or scans: not applicable for release-only step.
- Fail-closed behavior: API does not start if migration fails.
- Residual risk: production data may violate new partial unique migration
  preflight and block API startup; rollback path remains available.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: Pending.
- Files changed: Pending.
- How tested: Pending.
- What is incomplete: Pending.
- Next steps: Pending.
- Decisions made: Use approved startup migration and production workflow.
