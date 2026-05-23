# Dashboard Forms Consistency Planner Brief (2026-04-19)

Status: superseded (executed via `UXR-I` wave on 2026-04-19)
Execution mode: tiny-commit only  
Audience: Planner agent (sequencing + queue activation)

Canonical queued plan:
- `history/plans/uxr-i-dashboard-forms-consistency-refresh-plan-2026-04-19.md`

## Objective
- Unify UX/UI of create/edit forms in dashboard modules.
- Keep visual language consistent with `/dashboard`.
- Preserve strengths of `/dashboard/strategies/create` (section clarity, guided flow).
- Enforce shared reusable form components instead of dedicated per-form input markup.

## Target Routes
- `/dashboard/wallets/create` + `/dashboard/wallets/[id]/edit`
- `/dashboard/markets/create` + `/dashboard/markets/[id]/edit`
- `/dashboard/strategies/create` + `/dashboard/strategies/[id]/edit`
- `/dashboard/backtests/create`
- `/dashboard/bots/create` + `/dashboard/bots/[id]/edit`

## Audit Method and Evidence
- Code audit across page wrappers and feature forms in `apps/web/src/app/dashboard/*` and `apps/web/src/features/*`.
- Browser screenshots from provided URLs were captured, but public access redirects to sign-in (no authenticated form view available in this run):
  - `output/ux-form-audit/wallets-create.png`
  - `output/ux-form-audit/markets-create.png`
  - `output/ux-form-audit/strategies-create.png`
  - `output/ux-form-audit/backtests-create.png`
  - `output/ux-form-audit/bots-create.png`

## Current-State Findings (Planner-Relevant)

### 1) Shared-form system is partial and fragmented
- `apps/web/src/features/markets/components/FieldControls.tsx` contains local reusable fields, but other modules mostly use hand-rolled markup.
- `apps/web/src/features/backtest/components/BacktestCreateForm.tsx` imports field controls from markets feature (cross-feature coupling).
- `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx` and `apps/web/src/features/bots/components/BotCreateEditForm.tsx` duplicate field wrapper patterns with custom class stacks.

Impact:
- Visual and behavior drift over time.
- Higher maintenance cost and slower UX iterations.

### 2) Wrapper-level inconsistency (copy, i18n, breadcrumbs)
- Hardcoded wrapper copy still exists in:
  - `apps/web/src/app/dashboard/bots/create/page.tsx`
  - `apps/web/src/app/dashboard/bots/[id]/edit/page.tsx`
  - `apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx` (partial hardcoded labels)
- Other modules use i18n namespace keys (`t(...)`) and route helpers more consistently.

Impact:
- Language inconsistency.
- Header/breadcrumb mismatch across modules.

### 3) Layout inconsistency and density issues
- `bots` form uses dense multi-column layout (`xl:grid-cols-4`) for mixed complexity fields.
- `wallets` has useful summary sidebar pattern; other forms do not consistently provide contextual summary.
- `strategies` has tabs and strong flow but section internals are stylistically divergent from other forms.

Impact:
- Uneven cognitive load and readability.
- Per-module UX feels like separate products.

### 4) Validation and submission ergonomics are not standardized
- Validation messaging exists but is implemented differently per form.
- No single cross-form contract for:
  - validation summary
  - first invalid field focus/scroll
  - consistent submit-disabled/loading behavior

Impact:
- Inconsistent operator experience.
- Higher regression risk on behavior changes.

## Desired End-State Contract

### A) Single source of truth for form primitives
Use shared primitives under `apps/web/src/ui/forms/*` as canonical for all dashboard forms:
- `FormPageShell`
- `FormSectionCard`
- `FormGrid`
- `FormField`
- `TextField`, `NumberField`, `SelectField`, `TextareaField`, `ToggleField`, `RadioGroupField`, `RangeField`, `CompoundField`
- `FormAlert`
- `FormValidationSummary`
- `FormActionBarMobile` (sticky on long forms)

### B) Wrapper consistency contract
- Wrapper titles/breadcrumb/action labels use i18n keys only.
- Unified save action style and disabled/submitting behavior.
- Shared page-shell API for create/edit wrappers.

