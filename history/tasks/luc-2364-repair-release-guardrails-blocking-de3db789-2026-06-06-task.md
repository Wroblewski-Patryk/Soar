# LUC-2364 Repair Release Guardrails Blocking de3db789

## Header
- ID: LUC-2364
- Title: Repair release guardrails blocking `de3db789`
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: 09 TSA
- Priority: P0
- Module Confidence Rows: Bot Runtime, Architecture evidence graph, Release guardrails
- Requirement Rows: Release guardrail proof
- Quality Scenario Rows: Maintainability, release readiness
- Risk Rows: Runtime aggregate regression risk, release gate drift
- Operation Mode: BUILDER
- Mission ID: LUC-2364-RELEASE-GUARDRAILS-2026-06-06
- Mission Status: VERIFIED

## Context
[LUC-2361](/LUC/issues/LUC-2361) final no-secret release gate for candidate
`de3db789` failed repository guardrails on two independent checks:
architecture graph drift and production monolith line budgets.

## Goal
Restore `pnpm run quality:guardrails` for the release candidate without
changing runtime behavior or mutating production.

## Scope
- Architecture graph drift for public `/privacy` and `/terms` pages.
- Guardrail staged-decomposition allowlist for:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- Source-of-truth documentation for the temporary allowlist decision.
- Generated architecture graph/status outputs.

## Implementation Plan
1. Reproduce the failing guardrail.
2. Read generated drift report and identify missing graph paths.
3. Add minimal public legal page graph records.
4. Record the Backend runtime read-model monoliths as explicit staged
   decomposition exceptions.
5. Regenerate the architecture graph.
6. Rerun strict graph drift and repository guardrails.

## Acceptance Criteria
- `pnpm run architecture:graph:drift:strict` reports `0` missing.
- `pnpm run quality:guardrails` passes.
- The runtime read-model allowlist is documented and not wildcard-based.
- No production, deploy, restart, account, secret, exchange, protected-smoke,
  or live-trading mutation occurs.

## Definition of Done
- Guardrails are green.
- Source-of-truth docs explain the temporary decomposition decision.
- Follow-up decomposition is identified for Backend ownership.

## Forbidden
- No push, deploy, restart, rollback, protected smoke, secret, account,
  exchange, or live-trading mutation.
- No runtime behavior change.
- No workaround path or hidden bypass.

## Result Report
- Added graph records for:
  - `apps/web/src/app/(public)/privacy/page.tsx`
  - `apps/web/src/app/(public)/terms/page.tsx`
- Regenerated architecture graph outputs:
  - `docs/architecture/nodes/SOAR-PAGE-PRIVACY.md`
  - `docs/architecture/nodes/SOAR-PAGE-TERMS.md`
  - `docs/graphs/architecture-graph.json`
  - `docs/graphs/architecture-graph.md`
  - `docs/status/architecture-map-status.md`
  - `docs/status/architecture-graph-drift.md`
  - `history/artifacts/architecture-graph-drift-2026-05-24.json`
- Added explicit staged-decomposition allowlist entries for the two Backend
  runtime read-model files in `scripts/repoGuardrails.mjs`.
- Updated maintainability policy and inventory:
  - `docs/governance/code-quality-guardrails.md`
  - `history/audits/code-quality-maintainability-inventory-2026-04-21.md`
- Follow-up required: [LUC-2368](/LUC/issues/LUC-2368) owns Backend
  decomposition to remove the two temporary allowlist entries after preserving
  aggregate and positions-read behavior with focused tests.

## Validation Evidence
- Initial `pnpm run quality:guardrails`: FAIL, matching the issue with
  architecture drift `826/828` and two runtime aggregate monolith line-budget
  failures.
- `pnpm run architecture:graph:generate`: PASS, `653` nodes, `842` relations,
  `27` chains.
- `pnpm run architecture:graph:drift:strict`: PASS, `828/828` covered, `0`
  missing.
- `pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with LF/CRLF warnings only.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-evidence-graph-system.md`
  - `docs/architecture/registry/pages.csv`
  - `docs/architecture/registry/nodes.csv`
  - `docs/governance/code-quality-guardrails.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: graph registry and generated graph
  outputs refreshed in this task.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime mutation was made; revert this guardrail/doc graph
  change if the release train chooses immediate decomposition instead.

## Security / Privacy Evidence
- Data classification: public route metadata and no-secret guardrail evidence.
- Secret handling: no secret values read or written.
- Permission or ownership checks: no auth-sensitive runtime action performed.
- Residual risk: the allowlist is temporary maintainability debt until
  [LUC-2368](/LUC/issues/LUC-2368) removes it.
