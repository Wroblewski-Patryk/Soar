# SECURITY-RED-TEAM-HARDENING-2026-05-21

Last updated: 2026-05-21

## Context

The operator asked for an adversarial security review before selling access to
Soar, because the product handles autonomous capital-management workflows. The
coordinator reran the security agent lanes after the first agent set was closed,
so the final report is based on completed second-round lane reports rather than
partial background tasks.

## Goal

Find and repair security defects that can be validated locally without
production secrets, production mutation, LIVE exchange-side mutation, or raw
credential exposure.

## Scope

- Auth, authorization, sessions, admin privileges, and rate limits.
- Secrets, deployment defaults, logging, audit events, and dependency
  vulnerabilities.
- Trading and money-impacting fail-closed behavior for LIVE-sensitive paths.
- Frontend security posture for CSP, API error presentation, and client-side
  access assumptions.

## Constraints

- Do not claim an uncrackable or literal 100 percent secure system.
- Do not run production mutations or LIVE exchange-side mutations.
- Do not print or store raw secrets.
- Preserve unrelated dirty worktree changes.
- Keep API/Web changes aligned with the existing architecture and fail-closed
  safety posture.

## Definition of Done

- Agent lanes complete and report objective findings.
- Confirmed P1/P2 local defects are repaired or explicitly recorded as
  residual risk.
- Relevant focused tests, typechecks, build, guardrails, and dependency audit
  pass.
- Source-of-truth state is updated.
- Local DB/Redis and validation processes started for the mission are cleaned
  up before closure.

## Forbidden

- Live-money order placement, cancellation, or position mutation.
- Production data mutation.
- Secret value capture in logs, artifacts, or docs.
- Temporary bypasses, mock-only fixes, or hidden risk acknowledgements.

## Delivery Stage

Stage: verification and hardening closure.

Expected output: security findings, repaired defects, validation evidence,
residual risk, and next hardening work.

## Responsibility Lanes

| Lane | Owner | Output | Status |
| --- | --- | --- | --- |
| Auth / Authorization | Security agent + coordinator | stale admin-token, limiter, and ops-network findings plus fixes | completed |
| Secrets / Ops | Security agent + coordinator | secret readiness, compose defaults, logging, audit, and dependency findings plus fixes | completed |
| Trading / Money Safety | Security agent + coordinator | LIVE fail-closed and exchange-adapter findings plus fixes | completed |
| Frontend Security | Security agent + coordinator | CSP and production error-surface findings plus fixes | completed |
| Integration / Validation | Coordinator | focused tests, audit, typecheck, build, state sync, cleanup | completed |

## Findings And Fixes

