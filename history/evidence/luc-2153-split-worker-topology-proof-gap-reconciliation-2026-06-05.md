# LUC-2153 Split-Worker Topology Proof-Gap Reconciliation

Date: 2026-06-05
Owner: Ops Release Lead
Issue: [LUC-2153](/LUC/issues/LUC-2153)

## Result

Status: partially verified.

The production split-worker resource topology is verified from existing
read-only Coolify proof. Full worker readiness is not verified by this
reconciliation and remains a protected release-smoke requirement.

## Wake Context

- Reason: `issue_assigned`
- Status at wake: `in_progress`
- Priority: `high`
- Pending comments: `0/0`
- Latest comment id: `unknown`
- Fallback fetch needed: `no`
- Latest comment impact: no comment delta; the scoped wake directly assigned
  the Ops reconciliation for split-worker topology proof gaps.

## Source Evidence Reviewed

| Source | Finding | Status |
| --- | --- | --- |
| `docs/architecture/09_integrations-deployment-and-runtime-services.md` | Deployed target must use split workers; canonical worker families are `market-data`, `market-stream`, `backtest`, and `execution`; readiness must not imply full topology from a subset. | architecture source reviewed |
| `history/evidence/luc-2149-coolify-read-only-production-status-access-2026-06-05.md` | Read-only Coolify proof resolves Soar production to eight resources: `soar-api`, `soar-web`, four worker applications, PostgreSQL, and Redis. | verified |
| `docs/operations/service-topology.md` | Service topology now records `LUC-2153` reconciliation and separates resource topology from protected readiness. | updated |
| `docs/operations/coolify-vps-deployment-contract.md` | Deployment contract now records `LUC-2153` as resource-topology verified and readiness-gap retained. | updated |
| `docs/operations/runtime-config-ledger.csv` | Runtime ledger now points production worker rows at `LUC-2153`/`LUC-2149` evidence and keeps readiness as a protected-smoke gap. | updated |

## Reconciled Proof Matrix

| Claim | Evidence | Reality status | Release interpretation |
| --- | --- | --- | --- |
| Production environment has separate worker resources for `market-data`, `market-stream`, `backtest`, and `execution`. | `LUC-2149` project/environment readback lists `workers-market-data`, `workers-market-stream`, `workers-backtest`, and `workers-execution`. | verified | The architecture topology claim is satisfied at Coolify resource inventory level. |
| Production data services are present for worker dependencies. | `LUC-2149` readback lists PostgreSQL and Redis as `running:healthy`. | verified | Supports topology inventory, not application-level worker freshness by itself. |
| Application-level worker processes are fully ready. | Coolify application inventory status is `running:unknown`; no protected `/workers/ready` proof was run in this issue. | partially verified | Remains a release-gate gap requiring approved read-only protected smoke. |
| Worker queue ownership, runtime freshness, and worker log health are current. | Not part of read-only Coolify inventory proof. | not verified in this issue | Must be proven by protected worker readiness/freshness smoke before production readiness claims. |

## Safety Boundary

- No deploy, restart, rollback, environment edit, database action, team setting
  change, account action, protected smoke, live-trading action, or production
  mutation was performed.
- No secret values, raw Coolify resource ids, generated database suffixes,
  cookies, tokens, or screenshots were stored.
- `COOLIFY_SOAR_APP_ID` was not used as release authority; the verified model
  remains `project -> production environment -> resources`.

## Verification

- `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- `git diff --check -- docs/operations/service-topology.md docs/operations/coolify-vps-deployment-contract.md docs/operations/runtime-config-ledger.csv history/evidence/luc-2153-split-worker-topology-proof-gap-reconciliation-2026-06-05.md history/tasks/luc-2153-reconcile-split-worker-topology-proof-gaps-2026-06-05-task.md` -> PASS.

## Disposition

LUC-2153 is complete for Ops-owned reconciliation. It closes the documentation
ambiguity by distinguishing verified split-worker resource topology from the
remaining protected worker readiness proof gap. Deployment readiness remains
blocked on the normal protected worker smoke gate, not on this inventory
reconciliation.
