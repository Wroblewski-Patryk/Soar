# Maintainability Remediation Contract

Status: Active  
Updated: 2026-04-21

## Purpose

Freeze the non-functional quality rules for the `CQLT` maintainability wave so
future cleanup preserves Soar runtime safety, docs parity, and route-level i18n
discipline.

## Scope

This contract governs:

- local copy dictionaries and hardcoded user-facing strings
- oversized production modules and extraction seams
- duplicated shared helpers across dashboard, bots, and runtime views
- exchange-bootstrap ownership drift
- fallback/default behavior that is currently uncatalogued
- repeated async UI state choreography

## Non-Regression Rules

1. Inventory before refactor.
2. Add guardrails before broad migrations.
3. Extract helpers before splitting monolith containers/services.
4. Do not mix behavior changes with structural decomposition unless a failing
   regression proves current behavior is already wrong.
5. Route-level user-facing strings must move toward canonical i18n namespaces or
   shared i18n-aware helpers.
6. Hidden fallbacks in critical paths are forbidden; unresolved/explicit states
   are preferred over silent inference.
7. Monolith decomposition must preserve current web/API contracts first and only
   then reduce file ownership scope.

## Canonical Execution Order

1. Inventory and contract freeze
2. Guardrails and red tests
3. Shared helper extraction
4. Web/API monolith decomposition
5. Fallback and legacy hardening
6. Closure validation and docs/context sync

## Ownership Rules

- `docs/architecture/` defines the permanent quality invariants.
- `docs/modules/` holds implementation-facing inventories and snapshots.
- `scripts/repoGuardrails.mjs` is the canonical enforcement point for new debt.
- `docs/governance/code-quality-guardrails.md` owns exception policy and
  allowlists that remain temporarily intentional.

## Frozen Hotspot Families

### Local Copy and Hardcoded UI Strings

- Do not add new production-local `copy` or `copyByLocale` dictionaries in
  `apps/web/src/**`.
- Do not add new raw user-facing toast/confirm/attribute literals outside the
  documented exception allowlist.

### Oversized Production Modules

- Production source files over 1000 lines require either:
  - an existing staged-decomposition allowlist entry, or
  - a dedicated decomposition task in canonical planning before merge.

### Shared Helper Duplication

- Shared dashboard/bots runtime concepts must keep one tracked inventory entry
  until they are extracted into common helpers.
- New duplicate helper families should be added to the duplicate-helper
  snapshot before additional reuse spreads.

### Exchange Ownership

- New product modules must not instantiate ad hoc `ccxt` clients when a shared
  adapter/service boundary already exists or is queued for extraction.

## Evidence Requirement

Any CQLT slice is only done when:

- touched guardrails/tests pass,
- the relevant inventory/snapshot docs are updated,
- queue/context docs reflect the new state, and
- no new production-local copy dictionary or silent monolith growth was
  introduced.
