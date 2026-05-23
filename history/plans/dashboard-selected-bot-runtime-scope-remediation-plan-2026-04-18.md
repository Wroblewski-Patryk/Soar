# Dashboard Selected-Bot Runtime Scope Remediation Plan (2026-04-18)

Status: closed (BRS-A..BRS-C completed 2026-04-18)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: implementation agent

## Problem Summary
- Web selector logic is correct: selected snapshot is resolved by `selectedBotId` and signals are rendered from selected snapshot data only.
- Runtime API contract is currently too broad for dashboard needs:
  - symbol scope merges canonical + legacy + session stats + runtime events fallback,
  - `PAUSED` market-groups are included in runtime read scope,
  - symbol->strategy mapping can prioritize legacy links before canonical links,
  - `PUT /dashboard/bots/:id` accepts `strategyId` / `marketGroupId` but updates legacy strategy link while ignoring canonical primary-link update path.

## Goal
- Enforce strict dashboard runtime contract: selected bot only, currently active canonical scope only, deterministic strategy context, no cross-bot/cross-legacy leakage.

## Scope
- API:
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts`
  - `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts`
  - `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts`
  - `apps/api/src/modules/bots/botsCommand.service.ts`
  - `apps/api/src/modules/bots/botLegacyStrategyLink.service.ts` (compatibility boundary)
- WEB:
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts` (contract consumption only if required by API shape changes)
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` (regression checks)

## Decision Gate (must close first)
- Product decision to close in first commit:
  - Should `PAUSED` bot market-groups feed dashboard runtime signals/markets?
- Recommended default:
  - `PAUSED` groups are excluded from dashboard runtime read scope.
  - Only `ACTIVE + isEnabled` canonical groups/links contribute by default.

## Locked Runtime Contract (target state)
1. Dashboard runtime symbol-stats use selected bot scope only.
2. Scope source precedence:
   - canonical `botMarketGroup + marketGroupStrategyLink` (`ACTIVE + isEnabled`) is primary and authoritative.
   - legacy `botStrategy` is compatibility fallback only when canonical mapping is unavailable for the bot/symbol.
3. Session-stat symbols and runtime-event fallback cannot expand symbols outside canonical selected-bot scope in default dashboard mode.
4. Strategy context shown for symbol (condition lines, interval, strategy name) must follow canonical-first precedence.
5. `PUT /dashboard/bots/:id` with `strategyId` / `marketGroupId` updates canonical bot-group strategy mapping in one transactional path; legacy mirror is optional and cannot override canonical.

## Execution Groups
1. `BRS-A (BRS-01..BRS-04): decision + red tests + strict scope repository/service foundation`
2. `BRS-B (BRS-05..BRS-08): canonical update-path fix + strategy precedence unification`
3. `BRS-C (BRS-09..BRS-12): web regression + compatibility checks + closure evidence`

---

## Tiny-Commit Queue

### BRS-01
`docs(decision): close dashboard runtime scope policy (selected-bot strict + ACTIVE-only groups)`
- Scope:
  - Close `PAUSED` inclusion policy.
  - Freeze canonical-first strategy precedence policy.
- Files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/api-bots.md`
- Done when:
  - Implementation has one unambiguous policy for scope and precedence.

### BRS-02
`test(api-red): add failing regression for symbol leakage across canonical/legacy/session/event sources`
- Scope:
  - Add API e2e test that reproduces leakage:
    - Bot A canonical 1 symbol, Bot B canonical 4 symbols.
    - Session stats/events include foreign symbols.
    - Runtime endpoint for bot A must fail before fix (currently leaks).
- Files:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
- Done when:
  - Red test captures current bug deterministically.

### BRS-03
`fix(api-runtime-repository): narrow runtime read filters to ACTIVE canonical groups/links only`
- Scope:
  - Update runtime-read repository queries to exclude `PAUSED` from default dashboard scope.
  - Keep ownership/isEnabled filters intact.
- Files:
  - `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts`
- Done when:
  - `PAUSED` groups no longer contribute in default dashboard runtime scope.

### BRS-04
`fix(api-runtime-symbol-scope): stop symbol expansion by session-items/event fallback beyond canonical scope`
- Scope:
  - In default dashboard runtime mode, symbol set originates from canonical active mapping only.
  - Session-stat rows and event fallback can enrich canonical symbols but cannot add foreign symbols.
  - Preserve explicit `query.symbol` filtering behavior.
- Files:
  - `apps/api/src/modules/bots/botsRuntimeRead.service.ts`
- Done when:
  - Endpoint returns only symbols that belong to selected bot canonical active scope.

