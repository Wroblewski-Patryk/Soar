# V1OWN-01 - Imported LIVE Runtime Ownership Closure

Date: 2026-04-30  
Status: closed  
Owner: Codex

## Scope Closed
- Imported owned `EXCHANGE_SYNC` rows now hydrate into canonical runtime
  automation ownership even when the persisted row still has `botId=null`.
- Bot-scope open-position counting for runtime signal decisions now includes
  canonically owned imported `LIVE` rows instead of looking only at direct
  `position.botId`.

## Code Closure
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
  - default imported-position lookup now reuses the canonical external-position
    ownership index and hydrates effective bot context for owned imported rows
    before runtime automation evaluates `DCA/TTP/TSL`
- `apps/api/src/modules/engine/runtimeSignalLoopDefaults.ts`
  - bot-scope open-position counting now adds owned imported `LIVE`
    `EXCHANGE_SYNC` rows via the same ownership contract

## Validation
- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.defaultDeps.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Residual Risk
- This closure removes a concrete local/runtime seam, but it does not by itself
  prove the protected production `DOGEUSDT` lifecycle is now fully green.
- The next required evidence is protected post-deploy verification that the
  imported owned row actually resumes `DCA/TTP` management and that runtime
  session truth stops looking dormant.
