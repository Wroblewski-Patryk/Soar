# Task

## Header
- ID: LUC-6894
- Title: Restore Production Runtime For Public Probe
- Task Type: release
- Current Stage: verification
- Status: PARTIALLY_DONE
- Owner: DRE / Ops Release
- Depends on: protected runtime auth context for full worker acceptance
- Priority: P0
- Mission ID: LUC-6894-PUBLIC-PROBE-RUNTIME-RESTORE-2026-07-02
- Mission Status: PUBLIC_PROBE_RESTORED / PROTECTED_RUNTIME_PROOF_BLOCKED

## Context

[LUC-6894](/LUC/issues/LUC-6894) was woken after the narrow production runtime
mutation confirmation was accepted. Prior evidence showed API health ready while
public Web and Web build-info returned `503`, with `soar-web` and
`workers-backtest` unhealthy in Coolify.

## Goal

Restore the public Web probe using the smallest approved production runtime
mutation, then verify public smoke and protected runtime/rollback gates where
the runner has approved credentials.

## Constraints

- Mutate only approved Coolify application resources: `soar-web` and
  `workers-backtest`.
- Do not push or deploy from the dirty/divergent local checkout.
- Do not edit env, DNS, proxy, database, Redis, accounts, payments, exchanges,
  orders, positions, subscriptions, or live-trading state.
- Do not print or store secret values, raw Coolify resource ids, raw logs, or
  raw Coolify objects.

## Definition of Done

- [x] Accepted permit confirmed.
- [x] Approved target resources identified.
- [x] Smallest approved lifecycle mutation attempted.
- [x] Public deploy smoke rerun.
- [x] Protected runtime/rollback proof attempted without secret disclosure.
- [x] Residual blocker recorded.

## Forbidden

- Secret disclosure.
- Product code changes.
- Commit, push, or release deploy from the dirty/divergent checkout.
- Broad Coolify mutation outside `soar-web` and `workers-backtest`.
- Live account, subscription, payment, exchange, order, position, or trading
  mutation.

## Validation Evidence

- Coolify lifecycle mutation:
  - `restart` queued for `soar-web` -> HTTP `200`.
  - `restart` queued for `workers-backtest` -> HTTP `200`.
  - `start` queued for `soar-web` -> HTTP `200`.
- Public deploy smoke:
  - `corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - Result: `PASS`; API `/health`, API `/ready`, Web `/`, and Web
    `/api/build-info` all returned `200`.
- Direct Web build-info:
  - `gitSha` short `c357d957741f`
  - `gitRef` `main`
  - `metadataSource` `env-runtime`
- Protected checks:
  - email/password auth path failed before runtime proof with login `503 Rate
    limit temporarily unavailable`.
  - token auth path failed closed with HTTP `401` for runtime freshness and
    rollback guard endpoints.
- Coolify post-restore inventory:
  - project-scoped inventory returned HTTP `500` on repeated read-only checks.

## Deployment / Ops Evidence

- Deploy impact: no source deploy from local checkout; Coolify application
  lifecycle restart/start only.
- Resource impact: `soar-web` restored public serving; `workers-backtest`
  restart accepted and detailed status was observed as `running:unknown`.
- Rollback impact: no rollback executed; rollback remains available through
  Coolify stable compatible artifact path.
- Residual risk: protected worker readiness/runtime freshness/alerts remain
  unverified because current auth paths fail closed; Coolify inventory endpoint
  became unstable with HTTP `500` after restoration.

## Result Report

Public probe restoration succeeded for the user-visible Web route and
build-info. Full production runtime acceptance remains incomplete until
Ops/Security provides a valid protected runtime/ops auth context and Coolify
inventory readback is stable enough to confirm resource status after the
mutation.
