# Deployment Rollback Playbook (App/Env/Workers)

Date: 2026-04-03  
Scope: Controlled rollback procedure for failed STAGE/PROD rollout.

## Goal
Restore stable service quickly when deployment or post-deploy health gates fail.

## Rollback Triggers
Execute rollback when any required condition occurs:
1. API readiness stays red beyond rollout timeout.
2. Web is unavailable or fails critical smoke checks.
3. Worker runtime enters crash-loop or queue processing is stalled.
4. Migration causes incompatible runtime behavior.
5. Security/compliance gate fails and requires immediate revert.

## Ownership During Incident
- **Incident commander (on-call/release owner)**: declares rollback.
- **Ops executor**: performs environment/service rollback actions.
- **Backend owner**: validates API/workers recovery.
- **Frontend owner**: validates web recovery.

## Rollback Modes

### A) App Version Rollback (preferred)
Use previous stable deployment artifact/tag for:
- `api`,
- `web`,
- `workers` (same compatible set).

### B) Environment Rollback
If issue is configuration-only:
- restore previous env variable set,
- redeploy unchanged stable app artifact.

### C) Worker-Only Rollback
If web/api are healthy and issue is isolated to workers:
- rollback/restart worker services only,
- keep web/api online.

For a Coolify Service Stack cutover, do not use this fast path: the new API may
consume work inline. Follow the stop-before-start sequence in mode D instead.

### D) Coolify Service Stack Cutover Rollback
If the new Soar Service Stack fails after domain cutover:
- keep the old six Applications available until at least one stable monitoring
  window proves the stack;
- for every failure mode, follow the canonical
  [rollback stop-before-start sequence](coolify-linux-vps-setup-guide.md#rollback-from-stack-cutover):
  stop **new API and all four new workers**, then read back `Running=false` and
  `Pid=0` for every replica before starting any old API or worker;
- unknown/active container state, unresolved in-flight work or `UNKNOWN` order
  outcome, or unproven schema compatibility means **STOP/NO-GO**; preserve state
  for an operator decision rather than automatically replaying or restoring;
- never run destructive schema rollback ad hoc; use a proven compatible version
  or the separately approved backup/restore path.

The stack migration must not include production Postgres/Redis data movement
unless a separate data migration plan and restore proof are approved.

## Rollback Entry Point
- Tool: Coolify/manual operator rollback to the previous stable deployment.
- Trigger: failed production deployment or failed required post-deploy gate.
- GitHub Actions is not used for production rollback in the active setup.

## Standard Rollback Procedure
1. Freeze promotion pipeline for affected environment.
2. Identify last known stable release reference (tag/artifact/SHA).
3. Execute rollback mode (A/B/C/D), including its stop-before-start gates.
4. Re-run required post-rollback checks:
   - API `/health` + `/ready`,
   - web root + auth smoke,
   - workers readiness + queue heartbeat.
5. Mark incident status:
   - `ROLLED_BACK`,
   - `STABLE_RESTORED` (after all checks green).

For Service Stack cutover rollback, also record whether old Applications were
left running, stopped, or domain-detached, and whether any stack containers
remain active for investigation.

## Migration-Aware Guard
If failed release included schema migration:
1. Prefer rollback to app version that remains compatible with current schema.
2. If schema rollback is required, execute only with approved rollback script and backup checkpoint.
3. Never run destructive schema rollback ad hoc in active incident without explicit approval.

For the LIVE order intent migration, a previous API or worker build that can
submit an order without reading `LiveOrderIntent` is not a safe rollback target
while unresolved intents exist. Disable LIVE submission first, inventory
unresolved intents and exchange order history, and select a schema-compatible
build that preserves lookup-only recovery. Resume LIVE only after the operator
has reconciled unknown outcomes; do not drop the intent table as part of a
routine application rollback. See
[LIVE order intent contract](../architecture/reference/live-order-intent-contract.md).

## Communication Template
Minimum incident update includes:
- environment (`stage`/`prod`),
- failing SHA,
- rollback target SHA/tag,
- affected services,
- ETA for stabilization,
- current gate status.

## Evidence Requirements
For each rollback event capture:
- trigger reason,
- decision timestamp,
- executor identity,
- target rollback version/env snapshot,
- post-rollback gate results,
- final service state.

Attach evidence to release records and postmortem workflow.

## Exit Criteria
Incident may be closed only when:
1. rollback target is stable,
2. required health/smoke gates are green,
3. promotion pipeline remains blocked until fix SHA is validated on STAGE.
