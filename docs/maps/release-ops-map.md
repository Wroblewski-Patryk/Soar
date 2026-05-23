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

Use these paths for the current operational reality:

| Path | Use |
| --- | --- |
| `.agents/state/current-focus.md` | Current release and proof focus. |
| `.agents/state/active-mission.md` | Current mission router. |
| `.agents/state/next-steps.md` | Next executable action. |
| `.codex/context/TASK_BOARD.md` | Active queue. |
| `.codex/context/PROJECT_STATE.md` | Current project state. |

## Historical Evidence

Use `history/releases/release-history.md` for release packets,
`history/evidence/evidence-history.md` for readable proof, and
`history/artifacts/raw-artifact-history.md` for raw generated output.

## Use This Map When

- deploying, smoking, rolling back, or checking release readiness;
- finding production proof without treating old evidence as current truth;
- deciding whether a release claim is verified, partial, blocked, or failed.
