# Security And Privacy Audit - 2026-05-19

## Scope

Audit ID: `AUD-06`

Purpose: refresh the reusable security/privacy audit by comparing the security
contracts documented in the repo with the currently tested implementation.

This audit inspected and validated:

- auth/session lifecycle and fail-closed behavior
- trusted-origin middleware
- rate limiting
- security and cache headers
- profile security routes
- API-key storage, masking, probes, ownership, and destructive actions
- cross-module data isolation
- stage abuse throttling
- Web auth/profile/API-key behavior

## Result

Status: `current local / current historical production-safe proof`

The local implementation is aligned with the documented V1 security/privacy
contracts for the audited surfaces. Focused local API and Web proofs passed
after starting the local Postgres/Redis stack for DB-backed API tests.

The historical production-safe proof from 2026-05-14 remains the latest
production evidence for protected/fail-closed security behavior. No production
journey was rerun in this audit.

## Validation Run

| Command / Proof | Result | Notes |
| --- | --- | --- |
| `pnpm --filter api exec vitest run ...auth/security focused pack...` | BLOCKED | First attempt used `pnpm` directly and failed because `pnpm` was not on PATH in this session. |
| `corepack pnpm --filter api exec vitest run src/modules/auth/auth.service.test.ts src/modules/auth/auth.cookie.test.ts src/modules/auth/auth.jwt.test.ts src/modules/auth/auth.errors.test.ts src/middleware/requireAuth.test.ts src/middleware/requireTrustedOrigin.test.ts src/middleware/rateLimit.test.ts src/router/security-headers.test.ts src/router/cacheHeaders.test.ts` | BLOCKED, then PASS | First `corepack` run had `6` files / `23` tests passing and `3` DB-backed files blocked by missing local Postgres at `localhost:5432`. After `corepack pnpm run go-live:infra:up`, the same pack passed: `9` files, `32` tests. |
| `corepack pnpm --filter api exec vitest run src/modules/auth/auth.e2e.test.ts src/modules/profile/basic/basic.e2e.test.ts src/modules/profile/security/security.e2e.test.ts src/modules/profile/apiKey/apiKey.e2e.test.ts src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/profile/stage-abuse-throttling.e2e.test.ts src/modules/isolation/data-isolation.e2e.test.ts` | PASS | `7` files, `47` tests. Covers auth e2e, profile basic/security, API-key secrecy/probes/ownership, abuse throttling, and cross-module isolation. |
| `corepack pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/lib/api.test.ts src/features/auth/hooks/useLoginForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx src/features/profile/components/ApiKeyForm.test.tsx src/features/profile/components/ApiKeysList.test.tsx src/features/profile/components/Security.test.tsx` | PASS | `7` files, `28` tests. |
| `node .\node_modules\vitest\vitest.mjs run 'src/app/(public)/auth/authPageCacheContract.test.ts'` from `apps/web` | PASS | `1` file, `2` tests. This direct Vitest invocation avoids PowerShell/Corepack shim parsing of parentheses in the route-group path. |
| `corepack pnpm run go-live:infra:down` | PASS | Local Postgres/Redis containers and network were removed after the DB-backed proof. |

## Architecture And Documentation Parity

The audited behavior matches the repo security contracts reviewed for this
slice:

- `docs/security/secure-development-lifecycle.md`
- `docs/modules/api-auth.md`
- `docs/modules/api-profile.md`
- `docs/analysis/reusable-audit-registry.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/risk-register.md`
- `.agents/state/requirements-verification-matrix.md`

No architecture mismatch was found in the audited security/privacy surfaces.

## Security Findings

| ID | Severity | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| AUD-SEC-001 | P0 | Auth/session fail-closed behavior remains covered locally. | Focused auth middleware/service/header pack passed `9` files / `32` tests; auth e2e included in the broader DB-backed pack. | closed |
| AUD-SEC-002 | P0 | Profile API-key secrecy and ownership remain covered locally. | API-key e2e/probe tests passed inside the broader DB-backed pack; Web API-key form/list tests passed. | closed |
| AUD-SEC-003 | P0 | Cross-module ownership isolation remains covered locally. | `src/modules/isolation/data-isolation.e2e.test.ts` passed. | closed |
| AUD-SEC-004 | P1 | External independent security review is still not represented by automated proof. | The repository contains local and production-safe internal proofs, but no external review artifact was found or executed in this audit. | open governance follow-up |

## Execution Notes

- `pnpm` was not available directly on PATH in this Codex session; `corepack
  pnpm` is the reliable invocation.
- DB-backed security tests require local Postgres/Redis; missing local infra is
  an environment blocker, not a product failure.
- The route-group path `src/app/(public)/auth/...` is fragile through the
  Windows/Corepack shell shim. Direct `node .\node_modules\vitest\vitest.mjs`
  from `apps/web` is the verified workaround for this test invocation only.

## Safety Notes

- No production journey was run.
- No LIVE order, cancel, close, or exchange-side mutation was run.
- No existing production data was mutated.
- No raw credentials, tokens, cookies, passwords, private headers, or API
  secrets were written to this artifact.
- Local Postgres/Redis were started only for DB-backed tests and then stopped.

## Current Reusable Audit State

`AUD-06` is current for local V1 security/privacy behavior and remains backed
by historical production-safe protected proof from 2026-05-14.

Keep this audit open for:

1. refreshing production-safe proof after future deployments;
2. adding an external independent security review before broader public launch;
3. rerunning the same focused packs after auth, profile, API-key, middleware,
   crypto, rate-limit, or ownership-isolation changes.
