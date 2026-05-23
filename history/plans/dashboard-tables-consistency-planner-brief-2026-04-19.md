# Dashboard Tables Consistency Planner Brief (2026-04-19)

Status: superseded (executed via `UXR-J` wave on 2026-04-19)
Execution mode: tiny-commit only  
Audience: Planner agent (sequencing + queue activation)

Canonical queued plan:
- `history/plans/uxr-j-dashboard-tables-consistency-refresh-plan-2026-04-19.md`

## Objective
- Ujednolicic UX/UI akcji tabel i panelu kolumn we wszystkich tabelach dashboardu.
- Wprowadzic spojny system kolorow dla akcji:
  - akcje systemowe (powtarzalne) vs akcje modulowe (dedykowane),
  - `Copy/Clone` ma byc wizualnie odrozniony od `Edit/Delete`,
  - `Bots Runtime` i `Backtests Preview` maja miec ten sam, dedykowany kolor modulowy.
- Ujednolicic zachowanie dropdownu kolumn:
  - klik checkboxa nie zamyka dropdownu,
  - dropdown zamyka sie tylko po kliknieciu poza dropdownem lub po kliknieciu triggera.
- Ujednolicic przycisk kolumn:
  - wszedzie wariant ikonka-only (bez widocznego labela), z zachowaniem a11y label.

## User Notes (canonicalized)
1. `Actions -> Copy`:
   - obecnie zbyt zblizony do pozostalych powtarzalnych akcji,
   - ma dostac dedykowany kolor z theme,
   - zmiana globalna (jedno miejsce wspolnego komponentu).
2. `Bots list -> Runtime`:
   - nie moze miec tego samego tonu co `Edit`,
   - ma byc ton dedykowany modulowi i spojny z `Backtests -> Preview`.
3. `Columns dropdown`:
   - klik w checkbox nie moze zamykac dropdownu,
   - zamykanie tylko trigger/outside-click/Escape,
   - przycisk kolumn ma byc wszedzie icon-only.

## Current-State Findings (Code Audit)

### 1) Akcje tabel sa scentralizowane, ale preset kolorow nie odpowiada oczekiwaniom
- Centralny system presetow:
  - `apps/web/src/ui/components/TableUi.tsx`
- Obecna mapa presetow:
  - `edit -> info`
  - `delete -> danger`
  - `clone -> neutral`
  - `preview -> neutral`
  - `runtime -> info` (kolizja znaczeniowa z `edit`)

Wniosek:
- Zmiana moze byc wykonana globalnie przez modyfikacje `actionPresetConfig` i ewentualne rozszerzenie `ActionTone`.

### 2) Dropdown kolumn zamyka sie po kliknieciu checkboxa (niepozadane)
- `apps/web/src/ui/components/DataTable.tsx`
- W handlerze checkboxa kolumn jest jawne:
  - `setColumnsDropdownOpen(false)`

Wniosek:
- To zachowanie trzeba usunac; logika outside-click/Escape juz istnieje i jest poprawna.

### 3) Przycisk kolumn ma niespojny wariant icon-only vs icon+label
- `DataTable` ma `settingsControlsIconOnly`, ale:
  - dla `advancedMode` jest wymuszane `true`,
  - dla czesci tabel bez `advancedMode` (np. paginowane listy) pozostaje widoczny label.
- Przyklad tabeli bez `advancedMode`, gdzie moze pojawic sie label:
  - `apps/web/src/features/profile/components/ApiKeysList.tsx`

Wniosek:
- Potrzebny globalny kontrakt icon-only by default dla wszystkich tabel.

## Scope (modules/files)

### Core shared components
- `apps/web/src/ui/components/TableUi.tsx`
- `apps/web/src/ui/components/DataTable.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`

### Primary consuming tables to regression-check
- `apps/web/src/features/bots/components/BotsListTable.tsx`
- `apps/web/src/features/backtest/components/BacktestsRunsTable.tsx`
- `apps/web/src/features/wallets/components/WalletsListTable.tsx`
- `apps/web/src/features/strategies/components/StrategiesList.tsx`
- `apps/web/src/features/markets/components/MarketUniversesTable.tsx`
- `apps/web/src/features/profile/components/ApiKeysList.tsx`
- `apps/web/src/features/logs/components/AuditTrailView.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx`

