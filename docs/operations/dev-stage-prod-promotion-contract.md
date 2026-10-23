# DEV -> PROD Deployment Contract (Immutable SHA)

Date: 2026-04-03  
Scope: CI/CD delivery contract for CryptoSparrow deployment pipeline.

## Goal
Guarantee that production receives an explicit, verified code revision.

Core principle: **select one immutable commit SHA, deploy it intentionally, verify it immediately**.

Owner decision (2026-10-23): Soar has two environments only: local Windows for development/isolated tests and the existing Coolify production VPS. There is no separate STAGE and no second VPS in the release path. Local PASS does not constitute production proof; the owner separately approves production deployment.

## Canonical Promotion Flow
1. Developer lands changes in the configured production branch.
2. CI builds/tests candidate SHA through normal repository checks.
3. Operator triggers production deployment for the selected SHA.
4. PROD post-deploy gates run.
5. If PROD gates fail, the operator follows the
   [rollback mode-selection guard](deployment-rollback-playbook.md#rollback-modes)
   before Coolify restores a previous stable release. After any new Service
   Stack process starts, mode D applies even before domain cutover.

## Production Promotion Entry Point
- Tool: Coolify/manual operator deployment for the selected SHA.
- GitHub Actions is not used for production deployment in the active setup.
- Required secrets and deployment controls remain outside repository workflows.

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
- deployment evidence artifact is generated and stored,
- backup/restore viability, rollback path, migration compatibility, stop-before-start worker cutover, and protected signed-in user/admin acceptance are ready,
- the owner has separately approved this exact-SHA production deployment.

If any rule fails: promotion is blocked and `PROD` remains unchanged.

## PROD Rollout and Post-Deploy Gates
After immutable SHA promotion:
1. Verify backup and rollback checkpoints; run the approved migration sequence for the exact SHA.
2. Stop old workers before candidate workers start, using the Coolify cutover preflight.
3. Deploy `api`, `web`, and `workers` in controlled sequence.
4. Execute production post-deploy gates: API/Web/workers readiness, queue and runtime freshness, deployed SHA readback, and protected signed-in user/admin journeys.
5. Record rollout status, operator, timestamps and evidence in the deployment log. Local evidence remains separately labeled.

## Rollback Contract
Rollback is triggered when any required PROD post-deploy gate fails.

Rollback behavior:
1. For a Service Stack cutover, apply
   [mode D stop-before-start](coolify-linux-vps-setup-guide.md#rollback-from-stack-cutover)
   after any new process starts or when start history is uncertain. Only a
   proven never-started candidate may use mode A. Then restore a compatible
   previous artifact/tag; unpassed gates mean STOP/NO-GO.
2. Keep failed SHA and gate failure details in incident evidence.
3. Mark candidate as `ROLLBACK_REQUIRED` and block re-promotion until a new
   eligible SHA is validated.

## Evidence and Audit Contract
Each promotion attempt must emit machine-readable evidence (JSON/Markdown) with:
- `prodSha`,
- gate results map,
- decision (`DEPLOYED` / `BLOCKED` / `ROLLED_BACK`),
- timestamps and service scope,
- rollback reason (if any).

Evidence artifacts are mandatory for operational traceability and release audits.

## Ownership
- Repository-local validation scripts own gate evidence where possible.
- Ops owner owns Coolify deployment wiring and runtime health policy.
- Release owner signs off blocked/rollback incidents before reopening promotion flow.

## Fail-Closed Policy
Any uncertainty in gate state, artifact state, or SHA identity results in blocked promotion.

There is no "best effort" promotion path to production.
