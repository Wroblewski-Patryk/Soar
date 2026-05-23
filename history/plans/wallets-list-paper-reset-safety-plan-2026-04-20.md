# Wallets List API-Key Status and Paper Reset Safety Plan (2026-04-20)

Status: closed (2026-04-20)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Source Analysis Summary
- `WalletsListTable` still uses expandable `Details` rows even though the expanded content duplicates row-level information already visible or better represented directly in the table.
- Wallet list rows already receive `apiKeyId`, so the requested `API key` column can be rendered without changing the list payload contract.
- Current paper-capital logic is not driven only by `wallet.paperInitialBalance`. Runtime capital snapshot also folds in wallet-scoped realized PnL from closed bot-managed positions and reserved margin from open positions.
- Because of that, changing only `paperInitialBalance` is not a true reset. Historical realized losses can still keep the wallet effectively depleted after a naive edit.
- Wallet update flow is currently a generic edit path. A safe paper reset should be modeled as a dedicated wallet command with explicit safety guardrails rather than as an implicit side effect of normal edit.
- Wallet reset should preserve historical audit/trade data. The missing behavior is capital-baseline reset for future paper execution, not destructive history deletion.

## Scope
- Simplify `/dashboard/wallets/list` row presentation:
  - remove row-level `Details` action and expanded duplicate content,
  - add `API key` column between `Allocation` and `Actions`,
  - render `Connected` / `Not connected` per wallet row.
- Add a safe `Reset paper wallet` action to the paper-wallet edit flow.
- Introduce reset-aware paper-capital baseline semantics so a reset truly restores usable paper funds.
- Add focused API/web regressions, docs sync, and closure validation.

## Scope Lock
1. No redesign of wallets IA beyond the requested list simplification and paper-reset action.
2. No destructive deletion of historical paper orders, positions, trades, or audit records.
3. No change to LIVE wallet behavior in this wave.
4. No change to bot execution semantics outside the reset-aware paper capital baseline required for the requested behavior.

## Canonical Target Contract
1. Wallet list table no longer exposes row `Details` expansion.
2. Wallet list includes `API key` column between `Allocation` and `Actions`.
3. `API key` cell mapping is deterministic:
   - wallet has `apiKeyId` -> `Connected`
   - wallet has no `apiKeyId` -> `Not connected`
4. Paper-wallet edit flow exposes a dedicated `Reset paper wallet` action only for `PAPER` wallets.
5. Paper reset is a dedicated command, not a generic wallet edit side effect.
6. Paper reset is non-destructive:
   - historical orders/positions/trades remain stored,
   - future paper capital math ignores pre-reset realized lifecycle for capital-baseline purposes.
7. Reset safety gates are fail-closed:
   - allowed only for owned `PAPER` wallets,
   - rejected when wallet still has active open positions or active open orders in paper scope.
8. Reset baseline source is the wallet paper starting balance contract:
   - reset should restore capital usability from the configured paper balance baseline,
   - if implementation needs a stronger contract, use a wallet-level reset checkpoint (`paperResetAt` or equivalent) instead of mutating/deleting lifecycle history.

## Recommended Technical Approach
1. Keep wallet list change web-only:
   - remove expand/collapse state and `Details` action from `WalletsListTable`,
   - surface API key state inline in the table using existing `apiKeyId`.
2. Implement paper reset as a dedicated API command:
   - suggested route: `POST /dashboard/wallets/:id/reset-paper`
   - keep it separate from `PUT /dashboard/wallets/:id`
   - return refreshed wallet payload or explicit reset summary.
3. Make paper reset baseline explicit and non-destructive:
   - add wallet-level reset checkpoint field such as `paperResetAt`,
   - update paper-capital read path so realized PnL and reserved state used for current capital are evaluated only from lifecycle rows at/after that checkpoint.
4. Preserve history visibility:
   - old trades/orders/positions remain queryable for audit/history,
   - reset only affects future capital baseline and future execution affordability checks.
5. Add fail-closed reset guards:
   - reject reset for `LIVE` wallets,
   - reject reset if wallet has open paper positions,
   - reject reset if wallet has active paper open orders,
   - if execution race cannot be made deterministic, optionally add a stronger linked-runtime guard before implementation.

## Execution Groups
1. `WAPR-A (commits WAPR-01..WAPR-04): contract freeze + wallet-list regression + reset red tests`
2. `WAPR-B (commits WAPR-05..WAPR-08): API reset command + reset-aware capital baseline + web action`
3. `WAPR-C (commits WAPR-09..WAPR-10): docs sync + closure validation`

## Execution Result (2026-04-20)
- Stage `WAPR-A` completed:
  - contract freeze in canonical docs,
  - wallets list regression for inline `API key` status and no `Details` row,
  - API red regressions for reset safety and reset-aware baseline.
- Stage `WAPR-B` completed:
  - dedicated fail-closed `POST /dashboard/wallets/:id/reset-paper`,
  - wallet checkpoint baseline (`paperResetAt`) with non-destructive reset semantics,
  - reset-aware runtime paper capital path,
  - paper-wallet edit reset action with deterministic UX states.
- Stage `WAPR-C` completed:
  - wallet module docs and canonical queue/context synchronized,
  - closure validation pack PASS:
    - `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts`
    - `pnpm --filter web run test -- --run src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx`
    - `pnpm --filter api run typecheck`
    - `pnpm --filter web run typecheck`
    - `pnpm run quality:guardrails`

---

## Tiny-Commit Queue

