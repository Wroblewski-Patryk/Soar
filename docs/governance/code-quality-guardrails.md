# Code Quality Guardrails

Updated: 2026-05-24

## Purpose

Define which maintainability exceptions remain temporarily intentional during
the `SCALE-A` wave and which new debt is now blocked by repository guardrails.

## Hard-Fail Guardrails

`pnpm run quality:guardrails` must fail when:

- a new production web file introduces a local `copy` / `copyByLocale`
  dictionary outside the allowlist,
- a new production web file introduces raw user-facing toast/confirm/attribute
  literals outside the allowlist,
- a production source file exceeds the staged monolith threshold (`1000`
  lines) without an allowlist entry,
- the duplicate-helper snapshot is missing or references non-existent files,
- the architecture evidence graph drift audit reports any missing
  representative source, test, documentation, config, or pipeline path.

The graph drift guardrail runs `scripts/auditArchitectureGraphDrift.mjs` in
strict mode through `pnpm run quality:guardrails`. When it fails, regenerate
the graph and update the CSV source records before treating the changed feature
as official:

```powershell
pnpm run architecture:graph:generate
pnpm run architecture:graph:drift:strict
pnpm run quality:guardrails
```

## Temporary Allowlist Policy

Allowlist entries are permitted only when all conditions hold:

1. the offender already exists in the repository,
2. the file is explicitly inventoried in `history/audits/code-quality-maintainability-inventory-2026-04-21.md`,
3. a queued `CQLT-*` task exists to remove or split it,
4. the allowlist entry is single-file and not wildcard-based.

## SCALE-02 Audit Result (Allowlist Truthfulness)

Classification of entries audited on 2026-04-22:

- still needed:
  - `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`
    (hardcoded numeric placeholders intentionally kept for now)
- removable now:
  - `apps/web/src/features/backtest/components/backtestRunDetails.copy.ts`
  - `apps/web/src/features/profile/hooks/useApiKeys.ts`
  - `apps/web/src/app/(public)/page.tsx`
  - `apps/web/src/context/AuthContext.tsx`
  - `apps/web/src/ui/components/ProfileButton.tsx`
  - `apps/web/src/ui/components/ThemeSwitch.tsx`
  - `apps/web/src/ui/layout/dashboard/PageTitle.tsx`
  - `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`
  - `apps/web/src/ui/components/ViewState.tsx`
  - `apps/web/src/ui/forms/FormValidationSummary.tsx`
- replace with narrower rule:
  - none required in this slice

## Approved Temporary Exceptions

### Local Copy / Hardcoded UI Allowlist

Removed from the allowlist on 2026-04-21 after `CQLT-12..CQLT-14`:

- `apps/web/src/features/profile/components/ApiKeyForm.tsx`
- `apps/web/src/features/profile/components/ApiKeysList.tsx`
- `apps/web/src/features/profile/components/Security.tsx`
- `apps/web/src/features/profile/components/Subscription.tsx`
- `apps/web/src/features/profile/hooks/useUser.ts`
- `apps/web/src/features/profile/pages/ProfilePage.tsx`
- `apps/web/src/features/strategies/components/StrategiesList.tsx`
- `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx`

Removed from the allowlist on 2026-04-22 after `SCALE-02/SCALE-03` audit:

- `apps/web/src/context/AuthContext.tsx`
- `apps/web/src/app/(public)/page.tsx`
- `apps/web/src/features/profile/hooks/useApiKeys.ts`
- `apps/web/src/ui/components/ProfileButton.tsx`
- `apps/web/src/ui/components/ThemeSwitch.tsx`
- `apps/web/src/ui/layout/dashboard/PageTitle.tsx`
- `apps/web/src/features/backtest/components/backtestRunDetails.copy.ts`
- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`
- `apps/web/src/ui/components/ViewState.tsx`
- `apps/web/src/ui/forms/FormValidationSummary.tsx`

Current temporary hardcoded exception:

- `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`

### Monolith Staged-Decomposition Allowlist

These files exceed the new `1000`-line production threshold and are
temporarily allowlisted while queued decomposition tasks remain active:

- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/bots/components/BotsManagement.tsx`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/wallets/components/WalletCreateEditForm.tsx`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/backtests/backtests.service.ts`

## Forbidden Exceptions

- wildcard allowlists by folder or feature
- silent reclassification of new hardcoded UI strings as "temporary"
- adding a second monolith to avoid splitting an existing one
- leaving duplicate helper seams undocumented once reuse crosses module
  boundaries

## Review Rule

When a guardrail requires a new allowlist entry, the same change must also:

- update the inventory doc,
- update canonical planning/context docs,
- explain why a same-turn extraction was unsafe or out of scope.
