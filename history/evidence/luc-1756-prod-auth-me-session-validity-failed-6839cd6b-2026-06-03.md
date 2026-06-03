# LUC-1756 Production Auth Session Validity Check

## Status

- Result: **FAIL**
- Issue: [LUC-1756](/LUC/issues/LUC-1756)
- Follow-up blocker: [LUC-1774](/LUC/issues/LUC-1774)
- Environment: production
- Evidence date: 2026-06-03
- Target SHA: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- Raw JSON: `history/artifacts/luc-1756-prod-auth-me-session-validity-6839cd6b-2026-06-03.json`

## Context

[LUC-1761](/LUC/issues/LUC-1761) resolved the original missing-input blocker by
binding `PROD_UI_AUDIT_AUTH_TOKEN` by name. QA/Test then resumed
[LUC-1756](/LUC/issues/LUC-1756) and verified the token must be treated as
present but not valid for authenticated app proof.

## Evidence

| Check | Result | Notes |
| --- | --- | --- |
| Protected input names | PARTIAL | `PROD_UI_AUDIT_API_BASE_URL`, `PROD_UI_AUDIT_AUTH_TOKEN`, and `PROD_UI_AUDIT_WEB_BASE_URL` are present by name. |
| Public build-info | PASS | Production SHA remains `6839cd6b8884e26eca735ce32cea98c1dadccfbe`. |
| Redacted `/auth/me` API session validity | FAIL | `GET /auth/me` with `Cookie: token=<redacted>` returned HTTP `401`. |
| Browser session proof | FAIL | `runProdAuthSessionBrowserProof` resolved the token but `/dashboard` stayed on `/auth/login`. |
| Route HTML clickthrough | PASS, limited | `runProdUiModuleClickthroughAudit` rendered protected route HTML using a cookie header; this does not prove the token is a valid app session. |

## Safety

- No secret values, cookies, tokens, passwords, private headers, protected
  payloads, or private response bodies were printed or written.
- No deploy, restart, rollback, env edit, DB write, account mutation,
  subscription mutation, API-key mutation, exchange setting mutation, external
  service mutation, or live-trading action occurred.
- Screenshots were not captured because authenticated browser rendering failed.

## Release Impact

Protected app evidence remains blocked. HTTP route HTML reachability cannot be
substituted for authenticated browser/API session proof. Security Review Lead
must complete [LUC-1774](/LUC/issues/LUC-1774) with a valid, non-expired,
read-only production app session/account class before QA/Test can rerun.
