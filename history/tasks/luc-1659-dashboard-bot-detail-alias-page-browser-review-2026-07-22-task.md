# Task

## Header
- ID: LUC-1659
- Title: Prove Dashboard overview needs-browser-review for page-tsx
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: high
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1659-DASHBOARD-BOT-DETAIL-ALIAS-PAGE-BROWSER-REVIEW-2026-07-22
- Mission Status: VERIFIED

## Context
The active Dashboard overview app-completion queue still lists the exact source
item `route:page-tsx:256cdda64e` ->
`apps/web/src/app/dashboard/bots/[id]/page.tsx` as `needs_browser_review`.
This route is a redirect-only alias that should send `/dashboard/bots/:id` to
the canonical preview route. The QA heartbeat needed fresh route-specific proof
under `LUC-1659`, not a broader dashboard proof packet.

## Goal
Produce inspectable local browser-review evidence for
`apps/web/src/app/dashboard/bots/[id]/page.tsx` and record the exact route
result separately from unrelated mixed rows inside the aggregate bots cluster.

## Scope
- Reuse the existing focused route test for
  `apps/web/src/app/dashboard/bots/[id]/page.test.tsx`.
- Reuse the existing local protected-route proof runner for the `bots`
  cluster in dynamic-fixture mode.
- Generate fresh Markdown and JSON artifacts for `LUC-1659`.
- Update the minimal QA state files that describe this verification.

## Constraints
- Local-only verification; no production login, deploy, or runtime mutation.
- No product/runtime code changes, schema changes, or broad generator refresh.
- Reuse existing approved proof systems only.
- Record the aggregate harness status truthfully even if unrelated cluster rows
  stay red.

## Implementation Plan
1. Re-read the indexed source item and confirm the exact route file.
2. Run the focused detail-alias route test in `apps/web`.
3. Run `scripts/runLocalProtectedRouteActionProof.mjs` for the `bots` cluster
   with dynamic fixtures and fixture API interception enabled.
4. Record the exact alias-route action result, separate it from unrelated
   cluster failures, and update the QA packet/state.

## Acceptance Criteria
- The exact source item `apps/web/src/app/dashboard/bots/[id]/page.tsx` is
  named in the packet.
- `src/app/dashboard/bots/[id]/page.test.tsx` passes and proves the redirect to
  `/dashboard/bots/:id/preview`.
- The protected-route harness proves `/dashboard/bots/luc-2188-bot` redirects
  to `/dashboard/bots/luc-2188-bot/preview` with the expected HTTP result.
- The closeout explains any non-target cluster failures instead of treating the
  aggregate status as route failure.
- Fresh `history/evidence` and `history/artifacts` files exist for `LUC-1659`.

## Definition of Done
- [x] Focused route test passed for the exact bot detail alias page.
- [x] Fresh local browser-proof packet exists under `LUC-1659`.
- [x] The exact alias action row is called out as `PASS`.
- [x] QA state files now reference the correct source item and residual.
- [x] Paperclip issue disposition updated with completion evidence.

## Validation Evidence
- Command:
  `pnpm --filter web exec vitest run src/app/dashboard/bots/[id]/page.test.tsx --reporter=verbose`
- Result:
  `PASS`; `1` file and `1` test passed.
- Command:
  `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1659 --today 2026-07-22 --clusters bots --dynamic-fixtures-only --intercept-fixture-api --output-json history/artifacts/luc-1659-local-protected-route-action-proof-matrix-2026-07-22.json --output-md history/evidence/luc-1659-local-protected-route-action-proof-matrix-2026-07-22.md`
- Result:
  aggregate `FAIL`; the exact target action
  `SOAR-ACTION-VISIT-PAGE-BOT-DETAIL-ALIAS` passed with `307` on
  `/dashboard/bots/luc-2188-bot` and resolved to
  `/dashboard/bots/luc-2188-bot/preview`. The aggregate remained red because
  the cluster still records `SOAR-ACTION-VISIT-PAGE-BOTS-LIST` as failing in
  the unauthenticated check and the non-target create CTA did not navigate in
  this run.
- Evidence:
  `history/evidence/luc-1659-local-protected-route-action-proof-matrix-2026-07-22.md`;
  `history/artifacts/luc-1659-local-protected-route-action-proof-matrix-2026-07-22.json`.

## Result Report
- Outcome:
  `apps/web/src/app/dashboard/bots/[id]/page.tsx` now has a fresh `LUC-1659`
  proof packet tied to the exact indexed source item
  `route:page-tsx:256cdda64e`.
- Exact route proof:
  the focused route test proves the redirect contract, and the protected route
  harness proves the synthetic authenticated detail alias resolves to
  `/dashboard/bots/luc-2188-bot/preview`.
- Project Truth implication:
  this heartbeat produced the QA proof only. It did not refresh
  `docs/status/app-completion-index.*` or `docs/status/project-truth-index.*`,
  so generated truth can remain stale until a documentation/truth-ingestion
  lane consumes the new route proof.
- Files changed:
  `history/tasks/luc-1659-dashboard-bot-detail-alias-page-browser-review-2026-07-22-task.md`,
  `history/evidence/luc-1659-local-protected-route-action-proof-matrix-2026-07-22.md`,
  `history/artifacts/luc-1659-local-protected-route-action-proof-matrix-2026-07-22.json`,
  `history/artifacts/luc-1659-paperclip-closeout-2026-07-22.md`,
  `.agents/state/active-mission.md`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Residual risk:
  the exact target route is evidence-backed locally, but the generated
  app-completion/project-truth rows are not cleared by QA evidence alone.
  Next owner/action: Documentation/Memory should ingest the `LUC-1659` proof
  into scanner overrides or equivalent generated-truth inputs and rerun the
  canonical generator chain for `route:page-tsx:256cdda64e`.
