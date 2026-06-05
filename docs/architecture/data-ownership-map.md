# Data Ownership Map

Last updated: YYYY-MM-DD

## Purpose

Define which module owns each important data entity, who may write it, who may
read it, and which values are projections or caches.

## Data Ownership

| Entity / store | Source of truth | Write owner | Read consumers | Lifecycle | Risk | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| ExampleEntity | database table | example module | web/api | create/update/archive | medium |  |

## Rules

- Data writes happen only through the approved owner.
- Projections and caches must name their source.
- Deletes should be lifecycle transitions unless irreversible deletion is
  explicitly required.
- Cross-tenant/workspace ownership must fail closed.

## Maintenance Rule

When schema, persistence, cache, projection, import/export, or reset behavior
changes, update this map.

## Architecture-Awareness Doc-Link Classification

Last classified: 2026-06-05 under [LUC-2186](/LUC/issues/LUC-2186).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `apps/api/src/prisma/client.ts` | `docs/architecture/data-ownership-map.md` | Prisma client singleton boundary for API persistence access; module-level write ownership remains governed by the data ownership map and module docs. | Architecture-awareness `documents` relation from this doc plus API typecheck/persistence tests when Prisma client behavior changes. |
