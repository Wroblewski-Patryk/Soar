# Task

## Header
- ID: LUC-2123
- Title: [Soar][Architecture Repair][Docs] Classify actionable missing doc/test links from graph report
- Task Type: docs
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Priority: high
- Module Confidence Rows: `web-bots`; `web-strategies`; `web-shared`; Architecture Evidence Graph
- Requirement Rows: `REQ-DOC-029`, `REQ-DOC-030`
- Risk Rows: `RISK-DOC-005`
- Iteration: 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2123-ACTIONABLE-GRAPH-MISSING-DOC-TEST-LINKS-2026-06-05
- Mission Status: VERIFIED

## Context
The scoped Paperclip wake for [LUC-2123](/LUC/issues/LUC-2123) had no pending
comments and `fallbackFetchNeeded=false`; checkout was already claimed by the
harness and was not repeated.

The current `docs/status/architecture-awareness-report.md` snapshot was
generated at `2026-06-05T07:12:32.139Z` and reported:
- raw missing tests `7714`;
- actionable missing tests `919`;
- raw missing docs `940`;
- actionable missing docs `197`;
- classified inferred-link noise `7377`;
- disconnected entities `0`.

## Goal
Classify the top actionable missing doc/test samples into concrete follow-up
types and normalize the stable doc-link rows that Docs Memory can safely own.

## Scope
- `docs/status/architecture-awareness-report.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/modules/web-bots.md`
- `docs/modules/web-strategies.md`
- `docs/modules/web-shared.md`
- local evidence/state updates for this issue

Runtime behavior, route behavior, API behavior, database, deploy, protected
production smoke, account mutation, secrets, exchange mutation, and LIVE trading
were out of scope.

## Implementation Plan
1. Read the current architecture-awareness report and top missing doc/test
   samples.
2. Compare top sampled files against module docs, graph test nodes, and local
   sibling tests.
3. Add direct `documentation-links.csv` rows for stable top doc-link samples
   owned by `web-bots`, `web-strategies`, and `web-shared`.
4. Record module-level classification and next owner for remaining test-relation
   gaps.
5. Regenerate graph/status artifacts and run strict graph drift.

## Acceptance Criteria
- Top sampled missing-doc clusters are classified by module and next owner.
- Stable Docs Memory-owned direct doc links are added.
- Remaining test-link signals are not mislabeled as missing runtime proof.
- Graph generation and strict drift pass, or exact blocker is recorded.
- No runtime/deploy/protected/secret/account/live-trading action occurs.

## Definition of Done
- Classification exists in a durable task artifact.
- Relevant module docs are updated.
- Graph relation source is updated for direct doc-link closures.
- Verification evidence is recorded.
- Paperclip issue is updated to `done` with evidence.

## Classification

| Cluster | Sampled report rows | Current evidence | Classification | Next owner |
| --- | --- | --- | --- | --- |
| Bot runtime utility docs | `runtimeOpenPositionDerivations.ts`; `runtimeSignalLabelKeys.ts`; `runtimeSurfaceTruth.ts`; `trailingStopDisplay.ts` | `docs/modules/web-bots.md`; `SOAR-TEST-BOT-RUNTIME-WEB`; `SOAR-TEST-WEB-RESIDUAL-SURFACES`; sibling tests for each sampled utility. | True doc-link gap closed by `documentation-links.csv`; test evidence already present. | Docs Memory owns current doc links; Test Automation only if behavior changes. |
| Shared runtime helper docs | `dcaLadderCell.tsx`; `runtimeMonitoringFormatters.ts` | `docs/modules/web-shared.md`; `dcaLadderCell.test.tsx`; `runtimeMonitoringFormatters.test.ts`; downstream runtime presenter tests. | True doc-link gap closed by `documentation-links.csv`; test evidence already present. | Docs Memory owns current doc links. |
| Strategy utility docs | `indicatorPresentation.ts`; `indicatorTaxonomy.ts`; `strategyThresholdItems.ts` | `docs/modules/web-strategies.md`; `SOAR-TEST-STRATEGY-FORM-UTILS`; direct tests for indicator presentation/taxonomy. | True doc-link gap closed by `documentation-links.csv`; `strategyThresholdItems.ts` remains a low-risk test-relation candidate, not a product behavior defect. | Docs Memory owns doc links; Test Automation can add direct threshold-item proof if scanner closure is required. |
| Shared UI missing-test samples | `DataTable.tsx`; form primitives; layout primitives; `FooterPreferencesSwitchers.tsx`; `ProfileButton.tsx` | [LUC-2106](/LUC/issues/LUC-2106) classified and locally verified focused shared UI tests (`17` files / `98` tests), closing direct primitive gaps for footer preferences and profile button. | Already classified; remaining signal is scanner/direct relation incompleteness. | Docs Memory / Architecture Graph for direct relation promotion only. |
| Web lib/i18n utility doc/test samples | `api.ts`; `forms.ts`; `marketStream.ts`; i18n helper files | Aggregate proof exists under `SOAR-TEST-WEB-RESIDUAL-SURFACES`; module ownership is split across shared Web utility and route/integration docs. | Follow-up classification candidate; not enough scope in this heartbeat to normalize without risking broad ownership drift. | Docs Memory should open a separate Web utility/i18n doc-link normalization issue if these remain top samples after this refresh. |
| Script/tooling doc/test samples | `scripts/audit*.mjs`; `scripts/build*.mjs`; `scripts/check*.mjs`; `vitest.setup.ts`; `libs/shared/index.d.ts` | Many are release/audit tooling or generated environment support with existing aggregate docs/tests; ownership spans Ops, QA, and Docs Memory. | Follow-up classification candidate; avoid bulk linking to the wrong canonical doc. | Docs Memory + QA/Ops should classify by tool family before adding doc/test relations. |

