# Documentation Governance Workflow

## Objective
Keep Soar documentation usable as a reliable source of truth for both humans
and coding agents.

## Canonical Folder Roles
- `docs/architecture/`
  - canonical description of how Soar works
  - entities, runtime flow, ownership, invariants, parity, safety
- `docs/modules/`
  - implementation-facing deep-dives
  - source paths, dependencies, routes, test entrypoints
- `docs/planning/`
  - active queue, rollout sequencing, unresolved decisions
- `docs/operations/`
  - deployment, smoke checks, rollback, evidence, runbooks
- `docs/product/`
  - product intent, scope, limits, and user-facing policy
- `docs/ux/`
  - design system, UX constraints, parity evidence expectations

## Architecture Read Order
When work touches runtime behavior, read in this order:
1. `docs/architecture/README.md`
2. `docs/architecture/01_overview-and-principles.md`
3. the most relevant numbered architecture files for the task
4. related module deep-dives in `docs/modules/`

## Decision Promotion Rule
- If a behavior or invariant is accepted as the intended system rule, it must
  live in `docs/architecture/`.
- Do not leave accepted architecture only in:
  - `docs/planning/*.md`
  - closure notes
  - task summaries
  - module deep-dives

## Open Decisions Rule
- `docs/planning/open-decisions.md` is for unresolved decisions only.
- Once resolved:
  1. remove or close it there,
  2. write the resulting truth into `docs/architecture/`.

## Deep-Dive Rule
- `docs/modules/*.md` may explain implementation details.
- They must not become the primary source of runtime truth.
- When a module relies on an architecture rule, link to the architecture file.

## Historical Docs Rule
- Closure snapshots, remediation deltas, and audits are historical references.
- Keep them out of the canonical reading path.
- If retained, they should be archived or clearly marked non-canonical.

## When To Update Which Docs
### Update `docs/architecture/` when:
- runtime behavior changed
- source-of-truth ownership changed
- lifecycle, parity, or safety invariants changed
- a resolved decision changed how the system is supposed to work

### Update `docs/modules/` when:
- module boundaries or dependencies changed
- route ownership changed
- important implementation/test entrypoints changed

### Update `docs/planning/` when:
- queue or active wave changed
- a real unresolved decision appears

### Update `docs/operations/` when:
- deployment, smoke, rollback, or runbook behavior changed

## Anti-Drift Guardrails
- Prefer one canonical statement over repeated similar wording.
- Use compatibility stubs for old entry files rather than keeping two active
  versions of the same truth.
- Keep plan names, tier names, and runtime terms aligned with architecture.
- Avoid absolute local-machine paths in repository docs.

## Completion Checklist
Before closing docs-sensitive work:
1. confirm architecture truth is in `docs/architecture/`
2. confirm deep-dives link to architecture instead of redefining it
3. confirm planning files do not retain resolved truth as the main source
4. confirm indexes point to the current canonical reading path
