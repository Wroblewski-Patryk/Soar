# Task

## Header
- ID: LUC-4929
- Title: Coolify production deploy health sweep continuation after blocker resolution
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none; prior blocker [LUC-4811](/LUC/issues/LUC-4811) is done
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production deploy health
- Requirement Rows: not changed
- Quality Scenario Rows: Reliability / production health and deploy diagnosis
- Risk Rows: production deploy observability and Web provenance residuals
- Iteration: 2026-06-21 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-4929-COOLIFY-PROD-DEPLOY-HEALTH-SWEEP-CONTINUATION-2026-06-21
- Mission Status: VERIFIED

## Context
The wake reason was `issue_blockers_resolved`. [LUC-4811](/LUC/issues/LUC-4811)
is now `done`, and Coolify binding names are present in the DRE runtime.

## Goal
Complete [LUC-4929](/LUC/issues/LUC-4929) by running the read-only Coolify/VPS
deploy-health diagnosis that was blocked in the previous heartbeat, then pair
it with current public/protected app health, runtime freshness, rollback guard,
and cleanup evidence.

## Scope
- Coolify project/environment/resource/deployment read-only projection.
- Public Web/API smoke and timing.
- Web build-info SHA/provenance gate.
- Protected workers readiness and runtime freshness through env-bound admin
  login.
- Rollback guard decision.
- Protected browser auth/session proof.
- Evidence/state/Paperclip closure.

## Acceptance Criteria
- Coolify read-only status access succeeds or records a concrete blocker.
- Public and protected smoke evidence is current.
- Runtime freshness and rollback guard are current.
- No production mutation or secret value disclosure occurs.
- The Paperclip issue has a terminal disposition.

## Definition of Done
- [x] Coolify read-only projection captured.
- [x] Public smoke passed.
- [x] Protected workers smoke passed with fresh login.
- [x] Runtime freshness passed.
- [x] Rollback guard passed with `shouldRollback=false`.
- [x] Residual provenance issue routed outside this issue.
- [x] Evidence and source-of-truth files updated.
- [x] Paperclip issue set to `done`.

## Forbidden
- Deploy, push, restart, rollback, or environment edits.
- Secret/account value readback.
- Raw Coolify logs or raw Coolify object storage.
- Database/Redis mutation.
- Production account, exchange, payment, subscription, or live-trading mutation.

## Validation Evidence
- Public smoke:
  `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` passed.
- Protected smoke:
  `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb` passed after removing stale token env and using admin email/password login.
- Runtime freshness:
  `pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch` passed.
- Rollback guard:
  `pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch` returned `shouldRollback=false`.
- Web provenance:
  `node scripts/waitForWebBuildInfo.mjs --build-info-url https://soar.luckysparrow.ch/api/build-info --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --timeout-seconds 1 --interval-seconds 1 --request-timeout-ms 10000` failed closed on `unaccepted metadataSource=env-runtime`.
- Coolify env checker tests:
  `pnpm run -s ops:coolify-stack:env-check:test` passed (`11/11`).
- Protected auth browser proof:
  `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --today 2026-06-21 --output-json history/artifacts/luc-4929-prod-auth-session-browser-proof-2026-06-21.json --output-md history/evidence/luc-4929-prod-auth-session-browser-proof-2026-06-21.md` passed.
- Cleanup:
  no browser process rows remained; `.tmp/prod-auth-cdp-1782000362213` was removed.
- Reality status: verified read-only, with provenance residual routed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: rollback is not indicated by current guard evidence.
- Observability or alerting impact: alerts were empty through rollback guard.
- Staged rollout or feature flag: not applicable.

## Result Report
- Task summary: Completed read-only Coolify/VPS deploy-health sweep after
  blocker resolution. Production app health, workers readiness, runtime
  freshness, DB/Redis Coolify status, and rollback guard are healthy.
- Files changed: evidence/task/state documentation only.
- How tested: commands listed above.
- What is incomplete: release-grade Web build metadata still reports
  `env-runtime`; routed to [LUC-4912](/LUC/issues/LUC-4912). Web root latency
  outliers remain a performance-watch residual.
- Next steps: none for [LUC-4929](/LUC/issues/LUC-4929); keep routine
  production performance monitoring active and handle provenance through
  [LUC-4912](/LUC/issues/LUC-4912).
- Decisions made: no redeploy, restart, rollback, env edit, or secret readback
  is justified by this sweep.
