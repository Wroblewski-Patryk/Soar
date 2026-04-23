# Task

## Header
- ID: V1RT-01
- Title: Market-stream subscription parity with canonical runtime symbol scope
- Status: DONE
- Owner: Backend Builder
- Depends on: V1ALIGN-A, V1SIG-A, V1SURF-01
- Priority: P0

## Context
Production investigation after the truthful dashboard-market surface fix showed
two distinct runtime states:
- some symbols reached `latest_decision` with `No votes`
- some symbols remained stuck at configuration-only context with no runtime
  decision at all

That second state pointed away from strategy merge and toward missing final
candle delivery. The root cause was a contract drift in `marketStream.worker`:
subscription symbol scope was derived from ad-hoc whitelist logic instead of
the canonical resolver already used by runtime signal topology and operator
read models.

## Goal
Make market-stream symbol subscriptions use the same canonical symbol-group
resolution contract as runtime signal topology so active bots receive final
candle input for the same set of markets they are configured to trade.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Market-stream worker reuses canonical symbol-group resolution for bot market groups.
- [x] Focused regression proves volume-filter/catalog-backed groups subscribe the resolved symbols.
- [x] Source-of-truth is updated with the root cause and the fix.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/workers/marketStreamSubscriptions.service.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`
  - `pnpm --filter api run typecheck`
- Manual checks:
  - production investigation showed `configured_fallback:7`, `latest_decision:4`, `signals=0`, `open=0`, `trades=0` for paper bot `859fd4f7-cbb1-4f8e-b52a-5d119442e265`
- Screenshots/logs:
  - n/a
- High-risk checks:
  - confirmed the worker now shares the same symbol-resolution boundary as runtime and operator reads rather than maintaining a separate whitelist-only interpretation

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - none beyond source-of-truth sync; this is an implementation conformance fix

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: n/a
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: n/a

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This fix addresses the missing-input half of the production issue. It does not
yet claim that all remaining `No votes` outcomes are wrong; those still need
strategy/runtime-behavior validation after deploy.
