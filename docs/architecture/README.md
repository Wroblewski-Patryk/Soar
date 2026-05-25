# Architecture Documentation

This folder is the canonical source of truth for how the application works.

Use these files when the question is:

- what the system is
- how runtime flows work
- which entity owns which state or responsibility
- which invariants are fail-closed or non-negotiable

Do not use this folder for:

- execution plans
- rollout waves
- closure notes
- evidence packs
- module inventory
- implementation task history

Those belong elsewhere:

- `docs/planning/` for change sequencing and open work
- `docs/modules/` for code ownership and implementation deep-dives
- `docs/operations/` for runbooks, smoke checks, and evidence
- `docs/product/` for product intent and scope

## Reading Order

1. `architecture-source-of-truth.md`
2. `system-architecture.md`
3. `tech-stack.md`
4. `codebase-map.md`
5. `traceability-matrix.md`
6. `architecture-evidence-graph-system.md` when the project has enough surface
   area to need graph-backed traceability
7. any project-specific architecture or ADR files added later

## Architecture Rules

- one file should have one clear responsibility
- resolved architecture decisions belong here, not only in planning notes
- module docs may explain implementation, but they do not override this folder
- if a rule matters for runtime safety, ownership, or invariants, it must be
  explicit here
- user-facing and runtime-significant functions should be represented in the
  graph registry and chain registry once the project is beyond a small
  prototype
