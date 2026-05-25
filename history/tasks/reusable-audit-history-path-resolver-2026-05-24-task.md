# REUSABLE-AUDIT-HISTORY-PATH-RESOLVER-2026-05-24

## Context

After the documentation/history migration, reusable audit artifacts reference
canonical `history/*` evidence paths and retained some logical `docs/*`
source-of-truth paths that now resolve through the active `docs` root.
The reusable audit aggregate `audit:manifest:verify` still used older path
recognition in several checkers and failed before reaching the complete
validation chain.

## Goal

Restore reusable-audit validation compatibility with the current repository
layout without weakening missing-path checks.

## Constraints

- Keep path validation strict for real missing files.
- Accept `history/*` as repository-owned evidence paths.
- Resolve logical `docs/*` references through `docs` when the physical
  `docs` root is absent.
- Do not modify runtime behavior, production data, or LIVE exchange state.

## Definition Of Done

- Reusable audit manifest, rerun playbook, and handoff checkers resolve current
  docs/history paths.
- Their focused tests pass.
- The full `audit:manifest:verify` aggregate passes.

## Forbidden

- Do not ignore missing paths globally.
- Do not remove safety-boundary assertions.
- Do not claim protected production readiness from local audit tooling.

## Result Report

Status: **VERIFIED LOCAL**

Changed:

- `scripts/resolveRepositoryPath.mjs`
- `scripts/resolveRepositoryPath.test.mjs`
- `scripts/checkReusableAuditManifest.mjs`
- `scripts/checkReusableAuditRerunPlaybook.mjs`
- `scripts/checkFullReusableAuditHandoff.mjs`
- `scripts/checkAuditRemediationPlan.mjs`
- `scripts/checkFullReusableAuditRollup.mjs`
- `scripts/checkReusableAuditToolingIndex.mjs`

Validation:

- `node --check scripts/checkReusableAuditManifest.mjs` => `PASS`
- `node --check scripts/checkReusableAuditRerunPlaybook.mjs` => `PASS`
- `node --check scripts/checkFullReusableAuditHandoff.mjs` => `PASS`
- `node --check scripts/checkAuditRemediationPlan.mjs scripts/checkFullReusableAuditRollup.mjs scripts/checkReusableAuditToolingIndex.mjs`
  => `PASS`
- `node --check scripts/resolveRepositoryPath.mjs scripts/resolveRepositoryPath.test.mjs`
  => `PASS`
- `corepack pnpm run audit:manifest:check:test` => `14/14 PASS`
- `corepack pnpm run audit:rerun-playbook:check:test` => `12/12 PASS`
- `corepack pnpm run audit:handoff:check:test` => `10/10 PASS`
- `node --test scripts/checkAuditRemediationPlan.test.mjs scripts/checkFullReusableAuditRollup.test.mjs scripts/checkReusableAuditToolingIndex.test.mjs`
  => `26/26 PASS`
- `node --test scripts/resolveRepositoryPath.test.mjs scripts/checkAuditRemediationPlan.test.mjs scripts/checkFullReusableAuditHandoff.test.mjs scripts/checkFullReusableAuditRollup.test.mjs scripts/checkReusableAuditManifest.test.mjs scripts/checkReusableAuditRerunPlaybook.test.mjs scripts/checkReusableAuditToolingIndex.test.mjs`
  => `65/65 PASS`
- `corepack pnpm run audit:manifest:verify` => `PASS`

Residual Risk:

- This restores local audit tooling. It does not provide protected production
  credentials, approval context, `LIVEIMPORT-03`, rollback, UI clickthrough,
  or production DB restore proof.
