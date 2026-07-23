# LUC-1556 Protected Proof Still Blocked

Date: 2026-07-23
Owner: Soar Product Manager

## Context

`LUC-1568` completed and cleared the blocker chain for this issue. The issue was resumed on July 23, 2026 to re-attempt the protected readiness verification and acceptance ledger refresh.

## Checks

| Check | Result |
| --- | --- |
| Web `https://soar.luckysparrow.ch/api/build-info` | `200` |
| Web build-info `gitSha` | `b0b2c2ce9477a32fcda7717f447ad46aa4327589` |
| Web build-info `metadataSource` | `env-runtime` |
| API `https://api.soar.luckysparrow.ch/ready/details` | `401` |
| API `https://api.soar.luckysparrow.ch/workers/ready` | `401` |
| `SMOKE_AUTH_*` / `PROD_*` / `ADMIN_JWT` bindings in this runner | absent |

## Conclusion

Public recovery proof remains healthy, but the protected proof stage is still unavailable from this runner because the approved operator smoke credential/session path is not present.

## Required Next Action

Security Review Lead or Ops Release Lead must provide the approved protected smoke path. After that, QVE should rerun `/ready/details`, `/workers/ready`, and the acceptance ledger refresh.
