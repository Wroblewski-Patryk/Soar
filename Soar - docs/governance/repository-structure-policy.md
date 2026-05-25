# Repository Structure Policy

## Purpose
Define how files are placed in this repository to keep navigation predictable and avoid documentation drift.

## Root Minimalism Rules
Only true repository-level files stay in root:
- `README.md`
- `AGENTS.md`
- `CHANGELOG.md`
- `LICENSE` (if present)

Domain, planning, architecture, and operational docs must not be placed in root.

## Documentation Placement Rules
All domain documentation belongs under `docs/` using the category folders:
- `architecture/`
- `analysis/`
- `contracts/`
- `engineering/`
- `flows/`
- `maps/`
- `modules/`
- `pipelines/`
- `planning/`
- `product/`
- `operations/`
- `security/`
- `testing/`
- `ux/`
- `governance/`
- `adr/`

`docs/documentation-overview.md` is the canonical index and must be updated whenever files are moved or renamed.

## Migration Rules for Root Docs
When a non-repo markdown file appears in root:
1. Move it into the correct `docs/` category.
2. Update references in all markdown files.
3. Record the mapping (`old -> new`) in the change report or changelog.
4. Do not delete content unless it is duplicated and already preserved in canonical docs.

## Cross-Project Isolation Rules
- Do not use sibling-repository references.
- Do not use absolute local machine paths.
- Do not use unresolved template shortcuts such as unresolved template shortcut markers.
- Use repository-relative links only.

## Link and Integrity Rules
- No broken internal links after any doc migration.
- Keep content in English.
- Preserve project assumptions, decisions, and historical notes when restructuring.

## Evidence and Artifact Naming

- Prefer `kebab-case` for markdown docs.
- Suffix historical evidence docs with an ISO date: `-YYYY-MM-DD`.
- If evidence maps to a specific deploy boundary, include a short commit SHA in
  the filename: `-<sha7>`.
- Store completed task contracts in `history/tasks/`.
- Store old plans, remediation notes, and closure notes in `history/plans/`.
- Store audit reports, baselines, inventories, and scan reports in
  `history/audits/`.
- Store readable proof and verification evidence in `history/evidence/`.
- Store release packets, preflights, RC records, sign-offs, and scorecards in
  `history/releases/`.
- Store generated outputs (JSON, logs, screenshots, exports, CSV, XLSX, and
  other raw machine output) in `history/artifacts/`.
- Prefix generated artifacts with `_artifacts-` when useful to keep them
  visibly non-canonical and easy to filter.
- Include enough context to disambiguate environment and command intent (for
  example: `prod`, `staging`, `local`, `vps`).

## Current Docs Versus History

Use `docs/` for durable current knowledge:

| Folder | Use |
| --- | --- |
| `docs/architecture/` | Canonical behavior, invariants, ownership, safety, and parity. |
| `docs/modules/` | Implementation ownership, dependencies, routes, and tests. |
| `docs/pipelines/` | Current end-to-end flows. |
| `docs/operations/` | Living runbooks, smoke checks, rollback, incident, and operator procedures. |
| `docs/planning/` | Active queue, durable plans, roadmap, and unresolved decisions. |
| `docs/maps/` | Human and agent navigation hubs. |

Use `history/` for records of what happened, what was tested, or what was
generated. Historical files may prove a claim, but they do not own current
behavior unless the current owner doc points to them as evidence.

## Canonical Planning Paths
- `docs/planning/mvp-execution-plan.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/v1-live-release-plan.md`
- `docs/planning/open-decisions.md`
- `docs/planning/repo-migration-plan.md`
- `docs/planning/mobile-parity-contract.md`

## App Folder Naming Policy
- Current runtime naming in repository: `apps/web`, `apps/api`.
- Target naming after staged migration: `apps/web`, `apps/api`, `apps/mobile`.
- Migration must follow non-breaking staged rollout from `docs/planning/repo-migration-plan.md`.

## Mobile Bootstrap Policy
- `apps/mobile` may exist as scaffold before implementation starts.
- Bootstrap-only mobile folders must not claim production readiness.
- Full mobile delivery starts only after parity gates defined in `docs/planning/mobile-parity-contract.md`.
