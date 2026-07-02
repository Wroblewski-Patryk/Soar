# LUC-5680 Names-Only Exchange Configuration And Fail-Closed API Proof

## Header
- ID: LUC-5680
- Title: [Soar][Exchange Proof][Backend] Names-only exchange configuration and fail-closed API proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: 09 CBE (Core Backend Engineer)
- Priority: P1
- Mission ID: LUC-5680-NAMES-ONLY-EXCHANGE-CONFIGURATION-FAIL-CLOSED-API-PROOF-2026-06-28
- Mission Status: VERIFIED_LOCAL

## Context
[LUC-5622](/LUC/issues/LUC-5622) routed `KS-LANE-03` for Exchange connection/configuration proof. This backend heartbeat owns the API-key onboarding/configuration and fail-closed API proof portion only.

## Goal
Prove the backend uses a shared names-only exchange configuration contract for profile API-key create/test validation and keeps unsupported exchange API-key probes fail-closed without exposing credential values.

## Scope
- `apps/api/src/modules/profile/apiKey/apiKey.types.ts`
- `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
- `docs/modules/api-exchange.md`
- Soar state/context ledgers for this proof packet

## Implementation Plan
1. Replace duplicated API-key exchange enum literals with `EXCHANGE_OPTIONS` from `@cryptosparrow/shared`.
2. Add a focused API e2e regression asserting API-key schemas consume exactly the shared names-only exchange list and capability matrix.
3. Reuse existing API-key e2e proof for encrypted storage, masked responses, ownership, provided/stored Binance and Gate.io probes, and unsupported placeholder probe fail-closed behavior.
4. Run focused API proof tests plus API typecheck.
5. Record source-control and deployment posture.

## Acceptance Criteria
- API-key create/test validation uses the shared exchange names contract.
- Binance and Gate.io API-key probes remain supported in local test mode.
- BYBIT, OKX, KRAKEN, and COINBASE API-key probes fail closed with `EXCHANGE_NOT_IMPLEMENTED`.
- API-key test endpoints do not persist provided secrets and audit metadata excludes raw key/secret values.
- No live exchange mutation, production smoke, protected secret readback, order, position, or live-trading action occurs.

## Definition Of Done
- [x] Names-only exchange validation source is centralized through `@cryptosparrow/shared`.
- [x] Focused API tests pass.
- [x] API typecheck passes.
- [x] Task evidence and module confidence are updated.
- [x] Source-control closure is explicit.

## Forbidden
- Reading, printing, or storing real exchange credentials.
- Running live exchange mutation, orders, positions, or live-trading checks.
- Introducing a parallel exchange configuration registry.
- Deploying, pushing, restarting, or mutating production.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeCapabilityContract.regression.test.ts`
  - Result: PASS, `4` files / `41` tests.
- Typecheck:
  - `pnpm --filter api run typecheck`
  - Result: PASS, `tsc --noEmit`.
- Manual checks:
  - `git diff -- apps/api/src/modules/profile/apiKey/apiKey.types.ts apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`
  - Result: scoped to API-key validation enum source and focused names-only configuration test.
- High-risk checks:
  - No production/protected proof, no exchange credential readback, no API-key value in evidence, no exchange mutation.
- Reality status: `verified`.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/api-exchange.md`
  - `docs/security/api-key-lifecycle-policy.md`
  - `history/tasks/luc-5622-known-state-evidence-architecture-baseline-2026-06-27-task.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture/doc updates: `docs/modules/api-exchange.md` refreshed with this proof.

## Security / Privacy Evidence
- Data classification: exchange API key material / secret.
- Trust boundaries: authenticated profile API-key endpoints, shared names-only configuration, exchange capability matrix, encrypted DB storage, audit log metadata.
- Permission or ownership checks: existing e2e proof covers unauthenticated rejection and cross-user stored-key test/update/delete/rotate/revoke denial.
- Abuse cases:
  - Unsupported exchange probe request fails closed with `501` / `EXCHANGE_NOT_IMPLEMENTED`.
  - API-key test without persistence leaves zero `ApiKey` rows.
  - Audit metadata excludes raw submitted/stored key and secret values.
- Secret handling: no real secret values read or recorded; tests use synthetic local strings only.
- Fail-closed behavior: verified for placeholder exchange API-key probes.
- Residual risk: browser/UI proof for Exchange connection/configuration remains outside this backend heartbeat.

## Source-Control Posture
- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main...origin/main` is `ahead 14, behind 1`.
- Worktree baseline: mixed dirty before this task, including unrelated state/evidence, generated graph outputs, runner changes, lockfile/workspace files, and previous API test/runtime changes.
- Commit: not created because the worktree is already mixed dirty and branch-divergent; do not push or deploy from this state.
- Push status: blocked/held for release owner.
- Deploy impact: none.

## Result Report
- Task summary: API-key validation now uses the shared names-only exchange configuration, and focused backend proof verifies Binance/Gate.io support plus fail-closed placeholder probes without credential exposure.
- Files changed: `apps/api/src/modules/profile/apiKey/apiKey.types.ts`, `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts`, `docs/modules/api-exchange.md`, task/state/context files.
- How tested: focused API proof pack PASS (`41/41`); API typecheck PASS.
- What is incomplete: frontend/browser Exchange connection proof and any production/protected exchange proof remain separate owner lanes.
- Next steps: QVE/Frontend may run no-secret browser proof for `/dashboard/profile#api` if [LUC-5636](/LUC/issues/LUC-5636) still requires user-facing evidence after backend closure.
