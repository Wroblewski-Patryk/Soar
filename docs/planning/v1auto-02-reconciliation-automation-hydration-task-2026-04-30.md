# Task

## Header
- ID: V1AUTO-02
- Title: Hydrate imported LIVE automation prospectively from fresh exchange-sync truth
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1AUTO-01, V1OWN-01, V1ROE-04
- Priority: P0

## Context
Protected production verification on the active `LIVE DOGEUSDT` flow narrowed
the remaining automation gap further. Imported owned `EXCHANGE_SYNC` rows can
now carry canonical ownership and margin basis truth, but runtime automation
still depends on ticker-path activity to wake the lifecycle engine. That leaves
one fail-closed hole: a freshly exchange-synced imported row may already have
fresh `markPrice`, `entryPrice`, `quantity`, and `continuityState=CONFIRMED`,
yet `DCA/TTP/TSL` remains dormant until a later runtime ticker event arrives.

The approved architecture already allows prospective hydration from the
adoption point onward (`docs/architecture/reference/live-protection-state-parity-contract.md`,
Core Rule 3). This task closes that seam without inventing a parallel imported
automation path.

## Goal
Ensure owned imported `LIVE` positions can hydrate runtime automation
prospectively from fresh exchange-sync truth immediately when reconciliation
creates or updates a canonical managed lifecycle row.

## Success Signal
- User or operator problem: imported managed `LIVE` positions no longer look
  dormant after adoption just because ticker-path activity has not yet arrived.
- Expected product or reliability outcome: reconciliation can wake the existing
  runtime automation engine from canonical exchange-sync truth for owned
  imported rows.
- How success will be observed: focused reconciliation regressions prove that
  managed imported rows trigger canonical runtime automation hydration on both
  create and update paths.
- Post-launch learning needed: no

## Deliverable For This Stage
Implemented reconciliation hook, focused regression coverage, and synchronized
canonical planning/context docs.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `docs/planning/v1auto-runtime-state-rebase-plan-2026-04-30.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Reuse the existing `runtimePositionAutomationService.handleTickerEvent(...)`
   path as the only automation entrypoint.
2. Trigger that path from reconciliation only when imported exchange-sync truth
   is canonically owned, confirmed, and has finite positive `markPrice`.
3. Lock both create and update adoption paths with focused reconciliation tests.
4. Sync canonical queue/context and closure notes.

## Acceptance Criteria
- Reconciliation can hydrate owned imported `LIVE` automation prospectively on
  both create and update paths.
- The solution reuses the canonical runtime automation engine instead of
  introducing a second imported-position automation system.
- Focused tests, API typecheck, and repository guardrails are green.

## Definition of Done
- [x] Reconciliation triggers canonical automation hydration for owned imported `LIVE` rows.
- [x] Focused regression coverage proves both create and update hydration paths.
- [x] Relevant planning/context files are synchronized.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`
- Manual checks: none in this stage
- Screenshots/logs: focused Vitest pass
- High-risk checks: owned imported `LIVE` automation hydration on both reconciliation create and update

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the reconciliation hydration hook
- Observability or alerting impact: improves runtime truth indirectly
- Staged rollout or feature flag: no

## Review Checklist (mandatory)
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: yes
- Refresh/restart behavior verified: yes
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: trading runtime metadata
- Trust boundaries: reconciliation loop, runtime automation engine
- Permission or ownership checks: only canonically owned imported rows trigger the hook
- Abuse cases: unowned or ambiguous imported rows must stay fail-closed
- Secret handling: none
- Security tests or scans: focused fail-closed tests
- Fail-closed behavior: non-owned, non-confirmed, or mark-price-less rows do not hydrate automation
- Residual risk: protected post-deploy verification on the real `DOGEUSDT` flow is still required

## Result Report
- Task summary: reconciliation now wakes the canonical runtime automation
  engine prospectively for owned imported `LIVE` positions when fresh
  exchange-sync truth already proves a confirmed managed lifecycle.
- Files changed: reconciliation service, reconciliation types, focused tests,
  canonical planning/context docs, closure evidence.
- How tested: focused reconciliation Vitest pack, API typecheck, repository
  guardrails.
- What is incomplete: protected post-deploy verification on the real
  `DOGEUSDT` flow and the remaining runtime-session summary drift.
- Next steps: deploy this slice, verify `DOGEUSDT` imported automation on
  production, then decide whether the stale session-summary aggregate seam needs
  its own tiny follow-up.
- Decisions made: reuse the existing runtime automation engine and trigger it
  from reconciliation using prospective hydration rather than adding a parallel
  imported automation path.
