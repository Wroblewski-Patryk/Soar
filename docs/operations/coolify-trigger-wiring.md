# Coolify Deployment Wiring (Production Only + Manual Operator Control)

Date: 2026-04-03  
Task: `DPL-18 ops(coolify)`; production-only update 2026-04-29

## Goal
Document the accepted production deployment control path for Coolify services:
- PROD deploy through Coolify/manual operator controls,
- PROD rollback through Coolify/manual operator controls.

Owner decision (2026-10-23): Soar has local Windows validation and the existing Coolify production environment only. Do not create STAGE resources, a second VPS, or stage deploy triggers. Production deploy remains a separately approved operator action for an exact SHA.

## GitHub Actions Policy

GitHub Actions is not used for production deployment in the active project
setup. Do not add or dispatch GitHub Actions workflows for production promote
or rollback unless the owner explicitly approves a separate workflow change.

## Coolify Side Setup
For each target service/app in Coolify:
1. Open service -> Deployments/Webhooks.
2. Keep only production service deployment controls active.
3. Keep rollback to previous stable deployment available in Coolify, subject to
   the [Service Stack mode D gate](coolify-linux-vps-setup-guide.md#rollback-from-stack-cutover)
   once any new stack process has started.
4. Keep webhook URLs out of the repository. If webhooks are used manually, they
   remain operator-held secrets and are not wired through GitHub Actions.

Legacy STAGE resources, if any are discovered, require a separate owner-reviewed inventory and cleanup decision. Do not remove resources or secrets automatically while documenting the current deployment path.

## Manual Coolify Chain Contract
1. Operator selects the intended repository SHA in Coolify.
2. Operator follows the stop-before-start worker switch and fail-closed
   preflight in `docs/operations/coolify-linux-vps-setup-guide.md` before any
   candidate worker starts. A one-click build-and-start path that cannot pause
   for this gate is not an approved mixed-version cutover.
3. Proof: wait until `https://soar.luckysparrow.ch/api/build-info` exposes the
   promoted SHA before runtime freshness and release gates run.
4. If checks fail after **any** new stack process starts, even before domain
   cutover, the operator follows
   [mode D stop-before-start](coolify-linux-vps-setup-guide.md#rollback-from-stack-cutover)
   before Coolify may start an old API or worker. If complete history and host
   readback prove that no new process ever started, mode A may be considered;
   uncertainty means mode D or STOP/NO-GO. A one-click restore is not an
   exception.

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
- Protect production controls with required owner/operator review; no STAGE environment is part of the current path.