### WAPR-01
`docs(contract): freeze wallets list api-key column and paper-reset safety contract`
- Scope:
  - lock wallet-list table contract (`no details row`, `API key` column, column order),
  - lock paper-reset behavior as dedicated non-destructive command with fail-closed guards.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-wallets.md`
  - `docs/modules/web-wallets.md`
- Done when:
  - one canonical contract defines wallet-list presentation and paper-reset safety rules.

### WAPR-02
`test(web-red): add wallets list regression for api-key column and no-details contract`
- Scope:
  - add failing regression for:
    - removed `Details` row/action,
    - inline `API key` column,
    - `Connected` / `Not connected` mapping.
- Likely files:
  - `apps/web/src/features/wallets/components/WalletsListTable.test.tsx`
- Done when:
  - test fails until list matches the requested table contract.

### WAPR-03
`fix(web-list): remove details row and add api-key status column in wallets table`
- Scope:
  - remove expand/collapse UI and duplicated details content,
  - add deterministic `API key` cell,
  - preserve existing filters and actions.
- Likely files:
  - `apps/web/src/features/wallets/components/WalletsListTable.tsx`
- Done when:
  - wallet list matches the requested table layout without hidden duplicate rows.

### WAPR-04
`test(api-red): add paper-reset safety and baseline regressions`
- Scope:
  - add failing API/service regressions for:
    - `PAPER`-only reset access,
    - reset rejected when open positions/orders exist,
    - reset restores usable paper capital baseline despite historical negative realized PnL.
- Likely files:
  - `apps/api/src/modules/wallets/wallets.e2e.test.ts`
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
- Done when:
  - tests fail unless reset command and reset-aware capital logic exist.

### WAPR-05
`fix(api-wallets): add dedicated reset-paper command and domain errors`
- Scope:
  - add dedicated paper-reset endpoint/service command,
  - add explicit domain errors for invalid reset attempts,
  - keep generic wallet update path unchanged.
- Likely files:
  - `apps/api/src/modules/wallets/wallets.routes.ts`
  - `apps/api/src/modules/wallets/wallets.controller.ts`
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.errors.ts`
  - `apps/api/src/modules/wallets/wallets.types.ts`
- Done when:
  - API exposes one fail-closed reset-paper command for owned paper wallets only.

### WAPR-06
`fix(api-capital): make paper runtime capital snapshot reset-aware`
- Scope:
  - introduce wallet-level reset checkpoint (`paperResetAt` or equivalent),
  - update paper capital snapshot/read paths so pre-reset realized lifecycle no longer depletes future capital baseline.
- Likely files:
  - `apps/api/prisma/schema.prisma`
  - migration files
  - `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
  - wallet/runtime read helpers that derive paper capital summaries
- Done when:
  - a reset truly restores usable paper capital without deleting historical rows.

### WAPR-07
`test(web-red): add paper-wallet reset action visibility and submit regressions`
- Scope:
  - add failing web regression for:
    - reset action visible only on `PAPER` wallet edit,
    - reset action hidden for `LIVE`,
    - disabled/loading/error/success handling for reset flow.
- Likely files:
  - `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx`
- Done when:
  - UI contract is locked before implementation.

### WAPR-08
`fix(web-form): add reset paper wallet action to wallet edit form`
- Scope:
  - add dedicated reset action in paper-wallet edit UX,
  - wire confirmation + request + refresh flow,
  - keep existing create/edit layout and save semantics stable.
- Likely files:
  - `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx`
  - `apps/web/src/features/wallets/services/wallets.service.ts`
  - wallet i18n namespaces if needed
- Done when:
  - operator can safely reset a depleted paper wallet from edit view.

### WAPR-09
`docs(sync): update wallet module docs and canonical queue/context after rollout`
- Scope:
  - sync final wallet-list/reset behavior to module docs,
  - sync queue/context files after implementation.
- Likely files:
  - `docs/modules/api-wallets.md`
  - `docs/modules/web-wallets.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Done when:
  - docs and canonical queue/context match shipped behavior.

### WAPR-10
`qa(closure): run focused wallets list + paper-reset validation pack and finalize queue/context`
- Required commands:
  - `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts`
  - `pnpm --filter web run test -- --run src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Done when:
  - focused pack is green and canonical queue/context are synchronized.

---

## Stage DoD

### Stage A DoD (`WAPR-A`)
- Wallet list contract is frozen and regression-locked.
- Paper-reset safety and baseline expectations are captured in red tests.

### Stage B DoD (`WAPR-B`)
- Dedicated paper-reset API command exists.
- Paper capital logic is reset-aware and non-destructive.
- Paper-wallet edit form exposes reset action with deterministic UX states.

### Stage C DoD (`WAPR-C`)
- Wallet module docs and canonical queue/context are synchronized.
- Focused closure validation pack is green.

## Acceptance Criteria
1. `/dashboard/wallets/list` no longer shows row `Details` expansion.
2. Wallet list shows `API key` column between `Allocation` and `Actions`.
3. Wallet rows show `Connected` when `apiKeyId` exists and `Not connected` otherwise.
4. Paper-wallet edit form exposes a dedicated reset action; LIVE wallets do not.
5. Resetting a depleted paper wallet restores usable paper capital even when older closed positions produced negative realized PnL.
6. Reset does not delete historical orders/positions/trades.
7. Reset is blocked when paper open positions or active open orders still exist.

## Key Risks
1. Naive reset by editing `paperInitialBalance` alone will not work because historical realized PnL still affects paper capital calculations.
2. Destructive cleanup of historical wallet lifecycle rows would solve capital reset but would damage audit/history trust.
3. If reset and runtime order creation can race, execution agent may need an additional runtime-session guard or transactional coordination step.
4. Wallet KPI/read paths outside runtime capital snapshot may also need reset-boundary awareness to avoid partial drift after implementation.
