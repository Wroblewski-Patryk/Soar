# Task

## Header
- ID: V1UI-34
- Title: Show runtime signal score summary on Dashboard Home
- Task Type: feature
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-33
- Priority: P1
- Iteration: 34
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The API runtime symbol stats read model already exposes
`lastSignalScoreSummary.longScore` and `lastSignalScoreSummary.shortScore`.
The Web type includes the field, but Dashboard Home signal cards do not render
the score summary, leaving operator-facing runtime merge truth hidden.

## Goal
Expose backend runtime signal score summary on Dashboard Home signal cards
without changing runtime decision logic or API contracts.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/i18n/namespaces/dashboard-home.*.ts`
- `apps/web/src/i18n/translations.ts`
- `docs/modules/web-dashboard-home.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: operators can see the backend score balance behind
  latest signal context instead of only the direction badge.
- Expected product or reliability outcome: Dashboard Home reflects runtime
  merge score truth already produced by backend.
- How success will be observed: focused tests, i18n audit, typecheck, lint,
  guardrails, build, and rendered `/dashboard` smoke pass.
- Post-launch learning needed: no

## Deliverable For This Stage
Render a compact localized LONG/SHORT score summary when
`lastSignalScoreSummary` exists on a signal card.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- do not change backend runtime behavior
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add localized Dashboard Home labels for signal score summary.
2. Pass a locale-aware score formatter from `HomeLiveWidgets` to
   `RuntimeSignalsSection`.
3. Render score summary only when backend score data exists.
4. Add focused component test coverage.
5. Run relevant validation and rendered `/dashboard` smoke.
6. Update task, module docs, project state, task board, and next-commit queue.

## Acceptance Criteria
- [ ] Dashboard Home signal cards render backend long/short scores when present.
- [ ] Cards without `lastSignalScoreSummary` do not render misleading default
  scores.
- [ ] Copy is route-owned under `dashboard.home.runtime.*`.
- [ ] Validation evidence is captured before completion.

## Definition of Done
- [ ] `DEFINITION_OF_DONE.md` reviewed for applicable expectations.
- [ ] Focused web tests pass.
- [ ] Route-reachable i18n audit passes.
- [ ] Web typecheck, lint, guardrails, build, and `git diff --check` pass.
- [ ] Rendered `/dashboard` smoke passes or a tool limitation is documented.
- [ ] Source-of-truth docs and context are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - PASS `pnpm.cmd --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx --run` (`3/3`)
  - PASS `pnpm.cmd i18n:audit:route-reachable:web` (`findings=0`)
  - PASS `pnpm.cmd --filter web run typecheck`
  - PASS `pnpm.cmd --filter web run lint`
  - PASS `pnpm.cmd run quality:guardrails`
  - PASS `git diff --check`
  - PASS `pnpm.cmd run build`
- Manual checks: PASS authenticated `/dashboard` rendered smoke with reload
  and account-menu interaction.
- Screenshots/logs: PASS `.codex/v1ui34-dashboard-smoke-refined.png` retained
  locally; dev logs retained under `.codex/tmp-v1ui34-*.log`.
- High-risk checks: no money-moving behavior changed; read-only runtime
  diagnostics display only.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/modules/web-dashboard-home.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: module note updated

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing Dashboard Home runtime signal cards
- Canonical visual target: existing `/dashboard` signal card layout
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing signal card metadata rows
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: none for this compact diagnostics row
- Required states: empty | success
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: score row is text-only and does not add interactive
  focus targets.
- Parity evidence: Backend `lastSignalScoreSummary` is now rendered by
  Dashboard Home signal cards when present.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not applicable
- Rollback note: revert the UI score-summary display commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API exposes `lastSignalScoreSummary`, but Dashboard Home signal cards
  hide it.
- Gaps: runtime merge score truth is typed but not visible to operators.
- Inconsistencies: runtime signal merge contract records directional score
  audit requirements, while the primary dashboard omits the read-model score.
- Architecture constraints: selected-bot runtime data stays strict and
  fail-closed; configured-only context must remain distinguishable.

### 2. Select One Priority Task
- Selected task: render signal score summary on Dashboard Home signal cards.
- Priority rationale: small backend-to-web parity slice with direct operator
  diagnostics value.
- Why other candidates were deferred: manual-order and runtime graph checks
  already have stronger coverage; broader UI polish should remain separate.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: render score row only when backend score summary exists.
- Edge cases: missing score summary renders nothing; non-integer scores use
  locale formatting with up to two decimals.

### 4. Execute Implementation
- Implementation notes: added localized score labels, passed a locale-aware
  score formatter from `HomeLiveWidgets`, rendered the score row only when the
  backend summary exists, and added focused positive/absent coverage.

### 5. Verify and Test
- Validation performed: focused tests, i18n audit, Web typecheck, Web lint,
  repository guardrails, `git diff --check`, full build, and rendered
  `/dashboard` smoke.
- Result: PASS

### 6. Self-Review
- Simpler option considered: expose raw JSON; rejected because operator UI
  needs compact, localized text.
- Technical debt introduced: no
- Scalability assessment: future score fields can extend the same metadata row
  without changing runtime data flow.
- Refinements made: ensured missing backend score summary renders no row, so
  the UI does not invent score truth.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-dashboard-home.md`,
  `docs/planning/mvp-next-commits.md`
- Context updated: `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This task is read-only UI parity. It does not change runtime merge decisions,
order execution, risk checks, or persistence.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime symbol stats read model
- Endpoint and client contract match: yes, Web type already includes
  `lastSignalScoreSummary`
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: yes, rendered smoke reloaded `/dashboard`
  after authentication before interaction.
- Regression check performed: yes, focused tests and full build passed.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard runtime operator.
- Existing workaround or pain: score summary exists only in backend/read model,
  not on the primary runtime dashboard.
- Smallest useful slice: render read-only long/short score summary on signal
  cards.
- Success metric or signal: score summary appears when backend payload carries
  it and no misleading scores appear when absent.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: inspect selected-bot runtime signal cards on
  `/dashboard`.
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: rendered smoke console/page error capture
- Smoke command or manual smoke: PASS bundled Node/Playwright authenticated
  `/dashboard` smoke.
- Rollback or disable path: revert commit

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: non-sensitive runtime diagnostics score metadata.
- Trust boundaries: no boundary change.
- Permission or ownership checks: no change.
- Abuse cases: not applicable.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: missing score summary renders no score row.
- Residual risk: low.

## Result Report

- Task summary: Dashboard Home signal cards now render backend
  `lastSignalScoreSummary` long/short scores when present.
- Files changed:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSignalsSection.test.tsx`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/i18n/namespaces/dashboard-home.en.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pl.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.pt.ts`
  - `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts`
  - `apps/web/src/i18n/translations.ts`
  - `docs/modules/web-dashboard-home.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused test, i18n audit, Web typecheck, Web lint, repository
  guardrails, `git diff --check`, full build, Browser plugin attempt, and
  bundled Node/Playwright rendered smoke.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue with the next tiny backend-to-web runtime parity slice.
- Decisions made: missing score summary renders no score row instead of
  defaulting to `0/0`.
