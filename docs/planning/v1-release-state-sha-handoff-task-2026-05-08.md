# V1 Release State SHA Handoff Task (2026-05-08)

## Header
- ID: V1-RELEASE-STATE-SHA-HANDOFF-2026-05-08
- Title: Keep release handoff SHA verification dynamic
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: V1-RELEASE-GATE-RC-APPROVAL-EVIDENCE-2026-05-08
- Priority: P0
- Iteration: 40
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The latest RC approval gate hardening commit was deployed and public smoke
passed, but active handoff docs still contain hardcoded production SHA values.
Because each docs/state commit changes `HEAD`, a hardcoded SHA can become stale
immediately after a follow-up state sync.

## Goal
Make the active final blocker handoff rely on the existing dynamic
`git rev-parse HEAD` plus web build-info wait command instead of treating a
specific previously observed SHA as the ongoing source of truth.

## Scope
- `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
- `.agents/state/current-focus.md`
- `.agents/state/system-health.md`
- `.agents/state/next-steps.md`
- `.agents/state/known-issues.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- this task artifact

## Success Signal
- User or operator problem: continuation docs no longer imply a stale
  hardcoded SHA is the active deploy target after every docs/state commit.
- Expected product or reliability outcome: final V1 evidence collection always
  verifies the checked-out `HEAD` against production build-info before
  protected readback.
- How success will be observed: handoff docs point to the dynamic build-info
  command and record the previous verified RC approval deploy as evidence, not
  as a permanent target.
- Post-launch learning needed: no

## Deliverable For This Stage
Update release handoff/state docs and validate docs-only guardrails.

## Constraints
- Use existing Coolify/manual deployment and build-info wait mechanisms.
- Do not introduce new deploy systems, webhooks, or bypasses.
- Do not run protected production, DB, exchange, or live-money actions.
- Keep `LIVEIMPORT-03`, restore drill, rollback proof, and RC approval blockers
  open until real protected evidence exists.

## Implementation Plan
1. Replace hardcoded active SHA wording with dynamic `git rev-parse HEAD` and
   build-info wait wording.
2. Preserve the last verified RC approval deploy SHA as historical evidence.
3. Sync planning/context/state files with this handoff policy.
4. Validate guardrails, docs parity, public smoke, and diff check.

## Acceptance Criteria
- Final blocker pack no longer presents a previous SHA as the ongoing active
  production target.
- Next steps instruct agents/operators to wait for current `HEAD` via
  build-info before protected readback.
- Current focus/system health no longer contradict the deployed RC approval
  hardening state.
- Validation evidence is attached.

## Definition of Done
- [x] Handoff docs use dynamic deploy freshness verification.
- [x] State/context/planning files agree on remaining blockers.
- [x] Validation passes.
- [x] No protected evidence is faked or downgraded.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Fake approval names.
- Treat public health/build-info as `LIVEIMPORT-03` evidence.
- Mark restore/rollback proof as PASS without protected access.
- Add GitHub Actions or alternate deployment paths.

## Validation Evidence
- Tests: not applicable for docs-only handoff wording.
- Manual checks:
  - `pnpm run quality:guardrails` => PASS
  - `pnpm run docs:parity:check` => PASS
  - `git diff --check` => PASS
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` => PASS
- Screenshots/logs: public smoke output reported API `/health`, API `/ready`,
  and WEB `/` PASS.
- High-risk checks: no protected credentials, DB/Coolify access, exchange
  writes, live-money actions, fake approval names, or destructive operations
  were used.

## Architecture Evidence
- Architecture source reviewed: final blocker execution pack, deployment
  contract, release-gate state docs.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this docs/state commit if the handoff wording is wrong.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: hardcoded previously observed production SHA values can become stale
  after every docs/state continuation commit.
- Gaps: active handoff should name the dynamic verification mechanism as the
  source of truth.
- Inconsistencies: current focus still names an older deploy SHA while the RC
  approval hardening commit was already deployed.
- Architecture constraints: Coolify/manual deploy plus local build-info wait is
  the accepted production path.

### 2. Select One Priority Task
- Selected task: release-state SHA handoff hardening.
- Priority rationale: prevents false deploy-state confidence before protected
  `LIVEIMPORT-03` and final V1 gate work.
- Why other candidates were deferred: remaining V1 blockers require protected
  production auth, DB/Coolify access, or real approver names that are not
  available in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: release pack, state/context/planning docs.
- Logic: replace stale target-SHA wording with dynamic verification policy.
- Edge cases: preserve historical evidence without making it the next target.

### 4. Execute Implementation
- Implementation notes: updated active handoff/state wording so future
  protected readback starts from `git rev-parse HEAD` and the existing
  build-info wait command. Historical deploy SHA `1100b7fb...` remains
  evidence, not a permanent target.

### 5. Verify and Test
- Validation performed: guardrails, docs parity, diff check, and public deploy
  smoke.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: update all docs to the last observed SHA only;
  rejected because the next docs commit would immediately age that value.
- Technical debt introduced: no
- Scalability assessment: using the existing build-info wait command scales
  with future commits without state churn.
- Refinements made: final blocker pack now names dynamic freshness source of
  truth and separately records last verified RC approval deploy.

### 7. Update Documentation and Knowledge
- Docs updated: final blocker pack, state files, context files, planning queue,
  and this task artifact.
- Context updated: yes
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: release operator and future continuation agents
- Existing workaround or pain: manually noticing stale hardcoded SHA values
- Smallest useful slice: dynamic handoff wording in active state docs
- Success metric or signal: final blocker flow starts with build-info wait for
  current `HEAD`
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: production V1 release evidence collection
- SLI: production build-info exposes expected commit before protected evidence
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: public smoke after deploy
- Logs, dashboard, or alert route: build-info wait output
- Smoke command or manual smoke: pending
- Rollback or disable path: revert docs/state commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes, public build-info and smoke only
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: public release-state metadata
- Trust boundaries: no protected credentials or private payloads used
- Permission or ownership checks: not applicable
- Abuse cases: stale release-state wording could cause protected readback
  against the wrong deployed commit
- Secret handling: no secret values read or written
- Security tests or scans: not applicable
- Fail-closed behavior: missing protected evidence remains blocking
- Residual risk: real V1 evidence still requires operator access

## Result Report
- Task summary: release handoff now treats web build-info wait for current
  `HEAD` as the deploy freshness source of truth.
- Files changed: final blocker pack, `.agents/state/*`, `.codex/context/*`,
  `docs/planning/mvp-next-commits.md`, and this task artifact.
- How tested: guardrails, docs parity, diff check, and public deploy smoke.
- What is incomplete: protected `LIVEIMPORT-03`, restore drill, rollback proof,
  and real RC approval remain blocked until operator credentials/access and
  approver names are available.
- Next steps: with protected access, run build-info wait for current `HEAD`,
  then collect `LIVEIMPORT-03` readback.
- Decisions made: avoid chasing hardcoded SHA values in state docs; use the
  existing build-info verification gate instead.
