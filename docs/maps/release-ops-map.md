---
type: docs_map
status: canonical
area: operations
last_verified: 2026-05-23
graph_role: map
---

# Release And Operations Map

## Primary Ops Path

1. [Operations Documentation](../operations/operations-documentation.md)
2. [Post-deploy smoke checklist](../operations/post-deploy-smoke-checklist.md)
3. [Deployment rollback playbook](../operations/deployment-rollback-playbook.md)
4. [Service reliability and observability](../operations/service-reliability-and-observability.md)
5. [V1 release gate runbook](../operations/v1-release-gate-runbook.md)

## Current State

Use the [current release board](../status/current-release-board.md) for the
exact candidate SHA, GO/NO-GO, evidence boundary, blockers, and single open
defect queue. The [current product contract](../product/current-version-contract.md)
owns required behavior; [deployment readiness gates](../operations/deployment-readiness-gates.md)
own the production proof criteria. Historical release packets do not replace
the board.

## Historical Evidence

Use `history/releases/release-history.md` for release packets,
`history/evidence/evidence-history.md` for readable proof, and
`history/artifacts/raw-artifact-history.md` for raw generated output.

## Use This Map When

- deploying, smoking, rolling back, or checking release readiness;
- finding production proof without treating old evidence as current truth;
- deciding whether a release claim is verified, partial, blocked, or failed.
