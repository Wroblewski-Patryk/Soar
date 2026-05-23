# Task

## Header
- ID: V1EXCEL-06-PROD
- Title: Verify production runtime observability with authenticated OPS probes
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: V1EXCEL-06
- Priority: P0

## Context
`V1EXCEL-06` was previously blocked because production and stage runtime
observability probes returned protected-route `401` without authenticated
operator or OPS access. Production operator access is now available, so the
smallest safe slice is to re-run only the production runtime freshness and
rollback guard probes without executing any trading action.

## Goal
Prove whether production runtime observability for the current deployed
candidate is healthy and no longer blocked by auth.

## Success Signal
- User or operator problem: the team needs current production runtime health
  evidence before reopening post-V1 architecture work.
- Expected product or reliability outcome: production worker freshness,
  runtime session health, and rollback guard status are observable through the
  protected OPS paths.
- How success will be observed: authenticated production commands pass and are
  recorded in the operations evidence.
- Post-launch learning needed: yes

## Deliverable For This Stage
Authenticated production runtime observability evidence and canonical status
sync. Stage observability remains outside this slice.

## Constraints
- Use existing OPS scripts only.
- Do not execute trading actions.
- Do not write credentials, tokens, or session cookies to disk.
- Do not mark the broader `V1EXCEL-03..06` wave complete from production
  runtime evidence alone.

## Scope
- `history/plans/v1excel-runtime-observability-2026-04-29.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Re-run production `ops:deploy:runtime-freshness` with authenticated
   production operator access.
2. Re-run production `ops:deploy:rollback-guard` with the script-specific
   rollback guard auth environment.
3. Record pass/fail details without secrets.
4. Update canonical queue/context to show production runtime observability is
   green while stage/manual/prod-refresh evidence remains open.
5. Run documentation guardrails.

## Acceptance Criteria
- Production runtime freshness returns `PASS`.
- Production rollback guard returns `shouldRollback=false`.
- Evidence records worker heartbeat, market data freshness, runtime signal lag,
  running session count, and alert state.
- No secret value is committed.
- Remaining `V1EXCEL` blockers stay visible.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed.
- [x] Production runtime freshness evidence captured.
- [x] Production rollback guard evidence captured.
- [x] Canonical docs and context updated.
- [x] Relevant validation run.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Do not execute manual `LIVE` open or close actions.
- Do not use Coolify/VPS access to mutate production.
- Do not treat stage observability as complete without stage credentials.
- Do not treat the full `V1EXCEL` wave as complete.

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch --timeout-ms 15000` => PASS
  - `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --timeout-ms 15000` => PASS
- Manual checks:
  - Production probes were read-only and authenticated through session
    environment variables.
- Screenshots/logs:
  - `history/plans/v1excel-runtime-observability-2026-04-29.md`
- High-risk checks:
  - No trading action was executed.
  - No secret values were written to repo artifacts.

## Architecture Evidence
- Architecture source reviewed: `docs/operations/service-reliability-and-observability.md`,
  `DEPLOYMENT_GATE.md`, `history/plans/v1excel-final-unblock-runbook-2026-04-29.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none committed; auth was provided only in the session
  environment.
- Health-check impact: production runtime freshness is green.
- Smoke steps updated: no script changes.
- Rollback note: production rollback guard reports `shouldRollback=false`.
- Observability or alerting impact: production `/workers/runtime-freshness` and
  `/alerts` are reachable with authenticated access.
- Staged rollout or feature flag: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: production runtime monitoring for live trading workers
- SLI: runtime freshness and rollback guard status
- SLO: runtime freshness thresholds from the deployed OPS endpoint
- Error budget posture: healthy for production runtime observability
- Health/readiness check: runtime freshness PASS
- Logs, dashboard, or alert route: rollback guard `/alerts` read returned no
  rollback-critical alerts
- Smoke command or manual smoke: OPS commands listed above
- Rollback or disable path: existing rollback guard remains the decision path

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: the earlier unauthenticated `401` path remains
  fail-closed; authenticated path now passes
- Refresh/restart behavior verified: runtime session heartbeat freshness
  passed
- Regression check performed: repository guardrails

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: production runtime health metadata
- Trust boundaries: operator-authenticated OPS endpoints
- Permission or ownership checks: authenticated access required by endpoint
- Abuse cases: unauthenticated access must not expose runtime health
- Secret handling: credentials used only through shell environment variables;
  no token or password committed
- Security tests or scans: secret search over touched files before commit
- Fail-closed behavior: unauthenticated rollback guard still returns protected
  `401`
- Residual risk: stage runtime observability still needs its own authenticated
  evidence

## Result Report
- Task summary: production runtime observability for `V1EXCEL-06` is now green
  with authenticated evidence.
- Files changed: task packet, operations evidence, queue/context docs, learning
  journal.
- How tested: authenticated production runtime freshness, authenticated
  production rollback guard, repository guardrails, diff checks, secret search.
- What is incomplete: stage runtime observability, full manual matrix, and
  broader production release-gate evidence families remain open.
- Next steps: continue `V1EXCEL-03`, `V1EXCEL-04`, and `V1EXCEL-05` evidence
  without treating this production runtime proof as a full `GO`.
- Decisions made: split production runtime observability into a small
  completed slice while leaving the broader V1 confidence gates open.
