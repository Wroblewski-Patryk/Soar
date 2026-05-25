---
type: docs_map
status: canonical
area: agent_workflow
last_verified: 2026-05-23
graph_role: map
---

# Agent Work Map

## Startup Path

1. [Soar documentation map](../soar-documentation-map.md)
2. [Agent operating system](../../.agents/core/operating-system.md)
3. [Project memory index](../../.agents/core/project-memory-index.md)
4. [Mission control](../../.agents/core/mission-control.md)
5. [Quality gates](../../.agents/core/quality-gates.md)

## Active Work State

Use these paths as the current execution truth:

| Path | Use |
| --- | --- |
| `.agents/state/active-mission.md` | First router for continuation. |
| `.agents/state/current-focus.md` | Current focus and release truth. |
| `.agents/state/next-steps.md` | Next executable work. |
| `.agents/state/module-confidence-ledger.md` | Module reality map. |
| `.agents/state/requirements-verification-matrix.md` | Requirement-to-proof table. |
| `.agents/state/risk-register.md` | Risk reality map. |
| `.codex/context/TASK_BOARD.md` | Queue and done records. |
| `.codex/context/LEARNING_JOURNAL.md` | Recurring pitfalls. |

## Decision Routes

| If You Need To | Use This Source First | Do Not Substitute With |
| --- | --- | --- |
| Choose the next executable task | `.agents/state/active-mission.md`, then `.agents/state/next-steps.md` and `.codex/context/TASK_BOARD.md` | old unchecked boxes in historical plans |
| Decide if behavior is allowed | `docs/architecture/` numbered set and relevant reference contract | a task note or audit conclusion alone |
| Find implementation ownership | `docs/modules/module-registry.md` and the relevant module deep dive | a route filename alone |
| Prove a current claim | latest validation in state plus `history/evidence/` or `history/releases/` | old screenshots, stale release packets, or chat memory |
| Record a completed task | `history/tasks/` | `docs/planning/` or `docs/operations/` |
| Record raw generated output | `history/artifacts/` | current docs folders |
| Update active queue truth | `.codex/context/TASK_BOARD.md` and current planning docs | historical task reports |

## Before Saying Verified

Use evidence-backed language only:

| Status | Required Evidence |
| --- | --- |
| `verified` | Fresh validation or proof is named and reachable. |
| `partially verified` | Passing and missing scenarios are listed. |
| `blocked` | Exact blocker and unblock action are listed. |
| `implemented, not verified` | Code or docs changed but proof is not complete. |
| `failed` | Fresh validation failed and the failure is recorded. |

For docs-only work, verification usually means link checks, graph/orphan scans,
guardrails, docs parity, and state/task sync. For runtime, money, auth,
deployment, or AI work, use the stronger scope-specific gates from AGENTS and
`.agents/core/quality-gates.md`.

## Historical Lookup

Start with [History overview](../../history/history-overview.md), then choose
one semantic folder:

| Folder | Use |
| --- | --- |
| `history/tasks/` | Completed task contracts. |
| `history/plans/` | Old plans and closure notes. |
| `history/audits/` | Audits and scan reports. |
| `history/evidence/` | Human-readable proof. |
| `history/releases/` | Release gates and sign-offs. |
| `history/artifacts/` | Raw machine output. |

## Use This Map When

- starting a new coordinator chat;
- deciding whether a request is single-lane or multi-lane;
- finding proof before marking work verified;
- updating durable memory after a task.
