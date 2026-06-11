# LUC-3504 Dashboard i18n Source-Control Closure

## Header
- ID: LUC-3504
- Title: [Soar][FEW] Validate dashboard i18n source-control closure lane
- Task Type: review
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Depends on: [LUC-3499](/LUC/issues/LUC-3499)
- Priority: P1
- Module Confidence Rows: Web dashboard i18n / locale encoding integrity
- Requirement Rows: REQ-I18N-022
- Quality Scenario Rows: i18n locale integrity / copy encoding
- Risk Rows: RISK-034
- Iteration: 2026-06-11 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-3504-DASHBOARD-I18N-SOURCE-CONTROL-CLOSURE-2026-06-11
- Mission Status: VERIFIED

## Context
[LUC-3499](/LUC/issues/LUC-3499) classified the remaining product-code dirty
group as exactly three Web i18n/test files:

- `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts`
- `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`
- `apps/web/src/i18n/translations.test.ts`

The repository has a much broader dirty tree from unrelated state, evidence,
script, architecture, and historical task lanes. This heartbeat reviewed only
the three [LUC-3504](/LUC/issues/LUC-3504) files and did not stage, commit,
push, deploy, restart, or mutate runtime state.

## Goal
Validate whether the dashboard i18n dirty group is current, correct,
regression-tested, and suitable for a future coherent source-control closure.

## Scope
- Review local diffs for only the three named files.
- Run the smallest relevant Web i18n proof.
- Run a direct locale encoding-marker scan against the changed dashboard-home
  de-CH and pt namespace files.
- State behavior impact, regression risk, and commit/no-commit recommendation.

## Implementation Plan
1. Read Paperclip wake context and [LUC-3504](/LUC/issues/LUC-3504) heartbeat
   context.
2. Classify current worktree state and isolate the three scoped files.
3. Review diffs for behavior, i18n key safety, and encoding drift coverage.
4. Run focused Web translation test.
5. Run direct mojibake/BOM marker scan and whitespace check.
6. Record source-control closure recommendation.

## Acceptance Criteria
- Only the three scoped files are reviewed for product-code readiness.
- Focused Web translation validation passes.
- Direct encoding marker scan reports no current mojibake/BOM matches in the
  changed locale files.
- Closure recommendation explicitly accounts for the broader dirty worktree.

## Definition of Done
- [x] Local diff review completed for the three scoped files.
- [x] Focused i18n test passed.
- [x] Encoding marker scan passed with no matches.
- [x] Source-control recommendation recorded.
- [x] No push, deploy, restart, protected smoke, secret/account readback,
      DB/Redis mutation, exchange action, order, position, payment, or
      live-trading mutation occurred.

## Validation Evidence
- `corepack pnpm --filter web exec vitest run src/i18n/translations.test.ts --reporter=verbose`
  - PASS: `1` test file, `7` tests.
- `rg -n "\uFFFD|Ã|Â|â€|â€™|â€œ|ðŸ|Ă|﻿export" apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts apps/web/src/i18n/namespaces/dashboard-home.pt.ts -S`
  - PASS by no matches (`rg` exit code `1`).
- `git diff --check -- apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts apps/web/src/i18n/namespaces/dashboard-home.pt.ts apps/web/src/i18n/translations.test.ts`
  - PASS: no whitespace errors; Git emitted only existing Windows LF-to-CRLF
    working-copy warnings.

## Review Findings
- `dashboard-home.de-CH.ts` removes the BOM before `export` and replaces
  previously corrupted German umlaut/eszett strings with readable de-CH copy.
  Keys and interpolation placeholders are preserved.
- `dashboard-home.pt.ts` removes the BOM before `export` and fixes the one
  observed corrupted Portuguese character in the execution review description.
  Keys and placeholders are preserved.
- `translations.test.ts` adds loaded-dictionary coverage that walks every
  string value across locales and rejects replacement characters plus common
  mojibake markers. This makes the prior encoding class repeatable in local
  Web translation proof.

## Behavior And User Impact
- Dashboard Home de-CH and pt users no longer see corrupted glyph sequences in
  the affected labels/descriptions.
- Runtime behavior is unchanged; this is copy/encoding integrity plus test
  coverage only.
- Regression risk is low for product logic and medium-low for locale copy:
  the test now catches common encoding drift across loaded dictionaries, but it
  does not validate linguistic quality.

## Source-Control Closure Recommendation
- Commit recommendation: commit-ready for the scoped [LUC-3504](/LUC/issues/LUC-3504)
  product-code group.
- Current commit action: not committed by FEW in this heartbeat because the
  shared worktree contains a much broader unrelated dirty set. A later source-
  control closure owner should stage exactly these three files if batching this
  i18n repair separately.
- Push status: not needed.
- Deploy impact: none.

## Result Report
- Task summary: validated dashboard i18n encoding repair and focused test
  coverage for the three scoped files.
- Files changed by this heartbeat: this task packet plus project state
  bookkeeping only; no product-code edit was made.
- Product-code files reviewed:
  - `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`
  - `apps/web/src/i18n/translations.test.ts`
- How tested: focused Web translation Vitest, direct encoding marker scan,
  scoped `git diff --check`.
- What is incomplete: no full Web suite, route-reachable i18n audit, rendered
  browser smoke, commit, push, or deploy was required for this validation lane.
- Next owner: source-control closure owner if/when batching the commit from the
  shared dirty tree.
