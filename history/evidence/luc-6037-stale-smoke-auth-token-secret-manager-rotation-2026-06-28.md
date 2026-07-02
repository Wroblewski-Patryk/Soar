# LUC-6037 Stale SMOKE_AUTH_TOKEN Secret-Manager Rotation Closure

Date: 2026-06-28

## Scope

DRE heartbeat for [LUC-6037](/LUC/issues/LUC-6037), linked to
[LUC-5869](/LUC/issues/LUC-5869) and [LUC-6024](/LUC/issues/LUC-6024).

No secret values were printed, copied, stored, rotated, or committed. No deploy,
restart, rollback, production account mutation, DB/Redis mutation, exchange
mutation, order, position, subscription/payment mutation, or live-trading action
occurred.

## Findings

- Initial DRE runner injected `SMOKE_AUTH_TOKEN` by name:
  `PRESENT(len=36)`, and reproduced protected smoke failure before owner-path
  mutation.
- Current DRE runner also has fresh-login smoke credentials by name:
  `SMOKE_AUTH_EMAIL=PRESENT(len=26)` and
  `SMOKE_AUTH_PASSWORD=PRESENT(len=9)`.
- Paperclip CLI is not available in this runner:
  `paperclipai` command not found.
- Direct Paperclip secret metadata route was denied:
  `GET /api/companies/{companyId}/secrets -> 403`.
- [LUC-6065](/LUC/issues/LUC-6065) and [LUC-6066](/LUC/issues/LUC-6066)
  completed the owner-path mutation: affected Paperclip agent configs no
  longer carry the central `SMOKE_AUTH_TOKEN` binding, while
  `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` remain for the fresh-login
  smoke path.
- Current DRE runner after child completion shows `SMOKE_AUTH_TOKEN=ABSENT`,
  `SMOKE_AUTH_EMAIL=PRESENT(len=26)`, and
  `SMOKE_AUTH_PASSWORD=PRESENT(len=9)`.

## Validation

Current-binding smoke:

`pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`

Result:

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 200`
- `WEB /api/build-info -> 200`
- `API /workers/ready -> 401`

Fresh-login smoke after process-local token clear:

`$env:SMOKE_AUTH_TOKEN=''; pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`

Result:

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 200`
- `WEB /api/build-info -> 200`
- `API /workers/ready -> 200`

Post-mutation current-binding smoke in the resumed DRE runner:

`pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`

Result:

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 200`
- `WEB /api/build-info -> 200`
- `API /workers/ready -> 200`

## Disposition

Done. [LUC-6065](/LUC/issues/LUC-6065) and
[LUC-6066](/LUC/issues/LUC-6066) resolved the owner-path blocker, and DRE
verified the resumed current-binding production smoke now reaches the
fresh-login path and passes protected `API /workers/ready -> 200` without
exposing secret values.
