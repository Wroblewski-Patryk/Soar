# LUC-1435 Verify Coolify Redeploy And Production Smoke

## Context

Parent issue `LUC-959` is blocked pending production redeploy verification for
the DCA-before-close fix. Implementation and QA blocker issues reported the fix
and regression guard pushed to `origin/main` at
`2dc983ced4a4c66e31e7f37264710c124955e57b`.

## Goal

Confirm whether Soar production is running a source revision that contains the
DCA-before-close fix, verify production API/Web health, and record whether the
post-deploy worker readiness smoke is complete.

## Constraints

- Do not expose secrets, cookies, token values, production account details, or
  resource UUIDs.
- Do not mutate production, deploy, restart, rollback, edit environment
  variables, mutate database state, or change live trading/exchange settings.
- Use existing project smoke scripts and read-only Coolify/resource probes.

## Definition Of Done

- Deployed production source SHA is recorded and checked for ancestry against
  the required fix SHA.
- Public API/Web health checks are recorded.
- Protected worker readiness is either verified or blocked with exact
  owner/action.
- Paperclip issue is updated to a final disposition.

## Forbidden

- No secret readback or credential printing.
- No production mutation.
- No workaround authentication path or live account mutation.

## Result Report

Status: partially verified, blocked for protected worker readiness.

Evidence:

- `history/evidence/luc-1435-coolify-redeploy-production-smoke-2026-06-02.md`

Verification:

- `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
  - public API/Web checks passed;
  - protected `API /workers/ready` returned `401`.
- `node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 2dc983ced4a4c66e31e7f37264710c124955e57b --timeout-seconds 1 --interval-seconds 1`
  - observed production SHA `6839cd6b8884e26eca735ce32cea98c1dadccfbe`;
  - exact expected SHA wait failed because production is newer than the fix SHA.
- `git merge-base --is-ancestor 2dc983ced4a4c66e31e7f37264710c124955e57b 6839cd6b8884e26eca735ce32cea98c1dadccfbe`
  - passed, deployed SHA contains required fix SHA.
- Authenticated read-only Coolify projection confirmed the Soar project and
  eight expected production resources.

Residual risk:

- Protected worker readiness remains unverified until Security/Ops refreshes or
  provides a valid approved read-only production smoke principal/session.

Commit/push/deploy:

- Commit: not created in this heartbeat.
- Push: not needed.
- Deploy impact: none; no production mutation performed.
