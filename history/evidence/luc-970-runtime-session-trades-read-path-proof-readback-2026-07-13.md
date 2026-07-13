# LUC-970 Runtime Session Trades Read Path Proof Readback

Date: 2026-07-13
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-970](/LUC/issues/LUC-970)

## Scope

Verify whether the runtime session trades read path still lacks focused
automated proof, or whether the requested lane was already closed by existing
local evidence.

## Readback

- `apps/api/src/modules/bots/runtimeSessionTradesRead.list.test.ts` already
  exists in the local checkout and directly exercises
  `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`.
- The existing July 13 proof packet in
  `history/evidence/luc-938-runtime-session-trades-and-symbol-stats-backend-reads-2026-07-13.md`
  already records:
  - the focused no-DB proof for the read-service path;
  - direct controller proof linkage through
    `apps/api/src/modules/bots/bots.e2e.test.ts`;
  - generated-truth readback showing the scoped `trades` rows moved from
    `missing_test_link` to docs-owned `missing_doc_link`.
- Fresh local rerun on 2026-07-13 still passes:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionTradesRead.list.test.ts --run --reporter=dot`
  - result: `1` file passed, `2` tests passed.

## Result

`LUC-970` is a stale proof request, not an open implementation gap. The focused
runtime session trades read-path proof was already added locally by
[LUC-938](/LUC/issues/LUC-938), and the same test remains green on rerun.

## Remaining

- No additional Test Automation work remains for the scoped runtime session
  trades read path.
- The remaining follow-up is docs-owned source-of-truth closure for
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades`
  and
  `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`,
  which now route as `missing_doc_link`, not `missing_test_link`.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, protected
account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position close mutation, bot
activation, or LIVE trading action occurred.
