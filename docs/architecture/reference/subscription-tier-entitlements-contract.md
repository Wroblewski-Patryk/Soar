# Subscription Tier and Entitlements Contract

Status: current-version target updated 2026-10-17. The 2026-04-07 default
assignment and checkout rules are historical implementation behavior and must
not be reported as accepted current product behavior.

## Purpose
- Freeze one canonical subscription catalog for V1 rollout (`FREE`, `ADVANCED`, `PROFESSIONAL`).
- Define administrator-only access assignment for the current version.
- Lock machine-readable entitlement payload schema used by API, UI, admin editing, and runtime guards.

## Canonical Tier Catalog
- Plan code enum (stable): `FREE | ADVANCED | PROFESSIONAL`.
- Legacy label `simple` is deprecated and treated as migration alias for `ADVANCED` only during transition.
- Canonical display order: `FREE` (1), `ADVANCED` (2), `PROFESSIONAL` (3).
- Catalog visibility rule: all plans are visible in My Account; an assigned
  active plan is highlighted. With no assignment, none is highlighted.

## Current-Version Assignment Rules
1. Registration alone does not assign a plan or grant plan-gated access.
2. A human administrator assigns plans and changes account roles manually in
   the Soar administrator panel. No self-service checkout or external MCP/API
   client may perform those actions.
3. Until assignment, plan-gated actions fail closed. One active subscription
   per user remains the invariant after assignment.
4. Existing `DEFAULT | ADMIN_OVERRIDE | CHECKOUT` source values and automatic
   `FREE` assignment are implementation/legacy data contracts, not permission
   to expose automatic or payment-driven assignment as the current product.
   Registration, entitlement resolution, bootstrap, and seed flows must be
   reconciled with rules 1-3 before this contract is accepted as implemented.

## Entitlement Payload Schema (V1)
Every `SubscriptionPlan` stores one JSON payload in `entitlements` with this envelope:

```json
{
  "version": 1,
  "limits": {
    "maxBotsTotal": 1,
    "maxBotsByMode": {
      "PAPER": 1,
      "LIVE": 0
    },
    "maxConcurrentBacktests": 1
  },
  "features": {
    "liveTrading": false,
    "syncExternalPositions": true,
    "manageExternalPositions": false
  },
  "cadence": {
    "allowedIntervals": ["5m", "15m"],
    "defaultMarketScanInterval": "5m",
    "defaultPositionScanInterval": "5m"
  }
}
```

Schema rules:
- `version` is required and starts at `1`.
- `limits.maxBotsTotal` is required and enforces create-bot hard cap.
- `limits.maxBotsByMode` is required (`PAPER`, `LIVE`) and cannot exceed `maxBotsTotal`.
- `limits.maxConcurrentBacktests` is required and must be `>= 1`.
- `features.*` flags are required booleans.
- `cadence.allowedIntervals` values must come from global interval catalog.
- cadence defaults must be members of `cadence.allowedIntervals`.
- Future keys may be added under top-level `extensions` without breaking existing readers.

## V1 Seed Baseline (Editable in Admin)
- `FREE`:
  - `limits.maxBotsTotal = 1`
  - `limits.maxBotsByMode = { PAPER: 1, LIVE: 0 }`
  - `features.liveTrading = false`
- `ADVANCED`:
  - `limits.maxBotsTotal = 3`
  - `limits.maxBotsByMode = { PAPER: 3, LIVE: 3 }`
  - `features.liveTrading = true`
- `PROFESSIONAL`:
  - `limits.maxBotsTotal = 10`
  - `limits.maxBotsByMode = { PAPER: 10, LIVE: 10 }`
  - `features.liveTrading = true`

Notes:
- Seed catalog values are templates, not automatic user assignments. The
  administrator may edit plan limits. Stored price fields do not authorize
  in-app payment or checkout in the current delivery.
- Enforcement uses stored entitlement payload, not hardcoded tier constants in runtime paths.

## Profile/API Read Contract
Profile subscription response (for My Account) must expose:
- `catalog`: list of plans with `code`, `displayName`, `priceMonthly`, `currency`, `sortOrder`, `isActive`, `entitlements`.
- `activeSubscription`: current assignment with `planCode`, `status`, `startsAt`, `endsAt`, `autoRenew`, `source`, or `null` before assignment.
- `activePlanCode`: denormalized helper for simple UI highlighting, or `null` before assignment.

These persisted/read fields may remain for compatibility. Their presence does
not make checkout an allowed user journey. A backend route used by the human
administrator panel is not an external-client plan or role tool.

## Non-goals (This Contract)
- No gateway-specific checkout flow details.
- No invoice/tax localization specification.
- No multi-subscription stacking in V1.
