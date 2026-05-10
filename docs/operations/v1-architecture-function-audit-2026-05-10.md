# V1 Architecture Function Audit

## Executive Answer
- Status: **mostly architecture-aligned, but not clean enough for final V1 GO**
- Evidence date: 2026-05-10
- Audit type: source-of-truth and implementation-boundary review

Most V1 function areas match the approved architecture at the level of routes,
modules, data ownership, runtime parity, and fail-closed production evidence.
However, this audit found one real architecture-boundary mismatch and two docs
drift items that should be fixed before calling the architecture fully clean.

## Key Findings
| ID | Severity | Area | Finding | Decision Needed |
| --- | --- | --- | --- | --- |
| `ARCH-AUDIT-01` | P1 | Exchange access ownership | `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts` dynamically imports `ccxt` and constructs exchange clients in the profile module. The architecture says feature modules outside `modules/exchange` must not import exchange SDKs or exchange-specific constructors directly. | Yes |
| `ARCH-AUDIT-02` | P2 | Architecture docs drift | `docs/architecture/04_runtime-contexts.md` shows `ExchangeContext.exchange` as `BINANCE | BYBIT | OKX | KRAKEN | COINBASE`, omitting `GATEIO`, while the canonical exchange matrix supports `GATEIO`. | No architecture decision if treated as docs drift |
| `ARCH-AUDIT-03` | P2 | Module docs drift | `docs/modules/api-exchange.md` still says the exchange module is "currently centered on Binance/CCXT futures paths" and lists expanding beyond Binance as an open follow-up, while Gate.io support is now implemented per operation. | No architecture decision if treated as docs drift |

## Decision Point For `ARCH-AUDIT-01`
The architecture contract in `docs/architecture/09_integrations-deployment-and-runtime-services.md` says:

- exchange-specific behavior lives behind adapters,
- feature modules outside `modules/exchange` must not import exchange SDKs or
  exchange-specific constructors directly,
- consumers must depend on exchange adapter families instead of low-level
  exchange clients.

Current implementation:

- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts:67`
  imports `ccxt` dynamically.
- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts:71`
  selects an exchange constructor from the CCXT module.

Valid options:

1. **Recommended: move API-key probe client construction behind `modules/exchange`.**
   - Keep profile as the route/form owner.
   - Add or reuse an exchange-owned probe client factory/service.
   - Profile calls the exchange module boundary instead of creating CCXT clients.
   - Best alignment with the existing architecture.

2. **Explicitly approve API-key probe as a documented exception.**
   - Update architecture docs to allow the profile API-key probe to own direct
     CCXT bootstrap.
   - Faster, but weakens the exchange-boundary rule and creates an exception
     future agents must remember.

3. **Do only docs cleanup and leave implementation unchanged.**
   - Not recommended, because the implementation would still violate the
     current boundary rule.

