---
type: history_index
status: canonical
area: documentation
last_verified: 2026-05-23
---

# History Overview

This folder preserves historical project records. It is not the current source
of truth for product behavior, architecture, operations, or release readiness.
Start from `docs/` for current documentation and from `.agents/state/` or
`.codex/context/` for active work state.

## Sections

| Folder | Role | Start here |
| --- | --- | --- |
| `history/tasks/` | Completed task contracts and execution packets. | [Tasks](./tasks/task-history.md) |
| `history/plans/` | Historical plans, remediation notes, decision packets, and closure notes. | [Plans](./plans/plan-history.md) |
| `history/audits/` | Audits, baselines, inventories, parity matrices, scan summaries, and review reports. | [Audits](./audits/audit-history.md) |
| `history/evidence/` | Human-readable proof: smoke checks, readbacks, restore/rollback proof, SLO observations, and deployment evidence. | [Evidence](./evidence/evidence-history.md) |
| `history/releases/` | Release packets, final preflights, RC gate records, sign-off history, and release scorecards. | [Releases](./releases/release-history.md) |
| `history/artifacts/` | Raw generated artifacts: JSON, logs, TXT, CSV, XLSX, screenshots, and move manifests. | [Artifacts](./artifacts/raw-artifact-history.md) |

## Rules

- Do not place canonical architecture, product, module, UX, security, or
  operations truth here.
- Do not delete proof artifacts during cleanup; move or supersede them.
- When a historical record changes current behavior, normalize that behavior
  into `docs/` or `.agents/state/`, then link back to the history file as
  evidence.
- New generated evidence should default to `history/evidence/` for readable
  reports and `history/artifacts/` for raw machine output.
