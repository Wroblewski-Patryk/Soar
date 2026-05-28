# LUC-405 ARB-006 Protected Input Readiness Oscillation Addendum (2026-05-28)

## Context
- Issue: `LUC-405` (`[Soar][ARB-006][Ops]`)
- Expected SHA: `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`
- Scope: read-only readiness verification only (no deploy/restart/rollback/runtime mutation)

## What Changed
- Same-day protected-input readiness signals oscillated:
  - Earlier checkpoint: `BLOCKED` (`matching names: 0`)
  - Latest checkpoint (`2026-05-28`): `PARTIAL` (`matching names: 9`)
- Present families now: `PROD_UI_AUDIT_*`, `PROD_UI_*`
- Still missing families: `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, `SOAR_PROD_*`, `PROD_DB_CHECK_*`, `PRODUCTION_DB_CHECK_*`, `RC_*`, `GATE*` / `GATE_*`

## Ops Gate Rule For Window Execution
`ARB6-WIN-2026-05-30-A` remains `NO-GO` unless both conditions are true at T-30 (`2026-05-30 08:30 Europe/Berlin`):
1. Approved read-only principal/session can execute protected `GET /workers/ready`.
2. Protected-input readiness is stable at least across two consecutive checks in the same runner context, with all required families present.

## Required Unblock Owners And Actions
1. Soar auth credential owner + Security/Test owner:
   - provide approved read-only principal/session for `GET /workers/ready`.
2. Ops Release Lead + QA + Security + release controller:
   - restore all missing protected-input families in active runtime context,
   - execute two consecutive readiness checks in same context,
   - proceed with read-only evidence window only after both checks satisfy full-family presence.

## Current Disposition
- `blocked`
- Release posture: `NO-GO`
