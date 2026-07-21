# LUC-1568 Protected Readiness Post Redis Recovery Evidence

Date: 2026-07-21
Owner: Security Review Lead

## Wake

- Issue: `LUC-1568` `[Soar][SPA] Execute approved protected readiness proof after Redis recovery`
- Wake reason: `issue_assigned`
- Inline wake comments: `0/0`
- Latest comment id: `unknown`
- Fallback fetch needed: `no`

## Scope

Verify the protected readiness posture after Redis recovery without mutating production, secrets, or deployment resources.

## Result

`PARTIALLY VERIFIED / PUBLIC_HEALTH_READY / PROTECTED_PROOF_BLOCKED / NO_SMOKE_AUTH_PATH`

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
| Names-only smoke/auth binding check in this runner | no usable `SMOKE_AUTH_*`, `PROD_*`, or `ADMIN_JWT` binding present |

## Interpretation

- Public Soar health and readiness are back in a ready state.
- The protected operator routes still require an approved auth/session path that is not present in this runner.
- This heartbeat did not perform direct Redis mutation, deployment mutation, or secret/account readback.

## Unblock Owner / Action

Ops Release Lead or Security Review Lead must provide an approved production smoke auth session/token, or execute the protected proof path directly, so QVE can rerun the protected readiness probes and refresh the acceptance ledger.

