# DEV -> PROD Deployment Contract (Immutable SHA)

Date: 2026-04-03  
Scope: CI/CD delivery contract for CryptoSparrow deployment pipeline.

## Goal
Guarantee that production receives an explicit, verified code revision.

Core principle: **select one immutable commit SHA, deploy it intentionally, verify it immediately**.

Stage is parked as of 2026-04-29 to avoid unused Coolify redeploy queues and
duplicated VPS resource usage. Reintroduce it only with an explicit workflow
restoration task.

## Canonical Promotion Flow
1. Developer lands changes in the configured production branch.
2. CI builds/tests candidate SHA through normal repository checks.
3. Operator triggers production deployment for the selected SHA.
4. PROD post-deploy gates run.
5. If PROD gates fail, automatic rollback moves services to previous stable release.

## Production Promotion Automation Entry Point
- Workflow: `.github/workflows/promote-prod.yml`
- Trigger: manual `workflow_dispatch`
- Required secret: `COOLIFY_PROD_DEPLOY_HOOK_URL`

## Immutable SHA Invariants
The following are non-negotiable:
1. `PROD` deployment must target the selected repository SHA.
2. No rebuild from changed source between candidate verification and PROD rollout.
3. Deployment metadata must include:
   - candidate SHA,
   - production deployment timestamp,
   - operator/automation identity.
4. Any mismatch between requested SHA and deployed SHA blocks release sign-off.

## Promotion Eligibility Rules
Candidate is promotable only when:
- repository quality gates are green for the selected SHA,
- no unresolved blocking incidents are attached to candidate SHA,
- branch protection rules are satisfied for target branch,
- deployment evidence artifact is generated and stored.

If any rule fails: promotion is blocked and `PROD` remains unchanged.

## PROD Rollout and Post-Deploy Gates
After immutable SHA promotion:
1. Deploy `api`, `web`, and `workers` in controlled sequence.
2. Execute post-deploy gates:
   - API health/readiness,
   - web availability smoke,
   - workers readiness + queue heartbeat.
3. Record rollout status and timestamps in deployment evidence log.

## Automatic Rollback Contract
Rollback is triggered when any required PROD post-deploy gate fails.

Rollback behavior:
1. Revert to previous stable deployment artifact/tag for affected services.
2. Keep failed SHA and gate failure details in incident evidence.
3. Mark candidate as `ROLLBACK_REQUIRED` and block automatic re-promotion until a new eligible SHA is validated.

## Evidence and Audit Contract
Each promotion attempt must emit machine-readable evidence (JSON/Markdown) with:
- `prodSha`,
- gate results map,
- decision (`DEPLOYED` / `BLOCKED` / `ROLLED_BACK`),
- timestamps and service scope,
- rollback reason (if any).

Evidence artifacts are mandatory for operational traceability and release audits.

## Ownership
- CI pipeline owns gate execution and promotion decisioning.
- Ops owner owns Coolify deployment wiring and runtime health policy.
- Release owner signs off blocked/rollback incidents before reopening promotion flow.

## Fail-Closed Policy
Any uncertainty in gate state, artifact state, or SHA identity results in blocked promotion.

There is no "best effort" promotion path to production.
