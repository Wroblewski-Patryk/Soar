# Coolify Deployment Wiring (Production Only + Manual Operator Control)

Date: 2026-04-03  
Task: `DPL-18 ops(coolify)`; production-only update 2026-04-29

## Goal
Document the accepted production deployment control path for Coolify services:
- PROD deploy through Coolify/manual operator controls,
- PROD rollback through Coolify/manual operator controls.

Stage is intentionally parked for now. Do not keep stage Coolify resources or
unused automation active while the project is in production-only mode. This
prevents every push from creating duplicate redeploy queues for unused
services.

## GitHub Actions Policy

GitHub Actions is not used for production deployment in the active project
setup. Do not add or dispatch GitHub Actions workflows for production promote
or rollback unless the operator explicitly approves a new paid/available
GitHub Actions setup.

## Coolify Side Setup
For each target service/app in Coolify:
1. Open service -> Deployments/Webhooks.
2. Keep only production service deployment controls active.
3. Keep rollback to previous stable deployment available in Coolify.
4. Keep webhook URLs out of the repository. If webhooks are used manually, they
   remain operator-held secrets and are not wired through GitHub Actions.

Stage cleanup checklist:
1. Remove or stop stage applications/services/databases in the Soar Coolify project.
2. Remove stage GitHub App/manual webhooks if Coolify created them.
3. Remove stage-only GitHub secrets after confirming no workflow references remain:
   `COOLIFY_STAGE_DEPLOY_HOOK_URL`, `STAGE_API_BASE_URL`, `STAGE_WEB_BASE_URL`,
   `STAGE_DATABASE_URL`.

## Manual Coolify Chain Contract
1. Operator selects the intended repository SHA in Coolify.
2. Operator deploys the production web, API, and worker services in the
   approved service order.
3. Proof: wait until `https://soar.luckysparrow.ch/api/build-info` exposes the
   promoted SHA before runtime freshness and release gates run.
4. If post-deploy checks fail, operator rolls back in Coolify to the previous
   stable release.

## Payload Contract (Webhook Body)
If manual webhooks are used outside the repository, include metadata where the
operator tooling supports it:
- SHA/ref/repository/operator/environment,
- plus failure metadata for rollback.

## Smoke Validation After Wiring
1. Trigger production deploy from Coolify in a controlled window.
2. Validate PROD deployment appears in Coolify.
3. Validate the build-info gate observes the target SHA before later runtime
   gates continue.
4. Simulate rollback only in a controlled maintenance window.

## Security Notes
- Webhook URLs are secrets; never store in repo.
- Restrict who can run `workflow_dispatch` on production workflows.
- Use protected environments (`stage`, `production`) with required reviewers where appropriate.
