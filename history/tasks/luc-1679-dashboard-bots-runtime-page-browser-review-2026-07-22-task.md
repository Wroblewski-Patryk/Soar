# Task

## Header
- ID: LUC-1679
- Title: Prove Dashboard overview needs-browser-review for app-dashboard-bots-runtime-page-tsx
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: high
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1679-DASHBOARD-BOTS-RUNTIME-PAGE-BROWSER-REVIEW-2026-07-22
- Mission Status: VERIFIED

## Context
`docs/status/app-completion-index.md` still classifies
`apps/web/src/app/dashboard/bots/runtime/page.tsx` as a Dashboard overview
`needs_browser_review` row. The exact legacy runtime helper route already had
same-day protected-route evidence in the `LUC-1665` bots packet, but it did
not yet have its own narrow QA issue packet tied to the indexed source item.

## Goal
Produce inspectable exact browser-review evidence for
`apps/web/src/app/dashboard/bots/runtime/page.tsx` and record the result as a
separate QA packet.

## Scope
- Reuse the existing focused route test for
  `apps/web/src/app/dashboard/bots/runtime/page.test.tsx`.
- Reuse the same-day local protected-route proof row already captured in
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`.
- Create the minimal QA task, evidence, state, and closeout packet for
  `LUC-1679`.
- Do not rerun broad generators, deploy flows, or runtime code changes.

## Constraints
- Local-only verification; no production login, deploy, or runtime mutation.
- No product/runtime code changes, schema changes, or broad generator refresh.
- Reuse existing approved proof systems only.
- Treat this helper route as a redirect alias: exact proof must show the route
  is reachable under the protected cookie gate and resolves to the canonical
  `/dashboard/bots` surface.

## Implementation Plan
1. Re-read the indexed source item and confirm the redirect branches.
2. Run the focused runtime helper page test in `apps/web`.
3. Read the exact same-day `SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME` row from the
   existing `LUC-1665` protected-route artifact.
4. Record the route-specific outcome in task/state files and close the issue.

## Acceptance Criteria
- The exact source item `apps/web/src/app/dashboard/bots/runtime/page.tsx` is
  named in the packet.
- `src/app/dashboard/bots/runtime/page.test.tsx` passes and proves the helper
  route keeps its redirect contract for `botId`, no-query, and legacy runtime
  tab paths.
- The protected-route proof basis shows authenticated local-cookie access to
  `/dashboard/bots/runtime` passes and resolves to `/dashboard/bots`.
- Fresh `history/tasks`, `history/evidence`, and Paperclip closeout files exist
  for `LUC-1679`.

## Definition of Done
- [x] Focused route test passed for the exact runtime helper page.
- [x] Exact browser-review proof is bound to the same-day local protected-route
  action row for `/dashboard/bots/runtime`.
- [x] QA state files now reference the correct source item and residual risk.
- [x] Paperclip issue disposition can be updated with completion evidence.

## Validation Evidence
- Command:
  `corepack pnpm --filter web exec vitest run src/app/dashboard/bots/runtime/page.test.tsx --reporter=verbose`
- Result:
  `PASS`; `1` file and `4` tests passed.
- Command:
  `Get-Content history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json -Raw | ConvertFrom-Json | Select-Object -ExpandProperty routes | Where-Object { $_.actionId -eq 'SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME' -and $_.route -eq '/dashboard/bots/runtime' }`
- Result:
  the exact same-day authenticated row was present on 2026-07-22 with
  `result=PASS`, `observedPath=/dashboard/bots`, and note
  `redirect reached expected bots route with local cookie gate`.
- Evidence:
  `history/tasks/luc-1679-dashboard-bots-runtime-page-browser-review-2026-07-22-task.md`;
  `history/evidence/luc-1679-dashboard-bots-runtime-page-browser-review-2026-07-22.md`;
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`;
  `history/artifacts/luc-1679-paperclip-closeout-2026-07-22.md`.

## Result Report
- Outcome:
  `apps/web/src/app/dashboard/bots/runtime/page.tsx` now has a dedicated
  `LUC-1679` QA packet tied to the exact indexed source item
  `route:page-tsx:02f88c4a44`.
- Exact route proof:
  the focused page test passed, and the same-day authenticated protected-route
  row for `SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME` passed on
  `/dashboard/bots/runtime` with `observedPath=/dashboard/bots`.
- Route behavior proved:
  the helper route redirects `botId` to canonical preview, redirects legacy
  `orders` and `positions` queries into dashboard home anchor tabs, and falls
  back to `/dashboard/bots` when no query is provided.
- Project Truth implication:
  this heartbeat produced the QA proof only. It did not refresh
  `docs/status/app-completion-index.*` or `docs/status/project-truth-index.*`,
  so generated truth can remain stale until a Documentation/Memory lane ingests
  the new packet.
- Files changed:
  `history/tasks/luc-1679-dashboard-bots-runtime-page-browser-review-2026-07-22-task.md`,
  `history/evidence/luc-1679-dashboard-bots-runtime-page-browser-review-2026-07-22.md`,
  `history/artifacts/luc-1679-paperclip-closeout-2026-07-22.md`,
  `.agents/state/active-mission.md`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Residual risk:
  generated app-completion/project-truth rows are not cleared by QA evidence
  alone. Next owner/action: Documentation/Memory should ingest the `LUC-1679`
  proof into the canonical generated-truth inputs for
  `apps/web/src/app/dashboard/bots/runtime/page.tsx`.
