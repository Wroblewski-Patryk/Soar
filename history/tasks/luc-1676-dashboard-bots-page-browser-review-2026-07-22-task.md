# Task

## Header
- ID: LUC-1676
- Title: Prove Dashboard overview needs-browser-review for src-app-dashboard-bots-page-tsx
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: high
- Iteration: 2026-07-22
- Operation Mode: BUILDER
- Mission ID: LUC-1676-DASHBOARD-BOTS-PAGE-BROWSER-REVIEW-2026-07-22
- Mission Status: VERIFIED

## Context
`docs/status/app-completion-index.md` still classifies
`apps/web/src/app/dashboard/bots/page.tsx` as a Dashboard overview
`needs_browser_review` row. The exact page already had same-day local
protected-route evidence inside the `LUC-1665` bots packet, but it did not yet
have its own narrow QA issue packet tied to the indexed source item.

## Goal
Produce inspectable exact browser-review evidence for
`apps/web/src/app/dashboard/bots/page.tsx` and record the result separately
from adjacent bot-route packets.

## Scope
- Reuse the existing focused route test for
  `apps/web/src/app/dashboard/bots/page.test.tsx`.
- Reuse the same-day local protected-route proof row already captured in
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`.
- Create the minimal QA task, evidence, state, and closeout packet for
  `LUC-1676`.
- Do not rerun broad generators, deploy flows, or runtime code changes.

## Constraints
- Local-only verification; no production login, deploy, or runtime mutation.
- No product/runtime code changes, schema changes, or broad generator refresh.
- Reuse existing approved proof systems only.
- Record the unauthenticated fail-closed row as guardrail evidence, not as a
  blocker against the authenticated page proof.

## Implementation Plan
1. Re-read the indexed source item and confirm the exact route file.
2. Run the focused bots-list page test in `apps/web`.
3. Read the exact same-day `SOAR-ACTION-VISIT-PAGE-BOTS-LIST` row from the
   existing `LUC-1665` protected-route artifact.
4. Record the route-specific outcome in task/state files and close the issue.

## Acceptance Criteria
- The exact source item `apps/web/src/app/dashboard/bots/page.tsx` is named in
  the packet.
- `src/app/dashboard/bots/page.test.tsx` passes and proves the list page keeps
  the create CTA wired to `/dashboard/bots/create`.
- The protected-route proof basis shows authenticated local-cookie access to
  `/dashboard/bots` passes and remains on `/dashboard/bots`.
- The closeout explains the paired unauthenticated fail-closed row separately
  from the authenticated success row.
- Fresh `history/tasks`, `history/evidence`, and Paperclip closeout files exist
  for `LUC-1676`.

## Definition of Done
- [x] Focused route test passed for the exact bots list page.
- [x] Exact browser-review proof is bound to the same-day local protected-route
  action row for `/dashboard/bots`.
- [x] QA state files now reference the correct source item and residual risk.
- [x] Paperclip issue disposition can be updated with completion evidence.

## Validation Evidence
- Command:
  `corepack pnpm --filter web exec vitest run src/app/dashboard/bots/page.test.tsx --reporter=verbose`
- Result:
  `PASS`; `1` file and `1` test passed.
- Command:
  `Get-Content history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json -Raw | ConvertFrom-Json | Select-Object -ExpandProperty routes | Where-Object { $_.actionId -eq 'SOAR-ACTION-VISIT-PAGE-BOTS-LIST' -and $_.route -eq '/dashboard/bots' }`
- Result:
  two exact rows were present on 2026-07-22: the unauthenticated guardrail row
  fails closed, and the authenticated local-cookie row passes with
  `observedPath=/dashboard/bots`. The authenticated pass row is the proof basis
  for the indexed page.
- Evidence:
  `history/tasks/luc-1676-dashboard-bots-page-browser-review-2026-07-22-task.md`;
  `history/evidence/luc-1676-dashboard-bots-page-browser-review-2026-07-22.md`;
  `history/artifacts/luc-1665-local-protected-route-action-proof-matrix-2026-07-22.json`;
  `history/artifacts/luc-1676-paperclip-closeout-2026-07-22.md`.

## Result Report
- Outcome:
  `apps/web/src/app/dashboard/bots/page.tsx` now has a dedicated `LUC-1676`
  QA packet tied to the exact indexed source item
  `route:page-tsx:0101cdb776`.
- Exact route proof:
  the focused page test passed, and the same-day authenticated protected-route
  row for `SOAR-ACTION-VISIT-PAGE-BOTS-LIST` passed on `/dashboard/bots` with
  `observedPath=/dashboard/bots`.
- Guardrail truth:
  the paired unauthenticated row fails closed to login as expected for a
  protected dashboard route and is not a blocker to the authenticated browser
  proof.
- Project Truth implication:
  this heartbeat produced the QA proof only. It did not refresh
  `docs/status/app-completion-index.*` or `docs/status/project-truth-index.*`,
  so generated truth can remain stale until a Documentation/Memory lane ingests
  the new packet.
- Files changed:
  `history/tasks/luc-1676-dashboard-bots-page-browser-review-2026-07-22-task.md`,
  `history/evidence/luc-1676-dashboard-bots-page-browser-review-2026-07-22.md`,
  `history/artifacts/luc-1676-paperclip-closeout-2026-07-22.md`,
  `.agents/state/active-mission.md`,
  `.agents/state/module-confidence-ledger.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Residual risk:
  generated app-completion/project-truth rows are not cleared by QA evidence
  alone. Next owner/action: Documentation/Memory should ingest the `LUC-1676`
  proof into the canonical generated-truth inputs for
  `apps/web/src/app/dashboard/bots/page.tsx`.
