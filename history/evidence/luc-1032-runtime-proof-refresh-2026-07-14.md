# LUC-1032 Runtime Proof Refresh

- Date: 2026-07-14
- Owner: 09 RTE (Runtime & Adapter Engineer)
- Status: VERIFIED_LOCAL
- Scope:
  Account access feature-level proof refresh for
  `scripts/resolveOpsAuthToken.mjs` and
  `scripts/runControlledLiveSessionProof.mjs`.

## Result

The generated Account access `implemented_needs_proof` rows for
`scripts/resolveOpsAuthToken.mjs` and
`scripts/runControlledLiveSessionProof.mjs` are resolved in current local
project truth.

## Evidence

- Direct feature-level test relation added:
  `docs/architecture/relations/priority-test-links.csv` now maps
  `scripts/resolveOpsAuthToken.mjs` to
  `scripts/resolveOpsAuthToken.test.mjs`.
- Direct feature-level test relation added:
  `docs/architecture/relations/priority-test-links.csv` now maps
  `scripts/runControlledLiveSessionProof.mjs` to
  `scripts/runControlledLiveSessionProof.test.mjs`.
- Scoped metadata repair:
  `docs/architecture/scanner-overrides.json` now promotes both script entities
  to `verified` with evidence links to the existing focused tests and this
  evidence file.
- Focused proof:
  `node --test scripts/resolveOpsAuthToken.test.mjs scripts/runControlledLiveSessionProof.test.mjs`
  passed (`34` tests).
- Syntax proof:
  `node --check scripts/resolveOpsAuthToken.mjs` and
  `node --check scripts/runControlledLiveSessionProof.mjs` passed.
- CLI smoke:
  `node scripts/runControlledLiveSessionProof.mjs --help` passed.
- Generated readback:
  architecture awareness regenerated with `10937` entities / `36176`
  relations / `entityOverridesApplied=40` / `relationOverridesApplied=39`;
  app completion regenerated with `implementedNeedsProof=111` after the prior
  `113`; project truth regenerated and no longer routes either script feature
  as `implemented_needs_proof`.
- Readback advancement:
  the first Account access gap is now
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`
  as `missing_doc_link`.

## QA Acceptance

Pass:

- **Given** the ops-auth token resolver script is exercised through the focused
  local Node test harness, **when** valid header/cookie/env precedence and
  fail-closed scenarios are evaluated, **then** the existing focused proof
  passes and the feature-level script entity is now directly linked to that
  proof.
- **Given** the controlled live-session proof runner is exercised through the
  focused local Node test harness, **when** session gating, polling, exit, and
  fail-closed cases are evaluated, **then** the existing focused proof passes
  and the feature-level script entity is now directly linked to that proof.

Fail:

- None after final verification.

Blocked:

- None for the scoped local proof lane.

## Boundary

No runtime product logic change, production account mutation, protected-session
smoke against a real user, deploy, restart, rollback, env edit, migration,
database/Redis mutation, exchange/payment/subscription mutation, order,
position, or live-trading action occurred. Public probes made by the standard
project-truth generator remained read-only and returned healthy responses for
the configured web/API endpoints.

## Residual

The broader Account access backlog remains open. The next routed gap is
`apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`
as `missing_doc_link`; owner/action remains Docs Memory Lead + Project
Manager for direct documentation-link closure.
