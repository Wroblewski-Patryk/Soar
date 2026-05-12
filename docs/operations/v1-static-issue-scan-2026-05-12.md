# V1 Static Issue Scan

Generated at: 2026-05-12T07:00:20.924Z
Evidence date: 2026-05-12
Project index: `docs/operations/project-index-2026-05-12.json`

## Purpose

This is a static inconsistency scan. It identifies proof gaps, surface gaps,
queue drift, and source markers. It does not prove runtime behavior and does
not replace browser/API/DB/exchange action audits.

## Summary

- Total findings: 42
- By severity: {"P1":9,"P0":1,"P2":32}
- By category: {"v1-proof-gap":2,"web-surface-gap":1,"web-test-gap":1,"api-test-gap":1,"web-route-gap":2,"documented-placeholder":3,"queue-hygiene":1,"queue-open-work":1,"source-capability-gate":29,"source-marker":1}
- Production/source files scanned for markers: 658
- Source marker matches: 30

## P0/P1 Findings

| Severity | Category | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| P1 | v1-proof-gap | Bots is locally proven but still lacks production-safe clickthrough | Production-safe non-destructive clickthrough for bot actions; local action proof already exists. | Run or add non-destructive production clickthrough on throwaway fixtures before final V1 claim. |
| P0 | v1-proof-gap | Operations remains BLOCKED_AUTH | Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence. | Execute the mapped proof path from project index priority 19. |
| P1 | web-surface-gap | Web feature 'orders' has no active TS/TSX files | feature=orders | Confirm whether this is intentionally rendered through Dashboard Home or implement/retire the feature surface. |
| P1 | web-test-gap | Web feature 'positions' has no focused tests | feature=positions, files=1 | Add focused UI/action tests or document why the route is owned by another feature. |
| P1 | api-test-gap | API module 'subscriptions' has no focused tests | module=subscriptions, files=8 | Add focused API tests or document why coverage belongs to another module. |
| P1 | web-route-gap | Expected dashboard route '/dashboard/orders' has no page.tsx | route=/dashboard/orders | Confirm whether the action surface intentionally lives on Dashboard Home or add the route/page proof. |
| P1 | web-route-gap | Expected dashboard route '/dashboard/positions' has no page.tsx | route=/dashboard/positions | Confirm whether the action surface intentionally lives on Dashboard Home or add the route/page proof. |
| P1 | documented-placeholder | Module doc still describes placeholder or not-implemented behavior | docs/modules/web-orders.md | Either implement the documented surface or update the doc to the canonical owner and proof path. |
| P1 | documented-placeholder | Module doc still describes placeholder or not-implemented behavior | docs/modules/web-positions.md | Either implement the documented surface or update the doc to the canonical owner and proof path. |
| P1 | queue-open-work | 10 unchecked queue markers remain | .codex/context/TASK_BOARD.md:441 - [ ] `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10 release: capture guarded LIVE runtime session readback` \| .codex/context/TASK_BOARD.md:1296 - [ ] `PROD-UI-AUDIT-PLAN-2026-05-08 qa: execute production UI mod | Classify each as executable, blocked by auth/approval, or historical carryover. |

## P2 Findings

| Severity | Category | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| P2 | documented-placeholder | Module doc still describes placeholder or not-implemented behavior | docs/modules/api-subscriptions.md | Either implement the documented surface or update the doc to the canonical owner and proof path. |
| P2 | queue-hygiene | Queue scan still sees unchecked `(none)` markers | .codex/context/TASK_BOARD.md:6465, .codex/context/TASK_BOARD.md:6483 | Ignore these in execution selection or change queue formatting so scan output is cleaner. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/backtests/backtests.controller.ts:4 | import { ExchangeNotImplementedError } from '../exchange/exchangeCapabilities'; | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/backtests/backtests.controller.ts:47 | if (error instanceof ExchangeNotImplementedError) { | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/bots/bots.controller.ts:5 | import { ExchangeNotImplementedError } from '../exchange/exchangeCapabilities'; | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/bots/bots.controller.ts:371 | if (error instanceof ExchangeNotImplementedError) { | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/bots/bots.controller.ts:396 | if (error instanceof ExchangeNotImplementedError) { | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/exchange/exchangeCapabilities.ts:41 | export class ExchangeNotImplementedError extends DomainError<{ | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/exchange/exchangeCapabilities.ts:58 | name: 'ExchangeNotImplementedError', | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/exchange/exchangeCapabilities.ts:61 | this.name = 'ExchangeNotImplementedError'; | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/exchange/exchangeCapabilities.ts:70 | throw new ExchangeNotImplementedError(exchange, capability); | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/profile/apiKey/apiKey.controller.ts:7 | import { ExchangeNotImplementedError } from '../../exchange/exchangeCapabilities'; | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/profile/apiKey/apiKey.controller.ts:137 | if (error instanceof ExchangeNotImplementedError) { | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/api/src/modules/profile/apiKey/apiKey.controller.ts:153 | if (error instanceof ExchangeNotImplementedError) { | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-marker | PLACEHOLDER_SOURCE marker in apps/api/src/modules/subscriptions/payments/manualPaymentGateway.provider.ts:16 | note: 'Manual provider is configured as abstraction placeholder.', | Review whether this is test/tooling-only, accepted fail-closed behavior, or unfinished product work. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-bots.en.ts:50 | "liveApiKeyCompatibilityUnavailable": "Selected exchange does not support LIVE execution yet (placeholder adapter).", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-bots.en.ts:74 | "placeholderActivationBlocked": "Selected exchange is in placeholder mode. Bot activation is unavailable.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/web/src/i18n/namespaces/dashboard-bots.en.ts:75 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-bots.en.ts:75 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-bots.pt.ts:50 | "liveApiKeyCompatibilityUnavailable": "Selected exchange does not support LIVE execution yet (placeholder adapter).", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-bots.pt.ts:74 | "placeholderActivationBlocked": "Selected exchange is in placeholder mode. Bot activation is unavailable.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/web/src/i18n/namespaces/dashboard-bots.pt.ts:75 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-bots.pt.ts:75 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/web/src/i18n/namespaces/dashboard-home.en.ts:171 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-home.en.ts:171 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/web/src/i18n/namespaces/dashboard-home.pt.ts:171 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-home.pt.ts:171 | "placeholderActivationHint": "Placeholder exchange selected. Runtime activation for {mode} mode is not implemented yet.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | NOT_IMPLEMENTED marker in apps/web/src/i18n/namespaces/dashboard-markets.en.ts:73 | "Placeholder exchange selected. Public catalog for this exchange is not implemented yet. You can still save the universe context.", | Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-markets.en.ts:73 | "Placeholder exchange selected. Public catalog for this exchange is not implemented yet. You can still save the universe context.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-markets.pl.ts:73 | "Wybrano placeholder exchange. Publiczny katalog dla tej gieldy nie jest jeszcze dostepny. Nadal mozesz zapisac kontekst grupy.", | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-shell.en.ts:155 | "placeholderProbeInfo": "API key test is not available for {exchange} yet (placeholder adapter). Saving is still allowed." | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |
| P2 | source-capability-gate | PLACEHOLDER_SOURCE marker in apps/web/src/i18n/namespaces/dashboard-shell.pl.ts:155 | "placeholderProbeInfo": "Dla {exchange} test API key nie jest jeszcze dostepny (placeholder adapter). Zapis jest dozwolony." | Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters. |

## Interpretation

1. `v1-proof-gap` means the V1 matrix row lacks accepted action proof; it is
   not automatically a code bug.
2. `web-surface-gap`, `web-route-gap`, and `documented-placeholder` are
   stronger candidates for implementation/documentation drift.
3. `source-marker` findings require human triage because some placeholders
   are valid fail-closed behavior or deterministic fallback contracts.
4. Start fixes from P0/P1 findings that overlap the V1 Audit Work Map priority:
   Dashboard Home, Bot Runtime, Auth, Profile API Keys, then Bots production
   clickthrough.
