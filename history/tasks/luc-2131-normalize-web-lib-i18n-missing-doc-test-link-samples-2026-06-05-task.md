# Task

## Header
- ID: LUC-2131
- Title: [Soar][Architecture Repair][Docs] Normalize Web lib and i18n missing doc/test link samples
- Task Type: docs
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Priority: high
- Module Confidence Rows: `web-shared`; Architecture Evidence Graph
- Requirement Rows: `REQ-DOC-029`, `REQ-DOC-030`
- Risk Rows: `RISK-DOC-005`
- Iteration: 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2131-WEB-LIB-I18N-DOC-TEST-LINK-NORMALIZATION-2026-06-05
- Mission Status: VERIFIED

## Context
The scoped Paperclip wake for [LUC-2131](/LUC/issues/LUC-2131) had no pending
comments and `fallbackFetchNeeded=false`; checkout was already claimed by the
harness and was not repeated. This child issue was derived from
[LUC-2123](/LUC/issues/LUC-2123) to normalize the remaining top Web lib/i18n
samples without broad-linking unrelated script/tooling rows.

The starting `docs/status/architecture-awareness-report.md` snapshot was
generated at `2026-06-05T08:56:49.581Z` and reported:
- raw missing tests `7714`;
- actionable missing tests `919`;
- raw missing docs `931`;
- actionable missing docs `188`;
- classified inferred-link noise `7377`;
- disconnected entities `0`.

## Goal
Normalize clear shared Web documentation links for Web i18n, generic
`apps/web/src/lib` utilities, shared UI helper samples, theme bootstrap, and
dashboard header helper rows, while separating existing aggregate/focused test
proof from true missing focused test coverage.

## Scope
- `docs/architecture/relations/documentation-links.csv`
- `docs/modules/web-shared.md`
- `docs/status/architecture-awareness-report.md`
- `docs/graphs/architecture-awareness.*`
- generated architecture graph/status exports touched by scanner commands
- local evidence/state updates for this issue

Runtime behavior, route behavior, API behavior, database, deploy, protected
production smoke, account mutation, secrets, exchange mutation, and LIVE trading
were out of scope.

## Implementation Plan
1. Read the current architecture-awareness report and inherited LUC-2123
   classification.
2. Confirm canonical owner for sampled `apps/web/src/i18n/*`,
   `apps/web/src/lib/*`, `themeBootstrap.ts`, shared UI helper, and dashboard
   header style rows.
3. Add direct `documentation-links.csv` rows only for samples with stable
   `web-shared` ownership.
4. Update `docs/modules/web-shared.md` with owner/status/expected-proof
   classification that distinguishes focused tests, aggregate tests, and
   scanner relation incompleteness.
5. Regenerate/read back architecture-awareness exports and run strict graph
   drift.

## Acceptance Criteria
- Web lib/i18n missing-doc top samples are mapped to canonical module docs.
- Repair table records owner/module/status/expected proof.
- Existing test evidence is not mislabeled as missing runtime coverage.
- Architecture-awareness readback and strict graph drift are recorded.
- No runtime/deploy/protected/secret/account/live-trading action occurs.

## Definition of Done
- [x] Stable shared Web doc-link rows are added.
- [x] `web-shared` module doc records the classification and proof boundary.
- [x] Architecture-awareness readback confirms the doc-link top samples moved
      out of top actionable missing docs.
- [x] Strict graph drift passes.
- [x] Paperclip issue is updated to `done` with evidence.

## Repair Table

