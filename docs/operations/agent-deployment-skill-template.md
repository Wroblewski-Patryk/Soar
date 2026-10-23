# Agent Deployment Skill Template (Reusable Prompt Contract)

Reusable template only. For Soar (owner decision 2026-10-23), validate on local Windows and deploy only to the existing Coolify production environment after separate owner approval; do not require STAGE or a second VPS.

## Goal
Deploy `<PROJECT_NAME>` from `<GIT_SHA>` to `<ENVIRONMENT>` and return with verified health + persistence checks.

## Inputs Required
1. Repository path.
2. Target SHA/branch.
3. Environment: for Soar, `production` on existing Coolify; other projects name their approved target. Local Windows validation is a separate evidence record.
4. Domains:
   - web URL,
   - api URL.
5. Platform: Coolify project/environment/service ids.
6. Critical secrets checklist (names only, never inline values).

## Agent Workflow (Non-Negotiable)
1. Read current repo state and confirm clean/dirty tree.
2. Verify target SHA exists locally and on origin.
3. Validate Dockerfile and service map (api/web/workers).
4. Require exact-SHA local gates and protected signed-in acceptance, owner approval, backup/restore and rollback proof, and a migration compatibility plan.
5. Perform the stop-before-start worker-switch preflight; never overlap old and candidate consumers.
6. Deploy in the approved migration/API/Web/worker sequence on existing Coolify.
7. Run health checks (`/health`, `/ready`) and exact deployed-SHA readback.
8. Run protected signed-in user/admin smoke checks.
9. Run controlled persistence smoke checks only within the approved production scope.
10. Summarize local and production proof separately.

## Required Smoke Contract
1. Auth:
   - login success,
   - redirect to dashboard,
   - protected endpoint returns expected user.
2. Persistence:
   - create entity returns `201`,
   - list endpoint returns created entity.
3. Runtime:
   - workers healthy and not crash-looping.

## Failure Handling Contract
1. If migration fails, stop rollout and report blocker.
2. If web/api is unhealthy after deploy, block release acceptance and follow the
   [rollback mode-selection guard](deployment-rollback-playbook.md#rollback-modes).
   After any new Service Stack process starts, mode D must pass before any old
   API or worker starts; never trigger an automatic restore around that gate.
3. If only session/cookie issues appear, apply auth hardening playbook before rollback decision.
4. Always include exact failing endpoint/status in report.

## Response Format for Operator
1. Deployment status (`success`/`blocked`/`rolled back`).
2. Target SHA deployed.
3. Services touched.
4. Health check results.
5. Smoke check results.
6. Risks or follow-up actions.

## Copy/Paste Prompt Starter
```text
After the owner separately approves the exact SHA, deploy <PROJECT_NAME> to the existing production Coolify environment using SHA <GIT_SHA>.
Confirm backup/rollback, migration compatibility and stop-before-start worker switching; validate api/web/workers and protected signed-in paths.
If any critical gate fails, stop and report exact blocker with endpoint/status.
Return final status, evidence summary, and next actions.
```

