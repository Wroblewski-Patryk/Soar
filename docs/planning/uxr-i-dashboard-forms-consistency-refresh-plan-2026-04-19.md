# UXR-I Dashboard Forms Consistency Refresh Plan (2026-04-19)

Status: closed (all `UXR-I-01..UXR-I-14` completed on 2026-04-19)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Start Gate
- Keep commit scope strict: one tiny task per commit.
- Execute `UXR-I-01..UXR-I-14` in order.
- This wave is a refresh of residual consistency gaps after closed `UXR-F`; do not re-implement already compliant areas.

## Source and Scope
- Planner input: `docs/planning/dashboard-forms-consistency-planner-brief-2026-04-19.md`.
- Target routes:
  - `/dashboard/wallets/create` + `/dashboard/wallets/[id]/edit`
  - `/dashboard/markets/create` + `/dashboard/markets/[id]/edit`
  - `/dashboard/strategies/create` + `/dashboard/strategies/[id]/edit`
  - `/dashboard/backtests/create`
  - `/dashboard/bots/create` + `/dashboard/bots/[id]/edit`

## Objective
- Re-establish strict UX/UI parity across dashboard create/edit forms.
- Preserve strong flow from strategies while enforcing one reusable form system.
- Remove residual wrapper hardcoded copy and cross-feature field coupling.
- Standardize validation and submit ergonomics end-to-end.

## Locked Implementation Contract
1. Generic controls come only from `apps/web/src/ui/forms/*`.
2. Wrapper copy/breadcrumb/actions are i18n-key driven (no hardcoded labels).
3. Validation UX parity:
   - inline field errors,
   - top summary block,
   - focus/scroll to first invalid field.
4. Submit UX parity:
   - deterministic disabled/loading/submitting states.
5. Long-form ergonomics:
   - tabs/sectioning when needed,
   - sticky mobile action bar where form depth warrants it.
6. Scope lock:
   - no domain logic rewrites unless required by failing tests or contract safety.

## Execution Groups
1. `UXR-I-A (UXR-I-01..UXR-I-04): refresh contract + gap inventory + shared guardrails`
2. `UXR-I-B (UXR-I-05..UXR-I-08): wrapper parity + wallets/markets/backtests residual migration`
3. `UXR-I-C (UXR-I-09..UXR-I-12): strategies/bots consistency closure + standardized form UX`
4. `UXR-I-D (UXR-I-13..UXR-I-14): focused regression + closure sync`

## Tiny-Commit Queue

### UXR-I-01
`docs(contract): freeze dashboard forms consistency refresh boundaries after UXR-F`
- Scope:
  - lock refresh boundaries and acceptance criteria.
  - lock `ui/forms-only` generic field-source rule.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
- Done when:
  - refresh scope is unambiguous for execution.

### UXR-I-02
`audit(web-forms): publish residual consistency gap map per route/module`
- Scope:
  - create deterministic route/module gap inventory:
    - wrapper copy/i18n drift,
    - cross-feature control imports,
    - spacing/layout density mismatches,
    - validation/submit behavior drift.
- Likely files:
  - `docs/operations/uxr-i-forms-gap-map-2026-04-19.md`
  - optional JSON artifact under `docs/operations/_artifacts-uxr-i-*`
- Done when:
  - executor has a concrete route-by-route delta list.

### UXR-I-03
`chore(web-ui-forms): normalize shared form primitive API surface for refresh migration`
- Scope:
  - align/extend `ui/forms` primitives only where required by gap map.
  - keep backward compatibility for already migrated forms.
- Likely files:
  - `apps/web/src/ui/forms/*`
  - `apps/web/src/ui/forms/index.ts`
- Done when:
  - no residual module needs feature-local generic controls.

### UXR-I-04
`test(guardrails): lock no-cross-feature generic controls and no-hardcoded-wrapper-copy regressions`
- Scope:
  - enforce import boundary and wrapper-copy guardrails.
  - add failing tests for known residual violations, then make green.
- Likely files:
  - `scripts/repoGuardrails.mjs`
  - `apps/web/src/i18n/guardrails.test.ts`
  - targeted wrapper tests in `apps/web/src/app/dashboard/**`
- Done when:
  - violating import/copy patterns fail deterministic checks.

### UXR-I-05
`refactor(web-wrappers): unify create/edit wrappers i18n+breadcrumb+save-action contract`
- Scope:
  - remove residual hardcoded wrapper labels.
  - standardize shell/action contract across in-scope routes.
- Likely files:
  - `apps/web/src/app/dashboard/**/create/page.tsx`
  - `apps/web/src/app/dashboard/**/[id]/edit/page.tsx`
  - `apps/web/src/i18n/namespaces/dashboard-*.{en,pl,pt}.ts`
- Done when:
  - all scoped wrappers use namespace keys and consistent action behavior.

### UXR-I-06
`refactor(web-wallets-form): close residual layout/control parity gaps using ui/forms primitives`
- Scope:
  - keep strong left-form/right-summary pattern.
  - standardize field spacing/errors/actions with shared primitives.
- Likely files:
  - `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx`
  - `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx`
- Done when:
  - wallets form matches refresh contract without behavior regression.

