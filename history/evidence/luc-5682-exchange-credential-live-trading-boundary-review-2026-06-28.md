# LUC-5682 Exchange Credential And Live-Trading Boundary Review - 2026-06-28

## Status

`DONE / SECURITY_REVIEW_COMPLETE / PARTIALLY_VERIFIED_LOCAL / QA_TEST_CLEANUP_RESIDUAL_DELEGATED`

## Scope

Security and privacy review for [LUC-5682](/LUC/issues/LUC-5682), child of
[LUC-5636](/LUC/issues/LUC-5636).

Reviewed surfaces:

- Exchange API-key create/list/update/rotate/revoke and connection-test flow.
- API-key encryption, masking, and audit metadata behavior.
- Exchange authenticated read and live-order adapter boundary.
- LIVE order submit/cancel guard layering: authorization, ownership, entitlement, risk acknowledgement, live opt-in, consent version, capability matrix, pre-trade guards, and connector disconnect.
- Secret exposure and local tracked environment-file posture.

Explicit exclusions:

- No production secret/account readback.
- No protected production smoke.
- No exchange mutation, order placement, order cancellation, position mutation, live trading action, deploy, push, restart, or env edit.

## Findings

### PASS - Credential Storage And Redaction

- `apps/api/src/modules/profile/apiKey/apiKey.service.ts` encrypts API key and secret values on create/update/rotate with `encrypt()`.
- Public API-key responses use `toPublicApiKey()` and return only masked key material; `apiSecret` is not returned.
- API-key lifecycle and probe audit metadata records key id, exchange, probe status, latency, and permissions without raw key/secret values.
- `apps/api/src/utils/crypto.ts` uses versioned AES-GCM for new writes and keeps legacy CBC decrypt-only compatibility.
- `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.ts` is the decrypt-at-adapter-entry point for authenticated connector creation, so stored encrypted values are not exposed to API responses but can be used by the exchange connector boundary.

### PASS - Authorization And Ownership

- API-key list/create/update/delete/rotate/revoke/test endpoints require `req.user.id`.
- Sensitive API-key operations scope database lookups by `id + userId`.
- Bot API-key resolution in `apps/api/src/modules/bots/botApiKeyResolver.service.ts` rejects unowned or exchange-mismatched API keys.
- Exchange live execution key resolution checks user ownership, bot/wallet key binding, and exchange match before connector creation.

### PASS - Live-Trading Boundary

- Manual LIVE order open requires `riskAck`, LIVE bot context, bot active state, live opt-in, consent text version, compatible inherited LIVE execution context, resolved manual strategy scope, and subscription live-trading entitlement before exchange submit.
- Exchange submit/cancel passes through `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts`, which checks exchange/market capability support before connector creation.
- LIVE order submit runs live pre-trade guards and margin/leverage convergence before adapter placement.
- LIVE order cancel requires `riskAck`, subscription live-trading entitlement, a resolvable exchange cancel context, and exchange-boundary cancellation before local order mutation.
- Unsupported exchange operations fail closed with explicit capability errors.

### PASS - No-Secret Local File Posture

- Tracked env scan found only example env files:
  `.env.coolify.example`, `.env.docker.example`, `.env.vps.example`,
  `apps/api/.env.example`, and `apps/web/.env.example`.
- Local `apps/api/.env` exists but is not tracked; no value was printed or copied into this artifact.

## Validation

Command attempted:

```powershell
pnpm --filter api exec vitest run src/utils/crypto.test.ts src/utils/securityUtilities.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts --runInBand
```

Result:

- Failed before tests because Vitest 3.2.4 does not support `--runInBand`.

Command rerun:

```powershell
pnpm --filter api exec vitest run src/utils/crypto.test.ts src/utils/securityUtilities.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts
```

Result:

- PASS: `src/utils/crypto.test.ts` (`4/4`).
- PASS: `src/utils/securityUtilities.test.ts` (`7/7`).
- PASS: `src/modules/exchange/exchangeAdapterBoundary.service.test.ts` (`13/13`).
- PASS: `src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts` (`2/2`).
- PASS: `src/modules/orders/orders.liveCancelBoundary.service.test.ts` (`2/2`).
- PARTIAL/FAIL: `src/modules/profile/apiKey/apiKey.e2e.test.ts` (`13/18` passed, `5` failed).

API-key e2e failure signatures:

- Unexpected register/create/update statuses: `500`, `401`, and `404`.
- Cleanup failure:
  `Foreign key constraint violated on the constraint: Log_userId_fkey` from
  `apps/api/src/modules/profile/apiKey/apiKey.e2e.test.ts:60`.

Interpretation:

- The focused security boundary unit/service tests passed.
- API-key e2e verification is not fully green in the current local DB state because the test cleanup path leaves user-linked rows behind. This is a QA/test-harness residual, not proof of raw secret exposure or live-trading boundary bypass.

## Abuse Cases Checked

| Abuse Case | Status | Evidence |
| --- | --- | --- |
| Unauthenticated API-key access | Partially verified | API-key e2e includes unauthenticated list/probe checks; passing subset returned `401`. |
| Cross-user API-key update/delete/test | Partially verified | API-key e2e ownership checks exist and several passed; full file is not green due cleanup residual. |
| API response leaks raw key/secret | Verified local | API-key e2e storage/masking test passed; `apiSecret` omitted and stored values differ from plaintext. |
| Probe persists raw provided credentials | Verified local | API-key e2e probe test passed; no `ApiKey` row persisted and audit metadata excludes raw values. |
| Unsupported exchange action proceeds | Verified local | Exchange capability tests passed; unsupported operations throw explicit fail-closed errors. |
| LIVE cancel mutates locally before exchange boundary | Verified local | Live cancel boundary test passed; exchange cancel called before local status mutation. |
| Subscription downgrade still allows LIVE cancel | Verified local | Live cancel boundary test passed; FREE plan blocks before exchange cancel and local mutation. |
| Encrypted stored values cannot reach connector | Reviewed | Registry decrypts at authenticated connector creation. |

## Residual Risk

- API-key e2e cleanup/test isolation is not green and should be repaired by QA/Test Automation or Backend before claiming full API-key lifecycle regression coverage from this pack. Follow-up [LUC-5693](/LUC/issues/LUC-5693) was created for this residual.
- Production exchange credential proof remains approval-gated. This review did not read production secrets, run protected production probes, or mutate exchange state.
- The current issue can close as security review complete because the requested artifact/pass-fail review is delivered and no security-critical bypass was found in inspected boundaries.

## Source-Control / Deployment Impact

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`.
- Files changed by this heartbeat: evidence/task/state documentation only.
- Commit: not committed; shared worktree was already mixed dirty before this heartbeat.
- Push/deploy/restart: none.
