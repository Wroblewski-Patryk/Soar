# LUC-1438 Production Smoke Auth Binding Refresh Evidence

- Issue: [LUC-1438](/LUC/issues/LUC-1438)
- Parent: [LUC-1437](/LUC/issues/LUC-1437)
- Timestamp: 2026-06-02T08:12:18+02:00
- Agent role: QA Regression Lead
- Repository HEAD: `9fe67647`
- Scope: redaction-safe verification of current production smoke auth binding availability for protected `GET /workers/ready`.

## Context

[LUC-1438](/LUC/issues/LUC-1438) asks for a valid approved read-only production smoke auth binding/session so Ops can rerun worker-included production smoke for [LUC-1437](/LUC/issues/LUC-1437).

## Secret Handling

No secret values, cookies, tokens, passwords, payment data, exchange API keys, or account-private data were printed, stored, or added to repo artifacts.

Names-only environment probe result:

| Binding name | Present | Shape |
| --- | --- | --- |
| `SMOKE_AUTH_TOKEN` | false | absent |
| `SMOKE_AUTH_EMAIL` | false | absent |
| `SMOKE_AUTH_PASSWORD` | false | absent |
| `SMOKE_OPS_BASIC_USER` | false | absent |
| `SMOKE_OPS_BASIC_PASSWORD` | false | absent |
| `SMOKE_OPS_AUTH_HEADER_NAME` | false | absent |
| `SMOKE_OPS_AUTH_HEADER_VALUE` | false | absent |

Filtered secret-adjacent environment names visible in this runner:

- `BETTER_AUTH_SECRET`
- `FIGMA_OAUTH_TOKEN`
- `npm_package_dependencies_better_auth`

No approved Soar smoke auth binding name was available in this heartbeat runtime.

## Verification

Command:

```powershell
corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

```text
[deploy-smoke] summary
- PASS API /health -> 200
- PASS API /ready -> 200
- PASS WEB / -> 200
- PASS WEB /api/build-info -> 200
- FAIL API /workers/ready -> status 401
[deploy-smoke] failed checks: 1
```

## Classification

- Public production smoke surface: verified healthy for `/health`, `/ready`, web `/`, and web `/api/build-info`.
- Protected worker readiness proof: blocked by missing approved auth binding in this runner.
- Current binding path for Ops: missing.
- API auth acceptance for protected `GET /workers/ready`: not verified; current no-auth smoke returns `401`.

## Required Unblock

Security/Test credential owner must provide or expose one approved read-only production ADMIN smoke binding to the Paperclip lane runtime:

- either `SMOKE_AUTH_TOKEN` with a valid API-auth-accepted session/JWT shape;
- or `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD` for a production smoke principal accepted by `/auth/login`.

After that, Ops can rerun:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

## Disposition

[LUC-1438](/LUC/issues/LUC-1438) should be `blocked` until a credential/security owner exposes a valid approved binding. This QA heartbeat cannot refresh a production principal without a valid credential source, and fabricating or bypassing auth would violate the issue's forbidden scope.
