# Web Deep-Dive: Shared Feature Helpers

## Metadata
- Module name: `shared`
- Layer: `web`
- Source path: `apps/web/src/features/shared`
- Owner: frontend/shared-ui
- Last updated: 2026-05-02
- Related planning task: `V1CLOSEOUT-07`

## 1. Purpose and Scope
- Provides feature-level shared presentation helpers used by runtime-adjacent dashboard surfaces.
- Keeps DCA ladder rendering and runtime monitoring formatting consistent between dashboard-home and bot monitoring views.

Out of scope:
- Route ownership.
- API data fetching.
- Generic design-system primitives owned by `apps/web/src/ui`.

## 2. Boundaries and Dependencies
- Core files:
  - `dcaLadderCell.tsx`
  - `runtimeMonitoringFormatters.ts`
- Tests:
  - `dcaLadderCell.test.tsx`
  - `runtimeMonitoringFormatters.test.ts`
- Consumed by:
  - dashboard-home runtime widgets
  - bots monitoring/runtime views

## 3. Data and Contract Surface
- DCA ladder helpers format planned/executed levels without duplicating table-specific logic.
- Runtime monitoring formatters normalize status/action display values for shared operator tables.

## 4. Runtime Flows
- Consumers pass already-fetched runtime payload fields into shared helpers.
- Helpers return display-ready values and components without owning request lifecycle or mutation behavior.

## 5. UI Integration
- Shared helpers must preserve parity between dashboard-home and bot monitoring surfaces.
- New runtime table formatting should be added here when it is used by more than one feature module.

## 6. Security and Risk Guardrails
- No direct API or auth access.
- No trading command authority.
- Helpers must not infer runtime truth that is absent from API payloads.

## 7. Observability and Operations
- No standalone telemetry.
- Fail-soft formatting should prefer neutral empty output over invented trading state.

## 8. Test Coverage and Evidence
- `pnpm --filter web test -- src/features/shared/dcaLadderCell.test.tsx src/features/shared/runtimeMonitoringFormatters.test.ts`
- Covered indirectly by dashboard-home and bots runtime component tests.

## 9. Open Issues and Follow-Ups
- Keep this module limited to cross-feature helpers; move single-consumer code back to the owning feature.
