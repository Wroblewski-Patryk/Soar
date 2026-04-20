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
  - what is being changed next
  - temporary sequencing, rollout waves, active queue
- `docs/operations/`
  - how to run, verify, deploy, recover, and observe
- `docs/product/`
  - why the product exists and what scope it serves
- `docs/ux/`
  - presentation and interaction guidance

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
- [Architecture README](./README.md)
- [01 Overview and Principles](./01_overview-and-principles.md)
- [Reference README](./reference/README.md)
- [Archive README](./archive/README.md)
