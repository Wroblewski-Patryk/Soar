# Task

## Header
- ID: LUC-1650
- Title: Prove Dashboard overview needs-browser-review for page-tsx
- Task Type: research
- Current Stage: verification
- Status: IN_REVIEW
- Owner: QA/Test
- Priority: high
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1650-DASHBOARD-BOT-ASSISTANT-PAGE-BROWSER-REVIEW-2026-07-22
- Mission Status: VERIFIED

## Context
Board verification rejected the prior `LUC-1650` packet because it proved the
generic `/dashboard` shell instead of the exact Project Truth source item
`route:page-tsx:58248c9afe` ->
`apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx`. This heartbeat
refreshes evidence only for that dynamic assistant route.

## Goal
Produce inspectable local browser-review evidence for
`apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx` and explain how the
exact row becomes evidence-backed for the next Project Truth refresh.

## Scope
- Reuse the existing focused route test for
  `apps/web/src/app/dashboard/bots/[id]/assistant/page.test.tsx`.
- Reuse the existing local protected-route proof runner for the `bots`
  cluster in dynamic-fixture mode.
- Generate fresh Markdown and JSON artifacts for `LUC-1650`.
- Update the minimal source-of-truth files that describe this verification.

## Constraints
- Local-only verification; no production login, deploy, or runtime mutation.
- No product/runtime code changes, schema changes, or broad generator refresh.
- Reuse existing approved proof systems only.
- Record the aggregate harness status truthfully even if unrelated cluster rows
  stay red.

## Implementation Plan
1. Re-read the indexed source item and confirm the exact route file.
2. Run the focused assistant-route test in `apps/web`.
3. Run `scripts/runLocalProtectedRouteActionProof.mjs` for the `bots` cluster
   with dynamic fixtures and fixture API interception enabled.
4. Record the exact assistant-route action result, separate it from unrelated
   cluster failures, and update the QA packet/state.

## Acceptance Criteria
- The exact source item `apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx`
  is named in the packet.
- `src/app/dashboard/bots/[id]/assistant/page.test.tsx` passes and proves the
  route-specific visible state: localized assistant breadcrumbs plus
  `BotsManagement` locked to the assistant tab with the selected bot id.
- The protected-route harness proves
  `/dashboard/bots/luc-2188-bot/assistant` stays on that exact route with a
  synthetic authenticated session.
- The closeout explains any non-target cluster failures instead of treating the
  aggregate status as route failure.
- Fresh `history/evidence` and `history/artifacts` files exist for `LUC-1650`.

## Definition of Done
- [x] Focused route test passed for the exact assistant page.
- [x] Fresh local browser-proof packet exists under `LUC-1650`.
- [x] The exact assistant action row is called out as `PASS`.
- [x] QA state files now reference the correct source item.
- [x] Paperclip issue disposition updated with corrected completion evidence.

## Validation Evidence
- Command:
  `pnpm --filter web exec vitest run src/app/dashboard/bots/[id]/assistant/page.test.tsx --reporter=verbose`
- Result:
  `PASS`; `1` file and `1` test passed.
- Command:
  `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1650 --today 2026-07-22 --clusters bots --dynamic-fixtures-only --intercept-fixture-api --output-json history/artifacts/luc-1650-local-protected-route-action-proof-matrix-2026-07-22.json --output-md history/evidence/luc-1650-local-protected-route-action-proof-matrix-2026-07-22.md`
- Result:
  aggregate `FAIL`; the exact target action
  `SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT` passed with `200` on
  `/dashboard/bots/luc-2188-bot/assistant`. The aggregate remained red because
  the cluster still records `SOAR-ACTION-VISIT-PAGE-BOTS-LIST` as the expected
  unauthenticated fail-closed guardrail and `SOAR-ACTION-VISIT-PAGE-BOT-CREATE`
  did not navigate in this run.
- Evidence:
  `history/evidence/luc-1650-local-protected-route-action-proof-matrix-2026-07-22.md`;
  `history/artifacts/luc-1650-local-protected-route-action-proof-matrix-2026-07-22.json`.

## Result Report
- Outcome:
  `apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx` now has a fresh
  `LUC-1650` proof packet tied to the exact indexed source item
  `route:page-tsx:58248c9afe`, and the follow-up doc relation cleared the
  remaining `missing_doc_link` gap for the route.
- Exact route proof:
  the focused route test proves the visible success state, and the protected
  route harness proves the synthetic authenticated route remains on
  `/dashboard/bots/luc-2188-bot/assistant`.
- Project Truth implication:
  after the truth-index refresh, this row is no longer a
  `needs_browser_review` gap, `appCompletionGaps` dropped from `51` to `50`,
  and `totalGaps` dropped from `51` to `50`.
- Files changed:
  `history/tasks/luc-1650-dashboard-overview-page-browser-review-2026-07-22-task.md`,
  `history/evidence/luc-1650-local-protected-route-action-proof-matrix-2026-07-22.md`,
  `history/artifacts/luc-1650-local-protected-route-action-proof-matrix-2026-07-22.json`,
  `.agents/state/active-mission.md`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Residual risk:
  the exact target route is evidence-backed, but the broader bots cluster
  packet still contains unrelated red rows. If a truth refresh expects a
  cluster-wide green aggregate rather than route-level proof, that policy needs
  explicit clarification or a narrower harness mode.