### BRS-05
`test(api-red-update-contract): add failing regression for PUT bot update canonical drift`
- Scope:
  - Add regression asserting `strategyId`/`marketGroupId` update changes canonical runtime graph links.
  - Demonstrate current legacy-only upsert drift.
- Files:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
- Done when:
  - Test fails before canonical update-path fix.

### BRS-06
`fix(api-update-contract): make PUT /dashboard/bots/:id update canonical group+strategy mapping transactionally`
- Scope:
  - Implement canonical update path for `strategyId` and `marketGroupId`.
  - Legacy helper remains compatibility-only and must not override canonical mapping.
  - Ensure wallet-context guard still applies.
- Files:
  - `apps/api/src/modules/bots/botsCommand.service.ts`
  - `apps/api/src/modules/bots/botLegacyStrategyLink.service.ts` (if compatibility adapter needed)
- Done when:
  - Bot update semantics are canonical and runtime-graph consistent.

### BRS-07
`fix(api-strategy-precedence): enforce canonical-first symbol->strategy assignment`
- Scope:
  - Reverse precedence where legacy mapping currently claims symbol first.
  - Keep deterministic fallback when canonical missing.
- Files:
  - `apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts`
  - `apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts` (if needed for consistency)
- Done when:
  - Strategy context in symbol stats reflects canonical mapping first.

### BRS-08
`test(api-regression): lock strict selected-bot scope + canonical strategy precedence`
- Scope:
  - Assert final API behavior:
    - no foreign symbols from session/event fallback,
    - no `PAUSED` leakage,
    - canonical strategy context visible in symbol stats payload.
- Files:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
- Done when:
  - Regressions are stable and green for strict contract.

### BRS-09
`test(web-regression): lock dashboard bot-switch behavior A(1 symbol) vs B(4 symbols) using API-shaped payloads`
- Scope:
  - Extend dashboard widget tests to ensure cards/count/context lines change only with selected bot payload.
  - Keep existing mixed-mode selector tests intact.
- Files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - Web regression mirrors user scenario and guards against reintroducing cross-bot blend.

### BRS-10
`refactor(web-runtime-contract): adjust dashboard runtime consumer only if API payload contract changed`
- Scope:
  - Minimal web adjustments for renamed/added scope metadata fields (if introduced).
  - No UI redesign in this wave.
- Files:
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - Dashboard compiles and consumes strict runtime payload cleanly.

### BRS-11
`qa(regression-pack): run focused API+WEB runtime scope pack`
- Suggested commands:
  - `pnpm --filter api test -- src/modules/bots/bots.e2e.test.ts`
  - `pnpm --filter web test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
- Done when:
  - Focused pack is green.

### BRS-12
`docs(closure): publish evidence and sync canonical queues`
- Scope:
  - Publish closure note/artifact references.
  - Mark phase status in canonical planning files.
- Files:
  - `docs/operations/_artifacts-brs-closure-2026-04-18.json` (or run-date equivalent)
  - `docs/operations/brs-runtime-scope-closure-2026-04-18.md`
  - queue files
- Done when:
  - Phase is evidence-backed and executor can move to next wave.

---

## Stage DoD

### Stage A DoD (`BRS-A`)
- Decision on `PAUSED` scope is closed.
- Red regression exists for symbol leakage.
- Default repository/service scope is narrowed to canonical active bot scope.

### Stage B DoD (`BRS-B`)
- `PUT /dashboard/bots/:id` updates canonical mappings.
- Strategy precedence is canonical-first.
- API regressions for scope + precedence pass.

### Stage C DoD (`BRS-C`)
- Web regression for bot switch scenario passes.
- No runtime contract drift in dashboard view.
- Focused QA pack + closure evidence published.

## Risks and Rollback

### Stage A Risk / Rollback
- Risk:
  - Strict scope may hide symbols for bots still depending on legacy-only links.
- Rollback:
  - Keep fallback guarded and explicit; revert repository/service commit only if hard regression appears.

### Stage B Risk / Rollback
- Risk:
  - Canonical update migration may break old legacy assumptions in update flow.
- Rollback:
  - Revert `BRS-06` independently; retain tests and scope fixes for diagnostics.

### Stage C Risk / Rollback
- Risk:
  - Web tests may reveal hidden API/UI contract mismatch.
- Rollback:
  - Revert web adapter commit (`BRS-10`) without reverting API core fixes.

## Request-to-Task Mapping
- `selected bot only` scope: `BRS-03`, `BRS-04`, `BRS-08`
- `canonical strategy first`: `BRS-07`, `BRS-08`
- `PUT update contract drift`: `BRS-05`, `BRS-06`
- `A(1 symbol) / B(4 symbols) dashboard regression`: `BRS-09`
- `PAUSED groups decision`: `BRS-01`