## Follow-Up Child Issues

- [LUC-2131](/LUC/issues/LUC-2131): normalize Web lib and i18n missing
  doc/test link samples.
- [LUC-2132](/LUC/issues/LUC-2132): classify script and tooling missing
  doc/test link samples.

## Validation Evidence
- Report readback:
  - `docs/status/architecture-awareness-report.md` inspected.
  - Pre-change report generated `2026-06-05T07:12:32.139Z`.
  - Post-change scanner readback generated `2026-06-05T08:56:49.581Z` with
    raw missing docs `931`, actionable missing docs `188`, actionable missing
    tests `919`, classified noise `7377`, and disconnected entities `0`.
  - The normalized bot runtime, shared runtime helper, and strategy utility
    rows no longer appear in top actionable missing doc-link samples.
- Graph:
  - `pnpm run architecture:graph:generate`
  - Result: PASS (`651` nodes / `842` relations / `27` chains).
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  - Result: PASS (`14229` entities / `21993` relations).
  - `pnpm run architecture:graph:drift:strict`
  - Result: PASS (`822/822` covered, `0` missing).
- Source checks:
  - `docs/architecture/relations/documentation-links.csv` updated for `9` top doc-link sample rows.
  - `docs/modules/web-bots.md`, `docs/modules/web-strategies.md`, and `docs/modules/web-shared.md` updated with classification.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/graphs/architecture-awareness.json`
  - `docs/architecture/registry/tests.csv`
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/modules/web-bots.md`
  - `docs/modules/web-strategies.md`
  - `docs/modules/web-shared.md`
- Fits approved architecture: yes.
- Mismatch discovered: no runtime architecture mismatch; remaining signal is direct scanner relation incompleteness for some tested utilities and broad tooling families.
- Decision required from user: no.

## Result Report
- Task summary: classified top actionable missing doc/test samples from the graph report and normalized direct documentation links for stable Web runtime/shared/strategy utility files.
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/modules/web-bots.md`
  - `docs/modules/web-strategies.md`
  - `docs/modules/web-shared.md`
  - `history/tasks/luc-2123-classify-actionable-graph-missing-doc-test-links-2026-06-05-task.md`
- How tested:
  - architecture graph generation passed (`651` nodes / `842` relations / `27` chains);
  - architecture-awareness scanner refresh passed (`14229` entities / `21993` relations);
  - strict architecture graph drift passed (`822/822`, `0` missing).
- What is incomplete:
  - web lib/i18n utilities and script/tooling samples remain outside this issue because ownership spans multiple modules and should not be bulk-linked blindly; follow-up child issues [LUC-2131](/LUC/issues/LUC-2131) and [LUC-2132](/LUC/issues/LUC-2132) were created.
  - some test-link signals remain scanner/direct-relation incompleteness despite existing aggregate proof.
- Deployment impact: none.
- Runtime impact: none.