## Desired End-State Contract

### A) Action color semantics
- `edit` i `delete` zostaja systemowe i stabilne.
- `clone/copy` dostaje dedykowany ton odrozniajacy od `edit/delete` (np. `secondary` lub `accent`).
- `runtime` i `preview` wspoldziela ten sam module action tone.
- Zmiana globalna przez presety, bez recznego przepinania kazdej tabeli.

### B) Columns dropdown behavior
- Multi-select checkboxow bez auto-zamkniecia dropdownu.
- Zamkniecie tylko:
  - trigger button,
  - klik poza dropdown,
  - `Escape`.

### C) Columns trigger visual contract
- W calej aplikacji trigger kolumn jest icon-only.
- Tekst etykiety pozostaje jako `sr-only`/`aria-label` dla dostepnosci.

## Proposed Implementation Notes (for planner)
- Rozwazyc dodanie nowego tonu w `TableUi`:
  - `module` albo reuse `secondary/accent` zgodnie z aktywnym theme tokenem.
- Preset mapping proposal:
  - `clone -> module-secondary`
  - `preview -> module-secondary`
  - `runtime -> module-secondary`
  - `edit -> info` (bez zmian)
  - `delete -> danger` (bez zmian)
  - `details -> neutral` (bez zmian)
- W `DataTable`:
  - usunac `setColumnsDropdownOpen(false)` z checkbox `onChange`,
  - ustawic icon-only jako default contract dla settings controls,
  - zachowac `aria-label` i `sr-only`.

## Planner Output Required
Planner powinien dostarczyc:
1. Sekwencje tiny-commitow z jasnym ownershipem plikow.
2. Batch mape (`A/B/C`) i zaleznosci.
3. Propozycje aktywacji kolejki w:
   - `docs/planning/mvp-next-commits.md`
   - `docs/planning/mvp-execution-plan.md`
4. DoD per etap.
5. Focused regression pack + closure checks.

## Suggested Tiny-Commit Skeleton

### Group A - Shared Contract
1. `docs(contract): freeze dashboard table action-color and columns-dropdown behavior contract`
2. `refactor(ui-table-actions): introduce dedicated module action tone and remap clone/runtime/preview presets`
3. `refactor(ui-datatable-dropdown): keep columns dropdown open on checkbox toggles`
4. `refactor(ui-datatable-trigger): enforce icon-only columns trigger globally with a11y label`

### Group B - Regression Alignment
5. `test(ui-datatable): add regression tests for columns dropdown persistence and icon-only trigger`
6. `test(ui-table-actions): add preset-tone regression tests for clone/runtime/preview mapping`
7. `test(web-tables-focused): update/extend bots/backtests/profile/runtime table tests for new shared behavior`

### Group C - Closure
8. `qa(web-table-closure): run focused suite + typecheck/build and sync planning closure notes`

## Suggested Focused Validation Pack
- `apps/web/src/ui/components/DataTable.test.tsx`
- `apps/web/src/features/bots/components/BotsListTable.test.tsx`
- `apps/web/src/features/backtest/components/BacktestsRunsTable.test.tsx`
- `apps/web/src/features/profile/components/ApiKeysList.test.tsx`
- `apps/web/src/features/logs/components/AuditTrailView.test.tsx`
- runtime table integration tests around:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/*` tests (if present)
- closure:
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`

## Risks and Mitigation
- Risk: nowy ton kolorystyczny moze miec niski kontrast na czesci theme.
  - Mitigation: oprzec klasy na istniejacych tokenach daisy (`secondary/info/warning/accent`) + szybki kontrast smoke.
- Risk: zmiana defaultu icon-only wplynie na testy snapshot/queries.
  - Mitigation: testowac przez `role` + `aria-label`, nie przez widoczny tekst.
- Risk: dropdown persistence moze regresowac przy outside-click.
  - Mitigation: dedykowane testy interakcji: toggle checkbox, click outside, Escape.

## Planner Notes
- W projekcie istnieje historyczna fala dotyczaca tabel (`UXR-E`) oraz zamknieta fala form (`UXR-F`); ten brief jest targeted refresh dla aktualnych notatek UX.
- Priorytet techniczny wysoki, bo dotyczy centralnych komponentow wspoldzielonych przez wiele modulow.
