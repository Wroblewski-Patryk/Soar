# LUC-1656 Unauthenticated `/dashboard/bots` Guard Diagnosis

Date: 2026-07-22

## Finding

The unauthenticated `/dashboard/bots` guard is not fail-open in the web app middleware.

## Reproduction

I ran a minimal isolated check against `apps/web/src/middleware.ts` with `NextRequest('https://soar.test/dashboard/bots')` and an empty cookie header. The middleware returned:

- status: `307`
- location: `https://soar.test/auth/login`

## Classification

This is a harness/proof false positive, not a real route guard bypass.

The browser proof runner in `scripts/runLocalProtectedRouteActionProof.mjs` samples the initial unauthenticated navigation immediately after `Page.navigate` plus a fixed settle delay. That path should be treated as suspect when it disagrees with the direct middleware HTTP result.

## Impact

- No production/auth code change was required.
- The authenticated bot-edit proof from LUC-1653 remains valid.
- The security issue should be closed as a false positive once the issue record is updated with the reproduction evidence.
