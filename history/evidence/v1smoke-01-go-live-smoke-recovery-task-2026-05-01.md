# Task

## Header
- ID: V1SMOKE-01
- Title: Restore local go-live smoke after V1 entitlement and ownership fixture drift
- Task Type: test
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: `V1SUBS-01`, `V1TAKE-10`, `WLEDGER-02`
- Priority: P0

## Context
Before preparing a V1 deploy candidate, the umbrella local
`pnpm run test:go-live:smoke` gate failed. The first failures were local
Prisma migration-history drift on a reused workstation database. After
non-destructive migration-history repair, the executable smoke surfaced two
test-fixture drifts from approved V1 changes: bot-level external-position
management authority and subscription-gated LIVE writes.

## Goal
Recover the local go-live smoke path without weakening runtime behavior or
working around V1 fail-closed guards.

## Scope
- Local Prisma migration-history recovery for already-present schema objects.
- `backtests.e2e` fixture alignment with bot-level external-position authority
  and live-trading subscription entitlement.
- `BotsManagement` web test expectation alignment with the canonical
  `manageExternalPositions` payload.
- `goLiveSmoke.mjs` recovery guidance.
- Learning journal and local-development docs.

## Implementation Plan
1. Verify each failed local migration's expected schema objects exist.
2. Resolve only those local migration-history rows as applied.
3. Fix test fixtures to match current V1 contracts.
4. Update the smoke wrapper to print the actual failed migration instead of a
   hardcoded historical id.
5. Rerun focused tests and the umbrella go-live smoke.

## Acceptance Criteria
- No destructive local DB reset is used.
- `pnpm run test:go-live:smoke` passes.
- Backtest venue/live path still uses real subscription entitlement checks.
- External-position management authority is tested through `Bot`, not `Wallet`.
- Recovery guidance names the actual failed migration.

## Definition of Done
- [x] Local migration-history drift resolved after schema-object checks.
- [x] Backtest API fixture drift fixed.
- [x] Web bot-management payload expectation fixed.
- [x] Go-live smoke wrapper guidance fixed.
- [x] Learning journal and local-development docs updated.
- [x] Focused and umbrella validations pass.

## Forbidden
- Do not weaken or bypass live-trading entitlement guards.
- Do not move external-position authority back to wallets.
- Do not use destructive local DB reset for this recovery.
- Do not claim production readiness from local smoke alone.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts` -> PASS, `14/14`.
  - `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.test.tsx src/features/logs/components/AuditTrailView.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx` -> PASS, `17/17`.
  - `pnpm --filter web exec vitest run src/features/bots/components/BotsManagement.portfolio-history.test.tsx` -> PASS, `1/1`.
  - `pnpm run test:go-live:smoke` -> PASS, API `38/38`, web `17/17`.
- Manual checks:
  - Confirmed `Position.marginUsed` exists before resolving
    `20260430153000_add_position_margin_used`.
  - Confirmed `Bot.manageExternalPositions` exists and wallet-to-bot backfill
    was a no-op before resolving `20260430190000_move_external_management_to_bot`.
  - Confirmed wallet ledger enums, tables, indexes, and foreign keys exist
    before resolving `20260430200000_add_live_wallet_cashflow_ledger`.
- Screenshots/logs:
  - Terminal validation output from the commands above.
- High-risk checks:
  - No production database or production secrets were touched.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/operations/coolify-linux-vps-setup-guide.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, operational docs still distinguish production-only
  stage parking from older stage-required release gates. This task did not
  resolve that release-owner decision.
- Decision required from user: yes, separately for stage waiver vs stage
  restoration before final V1 GO.
- Follow-up architecture doc updates: none in this task.

## Deployment / Ops Evidence
- Deploy impact: prepares local candidate validation only.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: yes, `goLiveSmoke.mjs` recovery guidance.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

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
- [x] Learning journal updated for the recurring migration-guidance pitfall.

## Result Report
- Task summary: recovered the local go-live smoke path and aligned stale tests
  with current bot authority and subscription entitlement contracts.
- Files changed: smoke wrapper, API/web tests, learning/local-development docs,
  and task/context docs.
- How tested: commands listed in Validation Evidence.
- What is incomplete: production deployment, protected production gate rerun,
  restore drill, sign-off, manual matrix, and stage decision remain external
  release tasks.
- Next steps:
  1. run final local typecheck/build/guardrails after this patch set;
  2. commit and push the candidate if release owner accepts the remaining
     external gate posture;
  3. trigger `Promote PROD` workflow and rerun protected V1 gates.