| ID | Severity | Area | Finding | Result |
| --- | --- | --- | --- | --- |
| SEC-2026-05-21-01 | P1 | Auth/Admin | Demoted admin could keep an old admin JWT until token expiry. | `requireAuth` now uses database role/email/session version; admin role changes increment `sessionVersion`; stale demoted-admin e2e added. |
| SEC-2026-05-21-02 | P2 | Auth/Rate limit | Auth limiter could be spread across rotated email identifiers. | Register/login now also use an IP-scoped limiter; rotated-email regression test added. |
| SEC-2026-05-21-03 | P2 | Ops network | Production private-network ops access defaulted too permissively. | Production private-network allowance now defaults off; regression test added. |
| SEC-2026-05-21-04 | P1 | Secrets/Deploy | Placeholder or weak production secrets could pass readiness, and VPS compose had unsafe defaults. | Critical secret readiness rejects placeholders/short/repeated material; VPS compose requires explicit secrets, local-bound DB/Redis, and Redis auth. |
| SEC-2026-05-21-05 | P1 | API keys/Audit | API-key lifecycle mutations lacked durable security audit events. | Create, update, rotate, revoke, and delete now emit redacted security audit logs; e2e asserts no raw secret leakage. |
| SEC-2026-05-21-06 | P2 | Logging | Sensitive query params and nested error payloads could leak into logs. | Request URLs and central logger metadata now redact sensitive keys, nested arrays/objects, and `Error` message/stack content. |
| SEC-2026-05-21-07 | P1 | Trading safety | Runtime close accepted missing risk acknowledgement by default. | Runtime close schema defaults `riskAck` to false and rejects empty or false acknowledgements. |
| SEC-2026-05-21-08 | P1 | LIVE entitlements | LIVE order/close paths could rely on stale UI/plan assumptions instead of execution-time entitlement checks. | LIVE order open, runtime close, and runtime loop LIVE bot selection now check current live-trading entitlement. |
| SEC-2026-05-21-09 | P1 | Gate.io futures | Gate.io swap orders could drop reduce-only, hedge side, or leverage/margin convergence behavior. | Swap markets are treated as derivatives for reduce-only, hedge `positionSide`, leverage, and margin handling; tests added. |
| SEC-2026-05-21-10 | P1 | LIVE order truth | Unknown LIVE market status could become local `FILLED`. | Unknown or missing live status now maps fail-closed to `OPEN`; fill-resolution regression packs pass. |
| SEC-2026-05-21-11 | P2 | Pre-trade rules | Min-notional guard could skip when mark price truth failed. | Min-notional with unavailable price now throws `LIVE_PRETRADE_NOTIONAL_PRICE_UNAVAILABLE`. |
| SEC-2026-05-21-12 | P1 | Frontend CSP | Production CSP allowed overly broad inline/script/connect behavior. | Production CSP now uses the theme bootstrap hash and restricted connect origins; tests assert no wildcard scheme sources. |
| SEC-2026-05-21-13 | P1 | Frontend errors | Raw backend/API error strings could surface security-sensitive internals in production UI. | Production error resolver now redacts suspicious token/secret/auth/SQL/Prisma/stack-like messages and falls back safely. |
| SEC-2026-05-21-14 | P1 | Dependencies | Production audit found known Next.js and `ws` vulnerabilities. | Web Next.js upgraded to `15.5.18`; `ws` overridden to `8.20.1`; production audit now reports no known vulnerabilities. |
| SEC-2026-05-21-15 | P2 | Frontend auth/data | Dashboard runtime data could start loading during client auth bootstrap, admin content could render before client admin role confirmation, and API-key frontend response state allowed accidental `apiSecret` fields. | Dashboard runtime widgets now receive `authConfirmed=false` until `/auth/me` confirms the user; runtime data/SSE loading is disabled until confirmed; Admin shell withholds content until `ADMIN` role is confirmed; API-key response types strip accidental secrets and use separate mutation payloads. |
| SEC-2026-05-21-16 | P1 | LIVE entitlement downgrade | Existing execution-time checks were present, but controller mapping could turn LIVE entitlement denial into a generic server error. | DB-backed downgrade regression now covers stale LIVE bot/session/position state; LIVE order open, runtime close, and runtime topology fail closed after downgrade; order/runtime-close controllers map entitlement errors to `403`. |
| SEC-2026-05-21-17 | P1 | Ops evidence secrecy | Stage rehearsal passed protected credentials to the child release gate through CLI args and wrote the full command to artifacts. | Stage rehearsal rejects secret-bearing CLI flags, passes protected values to child release gate through env, and records only secret-free child argv; regression test added. |
| SEC-2026-05-21-18 | P2 | VPS deploy defaults | `.env.vps.example` drifted from hardened compose defaults and still suggested unauthenticated Redis / weak placeholder patterns. | VPS env template now includes explicit `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, authenticated `REDIS_URL`, HTTPS origins, and notes that placeholders intentionally fail readiness. |
| SEC-2026-05-21-19 | P2 | Container hardening | API/Web/worker runtime Docker images ran as root. | Runtime Dockerfiles now use `USER node` with owned runtime files; repository guardrail and regression tests prevent root runtime regressions. |
| SEC-2026-05-21-20 | P2/P3 | Web headers | App-layer web security headers omitted HSTS. | Production headers now include `Strict-Transport-Security: max-age=31536000; includeSubDomains`; regression test added. |
| SEC-2026-05-21-21 | P3 | Local compose exposure | Local Postgres/Redis ports were bound on all interfaces. | Local compose now binds Postgres and Redis to `127.0.0.1`. |

## Positive Evidence

- DCA-first close protection remains aligned in the runtime position-management
  path: DCA checks run before TTP/TSL/SL close protections and close protections
  are gated by DCA completion or exhaustion.
- This security pass did not find a new DCA-first runtime defect; the earlier
  backtester parity defect remains fixed by the frontend/engine sweep.

## Validation Evidence

- Continuation validation:
  - `node --test scripts/runV1StageRehearsal.test.mjs scripts/repoGuardrails.test.mjs` -> `6` tests passed.
  - Web focused security pack -> `151` files / `530` tests passed.
  - API `bots.subscription-entitlements.e2e.test.ts` + `runtimeSessionPositionCommand.service.test.ts` -> `2` files / `17` tests passed.
  - API `orders.service.test.ts` -> `38` tests passed after rerun with explicit `--test-timeout 30000`.
  - API typecheck -> passed.
  - Web typecheck -> passed.
  - `corepack pnpm i18n:audit:route-reachable:web` -> `findings=0`.
  - `docker compose --env-file .env.vps.example -f docker-compose.vps.yml config --quiet` -> passed.
  - `corepack pnpm run build` -> passed.
  - `corepack pnpm run quality:guardrails` -> passed, including the new non-root runtime Dockerfile guardrail.
  - `git diff --check` -> passed with line-ending warnings only.
- `corepack pnpm audit --prod` -> no known vulnerabilities found.
- `corepack pnpm run quality:guardrails` -> passed.
- `corepack pnpm --filter api run typecheck` -> passed.
- `corepack pnpm --filter web run typecheck` -> passed.
- `corepack pnpm run build` -> passed.
- Web focused security tests -> `149` files / `523` tests passed.
- API security/config/logging/runtime focused tests -> `7` files / `33` tests passed.
- API admin/API-key e2e tests -> `2` files / `23` tests passed.
- API orders live-fill/order-service tests -> `2` files / `43` tests passed.
- API exchange focused tests -> `3` files / `35` tests passed.
- API runtime close focused bot e2e selector -> selected test passed.
- API admin users e2e rerun -> `6` tests passed.
- API profile API-key e2e rerun -> `17` tests passed.

## Cleanup Evidence

- Local Postgres/Redis were started for DB-backed e2e validation and stopped
  with `docker compose down`; follow-up `docker ps --filter name=soar` returned
  no running Soar containers.
- No Browser plugin or Playwright browser validation was started in this
  security pass. Final cleanup found four orphaned `chrome-headless-shell`
  rows from a temp Playwright profile with no live parent process; they were
  stopped with a narrow `Get-Process chrome-headless-shell | Stop-Process
  -Force` cleanup, and the follow-up process check returned no rows.
- Continuation cleanup: local Postgres/Redis were started again for the
  DB-backed downgrade proof, then stopped with `docker compose down`; follow-up
  `docker ps --filter name=soar` returned no rows. A final
  `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` check
  returned no rows.

## Residual Risk

- External penetration testing, production configuration review, and cloud/VPS
  hardening are still required before a commercial security claim.
- Current protected production `AUD-19` evidence remains blocked by approved
  protected inputs.
- LIVE exchange-side mutation proof was not run in this mission by design.
- Frontend P2 auth-confirmed rendering, admin role-gate clarity, and API-key
  response typing are now locally fixed and tested.
- Runtime LIVE entitlement downgrade now has DB-backed local regression proof.
- Remaining local follow-ups from this continuation are lower priority:
  local Redis still has no password in development compose by design; production
  Redis is authenticated through `docker-compose.vps.yml`.
