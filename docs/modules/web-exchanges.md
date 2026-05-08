# Web Deep-Dive: Exchanges Module

## Metadata
- Module name: `exchanges`
- Layer: `web`
- Source path: `apps/web/src/features/exchanges`
- Owner: frontend/integrations
- Last updated: 2026-04-12
- Related planning task: `DCP-09`

## 1. Purpose and Scope
- Provides exchange capability metadata and integration surface wiring.
- Reuses profile API-key UI as the canonical exchange connection management view.

Out of scope:
- Dedicated exchange management page with standalone controls.
- Backend exchange connectivity implementation.

## 2. Boundaries and Dependencies
- Route behavior:
  - `/dashboard/exchanges` redirects to `/dashboard/profile#api`
- Module composition:
  - `ExchangeConnectionsView` renders `ApiKeysList` from profile module.
  - `exchangeCapabilities.ts` provides frontend capability map.

## 3. Data and Contract Surface
- Capability contract:
  - exchanges: `BINANCE`, `BYBIT`, `OKX`, `KRAKEN`, `COINBASE`, `GATEIO`
  - capabilities: `MARKET_CATALOG`, `PAPER_PRICING_FEED`, `LIVE_EXECUTION`, `API_KEY_PROBE`
- Utility:
  - `supportsExchangeCapability(exchange, capability)` for UI gating.
- Source:
  - shared `@cryptosparrow/shared` exchange capability matrix

## 4. Runtime Flows
- Connection management flow:
  1. User opens exchanges route.
  2. Route redirects to profile integrations tab.
  3. API key list/form handles create/test/edit/delete actions.
- Capability gating flow:
  - Bots/wallets/dashboard modules query `supportsExchangeCapability` to block unsupported actions.

## 5. UI Integration
- Main component:
  - `ExchangeConnectionsView`
- Main route:
  - `/dashboard/exchanges` (redirect-only entrypoint)

## 6. Security and Risk Guardrails
- API-key actions remain in authenticated profile scope.
- Unsupported exchange actions are blocked in dependent modules using capability map checks.

## 7. Observability and Operations
- Capability map keeps unsupported exchange UX deterministic during staged rollout.

## 8. Test Coverage and Evidence
- Primary tests:
  - `exchangeCapabilities.test.ts`
  - `app/dashboard/exchanges/page.test.tsx`
  - `ExchangeConnectionsView.test.tsx`
- Suggested validation command:
```powershell
pnpm --filter web test -- src/features/exchanges/exchangeCapabilities.test.ts src/app/dashboard/exchanges/page.test.tsx src/features/exchanges/components/ExchangeConnectionsView.test.tsx
```

## 9. Open Issues and Follow-Ups
- Gate.io remains UI-visible only for supported public catalog flows; paper
  pricing, live execution, and API-key probe controls must stay blocked until
  shared capability truth changes after adapter evidence.
- Add dedicated exchange page once integrations diverge from profile API-key scope.