| Sample group | Owner/module | Status | Expected proof |
| --- | --- | --- | --- |
| `apps/web/src/i18n/__fixtures__/guardrails.seed-regression.tsx`, `namespaceRegistry.ts`, `translations.ts`, `useLocaleFormatting.ts`, `useOptionalI18n.ts` | `web-shared` / frontend shared i18n | Documentation mapped; focused i18n tests and route-locale smoke already exist. | Keep i18n guardrail, namespace, translation parity, route locale smoke, provider, and formatting tests in `SOAR-TEST-WEB-RESIDUAL-SURFACES`; add tests only when behavior changes. |
| `apps/web/src/lib/api.ts`, `async.ts`, `errorResolver.ts`, `getAxiosMessage.ts`, `handleError.ts`, `navigation.ts`, `numericInput.ts`, `publicApiBaseUrl.ts` | `web-shared` / frontend shared utilities | Documentation mapped; colocated focused utility tests exist. | Keep focused tests in `SOAR-TEST-WEB-RESIDUAL-SURFACES`; scanner may still require direct relation generation for per-file test links. |
| `apps/web/src/lib/cloneNaming.ts`, `storage.ts`, `symbols.ts`, `text.ts`, `time.ts`, `forms.ts`, `marketStream.ts` | `web-shared` / frontend shared utilities | Documentation mapped; proof is aggregate or downstream where helper is integration-facing. | Treat aggregate proof as present but distinct from direct scanner relation coverage; add focused tests if helper semantics become independently risk-bearing. |
| `apps/web/src/security/themeBootstrap.ts` and `apps/web/src/ui/layout/dashboard/headerControlStyles.ts` | `web-shared` / dashboard shell utilities | Documentation mapped; `sharedWebUtilities.test.ts` covers persisted theme/locale bootstrap and stable header style helpers. | Keep as aggregate shell utility proof; no runtime/browser smoke is claimed. |
| `useDataTableColumnVisibilityState.ts`, `validationFeedback.ts`, `useDetailsDropdown.ts` | `web-shared` / shared UI helpers | Documentation mapped; focused/primitive tests exist. | Keep these in shared UI validation; remaining graph gaps are direct relation generation gaps, not current evidence gaps. |

## Validation Evidence
- Source readback:
  - `docs/architecture/relations/documentation-links.csv` now maps Web
    i18n/lib/helper samples to `docs/modules/web-shared.md`.
  - `docs/modules/web-shared.md` includes the LUC-2131 repair table with
    owner/module/status/expected proof.
- Graph:
  - `pnpm run architecture:graph:generate`
  - Result: PASS (`651` nodes / `842` relations / `27` chains).
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - Result: exports written and read back (`14237` entities / `22052`
    relations), but command process timed out at `120s` after printing the
    export summary.
  - Post-export report generated `2026-06-05T09:08:28.191Z` with raw missing
    docs `886`, actionable missing docs `148`, actionable missing tests `919`,
    classified noise `7377`, and disconnected entities `0`.
  - The normalized Web i18n/lib/helper rows no longer appear in top actionable
    missing doc-link samples; script/tooling rows are now the top missing-doc
    family.
  - `pnpm run architecture:graph:drift:strict`
  - Result: PASS (`822/822` covered, `0` missing).

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/architecture/registry/tests.csv`
  - `docs/modules/web-shared.md`
  - `history/tasks/luc-2123-classify-actionable-graph-missing-doc-test-links-2026-06-05-task.md`
- Fits approved architecture: yes.
- Mismatch discovered: no runtime architecture mismatch.
- Decision required from user: no.
- Follow-up architecture doc updates: script/tooling missing-doc samples remain
  tracked separately under [LUC-2132](/LUC/issues/LUC-2132).

## Result Report
- Task summary: normalized shared Web i18n/lib/helper direct documentation
  links and recorded the test-proof classification boundary.
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/modules/web-shared.md`
  - generated architecture-awareness graph/status exports
  - `history/tasks/luc-2131-normalize-web-lib-i18n-missing-doc-test-link-samples-2026-06-05-task.md`
- How tested:
  - graph generation passed;
  - architecture-awareness exports were written/read back despite scanner
    process timeout;
  - strict graph drift passed.
- What is incomplete:
  - remaining missing-test top samples are scanner/direct-relation
    incompleteness despite focused or aggregate test proof; no runtime defect
    was found in this docs lane.
  - script/tooling missing-doc family is outside this issue and remains with
    [LUC-2132](/LUC/issues/LUC-2132).
- Deployment impact: none.
- Runtime impact: none.
