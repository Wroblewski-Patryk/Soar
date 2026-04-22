# L10NQ-E Residual Route-Reachable i18n Closure Plan (2026-04-21)

Status: Closed

## Objective

Close the residual route-reachable i18n debt left after `L10NQ-D` and the
`CQLT` closure pack, while improving audit signal quality so a future
zero-debt result is trustworthy rather than masked by audit noise.

## Baseline Inputs

- `docs/operations/_artifacts-l10nq-d-coverage-audit-latest.json`
- `docs/operations/code-quality-maintainability-closure-2026-04-21.md`
- `docs/modules/code-quality-maintainability-inventory-2026-04-21.md`

## Baseline Summary

Initial route-reachable audit snapshot (`2026-04-21T18:11:39.833Z`) reported:

- `filesWithFindings=35`
- `filesWithLocalCopy=28`
- `filesWithFallbackPl=4`
- `filesWithHardcodedUiCandidates=6`
- `moduleFindingFiles=29`
- `sharedFoundationFindingFiles=6`

This is too high to leave as historical residue, but it also mixes true
product debt with audit-noise candidates that make closure status harder to
trust.

Final closure audit on `2026-04-21` now reports:

- `findings=0`
- `localCopy=0`
- `fallbackPl=0`
- `hardcoded=0`

## Residual Hotspot Families

### 1. True Residual Route and Shared-UI Debt

Residual file families from the opening baseline:

- `apps/web/src/app/(public)/page.tsx`
- `apps/web/src/features/profile/hooks/useApiKeys.ts`
- `apps/web/src/ui/components/ProfileButton.tsx`
- `apps/web/src/ui/components/ThemeSwitch.tsx`
- `apps/web/src/ui/layout/dashboard/PageTitle.tsx`
- `apps/web/src/features/backtest/components/backtestRunDetails.copy.ts`

Shared exception surfaces from the opening baseline:

- `apps/web/src/ui/components/ViewState.tsx`
- `apps/web/src/ui/forms/FormValidationSummary.tsx`
- `apps/web/src/features/backtest/components/BacktestCreateForm.tsx`
- `apps/web/src/features/backtest/components/BacktestRunDetails.tsx`

### 2. Audit Signal-Quality Drift

The latest route summary also repeatedly surfaces files that are not good
closure targets on their own:

- `apps/web/src/i18n/namespaceRegistry.ts`
- `apps/web/src/i18n/namespaces/public.en.ts`
- `apps/web/src/i18n/namespaces/public.pl.ts`
- `apps/web/src/i18n/namespaces/public.pt.ts`

Those files are legitimate translation infrastructure and namespace content,
not route-local debt. `L10NQ-E` must therefore improve the audit contract so it
distinguishes:

- actionable route/shared-UI debt
- expected translation-source files
- explicit approved exceptions, if any remain

## Delivery Contract

- No route-reachable production UI file may contain local per-file `copy`
  dictionaries.
- No route-reachable production UI file may fallback locale to `pl`.
- No route-reachable production UI file may contain user-facing hardcoded copy
  outside explicit shared exception policy.
- Route-reachable audit output must separate actionable debt from translation
  source files so closure evidence is trustworthy.
- Shared primitives must either consume translation keys or be documented as
  explicit, approved exceptions with rationale.

## Execution Wave

### L10NQ-E-01 docs(contract)

- Freeze the residual debt scope, audit-trust contract, and closure target from
  the `2026-04-21` residual snapshot.
- Acceptance:
  - canonical plan links the exact baseline artifact and counts
  - closure target distinguishes true debt from audit noise

### L10NQ-E-02 audit(web-i18n)

- Derive an actionable residual inventory from the latest audit artifact and
  split findings into:
  - route/module debt
  - shared-foundation debt
  - audit-signal/noise candidates
- Acceptance:
  - canonical docs list concrete residual file families and ownership buckets
  - follow-up execution order is tied to those buckets

### L10NQ-E-03 refactor(tooling)

- Tighten the route-reachable audit contract so namespace source files and
  registry wiring do not masquerade as unresolved route debt.
- Acceptance:
  - audit still hard-fails on real route/shared UI debt
  - audit output cleanly distinguishes actionable findings from translation
    infrastructure

### L10NQ-E-04 refactor(web-public-shell)

- Migrate residual public-shell and shared-shell copy into canonical namespaces:
  - `(public)/page.tsx`
  - `ProfileButton.tsx`
  - `ThemeSwitch.tsx`
  - `PageTitle.tsx`
- Acceptance:
  - no route-reachable shell/page copy remains hardcoded or locally branched

### L10NQ-E-05 refactor(web-profile)

- Remove residual profile-hook/local error-copy drift in `useApiKeys.ts` and
  any directly related shared profile surfaces.
- Acceptance:
  - profile API-key flow uses namespace/shared-copy ownership only

### L10NQ-E-06 refactor(web-backtests)

- Retire `backtestRunDetails.copy.ts` as residual local-copy debt and align
  backtest shared/details surfaces to canonical namespace ownership.
- Acceptance:
  - backtests detail/create residual exceptions are either localized or
    intentionally documented with no hidden locale fallback

### L10NQ-E-07 refactor(web-shared-foundation)

- Localize or formally retire the remaining shared-foundation exceptions:
  `ViewState`, `FormValidationSummary`, and any leftover cross-route fallback
  labels.
- Acceptance:
  - shared-foundation exception list is either empty or explicitly justified

### L10NQ-E-08 test(web-i18n)

- Expand parity/smoke/guardrail coverage for residual routes and shared
  primitives touched by `L10NQ-E`.
- Acceptance:
  - focused tests fail on regression back to local copy, `pl` fallback, or
    hardcoded user-facing labels

### L10NQ-E-09 qa(closure)

- Run the residual i18n closure pack:
  - `pnpm i18n:audit:route-reachable:web`
  - relevant web tests
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`
- Acceptance:
  - actionable route-reachable debt is reduced to zero
  - any remaining raw findings are documented as approved exceptions or
    intentional audit exclusions

### L10NQ-E-10 docs(sync)

- Publish closure evidence and synchronize canonical queue/context/inventory
  docs after the residual wave.
- Acceptance:
  - queue/context reflect real closure state
  - residual i18n debt is no longer tracked as informal carry-over

## Definition of Done

- Route-reachable audit reports zero actionable `localCopy`, `fallbackPl`, and
  hardcoded UI debt in production web surfaces.
- Audit output no longer conflates translation infrastructure with unresolved
  route-level debt.
- Shared-foundation exceptions are either eliminated or documented explicitly.
- Closure evidence is published and canonical queue/context no longer describe
  the residual findings as informal follow-up.

## Closure Summary

- `L10NQ-E-01..L10NQ-E-10` closed on `2026-04-21`
- audit tooling now excludes translation infrastructure files from route-debt
  scoring and filters prior false-positive patterns around local copy, `pl`
  fallback detection, numeric placeholders, and translation-backed toast
  templates
- residual public/profile/backtests/shared UI debt was migrated to canonical
  namespaces
- closure evidence published in
  `docs/operations/l10nq-e-residual-route-reachable-i18n-closure-2026-04-21.md`
