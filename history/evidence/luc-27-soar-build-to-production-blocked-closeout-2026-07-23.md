# LUC-27 Soar Build-To-Production Blocked Closeout

Date: 2026-07-23
Owner: 11 Innovation / coordinator closeout

## Scope

Integrate the terminal runtime-recovery evidence for the parent Soar
build-to-production mission and record why the parent still cannot close as a
released production success for the current local branch tip.

## What Is Verified

The currently deployed Soar production runtime is green on Thursday,
July 23, 2026:

- generated project truth index reports `totalGaps=0`;
- public `GET /health -> 200`;
- public `GET /ready -> 200`;
- protected `GET /ready/details -> 200`;
- protected `GET /workers/ready -> 200`;
- protected `GET /workers/runtime-freshness -> 200 PASS`.

The governed incident/recovery chain is also terminal through:

- `LUC-1547` coordination closeout;
- `LUC-1556` QA verification;
- `LUC-1568` protected proof;
- `LUC-1706` `workers-execution` recovery;
- `LUC-1569` managed Redis/Coolify projection evidence.

## Exact Release Truth

The exact SHA covered by the green Thursday, July 23, 2026 production proof is:

`b0b2c2ce9477a32fcda7717f447ad46aa4327589`

The local workspace `HEAD` is different:

`40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`

The local workspace is:

- `142` commits ahead of deployed/tested production;
- not pushed/released in this heartbeat;
- not covered by the July 23 production smoke evidence.

## Why The Parent Stays Blocked

`LUC-27` cannot close as `done` yet because runtime health on deployed
production is not equivalent to release parity for the local candidate.

The first-class blocker is:

`RELEASE_PARITY_NOT_ACHIEVED`

Concrete meaning:

- independent CRS/QVE/Security review has not yet approved the exact local
  candidate `40cfb8f2...`;
- no formal no-force push approval has been granted for that candidate;
- GitHub parity for the candidate has not yet been established;
- no component-specific production deployment approval/execution exists for the
  candidate;
- no fresh public/protected smoke exists on production for the candidate.

## Unblock Owner Path

1. CRS/QVE/Security independently review exact candidate
   `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`.
2. Release owner requests formal no-force push approval for that exact SHA.
3. After push, verify GitHub parity on the intended release branch.
4. Request separate component-specific production deployment approval.
5. Deploy the approved candidate and rerun fresh public/protected smoke.

Only after that path can `LUC-27` move from `blocked` to `done`.

## Boundaries

- No push, deploy, restart, rollback, env edit, secret readback, or production
  mutation occurred in this closeout heartbeat.
- No direct remote `redis-cli PING` path exists in this runner, so Redis health
  remains accepted through managed `LUC-1569` Coolify projection evidence plus
  the restored public/protected readiness path.
- Build provenance still reports `metadataSource=env-runtime`, so the packet
  relies on combined build-info readback, git lineage, and same-day smoke
  evidence rather than immutable artifact attestation.

## Final Parent Disposition

`LUC-27` should remain:

`BLOCKED / PROJECT_TRUTH_ZERO_GAPS / PRODUCTION_RUNTIME_GREEN / RELEASE_PARITY_NOT_ACHIEVED / LOCAL_HEAD_142_COMMITS_AHEAD`
