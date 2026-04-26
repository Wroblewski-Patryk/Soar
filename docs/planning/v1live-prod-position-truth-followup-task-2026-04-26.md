# Task

## Header
- ID: V1LIVE-PROD-2026-04-26-B
- Title: Recover live imported leverage truth and fail-soft stale-position cleanup on the affected production account
- Task Type: fix
- Current Stage: implementation
- Status: IN_PROGRESS
- Owner: Backend Builder
- Depends on: V1LIVE-PROD-2026-04-26-A
- Priority: P0

## Context
Production verification on the real user account proved two residual live-position truth gaps after the earlier manual-order and takeover fixes. First, imported Binance Futures positions can still land with `leverage=null` in the exchange snapshot surface, which degrades runtime margin and PnL% calculations back to implicit `1x`. Second, a historical local `BOT` position (`BNBUSDT`) remained visible in runtime/dashboard even though the current exchange snapshot only confirmed `DOGEUSDT`, which means stale local managed live cleanup is still too brittle when auxiliary exchange reads fail.

## Goal
Make imported live positions preserve leverage truth from the raw exchange payload and ensure stale local managed live positions can still be closed when the exchange no longer confirms them, even if the open-orders snapshot cannot be fetched in the same reconciliation pass.

## Deliverable For This Stage
Implement the API-side fixes, lock them with focused regression coverage, deploy to production, run repair only on the affected user account, and verify that `DOGEUSDT` leverage/margin truth and stale `BNBUSDT` visibility align with current exchange state.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [ ] Exchange-position normalization reads leverage and other numeric truth from raw nested exchange payload fields used by Binance Futures.
- [ ] Reconciliation closes sufficiently stale local managed live positions even when open-order snapshot fetch fails in the same pass.
- [ ] Production verification on the affected account proves stale `BNBUSDT` no longer appears and imported `DOGEUSDT` no longer falls back to `1x` leverage semantics.

## Stage Exit Criteria
- [ ] The output matches the declared `Current Stage`.
- [ ] Work from later stages was not mixed in without explicit approval.
- [ ] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`
- Manual checks: production account login, `POST /dashboard/positions/orphan-repair`, `GET /dashboard/positions`, runtime session positions, exchange snapshot
- Screenshots/logs: production API payload diffs before/after deploy and repair
- High-risk checks: user-scoped cleanup only; no writes against other users

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/live-paper-runtime-safety-contract.md`, `docs/architecture/reference/execution-lifecycle-parity-contract.md`, `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: API deploy + authenticated live-position repair path
- Smoke steps updated: authenticated prod position truth checks after deploy
- Rollback note: revert API service to previous commit if reconciliation regression is discovered

## Review Checklist (mandatory)
- [ ] Current stage is declared and respected.
- [ ] Deliverable for the current stage is complete.
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The affected user explicitly approved production cleanup limited to their own account if stale rows must be closed after exchange truth is re-verified.
