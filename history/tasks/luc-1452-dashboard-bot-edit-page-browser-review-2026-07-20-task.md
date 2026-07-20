# Task

## Header
- ID: LUC-1452
- Title: Capture dashboard bot edit page proof or exact FE/UX repair lane
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: UI Visual Designer
- Priority: high
- Module Confidence Rows: not updated
- Requirement Rows: not updated
- Quality Scenario Rows: not updated
- Risk Rows: not updated
- Iteration: 2026-07-20
- Operation Mode: BUILDER
- Mission ID: LUC-1452-DASHBOARD-BOT-EDIT-PAGE-BROWSER-REVIEW-2026-07-20
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective:
  capture a visible-flow/browser walkthrough proof for
  `apps/web/src/app/dashboard/bots/[id]/edit/page.tsx`, or return the
  smallest truthful FE/UX repair lane if the route could not be proven.
- Release objective advanced:
  the bot edit page now has an attached local visible-flow proof packet that
  isolates the exact edit route from the broader bot cluster.
- Included slices:
  local protected-route proof run, route-level matrix readback, durable
  evidence packet, and truth-note refresh.
- Explicit exclusions:
  product redesign, code changes, live mutation, deploy, or unrelated bot
  routes beyond the edit proof context.
- Checkpoint cadence:
  single verification heartbeat.
- Stop conditions:
  the edit route proof is captured and the issue can be closed with concrete
  evidence, or the exact FE/UX repair lane is named.
- Handoff expectation:
  if the edit route itself failed, hand off the smallest exact route/file fix.

## Context
The issue points at the bot edit page route file
`apps/web/src/app/dashboard/bots/[id]/edit/page.tsx` and asks for either a
visible-flow walkthrough or the smallest exact repair packet.

## Goal
Prove the bot edit page route is reachable and capture the route-level visible
flow evidence without expanding into unrelated bot work.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] The bot edit route was exercised in a local browser proof matrix.
- [x] Evidence and project state reflect the proof outcome.
- [x] The issue can be closed with concrete proof references.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Browser proof:
  `node scripts/runLocalProtectedRouteActionProof.mjs --issue LUC-1452 --today 2026-07-20 --clusters bots --dynamic-fixtures-only --intercept-fixture-api --output-json .tmp\luc-1452-bot-edit-proof.json --output-md .tmp\luc-1452-bot-edit-proof.md`
  -> route-level proof PASS for
  `SOAR-ACTION-VISIT-PAGE-BOT-EDIT` on
  `/dashboard/bots/luc-2188-bot/edit`; overall harness status remained FAIL
  because the runner still includes the built-in unauthenticated bots-list
  fail-closed check and the bots create-button subcheck.
- Route readback:
  `apps/web/src/app/dashboard/bots/[id]/edit/page.test.tsx` passes the edit
  page contract for the canonical route.
- High-risk checks:
  no production login, no real account mutation, no exchange action, no deploy.
- Module confidence ledger updated: no
- Requirements matrix updated: no
- Quality scenarios updated: no
- Risk register updated: no
- Reality status: verified local visible-flow proof for the route file

## UX/UI Evidence
- Design source reference:
  `docs/architecture/nodes/SOAR-PAGE-BOT-EDIT.md`;
  `docs/modules/web-bots.md`.
- Required states:
  loading, error, success, and protected navigation are covered by existing
  route/component tests; this heartbeat captured the success-state route
  walkthrough only.
- Responsive checks:
  not expanded in this heartbeat; the task stayed on route-level browser
  reachability.
- Accessibility checks:
  existing focused route test coverage remains the proof anchor; no new a11y
  regression was introduced or observed in the walkthrough.
- Input-mode evidence:
  pointer/browser navigation only; no submit or mutation interaction ran.

## Result Report
- The exact bot edit route was reachable and returned `200` in the local
  browser proof matrix.
- The proof packet is intentionally narrow: it proves the requested edit
  route, while the harness's unrelated built-in unauthenticated list check
  still reports `FAIL` in the aggregate matrix.
- Because the route itself passed, no FE/UX repair lane was required for this
  heartbeat.

