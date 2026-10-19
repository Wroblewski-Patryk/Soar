# Web Deep-Dive: External Client Grants

## Metadata
- Module name: `external-client-grants`
- Layer: `web`
- Source path: `apps/web/src/features/external-client-grants`
- Owner: frontend/account
- Last updated: 2026-10-19
- Related planning task: `SOAR-EXT-GRANT-001C/WEB-GRANT`

## 1. Purpose and Scope
This module lets a signed-in human owner create, list, inspect, and revoke external-client grants from the Profile `#grants` tab. It presents the exact bot, exchange, market type, symbol, action, amount and count limits, usage, and expiry. It does not accept a grant secret for execution, expose MCP, or submit an order.

## 2. Boundaries and Dependencies
`ProfilePage` mounts `ExternalClientGrantsPanel`. The panel calls the existing human-session grant API through the shared cookie API client. It reads owned bots, their runtime market-group graphs, market universes, and the current subscription to guide creation and explain status. These Web reads are advisory; the API remains authoritative for grant validity and every permission check.

## 3. Data and Contract Surface
- `grants.api.ts` models the list/create/revoke responses from `/dashboard/external-client-grants` and `/dashboard/external-client-grants/:id/revoke`.
- Create sends the current account password, one eligible LIVE bot, its exact venue/market/symbol, `PLACE_LIVE_ORDER`, positive decimal-string per-action and total USDT limits, action count, and TTL.
- The create response alone includes the opaque secret. List and revoke records do not. The panel holds the secret only in component memory until the owner closes its one-time view or navigates away. Copy requires a click. No storage, URL, or analytics path is used.
- `grantStatus.ts` derives display states for revocation, expiry, exhausted allowance, plan loss, bot/group/scope loss, and unavailable context. It compares decimal allowance strings as 8-place integer units.

## 4. Runtime Flows
1. Load grants, then bot/subscription/market-universe context and per-bot graphs. Missing context disables creation and displays an unverified or unavailable status instead of inferring authority.
2. Select an active, opted-in LIVE bot and an active symbol from any assigned active market group whose universe matches the bot venue and market type. Enter limits, TTL, label, and current password. The API validates again before issuing a grant.
3. Show the newly issued secret once. Closing the view clears component state; later list reads cannot retrieve it.
4. List records with scope, remaining context, and current display status. Revocation requires a second explicit click and updates the row from the API response.

## 5. API and UI Integration
- UI entry: `/dashboard/profile#grants`, including an account-menu link.
- API endpoints: `GET /dashboard/external-client-grants`, `POST /dashboard/external-client-grants`, `POST /dashboard/external-client-grants/:id/revoke`.
- English and Polish copy lives in the `dashboardGrants` i18n namespace; other configured locales use English fallback.
- The form and grant cards wrap from phone through tablet and desktop widths.

## 6. Security and Risk Guardrails
Creation requires the account password and an API-issued human-session cookie. Browser-side eligibility is guidance only. The API enforces owner, LIVE plan, active and opted-in bot, market group, capability, password, limits, and expiry. The panel never logs a password or secret and never persists either. A revoked, expired, or exhausted grant is still visible for owner review. No grant-token execution route is added by this module.

## 7. Observability and Operations
The panel displays load, create, and revoke failures without embedding the submitted password or issued secret. The API owns audit records for grant creation and revocation. Local UI proof does not establish deployed behavior or exchange acceptance.

## 8. Test Coverage and Evidence
- Unit/UI: `apps/web/src/features/external-client-grants/grantStatus.test.ts` and `ExternalClientGrantsPanel.test.tsx` cover statuses, exact scope selection, one-time secret state, plan loss, password submission, and two-step revoke.
- Local validation: `pnpm --filter web exec vitest run src/features/external-client-grants src/features/profile src/i18n src/app/dashboard/dashboard.a11y.smoke.test.tsx`; `pnpm --filter web typecheck`.
- Isolated signed-in local browser readback checked account navigation, listed/revoked status, absent secret on later GET, and layouts at 390, 768, and 1440 pixels. This is local evidence only.

## 9. Open Issues and Follow-Ups
External-client execution, reservation-to-order integration, independent review, deployment, and production/LIVE acceptance remain separate gates in `docs/architecture/reference/external-client-authorization-contract.md`.
