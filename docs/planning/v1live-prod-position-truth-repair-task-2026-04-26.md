# Task

## Header
- ID: V1LIVE-PROD-2026-04-26-B
- Title: Repair production live-position truth drift for imported leverage and stale local managed rows
- Task Type: fix
- Current Stage: implementation
- Status: IN_PROGRESS
- Owner: Backend Builder
- Depends on: V1LIVE-01, V1LIVE-PROD-2026-04-26-A
- Priority: P0

## Context
Production verification on the real account proved two remaining live-position truth defects. First, imported Binance Futures positions can carry leverage as a numeric string in the authenticated snapshot, while the current snapshot normalization accepts only numeric primitives and silently degrades leverage to `null`, which then becomes `1x` in reconciliation and inflates runtime margin/PnL%. Second, old local `LIVE` positions with `origin=BOT` can remain open even after exchange truth no longer confirms them, so dashboard/runtime can keep showing phantom positions.

## Goal
Restore one truthful live-position path where imported leverage survives reconciliation and stale local managed `LIVE` positions are closed when exchange truth for the same managed wallet/bot no longer confirms them.

## Deliverable For This Stage
Implement the smallest backend change set that:
- parses numeric-string leverage from exchange snapshots,
- closes stale local managed live positions during exchange reconciliation under explicit fail-closed safeguards,
- adds focused regression coverage,
- updates canonical task/project context.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [ ] Imported exchange leverage no longer degrades to `1x` when exchange payload exposes leverage as a string.
- [ ] Reconciliation closes stale local managed `LIVE` positions only when exchange truth for the same owner no longer confirms them and the grace guard has elapsed.
- [ ] Focused backend validation and prod verification evidence are attached.

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
- Tests: pending
- Manual checks: pending
- Screenshots/logs: pending
- High-risk checks: pending

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/live-paper-runtime-safety-contract.md`, `docs/architecture/reference/execution-lifecycle-parity-contract.md`, `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none expected unless closure semantics change

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none expected
- Smoke steps updated: pending
- Rollback note: revert API reconciliation cleanup + rerun worker/API deploy

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
- The stale `BNBUSDT` row on production is currently confirmed as local `origin=BOT` debt, not current exchange truth.
- Existing live order submit path already converges leverage/margin mode before submit; this task focuses on post-submit/import truth.
