# LUC-1556 Redis Recovery Verification Evidence

Date: 2026-07-21
Owner: Soar Product Manager

## Wake

- Issue: `LUC-1556` `[Soar][QVE] Verify Redis recovery smoke and acceptance ledger after cache-only rebuild`
- Wake reason: `issue_blockers_resolved`
- Latest issue comment observed in-thread: system assignment note explaining the issue had no assignee and was re-assigned to the blocker owner

## Scope

Verify the post-recovery Soar runtime from the production-facing side and record the acceptance-ledger state without mutating production, secrets, or deployment resources.

## Checks

| Check | Result |
| --- | --- |
| API `https://api.soar.luckysparrow.ch/health` | `200` |
| API `https://api.soar.luckysparrow.ch/ready` | `200` |
| Web `https://soar.luckysparrow.ch/` | `200` |
| Web `https://soar.luckysparrow.ch/api/build-info` | `200` |
| Web build-info `gitSha` | `b0b2c2ce9477a32fcda7717f447ad46aa4327589` |
| Web build-info `metadataSource` | `env-runtime` |
| API `https://api.soar.luckysparrow.ch/ready/details` without operator auth | `401` |
| API `https://api.soar.luckysparrow.ch/workers/ready` without operator auth | `401` |
| Names-only `COOLIFY_*` binding check in this runner | all absent |
| Names-only smoke/auth binding check in this runner | no usable `SMOKE_AUTH_*`, `PROD_*`, or `ADMIN_JWT` binding present |

## Interpretation

- Public Soar health and readiness have recovered.
- The protected operator routes still require an approved auth/session path that is not present in this runner.
- This heartbeat did not perform direct `redis-cli PING` or Coolify resource readback because the required Coolify/runtime bindings were not available in the local runner context.

## Required Follow-Up

1. Ops Release Lead or Security Review Lead provides an approved production smoke auth session/token or executes the protected proof path directly.
2. Rerun the protected `/ready/details` and worker readiness checks.
3. Refresh the Soar acceptance ledger and project-truth rows once the protected proof path is available.
