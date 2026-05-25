# Pipeline: Access/session

Updated: 2026-05-03

## Trigger
User registers, logs in, checks current session, or logs out.

## User/System Action
- Public user submits login/register forms.
- API issues or clears auth cookie/JWT.
- Dashboard/admin APIs require authenticated session.

## Involved Frontend Files
- `apps/web/src/app/(public)/auth/login/page.tsx`
- `apps/web/src/app/(public)/auth/register/page.tsx`
- `apps/web/src/features/auth/*`
- `apps/web/src/middleware.ts`

## Involved Backend Files
- `apps/api/src/modules/auth/auth.routes.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/middleware/requireAuth.ts`
- `apps/api/src/middleware/requireRole.ts`
- `apps/api/src/router/index.ts`

## Involved Services
- Auth service and JWT/session helpers.
- Trusted-origin and no-store header middleware.
- Admin role guard for `/admin/*`.

## Data Read/Write
- Reads/writes `User`.
- Issues or clears session cookie/JWT.

## Failure Points
- Invalid credentials or duplicate registration.
- Expired/invalid token.
- Missing session on dashboard/admin route.
- Admin route accessed by non-admin user.

## Tests
- `apps/api/src/modules/auth/auth.e2e.test.ts`
- `apps/api/src/modules/auth/auth.service.test.ts`
- `apps/api/src/modules/auth/auth.jwt.test.ts`
- `apps/api/src/modules/auth/auth.cookie.test.ts`
- `apps/api/src/middleware/requireAuth.test.ts`
- `apps/api/src/middleware/requireRole.ts` coverage through admin e2e tests.

## Related Docs
- `docs/modules/api-auth.md`
- `docs/modules/web-auth.md`
- `docs/security/security-and-risk.md`
- `docs/architecture/reference/dashboard-route-map.md`

## Known Gaps
- None found in this static documentation pass.
