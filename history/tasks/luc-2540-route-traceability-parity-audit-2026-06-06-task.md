# Task

## Header
- ID: LUC-2540
- Title: Add route traceability parity audit from architecture docs
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Module Confidence Rows: architecture/docs parity confidence
- Requirement Rows: route traceability parity
- Quality Scenario Rows: documentation drift prevention
- Risk Rows: route architecture docs drift
- Iteration: 2026-06-06
- Operation Mode: TESTER
- Mission ID: LUC-2540-ROUTE-TRACEABILITY-PARITY-AUDIT-2026-06-06
- Mission Status: VERIFIED

## Context
LUC-2540 was assigned to QA to add a route traceability parity audit from the
architecture docs. Existing tooling compared generated Web/API inventory to
`docs/architecture/traceability-matrix.md` and
`docs/architecture/reference/dashboard-route-map.md`, but it did not fail when
the two architecture docs drifted from each other.

## Goal
Extend the existing route/API matrix parity guardrail so route-map architecture
docs must also be covered by the traceability matrix.

## Scope
- `scripts/checkRouteApiMatrixParity.mjs`
- `scripts/checkRouteApiMatrixParity.test.mjs`
- `docs/architecture/traceability-matrix.md`
- Source-of-truth state files for this task packet

## Implementation Plan
1. Reuse the existing route/API matrix parity checker.
2. Add architecture-doc parity buckets for route-map inventory routes and
   route-map primary API contracts missing from the traceability matrix.
3. Add focused regression coverage for route-map/traceability drift.
4. Repair current architecture-doc drift exposed by the stronger audit.
5. Run focused validation and update durable state.

## Acceptance Criteria
- The checker reports explicit route-map-to-traceability gap buckets.
- Focused checker tests cover the new architecture-doc drift failure mode.
- Current live route/API matrix parity passes with zero gaps.
- No runtime, deployment, protected smoke, account, secret, exchange, or
  live-trading mutation occurs.

## Definition of Done
- Existing checker extended without a parallel implementation.
- Canonical architecture docs are synchronized.
- Focused tests and live docs parity commands pass.
- Task and project state evidence are recorded.

## Validation Evidence
- Tests:
  - `node --check scripts/checkRouteApiMatrixParity.mjs`
  - `node --check scripts/checkRouteApiMatrixParity.test.mjs`
  - `node --test scripts/checkRouteApiMatrixParity.test.mjs` PASS (`6/6`)
  - `pnpm run docs:parity:route-api-matrix` PASS (`39` Web routes, `109` API endpoints, `0` gaps)
  - `pnpm run docs:parity:check` PASS (`22/22` API, `16/16` Web, `39/39` routes)
  - `git diff --check` PASS with line-ending warnings only
- Manual checks:
  - Reviewed `dashboard-route-map.md` and `traceability-matrix.md`.
  - Confirmed the stronger audit initially found `/privacy`, `/terms`, and
    `/dashboard/profile/apiKeys*` traceability drift, then passed after matrix
    repair.
- Module confidence ledger updated: yes
- Requirements matrix updated: not applicable
- Quality scenarios updated: not applicable
- Risk register updated: not applicable
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/architecture-documentation.md`
  - `docs/architecture/traceability-matrix.md`
  - `docs/architecture/reference/dashboard-route-map.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, within architecture docs only
- Decision required from user: no
- Follow-up architecture doc updates:
  - `traceability-matrix.md` now includes `/privacy`, `/terms`, and
    `/dashboard/profile/apiKeys*`.
  - Removed the obsolete current gap claiming endpoint-level generated matrix
    parity was not machine-generated.

## Security / Privacy Evidence
- Data classification: public repository docs/tooling only
- Secret handling: no secrets read, printed, or stored
- Permission or ownership checks: not applicable
- Fail-closed behavior: checker exits non-zero on route-map/traceability drift
- Residual risk: unrelated dirty `docs/architecture/relations/priority-test-links.csv`
  entries from LUC-2541/LUC-2543 were observed and left untouched.

## Result Report
- Task summary: extended route/API parity tooling with architecture-doc
  traceability buckets and synchronized current route docs.
- Files changed:
  - `scripts/checkRouteApiMatrixParity.mjs`
  - `scripts/checkRouteApiMatrixParity.test.mjs`
  - `docs/architecture/traceability-matrix.md`
  - source-of-truth state/task files
- How tested: focused syntax, focused unit/regression test, live route/API
  matrix parity, docs parity, and diff whitespace check.
- What is incomplete: no production or protected route proof was run because
  this was a docs/tooling QA guardrail task.
- Next steps: keep `pnpm run docs:parity:route-api-matrix` mandatory after Web
  route, API route, route-map, or traceability-matrix changes.
