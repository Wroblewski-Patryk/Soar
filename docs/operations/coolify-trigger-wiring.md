# Coolify Trigger Wiring (Production Only + Rollback)

Date: 2026-04-03  
Task: `DPL-18 ops(coolify)`; production-only update 2026-04-29

## Goal
Wire deployment triggers between GitHub Actions and Coolify services for:
- PROD deploy,
- PROD rollback.

Stage is intentionally parked for now. Do not keep stage Coolify resources,
GitHub webhooks, or GitHub Actions workflows active while the project is in
production-only mode. This prevents every push from creating duplicate stage
redeploy queues for unused services.

## Required GitHub Secrets
Configure repository secrets:

1. `COOLIFY_PROD_DEPLOY_HOOK_URL`
   - consumed by: `.github/workflows/promote-prod.yml`
2. `COOLIFY_PROD_ROLLBACK_HOOK_URL`
   - consumed by: `.github/workflows/prod-rollback.yml`

## Coolify Side Setup
For each target service/app in Coolify:
1. Open service -> Deployments/Webhooks.
2. Keep only production service webhooks active.
3. Create rollback webhook for PROD (previous stable deployment path).
4. Copy webhook URLs into matching GitHub repository secrets.

Stage cleanup checklist:
1. Remove or stop stage applications/services/databases in the Soar Coolify project.
2. Remove stage GitHub App/manual webhooks if Coolify created them.
3. Remove stage-only GitHub secrets after confirming no workflow references remain:
   `COOLIFY_STAGE_DEPLOY_HOOK_URL`, `STAGE_API_BASE_URL`, `STAGE_WEB_BASE_URL`,
   `STAGE_DATABASE_URL`.

## Workflow Chain Contract
1. `promote-prod.yml`
   - trigger: manual `workflow_dispatch`
   - action: deploy the selected SHA to PROD
2. `prod-rollback.yml`
   - trigger: failed `Promote PROD`
   - action: trigger rollback webhook to previous stable release

## Payload Contract (Webhook Body)
Current workflows pass JSON payload with metadata:
- SHA/ref/repository/actor/environment,
- plus failure metadata for rollback.

Coolify may ignore extra fields, but they are preserved for future custom automation.

## Smoke Validation After Wiring
1. Trigger manual `Promote PROD` workflow_dispatch in a controlled window.
2. Validate PROD deployment appears in Coolify.
3. Simulate failed promotion path only in a controlled maintenance window and verify rollback webhook fires.

## Security Notes
- Webhook URLs are secrets; never store in repo.
- Restrict who can run `workflow_dispatch` on production workflows.
- Use protected environments (`stage`, `production`) with required reviewers where appropriate.
