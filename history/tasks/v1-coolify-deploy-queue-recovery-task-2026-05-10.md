# V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10

## Header
- ID: `V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10`
- Title: Record Coolify deploy queue recovery for current V1 candidate
- Task Type: release
- Current Stage: post-release
- Status: DONE
- Owner: Ops/Release
- Depends on: `V1-DEPLOY-CONTROL-READINESS-2026-05-10`
- Priority: P0
- Iteration: 55
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches iteration 55 (`TESTER`).
- [x] The task is aligned with repository source-of-truth documents.

## Context
The user provided explicit Coolify UI access and reported a backlog of slow
production redeploys. Coolify showed old Soar deployments still queued after
public production had already advanced to the current pushed commit. The queue
needed operator-level inspection and recovery before any further push-driven
work.

## Goal
Recover and document the production deployment state so the remaining V1 work
is no longer confused with deploy lag.

## Success Signal
- User or operator problem: production deploys were slow and stale queued jobs
  could keep later work blocked.
- Expected product or reliability outcome: production is current at the latest
  pushed SHA, public health is verified, and Coolify has no stale queue.
- How success will be observed: build-info and public smoke pass for
  `33a2ebc4`; Coolify queue is empty.
- Post-launch learning needed: yes

## Deliverable For This Stage
Post-release evidence artifact, current V1 preflight artifacts, and source of
truth status sync.

## Scope
- `history/plans/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md`
- `history/releases/v1-final-preflight-33a2ebc4-2026-05-10.md`
- `history/artifacts/_artifacts-v1-final-preflight-33a2ebc4-2026-05-10.json`
- `.agents/state/*`
- `.codex/context/*`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Verify production build-info for `33a2ebc4`.
2. Inspect Coolify queue and identify stale queued/in-progress Soar deploys.
3. Cancel stale `soar-api` deploy jobs and run one fresh `soar-api` redeploy.
4. Confirm `soar-api` finishes on `33a2ebc4` and Coolify queue is empty.
5. Run public smoke and no-secret V1 preflight.
6. Update source-of-truth docs with the new deploy status and remaining
   blockers.

## Acceptance Criteria
- [x] Coolify queue is clear.
- [x] Production build-info exposes `33a2ebc4`.
- [x] Public deploy smoke passes.
- [x] Current no-secret V1 preflight artifact exists.
- [x] Source-of-truth files no longer present `e70f5cf6` lag as the active
  deploy blocker.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for a docs/evidence-only release
  task.
- [x] No production secrets are recorded.
- [x] No runtime behavior or exchange behavior is changed.
- [x] Remaining V1 blockers are explicit and fail-closed.

## Stage Exit Criteria
- [x] The output matches the declared `post-release` stage.
- [x] No later implementation work was mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- committing Coolify or application credentials
- treating public health as protected V1 evidence

## Validation Evidence
- Tests:
  - PASS: `node scripts\repoGuardrails.mjs`
  - PASS: `node scripts\checkDocsParity.mjs`
  - PASS: `git diff --check`
- Manual checks:
  - PASS: `node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 33a2ebc468be3dbfab7c784f375672ebead5ae16 --timeout-seconds 120 --interval-seconds 15`
  - PASS: `node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - BLOCKED as expected: `node scripts\runV1FinalPreflight.mjs --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 33a2ebc468be3dbfab7c784f375672ebead5ae16 --today 2026-05-10 --json-output history\artifacts\_artifacts-v1-final-preflight-33a2ebc4-2026-05-10.json --markdown-output history\releases\v1-final-preflight-33a2ebc4-2026-05-10.md`
- Screenshots/logs:
  - Coolify DOM evidence observed in-session: stale `soar-api` jobs, fresh
    redeploy importing `33a2ebc4`, finished deployment, empty queue.
- High-risk checks:
  - no secret values recorded
  - no live-money action performed
  - no destructive application data action performed

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/v1-production-activation-contract.md`
  - `DEPLOYMENT_GATE.md`
  - `history/releases/v1-operator-unblock-checklist-2026-05-10.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: public Web/API health verified after queue recovery
- Smoke steps updated: no
- Rollback note: Coolify still owns production rollback/redeploy controls.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Coolify had stale queued/in-progress Soar deploys after production
  build-info advanced.
- Gaps: protected application auth, rollback auth, DB restore context, and RC
  approver identities are still unavailable.
- Inconsistencies: source-of-truth docs still described the old `e70f5cf6`
  deploy lag as active.
- Architecture constraints: V1 must stay blocked until protected release
  evidence is fresh and approved.

### 2. Select One Priority Task
- Selected task: recover and document the Coolify deploy queue.
- Priority rationale: no further push/deploy work should happen while old
  production deploys are queued.
- Why other candidates were deferred: `LIVEIMPORT-03`, rollback proof, restore
  drill, and RC approval require protected inputs or real approver identities.

### 3. Plan Implementation
- Files or surfaces to modify: operations evidence, preflight artifacts, active
  state docs, planning queue.
- Logic: evidence/status update only.
- Edge cases: preflight exits non-zero by design because protected blockers
  remain.

### 4. Execute Implementation
- Implementation notes: cancelled stale `soar-api` jobs, ran one fresh API
  redeploy, verified `33a2ebc4`, and recorded the result.

### 5. Verify and Test
- Validation performed: build-info wait, public smoke, no-secret final
  preflight, guardrails, docs parity, diff check.
- Result: public production PASS; V1 remains correctly BLOCKED.

### 6. Self-Review
- Simpler option considered: wait without canceling stale jobs.
- Technical debt introduced: no
- Scalability assessment: keeping queue state explicit prevents future agents
  from pushing into stale deployment backlogs.
- Refinements made: recorded stale jobs as superseded instead of deleting
  historical lag evidence.

### 7. Update Documentation and Knowledge
- Docs updated: operations evidence, task packet, state files, planning queue.
- Context updated: yes
- Learning journal updated: yes

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
- [x] Docs or context were updated.
- [x] Learning journal was updated for the deploy-queue pitfall.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes
- Regression check performed: public smoke and no-secret preflight

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: production deployment metadata, no secrets
- Trust boundaries: Coolify operator UI and public Soar health endpoints
- Permission or ownership checks: operator-approved Coolify access only
- Abuse cases: stale deploy queues must not be hidden by public health checks
- Secret handling: no secret values recorded
- Security tests or scans: repository guardrails
- Fail-closed behavior: V1 remains blocked on protected evidence
- Residual risk: protected evidence is still missing

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: production deploy freshness
- SLI: build-info freshness and public API/Web health
- SLO: current commit visible and smoke PASS before further release work
- Error budget posture: healthy for public health, blocked for V1 release
- Health/readiness check: API `/health`, API `/ready`, Web `/`
- Logs, dashboard, or alert route: Coolify deployment queue and deployment log
- Smoke command or manual smoke: `deploySmokeCheck.mjs`
- Rollback or disable path: Coolify redeploy/rollback controls

## Result Report

- Task summary: recovered stale Coolify deploy queue and proved production is
  current at `33a2ebc4`.
- Files changed: operations evidence, preflight artifacts, task packet, and
  source-of-truth state docs.
- How tested: build-info, public smoke, final preflight, guardrails, docs
  parity, diff check.
- What is incomplete: protected liveimport auth/readback, rollback guard
  auth/proof, production DB restore context/fresh drill, RC approval, and
  authenticated/admin UI clickthrough.
- Next steps: obtain/run the protected evidence families or real RC approval
  inputs listed in the current preflight.
- Decisions made: stale `soar-api` deploy jobs were cancelled after confirming
  they targeted an old SHA and blocked the queue.
