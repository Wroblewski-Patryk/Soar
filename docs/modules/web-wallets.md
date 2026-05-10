# Web Deep-Dive: Wallets Module

## Metadata
- Module name: `wallets`
- Layer: `web`
- Source path: `apps/web/src/features/wallets`
- Owner: frontend/trading-setup
- Last updated: 2026-04-23
- Related planning task: `DCP-09`, `WAPR-10`, `V1CAP-A`

## 1. Purpose and Scope
- Owns wallet management UI for trading context setup.
- Provides list/create/edit flows and balance preview integration.
- Serves as required prerequisite for bot creation (`walletId`-first contract).

Out of scope:
- Bot form orchestration and runtime operations.
- API-key storage lifecycle management.

## 2. Boundaries and Dependencies
- Route entrypoints:
  - `/dashboard/wallets/list`
  - `/dashboard/wallets/create`
  - `/dashboard/wallets/:id/edit`
  - `/dashboard/wallets/:id/preview`
  - `/dashboard/wallets` and `/dashboard/wallets/:id` redirect to canonical list/edit routes
- Depends on:
  - wallets API service (`features/wallets/services/wallets.service.ts`)
  - exchange capability metadata for dynamic form constraints
  - shared async retry utilities for critical requests
  - wallet analytics endpoints for performance summary, timeline, and cashflow preview

## 3. Data and Contract Surface
- API contracts used:
  - list/get/create/update/delete wallet
  - metadata lookup (`/dashboard/wallets/metadata`)
  - balance preview (`/dashboard/wallets/preview-balance`)
- Form contracts:
  - mode-aware PAPER/LIVE field requirements and allocation modes
  - unsupported exchange/mode capability combinations are blocked before save
    through shared exchange capability truth
- WAPR UI contract lock:
  - wallet list is row-only (no expandable `Details` action/rows).
  - list table includes inline `API key` column between `Allocation` and `Actions`.
  - API key status mapping is deterministic from `apiKeyId`:
    - present -> `Connected`,
    - missing -> `Not connected`.
  - wallet edit flow exposes dedicated `Reset paper wallet` action only for `PAPER` wallets (command path, not generic edit side effect).
- V1CAP UI contract lock:
  - wallet list, wallet summary, and runtime wallet sidebar must expose capital-source truth explicitly.
  - `PAPER` reset copy must explain that history stays visible while active capital starts from the latest reset checkpoint.
  - `LIVE` preview/runtime copy must explain whether usable capital follows percent allocation, fixed-cap allocation, or full authenticated exchange balance.

## 4. Runtime Flows
- List flow:
  1. Load wallets with filters.
  2. Render row-only table with inline API key status and delete actions.
  3. Surface empty state guidance for first wallet setup.
- Preview flow:
  1. Load wallet identity plus ledger-backed summary, timeline, and cashflow events.
  2. Render `COMPLETE` and `PARTIAL` states with explicit completeness status.
  3. Fail closed on `UNAVAILABLE` completeness by showing an empty state instead of summary cards or chart data.
- Create/edit flow:
  1. Load metadata and (for edit) existing wallet.
  2. Enforce mode-aware form sections.
  3. Preview LIVE balance when API key and allocation are provided.
  4. Explain the active capital authority in summary/preview copy so post-reset and post-deposit behavior is visible before save.
  5. For `PAPER` edit, surface dedicated reset action with explicit confirmation and fail-closed error handling.
  6. Save wallet payload and return to list/edit context.

## 5. UI Integration
- Main components:
  - `WalletsListTable`
  - `WalletCreateEditForm`
  - `WalletPreviewPanel`
  - route-level wrapper `WalletFormPageContent`
- Table presentation contract:
  - columns include `API key` inline state,
  - `Details` expansion control is not part of canonical list UI.

## 6. Security and Risk Guardrails
- LIVE preview requires linked API key context from authenticated backend.
- Form enforces mode-switch cleanup and prevents stale cross-mode payload leakage.
- Gate.io PAPER wallet save is allowed through the shared
  `PAPER_PRICING_FEED` capability. Gate.io LIVE wallet save is allowed after
  `LIVE_EXECUTION` support is enabled; exchange-side cancel remains
  unsupported.
- Delete flow respects backend conflict contract when wallet is linked to active bots.
- Paper reset action is `PAPER`-only in UI and must respect backend fail-closed guards (`open positions` / `active open orders` block reset).

## 7. Observability and Operations
- Metadata source and preview states are surfaced in form UX to explain capability fallback.
- Retry-aware request helpers reduce transient load/save failures.
- Runtime wallet sidebar surfaces capital source, account balance, and paper reset checkpoint so operator monitoring stays aligned with backend capital truth.

## 8. Test Coverage and Evidence
- Primary tests:
  - `app/dashboard/wallets/[id]/preview/page.test.tsx`
  - `WalletsListTable.test.tsx`
  - `WalletCreateEditForm.test.tsx`
  - `WalletPreviewPanel.test.tsx`
- Suggested validation command:
```powershell
pnpm --filter web test -- src/app/dashboard/wallets/[id]/preview/page.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletPreviewPanel.test.tsx
```

## 9. Open Issues and Follow-Ups
- Expand supported exchange-specific preview behavior as connectors mature.
