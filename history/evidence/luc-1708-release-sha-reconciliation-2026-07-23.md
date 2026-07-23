# LUC-1708 Release SHA Reconciliation

Date: 2026-07-23
Owner: Deployment and Reliability Engineer

## Scope

Identify the exact Soar SHA that was actually tested on Thursday,
July 23, 2026, then distinguish that deployed runtime from the unreleased local
branch tip in the assigned workspace.

## Current Public Production Readback

- `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - body: `{"status":"ready","service":"api"}`
- `GET https://soar.luckysparrow.ch/api/build-info -> 200`
  - `gitSha=b0b2c2ce9477a32fcda7717f447ad46aa4327589`
  - `gitRef=main`
  - `metadataSource=env-runtime`
  - `checkedAt=2026-07-23T02:28:54.183Z`

## Local Versus Deployed Git Lineage

- local workspace `HEAD`:
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`
- deployed remote tip `origin/main`:
  `b0b2c2ce9477a32fcda7717f447ad46aa4327589`
- exact local ahead count over deployed `origin/main`:
  `142`
- merge-base of local `HEAD` and `origin/main`:
  `b0b2c2ce9477a32fcda7717f447ad46aa4327589`

This proves the currently deployed Soar line is an ancestor of the local
workspace branch. No newer local commit in this workspace has been pushed or
observed on production in this heartbeat.

## Exact Tested SHA Classification

The exact Soar SHA tied to the green Thursday, July 23, 2026 runtime evidence
is:

`b0b2c2ce9477a32fcda7717f447ad46aa4327589`

Why this is the correct tested SHA:

- current production build-info still reports `b0b2c2ce...`;
- accepted same-day QA verification for `LUC-1556` recorded public
  `/health -> 200`, `/ready -> 200`, Web `/api/build-info -> 200`, protected
  `/ready/details -> 200`, protected `/workers/ready -> 200`, and protected
  `/workers/runtime-freshness -> 200 PASS`;
- that accepted July 23 runtime packet also recorded build-info on the same SHA
  `b0b2c2ce...`.

Therefore the tested production runtime and the deployed production SHA are the
same commit: `b0b2c2ce...`.

## Unreleased Local Delta

The local branch tip in this workspace is:

`40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`

That local tip is 142 commits ahead of the deployed production SHA. Those
commits remain:

- local-only in this workspace;
- not observed on production in this heartbeat;
- not covered by the green July 23 production smoke evidence.

Release-safe wording from this point forward:

- `tested production SHA`: `b0b2c2ce9477a32fcda7717f447ad46aa4327589`
- `local unreleased tip`: `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`
- `source/deploy gap`: `142 commits`

## Residual Risk

- Production runtime is healthy, but build provenance still reports
  `metadataSource=env-runtime`, so provenance is diagnostic rather than a
  stronger immutable build-metadata path.
- This lane did not push, deploy, or approve any of the 142 local commits.
- Any future release candidate must be tested and promoted from a clean,
  intentional source-control packet instead of inheriting the July 23
  production proof automatically.

## Corrected Disposition

Status: `BLOCKED / RELEASE_PARITY_NOT_ACHIEVED`.

This readback is useful evidence of the source/deployment gap, but it does not
reconcile that gap and cannot close `LUC-1708` or parent `LUC-27`. Candidate
`40cfb8f2cf913966f9c7159b49ae256b2aebbcaa` still requires independent
CRS/QVE/Security review, an exact no-force push approval, verified GitHub
parity, a separate component-specific production deployment approval with
rollback baselines, and fresh public/protected runtime evidence.
