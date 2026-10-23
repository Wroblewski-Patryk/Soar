# Deployment Migration Strategy (Pipeline + Ownership)

Date: 2026-04-03  
Scope: Database migration policy for local Windows validation and the existing Coolify production deployment.

## Goal
Make DB migrations safe, deterministic, and auditable across local validation and an operator-controlled production deployment. There is no separate STAGE environment or second VPS.

## Ownership Model
- **Developer (author)**:
  - prepares migration in PR,
  - documents backward-compatibility impact,
  - marks risk level (`low`/`medium`/`high`) in release notes.
- **Local/CI validation**:
  - checks migration status and deploy on an isolated local `_test` database for the exact candidate SHA,
  - blocks production readiness when the local gate fails; this is not production proof.
- **Release owner / on-call**:
  - approves high-risk migration windows,
  - handles incident path and rollback coordination.

## Migration Policy (Non-Negotiable)
1. Production migration requires local isolated migration validation on the exact candidate SHA, a reviewed production backup/restore path, schema compatibility plan, and separate owner approval.
2. The production migration and post-deploy readback are separate required gates on the existing Coolify environment.
3. Failing migration blocks promotion (fail-closed).
4. No destructive schema change in same release without compatibility window:
   - first deploy: expand/compat mode,
   - second deploy: cleanup/drop only after app code no longer depends on old schema.

## Pipeline Sequence

### 1) Local Windows validation
On an isolated PostgreSQL `_test` database for the candidate SHA:
1. `pnpm --filter api exec prisma migrate status`
2. `pnpm --filter api exec prisma migrate deploy`
3. Start the candidate locally only when authorized; check API/worker compatibility and protected user journeys.

Record command exits, migration list, SHA, test database identity and any blockers. Local success does not prove the production database, deployment or signed-in production paths.

### 2) Production eligibility
Keep PROD unchanged until the exact SHA passes local gates, backup/restore and rollback are ready, migration/schema compatibility is reviewed, stop-before-start worker switching is planned, protected signed-in paths have an acceptance plan, and the owner separately approves the production window.

### 3) PROD rollout
For the approved exact SHA on existing Coolify:
1. verify a production backup checkpoint and a viable restore/rollback path,
2. stop old workers before starting candidate workers according to the cutover preflight,
3. run `pnpm --filter api exec prisma migrate deploy` in the controlled production sequence,
4. read back migration state, deployed SHA, API/Web/workers health and protected signed-in journeys.

If migration or health fails, mark the candidate blocked and follow the
[rollback mode-selection guard](deployment-rollback-playbook.md#rollback-modes).
For Service Stack cutover after any new process starts, mode D is required before
an old API or worker starts; if the start history is unknown, use mode D or
STOP/NO-GO.

## Backward-Compatible Release Pattern
Recommended two-phase schema evolution:
1. **Expand**:
   - add nullable columns/tables/indexes,
   - keep old fields operational.
2. **Switch**:
   - deploy application logic using new schema.
3. **Contract** (later release):
   - remove old columns/constraints only after runtime evidence confirms no usage.

## Incident Handling
If migration fails:
1. stop promotion immediately,
2. keep previous stable version in service,
3. capture incident evidence:
   - migration name,
   - failing SQL/error,
   - SHA and environment,
   - operator actions.
4. require a fresh fix SHA, repeated local isolated validation and a new owner-approved production decision before another attempt.

## Evidence Contract
Each rollout writes migration evidence with:
- SHA,
- environment (`local` or `prod`),
- applied migration list,
- command exit status,
- timestamp,
- operator/automation identity.

Evidence must be attached to release checklist before sign-off.
