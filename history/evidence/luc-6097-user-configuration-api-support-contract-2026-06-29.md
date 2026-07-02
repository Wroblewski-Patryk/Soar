# LUC-6097 User Configuration API/Support Contract Proof

Date: 2026-06-29

## Parent Closure Update

After [LUC-6105](/LUC/issues/LUC-6105) restored local PostgreSQL/Docker and
[LUC-6106](/LUC/issues/LUC-6106) reconciled API/support doc links, the CBE
parent reran the focused local proof successfully.

PASS:

```powershell
$env:DATABASE_URL='postgresql://postgres:password@localhost:5432/cryptosparrow?schema=public'
$env:REDIS_URL='redis://localhost:6379'
pnpm --filter api exec vitest run src/config/criticalSecretsReadiness.test.ts src/config/proxyTrust.test.ts src/config/runtimeExecution.test.ts src/modules/profile/basic/basic.e2e.test.ts src/modules/profile/security/security.e2e.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts --reporter=verbose
```

Result: `6` files / `28` tests passed.

Runtime checks before the rerun:

- `Test-NetConnection -ComputerName localhost -Port 5432`:
  `TcpTestSucceeded=True`.
- `docker ps --format "{{.Names}} {{.Status}} {{.Ports}}"`:
  `soar-postgres-1` and `soar-redis-1` running on loopback.

Cleanup after the parent proof:

- `pnpm run go-live:infra:down`: PASS; stopped and removed
  `soar-postgres-1`, `soar-redis-1`, and `soar_default`.

Current generated User configuration counts after [LUC-6106](/LUC/issues/LUC-6106):

| Flow | Total | Browser review | Missing test link | Missing doc link | Implemented needs proof | OK |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| User configuration | 160 | 24 | 81 | 30 | 13 | 12 |

The total changed from `152` to `160` because the generated architecture/app-
completion indexes now include newer task/evidence entities. The API/support
doc-link residual dropped from `49` to `30`; remaining missing-doc rows are
owned outside this CBE closure except the two Backend/API platform rows named
by [LUC-6106](/LUC/issues/LUC-6106).

Parent disposition: `DONE / VERIFIED_LOCAL_API_SUPPORT_CONTRACT /
DB_BACKED_PROFILE_ROUTE_PROOF_PASS / DOC_LINK_CHILD_RECONCILED`.

Residual outside this issue:

- remaining User configuration browser-review and Web profile/platform
  doc/test-link rows need DSM/Frontend/Web ownership, not CBE implementation;
- two Backend/API platform doc-link rows remain classified by [LUC-6106](/LUC/issues/LUC-6106)
  as outside the profile/configuration API/support slice;
- production/protected account smoke, deploy, secret/account readback,
  exchange/payment mutation, order, position, and live-trading proof were
  explicitly out of scope and were not performed.

## Scope

- Issue: [LUC-6097](/LUC/issues/LUC-6097)
- Parent: [LUC-6090](/LUC/issues/LUC-6090)
- Flow: User configuration
- Lane: Core Backend Engineer
- Boundary: local, no-secret, no production mutation, no deploy, no restart,
  no protected smoke, no account/secret readback, no exchange/payment mutation,
  no order/position/live-trading action.

## Source Rows

The row set was reconstructed from `docs/graphs/architecture-awareness.json`
with the same classifier used by the app-completion generator. It matches
`docs/status/app-completion-index.json`:

| Flow | Total | Browser review | Missing test link | Missing doc link | Implemented needs proof | OK |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| User configuration | 152 | 24 | 75 | 49 | 3 | 1 |

## Backend/API Rows Inspected

Verified or attempted backend/support surfaces:

- `apps/api/src/config/criticalSecretsReadiness.ts`
- `apps/api/src/config/proxyTrust.ts`
- `apps/api/src/config/runtimeExecution.ts`
- `apps/api/src/modules/profile/apiKey/apiKey.controller.ts`
- `apps/api/src/modules/profile/apiKey/apiKey.service.ts`
- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts`
- `apps/api/src/modules/profile/basic/basic.controller.ts`
- `apps/api/src/modules/profile/basic/basic.service.ts`
- `apps/api/src/modules/profile/security/security.controller.ts`
- `apps/api/src/modules/profile/security/security.service.ts`
- Canonical owner doc: `docs/modules/api-profile.md`

Representative row ids proven by available focused tests:

- `function:evaluateencryptionreadiness:a0c34930a5`
- `function:evaluatejwtrotationreadiness:f94c910286`
- `function:haslegacyencryptionstartupfallback:e643d0c9bd`
- `function:parsekeyring:1479bc3556`
- `function:createtrustproxymatcher:9a5045bc3f`
- `function:shouldtrustprivateproxyranges:e5b8920ee6`
- `function:parseboolean:5adc2ec58a`
- `function:formatprobemessage:19941f0f79`
- `function:formatprobesuccessmessage:a323426621`
- `function:probescope:cd138c3c47`
- `function:toerrormessage:64d4037f5d`

DB-backed route/service rows attempted but not verified in this heartbeat:

- `function:deleteuser:19ebcd0628`
- `function:deleteuser:cea3ec3d3d`
- `function:getuser:2359a52502`
- `function:updateuser:8467ea5d48`
- `function:getuserwithpassword:fdf7e87f26`
- `route:basic-controller-ts:ffa72d35d6`
- `route:basic-service-ts:94dd952a99`
- `route:security-controller-ts:d395c96ddb`
- `route:security-service-ts:6852ee3db`

## Verification

PASS:

```powershell
pnpm --filter api exec vitest run src/config/criticalSecretsReadiness.test.ts src/config/proxyTrust.test.ts src/config/runtimeExecution.test.ts --reporter=verbose
```

Result: 3 files passed, 13 tests passed.

PARTIAL:

```powershell
pnpm --filter api exec vitest run src/modules/profile/basic/basic.e2e.test.ts src/modules/profile/security/security.e2e.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts --reporter=verbose
```

Result:

- `exchangeApiKeyProbe.service.test.ts`: PASS, 8 tests passed.
- `basic.e2e.test.ts`: FAIL before endpoint assertions because Prisma cannot
  reach local PostgreSQL at `localhost:5432`.
- `security.e2e.test.ts`: FAIL before endpoint assertions because Prisma
  cannot reach local PostgreSQL at `localhost:5432`.

Environment check:

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
docker ps --format '{{.Names}} {{.Status}} {{.Ports}}'
```

Result: `TcpTestSucceeded=false`; no Docker containers listed.

## Classification

- Implemented and verified: DB-free configuration support tests and
  API-key probe contract.
- Blocked by environment: DB-backed profile basic/security route proof.
- Present in code, behavior not reverified in this heartbeat:
  DB-backed profile basic/security rows listed above.
- Missing doc/test-link backlog remains scanner/linkage work, not a runtime
  product defect from this heartbeat.
- Web profile rows and browser-review rows are outside CBE ownership and need
  DSM/Frontend classification rather than backend implementation.

## Residual Risk

The User configuration flow is not fully closed. [LUC-6105](/LUC/issues/LUC-6105)
must restore local DB availability before CBE can rerun the profile
basic/security route proof. [LUC-6106](/LUC/issues/LUC-6106) should reconcile
documentation links for already tested support rows so the scanner does not
keep classifying tested support files as unresolved user-facing rows.
