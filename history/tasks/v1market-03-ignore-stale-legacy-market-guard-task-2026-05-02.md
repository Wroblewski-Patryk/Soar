# Task

## Header
- ID: V1MARKET-03
- Title: Ignore stale legacy bot-strategy links in active market edit guard
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: V1MARKET-01
- Priority: P1
- Iteration: 2026-05-02 operator hotfix
- Operation Mode: BUILDER

## Context
Authenticated production smoke reproduced the real blocker on the `LIVE` bot
flow. Disabling `live` correctly moved its canonical market group for `ETH` to
`PAUSED`, but editing the linked `ETH` market universe still failed with
`MARKET_UNIVERSE_USED_BY_ACTIVE_BOT`. The blocking bot reported by the API was
`Peper bot`, even though its current canonical market scope is `Meme coins`.
The false blocker came from a stale legacy `BotStrategy` row still pointing at
`ETH Group`.

## Goal
Make the active market-universe edit guard follow the approved singular bot
architecture: block active current primary/canonical bot market scope, but do
not block on stale legacy `BotStrategy` links after a bot has moved to another
current symbol group.

## Scope
- `apps/api/src/modules/markets/markets.service.ts`
- `apps/api/src/modules/markets/markets.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Reproduce the production `LIVE` flow safely with user approval.
2. Remove stale legacy `botStrategy` rows from `assertUniverseNotUsedByActiveBot`.
3. Keep active primary bot and active canonical `BotMarketGroup` guards intact.
4. Add regression for an active bot whose current scope moved to another market
   universe while a legacy `BotStrategy` still points at the edited universe.
5. Run focused market and bot runtime validations.

## Acceptance Criteria
- [x] Active primary bot still blocks editing its current market universe.
- [x] Active canonical bot market group still blocks editing its current market
  universe.
- [x] Stale legacy `BotStrategy` rows no longer block editing a universe after
  the linked current bot has been deactivated.
- [x] Focused e2e and typecheck validation pass.

## Validation Evidence
- Production smoke:
  - `Peper bot` PAPER flow: disable -> market group `PAUSED` -> edit `Meme coins`
    -> restore whitelist -> reactivate, all `200 OK`.
  - `live` LIVE flow with user approval: disable -> market group `PAUSED` ->
    edit `ETH` failed before the fix with stale blocker `Peper bot`, then
    `live` was re-enabled and original whitelist remained unchanged.
- Local validation:
  - `pnpm --filter api run test -- src/modules/markets/markets.e2e.test.ts --run`
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Post-deploy production smoke:
  - Web build-info exposed `8a433e076f1f92701dc0b7ddf1ced41ad1af58e4`.
  - VPS Docker initially showed `soar-api` still running `6bc7840a`, while web
    was already on `8a433e07`; `soar-api` was redeployed through Coolify to
    `8a433e07`.
  - `GET https://api.soar.luckysparrow.ch/health` returned `200`.
  - `GET https://api.soar.luckysparrow.ch/ready` returned `200`.
  - `live` LIVE smoke with user approval: disable `live` -> edit linked `ETH`
    whitelist by adding `BTCUSDT` -> restore original whitelist -> re-enable
    `live`, all `200 OK`.
  - Final production state: `live.isActive=true`; `ETH` whitelist restored to
    `BNBUSDT,DOGEUSDT,ETHUSDT,XRPUSDT`.

## Architecture Evidence
- Architecture source reviewed: singular bot truth in project state and runtime
  scope tests.
- Fits approved architecture: yes
- Mismatch discovered: yes, stale legacy `BotStrategy` was being treated as
  current market usage.
- Decision required from user: no

## Deployment / Ops Evidence
- Deploy impact: low; API hotfix deployed to production after web-only
  build-info freshness was not enough to prove backend freshness.
- Env or secret changes: none
- Health-check impact: none
- Rollback note: revert this commit to restore legacy guard behavior.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: editing `ETH` after disabling `live` failed because active `Peper bot`
  had a stale legacy strategy link to `ETH Group`.
- Architecture constraints: current market usage is the bot's primary symbol
  group and canonical bot market groups.

### 2. Select One Priority Task
- Selected task: remove stale legacy links from active market edit guard.
- Priority rationale: direct production blocker for linked market edits.
- Deferred: unrelated dropdown layout cleanup.

### 3. Plan Implementation
- Files or surfaces to modify: market guard and market e2e regression.
- Logic: primary/canonical guards remain; legacy guard is removed.
- Edge cases: current active bot on another universe with stale legacy link.

### 4. Execute Implementation
- Implementation notes: deleted the legacy `botStrategy.findFirst` blocker and
  added a drift regression.

### 5. Verify and Test
- Validation performed: focused markets e2e, bots runtime-scope e2e, API
  typecheck, repository guardrails.
- Result: pass.

### 6. Self-Review
- Simpler option considered: filtering legacy links by current `bot.symbolGroupId`.
  Rejected because the singular architecture already has primary/canonical
  guards for current scope.
- Technical debt introduced: no

### 7. Update Documentation and Knowledge
- Docs updated: this task note
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report
- Task summary: active market edit guard no longer treats stale legacy
  `BotStrategy` rows as current bot market usage.
- Files changed: market service guard, focused market e2e, project context docs.
- How tested: production reproduction, local focused validation, production API
  deploy, and post-deploy `LIVE` disable/edit/restore/enable smoke.
- What is incomplete: no known issue for this slice.
- Next steps: add an API deploy-freshness proof so future backend hotfixes do
  not rely on web build-info as the only deployed-SHA signal.
