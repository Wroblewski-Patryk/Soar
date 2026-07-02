# Task

## Header
- ID: LUC-6123
- Title: Rerun Production Auth Session Proof After Logout Repair Release
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: resolved by [LUC-6134](/LUC/issues/LUC-6134)
- Priority: P0
- Module Confidence Rows: Auth session, production app acceptance
- Requirement Rows: production auth-session browser proof; logout fail-closed session invalidation
- Quality Scenario Rows: auth security, production reliability
- Risk Rows: production auth-session regression
- Iteration: 2026-06-29
- Operation Mode: TESTER
- Mission ID: `LUC-6123-PROD-AUTH-SESSION-PROOF-RERUN-2026-06-29`
- Mission Status: DONE

## Context

[LUC-6123](/LUC/issues/LUC-6123) was woken after [LUC-6122](/LUC/issues/LUC-6122)
reported the logout repair source on the production path. [LUC-6122](/LUC/issues/LUC-6122)
clarified that the production-reachable descendant SHA is
`c357d957741f56835f27a1fc3a948dad43a91036`.

## Goal

Verify whether the repaired production auth/session flow now passes the
existing protected browser proof.

## Constraints

- Use existing production auth proof tooling.
- Do not print or store secret values, cookies, tokens, passwords, or response bodies.
- Do not deploy, push, restart, roll back, mutate env, mutate production data,
  mutate accounts, or touch exchange/payment/trading state.

## Definition of Done

- [x] Production check executed without secret value output.
- [x] Evidence packet created.
- [x] Logout repair result separated from remaining auth proof failure.
- [x] Browser/CDP cleanup checked.
- [x] Paperclip blocker path identified.
- [x] Rerun after [LUC-6134](/LUC/issues/LUC-6134) passed the full auth proof.

## Forbidden

- Deploy, push, restart, rollback execution, or env mutation.
- Secret/account value readback or artifact capture.
- Exchange/payment/trading/order/position mutation.
- Treating public build-info or partial auth proof as full protected acceptance.

## Validation Evidence

- `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 5f7aea86f76e9b79bb087be72f6b0bc770b232bf ...` stopped at build-info mismatch because production was on descendant `c357d957741f56835f27a1fc3a948dad43a91036`.
- `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 ...` initially stopped before browser proof because `PROD_AUTH_*` was not bound.
- Process-local mapping from approved `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to `PROD_AUTH_EMAIL/PASSWORD` allowed the proof to run. Final result: FAIL on `invalid token redirects to expired-session login`.
- `pnpm run -s ops:protected-inputs:check -- --today 2026-06-29 --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 ...` returned `PARTIAL`, with `PROD_UI_AUDIT_*` present by name.
- Production build-info returned `c357d957741f56835f27a1fc3a948dad43a91036`; API `/health` and `/ready` returned `200`.
- Logout repair passed in production: `POST /auth/logout -> 200`; post-logout `/auth/me` returned `401` for both cookie token and bearer token.
- Remaining blocker: invalid browser token redirects to `/auth/login` without `?session=expired`.
- Evidence:
  - `history/evidence/luc-6123-prod-auth-session-browser-proof-2026-06-29.md`
  - `history/artifacts/luc-6123-prod-auth-session-browser-proof-2026-06-29.json`
  - `history/evidence/luc-6123-protected-input-readiness-2026-06-29.md`
  - `history/artifacts/luc-6123-protected-input-readiness-2026-06-29.json`
- Rerun after [LUC-6134](/LUC/issues/LUC-6134):
  `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof
  --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --today
  2026-06-29 --output-json
  history/artifacts/luc-6123-prod-auth-session-browser-proof-2026-06-29-rerun-after-luc-6134.json
  --output-md
  history/evidence/luc-6123-prod-auth-session-browser-proof-2026-06-29-rerun-after-luc-6134.md`
  returned PASS.
- Passing rerun details:
  production build-info matched
  `c357d957741f56835f27a1fc3a948dad43a91036`; invalid browser token
  redirected to `/auth/login?session=expired`; `POST /auth/logout -> 200`;
  stale cookie `/auth/me -> 401`; stale bearer `/auth/me -> 401`.
- Evidence:
  - `history/evidence/luc-6123-prod-auth-session-browser-proof-2026-06-29-rerun-after-luc-6134.md`
  - `history/artifacts/luc-6123-prod-auth-session-browser-proof-2026-06-29-rerun-after-luc-6134.json`
- Reality status: verified.

## Result Report

- Task summary: production auth-session browser proof passed after
  [LUC-6134](/LUC/issues/LUC-6134); the logout repair and invalid-token
  `session=expired` redirect contract are both verified in production.
- Files changed: generated LUC-6123 evidence/artifact files plus task/state
  summaries only.
- How tested: existing production auth proof, with approved audit login
  bindings mapped process-locally to `PROD_AUTH_EMAIL/PASSWORD` without
  printing values.
- What is incomplete: no remaining blocker on [LUC-6123](/LUC/issues/LUC-6123).
  Broader release-grade source-control/build provenance and host-level proof
  remain separate owner paths.
- Next owner: none for [LUC-6123](/LUC/issues/LUC-6123); parent production
  acceptance can consume this evidence.
- Cleanup: proof script removed its CDP temp profile in `finally`; no browser
  process cleanup issue was observed from this rerun.