### UXR-I-07
`refactor(web-markets-form): enforce sectioned IA and remove any residual local generic controls`
- Scope:
  - keep functional market composition behavior.
  - standardize configuration/list/preview ergonomics.
- Likely files:
  - `apps/web/src/features/markets/components/MarketUniverseForm.tsx`
  - `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx`
- Done when:
  - markets form is fully on shared form system and section IA is consistent.

### UXR-I-08
`refactor(web-backtests-form): finalize decoupling from feature-local controls and align summary ergonomics`
- Scope:
  - ensure backtests form uses only `ui/forms` generic controls.
  - align context summary look/spacing with unified form language.
- Likely files:
  - `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`
  - `apps/web/src/features/backtest/components/BacktestCreateForm.test.tsx`
- Done when:
  - backtests form is consistency-aligned and coupling-free.

### UXR-I-09
`refactor(web-strategies-form): preserve tabs while normalizing section internals to shared primitives`
- Scope:
  - keep strategy tabs and strong flow.
  - standardize per-tab field treatment and error presentation.
- Likely files:
  - `apps/web/src/features/strategies/components/StrategyForm.tsx`
  - `apps/web/src/features/strategies/components/StrategyFormSections/*`
- Done when:
  - strategies remains best-flow form with consistent visual/interaction contract.

### UXR-I-10
`refactor(web-bots-form): reduce layout density and align controls to shared form system`
- Scope:
  - reduce dense multi-column hotspots to clearer two-column sections.
  - keep all domain safeguards intact.
- Likely files:
  - `apps/web/src/features/bots/components/BotCreateEditForm.tsx`
  - `apps/web/src/features/bots/components/BotCreateEditForm.test.tsx`
- Done when:
  - bots form readability and action clarity are consistent with other forms.

### UXR-I-11
`feat(web-form-ux): standardize first-error focus/scroll + summary/inline sync across scoped forms`
- Scope:
  - enforce one validation interaction contract.
  - remove per-form behavioral drift.
- Likely files:
  - `apps/web/src/ui/forms/*`
  - touched form components
- Done when:
  - all scoped forms share the same invalid-submit behavior.

### UXR-I-12
`feat(web-form-mobile): apply sticky mobile action bar contract to long dashboard forms`
- Scope:
  - ensure long forms keep save action reachable on mobile.
  - avoid overlap regressions.
- Likely files:
  - `apps/web/src/ui/forms/*`
  - long-form wrappers/components
- Done when:
  - mobile action reachability is consistent on scoped long forms.

### UXR-I-13
`test(web-forms-regression): run/update focused suites for wrapper+i18n+form-consistency contracts`
- Suggested command pack:
  - `pnpm --filter web run test -- src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/markets/components/MarketUniverseForm.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/bots/components/BotCreateEditForm.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx src/app/dashboard/bots/create/page.test.tsx src/app/dashboard/bots/[id]/edit/page.test.tsx src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts --run`
- Done when:
  - focused suite is green and reflects the new consistency contract.

### UXR-I-14
`qa(web-forms-closure): run build/typecheck/guardrails and sync canonical queue/context`
- Mandatory checks:
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`
- Done when:
  - closure evidence is published and canonical files are synchronized.

## Stage Definition of Done

### Stage A DoD (`UXR-I-A`)
- Refresh contract is frozen.
- Residual gap map is published.
- Guardrails cover known drift vectors.

### Stage B DoD (`UXR-I-B`)
- Wrapper parity is re-established.
- Wallets/markets/backtests match shared form contract.
- No cross-feature generic field imports remain in scoped forms.

### Stage C DoD (`UXR-I-C`)
- Strategies/bots consistency and readability gaps are closed.
- Validation/submit behavior contract is uniform.
- Mobile sticky action bar is correctly applied.

### Stage D DoD (`UXR-I-D`)
- Focused tests pass.
- `typecheck`, `build`, and guardrails pass.
- Queue/context closure evidence is synchronized.

## Risks and Rollback
- Risk: rework overlaps with already-good `UXR-F` areas.
  - Mitigation: start with explicit residual gap map and scope-lock each commit.
  - Rollback: revert only commit touching non-gap areas.
- Risk: strategies/bots complex forms regress behavior.
  - Mitigation: keep domain logic unchanged, migrate rendering layer first.
  - Rollback: per-module revert (`strategies` or `bots`) without undoing other modules.
- Risk: mobile sticky action bar overlap.
  - Mitigation: opt-in application with targeted responsive tests.
  - Rollback: disable sticky bar per form via prop-level rollback.

## Request-to-Task Mapping
- Shared `ui/forms` consistency refresh: `UXR-I-03`, `UXR-I-04`
- Wrapper i18n/breadcrumb parity: `UXR-I-05`
- Wallets/Markets/Backtests residual closure: `UXR-I-06`, `UXR-I-07`, `UXR-I-08`
- Strategies/Bots alignment: `UXR-I-09`, `UXR-I-10`
- Validation + submit behavior standardization: `UXR-I-11`
- Mobile sticky actions: `UXR-I-12`
- Regression + closure: `UXR-I-13`, `UXR-I-14`
