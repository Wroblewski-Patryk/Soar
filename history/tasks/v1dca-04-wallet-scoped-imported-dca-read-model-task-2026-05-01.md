# Task

## Header
- ID: V1DCA-04
- Title: Restore wallet-scoped imported DCA in runtime Positions read model
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Codex Execution Agent
- Depends on: `V1DCA-03`
- Priority: P0

## Context
After the web hotfix deployed, the operator reported that ETH had two real DCA
adds while the dashboard `Positions` table still showed `DCA=0`. That proves
the remaining issue was not UI rendering; it was runtime read-model recovery for
legacy/imported exchange-sync trade rows that lost direct bot/strategy refs.

## Goal
Make the bot runtime `Positions` read model count existing wallet-scoped
imported DCA trades for the current open position lifecycle without requiring a
destructive data migration.

## Scope
- API bot runtime positions read model.
- Imported/exchange-sync DCA regression coverage.
- No UI fallback and no schema migration.

## Implementation Plan
1. Inspect the runtime positions DCA aggregation path.
2. Allow supplemental DCA continuity to match legacy/imported rows with missing
   `botId` and/or `strategyId` when wallet, symbol, side, and lifecycle window
   match.
3. Include wallet-scoped imported trades in the read query for visible runtime
   symbols, even when old superseded position rows are no longer directly owned
   by the bot after wallet migration.
4. Preserve close/reopen boundaries so stale DCA does not cross into a fresh
   lifecycle.
5. Prove with an ETH-like regression.

## Acceptance Criteria
- ETH-like imported wallet-scoped DCA rows with missing bot/strategy refs render
  `dcaCount=2`.
- DCA ladder levels are derived from the bot strategy plan.
- Existing close/reopen stale-DCA guard remains green.
- API typecheck/build and repository guardrails pass.

## Definition of Done
- [x] Read-model fix implemented.
- [x] ETH-like regression added.
- [x] Existing stale close/reopen regression remains green.
- [x] Focused API validation passed.
- [x] API typecheck/build and guardrails passed.

## Forbidden
- Do not create a parallel DCA source of truth.
- Do not mutate production data to compensate for read-model drift.
- Do not weaken close/reopen lifecycle boundaries.
- Do not add UI-only display fallbacks.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts` -> PASS, `5/5`
  - `pnpm --filter api run typecheck` -> PASS
  - `pnpm --filter api run build` -> PASS
  - `pnpm run quality:guardrails` -> PASS
- Manual checks:
  - The fix is read-model only; no schema/data migration is required for
    existing DCA trade rows.
  - The focused regression now covers the dirty wallet-migration shape where
    superseded position rows and DCA trade rows have `botId=null`, while the
    current open position has the bot context.
- Screenshots/logs: not applicable
- High-risk checks:
  - The same-symbol close/reopen stale-DCA regression remains in the focused
    pack and passed.

## Architecture Evidence
- Architecture source reviewed: bot runtime positions read model and imported
  DCA visibility tests.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: API/web deploy needed because API read model changed.
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this read-model commit if imported wallet-scoped DCA
  causes false positives; existing close/reopen tests protect the main stale
  carryover risk.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated because repository truth changed.

## Result Report
- Task summary: existing wallet-scoped imported DCA trades can now be attached
  to the current open lifecycle even when historical rows lost direct bot or
  strategy refs.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
  - this task packet and canonical context updates
- How tested: commands listed above.
- What is incomplete: production verification after deploy.
- Next steps: commit, push, wait for VPS deploy, then verify production
  build-info and public smoke.
