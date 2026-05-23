# Task

## Header
- ID: V1UI-13
- Title: Bot Monitoring Open Orders Source Label
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-12
- Priority: P1
- Iteration: 13
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Dashboard open orders already expose backend order `origin` as route-owned source labels. Bot monitoring receives the same backend truth through runtime positions open-order items, but its open-orders table did not render the source column.

## Goal
Make bot monitoring open orders reflect backend `origin` consistently with dashboard runtime open orders.

## Scope
- `apps/web/src/features/shared/runtimeMonitoringFormatters.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
- `apps/web/src/features/bots/components/BotsManagement.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-bots.*.ts`
- Source-of-truth docs and context files for this iteration.

## Success Signal
- User or operator problem: operators can see whether an active bot open order came from bot automation, manual action, or exchange import.
- Expected product or reliability outcome: backend order origin is visible on the bot monitoring surface without inventing a parallel contract.
- How success will be observed: tests assert shared origin suffix mapping and bot monitoring rendering for imported orders.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement and verify one UI/runtime parity slice for bot monitoring open-order source labels.

## Constraints
- Use existing runtime monitoring formatter patterns.
- Keep route-owned i18n labels in the route namespace.
- Do not change backend contracts or database schema.
- Do not introduce a temporary or duplicated origin mapping.

## Implementation Plan
1. Add a shared runtime order source label suffix helper.
2. Reuse the helper in dashboard open-order labels.
3. Render an `Origin` column in bot monitoring open orders.
4. Add route-owned bot monitoring source labels in all supported locales.
5. Add focused tests and update source-of-truth docs.

## Acceptance Criteria
- Bot monitoring open-orders table includes an `Origin` column.
- `USER`/`MANUAL`, `BOT`, and imported/unknown order origins map through one shared helper.
- Dashboard open-order source labels continue to use the same helper.
- Focused web tests, i18n audit, guardrails, and build pass.

## Definition of Done
- [x] Implementation is complete.
- [x] Tests cover the shared helper and bot monitoring rendering.
- [x] Relevant docs and context are updated.
- [x] No architecture mismatch or workaround is introduced.

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
- Tests: `pnpm --filter web run test -- src/features/shared/runtimeMonitoringFormatters.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx src/features/bots/components/BotsManagement.test.tsx --run` => `28/28 PASS`; `pnpm --filter web run typecheck` => PASS; `pnpm --filter web run lint` => PASS; `pnpm i18n:audit:route-reachable:web` => PASS (`findings=0`); `pnpm run quality:guardrails` => PASS; `pnpm --filter web run build` => PASS.
- Manual checks: authenticated rendered `/dashboard/bots` route smoke loaded without console errors using local API + web.
- Screenshots/logs: `C:\Users\wrobl\AppData\Local\Temp\soar-v1ui13-dashboard-bots.png`.
- High-risk checks: unknown/null order origins fail closed to imported label suffix; no command path changed.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`, `docs/architecture/08_operator-surfaces-and-routing.md`, `docs/modules/web-dashboard-home.md`, `docs/modules/web-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: module docs/context after verification

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing dashboard and bot monitoring table patterns
- Canonical visual target: route-owned runtime table columns
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: runtime monitoring source/provenance labels and table columns
- New shared pattern introduced: no
- Design-memory entry reused: runtime table parity
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: yes
- Remaining mismatches: no seeded runtime order row in local rendered smoke; component test covers row rendering with backend open-order `origin`.
- Required states: success, empty
- Responsive checks: desktop
- Input-mode checks: pointer
- Accessibility checks: table header remains explicit
- Parity evidence: pending

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: not required
- Rollback note: revert the UI/helper commit
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: bot monitoring receives open-order `origin` but does not render it.
- Gaps: dashboard and bots runtime order surfaces are not fully convergent.
- Inconsistencies: source labels were local to dashboard open orders.
- Architecture constraints: route-owned labels, shared runtime formatters, no backend contract change.

### 2. Select One Priority Task
- Selected task: V1UI-13 Bot Monitoring Open Orders Source Label
- Priority rationale: small vertical backend-to-web parity gap in a money-impacting runtime surface.
- Why other candidates were deferred: broader UX polish and runtime hardening remain larger slices.

### 3. Plan Implementation
- Files or surfaces to modify: shared formatter, dashboard presenter, bot monitoring table, bot i18n, tests, docs.
- Logic: source suffix maps manual/user, bot, and imported/unknown origins.
- Edge cases: unknown/null origins fail closed to imported/external source labeling.

### 4. Execute Implementation
- Implementation notes: added `runtimeOrderSourceLabelSuffix`, reused it in dashboard open-order labels, rendered bot monitoring open-order `Origin`, added route-owned source labels in EN/PL/PT/de-CH, and covered imported source rendering in `BotsManagement.test.tsx`.

### 5. Verify and Test
- Validation performed: focused tests, typecheck, lint, i18n route audit, guardrails, build, and rendered route smoke.
- Result: PASS

### 6. Self-Review
- Simpler option considered: local bot-only mapping; rejected to avoid duplicating dashboard logic.
- Technical debt introduced: no
- Scalability assessment: helper can be reused by future runtime order surfaces.
- Refinements made: narrowed accidental test fixture mode drift caught by focused tests before closure.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/web-bots.md`, `docs/modules/web-dashboard-home.md`, `docs/planning/mvp-execution-plan.md`, `docs/planning/mvp-next-commits.md`.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable

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
This is a UI/runtime parity change only. It does not alter order ownership semantics.

## Production-Grade Required Contract

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing runtime positions open-orders contract
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not changed
- Error state verified: not changed
- Refresh/restart behavior verified: not changed
- Regression check performed: focused runtime formatter/dashboard/bot monitoring tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: runtime operator supervising active bot orders
- Existing workaround or pain: operator had to infer source from elsewhere.
- Smallest useful slice: render backend order `origin` in existing open-orders table.
- Success metric or signal: visible source label and passing test.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: supervise active bot runtime state
- SLI: not applicable
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: authenticated rendered `/dashboard/bots` route smoke with local API/web and bundled Playwright.
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: operational trading metadata
- Trust boundaries: existing authenticated runtime API to web UI
- Permission or ownership checks: unchanged
- Abuse cases: source label must not hide unknown origins as bot-owned
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unknown/null origins render as imported
- Residual risk: low

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: Bot monitoring open orders now show backend `origin` source labels, and dashboard/bots share order-source suffix semantics.
- Files changed: shared runtime formatter/tests, dashboard open-order presenter, bot monitoring table/test, bot i18n namespaces, and canonical docs/context.
- How tested: focused Web tests (`28/28`), Web typecheck, Web lint, route-reachable i18n audit, repository guardrails, Web build, rendered `/dashboard/bots` route smoke.
- What is incomplete: no seeded local runtime open-order row for rendered screenshot; component test covers row-level parity.
- Next steps: continue backend-to-web runtime parity discovery for remaining V1 gaps.
- Decisions made: unknown/null order origins render as imported to avoid falsely presenting external source as bot-owned.
