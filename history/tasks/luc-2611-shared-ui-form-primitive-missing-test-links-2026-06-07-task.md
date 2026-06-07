# LUC-2611 Shared UI/Form Primitive Missing-Test Links

## Header
- ID: LUC-2611-SHARED-UI-FORM-PRIMITIVE-MISSING-TEST-LINKS-2026-06-07
- Title: [Soar][Frontend][LUC-2608] Reconcile shared UI/form primitive missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Depends on: [LUC-2608](/LUC/issues/LUC-2608)
- Priority: P1
- Mission ID: LUC-2611-SHARED-UI-FORM-PRIMITIVE-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2611](/LUC/issues/LUC-2611) was assigned by Paperclip wake payload as the
Frontend Web local proof and architecture relation repair child for
[LUC-2608](/LUC/issues/LUC-2608). The wake had no pending comments,
`fallbackFetchNeeded=false`, and checkout was already claimed by the harness.

The current architecture-awareness report still listed shared UI/form primitive
anchors after stale rows for completed [LUC-2601](/LUC/issues/LUC-2601) and
[LUC-2607](/LUC/issues/LUC-2607) were skipped.

## Goal
Map focused local Web proof to the remaining shared UI/form primitive
missing-test anchors and add scanner-readable architecture relation rows without
changing runtime behavior.

## Scope
- `apps/web/src/ui/components/TableUi.test.tsx`
- `docs/architecture/relations/priority-test-links.csv`
- state/evidence files for [LUC-2611](/LUC/issues/LUC-2611)

## Implementation Plan
1. Reuse existing focused primitive tests for `StatusBadge`, `Tabs`,
   `ViewState`, `SharedUiPrimitives`, `FormFields`, and `FormPrimitives`.
2. Add a focused `TableToneBadge` assertion to `TableUi.test.tsx`.
3. Add direct `LUC-2611` rows to `priority-test-links.csv` for the assigned
   component and form function anchors.
4. Run focused Web tests plus architecture graph and guardrail checks.

## Acceptance Criteria
- Focused Web tests pass for the shared UI/form primitive test set.
- Architecture graph generation accepts the updated relation CSV.
- Repository guardrails pass.
- No deploy, push, restart, rollback, protected smoke, account, secret,
  exchange, database, or live-trading mutation occurs.

## Definition Of Done
- [x] Shared UI/form primitive behavior has focused local proof.
- [x] Scanner-readable `priority-test-links.csv` rows added for assigned
      anchors.
- [x] Focused tests and repository traceability checks passed.
- [x] Evidence recorded in repository state and Paperclip issue disposition.

## Validation Evidence
- `corepack pnpm --filter web exec vitest run src/ui/components/StatusBadge.test.tsx src/ui/components/TableUi.test.tsx src/ui/components/Tabs.test.tsx src/ui/components/ViewState.test.tsx src/ui/components/SharedUiPrimitives.test.tsx src/ui/forms/FormFields.test.tsx src/ui/forms/FormPrimitives.test.tsx --run`
  - PASS: `7` files / `34` tests.
- `corepack pnpm run architecture:graph:generate`
  - PASS: `653` nodes / `842` relations / `27` chains.
- `corepack pnpm run quality:guardrails`
  - PASS, including architecture graph drift `OK (0 missing representative paths)`.
- `Test-Path scripts\build-architecture-awareness-index.mjs`
  - `False`; architecture-awareness refresh is not claimed in this checkout.

## Architecture Evidence
- Architecture source reviewed:
  `docs/status/architecture-awareness-report.md` and
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: direct relation rows added to
  `priority-test-links.csv`.

## UX/UI Evidence
- Design source type: not applicable; test/traceability-only frontend proof.
- Existing shared pattern reused: existing shared primitive tests.
- Required states covered: status badges, table tone badge, hash-synced tabs,
  success state, profile/footer primitives, form alerts, form fields, compound
  fields, radio groups, and range fields.
- Accessibility checks: existing tests assert role, label, alert, tab, and
  button behavior where relevant.
- Responsive checks: not applicable; no layout implementation changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the `TableUi.test.tsx` assertion and the `LUC-2611`
  CSV relation rows if needed.

## Security / Privacy Evidence
- Data classification: local test and documentation metadata only.
- Trust boundaries: no auth, account, credential, exchange, or production
  boundary touched.
- Secret handling: no secrets read or written.
- Fail-closed behavior: no runtime behavior changed.

## Result Report
- Task summary: added focused local Web proof for `TableToneBadge` and mapped
  existing focused shared UI/form primitive proof to direct scanner-readable
  missing-test anchors.
- Files changed:
  - `apps/web/src/ui/components/TableUi.test.tsx`
  - `docs/architecture/relations/priority-test-links.csv`
  - `history/tasks/luc-2611-shared-ui-form-primitive-missing-test-links-2026-06-07-task.md`
  - project state/ledger files updated for closure
- How tested:
  - focused Web Vitest PASS (`7` files / `34` tests)
  - architecture graph generation PASS
  - repository guardrails PASS
- What is incomplete:
  - Architecture-awareness refresh was not run because
    `scripts/build-architecture-awareness-index.mjs` is absent in this
    checkout; exact top-sample removal is not claimed.
- Next steps:
  - Treat [LUC-2611](/LUC/issues/LUC-2611) as complete for this local proof
    lane. Do not reopen the same anchors unless a future refreshed report
    reintroduces a concrete missing-test row or the focused tests fail.
- Decisions made:
  - Kept the slice test/traceability-only; no runtime component code changed.
