# Task

## Header
- ID: V1ROE-04
- Title: Verify exchange-aligned LIVE PnL truth and imported automation on protected DOGEUSDT
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: V1ROE-03, V1OWN-01, V1AUTO-01, V1AUTO-02, V1AUTO-03
- Priority: P0

## Context
The code slices that repaired LIVE margin-basis truth, stale runtime read-model
freshness, imported ownership hydration, imported runtime-state rebase, and
prospective imported automation hydration are closed locally. The remaining
work is not another local code fix. It is protected production evidence that
the deployed candidate behaves correctly on the real `LIVE DOGEUSDT` flow.

## Goal
Collect protected production evidence that the active imported/reopened
`DOGEUSDT` lifecycle exposes exchange-aligned `LIVE` operator truth and that
managed imported automation is awake enough to evaluate DCA/TTP/TSL from fresh
runtime truth.

## Success Signal
- User or operator problem: `LIVE` dashboard PnL, DCA, TTP, and TSL must stop
  looking stale or detached from exchange truth after import/reopen.
- Expected product or reliability outcome: Soar operator surfaces align with
  exchange-synced `LIVE` position truth and imported managed positions no
  longer remain dormant after adoption.
- How success will be observed: authenticated production API/browser evidence
  for `DOGEUSDT` after the current `main` candidate is deployed.
- Post-launch learning needed: yes

## Deliverable For This Stage
A production verification packet with timestamped evidence, or a precise
blocked-state report naming the missing access/deploy prerequisite.

## Scope
- Protected production dashboard/API evidence for the active `LIVE DOGEUSDT`
  bot/session.
- `docs/operations/` closure artifact for the captured verification.
- Canonical status sync in:
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Confirm production is deployed to at least `a332a476` or a later commit
   containing `V1ROE`, `V1OWN`, and `V1AUTO` closures.
2. With authenticated protected access, capture the active `DOGEUSDT`
   runtime-session positions payload and symbol-stats payload.
3. Compare Soar `marginUsed`, `unrealizedPnl`, `unrealizedPnlPercent`,
   `markPrice`, and `lastExchangeSyncAt` with exchange-visible truth.
4. Verify imported managed automation is not dormant:
   - `actionable=true`
   - effective bot ownership resolved
   - configured DCA/TTP/TSL levels present where expected
   - runtime automation telemetry shows fresh evaluation after adoption/reopen
5. Verify browser dashboard presents the same truth in Positions, Orders, and
   History without stale placeholders.
6. Publish the evidence artifact and sync canonical queue/context status.

## Acceptance Criteria
- Production deployment freshness is recorded with exact commit and timestamp.
- Protected API evidence proves `DOGEUSDT` runtime positions use fresh
  exchange-synced margin/price/PnL truth.
- Protected API or browser evidence proves imported managed automation is awake
  or names the exact remaining blocker.
- Dashboard operator surfaces match the protected API evidence.
- If evidence cannot be collected, the task remains `BLOCKED` with the exact
  missing prerequisite named.

## Definition of Done
- [ ] Production candidate freshness is verified.
- [ ] Protected `DOGEUSDT` API evidence is captured.
- [ ] Dashboard/browser parity evidence is captured.
- [ ] Closure artifact is published in `docs/operations/`.
- [ ] Canonical queue/context docs are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Do not mark this task `DONE` from local tests alone.
- Do not infer production truth from stale artifacts.
- Do not use unauthenticated public smoke as a replacement for protected
  wallet/runtime evidence.
- Do not add a workaround path if production verification exposes a new code
  gap; create the next narrow task instead.

## Validation Evidence
- Tests: not run for this planning/status slice.
- Manual checks: local queue/context reviewed on 2026-04-30.
- Screenshots/logs: none yet.
- High-risk checks: protected production evidence is still required before
  closure because this touches money-impacting LIVE runtime truth.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/live-protection-state-parity-contract.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`,
  `docs/planning/v1roe-live-pnl-roe-and-runtime-automation-parity-plan-2026-04-30.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none for this planning/status slice

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none for this document-only slice; high for the eventual
  production verification.
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run or explicitly scoped out.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This task is intentionally `BLOCKED` until authenticated protected production
access and deployed candidate freshness are available. Later local runtime
fixes (`V1OWN`, `V1AUTO`) reduced the likely code gap, but they do not replace
the required production proof.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`: Goal, Scope, Implementation Plan, Acceptance Criteria,
Definition of Done, and Result Report.

Runtime tasks must be delivered as a vertical slice. This task is the
production verification gate for already closed runtime slices, not a new
runtime implementation.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE operator managing imported/reopened Binance
  Futures positions.
- Existing workaround or pain: manual comparison against exchange UI and
  repeated protected probes.
- Smallest useful slice: one protected `DOGEUSDT` verification packet.
- Success metric or signal: production API/browser evidence matches exchange
  truth and imported automation is not dormant.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: yes

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: LIVE imported position monitoring and automated
  lifecycle management.
- SLI: protected runtime position read freshness and operator truth parity.
- SLO: current deployed candidate exposes fresh exchange-synced truth during
  the verification window.
- Error budget posture: burning until protected proof is captured.
- Health/readiness check: production `/health` and `/ready` are supporting
  checks only, not acceptance criteria.
- Logs, dashboard, or alert route: runtime session positions, symbol-stats,
  dashboard Positions/Orders/History.
- Smoke command or manual smoke: protected authenticated probe plus browser
  inspection.
- Rollback or disable path: revert the runtime/imported automation slices if a
  deploy regression is confirmed.

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: pending protected verification
- Endpoint and client contract match: pending protected verification
- DB schema and migrations verified: already covered by preceding code slices
- Loading state verified: not applicable
- Error state verified: pending protected verification
- Refresh/restart behavior verified: pending protected verification
- Regression check performed: local regressions were covered by preceding code
  slices; this task needs production proof

## AI Testing Evidence (required for AI features)
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: protected trading/runtime account data
- Trust boundaries: authenticated production API, exchange account data,
  dashboard operator session
- Permission or ownership checks: must use authenticated operator access only
- Abuse cases: do not expose protected account payloads outside repository
  evidence artifacts
- Secret handling: no secrets should be committed
- Security tests or scans: not applicable
- Fail-closed behavior: task remains `BLOCKED` without protected access
- Residual risk: stale deployed code or unavailable auth can block closure

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: protected evidence must not
  include secrets
- Result: not applicable

## Result Report

- Task summary: published the exact protected production evidence contract for
  `V1ROE-04` and made the current blocked state explicit.
- Files changed: this task file plus canonical queue/context status.
- How tested: repository guardrails for the document-only slice.
- What is incomplete: production candidate freshness and protected
  `DOGEUSDT` API/browser evidence.
- Next steps: deploy/current-candidate confirmation, then authenticated
  protected verification.
- Decisions made: do not close `V1ROE-04` from local tests or inferred
  evidence.
