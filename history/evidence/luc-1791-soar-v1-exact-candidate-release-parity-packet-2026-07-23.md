# LUC-1791 Soar V1 Exact-Candidate Release-Parity Packet

Date: Thursday, July 23, 2026
Owner: `09 EDL (Engineering Delivery Lead)`
Sale-readiness contract: `docs/planning/soar-v1-sale-readiness-contract.md`

## Scope

Resolve the release-parity truth for the v1.0 sale-readiness candidate named in
the current contract and gap register, then record whether a real deploy-approval
path still targets that SHA.

This heartbeat does not push, deploy, restart, roll back, edit env, read
protected credentials, or mutate production.

## Exact Candidate Reconciliation

The sale-readiness contract and gap register were opened against local candidate:

- `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`

Current repository and public production truth on Thursday, July 23, 2026 is:

- `git rev-parse HEAD` ->
  `ca712e98b70e157b643db4f57726a02821a140bc`
- `git rev-parse origin/main` ->
  `ca712e98b70e157b643db4f57726a02821a140bc`
- `git rev-list --left-right --count 40cfb8f2...ca712e98` -> `0 5`
- `git merge-base 40cfb8f2... ca712e98...` ->
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`
- public `GET https://api.soar.luckysparrow.ch/health -> 200`
- public `GET https://api.soar.luckysparrow.ch/ready -> 200`
- public `GET https://soar.luckysparrow.ch/api/build-info -> 200`
  with:
  - `gitSha=ca712e98b70e157b643db4f57726a02821a140bc`
  - `gitRef=main`
  - `metadataSource=env-runtime`
  - `checkedAt=2026-07-23T13:50:26.096Z`

This proves the original sale-readiness candidate `40cfb8f2...` was superseded
by five later commits on the same branch and is no longer the active release
target. The exact SHA currently aligned across local `HEAD`, `origin/main`, and
public production build-info is `ca712e98...`.

## Release-Parity Classification

### Superseded candidate `40cfb8f2...`

Classification: `implemented but not current target`

- It remains a real historical commit.
- It is not the current repository `HEAD`.
- It is not the current `origin/main`.
- It is not the SHA currently reported by public production build-info.

Result:

- no deploy-approval packet should be opened for `40cfb8f2...`;
- no-force-push review for that SHA is obsolete in the current release truth;
- any release claim must target `ca712e98...` or a later explicitly selected
  candidate.

### Current exact candidate `ca712e98...`

Classification: `implemented and verified`

Verified in this heartbeat:

- local source parity: `HEAD = ca712e98...`
- remote branch parity: `origin/main = ca712e98...`
- deployed public build-info parity:
  `gitSha = ca712e98...`, `gitRef = main`
- public runtime reachability on the same date:
  `/health -> 200`, `/ready -> 200`

This is sufficient to close the EDL release-parity packet scope for the current
exact candidate: the claimed candidate is no longer "local only" or "142 commits
ahead"; it is the current branch tip and the current deployed public build-info
SHA.

## What This Packet Does Not Claim

This packet does not claim:

- protected-route or worker-identity proof for `ca712e98...`;
- owner-acceptance completion;
- immutable artifact attestation stronger than current
  `metadataSource=env-runtime`;
- authorization for a new production mutation.

Those remain separate lanes:

- protected acceptance / supportability: `09 QVE` via `LUC-1793`
- owner acceptance / protected proof boundary: `10 SPA` via `LUC-1792`

## Sale-Readiness Impact

`SRG-001 Release provenance` is no longer blocked by the old
`40cfb8f2...` candidate mismatch.

Updated release-safe wording for Thursday, July 23, 2026:

- superseded candidate from the earlier same-day packet:
  `40cfb8f2cf913966f9c7159b49ae256b2aebbcaa`
- current exact candidate aligned across local `HEAD`, `origin/main`, and
  public production build-info:
  `ca712e98b70e157b643db4f57726a02821a140bc`

Soar v1.0 still remains `NO-GO`, but the remaining first-class blockers are now:

1. exact-candidate protected acceptance and supportability proof
2. owner-acceptance through the approved redacted method boundary

## Residual Risk

- Public build-info still reports `metadataSource=env-runtime`, so provenance is
  still diagnostic rather than immutable artifact attestation.
- This workspace is currently dirty from docs/state/evidence updates, so it is
  not itself a clean release-packeting workspace for creating a newer candidate.
- Protected production surfaces were not re-read in this heartbeat; that
  verification remains with `LUC-1793`.
