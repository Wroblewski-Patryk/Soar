# Web Deep-Dive: Icons Module

## Metadata
- Module name: `icons`
- Layer: `web`
- Source path: `apps/web/src/features/icons`
- Owner: frontend/shared-ui
- Last updated: 2026-07-10
- Related planning task: `DCP-09`

## 1. Purpose and Scope
- Provides reusable symbol-to-icon lookup hook for trading UI surfaces.
- Integrates with API icon resolver to enrich symbols in tables/cards.

Out of scope:
- Icon rendering components (consumers handle presentation).
- Persistent icon catalog management.

## 2. Boundaries and Dependencies
- Core files:
  - `hooks/useCoinIconLookup.ts`
  - `services/icons.service.ts`
  - `types/icon.type.ts`
- Depends on:
  - `/dashboard/icons/lookup` API endpoint
  - symbol normalization utilities from `lib/symbols`

## 3. Data and Contract Surface
- Input contract:
  - list of symbols from consuming module
- Service output:
  - `Map<symbol, CoinIconLookupItem>`
- Hook output:
  - `iconMap`, `loading`, `error`

## 4. Runtime Flows
- Lookup flow:
  1. Normalize and deduplicate symbols.
  2. Request icon metadata from API.
  3. Convert response to symbol-indexed map.
  4. Expose loading/error state for graceful UI fallback.

## 5. UI Integration
- Consumed by:
  - dashboard-home runtime symbol displays
  - bots runtime/list symbol displays
  - any module needing symbol icon hydration

## 6. Security and Risk Guardrails
- Icon fetches are authenticated dashboard API calls.
- Hook fails safe with empty map on request failures.

## 7. Observability and Operations
- Error state is exposed to consumers so they can downgrade to symbol-only rendering.
- Symbol normalization avoids duplicated requests for equivalent symbols.

## 8. Test Coverage and Evidence
Tests:
| Test file | Scope | Level |
| --- | --- | --- |
| `apps/web/src/ui/components/AssetSymbol.test.tsx` | Symbol badge rendering with icon fallback behavior | Component |
| `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` | Runtime symbol rendering paths that consume icon lookups | Component |
| `apps/web/src/features/bots/components/BotsManagement.test.tsx` | Bot runtime/list symbol rendering paths with icon hydration | Component |

Evidence:
- No dedicated `apps/web/src/features/icons/*.test.*` file exists yet.
- The exact consumer-driven coverage is the `Tests` table above. Treat future
  icon lookup hook, deduplication, cancellation, or cache behavior changes as
  requiring a dedicated module-local test instead of relying only on consumer
  suites.

## 9. Open Issues and Follow-Ups
- Add unit tests for hook deduplication and cancellation behavior.
- Consider shared cache layer for cross-component icon lookup reuse.

## 10. Architecture-Awareness Doc-Link Classification

Last classified: 2026-06-05 under [LUC-2163](/LUC/issues/LUC-2163).

| Source entity | Owner doc | Classification | Expected proof |
| --- | --- | --- | --- |
| `apps/web/src/features/icons/types/icon.type.ts` | `docs/modules/web-icons.md` | Icon lookup DTO/type contract consumed by trading symbol UI surfaces. | Architecture-awareness `documents` relation from this doc plus consumer-driven icon/rendering tests when behavior changes. |