### C) UX behavior contract
- Inline field errors + top summary block.
- Scroll/focus first invalid field after failed submit.
- Consistent loading/degraded/error states.
- Long forms may use tabs/step sections (especially markets).

### D) Coupling contract
- No cross-feature generic field imports.
- Generic controls only from `ui/forms`.

## Route-Specific UX Recommendations

### Wallets
- Keep existing left-form + right-summary structure (strong pattern).
- Migrate all field controls to shared primitives.
- Add mobile sticky action bar on long form mode.

### Markets
- Keep advanced functionality, but split into clearer IA:
  - Tab/section 1: configuration
  - Tab/section 2: whitelist/blacklist selection
  - Tab/section 3: preview/results
- Migrate off local `FieldControls`.

### Strategies
- Keep tabs as primary flow (best current form structure).
- Migrate section internals to shared fields for visual parity.
- Standardize per-tab spacing, labels, and error presentation.

### Backtests
- Remove dependence on markets controls.
- Add compact contextual summary panel (selected strategy/market group/timeframe).

### Bots
- Reduce ultra-dense 4-column layout to clearer 2-column section model.
- Keep domain safeguards (wallet-context checks/live constraints), but present warnings and toggles in consistent section cards.

## Planner Output Required

Planner should produce:
1. A tiny-commit sequence with strict single-purpose commits.
2. Grouping into execution batches (`A/B/C/...`) with clear dependencies.
3. Queue activation proposal for canonical files:
   - `docs/planning/mvp-next-commits.md`
   - `docs/planning/mvp-execution-plan.md`
4. DoD per stage (visual consistency, i18n consistency, behavior consistency).
5. Focused regression test pack and closure checks.

## Proposed Tiny-Commit Skeleton (for planner refinement)

### Group A - Foundation
1. `docs(contract): freeze dashboard form consistency refresh contract and boundaries`
2. `feat(ui/forms): add/normalize shared form primitives and index exports`
3. `test(ui/forms): add baseline tests for field and validation-summary primitives`
4. `chore(guardrails): add guardrail preventing cross-feature generic field imports`

### Group B - Wrapper + Core Migrations
5. `refactor(web-wrappers): unify create/edit wrappers (i18n + breadcrumbs + save action contract)`
6. `refactor(web-wallets-form): migrate wallets create/edit to shared ui/forms`
7. `refactor(web-markets-form): migrate markets form to shared ui/forms and section IA`
8. `refactor(web-backtests-form): decouple from markets controls and migrate to shared ui/forms`

### Group C - Complex Forms + UX Standardization
9. `refactor(web-strategies-form): preserve tabs, migrate section internals to shared fields`
10. `refactor(web-bots-form): migrate to shared fields and simplify layout density`
11. `feat(web-form-ux): standardize first-error focus/scroll + summary + submit-state behavior`
12. `feat(web-form-mobile): add and apply sticky mobile action bar where needed`

### Group D - Verification + Closure
13. `test(web-forms-regression): update focused module suites for migrated forms`
14. `qa(web-forms-closure): run typecheck/build + planning sync and closure evidence`

## Suggested Focused Validation Pack
- Wallets:
  - `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx`
- Markets:
  - `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx`
- Backtests:
  - `apps/web/src/features/backtest/components/BacktestCreateForm.test.tsx`
- Bots:
  - `apps/web/src/features/bots/components/BotCreateEditForm.test.tsx`
- Wrappers/pages and i18n guardrails:
  - relevant `apps/web/src/app/dashboard/**/page.test.tsx`
  - i18n/namespace tests currently used in project
- Closure checks:
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`

## Risks and Mitigation
- Risk: visual drift during incremental migration.
  - Mitigation: one module per commit + wrapper contract first.
- Risk: behavior regressions in complex forms (`strategies`, `bots`).
  - Mitigation: keep domain logic untouched; change rendering layer first.
- Risk: mobile overlap from sticky actions.
  - Mitigation: apply sticky bar behind explicit opt-in prop per form.

## Planner Notes
- A previous wave (`UXR-F`) exists and is marked closed; this brief is a refresh to re-open consistency scope based on current code reality and UX expectations.
- Do not enqueue automatically; planner should decide prioritization against current active queue and blockers.
