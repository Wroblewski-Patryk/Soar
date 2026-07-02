# Task

## Header

- ID: LUC-5531
- Title: Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P0
- Mission ID: LUC-5531-AUTHENTICATED-PRODUCTION-ACCEPTANCE-2026-06-27
- Mission Status: VERIFIED

## Context

Recurring QA heartbeat for Soar production acceptance. The issue requires
stored production UI audit credentials, read-only user journeys, timing checks,
worker/runtime freshness, and fail-closed handling for protected or mutating
actions.

## Goal

Verify current production Soar as a paid-product acceptance slice without
mutating production data, exchange state, billing, deployment, or credentials.

## Scope

- Production public Web/API smoke.
- Authenticated route/module reachability for dashboard and admin surfaces.
- Auth/session browser boundary proof.
- Lightweight route timing.
- Runtime freshness and rollback guard.
- Evidence and Paperclip disposition.

## Implementation Plan

1. Read the Paperclip wake, QVE role, and Soar production safety contracts.
2. Confirm approved credential names are present without printing values.
3. Run project-native production smoke and UI/auth proof scripts.
4. Run bounded timing, runtime freshness, and rollback guard checks.
5. Clean up validation browser resources.
6. Record evidence and update [LUC-5531](/LUC/issues/LUC-5531).

## Acceptance Criteria

- Public production endpoints return `200`.
- Authenticated UI module clickthrough passes.
- Auth/session fail-closed behavior passes.
- Runtime freshness passes.
- Rollback guard does not recommend rollback.
- No prohibited production mutation or secret disclosure occurs.
- Evidence is inspectable by another agent.

## Definition Of Done

- [x] Relevant production read-only smoke checks passed.
- [x] Authenticated UI proof passed.
- [x] Auth/session proof artifact passed.
- [x] Runtime freshness and rollback guard passed.
- [x] Cleanup evidence recorded.
- [x] Residual performance risk recorded.

## Validation Evidence

- Public smoke: PASS for API `/health`, API `/ready`, Web `/`, Web
  `/api/build-info`.
- Process-lost retry recheck: PASS for the same public endpoints using
  direct `node scripts/deploySmokeCheck.mjs --no-workers`; no validation
  browser process rows remained.
- UI clickthrough: PASS, artifact
  `docs/operations/prod-ui-module-clickthrough-2026-06-27.md`.
- Auth/session proof: PASS artifact
  `docs/operations/prod-auth-session-browser-proof-current-2026-06-27.md`.
- Timing: all five-sample route probes returned `200`; API `/health` had one
  low-second outlier.
- Runtime freshness: PASS, `runningCount=5`, no stale session ids.
- Rollback guard: PASS, `shouldRollback=false`, no alerts.
- Cleanup: no validation-created Edge/Chrome/headless process remained.

## Architecture Evidence

- Architecture source reviewed: production safety and runtime validation
  contracts through AGENTS.md, role instructions, and existing Soar state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=false`.
- Observability or alerting impact: API `/health` latency tail remains watchful.

## Security / Privacy Evidence

- Data classification: production auth/session metadata only, no credential
  values stored.
- Secret handling: secret values were passed through environment/arguments and
  not printed or written to artifacts.
- Fail-closed behavior: invalid token redirected to expired-session login;
  `/auth/me` after logout returned `401`.
- Residual risk: none for secret disclosure observed; auth proof command
  wrapper timeout occurred after PASS artifact generation.

## Result Report

- Task summary: Production acceptance passed for public smoke, authenticated
  UI routes, auth/session fail-closed behavior, runtime freshness, and rollback
  guard.
- Files changed: this task packet and evidence packet, plus generated
  `docs/operations/*2026-06-27*` proof artifacts.
- How tested: see `history/evidence/luc-5531-authenticated-production-acceptance-performance-sweep-2026-06-27.md`.
- What is incomplete: no Coolify deep host/proxy/container log-window capture
  was run; not required for green acceptance and no outage was observed.
- Next steps: continue routine DRE/Ops correlation only if API `/health` tails
  recur or start affecting `/ready`, dashboard, or worker readiness.
