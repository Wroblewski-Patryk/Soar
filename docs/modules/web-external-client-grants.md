# Web Deep-Dive: External Client Grants

## Metadata
- Module name: `external-client-grants`
- Layer: `web`
- Source path: `apps/web/src/features/external-client-grants`
- Owner: frontend/account
- Last updated: 2026-10-19
- Related planning tasks: `SOAR-EXT-GRANT-001C/WEB-GRANT`, `SOAR-EXT-GRANT-001O/READ-GRANT-WEB`

## 1. Purpose and Scope
This module lets a signed-in human owner create, list, inspect, and revoke separate order and read-only external-client grants from the Profile `#grants` tab. Order grants show the exact bot, venue, symbol and trading limits. Read grants show one owned bot and `READ_BOT_STATUS` without order permission. It does not accept a grant secret for execution, expose MCP, read bot status through a client route, or submit an order.

## 2. Boundaries and Dependencies
`ProfilePage` mounts `ExternalClientGrantsPanel`, which includes a separate `ReadBotStatusGrants` section. Both call their human-session grant APIs through the shared cookie API client. Order creation reads runtime market-group graphs and market universes. Read-grant creation needs only an owned PAPER or LIVE bot and the current subscription. These Web reads are advisory; the API remains authoritative for ownership, plan and every permission check.

## 3. Data and Contract Surface
- `grants.api.ts` models the list/create/revoke responses from `/dashboard/external-client-grants` and `/dashboard/external-client-grants/:id/revoke`.
- `readGrants.api.ts` models separate list/create/detail/revoke responses from `/dashboard/external-client-read-grants`. Only create returns the one-time `soar_read_` secret; list, detail and revoke return public metadata without it.
- Create sends the current account password, one eligible LIVE bot, its exact venue/market/symbol, `PLACE_LIVE_ORDER`, positive decimal-string per-action and total USDT limits, action count, and TTL.
- The read-only form opens only after a deliberate selection. It sends one owned bot, `READ_BOT_STATUS`, label, TTL and current password; it sends no symbol, order action or trading allowance. Existing `PLACE_LIVE_ORDER` grants do not gain status-read permission.
- The create response alone includes the opaque secret. List and revoke records do not. The panel holds the secret only in component memory until the owner closes its one-time view or navigates away. Copy requires a click. No storage, URL, or analytics path is used.
- `grantStatus.ts` derives display states for revocation, expiry, exhausted allowance, plan loss, bot/group/scope loss, and unavailable context. It compares decimal allowance strings as 8-place integer units.

## 4. Runtime Flows
1. Load grants, then bot/subscription/market-universe context and per-bot graphs. Missing context disables creation and displays an unverified or unavailable status instead of inferring authority.
2. Select an active, opted-in LIVE bot and an active symbol from any assigned active market group whose universe matches the bot venue and market type. Enter limits, TTL, label, and current password. The API validates again before issuing a grant.
3. Show the newly issued secret once. Focus enters the panel, Tab and Shift+Tab remain inside, Escape or the close button clears component state, and focus returns to Create grant. Later list reads cannot retrieve the secret.
4. List records with scope, remaining context, and current display status. Revocation requires a second explicit click and updates the row from the API response.
5. The read-only section independently loads grants and bot/plan context. It shows expiry, revocation and unavailable context, and lets the owner check a row against the detail endpoint. Its one-time secret dialog traps focus, clears state on Escape or close and restores focus to Create. Read grant revocation also requires a second click.

## 5. API and UI Integration
- UI entry: `/dashboard/profile#grants`, including an account-menu link.
- API endpoints: `GET /dashboard/external-client-grants`, `POST /dashboard/external-client-grants`, `POST /dashboard/external-client-grants/:id/revoke`.
- Read grant API endpoints: `GET/POST /dashboard/external-client-read-grants`, `GET /dashboard/external-client-read-grants/:id`, `POST /dashboard/external-client-read-grants/:id/revoke`.
- English and Polish copy lives in the `dashboardGrants` i18n namespace; other configured locales use English fallback.
- The form and grant cards wrap from phone through tablet and desktop widths.

## 6. Security and Risk Guardrails
Creation requires the account password and an API-issued human-session cookie. Browser-side eligibility is guidance only. The order API enforces owner, LIVE plan, active and opted-in bot, market group, capability, password, limits, and expiry. The separate read-grant API enforces owner, plan, action and password, and permits an owned PAPER or LIVE bot. The panel never logs a password or secret and never persists either. Revoked and expired grants remain visible for owner review. No grant-token bot-status route or execution route is added by this Web change.

## 7. Observability and Operations
The panel displays load, create, and revoke failures without embedding the submitted password or issued secret. The API owns audit records for grant creation and revocation. Local UI proof does not establish deployed behavior or exchange acceptance.

## 8. Test Coverage and Evidence
- Unit/UI: `apps/web/src/features/external-client-grants/grantStatus.test.ts`, `ExternalClientGrantsPanel.test.tsx`, `ReadBotStatusGrants.test.tsx` and `readGrants.api.test.ts` cover both disjoint actions, API paths, PAPER-bot scope, one-time secret state, focus, expiry, plan loss and two-step revoke.
- Local validation: `pnpm --filter web exec vitest run src/features/external-client-grants src/features/profile src/i18n src/app/dashboard/dashboard.a11y.smoke.test.tsx`; `pnpm --filter web typecheck`.
- Isolated signed-in local browser readback checked account navigation, listed/revoked status, absent secret on later GET, and layouts at 390, 768, and 1440 pixels. This is local evidence only.
- For the new read-only section, an isolated Chrome render of the actual component DOM and app CSS at 390, 768, and 1440 pixels showed no horizontal overflow (`scrollWidth` equaled `clientWidth` at each size). This static fixture did not exercise authenticated navigation or a backend response.

## 9. Open Issues and Follow-Ups
External-client execution, reservation-to-order integration, independent review, deployment, and production/LIVE acceptance remain separate gates in `docs/architecture/reference/external-client-authorization-contract.md`.
