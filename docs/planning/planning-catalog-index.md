# Planning Catalog Index

Use this file when the repository accumulates many planning files and needs a
clear distinction between active, historical, blocked, and superseded plans.

## Purpose

This index prevents agents from treating every old planning file as active
work.

Canonical queue sources should still remain:

- `docs/planning/mvp-execution-plan.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/idea-ledger.csv` for ideas not yet converted into executable
  tasks

## Classification Legend

- `queued`
  explicitly owned by the current canonical queue
- `implemented`
  delivered and closed in canonical queues or closure notes
- `external-blocked`
  implementation mostly complete, waiting on production-only evidence or
  external dependency
- `superseded`
  historical or replaced by newer canonical planning artifacts

## Suggested Table

| Planning file | Classification | Canonical ownership | Notes |
| --- | --- | --- | --- |
| `docs/planning/example-wave.md` | queued | `NOW-01..NOW-03` | Short explanation |

## Rules

- update this index only when planning volume is large enough to justify it
- do not treat `superseded` items as active execution sources
- when a plan is completed or replaced, update this index in the same planning
  maintenance task
- when an idea becomes executable, connect it to
  `docs/planning/idea-to-function-chain-playbook.md`, graph chains, pipeline
  docs, and the canonical queue
- for broad app-completion audits, start from
  `docs/planning/application-completion-audit-task-contract-template.md` and
  publish the resulting finish queue into canonical planning/state files
