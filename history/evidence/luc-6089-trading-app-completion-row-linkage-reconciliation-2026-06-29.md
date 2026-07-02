# LUC-6089 Trading App-Completion Row-Linkage Reconciliation

Date: 2026-06-29
Owner: 04 DSM (Documentation Steward)
Reality status: verified documentation reconciliation; scanner taxonomy follow-up routed

## Scope

Reconciled the app-completion row-linkage result after [LUC-6086](/LUC/issues/LUC-6086)
proved the no-live Trading operation `HomeLiveWidgets` behavior packet.

Explicit exclusions stayed closed: no product code, app-completion generator
code, architecture scanner code, production mutation, deploy, push, restart,
secret/account readback, exchange/payment mutation, order, position, or
live-trading action.

## Evidence Readback

- [LUC-6086](/LUC/issues/LUC-6086) focused Web proof passed `5` files / `58`
  tests for the split `HomeLiveWidgets` packet.
- `history/artifacts/luc-6004-trading-operation-app-completion-drilldown-2026-06-28.json`
  parsed successfully with `219` Trading operation rows:
  - `140` `needs_browser_review`
  - `44` `missing_doc_link`
  - `28` `missing_test_link`
  - `7` `implemented_needs_proof`
- Name search across the `219` row objects found `0` direct rows for
  `HomeLiveWidgets` or `runtimeDataTablePresenters`.
- `history/artifacts/luc-6074-app-completion-residual-worker-proof-lanes-2026-06-28.json`
  correctly instructed workers to map closed proof to exact app-completion row
  IDs and not claim broad closure.

## Reconciliation Decision

Direct row-id closure remains `0` for [LUC-6086](/LUC/issues/LUC-6086). The
proof is valid behavior evidence, but the current row taxonomy does not expose
the verified Web component/presenter paths as closable app-completion rows.

The remaining Trading operation app-completion posture is therefore:

- `137` browser-review rows still require row-level burn-down or taxonomy repair.
- `44` missing-doc-link rows remain docs-link work.
- `28` missing-test-link rows remain test-link work.
- No Frontend repair issue is needed from this slice because QVE reproduced no
  UI defect.

## Taxonomy Finding

The current `needs_browser_review` Trading rows include backend/API scripts and
services typed as `route` / `screen_or_route` with browser proof flags, for
example `apps/api/src/modules/bots/botActivationPolicy.service.ts`. That shape
is not safe to close with a browser screenshot or `HomeLiveWidgets` component
test. It should be handled as scanner taxonomy/linkage work before additional
row-id closure is claimed.

Recommended owner path:

1. DSM/QA may continue exact row closure only for rows that directly reference
   verified Web route/component/presenter paths.
2. TSA/Docs should repair or reclassify backend support rows currently typed
   as browser-review rows before more Trading browser backlog is claimed.
3. CBE/QA should own backend API/support rows that need contract tests or docs,
   not browser screenshots.

## Verification

Read-only checks performed:

```text
node parse LUC-6004 drilldown row counts and name hits
-> PASS: rows=219, hits(HomeLiveWidgets/runtimeDataTablePresenters)=0

node read LUC-6074 worker packet
-> PASS: LUC-6074-TD-BROWSER-01 residual counts and proof instructions present

rg LUC-6086/HomeLiveWidgets/runtimeDataTablePresenters across source truth
-> PASS: current state already records row-linkage closure limitation
```

## Source-Control And Runtime Closure

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Files changed by this lane: evidence/task/state documentation only.
- Commit SHA: not committed.
- Reason not committed: shared `main` is pre-existing mixed dirty/divergent
  (`ahead 16, behind 2`) with many unrelated modified/untracked rows owned by
  other active lanes.
- Push status: not needed.
- Deploy impact: none.
- Runtime process impact: none; no server, browser, Docker service, or watcher
  was started.

## Follow-Up

[LUC-6089](/LUC/issues/LUC-6089) can close as documentation reconciliation.
Create a TSA/scanner follow-up only if the board wants the taxonomy repaired in
code. Until then, future workers must not claim Trading row-id closure from
aggregate `HomeLiveWidgets` behavior proof unless exact row IDs are present.
