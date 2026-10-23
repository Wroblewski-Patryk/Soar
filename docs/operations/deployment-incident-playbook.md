# Deployment Incident Playbook (Blocked Candidate / Production Failure)

Date: 2026-04-03  
Task: `DPL-20 docs(runbook)`

## Goal
Provide a deterministic response flow when local candidate validation is blocked or the existing Coolify production rollout fails. Soar has no separate STAGE environment.

## Incident Classes
1. **Blocked candidate**
   - local isolated gates failed, or exact SHA, backup/rollback, migration, protected acceptance or owner approval is incomplete.
2. **Failed PROD rollout**
   - Coolify deployment failed, post-deploy health/readback failed, or rollback is required.

## Core Roles
- **Incident Commander (IC)**: coordinates timeline and go/no-go decisions.
- **Ops Executor**: handles Coolify/GitHub workflow actions.
- **Backend/Frontend Owners**: triage API/web/workers symptoms and fix scope.
- **Release Owner**: approves resume of promotion path.

## Shared Triage Checklist (All Classes)
1. Capture failing SHA, local gate run ID or Coolify deployment ID, and environment (`local`/`prod`).
2. Retrieve latest local gate evidence, Coolify deployment logs and rollback records.
3. Confirm current service state:
   - API `/health` + `/ready`,
   - web root and dashboard route,
   - workers health/ready.
4. Classify blast radius: local candidate only, production impact, or worker-only degradation.

## Playbook A: Blocked Candidate
1. Set release status to `PROMOTION_BLOCKED`; leave PROD unchanged.
2. Identify failing gate(s) from exact-SHA local evidence and production prerequisites.
3. Assign owner per failing gate:
   - build/test -> engineering owner,
   - migration -> backend/db owner,
   - health/smoke -> ops + app owners.
4. Prepare fix commit SHA.
5. Re-run isolated local gates on the fix SHA; obtain fresh backup/rollback, migration and protected acceptance evidence.
6. Keep PROD unchanged until a separate owner-approved deployment decision.

## Playbook B: Failed PROD Rollout
1. Mark incident `PROD_FAILED`.
2. Identify the active topology and read back actual process state; do not infer
   a completed rollback from a workflow status or health endpoint.
3. After any Coolify Service Stack process starts, including before domain
   cutover, follow mode D in the
   [rollback stop-before-start sequence](coolify-linux-vps-setup-guide.md#rollback-from-stack-cutover)
   before starting any old API or worker. Unknown process state, unresolved
   in-flight/`UNKNOWN` work, or unproven schema compatibility is STOP/NO-GO;
   obtain an operator recovery decision. Do not trigger automatic destructive
   rollback or replay. Mode A requires proof that no new process ever started;
   uncertain history requires mode D or STOP/NO-GO.
4. For other topologies, use the controlled
   [rollback playbook](deployment-rollback-playbook.md).
5. Validate post-rollback stability:
   - API ready,
   - web reachable,
   - workers healthy.
6. Freeze promotion of failing SHA.
7. Record remediation under the existing release queue; require a new locally validated exact SHA and separate owner approval before another production attempt.

## Communication Contract
Every incident update must include:
- incident class,
- affected environment,
- failing SHA/run id,
- current status (`investigating`, `mitigating`, `stable_restored`),
- next action + owner + ETA.

## Exit Criteria
Incident may close only when:
1. impacted environment is stable,
2. required gates are green for active serving version,
3. incident evidence is attached to release logs,
4. release owner approves reopening normal promotion flow.

## Evidence to Attach
- Gate reports,
- Local gate logs and Coolify deploy/rollback logs,
- Timestamped decisions,
- Final root-cause summary and prevention action list.

## Related Contracts
- `docs/operations/dev-stage-prod-promotion-contract.md`
- `docs/operations/deployment-readiness-gates.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/post-deploy-smoke-checklist.md`
