# 12 Documentation Governance

## Purpose
Define where architectural truth lives and how documentation must be maintained so humans and coding agents can rely on it.

## Canonical Roles by Folder
- `docs/architecture/`
  - how the system works
  - runtime flow, entities, ownership, invariants, parity, safety
- `docs/modules/`
  - where the code lives
  - implementation ownership, dependencies, routes, tests
- `docs/planning/`
  - active queue, durable planning, roadmap, and unresolved decisions
  - not completed task logs or dated execution history
- `docs/operations/`
  - how to run, verify, deploy, recover, and observe
  - living runbooks, checklists, operator guides, and current gate templates
- `docs/product/`
  - why the product exists and what scope it serves
- `docs/ux/`
  - presentation and interaction guidance
- `docs/maps/`
  - human and agent navigation hubs for product, architecture, runtime,
    release/ops, and agent workflow
- `history/`
  - completed task contracts, old plans, dated operational evidence, release
    packets, generated reports, raw artifacts, audit packets, and proof
    snapshots

## Open Decisions Rule
`docs/planning/open-decisions.md` must contain unresolved decisions only.

Resolved architecture decisions must be normalized into `docs/architecture/`.

## Module Deep-Dive Rule
`docs/modules/*.md` may explain implementation, but they must not redefine canonical behavior that belongs in architecture.

When a module deep-dive references behavior, it should link back to the relevant architecture file.

## Planning Rule
Plans may introduce a change proposal, but once accepted, the resulting source-of-truth behavior must be recorded in architecture, not left only in planning notes.

## Historical Rule
Closure notes, deltas, audits, and remediation snapshots are historical records. They are useful, but they are not the canonical description of how Soar works.

Historical records belong under semantic `history/` folders, not under
canonical `docs/` folders:
- `history/tasks/` for completed task contracts
- `history/plans/` for old plans, remediation notes, and closure notes
- `history/audits/` for audits, baselines, inventories, and scan reports
- `history/evidence/` for readable proof and verification records
- `history/releases/` for release gates, preflights, RC records, and sign-offs
- `history/artifacts/` for raw generated output and screenshots

If a historical record changes current behavior, normalize that truth into
`docs/architecture/`, `docs/modules/`, `docs/product/`, `docs/operations/`, or
`.agents/state/`, then link to the history file as evidence.

## Update Rule
Every meaningful runtime or structure change must update:
- at least one relevant architecture file when behavior or invariants changed
- relevant module docs when implementation ownership changed
- planning/context files when queue or status changed

## Review Rule
When code and docs disagree:
1. identify the intended canonical architecture
2. update architecture if the decision changed
3. update implementation and module docs to match
4. do not leave the truth split across several folders

## Compatibility Rule
Older architecture files may remain as supporting references or compatibility stubs, but they must clearly state when the numbered architecture set is authoritative.

## Related Files
- [Architecture Documentation](./architecture-documentation.md)
- [01 Overview and Principles](./01_overview-and-principles.md)
- [Architecture Reference Contracts](./reference/architecture-reference-contracts.md)
- [Architecture Archive](./archive/architecture-archive.md)
- [Documentation Maps](../maps/documentation-maps.md)
- [History Overview](../../history/history-overview.md)
