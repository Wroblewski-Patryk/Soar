# LUC-2631 Web PWA Service Worker Missing-Test Links

## Header
- ID: LUC-2631
- Title: [Soar][Frontend][LUC-2628] Cover Web PWA/service-worker missing-test links
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Priority: P1
- Mission ID: LUC-2631-WEB-PWA-SERVICE-WORKER-MISSING-TEST-LINKS-2026-06-07
- Mission Status: VERIFIED

## Context
The 2026-06-07 architecture-awareness report exposed Web PWA/service-worker
registration helpers as actionable missing-test links after earlier Web
relation repairs. This lane is scoped to local Web proof and scanner-readable
relation rows only.

Baseline dirty-state before this lane was broad and pre-existing. This lane did
not revert, stage, or modify unrelated work. The scoped changes were
`ServiceWorkerRegistration.test.tsx` and `docs/architecture/relations/priority-test-links.csv`.

## Goal
Add focused local Web proof and direct scanner-readable test links for the
assigned PWA/service-worker anchors without changing production runtime
behavior.

## Scope
- `apps/web/src/ui/pwa/ServiceWorkerRegistration.test.tsx`
- `apps/web/src/ui/pwa/serviceWorkerCacheContract.test.ts`
- `docs/architecture/relations/priority-test-links.csv`

## Implementation Plan
1. Inspect the current architecture-awareness report and existing PWA tests.
2. Add focused service-worker registration proof for the install/updatefound
   activation handoff.
3. Map existing PWA build-version, cache purge, visibility, focus, controller,
   and update-check proof through direct `LUC-2631` relation rows.
4. Run focused Web PWA tests, architecture graph generation, and repository
   guardrails.

## Acceptance Criteria
- Focused PWA tests cover service-worker registration/update behavior.
- `priority-test-links.csv` contains direct `LUC-2631` rows for the assigned
  service-worker registration anchors.
- Focused Web proof passes.
- Architecture graph generation and guardrails pass.
- No deploy, push, restart, production smoke, account, secret, exchange,
  database, or live-trading mutation occurs.

## Definition of Done
- Implemented and verified locally.
- Source-of-truth task/state files updated.
- Paperclip issue closure records files, tests, commit/push/deploy status,
  residual risk, and next owner.

## Validation Evidence
- Tests: `corepack pnpm --filter web exec vitest run src/ui/pwa/ServiceWorkerRegistration.test.tsx src/ui/pwa/serviceWorkerCacheContract.test.ts` -> PASS (`2` files / `8` tests).
- Architecture graph: `corepack pnpm run architecture:graph:generate` -> PASS (`653` nodes / `842` relations / `27` chains).
- Guardrails: `corepack pnpm run quality:guardrails` -> PASS.
- Architecture-awareness refresh: not run; `scripts/build-architecture-awareness-index.mjs` and `scripts/generateArchitectureAwarenessIndex.mjs` are absent in this checkout.
- Reality status: verified local proof and scanner traceability; refreshed top-sample removal not claimed.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/graphs/architecture-awareness.csv`, and
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none beyond direct relation rows.

## UX/UI Evidence
- Design source type: not applicable.
- Existing shared pattern reused: existing Web Vitest/jsdom PWA test harness.
- Required states: service-worker registration, update, cache purge, and
  activation handoff behavior only.
- Responsive checks: not applicable.
- Accessibility checks: not applicable.
- Parity evidence: no visual target; this is architecture traceability and
  local regression proof.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the test/relation rows if needed; no runtime code
  changed.

## Autonomous Loop Evidence
1. Analyze current state: reviewed active mission, next steps, task board,
   current architecture-awareness PWA/service-worker rows, and existing PWA
   tests.
2. Select one priority mission objective: `LUC-2631` scoped local Web proof for
   PWA/service-worker missing-test links.
3. Plan implementation: add one focused activation-handoff assertion and direct
   relation rows.
4. Execute implementation: extended `ServiceWorkerRegistration.test.tsx` and
   `priority-test-links.csv`.
5. Verify and test: focused Web PWA Vitest, architecture graph generation, and
   guardrails all passed.
6. Self-review: no production code change; reused existing tests; no workaround
   or duplicate runtime path introduced.
7. Update documentation and knowledge: task packet plus state/context updates
   record evidence and residual risk.

## Result Report
- Task summary: Added focused local proof for service-worker install/updatefound
  activation handoff and direct scanner-readable `LUC-2631` rows for Web
  PWA/service-worker registration anchors.
- Files changed: `apps/web/src/ui/pwa/ServiceWorkerRegistration.test.tsx`,
  `docs/architecture/relations/priority-test-links.csv`, this task packet, and
  related state/context files.
- How tested: focused Web PWA Vitest (`2` files / `8` tests), architecture
  graph generation, and repository guardrails.
- What is incomplete: exact architecture-awareness top-sample removal was not
  proven because the local awareness builder script is absent.
- Next steps: treat this lane complete unless a future refreshed
  architecture-awareness report reintroduces concrete missing-test rows for the
  same PWA/service-worker anchors.
- Decisions made: no commit/push/deploy due to broad pre-existing dirty
  worktree outside this issue.