## Perspective Audit Matrix
| Perspective | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Architecture source-of-truth | PARTIAL | Architecture files and reference contracts reviewed | Current exchange matrix is accurate, but runtime context example and exchange module deep-dive are stale. |
| Backend module ownership | PARTIAL | 22 API modules mapped in `codebase-map.md` and docs parity PASS | Most modules align; profile API-key probe directly creates CCXT clients outside exchange boundary. |
| API route/auth boundaries | PASS | `dashboard.routes.ts` applies `requireAuth`; `admin.routes.ts` applies `requireAuth + requireRole('ADMIN')`; docs parity reports routes `38/38` | No route-map drift found. |
| Frontend route ownership | PASS | 38 route files match canonical route map | Web routes follow dashboard/admin/public split. |
| Frontend exchange isolation | PASS | `rg -n ccxt apps/web/src` returned no hits | Browser does not own exchange SDK access. |
| Exchange SDK boundary | PARTIAL | Direct Binance URLs are inside `modules/exchange`; direct `ccxt` outside exchange appears in profile API-key probe | Main runtime/execution paths use exchange boundaries; probe path needs decision. |
| Runtime context ownership | PASS with docs drift | Wallet/venue/runtime contracts reviewed | Implementation has Gate.io support, but `04_runtime-contexts.md` example omits `GATEIO`. |
| Wallet source-of-truth | PASS | Wallet contract reviewed; wallets service enforces exchange capability and live API key compatibility | No architecture mismatch found in sampled wallet path. |
| Backtest/paper/live parity | PASS locally, production proof blocked | Traceability matrix, mode parity contract, prior test inventory | Architecture fit is strong; final V1 still needs protected production proof. |
| Manual orders and lifecycle | PASS | Execution lifecycle contract and orders boundary sampled | Orders call exchange adapter boundary for live submit/cancel. Low-level CCXT type imports from exchange types are a minor coupling smell, not direct SDK construction. |
| Positions/import/readback | PASS with protected proof blocked | Positions service uses exchange adapter boundary for snapshots | `LIVEIMPORT-03` production readback remains missing. |
| Gate.io adapter architecture | PASS with docs drift | `exchange-access-ownership-matrix.md` marks Gate.io supported per operation | Canonical matrix is current; older module docs are stale. |
| Assistant runtime | PASS by contract | Assistant runtime contract reviewed | No implementation mismatch inspected in this audit beyond existing test/evidence coverage. |
| Security/fail-closed | PASS/BLOCKED | Protected UI and ops endpoints block without auth; current preflight blocks missing protected inputs | Safe behavior, but final proof requires auth. |
| Production ops/release | BLOCKED_PROOF | Current preflight blocks on liveimport auth, rollback auth, RC evidence, liveimport readback, rollback proof | Public deploy health is not enough for final V1. |
| UX/UI proof | BLOCKED_AUTH | Production UI clickthrough public routes PASS; dashboard/admin routes `BLOCKED_AUTH` | Authenticated/admin clickthrough still required. |
| Mobile traceability | GAP / post-V1 | Traceability matrix states mobile is unverified | Not a V1 Web/API blocker unless mobile enters current scope. |

## Function-by-Function Architecture Status
| Function Area | Architecture Fit | Remaining Action |
| --- | --- | --- |
| Auth session | PASS | None from this audit. |
| Profile and API keys | PARTIAL | Move or explicitly approve API-key probe CCXT client ownership. |
| Wallet setup and ledger | PASS | Continue protected/live evidence; richer LIVE ledger remains target extension where documented. |
| Market universe | PASS | None from this audit. |
| Strategy builder | PASS | None from this audit. |
| Bot configuration | PASS | Protected runtime evidence still needed. |
| Bot runtime monitoring | PASS/BLOCKED_PROOF | Authenticated production dashboard/runtime proof needed. |
| Runtime signal execution | PASS/BLOCKED_PROOF | Protected production readback and Gate 2 proof needed. |
| Manual order execution | PASS | Keep exchange-backed live actions behind exchange boundary. |
| Position ownership and takeover | PASS/BLOCKED_PROOF | `LIVEIMPORT-03` needed. |
| Backtest run | PASS | No new gap found. |
| Reports | PASS/BLOCKED_AUTH | Authenticated UI proof needed. |
| Logs/audit trail | PASS/BLOCKED_AUTH | Authenticated UI proof needed. |
| Admin subscriptions/users | PASS/BLOCKED_AUTH | Admin clickthrough proof needed. |
| Assistant runtime config | PASS | No new gap found. |

## What This Means
The architecture is close, but not spotless.

The main implementation boundary to fix is narrow: API-key probe bootstrap
should be moved behind the exchange module or explicitly approved as an
exception. The rest of the "not 100%" status is still primarily protected
production evidence, not broad architecture or module implementation failure.

## Recommended Next Steps
1. Decide `ARCH-AUDIT-01`:
   - recommended: move profile API-key CCXT bootstrap into `modules/exchange`.
2. Fix stale docs:
   - add `GATEIO` to the `ExchangeContext` example in
     `docs/architecture/04_runtime-contexts.md`;
   - refresh `docs/modules/api-exchange.md` to match the current per-operation
     Gate.io adapter truth.
3. Rerun architecture/guardrail checks.
4. Continue protected V1 evidence lanes:
   - `LIVEIMPORT-03`,
   - rollback proof PASS,
   - authenticated/admin UI clickthrough,
   - authenticated Gate 2 SLO,
   - RC approval/sign-off/checklist,
   - final non-dry-run release gate.

## Closure Position
Do not move to "V1 architecture fully clean" until `ARCH-AUDIT-01` is resolved
or explicitly approved as an architecture exception. After that, the remaining
work should be production proof and release approval.
