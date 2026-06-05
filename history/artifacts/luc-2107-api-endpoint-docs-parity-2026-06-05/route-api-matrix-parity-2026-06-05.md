# Route/API Matrix Parity - 2026-06-05

Status: PASS

Scope: generated guardrail comparing Next.js page route inventory and Express API endpoint inventory with:

- `docs/architecture/traceability-matrix.md`
- `docs/architecture/reference/dashboard-route-map.md`

Command:

```powershell
pnpm run docs:parity:route-api-matrix
```

Result:

- Web routes: 37
- API endpoints: 109
- Traceability rows: 16
- Dashboard route-map inventory routes: 37
- Gaps: 0

Gap buckets:

- `webRoutesMissingInTraceabilityMatrix`: OK
- `webRoutesMissingInDashboardRouteMap`: OK
- `apiEndpointsMissingInTraceabilityMatrix`: OK
- `dashboardApiEndpointsMissingInRouteMap`: OK

Focused test:

```powershell
pnpm run docs:parity:route-api-matrix:test
```

Result: PASS (`5/5` node tests). Coverage includes markdown parser extraction, passing documented route/API coverage, actionable missing-coverage failures, and mounted router imports that resolve through `index.ts`.

Adjacent guardrails:

- `pnpm run docs:parity:check` -> PASS
- `pnpm run architecture:graph:generate` -> PASS (`649` nodes / `842` relations / `27` chains)
- `pnpm run architecture:graph:drift:strict` -> PASS (`822/822` covered / `0` missing)
- `pnpm run quality:guardrails` -> PASS

Explicit limitations:

- This is route/API inventory coverage parity, not semantic DTO or response-shape validation.
- Dynamic route variants are matched conservatively through literal routes plus `*` and `:param` patterns.
- Root ops endpoints are intentionally exempted from the traceability matrix feature rows.
